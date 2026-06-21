import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/button';
import './landing.scss';

const FEATURES = [
  {
    icon: '🤖',
    title: 'Автоотклики',
    description: 'Массовые отклики на вакансии — выберите резюме, настройте фильтры, добавьте сопроводительное письмо и запустите одним кликом',
    to: '/panel/apply',
    cta: 'Запустить',
  },
  {
    icon: '🔍',
    title: 'Поиск вакансий',
    description: 'Ручной поиск с фильтрами по региону, формату работы и ключевым словам в названии или описании',
    to: '/panel/vacancies',
    cta: 'Искать',
  },
  {
    icon: '📋',
    title: 'История откликов',
    description: 'Лог всех отправленных откликов с результатами — какие прошли успешно, какие нет и по какому резюме',
    to: '/panel/history',
    cta: 'Открыть',
  },
  {
    icon: '👤',
    title: 'Резюме и профили',
    description: 'Управление профилями HH.ru: добавляйте резюме через cURL и обновляйте сессии когда истекают куки',
    to: '/panel/resumes',
    cta: 'Управлять',
  },
] as const;

const Landing = () => {
  // #region HANDLER
  const navigate = useNavigate();
  // #endregion

  return (
    <div className="landing">
      <section className="landing__hero">
        <h1 className="landing__title">Auto Apply</h1>
        <p className="landing__subtitle">
          Автоматизируй отклики на HH.ru — настрой параметры поиска, выбери резюме и запусти массовые отклики одним кликом
        </p>
        <Button className="landing__cta" onClick={() => navigate('/panel/apply')}>
          Начать →
        </Button>
      </section>

      <section className="landing__features">
        {FEATURES.map(({ icon, title, description, to, cta }) => (
          <div key={to} className="landing__card">
            <span className="landing__card-icon">{icon}</span>
            <h2 className="landing__card-title">{title}</h2>
            <p className="landing__card-desc">{description}</p>
            <Button variant="plain" className="landing__card-btn" onClick={() => navigate(to)}>
              {cta} →
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
};

export { Landing };
