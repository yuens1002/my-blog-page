import { NextResponse } from 'next/server';
import db from '@/prisma/client';

export const runtime = 'edge';

export async function GET(request: Request) {
  const users = await db.user.findMany();

  return NextResponse.json(users, { status: 200 });
}
