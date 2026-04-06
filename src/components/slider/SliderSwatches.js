"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderSwatches = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var SliderSwatch_1 = __importDefault(require("./SliderSwatch"));
var SliderSwatches = function (_a) {
    var onClick = _a.onClick, hsl = _a.hsl;
    var styles = (0, reactcss_1.default)({
        default: {
            swatches: {
                marginTop: '20px',
            },
            swatch: {
                boxSizing: 'border-box',
                width: '20%',
                paddingRight: '1px',
                float: 'left',
            },
            clear: {
                clear: 'both',
            },
        },
    });
    var epsilon = 0.1;
    var offsets = [0.8, 0.65, 0.5, 0.35, 0.2];
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.swatches, children: [offsets.map(function (offset, index) { return ((0, jsx_runtime_1.jsx)("div", { style: styles.swatch, children: (0, jsx_runtime_1.jsx)(SliderSwatch_1.default, { hsl: hsl, offset: offset, active: Math.abs(hsl.l - offset) < epsilon && Math.abs(hsl.s - 0.5) < epsilon, onClick: onClick, first: index === 0, last: index === offsets.length - 1 }) }, offset)); }), (0, jsx_runtime_1.jsx)("div", { style: styles.clear })] }));
};
exports.SliderSwatches = SliderSwatches;
exports.default = exports.SliderSwatches;
