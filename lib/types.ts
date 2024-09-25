import { IconProps } from '@/components/Icon';
import { z } from 'zod';

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

export const createPhotoSchema = z.object({
  id: z.string(),
  width: z.number(),
  height: z.number(),
  blur_hash: z.string(),
  urls: z.object({
    full: z.string(),
    regular: z.string(),
    raw: z.string(),
    small: z.string(),
  }),
  color: z.string().or(z.null()),
  user: z.object({
    username: z.string(),
    name: z.string(),
  }),
});

export type UnsplashPhoto = z.infer<typeof createPhotoSchema>;
