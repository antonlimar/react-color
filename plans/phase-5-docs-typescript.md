---
name: Фаза 5 docs TypeScript
overview: Поэтапный перевод runtime-кода сайта документации в docs/ на TypeScript без изменения drop-in API npm-пакета и без смешивания этой работы с библиотечной сборкой src/lib/es.
todos:
  - id: docs-tsconfig
    content: Добавить отдельный tsconfig для docs и минимальные декларации для markdown raw imports, не затрагивая library build
    status: completed
  - id: docs-entrypoints
    content: Перевести docs entrypoints и registry-модули на .ts/.tsx с сохранением текущего Vite pipeline
    status: pending
  - id: docs-components
    content: Перевести компоненты docs/components и docs/examples на TypeScript, зафиксировать типы props и локальных state
    status: pending
  - id: docs-tooling
    content: Подключить отдельный typecheck docs в scripts/CI и синхронизировать документацию по командам при необходимости
    status: pending
  - id: docs-verification
    content: Подтвердить миграцию через npm run docs-dist и локальный docs-server без регрессий в render/markdown/examples
    status: pending
---

# Фаза 5: миграция `docs/` на TypeScript

## Зачем это делать

Секция `docs/` уже изолирована от публичного npm-контракта пакета: она собирается отдельным Vite pipeline через [`vite.docs.config.js`](../vite.docs.config.js) и не участвует в публикации `lib/` / `es/`. Поэтому перевод runtime-кода docs на TypeScript можно делать как локальное улучшение DX без риска сломать drop-in сценарий потребителей `react-color`.

Ожидаемая польза:

- явные типы для `primaryColor`, markdown/frontmatter и props docs-компонентов;
- меньше неявной динамики в [`../docs/components/home/HomeDocumentation.js`](../docs/components/home/HomeDocumentation.js) и [`../docs/components/common/MarkdownBlock.js`](../docs/components/common/MarkdownBlock.js);
- отдельный typecheck для docs, чтобы ошибки в документационном приложении ловились до `docs-dist`, а не только на этапе ручной проверки.

## Границы задачи

Что входит в миграцию:

- entrypoint [`../docs/index.js`](../docs/index.js);
- registry markdown-документов [`../docs/documentation/index.js`](../docs/documentation/index.js);
- runtime-компоненты в [`../docs/components/`](../docs/components/);
- примеры для сайта в [`../docs/examples/`](../docs/examples/).

Что не входит:

- markdown-файлы в [`../docs/documentation/`](../docs/documentation/);
- статические ассеты в [`../docs/images/`](../docs/images/);
- сгенерированный артефакт [`../docs/build/bundle.js`](../docs/build/bundle.js);
- изменения публичного API библиотеки, layout публикации и сборок `lib/` / `es/`.

## Текущее состояние

- docs уже работают на Vite, но entry в [`../docs/index.js`](../docs/index.js) и внутренние модули всё ещё на JavaScript;
- корневой [`../tsconfig.json`](../tsconfig.json) включает только `src/**`, поэтому `docs/` сейчас не typecheck-ится вообще;
- в [`../vite.docs.config.js`](../vite.docs.config.js) есть специальный pre-plugin `jsxInJsPlugin()`, который нужен только потому, что docs по-прежнему содержат JSX внутри `.js`.

Из этого следует, что простое переименование файлов в `.ts` / `.tsx` недостаточно: миграция должна сначала ввести отдельную инфраструктуру для typecheck docs, а потом уже переводить код.

## Предлагаемый порядок работ

### 1. Отдельный `tsconfig` для docs

Добавить `tsconfig.docs.json` с отдельным `include` для `docs/**/*` и, при необходимости, `vite.docs.config.js`-совместимыми настройками JSX.

Цели шага:

- не смешивать library build и docs typecheck;
- не расширять случайно `rootDir` текущего [`../tsconfig.json`](../tsconfig.json);
- получить безопасную базу для постепенного перевода файлов.

На этом же шаге добавить минимальные декларации для импортов вида `*.md?raw` и, если потребуется, для других raw-ресурсов docs.

### 2. Перевести entrypoints и registries

Сначала перевести самые простые и центральные модули:

- [`../docs/index.js`](../docs/index.js) → `docs/index.tsx`;
- [`../docs/documentation/index.js`](../docs/documentation/index.js) → `docs/documentation/index.ts`;
- [`../docs/examples/index.js`](../docs/examples/index.js) → `docs/examples/index.ts`.

Почему именно так:

- это даст типовую основу для остальных импортов;
- станет проще описать shape markdown registry и raw example snippets;
- уменьшится количество переходных JS/TS-смешанных импортов.

### 3. Перевести общие docs-компоненты

Следующим шагом перевести [`../docs/components/common/MarkdownBlock.js`](../docs/components/common/MarkdownBlock.js), потому что это главный узел типизации для markdown runtime.

Что стоит зафиксировать типами:

- props `MarkdownBlock` и `MarkdownDocument`;
- результат `parseFrontmatter`;
- shape frontmatter-полей `id` и `title`;
- inline style props без избыточного усложнения.

Здесь важно не переусложнить типы: для docs достаточно pragmatic typing, а не максимальной строгости ради строгости.

### 4. Перевести `home`-компоненты и examples

После общего markdown runtime перевести:

- [`../docs/components/home/Home.js`](../docs/components/home/Home.js);
- [`../docs/components/home/HomeFeature.js`](../docs/components/home/HomeFeature.js);
- [`../docs/components/home/HomeDocumentation.js`](../docs/components/home/HomeDocumentation.js);
- [`../docs/examples/ButtonExample.js`](../docs/examples/ButtonExample.js);
- [`../docs/examples/SketchExample.js`](../docs/examples/SketchExample.js).

На этом этапе нужно:

- описать props `primaryColor` и `onChange`;
- типизировать shape цвета, который используется локально в docs-demo;
- аккуратно типизировать `Object.entries(documentation)` и parsing frontmatter без изменения runtime-логики.

### 5. Упростить docs-specific tooling после миграции

Когда JSX в `.js` внутри `docs/` исчезнет, проверить, нужен ли ещё костыль `jsxInJsPlugin()` в [`../vite.docs.config.js`](../vite.docs.config.js). Если он остаётся нужен только ради `src/`, решение принять отдельно; если нет, удалить его как технический долг.

Также добавить отдельную команду вида `docs:typecheck` и решить, должна ли она входить в:

- общий `npm test`;
- CI;
- или только в `docs-dist` / отдельный quality gate.

Рекомендуемый вариант: сначала добавить отдельный script и прогонять его в CI, не смешивая с library build.

## Риски и компромиссы

- Миграция `docs/` не должна запускать широкую волну рефакторинга UI или стилей. Цель этой фазы именно типизация и предсказуемость, а не редизайн.
- Не стоит втягивать в эту же фазу перевод `scripts/docs-server.js` / `scripts/docs-dist.js` на TypeScript: они и так минимальны и относятся к другому слою.
- Избыточно строгие типы для markdown/frontmatter могут дать много шума без практической пользы; лучше держать типы простыми и локальными.
- Если в процессе выяснится, что часть docs-кода удобнее оставить на JS временно, это допустимо. Важнее сначала ввести инфраструктуру и закрыть самые центральные модули.

## Критерии готовности

- runtime-код `docs/` переведён на `.ts` / `.tsx`;
- для docs есть отдельный проход typecheck;
- [`../vite.docs.config.js`](../vite.docs.config.js) и docs scripts продолжают собирать сайт без изменения пользовательского поведения;
- `npm run docs-dist` проходит, а docs UI визуально не теряет markdown, примеры и навигацию;
- library build (`lib/`, `es`, публичные exports) не затронуты.

## Todo

- [x] **docs-tsconfig** — Добавить отдельный `tsconfig` для docs и минимальные декларации для markdown raw imports, не затрагивая library build
- [ ] **docs-entrypoints** — Перевести docs entrypoints и registry-модули на `.ts` / `.tsx` с сохранением текущего Vite pipeline
- [ ] **docs-components** — Перевести `docs/components` и `docs/examples` на TypeScript, зафиксировать типы props и локальных state
- [ ] **docs-tooling** — Подключить отдельный typecheck docs в scripts/CI и синхронизировать документацию по командам при необходимости
- [ ] **docs-verification** — Подтвердить миграцию через `npm run docs-dist` и локальный `docs-server` без регрессий в render/markdown/examples
