import Button from './ButtonExample';
import buttonSource from './ButtonExample.tsx?raw';
import Sketch from './SketchExample';
import sketchSource from './SketchExample.tsx?raw';

export { Button, Sketch };

export const buttonmd = `\`\`\`jsx\n${buttonSource.trim()}\n\`\`\``;
export const sketchmd = `\`\`\`jsx\n${sketchSource.trim()}\n\`\`\``;
