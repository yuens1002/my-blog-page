import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  try {
    const data = await db.user.deleteMany();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
}

main();
