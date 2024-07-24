import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import DashboardHeader from './_components/DashboardHeader';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          inter.variable
        )}
      >
        <DashboardHeader />
        <main className="container my-12">{children}</main>
      </body>
    </html>
  );
}
