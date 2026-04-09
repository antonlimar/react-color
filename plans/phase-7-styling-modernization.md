---
name: Фаза 7 styling modernization
overview: Убрать reactcss и перевести пикеры и общие примитивы на co-located SCSS с глобальными BEM-классами, поддержкой темной темы и расширяемой пользовательской кастомизацией без обязательной загрузки стилей всех пикеров сразу.
status: proposed
todos:
  - id: styling-architecture
    content: Ввести единую BEM-архитектуру классов для всех пикеров и общих примитивов, зафиксировать namespace rc-* и набор основных block/element/modifier соглашений
    status: completed
  - id: scss-structure-and-build
    content: Добавить co-located SCSS рядом с компонентами, granular CSS entrypoints для выборочного импорта стилей и optional aggregate entry без обязательной загрузки всех пикеров сразу
    status: completed
  - id: public-styling-api
    content: Расширить публичный API через theme и classNames, сохранить className на root и оставить styles как deprecated compatibility layer
    status: pending
  - id: migrate-common-primitives
    content: Перевести common-примитивы Alpha Hue Saturation EditableInput Swatch Checkboard Raised и общее styling-утилити на class-based markup с co-located SCSS
    status: pending
  - id: migrate-picker-subcomponents
    content: Перевести pointer fields swatch и preview подкомпоненты внутри папок picker-компонентов на co-located SCSS и единый slot/classNames контракт
    status: pending
  - id: migrate-top-level-pickers
    content: Перевести top-level пикеры alpha block chrome circle compact github google hue material photoshop sketch slider swatches twitter на class-based markup и BEM-модификаторы
    status: pending
  - id: theming-and-css-vars
    content: Вынести визуальные токены в CSS custom properties и реализовать light dark auto тему через root BEM-модификаторы и prefers-color-scheme
    status: pending
  - id: docs-and-migration-notes
    content: Обновить документацию по кастомизации и миграции со styles на classNames CSS variables и per-component CSS imports с optional aggregate entry
    status: pending
  - id: tests-and-consumption
    content: Обновить snapshots visual tests public-types и build/consumption проверки, включая granular CSS imports optional aggregate CSS entry и сценарии light dark theme
    status: pending
---

# Фаза 7: убрать `reactcss` и перевести пикеры на BEM + SCSS с темизацией

## Summary

Перевести все пикеры и общие примитивы с `reactcss`/inline-defaults на SCSS-стили с глобальными BEM-классами, сохранив визуальное поведение и публичную совместимость там, где это возможно. Стили каждого компонента должны храниться рядом с самим компонентом, а публикация CSS должна поддерживать выборочный импорт только нужных пикеров, без обязательной загрузки стилей всей библиотеки сразу.

## Key Changes

- Ввести единую styling-архитектуру:
  - Общий namespace классов `rc-*`.
  - Блоки вида `rc-chrome`, `rc-sketch`, `rc-editable-input`, `rc-saturation`.
  - Элементы по БЭМ: `__body`, `__field`, `__pointer`, `__swatch`.
  - Модификаторы: `--dark`, `--light`, `--disabled-alpha`, `--vertical`, `--active`, `--transparent`.
- Создать SCSS-слои с co-location:
  - SCSS каждого компонента хранить рядом с компонентом в той же папке, например `Chrome.tsx` + `Chrome.scss`, `EditableInput.tsx` + `EditableInput.scss`.
  - Общие tokens/mixins/variables вынести в `src/styles/core/`, но не складывать туда стили конкретных компонентов.
  - Дополнительно публиковать granular CSS entrypoints для выборочного импорта стилей конкретных компонентов или групп компонентов.
  - Optional aggregate entry допустим только как удобный shortcut для сценария "подключить почти всё", но не как основной или обязательный контракт.
- Публичный API расширить, не ломая текущий:
  - Оставить `className` на root.
  - Добавить `theme?: 'light' | 'dark' | 'auto'` в общий `ColorPickerProps`.
  - Добавить `classNames?: Partial<Record<string, string>>` для slot-level кастомизации.
  - Оставить `styles?: PickerCustomStyles` как deprecated fallback.
- Поведение `theme`:
  - `light`/`dark` ставят root-модификатор `--light`/`--dark`.
  - `auto` ставит `data-theme="auto"` и использует `prefers-color-scheme` в CSS.
  - Все цветовые решения перевести на CSS custom properties с базовыми светлой и темной темами.
- Поведение `classNames`:
  - Для каждого публичного пикера и общих примитивов зафиксировать ограниченный набор slot keys.
  - Минимальный контракт: `root` везде, плюс специфичные слоты вроде `body`, `controls`, `field`, `swatch`, `pointer`, `triangle`.
  - Внутри компонентов собирать классы через утилиту уровня `src/components/common` без зависимости от CSS Modules.
- Поведение `styles` на переходный период:
  - Не использовать для генерации default-стилей.
  - Применять только как runtime inline overrides на соответствующие DOM-слоты, где это возможно.
  - Задокументировать как deprecated, но сохранить тестируемую совместимость для текущих кейсов из `spec.tsx`.
- Сборка и публикация CSS:
  - Поддержать per-component или per-group CSS imports для сценария, где пользователю нужен только один пикер.
  - Aggregate CSS entry оставить optional convenience-path.
  - Не автоимпортировать CSS из JS, чтобы не ломать текущие CJS/Node smoke-сценарии.
  - Добавить шаг сборки CSS и проверку наличия опубликованных granular CSS артефактов.
- Типы и документация:
  - Обновить `src/types.ts` новыми публичными props и типом slot-class map.
  - Переписать docs про кастомизацию: вместо “override inline styles” описать BEM hooks, `classNames`, CSS variables, `theme` и выборочный импорт CSS.
  - Явно описать миграцию со `styles` на классы/переменные.

## Implementation Details

- Архитектурный контракт уже зафиксирован кодом в `src/components/common/styleArchitecture.ts`:
  - единый namespace `rc`;
  - словарь block names для top-level picker-компонентов и общих примитивов;
  - helpers для сборки BEM block/element/modifier class names;
  - базовый набор canonical slots: `root`, `body`, `controls`, `field`, `swatch`, `pointer`, `triangle`;
  - базовый набор canonical modifiers: `light`, `dark`, `disabled-alpha`, `vertical`, `active`, `transparent`.

- Общие интерактивные примитивы `Alpha`, `Hue`, `Saturation` сохранить с inline-стилями только там, где значение truly dynamic:
  - позиция pointer,
  - фон с конкретным выбранным цветом,
  - размеры/width/height, приходящие пропсами.
- Все статические layout/shape/spacing/typography/borders/shadows вынести в SCSS.
- Для каждого компонента SCSS-файл хранить рядом с реализацией компонента.
- Для каждого пикера определить slot map и использовать его последовательно в JSX. Примерно:
  - `root`, `saturation`, `body`, `controls`, `color`, `swatch`, `active`, `toggles`, `hue`, `alpha`, `fields`.
- Ввести вспомогательные утилиты:
  - `getPickerClassName(block, slot, modifiers, userClassNames)`
  - `getThemeClassName(theme)`
  - при необходимости `getStyleOverrides(styles, slot)` для deprecated-слоя.
- Для backward compatibility не менять существующие export names и deep import shape.
- Удалить зависимости `reactcss` и `@types/reactcss` только после полного перевода кода и тестов.
- Обновить снапшоты, потому что DOM станет class-driven вместо style-heavy.

## Test Plan

- Юниты:
  - root получает ожидаемые BEM-классы и theme-модификаторы.
  - `className` и `classNames.root`/slot classes реально прокидываются.
  - `theme="dark"` и `theme="light"` меняют модификатор; `auto` выставляет ожидаемый marker.
  - `styles` продолжает влиять на legacy-поддерживаемые слоты.
- Снапшоты:
  - обновить все picker/common snapshots под class-based markup.
  - добавить точечные снапшоты на dark theme для 2-3 репрезентативных пикеров.
- Visual:
  - расширить `test/visual/pickers.visual.spec.tsx` на light/dark и на кастомный пользовательский класс.
- Build/consumption:
  - `npm run build`, `npm test`, `npm run typecheck`, `npm run test:public-types`, `npm run test:esm-cjs-consumption`.
  - добавить проверку существования granular CSS entrypoints и optional aggregate CSS entry.
  - при необходимости добавить smoke fixture, который импортирует CSS только для одного пикера и отдельно aggregate CSS entry.

## Assumptions

- `styles` сохраняем как deprecated compatibility layer, а не как основной styling API.
- Основной способ подключения стилей после рефакторинга: выборочный импорт CSS только для нужного компонента или группы компонентов.
- Optional aggregate CSS entry остаётся только как convenience-path и не считается обязательной частью базового DX.
- Темизация строится на CSS variables и root BEM-модификаторах, не на отдельных theme-specific JSX-ветках.
- CSS Modules не используем: классы должны быть предсказуемыми и доступны потребителям для внешнего переопределения.

## Todo

- [x] **styling-architecture** — Ввести единую BEM-архитектуру классов для всех пикеров и общих примитивов, зафиксировать namespace `rc-*` и набор основных block/element/modifier соглашений
- [x] **scss-structure-and-build** — Добавить co-located SCSS рядом с компонентами, granular CSS entrypoints для выборочного импорта стилей и optional aggregate entry без обязательной загрузки всех пикеров сразу
- [ ] **public-styling-api** — Расширить публичный API через `theme` и `classNames`, сохранить `className` на root и оставить `styles` как deprecated compatibility layer
- [ ] **migrate-common-primitives** — Перевести common-примитивы `Alpha`, `Hue`, `Saturation`, `EditableInput`, `Swatch`, `Checkboard`, `Raised` и общее styling-утилити на class-based markup с co-located SCSS
- [ ] **migrate-picker-subcomponents** — Перевести pointer, fields, swatch и preview подкомпоненты внутри папок picker-компонентов на co-located SCSS и единый slot/classNames контракт
- [ ] **migrate-top-level-pickers** — Перевести top-level пикеры `alpha`, `block`, `chrome`, `circle`, `compact`, `github`, `google`, `hue`, `material`, `photoshop`, `sketch`, `slider`, `swatches`, `twitter` на class-based markup и BEM-модификаторы
- [ ] **theming-and-css-vars** — Вынести визуальные токены в CSS custom properties и реализовать `light`/`dark`/`auto` тему через root BEM-модификаторы и `prefers-color-scheme`
- [ ] **docs-and-migration-notes** — Обновить документацию по кастомизации и миграции со `styles` на `classNames`, CSS variables и выборочные CSS imports с optional aggregate entry
- [ ] **tests-and-consumption** — Обновить snapshots, visual tests, public-types и build/consumption проверки, включая granular CSS imports, optional aggregate CSS entry и сценарии light/dark theme
