import {
  type MouseEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import BadgeWindow from '../BadgeWindow';
import BadgeButton from '../BadgeButton';

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
  const ref = useRef<HTMLSelectElement | null>(null);
  const categories = [...selectedCategories, ...createdCategories];

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
    <BadgeWindow hasBottomBorder={false}>
      {/* for form data collection */}
      <select
        ref={ref}
        id="categories"
        name="categories"
        className="sr-only"
        required
        value={categories}
        multiple
        onChange={() => {}} // react complains if this is not here
      >
        {categories.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
      {categories.map((category) => (
        <BadgeButton
          key={category}
          handleClick={handleClick}
          label={category}
        >
          {category}
        </BadgeButton>
      ))}
    </BadgeWindow>
  );
}
