'use server';

import db from '@/db/prismaDb';
import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { slugify } from '@/lib/utils';
import {
  PostWithRelations,
  StatusType,
} from '@/prisma/generated/zod';
import {
  processUploadedImage,
  setNextImagePath,
} from '@/lib/processImageFile';
import { revalidatePath } from 'next/cache';
import { Post } from '@prisma/client';

revalidatePath('/dashboard/posts/edit/[postId]', 'page');

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

export type PostPublishData = z.infer<typeof PostPublishSchema>;
export type PostDraftData = z.infer<typeof PostDraftSchema>;

const PostPublishSchema = z
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

const PostDraftSchema = z.object({
  title: z.string().min(10).max(256),
  content: z.string().max(10000).optional(),
  imageFile: imageSchema.optional(),
  unsplashPhotoId: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type FormDataObject = Record<
  string,
  string | File | (File | string)[]
>;

export type PostResult = {
  status: string;
  message: string | FormDataObject;
  data?: Post;
};

async function processFormData(
  formData: FormData
): Promise<
  (PostPublishData & PostDraftData) | Omit<PostResult, 'data'>
> {
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
  const formDataObject: FormDataObject = {};

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
  console.log('🚀 ~ createPost ~ statusType:', statusType);
  let result;
  switch (statusType) {
    case 'PUBLISHED':
      result = PostPublishSchema.safeParse(formDataObject);
      break;
    case 'DRAFT':
      result = PostDraftSchema.safeParse(formDataObject);
      break;
    default:
      console.error('Invalid status type');
      return {
        status: 'error',
        message: 'Invalid post status requested. 🤔',
      };
  }

  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return {
      status: 'error',
      message: result.error.formErrors.fieldErrors,
    };
  }

  result.data.imageFile &&
    (await processUploadedImage(result.data.imageFile));
  return result.data as PostPublishData;
}

export async function createPost(formData: FormData) {
  try {
    const formDataResult = await processFormData(formData);
    if (formDataResult.status === 'error') {
      return {
        status: formDataResult.status,
        message: formDataResult.message,
      };
    }

    const {
      title,
      content,
      imageFile,
      unsplashPhotoId,
      categories,
      tags,
      status,
    } = formDataResult as PostPublishData;

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        imageURL: imageFile ? setNextImagePath(imageFile.name) : null,
        tags,
        unsplashPhotoId,
        categories,
        status,
        slug: slugify(title),
      }),
    });

    if (!res.ok) {
      throw Error();
    }

    const data = await res.json();

    return {
      status: 'ok',
      //prettier-ignore
      message: `Success! ${status === 'PUBLISHED' ? 'Post Published' : 'Draft Saved'} 🙌`,
      data,
    };
  } catch (error) {
    console.error('🚀 ~ createPost ~ error:', error);
    return {
      status: 'error',
      message: 'Something went wrong while creating a post 😔',
    };
  }
}

export async function updatePost(
  { postId, authorId }: { postId: string; authorId: string },
  formData: FormData
) {
  try {
    const result = await processFormData(formData);
    if (result.status === 'error') {
      return { status: result.status, message: result.message };
    }
    const {
      title,
      content,
      imageFile,
      unsplashPhotoId,
      categories,
      tags,
    } = result as PostDraftData;

    // ensures the user is authenticated and the post belongs to the user
    const kindeUser = await getUser();
    if (!kindeUser) {
      return {
        status: 'error',
        message: 'User not found',
      };
    }
    await db.user.findFirstOrThrow({
      where: { email: kindeUser.email as string },
    });

    const UpdatedPost = await db.post.update({
      where: { id: postId, AND: { authorId } },
      data: {
        title,
        content: content ? content : null,
        //prettier-ignore
        imageURL: imageFile ? setNextImagePath(imageFile.name) : null,
        slug: slugify(title),
        tags: tags ? tags : [],
        unsplashPhotoId: unsplashPhotoId ? unsplashPhotoId : null,
        categories: categories && {
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
      },
    });
    return {
      status: 'ok',
      //prettier-ignore
      message: `Success! Draft Saved 👌`,
      data: UpdatedPost,
    };
  } catch (error) {
    console.error('🚀 ~ updatePost ~ error:', error);
    return {
      status: 'error',
      message: 'Something went wrong while updating the post 😔',
    };
  }
}
