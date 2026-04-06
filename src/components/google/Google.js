"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var GooglePointerCircle_1 = __importDefault(require("./GooglePointerCircle"));
var GooglePointer_1 = __importDefault(require("./GooglePointer"));
var GoogleFields_1 = __importDefault(require("./GoogleFields"));
var Google = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 652 : _b, onChange = _a.onChange, rgb = _a.rgb, hsl = _a.hsl, hsv = _a.hsv, hex = _a.hex, _c = _a.header, header = _c === void 0 ? 'Color picker' : _c, _d = _a.styles, passedStyles = _d === void 0 ? {} : _d, _e = _a.className, className = _e === void 0 ? '' : _e;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            picker: {
                width: width,
                background: '#fff',
                border: '1px solid #dfe1e5',
                boxSizing: 'initial',
                display: 'flex',
                flexWrap: 'wrap',
                borderRadius: '8px 8px 0px 0px',
            },
            head: {
                height: '57px',
                width: '100%',
                paddingTop: '16px',
                paddingBottom: '16px',
                paddingLeft: '16px',
                fontSize: '20px',
                boxSizing: 'border-box',
                fontFamily: 'Roboto-Regular,HelveticaNeue,Arial,sans-serif',
            },
            saturation: {
                width: '70%',
                padding: '0px',
                position: 'relative',
                overflow: 'hidden',
            },
            swatch: {
                width: '30%',
                height: '228px',
                padding: '0px',
                background: "rgba(".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b, ", 1)"),
                position: 'relative',
                overflow: 'hidden',
            },
            body: {
                margin: 'auto',
                width: '95%',
            },
            controls: {
                display: 'flex',
                boxSizing: 'border-box',
                height: '52px',
                paddingTop: '22px',
            },
            color: {
                width: '32px',
            },
            hue: {
                height: '8px',
                position: 'relative',
                margin: '0px 16px 0px 16px',
                width: '100%',
            },
            Hue: {
                radius: '2px',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.picker, className: "google-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.head, children: header }), (0, jsx_runtime_1.jsx)("div", { style: styles.swatch }), (0, jsx_runtime_1.jsx)("div", { style: styles.saturation, children: (0, jsx_runtime_1.jsx)(common_1.Saturation, { hsl: hsl, hsv: hsv, pointer: GooglePointerCircle_1.default, onChange: onChange }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.body, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.controls, className: "flexbox-fix", children: (0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)(common_1.Hue, { style: styles.Hue, hsl: hsl, radius: "4px", pointer: GooglePointer_1.default, onChange: onChange }) }) }), (0, jsx_runtime_1.jsx)(GoogleFields_1.default, { rgb: rgb, hsl: hsl, hex: hex, hsv: hsv, onChange: onChange })] })] }));
};
exports.Google = Google;
exports.default = (0, common_1.ColorWrap)(exports.Google);
