'use client'; // Error components must be Client Components

import PageHeading from '@/components/PageHeading';
import SiteLogo from '@/components/SiteLogo';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[error component:]', error);
  }, [error]);

  return (
    <div className="container flex flex-col h-[60vh] w-1/3 items-center justify-center">
      <div className="flex flex-col gap-y-8">
        <div>
          <SiteLogo href="/" className="pb-4" />
          <PageHeading className="text-8xl">Kah Poh!</PageHeading>
          <p>{`${
            error ??
            'it seems you have wandered far far into the unknown, try the homepage or reloading page to find your way back.'
          }`}</p>
        </div>
        <Button
          type="button"
          size={'lg'}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}
