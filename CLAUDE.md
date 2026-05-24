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
- Стили — inline objects (без CSS-файлов, без внешних библиотек)

## Запуск
```powershell
bun run dev:server   # NestJS на http://localhost:4200
bun run dev:client   # React  на http://localhost:3000
```

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
