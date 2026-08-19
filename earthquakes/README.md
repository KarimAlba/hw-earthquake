# Earthquake Week (app)

Frontend-приложение репозитория. Общая визитка и контекст ДЗ — в [`../README.md`](../README.md).

## Возможности

- Дни текущей недели (пн–вс), сегодня выбран и подсвечен
- Список землетрясений USGS за выбранный день
- Фильтр: все / ≥2.5 / ≥4.5 / ≥6.0
- Детали по клику; загрузка / пусто / ошибка + «Повторить»
- Карта Leaflet — ещё не в этой версии

## Требования

- Node.js (LTS) и npm

## Команды

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build
npm run lint
npm run preview
```

Все команды запускайте **из этой папки** (`earthquakes/`).

## Стек

React 19 · TypeScript · SCSS (sass) · Vite · FSD · oxlint
