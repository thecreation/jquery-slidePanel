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
        if (this._build) return;
        var options = this._view.options;
        var html = options.loadingTemplate.call(options);

        this.$dom = $(html);

        switch(options.loadingAppendTo){
            case 'panel':
                this.$dom.appendTo(this._view.$panel);
                break;
            case 'body':
                this.$dom.appendTo('body');
                break;
            default:
                this.$dom.appendTo(options.loadingAppendTo);
        }

        this._build = true;
    },

    show: function(callback) {
        this.build();

        this.$dom.addClass(this.options.classes.loading + '-show');
    },

    hide: function(callback) {
        this.$dom.removeClass(this.options.classes.loading + '-show');
    }
});