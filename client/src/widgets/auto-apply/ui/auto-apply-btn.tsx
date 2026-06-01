import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { Button } from '@shared/ui/button';
import { NumberSlider } from '@shared/ui/number-slider';
import { useAppSelector } from '@shared/store/hooks';
import { useLazySearchVacanciesQuery, useApplyVacancyMutation } from '@entities/vacancy';
import { selectSelectedHashes } from '@entities/resume';
import { useAddHistoryMutation, SuggestionsCombobox } from '@features/auto-apply';
import './auto-apply-btn.scss';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const enum Phase {
  Idle = 'idle',
  Running = 'running',
  Done = 'done',
}

const AutoApplyBtn = () => {
  // #region STATE
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState<Phase>(Phase.Idle);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  // #endregion

  // #region HOOK
  const [fetchVacancies] = useLazySearchVacanciesQuery();
  const [applyVacancy] = useApplyVacancyMutation();
  const [addHistory] = useAddHistoryMutation();
  const selectedHashes = useAppSelector(selectSelectedHashes);
  // #endregion

  // #region HANDLER
  const handleRun = async () => {
    if (!text.trim() || phase === Phase.Running || selectedHashes.length === 0) return;
    setPhase(Phase.Running);
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
      setPhase(Phase.Idle);
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

    setPhase(Phase.Done);
    setTimeout(() => {
      setPhase(Phase.Idle);
      setCurrent(0);
    }, 3000);
  };
  // #endregion

  // #region COMPUTED
  const btnLabel =
    phase === Phase.Running ? `${current} / ${total}…` :
    phase === Phase.Done    ? 'Готово' :
                              'Запустить';

  const isSubmitDisabled = phase === Phase.Running || !text.trim() || selectedHashes.length === 0;
  // #endregion

  // #region STYLES
  const btnClass = cx(phase === Phase.Done && 'auto-apply-btn__run--done');
  // #endregion

  return (
    <div className="auto-apply-btn">
      <SuggestionsCombobox
        className="auto-apply-btn__query"
        placeholder="Поисковый запрос…"
        value={text}
        onChange={setText}
        isDisabled={phase === Phase.Running}
      />
      <NumberSlider
        value={count}
        min={1}
        max={50}
        onChange={setCount}
        isDisabled={phase === Phase.Running}
      />
      {selectedHashes.length === 0 && (
        <p className="auto-apply-btn__hint">Выберите резюме для отклика</p>
      )}
      <Button
        variant="plain"
        className={btnClass}
        onClick={handleRun}
        isDisabled={isSubmitDisabled}
        isLoading={phase === Phase.Running}
      >
        {btnLabel}
      </Button>
    </div>
  );
};

export { AutoApplyBtn };
