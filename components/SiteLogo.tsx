import { cn } from '@/lib/utils';
import Link from 'next/link';

type SiteLogoTypes = {
  href: string;
  borderColor?: string;
  children: React.ReactNode;
};

export default function SiteLogo({
  href,
  borderColor,
  children,
}: SiteLogoTypes) {
  return (
    <Link
      href={href}
      className={cn('flex flex-col border-r-2 pr-4', borderColor)}
    >
      {children}
    </Link>
  );
}
