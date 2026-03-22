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
  - id: ts-strictness-follow-up
    content: Поэтапно усилить TS-строгость после завершения миграции src; кандидаты первого шага: noImplicitAny и strictNullChecks с локальными правками типов без breaking changes
    status: pending
  - id: typing-polish-follow-up
    content: Дочистить post-TypeScript хвосты после phase 3: локальные d.ts при необходимости, permissive callback-типы, reactcss/tinycolor2 и связанные типовые компромиссы без breaking changes
    status: pending
  - id: proptypes-follow-up
    content: Отдельно принять решение по дальнейшей судьбе propTypes после TS-миграции; сохранить или удалить только после оценки bundle/runtime DX и совместимости для JS-потребителей
    status: pending
  - id: docs-legacy-follow-up
    content: Дочистить remaining legacy в docs/dev tooling без смены public API пакета; проверить docs runtime, storybook reactDocgen и оставшиеся CommonJS/old-docs хвосты
    status: pending
  - id: breaking-docs-follow-up
    content: Если в ходе cleanup появятся осознанные несовместимости или сужения контрактов, зафиксировать их в CHANGELOG и документации миграции
    status: pending
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

## Follow-up Scope After Phase 4

Этот документ закрывает основную фазу 4, но оставляет осознанный follow-up, который не стоит смешивать с уже завершённым cleanup корневого toolchain. Это не новая большая фаза миграции уровня phase 3, а более узкий хвост работ после стабилизации `src`, сборки и CI.

### 1. Усиление TypeScript-строгости

- Текущее состояние после phase 3 и phase 4 остаётся намеренно умеренным: библиотека уже на TS-совместимых исходниках, но корневой [`tsconfig.json`](../tsconfig.json) ещё не переведён в полный strict-профиль.
- Следующий шаг стоит делать поэтапно, без giant PR:
  - сначала оценить включение `noImplicitAny`, если исправления останутся локальными и не начнут раздувать публичные типы;
  - затем рассмотреть `strictNullChecks`, если это не сломает permissive API для `Color`, `styles`, callback-аргументов и legacy edge cases;
  - полный `strict` и более узкие флаги (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` и аналогичные) оставлять только после стабилизации первых двух шагов.
- Источником истины остаётся runtime API библиотеки: strictness должна описывать существующее поведение, а не незаметно менять контракт пакета ради более красивых типов.

### 1a. Post-TypeScript polish после завершения phase 3

- После завершения миграции `src` остались не только strictness-задачи, но и более мелкие типовые хвосты, которые phase 3 сознательно не пыталась добить в том же документе.
- Отдельно стоит проверить:
  - нужны ли локальные `.d.ts` или уточнения типов для `reactcss` и `tinycolor2`, если текущие компромиссы мешают strictness или читаемости типов;
  - не осталось ли overly-permissive типов для callback-аргументов, `styles` и внутренних helper-контрактов, которые можно локально уточнить без смены runtime API;
  - есть ли смысл отдельно трогать `propTypes` после стабилизации TS-типов, или текущая стратегия "types + propTypes" остаётся лучшим компромиссом для JS-потребителей;
  - есть ли остаточные follow-up задачи по lodash-утилитам и связанным helper-типам, которые phase 3 осознанно не расширяла до инфраструктурного рефакторинга.
- Как и в strictness-задачах, источником истины остаётся текущий runtime-контракт библиотеки, а не желание сделать типы «идеальными» ценой скрытого breaking change.

### 2. Cleanup remaining legacy в docs и dev tooling

- В корне репозитория прямые legacy-хвосты уже убраны, но docs/dev tooling всё ещё может содержать исторические компромиссы, которые не были блокером для phase 4.
- Для этого follow-up стоит отдельно проверить:
  - legacy-формы модулей и старые docs-компоненты под [`docs/`](../docs/), которые всё ещё живут на CommonJS-стиле или сохраняют старые соглашения без явной необходимости;
  - необходимость сохранённых docs-зависимостей вроде `highlight.js` и `remarkable`, прежде чем трогать их или заменять;
  - возвращение `reactDocgen` в Storybook, если он был временно ослаблен/отключён ради совместимости с legacy Babel-конфигурацией;
  - dev-скрипты [`scripts/docs-server.js`](../scripts/docs-server.js) и [`scripts/docs-dist.js`](../scripts/docs-dist.js) на предмет оставшихся legacy-предположений, которые уже не нужны после перехода на Vite.
- Граница задачи остаётся прежней: не менять drop-in API пакета, layout публикации и не разворачивать отдельный редизайн docs-сайта в рамках этого cleanup.

### Что осталось сделать practically

- Проверить Storybook-конфиг в [`../.storybook/main.js`](../.storybook/main.js) и решить, можно ли безопасно вернуть `reactDocgen` вместо текущего `false`, не ломая сборку и stories.
- Просмотреть `docs/components/**` и `docs/examples/**` на предмет файлов, которые всё ещё держатся за старый CommonJS-стиль без реальной необходимости, и понять, что из этого стоит конвертировать, а что лучше оставить как есть.
- Перепроверить [`scripts/docs-server.js`](../scripts/docs-server.js) и [`scripts/docs-dist.js`](../scripts/docs-dist.js): нет ли там legacy-обвязки, которую уже можно упростить после перехода на Vite.
- Решить по `highlight.js` и `remarkable`: это ещё осознанно сохраняемые зависимости docs-части или уже кандидаты на отдельную замену/удаление.
- После каждого из этих шагов прогонять минимум `npm run build-storybook` и `npm run docs-dist`, чтобы cleanup не остался только на уровне «код стал современнее», а реально сохранял рабочий pipeline.

### 3. Документация возможных несовместимостей

- Если усиление TS-строгости или cleanup docs/dev tooling приведёт к реальному сужению контрактов, отличиям в DX или изменению ожидаемого поведения инструментов, это нужно документировать отдельно, а не оставлять скрытым follow-up.
- Минимум для такого случая:
  - запись в `CHANGELOG`, если изменение влияет на пользователей пакета;
  - обновление `README.md` или developer-документации, если меняется локальный workflow репозитория;
  - синхронизация короткого статуса в [`PLAN.md`](../PLAN.md), чтобы дорожная карта не расходилась с фактическим состоянием.

---

## Todo

- [x] **peer-react-range** — Обновить `peerDependencies` React и зафиксировать границы совместимости библиотеки и dev-окружения
- [x] **examples-modernization** — Перевести примеры на единый baseline React 16.14 и современный локальный dev/build pipeline без `react-scripts`; выполнено: Vite, local file dependency и `examples:check`
- [x] **legacy-devdeps-cleanup** — Удалить неиспользуемые legacy `devDependencies` и обновить `package-lock.json` после чистки
- [x] **ci-baseline** — Добавить GitHub Actions CI с обязательными проверками `build`, `test`, `docs`, `storybook` и `examples`; выполнено: `.github/workflows/ci.yml`, матрица Node `20.x`/`24.x`, `npm pack --dry-run` и `ci:artifacts`
- [ ] **ts-strictness-follow-up** — Поэтапно усилить TS-строгость после завершения миграции `src`; кандидаты первого шага: `noImplicitAny` и `strictNullChecks` с локальными правками типов без breaking changes
- [ ] **typing-polish-follow-up** — Дочистить post-TypeScript хвосты после phase 3: локальные `.d.ts` при необходимости, permissive callback-типы, `reactcss` / `tinycolor2` и связанные типовые компромиссы без breaking changes
- [ ] **proptypes-follow-up** — Отдельно принять решение по дальнейшей судьбе `propTypes` после TS-миграции; сохранять или удалять только после оценки bundle/runtime DX и совместимости для JS-потребителей
- [ ] **docs-legacy-follow-up** — Дочистить remaining legacy в docs/dev tooling; проверить Storybook `reactDocgen`, `docs/components/**`, `docs/examples/**`, `scripts/docs-server.js`, `scripts/docs-dist.js` и статус зависимостей `highlight.js` / `remarkable`
- [ ] **breaking-docs-follow-up** — Если в ходе cleanup появятся осознанные несовместимости или сужения контрактов, зафиксировать их в `CHANGELOG` и документации миграции

### Concrete remaining actions

- [ ] Включить и проверить `noImplicitAny`; исправить только локальные типовые ошибки без изменения публичного API.
- [ ] Оценить включение `strictNullChecks`; отдельно проверить permissive сценарии для `Color`, `styles`, callback-аргументов и legacy edge cases.
- [ ] Проверить, нужны ли локальные `.d.ts` или дополнительные типовые уточнения для `reactcss` и `tinycolor2`, чтобы следующий шаг по strictness не упирался в инфраструктурные компромиссы.
- [ ] Просмотреть внутренние callback-контракты и `styles`-типы и сузить их там, где это можно сделать без изменения runtime API.
- [ ] Принять отдельное решение по `propTypes`: оставить как текущий runtime guard или вынести удаление в отдельную осознанную задачу с оценкой влияния на bundle/runtime DX.
- [ ] Проверить, остались ли post-migration хвосты по lodash-утилитам или helper-типам, которые phase 3 сознательно не добивала.
- [ ] Проверить [`.storybook/main.js`](../.storybook/main.js) и решить, можно ли безопасно вернуть `reactDocgen` вместо `false`.
- [ ] Просмотреть [`docs/components/`](../docs/components/) и [`docs/examples/`](../docs/examples/) и отделить оправданный legacy-код от хвостов, которые уже можно убрать или переписать.
- [ ] Пересмотреть [`scripts/docs-server.js`](../scripts/docs-server.js) и [`scripts/docs-dist.js`](../scripts/docs-dist.js) на предмет лишней legacy-обвязки после перехода на Vite.
- [ ] Принять решение по `highlight.js` и `remarkable`: оставить как осознанные docs-зависимости или вынести в отдельную задачу на замену/удаление.
- [ ] После каждого cleanup-шага прогонять `npm run build-storybook` и `npm run docs-dist`.
- [ ] Если какой-то шаг меняет DX или контракт, синхронизировать это в `CHANGELOG`, `README.md` и верхнеуровневом `PLAN.md`.
