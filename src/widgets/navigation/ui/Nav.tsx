import { useAppSelector } from '@/app/store';
import { Profile, selectUserId } from '@/entities/user';
import { SignInButton } from '@/features/auth';
import { useSignOut } from '@/features/auth';

import '@/widgets/navigation/ui/Nav.scss';

function Nav(): JSX.Element {
  const userId = useAppSelector(selectUserId);
  const signOut = useSignOut();

  return (
    <nav className="nav">
      <div className="nav__logo">
        <h1 className="nav__logo--text">LangEdge AI</h1>
      </div>

      <div className="nav__page-links">
        {!userId ? <SignInButton /> : <Profile onSignOut={signOut} />}
      </div>
    </nav>
  );
}

export default Nav;