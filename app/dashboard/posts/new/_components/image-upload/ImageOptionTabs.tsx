'use client';

import { Label } from '@/components/ui/label';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

type NewPostImageUploadTabsProps = {
  children: React.ReactNode;
  useImageOption: [
    string,
    Dispatch<SetStateAction<'upload' | 'upsplash'>>
  ];
};

export default function NewPostImageUploadTabs({
  children,
  useImageOption: [imageOption, setImageOption],
}: NewPostImageUploadTabsProps) {
  return (
    <div>
      <Label
        htmlFor={
          imageOption === 'upload' ? 'imageFile' : 'unsplashPhotoId'
        }
        className="text-lg block pb-2"
      >
        Choose an Image Option*
      </Label>
      <div className="inline-block border border-primary/20 p-2 rounded-t-sm rounded-b-none border-b-0">
        <Button
          type="button"
          className="rounded-r-none"
          size="sm"
          disabled={imageOption === 'upload'}
          onClick={() => {
            setImageOption('upload');
          }}
        >
          Image Upload
        </Button>
        <Button
          type="button"
          className="rounded-l-none"
          size="sm"
          disabled={imageOption === 'upsplash'}
          onClick={() => {
            setImageOption('upsplash');
          }}
        >
          Unsplash
        </Button>
      </div>
      {children}
    </div>
  );
}
