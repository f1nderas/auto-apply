import { Button } from '@shared/ui/button';
import { cx } from '@shared/lib/cx';
import './pagination.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, isFetching = false, onPageChange }: PaginationProps) => {
  // #region COMPUTED
  const pageRange: (number | '...')[] = (() => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);

    const result: (number | '...')[] = [0];
    const left = Math.max(1, page - 1);
    const right = Math.min(totalPages - 2, page + 1);
    if (left > 1) result.push('...');
    for (let i = left; i <= right; i++) result.push(i);
    if (right < totalPages - 2) result.push('...');
    result.push(totalPages - 1);
    return result;
  })();
  // #endregion

  // #region STYLES
  const pageBtnClass = (p: number) =>
    cx('pagination__btn', p === page && 'pagination__btn--active');
  // #endregion

  if (pageRange.length === 0) return null;

  return (
    <div className="pagination">
      <Button
        variant="plain"
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0 || isFetching}
      >
        ← Назад
      </Button>

      {pageRange.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant="plain"
            className={pageBtnClass(p)}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
          >
            {p + 1}
          </Button>
        ),
      )}

      <Button
        variant="plain"
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1 || isFetching}
      >
        Вперёд →
      </Button>
    </div>
  );
};

export { Pagination };
