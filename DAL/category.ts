import db from '@/prisma/client';

export async function getCategories() {
  try {
    return await db.category.findMany();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(
        'An unknown error occurred while fetching categories from database.'
      );
    }
  }
}
