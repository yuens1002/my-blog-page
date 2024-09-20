import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
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
      <SheetContent side="right">
        <SheetHeader>
          <SheetDescription className="pt-4">
            {children}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
