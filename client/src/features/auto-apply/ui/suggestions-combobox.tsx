import { useState, useEffect } from 'react';
import { Combobox } from '@shared/ui/combobox';
import { useDebounce } from '@shared/lib/use-debounce';
import { useLazyGetSuggestionsQuery } from '../api/suggestions-api';

interface SuggestionsComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  isDisabled?: boolean;
}

const SuggestionsCombobox = ({
  value,
  onChange,
  placeholder,
  className,
  label,
  isDisabled,
}: SuggestionsComboboxProps) => {
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

  return (
    <Combobox
      value={value}
      onChange={onChange}
      options={suggestions}
      placeholder={placeholder}
      className={className}
      label={label}
      isDisabled={isDisabled}
    />
  );
};

export { SuggestionsCombobox };
