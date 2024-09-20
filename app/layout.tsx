import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import ModeToggle from '@/components/ModeToggle';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "my blog page | author's name",
  description: 'personal blog page, subscribe today',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const AppThemeProvider = dynamic(
  () => import('@/components/context/AppThemeProvider'),
  {
    ssr: false,
  }
);

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const theme = cookies().get('__theme__')?.value || 'system';

  return (
    <html
      className={theme}
      lang="en"
      style={theme !== 'system' ? { colorScheme: theme } : {}}
    >
      <body
        className={cn(
          'bg-primary-background h-screen font-sans antialiased',
          inter.variable
        )}
      >
        <div className="flex flex-col min-h-full">
          {children}

          <footer className="flex items-center justify-center gap-x-4 text-xs py-4 mt-auto bg-slate-100 dark:bg-slate-900">
            <p>
              &copy; 2024 {'<'}your
              <span className="font-bold">blog</span> {' />'}
            </p>
            <AppThemeProvider
              attribute="class"
              defaultTheme={theme}
              enableSystem
              disableTransitionOnChange
            >
              <ModeToggle />
            </AppThemeProvider>
          </footer>
        </div>
      </body>
    </html>
  );
}
