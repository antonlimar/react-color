"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sketch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var SketchFields_1 = __importDefault(require("./SketchFields"));
var SketchPresetColors_1 = __importDefault(require("./SketchPresetColors"));
var DEFAULT_SKETCH_PRESET_COLORS = [
    '#D0021B',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
];
var Sketch = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 200 : _b, rgb = _a.rgb, hex = _a.hex, hsv = _a.hsv, hsl = _a.hsl, onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, _c = _a.disableAlpha, disableAlpha = _c === void 0 ? false : _c, _d = _a.presetColors, presetColors = _d === void 0 ? DEFAULT_SKETCH_PRESET_COLORS : _d, renderers = _a.renderers, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: __assign({ picker: {
                width: width,
                padding: '10px 10px 0',
                boxSizing: 'initial',
                background: '#fff',
                borderRadius: '4px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)',
            }, saturation: {
                width: '100%',
                paddingBottom: '75%',
                position: 'relative',
                overflow: 'hidden',
            }, Saturation: {
                radius: '3px',
                shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            }, controls: {
                display: 'flex',
            }, sliders: {
                padding: '4px 0',
                flex: '1',
            }, color: {
                width: '24px',
                height: '24px',
                position: 'relative',
                marginTop: '4px',
                marginLeft: '4px',
                borderRadius: '3px',
            }, activeColor: {
                absolute: '0px 0px 0px 0px',
                borderRadius: '2px',
                background: "rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ",").concat(rgb.a, ")"),
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            }, hue: {
                position: 'relative',
                height: '10px',
                overflow: 'hidden',
            }, Hue: {
                radius: '2px',
                shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            }, alpha: {
                position: 'relative',
                height: '10px',
                marginTop: '4px',
                overflow: 'hidden',
            }, Alpha: {
                radius: '2px',
                shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
            } }, passedStyles),
        disableAlpha: {
            color: {
                height: '10px',
            },
            hue: {
                height: '10px',
            },
            alpha: {
                display: 'none',
            },
        },
    }, passedStyles), { disableAlpha: disableAlpha });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.picker, className: "sketch-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.saturation, children: (0, jsx_runtime_1.jsx)(common_1.Saturation, { style: styles.Saturation, hsl: hsl, hsv: hsv, onChange: onChange }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.controls, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.sliders, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)(common_1.Hue, { style: styles.Hue, hsl: hsl, onChange: onChange }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.alpha, children: (0, jsx_runtime_1.jsx)(common_1.Alpha, { style: styles.Alpha, rgb: rgb, hsl: hsl, renderers: renderers, onChange: onChange }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.color, children: [(0, jsx_runtime_1.jsx)(common_1.Checkboard, {}), (0, jsx_runtime_1.jsx)("div", { style: styles.activeColor })] })] }), (0, jsx_runtime_1.jsx)(SketchFields_1.default, { rgb: rgb, hsl: hsl, hex: hex, onChange: onChange, disableAlpha: disableAlpha }), (0, jsx_runtime_1.jsx)(SketchPresetColors_1.default, { colors: presetColors, onClick: onChange, onSwatchHover: onSwatchHover })] }));
};
exports.Sketch = Sketch;
exports.default = (0, common_1.ColorWrap)(exports.Sketch);
