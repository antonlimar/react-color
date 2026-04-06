"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var merge_1 = __importDefault(require("lodash/merge"));
var material_colors_1 = __importDefault(require("material-colors"));
var common_1 = require("../common");
var CircleSwatch_1 = __importDefault(require("./CircleSwatch"));
var DEFAULT_CIRCLE_COLORS = [
    material_colors_1.default.red['500'],
    material_colors_1.default.pink['500'],
    material_colors_1.default.purple['500'],
    material_colors_1.default.deepPurple['500'],
    material_colors_1.default.indigo['500'],
    material_colors_1.default.blue['500'],
    material_colors_1.default.lightBlue['500'],
    material_colors_1.default.cyan['500'],
    material_colors_1.default.teal['500'],
    material_colors_1.default.green['500'],
    material_colors_1.default.lightGreen['500'],
    material_colors_1.default.lime['500'],
    material_colors_1.default.yellow['500'],
    material_colors_1.default.amber['500'],
    material_colors_1.default.orange['500'],
    material_colors_1.default.deepOrange['500'],
    material_colors_1.default.brown['500'],
    material_colors_1.default.blueGrey['500'],
];
var Circle = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 252 : _b, onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, _c = _a.colors, colors = _c === void 0 ? DEFAULT_CIRCLE_COLORS : _c, hex = _a.hex, _d = _a.circleSize, circleSize = _d === void 0 ? 28 : _d, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.circleSpacing, circleSpacing = _f === void 0 ? 14 : _f, _g = _a.className, className = _g === void 0 ? '' : _g;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            card: {
                width: width,
                display: 'flex',
                flexWrap: 'wrap',
                marginRight: -circleSpacing,
                marginBottom: -circleSpacing,
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.card, className: "circle-picker ".concat(className), children: (0, map_1.default)(colors, function (colorValue) { return ((0, jsx_runtime_1.jsx)(CircleSwatch_1.default, { color: colorValue, onClick: function (hexCode, event) { return onChange({ hex: hexCode, source: 'hex' }, event); }, onSwatchHover: onSwatchHover, active: hex === colorValue.toLowerCase(), circleSize: circleSize, circleSpacing: circleSpacing }, colorValue)); }) }));
};
exports.Circle = Circle;
exports.default = (0, common_1.ColorWrap)(exports.Circle);
