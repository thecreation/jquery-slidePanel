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

    trigger: function(view, event) {
        var method_arguments = Array.prototype.slice.call(arguments, 2),
            data = [view].concat(method_arguments);

        // event
        $(document).trigger('slidePanel::' + event, data);
        if ($.isFunction(view.options[event])) {
            view.options[event].apply(view, method_arguments);
        }
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

        var view = this.getView(object.options);
        var self = this;
        var callback = function() {
            view.show();
            view.load(object);
            self._current = view;
        }
        if (null !== this._current) {
            if (view === this._current) {
                this._current.change(object);
            } else {
                this._current.hide(callback);
            }
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

    hide: function(object) {
        if (object) {
            var view = this.getView(object.options);
            view.hide();
        } else {
            if (this._current !== null) {
                var self = this;
                this._current.hide();
            }
        }
    }
};
