import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cx } from '@shared/lib/cx';
import { Button } from '@shared/ui/button';
import { Checkbox } from '@shared/ui/checkbox';
import { Tooltip } from '@shared/ui/tooltip';
import { NumberSlider } from '@shared/ui/number-slider';
import { Select, type SelectOption } from '@shared/ui/select';
import { Textarea } from '@shared/ui/textarea';
import { useAppSelector } from '@shared/store/hooks';
import { selectSelectedHashes } from '@entities/resume';
import {
  VacancyInput,
  useStartAutoApplyMutation,
  useStopAutoApplyMutation,
  useAutoApplySocket,
} from '@features/auto-apply';
import { useGetAreasQuery } from '@features/suggestions';
import './auto-apply-btn.scss';

const enum Phase {
  Idle = 'idle',
  Running = 'running',
  Done = 'done',
}

const AutoApplyBtn = () => {
  // #region STATE
  const [text, setText] = useState('');
  const [area, setArea] = useState<number | null>(null);
  const [count, setCount] = useState(3);
  const [searchInTitle, setSearchInTitle] = useState(true);
  const [searchInDescription, setSearchInDescription] = useState(true);
  const [isRemote, setIsRemote] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [sendLetterToAll, setSendLetterToAll] = useState(false);
  // #endregion

  // #region HOOK
  const selectedHashes = useAppSelector(selectSelectedHashes);
  const { data: areas } = useGetAreasQuery();
  const [startAutoApply] = useStartAutoApplyMutation();
  const [stopAutoApply] = useStopAutoApplyMutation();
  const { isRunning, done, total, results, error, reset } = useAutoApplySocket();
  // #endregion

  // #region EFFECT
  useEffect(() => {
    if (areas && areas.length > 0 && area === null) {
      setArea(areas[0].value);
    }
  }, [areas]);
  // #endregion

  // #region COMPUTED
  const searchFields = [
    ...(searchInTitle ? ['name'] : []),
    ...(searchInDescription ? ['description'] : []),
  ];
  const areaOptions: SelectOption[] = (areas ?? []).map((a) => ({ value: a.value, label: a.label }));
  const canStart = !!text.trim() && area !== null && selectedHashes.length > 0 && !isRunning && searchFields.length > 0;

  const startBlockReasons = !canStart && !isRunning ? [
    !text.trim() && 'Введите поисковый запрос',
    selectedHashes.length === 0 && 'Выберите хотя бы одно резюме',
    searchFields.length === 0 && 'Выберите хотя бы одно поле поиска',
  ].filter(Boolean) as string[] : [];
  const isDone = !isRunning && total > 0;
  const isCompleted = isDone && done === total;
  // #endregion

  // #region HANDLER
  const handleStart = async () => {
    if (!canStart) return;
    reset();
    try {
      await startAutoApply({
        text: text.trim(),
        area: area ?? 0,
        count,
        resumeHashes: selectedHashes,
        searchFields,
        workFormat: isRemote ? 'REMOTE' : undefined,
        coverLetter: coverLetter.trim() || undefined,
        sendLetterToAll: sendLetterToAll && !!coverLetter.trim(),
      }).unwrap();
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
      <Select
        options={areaOptions}
        value={areaOptions.find((o) => o.value === area) ?? null}
        onChange={(opt) => setArea(opt ? Number(opt.value) : 0)}
        isDisabled={isRunning}
        label="Регион"
      />
      <NumberSlider
        label="Количество вакансий для отклика"
        value={count}
        min={1}
        max={50}
        onChange={setCount}
        isDisabled={isRunning}
      />

      <div className="auto-apply-btn__filters">
        <Checkbox className="auto-apply-btn__filter" checked={searchInTitle} onChange={setSearchInTitle} isDisabled={isRunning} label="В названии" />
        <Checkbox className="auto-apply-btn__filter" checked={searchInDescription} onChange={setSearchInDescription} isDisabled={isRunning} label="В описании" />
        <Checkbox className="auto-apply-btn__filter" checked={isRemote} onChange={setIsRemote} isDisabled={isRunning} label="Удалённая" />
      </div>

      <Textarea
        className="auto-apply-btn__letter"
        placeholder="Сопроводительное письмо (для вакансий где оно обязательно)"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        rows={3}
        disabled={isRunning}
        spellCheck={false}
      />
      <Checkbox
        className="auto-apply-btn__filter"
        checked={sendLetterToAll}
        onChange={setSendLetterToAll}
        isDisabled={isRunning || !coverLetter.trim()}
        label="Прикладывать письмо ко всем вакансиям"
      />

      {error && <p className="auto-apply-btn__hint">{error}</p>}

      <div className="auto-apply-btn__actions">
        {total > 0 && (
          <span className="auto-apply-btn__progress">{done} / {total}</span>
        )}

        {!isRunning && (
          <Tooltip
            content={startBlockReasons.length > 0 ? (
              <ul className="tooltip__list">
                {startBlockReasons.map((r) => <li key={r}>{r}</li>)}
              </ul>
            ) : null}
          >
            <Button variant="plain" className={runBtnClass} onClick={handleStart} isDisabled={!canStart}>
              {isDone ? 'Запустить снова' : 'Запустить'}
            </Button>
          </Tooltip>
        )}

        {isRunning && (
          <Button variant="plain" onClick={handleStop}>Стоп</Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="auto-apply-btn__results">
          {results.map((r, i) => (
            <p key={`${r.vacancyId}-${i}`} className="auto-apply-btn__hint">
              {r.success ? '✓' : '✗'} {r.vacancyName.slice(0, 50)}
              {r.letterAdded === false && ' · письмо не доставлено'}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export { AutoApplyBtn };
