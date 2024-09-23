import React from 'react';
import cn from '@/lib/cn';

type ListSubItemProps = {
  linkIsCurrent?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'li'>;

export default function ListSubItem({
  linkIsCurrent,
  children,
  className,
}: ListSubItemProps) {
  return (
    <li
      className={cn(
        'flex items-center p-4 rounded-r-sm border-l border-l-primary/10',
        linkIsCurrent
          ? 'border-l-0 bg-primary/10'
          : 'hover:bg-primary/5'
      )}
    >
      <span
        className={cn(
          'capitalize text-sm',
          linkIsCurrent && 'font-bold'
        )}
      >
        {children}
      </span>
    </li>
  );
}
