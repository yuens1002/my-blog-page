'use client';
import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/PostForm';

export default function CreateNewPostPage() {
  return (
    <div className="px-4 md:px-8 lg:px-0">
      <PageHeading>Create a New Post</PageHeading>
      <NewPostForm />
    </div>
  );
}
