"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderPointer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var SliderPointer = function () {
    var styles = (0, reactcss_1.default)({
        default: {
            picker: {
                width: '14px',
                height: '14px',
                borderRadius: '6px',
                transform: 'translate(-7px, -1px)',
                backgroundColor: 'rgb(248, 248, 248)',
                boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
            },
        },
    });
    return (0, jsx_runtime_1.jsx)("div", { style: styles.picker });
};
exports.SliderPointer = SliderPointer;
exports.default = exports.SliderPointer;
