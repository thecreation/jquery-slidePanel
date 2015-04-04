var Animate = {
	prepareTransition: function(view, property, duration, easing, delay) {
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
        view.$panel.css(Support.transition, temp.join(' '));
    },
    do: function(view, value, callback) {
    	var duration = view.options.duration, easing = view.options.easing;

        var self = this,
            style = view.makePositionStyle(value);
        for (var property in style) {
            break;
        }

        if (view.options.useCssTransitions && Support.transition) {
            this.prepareTransition(view, property, duration, easing);

            view.$panel.one(Support.transition.end, function() {
                if($.isFunction(callback)) {
                	callback();
                }

                view.$panel.css(Support.transition, '');
            });
            setTimeout(function(){
            	view.setPosition(value);
            }, 20);
        }
    }
}