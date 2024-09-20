'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

type NavProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<'nav'>;

export function Nav({ children, className }: NavProps) {
  return (
    <nav className={cn('h-full items-center gap-8', className)}>
      {children}
    </nav>
  );
}

export function NavLink(
  props: Omit<ComponentPropsWithoutRef<typeof Link>, 'className'>
) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        'text-slate-300 font-semibold text-xs hover:text-primary-foreground hover:underline hover:underline-offset-8 hover:transition-all',
        pathname === props.href &&
          'underline underline-offset-8 text-lime-300'
      )}
    />
  );
}
