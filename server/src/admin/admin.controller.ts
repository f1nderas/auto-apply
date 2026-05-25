import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionStore } from '../vacancies/session-store.service';

class UpdateSessionDto {
  @ApiProperty()
  curl: string;
}

// Парсит строку cURL (включая Windows cmd формат с ^ экранированием)
const parseCurl = (input: string) => {
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

  const cookieMatch = s.match(/(?:-b|--cookie)\s+"([^"]+)"/);
  const xsrfMatch = s.match(/-H\s+"x-xsrftoken:\s*([^"]+?)"/i);
  const versionMatch = s.match(/-H\s+"x-static-version:\s*([^"]+?)"/i);
  const urlMatch = s.match(/curl\s+"(https?:\/\/[^/?#"]+)/i);

  return {
    cookie: cookieMatch?.[1] ?? null,
    xsrfToken: xsrfMatch?.[1]?.trim() ?? null,
    staticVersion: versionMatch?.[1]?.trim() ?? null,
    baseUrl: urlMatch ? new URL(urlMatch[1]).origin : null,
  };
};

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly sessionStore: SessionStore) {}

  @Post('session')
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    schema: { properties: { ok: { type: 'boolean' } } },
  })
  updateSession(@Body() body: UpdateSessionDto) {
    const parsed = parseCurl(body.curl ?? '');
    if (!parsed.cookie || !parsed.xsrfToken) {
      throw new HttpException(
        'Не удалось распарсить cURL: не найдены cookie или x-xsrftoken',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.sessionStore.update({
      cookie: parsed.cookie,
      xsrfToken: parsed.xsrfToken,
      ...(parsed.staticVersion && { staticVersion: parsed.staticVersion }),
      ...(parsed.baseUrl && { baseUrl: parsed.baseUrl }),
    });
    return { ok: true };
  }
}
