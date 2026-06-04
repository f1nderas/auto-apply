import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UpdateResumeProfileDto {
  @IsString()
  @ApiProperty({ example: 'Иван Иванов' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 3.5, description: 'Количество лет опыта' })
  experience: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Строка кук — обновляет сессию если передана',
  })
  cookie?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  xsrfToken?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  staticVersion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  baseUrl?: string;
}

export { UpdateResumeProfileDto };
