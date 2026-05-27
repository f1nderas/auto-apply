import type { ReactNode } from 'react';
import { SessionUpdateForm } from '@features/session-update';
import './layout.scss';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="layout">
    <header className="layout__header">
      <span className="layout__title">Auto Apply</span>
      <SessionUpdateForm />
    </header>
    <main className="layout__main">{children}</main>
  </div>
);

export { Layout };
