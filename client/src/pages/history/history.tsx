import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Select } from '@shared/ui/select';
import type { SelectOption } from '@shared/ui/select';
import { Title } from '@shared/ui/title';
import { useGetProfilesQuery } from '@entities/resume';
import { useGetHistoryQuery, useGetHistoryStatsQuery, useClearHistoryMutation } from '@features/history';
import type { HistoryRecord } from '@features/history';
import './history.scss';

type StatusFilter = 'all' | 'success' | 'failed';

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'success', label: 'Прошли' },
  { value: 'failed', label: 'Не прошли' },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const History = () => {
  // #region STATE
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [resumeFilter, setResumeFilter] = useState<string>('all');
  // #endregion

  // #region HOOK
  const { data, isLoading, isError } = useGetHistoryQuery();
  const { data: stats } = useGetHistoryStatsQuery();
  const { data: profiles } = useGetProfilesQuery();
  const [clearHistory] = useClearHistoryMutation();
  // #endregion

  // #region HANDLER
  const handleClear = async () => {
    await clearHistory();
    toast.success('История очищена');
  };
  // #endregion

  // #region COMPUTED
  const records: HistoryRecord[] = [...(data ?? [])].reverse();
  const filtered = records
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) => resumeFilter === 'all' || r.resumeHash === resumeFilter);

  const resumeName = (hash: string) =>
    profiles?.find((p) => p.hash === hash)?.name ?? hash;

  const resumeOptions: SelectOption[] = [
    { value: 'all', label: 'Все резюме' },
    ...(profiles ?? []).map((p) => ({ value: p.hash, label: p.name })),
  ];
  // #endregion

  // #region STYLES
  const filterClass = (value: StatusFilter) =>
    cx('history__filter', filter === value && 'history__filter--active');
  // #endregion

  if (isLoading)
    return (
      <div className="history">
        <p className="history__state">Загрузка…</p>
      </div>
    );
  if (isError)
    return (
      <div className="history">
        <p className="history__state history__state--error">Ошибка загрузки истории</p>
      </div>
    );

  return (
    <div className="history">
      <div className="history__header">
        <Title>История откликов</Title>
        <div className="history__filters">
          {FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              variant="plain"
              className={filterClass(value)}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Select
          className="history__resume-select"
          options={resumeOptions}
          value={resumeFilter}
          onChange={(v) => setResumeFilter(String(v ?? 'all'))}
        />
        {records.length > 0 && (
          <Button variant="plain" className="history__clear" onClick={handleClear}>
            Очистить
          </Button>
        )}
      </div>

      {stats && (
        <div className="history__stats">
          <div className="history__stat">
            <span className="history__stat-value">{stats.total}</span>
            <span className="history__stat-label">Всего</span>
          </div>
          <div className="history__stat">
            <span className="history__stat-value history__stat-value--success">{stats.success}</span>
            <span className="history__stat-label">Прошли</span>
          </div>
          <div className="history__stat">
            <span className="history__stat-value history__stat-value--failed">{stats.failed}</span>
            <span className="history__stat-label">Не прошли</span>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="history__state">
          {records.length === 0 ? 'Откликов пока нет' : 'Нет записей с таким фильтром'}
        </p>
      ) : (
        <table className="history__table">
          <thead>
            <tr>
              <th className="history__th">Вакансия</th>
              <th className="history__th">Работодатель</th>
              <th className="history__th">Резюме</th>
              <th className="history__th">Статус</th>
              <th className="history__th">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={`${r.vacancyId}-${i}`} className="history__row">
                <td className="history__td history__td--name">
                  <a
                    href={`https://hh.ru/vacancy/${r.vacancyId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="history__link"
                  >
                    {r.vacancyName}
                  </a>
                </td>
                <td className="history__td">{r.employer}</td>
                <td className="history__td history__td--resume">
                  {resumeName(r.resumeHash)}
                </td>
                <td className="history__td">
                  <Badge variant={r.status === 'success' ? 'green' : 'red'}>
                    {r.status === 'success' ? 'Отклик прошёл' : 'Не прошёл'}
                  </Badge>
                </td>
                <td className="history__td history__td--date">
                  {formatDate(r.appliedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export { History };
