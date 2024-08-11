import { cn } from '@/lib/utils';
import React from 'react';

type BadgeWindowProps = {
  hasBottomBorder?: boolean;
  children: React.ReactNode;
};

export default function BadgeWindow({
  children,
  hasBottomBorder = true,
}: BadgeWindowProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-3 border p-3 border-primary/20 min-h-[6rem] bg-background',
        hasBottomBorder ? 'border-t-0 rounded-b-md' : 'border-y-0'
      )}
    >
      {children}
    </div>
  );
}
