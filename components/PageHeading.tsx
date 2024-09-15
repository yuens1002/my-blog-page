import type { ReactNode } from 'react';

type PageHeadingProps = {
  children: ReactNode;
};
export default function PageHeading({ children }: PageHeadingProps) {
  return (
    <h1 className="text-4xl font-bold tracking-tight">{children}</h1>
  );
}
