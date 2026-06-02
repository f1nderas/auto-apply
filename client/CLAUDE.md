# Client — правила кода

## Компоненты

Только `const`, именованный экспорт в конце файла, один компонент на файл. Без тестов. Комментарии только если WHY неочевиден.

```ts
const MyComponent = () => { ... };
export { MyComponent };
```

## Пропсы

Булевые пропсы начинаются с `is`: `isLoading`, `isDisabled`, `isOpen`.  
Исключение — нативные HTML-атрибуты (`disabled`, `checked`) из `extends HTMLAttributes`.

## #region секции

Порядок строгий: `CONSTANT → STATE → HOOK → EFFECT → COMPUTED → HANDLER → STYLES`. Пустые не писать.

`cx` — только через переменную в `#region STYLES`, никогда инлайново в JSX.

## FSD — импорты

Строго вниз: `app → pages → widgets → features → entities → shared`.  
Кросс-слойные — через алиасы, внутри слайса — относительные пути.  
Импортировать только из публичного `index.ts` слайса.

Значения и типы из одного модуля — один импорт: `import { Foo, type Bar } from '...'`

Алиас слоя нельзя использовать внутри того же слоя — только относительный путь:
```ts
// файл features/auto-apply/ui/...
import { ... } from '../../suggestions';  // ✓
import { ... } from '@features/suggestions';  // ✗
```

## Алиасы

`@app, @pages, @widgets, @features, @entities, @shared` — слои.  
`@dto` → `shared/api/generatedApi.ts` (типы + RTK хуки).

## Именование файлов

Все файлы — **kebab-case**. Компонент внутри файла — PascalCase.  
Имя файла/компонента не дублирует название слоя (`vacancies.tsx` → `Vacancies`, не `VacanciesPage`).

`git mv` при переименовании и перемещении — иначе git теряет историю.  
Смена регистра на Windows NTFS требует промежуточного шага через временное имя.

## SCSS + БЭМ

Без CSS Modules, без inline-стилей. SCSS-файл рядом с компонентом, side-effect импорт.  
БЭМ: `.block__element--modifier`. В JSX — строки, `cx()` только через переменную.

Цвета — только через `colors.$color-*`, hex запрещён.  
Типографика — только через миксины: `font-heading` (20/bold), `font-title` (16/semi), `font-strong` (15/semi), `font-body` (15/normal), `font-secondary` (14/normal), `font-caption` (13/normal), `font-badge` (12/medium). Числовые `font-size`/`font-weight` запрещены.

## RTK Query

Эндпоинты — через `injectEndpoints` из `baseApi` в entity/feature слоях.  
Хуки ре-экспортируются с читаемыми именами: `export { useLazyFooQuery as useSearchQuery }`.
