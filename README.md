# Auto Apply

Сервис для поиска вакансий на HH.ru с возможностью автоподачи заявок. Монорепо: NestJS бэкенд + React фронтенд.

## Стек

| | Технология |
|---|---|
| **Пакетный менеджер** | Bun workspaces |
| **Бэкенд** | NestJS 11, TypeScript, SWC |
| **Фронтенд** | React 19, TypeScript, RTK Query, Rspack |

## Структура

```
auto-apply/
├── server/        ← NestJS бэкенд (порт 4200)
├── client/        ← React фронтенд (порт 3000)
├── scripts/       ← вспомогательные скрипты
├── .env           ← переменные окружения (не коммитить)
└── package.json   ← workspace root
```

## Установка

```bash
bun install
```

## Запуск

```bash
bun run dev:server   # бэкенд → http://localhost:4200
bun run dev:client   # фронтенд → http://localhost:3000
```

## Переменные окружения

Создать `.env` в корне (в `.gitignore`, не коммитить):

```env
PORT=4200
HH_XSRF_TOKEN=<токен из DevTools>
HH_COOKIE=<куки из DevTools>
```

При истечении сессии HH.ru — вставить новый cURL через форму **«Обновить сессию»** прямо в интерфейсе (кнопка в шапке).

## Генерация API-клиента

```bash
# 1. Запусти бэкенд
bun run dev:server

# 2. Из корня:
bun run gen:api
```

Генерирует `client/src/shared/api/generatedApi.ts` — TypeScript-типы и RTK Query хуки из OpenAPI спека бэкенда.  
Swagger UI: http://localhost:4200/api

## Подробнее

- [Frontend →](./client/README.md)
- [Backend →](./server/README.md)
