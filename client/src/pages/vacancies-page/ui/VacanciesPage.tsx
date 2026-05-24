import { useState } from 'react';
import { SearchForm } from '../../../features/vacancy-search';
import { VacancyCard, searchVacancies } from '../../../entities/vacancy';
import type { Vacancy } from '../../../entities/vacancy';

const s = {
  root: { minHeight: '100vh', background: '#f4f4f5' },
  header: {
    background: '#fff',
    borderBottom: '1px solid #e4e4e7',
    padding: '16px 24px',
  },
  headerTitle: { fontSize: 20, fontWeight: 700, color: '#18181b' },
  main: { maxWidth: 860, margin: '0 auto', padding: '24px 16px' },
  searchWrap: { marginBottom: 24 },
  meta: { fontSize: 14, color: '#71717a', marginBottom: 16 },
  list: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  message: {
    color: '#71717a',
    padding: '40px 0',
    textAlign: 'center' as const,
    fontSize: 15,
  },
  error: { color: '#dc2626', padding: '16px 0', fontSize: 15 },
};

const VacanciesPage = () => {
  // #region STATE
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #endregion

  // #region HANDLER
  const handleSearch = async (text: string, area: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchVacancies(text, area, 0, 20);
      setVacancies(data.vacancies);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };
  // #endregion

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerTitle}>Auto Apply</div>
      </header>

      <main style={s.main}>
        <div style={s.searchWrap}>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {!loading && !error && vacancies.length > 0 && (
          <div style={s.meta}>
            Найдено: {total.toLocaleString('ru')} вакансий
          </div>
        )}

        {loading && <div style={s.message}>Загрузка...</div>}
        {error && <div style={s.error}>Ошибка: {error}</div>}
        {!loading && !error && vacancies.length === 0 && (
          <div style={s.message}>Введите запрос и нажмите «Найти»</div>
        )}

        <div style={s.list}>
          {vacancies.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </div>
      </main>
    </div>
  );
};

export { VacanciesPage };
