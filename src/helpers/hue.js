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
var calculateChange = function (event, direction, hsl, container) {
    if (direction === void 0) { direction = 'horizontal'; }
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;
    var _a = getPageCoordinates(event), pageX = _a.pageX, pageY = _a.pageY;
    var left = pageX - (container.getBoundingClientRect().left + window.pageXOffset);
    var top = pageY - (container.getBoundingClientRect().top + window.pageYOffset);
    if (direction === 'vertical') {
        var h = void 0;
        if (top < 0) {
            h = 359;
        }
        else if (top > containerHeight) {
            h = 0;
        }
        else {
            var percent = -((top * 100) / containerHeight) + 100;
            h = (360 * percent) / 100;
        }
        if (hsl.h !== h) {
            return {
                h: h,
                s: hsl.s,
                l: hsl.l,
                a: hsl.a,
                source: 'hsl',
            };
        }
    }
    else {
        var h = void 0;
        if (left < 0) {
            h = 0;
        }
        else if (left > containerWidth) {
            h = 359;
        }
        else {
            var percent = (left * 100) / containerWidth;
            h = (360 * percent) / 100;
        }
        if (hsl.h !== h) {
            return {
                h: h,
                s: hsl.s,
                l: hsl.l,
                a: hsl.a,
                source: 'hsl',
            };
        }
    }
    return null;
};
exports.calculateChange = calculateChange;
