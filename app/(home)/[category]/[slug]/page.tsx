import PageHeading from '@/components/PageHeading';
import { Separator } from '@/components/ui/separator';
import UnsplashPhotoComp from '@/components/UnsplashPhotoComp';
import type {
  Category,
  Post,
  PostWithRelations,
} from '@/prisma/generated/zod';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: {
    slug: string;
  };
};

type NextRouteKeys = {
  category: Category['slug'];
  slug: Post['slug'];
};

export async function generateStaticParams() {
  const response = await fetch('/api/posts').then((res) =>
    res.json()
  );

  if (!response.ok) {
    console.error('bad response from /posts API route');
  }

  const posts: Omit<PostWithRelations, 'author' | 'stats'>[] =
    response.data;

  const postRoutes = posts.reduce((init, post) => {
    post.status === 'PUBLISHED' &&
      post.categories.forEach((category: Category) => {
        init.push({
          category: category.slug,
          slug: post.slug,
        });
      });
    return init;
  }, [] as NextRouteKeys[]);

  console.log('🚀 ~ postRoutes ~ postRoutes:', postRoutes);

  return postRoutes;
}

export default async function PostPage({ params }: PostPageProps) {
  const response = await fetch('/api/post', {
    headers: { slug: params.slug },
  });

  const { data, ok } = await response.json();
  const {
    title,
    author,
    content,
    categories,
    tags,
    unsplashPhotoId,
    createdAt,
    status,
  } = data as PostWithRelations;
  console.log('🚀 ~ PostPage ~ author:', data);
  if (!ok) {
    notFound();
  }

  const authorName = author.firstName + ' ' + author.lastName;
  const localDateString = new Date(createdAt).toLocaleDateString();

  return (
    <article className="px-4 py-4 md:container md:py-8">
      <PageHeading>{title}</PageHeading>
      <h6 className="flex gap-4 pt-4 text-muted-foreground">
        <span>{authorName}</span>
        <span>
          <Separator orientation="vertical" />
        </span>
        <span>{`6 min read`}</span>
        <span>
          <Separator orientation="vertical" />
        </span>
        <span>{`written - ${localDateString}`}</span>
      </h6>
      {unsplashPhotoId ? (
        <UnsplashPhotoComp photoId={unsplashPhotoId} />
      ) : null}
      <div className="md:columns-2 lg:columns-3 md:gap-6 lg:gap-8 py-12">
        <p className="prose first-letter:font-extrabold first-letter:text-8xl pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
        <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
        <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked`}</p>
      </div>
    </article>
  );
}
