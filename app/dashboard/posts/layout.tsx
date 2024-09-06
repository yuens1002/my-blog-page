'use client';

import { Suspense } from 'react';
import { PostProvider } from '@/app/dashboard/_hooks/usePostContext';
import FullPageLoader from '@/components/FullPageLoader';

type PostLayoutProps = {
  children: React.ReactNode;
};

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <PostProvider>
      <section className="px-4 md:px-8 lg:px-0">
        <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
      </section>
    </PostProvider>
  );
}
