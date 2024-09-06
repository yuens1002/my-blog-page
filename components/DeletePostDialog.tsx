import { DialogProps } from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type CustomDialogProps = {
  children: React.ReactNode;
  onDeleteHandler: () => void;
  onCancelHandler: () => void;
};

export default function DeletePostDialog({
  children,
  onDeleteHandler,
  onCancelHandler,
  ...props
}: CustomDialogProps & DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete
            the post/draft and remove images and linked data related
            to the post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancelHandler}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteHandler}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
