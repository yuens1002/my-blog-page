import SiteLogo from '@/components/SiteLogo';
import isUserAuthenticated from '@/lib/isAuthenticated';
import BlogSiteNav from './BlogSiteNav';
import { Nav } from '@/components/Nav';
import LinkButton from '@/components/LinkButton';
import { UserRoundPen } from 'lucide-react';
import SignInAndOutButton from '@/components/SignInOutButton';

export default async function SiteHeader() {
  const isLoggedIn = await isUserAuthenticated();
  return (
    <header className="border-b border-b-primary/15 bg-background">
      <nav className="sm-hidden flex justify-between items-center p-4">
        <SiteLogo href="/">
          <p className="leading-[1.1] text-xl font-light">
            <span className="font-thin">{'<'}y</span>our
            <span className="font-extrabold">blog</span>
            <span className="font-thin">{' />'}</span>
          </p>
        </SiteLogo>
        <Nav>
          <BlogSiteNav />
          {isLoggedIn && (
            <LinkButton href="/dashboard" variant={'outline'}>
              <UserRoundPen className="mr-2 h-4 w-4" />
              back to dashboard
            </LinkButton>
          )}
          <SignInAndOutButton />
        </Nav>
        <div className="lg:hidden">menu during mobile view</div>
      </nav>
    </header>
  );
}
