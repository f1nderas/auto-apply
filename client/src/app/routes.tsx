import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Landing } from '@pages/landing';
import { Apply } from '@pages/panel/apply';
import { Resume } from '@pages/panel/resume';
import { Vacancies } from '@pages/panel/vacancies';
import { History } from '@pages/panel/history';
import { Resumes } from '@pages/panel/resumes';
import { PanelLayout } from './ui/panel-layout';
import { LandingLayout } from './ui/landing-layout';

const AppLayout = () => (
  <PanelLayout>
    <Outlet />
  </PanelLayout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout><Landing /></LandingLayout>,
  },
  {
    path: '/panel',
    element: <AppLayout />,
    children: [
      { path: 'apply',         element: <Apply /> },
      { path: 'resume/:hash',  element: <Resume /> },
      { path: 'vacancies',     element: <Vacancies /> },
      { path: 'history',       element: <History /> },
      { path: 'resumes',       element: <Resumes /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export { router };
