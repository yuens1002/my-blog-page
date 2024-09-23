'use client';

import { ItemComponentProps } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListSubItem from '@/components/navigation/ListSubItem';
import ListItem from '@/components/navigation/ListItem';
import cn from '@/lib/cn';
import { SheetClose } from '../ui/sheet';

export default function NavItem({
  children,
  href,
  icon,
  isSubNav,
}: ItemComponentProps) {
  const pathname = usePathname();
  const linkIsCurrent = href === pathname;
  return (
    <Link href={href}>
      {isSubNav ? (
        <ListSubItem linkIsCurrent={linkIsCurrent}>
          {children}
        </ListSubItem>
      ) : (
        icon && (
          <ListItem
            icon={icon}
            linkIsCurrent={linkIsCurrent}
            className={cn(
              !linkIsCurrent ? 'hover:bg-primary/5' : 'bg-primary/10'
            )}
          >
            {children}
          </ListItem>
        )
      )}
    </Link>
  );
}
