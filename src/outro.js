$.fn.slidePanel = function(options) {
if (typeof options === 'string') {
    var method = options;
    var method_arguments = Array.prototype.slice.call(arguments, 1);
    if (/^\_/.test(method)) {
        return false;
    } else {
        return this.each(function() {
            var instance = $.data(this, 'slidePanel');
            // if (instance && typeof SlidePanel[method] === 'function') {
            //     SlidePanel[method].apply(instance, method_arguments);
            // }
        });
    }
} else {
    return this.each(function() {
        if (!$.data(this, 'slidePanel')) {
            $.data(this, 'slidePanel', new Instance(this, options));

            $(this).on('click', function(e) {
                var instance = $.data(this, 'slidePanel');
                _SlidePanel.show(instance);

                e.preventDefault();
                e.stopPropagation();
            });
        }
    });
}
};

})(jQuery, document, window);
