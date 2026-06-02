import { Title } from '@shared/ui/title';
import './users.scss';

const Users = () => (
  <div className="users">
    <Title className="users__title">Пользователи</Title>
    <p className="users__empty">Список пользователей пока пуст</p>
  </div>
);

export { Users };
