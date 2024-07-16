import prisma from '@/db/prismaDb';

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
