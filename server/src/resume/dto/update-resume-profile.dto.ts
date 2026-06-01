import { IsNumber, IsOptional, IsString } from 'class-validator';
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
  @ApiPropertyOptional({ description: 'cURL из DevTools — обновляет сессию если передан' })
  curl?: string;
}

export { UpdateResumeProfileDto };
