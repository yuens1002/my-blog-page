import { Label } from '@/components/ui/label';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useRef, useState } from 'react';
import InputField from '../InputField';
import { UseFetchCategoryPayload } from '@/lib/types';
import { useFetch } from '@/hooks/useFetch';

type CreateCategoryInput = {
  setCreatedCategories: Dispatch<SetStateAction<string[]>>;
  createdCategories: string[];
};

export default function CreateCategoryInput({
  setCreatedCategories,
  createdCategories,
}: CreateCategoryInput) {
  const errorMessages = {
    duplicate:
      'Category already created/selected, enter a different name',
    empty: 'Enter a category name',
  };
  const ref = useRef<HTMLInputElement>(null);
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
    console.log('[errorMessage]', errorMessage);
    const categoryNameArr = categories.map(
      (category) => category.name
    );
    if (ref.current) {
      if (!ref.current.value) {
        setErrorMessage(errorMessages.empty);
        return;
      }
      const inputValue = ref.current.value.trim();
      const isDuplicated =
        [...createdCategories, ...categoryNameArr].findIndex(
          (categoryName) => {
            return (
              categoryName.toLowerCase() === inputValue.toLowerCase()
            );
          }
        ) !== -1;
      // if a category name already exists in category & ones already created
      if (isDuplicated) {
        setErrorMessage(errorMessages.duplicate);
        return;
      }
      setCreatedCategories((cur) => [...cur, inputValue]);
      ref.current.value = '';
    }
  }, [createdCategories]);

  return (
    <div className="relative flex w-full items-center gap-0">
      <Label htmlFor="create-category" className="sr-only">
        create a post category
      </Label>
      <InputField
        ref={ref}
        placement="bottom"
        name="create-category"
        handleInput={handleInput}
        buttonLabel="Create"
        placeholder={
          isPending
            ? 'Loading categories...'
            : 'Enter a category name'
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isDisabled={isPending}
      />
    </div>
  );
}
