import { Nav } from '@/components/Nav';
import { PanelTop } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import SignInOutButton from '@/components/SignInOutButton';
import SiteLogo from '@/components/SiteLogo';
import PageHeader from '@/components/PageHeader';
import MenuSheet from '@/components/navigation/MenuSheet';
import DashboardMenu from './DashboardMenu';

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
        <MenuSheet>
          <DashboardMenu />
        </MenuSheet>
      </Nav>
    </PageHeader>
  );
}
