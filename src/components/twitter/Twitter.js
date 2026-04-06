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
exports.Twitter = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var merge_1 = __importDefault(require("lodash/merge"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var DEFAULT_TWITTER_COLORS = [
    '#FF6900',
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
];
var handleHexChange = function (onChange, hexCode, event) {
    if (color.isValidHex(hexCode)) {
        onChange({
            hex: hexCode,
            source: 'hex',
        }, event);
    }
};
var Twitter = function (_a) {
    var onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, hex = _a.hex, _b = _a.colors, colors = _b === void 0 ? DEFAULT_TWITTER_COLORS : _b, _c = _a.width, width = _c === void 0 ? 276 : _c, _d = _a.triangle, triangle = _d === void 0 ? 'top-left' : _d, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            card: {
                width: width,
                background: '#fff',
                border: '0 solid rgba(0,0,0,0.25)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                borderRadius: '4px',
                position: 'relative',
            },
            body: {
                padding: '15px 9px 9px 15px',
            },
            label: {
                fontSize: '18px',
                color: '#fff',
            },
            triangle: {
                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '0 9px 10px 9px',
                borderColor: 'transparent transparent #fff transparent',
                position: 'absolute',
            },
            triangleShadow: {
                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '0 9px 10px 9px',
                borderColor: 'transparent transparent rgba(0,0,0,.1) transparent',
                position: 'absolute',
            },
            hash: {
                background: '#F0F0F0',
                height: '30px',
                width: '30px',
                borderRadius: '4px 0 0 4px',
                float: 'left',
                color: '#98A1A4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            input: {
                width: '100px',
                fontSize: '14px',
                color: '#666',
                border: '0px',
                outline: 'none',
                height: '28px',
                boxShadow: 'inset 0 0 0 1px #F0F0F0',
                boxSizing: 'content-box',
                borderRadius: '0 4px 4px 0',
                float: 'left',
                paddingLeft: '8px',
            },
            swatch: {
                width: '30px',
                height: '30px',
                float: 'left',
                borderRadius: '4px',
                margin: '0 6px 6px 0',
            },
            clear: {
                clear: 'both',
            },
        },
        'hide-triangle': {
            triangle: {
                display: 'none',
            },
            triangleShadow: {
                display: 'none',
            },
        },
        'top-left-triangle': {
            triangle: {
                top: '-10px',
                left: '12px',
            },
            triangleShadow: {
                top: '-11px',
                left: '12px',
            },
        },
        'top-right-triangle': {
            triangle: {
                top: '-10px',
                right: '12px',
            },
            triangleShadow: {
                top: '-11px',
                right: '12px',
            },
        },
    }, passedStyles), {
        'hide-triangle': triangle === 'hide',
        'top-left-triangle': triangle === 'top-left',
        'top-right-triangle': triangle === 'top-right',
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.card, className: "twitter-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.triangleShadow }), (0, jsx_runtime_1.jsx)("div", { style: styles.triangle }), (0, jsx_runtime_1.jsxs)("div", { style: styles.body, children: [(0, map_1.default)(colors, function (colorValue, index) { return ((0, jsx_runtime_1.jsx)(common_1.Swatch, { color: colorValue, style: styles.swatch, onClick: function (hexCode, event) { return handleHexChange(onChange, hexCode, event); }, onHover: onSwatchHover, focusStyle: {
                            boxShadow: "0 0 4px ".concat(colorValue),
                        } }, index)); }), (0, jsx_runtime_1.jsx)("div", { style: styles.hash, children: "#" }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { label: null, style: { input: styles.input }, value: hex.replace('#', ''), onChange: function (value, event) { return handleHexChange(onChange, String(value), event); } }), (0, jsx_runtime_1.jsx)("div", { style: styles.clear })] })] }));
};
exports.Twitter = Twitter;
exports.default = (0, common_1.ColorWrap)(exports.Twitter);
