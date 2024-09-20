import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';

type SiteLogoTypes = {
  className?: string;
} & LinkProps;

export default function SiteLogo({ href, className }: SiteLogoTypes) {
  return (
    <Link href={href} className={cn('flex flex-col pr-4', className)}>
      <p className="leading-[1.1] text-xl font-light">
        <span className="font-thin">{'<'}y</span>our
        <span className="font-extrabold">blog</span>
        <span className="font-thin">{' />'}</span>
      </p>
    </Link>
  );
}
