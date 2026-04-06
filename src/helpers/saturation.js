"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateChange = void 0;
var getPageCoordinates = function (event) {
    var mouseEvent = event;
    if (typeof mouseEvent.pageX === 'number' && typeof mouseEvent.pageY === 'number') {
        return { pageX: mouseEvent.pageX, pageY: mouseEvent.pageY };
    }
    var touchEvent = event;
    return {
        pageX: touchEvent.touches[0].pageX,
        pageY: touchEvent.touches[0].pageY,
    };
};
var calculateChange = function (event, hsl, container) {
    var _a = container.getBoundingClientRect(), containerWidth = _a.width, containerHeight = _a.height, containerLeft = _a.left, containerTop = _a.top;
    var _b = getPageCoordinates(event), pageX = _b.pageX, pageY = _b.pageY;
    var left = pageX - (containerLeft + window.pageXOffset);
    var top = pageY - (containerTop + window.pageYOffset);
    if (left < 0) {
        left = 0;
    }
    else if (left > containerWidth) {
        left = containerWidth;
    }
    if (top < 0) {
        top = 0;
    }
    else if (top > containerHeight) {
        top = containerHeight;
    }
    var saturation = left / containerWidth;
    var bright = 1 - top / containerHeight;
    return {
        h: hsl.h,
        s: saturation,
        v: bright,
        a: hsl.a,
        source: 'hsv',
    };
};
exports.calculateChange = calculateChange;
