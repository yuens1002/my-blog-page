import { Button, type ButtonProps } from '@/components/ui/button';
import Loader from './Loader';

type SubmitButtonProps = {
  children: React.ReactNode;
  showLoader: boolean;
} & ButtonProps;

export default function SubmitButton({
  children,
  showLoader,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" {...props}>
      {showLoader ? <Loader size="sm" className="px-6" /> : children}
    </Button>
  );
}
