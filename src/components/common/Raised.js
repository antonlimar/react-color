"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raised = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var Raised = function (_a) {
    var _b = _a.zDepth, zDepth = _b === void 0 ? 1 : _b, _c = _a.radius, radius = _c === void 0 ? 2 : _c, _d = _a.background, background = _d === void 0 ? '#fff' : _d, children = _a.children, _e = _a.styles, passedStyles = _e === void 0 ? {} : _e;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            wrap: {
                position: 'relative',
                display: 'inline-block',
            },
            content: {
                position: 'relative',
            },
            bg: {
                absolute: '0px 0px 0px 0px',
                boxShadow: "0 ".concat(zDepth, "px ").concat(zDepth * 4, "px rgba(0,0,0,.24)"),
                borderRadius: radius,
                background: background,
            },
        },
        'zDepth-0': {
            bg: {
                boxShadow: 'none',
            },
        },
        'zDepth-1': {
            bg: {
                boxShadow: '0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)',
            },
        },
        'zDepth-2': {
            bg: {
                boxShadow: '0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2)',
            },
        },
        'zDepth-3': {
            bg: {
                boxShadow: '0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24)',
            },
        },
        'zDepth-4': {
            bg: {
                boxShadow: '0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22)',
            },
        },
        'zDepth-5': {
            bg: {
                boxShadow: '0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2)',
            },
        },
        square: {
            bg: {
                borderRadius: '0',
            },
        },
        circle: {
            bg: {
                borderRadius: '50%',
            },
        },
    }, passedStyles), { 'zDepth-1': zDepth === 1 });
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.wrap, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.bg }), (0, jsx_runtime_1.jsx)("div", { style: styles.content, children: children })] }));
};
exports.Raised = Raised;
exports.default = exports.Raised;
