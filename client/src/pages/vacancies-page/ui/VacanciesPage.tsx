import { useState } from 'react';
import { SearchForm } from '@features/vacancy-search';
import { VacancyCard, searchVacancies } from '@entities/vacancy';
import type { VacancyDto } from '@dto';
import './vacancies-page.scss';

const VacanciesPage = () => {
  // #region STATE
  const [vacancies, setVacancies] = useState<VacancyDto[]>([]);
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
    <div className="vacancies-page">
      <header className="vacancies-page__header">
        <div className="vacancies-page__title">Auto Apply</div>
      </header>

      <main className="vacancies-page__main">
        <div className="vacancies-page__search">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {!loading && !error && vacancies.length > 0 && (
          <div className="vacancies-page__meta">
            Найдено: {total.toLocaleString('ru')} вакансий
          </div>
        )}

        {loading && (
          <div className="vacancies-page__message">Загрузка...</div>
        )}
        {error && (
          <div className="vacancies-page__error">Ошибка: {error}</div>
        )}
        {!loading && !error && vacancies.length === 0 && (
          <div className="vacancies-page__message">
            Введите запрос и нажмите «Найти»
          </div>
        )}

        <div className="vacancies-page__list">
          {vacancies.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </div>
      </main>
    </div>
  );
};

export { VacanciesPage };
