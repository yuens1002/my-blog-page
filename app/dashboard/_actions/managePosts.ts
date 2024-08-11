'use server';

import db from '@/db/prismaDb';
import { record, z } from 'zod';
import fs from 'fs/promises';
import fullFs from 'fs';
import path from 'path';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { slugify } from '@/lib/utils';

// const fileSchema = z.instanceof(File, { message: 'required' });

const MAX_FILE_SIZE = 1000000;
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
    'only .jpg, .jpeg, .png and .webp files are accepted.'
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE && file.size > 0,
    `Max file size is 5MB.`
  )
  .optional();

const { getUser } = getKindeServerSession();

// const imageRequiredSchema = imageSchema.refine(
//   (file) => file.size > 0,
//   'required'
// );

const createPostSchema = z
  .object({
    title: z.string().min(1).max(20),
    content: z.string().min(1).max(10000),
    publishedAt: z.date().optional(),
    isPublished: z.boolean().optional(),
    // doing the size check here because in edit, an image is optional
    imageFile: imageSchema,
    categories: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).optional(),
    unsplashPhotoId: z.string().optional(),
  })
  .refine(
    (data) => data.imageFile || data.unsplashPhotoId,
    'Either upload an image or provide an unsplash photo id.'
  );

export type CreatePostData = z.infer<typeof createPostSchema>;

export async function createPost(prevState: any, formData: FormData) {
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
  const result = createPostSchema.safeParse(formDataObject);

  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return { message: 'invalid form data' };
  }

  const {
    imageFile,
    title,
    content,
    categories,
    unsplashPhotoId,
    isPublished,
    tags,
  } = result.data as CreatePostData;
  const __projectRoot = process.cwd();

  function setImageFileName(fileName: string): string {
    const ext = path.extname(fileName);
    return `${crypto.randomUUID()}-${fileName.slice(0, 8)}${ext}`;
  }

  function setNextImagePath(fileName: string): string {
    const name = setImageFileName(fileName);
    return `/uploadedImage/${name}`;
  }

  if (imageFile) {
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

  const user = await getUser();
  if (user?.email) {
    const dbUser = await db.user.findFirst({
      where: { email: user.email },
    });
    if (dbUser) {
      try {
        await db.post.create({
          data: {
            title,
            content,
            ...(imageFile && {
              imageURL: setNextImagePath(imageFile.name),
            }),
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
        return { message: 'post created' };
      } catch (error) {
        if (error instanceof Error) {
          return {
            message: 'something went wrong while creating post',
          };
        }
      }
    }
  }
}
