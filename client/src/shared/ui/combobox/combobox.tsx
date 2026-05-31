import { useState } from 'react';
import { cx } from '../../lib/cx';
import { Input } from '../input';
import './combobox.scss';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Combobox = ({ value, onChange, options, placeholder, disabled, className }: ComboboxProps) => {
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
  const rootClass = cx('combobox', className);
  const showDropdown = open && options.length > 0;
  // #endregion

  return (
    <div className={rootClass}>
      <Input
        className="combobox__input"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
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
};

export { Combobox };
export type { ComboboxProps };
