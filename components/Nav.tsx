'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

type NavProps = {
  children: ReactNode;
};

export function Nav({ children }: NavProps) {
  return (
    <nav className="lg:flex h-full items-center gap-8 hidden">
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
