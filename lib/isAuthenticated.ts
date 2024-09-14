import 'server-only';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
const { isAuthenticated } = getKindeServerSession();

export default async function isUserAuthenticated() {
  return await isAuthenticated();
}
