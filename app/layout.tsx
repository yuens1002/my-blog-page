export const dynamicParams = false;

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "my blog page | author's name",
  description: 'personal blog page, subscribe today',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background h-screen font-sans antialiased',
          inter.variable
        )}
      >
        <div className="flex flex-col min-h-full">
          {children}
          <footer className="text-xs text-center py-4 mt-auto bg-slate-100">
            <p>&copy; 2024 myBlog Page</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
