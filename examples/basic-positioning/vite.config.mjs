import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createExampleConfig } from '../vite.shared.mjs';

const exampleDir = path.dirname(fileURLToPath(import.meta.url));

export default createExampleConfig({ exampleDir });
