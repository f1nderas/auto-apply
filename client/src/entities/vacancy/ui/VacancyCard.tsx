import { cx } from '@shared/lib/cx';
import { SCHEDULE_LABELS, formatSalary, formatDate } from '../lib/format';
import type { VacancyDto } from '@dto';
import './vacancy-card.scss';

const VacancyCard = ({ vacancy }: { vacancy: VacancyDto }) => {
  // #region COMPUTED
  const schedule = SCHEDULE_LABELS[vacancy.schedule] ?? vacancy.schedule;
  const hasSalary = !!vacancy.salary;
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

      <div className={cx('vacancy-card__salary', !hasSalary && 'vacancy-card__salary--empty')}>
        {formatSalary(vacancy.salary ?? null)}
      </div>

      <div className="vacancy-card__footer">
        <span className="vacancy-card__badge vacancy-card__badge--green">
          {schedule}
        </span>
        {vacancy.responseLetterRequired && (
          <span className="vacancy-card__badge vacancy-card__badge--orange">
            Нужно письмо
          </span>
        )}
        <span className="vacancy-card__footer-text">
          {vacancy.area} · {formatDate(vacancy.publishedAt)}
        </span>
      </div>
    </div>
  );
};

export { VacancyCard };
