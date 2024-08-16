'use server';

import db from '@/db/prismaDb';
import { z } from 'zod';
import fs from 'fs/promises';
import fullFs from 'fs';
import path from 'path';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { slugify } from '@/lib/utils';
import { StatusType } from '@/prisma/generated/zod';

const MAX_FILE_SIZE = 800000;
console.log('🚀 ~ MAX_FILE_SIZE:', MAX_FILE_SIZE);
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const imageSchema = z
  .custom<File>()
  .refine(
    // check if file has data (and) it'a image
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png and .webp files are accepted.'
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `Max file size is ${MAX_FILE_SIZE / 100000}MB.`
  );

const { getUser } = getKindeServerSession();

export type CreatePostData = z.infer<typeof createPostSchema>;

const createPostSchema = z
  .object({
    title: z.string().min(10).max(256),
    content: z.string().min(20).max(10000),
    publishedAt: z.date().optional(),
    isPublished: z.coerce.boolean().optional(),
    imageFile: imageSchema.optional(),
    unsplashPhotoId: z.string().optional(),
    categories: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).optional(),
    status: z.custom<StatusType>(),
  })
  .refine(
    (data) => data.imageFile || data.unsplashPhotoId,
    'Upload an image or provide an unsplash photo id.'
  );

export type CreateDraftData = z.infer<typeof createDraftSchema>;

const createDraftSchema = z.object({
  title: z.string().min(10).max(256),
  content: z.string().max(10000).optional(),
  imageFile: imageSchema.optional(),
  unsplashPhotoId: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function createPost(formData: FormData) {
  // take out the imageFile input if none is selected
  const imageFileData = formData.get('imageFile');
  if (imageFileData && imageFileData instanceof File) {
    (!imageFileData.name || !imageFileData.size) &&
      formData.delete('imageFile');
  }

  // take out the imageFile input if none is selected
  const tagsData = formData.getAll('tags');
  if (tagsData.length === 0) {
    formData.delete('tags');
  }

  console.log('🚀 ~ createPost ~ formData ~ after:', formData);
  //prettier-ignore
  const formDataObject: Record<string, string | File | (File | string)[]> = {};

  for (const formDataEntry of formData) {
    const [key, value] = formDataEntry;
    if (Object.keys(formDataObject).includes(key)) {
      if (Array.isArray(formDataObject[key])) {
        formDataObject[key].push(value);
      }
    } else {
      // categories and tags are processed using prismaQL as an array
      key === 'categories' || key === 'tags'
        ? (formDataObject[key] = [value])
        : (formDataObject[key] = value);
    }
  }
  const statusType = formData.get('status');
  console.error('🚀 ~ createPost ~ statusType:', statusType);
  let result;
  switch (statusType) {
    case 'PUBLISHED':
      result = createPostSchema.safeParse(formDataObject);
      break;
    case 'DRAFT':
      result = createDraftSchema.safeParse(formDataObject);
      break;
    default:
      console.error('Invalid status type');
      return {
        status: 'error',
        message: 'An unknown action invoked while creating a post 🤔',
      };
  }

  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return {
      status: 'error',
      message: result.error.formErrors.fieldErrors,
    };
  }

  const {
    imageFile,
    title,
    content,
    categories,
    unsplashPhotoId,
    isPublished,
    tags,
    status,
  } = result.data as CreatePostData;

  imageFile && (await processUploadedImage(imageFile));

  function setImageFileName(fileName: string): string {
    const ext = path.extname(fileName);
    return `${crypto.randomUUID()}-${fileName.slice(0, 8)}${ext}`;
  }

  function setNextImagePath(fileName: string): string {
    const name = setImageFileName(fileName);
    return `/uploadedImage/${name}`;
  }

  async function processUploadedImage(imageFile: File) {
    const __projectRoot = process.cwd();
    if (
      !fullFs.existsSync(`${__projectRoot}/public/uploadedImages/`)
    ) {
      fs.mkdir(`${__projectRoot}/public/uploadedImages`);
    }
    const fsImagePath = `${__projectRoot}/public/uploadedImages/${setImageFileName(
      imageFile.name
    )}`;
    await fs.writeFile(
      fsImagePath,
      Buffer.from(await imageFile.arrayBuffer())
    );
  }

  try {
    const user = await getUser();
    if (!user) {
      return {
        status: 'error',
        message: 'User not found',
      };
    }
    const dbUser = await db.user.findFirstOrThrow({
      where: { email: user.email as string },
    });
    const createdData = await db.post.create({
      data: {
        title,
        ...(content && { content }),
        ...(status && { status }),
        //prettier-ignore
        ...(imageFile && {imageURL: setNextImagePath(imageFile.name)}),
        authorId: dbUser.id,
        slug: slugify(title),
        ...(tags && { tags }),
        ...(isPublished && { isPublished: true }),
        ...(unsplashPhotoId && { unsplashPhotoId }),
        ...(categories && {
          categories: {
            connectOrCreate: [
              ...categories.map((category) => ({
                where: {
                  name: category,
                },
                create: {
                  name: category,
                  slug: slugify(category),
                },
              })),
            ],
          },
        }),
      },
    });
    console.log('🚀 ~ createPost ~ createdData:', createdData);
    return {
      status: 'ok',
      //prettier-ignore
      message: `Success! ${status === 'PUBLISHED' ? 'Post Published' : 'Draft Saved'} 🙌`,
      data: createdData,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 'error',
        message: 'Something went wrong while creating a post 😔',
      };
    }
  }
}

export async function updatePost(postId: string, formData: FormData) {
  return {
    status: 'ok',
    message: 'Post updated successfully',
    data: { postId, formData },
  };
}
