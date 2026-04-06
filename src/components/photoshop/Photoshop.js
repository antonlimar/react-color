"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photoshop = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var PhotoshopFields_1 = __importDefault(require("./PhotoshopFields"));
var PhotoshopPointerCircle_1 = __importDefault(require("./PhotoshopPointerCircle"));
var PhotoshopPointer_1 = __importDefault(require("./PhotoshopPointer"));
var PhotoshopButton_1 = __importDefault(require("./PhotoshopButton"));
var PhotoshopPreviews_1 = __importDefault(require("./PhotoshopPreviews"));
var defaultHeader = 'Color Picker';
var defaultStyles = {};
var Photoshop = function (props) {
    var _a, _b;
    var currentColor = (0, react_1.useState)(props.hex)[0];
    var resolvedProps = __assign(__assign({}, props), { header: (_a = props.header) !== null && _a !== void 0 ? _a : defaultHeader, styles: (_b = props.styles) !== null && _b !== void 0 ? _b : defaultStyles });
    var passedStyles = resolvedProps.styles, _c = resolvedProps.className, className = _c === void 0 ? '' : _c;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            picker: {
                background: '#DCDCDC',
                borderRadius: '4px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)',
                boxSizing: 'initial',
                width: '513px',
            },
            head: {
                backgroundImage: 'linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)',
                borderBottom: '1px solid #B1B1B1',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)',
                height: '23px',
                lineHeight: '24px',
                borderRadius: '4px 4px 0 0',
                fontSize: '13px',
                color: '#4D4D4D',
                textAlign: 'center',
            },
            body: {
                padding: '15px 15px 0',
                display: 'flex',
            },
            saturation: {
                width: '256px',
                height: '256px',
                position: 'relative',
                border: '2px solid #B3B3B3',
                borderBottom: '2px solid #F0F0F0',
                overflow: 'hidden',
            },
            hue: {
                position: 'relative',
                height: '256px',
                width: '19px',
                marginLeft: '10px',
                border: '2px solid #B3B3B3',
                borderBottom: '2px solid #F0F0F0',
            },
            controls: {
                width: '180px',
                marginLeft: '10px',
            },
            top: {
                display: 'flex',
            },
            previews: {
                width: '60px',
            },
            actions: {
                flex: '1',
                marginLeft: '20px',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.picker, className: "photoshop-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.head, children: resolvedProps.header }), (0, jsx_runtime_1.jsxs)("div", { style: styles.body, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.saturation, children: (0, jsx_runtime_1.jsx)(common_1.Saturation, { hsl: resolvedProps.hsl, hsv: resolvedProps.hsv, pointer: PhotoshopPointerCircle_1.default, onChange: resolvedProps.onChange }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)(common_1.Hue, { direction: "vertical", hsl: resolvedProps.hsl, pointer: PhotoshopPointer_1.default, onChange: resolvedProps.onChange }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.controls, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.top, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.previews, children: (0, jsx_runtime_1.jsx)(PhotoshopPreviews_1.default, { rgb: resolvedProps.rgb, currentColor: currentColor }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.actions, children: [(0, jsx_runtime_1.jsx)(PhotoshopButton_1.default, { label: "OK", onClick: function () { var _a; return (_a = resolvedProps.onAccept) === null || _a === void 0 ? void 0 : _a.call(resolvedProps, resolvedProps, undefined); }, active: true }), (0, jsx_runtime_1.jsx)(PhotoshopButton_1.default, { label: "Cancel", onClick: resolvedProps.onCancel }), (0, jsx_runtime_1.jsx)(PhotoshopFields_1.default, { onChange: resolvedProps.onChange, rgb: resolvedProps.rgb, hsv: resolvedProps.hsv, hex: resolvedProps.hex })] })] }) })] })] }));
};
exports.Photoshop = Photoshop;
exports.default = (0, common_1.ColorWrap)(exports.Photoshop);
