# auto-apply

Сервис автоматических откликов на вакансии. Backend на NestJS + TypeScript.

## Стек

- **NestJS 11** — основной фреймворк
- **Bun** — пакетный менеджер и рантайм
- **SWC** — быстрая компиляция TypeScript (замена webpack)
- **TypeScript 5.7**

## Установка

```bash
bun install
```

## Запуск

```bash
# Режим разработки (с hot reload)
bun run start:dev

# Обычный запуск
bun run start

# Продакшн (предварительно собрать)
bun run build
bun run start:prod
```

## Сборка

```bash
bun run build
```

Сборка выполняется через SWC — значительно быстрее стандартного webpack.

## Форматирование и линтинг

```bash
bun run format
bun run lint
```
