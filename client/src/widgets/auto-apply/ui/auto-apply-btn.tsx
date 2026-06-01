import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { useDebounce } from '@shared/lib/use-debounce';
import { Button } from '@shared/ui/button';
import { Combobox } from '@shared/ui/combobox';
import { NumberSlider } from '@shared/ui/number-slider';
import { useAppSelector } from '@shared/store/hooks';
import { useLazySearchVacanciesQuery, useApplyVacancyMutation } from '@entities/vacancy';
import { selectSelectedHashes } from '@entities/resume';
import { useAddHistoryMutation, useLazyGetSuggestionsQuery } from '@features/auto-apply';
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
  const selectedHashes = useAppSelector(selectSelectedHashes);
  const debouncedText = useDebounce(text, 400);
  // #endregion

  // #region EFFECT
  useEffect(() => {
    const params = debouncedText.trim() ? { query: debouncedText.trim() } : undefined;
    void fetchSuggestions(params).unwrap().then(setSuggestions).catch(() => {});
  }, [debouncedText, fetchSuggestions]);
  // #endregion

  // #region HANDLER
  const handleRun = async () => {
    if (!text.trim() || phase === 'running' || selectedHashes.length === 0) return;
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

    const totalOps = candidates.length * selectedHashes.length;
    setTotal(totalOps);
    let done = 0;

    for (const resumeHash of selectedHashes) {
      for (const v of candidates) {
        await sleep(2000);
        done++;
        setCurrent(done);

        let success = false;
        try {
          const res = await applyVacancy({
            applyVacancyDto: { vacancyId: v.id, resumeHash },
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
          resumeHash,
        });
      }
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
    phase === 'running' ? `${current} / ${total}…` :
    phase === 'done'    ? 'Готово' :
                          'Запустить';

  const isDisabled = phase === 'running' || !text.trim() || selectedHashes.length === 0;
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
      {selectedHashes.length === 0 && (
        <p className="auto-apply-btn__hint">Выберите резюме для отклика</p>
      )}
      <Button
        variant="plain"
        className={btnClass}
        onClick={handleRun}
        disabled={isDisabled}
        loading={phase === 'running'}
      >
        {btnLabel}
      </Button>
    </div>
  );
};

export { AutoApplyBtn };
