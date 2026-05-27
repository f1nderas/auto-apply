import type { StylesConfig } from 'react-select';
import type { SelectOption } from './select';

const selectStyles: StylesConfig<SelectOption> = {
  option:             (base) => ({ ...base, cursor: 'pointer' }),
  valueContainer:     (base) => ({ ...base, padding: '10px 14px' }),
  dropdownIndicator:  (base) => ({ ...base, padding: '0 6px' }),
  indicatorSeparator: ()     => ({ display: 'none' }),
};

export { selectStyles };
