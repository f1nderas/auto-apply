# auto-apply

Сервис автоматических откликов на вакансии с HH.ru. Монорепо: NestJS бэкенд + React фронтенд.

## Стек

| | Технология |
|---|---|
| **Пакетный менеджер** | Bun (workspaces) |
| **Бэкенд** | NestJS 11, TypeScript, SWC |
| **Фронтенд** | React 19, TypeScript, Rspack |

## Структура

```
auto-apply/
├── server/        ← NestJS бэкенд (порт 4200)
├── client/        ← React фронтенд (порт 3000)
├── .env           ← переменные окружения для всего монорепо
└── package.json   ← workspace root
```

## Установка

```bash
bun install
```

## Запуск

```bash
# Фронт + бэк одновременно
bun run dev

# По отдельности
bun run dev:server   # только бэкенд
bun run dev:client   # только фронтенд
```

## Переменные окружения

Создать `.env` в корне проекта:

```env
PORT=4200

HH_XSRF_TOKEN=<токен из DevTools>
HH_COOKIE=<куки из DevTools>
```

Как получить `HH_COOKIE` и `HH_XSRF_TOKEN`:
1. Открыть [hh.ru](https://hh.ru) в браузере, войти в аккаунт
2. DevTools → Network → выполнить поиск вакансий
3. Найти запрос к `hh.ru/search/vacancy` → правая кнопка → Copy as cURL
4. Скопировать значения заголовков `cookie` и `x-xsrftoken`

> Сессия истекает — при ошибках 406 нужно обновить `.env`.

## API

`GET /vacancies`

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `text` | string | — | Поисковый запрос (обязательный) |
| `area` | number | `1` | Регион (1 — Москва, 2 — СПб) |
| `page` | number | `0` | Страница (с нуля) |
| `perPage` | number | `20` | Вакансий на странице (макс 100) |

## Сборка

```bash
bun run --cwd server build   # собрать бэкенд
bun run --cwd client build   # собрать фронтенд
```
