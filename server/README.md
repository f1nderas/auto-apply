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

## Куки hh.ru — что и когда меняется

Запросы перестают работать, когда протухают GIB-куки. Ориентир по частоте обновления:

| Cookie / заголовок | Как часто меняется | Почему |
|---|---|---|
| `fgsscgib-w-hh` | **каждые несколько часов** | Group-IB fingerprint — ротируется антиботом |
| `gsscgib-w-hh` | **каждые несколько часов** | Group-IB session token |
| `cfidsgib-w-hh` | **каждые несколько часов** | Group-IB challenge ID |
| `__zzatgib-w-hh` | **каждые несколько часов** | Group-IB challenge response |
| `x-static-version` | при деплоях hh.ru (дни/недели) | версия фронтенда hh.ru |
| `_xsrf` + `x-xsrftoken` | при сбросе браузерной сессии | CSRF-токен, оба должны совпадать |
| `hhtoken` | редко (недели/месяцы) | токен аутентификации |
| `__ddg1_` | стабильный | DataDome fingerprint браузера |

**GIB (Group-IB)** — встроенная в hh.ru антибот-система. Значения `x-gib-*` заголовков всегда должны совпадать с соответствующими куками — сервер парсит их автоматически.

**Алгоритм обновления** когда запросы снова сломались:

1. Открыть DevTools → Network на любой странице hh.ru
2. Найти запрос к `/search/vacancy`, нажать Copy as cURL
3. Вставить в форму обновления сессии в UI (или в `POST /admin/session`)
