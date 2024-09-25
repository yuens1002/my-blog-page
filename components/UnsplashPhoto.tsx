'use server';

import { getUnsplashPhotoWithCache } from '@/DAL/unsplash';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type UnsplashPhotoProps = {
  photoId: string;
} & React.HTMLProps<HTMLDivElement>;

export default async function UnsplashPhoto({
  photoId,
  className,
}: UnsplashPhotoProps) {
  // refactor this to confirm Response (!ok) type construction
  const res = await getUnsplashPhotoWithCache(photoId);
  if (!res.ok) {
    return (
      <div className={cn('relative aspect-video py-4', className)}>
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
      <div
        className={cn(
          'w-full aspect-video pb-2 overflow-hidden',
          className
        )}
      >
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
          className="font-semibold hover:underline"
          href={`https://unsplash.com/@${user.username}?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          {user.name}
        </a>{' '}
        on{' '}
        <a
          className="font-semibold hover:underline"
          href={`https://unsplash.com/?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          Unsplash
        </a>
      </div>
    </>
  );
}
