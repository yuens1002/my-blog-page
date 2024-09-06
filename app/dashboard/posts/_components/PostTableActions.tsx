import type { Post } from '@prisma/client';
import Dialog from '@/components/DeletePostDialog';

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
import Link from 'next/link';
import {
  deletePost,
  putPartialPost,
} from '../../_actions/managePosts';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

type PostTableActionsType = {
  postId: string;
  status: Post['status'];
  isActive: boolean;
  authorId: string;
  fetchPosts: () => void;
};

export default function PostTableActions({
  postId,
  authorId,
  status,
  isActive,
  fetchPosts,
}: PostTableActionsType) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const deletePostHandler = async () => {
    const result = await deletePost({ postId, authorId });
    if (result.status === 'ok') {
      fetchPosts(); //re-fetches posts
    }
    setOpen(false);
    toast({ description: result.message as string });
  };
  const isActiveHandler = async (isActive: boolean) => {
    const result = await putPartialPost(postId, authorId, {
      isActive,
    });
    if (result.status === 'ok') {
      fetchPosts(); //re-fetches posts
    }
    toast({ description: result.message as string });
  };

  return (
    <div className="flex items-center gap-x-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/dashboard/posts/preview/${postId}`}>
              <Eye />
            </Link>
          </TooltipTrigger>
          <TooltipContent>View</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/dashboard/posts/${postId}`}>
              <FilePenLine />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        onCancelHandler={() => setOpen(false)}
        onDeleteHandler={deletePostHandler}
        onOpenChange={setOpen}
        open={open}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleX />
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Dialog>
      {status === 'PUBLISHED' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-pointer"
              asChild
              onClick={() =>
                isActive
                  ? isActiveHandler(false)
                  : isActiveHandler(true)
              }
            >
              {isActive ? <MonitorOff /> : <MonitorCheck />}
            </TooltipTrigger>
            <TooltipContent>
              {isActive ? 'Deactivate' : 'Activate'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
