import { UnsplashPhoto } from '@/lib/types';
import { blurHashToDataURL } from '@/lib/blurHashBase64';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type UnsplashPhotoPreviewProps = {
  photo: Pick<
    UnsplashPhoto,
    'blur_hash' | 'urls' | 'width' | 'height'
  >;
};

export default function UnsplashPhotoPreview({
  photo,
}: UnsplashPhotoPreviewProps) {
  const { urls, blur_hash, width, height } = photo;
  return (
    <Image
      priority
      fill
      src={urls.regular}
      alt="cover image preview"
      placeholder="blur"
      blurDataURL={blurHashToDataURL(blur_hash)}
      className={cn(
        'object-cover',
        width > height ? 'w-full' : 'aspect-4/3'
      )}
    />
  );
}
