import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';
import { VacanciesResponseDto } from './dto/vacancy-response.dto';
import { ApplyVacancyDto, ApplyResponseDto } from './dto/apply-vacancy.dto';

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

  @Post('apply')
  @ApiResponse({ status: 201, type: ApplyResponseDto })
  @ApiBody({ type: ApplyVacancyDto })
  apply(@Body() dto: ApplyVacancyDto): Promise<ApplyResponseDto> {
    return this.vacanciesService.apply(dto);
  }
}
