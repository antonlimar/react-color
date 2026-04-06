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
exports.PhotoshopFields = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var PhotoshopFields = function (_a) {
    var onChange = _a.onChange, rgb = _a.rgb, hsv = _a.hsv, hex = _a.hex;
    var styles = (0, reactcss_1.default)({
        default: {
            fields: {
                paddingTop: '5px',
                paddingBottom: '9px',
                width: '80px',
                position: 'relative',
            },
            divider: {
                height: '5px',
            },
            RGBwrap: {
                position: 'relative',
            },
            RGBinput: {
                marginLeft: '40%',
                width: '40%',
                height: '18px',
                border: '1px solid #888888',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
                marginBottom: '5px',
                fontSize: '13px',
                paddingLeft: '3px',
                marginRight: '10px',
            },
            RGBlabel: {
                left: '0px',
                top: '0px',
                width: '34px',
                textTransform: 'uppercase',
                fontSize: '13px',
                height: '18px',
                lineHeight: '22px',
                position: 'absolute',
            },
            HEXwrap: {
                position: 'relative',
            },
            HEXinput: {
                marginLeft: '20%',
                width: '80%',
                height: '18px',
                border: '1px solid #888888',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
                marginBottom: '6px',
                fontSize: '13px',
                paddingLeft: '3px',
            },
            HEXlabel: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '14px',
                textTransform: 'uppercase',
                fontSize: '13px',
                height: '18px',
                lineHeight: '22px',
            },
            fieldSymbols: {
                position: 'absolute',
                top: '5px',
                right: '-7px',
                fontSize: '13px',
            },
            symbol: {
                height: '20px',
                lineHeight: '22px',
                paddingBottom: '7px',
            },
        },
    });
    var handleChange = function (data, event) {
        if (data['#']) {
            if (color.isValidHex(data['#'])) {
                onChange({
                    hex: data['#'],
                    source: 'hex',
                }, event);
            }
        }
        else if (data.r || data.g || data.b) {
            onChange({
                r: data.r || rgb.r,
                g: data.g || rgb.g,
                b: data.b || rgb.b,
                source: 'rgb',
            }, event);
        }
        else if (data.h || data.s || data.v) {
            onChange({
                h: data.h || hsv.h,
                s: data.s || hsv.s,
                v: data.v || hsv.v,
                source: 'hsv',
            }, event);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.fields, children: [(0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "h", value: Math.round(hsv.h), onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "s", value: Math.round(hsv.s * 100), onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "v", value: Math.round(hsv.v * 100), onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)("div", { style: styles.divider }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "r", value: rgb.r, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "g", value: rgb.g, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "b", value: rgb.b, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)("div", { style: styles.divider }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.HEXwrap, input: styles.HEXinput, label: styles.HEXlabel }, label: "#", value: hex.replace('#', ''), onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsxs)("div", { style: styles.fieldSymbols, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.symbol, children: "\u00B0" }), (0, jsx_runtime_1.jsx)("div", { style: styles.symbol, children: "%" }), (0, jsx_runtime_1.jsx)("div", { style: styles.symbol, children: "%" })] })] }));
};
exports.PhotoshopFields = PhotoshopFields;
exports.default = exports.PhotoshopFields;
