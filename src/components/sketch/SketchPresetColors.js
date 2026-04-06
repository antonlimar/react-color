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
exports.SketchPresetColors = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var common_1 = require("../common");
var SketchPresetColors = function (_a) {
    var colors = _a.colors, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b, onSwatchHover = _a.onSwatchHover;
    var styles = (0, reactcss_1.default)({
        default: {
            colors: {
                margin: '0 -10px',
                padding: '10px 0 0 10px',
                borderTop: '1px solid #eee',
                display: 'flex',
                flexWrap: 'wrap',
                position: 'relative',
            },
            swatchWrap: {
                width: '16px',
                height: '16px',
                margin: '0 10px 10px 0',
            },
            swatch: {
                borderRadius: '3px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
            },
        },
        'no-presets': {
            colors: {
                display: 'none',
            },
        },
    }, {
        'no-presets': !colors || !colors.length,
    });
    var handleClick = function (hex, event) {
        onClick({
            hex: hex,
            source: 'hex',
        }, event);
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.colors, className: "flexbox-fix", children: colors.map(function (colorObjOrString) {
            var colorValue = typeof colorObjOrString === 'string' ? { color: colorObjOrString } : colorObjOrString;
            var key = "".concat(colorValue.color).concat(colorValue.title || '');
            return ((0, jsx_runtime_1.jsx)("div", { style: styles.swatchWrap, children: (0, jsx_runtime_1.jsx)(common_1.Swatch, __assign({}, colorValue, { style: styles.swatch, onClick: handleClick, onHover: onSwatchHover, focusStyle: {
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ".concat(colorValue.color),
                    } })) }, key));
        }) }));
};
exports.SketchPresetColors = SketchPresetColors;
exports.default = exports.SketchPresetColors;
