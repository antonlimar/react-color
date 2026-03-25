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

**Compatibility notes:** the published API stays drop-in compatible with upstream `react-color`, but repository internals have been modernized. In particular, runtime `propTypes` are no longer emitted, so JavaScript consumers should rely on docs and TypeScript typings rather than `prop-types` warnings during development.

**Migration log:** notable compatibility and DX decisions for the modernization fork are tracked in [`CHANGELOG.md`](CHANGELOG.md).

### Development workflow

The modernization branch now uses a TypeScript-based dual emit for package builds, Vitest for tests, Storybook 10 for component work, and Vite for docs.

| Command                   | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `npm run build`           | Build both published outputs: `lib/` (CJS) and `es/` (ESM).                  |
| `npm test`                | Run Vitest test suite and ESLint.                                            |
| `npm run test:watch`      | Start Vitest in watch mode.                                                  |
| `npm run eslint`          | Lint `src`, `docs`, `scripts`, `test`, and repo tooling sources with ESLint. |
| `npm run storybook`       | Start Storybook on port `6006`.                                              |
| `npm run build-storybook` | Emit the static Storybook site to `.out/`.                                   |
| `npm run docs`            | Start the Vite-powered docs server on `http://localhost:9100/`.              |
| `npm run typecheck`       | Run the TypeScript check for `src`, `docs`, `scripts`, and `test`.           |
| `npm run docs:typecheck`  | Compatibility alias for the shared TypeScript check.                         |
| `npm run docs-dist`       | Build the docs bundle into `docs/build/`.                                    |

Published package artifacts stay drop-in compatible with upstream expectations: `main` points to `lib/index.js`, `module` points to `es/index.js`, full `lib/` and `es/` trees remain in the package for deep imports, and root typings are exposed via `index.d.ts`.

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

class Component extends React.Component {
  render() {
    return <SketchPicker />;
  }
}
```

You can import `AlphaPicker` `BlockPicker` `ChromePicker` `CirclePicker` `CompactPicker` `GithubPicker` `HuePicker` `MaterialPicker` `PhotoshopPicker` `SketchPicker` `SliderPicker` `SwatchesPicker` `TwitterPicker` respectively.

> 100% inline styles via [ReactCSS](http://reactcss.com/)

[license-image]: http://img.shields.io/npm/l/react-color.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-color.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-color
[npm-version-image]: https://img.shields.io/npm/v/react-color.svg
[npm-version-url]: https://www.npmjs.com/package/react-color
