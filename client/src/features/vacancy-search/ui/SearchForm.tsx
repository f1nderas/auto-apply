import { useState } from 'react';
import { cx } from '@shared/lib/cx';
import './search-form.scss';

interface Area {
  id: number;
  name: string;
}

interface SearchFormProps {
  onSearch: (text: string, area: number) => void;
  loading: boolean;
}

const INITIAL_AREAS: Area[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 0, name: 'Все регионы' },
];

const SearchForm = ({ onSearch, loading }: SearchFormProps) => {
  // #region STATE
  const [text, setText] = useState('Frontend разработчик');
  const [area, setArea] = useState(1);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  // #endregion

  // #region HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(text, area);
  };

  const handleAddArea = (newArea: Area) => {
    setAreas((prev) => [...prev, newArea]);
  };
  // #endregion

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-form__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Должность, например Frontend разработчик"
      />
      <select
        className="search-form__select"
        value={area}
        onChange={(e) => setArea(Number(e.target.value))}
      >
        {areas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <button
        className={cx('search-form__btn', loading && 'search-form__btn--disabled')}
        type="submit"
        disabled={loading}
      >
        {loading ? 'Загрузка...' : 'Найти'}
      </button>
    </form>
  );
};

export { SearchForm };
export type { Area };
