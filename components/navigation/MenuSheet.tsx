import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

type MobileNavSheetProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>;

export default function MobileNavSheet({
  children,
}: MobileNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex flex-col items-center text-sm">
          <Menu size={24} className="translate-y-[0.23rem]" /> Menu
        </div>
      </SheetTrigger>
      <SheetContent side="right" aria-describedby="navigation links">
        <SheetHeader className="pb-8">
          <SheetTitle className="sr-only">
            mobile site navigation
          </SheetTitle>
          <SheetDescription className="sr-only">
            navigation links
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
