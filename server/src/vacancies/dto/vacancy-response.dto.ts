import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SalaryDto {
  @ApiPropertyOptional({ type: Number, nullable: true })
  from: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  to: number | null;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  gross: boolean;
}

export class EmployerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  accreditedIt: boolean;
}

export class VacancyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  area: string;

  @ApiPropertyOptional({ type: SalaryDto, nullable: true })
  salary: SalaryDto | null;

  @ApiProperty({ type: EmployerDto })
  employer: EmployerDto;

  @ApiProperty()
  experience: string;

  @ApiProperty()
  employment: string;

  @ApiProperty()
  schedule: string;

  @ApiProperty()
  responseLetterRequired: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  requirement: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  responsibility: string | null;

  @ApiProperty()
  publishedAt: string;
}

export class VacanciesResponseDto {
  @ApiProperty({ type: VacancyDto, isArray: true })
  vacancies: VacancyDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiPropertyOptional({ type: Number, nullable: true })
  pages: number | null;
}
