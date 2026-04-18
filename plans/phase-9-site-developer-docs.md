---
name: Phase 9 site developer docs
overview: Доработать сайт в `site/` как удобную документацию для разработчиков: быстрый поиск, copyable code blocks, picker gallery, улучшенный API reference, mobile/accessibility polish и проверка консистентности контента.
status: proposed
todos:
  - id: quick-ux-a11y-polish
    content: Исправить favicon 404, добавить skip link и focus-visible состояния, отполировать hero/mobile metrics, улучшить mobile drawer и стабилизировать active anchor
    status: done
  - id: developer-code-blocks
    content: Добавить copyable code blocks, package-manager tabs, clipboard states, aria-live feedback и устойчивую mobile-верстку сниппетов
    status: done
  - id: docs-search-navigation
    content: Реализовать локальный поиск по секциям, props, examples и picker metadata с URL query state, desktop/mobile UI и keyboard shortcut
    status: done
  - id: api-reference-and-gallery
    content: Улучшить API reference для длинных defaults и mobile prop cards, добавить prop-level anchors и полноценную Picker Gallery для всех публичных пикеров
    status: done
  - id: developer-guides
    content: Добавить разделы Migration, TypeScript Recipes, Styling & CSS Hooks, SSR & Framework Notes и Accessibility Notes
    status: done
  - id: content-validation
    content: Добавить site content validation script для уникальности anchors, валидности внутренних ссылок и покрытия публичных picker exports в gallery, подключить к site verification
    status: done
---

# Developer-Focused Site Documentation

## Summary

Доработать текущий `site/` из красивой single-page витрины в практичную документацию для разработчиков. Сайт уже делает главное хорошо: показывает реальные синхронизированные pickers на первом экране и рендерит structured docs content. Следующий слой должен помочь пользователю быстрее найти нужный picker/prop, скопировать рабочий код, сравнить компоненты, понять TypeScript/CSS/SSR нюансы и комфортно пользоваться документацией на desktop и mobile.

Реализацию вести по этапам, чтобы каждый этап можно было проверить и смержить отдельно. Публичный runtime API пакета `react-color` не менять; работа касается только `site/`, site content model, тестов и вспомогательной валидации контента.

## Implementation Changes

### 1. Quick UX, accessibility, and polish

- Починить 404 на `favicon.ico`: добавить favicon для Vite site и подключить его из `site/index.html`.
- Добавить skip link `Skip to documentation`, ведущий к основному `<main>`.
- Добавить единые `:focus-visible` состояния для ссылок, кнопок, drawer controls, search controls и code actions.
- Уточнить hero layout:
  - чуть уменьшить maximum H1 size;
  - ослабить слишком плотный negative letter spacing;
  - сохранить live-demo-first композицию;
  - на mobile добавить нормальный `gap` и переносы в metric card с текущим цветом.
- Улучшить mobile drawer:
  - закрытие по `Escape`;
  - возврат фокуса на кнопку открытия;
  - блокировка прокрутки body, пока drawer открыт;
  - `role="dialog"`, `aria-modal="true"` и связь с заголовком drawer;
  - менее прозрачная панель, чтобы текст страницы не просвечивал.
- Стабилизировать scrollspy:
  - hash-навигация должна сразу подсвечивать точный anchor;
  - при скролле выбирать ближайший заголовок к верхней reading line, а не элемент с максимальным `intersectionRatio`.

### 2. Developer-grade code blocks

- Расширить site content model:
  - `CodeBlock` получает `copyValue?: string`;
  - добавить package-manager block с командами для `npm`, `pnpm`, `yarn`, `bun`;
  - расширить language union до `bash | css | ts | tsx | js | jsx`.
- Переписать renderer code blocks:
  - header с caption, language badge и кнопкой `Copy`;
  - copy использует `navigator.clipboard.writeText`;
  - fallback через hidden textarea;
  - button state: `Copy` -> `Copied` на короткое время;
  - ошибка копирования показывает `Retry Copy`;
  - статус объявляется через `aria-live="polite"`.
- Добавить package-manager tabs в Install:
  - default tab: `npm`;
  - выбор хранится в `localStorage` под ключом `react-color-docs-package-manager`;
  - выбранный manager применяется ко всем package-manager blocks;
  - tabs реализовать обычными keyboard-accessible buttons.
- На mobile code blocks должны оставаться читаемыми:
  - `pre` горизонтально скроллится;
  - header не ломает ширину;
  - длинные строки не растягивают `site-shell`.

### 3. Search and navigation

- Добавить локальный поиск без новых runtime dependencies.
- Индексировать:
  - section/subsection/group titles;
  - prose blocks;
  - prop names, types, defaults, descriptions;
  - picker metadata;
  - code example labels.
- Search UI:
  - desktop: поле над sidebar navigation;
  - mobile: поле внутри drawer под заголовком;
  - placeholder: `Search props, pickers, examples...`;
  - результаты показывают title, kind badge, snippet и anchor link.
- Search behavior:
  - query синхронизируется в URL как `?q=...`;
  - пустой query показывает обычную navigation;
  - клик по результату закрывает mobile drawer и переходит к anchor;
  - при 0 результатов показывать empty state с примерами `onChange`, `Sketch`, `presetColors`;
  - `/` фокусирует search, если пользователь не находится внутри input/textarea;
  - `Escape` очищает search или закрывает drawer.

### 4. API reference and Picker Gallery

- Улучшить API reference:
  - desktop остается table layout;
  - long default values сворачиваются в `Show default` / `Hide default`;
  - prop name получает direct anchor вида `#picker-specific-props-sketch-presetcolors`;
  - type/default cells используют monospaced wrapping и не ломают ширину страницы.
- Mobile API layout:
  - вместо горизонтальной таблицы показывать prop cards;
  - каждая card содержит `Prop`, `Type`, `Default`, `Description`;
  - long defaults свернуты по умолчанию.
- Добавить `Picker Gallery` перед `Component API`:
  - все публичные picker components: Alpha, Block, Chrome, Circle, Compact, Github, Google, Hue, Material, Photoshop, Sketch, Slider, Swatches, Twitter;
  - для каждого: compact live preview или статичная демонстрация, import snippet, ссылка на API props;
  - badges: `palette`, `alpha`, `slider`, `full editor`, `compact`, `customizable`;
  - gallery cards не вкладывать в другие cards.
- Добавить site-only `PickerMetadata`:
  - `id`;
  - `title`;
  - `exportName`;
  - `deepImport`;
  - `summary`;
  - `badges`;
  - `apiAnchor`.

### 5. Developer guide sections

Добавить новые разделы, которые закрывают частые вопросы пользователей библиотеки:

- `Migration from casesandberg/react-color`
  - совместимость default export/named exports;
  - deep imports;
  - CSS entrypoints;
  - что изменилось в TypeScript/tooling.
- `TypeScript Recipes`
  - controlled picker with `ColorResult`;
  - typing custom picker props;
  - typing `classNames`;
  - common event handler signatures.
- `Styling & CSS Hooks`
  - `theme="light" | "dark" | "auto"`;
  - CSS variables;
  - `className` vs `classNames`;
  - when to import CSS manually.
- `SSR & Framework Notes`
  - Next.js/Vite usage;
  - client component note for interactive pickers;
  - `renderers` + canvas note where relevant;
  - avoid direct DOM assumptions in SSR.
- `Accessibility Notes`
  - keyboard/pointer expectations;
  - labels and color inputs;
  - contrast responsibility for custom palettes;
  - custom picker helper guidance.

### 6. Content validation

- Добавить lightweight validation script для site content:
  - проверять уникальность всех generated anchors;
  - проверять, что все `apiAnchor` из gallery существуют;
  - проверять, что все публичные picker exports из `src/index.ts` представлены в gallery;
  - проверять, что внутренние ссылки вида `#...` указывают на существующие anchors.
- Подключить validation к `site:verify` перед `site:build`.
- Не генерировать public package types и не менять package entrypoints.
- Автогенерацию API reference из TypeScript типов оставить отдельной будущей работой; в этой фазе ограничиться проверкой консистентности.

## Public Interfaces / Data Shape

- Package public API не меняется.
- Site content model расширяется site-only типами:
  - richer `CodeBlock`;
  - package-manager command block;
  - `PickerMetadata`;
  - prop-level anchor generation metadata.
- URL behavior сайта расширяется:
  - hash anchors продолжают работать;
  - search query живет в `?q=...`;
  - package manager preference хранится в `localStorage`.

## Test Plan

- После каждого этапа запускать:
  - `npm run test:site`
  - `npm run site:build`
- Финальная проверка:
  - `npm run site:verify`
  - `npm run eslint`
- Добавить unit/UI tests для:
  - favicon link и skip link;
  - drawer Escape, focus return и body scroll lock;
  - exact active hash for nested anchors;
  - copy button success/error states;
  - package-manager tab switching and persistence;
  - search by `presetColors`, `onChangeComplete`, `Sketch`;
  - mobile drawer result click closes navigation;
  - all gallery picker links point to existing anchors;
  - mobile API prop cards render for narrow viewport.
- Manual browser sanity:
  - desktop 1280x720: hero, search, API reference, gallery;
  - mobile 390x844: hero metrics, drawer, search, prop cards, code blocks;
  - deep links: `#install`, `#picker-specific-props-sketch`, prop-level anchors;
  - keyboard flow: Tab, `/`, Escape, copy buttons.

## Assumptions

- Эта фаза относится к новой папке `site`, а не к legacy `docs`.
- Реализация идет по этапам, каждый этап оставляет сайт рабочим.
- Публичный API npm-пакета не меняется.
- Новые runtime dependencies не добавляются в v1.
- Текущий визуальный язык сайта сохраняется: live pickers на первом экране, светлая glass-like эстетика, accent color синхронизируется с выбранным цветом.
- Styling modernization библиотеки остается отдельной большой работой из `plans/phase-7-styling-modernization.md`.

## Todo

- [x] **quick-ux-a11y-polish** — Исправить favicon 404, добавить skip link и focus-visible состояния, отполировать hero/mobile metrics, улучшить mobile drawer и стабилизировать active anchor
- [x] **developer-code-blocks** — Добавить copyable code blocks, package-manager tabs, clipboard states, `aria-live` feedback и устойчивую mobile-верстку сниппетов
- [x] **docs-search-navigation** — Реализовать локальный поиск по секциям, props, examples и picker metadata с URL query state, desktop/mobile UI и keyboard shortcut
- [x] **api-reference-and-gallery** — Улучшить API reference для длинных defaults и mobile prop cards, добавить prop-level anchors и полноценную Picker Gallery для всех публичных пикеров
- [x] **developer-guides** — Добавить разделы Migration, TypeScript Recipes, Styling & CSS Hooks, SSR & Framework Notes и Accessibility Notes
- [x] **content-validation** — Добавлен `scripts/validate-site-content.mjs` для проверки уникальности generated anchors, валидности внутренних `#...` ссылок, существования gallery `apiAnchor` и покрытия публичных picker exports; команда `npm run site:content` подключена в `site:verify` перед `site:build`
