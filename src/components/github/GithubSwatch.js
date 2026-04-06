"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubSwatch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importStar(require("reactcss"));
var common_1 = require("../common");
var GithubSwatch = function (_a) {
    var hover = _a.hover, color = _a.color, onClick = _a.onClick, onSwatchHover = _a.onSwatchHover;
    var hoverSwatch = {
        position: 'relative',
        zIndex: '2',
        outline: '2px solid #fff',
        boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)',
    };
    var styles = (0, reactcss_1.default)({
        default: {
            swatch: {
                width: '25px',
                height: '25px',
                fontSize: '0',
            },
        },
        hover: {
            swatch: hoverSwatch,
        },
    }, { hover: hover });
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.swatch, children: (0, jsx_runtime_1.jsx)(common_1.Swatch, { color: color, onClick: onClick, onHover: onSwatchHover, focusStyle: hoverSwatch }) }));
};
exports.GithubSwatch = GithubSwatch;
exports.default = (0, reactcss_1.handleHover)(exports.GithubSwatch);
