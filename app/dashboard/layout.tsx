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
        <section className="flex-1 py-4">{children}</section>
      </main>
    </>
  );
}
