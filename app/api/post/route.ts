import { headers } from 'next/headers';
import db from '@/db/prismaDb';
import { NextResponse } from 'next/server';
import { PostRequestBody } from '@/lib/types';
import { keysToObject } from '@/lib/utils';

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
        ...(tags && { tags }),
        isPublished: true,
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
                  slug: slug,
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
