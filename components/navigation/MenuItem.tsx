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
    // SheetClose doesn't close the sheet when the linked is clicked
    // would be great to reuse the ItemNav component here
    <SheetClose asChild>
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
                !linkIsCurrent
                  ? 'hover:bg-primary/5'
                  : 'bg-primary/10'
              )}
            >
              {children}
            </ListItem>
          )
        )}
      </Link>
    </SheetClose>
  );
}
