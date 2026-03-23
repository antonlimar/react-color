interface CanvasRenderingContext2DLike {
  fillStyle: string;
  fillRect(x: number, y: number, width: number, height: number): void;
  translate(x: number, y: number): void;
}

interface CanvasLike {
  width: number;
  height: number;
  getContext(contextId: '2d'): CanvasRenderingContext2DLike | null;
  toDataURL(): string;
}

type ServerCanvas = new () => CanvasLike;

const checkboardCache: Record<string, string | null> = {};

export const render = (c1: string, c2: string, size: number, serverCanvas?: ServerCanvas): string | null => {
  if (typeof document === 'undefined' && !serverCanvas) {
    return null;
  }

  const canvas = serverCanvas ? new serverCanvas() : document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);

  return canvas.toDataURL();
};

export const get = (c1: string, c2: string, size: number, serverCanvas?: ServerCanvas): string | null => {
  const key = `${c1}-${c2}-${size}${serverCanvas ? '-server' : ''}`;

  if (checkboardCache[key]) {
    return checkboardCache[key];
  }

  const checkboard = render(c1, c2, size, serverCanvas);
  checkboardCache[key] = checkboard;
  return checkboard;
};
