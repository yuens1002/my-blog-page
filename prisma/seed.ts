import { PrismaClient } from '@prisma/client';
import type { dummyPost } from '../lib/types';
import { slugify } from '../lib/utils';

const db = new PrismaClient();

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

function getUserHeaders(accessToken: string) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

async function getKindeAccessToken() {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          audience: `${process.env.KINDE_ISSUER_URL}/api`,
          grant_type: 'client_credentials',
          client_id: process.env.KINDE_CLIENT_ID ?? '',
          client_secret: process.env.KINDE_CLIENT_SECRET ?? '',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `getKindeAccessToken Response status: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

type CreateKindeUserArgs = {
  accessToken: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
};

async function createKindeUser({
  accessToken,
  firstName,
  lastName,
  emailAddress,
}: CreateKindeUserArgs) {
  const inputBody = {
    profile: {
      given_name: firstName,
      family_name: lastName,
    },
    organization_code: process.env.KINDE_ORG_CODE,
    identities: [
      {
        type: 'email',
        details: {
          email: emailAddress,
        },
      },
    ],
  };
  try {
    const response = await fetch(
      `https://${process.env.KINDE_DOMAIN_NAME}.kinde.com/api/v1/user`,
      {
        method: 'POST',
        body: JSON.stringify(inputBody),
        headers: getUserHeaders(accessToken),
      }
    );
    if (!response.ok) {
      throw new Error(
        `createKindeUser status: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

type SeedArgs = {
  skip: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  limit?: number;
};

async function seed({
  skip,
  emailAddress,
  firstName,
  lastName,
  limit,
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
    const tokenRes = await getKindeAccessToken();
    if (tokenRes?.ok) {
      const { access_token: accessToken } = await tokenRes.json();
      const userRes = await createKindeUser({
        accessToken,
        firstName,
        lastName,
        emailAddress,
      });
      if (userRes?.ok) {
        const user = await userRes.json();
        // console.log('[user]: ', JSON.stringify(user, null, 2));
        return await db.user.create({
          data: {
            kindeId: user.id,
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
      }
    }
  } catch (err) {
    console.error(err);
  }
}

seed({
  skip: 40,
  emailAddress: 'user123456776@gmail.com',
  firstName: 'happy',
  lastName: 'user',
}).then((res) => {
  console.log(res);
});
