import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { useDebounce } from '@shared/lib/use-debounce';
import { Button } from '@shared/ui/button';
import { Combobox } from '@shared/ui/combobox';
import { NumberSlider } from '@shared/ui/number-slider';
import {
  useLazySearchVacanciesQuery,
  useApplyVacancyMutation,
} from '@entities/vacancy';
import { useAddHistoryMutation } from '../api/history-api';
import { useLazyGetSuggestionsQuery } from '../api/suggestions-api';
import './auto-apply-btn.scss';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const AutoApplyBtn = () => {
  // #region STATE
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  // #endregion

  // #region HOOK
  const [fetchSuggestions] = useLazyGetSuggestionsQuery();
  const [fetchVacancies] = useLazySearchVacanciesQuery();
  const [applyVacancy] = useApplyVacancyMutation();
  const [addHistory] = useAddHistoryMutation();
  const debouncedText = useDebounce(text, 400);
  // #endregion

  // #region EFFECT
  useEffect(() => {
    const params = debouncedText.trim()
      ? { query: debouncedText.trim() }
      : undefined;
    void fetchSuggestions(params)
      .unwrap()
      .then(setSuggestions)
      .catch(() => {});
  }, [debouncedText, fetchSuggestions]);
  // #endregion

  // #region HANDLER
  const handleRun = async () => {
    if (!text.trim() || phase === 'running') return;
    setPhase('running');
    setCurrent(0);

    const result = await fetchVacancies({
      text: text.trim(),
      area: 1,
      page: 0,
      perPage: Math.min(count * 2 + 20, 100),
    });
    const vacancies = result.data?.vacancies ?? [];

    const candidates = vacancies
      .filter((v) => !v.applicationStatus && !v.responseLetterRequired)
      .slice(0, count);

    if (candidates.length === 0) {
      toast.error('Нет подходящих вакансий для авто-отклика');
      setPhase('idle');
      return;
    }

    setTotal(candidates.length);

    for (let i = 0; i < candidates.length; i++) {
      await sleep(2000);
      const v = candidates[i];
      setCurrent(i + 1);

      let success = false;
      try {
        const res = await applyVacancy({
          applyVacancyDto: { vacancyId: v.id },
        }).unwrap();
        success = res.ok;
      } catch {}

      toast[success ? 'success' : 'error'](
        `${success ? '✓' : '✗'} ${v.name.slice(0, 50)}`,
      );
      addHistory({
        vacancyId: v.id,
        vacancyName: v.name,
        employer: v.employer.name,
        status: success ? 'success' : 'failed',
      });
    }

    setPhase('done');
    setTimeout(() => {
      setPhase('idle');
      setCurrent(0);
    }, 3000);
  };
  // #endregion

  // #region COMPUTED
  const btnLabel =
    phase === 'running'
      ? `${current} / ${total}…`
      : phase === 'done'
        ? 'Готово'
        : 'Запустить';
  // #endregion

  // #region STYLES
  const btnClass = cx(phase === 'done' && 'auto-apply-btn__run--done');
  // #endregion

  return (
    <div className="auto-apply-btn">
      <Combobox
        className="auto-apply-btn__query"
        placeholder="Поисковый запрос…"
        value={text}
        options={suggestions}
        onChange={setText}
        disabled={phase === 'running'}
      />
      <NumberSlider
        value={count}
        min={1}
        max={50}
        onChange={setCount}
        disabled={phase === 'running'}
      />
      <Button
        variant="plain"
        className={btnClass}
        onClick={handleRun}
        disabled={phase === 'running' || !text.trim()}
        loading={phase === 'running'}
      >
        {btnLabel}
      </Button>
    </div>
  );
};

export { AutoApplyBtn };
