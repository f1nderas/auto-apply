import { cx } from '../../lib/cx';
import './checkbox.scss';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
  className?: string;
}

const Checkbox = ({ checked, onChange, label, isDisabled, className }: CheckboxProps) => (
  <label className={cx('checkbox', isDisabled && 'checkbox--disabled', className)}>
    <input
      type="checkbox"
      className="checkbox__input"
      checked={checked}
      disabled={isDisabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className={cx('checkbox__box', checked && 'checkbox__box--checked')} />
    {label && <span className="checkbox__label">{label}</span>}
  </label>
);

export { Checkbox };
