import { headers } from 'next/headers';
import db from '@/db/prismaDb';
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PostRequestBody } from '@/lib/types';
import { keysToObject } from '@/lib/utils';

export async function GET() {
  const headerList = headers();
  const slug = headerList.get('slug');
  const includeHeader = headerList.get('include');

  if (!slug) throw new Error('Slug not found');
  try {
    const data = await db.post.findFirstOrThrow({
      where: {
        slug,
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
  const { getUser } = getKindeServerSession();

  try {
    const kindeUser = await getUser();
    if (!kindeUser) {
      throw Error('User not found from kinde getUser function');
    }

    const dbUser = await db.user.findFirstOrThrow({
      where: { email: kindeUser.email as string },
    });

    const {
      title,
      content,
      status,
      imageURL,
      slug,
      tags,
      unsplashPhotoId,
      categories,
    }: PostRequestBody = await request.json();

    const data = await db.post.create({
      data: {
        title,
        ...(content && { content }),
        ...(status && { status }),
        ...(imageURL && { imageURL }),
        authorId: dbUser.id,
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
