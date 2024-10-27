import { Suspense } from 'react';
import FullPageLoader from '@/components/FullPageLoader';

type PostLayoutProps = {
  children: React.ReactNode;
};

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
  );
}
