import 'server-only';
import db from '@/prisma/client';

export async function getAuthorById(authorId: string) {
  try {
    return await db.user.findUnique({
      where: {
        id: authorId,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting the author.'
      );
    }
  }
}

export async function getAuthorRoutes() {
  try {
    return await db.user.findMany({
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while getting author id.'
      );
    }
  }
}
