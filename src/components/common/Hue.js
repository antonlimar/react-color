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
exports.Hue = Hue;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var hue = __importStar(require("../../helpers/hue"));
var HUE_GRADIENT_HORIZONTAL = 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
var HUE_GRADIENT_VERTICAL = 'linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
function Hue(props) {
    var _a = props.direction, direction = _a === void 0 ? 'horizontal' : _a, hsl = props.hsl, onChange = props.onChange, pointer = props.pointer, radius = props.radius, shadow = props.shadow;
    var containerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), isDragging = _b[0], setIsDragging = _b[1];
    var handleChange = (0, react_1.useCallback)(function (event) {
        if (!containerRef.current) {
            return;
        }
        var change = hue.calculateChange(event, direction, hsl, containerRef.current);
        if (change && typeof onChange === 'function') {
            onChange(change, event);
        }
    }, [direction, hsl, onChange]);
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
            hue: {
                absolute: '0px 0px 0px 0px',
                borderRadius: radius,
                boxShadow: shadow,
            },
            container: {
                padding: '0 2px',
                position: 'relative',
                height: '100%',
                borderRadius: radius,
                background: HUE_GRADIENT_HORIZONTAL,
            },
            pointer: {
                position: 'absolute',
                left: "".concat((hsl.h * 100) / 360, "%"),
            },
            slider: {
                marginTop: '1px',
                width: '4px',
                borderRadius: '1px',
                height: '8px',
                boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
                background: '#fff',
                transform: 'translateX(-2px)',
            },
        },
        vertical: {
            container: {
                background: HUE_GRADIENT_VERTICAL,
            },
            pointer: {
                left: '0px',
                top: "".concat(-((hsl.h * 100) / 360) + 100, "%"),
            },
        },
    }, { vertical: direction === 'vertical' });
    var Pointer = pointer;
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.hue, children: (0, jsx_runtime_1.jsx)("div", { className: "hue-".concat(direction), style: styles.container, ref: containerRef, onMouseDown: handleMouseDown, onTouchMove: handleChange, onTouchStart: handleChange, children: (0, jsx_runtime_1.jsx)("div", { style: styles.pointer, children: Pointer ? (0, jsx_runtime_1.jsx)(Pointer, __assign({}, props)) : (0, jsx_runtime_1.jsx)("div", { style: styles.slider }) }) }) }));
}
exports.default = Hue;
