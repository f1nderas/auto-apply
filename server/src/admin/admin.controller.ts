import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiBody, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionStore } from '../vacancies/session-store.service';

class UpdateSessionDto {
  @IsString()
  @ApiProperty()
  curl: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Хэш резюме — привязывает сессию к конкретному аккаунту и переключается на него',
  })
  resumeHash?: string;
}

class SwitchSessionDto {
  @IsString()
  @ApiProperty()
  hash: string;
}

// Парсит строку cURL: Windows cmd (^ + двойные кавычки) и Unix/bash (одинарные кавычки)
const parseCurl = (input: string) => {
  // Убираем Windows cmd ^ экранирование
  let s = '';
  let i = 0;
  while (i < input.length) {
    if (input[i] === '^' && i + 1 < input.length) {
      s += input[i + 1];
      i += 2;
    } else {
      s += input[i];
      i++;
    }
  }

  const q = `(?:'([^']*)'|"([^"]*)")`;

  const cookieMatch = s.match(new RegExp(`(?:-b|--cookie)\\s+\\$?${q}`));
  const rawCookieStr = cookieMatch?.[1] ?? cookieMatch?.[2] ?? null;
  // Нормализуем markdown-порчу имён кук: \_name → _name, **name → __name
  const cookie = rawCookieStr
    ? rawCookieStr
        .replace(/\\_/g, '_')
        .replace(/(^|;\s*)\*\*([a-zA-Z])/g, '$1__$2')
    : null;

  const xsrfMatch = s.match(
    new RegExp(
      `-H\\s+(?:'x-xsrftoken:\\s*([^']*)'|"x-xsrftoken:\\s*([^"]*)")`,
      'i',
    ),
  );
  const xsrfFromHeader = (xsrfMatch?.[1] ?? xsrfMatch?.[2])?.trim() ?? null;
  const xsrfFromCookie =
    cookieMatch?.[1]?.match(/_xsrf=([^;]+)/)?.[1] ??
    cookieMatch?.[2]?.match(/_xsrf=([^;]+)/)?.[1] ??
    null;
  const xsrfToken = xsrfFromHeader ?? xsrfFromCookie;

  const versionMatch = s.match(
    new RegExp(
      `-H\\s+(?:'x-static-version:\\s*([^']*)'|"x-static-version:\\s*([^"]*)")`,
      'i',
    ),
  );
  const versionFromHeader =
    (versionMatch?.[1] ?? versionMatch?.[2])?.trim() ?? null;
  const versionFromBaggage =
    s.match(/sentry-release=xhh(?:%40|@)([0-9.]+)/i)?.[1] ?? null;
  const staticVersion = versionFromHeader ?? versionFromBaggage;

  const urlMatch = s.match(/curl\s+['"]?(https?:\/\/[^/?#'"\s]+)/i);
  const baseUrl = urlMatch ? new URL(urlMatch[1]).origin : null;

  return { cookie, xsrfToken, staticVersion, baseUrl };
};

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly sessionStore: SessionStore) {}

  @Get('session/active')
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        hash: { type: 'string', nullable: true },
        registeredHashes: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  getActiveSession() {
    return {
      hash: this.sessionStore.getActiveHash(),
      registeredHashes: this.sessionStore.listRegisteredHashes(),
    };
  }

  @Post('session/switch')
  @ApiBody({ type: SwitchSessionDto })
  @ApiResponse({
    status: 200,
    schema: { properties: { ok: { type: 'boolean' } } },
  })
  switchSession(@Body() body: SwitchSessionDto) {
    this.sessionStore.setActive(body.hash);
    return { ok: true };
  }

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

    const sessionPatch = {
      cookie: parsed.cookie,
      xsrfToken: parsed.xsrfToken,
      ...(parsed.staticVersion && { staticVersion: parsed.staticVersion }),
      ...(parsed.baseUrl && { baseUrl: parsed.baseUrl }),
    };

    this.sessionStore.upsert(body.resumeHash ?? '_default', sessionPatch);
    return { ok: true };
  }
}
