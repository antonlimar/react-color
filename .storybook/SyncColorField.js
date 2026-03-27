import { cloneElement, useState } from 'react';

const fallbackColor = {
  h: 250,
  s: 0.5,
  l: 0.2,
  a: 1,
};

export default function SyncColorField(props) {
  const [colorField, setColorField] = useState(props.children.props.color ?? fallbackColor);

  const handleChange = ({ hex }) => setColorField(hex);

  return cloneElement(props.children, {
    onChange: handleChange,
    color: colorField,
  });
}
