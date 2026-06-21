import { useState, useEffect } from 'react';
import { Button } from '@shared/ui/button';
import { Checkbox } from '@shared/ui/checkbox';
import { Select, type SelectOption } from '@shared/ui/select';
import { useGetProfilesQuery } from '@entities/resume';
import { VacancyInput } from '@features/auto-apply';
import { useGetAreasQuery } from '@features/suggestions';
import './search-form.scss';

interface SearchParams {
  text: string;
  area: number;
  resumeHash: string;
  searchFields: string[];
  isRemote: boolean;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  // #region STATE
  const [text, setText] = useState('');
  const [area, setArea] = useState<number | null>(null);
  const [resumeHash, setResumeHash] = useState('');
  const [searchInTitle, setSearchInTitle] = useState(true);
  const [searchInDescription, setSearchInDescription] = useState(true);
  const [isRemote, setIsRemote] = useState(false);
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
  const areaOptions: SelectOption[] = (areas ?? []).map((a) => ({ value: a.value, label: a.label }));
  const resumeOptions: SelectOption[] = (profiles ?? []).map((p) => ({
    value: p.hash,
    label: p.name,
  }));
  const searchFields = [
    ...(searchInTitle ? ['name'] : []),
    ...(searchInDescription ? ['description'] : []),
  ];
  // #endregion

  // #region HANDLER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area === null) return;
    onSearch({ text, area, resumeHash, searchFields, isRemote });
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
            onChange={(opt) => setArea(opt ? Number(opt.value) : 0)}
          />
        </div>
        <Button
          type="submit"
          className="search-form__btn"
          isLoading={isLoading}
          isDisabled={!text.trim() || area === null || !resumeHash || searchFields.length === 0}
        >
          Найти
        </Button>
      </div>

      <div className="search-form__filters">
        <Checkbox className="search-form__filter" checked={searchInTitle} onChange={setSearchInTitle} label="В названии вакансии" />
        <Checkbox className="search-form__filter" checked={searchInDescription} onChange={setSearchInDescription} label="В описании вакансии" />
        <Checkbox className="search-form__filter" checked={isRemote} onChange={setIsRemote} label="Удалённая работа" />
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
export type { SearchParams };
