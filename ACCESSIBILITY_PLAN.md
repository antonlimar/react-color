# План: базовая доступность цветовых контролов

## Summary

Добавить обратно совместимую доступность в общие примитивы `Saturation`, `Hue`, `Alpha` и `Swatch`, чтобы улучшение автоматически попало в пикеры, которые их используют.

Ориентир для слайдеров: WAI-ARIA APG slider pattern и обязательные `aria-valuemin` / `aria-valuemax` / `aria-valuenow` для `role="slider"`:
https://www.w3.org/WAI/ARIA/apg/patterns/slider/

## Key Changes

- `Hue`:
  - сделать контейнер фокусируемым: `tabIndex={0}`;
  - добавить `role="slider"`, `aria-valuemin={0}`, `aria-valuemax={359}`, `aria-valuenow={Math.round(hsl.h)}`, `aria-orientation`;
  - поддержать `ArrowLeft/ArrowDown = -1`, `ArrowRight/ArrowUp = +1`, `PageDown/PageUp = +/-10`, `Home = 0`, `End = 359`;
  - для `direction="vertical"` сохранить интуитивное управление: `ArrowUp` увеличивает hue, `ArrowDown` уменьшает.

- `Alpha`:
  - сделать контейнер фокусируемым и объявить как `role="slider"`;
  - использовать диапазон `0..100`, где `aria-valuenow = Math.round(alpha * 100)`;
  - стрелки меняют opacity на `1%`, `PageUp/PageDown` на `10%`, `Home = 0`, `End = 100`;
  - при изменении вызывать существующий `onChange` с тем же shape, что и drag: `{ h, s, l, a, source: 'rgb' }`.

- `Saturation`:
  - сделать саму saturation-плоскость фокусируемой;
  - не назначать `role="slider"` одному 2D-контролу, потому что у него две оси значения и один slider был бы семантически неточным;
  - добавить безопасный минимум ARIA: `role="application"` не использовать, вместо этого ограничиться `tabIndex={0}`, `aria-label="Color saturation and brightness"` или аналогичным стабильным label;
  - стрелки меняют `hsv.s` и `hsv.v`: Left/Right = saturation `-/+0.01`, Down/Up = value `-/+0.01`, `Page*` = `0.1`;
  - clamp значений в `0..1`, `source: 'hsv'`.

- `Swatch`:
  - заменить Enter-only поведение на `Enter` и `Space`;
  - добавить `role="button"` для кликабельного `div`;
  - добавить `aria-label={title || color}` и `aria-pressed={focus ? true : undefined}` только для активных/выбранных swatches, чтобы не ломать обычный рендер;
  - сохранить текущий `tabIndex={0}` и callback signatures.

- Secondary candidates:
  - `PhotoshopButton`: сейчас это кликабельный `div`; заменить на настоящий `<button type="button">` либо добавить `role="button"`, `tabIndex={0}` и `Enter`/`Space` activation, если смена тега рискованна для CSS/snapshots;
  - `ChromeFields` toggle icon: сейчас это кликабельный `div`; сделать его keyboard-operable control с понятным `aria-label`, например `Toggle color input mode`;
  - `SliderSwatch`: не использует общий `Swatch`, поэтому отдельно добавить focusability, `role="button"` и `Enter`/`Space` activation либо перевести на общий `Swatch`, если стили позволяют.

## Public API / Types

- Публичные exports не менять.
- Новые props не добавлять в v1 изменения.
- Callback payloads и `event`-параметры сохранить совместимыми; keyboard changes могут передавать React `KeyboardEvent` как уже делает `Swatch`.
- README менять только если решите явно документировать keyboard support; для этой задачи можно обойтись тестами.

## Test Plan

- Unit tests для `Hue`, `Alpha`, `Saturation`, `Swatch`:
  - наличие `tabIndex`, role/ARIA атрибутов там, где они добавлены;
  - `Hue`: Arrow/Home/End/Page меняют hue и вызывают `onChange`;
  - `Alpha`: стрелки меняют `a` с clamp `0..1`;
  - `Saturation`: стрелки меняют `s`/`v` независимо и clamp в `0..1`;
  - `Swatch`: `Enter` и `Space` вызывают `onClick`.

- Regression checks:
  - `npm run test:unit`;
  - `npm run typecheck`;
  - при заметных snapshot изменениях обновлять только snapshots, связанные с добавленными ARIA/tabindex атрибутами.

## Assumptions

- Цель сейчас: обратно совместимый accessibility pass, не полноценная переработка под native `<input type="range">`.
- `Saturation` намеренно не маскируется под один ARIA slider, потому что это 2D-плоскость.
- Видимый дизайн и pointer components не меняются.

## TODO

- [x] Добавить focusability и ARIA для `Hue`.
- [x] Добавить keyboard support для `Hue`.
- [x] Добавить focusability и ARIA для `Alpha`.
- [x] Добавить keyboard support для `Alpha`.
- [ ] Добавить focusability и минимальный ARIA-label для `Saturation`.
- [ ] Добавить keyboard support для `Saturation`.
- [ ] Расширить keyboard activation и ARIA для `Swatch`.
- [ ] Проверить и исправить вторичные кликабельные `div`: `PhotoshopButton`, `ChromeFields` toggle, `SliderSwatch`.
- [ ] Покрыть изменения unit-тестами.
- [ ] Запустить `npm run test:unit`.
- [ ] Запустить `npm run typecheck`.
