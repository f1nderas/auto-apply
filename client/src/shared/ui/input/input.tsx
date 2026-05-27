import { cx } from '../../lib/cx';
import './input.scss';

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cx('input', className)} {...props} />
);

export { Input };
