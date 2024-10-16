import BlogPost from '@/components/BlogPost';
import { getBlogByUniqueProp, getBlogRoutes } from '@/DAL/blog';
import { Category, Post } from '@prisma/client';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

type NextRouteKeys = {
  category: Category['slug'];
  slug: Post['slug'];
};

export async function generateStaticParams() {
  const posts = await getBlogRoutes();
  if (!posts)
    return <p>Let&#39;s write a post and revisit this page...</p>;
  const postRoutes = posts.reduce((init, post) => {
    post.status === 'PUBLISHED' &&
      post.categories.forEach((category) => {
        init.push({
          category: category.slug,
          slug: post.slug,
        });
      });
    return init;
  }, [] as NextRouteKeys[]);

  return postRoutes;
}

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getBlogByUniqueProp({ slug: params.slug });
  if (!post) notFound();
  return <BlogPost post={post} />;
}
