import { Button } from '@/components/ui/button';
import PageHeading from '../../../components/PageHeading';
import Link from 'next/link';
import db from '@/db/prismaDb';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import PostsTable from './_components/PostsTable';
import { getPostsByAuthor } from '@/db/operations';

export default async function DashboardPostsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const posts = await getPostsByAuthor(user?.email || '');

  return (
    <>
      <header className="flex justify-between items-center gap-4 mb-12">
        <PageHeading>Posts</PageHeading>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </header>
      {posts && posts.length > 0 ? (
        <PostsTable posts={posts} />
      ) : (
        <p>{`Let's write a post and check back`}</p>
      )}
    </>
  );
}
