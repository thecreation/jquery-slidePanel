// Loading
function Loading() {
    return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(Loading.prototype, {
    initialize: function(view) {
        this._view = view;
        this.build();
    },

    build: function() {
        if (this._builded) return;

        var options = this._view.options;
        var html = options.loading.template.call(this, options);
        this.$el = $(html);

        switch (options.loading.appendTo) {
            case 'panel':
                this.$el.appendTo(this._view.$panel);
                break;
            case 'body':
                this.$el.appendTo('body');
                break;
            default:
                this.$el.appendTo(options.loading.appendTo);
        }

        this._builded = true;
    },

    show: function(callback) {
        this.build();
        var options = this._view.options;
        options.loading.showCallback.call(this, options);

        if ($.isFunction(callback)) {
            callback.call(this);
        }
    },

    hide: function(callback) {
        var options = this._view.options;
        options.loading.hideCallback.call(this, options);

        if ($.isFunction(callback)) {
            callback.call(this);
        }
    }
});
