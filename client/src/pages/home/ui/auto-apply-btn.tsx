import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { Button } from '@shared/ui/button';
import { NumberSlider } from '@shared/ui/number-slider';
import { useAppSelector } from '@shared/store/hooks';
import { selectSelectedHashes } from '@entities/resume';
import {
  VacancyInput,
  useStartAutoApplyMutation,
  useStopAutoApplyMutation,
  useAutoApplySocket,
} from '@features/auto-apply';
import './auto-apply-btn.scss';

const AutoApplyBtn = () => {
  // #region STATE
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  // #endregion

  // #region HOOK
  const selectedHashes = useAppSelector(selectSelectedHashes);
  const [startAutoApply] = useStartAutoApplyMutation();
  const [stopAutoApply] = useStopAutoApplyMutation();
  const { isRunning, done, total, results, error, reset } = useAutoApplySocket();
  // #endregion

  // #region COMPUTED
  const canStart = !!text.trim() && selectedHashes.length > 0 && !isRunning;
  const isDone = !isRunning && total > 0;
  const isCompleted = isDone && done === total;
  // #endregion

  // #region HANDLER
  const handleStart = async () => {
    if (!canStart) return;
    reset();
    try {
      await startAutoApply({ text: text.trim(), area: 1, count, resumeHashes: selectedHashes }).unwrap();
    } catch {
      toast.error('Не удалось запустить авто-отклик');
    }
  };

  const handleStop = () => {
    void stopAutoApply();
  };
  // #endregion

  // #region STYLES
  const runBtnClass = cx(isCompleted && 'auto-apply-btn__run--done');
  // #endregion

  return (
    <div className="auto-apply-btn">
      <VacancyInput
        className="auto-apply-btn__query"
        placeholder="Поисковый запрос…"
        value={text}
        onChange={setText}
        isDisabled={isRunning}
      />
      <NumberSlider
        value={count}
        min={1}
        max={50}
        onChange={setCount}
        isDisabled={isRunning}
      />

      {selectedHashes.length === 0 && (
        <p className="auto-apply-btn__hint">Выберите резюме для отклика</p>
      )}

      {error && (
        <p className="auto-apply-btn__hint">{error}</p>
      )}

      <div className="auto-apply-btn__actions">
        {total > 0 && (
          <span className="auto-apply-btn__progress">{done} / {total}</span>
        )}

        {!isRunning && (
          <Button
            variant="plain"
            className={runBtnClass}
            onClick={handleStart}
            isDisabled={!canStart}
          >
            {isDone ? 'Запустить снова' : 'Запустить'}
          </Button>
        )}

        {isRunning && (
          <Button variant="plain" onClick={handleStop}>
            Стоп
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="auto-apply-btn__results">
          {results.map((r, i) => (
            <p key={`${r.vacancyId}-${i}`} className="auto-apply-btn__hint">
              {r.success ? '✓' : '✗'} {r.vacancyName.slice(0, 50)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export { AutoApplyBtn };
