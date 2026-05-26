# Server — NestJS бэкенд

NestJS 11 + TypeScript + SWC + Bun. Порт **4200**.

## Запуск

```bash
bun run dev     # из папки server/
# или из корня:
bun run dev:server
```

## Структура

```
src/
├── vacancies/
│   ├── dto/                  ← входные/выходные DTO (с @ApiProperty)
│   ├── interfaces/           ← типы внутреннего API HH.ru
│   ├── session-store.service.ts  ← хранит сессию в памяти
│   ├── vacancies.controller.ts
│   └── vacancies.service.ts  ← маппинг HH → наши DTO
└── admin/
    ├── admin.controller.ts   ← POST /admin/session (обновление сессии)
    └── admin.module.ts
```

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/vacancies` | Поиск вакансий на HH.ru |
| `POST` | `/admin/session` | Обновление сессии (cURL) |

Swagger UI: http://localhost:4200/api  
OpenAPI JSON: http://localhost:4200/api-json

## Переменные окружения

`.env` в корне монорепо:

```env
PORT=4200
HH_XSRF_TOKEN=<токен из DevTools>
HH_COOKIE=<строка кук из DevTools>
```

## HH.ru — сессия

Используется внутренний Web API `https://hh.ru/search/vacancy` (не `api.hh.ru`).

- **GIB-антибот**: заголовки `x-gib-fgsscgib-w-hh` и `x-gib-gsscgib-w-hh` парсятся автоматически из `HH_COOKIE`
- **Фильтрация кук**: в запрос уходит только необходимое подмножество (аутентификация + GIB), аналитика отбрасывается
- **Обновление сессии**: через форму в UI (Copy as cURL → вставить) или напрямую через `POST /admin/session`
- Сессия хранится в памяти (`SessionStore`) — при рестарте сервера подтягивается из `.env`
