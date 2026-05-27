import type { ReactNode } from 'react';
import { SessionUpdateForm } from '@features/session-update';
import { Nav } from './nav/nav';
import './layout.scss';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="layout">
    <header className="layout__header">
      <span className="layout__title">Auto Apply</span>
      <SessionUpdateForm />
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
