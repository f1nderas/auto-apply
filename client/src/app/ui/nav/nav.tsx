import { NavLink } from 'react-router-dom';
import { cx } from '@shared/lib/cx';
import { ROUTES, PANEL_PREFIX } from '../../routes-config';
import './nav.scss';

const Nav = () => {
  // #region STYLES
  const navLinkClass = (isActive: boolean) =>
    cx('nav__link', isActive && 'nav__link--active');
  // #endregion

  return (
    <nav className="nav">
      {ROUTES.filter((r) => r.layout === 'panel' && r.label).map(({ path, label }) => (
        <NavLink
          key={path}
          to={`${PANEL_PREFIX}/${path}`}
          end
          className={({ isActive }) => navLinkClass(isActive)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export { Nav };
