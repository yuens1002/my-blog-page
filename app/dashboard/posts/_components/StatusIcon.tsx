import React from 'react';
import type { Post } from '@prisma/client';
import {
  CircleCheckBig,
  CircleSlash,
  NotebookPen,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type PostStatusIconType = {
  status: Post['status'];
  isActive: boolean;
};
export default function PostStatusIcon({
  status,
  isActive,
}: PostStatusIconType) {
  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <StatusIcon status={status} isActive={isActive} />
          </TooltipTrigger>
          <TooltipContent>
            <p className="capitalize">{status.toLocaleLowerCase()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="sr-only">{status.toLowerCase()}</span>
    </div>
  );
}

function StatusIcon({ status, isActive }: PostStatusIconType) {
  switch (status) {
    case 'DRAFT':
      return <NotebookPen size={16} aria-hidden="true" />;
    case 'PUBLISHED':
      return isActive ? (
        <CircleCheckBig
          color="#10b981"
          size={16}
          aria-hidden="true"
        />
      ) : (
        <CircleSlash size={16} aria-hidden="true" />
      );
    default:
      return <p>status not found</p>;
  }
}
