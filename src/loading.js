// Loading
function Loading() { 
	return this.initialize.apply(this, Array.prototype.slice.call(arguments)); 
};

$.extend(Loading.prototype, {
    initialize: function(view) {

        this.build();
    },

    build: function() {
        if (this._build) return;
        
        this._build = true;
    },

    show: function(callback) {
        this.build();
    },

    hide: function(callback) {
        
    }
});