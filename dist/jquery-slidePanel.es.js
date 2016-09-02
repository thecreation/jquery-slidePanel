/**
* jQuery slidePanel
* a jquery slidePanel plugin
* Compiled: Fri Sep 02 2016 15:33:28 GMT+0800 (CST)
* @version v0.2.2
* @link https://github.com/amazingSurge/jquery-slidePanel
* @copyright LGPL-3.0
*/
import $ from 'jQuery';

var getTime = () => {
  'use strict';
  if (typeof window.performance !== 'undefined' && window.performance.now) {
    return window.performance.now();
  }
  return Date.now();
};

const Support = ((() => {
  'use strict';
  const prefixes = ['webkit', 'Moz', 'O', 'ms'],
    style = $('<support>').get(0).style;

  function test(property, prefixed) {
    let result = false;
    const upper = property.charAt(0).toUpperCase() + property.slice(1);

    if (style[property] !== undefined) {
      result = property;
    }

    if (!result) {
      $.each(prefixes, (i, prefix) => {
        if (style[prefix + upper] !== undefined) {
          result = `-${prefix.toLowerCase()}-${upper}`;
          return false;
        }
      });
    }

    if (prefixed) {
      return result;
    }
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  const events = {
      transition: {
        end: {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd',
          transition: 'transitionend'
        }
      },
      animation: {
        end: {
          WebkitAnimation: 'webkitAnimationEnd',
          MozAnimation: 'animationend',
          OAnimation: 'oAnimationEnd',
          animation: 'animationend'
        }
      }
    },
    tests = {
      csstransforms() {
        return Boolean(test('transform'));
      },
      csstransforms3d() {
        return Boolean(test('perspective'));
      },
      csstransitions() {
        return Boolean(test('transition'));
      },
      cssanimations() {
        return Boolean(test('animation'));
      }
    };



  function prefixed(property) {
    return test(property, true);
  }
  const support = {};
  if (tests.csstransitions()) {
    /* jshint -W053 */
    support.transition = new String(prefixed('transition'));
    support.transition.end = events.transition.end[support.transition];
  }

  if (tests.cssanimations()) {
    /* jshint -W053 */
    support.animation = new String(prefixed('animation'));
    support.animation.end = events.animation.end[support.animation];
  }

  if (tests.csstransforms()) {
    /* jshint -W053 */
    support.transform = new String(prefixed('transform'));
    support.transform3d = tests.csstransforms3d();
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
    support.touch = true;
  } else {
    support.touch = false;
  }

  if (window.PointerEvent || window.MSPointerEvent) {
    support.pointer = true;
  } else {
    support.pointer = false;
  }

  support.prefixPointerEvent = pointerEvent => window.MSPointerEvent ?
    `MSPointer${pointerEvent.charAt(9).toUpperCase()}${pointerEvent.substr(10)}` :
    pointerEvent;

  return support;
}))();

function easingBezier(mX1, mY1, mX2, mY2) {
  'use strict';
  function a(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function b(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function c(aA1) {
    return 3.0 * aA1;
  }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier(aT, aA1, aA2) {
    return ((a(aA1, aA2) * aT + b(aA1, aA2)) * aT + c(aA1)) * aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope(aT, aA1, aA2) {
    return 3.0 * a(aA1, aA2) * aT * aT + 2.0 * b(aA1, aA2) * aT + c(aA1);
  }

  function getTForX(aX) {
    // Newton raphson iteration
    let aGuessT = aX;
    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return {
      css: 'linear',
      fn(aX) {
        return aX;
      }
    };
  }
  return {
    css: `cubic-bezier(${mX1},${mY1},${mX2},${mY2})`,
    fn(aX) {
      return calcBezier(getTForX(aX), mY1, mY2);
    }
  };
}

const Easings = {
  ease: easingBezier(0.25, 0.1, 0.25, 1.0),
  linear: easingBezier(0.00, 0.0, 1.00, 1.0),
  'ease-in': easingBezier(0.42, 0.0, 1.00, 1.0),
  'ease-out': easingBezier(0.00, 0.0, 0.58, 1.0),
  'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
};

const Animate = {
  prepareTransition($el, property, duration, easing, delay) {
    'use strict';
    const temp = [];
    if (property) {
      temp.push(property);
    }
    if (duration) {
      if ($.isNumeric(duration)) {
        duration = `${duration}ms`;
      }
      temp.push(duration);
    }
    if (easing) {
      temp.push(easing);
    } else {
      temp.push(this.easing.css);
    }
    if (delay) {
      temp.push(delay);
    }
    $el.css(Support.transition, temp.join(' '));
  },
  do(view, value, callback) {
    'use strict';
    _SlidePanel.enter('animating');

    const duration = view.options.duration,
      easing = view.options.easing || 'ease';

    const self = this,
      style = view.makePositionStyle(value);
    let property = null;

    for (property in style) {
      if ({}.hasOwnProperty.call(style, property)) {
        break;
      }
    }

    if (view.options.useCssTransitions && Support.transition) {
      setTimeout(() => {
        self.prepareTransition(view.$panel, property, duration, easing);
      }, 20);

      view.$panel.one(Support.transition.end, () => {
        if ($.isFunction(callback)) {
          callback();
        }

        view.$panel.css(Support.transition, '');

        _SlidePanel.leave('animating');
      });
      setTimeout(() => {
        view.setPosition(value);
      }, 20);
    } else {
      const startTime = getTime();
      const start = view.getPosition();
      const end = value;

      const run = time => {
        let percent = (time - startTime) / view.options.duration;

        if (percent > 1) {
          percent = 1;
        }

        percent = Easings[easing].fn(percent);

        const current = parseFloat(start + percent * (end - start), 10);

        view.setPosition(current);

        if (percent === 1) {
          window.cancelAnimationFrame(self._frameId);
          self._frameId = null;

          if ($.isFunction(callback)) {
            callback();
          }

          _SlidePanel.leave('animating');
        } else {
          self._frameId = window.requestAnimationFrame(run);
        }
      };

      self._frameId = window.requestAnimationFrame(run);
    }
  }
};

class Loading {
  constructor(view) {
    this.initialize(view);
  }

  initialize(view) {
    'use strict';
    this._view = view;
    this.build();
  }

  build() {
    'use strict';
    if (this._builded) {
      return;
    }

    const options = this._view.options;
    const html = options.loading.template.call(this, options);
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
  }

  show(callback) {
    'use strict';
    this.build();
    const options = this._view.options;
    options.loading.showCallback.call(this, options);

    if ($.isFunction(callback)) {
      callback.call(this);
    }
  }

  hide(callback) {
    'use strict';
    const options = this._view.options;
    options.loading.hideCallback.call(this, options);

    if ($.isFunction(callback)) {
      callback.call(this);
    }
  }
}

class Drag {
  initialize(view) {
    this._view = view;
    this.options = view.options;
    this._drag = {
      time: null,
      pointer: null
    };

    this.bindEvents();
  }
  bindEvents() {
    const $panel = this._view.$panel,
      options = this.options;

    if (options.mouseDrag) {
      $panel.on(_SlidePanel.eventName('mousedown'), $.proxy(this.onDragStart, this));
      $panel.on(_SlidePanel.eventName('dragstart selectstart'), () => {
        if (options.mouseDragHandler) {
          if (!($(event.target).is(options.mouseDragHandler)) && !($(event.target).parents(options.mouseDragHandler).length > 0)) {
            return;
          }
        }
        return false;
      });
    }

    if (options.touchDrag && Support.touch) {
      $panel.on(_SlidePanel.eventName('touchstart'), $.proxy(this.onDragStart, this));
      $panel.on(_SlidePanel.eventName('touchcancel'), $.proxy(this.onDragEnd, this));
    }

    if (options.pointerDrag && Support.pointer) {
      $panel.on(_SlidePanel.eventName(Support.prefixPointerEvent('pointerdown')), $.proxy(this.onDragStart, this));
      $panel.on(_SlidePanel.eventName(Support.prefixPointerEvent('pointercancel')), $.proxy(this.onDragEnd, this));
    }
  }

  /**
   * Handles `touchstart` and `mousedown` events.
   */
  onDragStart(event) {
    const self = this;

    if (event.which === 3) {
      return;
    }

    const options = this.options;

    this._view.$panel.addClass(this.options.classes.dragging);

    this._position = this._view.getPosition(true);

    this._drag.time = new Date().getTime();
    this._drag.pointer = this.pointer(event);

    const callback = () => {
      _SlidePanel.enter('dragging');
      _SlidePanel.trigger(self._view, 'beforeDrag');
    };

    if (options.mouseDrag) {
      if (options.mouseDragHandler) {
        if (!($(event.target).is(options.mouseDragHandler)) & !($(event.target).parents(options.mouseDragHandler).length > 0)) {
          return;
        }
      }

      $(document).on(_SlidePanel.eventName('mouseup'), $.proxy(this.onDragEnd, this));

      $(document).one(_SlidePanel.eventName('mousemove'), $.proxy(function () {
        $(document).on(_SlidePanel.eventName('mousemove'), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    if (options.touchDrag && Support.touch) {
      $(document).on(_SlidePanel.eventName('touchend'), $.proxy(this.onDragEnd, this));

      $(document).one(_SlidePanel.eventName('touchmove'), $.proxy(function () {
        $(document).on(_SlidePanel.eventName('touchmove'), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    if (options.pointerDrag && Support.pointer) {
      $(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointerup')), $.proxy(this.onDragEnd, this));

      $(document).one(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(function () {
        $(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    $(document).on(_SlidePanel.eventName('blur'), $.proxy(this.onDragEnd, this));

    event.preventDefault();
  }

  /**
   * Handles the `touchmove` and `mousemove` events.
   */
  onDragMove(event) {
    const distance = this.distance(this._drag.pointer, this.pointer(event));

    if (!_SlidePanel.is('dragging')) {
      return;
    }

    if (Math.abs(distance) > this.options.dragTolerance) {
      if (this._willClose !== true) {
        this._willClose = true;
        this._view.$panel.addClass(this.options.classes.willClose);
      }
    } else if (this._willClose !== false) {
      this._willClose = false;
      this._view.$panel.removeClass(this.options.classes.willClose);
    }

    if (!_SlidePanel.is('dragging')) {
      return;
    }

    event.preventDefault();
    this.move(distance);
  }

  /**
   * Handles the `touchend` and `mouseup` events.
   */
  onDragEnd(event) {
    const distance = this.distance(this._drag.pointer, this.pointer(event));

    $(document).off(_SlidePanel.eventName('mousemove mouseup touchmove touchend pointermove pointerup MSPointerMove MSPointerUp blur'));

    this._view.$panel.removeClass(this.options.classes.dragging);

    if (this._willClose === true) {
      this._willClose = false;
      this._view.$panel.removeClass(this.options.classes.willClose);
    }

    if (!_SlidePanel.is('dragging')) {
      return;
    }

    _SlidePanel.leave('dragging');

    _SlidePanel.trigger(this._view, 'afterDrag');

    if (Math.abs(distance) < this.options.dragTolerance) {
      this._view.revert();
    } else {
      _SlidePanel.hide();
    }
  }

  /**
   * Gets unified pointer coordinates from event.
   * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
   */
  pointer(event) {
    const result = {
      x: null,
      y: null
    };

    event = event.originalEvent || event || window.event;

    event = event.touches && event.touches.length ?
      event.touches[0] : event.changedTouches && event.changedTouches.length ?
        event.changedTouches[0] : event;

    if (event.pageX) {
      result.x = event.pageX;
      result.y = event.pageY;
    } else {
      result.x = event.clientX;
      result.y = event.clientY;
    }

    return result;
  }

  /**distance
   * Gets the distance of two pointer.
   */
  distance(first, second) {
    const d = this.options.direction;
    if (d === 'left' || d === 'right') {
      return second.x - first.x;
    }
    return second.y - first.y;
  }

  move(value) {
    let position = this._position + value;

    if (this.options.direction === 'right' || this.options.direction === 'bottom') {
      if (position < 0) {
        return;
      }
    } else if (position > 0) {
      return;
    }

    if (!this.options.useCssTransforms && !this.options.useCssTransforms3d) {
      if (this.options.direction === 'right' || this.options.direction === 'bottom') {
        position = -position;
      }
    }

    this._view.setPosition(`${position}px`);
  }
}

var isPercentage = (n) => {
  'use strict';
  return typeof n === 'string' && n.indexOf('%') !== -1;
};

var isPx = (n) => {
  'use strict';
  return typeof n === 'string' && n.indexOf('px') !== -1;
};

var convertMatrixToArray = (value) => {
  'use strict';
  if (value && (value.substr(0, 6) === 'matrix')) {
    return value.replace(/^.*\((.*)\)$/g, '$1').replace(/px/g, '').split(/, +/);
  }
  return false;
};

class View {
  constructor(options) {
    this.initialize(options);
  }
  initialize(options) {
    this.options = options;
    this._instance = null;
    this._showed = false;
    this._isLoading = false;

    this.build();
  }

  setLength() {
    switch (this.options.direction) {
      case 'top':
      case 'bottom':
        this._length = this.$panel.outerHeight();
        break;
      case 'left':
      case 'right':
        this._length = this.$panel.outerWidth();
        break;
      // no default
    }
  }

  build() {
    if (this._builded) {
      return;
    }

    const options = this.options;

    const html = options.template.call(this, options);
    const self = this;

    this.$panel = $(html).appendTo('body');
    if (options.skin) {
      this.$panel.addClass(options.skin);
    }
    this.$content = this.$panel.find(`.${this.options.classes.content}`);

    if (options.closeSelector) {
      this.$panel.on('click', options.closeSelector, () => {
        self.hide();
        return false;
      });
    }
    this.loading = new Loading(this);

    this.setLength();
    this.setPosition(this.getHidePosition());

    if (options.mouseDrag || options.touchDrag || options.pointerDrag) {
      this.drag = new Drag(this);
    }

    this._builded = true;
  }

  getHidePosition() {
    const options = this.options;

    if (options.useCssTransforms || options.useCssTransforms3d) {
      switch (options.direction) {
        case 'top':
        case 'left':
          return '-100';
        case 'bottom':
        case 'right':
          return '100';
        // no default
      }
    }
    switch (options.direction) {
      case 'top':
      case 'bottom':
        return parseFloat(-(this._length / $(window).height()) * 100, 10);
      case 'left':
      case 'right':
        return parseFloat(-(this._length / $(window).width()) * 100, 10);
      // no default
    }
  }

  empty() {
    this._instance = null;
    this.$content.empty();
  }

  load(object) {
    const self = this;
    const options = object.options;

    _SlidePanel.trigger(this, 'beforeLoad', object);
    this.empty();

    function setContent(content) {
      content = options.contentFilter.call(this, content, object);
      self.$content.html(content);
      self.hideLoading();

      self._instance = object;

      _SlidePanel.trigger(self, 'afterLoad', object);
    }

    if (object.content) {
      setContent(object.content);
    } else if (object.url) {
      this.showLoading();

      $.ajax(object.url, object.settings || {}).done(data => {
        setContent(data);
      });
    } else {
      setContent('');
    }
  }

  showLoading() {
    const self = this;
    this.loading.show(() => {
      self._isLoading = true;
    });
  }

  hideLoading() {
    const self = this;
    this.loading.hide(() => {
      self._isLoading = false;
    });
  }

  show(callback) {
    this.build();

    _SlidePanel.enter('show');
    _SlidePanel.trigger(this, 'beforeShow');

    $('html').addClass(`${this.options.classes.base}-html`);
    this.$panel.addClass(this.options.classes.show);

    const self = this;
    Animate.do(this, 0, () => {
      self._showed = true;
      _SlidePanel.trigger(self, 'afterShow');

      if ($.isFunction(callback)) {
        callback.call(self);
      }
    });
  }

  change(object) {
    _SlidePanel.trigger(this, 'beforeShow');

    _SlidePanel.trigger(this, 'onChange', object, this._instance);

    this.load(object);

    _SlidePanel.trigger(this, 'afterShow');
  }

  revert(callback) {
    const self = this;
    Animate.do(this, 0, () => {
      if ($.isFunction(callback)) {
        callback.call(self);
      }
    });
  }

  hide(callback) {
    _SlidePanel.leave('show');
    _SlidePanel.trigger(this, 'beforeHide');

    const self = this;

    Animate.do(this, this.getHidePosition(), () => {
      self.$panel.removeClass(self.options.classes.show);
      self._showed = false;
      self._instance = null;

      if (_SlidePanel._current === self) {
        _SlidePanel._current = null;
      }

      if (!_SlidePanel.is('show')) {
        $('html').removeClass(`${self.options.classes.base}-html`);
      }

      if ($.isFunction(callback)) {
        callback.call(self);
      }

      _SlidePanel.trigger(self, 'afterHide');
    });
  }

  makePositionStyle(value) {
    let property, x = '0',
      y = '0';

    if (!isPercentage(value) && !isPx(value)) {
      value = `${value}%`;
    }

    if (this.options.useCssTransforms && Support.transform) {
      if (this.options.direction === 'left' || this.options.direction === 'right') {
        x = value;
      } else {
        y = value;
      }

      property = Support.transform.toString();

      if (this.options.useCssTransforms3d && Support.transform3d) {
        value = `translate3d(${x},${y},0)`;
      } else {
        value = `translate(${x},${y})`;
      }
    } else {
      property = this.options.direction;
    }
    const temp = {};
    temp[property] = value;
    return temp;
  }

  getPosition(px) {
    let value;

    if (this.options.useCssTransforms && Support.transform) {
      value = convertMatrixToArray(this.$panel.css(Support.transform));
      if (!value) {
        return 0;
      }

      if (this.options.direction === 'left' || this.options.direction === 'right') {
        value = value[12] || value[4];

      } else {
        value = value[13] || value[5];
      }
    } else {
      value = this.$panel.css(this.options.direction);

      value = parseFloat(value.replace('px', ''));
    }

    if (px !== true) {
      value = (value / this._length) * 100;
    }

    return parseFloat(value, 10);
  }

  setPosition(value) {
    const style = this.makePositionStyle(value);
    this.$panel.css(style);
  }
}

var getHashCode = (object) => {
  'use strict';
  if (typeof object !== 'string') {
    object = JSON.stringify(object);
  }

  let chr, hash = 0,
    i, len;
  if (object.length === 0) {
    return hash;
  }
  for (i = 0, len = object.length; i < len; i++) {
    chr = object.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
};

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

const SlidePanel$1 = {
  options: {
    skin: null,

    classes: {
      base: 'slidePanel',
      show: 'slidePanel-show',
      loading: 'slidePanel-loading',
      content: 'slidePanel-content',
      dragging: 'slidePanel-dragging',
      willClose: 'slidePanel-will-close'
    },

    closeSelector: null,

    template(options) {
      'use strict';
      return `<div class="${options.classes.base} ${options.classes.base}-${options.direction}"><div class="${options.classes.content}"></div></div>`;
    },

    loading: {
      appendTo: 'panel', // body, panel
      template(options) {
        'use strict';
        return `<div class="${options.classes.loading}"></div>`;
      },
      showCallback(options) {
        'use strict';
        this.$el.addClass(`${options.classes.loading}-show`);
      },
      hideCallback(options) {
        'use strict';
        this.$el.removeClass(`${options.classes.loading}-show`);
      }
    },

    contentFilter(content, object) {
      'use strict';
      return content;
    },

    useCssTransforms3d: true,
    useCssTransforms: true,
    useCssTransitions: true,

    dragTolerance: 150,

    mouseDragHandler: null,
    mouseDrag: true,
    touchDrag: true,
    pointerDrag: true,

    direction: 'right', // top, bottom, left, right
    duration: '500',
    easing: 'ease', // linear, ease-in, ease-out, ease-in-out

    // callbacks
    beforeLoad: $.noop, // Before loading
    afterLoad: $.noop, // After loading
    beforeShow: $.noop, // Before opening
    afterShow: $.noop, // After opening
    onChange: $.noop, // On changing
    beforeChange: $.noop, // Before changing
    beforeHide: $.noop, // Before closing
    afterHide: $.noop, // After closing
    beforeDrag: $.noop, // Before drag
    afterDrag: $.noop // After drag
  },
  is(state) {
    'use strict';
    return _SlidePanel.is(state);
  },

  show(object, options) {
    'use strict';
    _SlidePanel.show(object, options);
    return this;
  },

  hide(...args) {
    'use strict';
    _SlidePanel.hide(args);
    return this;
  }
};

class Instance {
  constructor(object,...args){
    this.initialize(object,...args);
  }
  initialize(object,...args) {
    'use strict';
    const options = args[0] || {};

    if (typeof object === 'string') {
      object = {
        url: object
      };
    } else if (object && object.nodeType === 1) {
      const $element = $(object);

      object = {
        url: $element.attr('href'),
        settings: $element.data('settings') || {},
        options: $element.data() || {}
      };
    }

    if (object && object.options) {
      object.options = $.extend(true, options, object.options);
    } else {
      object.options = options;
    }

    object.options = $.extend(true, {}, SlidePanel$1.options, object.options);

    $.extend(this, object);

    return this;
  }
}

/*! jQuery slidePanel - v0.2.2 - 2015-10-14
 * https://github.com/amazingSurge/jquery-slidePanel
 * Copyright (c) 2015 amazingSurge; Licensed GPL */
const SlidePanel = $.slidePanel = function(...args) {
  'use strict';
  SlidePanel.show(...args);
};
if (!Date.now) {
  Date.now = () => {
    'use strict';
    return new Date().getTime();
  };
}

const vendors = ['webkit', 'moz'];
for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
  const vp = vendors[i];
  window.requestAnimationFrame = window[`${vp}RequestAnimationFrame`];
  window.cancelAnimationFrame = (window[`${vp}CancelAnimationFrame`] || window[`${vp}CancelRequestAnimationFrame`]);
}
if (/iP(ad|hone|od).*OS (6|7|8)/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
  let lastTime = 0;
  window.requestAnimationFrame = callback => {
    'use strict';
    const now = getTime();
    const nextTime = Math.max(lastTime + 16, now);
    return setTimeout(() => {
        callback(lastTime = nextTime);
      },
      nextTime - now);
  };
  window.cancelAnimationFrame = clearTimeout;
}

SlidePanel.options = {
  skin: null,

  classes: {
    base: 'slidePanel',
    show: 'slidePanel-show',
    loading: 'slidePanel-loading',
    content: 'slidePanel-content',
    dragging: 'slidePanel-dragging',
    willClose: 'slidePanel-will-close'
  },

  closeSelector: null,

  template(options) {
    'use strict';
    return `<div class="${options.classes.base} ${options.classes.base}-${options.direction}"><div class="${options.classes.content}"></div></div>`;
  },

  loading: {
    appendTo: 'panel', // body, panel
    template(options) {
      'use strict';
      return `<div class="${options.classes.loading}"></div>`;
    },
    showCallback(options) {
      'use strict';
      this.$el.addClass(`${options.classes.loading}-show`);
    },
    hideCallback(options) {
      'use strict';
      this.$el.removeClass(`${options.classes.loading}-show`);
    }
  },

  contentFilter(content, object) {
    'use strict';
    return content;
  },

  useCssTransforms3d: true,
  useCssTransforms: true,
  useCssTransitions: true,

  dragTolerance: 150,

  mouseDragHandler: null,
  mouseDrag: true,
  touchDrag: true,
  pointerDrag: true,

  direction: 'right', // top, bottom, left, right
  duration: '500',
  easing: 'ease', // linear, ease-in, ease-out, ease-in-out

  // callbacks
  beforeLoad: $.noop, // Before loading
  afterLoad: $.noop, // After loading
  beforeShow: $.noop, // Before opening
  afterShow: $.noop, // After opening
  onChange: $.noop, // On changing
  beforeChange: $.noop, // Before changing
  beforeHide: $.noop, // Before closing
  afterHide: $.noop, // After closing
  beforeDrag: $.noop, // Before drag
  afterDrag: $.noop // After drag
};

$.extend(SlidePanel, {
  is(state) {
    'use strict';
    return _SlidePanel.is(state);
  },

  show(object, options) {
    'use strict';
    _SlidePanel.show(object, options);
    return this;
  },

  hide(...args) {
    'use strict';
    _SlidePanel.hide(args);
    return this;
  }
});

$.fn.slidePanel = function(options, ...args) {
  'use strict';
  const method = options;

  if (typeof options === 'string') {
    return this.each(function() {
      let instance = $.data(this, 'slidePanel');

      if (!(instance instanceof Instance)) {
        instance = new Instance(this, args);
        $.data(this, 'slidePanel', instance);
      }

      switch (method) {
        case 'hide':
          _SlidePanel.hide(instance);
          break;
        case 'show':
          _SlidePanel.show(instance);
          break;
          // no default
      }
    });
  }
  return this.each(function() {
    if (!$.data(this, 'slidePanel')) {
      $.data(this, 'slidePanel', new Instance(this, options));

      $(this).on('click', function(e) {
        const instance = $.data(this, 'slidePanel');
        _SlidePanel.show(instance);

        e.preventDefault();
        e.stopPropagation();
      });
    }
  });
};