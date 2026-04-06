"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var SliderSwatches_1 = __importDefault(require("./SliderSwatches"));
var SliderPointer_1 = __importDefault(require("./SliderPointer"));
var Slider = function (_a) {
    var hsl = _a.hsl, onChange = _a.onChange, _b = _a.pointer, pointer = _b === void 0 ? SliderPointer_1.default : _b, _c = _a.styles, passedStyles = _c === void 0 ? {} : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            hue: {
                height: '12px',
                position: 'relative',
            },
            Hue: {
                radius: '2px',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.wrap || {}, className: "slider-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)(common_1.Hue, { style: styles.Hue, hsl: hsl, pointer: pointer, onChange: onChange }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.swatches, children: (0, jsx_runtime_1.jsx)(SliderSwatches_1.default, { hsl: hsl, onClick: onChange }) })] }));
};
exports.Slider = Slider;
exports.default = (0, common_1.ColorWrap)(exports.Slider);
