"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderSwatch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var SliderSwatch = function (_a) {
    var hsl = _a.hsl, offset = _a.offset, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b, active = _a.active, first = _a.first, last = _a.last;
    var styles = (0, reactcss_1.default)({
        default: {
            swatch: {
                height: '12px',
                background: "hsl(".concat(hsl.h, ", 50%, ").concat(offset * 100, "%)"),
                cursor: 'pointer',
            },
        },
        first: {
            swatch: {
                borderRadius: '2px 0 0 2px',
            },
        },
        last: {
            swatch: {
                borderRadius: '0 2px 2px 0',
            },
        },
        active: {
            swatch: {
                transform: 'scaleY(1.8)',
                borderRadius: '3.6px/2px',
            },
        },
    }, { active: active, first: first, last: last });
    var handleClick = function (event) {
        onClick({
            h: hsl.h,
            s: 0.5,
            l: offset,
            source: 'hsl',
        }, event);
    };
    return (0, jsx_runtime_1.jsx)("div", { style: styles.swatch, onClick: handleClick });
};
exports.SliderSwatch = SliderSwatch;
exports.default = exports.SliderSwatch;
