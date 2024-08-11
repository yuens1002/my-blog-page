import { Label } from '@/components/ui/label';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useRef, useState } from 'react';
import InputField from '../InputField';
import { UseFetchCategoryPayload } from '@/lib/types';
import { useFetch } from '@/hooks/useFetch';

type CreateCategoryInput = {
  setCreatedCategories: Dispatch<SetStateAction<string[]>>;
  createdCategories: string[];
  useCreateCategoryInput: [string, Dispatch<SetStateAction<string>>];
};

export default function CreateCategoryInput({
  setCreatedCategories,
  createdCategories,
  useCreateCategoryInput: [inputValue, setInputValue],
}: CreateCategoryInput) {
  const errorMessages = {
    duplicate:
      'Category already created/selected, enter a different name',
    empty: 'Enter a category name',
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const url = `${process.env.NEXT_PUBLIC_API_ROOT}/categories`;
  const [categories, isPending, error]: UseFetchCategoryPayload =
    useFetch(url);

  if (error) {
    throw new Error('something went wrong while loading categories');
  }

  const handleInput = useCallback(() => {
    if (!categories) return;
    const categoryNameArr = categories.map(
      (category) => category.name
    );
    if (!inputValue) {
      setErrorMessage(errorMessages.empty);
      return;
    }
    const sanitizedInputValue = inputValue
      .trim()
      .split(' ')
      .join(' ');
    // if a category name exists in (category | ones created)
    const isDuplicated =
      [...createdCategories, ...categoryNameArr].findIndex(
        (categoryName) => {
          return (
            categoryName.toLowerCase() ===
            sanitizedInputValue.toLowerCase()
          );
        }
      ) !== -1;
    if (isDuplicated) {
      setErrorMessage(errorMessages.duplicate);
      return;
    }
    setCreatedCategories((cur) => [...cur, sanitizedInputValue]);
    setInputValue('');
  }, [inputValue, createdCategories, categories]);

  return (
    <div className="relative flex w-full items-center gap-0">
      <Label htmlFor="create-category" className="sr-only">
        create a post category
      </Label>
      <InputField
        placement="bottom"
        name="create-category"
        handleInput={handleInput}
        buttonLabel="Create"
        useValue={[inputValue, setInputValue]}
        placeholder={
          isPending
            ? 'Loading categories...'
            : 'Enter a category name'
        }
        useErrorMessage={[errorMessage, setErrorMessage]}
        isDisabled={isPending}
      />
    </div>
  );
}
