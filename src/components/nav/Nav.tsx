import './Nav.scss';
import SignInButton from '../buttons/signInButton/SignInButton';

function Nav() {
  return (
    <nav className="nav">
      <div className="nav__logo">
        <h1 className="nav__logo--text">LangEdge AI</h1>
      </div>

      <div className="nav__page-links">
        <SignInButton></SignInButton>
      </div>
    </nav>
  );
}

export default Nav;
