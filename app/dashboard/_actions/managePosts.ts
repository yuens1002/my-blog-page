'use server';

import db from '@/db/prismaDb';
import { string, undefined, z } from 'zod';
import fs from 'fs/promises';
import fullFs from 'fs';
import path from 'path';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

// const fileSchema = z.instanceof(File, { message: 'required' });

const MAX_FILE_SIZE = 500000;
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
    (file) => file.size <= MAX_FILE_SIZE,
    `Max file size is 5MB.`
  );

const { getUser } = getKindeServerSession();

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1).max(10000),
  publishedAt: z.date().optional(),
  isPublished: z.boolean().optional(),
  // doing the size check here because in edit, an image is optional
  imageFile: imageSchema.refine((file) => file.size > 0, 'required'),
  categories: z.array(z.string()).nonempty(),
});

export async function CreatePost(formData: FormData) {
  const result = createPostSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { data } = result;

  const __projectRoot = process.cwd();

  function setImageFileName(fileName: string): string {
    const ext = path.extname(fileName);
    return `${crypto.randomUUID()}-${fileName.slice(0, 8)}${ext}`;
  }

  function setNextImagePath(fileName: string) {
    const name = setImageFileName(fileName);
    return `/uploadedImage/${name}`;
  }

  if (!fullFs.existsSync(`${__projectRoot}/public/uploadedImages/`)) {
    fs.mkdir(`${__projectRoot}/public/uploadedImages`);
  }
  const fsImagePath = `${__projectRoot}/public/uploadedImages/${setImageFileName(
    data.imageFile.name
  )}`;
  await fs.writeFile(
    fsImagePath,
    Buffer.from(await data.imageFile.arrayBuffer())
  );

  const user = await getUser();
  if (user?.email) {
    const dbUser = await db.user.findFirst({
      where: { email: user.email },
    });
    if (dbUser) {
      try {
        await db.post.create({
          data: {
            title: data.title,
            content: data.content,
            imageURL: setNextImagePath(data.imageFile.name),
            authorId: dbUser.id,
            slug: data.title.split(' ').join('-'),
            isPublished: data.isPublished ?? data.isPublished,
            categories: {
              connectOrCreate: [
                ...data.categories.map((category) => ({
                  where: {
                    name: category,
                  },
                  create: {
                    name: category,
                    slug: category.split(' ').join('-'),
                  },
                })),
              ],
            },
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json({
            status: 500,
            statusText: error.message,
          });
        }
      }
    }
  }
}
