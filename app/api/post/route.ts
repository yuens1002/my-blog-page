import { headers } from 'next/headers';
import db from '@/db/prismaDb';
import { NextResponse } from 'next/server';
import type { PatchRequestBody, PostRequestBody } from '@/lib/types';
import { keysToObject, slugify } from '@/lib/utils';

export async function GET() {
  const headerList = headers();
  const postId = headerList.get('postId');
  const includeHeader = headerList.get('include');

  if (!postId) throw new Error('Post not found');
  try {
    const data = await db.post.findFirstOrThrow({
      where: {
        id: postId,
      },
      ...(includeHeader && {
        include: keysToObject(includeHeader.split(', ')),
      }),
    });
    console.log('🚀 ~ POST ~ data:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: 404,
      statusText: 'Post not found',
    });
  }
}

export async function PATCH(request: Request) {
  const { postId, authorId, categories, ...rest }: PatchRequestBody =
    await request.json();
  console.log('🚀 ~ PATCH ~ rest:', rest);
  try {
    const data = await db.post.update({
      where: { id: postId, AND: { authorId } },
      data: {
        categories: {
          set: [],
          ...(categories && {
            connectOrCreate: categories.map((category) => ({
              where: {
                name: category,
              },
              create: {
                name: category,
                slug: slugify(category),
              },
            })),
          }),
        },
        ...rest,
      },
      include: {
        categories: true,
      },
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: 500,
      statusText: 'An error occurred while updating the post',
    });
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      content,
      status,
      imageURL,
      slug,
      tags,
      unsplashPhotoId,
      categories,
      authorId,
    }: PostRequestBody = await request.json();

    const data = await db.post.create({
      data: {
        title,
        ...(content && { content }),
        ...(status && { status }),
        ...(imageURL && { imageURL }),
        authorId,
        slug,
        ...(status === 'PUBLISHED' && { isActive: true }),
        ...(status === 'PUBLISHED' && { publishedAt: new Date() }),
        ...(tags && { tags }),
        ...(status === 'PUBLISHED' && { status }),
        ...(unsplashPhotoId && { unsplashPhotoId }),
        ...(categories && {
          categories: {
            connectOrCreate: [
              ...categories.map((category) => ({
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
        }),
      },
      include: {
        categories: true,
      },
    });
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else console.error(error);
    return new NextResponse(null, {
      status: 500,
      statusText: 'An error occurred while creating a post',
    });
  }
}
