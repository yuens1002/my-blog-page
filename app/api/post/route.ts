import { headers } from 'next/headers';
import db from '@/db/prismaDb';

// refactor to use NextResponse

export async function GET() {
  const headerList = headers();
  const slug = headerList.get('slug');

  if (!slug) throw new Error('slug not found');
  try {
    const post = await db.post.findFirstOrThrow({
      where: {
        slug,
      },
      include: {
        stats: true,
      },
    });
    return Response.json({
      status: 200,
      statusText: 'ok',
      ok: true,
      data: post,
    });
  } catch (error) {
    return Response.json({
      status: 404,
      statusText: 'not found',
      data: null,
      ok: false,
    });
  }
}
