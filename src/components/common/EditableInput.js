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
exports.EditableInput = EditableInput;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var reactcss_1 = __importDefault(require("reactcss"));
var DEFAULT_ARROW_OFFSET = 1;
var UP_KEY_CODE = 38;
var DOWN_KEY_CODE = 40;
var VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];
var isValidKeyCode = function (keyCode) { return VALID_KEY_CODES.indexOf(keyCode) > -1; };
var getNumberValue = function (value) { return Number(String(value).replace(/%/g, '')); };
var idCounter = 1;
function EditableInput(props) {
    var arrowOffset = props.arrowOffset, dragLabel = props.dragLabel, dragMax = props.dragMax, hideLabel = props.hideLabel, label = props.label, onChange = props.onChange, placeholder = props.placeholder, style = props.style, value = props.value;
    var _a = (0, react_1.useState)(function () {
        var initialValue = String(value).toUpperCase();
        return {
            value: initialValue,
            blurValue: initialValue,
        };
    }), state = _a[0], setState = _a[1];
    var inputRef = (0, react_1.useRef)(null);
    var inputId = (0, react_1.useState)(function () { return "rc-editable-input-".concat(idCounter++); })[0];
    var _b = (0, react_1.useState)(false), isDragging = _b[0], setIsDragging = _b[1];
    var prevPropsValueRef = (0, react_1.useRef)(props.value);
    var prevStateValueRef = (0, react_1.useRef)(state.value);
    var getValueObjectWithLabel = (0, react_1.useCallback)(function (value) {
        var _a;
        return (_a = {},
            _a[label] = value,
            _a);
    }, [label]);
    var setUpdatedValue = (0, react_1.useCallback)(function (value, event) {
        var onChangeValue = label ? getValueObjectWithLabel(value) : value;
        onChange === null || onChange === void 0 ? void 0 : onChange(onChangeValue, event);
        setState(function (currentState) { return (__assign(__assign({}, currentState), { value: value })); });
    }, [getValueObjectWithLabel, label, onChange]);
    var handleDrag = (0, react_1.useCallback)(function (event) {
        if (dragLabel) {
            var newValue = Math.round(value + event.movementX);
            if (newValue >= 0 && newValue <= dragMax) {
                onChange === null || onChange === void 0 ? void 0 : onChange(getValueObjectWithLabel(newValue), event);
            }
        }
    }, [dragLabel, dragMax, getValueObjectWithLabel, onChange, value]);
    var handleMouseDown = (0, react_1.useCallback)(function (event) {
        if (dragLabel) {
            event.preventDefault();
            handleDrag(event.nativeEvent);
            setIsDragging(true);
        }
    }, [dragLabel, handleDrag]);
    var handleBlur = (0, react_1.useCallback)(function () {
        setState(function (currentState) {
            return currentState.blurValue ? { value: currentState.blurValue, blurValue: null } : currentState;
        });
    }, []);
    var handleChange = (0, react_1.useCallback)(function (event) {
        setUpdatedValue(event.target.value, event);
    }, [setUpdatedValue]);
    var handleKeyDown = (0, react_1.useCallback)(function (event) {
        var value = getNumberValue(event.currentTarget.value);
        if (!isNaN(value) && isValidKeyCode(event.keyCode)) {
            var offset = arrowOffset || DEFAULT_ARROW_OFFSET;
            var updatedValue = event.keyCode === UP_KEY_CODE ? value + offset : value - offset;
            setUpdatedValue(updatedValue, event);
        }
    }, [arrowOffset, setUpdatedValue]);
    (0, react_1.useEffect)(function () {
        if (value !== state.value && (prevPropsValueRef.current !== value || prevStateValueRef.current !== state.value)) {
            var nextValue_1 = String(value).toUpperCase();
            if (inputRef.current === document.activeElement) {
                setState(function (currentState) { return (__assign(__assign({}, currentState), { blurValue: nextValue_1 })); });
            }
            else {
                setState(function (currentState) { return ({
                    value: nextValue_1,
                    blurValue: currentState.blurValue ? currentState.blurValue : nextValue_1,
                }); });
            }
        }
        prevPropsValueRef.current = value;
        prevStateValueRef.current = state.value;
    }, [state.value, value]);
    (0, react_1.useEffect)(function () {
        if (!isDragging) {
            return;
        }
        var handleWindowMouseMove = function (event) {
            handleDrag(event);
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
    }, [handleDrag, isDragging]);
    var styles = (0, reactcss_1.default)({
        default: {
            wrap: {
                position: 'relative',
            },
        },
        'user-override': {
            wrap: (style === null || style === void 0 ? void 0 : style.wrap) || {},
            input: (style === null || style === void 0 ? void 0 : style.input) || {},
            label: (style === null || style === void 0 ? void 0 : style.label) || {},
        },
        'dragLabel-true': {
            label: {
                cursor: 'ew-resize',
            },
        },
    }, {
        'user-override': true,
    }, props);
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.wrap, children: [(0, jsx_runtime_1.jsx)("input", { id: inputId, style: styles.input, ref: inputRef, value: state.value, onKeyDown: handleKeyDown, onChange: handleChange, onBlur: handleBlur, placeholder: placeholder, spellCheck: "false" }), label && !hideLabel ? ((0, jsx_runtime_1.jsx)("label", { htmlFor: inputId, style: styles.label, onMouseDown: handleMouseDown, children: label })) : null] }));
}
exports.default = EditableInput;
