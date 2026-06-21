import type { ReactNode } from 'react';
import { Landing } from '@pages/landing';
import { Apply } from '@pages/panel/apply';
import { Resume } from '@pages/panel/resume';
import { Vacancies } from '@pages/panel/vacancies';
import { History } from '@pages/panel/history';
import { Resumes } from '@pages/panel/resumes';

export const PANEL_PREFIX = '/panel';

type Layout = 'landing' | 'panel';

interface AppRoute {
  path: string;
  layout: Layout;
  /** Заголовок в сайдбаре. Если не задан — маршрут не отображается в nav */
  label?: string;
  element: ReactNode;
}

export const ROUTES: AppRoute[] = [
  { path: '/', layout: 'landing', element: <Landing /> },
  { path: 'apply', layout: 'panel', label: 'Автоотклики', element: <Apply /> },
  {
    path: 'vacancies',
    layout: 'panel',
    label: 'Вакансии',
    element: <Vacancies />,
  },
  { path: 'history', layout: 'panel', label: 'История', element: <History /> },
  { path: 'resumes', layout: 'panel', label: 'Резюме', element: <Resumes /> },
  { path: 'resume/:hash', layout: 'panel', element: <Resume /> },
];
