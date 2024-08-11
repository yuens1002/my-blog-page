import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, MessageSquareWarningIcon } from 'lucide-react';
import {
  useState,
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { UnsplashPhoto } from '@/lib/types';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import PhotoPreview from './PhotoPreview';
import ImageWindow from './ImageWindow';

type UnsplashOptionProps = {
  useIsPhotoIdValidated: [boolean, Dispatch<SetStateAction<boolean>>];
};

export default function UnsplashOption({
  useIsPhotoIdValidated: [_, setIsPhotoIdValidated],
}: UnsplashOptionProps) {
  const [photoId, setPhotoId] = useState<string>('');
  const [photoProps, setPhotoProps] = useState<UnsplashPhoto | null>(
    null
  );
  const [isLoading, setIsloading] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!photoId || photoProps) return;

    const sanitizeId = (id: string) => {
      return id.trim().split(' ').join('');
    };

    const isPhotoIdValid = (id: string) => {
      const charCount = 11;
      return charCount === sanitizeId(id).length;
    };

    if (isPhotoIdValid(photoId)) {
      const sanitizedId = sanitizeId(photoId);
      setIsloading(true);
      setError(null);
      fetch(
        `${process.env.NEXT_PUBLIC_API_ROOT}/unsplash/photo?photoid=${sanitizedId}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('No photo found');
          } else {
            return res.json();
          }
        })
        .then(({ data }) => {
          const { urls, ...otherRes } = data;
          const newUrls = { ...urls };
          setPhotoProps({ ...otherRes, urls: newUrls });
          setIsloading(false);
          setIsPhotoIdValidated(true);
          if (linkInputRef.current) {
            linkInputRef.current.value = sanitizedId;
          }
        })
        .catch((err) => {
          setIsloading(false);
          if (err instanceof Error) setError(err.message);
        });
    } else {
      setIsloading(false);
      setError('Enter a 11 char valid unsplash photo id');
    }

    return () => {
      setPhotoId('');
    };
  }, [photoId, photoProps]);

  return (
    <div>
      <Label htmlFor="unsplashPhotoId" className="sr-only">
        Unsplash Photo Id
      </Label>
      <div className="flex w-full items-center gap-0 relative">
        <Input
          ref={linkInputRef}
          type="text"
          className={
            'cursor-pointer rounded-b-none rounded-r-none rounded-tl-none'
          }
          id="unsplashPhotoId"
          name="unsplashPhotoId"
          placeholder="Enter a valid unsplash photo ID, for example nk2xos4sFRc"
          required
          onFocus={() => setError(null)}
          disabled={isLoading}
          // freezes the photoId for form submission
          readOnly={!!photoProps}
        />
        {photoProps ? (
          <Button
            type="button"
            className="p-6 rounded-l-none rounded-br-none"
            onClick={() => {
              setPhotoId('');
              setPhotoProps(null);
              setIsPhotoIdValidated(false);
              if (linkInputRef.current) {
                linkInputRef.current.value = '';
              }
            }}
          >
            Undo
          </Button>
        ) : (
          <Button
            type="button"
            className="p-6 rounded-l-none rounded-br-none"
            onClick={() => {
              if (linkInputRef.current) {
                if (!linkInputRef.current.value) {
                  setError('Enter a valid photo id');
                }
                setPhotoId(linkInputRef.current.value);
              }
            }}
            disabled={isLoading}
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
        ) : isLoading ? (
          <Loader size={'md'} />
        ) : (
          <ImageIcon size="2rem" aria-hidden />
        )}
      </ImageWindow>
    </div>
  );
}
