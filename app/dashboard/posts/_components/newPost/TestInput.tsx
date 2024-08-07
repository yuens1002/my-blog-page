import { Input } from '@/components/ui/input';
import {
  type ChangeEvent,
  type Dispatch,
  type ForwardedRef,
  type SetStateAction,
  forwardRef,
} from 'react';

type TestInputProps = {
  setImage: Dispatch<SetStateAction<string | null>>;
};

const TestInput = forwardRef(function TestInput(
  { setImage }: TestInputProps,
  fileInputRef: ForwardedRef<HTMLInputElement>
) {
  const onFileInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          //ensure only text is being passed
          const resultText = event.target.result.toString();
          setImage(resultText);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <Input
      type="file"
      ref={fileInputRef}
      onChange={onFileInputChange}
    />
  );
});

export default TestInput;
