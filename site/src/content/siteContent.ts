import type { ContentSection } from './types';

export const siteSections: readonly ContentSection[] = [
  {
    id: 'about',
    order: 1,
    title: 'About',
    intro: 'A compact summary of what react-color ships and why the package still matters.',
    blocks: [
      {
        type: 'bullets',
        items: [
          '13 Different Pickers - Sketch, Photoshop, Chrome and many more',
          'Make Your Own - Use the building block components to make your own',
        ],
      },
    ],
  },
  {
    id: 'getting-started',
    order: 2,
    title: 'Getting Started',
    intro: 'Installation and usage guidance from the current documentation, carried into a typed content layer.',
    blocks: [],
    subsections: [
      {
        id: 'install',
        title: 'Install',
        intro: 'Start by installing react-color via npm.',
        blocks: [
          {
            type: 'code',
            language: 'bash',
            code: 'npm install react-color --save',
          },
          {
            type: 'text',
            text: 'Picker entrypoints now import their own published CSS automatically, so normal usage does not need any extra setup.',
          },
          {
            type: 'code',
            language: 'tsx',
            code: "import { SketchPicker } from 'react-color'\n",
            label: 'Basic import',
          },
          {
            type: 'text',
            text: 'Published CSS entrypoints remain available when you want the full stylesheet up front or when you build custom pickers from the shared primitives.',
          },
          {
            type: 'code',
            language: 'tsx',
            code: "import 'react-color/es/styles/pickers/sketch.css'\nimport 'react-color/es/styles/common/editable-input.css'\n",
            label: 'Optional CSS imports',
          },
        ],
      },
      {
        id: 'include-component',
        title: 'Include Component',
        intro:
          'Import a picker from react-color at the top of your component and render it like any other React component.',
        blocks: [
          {
            type: 'code',
            language: 'tsx',
            code: "import React from 'react';\nimport { SketchPicker } from 'react-color';\n\nfunction Component() {\n  return <SketchPicker theme=\"auto\" />;\n}\n",
            label: 'Inline usage',
          },
          {
            type: 'text',
            text: 'The documented named pickers are AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, GooglePicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, and TwitterPicker.',
          },
          {
            type: 'text',
            text: 'You can also import a picker individually to optimize bundle size, while still keeping the public API stable for existing integrations.',
          },
          {
            type: 'code',
            language: 'tsx',
            code: "import SketchPicker from 'react-color/lib/Sketch';\nimport ChromePicker from 'react-color/lib/Chrome';\n",
            label: 'Individual picker imports',
          },
          {
            type: 'text',
            text: 'Styling is driven by published CSS entrypoints and public class hooks. Picker entrypoints import their own CSS automatically, and you can customize the result with className, classNames, theme, and CSS custom properties.',
          },
        ],
      },
    ],
  },
  {
    id: 'component-api',
    order: 3,
    title: 'Component API',
    intro: 'The API reference is split into common color props, picker-specific props, and styling migration guidance.',
    blocks: [],
    subsections: [
      {
        id: 'common-props',
        title: 'Common Props',
        intro:
          'These props are shared by the main public pickers and define how color state moves through the component tree.',
        propertyGroups: [
          {
            title: 'Shared color props',
            properties: [
              {
                name: 'color',
                type: 'string | rgb object | hsl object | transparent',
                description:
                  'Controls the active color on the picker. Use it to initialize the picker or keep it in sync with parent state.',
              },
              {
                name: 'onChange',
                type: '(color, event) => void',
                description:
                  'Called every time the color changes. Use it to store state in a parent component or derive other transformations.',
              },
              {
                name: 'onChangeComplete',
                type: '(color, event) => void',
                description: 'Called once a color change is complete.',
              },
            ],
          },
        ],
      },
      {
        id: 'picker-specific-props',
        title: 'Picker-Specific Props',
        intro:
          'The individual picker APIs stay intentionally small and map closely to the docs that shipped with the library.',
        propertyGroups: [
          {
            title: 'Alpha',
            properties: [
              { name: 'width', type: 'string', defaultValue: '316px', description: 'Pixel value for picker width.' },
              { name: 'height', type: 'string', defaultValue: '16px', description: 'Pixel value for picker height.' },
              {
                name: 'direction',
                type: 'horizontal | vertical',
                defaultValue: 'horizontal',
                description: 'Display direction for the slider.',
              },
              {
                name: 'renderers',
                type: 'object',
                description: 'Use { canvas: Canvas } with node canvas to do SSR.',
              },
              { name: 'pointer', type: 'React component', description: 'Custom pointer component.' },
            ],
          },
          {
            title: 'Block',
            properties: [
              { name: 'width', type: 'string', defaultValue: '170px', description: 'Pixel value for picker width.' },
              {
                name: 'colors',
                type: 'string[]',
                defaultValue:
                  "['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']",
                description: 'Color squares to display.',
              },
              {
                name: 'triangle',
                type: 'hide | top',
                defaultValue: 'top',
                description: 'Controls the triangle marker.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Chrome',
            properties: [
              {
                name: 'disableAlpha',
                type: 'bool',
                defaultValue: 'false',
                description: 'Remove alpha slider and options.',
              },
              {
                name: 'renderers',
                type: 'object',
                description: 'Use { canvas: Canvas } with node canvas to do SSR.',
              },
            ],
          },
          {
            title: 'Circle',
            properties: [
              { name: 'width', type: 'string', defaultValue: '252px', description: 'Pixel value for picker width.' },
              {
                name: 'colors',
                type: 'string[]',
                defaultValue:
                  '["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]',
                description: 'Color squares to display.',
              },
              { name: 'circleSize', type: 'number', defaultValue: '28', description: 'Value for circle size.' },
              {
                name: 'circleSpacing',
                type: 'number',
                defaultValue: '14',
                description: 'Value for spacing between circles.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Compact',
            properties: [
              {
                name: 'colors',
                type: 'string[]',
                defaultValue:
                  "['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E']",
                description: 'Color squares to display.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Github',
            properties: [
              { name: 'width', type: 'string', defaultValue: '200px', description: 'Pixel value for picker width.' },
              {
                name: 'colors',
                type: 'string[]',
                defaultValue:
                  "['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']",
                description: 'Color squares to display.',
              },
              {
                name: 'triangle',
                type: 'hide | top-left | top-right',
                defaultValue: 'top-left',
                description: 'Controls the triangle placement.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Hue',
            properties: [
              { name: 'width', type: 'string', defaultValue: '316px', description: 'Pixel value for picker width.' },
              { name: 'height', type: 'string', defaultValue: '16px', description: 'Pixel value for picker height.' },
              {
                name: 'direction',
                type: 'horizontal | vertical',
                defaultValue: 'horizontal',
                description: 'Display direction for the slider.',
              },
              { name: 'pointer', type: 'React component', description: 'Custom pointer component.' },
            ],
          },
          {
            title: 'Photoshop',
            properties: [
              {
                name: 'header',
                type: 'string',
                defaultValue: 'Color Picker',
                description: 'Title text shown in the header.',
              },
              { name: 'onAccept', type: 'function', description: 'Callback for when accept is clicked.' },
              { name: 'onCancel', type: 'function', description: 'Callback for when cancel is clicked.' },
            ],
          },
          {
            title: 'Sketch',
            properties: [
              {
                name: 'disableAlpha',
                type: 'bool',
                defaultValue: 'false',
                description: 'Remove alpha slider and options.',
              },
              {
                name: 'presetColors',
                type: 'array',
                defaultValue:
                  "['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']",
                description: 'Hex strings for default colors at the bottom of the picker.',
              },
              { name: 'width', type: 'number', defaultValue: '200', description: 'Width of picker.' },
              {
                name: 'renderers',
                type: 'object',
                description: 'Use { canvas: Canvas } with node canvas to do SSR.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Slider',
            properties: [{ name: 'pointer', type: 'React component', description: 'Custom pointer component.' }],
          },
          {
            title: 'Swatches',
            properties: [
              { name: 'width', type: 'number', defaultValue: '320', description: 'Pixel value for picker width.' },
              { name: 'height', type: 'number', defaultValue: '240', description: 'Pixel value for picker height.' },
              {
                name: 'colors',
                type: 'string[][]',
                description: 'An array of color groups, each with an array of colors.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
          {
            title: 'Twitter',
            properties: [
              { name: 'width', type: 'string', defaultValue: '276px', description: 'Pixel value for picker width.' },
              {
                name: 'colors',
                type: 'string[]',
                defaultValue:
                  "['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']",
                description: 'Color squares to display.',
              },
              {
                name: 'triangle',
                type: 'hide | top-left | top-right',
                defaultValue: 'top-left',
                description: 'Controls the triangle placement.',
              },
              {
                name: 'onSwatchHover',
                type: '(color, event) => void',
                description: 'Hover handler for the Swatch elements inside the component.',
              },
            ],
          },
        ],
      },
      {
        id: 'styling',
        title: 'Styling Migration',
        intro: 'The current docs emphasize the newer styling surface and keep legacy inline styles only as a bridge.',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Picker entrypoints now import their own published CSS automatically.',
              'Use theme="light" | "dark" | "auto" to switch built-in token sets.',
              'Use className and classNames to attach custom classes to supported slots.',
              'Override CSS custom properties for token-level tweaks.',
              'Import published CSS entrypoints manually only when you need aggregate CSS or shared primitive styles.',
              'Keep styles only for legacy inline compatibility when migrating existing code.',
            ],
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Theme and classNames',
            code: "import React from 'react'\nimport { SketchPicker } from 'react-color'\n\nexport default function Component() {\n  return (\n    <SketchPicker\n      theme=\"dark\"\n      className=\"profile-color-picker\"\n      classNames={{\n        root: 'profile-color-picker__root',\n        body: 'profile-color-picker__body',\n        controls: 'profile-color-picker__controls',\n        swatch: 'profile-color-picker__swatch',\n      }}\n    />\n  )\n}\n",
          },
          {
            type: 'code',
            language: 'css',
            label: 'CSS variables',
            code: '.profile-color-picker__root {\n  --rc-color-surface: #101418;\n  --rc-color-surface-elevated: #161b22;\n  --rc-color-border: #2f3843;\n  --rc-color-text: #f3f6fb;\n  --rc-color-shadow: 0 16px 40px rgb(0 0 0 / 0.35);\n}\n',
          },
        ],
      },
    ],
  },
  {
    id: 'create-your-own',
    order: 4,
    title: 'Create Your Own',
    intro: 'The custom picker docs stay centered on CustomPicker plus the helper components that build up the UI.',
    blocks: [],
    subsections: [
      {
        id: 'parent-component',
        title: 'Parent Component',
        intro:
          'To make a custom color picker, create a top-level component and wrap it with the CustomPicker higher-order component.',
        blocks: [
          {
            type: 'code',
            language: 'tsx',
            label: 'CustomPicker bridge',
            code: "import React from 'react';\nimport { CustomPicker } from 'react-color';\n\nfunction MyColorPicker() {\n  return <div>MyColorPicker</div>;\n}\n\nexport default CustomPicker(MyColorPicker);\n",
          },
          {
            type: 'text',
            text: 'The wrapped component receives hex, rgb and hsl values for the current color, plus an onChange prop that should propagate the new color back up.',
          },
        ],
      },
      {
        id: 'helper-components',
        title: 'Helper Components',
        intro: 'The helper components are the building blocks for custom pickers and reusable editor primitives.',
        propertyGroups: [
          {
            title: 'Alpha',
            properties: [
              {
                name: '...this.props',
                type: 'spread',
                description: 'Pass down all color props from the top-most component.',
              },
              { name: 'pointer', type: 'React component', description: 'Custom slider pointer.' },
              { name: 'onChange', type: 'function', description: 'Call the parent onChange function.' },
            ],
          },
          {
            title: 'EditableInput',
            properties: [
              { name: 'label', type: 'string', description: 'Label shown on the input.' },
              { name: 'value', type: 'string | number', description: 'Value passed down to the input.' },
              {
                name: 'onChange',
                type: 'function',
                description: 'Returns an object where the key is the label and the value is the new value.',
              },
              { name: 'style', type: 'object', description: 'Inline styles for wrap, input and label.' },
            ],
          },
          {
            title: 'Hue',
            properties: [
              {
                name: '...this.props',
                type: 'spread',
                description: 'Pass down all color props from the top-most component.',
              },
              { name: 'pointer', type: 'React component', description: 'Custom slider pointer.' },
              { name: 'onChange', type: 'function', description: 'Call the parent onChange function.' },
              { name: 'direction', type: 'horizontal | vertical', description: 'Direction of the slider.' },
            ],
          },
          {
            title: 'Saturation',
            properties: [
              {
                name: '...this.props',
                type: 'spread',
                description: 'Pass down all color props from the top-most component.',
              },
              { name: 'pointer', type: 'React component', description: 'Custom pointer component.' },
              { name: 'onChange', type: 'function', description: 'Call the parent onChange function.' },
            ],
          },
          {
            title: 'Checkboard',
            properties: [
              { name: 'size', type: 'number', defaultValue: '8', description: 'Size of the checkboard squares.' },
              {
                name: 'white',
                type: 'string',
                defaultValue: 'transparent',
                description: 'Color of the white squares.',
              },
              {
                name: 'grey',
                type: 'string',
                defaultValue: 'rgba(0,0,0,.08)',
                description: 'Color of the grey squares.',
              },
            ],
          },
        ],
      },
    ],
  },
] as const;
