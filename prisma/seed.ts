import { PrismaClient } from '@prisma/client';
import type { dummyPost } from '../lib/types';
import { slugify } from '../lib/utils';
const db = new PrismaClient();

require('dotenv').config({
  path: ['.env.local', '.env'],
});

async function getDummyPosts() {
  try {
    const response = await fetch(
      'https://dummyjson.com/posts?limit=10&skip=70'
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

const inputBody = {
  profile: {
    given_name: 'Test9',
    family_name: 'User9',
  },
  organization_code: process.env.KINDE_ORG_CODE,
  identities: [
    {
      type: 'email',
      details: {
        email: 'syuen@sbgrp.cc',
      },
    },
  ],
};

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
        `Response status: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function createKindeUser(accessToken: string) {
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
        `Status: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function seed() {
  try {
    const { posts }: { posts: dummyPost[] } = await (
      await getDummyPosts()
    )?.json();
    const postsWithCategories = [
      ...posts.map((post) => {
        post.categories = ['general', 'lifestyle'];
        return post;
      }),
    ];
    // const tokenRes = await getKindeAccessToken();
    // if (tokenRes?.ok) {
    //   const { access_token: accessToken } = await tokenRes.json();
    //   console.log('[access token]: ', accessToken);
    //   const userRes = await createKindeUser(accessToken);
    //   if (userRes?.ok) {
    //     const user = await userRes.json();
    //     console.log('[user]: ', user);

    //   }
    await db.user.create({
      data: {
        kindeId: 'kp_e7ac455b3cbe450aac80ce147f02de6f',
        firstName: inputBody.profile.given_name,
        lastName: inputBody.profile.family_name,
        email: inputBody.identities[0].details.email,
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

seed();
