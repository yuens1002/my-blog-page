'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import upsplash, { createPhotoSchema } from '@/app/api/unsplash';
import type { UpsplashPhoto } from '@/app/api/unsplash';

type UpsplashPhotoPropType = {
  photoId: string;
};

type PhotoCompPropType = {
  photo: UpsplashPhoto;
};

export default function UpsplashPhoto({
  photoId,
}: UpsplashPhotoPropType) {
  const [data, setPhotosResponse] = useState<UpsplashPhoto | null>(
    null
  );

  useEffect(() => {
    upsplash.photos
      .get({ photoId }, { headers: { 'Accept-Version': 'v1' } })
      .then((response: unknown) => {
        const result = createPhotoSchema.safeParse(response);
        if (!result.success) {
          throw new Error(result.error.toString());
        }

        const { data } = result;
        setPhotosResponse(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [photoId]);

  if (data === null) {
    return <div>Loading...</div>;
  } else {
    return <PhotoComp photo={data} />;
  }
}

function PhotoComp({ photo }: PhotoCompPropType) {
  const { user, urls } = photo;

  return (
    <div className="relative">
      <div className="w-full aspect-video">
        <Image src={urls.regular} fill alt="cover image"></Image>
      </div>
      <div className="text-xs">
        Photo by{' '}
        <a
          href={`https://unsplash.com/@${user.username}?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          {user.name}
        </a>{' '}
        on{' '}
        <a
          href={`https://unsplash.com/?utm_source=${process.env.UPSPLASH_APP_ID}&utm_medium=referral target="_blank rel="nofollow"`}
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
