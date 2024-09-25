'use client';

import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import ListItem from '@/components/navigation/ListItem';
import { ItemComponentProps, NavItem } from '@/lib/types';

type MenuNavProps = {
  items: NavItem[];
  ItemComp: React.ComponentType<ItemComponentProps>;
} & ComponentPropsWithoutRef<'ul'>;

export default function MenuNav({
  items,
  className,
  ItemComp,
}: MenuNavProps) {
  const pathname = usePathname();
  return (
    <ul
      className={cn('flex flex-col text-lg text-primary', className)}
    >
      {items.map(({ icon, href, label, subNav }) => (
        <Fragment key={label}>
          {href && pathname !== href ? (
            <ItemComp icon={icon} href={href} isSubNav={false}>
              {label}
            </ItemComp>
          ) : (
            <ListItem icon={icon} linkIsCurrent={pathname === href}>
              {label}
            </ListItem>
          )}
          {subNav && (
            <ul className="pl-6 text-primary">
              {subNav.map(({ label, href }) => (
                <Fragment key={label}>
                  <ItemComp href={href} isSubNav={true}>
                    {label}
                  </ItemComp>
                </Fragment>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
