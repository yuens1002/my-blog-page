import PageHeading from '@/components/PageHeading';
import { getCategoryRoutes, getPostByCategory } from '@/DAL/blog';
import BlogSection from '../_components/BlogSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  const categorySlugs = await getCategoryRoutes();
  return categorySlugs.reduce((init, postCategories) => {
    postCategories.categories.forEach((category) => {
      if (!init.find((item) => item.category === category.slug)) {
        init.push({ category: category.slug });
      }
    });
    return init;
  }, [] as CategoryPageProps['params'][]);
}

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const posts = await getPostByCategory(params.category);
  return (
    <section className="container">
      <div className="text-sm pb-2 text-primary/50">
        {`categories / ${params.category.split('%20').join(' ')}`}
      </div>
      <BlogSection
        posts={posts}
        title={`${params.category.split('%20').join(' ')}`}
        heading={1}
        fallbackText="No post found in the category"
      />
    </section>
  );
}
