import type { ReactNode } from 'react';
import './landing-layout.scss';

const LandingLayout = ({ children }: { children: ReactNode }) => (
  <div className="landing-layout">{children}</div>
);

export { LandingLayout };
