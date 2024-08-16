'use client';
import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/new/_components/NewPostForm';
import { NewPostProvider } from '@/app/dashboard/_hooks/useNewPostContext';

export default function CreateNewPostPage() {
  return (
    <NewPostProvider>
      <div className="px-4 md:px-8 lg:px-0">
        <PageHeading>Create a New Post</PageHeading>
        <NewPostForm />
      </div>
    </NewPostProvider>
  );
}
