"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleSwatch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importStar(require("reactcss"));
var common_1 = require("../common");
var CircleSwatch = function (_a) {
    var color = _a.color, onClick = _a.onClick, onSwatchHover = _a.onSwatchHover, hover = _a.hover, active = _a.active, _b = _a.circleSize, circleSize = _b === void 0 ? 28 : _b, _c = _a.circleSpacing, circleSpacing = _c === void 0 ? 14 : _c;
    var styles = (0, reactcss_1.default)({
        default: {
            swatch: {
                width: circleSize,
                height: circleSize,
                marginRight: circleSpacing,
                marginBottom: circleSpacing,
                transform: 'scale(1)',
                transition: '100ms transform ease',
            },
            Swatch: {
                borderRadius: '50%',
                background: 'transparent',
                boxShadow: "inset 0 0 0 ".concat(circleSize / 2 + 1, "px ").concat(color),
                transition: '100ms box-shadow ease',
            },
        },
        hover: {
            swatch: {
                transform: 'scale(1.2)',
            },
        },
        active: {
            Swatch: {
                boxShadow: "inset 0 0 0 3px ".concat(color),
            },
        },
    }, { hover: hover, active: active });
    var circleStyle = styles.Swatch || {};
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.swatch, children: (0, jsx_runtime_1.jsx)(common_1.Swatch, { style: circleStyle, color: color, onClick: onClick, onHover: onSwatchHover, focusStyle: { boxShadow: "".concat(circleStyle.boxShadow || 'none', ", 0 0 5px ").concat(color) } }) }));
};
exports.CircleSwatch = CircleSwatch;
exports.default = (0, reactcss_1.handleHover)(exports.CircleSwatch);
