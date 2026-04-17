import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';

interface NavigationProps {
  layout: 'horizontal' | 'vertical';
  onNavLinkClick?: () => void;
}

export default function Navigation({ layout, onNavLinkClick }: NavigationProps): JSX.Element {
  const wrapperClass = layout === 'horizontal' ? 'flex flex-row gap-6' : 'flex flex-col';

  return (
    <nav aria-label="Main navigation" className={wrapperClass}>
      {Object.entries(ROUTES).map(([key, path]) => (
        <NavLink
          key={key}
          to={path}
          onClick={onNavLinkClick}
          className={({ isActive }) => {
            const base =
              layout === 'vertical'
                ? 'min-h-[44px] flex items-center px-2 py-1 text-gray-900 dark:text-white'
                : 'px-2 py-1 text-gray-900 dark:text-white';
            const active = isActive ? 'font-bold underline' : '';
            return [base, active].filter(Boolean).join(' ');
          }}
        >
          {key.charAt(0) + key.slice(1).toLowerCase()}
        </NavLink>
      ))}
    </nav>
  );
}
