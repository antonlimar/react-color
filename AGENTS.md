# Context for Agents and Contributors

## Repository Purpose

This is a maintained fork of `react-color`, published as `react-color-x`: the library has been modernized, runs on a TypeScript-compatible stack, has up-to-date build/tests/Storybook/docs, and preserves public API compatibility where possible.

`AGENTS.md` stores only current and long-lived rules.

## Directory Map

| Path          | Purpose                                                   |
| ------------- | --------------------------------------------------------- |
| `src/`        | Library source code, public exports, components, helpers. |
| `.storybook/` | Storybook configuration.                                  |
| `site/`       | Current GitHub Pages documentation site.                  |
| `test/`       | Tests and test helpers.                                   |
| `scripts/`    | Build, validation, and repo tooling scripts.              |

Do not edit generated artifacts `es/`, `.out/`, or `site/dist/` manually.

## Main Commands

| Command                   | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `npm run test:unit`       | Unit/UI tests only, via Vitest.                       |
| `npm run eslint`          | Repository linting.                                   |
| `npm run typecheck`       | TypeScript check without emit.                        |
| `npm run build`           | Full ESM package build into `es/`.                    |
| `npm run storybook`       | Dev Storybook at `http://localhost:6006/`.            |
| `npm run build-storybook` | Static Storybook build into `.out/`.                  |
| `npm run site:dev`        | Documentation dev server at `http://localhost:4173/`. |
| `npm run site:build`      | Production documentation build into `site/dist/`.     |
| `npm run site:verify`     | Validate site tests, build, and metadata.             |

## Public API

Entry point: [`src/index.ts`](src/index.ts).

The primary supported import style is named exports from the package root.
Do not promote default imports in new documentation or examples; if they remain in code, treat them as legacy compatibility.

Named picker exports:
`AlphaPicker`, `BlockPicker`, `CirclePicker`, `ChromePicker`, `CompactPicker`, `GithubPicker`, `HuePicker`, `MaterialPicker`, `PhotoshopPicker`, `SketchPicker`, `SliderPicker`, `SwatchesPicker`, `TwitterPicker`, `GooglePicker`.

Named shared exports:
`CustomPicker`, `Alpha`, `Checkboard`, `EditableInput`, `Hue`, `Raised`, `Saturation`, `Swatch`.

Rules:

- do not rename or remove these exports without a major release;
- do not break deep imports or the `es/` publishing structure without an explicit decision;
- treat changes to `main` / `module` / `types` / `exports` as high risk and make them only deliberately.

## Current Project State

- the library and tooling have already been moved to a TypeScript-compatible stack;
- the test stack is Vitest + Testing Library + jsdom;
- the documentation site in `site/` and Storybook run on a modern pipeline;
- `peerDependencies.react` targets compatibility with React `>=18.3.1`;

## Working Agreements

- Change only what is needed for the current task; do not do unrelated refactoring.
- Runtime compatibility matters more than cosmetic improvements.
- If public behavior, types, or the packaging contract changes, synchronize that with `README.md`.
- Prefer targeted changes in the existing code style.
- Do not replace the current styling system wholesale as part of an incidental task.
- For current documentation of third-party libraries and tools, prefer Context7 over model memory.

## Tests

- Write new and rewritten tests as `*.spec.ts` / `*.spec.tsx`.
- Prefer Testing Library patterns and user scenarios over implementation-detail tests.
- Preserve behavioral checks when refactoring.
