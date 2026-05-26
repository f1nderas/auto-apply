# auto-apply — общие правила

Монорепо: `server/` (NestJS) + `client/` (React).  
Детальные правила кода — в [client/CLAUDE.md](./client/CLAUDE.md) и [server/CLAUDE.md](./server/CLAUDE.md).

## Запуск

```powershell
bun run dev:server   # NestJS → http://localhost:4200
bun run dev:client   # React  → http://localhost:3000
```

## Генерация API

```powershell
# при запущенном бэкенде:
bun run gen:api
```

Генерирует `client/src/shared/api/generatedApi.ts` — типы + RTK Query хуки из OpenAPI.  
Конфиг: `scripts/codegen.json`.

## Правила для всего проекта

- **Только именованные экспорты**, всегда в конце файла: `export { Name }`
- **Только `const`** — никаких `function`
- **Без тестов** — не создавать, не упоминать
- **Без лишних комментариев** — только если WHY неочевиден
- **`.env` не коммитить** — содержит `HH_COOKIE`, `HH_XSRF_TOKEN`
