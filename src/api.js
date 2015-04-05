$.extend(SlidePanel, {
    is: function(state) {
        return _SlidePanel.is(state);
    },

    show: function(object, options) {
        _SlidePanel.show.apply(_SlidePanel, arguments);
        return this;
    },

    hide: function() {
        _SlidePanel.hide.apply(_SlidePanel, arguments);
        return this;
    }
});
