/**
 * Animation Frame
 **/
if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    };
}

function getTime() {
    if (typeof window.performance !== 'undefined' && window.performance.now) {
        return window.performance.now();
    } else {
        return Date.now();
    }
}

var vendors = ['webkit', 'moz'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
}
if (/iP(ad|hone|od).*OS (6|7|8)/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var now = getTime();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() {
                callback(lastTime = nextTime);
            },
            nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
}
