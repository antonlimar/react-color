# [React Color X](https://antonlimar.github.io/react-color-x/)

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

- **14 Different Pickers** - Sketch, Photoshop, Chrome, Google and many more

- **Make Your Own** - Use the building block components to make your own

## Fork development

This tree is maintained as a modernization fork. Source layout, npm export names, and agent-oriented conventions are documented in [`AGENTS.md`](AGENTS.md). Do not edit generated `es/` by hand; use the build scripts from `package.json`.

**Library compatibility baseline:** published `peerDependencies.react` is `>=18.3.1`, matching the modernization track minimum documented in `AGENTS.md`.

**Local development baseline:** the documentation site and Storybook run on the newer root `devDependencies.react` / `react-dom`. Minimum React compatibility for the library itself is validated separately from the root dev environment.

**Compatibility notes:** the published API remains intentionally stable where practical, but repository internals have been modernized. In particular, runtime `propTypes` are no longer emitted, so JavaScript consumers should rely on docs and TypeScript typings rather than `prop-types` warnings during development.

### Development workflow

The modernization branch now uses a TypeScript-based ESM emit for package builds, Vitest for tests, Storybook 10 for component work, and Vite for the GitHub Pages documentation site in `site/`.

| Command                        | Purpose                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `npm run build`                | Build the published ESM output in `es/`.                                        |
| `npm run test:unit`            | Run the unit/UI test suite through Vitest.                                      |
| `npm run test:site`            | Run the dedicated site interaction tests for navigation and shared color state. |
| `npm run test:esm-consumption` | Build the package and smoke-check Node ESM and bundler consumption paths.       |
| `npm run test:watch`           | Start Vitest in watch mode.                                                     |
| `npm run eslint`               | Lint `src`, `site`, `scripts`, `test`, and repo tooling sources with ESLint.    |
| `npm run storybook`            | Start Storybook on port `6006`.                                                 |
| `npm run build-storybook`      | Emit the static Storybook site to `.out/`.                                      |
| `npm run site:dev`             | Start the GitHub Pages documentation site on `http://localhost:4173/`.          |
| `npm run site:build`           | Build the GitHub Pages documentation site into `site/dist/`.                    |
| `npm run site:verify`          | Run site interaction tests, build the Pages app, and verify metadata/output.    |
| `npm run typecheck`            | Run the TypeScript check for `src`, `site`, `scripts`, and `test`.              |

Published package artifacts are ESM-only. The package exposes `main` and `module` via `es/index.js` and exposes root typings via `index.d.ts`.

### Packaging interop notes

The package ships an ESM-only `main`/`module` contract and an `exports` map for the root entry and shared common components. Generated component-local CSS artifacts are published under `es/components` and are pulled in by the component modules that need them.

- Bundlers and TypeScript toolchains should use root named imports such as `import { SketchPicker } from 'react-color-x'`.
- Native Node ESM can resolve the root entry through the package `exports` map; plain Node execution still needs a CSS-aware loader because picker component modules import CSS side effects.
- CommonJS `require('react-color-x')` and `require('react-color-x/lib/...')` are no longer supported.

## Demo

![Demo](https://media.giphy.com/media/26FfggT53qE304CwE/giphy.gif)

[**Live Demo**](https://antonlimar.github.io/react-color-x/)

## Installation & Usage

```sh
npm install react-color-x --save
```

### Include the Component

```js
import { SketchPicker } from 'react-color-x';

function Component() {
  return <SketchPicker />;
}
```

You can import `AlphaPicker` `BlockPicker` `ChromePicker` `CirclePicker` `CompactPicker` `GithubPicker` `GooglePicker` `HuePicker` `MaterialPicker` `PhotoshopPicker` `SketchPicker` `SliderPicker` `SwatchesPicker` `TwitterPicker` respectively.

### Styling

The modernization fork ships component-scoped CSS automatically with each component entrypoint instead of relying on default picker UI from inline `reactcss` styles.

Root picker and shared primitive imports include the CSS they need.

All public pickers keep accepting `className` on the root node and still support the `styles` prop for runtime inline overrides. They now also support `theme`, `classNames`, and CSS custom properties for styling; new customizations should prefer `classNames`, CSS variables, and the published `rc-*` BEM hooks when possible.

[license-image]: http://img.shields.io/npm/l/react-color-x.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-color-x.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-color-x
[npm-version-image]: https://img.shields.io/npm/v/react-color-x.svg
[npm-version-url]: https://www.npmjs.com/package/react-color-x
