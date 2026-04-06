"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwatchesGroup = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var SwatchesColor_1 = __importDefault(require("./SwatchesColor"));
var SwatchesGroup = function (_a) {
    var onClick = _a.onClick, onSwatchHover = _a.onSwatchHover, group = _a.group, active = _a.active;
    var styles = (0, reactcss_1.default)({
        default: {
            group: {
                paddingBottom: '10px',
                width: '40px',
                float: 'left',
                marginRight: '10px',
            },
        },
    });
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.group, children: (0, map_1.default)(group, function (colorValue, index) { return ((0, jsx_runtime_1.jsx)(SwatchesColor_1.default, { color: colorValue, active: colorValue.toLowerCase() === active, first: index === 0, last: index === group.length - 1, onClick: onClick, onSwatchHover: onSwatchHover }, colorValue)); }) }));
};
exports.SwatchesGroup = SwatchesGroup;
exports.default = exports.SwatchesGroup;
