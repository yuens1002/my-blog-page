import isUserAuthenticated from '@/lib/isAuthenticated';
import { notFound } from 'next/navigation';
import type { NavItem } from '@/lib/types';
import {
  preloadCategories,
  getCachedCategories,
} from '@/DAL/utils/get-categories';
import MenuNav from '@/components/navigation/MenuNav';
import MenuItem from '@/components/navigation/MenuItem';

export default async function BlogMenu() {
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
        { href: '/category/featured', label: 'Featured' },
        ...categories.map(({ slug, label }) => ({
          href: `/category/${slug}`,
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
  return <MenuNav items={navList} ItemComp={MenuItem} />;
}
