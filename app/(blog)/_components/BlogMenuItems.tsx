import React from 'react';
import isUserAuthenticated from '@/lib/isAuthenticated';
import { notFound } from 'next/navigation';
import MenuNav, { type NavItem } from '@/components/MenuNav';

import {
  preloadCategories,
  getCachedCategories,
} from '@/DAL/utils/get-categories';

export default async function BlogMenuItems() {
  const isLoggedIn = await isUserAuthenticated();
  const navList: NavItem[] = [];
  preloadCategories();
  const categories = await getCachedCategories();
  if (!categories) notFound();
  navList.push(
    {
      icon: {
        name: 'house',
        width: '1em',
        height: '1em',
        className: 'aria-hidden',
      },
      href: '/',
      label: 'home',
    },
    {
      icon: {
        name: 'list',
        width: '1em',
        height: '1em',
        className: 'aria-hidden',
      },
      label: 'categories',
      subNav: [
        ...categories.map(({ slug, label }) => ({
          href: `/${slug}`,
          label,
        })),
      ],
    },
    {
      icon: {
        name: 'phone',
        width: '1em',
        height: '1em',
        className: 'aria-hidden',
      },
      href: '/contact',
      label: 'Contact Us',
    }
  );
  isLoggedIn
    ? navList.push(
        {
          icon: {
            name: 'user-round-pen',
            width: '1em',
            height: '1em',
            className: 'aria-hidden',
          },
          href: '/dashboard',
          label: 'Dashboard',
        },
        {
          icon: {
            name: 'log-out',
            width: '1em',
            height: '1em',
            className: 'aria-hidden',
          },
          href: '/api/auth/logout',
          label: 'Sign Out',
        }
      )
    : navList.push({
        icon: {
          name: 'log-in',
          width: '1em',
          height: '1em',
          className: 'aria-hidden',
        },
        href: '/api/auth/login',
        label: 'Sign In',
      });
  return <MenuNav NavItems={navList} />;
}
