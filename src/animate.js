var Animate = {
    prepareTransition: function($el, property, duration, easing, delay) {
        var temp = [];
        if (property) {
            temp.push(property);
        }
        if (duration) {
            if ($.isNumeric(duration)) {
                duration = duration + 'ms';
            }
            temp.push(duration);
        }
        if (easing) {
            temp.push(easing);
        } else {
            temp.push(this.easing.css);
        }
        if (delay) {
            temp.push(delay);
        }
        $el.css(Support.transition, temp.join(' '));
    },
    do: function(view, value, callback) {
        _SlidePanel.enter('animating');

        var duration = view.options.duration,
            easing = view.options.easing || 'ease';

        var self = this,
            style = view.makePositionStyle(value);
        for (var property in style) {
            break;
        }

        if (view.options.useCssTransitions && Support.transition) {
            setTimeout(function() {
                self.prepareTransition(view.$panel, property, duration, easing);
            }, 20);

            view.$panel.one(Support.transition.end, function() {
                if ($.isFunction(callback)) {
                    callback();
                }

                view.$panel.css(Support.transition, '');

                _SlidePanel.leave('animating');
            });
            setTimeout(function() {
                view.setPosition(value);
            }, 20);
        } else {
            var startTime = getTime();
            var start = view.getPosition();
            var end = value;

            var run = function(time) {
                var percent = (time - startTime) / view.options.duration;

                if (percent > 1) {
                    percent = 1;
                }

                percent = Easings[easing].fn(percent);

                var current = parseFloat(start + percent * (end - start), 10);

                view.setPosition(current);

                if (percent === 1) {
                    window.cancelAnimationFrame(self._frameId);
                    self._frameId = null;

                    if ($.isFunction(callback)) {
                        callback();
                    }

                    _SlidePanel.leave('animating');
                } else {
                    self._frameId = window.requestAnimationFrame(run);
                }
            };

            self._frameId = window.requestAnimationFrame(run);
        }
    }
}
