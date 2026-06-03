import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { useGetProfilesQuery, ResumeCard } from '@entities/resume';
import { AutoApplyBtn } from './ui/auto-apply-btn';
import { AddResumeForm } from './ui/add-resume-form';
import './home.scss';

const Home = () => {
  // #region STATE
  const [showForm, setShowForm] = useState(false);
  // #endregion

  // #region HOOK
  const { data: profiles, isLoading } = useGetProfilesQuery();
  // #endregion

  // #region HANDLER
  const handleSuccess = () => setShowForm(false);
  const handleCancel = () => setShowForm(false);
  // #endregion

  return (
    <div className="home">
      <AutoApplyBtn />

      {isLoading && <p className="home__loading">Загрузка…</p>}

      {profiles?.map((r) => (
        <ResumeCard key={r.hash} hash={r.hash} name={r.name} experience={r.experience} />
      ))}

      {showForm ? (
        <AddResumeForm onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <Button variant="plain" className="home__add-btn" onClick={() => setShowForm(true)}>
          + Добавить резюме
        </Button>
      )}
    </div>
  );
};

export { Home };
