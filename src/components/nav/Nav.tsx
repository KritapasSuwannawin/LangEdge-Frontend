import { useAppSelector } from '../../hooks/useRedux';

import './Nav.scss';
import SignInButton from '../buttons/signInButton/SignInButton';
import Profile from '../profile/Profile';

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
