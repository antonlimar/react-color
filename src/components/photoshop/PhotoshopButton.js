"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoshopButton = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var PhotoshopButton = function (_a) {
    var onClick = _a.onClick, label = _a.label, children = _a.children, active = _a.active;
    var styles = (0, reactcss_1.default)({
        default: {
            button: {
                backgroundImage: 'linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)',
                border: '1px solid #878787',
                borderRadius: '2px',
                height: '20px',
                boxShadow: '0 1px 0 0 #EAEAEA',
                fontSize: '14px',
                color: '#000',
                lineHeight: '20px',
                textAlign: 'center',
                marginBottom: '10px',
                cursor: 'pointer',
            },
        },
        active: {
            button: {
                boxShadow: '0 0 0 1px #878787',
            },
        },
    }, { active: active });
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.button, onClick: onClick, children: label || children }));
};
exports.PhotoshopButton = PhotoshopButton;
exports.default = exports.PhotoshopButton;
