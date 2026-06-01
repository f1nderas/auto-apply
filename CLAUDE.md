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

## Перемещение и переименование файлов

**Всегда использовать `git mv`** — иначе git видит это как удаление + создание и теряет историю изменений файла.

```powershell
# Переименование
git mv src/features/foo/old-name.tsx src/features/foo/new-name.tsx

# Перемещение
git mv src/features/foo/bar.tsx src/widgets/foo/bar.tsx

# Перемещение папки целиком
git mv src/features/foo/ui src/widgets/foo/ui
```

На Windows NTFS смена только регистра требует промежуточного шага (иначе git не видит изменение):

```powershell
git mv src/app/App.tsx src/app/_app.tsx
git mv src/app/_app.tsx src/app/app.tsx
```
