import { Label } from '@/components/ui/label';
import CategorySelection from './CategorySelection';
import AddedCategories from './AddedCategories';
import CreateCategoryInput from './CreateCategoryInput';

export default function CategoryField() {
  return (
    <>
      <Label htmlFor="categories" className="text-lg block pb-2">
        Select or Create Categories
      </Label>
      <CategorySelection />
      <AddedCategories />
      <CreateCategoryInput />
    </>
  );
}
