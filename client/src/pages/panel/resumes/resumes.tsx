import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { useGetProfilesQuery, ResumeCard } from '@entities/resume';
import { AddResumeForm } from './ui/add-resume-form';
import './resumes.scss';

const Resumes = () => {
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
    <div className="resumes">
      {isLoading && <p className="resumes__loading">Загрузка…</p>}

      {profiles?.map((r) => (
        <ResumeCard key={r.hash} hash={r.hash} name={r.name} experience={r.experience} />
      ))}

      {showForm ? (
        <AddResumeForm onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <Button variant="plain" className="resumes__add-btn" onClick={() => setShowForm(true)}>
          + Добавить резюме
        </Button>
      )}
    </div>
  );
};

export { Resumes };
