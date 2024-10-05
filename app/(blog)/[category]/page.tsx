import PageHeading from '@/components/PageHeading';
import { getCategoryRoutes } from '@/DAL/blog';

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

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <PageHeading>
      {params.category.split('%20').join(' ')}
    </PageHeading>
  );
}
