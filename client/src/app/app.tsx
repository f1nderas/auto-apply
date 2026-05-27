import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from '@shared/store';
import { Home } from '@pages/home';
import { Vacancies } from '@pages/vacancies';
import { Users } from '@pages/users';
import { Layout } from './ui/layout';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </Provider>
);

export { App };
