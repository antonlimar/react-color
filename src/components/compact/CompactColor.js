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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactColor = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var colorUtils = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var CompactColor = function (_a) {
    var color = _a.color, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b, onSwatchHover = _a.onSwatchHover, active = _a.active;
    var styles = (0, reactcss_1.default)({
        default: {
            color: {
                background: color,
                width: '15px',
                height: '15px',
                float: 'left',
                marginRight: '5px',
                marginBottom: '5px',
                position: 'relative',
                cursor: 'pointer',
            },
            dot: {
                absolute: '5px 5px 5px 5px',
                background: colorUtils.getContrastingColor(color),
                borderRadius: '50%',
                opacity: '0',
            },
        },
        active: {
            dot: {
                opacity: '1',
            },
        },
        'color-#FFFFFF': {
            color: {
                boxShadow: 'inset 0 0 0 1px #ddd',
            },
            dot: {
                background: '#000',
            },
        },
        transparent: {
            dot: {
                background: '#000',
            },
        },
    }, { active: active, 'color-#FFFFFF': color === '#FFFFFF', transparent: color === 'transparent' });
    return ((0, jsx_runtime_1.jsx)(common_1.Swatch, { style: styles.color, color: color, onClick: onClick, onHover: onSwatchHover, focusStyle: { boxShadow: "0 0 4px ".concat(color) }, children: (0, jsx_runtime_1.jsx)("div", { style: styles.dot }) }));
};
exports.CompactColor = CompactColor;
exports.default = exports.CompactColor;
