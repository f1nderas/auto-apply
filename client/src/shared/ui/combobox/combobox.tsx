import { useState } from 'react';
import { cx } from '../../lib/cx';
import { Input } from '../input';
import './combobox.scss';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  label?: string;
}

const Combobox = ({ value, onChange, options, placeholder, isDisabled, className, label }: ComboboxProps) => {
  // #region STATE
  const [open, setOpen] = useState(false);
  // #endregion

  // #region HANDLER
  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };
  // #endregion

  // #region STYLES
  const showDropdown = open && options.length > 0;
  // #endregion

  const control = (
    <div className={cx('combobox', label ? undefined : className)}>
      <Input
        className="combobox__input"
        value={value}
        placeholder={placeholder}
        isDisabled={isDisabled}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      {showDropdown && (
        <ul className="combobox__dropdown">
          {options.map((option) => (
            <li
              key={option}
              className="combobox__option"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!label) return control;

  return (
    <div className={cx('combobox-field', className)}>
      <span className="combobox-field__label">{label}</span>
      {control}
    </div>
  );
};

export { Combobox };
export type { ComboboxProps };
