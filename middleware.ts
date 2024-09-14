import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default function middleware(req: Request) {
  return withAuth(req, { isReturnToCurrentPage: true });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
