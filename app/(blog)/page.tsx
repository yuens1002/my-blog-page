import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/button';
import { getFeaturedPosts, getLatestPosts } from '@/DAL/blog';
import Link from 'next/link';
import { badgeVariants } from '@/components/ui/badge';
import { Fragment } from 'react';
import UnsplashPhotoComp from '@/components/UnsplashPhoto';

export default async function Homepage() {
  const latestPost = await getLatestPosts();
  const featuredPosts = await getFeaturedPosts();
  return (
    <section className="container">
      {latestPost ? (
        latestPost.map((post) => (
          <article key={post.id} className="flex flex-col gap-y-4">
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
            <PageHeading>{post.title}</PageHeading>
            {post.unsplashPhotoId ? (
              <UnsplashPhotoComp
                photoId={post.unsplashPhotoId}
                className="lg:h-[40rem]"
              />
            ) : null}
            <div className="flex md:flex-row flex-col gap-y-4 md:gap-y-0 md:items-center">
              <div className="flex flex-col gap-2 md:basis-1/4 md:border-r md:border-r-primary/10 text-sm pr-8">
                <p>
                  Author:{' '}
                  <Link
                    href={`/author/${post.author.id}`}
                    className="font-semibold hover:underline"
                  >{`${post.author.firstName} ${'&'} ${
                    post.author.lastName
                  }`}</Link>
                </p>
                <p>
                  Published:{' '}
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  Tags:
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className={badgeVariants({
                        variant: 'outline',
                      })}
                    >{`#${tag}`}</Link>
                  ))}
                </div>
              </div>
              <p className="first-letter:text-3xl md:basis-3/4 md:pl-8">
                {post.excerpt} -{' '}
                <Link
                  className="font-semibold hover:underline"
                  href={`${post.categories[0].slug}/${post.slug}`}
                >
                  continue reading
                </Link>
              </p>
            </div>
          </article>
        ))
      ) : (
        <p>
          No posts available. Add a post first then come back again
        </p>
      )}
      <section>
        <div className="flex justify-between items-center pt-16 pb-12">
          <h2 className="text-2xl font-semibold">Featured Posts</h2>
          <Button asChild>
            <Link href="/featured">View All Featured Posts</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-16 gap-y-12 pt-8">
          {featuredPosts ? (
            featuredPosts.map((post, i) => (
              <article key={post.id} className="flex flex-col">
                <h3 className="text-xl font-bold pb-4">
                  {post.title}
                </h3>
                {post.unsplashPhotoId ? (
                  <UnsplashPhotoComp photoId={post.unsplashPhotoId} />
                ) : null}

                <div className="pt-2">
                  <p className="text-sm">
                    Author:{' '}
                    <Link
                      href={`/author/${post.author.id}`}
                      className="font-semibold hover:underline"
                    >{`${post.author.firstName} ${'&'} ${
                      post.author.lastName
                    }`}</Link>
                  </p>
                  <p className="text-sm">
                    Published:{' '}
                    {post.publishedAt &&
                      new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="pt-2">
                    {post.excerpt} -{' '}
                    <Link
                      className="font-semibold hover:underline"
                      href={`${post.categories[0].slug}/${post.slug}`}
                    >
                      continue reading
                    </Link>
                  </p>
                </div>
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
