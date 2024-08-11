import { Label } from '@/components/ui/label';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import { useState, useRef } from 'react';
import InputField from '../InputField';
import BadgeButton from '../BadgeButton';
import BadgeWindow from '../BadgeWindow';

type AddTagsInputProps = {
  addedTags: string[];
  setAddedTags: Dispatch<SetStateAction<string[]>>;
  useAddTagInput: [string, Dispatch<SetStateAction<string>>];
};

export default function AddTagsField({
  setAddedTags,
  addedTags,
  useAddTagInput: [inputValue, setInputValue],
}: AddTagsInputProps) {
  const errorMessages = {
    duplicate: 'Tag already added, enter a different name',
    empty: 'Enter a tag name',
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  function handleInput() {
    if (!inputValue) {
      setErrorMessage(errorMessages.empty);
      return;
    }
    const normalizedValue = inputValue
      .replace(/\s/g, '')
      .toLowerCase();
    if (addedTags.includes(normalizedValue)) {
      setErrorMessage(errorMessages.duplicate);
      return;
    }
    setAddedTags((cur) => [...cur, normalizedValue]);
    setInputValue('');
  }
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const TagNameToDelete = e.currentTarget.getAttribute(
      'data-value'
    ) as string;
    if (addedTags.includes(TagNameToDelete)) {
      setAddedTags((cur) => {
        return cur.toSpliced(
          cur.findIndex(
            (categoryName) => categoryName === TagNameToDelete
          ),
          1
        );
      });
    } else {
      setAddedTags((cur) => {
        return cur.toSpliced(
          cur.findIndex(
            (categoryName) => categoryName === TagNameToDelete
          ),
          1
        );
      });
    }
  }

  return (
    // two sets for inputs, one for form data collection and the other for user input
    <div>
      <Label htmlFor="tags" className="text-lg block pb-2">
        Add Tags
      </Label>
      {/* for form data collection */}
      <select
        className="sr-only"
        id="tags"
        name="tags"
        multiple
        value={addedTags}
        onChange={() => {}}
      >
        {addedTags.map((tag) => (
          <option key={tag}>{tag}</option>
        ))}
      </select>
      {/* 
        - apply for/name/id attributes to satisfy html form input requirements
        - hiding the label from screen readers in favor of the
            label above to describe the add tags intention
      */}
      <Label htmlFor="tag-input" className="sr-only" aria-hidden>
        Tag Input
      </Label>
      <InputField
        name="tag-input"
        useValue={[inputValue, setInputValue]}
        handleInput={handleInput}
        buttonLabel="Add"
        placeholder="Add optional tags to your post"
        useErrorMessage={[errorMessage, setErrorMessage]}
      />
      <BadgeWindow>
        {addedTags.map((tag) => (
          <BadgeButton
            key={tag}
            handleClick={handleClick}
            label={tag}
          >
            {tag}
          </BadgeButton>
        ))}
      </BadgeWindow>
    </div>
  );
}
