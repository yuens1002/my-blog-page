import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';

type SiteLogoTypes = {
  children: React.ReactNode;
} & React.ComponentProps<'a'> &
  LinkProps;

export default function SiteLogo({
  href,
  className,
  children,
}: SiteLogoTypes) {
  return (
    <Link href={href} className={cn('flex flex-col pr-4', className)}>
      {children}
    </Link>
  );
}
