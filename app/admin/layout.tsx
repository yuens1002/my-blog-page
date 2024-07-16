import { Nav, NavLink } from '@/components/Nav';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href="/">home</NavLink>
        <NavLink href="/login">login</NavLink>
        <NavLink href="/category">category</NavLink>
      </Nav>
      <main className="container my-6">{children}</main>
    </>
  );
}
