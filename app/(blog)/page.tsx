import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/button';
import { getFeaturedPosts, getLatestPosts } from '@/DAL/blog';
import Link from 'next/link';
import { badgeVariants } from '@/components/ui/badge';
import { Fragment } from 'react';

export default async function Homepage() {
  const latestPost = await getLatestPosts();
  const featuredPosts = await getFeaturedPosts();
  return (
    <section className="container">
      {latestPost ? (
        latestPost.map((post) => (
          <article key={post.id}>
            <div className="flex items-center gap-x-4">
              <span>
                {post.categories.length > 1
                  ? 'categories'
                  : 'category'}
              </span>
              <span>&#8594;</span>
              {post.categories.map((category) => (
                <Fragment key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className={badgeVariants({ variant: 'default' })}
                  >
                    {category.label}
                  </Link>
                </Fragment>
              ))}
            </div>
            <PageHeading className="py-4">{post.title}</PageHeading>
            <p>excerpt: {post.excerpt}</p>
            <p>
              author:{' '}
              {`${post.author.firstName} ${'&'} ${
                post.author.lastName
              }`}
            </p>
            <p>
              published on:{' '}
              {post.publishedAt &&
                new Date(post.publishedAt).toLocaleDateString()}
            </p>
            <p>
              tags: {post.tags.map((tag) => `#${tag}`).join(', ')}
            </p>
          </article>
        ))
      ) : (
        <p>
          No posts available. Add a post first then come back again
        </p>
      )}
      <section>
        <div className="flex justify-between items-center py-8">
          <h2 className="text-2xl font-semibold">Featured Posts</h2>
          <Button asChild>
            <Link href="/featured">View All Featured Posts</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-12 gap-y-8 pt-8">
          {featuredPosts ? (
            featuredPosts.map((post, i) => (
              <article key={post.id}>
                <h3 className="text-xl pb-4 font-bold">
                  {post.title}
                </h3>
                <p>excerpt: {post.excerpt}</p>
                <p>
                  author:{' '}
                  {`${post.author.firstName} ${'&'} ${
                    post.author.lastName
                  }`}
                </p>
                <p>
                  published on:{' '}
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </article>
            ))
          ) : (
            <p>
              No featured posts available. Mark a post featured first
              then come back again
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
