'use server';

import db from '@/db/prismaDb';
import { z } from 'zod';

import { slugify } from '@/lib/utils';
import { StatusType } from '@/prisma/generated/zod';
import {
  deleteUploadedImage,
  processUploadedImage,
} from '@/lib/processImageFile';
// import { revalidatePath } from 'next/cache';
import { Category, Post } from '@prisma/client';
import PostError, { handleError } from '@/lib/processPostError';
import { FormDataObject } from '@/lib/types';
import getKindeUser from '@/lib/getKindeUser';
import { revalidatePath } from 'next/cache';

// revalidatePath('/dashboard/posts/[postId]', 'page');

const MAX_FILE_SIZE = 8000000;
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
    (file) => file.size <= MAX_FILE_SIZE && file.size > 0,
    `Max file size is ${MAX_FILE_SIZE / 1000000}MB.`
  );

export type PostPublishData = z.infer<typeof PostPublishSchema>;
export type PostDraftData = z.infer<typeof PostDraftSchema>;

const PostPublishSchema = z
  .object({
    title: z.string().min(10).max(256),
    content: z.string().min(20).max(10000),
    imageFile: imageSchema.optional(),
    imageURL: z
      .string({
        message: 'Provide an image URL',
      })
      .optional(),
    unsplashPhotoId: z
      .string({
        message:
          'A valid unsplash photo id should be 11 characters long.',
      })
      .optional(),
    categories: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).optional(),
    status: z.custom<StatusType>(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => data.imageFile || data.unsplashPhotoId || data.imageURL,
    {
      message: 'Provide an image file or an unsplash photo id.',
      path: ['imageFile', 'unsplashPhotoId', 'imageURL'],
    }
  );

const PostDraftSchema = z.object({
  title: z.string().min(10).max(256),
  content: z.string().max(10000).optional(),
  imageFile: imageSchema.optional(),
  unsplashPhotoId: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.custom<StatusType>(),
});

export type PostResult = {
  status: string;
  message: string | FormDataObject;
  data?: Post & { categories: Category[] };
};

function processFormData(
  formData: FormData
): PostPublishData | PostDraftData {
  // take out the imageFile input if none is selected
  const imageFileData = formData.get('imageFile');
  if (imageFileData && imageFileData instanceof File) {
    (!imageFileData.name || !imageFileData.size) &&
      formData.delete('imageFile');
  }

  // take out tags if none is added
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
      throw new PostError({
        type: 'text',
        message: 'Invalid post status requested. 🤔',
      });
  }

  if (!result.success) {
    console.log(
      '🚀 ~ result.error.formErrors',
      result.error.formErrors
    );
    throw new PostError({
      type: 'object',
      message: result.error.formErrors.fieldErrors,
    });
  }

  return result.data;
}

export async function createPost(formData: FormData) {
  try {
    const {
      imageFile,
      title,
      content,
      tags,
      unsplashPhotoId,
      categories,
      status,
    } = processFormData(formData);

    const imageURL = imageFile
      ? await processUploadedImage(imageFile)
      : null;

    const kindeUser = await getKindeUser();
    const dbUser = await db.user.findFirstOrThrow({
      where: { email: kindeUser.email as string },
    });

    const res = await fetch(`${process.env.API_ROOT}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        authorId: dbUser.id,
        imageURL,
        tags,
        unsplashPhotoId,
        categories,
        status,
        slug: slugify(title),
      }),
    });

    if (!res.ok) {
      throw new PostError({
        type: 'text',
        message: 'Failed to create post 😔',
      });
    }

    const { data } = (await res.json()) as {
      data: Post & { categories: Category[] };
    };

    return {
      status: 'ok',
      //prettier-ignore
      message: `Success! ${status === 'PUBLISHED' ? 'Post Published' : 'Draft Saved'} 🙌`,
      data,
    };
  } catch (error) {
    if (error instanceof PostError) {
      return handleError({
        type: error.type,
        message: error.message,
        customMessage: error.customMessage,
      });
    } else {
      console.error('createPost error:', error);
      return {
        status: 'error',
        message: 'Something went wrong while creating a post 😔',
      };
    }
  }
}

type updatePostProps = {
  postId: string;
  authorId: string;
  imageURL: string | null;
  prevStatus: StatusType;
};

export async function updatePost(
  { postId, authorId, imageURL, prevStatus }: updatePostProps,
  formData: FormData
) {
  console.log('🚀 ~ prevStatus:', prevStatus);
  console.log('🚀 ~ imageURL:', imageURL);
  console.log('🚀 ~ formData ~ before:', formData);
  try {
    const {
      imageFile,
      title,
      content,
      tags,
      unsplashPhotoId,
      categories,
      status,
    } = processFormData(formData);
    const isSameImage = !imageURL && !imageFile;

    if (imageURL) {
      /************************************************************
       * imageURL is provided only when the user either opted for
       * a new image or provided an unsplash photoId
       *
       * if imageFile is provided, process the new imageFile
       ************************************************************/
      deleteUploadedImage(imageURL);
      imageURL = null;
    }
    if (imageFile) {
      imageURL = await processUploadedImage(imageFile);
    }

    console.log('🚀 ~ isSameImage:', isSameImage);
    console.log('🚀 ~ imageURL after processing:', imageURL);

    // ensures the user is authenticated and the post belongs to the user
    const kindeUser = await getKindeUser();
    await db.user.findFirstOrThrow({
      where: { email: kindeUser.email as string },
    });

    const res = await fetch(`${process.env.API_ROOT}/post`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        authorId,
        title,
        content: content ? content : null,
        // only update imageURL if a new image is uploaded or none is chosen
        ...(!isSameImage && { imageURL }),
        tags: tags ? tags : [],
        unsplashPhotoId: unsplashPhotoId ? unsplashPhotoId : null,
        categories,
        status,
        slug: slugify(title),
        ...(status === 'PUBLISHED' && { isActive: true }),
        ...(status === 'PUBLISHED' && { publishedAt: new Date() }),
      }),
    });

    if (!res.ok) {
      throw new PostError({
        type: 'text',
        message: 'Failed to update post 😔',
      });
    }

    const { data } = (await res.json()) as {
      data: Post & { categories: Category[] };
    };

    function computeMessage() {
      if (prevStatus === 'DRAFT' && data.status === 'PUBLISHED') {
        return `Success! Draft Publish 🙌`;
      }
      if (prevStatus === 'PUBLISHED') {
        return `Success! Post Updated 👌`;
      }

      return `Success! Changes Saved 👌`;
    }

    return {
      status: 'ok',
      //prettier-ignore
      message: computeMessage(),
      data,
    };
  } catch (error) {
    if (error instanceof PostError) {
      return handleError({
        type: error.type,
        message: error.message,
        customMessage: error.customMessage,
      });
    }
    return {
      status: 'error',
      message: 'Something went wrong while updating post 😔',
    };
  }
}

export async function getPosts({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  try {
    const kindeUser = await getKindeUser();
    const res = await fetch(
      `${process.env.API_ROOT}/posts?author-email=${kindeUser.email}&take=${take}&skip=${skip}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new PostError({
        type: 'text',
        message: 'Failed to fetch posts 😔',
      });
    }

    const { data, count } = (await res.json()) as {
      data: Post[];
      count: number;
    };
    console.log('🚀 ~ const{data,count}= ~ data:', data);
    revalidatePath('/dashboard/posts', 'page');
    return {
      status: 'ok',
      message: 'Posts fetched successfully 🙌',
      data,
      count,
    };
  } catch (error) {
    if (error instanceof PostError) {
      return handleError({
        type: error.type,
        message: error.message,
        customMessage: error.customMessage,
      });
    }
    return {
      status: 'error',
      message: 'Something went wrong while fetching posts 😔',
    };
  }
}

export async function deletePost({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  try {
    const res = await fetch(`${process.env.API_ROOT}/post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        authorId,
      }),
    });

    if (!res.ok) {
      throw new PostError({
        type: 'text',
        message: 'Failed to delete post 😔',
      });
    }
    revalidatePath('/dashboard/posts', 'page');
    return {
      status: 'ok',
      message: 'Post deleted successfully 🙌',
    };
  } catch (error) {
    if (error instanceof PostError) {
      return handleError({
        type: error.type,
        message: error.message,
        customMessage: error.customMessage,
      });
    }
    return {
      status: 'error',
      message: 'Something went wrong while deleting post 😔',
    };
  }
}

export async function putPartialPost(
  postId: string,
  authorId: string,
  props: Record<string, any>
) {
  try {
    const res = await fetch(`${process.env.API_ROOT}/post`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        authorId,
        ...props,
      }),
    });

    if (!res.ok) {
      throw new PostError({
        type: 'text',
        message: 'Failed to update post 😔',
      });
    }

    const { data } = (await res.json()) as {
      data: Post & { categories: Category[] };
    };

    return {
      status: 'ok',
      //prettier-ignore
      message: `Success! post updated 🙌`,
      data,
    };
  } catch (error) {
    if (error instanceof PostError) {
      return handleError({
        type: error.type,
        message: error.message,
        customMessage: error.customMessage,
      });
    }
    return {
      status: 'error',
      message: 'Something went wrong while updating post 😔',
    };
  }
}
