import type { ContentSection, PickerMetadata } from './types';

export const pickerMetadata: readonly PickerMetadata[] = [
  {
    id: 'alpha',
    title: 'Alpha',
    exportName: 'AlphaPicker',
    deepImport: 'react-color/es/Alpha',
    summary: 'Standalone alpha slider for compact transparency controls.',
    badges: ['alpha', 'slider'],
    apiAnchor: 'picker-specific-props-alpha',
  },
  {
    id: 'block',
    title: 'Block',
    exportName: 'BlockPicker',
    deepImport: 'react-color/es/Block',
    summary: 'Simple block palette with optional triangle marker.',
    badges: ['palette', 'compact'],
    apiAnchor: 'picker-specific-props-block',
  },
  {
    id: 'chrome',
    title: 'Chrome',
    exportName: 'ChromePicker',
    deepImport: 'react-color/es/Chrome',
    summary: 'Classic full color editor with saturation, hue, alpha, and fields.',
    badges: ['full editor', 'alpha'],
    apiAnchor: 'picker-specific-props-chrome',
  },
  {
    id: 'circle',
    title: 'Circle',
    exportName: 'CirclePicker',
    deepImport: 'react-color/es/Circle',
    summary: 'Circular swatch palette for preset color selection.',
    badges: ['palette'],
    apiAnchor: 'picker-specific-props-circle',
  },
  {
    id: 'compact',
    title: 'Compact',
    exportName: 'CompactPicker',
    deepImport: 'react-color/es/Compact',
    summary: 'Dense preset grid for fast color selection in tight layouts.',
    badges: ['palette', 'compact'],
    apiAnchor: 'picker-specific-props-compact',
  },
  {
    id: 'github',
    title: 'Github',
    exportName: 'GithubPicker',
    deepImport: 'react-color/es/Github',
    summary: 'GitHub-style palette popover with configurable triangle placement.',
    badges: ['palette', 'compact'],
    apiAnchor: 'picker-specific-props-github',
  },
  {
    id: 'google',
    title: 'Google',
    exportName: 'GooglePicker',
    deepImport: 'react-color/es/Google',
    summary: 'Material-like color editor with a configurable header.',
    badges: ['full editor'],
    apiAnchor: 'picker-specific-props-google',
  },
  {
    id: 'hue',
    title: 'Hue',
    exportName: 'HuePicker',
    deepImport: 'react-color/es/Hue',
    summary: 'Standalone hue slider for custom picker composition.',
    badges: ['slider'],
    apiAnchor: 'picker-specific-props-hue',
  },
  {
    id: 'material',
    title: 'Material',
    exportName: 'MaterialPicker',
    deepImport: 'react-color/es/Material',
    summary: 'Compact Material-style color fields for simple editing.',
    badges: ['compact'],
    apiAnchor: 'picker-specific-props-material',
  },
  {
    id: 'photoshop',
    title: 'Photoshop',
    exportName: 'PhotoshopPicker',
    deepImport: 'react-color/es/Photoshop',
    summary: 'Photoshop-inspired editor with accept and cancel actions.',
    badges: ['full editor'],
    apiAnchor: 'picker-specific-props-photoshop',
  },
  {
    id: 'sketch',
    title: 'Sketch',
    exportName: 'SketchPicker',
    deepImport: 'react-color/es/Sketch',
    summary: 'Full picker with saturation, hue, alpha, fields, and presetColors.',
    badges: ['full editor', 'alpha', 'customizable'],
    apiAnchor: 'picker-specific-props-sketch',
  },
  {
    id: 'slider',
    title: 'Slider',
    exportName: 'SliderPicker',
    deepImport: 'react-color/es/Slider',
    summary: 'Horizontal slider-oriented picker for concise color editing.',
    badges: ['slider'],
    apiAnchor: 'picker-specific-props-slider',
  },
  {
    id: 'swatches',
    title: 'Swatches',
    exportName: 'SwatchesPicker',
    deepImport: 'react-color/es/Swatches',
    summary: 'Grouped swatch palette for curated color systems.',
    badges: ['palette'],
    apiAnchor: 'picker-specific-props-swatches',
  },
  {
    id: 'twitter',
    title: 'Twitter',
    exportName: 'TwitterPicker',
    deepImport: 'react-color/es/Twitter',
    summary: 'Twitter-style palette popover with configurable triangle placement.',
    badges: ['palette', 'compact'],
    apiAnchor: 'picker-specific-props-twitter',
  },
] as const;

export const siteSections: readonly ContentSection[] = [
  {
    id: 'about',
    order: 1,
    title: 'About',
    intro:
      'An actively maintained fork and reincarnation of the popular [casesandberg/react-color](https://github.com/casesandberg/react-color) package, focused on the same familiar API with modern tooling, types, and styling hooks.',
    blocks: [
      {
        type: 'bullets',
        items: [
          '13 picker components, including Sketch, Photoshop, Chrome, GitHub, Twitter, and more.',
          'Shared primitives for building custom pickers when the bundled components are not enough.',
        ],
      },
    ],
  },
  {
    id: 'getting-started',
    order: 2,
    title: 'Getting Started',
    intro: 'Install the package, import a picker, and wire it to your React state.',
    blocks: [],
    subsections: [
      {
        id: 'install',
        title: 'Install',
        intro: 'Add react-color to your project with your package manager of choice.',
        blocks: [
          {
            type: 'package-manager',
            label: 'Install package',
            commands: {
              npm: 'npm install react-color --save',
              pnpm: 'pnpm add react-color',
              yarn: 'yarn add react-color',
              bun: 'bun add react-color',
            },
          },
          {
            type: 'text',
            text: 'Picker entrypoints import their own published CSS automatically, so normal usage does not need any extra setup.',
          },
          {
            type: 'code',
            language: 'tsx',
            code: "import { SketchPicker } from 'react-color'\n",
            label: 'Basic import',
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
            code: 'import { SketchPicker } from \'react-color\';\n\nexport function Example() {\n  return <SketchPicker theme="auto" />;\n}\n',
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
            code: "import SketchPicker from 'react-color/es/Sketch';\nimport ChromePicker from 'react-color/es/Chrome';\n",
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
    intro:
      'The API reference is organized around the three shared color props and a picker-by-picker view of the props that only exist on individual components.',
    blocks: [],
    subsections: [
      {
        id: 'color',
        title: 'color',
        intro:
          'Use `color` to set the active value for a picker, either as an initial value or as a fully controlled prop from parent state.',
        blocks: [
          {
            type: 'text',
            text: 'Accepted values include a hex string such as `#333`, an rgb/rgba object, an hsl/hsla object, an hsv/hsva object, or the string `transparent`.',
          },
          {
            type: 'text',
            text: 'This is the prop that keeps multiple pickers in sync with the same source of truth, just like the shared hero demo on the site.',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Controlled color value',
            code: "import { useState } from 'react';\nimport { SketchPicker } from 'react-color';\nimport type { ColorResult } from 'react-color';\n\nexport function Example() {\n  const [background, setBackground] = useState<string>('#fff');\n\n  return (\n    <SketchPicker\n      color={background}\n      onChangeComplete={(nextColor: ColorResult) => setBackground(nextColor.hex)}\n    />\n  );\n}\n",
          },
        ],
        propertyGroups: [
          {
            title: 'Prop signature',
            properties: [
              {
                name: 'color',
                type: 'string | rgb object | hsl object | transparent',
                description:
                  'Controls the active color on the picker. Use it to initialize the picker or keep it in sync with parent state.',
              },
            ],
          },
        ],
      },
      {
        id: 'on-change',
        title: 'onChange',
        intro:
          'Use `onChange` when you want every intermediate drag or click update while the user is actively editing the color.',
        blocks: [
          {
            type: 'text',
            text: 'This callback fires frequently during pointer interaction, so it is the right place for live previews, synchronized UI state, or derived visual updates.',
          },
          {
            type: 'text',
            text: 'The first argument is a normalized color result with `hex`, `rgb`, `hsl`, `hsv`, `oldHue`, and `source`. The second argument is the original DOM or React event when one exists.',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Live updates during interaction',
            code: "import { SwatchesPicker } from 'react-color';\nimport type { ColorResult } from 'react-color';\n\nexport function Example() {\n  const handleChange = (nextColor: ColorResult) => {\n    console.log(nextColor.hex, nextColor.rgb);\n  };\n\n  return <SwatchesPicker onChange={handleChange} />;\n}\n",
          },
        ],
        propertyGroups: [
          {
            title: 'Prop signature',
            properties: [
              {
                name: 'onChange',
                type: '(color, event) => void',
                description:
                  'Called every time the color changes. Use it to store state in a parent component or derive other transformations.',
              },
            ],
          },
        ],
      },
      {
        id: 'on-change-complete',
        title: 'onChangeComplete',
        intro:
          'Use `onChangeComplete` when you only need the final result after a drag or other color-edit interaction has settled.',
        blocks: [
          {
            type: 'text',
            text: 'This is the lower-frequency callback that works well for persistence, server writes, analytics, or any expensive state update you do not want to run on every intermediate change.',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Commit the final color value',
            code: "import { useState } from 'react';\nimport { PhotoshopPicker } from 'react-color';\nimport type { ColorResult } from 'react-color';\n\nexport function Example() {\n  const [background, setBackground] = useState<string>('#fff');\n\n  const handleChangeComplete = (nextColor: ColorResult) => {\n    setBackground(nextColor.hex);\n  };\n\n  return <PhotoshopPicker onChangeComplete={handleChangeComplete} />;\n}\n",
          },
        ],
        propertyGroups: [
          {
            title: 'Prop signature',
            properties: [
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
          'These props only exist on specific pickers. Shared props like `color`, `onChange`, `onChangeComplete`, `className`, `classNames`, and `theme` still apply on top.',
        blocks: [
          {
            type: 'text',
            text: 'Most public pickers stay intentionally small: the unique props usually control layout, preset palettes, optional UI pieces, or swatch hover behavior.',
          },
          {
            type: 'text',
            text: 'MaterialPicker does not currently add picker-only props beyond the shared color and styling surface, so it is fully described by the common API plus its CSS hooks.',
          },
        ],
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
            title: 'Google',
            properties: [
              { name: 'width', type: 'string | number', defaultValue: '652', description: 'Width of the picker.' },
              {
                name: 'header',
                type: 'string',
                defaultValue: 'Color picker',
                description: 'Title text shown in the picker header.',
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
            title: 'Material',
            summary:
              'MaterialPicker does not add picker-specific props beyond the shared color callbacks, class hooks, and theme surface.',
            properties: [],
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
                type: 'string[] | { color: string; title?: string }[]',
                defaultValue:
                  "['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']",
                description:
                  'Default colors at the bottom of the picker. Entries may be hex strings or objects with `color` and optional `title`.',
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
        title: 'Styling',
        intro:
          'Use themes, class hooks, and CSS variables for predictable customization without replacing picker internals.',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Picker entrypoints import their own published CSS automatically.',
              'Use theme="light" | "dark" | "auto" to switch built-in token sets.',
              'Use className and classNames to attach custom classes to supported slots.',
              'Override CSS custom properties for token-level tweaks.',
              'Import published CSS entrypoints manually only when you need aggregate CSS or shared primitive styles.',
              'Prefer CSS variables and classes for new UI; use inline style props only as an escape hatch.',
            ],
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Theme and classNames',
            code: "import { SketchPicker } from 'react-color';\n\nexport function Example() {\n  return (\n    <SketchPicker\n      theme=\"dark\"\n      className=\"profile-color-picker\"\n      classNames={{\n        root: 'profile-color-picker__root',\n        body: 'profile-color-picker__body',\n        controls: 'profile-color-picker__controls',\n        swatch: 'profile-color-picker__swatch',\n      }}\n    />\n  );\n}\n",
          },
          {
            type: 'code',
            language: 'css',
            label: 'CSS variables',
            code: '.profile-color-picker__root {\n  --rc-color-surface: #101418;\n  --rc-color-surface-elevated: #161b22;\n  --rc-color-border: #2f3843;\n  --rc-color-text: #f3f6fb;\n  --rc-color-shadow: 0 16px 40px rgb(0 0 0 / 0.35);\n}\n',
          },
          {
            type: 'text',
            text: 'Manual CSS imports are optional. Use them only when you need the aggregate stylesheet up front or when you compose custom pickers from shared primitives.',
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Optional CSS imports',
            code: "import 'react-color/es/styles/index.css';\nimport 'react-color/es/styles/common/editable-input.css';\n",
          },
        ],
      },
    ],
  },
  {
    id: 'developer-guides',
    order: 4,
    title: 'Developer Guides',
    intro:
      'These guides collect the most common migration, TypeScript, styling, SSR, and accessibility questions in one place.',
    blocks: [],
    subsections: [
      {
        id: 'migration-from-casesandberg-react-color',
        title: 'Migration from casesandberg/react-color',
        intro:
          'The fork keeps the familiar default export and named picker exports, while modernizing the build, typing, and CSS delivery story.',
        blocks: [
          {
            type: 'bullets',
            items: [
              "Default export remains the Chrome picker wrapped with ColorWrap, so existing `import Chrome from 'react-color'` style usage still maps to the same mental model.",
              'Named picker exports keep the same top-level component names, and deep imports continue to work for bundle-sensitive code paths.',
              'CSS entrypoints are still published, but picker entrypoints also import their own styles automatically for normal usage.',
              'The TypeScript-enabled toolchain improves editor feedback without forcing a runtime API rewrite.',
            ],
          },
        ],
      },
      {
        id: 'typescript-recipes',
        title: 'TypeScript Recipes',
        intro:
          'The public types are intentionally small, so the most useful patterns are usually controlled color state, picker-specific props, and narrow handler signatures.',
        blocks: [
          {
            type: 'code',
            language: 'tsx',
            label: 'Controlled picker with ColorResult',
            code: "import { useState } from 'react';\nimport { SketchPicker } from 'react-color';\nimport type { ColorResult } from 'react-color';\n\nexport function Example() {\n  const [color, setColor] = useState('#3D91FF');\n\n  const handleChangeComplete = (nextColor: ColorResult) => {\n    setColor(nextColor.hex);\n  };\n\n  return <SketchPicker color={color} onChangeComplete={handleChangeComplete} />;\n}\n",
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Typing classNames and event handlers',
            code: "import { GithubPicker } from 'react-color';\n\ninterface PickerClasses {\n  root?: string;\n  body?: string;\n  swatch?: string;\n}\n\nexport function Example({ classNames }: { classNames?: PickerClasses }) {\n  const handleSwatchHover = (color: string, event: MouseEvent<HTMLDivElement>) => {\n    console.log(color, event.currentTarget);\n  };\n\n  return <GithubPicker classNames={classNames} onSwatchHover={handleSwatchHover} />;\n}\n",
          },
          {
            type: 'code',
            language: 'tsx',
            label: 'Typing custom picker props',
            code: "import { CustomPicker } from 'react-color';\nimport type { CustomPickerInjectedProps } from 'react-color';\n\ninterface BrandPickerProps extends CustomPickerInjectedProps {\n  label: string;\n}\n\nfunction BrandPicker({ hex, label, onChange }: BrandPickerProps) {\n  return (\n    <label>\n      {label}\n      <input\n        type=\"color\"\n        value={hex}\n        onChange={(event) => onChange({ hex: event.currentTarget.value }, event)}\n      />\n    </label>\n  );\n}\n\nexport const BrandColorPicker = CustomPicker(BrandPicker);\n",
          },
        ],
      },
      {
        id: 'styling-css-hooks',
        title: 'Styling & CSS Hooks',
        intro:
          'Theme props, CSS custom properties, and supported class hooks are the preferred way to customize pickers without replacing internals.',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Use `theme="light" | "dark" | "auto"` when you want a built-in token set that tracks the host page.',
              'Use `className` for the outer wrapper and `classNames` when the picker exposes slot-level hooks.',
              'Override CSS variables for palette-level adjustments, spacing, shadows, or borders instead of rewriting component markup.',
              'Import CSS manually only when you need aggregate stylesheet control or shared primitive styles for custom compositions.',
            ],
          },
          {
            type: 'code',
            language: 'css',
            label: 'Token overrides',
            code: '.profile-swatch-picker {\n  --rc-color-surface: #111827;\n  --rc-color-surface-elevated: #1f2937;\n  --rc-color-border: #334155;\n  --rc-color-text: #f8fafc;\n}\n',
          },
        ],
      },
      {
        id: 'ssr-framework-notes',
        title: 'SSR & Framework Notes',
        intro:
          'Interactive pickers work well in Next.js, Vite, and other modern frameworks as long as browser-only behavior stays inside the client side of the tree.',
        blocks: [
          {
            type: 'bullets',
            items: [
              'In Next.js App Router, render the picker from a client component when it needs pointer interaction or clipboard access.',
              'Avoid direct DOM assumptions during server render; the pickers already expect to hydrate into a normal browser environment.',
              'Some custom compositions use canvas-backed renderers in SSR-aware setups, so wire those dependencies explicitly when you need them.',
              'Keep framework wrappers thin so the public `react-color` API stays the source of truth for color state and callbacks.',
            ],
          },
        ],
      },
      {
        id: 'accessibility-notes',
        title: 'Accessibility Notes',
        intro:
          'The bundled pickers provide interaction patterns, but the surrounding app still controls labels, contrast, and any domain-specific meaning of the selected color.',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Treat keyboard and pointer interactions as first-class when you build custom pickers or compose the helper components.',
              'Always provide labels for color inputs and any extra controls that sit around the picker UI.',
              'Check contrast for your own palette choices, because the library cannot know whether a swatch set is legible for your product.',
              'When you build custom editors, keep helper components wired to `onChange` so assistive technology receives the same state updates as sighted users.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'create-your-own',
    order: 5,
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
            code: "import { CustomPicker } from 'react-color';\nimport type { CustomPickerInjectedProps } from 'react-color';\n\nfunction MyColorPicker({ hex }: CustomPickerInjectedProps) {\n  return <div>Selected color: {hex}</div>;\n}\n\nexport default CustomPicker(MyColorPicker);\n",
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
  {
    id: 'acknowledgement',
    order: 6,
    title: 'Acknowledgement',
    intro:
      'This modernization fork stands on the years of work behind the original [casesandberg/react-color](https://github.com/casesandberg/react-color) project, whose API, picker set, and community adoption made this continuation possible.',
    blocks: [
      {
        type: 'bullets',
        items: [
          'Thank you to casesandberg for the original package and the familiar picker experience that people still rely on.',
          'This fork keeps that foundation intact while modernizing the tooling and documentation around it.',
        ],
      },
    ],
  },
] as const;
