import { Nav } from '@/components/Nav';
import { PanelTop } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import SignInOutButton from '@/components/SignInOutButton';
import SiteLogo from '@/components/SiteLogo';

export default function DashboardHeader() {
  return (
    <header className={'bg-indigo-700'}>
      <nav className="flex justify-between items-center p-4">
        <SiteLogo href="/dashboard" borderColor="border-fuchsia-600">
          <p className="text-primary-foreground leading-[1.1] font-thin">
            <span className="text-xl text-muted">my</span>
            <span className="text-xl font-normal">blog</span>
            <br />
            Dashboard
          </p>
        </SiteLogo>
        <Nav>
          <LinkButton href="/" className="text-primary-foreground">
            <PanelTop className="mr-2 h-4 w-4" /> visit blog
          </LinkButton>
          <SignInOutButton />
        </Nav>
      </nav>
    </header>
  );
}
