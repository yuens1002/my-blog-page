import { getCategoryRoutes, getPostByCategory } from '@/DAL/blog';
import BlogSection from '../_components/BlogSection';

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
  const categoryName = params.category.split('%20').join(' ');
  return (
    <section className="container">
      <div className="text-sm pb-2 text-primary/50">
        {`categories / ${categoryName}`}
      </div>
      <BlogSection
        posts={posts}
        title={categoryName}
        heading={1}
        fallbackText="No post found in category"
      />
    </section>
  );
}
