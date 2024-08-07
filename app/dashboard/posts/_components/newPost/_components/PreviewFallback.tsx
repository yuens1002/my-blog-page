'use client';

import Image from 'next/image';

type PreviewFallbackProps = {
  message: string;
};

export default function PreviewFallback({
  message,
}: PreviewFallbackProps) {
  return (
    <div className="relative aspect-video my-4">
      <Image
        fill
        priority
        src={`https://dummyimage.com/16:9x1080/efefef/999999&text=${message
          .split(' ')
          .join('+')}`}
        alt={'error image: ' + message}
      />
    </div>
  );
}
