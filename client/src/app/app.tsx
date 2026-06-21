import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '@shared/store';
import { useGetProfilesQuery } from '@entities/resume';
import { router } from './routes';

// Загружает список резюме один раз при старте — кэш RTK Query отдаёт данные всем компонентам
const ProfilesPrefetch = () => {
  useGetProfilesQuery();
  return null;
};

const App = () => (
  <Provider store={store}>
    <Toaster position="top-center" />
    <ProfilesPrefetch />
    <RouterProvider router={router} />
  </Provider>
);

export { App };
