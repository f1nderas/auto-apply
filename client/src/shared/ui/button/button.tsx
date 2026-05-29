import { cx } from '../../lib/cx';
import './button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'plain';
}

const Button = ({
  loading,
  disabled,
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cx('button', `button--${variant}`, className)}
    disabled={loading || disabled}
    {...props}
  >
    {children}
  </button>
);

export { Button };
