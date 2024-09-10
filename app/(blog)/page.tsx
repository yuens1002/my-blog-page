import prisma from '@/db/prismaDb';

export default async function Homepage() {
  const users = await prisma.user.findMany();
  return <div className="container">home</div>;
}
