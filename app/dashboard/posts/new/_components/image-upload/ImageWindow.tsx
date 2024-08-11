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
        'relative flex items-center overflow-hidden justify-center w-full h-[21rem] bg-slate-50 border-slate-200 rounded-sm rounded-t-none border-t-0 text-slate-200',
        showBorder && 'border'
      )}
    >
      {children}
    </div>
  );
}
