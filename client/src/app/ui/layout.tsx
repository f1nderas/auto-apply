import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from './nav/nav';
import './layout.scss';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="layout">
    <header className="layout__header">
      <Link to="/" className="layout__title">Auto Apply</Link>
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
