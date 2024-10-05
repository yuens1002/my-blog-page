import PageHeading from '@/components/PageHeading';
import { getCategoryRoutes } from '@/DAL/blog';

export const dynamicParams = false;

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
  const categorySlugs = await getCategoryRoutes();
  const slugs = categorySlugs.reduce((init, postCategories) => {
    postCategories.categories.forEach((category) => {
      if (!init.find((item) => item.category === category.slug)) {
        init.push({ category: category.slug });
      }
    });
    return init;
  }, [] as CategoryPageProps['params'][]);
  console.log('🚀 ~ slugs ~ slugs:', slugs);
  return slugs;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <PageHeading>
      {params.category.split('%20').join(' ')}
    </PageHeading>
  );
}
