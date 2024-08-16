import { Label } from '@/components/ui/label';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import InputField from '../InputField';
import { UseFetchCategoryPayload } from '@/lib/types';
import { useFetch } from '@/hooks/useFetch';
import { useNewPostContext } from '@/app/dashboard/_hooks/useNewPostContext';

export default function CreateCategoryInput() {
  // use a transition here
  const url = `${process.env.NEXT_PUBLIC_API_ROOT}/categories`;
  const [categories, isPending, error]: UseFetchCategoryPayload =
    useFetch(url);

  if (error) {
    throw new Error('something went wrong while loading categories');
  }

  const [
    { createdCategories, createCategoryInput: inputValue },
    dispatch,
  ] = useNewPostContext();

  const errorMessages = {
    duplicate:
      'Category already created/selected, enter a different name',
    empty: 'Enter a category name',
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
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
    dispatch({
      type: 'SET_CREATED_CATEGORIES',
      payload: sanitizedInputValue,
    });
    dispatch({ type: 'SET_CREATE_CATEGORY_INPUT', payload: '' });
  }, [inputValue, createdCategories, categories]);

  return (
    <div className="relative flex w-full items-center gap-0">
      <Label htmlFor="create-category" className="sr-only">
        create a post category
      </Label>
      <InputField
        id="create-category"
        /*  
          omitting the name attribute to not pollute 
          formData sent to server. This field only
          provides the interface for the user and the
          input(s) is/are added to the categories formData 
          entry for processing.
        */
        placeholder={
          isPending
            ? 'Loading categories...'
            : 'Enter a category name'
        }
        placement="bottom"
        handleInput={handleInput}
        buttonLabel="Create"
        useValue={[
          inputValue,
          (value) => {
            dispatch({
              type: 'SET_CREATE_CATEGORY_INPUT',
              payload: value,
            });
          },
        ]}
        useErrorMessage={[errorMessage, setErrorMessage]}
        isDisabled={isPending}
      />
    </div>
  );
}
