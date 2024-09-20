import { Button, type ButtonProps } from '@/components/ui/button';
import isUserAuthenticated from '@/lib/isAuthenticated';
import {
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { LogInIcon, LogOutIcon } from 'lucide-react';

export default async function SignInOutButton({
  size = 'sm',
  ...props
}: ButtonProps) {
  const isLoggedIn = await isUserAuthenticated();
  return (
    <Button variant="secondary" size={size} {...props} asChild>
      {isLoggedIn ? (
        <LogoutLink>
          <div className="flex items-center gap-x-2">
            <LogOutIcon width="1em" height="1em" /> Sign Out
          </div>
        </LogoutLink>
      ) : (
        <LoginLink>
          <div className="flex items-center gap-x-2">
            <LogInIcon width="1em" height="1em" /> Sign In
          </div>
        </LoginLink>
      )}
    </Button>
  );
}
