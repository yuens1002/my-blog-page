import type { Dispatch, SetStateAction } from 'react';
import { useFetch } from '@/hooks/useFetch';

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import clsx from 'clsx';
import { UseFetchCategoryPayload } from '@/lib/types';

type CategorySelectionProps = {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};

export default function CategorySelection({
  selectedCategories,
  setSelectedCategories,
}: CategorySelectionProps) {
  const url = `${process.env.NEXT_PUBLIC_API_ROOT}/categories`;
  const [categories, isPending, error]: UseFetchCategoryPayload =
    useFetch(url);

  if (error) {
    throw new Error('something went wrong while loading categories');
  }

  return (
    <Field className="mt-2">
      <Label className="sr-only">select one or more categories</Label>
      <Listbox
        name="select-categories"
        value={selectedCategories}
        onChange={setSelectedCategories}
        multiple
      >
        <ListboxButton
          className={clsx(
            'relative block w-full rounded-md rounded-b-none border border-black/20 py-3 pr-8 pl-3 text-left text-sm text-primary',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
          )}
        >
          {isPending
            ? 'loading categories...'
            : '-- Select one or more categories'}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-3.5 right-3 size-4 text-primary fill-black/80"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[var(--button-width)] rounded-md rounded-t-none border-t-0 drop-shadow-sm border border-black/20 bg-background p-2 [--anchor-gap:var(--spacing-1)] empty:invisible',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {categories?.map(({ name }) => (
            <ListboxOption
              key={name}
              value={name}
              className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-2 select-none data-[focus]:bg-black/5"
            >
              <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
              <div className="text-sm/6 text-primary">{name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
