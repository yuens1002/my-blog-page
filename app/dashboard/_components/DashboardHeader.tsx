import { Nav } from '@/components/Nav';
import { PanelTop } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import SignInOutButton from '@/components/SignInOutButton';
import SiteLogo from '@/components/SiteLogo';
import PageHeader from '@/components/PageHeader';
import MobileNavSheet from '@/components/MobileNavSheet';
import DashboardMenuItems from './DashboardMenuItems';

export default function DashboardHeader() {
  return (
    <PageHeader>
      <SiteLogo href="/dashboard" />
      <Nav className="md:flex items-center gap-x-2 hidden">
        <LinkButton href="/" variant="outline">
          <PanelTop
            width="1.5rem"
            height="1.5rem"
            aria-hidden
            className="pr-2"
          />
          Visit Blog
        </LinkButton>
        <SignInOutButton />
      </Nav>
      <Nav className="md:hidden">
        <MobileNavSheet>
          <DashboardMenuItems />
        </MobileNavSheet>
      </Nav>
    </PageHeader>
  );
}
