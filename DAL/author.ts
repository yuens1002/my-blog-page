import 'server-only';
import db from '@/prisma/client';

export async function getAuthorById(authorId: string) {
  try {
    return await db.user.findFirstOrThrow({
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
