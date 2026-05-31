import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@shared/ui/button';
import { SessionUpdateForm } from '@features/session-update';
import { SessionSwitcher } from './session-switcher/session-switcher';
import { Nav } from './nav/nav';
import './layout.scss';

// #region HANDLER
const handleClearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
  toast.success('Куки очищены');
};
// #endregion

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="layout">
    <header className="layout__header">
      <span className="layout__title">Auto Apply</span>
      <SessionSwitcher />
      <div className="layout__header-actions">
        <Button variant="plain" onClick={handleClearCookies}>
          Очистить куки
        </Button>
        <SessionUpdateForm />
      </div>
    </header>
    <div className="layout__body">
      <aside className="layout__sidebar">
        <Nav />
      </aside>
      <main className="layout__main">{children}</main>
    </div>
  </div>
);

export { Layout };
