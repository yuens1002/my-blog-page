import { NextResponse, type NextRequest } from 'next/server';
import db from '@/db/prismaDb';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  console.log('route being called');
  const searchParams = request.nextUrl.searchParams;
  const authorEmail = searchParams.get('author-email');
  const take = Number(searchParams.get('take'));
  const skip = Number(searchParams.get('skip'));
  console.log('🚀 ~ GET ~ skip:', skip);
  const headerList = request.headers;
  const include = headerList
    .get('include')
    ?.split(', ')
    .reduce((acc, curr) => {
      return (acc[curr] = true), acc;
    }, {} as Record<string, boolean>);
  try {
    const data = await db.post.findMany({
      take,
      skip,
      where: {
        author: {
          email: authorEmail || '',
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      ...(include && { include }),
    });
    const count = await db.post.count({
      where: { author: { email: authorEmail || '' } },
    });
    revalidatePath('/dashboard/posts', 'page');
    return NextResponse.json({ data, count });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: 404,
      statusText: 'No posts found with from author email given',
    });
  }
}
