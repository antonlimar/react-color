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
exports.ColorWrap = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var debounce_1 = __importDefault(require("lodash/debounce"));
var color = __importStar(require("../../helpers/color"));
var defaultColor = {
    h: 250,
    s: 0.5,
    l: 0.2,
    a: 1,
};
var getColorWithDefault = function (colorProp) { return colorProp !== null && colorProp !== void 0 ? colorProp : defaultColor; };
var getColorPropKey = function (colorProp) {
    var value = getColorWithDefault(colorProp);
    return typeof value === 'string' ? value : JSON.stringify(value);
};
var getOldHue = function (data, oldHue) {
    if (typeof data === 'object' && data !== null && 'h' in data && typeof data.h === 'number') {
        return data.h;
    }
    return oldHue;
};
var ColorWrap = function (Picker) {
    var ColorPicker = function (props) {
        var onChange = props.onChange, onChangeComplete = props.onChangeComplete, onSwatchHover = props.onSwatchHover;
        var _a = (0, react_1.useState)(function () {
            var resolvedColor = getColorWithDefault(props.color);
            return __assign(__assign({}, color.toState(resolvedColor, 0)), { colorPropKey: getColorPropKey(resolvedColor) });
        }), state = _a[0], setState = _a[1];
        var debounceRef = (0, react_1.useRef)((0, debounce_1.default)(function (fn, data, event) {
            fn(data, event);
        }, 100));
        (0, react_1.useEffect)(function () {
            var debouncedChange = debounceRef.current;
            return function () {
                debouncedChange.cancel();
            };
        }, []);
        var nextColorPropKey = getColorPropKey(props.color);
        var currentState = nextColorPropKey === state.colorPropKey
            ? state
            : __assign(__assign({}, color.toState(getColorWithDefault(props.color), state.oldHue)), { colorPropKey: nextColorPropKey });
        var handleChange = function (data, event) {
            var isValidColor = color.simpleCheckForValidColor(data);
            if (isValidColor) {
                var colors = color.toState(data, getOldHue(data, currentState.oldHue));
                setState(__assign(__assign({}, colors), { colorPropKey: currentState.colorPropKey }));
                onChangeComplete && debounceRef.current(onChangeComplete, colors, event);
                onChange && onChange(colors, event);
            }
        };
        var handleSwatchHover = function (data, event) {
            var isValidColor = color.simpleCheckForValidColor(data);
            if (isValidColor) {
                var colors = color.toState(data, getOldHue(data, currentState.oldHue));
                onSwatchHover && onSwatchHover(colors, event);
            }
        };
        var optionalEvents = {};
        var pickerProps = __assign(__assign({}, props), { color: getColorWithDefault(props.color) });
        if (onSwatchHover) {
            optionalEvents.onSwatchHover = handleSwatchHover;
        }
        return (0, jsx_runtime_1.jsx)(Picker, __assign({}, pickerProps, currentState, { onChange: handleChange }, optionalEvents));
    };
    return ColorPicker;
};
exports.ColorWrap = ColorWrap;
exports.default = exports.ColorWrap;
