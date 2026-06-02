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
  /** Текст-подсказка когда значение не выбрано. */
  placeholder?: string;
  /** Заблокировать селект. */
  isDisabled?: boolean;
  /** Показать индикатор загрузки. */
  isLoading?: boolean;
  /**
   * Режим свободного ввода текста.
   * value = введённый текст, options = подсказки для дропдауна.
   * Клиентская фильтрация отключена — фильтрует вызывающая сторона.
   */
  isSearchable?: boolean;
  /** Всегда идёт на внешний wrapper (.select-field). */
  className?: string;
  /** Текст лейбла над селектом. */
  label?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isLoading,
  isSearchable = false,
  className,
  label,
}: SelectProps) => {
  // #region COMPUTED
  const selected = isSearchable ? null : (options.find((o) => o.value === value) ?? null);
  const inputValue = isSearchable ? (value != null ? String(value) : '') : undefined;
  // #endregion

  // #region HANDLER
  const handleChange = (option: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
    onChange?.((option as SingleValue<SelectOption>)?.value ?? null);
  };

  const handleInputChange = (newText: string, meta: { action: string }) => {
    if (meta.action === 'input-change') onChange?.(newText || null);
  };
  // #endregion

  return (
    <div className={cx('select-field', className)}>
      {label && <span className="select-field__label">{label}</span>}
      <ReactSelect
        unstyled                    // убирает все встроенные стили react-select
        classNamePrefix="select"    // префикс BEM-классов: select__control, select__menu и т.д.
        options={options}
        value={selected}            // null в режиме isSearchable — текст живёт в inputValue
        onChange={handleChange}
        inputValue={inputValue}     // контролируемый текст поля ввода (только isSearchable)
        onInputChange={isSearchable ? handleInputChange : undefined}  // вызывается при каждом нажатии клавиши
        filterOption={isSearchable ? () => true : undefined}          // отключаем клиентскую фильтрацию — подсказки уже отфильтрованы снаружи
        noOptionsMessage={isSearchable ? () => null : undefined}      // скрываем «No options» когда список пуст
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable={isSearchable}
        styles={selectStyles}       // точечные JS-переопределения там где CSS-классов недостаточно
      />
    </div>
  );
};

export { Select };
export type { SelectOption };
