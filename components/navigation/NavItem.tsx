'use client';

import { ItemComponentProps } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListSubItem from '@/components/navigation/ListSubItem';
import ListItem from '@/components/navigation/ListItem';
import { cn } from '@/lib/utils';

export default function NavItem({
  children,
  href,
  icon,
  isSubNav,
}: ItemComponentProps) {
  const pathname = usePathname();
  const linkIsCurrent = href === pathname;
  return (
    <>
      {isSubNav ? (
        linkIsCurrent ? (
          <ListSubItem linkIsCurrent={linkIsCurrent}>
            {children}
          </ListSubItem>
        ) : (
          <Link href={href}>
            <ListSubItem linkIsCurrent={linkIsCurrent}>
              {children}
            </ListSubItem>
          </Link>
        )
      ) : (
        icon && (
          <Link href={href}>
            <ListItem
              icon={icon}
              linkIsCurrent={linkIsCurrent}
              className={cn(
                !linkIsCurrent
                  ? 'hover:bg-primary/5'
                  : 'bg-primary/10'
              )}
            >
              {children}
            </ListItem>
          </Link>
        )
      )}
    </>
  );
}
