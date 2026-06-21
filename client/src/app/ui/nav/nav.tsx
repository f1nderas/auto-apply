import { NavLink } from 'react-router-dom';
import { cx } from '@shared/lib/cx';
import './nav.scss';

const NAV_ITEMS = [
  { to: '/panel/apply', label: 'Автоотклики' },
  { to: '/panel/vacancies', label: 'Вакансии' },
  { to: '/panel/history', label: 'История' },
  { to: '/panel/resumes', label: 'Резюме' },
] as const;

const Nav = () => {
  // #region STYLES
  const navLinkClass = (isActive: boolean) =>
    cx('nav__link', isActive && 'nav__link--active');
  // #endregion

  return (
    <nav className="nav">
      {NAV_ITEMS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
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
