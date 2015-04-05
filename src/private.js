var _SlidePanel = {
    // Current state information.
    _states: {},
    _views: {},
    _current: null,

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

        this._states[state]++;
    },

    /**
     * Leaves a state.
     */
    leave: function(state) {
        this._states[state]--;
    },

    trigger: function() {

    },

    eventName: function(events) {
        if (typeof events !== 'string' || events === '') {
            return '.slidepanel';
        }
        events = events.split(' ');

        var length = events.length;
        for (var i = 0; i < length; i++) {
            events[i] = events[i] + '.slidepanel';
        }
        return events.join(' ');
    },

    show: function(object) {
        if (!(object instanceof Instance)) {
            switch (arguments.length) {
                case 0:
                    object = new Instance();
                    break;
                case 1:
                    object = new Instance(arguments[0]);
                    break;
                case 2:
                    object = new Instance(arguments[0], arguments[1]);
                    break;
            }
        }

        var view = this.getView(object.options),
            self = this,
            callback = function() {
                view.show(function() {
                    this.load(object);
                });
                self._current = view;
            };

        if (null !== this._current && view !== this._current) {
            this._current.hide(callback);
        } else {
            callback();
        }
    },

    getView: function(options) {
        var code = getHashCode(options);

        if (this._views.hasOwnProperty(code)) {
            return this._views[code];
        }

        return this._views[code] = new View(options);
    },

    hide: function() {
        if (this._current !== null) {
            var self = this;
            this._current.hide(function() {
                self._current = null;
            });
        }
    }
};
