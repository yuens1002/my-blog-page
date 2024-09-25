import Link, { LinkProps } from 'next/link';

type SiteLogoTypes = {
  className?: string;
} & LinkProps;

export default function SiteLogo({ href, className }: SiteLogoTypes) {
  return (
    <Link href={href} className={className}>
      <p className="leading-[1.1] text-xl font-light">
        <span className="font-thin">{'<'}y</span>our
        <span className="font-extrabold">blog</span>
        <span className="font-thin">{' />'}</span>
      </p>
    </Link>
  );
}
