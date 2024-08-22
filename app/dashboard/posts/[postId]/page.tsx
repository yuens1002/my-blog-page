'use client';

import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/PostForm';

import { useFetch } from '@/hooks/useFetch';
import { PostWithRelations } from '@/prisma/generated/zod';
import Loader from '@/components/Loader';
import { useLayoutEffect } from 'react';
import { usePostContext } from '../../_hooks/usePostContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type EditPostPageProps = { params: { postId: string } };

export default function EditPostPage({
  params: { postId },
}: EditPostPageProps) {
  const [, dispatch] = usePostContext();
  const headers = new Headers();
  headers.append('postId', postId);
  headers.append('include', 'categories');
  const [post, error, isPending] = useFetch<PostWithRelations>(
    '/api/post',
    {
      headers,
    }
  );
  if (error) {
    throw new Error('Could not fetch post');
  }
  useLayoutEffect(() => {
    if (post) {
      dispatch({
        type: 'SET_SELECTED_CATEGORIES',
        payload: post.categories.map((cat) => cat.name),
      });
      dispatch({ type: 'SET_ADDED_TAGS', payload: post.tags });
      dispatch({ type: 'SET_POST_DATA', payload: post });
      if (post.unsplashPhotoId) {
        dispatch({
          type: 'SET_PHOTO_ID',
          payload: post.unsplashPhotoId,
        });
        dispatch({ type: 'SET_IMAGE_OPTION', payload: 'unsplash' });
      } else if (post.imageURL) {
        dispatch({ type: 'SET_IMAGE', payload: post.imageURL });
      }
    }
    return () => {
      dispatch({ type: 'RESET' });
    };
  }, [post]);
  return (
    <div className="relative px-4 md:px-8 lg:px-0">
      <header className="flex justify-between items-center gap-4 mb-12">
        <PageHeading>Edit a Post</PageHeading>
        <Button asChild onClick={() => dispatch({ type: 'RESET' })}>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </header>
      {isPending ? (
        <div className="w-full h-full bg-black/25 z-0 fixed top-0 left-0 flex items-center justify-center">
          <div className="z-10">
            <Loader />
          </div>
        </div>
      ) : (
        <NewPostForm />
      )}
    </div>
  );
}
