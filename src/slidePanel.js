import $ from 'jquery';
import View from './view';
import * as util from './util';
import Instance from './instance';

const SlidePanel = {
  // Current state information.
  _states: {},
  _views: {},
  _current: null,

  /**
   * Checks whether the carousel is in a specific state or not.
   */
  is(state) {
    return this._states[state] && this._states[state] > 0;
  },

  /**
   * Enters a state.
   */
  enter(state) {
    if (this._states[state] === undefined) {
      this._states[state] = 0;
    }

    this._states[state]++;
  },

  /**
   * Leaves a state.
   */
  leave(state) {
    this._states[state]--;
  },

  trigger(view, event, ...args) {
    const data = [view].concat(args);

    // event
    $(document).trigger(`slidePanel::${event}`, data);
    if ($.isFunction(view.options[event])) {
      view.options[event].apply(view, args);
    }
  },

  eventName(events) {
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

    const callback = () => {
      view.show();
      view.load(object);
      this._current = view;
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
    const code = util.getHashCode(options);

    if (this._views.hasOwnProperty(code)) {
      return this._views[code];
    }

    return (this._views[code] = new View(options));
  },

  hide(object) {
    if (typeof object !== 'undefined' && typeof object.options !== 'undefined') {
      const view = this.getView(object.options);
      view.hide();
    } else if (this._current !== null) {
      this._current.hide();
    }
  }
};

export default SlidePanel;
