import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddResumeProfileDto {
  @IsString()
  @ApiProperty({ example: '08a5aea1ff1024b7b80039ed1f69426f49744f' })
  hash: string;

  @IsString()
  @ApiProperty({ example: 'Иван Иванов' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 3.5, description: 'Количество лет опыта' })
  experience: number;

  @IsString()
  @ApiProperty({ description: 'Строка кук из DevTools' })
  cookie: string;

  @IsString()
  @ApiProperty({ description: 'Значение x-xsrftoken заголовка' })
  xsrfToken: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Значение x-static-version заголовка' })
  staticVersion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Базовый URL (например https://hh.ru)' })
  baseUrl?: string;
}

export { AddResumeProfileDto };
