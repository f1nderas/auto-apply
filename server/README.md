# Server — NestJS бэкенд

NestJS 11 + TypeScript + SWC + Bun. Порт **4200**.

## Запуск

```bash
bun run dev     # из папки server/
# или из корня:
bun run dev:server
```

Swagger UI: http://localhost:4200/api  
OpenAPI JSON: http://localhost:4200/api-json

## Структура

```
src/
├── admin/          ← управление сессиями (парсинг cURL, переключение)
├── vacancies/      ← поиск вакансий и подача откликов
│   └── session-store.service.ts  ← singleton, хранит сессии в памяти
├── resume/         ← получение и редактирование резюме
├── history/        ← история откликов (persist в apply-history.json)
└── cover-letter/   ← шаблон сопроводительного письма
```

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/vacancies` | Поиск вакансий (text, area, page, perPage) |
| `POST` | `/vacancies/apply` | Подать отклик (vacancyId, letter?) |
| `GET` | `/resume/:hash` | Получить данные резюме |
| `PATCH` | `/resume/:hash/about` | Обновить раздел «О себе» |
| `GET` | `/admin/session/active` | Активная сессия и список хешей |
| `POST` | `/admin/session` | Добавить сессию из cURL |
| `POST` | `/admin/session/switch` | Переключить активную сессию |
| `POST` | `/history` | Записать отклик в историю |
| `GET` | `/history` | Получить всю историю откликов |

## Переменные окружения

`.env` в корне монорепо:

```env
PORT=4200
```

Сессия HH.ru (куки, xsrf-токен) хранится в `sessions.json` и управляется через форму **«Обновить сессию»** в интерфейсе — в `.env` не кладётся.

## Что не коммитить

| Файл | Причина |
|---|---|
| `resumes.json` | профили и куки/токены HH.ru |
| `apply-history.json` | история откликов |
| `sessions.json` | устарело — данные перенесены в resumes.json |

## SessionStore

`SessionStore` — singleton-сервис. Хранит `Map<hash, Session>` + активный хеш, персистит в `sessions.json`.

Сессия содержит:
- `cookies` — строка куки для запросов к HH.ru
- `xsrfToken` — токен для POST-запросов
- `staticVersion` — версия статики (нужна для некоторых эндпоинтов)
- `baseUrl` — базовый URL (hh.ru / headhunter.ru)

## HH.ru — сессия

Используется внутренний Web API `https://hh.ru/search/vacancy` (не `api.hh.ru`).

- Отклик отправляется через `POST /applicant/vacancy_response` с FormData
- Запросы идут с заголовками браузерного fingerprint (sec-ch-ua, sec-fetch-*)
- GIB-куки ротируются антиботом — при сбоях нужно обновить сессию через UI

**Алгоритм обновления сессии** когда запросы сломались:

1. Открыть DevTools → Network на любой странице hh.ru
2. Найти любой запрос, нажать Copy as cURL
3. Вставить в форму «Обновить сессию» в UI

## Куки hh.ru — частота ротации

| Cookie | Как часто меняется | Причина |
|---|---|---|
| `fgsscgib-w-hh` | каждые несколько часов | Group-IB fingerprint |
| `gsscgib-w-hh` | каждые несколько часов | Group-IB session token |
| `__zzatgib-w-hh` | каждые несколько часов | Group-IB challenge response |
| `_xsrf` | при сбросе браузерной сессии | CSRF-токен |
| `hhtoken` | редко (недели/месяцы) | токен аутентификации |
