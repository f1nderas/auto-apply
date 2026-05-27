# Client — правила кода

## FSD — импорты

Импорты строго вниз по слоям: `app → pages → features → entities → shared`.  
Кросс-слойные — через алиасы, внутри слайса — относительные:

```ts
import { cx } from '@shared/lib/cx';           // кросс-слойный
import { VacancyCard } from '@entities/vacancy'; // кросс-слойный
import { formatDate } from '../lib/format';      // внутри слайса
```

Импортировать только из публичного `index.ts` слайса, не из внутренних путей.

## Алиасы

```ts
@app, @pages, @features, @entities, @shared  // слои
@dto  // → shared/api/generatedApi.ts (типы + RTK хуки)
```

## Именование файлов

Все файлы — **kebab-case**: `vacancy-card.tsx`, `vacancy-card.scss`, `search-form.tsx`.  
Имя компонента внутри файла — PascalCase, но сам файл — строчными буквами.

```
button/
  button.tsx    ✓
  button.scss   ✓
  index.ts
```

## Компоненты

Только `const`, никаких `function`. Именованный экспорт в конце файла:

```ts
const MyComponent = () => { ... };

export { MyComponent };
```

Один компонент на файл.

## #region секции

Внутри компонентов группировать через регионы. Порядок строгий:

```ts
// #region CONSTANT
const TABS = ['one', 'two'];
// #endregion

// #region STATE
const [value, setValue] = useState('');
// #endregion

// #region HOOK
const { data } = useSomeQuery();
// #endregion

// #region EFFECT
useEffect(() => { ... }, []);
// #endregion

// #region COMPUTED
const label = value ? value.trim() : 'default';
// #endregion

// #region HANDLER
const handleSubmit = () => { ... };
// #endregion

// #region STYLES
const btnClass = cx('btn', active && 'btn--active');
// #endregion
```

Пустые регионы не писать.

`cx` **никогда не использовать инлайново** в JSX — всегда выносить в переменную в `#region STYLES`:

```tsx
// ❌
<div className={cx('btn', active && 'btn--active')} />

// ✓
const btnClass = cx('btn', active && 'btn--active');
<div className={btnClass} />
```

## Стили — SCSS + БЭМ

Без CSS Modules, без inline-стилей. Файл рядом с компонентом:

```ts
import './vacancy-card.scss';   // side-effect импорт
```

В JSX — строки:

```tsx
<div className="vacancy-card__title" />
<div className={cx('vacancy-card__badge', active && 'vacancy-card__badge--green')} />
```

БЭМ: `.block`, `.block__element`, `.block__element--modifier`.

### Цвета

```scss
@use '../../../shared/styles/colors';

color: colors.$color-primary;
background: colors.$color-surface;
```

Никаких хардкоженных hex-значений.

### Типографика

```scss
@use '../../../shared/styles/typography';

@include typography.font-title;    // 16px / semibold
@include typography.font-body;     // 15px / normal
@include typography.font-caption;  // 13px / normal
```

Доступные миксины: `font-heading` (20/bold), `font-title` (16/semi), `font-strong` (15/semi),
`font-body` (15/normal), `font-secondary` (14/normal), `font-caption` (13/normal), `font-badge` (12/medium).

Никаких числовых `font-size` / `font-weight` в компонентных стилях.

## RTK Query

Эндпоинты определяются в entity/feature слоях через `injectEndpoints` из `baseApi`.  
Хуки ре-экспортируются с читаемыми именами:

```ts
export { useLazyVacanciesControllerSearchQuery as useLazySearchVacanciesQuery }
  from '@shared/api/generatedApi';
```
