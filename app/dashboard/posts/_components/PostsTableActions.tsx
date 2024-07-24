import type { Post } from '@prisma/client';

import {
  CircleX,
  CopyPlus,
  Eye,
  FilePenLine,
  MonitorCheck,
  MonitorOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type PostsTableActionsType = {
  slug: string;
  status: Post['status'];
};

export default function PostsTableActions({
  slug,
  status,
}: PostsTableActionsType) {
  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <Eye />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <FilePenLine />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <CopyPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <CircleX />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {status === 'PUBLISHED' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <MonitorOff />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inactivate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {status === 'INACTIVE' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <MonitorCheck />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Publish</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
