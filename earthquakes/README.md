# Earthquake Week (app)

Frontend-приложение репозитория. Общая визитка и контекст ДЗ — в [`../README.md`](../README.md).

## Возможности

- Дни текущей недели (пн–вс), сегодня выбран и подсвечен (обновляется после полуночи)
- Список землетрясений USGS за выбранный день
- Фильтр: все / ≥2.5 / ≥4.5 / ≥6.0 (в т.ч. события без магнитуды на «Все»)
- Разные сообщения для пустого дня и пустого результата фильтра
- Детали по клику; загрузка / ошибка + «Повторить»
- Карта Leaflet: маркеры видимых событий, popup (место + M), sync со списком

## Требования

- Node.js (LTS) и npm

## Команды

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build
npm run lint
npm run lint:fix # prettier + stylelint --fix
npm run preview
```

После `npm install` автоматически подключаются git-хуки Husky (pre-commit: полный lint, commit-msg: commitlint).

Все команды запускайте **из этой папки** (`earthquakes/`).

## Стек

React 19 · TypeScript · SCSS (sass) · Vite · Leaflet · FSD · oxlint · stylelint · prettier · husky · commitlint
