"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromePointerCircle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var ChromePointerCircle = function () {
    var styles = (0, reactcss_1.default)({
        default: {
            picker: {
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                boxShadow: 'inset 0 0 0 1px #fff',
                transform: 'translate(-6px, -6px)',
            },
        },
    });
    return (0, jsx_runtime_1.jsx)("div", { style: styles.picker });
};
exports.ChromePointerCircle = ChromePointerCircle;
exports.default = exports.ChromePointerCircle;
