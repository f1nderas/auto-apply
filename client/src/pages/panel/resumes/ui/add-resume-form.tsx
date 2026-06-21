import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { useAddProfileMutation } from '@entities/resume';
import './add-resume-form.scss';

interface AddResumeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormFields {
  hash: string;
  name: string;
  experience: string;
  curl: string;
}

const EMPTY_FORM: FormFields = { hash: '', name: '', experience: '', curl: '' };

const AddResumeForm = ({ onSuccess, onCancel }: AddResumeFormProps) => {
  // #region STATE
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  // #endregion

  // #region HOOK
  const [addProfile, { isLoading }] = useAddProfileMutation();
  // #endregion

  // #region COMPUTED
  const exp = parseFloat(form.experience);
  const isSubmitDisabled =
    isLoading || !form.hash.trim() || !form.name.trim() || isNaN(exp) || exp <= 0 || !form.curl.trim();
  // #endregion

  // #region HANDLER
  const set = (field: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    try {
      await addProfile({ hash: form.hash.trim(), name: form.name.trim(), experience: exp, curl: form.curl }).unwrap();
      toast.success('Резюме добавлено');
      setForm(EMPTY_FORM);
      onSuccess();
    } catch {
      toast.error('Не удалось добавить резюме');
    }
  };
  // #endregion

  return (
    <div className="resumes__add-form">
      <Input
        placeholder="Hash резюме (из URL на hh.ru)"
        value={form.hash}
        onChange={set('hash')}
      />
      <Input
        placeholder="Имя (например: Иван Иванов)"
        value={form.name}
        onChange={set('name')}
      />
      <Input
        type="number"
        placeholder="Лет опыта (например: 4.5)"
        value={form.experience}
        min={0}
        step={0.5}
        onChange={set('experience')}
      />
      <Textarea
        placeholder="cURL из DevTools → Network → Copy as cURL"
        value={form.curl}
        onChange={set('curl')}
        rows={4}
        spellCheck={false}
      />
      <div className="resumes__add-form-actions">
        <Button onClick={handleSubmit} isDisabled={isSubmitDisabled} isLoading={isLoading}>
          Добавить
        </Button>
        <Button variant="plain" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </div>
  );
};

export { AddResumeForm };
