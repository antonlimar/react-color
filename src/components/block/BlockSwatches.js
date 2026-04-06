"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockSwatches = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var common_1 = require("../common");
var BlockSwatches = function (_a) {
    var colors = _a.colors, onClick = _a.onClick, onSwatchHover = _a.onSwatchHover;
    var styles = (0, reactcss_1.default)({
        default: {
            swatches: {
                marginRight: '-10px',
            },
            swatch: {
                width: '22px',
                height: '22px',
                float: 'left',
                marginRight: '10px',
                marginBottom: '10px',
                borderRadius: '4px',
            },
            clear: {
                clear: 'both',
            },
        },
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.swatches, children: [(0, map_1.default)(colors, function (colorValue) { return ((0, jsx_runtime_1.jsx)(common_1.Swatch, { color: colorValue, style: styles.swatch, onClick: onClick, onHover: onSwatchHover, focusStyle: {
                    boxShadow: "0 0 4px ".concat(colorValue),
                } }, colorValue)); }), (0, jsx_runtime_1.jsx)("div", { style: styles.clear })] }));
};
exports.BlockSwatches = BlockSwatches;
exports.default = exports.BlockSwatches;
