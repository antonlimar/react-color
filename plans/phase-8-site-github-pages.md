---
name: Phase 8 site and GitHub Pages
overview: Собрать новый одностраничный сайт в `site/` с современным адаптивным дизайном, синхронизированными live-picker демо, структурированными docs-секциями и автоматическим деплоем на GitHub Pages.
status: proposed
todos:
  - id: site-scaffold-and-build
    content: Создать standalone Vite-приложение в `site/`, настроить entrypoints, tsconfig, scripts и production build с корректным GitHub Pages base path
    status: completed
  - id: hero-live-pickers
    content: Реализовать hero-блок с современным адаптивным layout, общей color state-моделью, синхронизацией всех visible pickers и динамическим фоном секции
    status: completed
  - id: content-model-and-migration
    content: Вынести контент About Getting Started Component API Create Your Own в typed content-слой внутри `site/src/content` и перенести актуальные тексты из `docs/documentation`
    status: proposed
  - id: component-api-reference
    content: Построить раздел Component API с подразделами для общих props `color`, `onChange`, `onChangeComplete` и picker-specific API на основе структурированных данных
    status: proposed
  - id: responsive-anchor-navigation
    content: Реализовать desktop sticky sidebar navigation для блоков 2-5 и mobile drawer navigation с якорями, active-state подсветкой и корректным scroll behavior
    status: proposed
  - id: visual-design-system
    content: Собрать отдельную site-only styling систему с выразительной типографикой, адаптивной сеткой, CSS custom properties и изолированными стилями внутри `site/` без затрагивания styling internals библиотеки
    status: proposed
  - id: pages-deployment-and-ci
    content: Добавить GitHub Actions workflow для сборки `site/` и автоматического деплоя на GitHub Pages отдельно от package build/publish pipeline
    status: proposed
  - id: docs-metadata-and-verification
    content: Обновить README homepage/site references и добавить проверки сборки, responsive behavior, anchor navigation и shared-color interaction в локальную верификацию и CI
    status: proposed
---

# New GitHub Pages Site in `site/`

## Summary

Build a new single-page marketing/docs site as a separate app in `site/`, using `React + TypeScript + Vite` with plain CSS modules or scoped CSS files plus CSS custom properties for theming. This fits the repo well because Vite is already in use, React is already the runtime, and it keeps the site isolated from the package build while still letting us import the local library source for live pickers.

The new site will fully replace the current `docs/` site as the project website. Content will default to English. On desktop, sections 2-5 use a left-side anchor nav; on mobile, that nav becomes a drawer toggle. GitHub Pages deployment will be automated via GitHub Actions.

## Implementation Changes

- Create a standalone Vite app in `site/` with its own entry HTML, TS config extension, and build config.
- Configure the site build for GitHub Pages with a repo-aware `base` path so it works at `/react-color/` without hardcoded local assumptions.
- Add top-level site sections:
  1. Hero section with synchronized live pickers and background color driven by shared state.
  2. `About`
  3. `Getting Started`
  4. `Component API`
  5. `Create Your Own`
- Reuse the existing library directly from local source during site development/build so all picker demos are real and stay in sync with the package.
- Rebuild the hero visually instead of copying the old docs layout:
  - layered gradient/background treatment
  - card-based picker composition
  - responsive masonry/grid arrangement
  - one shared color state reflected in all visible pickers and the section background
- Build the docs content as structured data in `site/src/content`:
  - main sections for `About`, `Getting Started`, `Create Your Own`
  - common API subsection entries for `color`, `onChange`, `onChangeComplete`
  - per-picker API entries for every public picker we decide to document on the site
- Prefer migrating existing markdown/doc text into a cleaner content layer rather than rendering old `docs/` pages directly. Reuse wording where it is still accurate, but normalize structure for the new layout.
- Implement the `Component API` block as one section with internal subsections:
  - common props
  - picker-specific APIs
  - anchor ids generated from content metadata for deep links and side navigation
- Build the left nav as a sticky desktop sidebar for blocks 2-5 and a drawer on mobile. The nav should highlight the active section/subsection based on scroll position.
- Keep the site styling isolated from package styling modernization work:
  - do not migrate package internals away from current styling as part of this task
  - site styles live entirely under `site/`
- Add npm scripts for site development/build, for example:
  - `site:dev`
  - `site:build`
  - `site:preview`
- Update repo docs and metadata where needed:
  - README website link
  - package `homepage` if we want it to point to the new Pages URL
  - remove or de-emphasize old `docs/` site workflow references once replacement is complete

## Public Interfaces / Data Shape

- No package runtime API changes are planned.
- Add a site-only content model, likely a typed structure like:
  - section id
  - title
  - optional description/lead
  - optional code samples
  - optional API table rows
  - optional nested subsection list
- Add a site-only picker API metadata source so the API section is rendered from data rather than hardcoded JSX blocks.

## Test Plan

- Verify the new site builds successfully in CI and locally.
- Verify responsive behavior at desktop, tablet, and mobile widths.
- Verify synchronized picker behavior:
  - changing one picker updates the shared color
  - other pickers reflect the same color
  - hero background updates accordingly
- Verify anchor navigation:
  - desktop sticky nav links jump correctly
  - mobile drawer links close and navigate correctly
  - active section state updates while scrolling
- Verify GitHub Pages output works under the repository base path, not only at `/`.
- Add at least one lightweight UI test for nav behavior and one for shared color synchronization if practical in the current test stack.

## Deployment

- Add a dedicated GitHub Actions workflow for Pages:
  - trigger on pushes to the main branch
  - install dependencies
  - build the site from `site/`
  - upload Pages artifact
  - deploy via GitHub Pages actions
- Keep Pages deployment separate from npm package publishing and from package artifact generation.

## Assumptions

- `site/` becomes the canonical project website and replaces the current `docs/` site for GitHub Pages purposes.
- English is the default content language for the whole site.
- Mobile navigation uses a drawer, not an always-visible sticky sidebar.
- The recommended stack is `React + TypeScript + Vite` with local typed content modules and CSS modules/plain scoped CSS, because it matches the repo, keeps maintenance low, and is the cleanest path for GitHub Pages.
- We will preserve package/public API behavior and treat this as a website project, not a styling modernization of the library itself.

## Todo

- [x] **site-scaffold-and-build** — Создать standalone Vite-приложение в `site/`, настроить entrypoints, `tsconfig`, scripts и production build с корректным GitHub Pages base path
- [x] **hero-live-pickers** — Реализовать hero-блок с современным адаптивным layout, общей color state-моделью, синхронизацией всех visible pickers и динамическим фоном секции
- [ ] **content-model-and-migration** — Вынести контент `About`, `Getting Started`, `Component API`, `Create Your Own` в typed content-слой внутри `site/src/content` и перенести актуальные тексты из `docs/documentation`
- [ ] **component-api-reference** — Построить раздел `Component API` с подразделами для общих props `color`, `onChange`, `onChangeComplete` и picker-specific API на основе структурированных данных
- [ ] **responsive-anchor-navigation** — Реализовать desktop sticky sidebar navigation для блоков 2-5 и mobile drawer navigation с якорями, active-state подсветкой и корректным scroll behavior
- [ ] **visual-design-system** — Собрать отдельную site-only styling систему с выразительной типографикой, адаптивной сеткой, CSS custom properties и изолированными стилями внутри `site/` без затрагивания styling internals библиотеки
- [ ] **pages-deployment-and-ci** — Добавить GitHub Actions workflow для сборки `site/` и автоматического деплоя на GitHub Pages отдельно от package build/publish pipeline
- [ ] **docs-metadata-and-verification** — Обновить README, `homepage`/site references и добавить проверки сборки, responsive behavior, anchor navigation и shared-color interaction в локальную верификацию и CI
