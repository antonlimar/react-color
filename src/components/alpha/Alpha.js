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
exports.AlphaPicker = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var common_1 = require("../common");
var AlphaPointer_1 = __importDefault(require("./AlphaPointer"));
var AlphaPicker = function (_a) {
    var rgb = _a.rgb, hsl = _a.hsl, _b = _a.width, width = _b === void 0 ? '316px' : _b, _c = _a.height, height = _c === void 0 ? '16px' : _c, onChange = _a.onChange, _d = _a.direction, direction = _d === void 0 ? 'horizontal' : _d, style = _a.style, renderers = _a.renderers, _e = _a.pointer, pointer = _e === void 0 ? AlphaPointer_1.default : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var styles = (0, reactcss_1.default)({
        default: {
            picker: {
                position: 'relative',
                width: width,
                height: height,
            },
            alpha: {
                radius: '2px',
                style: style,
            },
        },
    });
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.picker, className: "alpha-picker ".concat(className), children: (0, jsx_runtime_1.jsx)(common_1.Alpha, __assign({}, styles.alpha, { rgb: rgb, hsl: hsl, pointer: pointer, renderers: renderers, onChange: onChange, direction: direction })) }));
};
exports.AlphaPicker = AlphaPicker;
exports.default = (0, common_1.ColorWrap)(exports.AlphaPicker);
