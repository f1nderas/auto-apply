# Server — правила кода

## Структура модуля

Каждая фича — отдельный модуль: `controller`, `service`, `module`.  
DTO отдельно в `dto/`, интерфейсы внешних API — в `interfaces/`.

```
feature/
├── dto/
├── interfaces/
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

## Swagger / OpenAPI

На каждый контроллер и DTO добавлять декораторы, чтобы кодоген фронтенда работал корректно:

```ts
@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {
  @Get()
  @ApiResponse({ status: 200, type: VacanciesResponseDto })
  @ApiQuery({ name: 'text', type: String })
  search(@Query() query: SearchVacanciesDto) { ... }
}
```

```ts
export class VacancyDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  requirement: string | null;
}
```

## DTO

Входные DTO — в `dto/`, с валидацией через `class-validator` если нужно.  
Выходные DTO — с `@ApiProperty()` на каждом поле (иначе кодоген не подхватит тип).

**Важно:** `ValidationPipe` включён с `whitelist: true` — все поля входных DTO **обязаны** иметь декоратор из `class-validator` (`@IsString()`, `@IsNumber()` и т.д.), иначе они будут вырезаны из запроса. `@ApiProperty()` не считается.

## SessionStore

`SessionStore` — singleton-сервис в `VacanciesModule`, экспортируется для `AdminModule`.  
Инициализируется из `.env` через `ConfigService`, обновляется в рантайме через `POST /admin/session`.

## HH.ru — важное

- API: `https://hh.ru/search/vacancy` (внутренний Web API, не `api.hh.ru`)
- GIB-заголовки (`x-gib-fgsscgib-w-hh`, `x-gib-gsscgib-w-hh`) парсятся автоматически из строки кук
- В запрос уходит только необходимое подмножество кук (аутентификация + GIB-антибот)
- `baseUrl` хранится в `SessionStore` и обновляется вместе с сессией (может быть региональным поддоменом)
