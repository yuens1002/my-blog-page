'use server';

import { getUnsplashPhotoWithCache } from '@/app/api/unsplash';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import Image from 'next/image';
import { NextResponse } from 'next/server';

type UnsplashPhotoCompProps = {
  photoId: string;
};

export default async function UnsplashPhotoComp({
  photoId,
}: UnsplashPhotoCompProps) {
  // refactor this to confirm Response (!ok) type construction
  const result = await getUnsplashPhotoWithCache(photoId);
  if (result instanceof NextResponse) {
    const error: { status: string; message: string } =
      await result.json();
    return (
      <div className="relative aspect-video my-4">
        <Image
          fill
          priority
          src={`https://dummyimage.com/16:9x1080/efefef/999999&text=${error.message
            .split(' ')
            .join('+')}`}
          alt={'error image: ' + error.message}
        />
      </div>
    );
  }

  const { user, urls, blur_hash, width, height } = result;
  return (
    <>
      <div className="w-full aspect-video my-4 overflow-hidden">
        <Image
          priority
          style={{ objectFit: 'cover' }}
          width={width}
          height={height}
          src={urls.regular}
          alt="post cover image"
          placeholder="blur"
          blurDataURL={blurHashToDataURL(blur_hash)}
        />
      </div>
      <div className="text-xs text-right">
        Photo by{' '}
        <a
          className="font-semibold hover:underline hover:underline-offset-4 hover:transition-all"
          href={`https://unsplash.com/@${user.username}?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          {user.name}
        </a>{' '}
        on{' '}
        <a
          className="font-semibold hover:underline hover:underline-offset-4 hover:transition-all"
          href={`https://unsplash.com/?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          Unsplash
        </a>
      </div>
    </>
  );
}
