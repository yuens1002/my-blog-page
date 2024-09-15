import { Button, type ButtonProps } from '@/components/ui/button';
import isUserAuthenticated from '@/lib/isAuthenticated';
import {
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

export default async function SignInOutButton({
  size = 'sm',
  ...props
}: ButtonProps) {
  const isLoggedIn = await isUserAuthenticated();
  return (
    <Button variant={'secondary'} size={size} {...props} asChild>
      {isLoggedIn ? (
        <LogoutLink>Sign out</LogoutLink>
      ) : (
        <LoginLink>Sign in</LoginLink>
      )}
    </Button>
  );
}
