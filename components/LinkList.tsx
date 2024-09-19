'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SheetClose } from '@/components/ui/sheet';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Icon, { IconProps } from './Icon';

type LinkListProps = {
  links: LinkItem[];
};

export type LinkItem = {
  icon?: IconProps;
  href?: string;
  label: string;
  subNav?: LinkItem[];
};

export default function LinkList({ links }: LinkListProps) {
  return (
    <ul className="text-lg flex flex-col text-primary">
      {links.map(({ icon, href, label, subNav }) => (
        <Fragment key={label}>
          {href && icon ? (
            <LinkListItem icon={icon} href={href} isSubNav={false}>
              {label}
            </LinkListItem>
          ) : (
            <li className="flex justify-between items-center px-2 py-4">
              <div className="flex items-center gap-2">
                {icon && <Icon name={icon.name} {...{ icon }} />}
                <span className="capitalize">{label}</span>
              </div>
            </li>
          )}
          {subNav && (
            <ul className="pl-6 text-primary">
              {subNav.map(
                ({ label, href }) =>
                  href && (
                    <Fragment key={label}>
                      <LinkListItem href={href} isSubNav={true}>
                        {label}
                      </LinkListItem>
                    </Fragment>
                  )
              )}
            </ul>
          )}
        </Fragment>
      ))}
    </ul>
  );
}

type LinkListItemProps = {
  children: React.ReactNode;
  icon?: IconProps;
  href: string;
  isSubNav: boolean;
};

function LinkListItem({
  children,
  href,
  icon,
  isSubNav,
}: LinkListItemProps) {
  const pathname = usePathname();
  const linkIsCurrent = href === pathname;
  console.log('🚀 ~ linkIsCurrent:', linkIsCurrent);
  console.log('🚀 ~ pathname:', pathname);
  return isSubNav ? (
    <Link href={href}>
      <SheetClose asChild>
        <li
          className={cn(
            'flex items-center p-4 rounded-r-sm border-l border-primary/10 hover:bg-primary/5',
            linkIsCurrent && 'border-primary'
          )}
        >
          <span
            className={cn(
              'capitalize text-sm',
              linkIsCurrent && 'font-bold'
            )}
          >
            {children}
          </span>
        </li>
      </SheetClose>
    </Link>
  ) : (
    <Link href={href}>
      <SheetClose asChild>
        <li className="px-2 py-4 flex items-center gap-x-2 hover:bg-primary/5 rounded-sm">
          {icon && <Icon name={icon.name} {...{ icon }} />}
          <span
            className={cn('capitalize', linkIsCurrent && 'font-bold')}
          >
            {children}
          </span>
        </li>
      </SheetClose>
    </Link>
  );
}
