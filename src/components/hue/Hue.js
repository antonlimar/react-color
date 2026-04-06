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
exports.HuePicker = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var HuePointer_1 = __importDefault(require("./HuePointer"));
var HuePicker = function (_a) {
    var _b = _a.width, width = _b === void 0 ? '316px' : _b, _c = _a.height, height = _c === void 0 ? '16px' : _c, onChange = _a.onChange, hsl = _a.hsl, _d = _a.direction, direction = _d === void 0 ? 'horizontal' : _d, _e = _a.pointer, pointer = _e === void 0 ? HuePointer_1.default : _e, _f = _a.styles, passedStyles = _f === void 0 ? {} : _f, _g = _a.className, className = _g === void 0 ? '' : _g;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            picker: {
                position: 'relative',
                width: width,
                height: height,
            },
            hue: {
                radius: '2px',
            },
        },
    }, passedStyles));
    var handleChange = function (data) {
        onChange({ a: 1, h: data.h, l: 0.5, s: 1 });
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.picker, className: "hue-picker ".concat(className), children: (0, jsx_runtime_1.jsx)(common_1.Hue, __assign({}, styles.hue, { hsl: hsl, pointer: pointer, onChange: handleChange, direction: direction })) }));
};
exports.HuePicker = HuePicker;
exports.default = (0, common_1.ColorWrap)(exports.HuePicker);
