// Instance
function Instance() {
    return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Instance.prototype, {
    initialize: function(object) {
        var options = arguments[1] || {};

        if (typeof object === 'string') {
            object = {
                url: object
            };
        } else if (object && object.nodeType == 1) {
            var $element = $(object);

            object = {
                url: $element.attr('href'),
                settings: $element.data('settings') || {},
                options: $element.data() || {}
            }
        }

        if (object && object.options) {
            object.options = $.extend(true, options, object.options);
        } else {
            object.options = options;
        }

        object.options = $.extend(true, {}, SlidePanel.options, object.options);

        $.extend(this, object);

        return this;
    }
});
