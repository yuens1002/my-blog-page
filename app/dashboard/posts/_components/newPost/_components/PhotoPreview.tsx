import { UnsplashPhoto } from '@/lib/types';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

export default function PhotoPreview({
  width,
  height,
  urls,
  blur_hash,
}: Pick<UnsplashPhoto, 'width' | 'height' | 'blur_hash' | 'urls'>) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-b-sm',
        width > height ? 'max-h-80' : 'max-h-120'
      )}
    >
      <Image
        priority
        style={{ objectFit: 'contain' }}
        width={width}
        height={height}
        src={urls.small}
        alt="unsplash image preview"
        placeholder="blur"
        blurDataURL={blurHashToDataURL(blur_hash)}
      />
    </div>
  );
}
