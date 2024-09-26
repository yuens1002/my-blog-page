export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>BlogPostPage - {params.slug}</div>;
}
