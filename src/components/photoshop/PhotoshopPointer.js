"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoshopPointer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var PhotoshopPointer = function () {
    var styles = (0, reactcss_1.default)({
        default: {
            triangle: {
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '4px 0 4px 6px',
                borderColor: 'transparent transparent transparent #fff',
                position: 'absolute',
                top: '1px',
                left: '1px',
            },
            triangleBorder: {
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '5px 0 5px 8px',
                borderColor: 'transparent transparent transparent #555',
            },
            left: {
                Extend: 'triangleBorder',
                transform: 'translate(-13px, -4px)',
            },
            leftInside: {
                Extend: 'triangle',
                transform: 'translate(-8px, -5px)',
            },
            right: {
                Extend: 'triangleBorder',
                transform: 'translate(20px, -14px) rotate(180deg)',
            },
            rightInside: {
                Extend: 'triangle',
                transform: 'translate(-8px, -5px)',
            },
        },
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.pointer, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.left, children: (0, jsx_runtime_1.jsx)("div", { style: styles.leftInside }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.right, children: (0, jsx_runtime_1.jsx)("div", { style: styles.rightInside }) })] }));
};
exports.PhotoshopPointer = PhotoshopPointer;
exports.default = exports.PhotoshopPointer;
