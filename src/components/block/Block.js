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
exports.Block = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var BlockSwatches_1 = __importDefault(require("./BlockSwatches"));
var handleHexChange = function (onChange, hexCode, event) {
    if (color.isValidHex(hexCode)) {
        onChange({
            hex: hexCode,
            source: 'hex',
        }, event);
    }
};
var Block = function (_a) {
    var onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, hex = _a.hex, _b = _a.colors, colors = _b === void 0 ? ['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8'] : _b, _c = _a.width, width = _c === void 0 ? 170 : _c, _d = _a.triangle, triangle = _d === void 0 ? 'top' : _d, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var transparent = hex === 'transparent';
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            card: {
                width: width,
                background: '#fff',
                boxShadow: '0 1px rgba(0,0,0,.1)',
                borderRadius: '6px',
                position: 'relative',
            },
            head: {
                height: '110px',
                background: hex,
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            },
            body: {
                padding: '10px',
            },
            label: {
                fontSize: '18px',
                color: color.getContrastingColor(hex),
                position: 'relative',
            },
            triangle: {
                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '0 10px 10px 10px',
                borderColor: "transparent transparent ".concat(hex, " transparent"),
                position: 'absolute',
                top: '-10px',
                left: '50%',
                marginLeft: '-10px',
            },
            input: {
                width: '100%',
                fontSize: '12px',
                color: '#666',
                border: '0px',
                outline: 'none',
                height: '22px',
                boxShadow: 'inset 0 0 0 1px #ddd',
                borderRadius: '4px',
                padding: '0 7px',
                boxSizing: 'border-box',
            },
        },
        'hide-triangle': {
            triangle: {
                display: 'none',
            },
        },
    }, passedStyles), { 'hide-triangle': triangle === 'hide' });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.card, className: "block-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.triangle }), (0, jsx_runtime_1.jsxs)("div", { style: styles.head, children: [transparent ? (0, jsx_runtime_1.jsx)(common_1.Checkboard, { borderRadius: "6px 6px 0 0" }) : null, (0, jsx_runtime_1.jsx)("div", { style: styles.label, children: hex })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.body, children: [(0, jsx_runtime_1.jsx)(BlockSwatches_1.default, { colors: colors, onClick: function (hexCode, event) { return handleHexChange(onChange, hexCode, event); }, onSwatchHover: onSwatchHover }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input }, value: hex, onChange: function (value, event) { return handleHexChange(onChange, String(value), event); } })] })] }));
};
exports.Block = Block;
exports.default = (0, common_1.ColorWrap)(exports.Block);
