var _SlidePanel = {
    // Current state information.
    _states: {},
    _views: {},

    initialize: function() {
        
    },

    /**
     * Checks whether the carousel is in a specific state or not.
     */
    is: function(state) {
        return this._states[state] && this._states[state] > 0;
    },

    /**
     * Enters a state.
     */
    enter: function(state) {
        if (this._states[state] === undefined) {
            this._states[state] = 0;
        }

        this._states[state] ++;
    },

    /**
     * Leaves a state.
     */
    leave: function(state) {
        this._states[state] --;
    },

    show: function(object){
        if(!(object instanceof Instance)){
            object = new Instance.apply(arguments);
        }
        
        var view = this.getView(object.options);
        view.show();
    },

    getView: function(options) {
        var code = getHashCode(options);

        if(this._views.hasOwnProperty(code)){
            return this._views[code];
        }

        return this._views[code] = new View(options);
    },

    hide: function(){

    }
};