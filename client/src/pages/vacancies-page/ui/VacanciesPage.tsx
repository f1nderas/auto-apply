import { useState } from 'react';
import { SearchForm } from '@features/vacancy-search';
import { VacancyCard, useLazySearchVacanciesQuery } from '@entities/vacancy';
import { cx } from '@shared/lib/cx';
import './vacancies-page.scss';

const VacanciesPage = () => {
  // #region STATE
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [lastQuery, setLastQuery] = useState<{
    text: string;
    area: number;
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

  const pageRange: (number | '...')[] = (() => {
    const total = data?.pages ?? 0;
    if (total <= 1) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const result: (number | '...')[] = [0];
    const left = Math.max(1, page - 1);
    const right = Math.min(total - 2, page + 1);
    if (left > 1) result.push('...');
    for (let i = left; i <= right; i++) result.push(i);
    if (right < total - 2) result.push('...');
    result.push(total - 1);
    return result;
  })();
  // #endregion

  // #region HANDLER
  const handleSearch = (text: string, area: number) => {
    setLastQuery({ text, area });
    setPage(0);
    search({ text, area, page: 0, perPage });
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
  console.log('pageRange', pageRange);

  return (
    <div className="vacancies-page">
      <div className="vacancies-page__search">
        <SearchForm onSearch={handleSearch} loading={isFetching} />
      </div>

      {!isFetching && !isError && (data?.vacancies.length ?? 0) > 0 && (
        <div className="vacancies-page__controls">
          <span className="vacancies-page__meta">
            Найдено: {data!.total.toLocaleString('ru')} вакансий
          </span>
          <div className="vacancies-page__per-page">
            <span className="vacancies-page__per-page-label">Показывать:</span>
            {[10, 20, 50].map((n) => (
              <button
                key={n}
                className={cx(
                  'vacancies-page__per-page-btn',
                  perPage === n && 'vacancies-page__per-page-btn--active',
                )}
                onClick={() => handlePerPageChange(n)}
                disabled={isFetching}
              >
                {n}
              </button>
            ))}
          </div>
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

      {pageRange.length > 0 && (
        <div className="vacancies-page__pagination">
          <button
            className="vacancies-page__page-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0 || isFetching}
          >
            ← Назад
          </button>
          {pageRange.map((p, i) =>
            p === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="vacancies-page__page-ellipsis"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                className={cx(
                  'vacancies-page__page-btn',
                  p === page && 'vacancies-page__page-btn--active',
                )}
                onClick={() => handlePageChange(p)}
                disabled={isFetching}
              >
                {p + 1}
              </button>
            ),
          )}
          <button
            className="vacancies-page__page-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= (data?.pages ?? 1) - 1 || isFetching}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
};

export { VacanciesPage };
