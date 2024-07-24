import { PrismaClient } from '@prisma/client';
import { desc } from 'drizzle-orm';
const db = new PrismaClient();

import { slugify } from '../lib/utils';

async function main() {
  try {
    const posts = slugify(
      "Sometimes it's just better not to be seen."
    );
    // const post = await db.post.findFirst({
    //   where: { author: { lastName: 'User6' } },
    // });
    console.log(JSON.stringify(posts, null, 2));
    // await db.stats.delete({ where: { postId: post?.id } });
    // await db.post.delete({ where: { id: post?.id } });
  } catch (error) {
    console.log(error);
  }
}

main();
