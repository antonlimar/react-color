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
exports.SketchFields = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var SketchFields = function (_a) {
    var onChange = _a.onChange, rgb = _a.rgb, hsl = _a.hsl, hex = _a.hex, disableAlpha = _a.disableAlpha;
    var styles = (0, reactcss_1.default)({
        default: {
            fields: {
                display: 'flex',
                paddingTop: '4px',
            },
            single: {
                flex: '1',
                paddingLeft: '6px',
            },
            alpha: {
                flex: '1',
                paddingLeft: '6px',
            },
            double: {
                flex: '2',
            },
            input: {
                width: '80%',
                padding: '4px 10% 3px',
                border: 'none',
                boxShadow: 'inset 0 0 0 1px #ccc',
                fontSize: '11px',
            },
            label: {
                display: 'block',
                textAlign: 'center',
                fontSize: '11px',
                color: '#222',
                paddingTop: '3px',
                paddingBottom: '4px',
                textTransform: 'capitalize',
            },
        },
        disableAlpha: {
            alpha: {
                display: 'none',
            },
        },
    }, { disableAlpha: disableAlpha });
    var handleChange = function (data, event) {
        if (data.hex) {
            if (color.isValidHex(data.hex)) {
                onChange({
                    hex: data.hex,
                    source: 'hex',
                }, event);
            }
        }
        else if (data.r || data.g || data.b) {
            onChange({
                r: data.r || rgb.r,
                g: data.g || rgb.g,
                b: data.b || rgb.b,
                a: rgb.a,
                source: 'rgb',
            }, event);
        }
        else if (!isNaN(Number(data.a))) {
            var alpha = Number(data.a);
            if (alpha < 0) {
                alpha = 0;
            }
            else if (alpha > 100) {
                alpha = 100;
            }
            onChange({
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: alpha / 100,
                source: 'rgb',
            }, event);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.fields, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.double, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "hex", value: hex.replace('#', ''), onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "r", value: rgb.r, onChange: function (value, event) { return handleChange(value, event); }, dragLabel: true, dragMax: 255 }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "g", value: rgb.g, onChange: function (value, event) { return handleChange(value, event); }, dragLabel: true, dragMax: 255 }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "b", value: rgb.b, onChange: function (value, event) { return handleChange(value, event); }, dragLabel: true, dragMax: 255 }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.alpha, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "a", value: Math.round(rgb.a * 100), onChange: function (value, event) { return handleChange(value, event); }, dragLabel: true, dragMax: 100 }) })] }));
};
exports.SketchFields = SketchFields;
exports.default = exports.SketchFields;
