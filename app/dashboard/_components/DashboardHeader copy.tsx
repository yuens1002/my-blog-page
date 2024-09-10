'use server';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

import { Nav, NavLink } from '@/components/Nav';
import { PanelTop } from 'lucide-react';
import isUserAuthenticated from '@/lib/isAuthenticated';

export default async function DashboardHeader() {
  const isLoggedIn = await isUserAuthenticated();

  const dashboardLinks = [
    { id: 'posts', href: '/dashboard/posts', name: 'posts' },
    { id: 'seo', href: '/dashboard/seo', name: 'seo stats' },
    { id: 'profile', href: '/dashboard/profile', name: 'profile' },
  ];

  return (
    <header className={'bg-indigo-700'}>
      <nav className="flex justify-between items-center px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-block leading-5 text-xl pr-4 text-slate-50 font-thin border-r-2 border-fuchsia-600"
        >
          my<span className="font-normal">blog</span>
          <br />
          <span className="text-sm inline-block text-primary-foreground">
            Dashboard
          </span>
        </Link>
        <Nav>
          {dashboardLinks.map((link) => (
            <NavLink key={link.id} href={link.href}>
              <span className="capitalize">{link.name}</span>
            </NavLink>
          ))}
          <Button asChild variant={'link'} size={'sm'}>
            <Link href="/" className="pl-12 text-primary-foreground">
              <PanelTop className="mr-2 h-4 w-4" /> visit blog
            </Link>
          </Button>
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
