import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Query-параметры для поиска вакансий.
 * Пример запроса: GET /vacancies?text=Frontend&area=1&page=0&perPage=20
 */
export class SearchVacanciesDto {
  /** Поисковый запрос. Например: "Frontend разработчик" */
  @IsString()
  text: string;

  /**
   * ID региона HH.ru.
   * 1 = Москва, 2 = Санкт-Петербург, 160 = Казахстан и т.д.
   * Полный список: https://api.hh.ru/areas
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  area?: number = 1;

  /**
   * Номер страницы (начиная с 0).
   * HH.ru возвращает не более 2000 вакансий (40 страниц по 50).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  /**
   * Кол-во вакансий на странице.
   * Максимум 100 по ограничениям HH.ru API.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage?: number = 20;
}
