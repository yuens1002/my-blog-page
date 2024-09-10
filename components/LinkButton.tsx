import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
} & ButtonProps;

export default function LinkButton({
  href,
  className,
  size = 'sm',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button variant={'link'} size={size} {...props} asChild>
      <Link href={href} className={className}>
        {children}
      </Link>
    </Button>
  );
}
