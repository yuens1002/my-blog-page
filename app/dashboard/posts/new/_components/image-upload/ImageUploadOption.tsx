'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import ImageWindow from './ImageWindow';
import { useNewPostContext } from '@/app/dashboard/_hooks/useNewPostContext';

/* eslint-disable @next/next/no-img-element */
export default function FileUpload() {
  const [{ image }, dispatch] = useNewPostContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          //ensure only text is being passed
          const resultText = event.target.result.toString();
          dispatch({ type: 'SET_IMAGE', payload: resultText });
          // clears an unconfirmed photoId if a user has entered it
          dispatch({ type: 'SET_PHOTO_ID', payload: '' });
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
          id="imageFile"
          name="imageFile"
          className={cn(
            'pt-3 cursor-pointer rounded-b-none rounded-tl-none',
            image &&
              'rounded-r-none pointer-events-none cursor-default'
          )}
          type="file"
          accept="image/*"
          tabIndex={image ? -1 : 0}
          onChange={onImageChange}
        />
        {image && (
          <Button
            className="p-6 rounded-b-none rounded-l-none"
            onClick={() => {
              dispatch({ type: 'SET_IMAGE', payload: null });
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
