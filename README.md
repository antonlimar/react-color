# [React Color](http://casesandberg.github.io/react-color/)

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

- **13 Different Pickers** - Sketch, Photoshop, Chrome and many more

- **Make Your Own** - Use the building block components to make your own

## Fork development

This tree is maintained as a modernization fork. Source layout, npm export names, and agent-oriented conventions are documented in [`AGENTS.md`](AGENTS.md). Roadmap (TypeScript, toolchain, tests): [`PLAN.md`](PLAN.md). Do not edit generated `lib/` or `es/` by hand—use the build scripts from `package.json`.

**Library compatibility baseline:** published `peerDependencies.react` is `>=16.8.0`, matching the modernization track minimum documented in `AGENTS.md`.

**Local development baseline:** docs and Storybook continue to run on the newer root `devDependencies.react` / `react-dom`, because the docs app already uses `react-dom/client` and `createRoot`. Minimum React compatibility for the library itself is validated separately from the root dev environment.

**Compatibility notes:** the published API remains intentionally stable where practical, but repository internals have been modernized. In particular, runtime `propTypes` are no longer emitted, so JavaScript consumers should rely on docs and TypeScript typings rather than `prop-types` warnings during development.

**Migration log:** notable compatibility and DX decisions for the modernization fork are tracked in [`CHANGELOG.md`](CHANGELOG.md).

### Development workflow

The modernization branch now uses a TypeScript-based dual emit for package builds, Vitest for tests, Storybook 10 for component work, and Vite for docs.

| Command                            | Purpose                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `npm run build`                    | Build both published outputs: `lib/` (CJS) and `es/` (ESM).                     |
| `npm test`                         | Run Vitest test suite and ESLint.                                               |
| `npm run test:esm-cjs-consumption` | Build the package and smoke-check CJS, Node ESM, and bundler consumption paths. |
| `npm run test:watch`               | Start Vitest in watch mode.                                                     |
| `npm run eslint`                   | Lint `src`, `docs`, `scripts`, `test`, and repo tooling sources with ESLint.    |
| `npm run storybook`                | Start Storybook on port `6006`.                                                 |
| `npm run build-storybook`          | Emit the static Storybook site to `.out/`.                                      |
| `npm run docs`                     | Start the Vite-powered docs server on `http://localhost:9100/`.                 |
| `npm run typecheck`                | Run the TypeScript check for `src`, `docs`, `scripts`, and `test`.              |
| `npm run docs-dist`                | Build the docs bundle into `docs/build/`.                                       |

Published package artifacts currently expose `main` via `lib/index.js`, `module` via `es/index.js`, keep full `lib/` and `es/` trees for deep imports, and expose root typings via `index.d.ts`.

### Packaging interop notes

The package still ships the upstream-style `main`/`module` contract and intentionally does not publish an `exports` map in this fork.

- Bundlers and TypeScript toolchains that honor `module` can use root default/named imports and extensionless deep imports such as `react-color/es/Sketch` or `react-color/lib/Hue`.
- CommonJS consumers can keep using `require('react-color')` and `require('react-color/lib/...')`.
- Native Node ESM resolves the package root through `main` (`lib/index.js`), so `import reactColor from 'react-color'` yields the CommonJS namespace object; access pickers from that object (`reactColor.default`, `reactColor.SketchPicker`) rather than relying on direct named imports.
- Native Node ESM without bundler-style resolution does not guarantee extensionless deep imports from `react-color/lib/*` or `react-color/es/*` until the package adopts an explicit `exports` map, which is not part of the current packaging setup.

## Demo

![Demo](https://media.giphy.com/media/26FfggT53qE304CwE/giphy.gif)

[**Live Demo**](http://casesandberg.github.io/react-color/)

## Installation & Usage

```sh
npm install react-color --save
```

### Include the Component

```js
import React from 'react';
import { SketchPicker } from 'react-color';

function Component() {
  return <SketchPicker />;
}
```

You can import `AlphaPicker` `BlockPicker` `ChromePicker` `CirclePicker` `CompactPicker` `GithubPicker` `HuePicker` `MaterialPicker` `PhotoshopPicker` `SketchPicker` `SliderPicker` `SwatchesPicker` `TwitterPicker` respectively.

### Styling

The modernization fork now ships explicit CSS entrypoints instead of relying on default picker UI from inline `reactcss` styles.

Import the aggregate stylesheet:

```js
import 'react-color/es/styles/index.css';
```

Or import only the styles you need for a specific picker or shared primitive:

```js
import 'react-color/es/styles/pickers/sketch.css';
import 'react-color/es/styles/common/editable-input.css';
```

All public pickers keep accepting `className` on the root node and now also support `theme`, `classNames`, and CSS custom properties for styling. The legacy `styles` prop is still available as a deprecated compatibility layer for runtime inline overrides, but new customizations should prefer `classNames`, CSS variables, and the published `rc-*` BEM hooks.

### Styling migration

- Old approach: rely on default inline styles and override them with the `styles` prop.
- New approach: import the published CSS, then customize with `className`, `classNames`, `theme`, and CSS custom properties.
- Aggregate CSS (`react-color/es/styles/index.css` or `react-color/lib/styles/index.css`) is optional convenience only; consumers can keep bundle size tighter with granular picker-level imports.

[license-image]: http://img.shields.io/npm/l/react-color.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-color.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-color
[npm-version-image]: https://img.shields.io/npm/v/react-color.svg
[npm-version-url]: https://www.npmjs.com/package/react-color
