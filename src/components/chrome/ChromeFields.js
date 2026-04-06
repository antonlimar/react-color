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
exports.ChromeFields = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var color = __importStar(require("../../helpers/color"));
var isUndefined_1 = __importDefault(require("lodash/isUndefined"));
var common_1 = require("../common");
var UnfoldMoreHorizontalIcon_1 = __importDefault(require("../common/icons/UnfoldMoreHorizontalIcon"));
var ChromeFields = function (props) {
    var _a = (0, react_1.useState)(function () {
        return props.hsl.a !== 1 && props.view === 'hex' ? 'rgb' : props.view || 'hex';
    }), view = _a[0], setView = _a[1];
    var resolvedView = props.hsl.a !== 1 && view === 'hex' ? 'rgb' : view;
    var toggleViews = function () {
        if (resolvedView === 'hex') {
            setView('rgb');
        }
        else if (resolvedView === 'rgb') {
            setView('hsl');
        }
        else if (props.hsl.a === 1) {
            setView('hex');
        }
        else {
            setView('rgb');
        }
    };
    var handleChange = function (data, event) {
        if (data.hex) {
            if (color.isValidHex(data.hex)) {
                props.onChange({
                    hex: data.hex,
                    source: 'hex',
                }, event);
            }
        }
        else if (data.r || data.g || data.b) {
            props.onChange({
                r: data.r || props.rgb.r,
                g: data.g || props.rgb.g,
                b: data.b || props.rgb.b,
                source: 'rgb',
            }, event);
        }
        else if (!(0, isUndefined_1.default)(data.a)) {
            var alpha = Number(data.a);
            if (alpha < 0) {
                alpha = 0;
            }
            else if (alpha > 1) {
                alpha = 1;
            }
            props.onChange({
                h: props.hsl.h,
                s: props.hsl.s,
                l: props.hsl.l,
                a: Math.round(alpha * 100) / 100,
                source: 'rgb',
            }, event);
        }
        else if (!(0, isUndefined_1.default)(data.h) || !(0, isUndefined_1.default)(data.s) || !(0, isUndefined_1.default)(data.l)) {
            var saturation = typeof data.s === 'string' && data.s.indexOf('%') > -1 ? data.s.replace('%', '') : data.s;
            var lightness = typeof data.l === 'string' && data.l.indexOf('%') > -1 ? data.l.replace('%', '') : data.l;
            var nextSaturation = Number(!(0, isUndefined_1.default)(saturation) ? saturation : props.hsl.s);
            var nextLightness = Number(!(0, isUndefined_1.default)(lightness) ? lightness : props.hsl.l);
            if (nextSaturation === 1) {
                nextSaturation = 0.01;
            }
            else if (nextLightness === 1) {
                nextLightness = 0.01;
            }
            props.onChange({
                h: Number(!(0, isUndefined_1.default)(data.h) ? data.h : props.hsl.h),
                s: nextSaturation,
                l: nextLightness,
                source: 'hsl',
            }, event);
        }
    };
    var styles = (0, reactcss_1.default)({
        default: {
            wrap: {
                paddingTop: '16px',
                display: 'flex',
            },
            fields: {
                flex: '1',
                display: 'flex',
                marginLeft: '-6px',
            },
            field: {
                paddingLeft: '6px',
                width: '100%',
            },
            alpha: {
                paddingLeft: '6px',
                width: '100%',
            },
            toggle: {
                width: '32px',
                textAlign: 'right',
                position: 'relative',
            },
            icon: {
                marginRight: '-4px',
                marginTop: '12px',
                cursor: 'pointer',
                position: 'relative',
            },
            input: {
                fontSize: '11px',
                color: '#333',
                width: '100%',
                borderRadius: '2px',
                border: 'none',
                boxShadow: 'inset 0 0 0 1px #dadada',
                height: '21px',
                textAlign: 'center',
            },
            label: {
                textTransform: 'uppercase',
                fontSize: '11px',
                lineHeight: '11px',
                color: '#969696',
                textAlign: 'center',
                display: 'block',
                marginTop: '12px',
            },
            svg: {
                fill: '#333',
                width: '24px',
                height: '24px',
                border: '1px transparent solid',
                borderRadius: '5px',
            },
        },
        disableAlpha: {
            alpha: {
                display: 'none',
            },
        },
    }, props, { view: resolvedView });
    var fields;
    if (resolvedView === 'hex') {
        fields = ((0, jsx_runtime_1.jsx)("div", { style: styles.fields, className: "flexbox-fix", children: (0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "hex", value: props.hex, onChange: function (value, event) { return handleChange(value, event); } }) }) }));
    }
    else if (resolvedView === 'rgb') {
        fields = ((0, jsx_runtime_1.jsxs)("div", { style: styles.fields, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "r", value: props.rgb.r, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "g", value: props.rgb.g, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "b", value: props.rgb.b, onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.alpha, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "a", value: props.rgb.a, arrowOffset: 0.01, onChange: function (value, event) { return handleChange(value, event); } }) })] }));
    }
    else {
        fields = ((0, jsx_runtime_1.jsxs)("div", { style: styles.fields, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "h", value: Math.round(props.hsl.h), onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "s", value: "".concat(Math.round(props.hsl.s * 100), "%"), onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.field, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "l", value: "".concat(Math.round(props.hsl.l * 100), "%"), onChange: function (value, event) { return handleChange(value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.alpha, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { input: styles.input, label: styles.label }, label: "a", value: props.hsl.a, arrowOffset: 0.01, onChange: function (value, event) { return handleChange(value, event); } }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.wrap, className: "flexbox-fix", children: [fields, (0, jsx_runtime_1.jsx)("div", { style: styles.toggle, children: (0, jsx_runtime_1.jsx)("div", { style: styles.icon, onClick: toggleViews, children: (0, jsx_runtime_1.jsx)(UnfoldMoreHorizontalIcon_1.default, { style: styles.svg }) }) })] }));
};
exports.ChromeFields = ChromeFields;
exports.default = exports.ChromeFields;
