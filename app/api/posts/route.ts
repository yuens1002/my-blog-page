import db from '@/db/prismaDb';

// refactor using NextResponse

export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: {
        categories: true,
        stats: true,
      },
    });
    return Response.json({
      status: 200,
      statusText: 'ok',
      ok: true,
      data: posts,
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
