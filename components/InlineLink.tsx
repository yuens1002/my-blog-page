import Link, { type LinkProps } from 'next/link';

export default function InlineLink({
  children,
  href,
  ...props
}: { children: React.ReactNode } & LinkProps) {
  return (
    <Link
      className="font-semibold hover:underline hover:underline-offset-4"
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
