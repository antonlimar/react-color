---
name: Фаза 6 upstream issues follow-up
overview: Закрыть наиболее ценные открытые проблемы апстрима react-color без ломки drop-in совместимости форка: CSP, defaultProps warnings, runtime icons, iframe-safe drag behavior, accessibility hooks и проверка ESM/CJS interop.
todos:
  - id: csp-safe-gradients
    content: Убрать runtime <style> из common-компонентов Hue и Saturation, перенести градиенты в inline style-объекты элементов и сохранить текущее визуальное поведение без нового публичного nonce API
    status: completed
  - id: remove-defaultprops
    content: Полностью убрать defaultProps из ColorWrap и Photoshop, сохранив те же runtime defaults и не меняя публичные TypeScript-контракты компонентов
    status: completed
  - id: localize-runtime-icons
    content: Убрать зависимость @icons/material из published runtime, заменить используемые иконки на локальные SVG-компоненты и проверить отсутствие импортов @icons/material в lib/ и es/
    status: pending
  - id: iframe-safe-saturation
    content: Переписать логику getContainerRenderWindow в Saturation на ownerDocument.defaultView с безопасным fallback на window без обхода parent.document
    status: pending
  - id: a11y-and-styling-hooks
    content: Добавить базовую keyboard accessibility и стабильные className/data-атрибуты на ключевые интерактивные внутренние узлы без большого рефакторинга reactcss или theming-system
    status: pending
  - id: esm-cjs-consumption-check
    content: Добавить отдельную проверку потребления root entry, named imports и deep imports из lib/es и зафиксировать interop-ожидания в документации без введения exports map
    status: pending
---

# Фаза 6: follow-up по открытым issues апстрима

## Summary

Эта фаза нацелена не на очередную модернизацию toolchain, а на закрытие пользовательских болей, которые по-прежнему видны в issues upstream `casesandberg/react-color` и частично остаются актуальными для форка. Приоритет здесь смещён в сторону runtime-совместимости и предсказуемости поведения: сначала убрать CSP-конфликтующие места и React warnings, затем снять внешнюю runtime-зависимость на иконки, после этого исправить iframe-safe drag handling и только затем расширять accessibility/hooks для кастомизации.

Ключевое ограничение остаётся тем же, что и в предыдущих фазах: не ломать drop-in контракт пакета. `main`, `module`, `files`, структура `lib/` и `es/`, root typings, deep imports и имена экспортов из `src/index.ts` должны остаться совместимыми с upstream-пакетом.

## Implementation Changes

### 1. CSP-safe градиенты без inline `<style>`

- Убрать runtime `<style>` из `src/components/common/Hue.tsx` и `src/components/common/Saturation.tsx`.
- Перенести фоновые градиенты в style-объекты самих DOM-элементов, чтобы компонент не зависел от inline style tags и не требовал `unsafe-inline` или `nonce` в CSP.
- Не добавлять новый публичный `nonce` prop в этой фазе: CSP-проблему закрыть устранением её источника, а не расширением API.
- Сохранить текущее визуальное поведение для horizontal/vertical hue и saturation overlays без изменения публичных пропсов.

### 2. Удаление `defaultProps` warnings

- Убрать использование `defaultProps` из `ColorWrap` и `Photoshop`.
- Заменить их на локальные значения по умолчанию в вычислении props и render-path:
  - `color` default в `ColorWrap`
  - `header` и `styles` defaults в `Photoshop`
- Не менять permissive-поведение текущих optional props и не сужать публичные типы.

### 3. Локальные runtime-иконки

- Убрать зависимость `@icons/material` из published runtime.
- Заменить `CheckIcon` и `UnfoldMoreHorizontalIcon` на локальные React SVG-компоненты внутри библиотеки.
- Визуально сохранить поведение toggle-иконки в ChromeFields и check-иконки в SwatchesColor максимально близким текущему.
- После сборки проверить, что в `lib/` и `es/` больше нет импортов `@icons/material/*`.

### 4. iframe-safe `Saturation`

- Переписать логику определения окна для drag listeners в `Saturation` так, чтобы она не зависела от обхода `window.parent.document`.
- Базовая стратегия реализации:
  - брать `ownerDocument.defaultView` контейнера, если он доступен;
  - падать обратно на текущий `window`, если контейнер или document/window недоступны;
  - не делать цикл по `parent`.
- Сохранить текущую модель подписки на `mousemove`/`mouseup` и не вводить новый публичный API.

### 5. Accessibility и стабильные hooks для стилизации

- Добавить минимально достаточные accessibility hooks для `Hue`, `Alpha`, `Saturation` и связанных интерактивных surfaces:
  - focusability;
  - keyboard support для базового изменения значения стрелками;
  - role/ARIA-атрибуты там, где это можно сделать без breaking changes.
- Добавить стабильные class hooks или data-атрибуты на ключевые внутренние DOM-узлы picker-ов, чтобы кастомизация не зависела от хрупких селекторов по вложенности.
- Не делать в этой фазе большой redesign стилизации и не уходить от `reactcss`.

### 6. Проверка ESM/CJS interop без смены packaging contract

- Не вводить `exports` map в этой фазе.
- Добавить отдельную consumption-проверку для сценариев:
  - default import из корня;
  - named imports из корня;
  - deep imports из `lib/`;
  - deep imports из `es/`.
- Если на fixture-потребителе воспроизводится interop-проблема, зафиксировать её как follow-up внутри этой фазы или отдельной следующей итерации, но не менять packaging contract без отдельного решения.
- Синхронизировать README/plan notes по ожидаемому interop-поведению в Node/SSR/Remix-like средах.

## Verification

Проверки этой фазы должны пройти на текущем состоянии репозитория после реализации:

- `npm test`
- `npm run typecheck`
- `npm run build`
- `npm run test:public-types`
- `npm run build-storybook`
- `npm run docs-dist`
- `npm run examples:check`
- `npm pack --dry-run`

Дополнительно должны быть покрыты следующие сценарии:

- `Hue` и `Saturation` продолжают корректно рендерить градиенты после удаления `<style>`.
- drag для hue/alpha/saturation не регрессирует.
- `ColorWrap` сохраняет controlled-state sync и defaults для `color`.
- `Photoshop` сохраняет defaults для `header` и `styles`.
- keyboard interaction на интерактивных common controls меняет значение предсказуемо.
- `Saturation` безопасно работает при контейнере внутри iframe и не обращается к `parent.document`.
- после сборки в `lib/` и `es/` отсутствуют runtime-импорты `@icons/material`.
- public-types smoke продолжает подтверждать root imports и deep imports без сужения API.

## Assumptions

- Drop-in совместимость важнее агрессивной modern packaging-оптимизации.
- CSP-проблема закрывается удалением inline `<style>`, а не введением `nonce` в публичный API.
- `exports` map и радикальная смена packaging не входят в scope этой фазы.
- Accessibility улучшается инкрементально: базовая клавиатурная управляемость и стабильные hooks, без архитектурного переписывания pickers.
- IE11 и прочие legacy browser-specific кейсы не являются целевой областью этой фазы, если исправление не получается бесплатно в рамках iframe/CSP cleanup.

## Todo

- [x] **csp-safe-gradients** — Убрать runtime `<style>` из common-компонентов `Hue` и `Saturation`, перенести градиенты в inline style-объекты элементов и сохранить текущее визуальное поведение без нового публичного `nonce` API
- [x] **remove-defaultprops** — Полностью убрать `defaultProps` из `ColorWrap` и `Photoshop`, сохранив те же runtime defaults и не меняя публичные TypeScript-контракты компонентов
- [ ] **localize-runtime-icons** — Убрать зависимость `@icons/material` из published runtime, заменить используемые иконки на локальные SVG-компоненты и проверить отсутствие импортов `@icons/material` в `lib/` и `es/`
- [ ] **iframe-safe-saturation** — Переписать логику `getContainerRenderWindow` в `Saturation` на `ownerDocument.defaultView` с безопасным fallback на `window` без обхода `parent.document`
- [ ] **a11y-and-styling-hooks** — Добавить базовую keyboard accessibility и стабильные `className`/`data-атрибуты` на ключевые интерактивные внутренние узлы без большого рефакторинга `reactcss` или theming-system
- [ ] **esm-cjs-consumption-check** — Добавить отдельную проверку потребления root entry, named imports и deep imports из `lib/es` и зафиксировать interop-ожидания в документации без введения `exports` map
