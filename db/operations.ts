import { NextRequest, NextResponse } from 'next/server';
import db from './prismaDb';

export async function getPostsByAuthor(authorEmail: string) {
  try {
    return await db.post.findMany({
      where: {
        author: {
          email: authorEmail,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

export async function findPostBy(identifier: string, value: string) {
  try {
    const post = await db.post.findFirstOrThrow({
      where: {
        [identifier]: value,
      },
      include: {
        stats: true,
      },
    });
    return post;
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error });
  }
}
