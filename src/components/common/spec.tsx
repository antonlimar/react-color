import React from 'react';
import { red } from '../../helpers/color';

import Alpha from './Alpha';
import Checkboard from './Checkboard';
import EditableInput from './EditableInput';
import Hue from './Hue';
import Saturation from './Saturation';
import Swatch from './Swatch';
import { renderForSnapshot } from '../../../test/helpers';

test('Alpha renders correctly', () => {
  renderForSnapshot(<Alpha {...red} />).expectSnapshot();
});

test('Checkboard renders correctly', () => {
  renderForSnapshot(<Checkboard />).expectSnapshot();
});

test('Checkboard renders children correctly', () => {
  renderForSnapshot(
    <Checkboard>
      <button>Click</button>
    </Checkboard>,
  ).expectSnapshot();
});

test('EditableInput renders correctly', () => {
  renderForSnapshot(<EditableInput label="Hex" placeholder="#fff" />).expectSnapshot();
});

test('Hue renders correctly', () => {
  renderForSnapshot(<Hue {...red} />).expectSnapshot();
});

test('Saturation renders correctly', () => {
  renderForSnapshot(<Saturation {...red} />).expectSnapshot();
});

test('Swatch renders correctly', () => {
  renderForSnapshot(<Swatch color="#333" style={{ opacity: '0.4' }} />).expectSnapshot();
});

test('Swatch renders custom title correctly', () => {
  renderForSnapshot(<Swatch color="#fff" title="white" />).expectSnapshot();
});

test('Swatch renders with an onMouseOver handler correctly', () => {
  renderForSnapshot(<Swatch color="#fff" title="white" onHover={() => {}} />).expectSnapshot();
});
