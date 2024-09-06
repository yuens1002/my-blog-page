'use client';

import PageHeading from '@/components/PageHeading';
import PostForm from '@/app/dashboard/posts/_components/PostForm';
import { usePostContext } from '../../_hooks/usePostContext';
import { useEffect } from 'react';

export default function CreateNewPostPage() {
  const [, dispatch] = usePostContext();
  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, []);
  return (
    <div className="lg:container">
      <PageHeading>Create a New Post</PageHeading>
      <PostForm />
    </div>
  );
}
