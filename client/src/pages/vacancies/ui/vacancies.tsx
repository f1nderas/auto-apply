import { useState } from 'react';
import { SearchForm } from '@features/vacancy-search';
import { VacancyCard, useLazySearchVacanciesQuery } from '@entities/vacancy';
import { Button } from '@shared/ui/button';
import { Pagination } from '@shared/ui/pagination';
import { cx } from '@shared/lib/cx';
import './vacancies.scss';

const Vacancies = () => {
  // #region STATE
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [lastQuery, setLastQuery] = useState<{
    text: string;
    area: number;
    resumeHash: string;
  } | null>(null);
  // #endregion

  // #region HOOK
  const [search, { data, isFetching, isError, error, isUninitialized }] =
    useLazySearchVacanciesQuery();
  // #endregion

  // #region COMPUTED
  const errorMsg = isError
    ? error && 'data' in error
      ? String((error.data as { message?: string })?.message ?? error.status)
      : 'Неизвестная ошибка'
    : null;
  // #endregion

  // #region HANDLER
  const handleSearch = (text: string, area: number, resumeHash: string) => {
    setLastQuery({ text, area, resumeHash });
    setPage(0);
    search({ text, area, page: 0, perPage, ...(resumeHash ? { resumeHash } : {}) });
  };

  const handlePageChange = (newPage: number) => {
    if (!lastQuery) return;
    setPage(newPage);
    search({ ...lastQuery, page: newPage, perPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (!lastQuery) return;
    setPerPage(newPerPage);
    setPage(0);
    search({ ...lastQuery, page: 0, perPage: newPerPage });
  };
  // #endregion

  // #region STYLES
  const perPageBtnClass = (n: number) =>
    cx('vacancies__per-page-btn', perPage === n && 'vacancies__per-page-btn--active');
  // #endregion

  return (
    <div className="vacancies">
      <SearchForm onSearch={handleSearch} isLoading={isFetching} />

      {!isFetching && !isError && (data?.vacancies.length ?? 0) > 0 && (
        <div className="vacancies__controls">
          <span className="vacancies__meta">
            Найдено: {data!.total.toLocaleString('ru')} вакансий
          </span>
          <div className="vacancies__per-page">
            <span className="vacancies__per-page-label">Показывать:</span>
            {[10, 20, 50].map((n) => (
              <Button
                key={n}
                variant="plain"
                className={perPageBtnClass(n)}
                onClick={() => handlePerPageChange(n)}
                isDisabled={isFetching}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isFetching && <div className="vacancies__message">Загрузка...</div>}
      {isError && <div className="vacancies__error">Ошибка: {errorMsg}</div>}
      {isUninitialized && (
        <div className="vacancies__message">Введите запрос и нажмите «Найти»</div>
      )}

      <div className="vacancies__list">
        {data?.vacancies.map((v) => (
          <VacancyCard key={v.id} vacancy={v} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={data?.pages ?? 0}
        isFetching={isFetching}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export { Vacancies };
