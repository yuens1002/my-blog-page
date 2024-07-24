import React from 'react';
import type { Post } from '@prisma/client';
import { MonitorCheck, MonitorOff, ScrollText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type PostStatusIconType = {
  status: Post['status'];
};
export default function PostStatusIcon({
  status,
}: PostStatusIconType) {
  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <StatusIcon status={status} />
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

function StatusIcon({ status }: PostStatusIconType) {
  switch (status) {
    case 'DRAFT':
      return <ScrollText size={16} aria-hidden="true" />;
    case 'PUBLISHED':
      return <MonitorCheck size={16} aria-hidden="true" />;
    case 'DRAFT':
      return <MonitorOff size={16} aria-hidden="true" />;
    default:
      return <p>status not found</p>;
  }
}
