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
          <PanelTop className="h-4 w-4" /> Visit Blog
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
