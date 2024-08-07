'use server';

import { NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';
import { createPhotoSchema } from '@/lib/types';
import { cache } from 'react';

const unsplash = createApi({
  accessKey: process.env.UPSPLASH_ACCESS_KEY as string,
});

async function getUnsplashPhoto(photoId: string) {
  try {
    const result = await unsplash.photos.get(
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
      const { data } = parsedResult;
      return NextResponse.json(
        { data },
        { status: 200, statusText: 'ok' }
      );
    }
  } catch (error) {
    console.error(
      `[${error}] while fetching or processing image from upsplash.`
    );
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}

export const getUnsplashPhotoWithCache = cache(getUnsplashPhoto);
