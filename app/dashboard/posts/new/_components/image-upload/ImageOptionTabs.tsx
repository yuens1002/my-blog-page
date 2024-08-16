'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNewPostContext } from '@/app/dashboard/_hooks/useNewPostContext';

type ImageOptionTabsProps = {
  children: React.ReactNode;
};

export default function ImageOptionTabs({
  children,
}: ImageOptionTabsProps) {
  const [{ imageOption, photoProps, image }, dispatch] =
    useNewPostContext();
  return (
    <div>
      <Label
        htmlFor={
          imageOption === 'upload' ? 'imageFile' : 'unsplashPhotoId'
        }
        className="text-lg block pb-2"
      >
        Choose an Image Option
      </Label>
      <div className="inline-block border border-primary/20 p-2 rounded-t-sm rounded-b-none border-b-0">
        <Button
          type="button"
          className={cn(
            'rounded-r-none',
            imageOption === 'upload' &&
              '!bg-transparent text-primary border border-r-0 border-primary/20 cursor-default pointer-events-none'
          )}
          size="sm"
          onClick={() => {
            dispatch({ type: 'SET_IMAGE_OPTION', payload: 'upload' });
          }}
          disabled={!!photoProps}
          tabIndex={imageOption === 'upload' ? -1 : 0}
        >
          Image Upload
        </Button>
        <Button
          type="button"
          className={cn(
            'rounded-l-none',
            imageOption === 'unsplash' &&
              '!bg-transparent text-primary border border-l-0 border-primary/20 cursor-default pointer-events-none'
          )}
          size="sm"
          onClick={() => {
            dispatch({
              type: 'SET_IMAGE_OPTION',
              payload: 'unsplash',
            });
          }}
          disabled={!!image}
          tabIndex={imageOption === 'unsplash' ? -1 : 0}
        >
          Unsplash
        </Button>
      </div>
      {children}
    </div>
  );
}
