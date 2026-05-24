import { useState } from 'react';

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

const s = {
  form: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
  input: {
    flex: 1,
    minWidth: 200,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d4d4d8',
    fontSize: 15,
    outline: 'none',
  },
  select: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d4d4d8',
    fontSize: 15,
    background: '#fff',
    cursor: 'pointer',
  },
  btn: {
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' as const },
};

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
    <form style={s.form} onSubmit={handleSubmit}>
      <input
        style={s.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Должность, например Frontend разработчик"
      />
      <select
        style={s.select}
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
        style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
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
