import BlogHeader from './_components/BlogHeader';

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <BlogHeader />
      <main className="flex py-8 md:py-12">{children}</main>
    </>
  );
}
