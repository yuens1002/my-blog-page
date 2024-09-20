import { cache } from 'react';
import 'server-only';
import { getCategories } from '../category';

export const preloadCategories = () => {
  void getCachedCategories();
};

export const getCachedCategories = cache(
  async () => await getCategories()
);
