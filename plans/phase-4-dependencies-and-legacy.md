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
    content: Поэтапно усилить TS-строгость после завершения миграции src; выполнено для безопасного следующего шага: включены noImplicitAny и strictNullChecks, добавлены локальные декларации legacy-модулей, убраны implicit any и nullability-ошибки без breaking changes; permissive сценарии для Color, styles и callback-аргументов отдельно перепроверены
    status: done
  - id: typing-polish-follow-up
    content: Дочистить post-TypeScript хвосты после phase 3: локальные d.ts для legacy-модулей уточнены, callback/event-контракты и styles-override-типы сделаны более permissive и согласованными, хвосты по lodash-утилитам и helper-типам проверены и сведены к удалению оставшихся type assertions вокруг debounce/throttle, компромиссы around reactcss/tinycolor2 зафиксированы без breaking changes
    status: done
  - id: proptypes-follow-up
    content: Принято решение удалить prop-types после TS-миграции; runtime propTypes убраны из src, зависимость и локальные декларации удалены, план синхронизирован
    status: done
  - id: docs-legacy-follow-up
    content: Дочистить remaining legacy в docs/dev tooling без смены public API пакета; выполнено: docs markdown runtime переведён с remarkable на markdown-it, highlight.js обновлён до актуальной ветки, Storybook reactDocgen возвращён в режим react-docgen, old-docs CommonJS helper snippets переведены на import-синтаксис, obsolete .babelrc удалён, scripts/docs-server.js и scripts/docs-dist.js подтверждены как уже минимальные для Vite
    status: done
  - id: breaking-docs-follow-up
    content: Если в ходе cleanup появятся осознанные несовместимости или сужения контрактов, зафиксировать их в CHANGELOG и документации миграции; выполнено: migration notes и DX-изменения синхронизированы в CHANGELOG.md, README.md и PLAN.md, при этом публичный drop-in API подтверждён как сохранённый
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
- Прямые legacy devDependencies из старого корневого тулчейна убраны; для docs legacy-связка `remarkable` + старый `highlight.js` также заменена на `markdown-it` и актуальную ветку `highlight.js`, при сохранении текущей стратегии с `lodash` / `lodash-es`.
- Добавлен `.github/workflows/ci.yml` с матрицей Node `20.x` / `24.x` и обязательными шагами `npm test`, `npm run build`, `npm run build-storybook`, `npm run docs-dist`, `npm run examples:check`, `npm run ci:artifacts` и `npm pack --dry-run`.
- Базовый `tsconfig` ужесточён до `noImplicitAny`; для этого добавлены точечные декларации в `src/vendor.d.ts` для legacy-зависимостей и убраны локальные `implicit any` в компонентах без изменения public API.
- Базовый `tsconfig` дополнительно ужесточён до `strictNullChecks`; при этом permissive runtime-контракты для `Color`, `styles`, callback-аргументов и legacy edge cases сохранены, а найденные nullability-ошибки исправлены точечно в `reactcss`-style access и `EditableInput`.
- Закрыт `typing-polish-follow-up`: локальные декларации для `reactcss` / `tinycolor2` переведены на более полезные permissive-типы, callback/event-контракты больше не скрываются за `unknown`, а `styles`-overrides сведены к общему alias без сужения runtime API.
- Отдельно проверены post-migration хвосты по `lodash`-утилитам и helper-типам: дополнительных инфраструктурных правок не потребовалось, а оставшиеся ручные type assertions вокруг `lodash/debounce` и `lodash/throttle` удалены из `ColorWrap` и `Saturation`.

## Verification

Проверено локально `2026-03-20`:

- `npm test`
- `npm run build`
- `npm run examples:check`

Все три команды завершились успешно на текущем состоянии репозитория.

Дополнительно проверено локально `2026-03-22`:

- `npx tsc -p tsconfig.lib.json --noEmit --pretty false`
- `npx tsc -p tsconfig.lib.json --noEmit --pretty false --strictNullChecks`
- `npm test`
- `npm run build`

Все команды завершились успешно после дочистки типового слоя и обновления локальных деклараций.

Дополнительно проверено локально `2026-03-22` для `docs-legacy-follow-up`:

- `npm run build-storybook`
- `npm run docs-dist`

Обе команды завершились успешно после возврата Storybook `reactDocgen`, обновления docs markdown runtime и удаления `remarkable` из devDependencies.

## Implementation Changes

### 1. Метаданные пакета и runtime-границы

- `package.json` обновлён: `peerDependencies.react` заменён с `*` на `>=16.8.0`.
- `react-dom` не добавлялся в peer, чтобы не расширять публичный контракт без необходимости; он остаётся зависимостью окружения потребителя и dev-инструментов репозитория.
- Поля `main`, `module`, `types`, `files`, структура `lib/` и `es/`, а также экспортируемые имена из `src/index.ts` сохранены.
- `README.md` синхронизирован с решением фазы: peer минимум библиотеки `16.8+`, а docs/Storybook продолжают развиваться на более новом React.
- `CHANGELOG.md`, `README.md` и верхнеуровневый `PLAN.md` синхронизированы по результатам follow-up: отдельно зафиксировано, что drop-in публичный API сохранён, а user-visible DX change сводится к удалению runtime `propTypes` и обновлению dev/docs tooling.

### 2. Примеры как проверка peer-минимума

- Все приложения в `examples/` приведены к единому baseline: `react@16.14.0`, `react-dom@16.14.0`, локальное подключение пакета из репозитория вместо `react-color: "latest"`.
- `react-scripts` и CRA-конфиги убраны; примеры переведены на Vite.
- В примерах сохранён `ReactDOM.render`, а не `createRoot`, чтобы они действительно проверяли нижнюю границу peer-совместимости.
- Во все example-пакеты добавлены единообразные `dev` / `build` скрипты и корневой агрегирующий скрипт `examples:check`, который последовательно собирает все примеры.
- Локальные ссылки и Vite-конфиги синхронизированы с TS-entrypoints текущей библиотеки и не блокируют сборку примеров.

### 3. Cleanup зависимостей и legacy-хвостов

- Из корневых `devDependencies` удалены пакеты, которые больше не участвуют в сборке/тестах/docs: `npm`, legacy Babel/Webpack-цепочки, `react-hot-loader`, `require-dir`, `event-stream`, `fbjs`, `i`, `react-context` и другие неиспользуемые зависимости.
- Для docs оставлены только актуально используемые зависимости: `remarkable` удалён, markdown-рендеринг переведён на `markdown-it`, а подсветка кода оставлена на обновлённом `highlight.js`.
- Для `lodash` / `lodash-es` зафиксирована текущая стратегия: библиотека остаётся на используемых path-imports и post-build rewrite на `lodash-es` для ESM-сборки.
- `package-lock.json` синхронизирован после чистки; свежий прогон `npm test` проходит без участия старого `npm` из `devDependencies`.

### 4. CI как обязательная проверка состояния форка

- Добавлен `.github/workflows/ci.yml` с запуском на `push` и `pull_request`.
- CI выполняет `npm ci`, `npm test`, `npm run build`, `npm run build-storybook`, `npm run docs-dist`, `npm run examples:check`.
- Workflow запускается в матрице Node `20.x` и `24.x`.
- После сборок выполняется проверка синхронности артефактов и lockfile через `npm run ci:artifacts`; проверяются `lib/`, `es/`, `docs/build/` и `package-lock.json`.
- `npm pack --dry-run` добавлен как smoke-check публикации, чтобы убедиться, что drop-in форма пакета не сломана.

### 5. TS strictness follow-up

- В `tsconfig.json` включён `noImplicitAny` как первый безопасный шаг ужесточения, не требующий массового пересмотра nullability-контрактов.
- В `src/vendor.d.ts` добавлены локальные декларации для `lodash/map`, `lodash/debounce`, `lodash/isUndefined`, `material-colors` и используемых icon-модулей, чтобы strictness не зависела от legacy-пакетов без встроенных типов.
- В компонентах, где компилятор ловил реальные `implicit any`, добавлены точечные аннотации для callback-параметров и согласованы импорты `material-colors` с локальной декларацией.
- На первом шаге `strictNullChecks` сознательно не включался, чтобы не смешивать `implicit any` cleanup и nullability-follow-up в один PR.
- Этот follow-up закрыт `2026-03-22`: после отдельной проверки permissive API для `Color`, `styles`, callback-аргументов и legacy edge cases флаг `strictNullChecks` оказался безопасным для включения без сужения публичного контракта.

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

- Этот подпункт закрыт отдельным follow-up `2026-03-22`.
- Что было сделано:
  - локальные `.d.ts` в `src/vendor.d.ts` уточнены для `reactcss` и `tinycolor2`, сохранив permissive-совместимость с текущим runtime;
  - `ColorPickerChangeEvent`, `ColorChangeHandler` и `SwatchHoverHandler` больше не держатся на `unknown` и согласованы с реальными react/native event-сценариями внутри пикеров;
  - `styles`-overrides сведены к общему alias `PickerCustomStyles` и протянуты через публичные props пикеров без сужения пользовательского API.
  - post-migration хвосты по `lodash`-утилитам и helper-типам перепроверены: локальные декларации в `src/vendor.d.ts` покрывают фактическое использование `each`, `map`, `merge`, `debounce`, `throttle`, `isUndefined`, а из runtime-кода убраны последние ручные приведения типов вокруг `debounce` в `ColorWrap` и `throttle` в `Saturation`.
- Сознательно не делалось в рамках этого пункта:
  - включение `strictNullChecks`;
  - агрессивное сужение helper-контрактов, которое могло бы незаметно изменить permissive DX пакета.

### 1b. PropTypes follow-up после TS-миграции

- Этот подпункт закрыт отдельным follow-up `2026-03-22`.
- Принято решение полностью удалить `prop-types` как больше не нужную legacy-зависимость:
  - runtime `propTypes` убраны из компонентов в `src/components/**`;
  - `ColorWrap` больше не прокидывает `Picker.propTypes` в обёрнутый компонент;
  - зависимость `prop-types` удалена из `package.json` и `package-lock.json`;
  - локальная декларация `declare module 'prop-types'` удалена из `src/vendor.d.ts`.
- Осознанный компромисс: JS-потребители больше не получают runtime-предупреждения через `propTypes`, но публичный API и TS-типизация библиотеки при этом не меняются.

### 2. Cleanup remaining legacy в docs и dev tooling

- Этот подпункт закрыт отдельным follow-up `2026-03-22`.
- Что было сделано:
  - Storybook-конфиг в [`../.storybook/main.js`](../.storybook/main.js) перепроверен и переведён с `reactDocgen: false` на `reactDocgen: 'react-docgen'`; это вернуло автогенерацию props metadata без перехода на более тяжёлый `react-docgen-typescript`.
  - Удалён obsolete `.babelrc`, который больше не использовался сборкой, но ломал Storybook docgen через старые пресеты `es2015` / `stage-0`.
  - Docs markdown runtime в [`../docs/components/common/MarkdownBlock.js`](../docs/components/common/MarkdownBlock.js) переведён с legacy-пакета `remarkable` на `markdown-it`, а `highlight.js` обновлён до ветки `11.x`.
  - Old-docs CommonJS snippets в [`../docs/documentation/04.02-helpers.md`](../docs/documentation/04.02-helpers.md) переведены на `import`-синтаксис, при этом deep imports `react-color/lib/components/common` сохранены как часть drop-in контракта.
  - [`../scripts/docs-server.js`](../scripts/docs-server.js) и [`../scripts/docs-dist.js`](../scripts/docs-dist.js) перепроверены: дополнительной legacy-обвязки после перехода на Vite там уже не осталось, поэтому код не менялся.
  - Из `devDependencies` удалён `remarkable`; `markdown-it` и актуальный `highlight.js` зафиксированы в `package.json` и `package-lock.json`.
- Граница задачи осталась прежней: drop-in API пакета, layout публикации и структура `lib/` / `es/` не менялись.

### 3. Документация возможных несовместимостей

- Этот подпункт закрыт отдельным follow-up `2026-03-22`.
- Что было сделано:
  - добавлен [`../CHANGELOG.md`](../CHANGELOG.md) с отдельным разделом `Unreleased`, где зафиксированы compatibility notes и user-visible DX changes;
  - [`../README.md`](../README.md) дополнен короткими migration notes про сохранение drop-in API и удаление runtime `propTypes`;
  - [`../PLAN.md`](../PLAN.md) синхронизирован по фактическому статусу phase 4 и post-phase-3 follow-up;
  - отдельно зафиксировано, что cleanup не привёл к breaking change публичного API пакета: менялись только internal/dev contracts и developer-facing tooling notes.

---

## Todo

- [x] **peer-react-range** — Обновить `peerDependencies` React и зафиксировать границы совместимости библиотеки и dev-окружения
- [x] **examples-modernization** — Перевести примеры на единый baseline React 16.14 и современный локальный dev/build pipeline без `react-scripts`; выполнено: Vite, local file dependency и `examples:check`
- [x] **legacy-devdeps-cleanup** — Удалить неиспользуемые legacy `devDependencies` и обновить `package-lock.json` после чистки
- [x] **ci-baseline** — Добавить GitHub Actions CI с обязательными проверками `build`, `test`, `docs`, `storybook` и `examples`; выполнено: `.github/workflows/ci.yml`, матрица Node `20.x`/`24.x`, `npm pack --dry-run` и `ci:artifacts`
- [x] **ts-strictness-follow-up** — Follow-up завершён: `strictNullChecks` включён, nullability-ошибки исправлены локально, permissive API для `Color`, `styles` и callback-аргументов сохранён
- [x] **typing-polish-follow-up** — Выполнено: локальные `.d.ts` уточнены для `reactcss` / `tinycolor2`, callback/event-типы выведены из `unknown`, `styles`-overrides объединены через `PickerCustomStyles`, хвосты по lodash/helper-типам закрыты удалением оставшихся type assertions вокруг `debounce` / `throttle`
- [x] **proptypes-follow-up** — Принято решение удалить `prop-types` после TS-миграции; runtime `propTypes` убраны из `src`, зависимость и локальные декларации удалены, план синхронизирован
- [x] **docs-legacy-follow-up** — Выполнено: Storybook `reactDocgen` возвращён как `react-docgen`, docs markdown runtime переведён на `markdown-it`, `highlight.js` обновлён, old-docs helper snippets переведены с `require(...)` на `import`, obsolete `.babelrc` удалён, `scripts/docs-server.js` и `scripts/docs-dist.js` подтверждены как уже минимальные
- [x] **breaking-docs-follow-up** — Выполнено: migration notes и DX-изменения синхронизированы в `CHANGELOG.md`, `README.md` и `PLAN.md`; подтверждено, что drop-in публичный API пакета сохранён

### Concrete remaining actions

- [x] Включить и проверить `noImplicitAny`; исправить только локальные типовые ошибки без изменения публичного API.
- [x] Оценить включение `strictNullChecks`; выполнено: флаг включён в базовом `tsconfig`, permissive сценарии для `Color`, `styles`, callback-аргументов и legacy edge cases перепроверены, дополнительные правки потребовались только для nullable `reactcss`-слоёв и `EditableInput.blurValue`.
- [x] Проверить, нужны ли локальные `.d.ts` или дополнительные типовые уточнения для `reactcss` и `tinycolor2`, чтобы следующий шаг по strictness не упирался в инфраструктурные компромиссы.
- [x] Просмотреть внутренние callback-контракты и `styles`-типы и сузить их там, где это можно сделать без изменения runtime API.
- [x] Принять отдельное решение по `propTypes`: библиотека `prop-types` больше не нужна, runtime guards удалены, зависимость снята.
- [x] Проверить, остались ли post-migration хвосты по lodash-утилитам или helper-типам, которые phase 3 сознательно не добивала; выполнено: проверены локальные декларации и фактическое использование, оставшиеся ручные type assertions вокруг `debounce` / `throttle` удалены, новых хвостов не найдено.
- [x] Проверить [`.storybook/main.js`](../.storybook/main.js) и решить, можно ли безопасно вернуть `reactDocgen` вместо `false`.
- [x] Просмотреть [`docs/components/`](../docs/components/) и [`docs/examples/`](../docs/examples/) и отделить оправданный legacy-код от хвостов, которые уже можно убрать или переписать.
- [x] Пересмотреть [`scripts/docs-server.js`](../scripts/docs-server.js) и [`scripts/docs-dist.js`](../scripts/docs-dist.js) на предмет лишней legacy-обвязки после перехода на Vite.
- [x] Принять решение по `highlight.js` и `remarkable`: `remarkable` удалён, docs переведены на `markdown-it`, `highlight.js` обновлён до актуальной ветки.
- [x] После каждого cleanup-шага прогонять `npm run build-storybook` и `npm run docs-dist`.
- [x] Если какой-то шаг меняет DX или контракт, синхронизировать это в `CHANGELOG`, `README.md` и верхнеуровневом `PLAN.md`; выполнено для follow-up по strictness, удалению `propTypes` и cleanup docs/dev tooling.
