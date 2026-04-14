import { useAppSelector } from '@/app/store/hooks';
import SignInButton from '@/components/buttons/signInButton/SignInButton';
import Profile from '@/components/profile/Profile';

import './Nav.scss';

function Nav() {
  const userId = useAppSelector((state) => state.user.userId);

  return (
    <nav className="nav">
      <div className="nav__logo">
        <h1 className="nav__logo--text">LangEdge AI</h1>
      </div>

      <div className="nav__page-links">{!userId ? <SignInButton></SignInButton> : <Profile></Profile>}</div>
    </nav>
  );
}

export default Nav;
