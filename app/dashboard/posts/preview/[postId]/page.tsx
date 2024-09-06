import BlogPost from '@/components/BlogPost';
import { getPostByAuthenticatedUser } from '@/DAL/blogPage';

type PreviewPageProps = { params: { postId: string } };

export default async function PreviewPage({
  params: { postId },
}: PreviewPageProps) {
  // need to verify that the post belongs to the user
  const post = await getPostByAuthenticatedUser({ postId });
  return <BlogPost post={post} />;
}
