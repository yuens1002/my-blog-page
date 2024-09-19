import cn from '@/lib/cn';

export default function PageHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <header className={cn('bg-white drop-shadow-sm', className)}>
      <nav className="flex justify-between items-center p-4">
        {children}
      </nav>
    </header>
  );
}
