"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isvalidColorString = exports.red = exports.getContrastingColor = exports.isValidHex = exports.toState = exports.simpleCheckForValidColor = void 0;
var each_1 = __importDefault(require("lodash/each"));
var tinycolor2_1 = __importDefault(require("tinycolor2"));
var keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];
var simpleCheckForValidColor = function (data) {
    var checked = 0;
    var passed = 0;
    (0, each_1.default)(keysToCheck, function (letter) {
        var value = data[letter];
        if (value) {
            checked += 1;
            if (!isNaN(value)) {
                passed += 1;
            }
            if (letter === 's' || letter === 'l') {
                var percentPatt = /^\d+%$/;
                if (typeof value === 'string' && percentPatt.test(value)) {
                    passed += 1;
                }
            }
        }
    });
    return checked === passed ? data : false;
};
exports.simpleCheckForValidColor = simpleCheckForValidColor;
var toState = function (data, oldHue) {
    if (oldHue === void 0) { oldHue = 0; }
    var colorData = data;
    var color = colorData.hex ? (0, tinycolor2_1.default)(colorData.hex) : (0, tinycolor2_1.default)(data);
    var hsl = color.toHsl();
    var hsv = color.toHsv();
    var rgb = color.toRgb();
    var hex = color.toHex();
    if (hsl.s === 0) {
        hsl.h = oldHue || 0;
        hsv.h = oldHue || 0;
    }
    var transparent = hex === '000000' && rgb.a === 0;
    return {
        hsl: hsl,
        hex: transparent ? 'transparent' : "#".concat(hex),
        rgb: rgb,
        hsv: hsv,
        oldHue: colorData.h || oldHue || hsl.h,
        source: colorData.source,
    };
};
exports.toState = toState;
var isValidHex = function (hex) {
    if (hex === 'transparent') {
        return true;
    }
    var hexString = String(hex);
    // disable hex4 and hex8
    var lh = hexString.charAt(0) === '#' ? 1 : 0;
    return hexString.length !== 4 + lh && hexString.length < 7 + lh && (0, tinycolor2_1.default)(hexString).isValid();
};
exports.isValidHex = isValidHex;
var getContrastingColor = function (data) {
    if (!data) {
        return '#fff';
    }
    var col = (0, exports.toState)(data);
    if (col.hex === 'transparent') {
        return 'rgba(0,0,0,0.4)';
    }
    var yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
};
exports.getContrastingColor = getContrastingColor;
exports.red = {
    hsl: { a: 1, h: 0, l: 0.5, s: 1 },
    hex: '#ff0000',
    rgb: { r: 255, g: 0, b: 0, a: 1 },
    hsv: { h: 0, s: 1, v: 1, a: 1 },
};
var isvalidColorString = function (string, type) {
    var stringWithoutDegree = string.replace('°', '');
    return (0, tinycolor2_1.default)("".concat(type, " (").concat(stringWithoutDegree, ")")).isValid();
};
exports.isvalidColorString = isvalidColorString;
