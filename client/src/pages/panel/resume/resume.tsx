import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetResumeQuery, useUpdateAboutMutation } from '@entities/resume';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { Title } from '@shared/ui/title';
import './resume.scss';

const Resume = () => {
  // #region STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  // #endregion

  // #region HOOK
  const { hash } = useParams<{ hash: string }>();
  const { data, isLoading, isError } = useGetResumeQuery(hash ?? '', { skip: !hash });
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
    if (!hash) return;
    await updateAbout({ hash, text: editText });
    setIsEditing(false);
  };
  // #endregion

  return (
    <div className="resume">
      <Link to="/" className="resume__back">← Назад</Link>

      {isLoading && <div className="resume__message">Загрузка резюме...</div>}

      {(isError || (!isLoading && !data)) && (
        <div className="resume__error">Не удалось загрузить резюме</div>
      )}

      {data && (
        <>
          <div className="resume__card">
            <Title className="resume__name">{data.name}</Title>
            <p className="resume__title">{data.title}</p>

            {data.keySkills.length > 0 && (
              <div className="resume__skills">
                {data.keySkills.map((skill) => (
                  <Badge key={skill} variant="blue">{skill}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="resume__card">
            <div className="resume__about-header">
              <Title as="h2">О себе</Title>
              {!isEditing && (
                <Button variant="plain" className="resume__edit-btn" onClick={handleEditStart}>
                  Редактировать
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="resume__about-edit">
                <Textarea
                  className="resume__about-textarea"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={6}
                  autoFocus
                />
                <div className="resume__about-actions">
                  <Button onClick={handleSave} isDisabled={isSaving}>
                    Сохранить
                  </Button>
                  <Button
                    variant="plain"
                    className="resume__cancel-btn"
                    onClick={handleCancel}
                    isDisabled={isSaving}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <p className="resume__about-text">{data.about || '—'}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export { Resume };
