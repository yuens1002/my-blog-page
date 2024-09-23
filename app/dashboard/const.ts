import { type NavItem } from '@/components/navigation/MenuNav';

export const navList: NavItem[] = [
  {
    icon: {
      name: 'circle-gauge',
      width: '1em',
      height: '1em',
      className: 'aria-hidden',
    },
    href: '/dashboard',
    label: 'dashboard',
  },
  {
    icon: {
      name: 'file',
      width: '1em',
      height: '1em',
      className: 'aria-hidden',
    },
    label: 'posts',
    subNav: [
      {
        href: '/dashboard/posts',
        label: 'all posts',
      },
      {
        href: '/dashboard/posts/published',
        label: 'published',
      },
      {
        href: '/dashboard/posts/drafts',
        label: 'drafts',
      },
    ],
  },
  {
    icon: {
      name: 'trending-up',
      width: '1em',
      height: '1em',
      className: 'aria-hidden',
    },
    href: '/dashboard/seo',
    label: 'analytics & seo',
  },
  {
    icon: {
      name: 'settings',
      width: '1em',
      height: '1em',
      className: 'aria-hidden',
    },
    label: 'settings',
    subNav: [
      {
        href: '/dashboard/settings/user',
        label: 'user',
      },
      {
        href: '/dashboard/settings/blog',
        label: 'blog',
      },
      {
        href: '/dashboard/settings/unsplash',
        label: 'unsplash',
      },
    ],
  },
  {
    icon: {
      name: 'panel-top',
      width: '1em',
      height: '1em',
      className: 'aria-hidden',
    },
    href: '/',
    label: 'Visit Blog',
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
  },
];
