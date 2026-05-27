import { cx } from '../../lib/cx';
import './badge.scss';

interface BadgeProps {
  variant: 'green' | 'blue' | 'orange';
  children: React.ReactNode;
}

const Badge = ({ variant, children }: BadgeProps) => {
  // #region STYLES
  const badgeClass = cx('badge', `badge--${variant}`);
  // #endregion

  return <span className={badgeClass}>{children}</span>;
};

export { Badge };
