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

const AuthorSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  id: z.string(),
});

const CategorySchema = z.object({
  slug: z.string(),
});

export const FeaturedPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  unsplashPhotoId: z.string().nullable(),
  imageURL: z.string().nullable(),
  slug: z.string(),
  tags: z.array(z.string()),
  stats: z
    .object({
      views: z.number(),
      likes: z.number(),
    })
    .nullable()
    .optional(),
  publishedAt: z.date(),
  author: AuthorSchema,
  categories: z.array(CategorySchema),
});

export type FeaturedPostType = z.infer<typeof FeaturedPostSchema>;
