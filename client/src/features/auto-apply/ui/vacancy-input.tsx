import { useState, useEffect } from 'react';
import { Select, type SelectOption } from '@shared/ui/select';
import { useDebounce } from '@shared/lib/use-debounce';
import { useLazyGetSuggestionsQuery } from '../../suggestions';

interface VacancyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  isDisabled?: boolean;
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
  const debouncedValue = useDebounce(value, 400);
  // #endregion

  // #region EFFECT
  useEffect(() => {
    const params = debouncedValue.trim() ? { query: debouncedValue.trim() } : undefined;
    void fetchSuggestions(params).unwrap().then(setSuggestions).catch(() => {});
  }, [debouncedValue, fetchSuggestions]);
  // #endregion

  // #region COMPUTED
  const options: SelectOption[] = suggestions.map((s) => ({ value: s, label: s }));
  // #endregion

  return (
    <Select
      isSearchable
      options={options}
      value={value || null}
      onChange={(v) => onChange(String(v ?? ''))}
      placeholder={placeholder}
      className={className}
      label={label}
      isDisabled={isDisabled}
    />
  );
};

export { VacancyInput };
