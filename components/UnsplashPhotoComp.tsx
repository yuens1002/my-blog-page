'use server';

import { getUnsplashPhotoWithCache } from '@/app/api/unsplash';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import Image from 'next/image';

type UnsplashPhotoCompProps = {
  photoId: string;
};

export default async function UnsplashPhotoComp({
  photoId,
}: UnsplashPhotoCompProps) {
  // refactor this to confirm Response (!ok) type construction
  const res = await getUnsplashPhotoWithCache(photoId);
  console.log('🚀 ~ getUnsplashPhotoWithCache:', res);
  if (!res.ok) {
    return (
      <div className="relative aspect-video my-4">
        <Image
          fill
          priority
          src={`https://dummyimage.com/16:9x1080/efefef/999999&text=${res.statusText
            .split(' ')
            .join('+')}`}
          alt={'error image: ' + res.statusText}
        />
      </div>
    );
  }

  const {
    data: { user, urls, blur_hash, width, height },
  } = await res.json();
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
      <div className="text-xs text-right pr-4">
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
