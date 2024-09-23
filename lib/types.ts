import { IconProps } from '@/components/Icon';

export type dummyPost = {
  title: string;
  reactions: {
    likes: string;
    dislikes: string;
  };
  body: string;
  tags: string[];
  views: number;
  categories: string[];
};

export type NavItem = {
  icon: IconProps;
  href?: string;
  label: string;
  subNav?: SubNavItem[];
};

export type SubNavItem = {
  href: string;
  label: string;
};

export type ItemComponentProps = {
  children: React.ReactNode;
  icon?: IconProps;
  href: string;
  isSubNav: boolean;
};
