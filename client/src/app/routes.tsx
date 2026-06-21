import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { PanelLayout } from './ui/panel-layout';
import { LandingLayout } from './ui/landing-layout';
import { ROUTES, PANEL_PREFIX } from './routes-config';

const LandingWrapper = () => (
  <LandingLayout>
    <Outlet />
  </LandingLayout>
);

const PanelWrapper = () => (
  <PanelLayout>
    <Outlet />
  </PanelLayout>
);

const router = createBrowserRouter([
  {
    element: <LandingWrapper />,
    children: ROUTES.filter((r) => r.layout === 'landing'),
  },
  {
    path: PANEL_PREFIX,
    element: <PanelWrapper />,
    children: ROUTES.filter((r) => r.layout === 'panel').map(({ path, element }) => ({ path, element })),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export { router };
