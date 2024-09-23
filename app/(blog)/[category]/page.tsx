import PageHeading from '@/components/PageHeading';

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  console.log('params', params);
  return (
    <PageHeading>
      {params.category.split('%20').join(' ')}
    </PageHeading>
  );
}
