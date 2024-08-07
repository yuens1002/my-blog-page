import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, MessageSquareWarningIcon } from 'lucide-react';
import { useState, useRef, useEffect, Suspense } from 'react';
import type { UnsplashPhoto } from '@/lib/types';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import PhotoPreview from './_components/PhotoPreview';

/* eslint-disable @next/next/no-img-element */

export default function UnsplashOption() {
  const [photoId, setPhotoId] = useState<string>('');
  const [photoProps, setPhotoProps] = useState<UnsplashPhoto | null>(
    null
  );
  const [isLoading, setIsloading] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('useEffect called');
    if (!photoId || photoProps) return;

    const sanitizeId = (id: string) => {
      let str = id.trim();
      return str.split(' ').join('');
    };

    const isPhotoIdValid = (id: string) => {
      const charCount = 11;
      return charCount === id.length;
    };

    if (isPhotoIdValid(sanitizeId(photoId))) {
      setIsloading(true);
      setError('');
      fetch(
        `${process.env.NEXT_PUBLIC_API_ROOT}/unsplash/photo?photoid=${photoId}`
      )
        .then((res) => {
          console.log('🚀 ~ first.then ~ res:', res);
          if (!res.ok) {
            throw new Error('No photo found');
          } else {
            return res.json();
          }
        })
        .then((res) => {
          console.log('🚀 ~ .then ~ res:', res);
          const { data } = res;
          const { urls, ...otherRes } = data;
          const newUrls = { ...urls };
          setPhotoProps({ ...otherRes, urls: newUrls });
          setIsloading(false);
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
      <Label htmlFor="image" className="sr-only">
        Unsplash Photo Id
      </Label>
      <div className="flex w-full items-center gap-0 pt-2 relative">
        <Input
          ref={linkInputRef}
          type="text"
          className={'cursor-pointer rounded-b-none rounded-r-none'}
          id="image"
          name="unsplashPhotoId"
          placeholder="Enter a valid unsplash photo ID, for example nk2xos4sFRc"
          required
          onFocus={() => setError('')}
          disabled={!!photoProps}
        />
        {photoProps ? (
          <Button
            className="p-6 rounded-l-none rounded-br-none"
            onClick={(e) => {
              e.preventDefault();
              setPhotoId('');
              if (linkInputRef.current) {
                linkInputRef.current.value = '';
                setPhotoProps(null);
              }
            }}
          >
            Undo
          </Button>
        ) : (
          <Button
            type="button"
            className="p-6 rounded-l-none rounded-br-none"
            onClick={(e) => {
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
            'inline absolute top-16 left-3 text-destructive py-2 px-4 rounded-sm drop-shadow-md bg-white',
            !error && 'hidden'
          )}
        >
          <div>
            <MessageSquareWarningIcon className="inline" /> {error}
          </div>
        </div>
      </div>
      <div>
        {photoProps ? (
          <PhotoPreview
            {...{
              urls: photoProps.urls,
              height: photoProps.height,
              width: photoProps?.width,
              blur_hash: photoProps?.blur_hash,
            }}
          />
        ) : (
          <div
            className="flex items-center
            justify-center w-full h-40 bg-slate-50 
            border-dashed border-2 border-slate-200 
            rounded-sm rounded-t-none border-t-0 text-slate-200"
          >
            {isLoading ? <Loader /> : <ImageIcon size="2rem" />}
          </div>
        )}
      </div>
    </div>
  );
}
