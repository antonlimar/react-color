# [React Color](http://casesandberg.github.io/react-color/)

[![Npm Version][npm-version-image]][npm-version-url]
[![Build Status][travis-svg]][travis-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

* **13 Different Pickers** - Sketch, Photoshop, Chrome and many more

* **Make Your Own** - Use the building block components to make your own

## Fork development

This tree is maintained as a modernization fork. Source layout, npm export names, and agent-oriented conventions are documented in [`AGENTS.md`](AGENTS.md). Roadmap (TypeScript, toolchain, tests): [`PLAN.md`](PLAN.md). Do not edit generated `lib/` or `es/` by hand—use the build scripts from `package.json`.

## Demo

![Demo](https://media.giphy.com/media/26FfggT53qE304CwE/giphy.gif)

[**Live Demo**](http://casesandberg.github.io/react-color/)

## Installation & Usage

```sh
npm install react-color --save
```

### Include the Component

```js
import React from 'react'
import { SketchPicker } from 'react-color'

class Component extends React.Component {

  render() {
    return <SketchPicker />
  }
}
```
You can import `AlphaPicker` `BlockPicker` `ChromePicker` `CirclePicker` `CompactPicker` `GithubPicker` `HuePicker` `MaterialPicker` `PhotoshopPicker` `SketchPicker` `SliderPicker` `SwatchesPicker` `TwitterPicker` respectively.

> 100% inline styles via [ReactCSS](http://reactcss.com/)

[travis-svg]: https://travis-ci.org/casesandberg/react-color.svg
[travis-url]: https://travis-ci.org/casesandberg/react-color
[license-image]: http://img.shields.io/npm/l/react-color.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-color.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-color
[npm-version-image]: https://img.shields.io/npm/v/react-color.svg
[npm-version-url]: https://www.npmjs.com/package/react-color
