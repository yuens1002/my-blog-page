'use client';

import cn from '@/lib/cn';
import Link from 'next/link';
import { SheetClose } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import ListSubItem from './ListSubItem';
import ListItem from '@/components/navigation/ListItem';
import { ItemComponentProps } from '@/lib/types';

export default function MenuItem({
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
          <SheetClose asChild>
            <Link href={href}>
              <ListSubItem linkIsCurrent={linkIsCurrent}>
                {children}
              </ListSubItem>
            </Link>
          </SheetClose>
        )
      ) : (
        icon && (
          <SheetClose asChild>
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
          </SheetClose>
        )
      )}
    </>
  );
}
