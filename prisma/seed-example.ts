import db from '@/prisma/client';
import type { dummyPost } from '../lib/types';
import { slugify } from '../lib/utils';

require('dotenv').config({
  path: ['.env'],
});

async function getDummyPosts({
  limit = 10,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}) {
  try {
    const response = await fetch(
      `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
    );
    if (!response.ok) {
      throw new Error(
        `Response status: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

type SeedArgs = {
  skip?: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  limit?: number;
  kindeId: string;
};

async function seed({
  skip = 0,
  limit = 10,
  emailAddress,
  firstName,
  lastName,
  kindeId,
}: SeedArgs) {
  try {
    const { posts }: { posts: dummyPost[] } = await (
      await getDummyPosts({ limit, skip })
    )?.json();
    const postsWithCategories = [
      ...posts.map((post) => {
        post.categories = ['general', 'lifestyle'];
        return post;
      }),
    ];
    return await db.user.create({
      data: {
        kindeId,
        firstName,
        lastName,
        email: emailAddress,
        posts: {
          create: [
            ...postsWithCategories.map((post) => ({
              title: post.title,
              content: post.body,
              stats: {
                create: {
                  likes: Number(post.reactions.likes),
                  dislikes: Number(post.reactions.dislikes),
                  views: Number(post.views),
                },
              },
              categories: {
                connectOrCreate: [
                  ...post.categories.map((category) => ({
                    where: {
                      name: category,
                    },
                    create: {
                      name: category,
                      slug: slugify(category),
                    },
                  })),
                ],
              },
              slug: slugify(post.title),
              tags: post.tags,
            })),
          ],
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
}

// create kinde user first, then fill out the exact info below before seeding
seed({
  kindeId: '',
  emailAddress: '',
  firstName: '',
  lastName: '',
}).then((res) => {
  console.log(res);
});
