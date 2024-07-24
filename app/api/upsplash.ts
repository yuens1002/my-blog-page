import { NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';
import { z } from 'zod';

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

export type Photo = z.infer<typeof createPhotoSchema>;

const upsplash = createApi({
  accessKey: process.env.UPSPLASH_ACCESS_KEY as string,
});

export async function getUpsplashPhoto(photoId: string) {
  try {
    const result = await upsplash.photos.get(
      { photoId },
      { headers: { 'Accept-Version': 'v1' } }
    );
    if (result.errors) {
      throw new Error(result.errors[0]);
    } else {
      const parsedResult = createPhotoSchema.safeParse(
        result.response
      );
      if (!parsedResult.success) {
        throw new Error(parsedResult.error.toString());
      }
      console.log(parsedResult.data);
      return parsedResult.data;
    }
  } catch (error) {
    console.error(
      `[${error}] while fetching or processing image from upsplash.`
    );
    return NextResponse.json({
      message: 'no image found',
    });
  }
}

export default upsplash;
