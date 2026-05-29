# Client — React фронтенд

React 19 + TypeScript + RTK Query + Rspack. Порт **3000**.

## Запуск

```bash
bun run dev     # из папки client/
# или из корня:
bun run dev:client
```

## Архитектура — FSD

`src/` разбит на слои. Импорты строго вниз по слоям:

```
app/       ← инициализация, провайдеры, Layout, роутер
pages/     ← страницы (собирают фичи/entities)
features/  ← пользовательские сценарии
entities/  ← бизнес-сущности
shared/    ← утилиты, конфиг, базовое API, UI-компоненты, стили
```

Каждый слой экспортирует через `index.ts` — импортировать только из него.

## Страницы

| Путь | Компонент | Описание |
|---|---|---|
| `/` | Home | Главная |
| `/vacancies` | Vacancies | Поиск и отклики на вакансии |
| `/resume/:hash` | Resume | Просмотр и редактирование резюме |
| `/history` | History | История откликов с фильтрацией |
| `/users` | Users | Управление пользователями |

## Алиасы

```ts
import { cx } from '@shared/lib/cx';
import { VacancyCard } from '@entities/vacancy';
import { SearchForm } from '@features/vacancy-search';
import type { VacancyDto } from '@dto';   // → shared/api/generatedApi.ts
```

Внутри слайса — относительные пути: `'../lib/format'`.

## RTK Query

Базовый инстанс: `shared/api/baseApi.ts` (теги: `ActiveSession`, `History`).  
Сгенерированный файл: `shared/api/generatedApi.ts` — не редактировать вручную.

Хуки ре-экспортируются из слоёв с читаемыми именами:

```ts
export { useLazyVacanciesControllerSearchQuery as useLazySearchVacanciesQuery }
  from '@shared/api/generatedApi';
```

Эндпоинты, не покрытые кодогеном (History), определяются через `injectEndpoints` в feature-слое.

## Shared UI

| Компонент | Варианты |
|---|---|
| `Button` | `primary`, `plain` |
| `Input` | — |
| `Textarea` | — |
| `Select` | — |
| `Badge` | `green`, `red`, `gray` |
| `Pagination` | — |

## Уведомления

`react-hot-toast` с позицией `top-center`. Использовать `toast.success` / `toast.error`.

## Стили

Глобальный SCSS + БЭМ, без CSS Modules.  
Цвета: `@use '.../shared/styles/colors'` → `colors.$color-*`.  
Типографика: `@use '.../shared/styles/typography'` → `@include typography.font-*`.  
Правила кода — в [CLAUDE.md](./CLAUDE.md).
