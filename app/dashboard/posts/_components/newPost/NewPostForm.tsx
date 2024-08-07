'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { CreatePost } from '@/app/dashboard/_actions/managePosts';
import ImageOptionTabs from './ImageOptionTabs';
import { Separator } from '@/components/ui/separator';
import AddedCategories from './_components/category-field/AddedCategories';
import CategorySelection from './_components/category-field/CategorySelection';
import CreateCategoryInput from './_components/category-field/CreateCategoryInput';
import AddTagsInput from './_components/create-tags/AddTagInput';

export default function NewPostForm() {
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);
  const [createdCategories, setCreatedCategories] = useState<
    string[]
  >([]);
  const [addedTags, setAddedTags] = useState<string[]>([]);

  return (
    <form className="space-y-10">
      <div className="mt-12 space-y-2">
        <Label htmlFor="title" className="text-lg">
          Title*
        </Label>
        <Input
          placeholder="ie. The Art of Peace"
          type="text"
          id="title"
          name="title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg">
          Content*
        </Label>
        <Textarea
          placeholder="10,000 max characters"
          id="content"
          name="content"
          maxLength={10000}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div>
          <Label htmlFor="categories" className="text-lg">
            Select or Create Categories*
          </Label>
          <CategorySelection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <AddedCategories
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            createdCategories={createdCategories}
            setCreatedCategories={setCreatedCategories}
          />
          <CreateCategoryInput
            createdCategories={createdCategories}
            setCreatedCategories={setCreatedCategories}
          />
        </div>
        <AddTagsInput
          setAddedTags={setAddedTags}
          addedTags={addedTags}
        />
      </div>
      <ImageOptionTabs />
      <Separator className="my-8" />
      <div className="flex justify-between items-center gap-4">
        <p className="text-sm">*Required fields</p>
        <div className="flex justify-end gap-4">
          <Button variant={'outline'}>Save Draft</Button>
          <Button formAction={CreatePost}>Publish</Button>
        </div>
      </div>
    </form>
  );
}

// type Payload = {
//   data:
//     | {
//         name: string;
//         slug: string;
//         id: string;
//       }[]
//     | null;
//   error: string | null;
//   isPending: boolean;
// };

// export default function NewPostFormWithSuspense() {
//   const payload: Payload | undefined = useFetch(
//     `${process.env.NEXT_PUBLIC_API_ROOT}/categories`
//   );
//   console.log('🚀 ~ NewPostFormWithSuspense ~ payload:', payload);
//   const categoryNames = payload?.data?.reduce((cur, category) => {
//     cur.push(category.name);
//     return cur;
//   }, [] as string[]);
//   if (payload?.error) return 'error';
//   if (payload?.isPending) {
//     return (
//       <div className="relative h-full w-full bg-white">
//         <div className="m-0 absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
//           <Loader size={[36, 36]} />
//         </div>
//       </div>
//     );
//   }
//   if (categoryNames) {
//     return <NewPostForm categories={categoryNames} />;
//   }
// }
