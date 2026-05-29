import { useEffect, useState } from 'react';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { PROFILES } from '@entities/resume';
import { cx } from '@shared/lib/cx';
import { useUpdateSessionMutation } from '../api/sessionApi';
import './session-update-form.scss';

const SessionUpdateForm = () => {
  // #region STATE
  const [open, setOpen] = useState(false);
  const [curl, setCurl] = useState('');
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  // #endregion

  // #region HOOK
  const [updateSession, { isLoading, isSuccess, isError, error, reset }] =
    useUpdateSessionMutation();
  // #endregion

  // #region EFFECT
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setOpen(false), 1200);
    return () => clearTimeout(timer);
  }, [isSuccess]);
  // #endregion

  // #region COMPUTED
  const errorMsg = isError
    ? error && 'data' in error
      ? String((error.data as { message?: string })?.message ?? error.status)
      : 'Неизвестная ошибка'
    : null;
  // #endregion

  // #region HANDLER
  const handleOpen = () => {
    reset();
    setCurl('');
    setSelectedHash(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    updateSession({ curl, ...(selectedHash ? { resumeHash: selectedHash } : {}) });
  };
  // #endregion

  // #region STYLES
  const accountBtnClass = (hash: string) =>
    cx(
      'session-update-modal__account-btn',
      hash === selectedHash && 'session-update-modal__account-btn--active',
    );
  const noBtnClass = cx(
    'session-update-modal__account-btn',
    selectedHash === null && 'session-update-modal__account-btn--active',
  );
  // #endregion

  return (
    <>
      <Button
        variant="plain"
        className="session-update__trigger"
        onClick={handleOpen}
      >
        Обновить сессию
      </Button>

      {open && (
        <div className="session-update-modal__overlay" onClick={handleClose}>
          <div
            className="session-update-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="session-update-modal__header">
              <span className="session-update-modal__title">Обновить сессию</span>
              <Button
                variant="plain"
                className="session-update-modal__close"
                onClick={handleClose}
              >
                ✕
              </Button>
            </div>

            <div className="session-update-modal__accounts">
              <span className="session-update-modal__accounts-label">Аккаунт</span>
              <div className="session-update-modal__accounts-btns">
                {PROFILES.map((p) => (
                  <button
                    key={p.hash}
                    className={accountBtnClass(p.hash)}
                    onClick={() => setSelectedHash(p.hash)}
                  >
                    {p.name}
                  </button>
                ))}
                <button className={noBtnClass} onClick={() => setSelectedHash(null)}>
                  Без привязки
                </button>
              </div>
            </div>

            <Textarea
              className="session-update-modal__textarea"
              placeholder="Вставьте cURL из DevTools → Network → Copy as cURL"
              value={curl}
              onChange={(e) => setCurl(e.target.value)}
              rows={6}
              spellCheck={false}
              autoFocus
            />

            <div className="session-update-modal__footer">
              <Button
                variant="plain"
                className="session-update-modal__submit"
                onClick={handleSubmit}
                disabled={isLoading || !curl.trim()}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              {isSuccess && (
                <span className="session-update-modal__status session-update-modal__status--ok">
                  Сессия обновлена
                </span>
              )}
              {isError && (
                <span className="session-update-modal__status session-update-modal__status--error">
                  {errorMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { SessionUpdateForm };
