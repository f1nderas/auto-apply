import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '@shared/store';
import { Home } from '@pages/home';
import { Resume } from '@pages/resume';
import { Vacancies } from '@pages/vacancies';
import { Users } from '@pages/users';
import { History } from '@pages/history';
import { Layout } from './ui/layout';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-center" />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume/:hash" element={<Resume />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/users" element={<Users />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </Provider>
);

export { App };
