import {
  PostWithRelations,
  StatusType,
} from '@/prisma/generated/zod';
import { Category, Post } from '@prisma/client';
import { z } from 'zod';

export type dummyPost = {
  title: string;
  reactions: {
    likes: string;
    dislikes: string;
  };
  body: string;
  tags: string[];
  views: number;
  categories: string[];
};

export type UseFetchCategoryPayload = [
  data: Category[] | null,
  error: string | null,
  isPending: boolean
];

export const createPhotoSchema = z.object({
  id: z.string(),
  width: z.number(),
  height: z.number(),
  blur_hash: z.string(),
  urls: z.object({
    full: z.string(),
    regular: z.string(),
    raw: z.string(),
    small: z.string(),
  }),
  color: z.string().or(z.null()),
  user: z.object({
    username: z.string(),
    name: z.string(),
  }),
});

export type UnsplashPhoto = z.infer<typeof createPhotoSchema>;

export type InitialFormState = {
  message: string | Record<string, string[]>;
  status: string;
  data?: Post;
};

export type FormSubmitAction = 'PUBLISH' | 'DRAFT' | 'UPDATE';

export type PostRequestBody = {
  title: string;
  content: string;
  imageURL: string | null;
  tags: string[];
  unsplashPhotoId: string | null;
  categories: string[];
  status: StatusType;
  slug: string;
};
