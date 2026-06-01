import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { useAppDispatch, useAppSelector } from '@shared/store/hooks';
import { toggleHash, selectSelectedHashes } from '../model/resume-select-slice';
import { ResumeEditModal } from './resume-edit-modal';
import './resume-card.scss';

interface ResumeCardProps {
  hash: string;
  name: string;
  experience: number;
}

const ResumeCard = ({ hash, name, experience }: ResumeCardProps) => {
  // #region STATE
  const [editOpen, setEditOpen] = useState(false);
  // #endregion

  // #region HOOK
  const dispatch = useAppDispatch();
  const selectedHashes = useAppSelector(selectSelectedHashes);
  // #endregion

  // #region COMPUTED
  const isSelected = selectedHashes.includes(hash);
  // #endregion

  // #region HANDLER
  const handleToggle = () => dispatch(toggleHash(hash));
  // #endregion

  return (
    <>
      <div className="resume-card">
        <label className="resume-card__checkbox-label">
          <Input
            type="checkbox"
            className="resume-card__checkbox"
            checked={isSelected}
            onChange={handleToggle}
          />
        </label>
        <div className="resume-card__info">
          <span className="resume-card__name">{name}</span>
          <span className="resume-card__exp">{experience} лет опыта</span>
        </div>
        <div className="resume-card__actions">
          <Button variant="plain" onClick={() => setEditOpen(true)}>
            Изменить
          </Button>
          <Link to={`/resume/${hash}`} className="resume-card__btn">
            Подробнее
          </Link>
        </div>
      </div>

      <ResumeEditModal
        hash={hash}
        initialName={name}
        initialExperience={experience}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
};

export { ResumeCard };
export type { ResumeCardProps };
