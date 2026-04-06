"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePointerCircle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var GooglePointerCircle = function (_a) {
    var _b = _a.hsl, hsl = _b === void 0 ? { a: 1, h: 249.94, l: 0.2, s: 0.5 } : _b;
    var styles = (0, reactcss_1.default)({
        default: {
            picker: {
                width: '20px',
                height: '20px',
                borderRadius: '22px',
                border: '2px #fff solid',
                transform: 'translate(-12px, -13px)',
                background: "hsl(".concat(Math.round(hsl.h), ", ").concat(Math.round(hsl.s * 100), "%, ").concat(Math.round(hsl.l * 100), "%)"),
            },
        },
    });
    return (0, jsx_runtime_1.jsx)("div", { style: styles.picker });
};
exports.GooglePointerCircle = GooglePointerCircle;
exports.default = exports.GooglePointerCircle;
