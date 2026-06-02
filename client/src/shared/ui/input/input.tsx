import { cx } from '../../lib/cx';
import './input.scss';

interface InputProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  checked?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const Input = ({ className, label, isDisabled, isLoading, ...props }: InputProps) => (
  <div className={cx('input-field', className)}>
    {label && <span className="input-field__label">{label}</span>}
    <input className="input" disabled={isDisabled || isLoading} {...props} />
  </div>
);

export { Input };
