import type { MouseEvent } from 'react';
import BadgeWindow from '../BadgeWindow';
import BadgeButton from '../BadgeButton';
import { usePostContext } from '@/app/dashboard/_hooks/usePostContext';

export default function AddedCategories() {
  const [{ selectedCategories, createdCategories }, dispatch] =
    usePostContext();
  const categories = [...selectedCategories, ...createdCategories];

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const categoryNameToDelete = e.currentTarget.getAttribute(
      'data-value'
    ) as string;
    if (createdCategories.includes(categoryNameToDelete)) {
      dispatch({
        type: 'DEL_FROM_CREATED_CATEGORIES',
        payload: categoryNameToDelete,
      });
    } else {
      dispatch({
        type: 'DEL_FROM_SELECTED_CATEGORIES',
        payload: categoryNameToDelete,
      });
    }
  }

  return (
    <BadgeWindow hasBottomBorder={false}>
      {/* for form data collection */}
      <select
        id="categories"
        name="categories"
        className="sr-only"
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
