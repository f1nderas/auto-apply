# Auto Apply

Сервис для поиска вакансий на HH.ru и автоматической подачи откликов. Монорепо: NestJS бэкенд + React фронтенд.

## Стек

| | Технология |
|---|---|
| **Пакетный менеджер** | Bun workspaces |
| **Бэкенд** | NestJS 11, TypeScript, Axios |
| **Фронтенд** | React 19, TypeScript, RTK Query, Rspack |
| **Стили** | SCSS + BEM |

## Структура

```
auto-apply/
├── server/                  ← NestJS бэкенд (порт 4200)
├── client/                  ← React фронтенд (порт 3000)
├── scripts/                 ← codegen и вспомогательные скрипты
├── .env                     ← переменные окружения (не коммитить)
└── package.json             ← workspace root
```

## Установка

```bash
bun install
```

## Запуск

```bash
bun run dev:server   # бэкенд  → http://localhost:4200
bun run dev:client   # фронтенд → http://localhost:3000
```

## Переменные окружения

Создать `.env` в корне:

```env
PORT=4200
```

> Сессия HH.ru (куки, xsrf-токен) хранится в `server/sessions.json` и управляется через форму **«Обновить сессию»** в интерфейсе — в `.env` не кладётся.

## Что не коммитить

| Файл | Причина |
|---|---|
| `.env` | порты и конфиги окружения |
| `server/sessions.json` | куки и токены HH.ru |
| `server/apply-history.json` | история откликов |

## Генерация API-клиента

```bash
# при запущенном бэкенде:
bun run gen:api
```

Генерирует `client/src/shared/api/generatedApi.ts` — TypeScript-типы и RTK Query хуки из OpenAPI.  
Swagger UI доступен по адресу: http://localhost:4200/api

## Подробнее

- [Frontend →](./client/README.md)
- [Backend →](./server/README.md)
