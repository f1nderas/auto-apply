import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiBody, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResumeStore } from '../vacancies/resume-store.service';
import { parseCurl } from '../utils/parse-curl';

class UpdateSessionDto {
  @IsString()
  @ApiProperty()
  curl: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Хэш резюме — привязывает сессию к конкретному аккаунту',
  })
  resumeHash?: string;
}

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly resumeStore: ResumeStore) {}

  @Post('session')
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    schema: { properties: { ok: { type: 'boolean' } } },
  })
  updateSession(@Body() body: UpdateSessionDto) {
    const parsed = parseCurl(body.curl ?? '');
    if (!parsed.baseUrl?.includes('hh.ru')) {
      throw new HttpException(
        'Нужен cURL с hh.ru, а не со стороннего сайта',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!parsed.cookie || !parsed.xsrfToken) {
      throw new HttpException(
        'Не удалось распарсить cURL: не найдены cookie или x-xsrftoken',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!body.resumeHash) {
      throw new HttpException(
        'resumeHash обязателен — укажите к какому резюме привязать сессию',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.resumeStore.upsert(body.resumeHash, {
      cookie: parsed.cookie,
      xsrfToken: parsed.xsrfToken,
      ...(parsed.staticVersion && { staticVersion: parsed.staticVersion }),
      ...(parsed.baseUrl && { baseUrl: parsed.baseUrl }),
    });
    return { ok: true };
  }
}
