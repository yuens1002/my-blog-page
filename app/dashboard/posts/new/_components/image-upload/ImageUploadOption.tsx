import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { type ChangeEvent } from 'react';
import ImageWindow from './ImageWindow';
import { usePostContext } from '@/app/dashboard/_hooks/usePostContext';
import Image from 'next/image';

type FileUploadProps = {
  ref: React.RefObject<HTMLInputElement | null>;
};

/* eslint-disable @next/next/no-img-element */
export default function FileUpload({
  ref: fileInputRef,
}: FileUploadProps) {
  const [{ image, imageURL }, dispatch] = usePostContext();

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          //ensure only text is being passed
          const resultText = event.target.result.toString();
          dispatch({
            type: 'SET_STATE',
            payload: { stateProp: 'image', value: resultText },
          });
          // clears an unconfirmed photoId if a user has entered it
          dispatch({
            type: 'SET_STATE',
            payload: { stateProp: 'photoId', value: '' },
          });
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
        {imageURL ? (
          <Input
            ref={fileInputRef}
            defaultValue={imageURL.split('/').pop()}
            id="imageFile"
            name="imageURL"
            className={cn(
              'pt-3 cursor-pointer rounded-b-none rounded-tl-none',
              imageURL &&
                'rounded-r-none pointer-events-none cursor-default'
            )}
            type="text"
            tabIndex={-1}
            readOnly
          />
        ) : (
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
        )}
        {image || imageURL ? (
          <Button
            className="p-6 rounded-b-none rounded-l-none"
            onClick={() => {
              dispatch({
                type: 'SET_STATE',
                payload: { stateProp: 'image', value: null },
              });
              imageURL &&
                dispatch({
                  type: 'SET_STATE',
                  payload: { stateProp: 'imageURL', value: '' },
                });
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            Undo
          </Button>
        ) : null}
      </div>
      <ImageWindow showBorder={!image || !imageURL}>
        {image ? (
          imageURL ? (
            <Image
              fill
              className="object-cover w-full"
              alt="preview image"
              src={imageURL}
            />
          ) : (
            <img
              alt="preview image"
              src={image}
              className="object-cover w-full"
            />
          )
        ) : (
          <ImageIcon size="2rem" aria-hidden />
        )}
      </ImageWindow>
    </div>
  );
}
