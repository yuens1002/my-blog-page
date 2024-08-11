import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React, { type MouseEvent } from 'react';

type BadgeButtonProps = {
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  children: React.ReactNode;
};

export default function BadgeButton({
  handleClick,
  label,
  children,
  ...props
}: BadgeButtonProps) {
  return (
    <Button
      type="button"
      size={'xs'}
      className="text-xs pl-4 hover:bg-destructive"
      onClick={handleClick}
      data-value={label}
      {...props}
    >
      {children} <X className="ml-2 h-4 w-4" />
    </Button>
  );
}
