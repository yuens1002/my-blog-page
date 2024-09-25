import db from '@/prisma/client';

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

export async function getFeaturedPosts() {
  try {
    return await db.post.findMany({
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
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting featured blog posts.'
      );
    }
  }
}
