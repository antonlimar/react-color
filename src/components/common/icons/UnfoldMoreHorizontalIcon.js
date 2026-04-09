var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  };
import { jsx as _jsx } from 'react/jsx-runtime';
const defaultStyle = {
  fill: 'currentcolor',
  width: '24px',
  height: '24px',
};
export const UnfoldMoreHorizontalIcon = (_a) => {
  var { style } = _a,
    props = __rest(_a, ['style']);
  return _jsx(
    'svg',
    Object.assign({ viewBox: '0 0 24 24', style: Object.assign(Object.assign({}, defaultStyle), style) }, props, {
      children: _jsx('path', {
        d: 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z',
      }),
    }),
  );
};
export default UnfoldMoreHorizontalIcon;
