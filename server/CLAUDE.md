# Server — правила кода

## Общие

Только `const`, именованные экспорты в конце файла. Без тестов. Комментарии только если WHY неочевиден.  
Все файлы — **kebab-case**. `git mv` при переименовании/перемещении — иначе git теряет историю.

## Структура модуля

Каждая фича — отдельный модуль (`controller`, `service`, `module`). DTO в `dto/`, интерфейсы внешних API в `interfaces/`.

## Swagger / OpenAPI

Каждый контроллер — `@ApiTags`, каждый endpoint — `@ApiResponse` + `@ApiQuery`/`@ApiBody`.  
Каждое поле выходного DTO — `@ApiProperty()` / `@ApiPropertyOptional()`, иначе кодоген не подхватит тип.

## DTO

`ValidationPipe` включён с `whitelist: true` — все поля входных DTO **обязаны** иметь декоратор `class-validator` (`@IsString()`, `@IsNumber()` и т.д.), иначе вырезаются. `@ApiProperty()` не считается.

## SessionStore

Singleton-сервис в `VacanciesModule`, экспортируется для `AdminModule`. Инициализируется из `.env`, обновляется через `POST /admin/session`.

## HH.ru

- API: `https://hh.ru/search/vacancy` (внутренний Web API, не `api.hh.ru`)
- GIB-заголовки парсятся автоматически из строки кук
- В запрос уходит только необходимое подмножество кук (аутентификация + GIB-антибот)
- `baseUrl` хранится в `SessionStore`, может быть региональным поддоменом
