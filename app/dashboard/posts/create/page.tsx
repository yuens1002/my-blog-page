'use client';

import { type PostFormState, postFormSchema } from '../types';
import PostForm from './_components/PostForm';

const state: PostFormState = {
  title: '',
  content: '',
  excerpt: '',
  featured: false,
  selectedCategories: [],
  createdCategories: [],
  addedTags: [],
  createCategoryInput: '',
  addTagInput: '',
  imageOption: 'upload',
  photoId: '',
  photoProps: null,
  imageName: null,
  imageFile: null,
  imageURL: '',
};

export default function CreatePostPage() {
  return (
    <>
      <div className="text-sm px-6 text-primary/50">
        posts / create
      </div>
      <PostForm defaultValues={state} schema={postFormSchema} />
    </>
  );
}
