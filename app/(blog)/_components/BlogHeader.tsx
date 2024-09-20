import SiteLogo from '@/components/SiteLogo';
import isUserAuthenticated from '@/lib/isAuthenticated';
import BlogSiteNav from './BlogSiteNav';
import { Nav } from '@/components/Nav';
import LinkButton from '@/components/LinkButton';
import { UserRoundPen } from 'lucide-react';
import SignInOutButton from '@/components/SignInOutButton';
import MobileNavSheet from '@/components/MobileNavSheet';
import PageHeader from '@/components/PageHeader';
import BlogMenuItems from './BlogMenuItems';

export default async function SiteHeader() {
  const isLoggedIn = await isUserAuthenticated();

  return (
    <PageHeader>
      <SiteLogo href="/" />
      <Nav className="lg:flex hidden">
        <BlogSiteNav />
        {isLoggedIn && (
          <LinkButton href="/dashboard" variant={'outline'}>
            <UserRoundPen className="mr-2 h-4 w-4" />
            Dashboard
          </LinkButton>
        )}
        <SignInOutButton />
      </Nav>
      <Nav className="lg:hidden">
        <MobileNavSheet>
          <BlogMenuItems />
        </MobileNavSheet>
      </Nav>
    </PageHeader>
  );
}
