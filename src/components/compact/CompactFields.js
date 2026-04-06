"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactFields = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var common_1 = require("../common");
var CompactFields = function (_a) {
    var hex = _a.hex, rgb = _a.rgb, onChange = _a.onChange;
    var styles = (0, reactcss_1.default)({
        default: {
            fields: {
                display: 'flex',
                paddingBottom: '6px',
                paddingRight: '5px',
                position: 'relative',
            },
            active: {
                position: 'absolute',
                top: '6px',
                left: '5px',
                height: '9px',
                width: '9px',
                background: hex,
            },
            HEXwrap: {
                flex: '6',
                position: 'relative',
            },
            HEXinput: {
                width: '80%',
                padding: '0px',
                paddingLeft: '20%',
                border: 'none',
                outline: 'none',
                background: 'none',
                fontSize: '12px',
                color: '#333',
                height: '16px',
            },
            HEXlabel: {
                display: 'none',
            },
            RGBwrap: {
                flex: '3',
                position: 'relative',
            },
            RGBinput: {
                width: '70%',
                padding: '0px',
                paddingLeft: '30%',
                border: 'none',
                outline: 'none',
                background: 'none',
                fontSize: '12px',
                color: '#333',
                height: '16px',
            },
            RGBlabel: {
                position: 'absolute',
                top: '3px',
                left: '0px',
                lineHeight: '16px',
                textTransform: 'uppercase',
                fontSize: '12px',
                color: '#999',
            },
        },
    });
    var handleChange = function (data, event) {
        if (data.r || data.g || data.b) {
            onChange({
                r: data.r || rgb.r,
                g: data.g || rgb.g,
                b: data.b || rgb.b,
                source: 'rgb',
            }, event);
        }
        else {
            onChange({
                hex: data.hex,
                source: 'hex',
            }, event);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.fields, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.active }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.HEXwrap, input: styles.HEXinput, label: styles.HEXlabel }, label: "hex", value: hex, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "r", value: rgb.r, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "g", value: rgb.g, onChange: function (value, event) { return handleChange(value, event); } }), (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "b", value: rgb.b, onChange: function (value, event) { return handleChange(value, event); } })] }));
};
exports.CompactFields = CompactFields;
exports.default = exports.CompactFields;
