import { z } from 'zod';
import { createPhotoSchema } from '@/lib/types';

const addTagInput = z.string().default('');
const createCategoryInput = z.string().default('');
const MAX_FILE_SIZE = 8000000;
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

export const postFormSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'title must have at least 4 characters' })
    .describe('4 char min')
    .default(''),
  excerpt: z
    .string()
    .min(16, { message: 'excerpt must have at least 16 characters' })
    .max(200, {
      message: 'excerpt must have at most 200 characters',
    })
    .default(''),
  content: z
    .string()
    .min(16, {
      message: 'content must have at least 16 characters',
    })
    .max(1000, {
      message: 'content must have at most 1000 characters',
    })
    .default(''),
  featured: z.boolean().default(false),
  selectedCategories: z.array(z.string()).default([]),
  createdCategories: z.array(createCategoryInput).default([]),
  createCategoryInput: createCategoryInput,
  addedTags: z.array(addTagInput).default([]),
  addTagInput: addTagInput,
  imageOption: z.enum(['upload', 'unsplash']).default('upload'),
  photoId: z.string().default(''),
  photoProps: createPhotoSchema.nullable().default(null),
  imageName: z.string().nullable().default(null),
  imageFile: imageSchema.optional().nullable().default(null),
  imageURL: z.string().default(''),
});

export type PostFormState = z.infer<typeof postFormSchema>;
