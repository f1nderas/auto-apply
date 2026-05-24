import type { Salary } from '../model/types';

const SCHEDULE_LABELS: Record<string, string> = {
  remote: 'Удалённо',
  fullDay: 'Полный день',
  flexible: 'Гибкий график',
  shift: 'Сменный график',
  flyInFlyOut: 'Вахта',
};

const formatSalary = (salary: Salary | null): string => {
  if (!salary) return 'Зарплата не указана';
  const { from, to, currency, gross } = salary;
  const cur = currency === 'RUR' ? '₽' : currency;
  const type = gross ? 'до вычета налогов' : 'на руки';
  if (from && to) return `${from.toLocaleString('ru')} – ${to.toLocaleString('ru')} ${cur} ${type}`;
  if (from) return `от ${from.toLocaleString('ru')} ${cur} ${type}`;
  if (to) return `до ${to.toLocaleString('ru')} ${cur} ${type}`;
  return 'Зарплата не указана';
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

export { SCHEDULE_LABELS, formatSalary, formatDate };
