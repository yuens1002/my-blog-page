import Loader from '@/components/Loader';
import React, { Suspense } from 'react';

type PostLayoutProps = {
  children: React.ReactNode;
};

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <section className="lg:container">
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </section>
  );
}
