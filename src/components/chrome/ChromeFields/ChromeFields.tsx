import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { EditableInput, bem, UnfoldMoreHorizontalIcon } from '@/components/common';
import { isValidHex } from '@/helpers';
import type { ColorChangeValue, ColorPickerChangeEvent, HSLAColor, RGBAColor } from '@/types';
import './ChromeFields.scss';

interface ChromeFieldsProps {
  hsl: HSLAColor;
  rgb: RGBAColor;
  hex: string;
  view?: 'hex' | 'rgb' | 'hsl';
  disableAlpha?: boolean;
  onChange: (data: ColorChangeValue, event?: ColorPickerChangeEvent) => void;
}

const b = bem('chrome');
const ENTER = 13;
const SPACE = 32;

export function ChromeFields(props: ChromeFieldsProps) {
  const [view, setView] = useState<'hex' | 'rgb' | 'hsl'>(() =>
    props.hsl.a !== 1 && props.view === 'hex' ? 'rgb' : props.view || 'hex',
  );
  const resolvedView = props.hsl.a !== 1 && view === 'hex' ? 'rgb' : view;

  const toggleViews = () => {
    if (resolvedView === 'hex') {
      setView('rgb');
    } else if (resolvedView === 'rgb') {
      setView('hsl');
    } else if (props.hsl.a === 1) {
      setView('hex');
    } else {
      setView('rgb');
    }
  };

  const handleToggleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar' ||
      event.keyCode === ENTER ||
      event.keyCode === SPACE
    ) {
      event.preventDefault();
      toggleViews();
    }
  };

  const handleChange = (data: ColorChangeValue, event?: ColorPickerChangeEvent) => {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        props.onChange(
          {
            hex: data.hex,
            source: 'hex',
          },
          event,
        );
      }
    } else if (data.r || data.g || data.b) {
      props.onChange(
        {
          r: data.r || props.rgb.r,
          g: data.g || props.rgb.g,
          b: data.b || props.rgb.b,
          source: 'rgb',
        },
        event,
      );
    } else if (data.a !== undefined) {
      let alpha = Number(data.a);
      if (alpha < 0) {
        alpha = 0;
      } else if (alpha > 1) {
        alpha = 1;
      }

      props.onChange(
        {
          h: props.hsl.h,
          s: props.hsl.s,
          l: props.hsl.l,
          a: Math.round(alpha * 100) / 100,
          source: 'rgb',
        },
        event,
      );
    } else if (data.h !== undefined || data.s !== undefined || data.l !== undefined) {
      const saturation = typeof data.s === 'string' && data.s.indexOf('%') > -1 ? data.s.replace('%', '') : data.s;
      const lightness = typeof data.l === 'string' && data.l.indexOf('%') > -1 ? data.l.replace('%', '') : data.l;

      let nextSaturation = Number(saturation !== undefined ? saturation : props.hsl.s);
      let nextLightness = Number(lightness !== undefined ? lightness : props.hsl.l);

      if (nextSaturation === 1) {
        nextSaturation = 0.01;
      } else if (nextLightness === 1) {
        nextLightness = 0.01;
      }

      props.onChange(
        {
          h: Number(data.h !== undefined ? data.h : props.hsl.h),
          s: nextSaturation,
          l: nextLightness,
          source: 'hsl',
        },
        event,
      );
    }
  };

  const renderField = (label: string, value: string | number, fieldModifier?: string, arrowOffset?: number) => {
    const fieldClassName = fieldModifier ? b('field', { [fieldModifier]: true }) : b('field');

    return (
      <div className={fieldClassName}>
        <EditableInput
          label={label}
          value={value}
          arrowOffset={arrowOffset}
          onChange={(nextValue, event) => handleChange(nextValue as ColorChangeValue, event)}
        />
      </div>
    );
  };

  let fields: ReactNode;
  if (resolvedView === 'hex') {
    fields = <div className={b('fields-grid')}>{renderField('hex', props.hex)}</div>;
  } else if (resolvedView === 'rgb') {
    fields = (
      <div className={b('fields-grid')}>
        {renderField('r', props.rgb.r)}
        {renderField('g', props.rgb.g)}
        {renderField('b', props.rgb.b)}
        {renderField('a', props.rgb.a, 'alpha', 0.01)}
      </div>
    );
  } else {
    fields = (
      <div className={b('fields-grid')}>
        {renderField('h', Math.round(props.hsl.h))}
        {renderField('s', `${Math.round(props.hsl.s * 100)}%`)}
        {renderField('l', `${Math.round(props.hsl.l * 100)}%`)}
        {renderField('a', props.hsl.a, 'alpha', 0.01)}
      </div>
    );
  }

  return (
    <div className={b('fields', { 'disabled-alpha': props.disableAlpha, [resolvedView]: true })}>
      {fields}
      <div className={b('toggle')}>
        <div
          aria-label="Toggle color input mode"
          className={b('toggle-icon')}
          role="button"
          tabIndex={0}
          onClick={toggleViews}
          onKeyDown={handleToggleKeyDown}
        >
          <UnfoldMoreHorizontalIcon />
        </div>
      </div>
    </div>
  );
}
