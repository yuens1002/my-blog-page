'use client';

import { Label } from '@/components/ui/label';

import { useState } from 'react';
import ImageUploadOption from './ImageUploadOption';
import UnsplashOption from './UnsplashOption';
import { Button } from '@/components/ui/button';

export default function NewPostImageUploadTabs() {
  const [imageOption, setImageOption] = useState<
    'upload' | 'upsplash'
  >('upload');

  return (
    <div className="space-y-2">
      <Label className="text-lg block">Choose an Image Option*</Label>
      <div className="inline-block border-[1px] border-slate-300 p-2 rounded-sm">
        <Button
          className="rounded-r-none"
          size="sm"
          disabled={imageOption === 'upload'}
          onClick={(e) => {
            e.preventDefault();
            setImageOption('upload');
          }}
        >
          Image Upload
        </Button>
        <Button
          className="rounded-l-none"
          size="sm"
          disabled={imageOption === 'upsplash'}
          onClick={(e) => {
            e.preventDefault();
            setImageOption('upsplash');
          }}
        >
          Unsplash
        </Button>
      </div>

      {imageOption === 'upload' ? (
        <ImageUploadOption />
      ) : (
        <UnsplashOption />
      )}
    </div>
  );
}
