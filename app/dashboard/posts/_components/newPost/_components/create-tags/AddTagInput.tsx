import { Label } from '@/components/ui/label';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useRef } from 'react';
import InputField from '../InputField';

type AddTagsInputProps = {
  addedTags: string[];
  setAddedTags: Dispatch<SetStateAction<string[]>>;
};

export default function AddTags({
  setAddedTags,
  addedTags,
}: AddTagsInputProps) {
  const errorMessages = {
    duplicate: 'Tag already added, enter a different name',
    empty: 'Enter a tag name',
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const ref = useRef<HTMLInputElement | null>(null);
  function handleInput() {
    if (ref.current) {
      if (!ref.current.value) {
        setErrorMessage(errorMessages.empty);
        return;
      }
      const inputValue = ref.current.value.trim().toLowerCase();
      if (addedTags.includes(inputValue)) {
        setErrorMessage(errorMessages.duplicate);
        return;
      }
      setAddedTags((cur) => [...cur, inputValue]);
      ref.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-lg">
        Add Tags
      </Label>
      <InputField
        ref={ref}
        name="tags"
        handleInput={handleInput}
        buttonLabel="Add"
        placeholder="Add optional tags to your post"
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}
