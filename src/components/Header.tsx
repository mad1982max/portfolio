import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'font-bold underline' : '');

export default function Header() {
  return (
    <header>
      <nav aria-label="Main navigation">
        <NavLink to={ROUTES.HOME} className={linkClass}>
          Home
        </NavLink>
        <NavLink to={ROUTES.ABOUT} className={linkClass}>
          About
        </NavLink>
        <NavLink to={ROUTES.ADMIN} className={linkClass}>
          Admin
        </NavLink>
      </nav>
    </header>
  );
}
