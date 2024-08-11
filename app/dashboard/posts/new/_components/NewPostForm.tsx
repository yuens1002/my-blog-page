'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { Textarea } from '@/components/ui/textarea';
import ImageOptionTabs from './image-upload/ImageOptionTabs';
import AddedCategories from './category-field/AddedCategories';
import CategorySelection from './category-field/CategorySelection';
import CreateCategoryInput from './category-field/CreateCategoryInput';
import AddTagsField from './create-tags/AddTagsField';
import CategoryField from './category-field/CategoryField';
import { createPost } from '@/app/dashboard/_actions/managePosts';
import UnsplashOption from './image-upload/UnsplashOption';
import ImageUploadOption from './image-upload/ImageUploadOption';
import Loader from '@/components/Loader';

export default function NewPostForm() {
  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >([]);
  const [createdCategories, setCreatedCategories] = useState<
    string[]
  >([]);
  const [addedTags, setAddedTags] = useState<string[]>([]);
  // due to form validation, otherwise, we would use refs
  const [createCategoryInput, setCreateCategoryInput] = useState('');
  const [addTagInput, setAddTagInput] = useState('');
  const [isPhotoIdValidated, setIsPhotoIdValidated] = useState(false);
  const [imageOption, setImageOption] = useState<
    'upload' | 'upsplash'
  >('upload');
  const { toast } = useToast();

  const errors = {
    unsplashPhotoId:
      'Click the Preview button to confirm photo id is valid',
    createCategoryInput: `You have entered "${createCategoryInput}" as a new category, click the Create button to confirm`,
    addTagInput: `You have entered "${addTagInput}" as a new tag, click the Add button to confirm`,
  };

  const areInputsValid = () => {
    let isPhotoValid = false;
    if (imageOption === 'upload') {
      isPhotoValid = true;
    } else if (isPhotoIdValidated) {
      isPhotoValid = true;
    }
    console.log(
      '🚀 ~ areInputsValid ~ !isPhotoIdValidated || createCategoryInput || addTagInput:',
      Boolean(isPhotoValid && !createCategoryInput && !addTagInput)
    );
    return Boolean(
      isPhotoValid && !createCategoryInput && !addTagInput
    );
  };

  const createToast = (title: string, type: keyof typeof errors) => {
    return {
      title: `Unconfirmed ${title}`,
      description: errors[type],
      duration: 6000,
    };
  };
  const handleInputError = () => {
    if (!isPhotoIdValidated) {
      toast(createToast('Unsplash Photo ID', 'unsplashPhotoId'));
    }
    if (createCategoryInput) {
      toast(createToast('Category Input', 'createCategoryInput'));
    }
    if (addTagInput) {
      toast(createToast('Tag Input', 'addTagInput'));
    }
  };

  const [formState, formAction, pending] = useActionState(
    createPost,
    { message: '' }
  );

  formState?.message && toast({ description: formState?.message });

  const handlePublish = (formData: FormData) => {
    formData.append('isPublished', 'true');
    areInputsValid() ? formAction(formData) : handleInputError();
  };

  return (
    <form className="block space-y-10">
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
        <div className="grid grid-cols-1 gap-8 md:gap-16">
          <CategoryField>
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
              useCreateCategoryInput={[
                createCategoryInput,
                setCreateCategoryInput,
              ]}
            />
          </CategoryField>
          <AddTagsField
            setAddedTags={setAddedTags}
            addedTags={addedTags}
            useAddTagInput={[addTagInput, setAddTagInput]}
          />
        </div>
        <ImageOptionTabs
          useImageOption={[imageOption, setImageOption]}
        >
          {imageOption === 'upsplash' ? (
            <UnsplashOption
              useIsPhotoIdValidated={[
                isPhotoIdValidated,
                setIsPhotoIdValidated,
              ]}
            />
          ) : (
            <ImageUploadOption />
          )}
        </ImageOptionTabs>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm">*Required fields</p>
            <div className="flex justify-end gap-4">
              <Button variant={'outline'}>Save Draft</Button>
              <Button
                type="submit"
                formAction={handlePublish}
                disabled={pending}
              >
                {pending ? <Loader size="sm" /> : 'Publish'}
              </Button>
            </div>
            <p aria-live="polite" className="sr-only">
              {formState?.message}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
