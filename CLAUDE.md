# auto-apply

## Стек
- **Backend**: NestJS 11, TypeScript, SWC builder, Bun (порт 4200)
- **Frontend**: React 19, TypeScript, Rspack, Bun (порт 3000)
- **Пакетный менеджер**: Bun workspaces (root = `auto-apply/`)

## Структура монорепо
```
auto-apply/
├── server/        ← NestJS бэкенд
│   └── src/
├── client/        ← React фронтенд (FSD)
│   └── src/
└── package.json   ← workspace root (только скрипты и workspaces)
```

## Frontend — FSD архитектура
`client/src/` разбит на слои. Импорты только вниз по слоям:
```
app/       ← инициализация, провайдеры
pages/     ← страницы (собирают виджеты/фичи)
features/  ← пользовательские сценарии
entities/  ← бизнес-сущности (vacancy и т.д.)
shared/    ← константы, утилиты, базовое API
```
Каждый слой имеет публичный `index.ts` — импортируй только из него, не из внутренних путей.

## Алиасы импортов
Кросс-слойные импорты — через алиасы (не относительные пути):
```ts
import { cx } from '@shared/lib/cx';
import { VacancyCard } from '@entities/vacancy';
import { SearchForm } from '@features/vacancy-search';
import { VacanciesPage } from '@pages/vacancies-page';
import type { VacancyDto } from '@dto';
```
`@dto` — короткий алиас для сгенерированных типов (`src/shared/dto/index.ts`).
Внутри-слойные (в пределах одного слайса) — относительные: `'../lib/format'`.

## Правила кода
- **Только именованные экспорты.** Всегда в самом низу файла: `export { Name }`
- **Только `const`** — никаких `function`. Компоненты, хендлеры, утилиты — всё через `const`:
  ```ts
  const MyComponent = () => { ... }
  const handleClick = () => { ... }
  const formatDate = (iso: string) => { ... }
  ```
- **`#region` секции** — внутри компонентов группировать блоки через VS Code регионы:
  ```ts
  // #region STATE
  const [value, setValue] = useState('');
  // #endregion

  // #region HOOK
  useEffect(() => { ... }, []);
  // #endregion

  // #region HANDLER
  const handleSubmit = () => { ... };
  // #endregion
  ```
  Порядок: STATE → HOOK → HANDLER
- **Регионы (areas) — через `useState`**, не как константа. Это позволяет динамически добавлять регионы в будущем
- **Без тестов** — тестовые файлы не создавать, не упоминать
- **Без лишних комментариев** — только если WHY неочевиден
- Один компонент / функция на файл (кроме мелких утилит)
- **Стили — глобальный SCSS с БЭМ-именованием**, без inline-стилей, без CSS Modules:
  - Файл рядом с компонентом: `vacancy-card.scss`
  - Импорт как side-effect: `import './vacancy-card.scss'`
  - В JSX — строки: `className="vacancy-card__title"`
  - Несколько классов через хелпер `cx` из `shared/lib/cx`: `cx('vacancy-card__badge', condition && 'vacancy-card__badge--green')`
  - БЭМ: `.vacancy-card`, `.vacancy-card__title`, `.vacancy-card__title--empty`
  - **Цвета и шрифты только через переменные/миксины**, раздельные файлы:
    - `@use '../../../shared/styles/colors';` → `color: colors.$color-primary`
    - `@use '../../../shared/styles/typography';` → `@include typography.font-title`
  - Цвета: `$color-*` в `_colors.scss`
  - Типографика — миксины в `_typography.scss` (включают сразу font-size + font-weight):
    `font-heading` (20/bold), `font-title` (16/semibold), `font-strong` (15/semibold),
    `font-body` (15/normal), `font-secondary` (14/normal), `font-caption` (13/normal), `font-badge` (12/medium)
  - Никаких хардкоженных hex-значений и числовых `font-size`/`font-weight` в компонентных стилях

## Запуск
```powershell
bun run dev:server   # NestJS на http://localhost:4200
bun run dev:client   # React  на http://localhost:3000
```

## Генерация типов из бэкэнда
```powershell
# 1. Запусти бэкэнд (bun run dev:server)
# 2. Выполни из корня:
bun run gen:types
```
Типы генерируются в `client/src/shared/dto/` из OpenAPI-спека (`http://localhost:4200/api-json`). Скрипт: `scripts/gen-types.ts` — запускает генератор, переименовывает папку, создаёт barrel `index.ts`.
Папка в `.gitignore` — пересоздаётся скриптом при изменении DTO на бэкэнде.
Swagger UI доступен на `http://localhost:4200/api`.

## Backend — HH.ru API
- Внутренний Web API: `https://hh.ru/search/vacancy` (не `api.hh.ru` — он требует регистрации)
- Куки + XSRF в `.env` (корень монорепо): `HH_COOKIE`, `HH_XSRF_TOKEN`
- GIB антибот: заголовки `x-gib-fgsscgib-w-hh` и `x-gib-gsscgib-w-hh` = значения одноимённых кук (парсятся автоматически)
- При истечении сессии: DevTools → Network → нужный запрос → Copy as cURL → обновить `.env`
- `.env` в `.gitignore`, никогда не коммитить

## Backend — структура
```
src/vacancies/
├── dto/                  ← входные/выходные DTO
├── interfaces/           ← типы внутреннего API HH
└── vacancies.service.ts  ← маппинг HH → наши DTO
```
