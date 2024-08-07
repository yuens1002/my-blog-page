import PageHeading from '@/components/PageHeading';
import NewPostForm from '@/app/dashboard/posts/_components/newPost/NewPostForm';

export default function CreateNewPostPage() {
  return (
    <div className="px-4 md:px-8 lg:px-0">
      <PageHeading>Create a New Post</PageHeading>
      <NewPostForm />
    </div>
  );
}
