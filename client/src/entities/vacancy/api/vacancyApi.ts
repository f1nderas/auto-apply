import { API_BASE } from '@shared/config/api';
import type { VacanciesResponseDto } from '@dto';

const searchVacancies = async (
  text: string,
  area = 1,
  page = 0,
  perPage = 20,
): Promise<VacanciesResponseDto> => {
  const params = new URLSearchParams({
    text,
    area: String(area),
    page: String(page),
    perPage: String(perPage),
  });
  const res = await fetch(`${API_BASE}/vacancies?${params}`);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
};

export { searchVacancies };
