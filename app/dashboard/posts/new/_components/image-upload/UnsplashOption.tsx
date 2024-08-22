import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, MessageSquareWarningIcon } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import PhotoPreview from './PhotoPreview';
import ImageWindow from './ImageWindow';
import { usePostContext } from '@/app/dashboard/_hooks/usePostContext';

export default function UnsplashOption() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [{ photoId, photoProps }, dispatch] = usePostContext();
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handlePreview = () => {
    if (!photoId) {
      setError('Enter a valid photo id');
      return;
    }
    const sanitizeId = (id: string) => {
      return id.trim().split(' ').join('');
    };
    const isPhotoIdValid = (id: string) => {
      const charCount = 11;
      return charCount === sanitizeId(id).length;
    };
    const sanitizedId = sanitizeId(photoId);
    const isValidPhotoId = isPhotoIdValid(sanitizedId);
    if (!isValidPhotoId) {
      setError('Enter a 11 char valid unsplash photo id');
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/unsplash/photo?photoid=${sanitizedId}`
        );
        if (!res.ok) throw new Error('No photo found');
        const { data } = await res.json();
        const { urls, ...otherRes } = data;
        const newUrls = { ...urls };
        dispatch({
          type: 'SET_PHOTO_PROPS',
          payload: { ...otherRes, urls: newUrls },
        });
        if (!photoId) {
          // ensure the photoId input field is valid before submitting the form
          dispatch({ type: 'SET_PHOTO_ID', payload: sanitizedId });
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    });
  };

  // used for edit post page when the photoId is already set
  useEffect(() => {
    if (photoId) handlePreview();
  }, []);

  return (
    <div>
      <Label htmlFor="unsplashPhotoId" className="sr-only">
        Unsplash Photo Id
      </Label>
      <div className="flex w-full items-center gap-0 relative">
        <Input
          value={photoId}
          type="text"
          className="cursor-pointer rounded-b-none rounded-r-none rounded-tl-none read-only:cursor-default read-only:pointer-events-none"
          id="unsplashPhotoId"
          name="unsplashPhotoId"
          placeholder="Enter a valid unsplash photo ID, for example nk2xos4sFRc"
          onFocus={() => setError(null)}
          disabled={isPending}
          // freezes the photoId for form submission
          readOnly={!!photoProps}
          onChange={(e) =>
            dispatch({
              type: 'SET_PHOTO_ID',
              payload: e.target.value,
            })
          }
          tabIndex={photoProps ? -1 : 0}
        />
        {photoProps ? (
          <Button
            type="button"
            className="p-6 rounded-l-none rounded-br-none"
            onClick={() => {
              dispatch({ type: 'SET_PHOTO_ID', payload: '' });
              dispatch({ type: 'SET_PHOTO_PROPS', payload: null });
            }}
          >
            Undo
          </Button>
        ) : (
          <Button
            ref={ref}
            type="button"
            className="p-6 rounded-l-none rounded-br-none"
            onClick={handlePreview}
            disabled={isPending}
          >
            Preview
          </Button>
        )}
        <div
          className={cn(
            'inline absolute bottom-8 left-3 text-sm text-destructive py-2 px-4 rounded-sm drop-shadow-md bg-white',
            !error && 'hidden'
          )}
        >
          <MessageSquareWarningIcon
            size={24}
            className="inline pr-2"
          />
          {error}
        </div>
      </div>
      <ImageWindow showBorder={!photoProps}>
        {photoProps ? (
          <PhotoPreview photo={photoProps} />
        ) : isPending ? (
          <Loader size={'md'} />
        ) : (
          <ImageIcon size="2rem" aria-hidden />
        )}
      </ImageWindow>
    </div>
  );
}
