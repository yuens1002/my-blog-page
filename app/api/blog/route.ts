import { NextResponse, type NextRequest } from 'next/server';
import db from '@/db/prismaDb';

export async function GET(request: NextRequest) {
  try {
    const data = await db.post.findMany({
      include: { categories: true },
    });
    console.log('🚀 ~ GET ~ data:', data);

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: 500,
      statusText: 'something went wrong, no posts found',
    });
  }
}
