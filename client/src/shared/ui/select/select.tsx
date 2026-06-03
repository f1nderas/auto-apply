import { memo } from 'react';
import ReactSelect, { type SingleValue, type MultiValue } from 'react-select';
import { cx } from '../../lib/cx';
import { selectStyles } from './select-styles';
import './select.scss';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  options: SelectOption[] | SelectGroup[];
  /** Выбранная опция. null — ничего не выбрано, показывает placeholder. */
  value?: SelectOption | null;
  /** Вызывается при выборе опции из списка. */
  onChange?: (option: SelectOption | null) => void;
  /** Текст-подсказка когда значение не выбрано. */
  placeholder?: string;
  /** Показывает крестик для сброса выбранного значения. */
  isClearable?: boolean;
  /** Блокирует взаимодействие с компонентом. */
  isDisabled?: boolean;
  /** Показывает спиннер загрузки в индикаторе. */
  isLoading?: boolean;
  /** Разрешает печать в поле — для поиска по списку или свободного ввода. */
  isSearchable?: boolean;
  /** Вызывается на каждое нажатие клавиши в режиме isSearchable. */
  onInputChange?: (text: string) => void;
  /** Функция фильтрации опций. null — отключить встроенную фильтрацию. */
  filterOption?: (() => boolean) | null;
  /** Содержимое блока "нет вариантов". () => null — скрыть блок совсем. */
  noOptionsMessage?: () => React.ReactNode;
  /** Кастомный рендер содержимого опции в дропдауне. */
  formatOptionLabel?: (data: SelectOption) => React.ReactNode;
  /** className на внешнем wrapper (.select-field). */
  className?: string;
  /** Лейбл над селектом. */
  label?: string;
}

const SelectBase = ({
  options,
  value,
  onChange,
  placeholder,
  isClearable = false,
  isDisabled,
  isLoading,
  isSearchable = false,
  onInputChange,
  filterOption,
  noOptionsMessage,
  formatOptionLabel,
  className,
  label,
}: SelectProps) => {
  // #region HANDLER
  const handleChange = (option: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
    onChange?.((option as SingleValue<SelectOption>) ?? null);
  };

  const handleInputChange = (text: string, meta: { action: string }) => {
    if (meta.action === 'input-change') onInputChange?.(text);
  };
  // #endregion

  return (
    <div className={cx('select-field', className)}>
      {label && <span className="select-field__label">{label}</span>}
      <ReactSelect
        unstyled
        classNamePrefix="select"
        options={options}
        value={value}
        onChange={handleChange}
        onInputChange={isSearchable ? handleInputChange : undefined}
        filterOption={filterOption}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable={isSearchable}
        formatOptionLabel={formatOptionLabel}
        styles={selectStyles}
      />
    </div>
  );
};

const Select = memo(SelectBase);

export { Select };
export type { SelectOption, SelectGroup };
