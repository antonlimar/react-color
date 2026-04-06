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
exports.getSaturationRenderWindow = void 0;
exports.Saturation = Saturation;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var throttle_1 = __importDefault(require("lodash/throttle"));
var saturation = __importStar(require("../../helpers/saturation"));
var SATURATION_WHITE_GRADIENT = 'linear-gradient(to right, #fff, rgba(255,255,255,0))';
var SATURATION_BLACK_GRADIENT = 'linear-gradient(to top, #000, rgba(0,0,0,0))';
var getSaturationRenderWindow = function (container) { var _a, _b; return (_b = (_a = container === null || container === void 0 ? void 0 : container.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) !== null && _b !== void 0 ? _b : window; };
exports.getSaturationRenderWindow = getSaturationRenderWindow;
function Saturation(props) {
    var hsl = props.hsl, hsv = props.hsv, onChange = props.onChange, pointer = props.pointer, radius = props.radius, shadow = props.shadow, style = props.style;
    var containerRef = (0, react_1.useRef)(null);
    var throttledChangeRef = (0, react_1.useRef)((0, throttle_1.default)(function (fn, data, event) {
        fn(data, event);
    }, 50));
    var _a = (0, react_1.useState)(false), isDragging = _a[0], setIsDragging = _a[1];
    var handleChange = (0, react_1.useCallback)(function (event) {
        if (!containerRef.current || typeof onChange !== 'function') {
            return;
        }
        throttledChangeRef.current(onChange, saturation.calculateChange(event, hsl, containerRef.current), event);
    }, [hsl, onChange]);
    var handleMouseDown = function (event) {
        handleChange(event);
        setIsDragging(true);
    };
    (0, react_1.useEffect)(function () {
        var throttledChange = throttledChangeRef.current;
        return function () {
            throttledChange.cancel();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (!isDragging) {
            return;
        }
        var renderWindow = (0, exports.getSaturationRenderWindow)(containerRef.current);
        var handleWindowMouseMove = function (event) {
            handleChange(event);
        };
        var handleWindowMouseUp = function () {
            setIsDragging(false);
        };
        renderWindow.addEventListener('mousemove', handleWindowMouseMove);
        renderWindow.addEventListener('mouseup', handleWindowMouseUp);
        return function () {
            renderWindow.removeEventListener('mousemove', handleWindowMouseMove);
            renderWindow.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleChange, isDragging]);
    var _b = style || {}, color = _b.color, white = _b.white, black = _b.black, pointerStyle = _b.pointer, circle = _b.circle;
    var styles = (0, reactcss_1.default)({
        default: {
            color: {
                absolute: '0px 0px 0px 0px',
                background: "hsl(".concat(hsl.h, ",100%, 50%)"),
                borderRadius: radius,
            },
            white: {
                absolute: '0px 0px 0px 0px',
                borderRadius: radius,
                background: SATURATION_WHITE_GRADIENT,
            },
            black: {
                absolute: '0px 0px 0px 0px',
                boxShadow: shadow,
                borderRadius: radius,
                background: SATURATION_BLACK_GRADIENT,
            },
            pointer: {
                position: 'absolute',
                top: "".concat(-(hsv.v * 100) + 100, "%"),
                left: "".concat(hsv.s * 100, "%"),
                cursor: 'default',
            },
            circle: {
                width: '4px',
                height: '4px',
                boxShadow: "0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),\n            0 0 1px 2px rgba(0,0,0,.4)",
                borderRadius: '50%',
                cursor: 'hand',
                transform: 'translate(-2px, -2px)',
            },
        },
        custom: {
            color: color,
            white: white,
            black: black,
            pointer: pointerStyle,
            circle: circle,
        },
    }, { custom: !!style });
    var Pointer = pointer;
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.color, ref: containerRef, onMouseDown: handleMouseDown, onTouchMove: handleChange, onTouchStart: handleChange, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.white, className: "saturation-white", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.black, className: "saturation-black" }), (0, jsx_runtime_1.jsx)("div", { style: styles.pointer, children: Pointer ? (0, jsx_runtime_1.jsx)(Pointer, __assign({}, props)) : (0, jsx_runtime_1.jsx)("div", { style: styles.circle }) })] }) }));
}
exports.default = Saturation;
