import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

require('dotenv').config({
  path: ['.env'],
});

export const runtime = 'edge';

async function main() {
  const neon = new Pool({
    connectionString: process.env.POSTGRES_PRISMA_URL,
  });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();

  return NextResponse.json(users, { status: 200 });
}

main();
