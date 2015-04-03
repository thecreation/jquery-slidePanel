$.extend(SlidePanel, {
    is: function(state) {
        return _SlidePanel.is(state);
    },

    show: function(object) {
        _SlidePanel.show.apply(_SlidePanel, Array.prototype.slice.call(arguments, 1));
        return this;
    },

    hide: function() {
        View.hide();
        return this;
    }
});