$.fn.slidePanel = function(options) {
if (typeof options === 'string') {
    var method = options;
    var method_arguments = Array.prototype.slice.call(arguments, 1);

    return this.each(function() {
        var instance = $.data(this, 'slidePanel');

        if (!(instance instanceof Instance)) {
            instance = new Instance(this, method_arguments);
            $.data(this, 'slidePanel', instance);
        }

        switch (method) {
            case 'hide':
                _SlidePanel.hide(instance);
                break;
            case 'show':
                _SlidePanel.show(instance);
                break;
        }
    });
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
