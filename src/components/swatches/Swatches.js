"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swatches = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var merge_1 = __importDefault(require("lodash/merge"));
var material_colors_1 = __importDefault(require("material-colors"));
var common_1 = require("../common");
var SwatchesGroup_1 = __importDefault(require("./SwatchesGroup"));
var DEFAULT_SWATCH_GROUPS = [
    [material_colors_1.default.red['900'], material_colors_1.default.red['700'], material_colors_1.default.red['500'], material_colors_1.default.red['300'], material_colors_1.default.red['100']],
    [material_colors_1.default.pink['900'], material_colors_1.default.pink['700'], material_colors_1.default.pink['500'], material_colors_1.default.pink['300'], material_colors_1.default.pink['100']],
    [
        material_colors_1.default.purple['900'],
        material_colors_1.default.purple['700'],
        material_colors_1.default.purple['500'],
        material_colors_1.default.purple['300'],
        material_colors_1.default.purple['100'],
    ],
    [
        material_colors_1.default.deepPurple['900'],
        material_colors_1.default.deepPurple['700'],
        material_colors_1.default.deepPurple['500'],
        material_colors_1.default.deepPurple['300'],
        material_colors_1.default.deepPurple['100'],
    ],
    [
        material_colors_1.default.indigo['900'],
        material_colors_1.default.indigo['700'],
        material_colors_1.default.indigo['500'],
        material_colors_1.default.indigo['300'],
        material_colors_1.default.indigo['100'],
    ],
    [material_colors_1.default.blue['900'], material_colors_1.default.blue['700'], material_colors_1.default.blue['500'], material_colors_1.default.blue['300'], material_colors_1.default.blue['100']],
    [
        material_colors_1.default.lightBlue['900'],
        material_colors_1.default.lightBlue['700'],
        material_colors_1.default.lightBlue['500'],
        material_colors_1.default.lightBlue['300'],
        material_colors_1.default.lightBlue['100'],
    ],
    [material_colors_1.default.cyan['900'], material_colors_1.default.cyan['700'], material_colors_1.default.cyan['500'], material_colors_1.default.cyan['300'], material_colors_1.default.cyan['100']],
    [material_colors_1.default.teal['900'], material_colors_1.default.teal['700'], material_colors_1.default.teal['500'], material_colors_1.default.teal['300'], material_colors_1.default.teal['100']],
    ['#194D33', material_colors_1.default.green['700'], material_colors_1.default.green['500'], material_colors_1.default.green['300'], material_colors_1.default.green['100']],
    [
        material_colors_1.default.lightGreen['900'],
        material_colors_1.default.lightGreen['700'],
        material_colors_1.default.lightGreen['500'],
        material_colors_1.default.lightGreen['300'],
        material_colors_1.default.lightGreen['100'],
    ],
    [material_colors_1.default.lime['900'], material_colors_1.default.lime['700'], material_colors_1.default.lime['500'], material_colors_1.default.lime['300'], material_colors_1.default.lime['100']],
    [
        material_colors_1.default.yellow['900'],
        material_colors_1.default.yellow['700'],
        material_colors_1.default.yellow['500'],
        material_colors_1.default.yellow['300'],
        material_colors_1.default.yellow['100'],
    ],
    [material_colors_1.default.amber['900'], material_colors_1.default.amber['700'], material_colors_1.default.amber['500'], material_colors_1.default.amber['300'], material_colors_1.default.amber['100']],
    [
        material_colors_1.default.orange['900'],
        material_colors_1.default.orange['700'],
        material_colors_1.default.orange['500'],
        material_colors_1.default.orange['300'],
        material_colors_1.default.orange['100'],
    ],
    [
        material_colors_1.default.deepOrange['900'],
        material_colors_1.default.deepOrange['700'],
        material_colors_1.default.deepOrange['500'],
        material_colors_1.default.deepOrange['300'],
        material_colors_1.default.deepOrange['100'],
    ],
    [material_colors_1.default.brown['900'], material_colors_1.default.brown['700'], material_colors_1.default.brown['500'], material_colors_1.default.brown['300'], material_colors_1.default.brown['100']],
    [
        material_colors_1.default.blueGrey['900'],
        material_colors_1.default.blueGrey['700'],
        material_colors_1.default.blueGrey['500'],
        material_colors_1.default.blueGrey['300'],
        material_colors_1.default.blueGrey['100'],
    ],
    ['#000000', '#525252', '#969696', '#D9D9D9', '#FFFFFF'],
];
var Swatches = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 320 : _b, _c = _a.height, height = _c === void 0 ? 240 : _c, onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, _d = _a.colors, colors = _d === void 0 ? DEFAULT_SWATCH_GROUPS : _d, hex = _a.hex, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            picker: {
                width: width,
                height: height,
            },
            overflow: {
                height: height,
                overflowY: 'scroll',
            },
            body: {
                padding: '16px 0 6px 16px',
            },
            clear: {
                clear: 'both',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.picker, className: "swatches-picker ".concat(className), children: (0, jsx_runtime_1.jsx)(common_1.Raised, { children: (0, jsx_runtime_1.jsx)("div", { style: styles.overflow, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.body, children: [(0, map_1.default)(colors, function (group) { return ((0, jsx_runtime_1.jsx)(SwatchesGroup_1.default, { group: group, active: hex, onClick: function (data, event) { return onChange({ hex: data, source: 'hex' }, event); }, onSwatchHover: onSwatchHover }, group.toString())); }), (0, jsx_runtime_1.jsx)("div", { style: styles.clear })] }) }) }) }));
};
exports.Swatches = Swatches;
exports.default = (0, common_1.ColorWrap)(exports.Swatches);
