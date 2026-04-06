"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoshopPreviews = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var PhotoshopPreviews = function (_a) {
    var rgb = _a.rgb, currentColor = _a.currentColor;
    var styles = (0, reactcss_1.default)({
        default: {
            swatches: {
                border: '1px solid #B3B3B3',
                borderBottom: '1px solid #F0F0F0',
                marginBottom: '2px',
                marginTop: '1px',
            },
            new: {
                height: '34px',
                background: "rgb(".concat(rgb.r, ",").concat(rgb.g, ", ").concat(rgb.b, ")"),
                boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000',
            },
            current: {
                height: '34px',
                background: currentColor,
                boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000',
            },
            label: {
                fontSize: '14px',
                color: '#000',
                textAlign: 'center',
            },
        },
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "new" }), (0, jsx_runtime_1.jsxs)("div", { style: styles.swatches, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.new }), (0, jsx_runtime_1.jsx)("div", { style: styles.current })] }), (0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "current" })] }));
};
exports.PhotoshopPreviews = PhotoshopPreviews;
exports.default = exports.PhotoshopPreviews;
