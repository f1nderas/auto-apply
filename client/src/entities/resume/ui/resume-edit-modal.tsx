import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Modal } from '@shared/ui/modal';
import { Textarea } from '@shared/ui/textarea';
import { useUpdateProfileMutation } from '../api/resumeApi';
import './resume-edit-modal.scss';

interface ResumeEditModalProps {
  hash: string;
  initialName: string;
  initialExperience: number;
  open: boolean;
  onClose: () => void;
}

const ResumeEditModal = ({
  hash,
  initialName,
  initialExperience,
  open,
  onClose,
}: ResumeEditModalProps) => {
  // #region STATE
  const [name, setName] = useState(initialName);
  const [experience, setExperience] = useState(String(initialExperience));
  const [curl, setCurl] = useState('');
  const [showCurl, setShowCurl] = useState(false);
  // #endregion

  // #region HOOK
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  // #endregion

  // #region HANDLER
  const handleClose = () => {
    setName(initialName);
    setExperience(String(initialExperience));
    setCurl('');
    setShowCurl(false);
    onClose();
  };

  const handleSave = async () => {
    const exp = parseFloat(experience);
    if (!name.trim() || isNaN(exp) || exp <= 0) return;
    try {
      await updateProfile({
        hash,
        name: name.trim(),
        experience: exp,
        ...(curl.trim() ? { curl: curl.trim() } : {}),
      }).unwrap();
      toast.success('Резюме обновлено');
      handleClose();
    } catch {
      toast.error('Не удалось обновить резюме');
    }
  };
  // #endregion

  return (
    <Modal open={open} onClose={handleClose} title="Редактировать резюме">
      <Input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="number"
        placeholder="Лет опыта (например: 4.5)"
        value={experience}
        min={0}
        step={0.5}
        onChange={(e) => setExperience(e.target.value)}
        disabled={isLoading}
      />

      <div className="resume-edit-modal__session">
        <Button
          variant="plain"
          className="resume-edit-modal__session-toggle"
          onClick={() => setShowCurl((v) => !v)}
          disabled={isLoading}
        >
          {showCurl ? 'Скрыть обновление сессии' : 'Обновить сессию (cURL)'}
        </Button>
        {showCurl && (
          <Textarea
            placeholder="Вставьте cURL из DevTools → Network → Copy as cURL"
            value={curl}
            onChange={(e) => setCurl(e.target.value)}
            rows={5}
            spellCheck={false}
            disabled={isLoading}
          />
        )}
      </div>

      <div className="resume-edit-modal__actions">
        <Button
          onClick={handleSave}
          disabled={isLoading || !name.trim() || isNaN(parseFloat(experience)) || parseFloat(experience) <= 0}
          loading={isLoading}
        >
          Сохранить
        </Button>
        <Button variant="plain" onClick={handleClose} disabled={isLoading}>
          Отмена
        </Button>
      </div>
    </Modal>
  );
};

export { ResumeEditModal };
