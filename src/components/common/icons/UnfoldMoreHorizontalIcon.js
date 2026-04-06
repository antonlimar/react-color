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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfoldMoreHorizontalIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var defaultStyle = {
    fill: 'currentcolor',
    width: '24px',
    height: '24px',
};
var UnfoldMoreHorizontalIcon = function (_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return ((0, jsx_runtime_1.jsx)("svg", __assign({ viewBox: "0 0 24 24", style: __assign(__assign({}, defaultStyle), style) }, props, { children: (0, jsx_runtime_1.jsx)("path", { d: "M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" }) })));
};
exports.UnfoldMoreHorizontalIcon = UnfoldMoreHorizontalIcon;
exports.default = exports.UnfoldMoreHorizontalIcon;
