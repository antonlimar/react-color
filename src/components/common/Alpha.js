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
exports.Alpha = Alpha;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var alpha = __importStar(require("../../helpers/alpha"));
var Checkboard_1 = __importDefault(require("./Checkboard"));
function Alpha(props) {
    var a = props.a, direction = props.direction, hsl = props.hsl, onChange = props.onChange, pointer = props.pointer, radius = props.radius, renderers = props.renderers, rgb = props.rgb, shadow = props.shadow, style = props.style;
    var containerRef = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(false), isDragging = _a[0], setIsDragging = _a[1];
    var handleChange = (0, react_1.useCallback)(function (event) {
        if (!containerRef.current) {
            return;
        }
        var change = alpha.calculateChange(event, hsl, direction, a, containerRef.current);
        if (change && typeof onChange === 'function') {
            onChange(change, event);
        }
    }, [a, direction, hsl, onChange]);
    var handleMouseDown = function (event) {
        handleChange(event);
        setIsDragging(true);
    };
    (0, react_1.useEffect)(function () {
        if (!isDragging) {
            return;
        }
        var handleWindowMouseMove = function (event) {
            handleChange(event);
        };
        var handleWindowMouseUp = function () {
            setIsDragging(false);
        };
        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
        return function () {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleChange, isDragging]);
    var styles = (0, reactcss_1.default)({
        default: {
            alpha: {
                absolute: '0px 0px 0px 0px',
                borderRadius: radius,
            },
            checkboard: {
                absolute: '0px 0px 0px 0px',
                overflow: 'hidden',
                borderRadius: radius,
            },
            gradient: {
                absolute: '0px 0px 0px 0px',
                background: "linear-gradient(to right, rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ", 0) 0%,\n           rgba(").concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ", 1) 100%)"),
                boxShadow: shadow,
                borderRadius: radius,
            },
            container: {
                position: 'relative',
                height: '100%',
                margin: '0 3px',
            },
            pointer: {
                position: 'absolute',
                left: "".concat(rgb.a * 100, "%"),
            },
            slider: {
                width: '4px',
                borderRadius: '1px',
                height: '8px',
                boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
                background: '#fff',
                marginTop: '1px',
                transform: 'translateX(-2px)',
            },
        },
        vertical: {
            gradient: {
                background: "linear-gradient(to bottom, rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ", 0) 0%,\n           rgba(").concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ", 1) 100%)"),
            },
            pointer: {
                left: 0,
                top: "".concat(rgb.a * 100, "%"),
            },
        },
        overwrite: __assign({}, style),
    }, {
        vertical: direction === 'vertical',
        overwrite: true,
    });
    var Pointer = pointer;
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.alpha, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.checkboard, children: (0, jsx_runtime_1.jsx)(Checkboard_1.default, { renderers: renderers }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.gradient }), (0, jsx_runtime_1.jsx)("div", { style: styles.container, ref: containerRef, onMouseDown: handleMouseDown, onTouchMove: handleChange, onTouchStart: handleChange, children: (0, jsx_runtime_1.jsx)("div", { style: styles.pointer, children: Pointer ? (0, jsx_runtime_1.jsx)(Pointer, __assign({}, props)) : (0, jsx_runtime_1.jsx)("div", { style: styles.slider }) }) })] }));
}
exports.default = Alpha;
