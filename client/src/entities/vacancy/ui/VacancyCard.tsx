import { SCHEDULE_LABELS, formatSalary, formatDate } from '../lib/format';
import type { Vacancy } from '../model/types';

const s = {
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2563eb',
    textDecoration: 'none',
    lineHeight: 1.3,
  },
  employer: {
    fontSize: 14,
    color: '#52525b',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  employerLink: { color: 'inherit', textDecoration: 'none' },
  badgeGreen: {
    display: 'inline-block',
    fontSize: 12,
    padding: '2px 8px',
    borderRadius: 99,
    background: '#f0fdf4',
    color: '#16a34a',
    fontWeight: 500,
  },
  badgeBlue: {
    display: 'inline-block',
    fontSize: 12,
    padding: '2px 8px',
    borderRadius: 99,
    background: '#eff6ff',
    color: '#2563eb',
    fontWeight: 500,
  },
  badgeOrange: {
    display: 'inline-block',
    fontSize: 12,
    padding: '2px 8px',
    borderRadius: 99,
    background: '#fff7ed',
    color: '#c2410c',
    fontWeight: 500,
  },
  salary: { fontSize: 15, fontWeight: 600, color: '#18181b' },
  salaryEmpty: { fontSize: 14, color: '#a1a1aa' },
  footer: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap' as const,
  },
  footerText: { fontSize: 13, color: '#71717a' },
};

const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => {
  const schedule = SCHEDULE_LABELS[vacancy.schedule] ?? vacancy.schedule;
  const salaryText = formatSalary(vacancy.salary);
  const hasSalary = !!vacancy.salary;

  return (
    <div style={s.card}>
      <a href={vacancy.url} target="_blank" rel="noreferrer" style={s.title}>
        {vacancy.name}
      </a>

      <div style={s.employer}>
        <a href={vacancy.employer.url} target="_blank" rel="noreferrer" style={s.employerLink}>
          {vacancy.employer.name}
        </a>
        {vacancy.employer.accreditedIt && <span style={s.badgeBlue}>IT-аккредитация</span>}
      </div>

      <div style={hasSalary ? s.salary : s.salaryEmpty}>{salaryText}</div>

      <div style={s.footer}>
        <span style={s.badgeGreen}>{schedule}</span>
        {vacancy.responseLetterRequired && <span style={s.badgeOrange}>Нужно письмо</span>}
        <span style={s.footerText}>
          {vacancy.area} · {formatDate(vacancy.publishedAt)}
        </span>
      </div>
    </div>
  );
};

export { VacancyCard };
