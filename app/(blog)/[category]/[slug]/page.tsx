import BlogPost from '@/components/BlogPost';
import { getBlogByUniqueProp, getBlogRoutes } from '@/DAL/blog';
import { Category, Post } from '@prisma/client';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

type PostPageProps = {
  params: {
    slug: string;
  };
};

type NextRouteKeys = {
  category: Category['slug'];
  slug: Post['slug'];
};

export async function generateStaticParams() {
  const posts = await getBlogRoutes();

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

export default async function BlogPage({ params }: PostPageProps) {
  const post = await getBlogByUniqueProp({ slug: params.slug });
  if (!post) notFound();
  return <BlogPost post={post} />;
}
