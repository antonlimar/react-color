"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuePointer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var HuePointer = function (_a) {
    var direction = _a.direction;
    var styles = (0, reactcss_1.default)({
        default: {
            picker: {
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                transform: 'translate(-9px, -1px)',
                backgroundColor: 'rgb(248, 248, 248)',
                boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
            },
        },
        vertical: {
            picker: {
                transform: 'translate(-3px, -9px)',
            },
        },
    }, { vertical: direction === 'vertical' });
    return (0, jsx_runtime_1.jsx)("div", { style: styles.picker });
};
exports.HuePointer = HuePointer;
exports.default = exports.HuePointer;
