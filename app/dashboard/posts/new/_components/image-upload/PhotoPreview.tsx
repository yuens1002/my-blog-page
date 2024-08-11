import { UnsplashPhoto } from '@/lib/types';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

type PhotoPreviewProps = {
  photo: Pick<
    UnsplashPhoto,
    'blur_hash' | 'urls' | 'width' | 'height'
  >;
};

export default function PhotoPreview({ photo }: PhotoPreviewProps) {
  const { urls, blur_hash, width, height } = photo;
  return (
    <Image
      priority
      fill
      src={urls.regular}
      alt="unsplash image preview"
      placeholder="blur"
      blurDataURL={blurHashToDataURL(blur_hash)}
      className={cn(
        'object-cover',
        width > height ? 'w-full' : 'aspect-9/16'
      )}
    />
  );
}
