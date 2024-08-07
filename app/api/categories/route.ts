import db from '@/db/prismaDb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const category = await db.category.findMany();
    return NextResponse.json({
      data: category,
    });
  } catch (error) {
    console.error(
      `[${error}] while fetching categories from database.`
    );
    return new NextResponse(null, {
      status: 500,
      statusText: 'internal server error',
    });
  }
}
