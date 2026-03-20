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
    content: Добавить GitHub Actions CI с обязательными проверками build test docs storybook и examples; выполнено: .github/workflows/ci.yml, Node 20.x/24.x, npm pack --dry-run и verify-generated-artifacts
    status: done
---

# Фаза 4: зависимости, примеры и cleanup legacy

## Summary

Фаза 4 зафиксировала совместимость пакета на уровне метаданных, убрала прямые legacy-хвосты из корневого toolchain и довела примеры/CI до состояния, где минимально поддерживаемый React проверяется автоматически, а не только задекларирован в `AGENTS.md` и `README.md`.

Ключевое решение реализации осталось тем же: версии React для библиотеки и для локального dev-окружения разделены. У библиотеки `peerDependencies.react` ужесточён до `>=16.8.0`, а корневые `devDependencies.react` / `react-dom` оставлены на современном major (`19.2.4` на момент синхронизации), потому что docs используют `react-dom/client` и `createRoot`. Совместимость с React 16.8+ подтверждается через примеры на `16.14.0`, а не через понижение корневого dev-окружения.

## Implementation Status

- `package.json` зафиксировал `peerDependencies.react: >=16.8.0`, сохранив drop-in поля `main`, `module`, `types` и публикацию `lib/` + `es/`.
- Все примеры в `examples/` переведены на Vite, используют локальную зависимость `react-color: "file:../.."`, React `16.14.0` / `react-dom` `16.14.0` и точку входа на `ReactDOM.render`.
- В корне репозитория есть агрегирующий скрипт `examples:check`, который последовательно собирает все example-проекты.
- Прямые legacy devDependencies из старого корневого тулчейна убраны; оставлены только реально используемые пакеты, включая `highlight.js` и `remarkable` для docs и текущую стратегию с `lodash` / `lodash-es`.
- Добавлен `.github/workflows/ci.yml` с матрицей Node `20.x` / `24.x` и обязательными шагами `npm test`, `npm run build`, `npm run build-storybook`, `npm run docs-dist`, `npm run examples:check`, `npm run ci:artifacts` и `npm pack --dry-run`.

## Verification

Проверено локально `2026-03-20`:

- `npm test`
- `npm run build`
- `npm run examples:check`

Все три команды завершились успешно на текущем состоянии репозитория.

## Implementation Changes

### 1. Метаданные пакета и runtime-границы

- `package.json` обновлён: `peerDependencies.react` заменён с `*` на `>=16.8.0`.
- `react-dom` не добавлялся в peer, чтобы не расширять публичный контракт без необходимости; он остаётся зависимостью окружения потребителя и dev-инструментов репозитория.
- Поля `main`, `module`, `types`, `files`, структура `lib/` и `es/`, а также экспортируемые имена из `src/index.ts` сохранены.
- `README.md` синхронизирован с решением фазы: peer минимум библиотеки `16.8+`, а docs/Storybook продолжают развиваться на более новом React.

### 2. Примеры как проверка peer-минимума

- Все приложения в `examples/` приведены к единому baseline: `react@16.14.0`, `react-dom@16.14.0`, локальное подключение пакета из репозитория вместо `react-color: "latest"`.
- `react-scripts` и CRA-конфиги убраны; примеры переведены на Vite.
- В примерах сохранён `ReactDOM.render`, а не `createRoot`, чтобы они действительно проверяли нижнюю границу peer-совместимости.
- Во все example-пакеты добавлены единообразные `dev` / `build` скрипты и корневой агрегирующий скрипт `examples:check`, который последовательно собирает все примеры.
- Локальные ссылки и Vite-конфиги синхронизированы с TS-entrypoints текущей библиотеки и не блокируют сборку примеров.

### 3. Cleanup зависимостей и legacy-хвостов

- Из корневых `devDependencies` удалены пакеты, которые больше не участвуют в сборке/тестах/docs: `npm`, legacy Babel/Webpack-цепочки, `react-hot-loader`, `require-dir`, `event-stream`, `fbjs`, `i`, `react-context` и другие неиспользуемые зависимости.
- Сохранены только те legacy-пакеты, которые всё ещё реально используются docs-сайтом, в частности `highlight.js` и `remarkable`.
- Для `lodash` / `lodash-es` зафиксирована текущая стратегия: библиотека остаётся на используемых path-imports и post-build rewrite на `lodash-es` для ESM-сборки.
- `package-lock.json` синхронизирован после чистки; свежий прогон `npm test` проходит без участия старого `npm` из `devDependencies`.

### 4. CI как обязательная проверка состояния форка

- Добавлен `.github/workflows/ci.yml` с запуском на `push` и `pull_request`.
- CI выполняет `npm ci`, `npm test`, `npm run build`, `npm run build-storybook`, `npm run docs-dist`, `npm run examples:check`.
- Workflow запускается в матрице Node `20.x` и `24.x`.
- После сборок выполняется проверка синхронности артефактов и lockfile через `npm run ci:artifacts`; проверяются `lib/`, `es/`, `docs/build/` и `package-lock.json`.
- `npm pack --dry-run` добавлен как smoke-check публикации, чтобы убедиться, что drop-in форма пакета не сломана.

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

## Assumptions / Follow-up

- Фаза 4 не поднимает минимальный peer React до 18+; действующее решение проекта остаётся `16.8+`.
- Корневой React для docs/Storybook не понижается, потому что docs уже используют `createRoot`.
- `react-dom` не добавляется в peer без отдельного продуктового решения.
- Переписывание docs на новые markdown/rendering библиотеки и замена `reactcss` не входят в эту фазу.

---

## Todo

- [x] **peer-react-range** — Обновить `peerDependencies` React и зафиксировать границы совместимости библиотеки и dev-окружения
- [x] **examples-modernization** — Перевести примеры на единый baseline React 16.14 и современный локальный dev/build pipeline без `react-scripts`; выполнено: Vite, local file dependency и `examples:check`
- [x] **legacy-devdeps-cleanup** — Удалить неиспользуемые legacy `devDependencies` и обновить `package-lock.json` после чистки
- [x] **ci-baseline** — Добавить GitHub Actions CI с обязательными проверками `build`, `test`, `docs`, `storybook` и `examples`; выполнено: `.github/workflows/ci.yml`, матрица Node `20.x`/`24.x`, `npm pack --dry-run` и `ci:artifacts`
