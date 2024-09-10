import SiteLogo from '@/components/SiteLogo';
import isUserAuthenticated from '@/lib/isAuthenticated';
import BlogSiteNav from './BlogSiteNav';
import { Nav } from '@/components/Nav';
import LinkButton from '@/components/LinkButton';
import { UserRoundPen } from 'lucide-react';
import SignInAndOutButtons from '@/components/SIgnInAndOutButtons';

export default async function SiteHeader() {
  const isLoggedIn = await isUserAuthenticated();
  return (
    <header className="bg-primary">
      <nav className="flex justify-between items-center p-4">
        <SiteLogo href="/" borderColor="border-indigo-600">
          <p className="text-slate-50 leading-[1.1] text-xl">
            <span className="font-thin">my</span>
            <span>blog</span>
          </p>
        </SiteLogo>
        <Nav>
          <BlogSiteNav />
          {isLoggedIn && (
            <LinkButton
              href="/dashboard"
              className="text-primary-foreground"
            >
              <UserRoundPen className="mr-2 h-4 w-4" />
              back to dashboard
            </LinkButton>
          )}
          <SignInAndOutButtons />
        </Nav>
      </nav>
    </header>
  );
}
