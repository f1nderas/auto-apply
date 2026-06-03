import { useState, useEffect, useMemo } from 'react';
import { Select, type SelectOption } from '@shared/ui/select';
import { useDebounce } from '@shared/lib/use-debounce';
import { useLazyGetSuggestionsQuery } from '../../suggestions';
import { useGetSearchHistoryQuery } from '../../search-history';

interface VacancyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  isDisabled?: boolean;
}

interface VacancyOption extends SelectOption {
  isHistory?: boolean;
}

const VacancyInput = ({
  value,
  onChange,
  placeholder,
  className,
  label,
  isDisabled,
}: VacancyInputProps) => {
  // #region STATE
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // #endregion

  // #region HOOK
  const [fetchSuggestions] = useLazyGetSuggestionsQuery();
  const { data: history = [] } = useGetSearchHistoryQuery();
  const debouncedValue = useDebounce(value, 400);
  // #endregion

  // #region EFFECT
  useEffect(() => {
    const params = debouncedValue.trim() ? { query: debouncedValue.trim() } : undefined;
    void fetchSuggestions(params).unwrap().then(setSuggestions).catch(() => {});
  }, [debouncedValue, fetchSuggestions]);
  // #endregion

  // #region COMPUTED
  const options = useMemo(() => {
    const historyOptions: VacancyOption[] = history
      .filter((q) => !value || q.toLowerCase().includes(value.toLowerCase()))
      .map((q) => ({ value: q, label: q, isHistory: true }));

    const suggestionOptions: VacancyOption[] = suggestions
      .filter((s) => !history.includes(s))
      .map((s) => ({ value: s, label: s }));

    return [
      ...(historyOptions.length > 0 ? [{ label: 'История поиска', options: historyOptions }] : []),
      ...(suggestionOptions.length > 0 ? [{ label: 'Предложения', options: suggestionOptions }] : []),
    ];
  }, [history, suggestions, value]);
  // #endregion

  return (
    <Select
      isSearchable
      options={options}
      value={value ? { value, label: value } : null}
      onChange={(opt) => onChange(String(opt?.value ?? ''))}
      onInputChange={onChange}
      filterOption={null}
      noOptionsMessage={() => null}
      formatOptionLabel={(data) => {
        const opt = data as VacancyOption;
        return opt.isHistory ? <>🕐 {data.label}</> : <>{data.label}</>;
      }}
      placeholder={placeholder}
      className={className}
      label={label}
      isDisabled={isDisabled}
    />
  );
};

export { VacancyInput };
