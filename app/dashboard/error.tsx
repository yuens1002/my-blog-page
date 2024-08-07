'use client'; // Error components must be Client Components

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
    <div className="container flex flex-col h-[60vh] w-full items-center justify-center">
      <div className="text-destructive drop-shadow-md rounded-md p-8 bg-white">
        <div className="flex gap-8 items-center">
          <div className="border-r border-black/15 pr-8">
            <h1 className="font-bold">Kah Poh!</h1>
            <p>{`${error ?? 'Something happened'}, try reloading`}</p>
          </div>
          <Button
            type="button"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
