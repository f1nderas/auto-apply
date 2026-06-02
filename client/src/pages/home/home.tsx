import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { useGetProfilesQuery, useAddProfileMutation, ResumeCard } from '@entities/resume';
import { AutoApplyBtn } from './ui/auto-apply-btn';
import './home.scss';

const Home = () => {
  // #region STATE
  const [showForm, setShowForm] = useState(false);
  const [hash, setHash] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState<string>('');
  const [curl, setCurl] = useState('');
  // #endregion

  // #region HOOK
  const { data: profiles, isLoading } = useGetProfilesQuery();
  const [addProfile, { isLoading: isAdding }] = useAddProfileMutation();
  // #endregion

  // #region HANDLER
  const handleAdd = async () => {
    const exp = parseFloat(experience);
    if (!hash.trim() || !name.trim() || isNaN(exp) || exp <= 0 || !curl.trim()) return;
    try {
      await addProfile({ hash: hash.trim(), name: name.trim(), experience: exp, curl }).unwrap();
      toast.success('Резюме добавлено');
      setHash('');
      setName('');
      setExperience('');
      setCurl('');
      setShowForm(false);
    } catch {
      toast.error('Не удалось добавить резюме');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setHash('');
    setName('');
    setExperience('');
    setCurl('');
  };
  // #endregion

  return (
    <div className="home">
      <AutoApplyBtn />

      {isLoading && <p className="home__loading">Загрузка…</p>}

      {profiles?.map((r) => (
        <ResumeCard
          key={r.hash}
          hash={r.hash}
          name={r.name}
          experience={r.experience}
        />
      ))}

      {showForm ? (
        <div className="home__add-form">
          <Input
            placeholder="Hash резюме (из URL на hh.ru)"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
          <Input
            placeholder="Имя (например: Иван Иванов)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Лет опыта (например: 4.5)"
            value={experience}
            min={0}
            step={0.5}
            onChange={(e) => setExperience(e.target.value)}
          />
          <Textarea
            placeholder="cURL из DevTools → Network → Copy as cURL"
            value={curl}
            onChange={(e) => setCurl(e.target.value)}
            rows={4}
            spellCheck={false}
          />
          <div className="home__add-form-actions">
            <Button
              onClick={handleAdd}
              isDisabled={isAdding || !hash.trim() || !name.trim() || isNaN(parseFloat(experience)) || parseFloat(experience) <= 0 || !curl.trim()}
              isLoading={isAdding}
            >
              Добавить
            </Button>
            <Button variant="plain" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="plain" className="home__add-btn" onClick={() => setShowForm(true)}>
          + Добавить резюме
        </Button>
      )}
    </div>
  );
};

export { Home };
