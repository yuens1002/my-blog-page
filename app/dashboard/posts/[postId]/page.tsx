'use client';

import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/PostForm';

import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { useEffect } from 'react';
import { usePostContext } from '../../_hooks/usePostContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Category, Post } from '@prisma/client';

type EditPostPageProps = { params: { postId: string } };

export default function EditPostPage({
  params: { postId },
}: EditPostPageProps) {
  console.log('🚀 ~ editPostpage:', 'loaded');
  const [, dispatch] = usePostContext();
  const headers = new Headers();
  headers.append('postId', postId);
  headers.append('include', 'categories');
  const [post, error, isPending] = useFetch<
    Post & { categories: Category[] }
  >('/api/post', {
    headers,
  });
  if (error) {
    throw new Error('Could not fetch post');
  }
  useEffect(() => {
    if (post) {
      console.log('🚀 ~ useEffect ~ post:', post);
      dispatch({
        type: 'SET_STATE',
        payload: { stateProp: 'title', value: post.title },
      });
      dispatch({
        type: 'SET_STATE',
        // the db uses null but the textarea requires an empty string
        payload: { stateProp: 'content', value: post.content ?? '' },
      });
      dispatch({
        type: 'SET_STATE',
        payload: {
          stateProp: 'selectedCategories',
          value: post.categories.map((cat) => cat.name),
        },
      });
      dispatch({
        type: 'SET_STATE',
        payload: { stateProp: 'addedTags', value: post.tags },
      });
      if (post.unsplashPhotoId) {
        dispatch({
          type: 'SET_STATE',
          payload: {
            stateProp: 'photoId',
            value: post.unsplashPhotoId,
          },
        });
        dispatch({
          type: 'SET_STATE',
          payload: { stateProp: 'imageOption', value: 'unsplash' },
        });
      } else if (post.imageURL) {
        dispatch({
          type: 'SET_STATE',
          payload: { stateProp: 'imageURL', value: post.imageURL },
        });
        dispatch({
          type: 'SET_STATE',
          payload: { stateProp: 'image', value: post.imageURL },
        });
      }
    }
    return () => {
      dispatch({ type: 'RESET' });
    };
  }, [post]);
  return (
    <div className="relative px-4 md:px-8 lg:px-0">
      {isPending && (
        <div className="w-full h-full bg-black/25 z-0 fixed top-0 left-0 flex items-center justify-center">
          <div className="z-10">
            <Loader />
          </div>
        </div>
      )}
      <header className="flex justify-between items-center gap-4 mb-12">
        <PageHeading>Edit a Post</PageHeading>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </header>
      {post && <NewPostForm postData={post} />}
    </div>
  );
}
