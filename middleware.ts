import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import isUserAuthenticated from './lib/isAuthenticated';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const isLoggedIn = await isUserAuthenticated();

  if (!isLoggedIn)
    return NextResponse.redirect(
      new URL('/api/auth/login', request.url)
    );
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
