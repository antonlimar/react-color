"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chrome = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var ChromeFields_1 = __importDefault(require("./ChromeFields"));
var ChromePointer_1 = __importDefault(require("./ChromePointer"));
var ChromePointerCircle_1 = __importDefault(require("./ChromePointerCircle"));
var Chrome = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 225 : _b, onChange = _a.onChange, _c = _a.disableAlpha, disableAlpha = _c === void 0 ? false : _c, rgb = _a.rgb, hsl = _a.hsl, hsv = _a.hsv, hex = _a.hex, renderers = _a.renderers, _d = _a.styles, passedStyles = _d === void 0 ? {} : _d, _e = _a.className, className = _e === void 0 ? '' : _e, defaultView = _a.defaultView;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            picker: {
                width: width,
                background: '#fff',
                borderRadius: '2px',
                boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
                boxSizing: 'initial',
                fontFamily: 'Menlo',
            },
            saturation: {
                width: '100%',
                paddingBottom: '55%',
                position: 'relative',
                borderRadius: '2px 2px 0 0',
                overflow: 'hidden',
            },
            Saturation: {
                radius: '2px 2px 0 0',
            },
            body: {
                padding: '16px 16px 12px',
            },
            controls: {
                display: 'flex',
            },
            color: {
                width: '32px',
            },
            swatch: {
                marginTop: '6px',
                width: '16px',
                height: '16px',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
            },
            active: {
                absolute: '0px 0px 0px 0px',
                borderRadius: '8px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
                background: "rgba(".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b, ", ").concat(rgb.a, ")"),
                zIndex: '2',
            },
            toggles: {
                flex: '1',
            },
            hue: {
                height: '10px',
                position: 'relative',
                marginBottom: '8px',
            },
            Hue: {
                radius: '2px',
            },
            alpha: {
                height: '10px',
                position: 'relative',
            },
            Alpha: {
                radius: '2px',
            },
        },
        disableAlpha: {
            color: {
                width: '22px',
            },
            alpha: {
                display: 'none',
            },
            hue: {
                marginBottom: '0px',
            },
            swatch: {
                width: '10px',
                height: '10px',
                marginTop: '0px',
            },
        },
    }, passedStyles), { disableAlpha: disableAlpha });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.picker, className: "chrome-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.saturation, children: (0, jsx_runtime_1.jsx)(common_1.Saturation, { style: styles.Saturation, hsl: hsl, hsv: hsv, pointer: ChromePointerCircle_1.default, onChange: onChange }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.body, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.controls, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.color, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.swatch, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.active }), (0, jsx_runtime_1.jsx)(common_1.Checkboard, { renderers: renderers })] }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.toggles, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)(common_1.Hue, { style: styles.Hue, hsl: hsl, pointer: ChromePointer_1.default, onChange: onChange }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.alpha, children: (0, jsx_runtime_1.jsx)(common_1.Alpha, { style: styles.Alpha, rgb: rgb, hsl: hsl, pointer: ChromePointer_1.default, renderers: renderers, onChange: onChange }) })] })] }), (0, jsx_runtime_1.jsx)(ChromeFields_1.default, { rgb: rgb, hsl: hsl, hex: hex, view: defaultView, onChange: onChange, disableAlpha: disableAlpha })] })] }));
};
exports.Chrome = Chrome;
exports.default = (0, common_1.ColorWrap)(exports.Chrome);
