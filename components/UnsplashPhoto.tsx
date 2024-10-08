'use server';

import { getUnsplashPhotoWithCache } from '@/DAL/unsplash';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import type { UnsplashPhoto as UnsplashPhotoType } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type UnsplashPhotoProps = {
  photoId: string;
  paddingOnCreditPlacement?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export default async function UnsplashPhoto({
  photoId,
  paddingOnCreditPlacement = false,
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
  } = (await res.json()) as { data: UnsplashPhotoType };
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
          className={cn(
            'object-cover',
            width > height ? 'w-full' : 'aspect-3/4'
          )}
          width={width}
          height={height}
          src={urls.regular}
          alt="post cover image"
          placeholder="blur"
          blurDataURL={blurHashToDataURL(blur_hash)}
        />
      </div>
      <div
        className={cn(
          'text-xs text-right',
          paddingOnCreditPlacement && 'pr-4'
        )}
      >
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
