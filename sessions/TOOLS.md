# Журнал инструментов

> Только дополняется, старые записи не редактируются. Сюда попадает всё, что вы
> добавили в проект или окружение ради этой задачи: библиотеки, CLI-утилиты,
> линтеры, MCP-серверы, плагины и скиллы агента, хуки, внешние сервисы, контейнеры.
>
> Разовый вызов уже установленного инструмента сюда не пишется — он идёт
> в таблицу инструментов внутри файла сессии.
>
> Тупиковая попытка — тоже запись: поставили, не подошло, сняли. Это как раз интересно.

## Шаблон записи

```markdown
## YYYY-MM-DD · Сессия N · <инструмент> vX.Y

- **Тип:** библиотека / CLI / MCP / плагин / скилл / хук / сервис
- **Установка:** `<точная команда>`
- **Зачем:** какую задачу решает
- **Область:** проект или глобально
- **Проверка:** чем убедились, что работает
```

Удалённый или заменённый инструмент фиксируется так же — с пометкой
**удалён** / **заменён на X** и причиной.

---

## 2026-08-19 · Сессия 2 · Vite + React 19 + TypeScript

- **Тип:** CLI / библиотека
- **Установка:** `npm create vite@latest earthquakes -- --template react-ts` затем `npm install` в `earthquakes/`
- **Зачем:** каркас frontend-приложения по согласованному стеку
- **Область:** проект (`earthquakes/`)
- **Проверка:** `npm run build` успешен; `npm run dev` → `http://localhost:5173/`

## 2026-08-19 · Сессия 2 · sass 1.102.0

- **Тип:** библиотека
- **Установка:** `npm install -D sass` в `earthquakes/`
- **Зачем:** SCSS и CSS-модули в Vite
- **Область:** проект (`earthquakes/`)
- **Проверка:** стили собрались в `npm run build` (есть `.css` в `dist/assets`)

## 2026-08-19 · Сессия 2 · USGS Earthquake API

- **Тип:** сервис
- **Установка:** без установки; `https://earthquake.usgs.gov/fdsnws/event/1/query`
- **Зачем:** данные землетрясений за текущую неделю
- **Область:** проект (клиентский fetch)
- **Проверка:** `node` fetch вернул HTTP 200 и feature; UI грузит тот же endpoint

## 2026-08-19 · Сессия 6 · husky 9.1.7

- **Тип:** хук
- **Установка:** `npm install -D husky` в `earthquakes/`, скрипт `"prepare": "cd .. && husky"`
- **Зачем:** pre-commit (полный lint) и commit-msg (commitlint)
- **Область:** репозиторий (`.husky/` в корне)
- **Проверка:** `sh .husky/pre-commit` проходит; `core.hooksPath` → `.husky/_`

## 2026-08-19 · Сессия 6 · @commitlint/cli 21.0.1 + config-conventional

- **Тип:** CLI
- **Установка:** `npm install -D @commitlint/cli @commitlint/config-conventional` в `earthquakes/`
- **Зачем:** conventional commit messages в хуке commit-msg
- **Область:** репозиторий (`.commitlintrc.js` в корне)
- **Проверка:** `echo "fix: test" | npm exec --prefix earthquakes commitlint` — ok; `bad message` — fail

## 2026-08-19 · Сессия 6 · prettier 3.8.3

- **Тип:** CLI
- **Установка:** `npm install -D prettier` в `earthquakes/`
- **Зачем:** единый формат TS/TSX/JSON/MD/SCSS; часть `npm run lint`
- **Область:** проект (`earthquakes/`)
- **Проверка:** `npm run lint:prettier` после `--write`

## 2026-08-19 · Сессия 6 · stylelint 17.12.0 + standard-scss

- **Тип:** CLI
- **Установка:** `npm install -D stylelint stylelint-config-standard-scss stylelint-config-prettier-scss` в `earthquakes/`
- **Зачем:** lint SCSS/CSS-модулей; часть `npm run lint`
- **Область:** проект (`earthquakes/src/`)
- **Проверка:** `npm run lint:styles`

## 2026-08-19 · Сессия 8 · leaflet 1.9.4

- **Тип:** библиотека
- **Установка:** `npm install leaflet` в `earthquakes/`
- **Зачем:** карта землетрясений (OSM-тайлы, CircleMarker, popup)
- **Область:** проект (`earthquakes/`)
- **Проверка:** `npm run build` / `npm run lint`; карта в UI

## 2026-08-19 · Сессия 8 · @types/leaflet 1.9.22

- **Тип:** библиотека (типы)
- **Установка:** `npm install -D @types/leaflet` в `earthquakes/`
- **Зачем:** TypeScript-типы для Leaflet без react-leaflet
- **Область:** проект (`earthquakes/`)
- **Проверка:** `npm run typecheck` / `npm run build`
