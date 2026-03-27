---
name: Фаза 7 functional components and reactcss removal
overview: Безопасно переписать библиотеку с классовых компонентов на функциональные и убрать reactcss без breaking changes по публичному API, поведению, визуальным состояниям и контракту пользовательских style overrides.
todos:
  - id: add-visual-regression-coverage
    content: В самом начале расширить Storybook visual regression сценарии для ключевых пикеров и состояний, чтобы зафиксировать текущий визуальный baseline до удаления reactcss и миграции на функции
    status: pending
  - id: lock-regression-contract
    content: Уплотнить regression-контур вокруг ColorWrap, common interactive-компонентов и top-level API до начала миграции, чтобы зафиксировать текущий runtime-контракт библиотеки
    status: pending
  - id: migrate-presentational-components
    content: Переписать stateless и presentational-компоненты на функции и убрать reactcss через локальные style builders без изменения layout и публичного styling contract
    status: pending
  - id: migrate-local-state-components
    content: Переписать на функции stateful UI-компоненты без drag lifecycle, включая EditableInput, ChromeFields и Photoshop, сохранив shape state transitions и callback payloads
    status: pending
  - id: migrate-drag-components
    content: Переписать Hue, Saturation и Alpha на функциональные компоненты с безопасным lifecycle глобальных listeners и без регрессий mouse/touch interaction
    status: pending
  - id: migrate-colorwrap
    content: Переписать ColorWrap на hooks-реализацию с сохранением controlled sync, oldHue, debounced onChangeComplete и существующего публичного контракта HOC
    status: pending
---

# План: безопасная миграция на функциональные компоненты и отказ от reactcss

## Кратко

- Цель: переписать библиотеку с классовых компонентов на функциональные без breaking changes по публичному API и без незаметных регрессий в поведении и верстке.
- Подход: мигрировать **по компонентам**, а не одним большим PR, и сначала зафиксировать визуальный baseline в Storybook, затем усилить тестовый контур вокруг самых рискованных мест.
- Главный принцип: на каждом шаге проверять не сходство реализации, а сохранение контракта библиотеки — exports, callback payloads, интерактивное поведение, visual states, сборка и типы.

## Ключевые изменения в процессе миграции

### 1. Сначала зафиксировать визуальный baseline

- До любого рефакторинга расширить существующие stories для пикеров и ключевых внутренних состояний, чтобы получить стабильную visual regression базу на текущей реализации.
- Покрыть stories не только для happy path, но и для наиболее хрупких вариантов: `disableAlpha`, custom `styles`, прозрачные цвета, нестандартный `className`, vertical hue, переключаемые field views.
- Использовать этот visual baseline как первый стопор против незаметных layout/regression-изменений после удаления `reactcss`.

### 2. Затем зафиксировать runtime-контракт до рефакторинга

- Усилить regression-набор для [`src/components/common/ColorWrap.tsx`](/home/anton/My/react-color/src/components/common/ColorWrap.tsx), потому что это главный stateful-узел: синхронизация `props.color -> state`, `oldHue`, `onChange`, дебаунс `onChangeComplete`, `onSwatchHover`.
- Добавить contract-тесты на ключевые common-компоненты: [`src/components/common/EditableInput.tsx`](/home/anton/My/react-color/src/components/common/EditableInput.tsx), [`src/components/common/Hue.tsx`](/home/anton/My/react-color/src/components/common/Hue.tsx), [`src/components/common/Saturation.tsx`](/home/anton/My/react-color/src/components/common/Saturation.tsx), [`src/components/common/Alpha.tsx`](/home/anton/My/react-color/src/components/common/Alpha.tsx), `Checkboard`, `Swatch`.
- Оставить и усилить проверки top-level API: default export, named exports, `test:public-types`, `test:esm-cjs-consumption`, deep imports.

### 3. Разбить миграцию на безопасные очереди

- Очередь 1: stateless/presentational компоненты без собственного state и без глобальных listener-ов.
- Очередь 2: stateful UI-компоненты с локальным состоянием, но без drag lifecycle, например [`src/components/chrome/ChromeFields.tsx`](/home/anton/My/react-color/src/components/chrome/ChromeFields.tsx), `Photoshop`, `EditableInput`.
- Очередь 3: drag-компоненты с listener lifecycle: `Hue`, `Saturation`, `Alpha`.
- Очередь 4: [`src/components/common/ColorWrap.tsx`](/home/anton/My/react-color/src/components/common/ColorWrap.tsx) как отдельный шаг после уплотнения тестов вокруг него.
- На каждом шаге не смешивать переписывание на hooks с заметным изменением layout или публичного styling contract.

### 4. Убирать reactcss через промежуточную адаптацию

- Для каждого компонента сначала заменить `reactCSS(...)` на обычные TS-объекты стилей или небольшой локальный helper вида `buildXStyles(props)` с тем же входом и тем же merge-поведением.
- Сохранить текущий публичный `styles` override contract, включая приоритет пользовательских override-ов.
- Для мест с `merge(...)` и conditional variants отдельно проверить порядок приоритетов: base styles, variant styles, user overrides.
- Не совмещать эту миграцию с переходом на CSS Modules, CSS-in-JS или другой styling-подход.

### 5. Визуальный контур защиты остаётся обязательным на каждом шаге

- Для каждого пикера поддерживать story-сценарии не только на default-state, но и на ключевые варианты: `disableAlpha`, custom `styles`, `className`, прозрачные цвета, вертикальный hue, переключаемые views в полях.
- Storybook visual regression должен запускаться до первой волны миграции и затем сопровождать каждый этап переписывания компонентов.
- DOM snapshots оставить как вторичный сигнал, а не как единственный источник уверенности.

## Какие тесты написать

### Обязательные unit/integration тесты до начала миграции

- `ColorWrap`: подхватывает дефолтный цвет при отсутствии `color`; пересчитывает state только при реальном изменении `color`; корректно ведет `oldHue`; вызывает `onChange` сразу и `onChangeComplete` с дебаунсом; не вызывает callbacks для невалидного цвета.
- `EditableInput`: синхронизирует controlled value без потери пользовательского ввода в фокусе; восстанавливает `blurValue`; `ArrowUp`/`ArrowDown` меняют значение с учетом `arrowOffset`; drag-label ставит и снимает глобальные listeners; `onChange` отдает правильный payload.
- `ChromeFields`: корректно переключает views `hex -> rgb -> hsl`; автоматически уходит из `hex`, если `alpha !== 1`; правильно нормализует `hex/rgb/hsl/a`; clamp-ит alpha в диапазон `[0,1]`.
- `Photoshop`: сохраняет текущий preview color; `onAccept` и `onCancel` вызываются в прежнем контракте.
- `Hue`, `Saturation`, `Alpha`: mouse/touch interaction обновляют цвет; pointer position меняется ожидаемо; глобальные listeners ставятся и снимаются при `mousedown`/`mouseup` и `unmount`; для `Saturation` сохраняется поведение через `ownerDocument.defaultView`.
- `styles` overrides: как минимум для `Chrome`, `Sketch`, `Photoshop`, `Github` проверить, что пользовательские стили реально пробрасываются и имеют тот же приоритет, что и до рефакторинга.
- `className`: top-level picker classes и пользовательский `className` не теряются после переписывания.

### Проверки сборки и совместимости

- `npm test`
- `npm run build`
- `npm run test:public-types`
- `npm run test:esm-cjs-consumption`
- Smoke-проверки deep imports для нескольких популярных путей, если они остаются частью контрактной совместимости.

### Визуальные сценарии в Storybook, которые нужно завести первыми

- Базовый рендер каждого пикера.
- Пикер с custom `styles`.
- Пикер с `disableAlpha`.
- Пикер с прозрачным цветом.
- Пикер с нестандартным `className`.
- Сценарии переключения полей для `ChromeFields` и `SketchFields`.
- Сценарии для ручной проверки положения pointer-ов после drag/move.

### Минимальный стартовый набор visual stories

- [`src/components/chrome/story.tsx`](/home/anton/My/react-color/src/components/chrome/story.tsx):
  - `ChromePicker` как baseline
  - `ChromePickerDisableAlpha`
  - `ChromePickerTransparentColor`
  - `ChromePickerCustomStyles`
  - `ChromePickerDefaultViewRgb`
  - `ChromePickerDefaultViewHsl`
- [`src/components/sketch/story.tsx`](/home/anton/My/react-color/src/components/sketch/story.tsx):
  - оставить `SketchPicker` как baseline
  - оставить `SketchPickerCustomStyles`
  - добавить `SketchPickerDisableAlpha`
  - добавить `SketchPickerTransparentColor`
  - добавить `SketchPickerLongPresetColors`
- [`src/components/photoshop/story.tsx`](/home/anton/My/react-color/src/components/photoshop/story.tsx):
  - `PhotoshopPicker` как baseline
  - `PhotoshopPickerCustomStyles`
  - `PhotoshopPickerTransparentColor`
  - `PhotoshopPickerCustomHeader`
- [`src/components/google/story.tsx`](/home/anton/My/react-color/src/components/google/story.tsx):
  - `GooglePicker` как baseline
  - `GooglePickerNarrowWidth`
  - `GooglePickerCustomHeader`
  - `GooglePickerCustomStyles`
- [`src/components/swatches/story.tsx`](/home/anton/My/react-color/src/components/swatches/story.tsx):
  - `SwatchesPicker` как baseline
  - `SwatchesPickerShortPalette`
  - `SwatchesPickerTallLayout`
  - `SwatchesPickerTransparentColor`
- [`src/components/block/story.tsx`](/home/anton/My/react-color/src/components/block/story.tsx):
  - `BlockPicker` как baseline
  - `BlockPickerHideTriangle`
  - `BlockPickerCustomStyles`
- [`src/components/github/story.tsx`](/home/anton/My/react-color/src/components/github/story.tsx):
  - `GithubPicker` как baseline
  - `GithubPickerTopRightTriangle`
  - `GithubPickerHideTriangle`
  - `GithubPickerCustomStyles`
- [`src/components/twitter/story.tsx`](/home/anton/My/react-color/src/components/twitter/story.tsx):
  - `TwitterPicker` как baseline
  - `TwitterPickerHideTriangle`
  - `TwitterPickerTopRightTriangle`
  - `TwitterPickerCustomStyles`
- [`src/components/circle/story.tsx`](/home/anton/My/react-color/src/components/circle/story.tsx):
  - `CirclePicker` как baseline
  - `CirclePickerLargeSwatches`
  - `CirclePickerCustomStyles`
- [`src/components/compact/story.tsx`](/home/anton/My/react-color/src/components/compact/story.tsx):
  - `CompactPicker` как baseline
  - `CompactPickerCustomStyles`
  - `CompactPickerShortPalette`
- [`src/components/material/story.tsx`](/home/anton/My/react-color/src/components/material/story.tsx):
  - `MaterialPicker` как baseline
  - `MaterialPickerCustomStyles`

### Что не обязательно выносить в visual stories на первом шаге

- Не заводить отдельные stories для `Alpha`, `Hue`, `Saturation`, pointer-компонентов и мелких внутренних primitives в первой волне.
- Их поведение на первом шаге страховать unit/integration тестами, а визуально прикрывать через top-level picker stories, где эти части уже участвуют в реальном layout.
- Если после первой волны окажется, что visual baseline ловит не все regressions pointer positioning, добавить отдельные internal stories второй итерацией, а не перегружать стартовый набор.

### Пошаговый чеклист реализации visual baseline

1. Расширить [`src/components/chrome/story.tsx`](/home/anton/My/react-color/src/components/chrome/story.tsx), потому что `Chrome` покрывает сразу несколько хрупких зон: `disableAlpha`, `defaultView`, custom `styles`, прозрачность и поля ввода.
2. Расширить [`src/components/sketch/story.tsx`](/home/anton/My/react-color/src/components/sketch/story.tsx), потому что `Sketch` сочетает preset colors, optional alpha и крупный layout, чувствительный к style regressions.
3. Расширить [`src/components/photoshop/story.tsx`](/home/anton/My/react-color/src/components/photoshop/story.tsx) и [`src/components/google/story.tsx`](/home/anton/My/react-color/src/components/google/story.tsx), чтобы закрыть широкие fixed-layout пикеры с заголовками, полями и кастомными стилями.
4. Расширить [`src/components/swatches/story.tsx`](/home/anton/My/react-color/src/components/swatches/story.tsx), [`src/components/block/story.tsx`](/home/anton/My/react-color/src/components/block/story.tsx), [`src/components/github/story.tsx`](/home/anton/My/react-color/src/components/github/story.tsx) и [`src/components/twitter/story.tsx`](/home/anton/My/react-color/src/components/twitter/story.tsx), чтобы зафиксировать triangle/layout/swatch combinations.
5. Дорасширить [`src/components/circle/story.tsx`](/home/anton/My/react-color/src/components/circle/story.tsx), [`src/components/compact/story.tsx`](/home/anton/My/react-color/src/components/compact/story.tsx) и [`src/components/material/story.tsx`](/home/anton/My/react-color/src/components/material/story.tsx) как финальную волну для более простых визуальных раскладок.
6. После каждой волны запускать `npm run build-storybook` и вручную просматривать обновленные stories в Storybook dev/build, не переходя к следующей группе, пока не подтверждено, что baseline визуально стабилен.
7. Считать первую фазу visual baseline завершенной только когда у каждого top-level picker есть baseline story и хотя бы один story на нестандартное состояние, а весь набор собирается без ручных правок в runtime-компонентах.

## Допущения и выбранные ограничения

- Миграция идет по компонентам, а не одним большим PR.
- Отдельный визуальный слой через Storybook создается до начала основной миграции и входит в обязательный контур защиты.
- Публичный API, shape callback-ов, структура экспортов и styling override contract должны сохраниться без breaking changes.
- Артефакты `lib/` и `es/` продолжают генерироваться только через сборку.
- Если функциональная версия какого-то компонента требует изменить DOM-структуру, сначала добавляется тест на поведение и контракт, и только потом меняется реализация.

## Todo

- [ ] **add-visual-regression-coverage** — В самом начале расширить Storybook visual regression сценарии для ключевых пикеров и состояний, чтобы зафиксировать текущий визуальный baseline до удаления `reactcss` и миграции на функции
- [ ] **lock-regression-contract** — Уплотнить regression-контур вокруг `ColorWrap`, common interactive-компонентов и top-level API до начала миграции, чтобы зафиксировать текущий runtime-контракт библиотеки
- [ ] **migrate-presentational-components** — Переписать stateless и presentational-компоненты на функции и убрать `reactcss` через локальные style builders без изменения layout и публичного styling contract
- [ ] **migrate-local-state-components** — Переписать на функции stateful UI-компоненты без drag lifecycle, включая `EditableInput`, `ChromeFields` и `Photoshop`, сохранив shape state transitions и callback payloads
- [ ] **migrate-drag-components** — Переписать `Hue`, `Saturation` и `Alpha` на функциональные компоненты с безопасным lifecycle глобальных listeners и без регрессий mouse/touch interaction
- [ ] **migrate-colorwrap** — Переписать `ColorWrap` на hooks-реализацию с сохранением controlled sync, `oldHue`, debounced `onChangeComplete` и существующего публичного контракта HOC
