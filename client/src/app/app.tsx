import { Provider } from 'react-redux';
import { store } from '@shared/store';
import { Layout } from './ui/layout';
import { VacanciesPage } from '@pages/vacancies-page';

const App = () => (
  <Provider store={store}>
    <Layout>
      <VacanciesPage />
    </Layout>
  </Provider>
);

export { App };
