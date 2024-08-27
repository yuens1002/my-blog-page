import { UnsplashPhoto } from '@/lib/types';
// import { PostWithRelations } from '@/prisma/generated/zod';
// import { Post } from '@prisma/client';
// import { createRef } from 'react';

type InitialStateTypes = {
  title: string;
  content: string;
  selectedCategories: string[];
  createdCategories: string[];
  addedTags: string[];
  createCategoryInput: string;
  addTagInput: string;
  imageOption: 'upload' | 'unsplash';
  photoId: string;
  photoProps: UnsplashPhoto | null;
  image: string | null;
  imageURL: string;
};

export const initialState: InitialStateTypes = {
  title: '',
  content: '',
  selectedCategories: [],
  createdCategories: [],
  addedTags: [],
  createCategoryInput: '',
  addTagInput: '',
  imageOption: 'upload',
  photoId: '',
  photoProps: null,
  image: null,
  imageURL: '',
};

function DeleteOneFromArr(arr: string[], item: string) {
  return arr.filter((el) => el !== item);
}

export function reducer(
  state: InitialStateTypes,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case 'SET_STATE':
      return { ...state, [payload.stateProp]: payload.value };
    case 'DEL_FROM_SELECTED_CATEGORIES':
      return {
        ...state,
        selectedCategories: DeleteOneFromArr(
          state.selectedCategories,
          payload
        ),
      };
    case 'SET_CREATED_CATEGORIES':
      return {
        ...state,
        createdCategories: [...state.createdCategories, payload],
      };
    case 'DEL_FROM_CREATED_CATEGORIES':
      return {
        ...state,
        createdCategories: DeleteOneFromArr(
          state.createdCategories,
          payload
        ),
      };
    case 'ADD_TO_ADDED_TAGS':
      return { ...state, addedTags: [...state.addedTags, payload] };
    case 'DEL_FROM_ADDED_TAGS':
      return {
        ...state,
        addedTags: DeleteOneFromArr(state.addedTags, payload),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
