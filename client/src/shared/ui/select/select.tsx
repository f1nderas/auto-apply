import ReactSelect from 'react-select';
import type { SingleValue, MultiValue } from 'react-select';
import { cx } from '../../lib/cx';
import { selectStyles } from './select-styles';
import './select.scss';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  /** Текущее выбранное значение. null — ничего не выбрано, показывает placeholder. */
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  /** Текст когда ничего не выбрано. */
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  /**
   * Без label — идёт на сам контрол (react-select).
   * С label — идёт на внешний wrapper (.select-field).
   */
  className?: string;
  /** Текст лейбла над селектом. При наличии рендерит wrapper-div. */
  label?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isLoading,
  className,
  label,
}: SelectProps) => {
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (
    option: SingleValue<SelectOption> | MultiValue<SelectOption>,
  ) => {
    onChange?.((option as SingleValue<SelectOption>)?.value ?? null);
  };

  const control = (
    <ReactSelect
      unstyled
      classNamePrefix="select"
      className={label ? undefined : className}
      options={options}
      value={selected}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isSearchable={false}
      styles={selectStyles}
    />
  );

  if (!label) return control;

  return (
    <div className={cx('select-field', className)}>
      <span className="select-field__label">{label}</span>
      {control}
    </div>
  );
};

export { Select };
export type { SelectOption };
