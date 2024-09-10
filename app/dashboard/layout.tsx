import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from './_components/DashboardHeader';
import DashboardNav from './_components/DashboardNav';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <DashboardHeader />
      <main className="ml:container flex flex-1">
        <nav className="min-w-[15rem] w-[15%] py-4 border-r border-primary/10 hidden md:block">
          <DashboardNav />
        </nav>
        <section className="flex-1 p-4 md:p-8 lg:px-0 lg:py-12">
          {children}
        </section>
      </main>
      <Toaster />
    </>
  );
}
