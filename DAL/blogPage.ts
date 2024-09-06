import 'server-only';
import db from '@/db/prismaDb';
import { Post, Stats } from '@prisma/client';
import isUserAuthenticated from '@/lib/isAuthenticated';
import getKindeUser from '@/lib/getKindeUser';

const getPostSelections = {
  title: true,
  content: true,
  unsplashPhotoId: true,
  imageURL: true,
  tags: true,
  stats: true,
  createdAt: true,
  author: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
};

export async function getBlogRoutes() {
  try {
    return await db.post.findMany({
      select: {
        slug: true,
        isActive: true,
        status: true,
        categories: { select: { slug: true } },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching blog routes');
  }
}

export type BlogByUniquePropResponse = {
  title: Post['title'];
  content: Post['content'];
  unsplashPhotoId: Post['unsplashPhotoId'];
  imageURL: Post['imageURL'];
  tags: Post['tags'];
  stats: Stats | null; // Allow for a nullable 'stats' property
  createdAt: Post['createdAt'];
  author: {
    firstName: string;
    lastName: string;
  };
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
    console.error(error);
    throw new Error('An error occurred while fetching blog post');
  }
}

export async function getPostByAuthenticatedUser({
  postId,
}: {
  postId: string;
}) {
  try {
    const isLoggedIn = await isUserAuthenticated();
    if (!isLoggedIn) throw new Error('User is not authenticated');
    const kindeUser = await getKindeUser();
    return await db.post.findFirstOrThrow({
      where: {
        id: postId,
        AND: { author: { email: kindeUser.email as string } },
      },
      select: getPostSelections,
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching blog post');
  }
}
