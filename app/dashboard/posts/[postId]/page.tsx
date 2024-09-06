'use client';

import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/PostForm';

import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { usePostContext } from '../../_hooks/usePostContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Category, Post } from '@prisma/client';
import FullPageLoader from '@/components/FullPageLoader';

type EditPostPageProps = { params: { postId: string } };

export default function EditPostPage({
  params: { postId },
}: EditPostPageProps) {
  console.log('🚀 ~ edit Post page:', 'loaded');
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
  // probably don't need useEffect here
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

  if (isPending) {
    return <FullPageLoader />;
  }
  return (
    <div className="relative lg:container">
      <header className="flex justify-between items-center gap-4 mb-12">
        <PageHeading>Edit a Post</PageHeading>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </header>
      {post ? <NewPostForm postData={post} /> : null}
    </div>
  );
}
