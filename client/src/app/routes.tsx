import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Landing } from '@pages/landing';
import { Apply } from '@pages/home';
import { Resume } from '@pages/resume';
import { Vacancies } from '@pages/vacancies';
import { History } from '@pages/history';
import { Resumes } from '@pages/resumes';
import { Layout } from './ui/layout';
import { LandingLayout } from './ui/landing-layout';

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
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
