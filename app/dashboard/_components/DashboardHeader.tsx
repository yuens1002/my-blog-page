import { Nav } from '@/components/Nav';
import { PanelTop } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import SignInOutButton from '@/components/SignInOutButton';
import SiteLogo from '@/components/SiteLogo';
import PageHeader from '@/components/PageHeader';

export default function DashboardHeader() {
  return (
    <PageHeader>
      <SiteLogo href="/dashboard" />
      <Nav>
        <LinkButton href="/" className="text-primary-foreground">
          <PanelTop className="mr-2 h-4 w-4" /> visit blog
        </LinkButton>
        <SignInOutButton />
      </Nav>
    </PageHeader>
  );
}
