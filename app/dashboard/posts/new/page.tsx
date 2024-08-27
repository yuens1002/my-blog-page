'use client';

import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/PostForm';
import { usePostContext } from '../../_hooks/usePostContext';
import { useEffect } from 'react';

export default function CreateNewPostPage() {
  const [, dispatch] = usePostContext();
  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, []);
  return (
    <div className="px-4 md:px-8 lg:px-0">
      <PageHeading>Create a New Post</PageHeading>
      <NewPostForm />
    </div>
  );
}
