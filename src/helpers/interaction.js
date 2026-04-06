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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFocus = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var handleFocus = function (WrappedComponent, Span) {
    if (Span === void 0) { Span = 'span'; }
    return function Focus(props) {
        var _a = (0, react_1.useState)(false), focus = _a[0], setFocus = _a[1];
        var handleFocus = function () { return setFocus(true); };
        var handleBlur = function () { return setFocus(false); };
        return ((0, jsx_runtime_1.jsx)(Span, { onFocus: handleFocus, onBlur: handleBlur, children: (0, jsx_runtime_1.jsx)(WrappedComponent, __assign({}, props, { focus: focus })) }));
    };
};
exports.handleFocus = handleFocus;
