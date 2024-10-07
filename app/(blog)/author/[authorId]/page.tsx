import { getAuthorById } from '@/DAL/author';
import { getPostByAuthor } from '@/DAL/blog';
import { notFound } from 'next/navigation';
import BlogSection from '@/app/(blog)/_components/BlogSection';

export default async function AuthorBlogPage({
  params: { authorId },
}: {
  params: { authorId: string };
}) {
  const posts = await getPostByAuthor(authorId);
  const author = await getAuthorById(authorId);
  if (!author) notFound();
  const authorName = `${author.firstName} ${author.lastName}`;
  return (
    <section className="container">
      <div className="text-sm pb-2 text-primary/50">
        post(s) written by
      </div>
      <BlogSection
        posts={posts}
        title={authorName}
        heading={1}
        fallbackText="No post found by the author"
      />
    </section>
  );
}
