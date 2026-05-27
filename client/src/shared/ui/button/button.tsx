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
    className={cx('button', variant === 'primary' && 'button--primary', className)}
    disabled={loading || disabled}
    {...props}
  >
    {children}
  </button>
);

export { Button };
