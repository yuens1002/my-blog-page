import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type PageHeadingProps = {
  children: ReactNode;
} & React.ComponentPropsWithoutRef<'h1'>;
export default function PageHeading({
  children,
  className,
}: PageHeadingProps) {
  return (
    <h1
      className={cn('text-4xl font-bold tracking-tight', className)}
    >
      {children}
    </h1>
  );
}
