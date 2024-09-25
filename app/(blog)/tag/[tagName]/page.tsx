import React from 'react';

export default function TagBlogPage({
  params: { tagName },
}: {
  params: { tagName: string };
}) {
  return <div>Tag Page - {tagName}</div>;
}
