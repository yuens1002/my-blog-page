import { NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';
import { createPhotoSchema } from '@/lib/types';
import { type NextRequest } from 'next/server';

const unsplash = createApi({
  accessKey: process.env.UPSPLASH_ACCESS_KEY as string,
});

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const photoId = params.get('photoid');
  try {
    if (!photoId) throw new Error('photoId is null');
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
      `[${error}] while fetching or processing image from unsplash.`
    );

    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
