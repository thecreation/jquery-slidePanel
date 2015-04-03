// View
function View() { 
	return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(View.prototype, {
    initialize: function(options) {
        this.options = options;
        this._show = false;
        this.build();
    },

    build: function() {
        if (this._build) return;

        var options = this.options;

        var html = options.template.call(options);
        this.$panel = $(html).addClass(options.classes.base + '-' + options.direction).appendTo('body');
        this.$content = this.$panel.find('.'+this.options.classes.content);
        
        this.loading = new Loading(this);

        this._build = true;
    },

    show: function(callback) {
        this.build();

        this.$panel.addClass(this.options.classes.base + '-show');

        this._show = true;

        if($.isFunction(callback)){
            callback.call(this);
        }
    },

    hide: function(callback) {
        this.$panel.removeClass(this.options.classes.base + '-show');

        this._show = false;

        if($.isFunction(callback)){
            callback.call(this);
        }
    }
});