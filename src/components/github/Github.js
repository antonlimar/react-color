"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Github = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var map_1 = __importDefault(require("lodash/map"));
var merge_1 = __importDefault(require("lodash/merge"));
var common_1 = require("../common");
var GithubSwatch_1 = __importDefault(require("./GithubSwatch"));
var DEFAULT_GITHUB_COLORS = [
    '#B80000',
    '#DB3E00',
    '#FCCB00',
    '#008B02',
    '#006B76',
    '#1273DE',
    '#004DCF',
    '#5300EB',
    '#EB9694',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#BED3F3',
    '#D4C4FB',
];
var Github = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 200 : _b, _c = _a.colors, colors = _c === void 0 ? DEFAULT_GITHUB_COLORS : _c, onChange = _a.onChange, onSwatchHover = _a.onSwatchHover, _d = _a.triangle, triangle = _d === void 0 ? 'top-left' : _d, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            card: {
                width: width,
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.2)',
                boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
                borderRadius: '4px',
                position: 'relative',
                padding: '5px',
                display: 'flex',
                flexWrap: 'wrap',
            },
            triangle: {
                position: 'absolute',
                border: '7px solid transparent',
                borderBottomColor: '#fff',
            },
            triangleShadow: {
                position: 'absolute',
                border: '8px solid transparent',
                borderBottomColor: 'rgba(0,0,0,0.15)',
            },
        },
        'hide-triangle': {
            triangle: {
                display: 'none',
            },
            triangleShadow: {
                display: 'none',
            },
        },
        'top-left-triangle': {
            triangle: {
                top: '-14px',
                left: '10px',
            },
            triangleShadow: {
                top: '-16px',
                left: '9px',
            },
        },
        'top-right-triangle': {
            triangle: {
                top: '-14px',
                right: '10px',
            },
            triangleShadow: {
                top: '-16px',
                right: '9px',
            },
        },
        'bottom-left-triangle': {
            triangle: {
                top: '35px',
                left: '10px',
                transform: 'rotate(180deg)',
            },
            triangleShadow: {
                top: '37px',
                left: '9px',
                transform: 'rotate(180deg)',
            },
        },
        'bottom-right-triangle': {
            triangle: {
                top: '35px',
                right: '10px',
                transform: 'rotate(180deg)',
            },
            triangleShadow: {
                top: '37px',
                right: '9px',
                transform: 'rotate(180deg)',
            },
        },
    }, passedStyles), {
        'hide-triangle': triangle === 'hide',
        'top-left-triangle': triangle === 'top-left',
        'top-right-triangle': triangle === 'top-right',
        'bottom-left-triangle': triangle === 'bottom-left',
        'bottom-right-triangle': triangle === 'bottom-right',
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.card, className: "github-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { style: styles.triangleShadow }), (0, jsx_runtime_1.jsx)("div", { style: styles.triangle }), (0, map_1.default)(colors, function (colorValue) { return ((0, jsx_runtime_1.jsx)(GithubSwatch_1.default, { color: colorValue, onClick: function (hexCode, event) { return onChange({ hex: hexCode, source: 'hex' }, event); }, onSwatchHover: onSwatchHover }, colorValue)); })] }));
};
exports.Github = Github;
exports.default = (0, common_1.ColorWrap)(exports.Github);
