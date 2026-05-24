import { Controller, Get, Query } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';
import { VacanciesResponseDto } from './dto/vacancy-response.dto';

/**
 * Контроллер вакансий.
 * Все маршруты доступны по префиксу /vacancies.
 */
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  /**
   * GET /vacancies?text=Frontend&area=1&page=0&perPage=20
   *
   * Ищет вакансии на HH.ru по заданным параметрам.
   *
   * @param query - параметры поиска из URL
   * @returns список вакансий с пагинацией
   */
  @Get()
  search(@Query() query: SearchVacanciesDto): Promise<VacanciesResponseDto> {
    return this.vacanciesService.search(query);
  }
}
