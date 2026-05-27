import ReactSelect from 'react-select';
import type { SingleValue, MultiValue } from 'react-select';
import { selectStyles } from './select-styles';
import './select.scss';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  className?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isSearchable = false,
  className,
}: SelectProps) => {
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (option: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
    onChange?.((option as SingleValue<SelectOption>)?.value ?? null);
  };

  return (
    <ReactSelect
      unstyled
      classNamePrefix="select"
      className={className}
      options={options}
      value={selected}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      styles={selectStyles}
    />
  );
};

export { Select };
export type { SelectOption };
