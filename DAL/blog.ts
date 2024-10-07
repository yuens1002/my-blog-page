import 'server-only';

import db from '@/prisma/client';
import { Post, Stats } from '@prisma/client';
import { FeaturedPostSchema, FeaturedPostType } from '@/lib/types';

export async function getLatestPosts() {
  try {
    return await db.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 1,
      include: {
        categories: true,
        author: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting the latest blog post.'
      );
    }
  }
}

export async function getFeaturedPosts(): Promise<
  FeaturedPostType[]
> {
  try {
    const posts = await db.post.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 6,
      include: {
        author: true,
        categories: true,
      },
    });

    // Validate the posts with the schema
    return FeaturedPostSchema.array().parse(posts);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting featured blog posts.'
      );
    }
    return [];
  }
}

export type BlogByUniquePropResponse = {
  title: Post['title'];
  content: Post['content'];
  unsplashPhotoId: Post['unsplashPhotoId'];
  imageURL: Post['imageURL'];
  tags: Post['tags'];
  stats: Stats | null; // Allow for a nullable 'stats' property
  publishedAt: Post['publishedAt'];
  author: {
    firstName: string;
    lastName: string;
    id: string;
  };
};

const getPostSelections = {
  title: true,
  content: true,
  unsplashPhotoId: true,
  imageURL: true,
  tags: true,
  stats: true,
  publishedAt: true,
  author: {
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  },
};

export async function getBlogByUniqueProp(
  prop: Record<string, string>
) {
  try {
    return await db.post.findFirstOrThrow({
      where: {
        ...prop,
      },
      select: getPostSelections,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting a specific post.'
      );
    }
  }
}

export async function getBlogRoutes() {
  try {
    return await db.post.findMany({
      select: {
        slug: true,
        status: true,
        categories: { select: { slug: true } },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting route to posts.'
      );
    }
  }
}

export async function getCategoryRoutes() {
  try {
    return await db.post.findMany({
      select: {
        categories: { select: { slug: true } },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      'An error occurred while fetching category routes'
    );
  }
}

export async function getPostByCategory(
  category: string,
  skip = 0,
  take = 6
): Promise<FeaturedPostType[]> {
  try {
    const posts = await db.post.findMany({
      where: {
        status: 'PUBLISHED',
        AND: {
          categories: {
            some: {
              slug: category,
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take,
      skip,
      include: {
        categories: true,
        author: true,
      },
    });
    // Validate the posts with the schema
    return FeaturedPostSchema.array().parse(posts);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting blog posts of a category.'
      );
    }
    return [];
  }
}

export async function getPostByAuthor(
  authorId: string,
  skip = 0,
  take = 6
): Promise<FeaturedPostType[]> {
  try {
    const posts = await db.post.findMany({
      where: {
        status: 'PUBLISHED',
        authorId,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take,
      skip,
      include: {
        categories: true, // Include the categories of the post
        author: true, // Include the author of the post
      },
    });
    // Validate the posts with the schema
    return FeaturedPostSchema.array().parse(posts);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting blog posts of an author.'
      );
    }
    return [];
  }
}
