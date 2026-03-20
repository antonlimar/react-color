import Button from './ButtonExample'
import buttonSource from './ButtonExample.js?raw'
import Sketch from './SketchExample'
import sketchSource from './SketchExample.js?raw'

export { Button, Sketch }

export const buttonmd = `\`\`\`jsx\n${ buttonSource.trim() }\n\`\`\``
export const sketchmd = `\`\`\`jsx\n${ sketchSource.trim() }\n\`\`\``
