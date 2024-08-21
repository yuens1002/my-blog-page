'use client';
import Loader from '@/components/Loader';
import { Suspense } from 'react';
import { PostProvider } from '@/app/dashboard/_hooks/usePostContext';

type PostLayoutProps = {
  children: React.ReactNode;
};

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <PostProvider>
      <section className="lg:container">
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </section>
    </PostProvider>
  );
}
