import { setProjectAnnotations } from '@storybook/react-vite';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import preview from '../.storybook/preview.js';

setProjectAnnotations(preview);

document.body.style.margin = '0';
document.body.style.background = '#ffffff';

afterEach(() => {
  cleanup();
  document.body.style.margin = '0';
  document.body.style.background = '#ffffff';
});
