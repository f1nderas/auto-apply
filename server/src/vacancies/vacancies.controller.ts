import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';
import { VacanciesResponseDto } from './dto/vacancy-response.dto';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiResponse({ status: 200, type: VacanciesResponseDto })
  @ApiQuery({ name: 'text', type: String })
  @ApiQuery({ name: 'area', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  search(@Query() query: SearchVacanciesDto): Promise<VacanciesResponseDto> {
    return this.vacanciesService.search(query);
  }
}
