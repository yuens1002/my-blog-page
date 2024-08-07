import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
} from 'react';

type InputFieldProps = {
  handleInput: () => void;
  placement?: 'top' | 'bottom';
  name: string;
  buttonLabel: string;
  placeholder: string;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  isDisabled?: boolean;
};

const InputField = forwardRef(function InputField(
  {
    handleInput,
    placement = 'top',
    name,
    placeholder,
    buttonLabel,
    errorMessage,
    setErrorMessage,
    isDisabled = false,
    ...props
  }: InputFieldProps,
  ref: ForwardedRef<HTMLInputElement | null>
) {
  const InputClasses = {
    top: 'rounded-b-none rounded-tl-md rounded-r-none',
    bottom: 'rounded-t-none rounded-bl-md rounded-r-none',
  };
  const ButtonClasses = {
    top: 'p-6 rounded-l-none rounded-br-none rounded-tr-md',
    bottom: 'p-6 rounded-l-none rounded-tr-none rounded-br-md',
  };

  return (
    <div className="relative flex w-full items-center gap-0">
      <div
        className={cn(
          'hidden items-center absolute -top-6 left-3 shadow-md rounded-md p-2 text-xs bg-white text-destructive',
          errorMessage && 'flex'
        )}
      >
        <CircleAlert className="mr-2 w-4 h-4" aria-label="alert" />{' '}
        {errorMessage}
      </div>
      <Input
        ref={ref}
        type="text"
        className={cn(
          'rounded-b-none',
          placement === 'top' ? InputClasses.top : InputClasses.bottom
        )}
        id={name}
        name={name}
        placeholder={placeholder}
        onFocus={() => setErrorMessage(null)}
        onKeyDown={(e) => {
          errorMessage && setErrorMessage(null);
          e.key === 'Enter' && handleInput();
        }}
        disabled={isDisabled}
        {...props}
      />
      <Button
        type="button"
        className={cn(
          'p-6       ',
          placement === 'top'
            ? ButtonClasses.top
            : ButtonClasses.bottom
        )}
        onClick={handleInput}
        disabled={!!errorMessage || isDisabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
});

export default InputField;
