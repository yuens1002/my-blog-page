'use client';

import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ChevronDown,
  CircleGauge,
  File,
  Home,
  Settings,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function DashboardNav() {
  const pathname = usePathname();
  const dashboardLinks = [
    {
      icon: () => (
        <CircleGauge width="1em" height="1em" aria-hidden="true" />
      ),
      id: 'dashboard',
      href: '/dashboard',
      name: 'dashboard',
    },
    {
      icon: () => (
        <File width="1em" height="1em" aria-hidden="true" />
      ),
      id: 'posts',
      href: '',
      name: 'posts',
      subNav: [
        {
          id: 'all-posts',
          href: '/dashboard/posts',
          name: 'all posts',
        },
        {
          id: 'published',
          href: '/dashboard/posts/published',
          name: 'published',
        },
        {
          id: 'drafts',
          href: '/dashboard/posts/drafts',
          name: 'drafts',
        },
      ],
    },
    {
      icon: () => (
        <TrendingUp width="1em" height="1em" aria-hidden="true" />
      ),
      id: 'seo',
      href: '/dashboard/seo',
      name: 'seo stats',
    },
    {
      icon: () => (
        <Settings width="1em" height="1em" aria-hidden="true" />
      ),
      id: 'settings',
      href: '',
      name: 'settings',
      subNav: [
        {
          id: 'user',
          href: '/dashboard/settings/user',
          name: 'user',
        },
        {
          id: 'blog',
          href: '/dashboard/settings/blog',
          name: 'blog',
        },
        {
          id: 'unsplash',
          href: '/dashboard/settings/unsplash',
          name: 'unsplash',
        },
      ],
    },
  ];
  return (
    <ul className="flex flex-col md:px-4 text-sm xl:text-base">
      {dashboardLinks.map((link) => (
        <Fragment key={link.id}>
          {link.href ? (
            <LinkListItem
              iconFn={link.icon}
              href={link.href}
              pathname={pathname}
              isSubNav={false}
            >
              {link.name}
            </LinkListItem>
          ) : (
            <li className="flex justify-between items-center py-2 md:px-2">
              <div className="flex items-center gap-2">
                {link.icon()}
                <span className="capitalize">{link.name}</span>
              </div>
            </li>
          )}
          {link.subNav && (
            <ul className="item-list pl-2">
              {link.subNav.map((subLink) => (
                <Fragment key={subLink.id}>
                  <LinkListItem
                    href={subLink.href}
                    pathname={pathname}
                    isSubNav={true}
                  >
                    {subLink.name}
                  </LinkListItem>
                </Fragment>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </ul>
  );
}

type LinkListItemProps = {
  children: React.ReactNode;
  iconFn?: () => React.ReactNode;
  href: string;
  pathname: string;
  isSubNav: boolean;
};

function LinkListItem({
  children,
  href,
  iconFn,
  pathname,
  isSubNav,
}: LinkListItemProps) {
  const linkIsCurrent = href === pathname;
  return isSubNav ? (
    <Link href={href}>
      <li
        className={cn(
          'flex items-center p-2 rounded-r-sm border-l border-primary/10 hover:bg-primary/5',
          linkIsCurrent && 'border-primary'
        )}
      >
        <span
          className={cn('capitalize', linkIsCurrent && 'font-bold')}
        >
          {children}
        </span>
      </li>
    </Link>
  ) : (
    <Link href={href}>
      <li className="flex items-center gap-x-2 hover:bg-primary/5 rounded-sm py-2 md:px-2">
        {iconFn && iconFn()}
        <span
          className={cn('capitalize', linkIsCurrent && 'font-bold')}
        >
          {children}
        </span>
      </li>
    </Link>
  );
}
