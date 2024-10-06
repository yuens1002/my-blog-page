import UnsplashPhoto from '@/components/UnsplashPhoto';
import { FeaturedPostType } from '@/lib/types';
import InlineLink from '@/components/InlineLink';
import { cn } from '@/lib/utils';
import { createElement } from 'react';
import PageHeading from '@/components/PageHeading';

type BlogFeatureSectionProps = {
  posts: FeaturedPostType[];
  title: string;
  fallbackText: string;
  children?: React.ReactNode;
  heading?: number;
} & React.HTMLAttributes<HTMLElement>;

export default function BlogSection({
  posts,
  title,
  fallbackText,
  className,
  heading = 2,
  children,
}: BlogFeatureSectionProps) {
  return (
    <section>
      <div
        className={cn('flex justify-between items-center', className)}
      >
        {heading === 1 ? (
          <PageHeading>{title}</PageHeading>
        ) : (
          createElement(
            `h${heading}`,
            { className: 'text-2xl font-semibold capitalize' },
            title
          )
        )}
        {children}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-16 gap-y-12 pt-8">
        {posts ? (
          posts.map((post, i) => (
            <article key={post.id} className="flex flex-col">
              <h3 className="text-xl font-bold pb-4">{post.title}</h3>
              {post.unsplashPhotoId ? (
                <UnsplashPhoto photoId={post.unsplashPhotoId} />
              ) : null}

              <div className="pt-2">
                <p className="text-sm">
                  Author:{' '}
                  <InlineLink href={`/author/${post.author.id}`}>
                    {`${post.author.firstName} ${'&'} ${
                      post.author.lastName
                    }`}
                  </InlineLink>
                </p>
                <p className="text-sm">
                  Published:{' '}
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <p className="pt-2">
                  {post.excerpt} -{' '}
                  <InlineLink
                    href={`${post.categories[0].slug}/${post.slug}`}
                  >
                    continue reading
                  </InlineLink>
                </p>
              </div>
            </article>
          ))
        ) : (
          <p>{fallbackText}</p>
        )}
      </div>
    </section>
  );
}
