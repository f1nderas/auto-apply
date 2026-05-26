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
app/       ← инициализация, провайдеры, Layout
pages/     ← страницы (собирают фичи/entities)
features/  ← пользовательские сценарии
entities/  ← бизнес-сущности (vacancy и др.)
shared/    ← утилиты, конфиг, базовое API, стили
```

Каждый слой экспортирует через `index.ts` — импортировать только из него.

## Алиасы

```ts
import { cx } from '@shared/lib/cx';
import { VacancyCard } from '@entities/vacancy';
import { SearchForm } from '@features/vacancy-search';
import { VacanciesPage } from '@pages/vacancies-page';
import type { VacancyDto } from '@dto';   // → shared/api/generatedApi.ts
```

Внутри слайса — относительные пути: `'../lib/format'`.

## RTK Query

API-клиент генерируется автоматически (см. корневой README).  
Базовый инстанс: `shared/api/baseApi.ts`.  
Сгенерированный файл: `shared/api/generatedApi.ts`.  
Entity/feature слои ре-экспортируют нужные хуки с читаемыми именами:

```ts
// entities/vacancy/api/vacancyApi.ts
export { useLazyVacanciesControllerSearchQuery as useLazySearchVacanciesQuery } from '@shared/api/generatedApi';
```

## Стили

Глобальный SCSS + БЭМ. Подробнее — в [CLAUDE.md](./CLAUDE.md).
