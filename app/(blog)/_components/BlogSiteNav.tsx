import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import LinkButton from '@/components/LinkButton';
import db from '@/prisma/client';

export default async function BlogSiteNav() {
  const categories = await db.category.findMany();
  return (
    <>
      <LinkButton href="/">Home</LinkButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="group flex gap-2">
          <Button variant="link">
            Categories
            <ChevronDownIcon className="h-4 w-4 group-data-[state=open]:rotate-180 group-data-[state=open]:animate-in transition" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map(({ id, slug, label }) => (
            <Fragment key={id}>
              <DropdownMenuItem asChild>
                <Link href={`/${slug}`} className="capitalize">
                  {label}
                </Link>
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <LinkButton href="/contact">Contact Us</LinkButton>
    </>
  );
}
