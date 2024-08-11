'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { type ChangeEvent, useState, useRef } from 'react';
import ImageWindow from './ImageWindow';

/* eslint-disable @next/next/no-img-element */

export default function FileUpload() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          //ensure only text is being passed
          const resultText = event.target.result.toString();
          setImage(resultText);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div>
      <Label htmlFor="imageFile" className="sr-only">
        Image Upload
      </Label>
      <div className="flex w-full items-center gap-0 rounded-tl-none">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className={cn(
            'pt-3 cursor-pointer rounded-b-none rounded-tl-none',
            image && 'rounded-r-none'
          )}
          id="imageFile"
          name="imageFile"
          required
        />
        {image && (
          <Button
            className="p-6 rounded-b-none rounded-l-none"
            onClick={() => {
              setImage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            Undo
          </Button>
        )}
      </div>
      <ImageWindow showBorder={!image}>
        {image ? (
          <img
            alt="preview image"
            src={image}
            className="object-cover w-full"
          />
        ) : (
          <ImageIcon size="2rem" aria-hidden />
        )}
      </ImageWindow>
    </div>
  );
}
