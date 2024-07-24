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
