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
exports.Compact = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var merge_1 = __importDefault(require("lodash/merge"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var CompactColor_1 = __importDefault(require("./CompactColor"));
var CompactFields_1 = __importDefault(require("./CompactFields"));
var handleCompactChange = function (onChange, data, event) {
    if (data.hex) {
        if (color.isValidHex(data.hex)) {
            onChange({
                hex: data.hex,
                source: 'hex',
            }, event);
        }
    }
    else {
        onChange(data, event);
    }
};
var DEFAULT_COMPACT_COLORS = [
    '#4D4D4D',
    '#999999',
    '#FFFFFF',
    '#F44E3B',
    '#FE9200',
    '#FCDC00',
    '#DBDF00',
    '#A4DD00',
    '#68CCCA',
    '#73D8FF',
    '#AEA1FF',
    '#FDA1FF',
    '#333333',
    '#808080',
    '#cccccc',
    '#D33115',
    '#E27300',
    '#FCC400',
    '#B0BC00',
    '#68BC00',
    '#16A5A5',
    '#009CE0',
    '#7B64FF',
    '#FA28FF',
    '#000000',
    '#666666',
    '#B3B3B3',
    '#9F0500',
    '#C45100',
    '#FB9E00',
    '#808900',
    '#194D33',
    '#0C797D',
    '#0062B1',
    '#653294',
    '#AB149E',
];
var Compact = function (_a) {
    var onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, _b = _a.colors, colors = _b === void 0 ? DEFAULT_COMPACT_COLORS : _b, hex = _a.hex, rgb = _a.rgb, _c = _a.styles, passedStyles = _c === void 0 ? {} : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            Compact: {
                background: '#f6f6f6',
                radius: '4px',
            },
            compact: {
                paddingTop: '5px',
                paddingLeft: '5px',
                boxSizing: 'initial',
                width: '240px',
            },
            clear: {
                clear: 'both',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsx)(common_1.Raised, { style: styles.Compact, styles: passedStyles, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.compact, className: "compact-picker ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, map_1.default)(colors, function (colorValue) { return ((0, jsx_runtime_1.jsx)(CompactColor_1.default, { color: colorValue, active: colorValue.toLowerCase() === hex, onClick: function (swatchColor, event) { return handleCompactChange(onChange, { hex: swatchColor }, event); }, onSwatchHover: onSwatchHover }, colorValue)); }), (0, jsx_runtime_1.jsx)("div", { style: styles.clear })] }), (0, jsx_runtime_1.jsx)(CompactFields_1.default, { hex: hex, rgb: rgb, onChange: function (data, event) { return handleCompactChange(onChange, data, event); } })] }) }));
};
exports.Compact = Compact;
exports.default = (0, common_1.ColorWrap)(exports.Compact);
