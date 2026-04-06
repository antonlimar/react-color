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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var reactcss_1 = __importDefault(require("reactcss"));
var merge_1 = __importDefault(require("lodash/merge"));
var color = __importStar(require("../../helpers/color"));
var common_1 = require("../common");
var handleMaterialChange = function (onChange, rgb, data, event) {
    if (data.hex) {
        if (color.isValidHex(data.hex)) {
            onChange({
                hex: data.hex,
                source: 'hex',
            }, event);
        }
    }
    else if (data.r || data.g || data.b) {
        onChange({
            r: data.r || rgb.r,
            g: data.g || rgb.g,
            b: data.b || rgb.b,
            source: 'rgb',
        }, event);
    }
};
var Material = function (_a) {
    var onChange = _a.onChange, hex = _a.hex, rgb = _a.rgb, _b = _a.styles, passedStyles = _b === void 0 ? {} : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var styles = (0, reactcss_1.default)((0, merge_1.default)({
        default: {
            material: {
                width: '98px',
                height: '98px',
                padding: '16px',
                fontFamily: 'Roboto',
            },
            HEXwrap: {
                position: 'relative',
            },
            HEXinput: {
                width: '100%',
                marginTop: '12px',
                fontSize: '15px',
                color: '#333',
                padding: '0px',
                border: '0px',
                borderBottom: "2px solid ".concat(hex),
                outline: 'none',
                height: '30px',
            },
            HEXlabel: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                fontSize: '11px',
                color: '#999999',
                textTransform: 'capitalize',
            },
            Hex: {
                style: {},
            },
            RGBwrap: {
                position: 'relative',
            },
            RGBinput: {
                width: '100%',
                marginTop: '12px',
                fontSize: '15px',
                color: '#333',
                padding: '0px',
                border: '0px',
                borderBottom: '1px solid #eee',
                outline: 'none',
                height: '30px',
            },
            RGBlabel: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                fontSize: '11px',
                color: '#999999',
                textTransform: 'capitalize',
            },
            split: {
                display: 'flex',
                marginRight: '-10px',
                paddingTop: '11px',
            },
            third: {
                flex: '1',
                paddingRight: '10px',
            },
        },
    }, passedStyles));
    return ((0, jsx_runtime_1.jsx)(common_1.Raised, { styles: passedStyles, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.material, className: "material-picker ".concat(className), children: [(0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.HEXwrap, input: styles.HEXinput, label: styles.HEXlabel }, label: "hex", value: hex, onChange: function (value, event) { return handleMaterialChange(onChange, rgb, value, event); } }), (0, jsx_runtime_1.jsxs)("div", { style: styles.split, className: "flexbox-fix", children: [(0, jsx_runtime_1.jsx)("div", { style: styles.third, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "r", value: rgb.r, onChange: function (value, event) { return handleMaterialChange(onChange, rgb, value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.third, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "g", value: rgb.g, onChange: function (value, event) { return handleMaterialChange(onChange, rgb, value, event); } }) }), (0, jsx_runtime_1.jsx)("div", { style: styles.third, children: (0, jsx_runtime_1.jsx)(common_1.EditableInput, { style: { wrap: styles.RGBwrap, input: styles.RGBinput, label: styles.RGBlabel }, label: "b", value: rgb.b, onChange: function (value, event) { return handleMaterialChange(onChange, rgb, value, event); } }) })] })] }) }));
};
exports.Material = Material;
exports.default = (0, common_1.ColorWrap)(exports.Material);
