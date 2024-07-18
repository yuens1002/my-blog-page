'use server';

import { UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import prisma from '@/db/prismaDb';
import {
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Nav, NavLink } from '@/components/Nav';

export default async function SiteHeader() {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
  const categories = await prisma.category.findMany();

  return (
    <header className={'bg-primary'}>
      <nav className="flex justify-between items-center px-4 py-8">
        <Link
          href="/"
          className="inline-block leading-5 text-xl pr-4 text-slate-50 font-thin border-r-2 border-indigo-600"
        >
          my
          <br />
          <span className="font-normal">blog</span>
        </Link>
        <Nav>
          {categories.map((link) => (
            <NavLink
              key={link.id}
              href={`/${encodeURIComponent(link.slug)}`}
            >
              <span className="capitalize">{link.name}</span>
            </NavLink>
          ))}
          {isLoggedIn && (
            <Button asChild variant={'link'} size={'sm'}>
              <Link
                href="/dashboard"
                className="pl-12 text-primary-foreground"
              >
                <UserRoundPen className="mr-2 h-4 w-4" /> back to
                dashboard
              </Link>
            </Button>
          )}
          <Button variant={'secondary'} size={'sm'} asChild>
            {isLoggedIn ? (
              <LogoutLink>Sign out</LogoutLink>
            ) : (
              <LoginLink>Sign in</LoginLink>
            )}
          </Button>
        </Nav>
      </nav>
    </header>
  );
}
