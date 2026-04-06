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
exports.GoogleFields = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var normalizeAngleValue = function (value) { return value.replace('°', ''); };
var normalizePercentValue = function (value) { return value.replace('%', ''); };
var GoogleFields = function (_a) {
    var onChange = _a.onChange, rgb = _a.rgb, hsl = _a.hsl, hex = _a.hex, hsv = _a.hsv;
    var handleChange = function (data, event) {
        if (typeof data.hex === 'string') {
            if (color.isValidHex(data.hex)) {
                onChange({
                    hex: data.hex,
                    source: 'hex',
                }, event);
            }
        }
        else if (typeof data.rgb === 'string') {
            var values = data.rgb.split(',');
            if (color.isvalidColorString(data.rgb, 'rgb')) {
                onChange({
                    r: Number(values[0]),
                    g: Number(values[1]),
                    b: Number(values[2]),
                    a: 1,
                    source: 'rgb',
                }, event);
            }
        }
        else if (typeof data.hsv === 'string') {
            var values = data.hsv.split(',');
            if (color.isvalidColorString(data.hsv, 'hsv')) {
                var normalizedHsv = [
                    normalizeAngleValue(values[0]),
                    normalizePercentValue(values[1]),
                    normalizePercentValue(values[2]),
                ];
                if (normalizedHsv[1] === '1') {
                    normalizedHsv[1] = '0.01';
                }
                else if (normalizedHsv[2] === '1') {
                    normalizedHsv[2] = '0.01';
                }
                onChange({
                    h: Number(normalizedHsv[0]),
                    s: Number(normalizedHsv[1]),
                    v: Number(normalizedHsv[2]),
                    source: 'hsv',
                }, event);
            }
        }
        else if (typeof data.hsl === 'string') {
            var values = data.hsl.split(',');
            if (color.isvalidColorString(data.hsl, 'hsl')) {
                var normalizedHsl = [
                    normalizeAngleValue(values[0]),
                    normalizePercentValue(values[1]),
                    normalizePercentValue(values[2]),
                ];
                if (normalizedHsl[1] === '1') {
                    normalizedHsl[1] = '0.01';
                }
                else if (normalizedHsl[2] === '1') {
                    normalizedHsl[2] = '0.01';
                }
                onChange({
                    h: Number(normalizedHsl[0]),
                    s: Number(normalizedHsl[1]),
                    l: Number(normalizedHsl[2]),
                    source: 'hsl',
                }, event);
            }
        }
    };
    var styles = (0, reactcss_1.default)({
        default: {
            wrap: {
                display: 'flex',
                height: '100px',
                marginTop: '4px',
            },
            fields: {
                width: '100%',
            },
            column: {
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
            },
            double: {
                padding: '0px 4.4px',
                boxSizing: 'border-box',
            },
            input: {
                width: '100%',
                height: '38px',
                boxSizing: 'border-box',
                padding: '4px 10% 3px',
                textAlign: 'center',
                border: '1px solid #dadce0',
                fontSize: '11px',
                textTransform: 'lowercase',
                borderRadius: '5px',
                outline: 'none',
                fontFamily: 'Roboto,Arial,sans-serif',
            },
            input2: {
                height: '38px',
                width: '100%',
                border: '1px solid #dadce0',
                boxSizing: 'border-box',
                fontSize: '11px',
                textTransform: 'lowercase',
                borderRadius: '5px',
                outline: 'none',
                paddingLeft: '10px',
                fontFamily: 'Roboto,Arial,sans-serif',
            },
            label: {
                textAlign: 'center',
                fontSize: '12px',
                background: '#fff',
                position: 'absolute',
                textTransform: 'uppercase',
                color: '#3c4043',
                width: '35px',
                top: '-6px',
                left: '0',
                right: '0',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontFamily: 'Roboto,Arial,sans-serif',
            },
            label2: {
                left: '10px',
                textAlign: 'center',
                fontSize: '12px',
                background: '#fff',
                position: 'absolute',
                textTransform: 'uppercase',
                color: '#3c4043',
                width: '32px',
                top: '-6px',
                fontFamily: 'Roboto,Arial,sans-serif',
            },
            single: {
                flexGrow: '1',
                margin: '0px 4.4px',
            },
        },
    });
    var rgbValue = "".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b);
    var hslValue = "".concat(Math.round(hsl.h), "\u00B0, ").concat(Math.round(hsl.s * 100), "%, ").concat(Math.round(hsl.l * 100), "%");
    var hsvValue = "".concat(Math.round(hsv.h), "\u00B0, ").concat(Math.round(hsv.s * 100), "%, ").concat(Math.round(hsv.v * 100), "%");
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.wrap, className: "flexbox-fix", children: (0, jsx_runtime_1.jsxs)("div", { style: styles.fields, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.double, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "hex", value: hex, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.column, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input2, label: styles.label2 }, label: "rgb", value: rgbValue, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input2, label: styles.label2 }, label: "hsv", value: hsvValue, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.single, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input2, label: styles.label2 }, label: "hsl", value: hslValue, onChange: function (value, event) { return handleChange(value, event); } }) })] })] }) }));
};
exports.GoogleFields = GoogleFields;
exports.default = exports.GoogleFields;
