import $ from 'jQuery';
import View from './view';
import getHashCode from './getHashCode';
import Instance from './instance';

const _SlidePanel = {
  // Current state information.
  _states: {},
  _views: {},
  _current: null,

  /**
   * Checks whether the carousel is in a specific state or not.
   */
  is(state) {
    'use strict';
    return this._states[state] && this._states[state] > 0;
  },

  /**
   * Enters a state.
   */
  enter(state) {
    'use strict';
    if (this._states[state] === undefined) {
      this._states[state] = 0;
    }

    this._states[state]++;
  },

  /**
   * Leaves a state.
   */
  leave(state) {
    'use strict';
    this._states[state]--;
  },

  trigger(view, event, ...args) {
    'use strict';
    const data = [view].concat(args);

    // event
    $(document).trigger(`slidePanel::${event}`, data);
    if ($.isFunction(view.options[event])) {
      view.options[event](args);
    }
  },

  eventName(events) {
    'use strict';
    if (typeof events !== 'string' || events === '') {
      return '.slidepanel';
    }
    events = events.split(' ');

    const length = events.length;
    for (let i = 0; i < length; i++) {
      events[i] = `${events[i]}.slidepanel`;
    }
    return events.join(' ');
  },

  show(object, options) {
    'use strict';
    if (!(object instanceof Instance)) {
      switch (arguments.length) {
        case 0:
          object = new Instance();
          break;
        case 1:
          object = new Instance(object);
          break;
        case 2:
          object = new Instance(object, options);
          break;
        // no default
      }
    }

    const view = this.getView(object.options);
    const self = this;
    const callback = () => {
      view.show();
      view.load(object);
      self._current = view;
    };
    if (this._current !== null) {
      if (view === this._current) {
        this._current.change(object);
      } else {
        this._current.hide(callback);
      }
    } else {
      callback();
    }
  },

  getView(options) {
    'use strict';
    const code = getHashCode(options);

    if (this._views.hasOwnProperty(code)) {
      return this._views[code];
    }

    return (this._views[code] = new View(options));
  },

  hide(object) {
    'use strict';
    if (object.length !== 0) {
      const view = this.getView(object.options);
      view.hide();
    } else if (this._current !== null) {
      this._current.hide();
    }
  }
};

export default _SlidePanel;