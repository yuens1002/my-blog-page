import { cn } from '@/lib/utils';

type ImageWindowProps = {
  children: React.ReactNode;
  showBorder: boolean;
};

export default function ImageWindow({
  children,
  showBorder,
}: ImageWindowProps) {
  return (
    <div
      className={cn(
        'relative flex items-center overflow-hidden justify-center w-full h-[21rem] bg-slate-50/80 border-primary/10 rounded-sm rounded-t-none text-slate-200',
        showBorder && 'border border-t-0'
      )}
    >
      {children}
    </div>
  );
}
