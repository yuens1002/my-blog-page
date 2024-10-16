'use client';

import InlineLink from '@/components/InlineLink';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="container flex flex-col h-[60vh] w-1/3 items-center justify-center">
      <div className="flex flex-col gap-y-8">
        <div>
          <PageHeading className="text-8xl">Kah Poh!</PageHeading>
          <p>
            it seems you have wandered far <i>far</i> into the
            unknown, try the{' '}
            <InlineLink href="/">homepage</InlineLink> or reload page
            to find your way back...
          </p>
        </div>
        <Button
          type="button"
          size={'lg'}
          onClick={() => router.refresh()}
        >
          Reload Page
        </Button>
      </div>
    </main>
  );
}
