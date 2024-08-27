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
        <Suspense
          fallback={
            <div className="w-full h-full bg-black/25 z-0 fixed top-0 left-0 flex items-center justify-center">
              <div className="z-10">
                <Loader />
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </section>
    </PostProvider>
  );
}
