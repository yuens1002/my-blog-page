import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  MouseEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';

type AddedCategoriesProps = {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  createdCategories: string[];
  setCreatedCategories: Dispatch<SetStateAction<string[]>>;
};
export default function AddedCategories({
  selectedCategories,
  setSelectedCategories,
  createdCategories,
  setCreatedCategories,
}: AddedCategoriesProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const categoryNameToDelete = e.currentTarget.getAttribute(
      'data-value'
    ) as string;
    if (createdCategories.includes(categoryNameToDelete)) {
      setCreatedCategories((cur) => {
        return cur.toSpliced(
          cur.findIndex(
            (categoryName) => categoryName === categoryNameToDelete
          ),
          1
        );
      });
    } else {
      setSelectedCategories((cur) => {
        return cur.toSpliced(
          cur.findIndex(
            (categoryName) => categoryName === categoryNameToDelete
          ),
          1
        );
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-3 border border-y-0 p-3 border-primary/20 min-h-20 bg-background">
      {/* for form data collection */}
      <select
        id="categories"
        name="categories"
        className="sr-only"
        value={[...selectedCategories, ...createdCategories]}
        multiple
        onChange={() => {}}
      />
      {[...selectedCategories, ...createdCategories].map(
        (category) => (
          <Button
            type="button"
            key={category}
            size={'xs'}
            className="text-xs pl-4 hover:bg-destructive"
            onClick={handleClick}
            data-value={category}
          >
            {category} <X className="ml-2 h-4 w-4" />
          </Button>
        )
      )}
    </div>
  );
}
