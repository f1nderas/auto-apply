import { SearchForm } from '@features/vacancy-search';
import { VacancyCard, useLazySearchVacanciesQuery } from '@entities/vacancy';
import './vacancies-page.scss';

const VacanciesPage = () => {
  // #region HOOK
  const [search, { data, isFetching, isError, error, isUninitialized }] =
    useLazySearchVacanciesQuery();
  // #endregion

  // #region HANDLER
  const handleSearch = (text: string, area: number) => {
    search({ text, area, page: 0, perPage: 20 });
  };
  // #endregion

  // #region COMPUTED
  const errorMsg = isError
    ? error && 'data' in error
      ? String((error.data as { message?: string })?.message ?? error.status)
      : 'Неизвестная ошибка'
    : null;
  // #endregion

  return (
    <div className="vacancies-page">
      <div className="vacancies-page__search">
        <SearchForm onSearch={handleSearch} loading={isFetching} />
      </div>

      {!isFetching && !isError && (data?.vacancies.length ?? 0) > 0 && (
        <div className="vacancies-page__meta">
          Найдено: {data!.total.toLocaleString('ru')} вакансий
        </div>
      )}

      {isFetching && <div className="vacancies-page__message">Загрузка...</div>}
      {isError && (
        <div className="vacancies-page__error">Ошибка: {errorMsg}</div>
      )}
      {isUninitialized && (
        <div className="vacancies-page__message">
          Введите запрос и нажмите «Найти»
        </div>
      )}

      <div className="vacancies-page__list">
        {data?.vacancies.map((v) => (
          <VacancyCard key={v.id} vacancy={v} />
        ))}
      </div>
    </div>
  );
};

export { VacanciesPage };
