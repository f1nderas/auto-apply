import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type, Transform, type TransformFnParams } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVacanciesDto {
  @ApiProperty({ example: 'Frontend разработчик' })
  @IsString()
  text: string;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    description: '0 = без фильтра по региону',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  area?: number;

  @ApiPropertyOptional({ type: Number, default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @ApiPropertyOptional({ type: Number, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage: number = 20;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  resumeHash?: string;

  @ApiPropertyOptional({ type: [String], example: ['name', 'description'] })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string[] =>
    Array.isArray(value) ? (value as string[]) : [value as string],
  )
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiPropertyOptional({ type: String, example: 'REMOTE' })
  @IsOptional()
  @IsString()
  workFormat?: string;
}
