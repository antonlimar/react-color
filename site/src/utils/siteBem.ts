import { setup } from 'bem-cn';

const createBem = setup({
  el: '__',
  mod: '--',
  modValue: '-',
});

export const siteBem = (block: string) => createBem(block);
