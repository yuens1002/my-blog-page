type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  console.log('params', params);
  return <h1>{params.category.split('%20').join(' ')}</h1>;
}
