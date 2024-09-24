'use client';

import PageHeading from '@/components/PageHeading';
import SiteLogo from '@/components/SiteLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="container flex flex-col h-[60vh] w-1/3 items-center justify-center">
      <div className="flex flex-col gap-y-8">
        <div>
          <SiteLogo href="/" className="pb-4" />
          <PageHeading className="text-8xl">Kah Poh!</PageHeading>
          <p>
            it seems you have wandered far far into the unknown, try
            the{' '}
            <Link
              href="/"
              className="underline underline-offset-5 font-semibold"
            >
              homepage
            </Link>{' '}
            or reloading page to find your way back...
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
