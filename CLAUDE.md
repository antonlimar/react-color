# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`AGENTS.md` (imported above) is the source of truth for repository purpose, the public API export list, working agreements, and the main command table. This file only adds what AGENTS.md does not cover.

## Commands

- Single test file: `npx vitest run -c vitest.config.ts src/components/sketch/spec.tsx`
- Single test by name: add `-t "<test name>"`; watch mode: `npm run test:watch`
- Full lint (ESLint + Stylelint for `*.scss`): `npm run lint`; formatting: `npm run format:check`
- Visual regression: `npm run test:visual` runs picker screenshots (Vitest browser mode + Playwright, `test/visual/pickers.visual.spec.tsx`) and then docs-site screenshots (`scripts/site-visual-tests.mjs`, pixelmatch, light/dark). Baselines live in `test/visual/__screenshots__` (site ones in `.../site`). Refresh with `npm run test:visual:update`
- Public typings smoke test against the built `es/` (fixtures in `test/public-types`): `npm run test:public-types`; ESM consumption smoke test: `npm run test:esm-consumption`
- Site tests: `npm run test:site` runs only `site/src/App.spec.tsx`
- CI (`.github/workflows/ci.yml`) runs in this order: `test:unit` → `lint` → `build` → `test:public-types` → `build-storybook` → `typecheck` → `site:verify` → `ci:artifacts` → `npm pack --dry-run`. Node 24.
- A husky pre-commit hook runs `lint-staged`: `eslint --fix --max-warnings=0` on JS/TS, `stylelint` on `*.scss`, and `prettier --write` on staged files. ESLint warnings fail the commit.

## Test layout gotcha

`vitest.config.ts` only collects `src/**/spec.{ts,tsx}` (one `spec.tsx` per component folder, next to `story.tsx` and `__snapshots__/`) and `site/src/**/*.spec.{ts,tsx}`. A file named `Foo.spec.tsx` under `src/` will **not** be picked up. Add library tests to the existing `spec.tsx` in the component folder, or update the `include` glob on purpose. Shared test helpers are in `test/helpers.ts`, and global setup is in `test/vitest.setup.ts`.

Path aliases (in Vitest and TS): `@/` → `src/`, `@test/` → `test/`, `@storybook-utils/` → `.storybook/`, and `@antonlimar/react-color` → `src/index.ts` (the site and stories import the package name and get the source).

## Architecture

**Picker pattern.** Each picker lives in `src/components/<name>/` with an inner `<Name>/<Name>.tsx` + `<Name>.scss` and optional sub-parts (for example `SketchFields`, `SketchPresetColors`). A picker is a presentational `XBase` component wrapped with `ColorWrap` (`src/components/common/ColorWrap`, publicly exported as `CustomPicker`). `ColorWrap` owns color state. It normalizes the `color` prop into `{hex, rgb, hsl, hsv, oldHue, source}` via `toState` in `src/helpers/color.ts` (tinycolor2), resyncs when the `color` prop changes, calls `onChange` on every change, and calls `onChangeComplete` debounced at 100ms. Pickers get those injected props (`ColorPickerInjectedProps` in `src/types.ts`). Low-level controls (`Saturation`, `Hue`, `Alpha`, `EditableInput`, `Swatch`, `Checkboard`, `Raised`) in `src/components/common/` are reused across pickers. Pointer math lives in `src/helpers/{saturation,hue,alpha}.ts`.

**Styling system.** This replaced upstream's inline `reactcss`, so don't swap it out:

- Component-scoped SCSS, one file per component, imported as a side effect (`import './Sketch.scss'`).
- BEM class names with an `rc-` namespace come from `bem('<block>')` in `src/components/common/styleArchitecture.ts`. The block registry there is the canonical list of public CSS hooks.
- Theming uses CSS custom properties (`--rc-picker-*`) defined by the `rc-apply-theme` mixin in `src/styles/_theme-tokens.scss`. The `theme` prop takes `light | dark | auto`, where `auto` adds `data-theme="auto"` via `getThemeDataAttributes`.
- The legacy `styles` prop (including the old `styles.default.<slot>` shape) is still supported. `getDeprecatedStyleOverride` / `getSlotStyleOverride` in `styleOverrides.ts` map it to per-slot inline styles. Each picker declares its known slots, for example `SKETCH_STYLE_SLOTS`. New customization should use `className` / `classNames` / CSS variables.

**Build pipeline** (`npm run build`, output in `es/`, gitignored):

1. `tsc -p tsconfig.es.json` emits JS + `.d.ts`.
2. `scripts/build-styles.mjs` compiles every non-partial `.scss` under `src/components` to a matching `.css` in `es/components`.
3. `scripts/attach-picker-style-imports.mjs` rewrites `import './X.scss'` to `import './X.css'` in the JS and strips it from `.d.ts`.
4. `scripts/rewrite-esm-import-specifiers.mjs` makes relative ESM specifiers Node-resolvable.

The root `index.d.ts` re-exports from `es/`. The package is ESM-only with no CommonJS or `lib/`. `sideEffects: ["**/*.css"]` must keep CSS from being tree-shaken. `npm run ci:artifacts` rebuilds `es/` and Storybook and fails if generated output or `package-lock.json` drift.

**Docs site** (`site/`, Vite + React + TanStack Router, React Compiler via Babel). Content comes from structured data in `site/src/content/siteContent.ts` (`pickerMetadata`, `siteSections`). `scripts/validate-site-content.mjs` validates it. `scripts/generate-llms-docs.mjs` parses it and generates `llms.txt` / `llms-full.txt` through a Vite plugin in `vite.site.config.ts`, so keep `siteContent.ts` exports as plain literals the script can statically read. The site renders pickers from source through the package-name alias.

**Storybook**: every component folder has a `story.tsx`, and shared story helpers are in `.storybook/` (`renderPickerStory.js`, `SyncColorField.js`).
