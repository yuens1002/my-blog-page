import cn from '@/lib/cn';

export default function PageHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        'bg-background drop-shadow-sm dark:border-b dark:border-b-secondary',
        className
      )}
    >
      <nav className="flex justify-between items-center p-4">
        {children}
      </nav>
    </header>
  );
}
