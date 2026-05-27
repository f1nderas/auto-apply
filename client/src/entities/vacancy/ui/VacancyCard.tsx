import { useState } from 'react';
import { cx } from '@shared/lib/cx';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { SCHEDULE_LABELS, formatSalary, formatDate } from '../lib/format';
import { useApplyVacancyMutation } from '../api/vacancyApi';
import type { VacancyDto } from '@dto';
import './vacancy-card.scss';

const VacancyCard = ({ vacancy }: { vacancy: VacancyDto }) => {
  // #region STATE
  const [letter, setLetter] = useState('');
  const [applied, setApplied] = useState(false);
  // #endregion

  // #region HOOK
  const [apply, { isLoading, isError }] = useApplyVacancyMutation();
  // #endregion

  // #region COMPUTED
  const schedule = SCHEDULE_LABELS[vacancy.schedule] ?? vacancy.schedule;
  const hasSalary = !!vacancy.salary;
  const needsLetter = vacancy.responseLetterRequired;
  const canApply = !needsLetter || letter.trim().length > 0;
  const btnLabel = isLoading
    ? 'Отправка…'
    : applied
      ? 'Отклик отправлен'
      : isError
        ? 'Ошибка — повторить'
        : 'Откликнуться';
  // #endregion

  // #region HANDLER
  const handleApply = async () => {
    try {
      await apply({
        applyVacancyDto: {
          vacancyId: vacancy.id,
          ...(needsLetter ? { letter: letter.trim() } : {}),
        },
      }).unwrap();
      setApplied(true);
    } catch {
      // isError from the mutation hook handles UI state
    }
  };
  // #endregion

  // #region STYLES
  const salaryClass = cx('vacancy-card__salary', !hasSalary && 'vacancy-card__salary--empty');
  const applyBtnClass = cx(
    'vacancy-card__apply-btn',
    applied && 'vacancy-card__apply-btn--success',
    isError && !applied && 'vacancy-card__apply-btn--error',
  );
  // #endregion

  return (
    <div className="vacancy-card">
      <a
        href={vacancy.url}
        target="_blank"
        rel="noreferrer"
        className="vacancy-card__title"
      >
        {vacancy.name}
      </a>

      <div className="vacancy-card__employer">
        <a
          href={vacancy.employer.url}
          target="_blank"
          rel="noreferrer"
          className="vacancy-card__employer-link"
        >
          {vacancy.employer.name}
        </a>
        {vacancy.employer.accreditedIt && (
          <span className="vacancy-card__badge vacancy-card__badge--blue">
            IT-аккредитация
          </span>
        )}
      </div>

      <div className={salaryClass}>
        {formatSalary(vacancy.salary ?? null)}
      </div>

      <div className="vacancy-card__footer">
        <span className="vacancy-card__badge vacancy-card__badge--green">
          {schedule}
        </span>
        {needsLetter && (
          <span className="vacancy-card__badge vacancy-card__badge--orange">
            Нужно письмо
          </span>
        )}
        <span className="vacancy-card__footer-text">
          {vacancy.area} · {formatDate(vacancy.publishedAt)}
        </span>
      </div>

      {needsLetter && !applied && (
        <Textarea
          className="vacancy-card__letter"
          placeholder="Сопроводительное письмо…"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
      )}

      <Button
        variant="plain"
        className={applyBtnClass}
        onClick={handleApply}
        disabled={isLoading || applied || !canApply}
      >
        {btnLabel}
      </Button>
    </div>
  );
};

export { VacancyCard };
