'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { type ChangeEvent, useState, useRef } from 'react';

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
      <Label htmlFor="image" className="sr-only">
        Image Upload
      </Label>
      <div className="flex w-full items-center gap-0 pt-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className={cn(
            'pt-3 cursor-pointer rounded-b-none',
            image && 'rounded-r-none'
          )}
          id="image"
          name="imageFile"
          required
        />
        {image && (
          <Button
            className="p-6 rounded-l-none"
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
      <div className="h-40">
        {image ? (
          <img
            alt="preview image"
            src={image}
            className="object-cover my-4 h-full"
          />
        ) : (
          <div
            className="flex items-center
            justify-center w-full h-full bg-slate-50 
            border-dashed border-2 border-slate-200 
            rounded-sm rounded-t-none border-t-0 text-slate-200"
          >
            <ImageIcon size="2rem" />
          </div>
        )}
      </div>
    </div>
  );
}
