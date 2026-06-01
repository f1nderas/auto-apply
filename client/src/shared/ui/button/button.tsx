import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import './button.scss';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'plain';
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className,
  isLoading,
  isDisabled,
}: ButtonProps) => (
  <button
    className={cx('button', `button--${variant}`, className)}
    onClick={onClick}
    type={type}
    disabled={isLoading || isDisabled}
  >
    {children}
  </button>
);

export { Button };
