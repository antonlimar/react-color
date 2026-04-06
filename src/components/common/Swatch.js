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
exports.Swatch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var interaction_1 = require("../../helpers/interaction");
var Checkboard_1 = __importDefault(require("./Checkboard"));
var ENTER = 13;
var Swatch = function (_a) {
    var color = _a.color, style = _a.style, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b, onHover = _a.onHover, _c = _a.title, title = _c === void 0 ? color : _c, children = _a.children, focus = _a.focus, _d = _a.focusStyle, focusStyle = _d === void 0 ? {} : _d;
    var transparent = color === 'transparent';
    var styles = (0, reactcss_1.default)({
        default: {
            swatch: __assign(__assign({ background: color, height: '100%', width: '100%', cursor: 'pointer', position: 'relative', outline: 'none' }, style), (focus ? focusStyle : {})),
        },
    });
    var swatchStyle = styles.swatch || {};
    var handleClick = function (event) { return onClick(color, event); };
    var handleKeyDown = function (event) { return event.keyCode === ENTER && onClick(color, event); };
    var handleHover = function (event) { return onHover === null || onHover === void 0 ? void 0 : onHover(color, event); };
    var optionalEvents = onHover ? { onMouseOver: handleHover } : {};
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: swatchStyle, onClick: handleClick, title: title, tabIndex: 0, onKeyDown: handleKeyDown }, optionalEvents, { children: [children, transparent && ((0, jsx_runtime_1.jsx)(Checkboard_1.default, { borderRadius: swatchStyle.borderRadius, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }))] })));
};
exports.Swatch = Swatch;
exports.default = (0, interaction_1.handleFocus)(exports.Swatch);
