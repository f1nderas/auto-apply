import { useState, useEffect } from 'react';
import { Button } from '@shared/ui/button';
import { Select, type SelectOption } from '@shared/ui/select';
import { useGetProfilesQuery } from '@entities/resume';
import { VacancyInput } from '@features/auto-apply';
import { useGetAreasQuery } from '@features/suggestions';
import './search-form.scss';

interface SearchFormProps {
  onSearch: (text: string, area: number, resumeHash: string) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  // #region STATE
  const [text, setText] = useState('');
  const [area, setArea] = useState<number | null>(null);
  const [resumeHash, setResumeHash] = useState('');
  // #endregion

  // #region HOOK
  const { data: areas } = useGetAreasQuery();
  const { data: profiles } = useGetProfilesQuery();
  // #endregion

  // #region EFFECT
  useEffect(() => {
    if (areas && areas.length > 0 && area === null) {
      setArea(areas[0].value);
    }
  }, [areas]);

  useEffect(() => {
    if (profiles && profiles.length > 0 && !resumeHash) {
      setResumeHash(profiles[0].hash);
    }
  }, [profiles]);
  // #endregion

  // #region COMPUTED
  const areaOptions: SelectOption[] = areas ?? [];
  const resumeOptions: SelectOption[] = (profiles ?? []).map((p) => ({
    value: p.hash,
    label: p.name,
  }));
  // #endregion

  // #region HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area !== null) onSearch(text, area, resumeHash);
  };
  // #endregion

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__main">
        <div className="search-form__card">
          <VacancyInput
            className="search-form__field"
            label="Должность"
            value={text}
            onChange={setText}
            placeholder="Frontend разработчик"
          />
          <Select
            className="search-form__field search-form__field--area"
            label="Регион"
            options={areaOptions}
            value={areaOptions.find((o) => o.value === area) ?? null}
            onChange={(opt) => setArea(Number(opt?.value ?? 1))}
          />
        </div>
        <Button
          type="submit"
          className="search-form__btn"
          isLoading={isLoading}
          isDisabled={!text.trim() || area === null || !resumeHash}
        >
          Найти
        </Button>
      </div>
      <div className="search-form__footer">
        <span className="search-form__resume-prefix">Резюме:</span>
        <Select
          className="search-form__resume"
          options={resumeOptions}
          value={resumeOptions.find((o) => o.value === resumeHash) ?? null}
          onChange={(opt) => setResumeHash(String(opt?.value ?? ''))}
          placeholder="Выберите резюме"
        />
      </div>
    </form>
  );
};

export { SearchForm };
