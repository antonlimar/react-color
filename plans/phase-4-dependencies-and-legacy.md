---
name: Фаза 4 dependencies and legacy cleanup
overview: Ужесточение peer-метаданных React, обновление примеров до минимально поддерживаемой версии, удаление legacy devDependencies и добавление CI-проверок.
todos:
  - id: peer-react-range
    content: Обновить peerDependencies React и зафиксировать границы совместимости библиотеки и dev-окружения
    status: done
  - id: examples-modernization
    content: Перевести примеры на единый baseline React 16.14 и современный локальный dev/build pipeline без react-scripts; выполнено: Vite, local file dependency и examples:check
    status: done
  - id: legacy-devdeps-cleanup
    content: Удалить неиспользуемые legacy devDependencies и обновить lockfile после чистки
    status: done
  - id: ci-baseline
    content: Добавить GitHub Actions CI с обязательными проверками build test docs storybook и examples
    status: pending
---

# Фаза 4: зависимости, примеры и cleanup legacy

## Summary

Фаза 4 должна зафиксировать совместимость пакета на уровне метаданных, убрать остатки старого тулчейна из корня репозитория и довести примеры/CI до состояния, где минимально поддерживаемый React проверяется автоматически, а не только задекларирован в `AGENTS.md` и `README.md`.

Ключевое решение для реализации: разделить версии React для библиотеки и для локального dev-окружения. У библиотеки ужесточить `peerDependencies.react` до `>=16.8.0`, а корневые `devDependencies.react` / `react-dom` оставить на текущем современном major, потому что docs уже используют `react-dom/client` и `createRoot`. Совместимость с React 16.8+ подтверждать через примеры, а не через понижение корневого dev-окружения.

## Implementation Changes

### 1. Метаданные пакета и runtime-границы

- Обновить `package.json`: `peerDependencies.react` заменить с `*` на `>=16.8.0`.
- Не добавлять `react-dom` в peer, чтобы не расширять публичный контракт без необходимости; оставить это как зависимость окружения потребителя и dev-инструментов репозитория.
- Сохранить без изменений `main`, `module`, `types`, `files`, структуру `lib/` и `es/`, а также все экспортируемые имена из `src/index.ts`.
- Обновить `README.md` и при необходимости `AGENTS.md`, чтобы явно зафиксировать: peer минимум библиотеки `16.8+`, а docs/Storybook разрабатываются на более новом React.

### 2. Примеры как проверка peer-минимума

- Привести все приложения в `examples/` к единому минимальному baseline: `react@16.14.x`, `react-dom@16.14.x`, локальное подключение пакета из репозитория вместо `react-color: "latest"`.
- Убрать из примеров `react-scripts` и CRA-конфиги; перевести примеры на Vite, чтобы избавиться от legacy-цепочки и не тащить старые dev-server зависимости.
- Оставить в примерах `ReactDOM.render`, а не `createRoot`, чтобы они реально проверяли нижнюю границу peer-совместимости.
- Добавить единообразные `dev` / `build` скрипты во все example-пакеты и корневой агрегирующий скрипт вроде `examples:check`, который последовательно собирает все примеры.
- Исправить оставшиеся локальные ссылки на старые JS-entrypoints, связанные с миграцией на TS, если они мешают работе примеров или docs (например, alias на `src/index.js` в Vite-конфигах).

### 3. Cleanup зависимостей и legacy-хвостов

- Удалить из корневых `devDependencies` все пакеты, которые больше не участвуют в сборке/тестах/docs:
  `npm`, Babel 6 цепочку, Webpack 1 цепочку, `react-hot-loader`, `require-dir`, `event-stream`, `fbjs`, `i`, `object-assign`, `react-context` и другие зависимости без реальных импортов/скриптовых ссылок.
- Оставить только те legacy-пакеты, которые всё ещё реально используются docs-сайтом, например `highlight.js` и `remarkable`, пока docs не переписаны дальше.
- Для `lodash` / `lodash-es` зафиксировать текущую стратегию как осознанную:
  оставить только используемые path-imports (`map`, `merge`, `debounce`, `throttle`, `each`, `isUndefined`), не переписывать библиотеку на новые утилиты в этой фазе, если это не нужно для удаления зависимости целиком.
- После чистки обновить `package-lock.json` и убедиться, что `npm test` больше не подхватывает встроенный в `devDependencies` старый `npm`.

### 4. CI как обязательная проверка состояния форка

- Добавить `.github/workflows/ci.yml` с запуском на `push` и `pull_request`.
- Минимальный набор шагов в CI:
  `npm ci`, `npm test`, `npm run build`, `npm run build-storybook`, `npm run docs-dist`, `npm run examples:check`.
- Запускать workflow минимум на одном современном Node, совпадающем с локальной разработкой; рекомендованный матричный вариант: Node `20.x` и `24.x`.
- После сборок добавить проверку на синхронность артефактов и lockfile: CI должен падать, если после команд меняются `lib/`, `es/`, `docs/build/` или `package-lock.json`.
- Добавить `npm pack --dry-run` как smoke-check публикации, чтобы убедиться, что drop-in форма пакета не сломана.

## Public API / Interface Changes

- Публичные экспорты библиотеки не меняются.
- Меняется только опубликованный контракт совместимости: `peerDependencies.react` становится `>=16.8.0` вместо неограниченного `*`.
- Добавляется внутренний dev-интерфейс репозитория: корневой скрипт для проверки примеров и GitHub Actions workflow.
- Формат публикации (`lib/`, `es/`, deep imports, `index.d.ts`) остаётся прежним.

## Test Plan

- `npm test` проходит без предупреждений от старого `npm` из `devDependencies`.
- `npm run build` пересобирает `lib/` и `es/` без diff после коммита.
- `npm run build-storybook` и `npm run docs-dist` проходят на текущем корневом React.
- Каждый example-проект собирается на React 16.14 и локальном пакете из репозитория.
- `npm pack --dry-run` показывает ожидаемый состав пакета: `lib/`, `es/`, `index.d.ts`.
- CI на GitHub Actions повторяет тот же набор проверок и падает на любом рассинхроне артефактов.

## Assumptions

- Фаза 4 не поднимает минимальный peer React до 18+; действующее решение проекта остаётся `16.8+`.
- Корневой React для docs/Storybook не понижается, потому что docs уже используют `createRoot`.
- `react-dom` не добавляется в peer без отдельного продуктового решения.
- Переписывание docs на новые markdown/rendering библиотеки и замена `reactcss` не входят в эту фазу.

---

## Todo

- [x] **peer-react-range** — Обновить `peerDependencies` React и зафиксировать границы совместимости библиотеки и dev-окружения
- [x] **examples-modernization** — Перевести примеры на единый baseline React 16.14 и современный локальный dev/build pipeline без `react-scripts`; выполнено: Vite, local file dependency и `examples:check`
- [x] **legacy-devdeps-cleanup** — Удалить неиспользуемые legacy `devDependencies` и обновить `package-lock.json` после чистки
- [ ] **ci-baseline** — Добавить GitHub Actions CI с обязательными проверками `build`, `test`, `docs`, `storybook` и `examples`
