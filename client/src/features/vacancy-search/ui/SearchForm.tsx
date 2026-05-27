import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Select } from '@shared/ui/select';
import type { SelectOption } from '@shared/ui/select';
import './search-form.scss';

interface SearchFormProps {
  onSearch: (text: string, area: number) => void;
  loading: boolean;
}

const AREA_OPTIONS: SelectOption[] = [
  { value: 1, label: 'Москва' },
  { value: 2, label: 'Санкт-Петербург' },
  { value: 0, label: 'Все регионы' },
];

const SearchForm = ({ onSearch, loading }: SearchFormProps) => {
  // #region STATE
  const [text, setText] = useState('Frontend разработчик');
  const [area, setArea] = useState(1);
  // #endregion

  // #region HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(text, area);
  };
  // #endregion

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <Input
        className="search-form__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Должность, например Frontend разработчик"
      />
      <Select
        options={AREA_OPTIONS}
        value={area}
        onChange={(v) => setArea(Number(v))}
      />
      <Button type="submit" loading={loading}>
        {loading ? 'Загрузка...' : 'Найти'}
      </Button>
    </form>
  );
};

export { SearchForm };
