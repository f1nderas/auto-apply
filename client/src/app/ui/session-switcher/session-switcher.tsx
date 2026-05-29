import { useState } from 'react';
import { useGetActiveSessionQuery, useSwitchSessionMutation } from '@entities/session';
import { PROFILES } from '@entities/resume';
import { cx } from '@shared/lib/cx';
import './session-switcher.scss';

const SessionSwitcher = () => {
  // #region STATE
  const [hintHash, setHintHash] = useState<string | null>(null);
  // #endregion

  // #region HOOK
  const { data } = useGetActiveSessionQuery();
  const [switchSession] = useSwitchSessionMutation();
  // #endregion

  // #region COMPUTED
  const activeHash = data?.hash ?? null;
  const registeredHashes = data?.registeredHashes ?? [];
  // #endregion

  // #region HANDLER
  const handleClick = (hash: string) => {
    if (!registeredHashes.includes(hash)) {
      setHintHash(hash === hintHash ? null : hash);
      return;
    }
    setHintHash(null);
    switchSession({ hash });
  };
  // #endregion

  // #region STYLES
  const btnClass = (hash: string) =>
    cx(
      'session-switcher__btn',
      hash === activeHash && 'session-switcher__btn--active',
      !registeredHashes.includes(hash) && 'session-switcher__btn--no-session',
    );
  // #endregion

  return (
    <div className="session-switcher">
      {PROFILES.map((p) => (
        <div key={p.hash} className="session-switcher__item">
          <button className={btnClass(p.hash)} onClick={() => handleClick(p.hash)}>
            {p.name}
            {!registeredHashes.includes(p.hash) && (
              <span className="session-switcher__dot" />
            )}
          </button>
          {hintHash === p.hash && (
            <div className="session-switcher__hint">
              Вставьте curl через «Обновить сессию», выбрав этот аккаунт
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { SessionSwitcher };
