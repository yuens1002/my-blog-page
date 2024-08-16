import { UnsplashPhoto } from '@/lib/types';
import { Post } from '@prisma/client';

type InitialStateTypes = {
  selectedCategories: string[];
  createdCategories: string[];
  addedTags: string[];
  createCategoryInput: string;
  addTagInput: string;
  imageOption: 'upload' | 'unsplash';
  photoId: string;
  photoProps: UnsplashPhoto | null;
  createdPostData: Post | null;
  image: string | null;
};

export const initialState: InitialStateTypes = {
  selectedCategories: [],
  createdCategories: [],
  addedTags: [],
  createCategoryInput: '',
  addTagInput: '',
  imageOption: 'upload',
  photoId: '',
  photoProps: null,
  createdPostData: null,
  image: null,
};

function DeleteOneFromArr(arr: string[], item: string) {
  return arr.filter((el) => el !== item);
}

export function reducer(
  state: InitialStateTypes,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: payload };
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
    case 'SET_CREATE_CATEGORY_INPUT':
      return { ...state, createCategoryInput: payload };
    case 'SET_ADD_TAG_INPUT':
      return { ...state, addTagInput: payload };
    case 'SET_IMAGE_OPTION':
      return { ...state, imageOption: payload };
    case 'SET_PHOTO_ID':
      return { ...state, photoId: payload };
    case 'SET_PHOTO_PROPS':
      return { ...state, photoProps: payload };
    case 'SET_CREATED_POST_DATA':
      return { ...state, createdPostData: payload };
    case 'SET_IMAGE':
      return { ...state, image: payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
