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
- **`.env` не коммитить** — содержит секреты (порты, ключи)
- **`server/sessions.json` не коммитить** — содержит куки HH.ru, добавлен в `.gitignore`

## Именование файлов

Все файлы — **kebab-case**: `vacancy-card.tsx`, `vacancies.service.ts`, `search-form.tsx`.

При переименовании файлов использовать `git mv`. На Windows NTFS для смены регистра —
обязательный промежуточный шаг (иначе git не видит изменение):

```powershell
git mv src/app/App.tsx src/app/_app.tsx
git mv src/app/_app.tsx src/app/app.tsx
```
