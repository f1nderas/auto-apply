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

const Input = ({ className, label, isDisabled, isLoading, ...props }: InputProps) => {
  const control = (
    <input
      className={cx('input', label ? undefined : className)}
      disabled={isDisabled || isLoading}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <div className={cx('input-field', className)}>
      <span className="input-field__label">{label}</span>
      {control}
    </div>
  );
};

export { Input };
