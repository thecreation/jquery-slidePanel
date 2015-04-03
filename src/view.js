// View
function View() { 
	return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(View.prototype, {
    initialize: function(options) {
        this.options = options;

        this.build();
    },

    build: function() {
        if (this._build) return;

        var html = this.options.template.call(SlidePanel);
        this.$panel = $(html).appendTo('body');
        this.$content = this.$panel.find('.'+this.options.classes.content);
        
        this.loading = new Loading(this);

        this._build = true;
    },

    show: function(callback) {
        this.build();
    },

    hide: function(callback) {
        
    }
});