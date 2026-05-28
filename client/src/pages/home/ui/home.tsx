import { useState } from 'react';
import { useGetResumeQuery, useUpdateAboutMutation } from '@entities/resume';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import './home.scss';

const Home = () => {
  // #region STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  // #endregion

  // #region HOOK
  const { data, isLoading, isError } = useGetResumeQuery();
  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();
  // #endregion

  // #region HANDLER
  const handleEditStart = () => {
    setEditText(data?.about ?? '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    await updateAbout({ text: editText });
    setIsEditing(false);
  };
  // #endregion

  if (isLoading) return <div className="home__message">Загрузка резюме...</div>;
  if (isError || !data) return <div className="home__error">Не удалось загрузить резюме</div>;

  return (
    <div className="home">
      <div className="home__card">
        <h1 className="home__name">{data.name}</h1>
        <p className="home__title">{data.title}</p>

        {data.keySkills.length > 0 && (
          <div className="home__skills">
            {data.keySkills.map((skill) => (
              <Badge key={skill} variant="blue">{skill}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="home__card">
        <div className="home__about-header">
          <h2 className="home__section-title">О себе</h2>
          {!isEditing && (
            <Button variant="plain" className="home__edit-btn" onClick={handleEditStart}>
              Редактировать
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="home__about-edit">
            <Textarea
              className="home__about-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={6}
              autoFocus
            />
            <div className="home__about-actions">
              <Button onClick={handleSave} loading={isSaving} disabled={isSaving}>
                Сохранить
              </Button>
              <Button variant="plain" className="home__cancel-btn" onClick={handleCancel} disabled={isSaving}>
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <p className="home__about-text">{data.about || '—'}</p>
        )}
      </div>
    </div>
  );
};

export { Home };
