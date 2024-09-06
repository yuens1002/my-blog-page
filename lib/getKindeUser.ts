import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import PostError from '@/lib/processPostError';

export default async function getKindeUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new PostError({
      type: 'text',
      message: 'User not found',
    });
  }
  return user;
}
