import { jsx as _jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export const handleFocus = (WrappedComponent, Span = 'span') =>
  function Focus(props) {
    const [focus, setFocus] = useState(false);
    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);
    return _jsx(Span, {
      onFocus: handleFocus,
      onBlur: handleBlur,
      children: _jsx(WrappedComponent, Object.assign({}, props, { focus })),
    });
  };
