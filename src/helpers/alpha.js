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
var calculateChange = function (event, hsl, direction, initialA, container) {
    if (direction === void 0) { direction = 'horizontal'; }
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;
    var _a = getPageCoordinates(event), pageX = _a.pageX, pageY = _a.pageY;
    var left = pageX - (container.getBoundingClientRect().left + window.pageXOffset);
    var top = pageY - (container.getBoundingClientRect().top + window.pageYOffset);
    if (direction === 'vertical') {
        var a = void 0;
        if (top < 0) {
            a = 0;
        }
        else if (top > containerHeight) {
            a = 1;
        }
        else {
            a = Math.round((top * 100) / containerHeight) / 100;
        }
        if (hsl.a !== a) {
            return {
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: a,
                source: 'rgb',
            };
        }
    }
    else {
        var a = void 0;
        if (left < 0) {
            a = 0;
        }
        else if (left > containerWidth) {
            a = 1;
        }
        else {
            a = Math.round((left * 100) / containerWidth) / 100;
        }
        if (initialA !== a) {
            return {
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: a,
                source: 'rgb',
            };
        }
    }
    return null;
};
exports.calculateChange = calculateChange;
