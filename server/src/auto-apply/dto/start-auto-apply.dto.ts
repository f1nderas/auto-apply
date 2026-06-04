import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

class StartAutoApplyDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ description: '0 = без фильтра по региону' })
  @IsNumber()
  area: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  resumeHashes: string[];

  @ApiPropertyOptional({ type: [String], example: ['name', 'description'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiPropertyOptional({ type: String, example: 'REMOTE' })
  @IsOptional()
  @IsString()
  workFormat?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Шаблон письма для вакансий с обязательным сопроводительным',
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Прикладывать письмо ко всем вакансиям через edit_ajax' })
  @IsOptional()
  @IsBoolean()
  sendLetterToAll?: boolean;
}

export { StartAutoApplyDto };
