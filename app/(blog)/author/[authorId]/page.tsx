import React from 'react';

export default function AuthorBlogPage({
  params: { authorId },
}: {
  params: { authorId: string };
}) {
  return <div>Author Blog Page - {authorId}</div>;
}
