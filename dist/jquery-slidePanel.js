/**
* jQuery slidePanel
* a jquery slidePanel plugin
* Compiled: Fri Sep 02 2016 15:33:28 GMT+0800 (CST)
* @version v0.2.2
* @link https://github.com/amazingSurge/jquery-slidePanel
* @copyright LGPL-3.0
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jQuery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jQuery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jquerySlidePanel = mod.exports;
  }
})(this,

  function(_jQuery) {
    'use strict';

    var _jQuery2 = _interopRequireDefault(_jQuery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var getTime = function getTime() {
      'use strict';

      if (typeof window.performance !== 'undefined' && window.performance.now) {

        return window.performance.now();
      }

      return Date.now();
    };

    var Support = function() {
      'use strict';

      var prefixes = ['webkit', 'Moz', 'O', 'ms'],
        style = (0, _jQuery2.default)('<support>').get(0).style;

      function test(property, prefixed) {
        var result = false;
        var upper = property.charAt(0).toUpperCase() + property.slice(1);

        if (style[property] !== undefined) {
          result = property;
        }

        if (!result) {
          _jQuery2.default.each(prefixes,

            function(i, prefix) {
              if (style[prefix + upper] !== undefined) {
                result = '-' + prefix.toLowerCase() + '-' + upper;

                return false;
              }
            }
          );
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

      var events = {
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
          csstransforms: function csstransforms() {
            return Boolean(test('transform'));
          },
          csstransforms3d: function csstransforms3d() {
            return Boolean(test('perspective'));
          },
          csstransitions: function csstransitions() {
            return Boolean(test('transition'));
          },
          cssanimations: function cssanimations() {
            return Boolean(test('animation'));
          }
        };

      function prefixed(property) {
        return test(property, true);
      }

      var support = {};

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

      if ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch) {
        support.touch = true;
      } else {
        support.touch = false;
      }

      if (window.PointerEvent || window.MSPointerEvent) {
        support.pointer = true;
      } else {
        support.pointer = false;
      }

      support.prefixPointerEvent = function(pointerEvent) {
        return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent;
      }
      ;

      return support;
    }();

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
        var aGuessT = aX;

        for (var i = 0; i < 4; ++i) {
          var currentSlope = getSlope(aGuessT, mX1, mX2);

          if (currentSlope === 0.0) {

            return aGuessT;
          }
          var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
          aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
      }

      if (mX1 === mY1 && mX2 === mY2) {

        return {
          css: 'linear',
          fn: function fn(aX) {
            return aX;
          }
        };
      }

      return {
        css: 'cubic-bezier(' + mX1 + ',' + mY1 + ',' + mX2 + ',' + mY2 + ')',
        fn: function fn(aX) {
          return calcBezier(getTForX(aX), mY1, mY2);
        }
      };
    }

    var Easings = {
      ease: easingBezier(0.25, 0.1, 0.25, 1.0),
      linear: easingBezier(0.00, 0.0, 1.00, 1.0),
      'ease-in': easingBezier(0.42, 0.0, 1.00, 1.0),
      'ease-out': easingBezier(0.00, 0.0, 0.58, 1.0),
      'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
    };

    var Animate = {
      prepareTransition: function prepareTransition($el, property, duration, easing, delay) {
        'use strict';

        var temp = [];

        if (property) {
          temp.push(property);
        }

        if (duration) {

          if (_jQuery2.default.isNumeric(duration)) {
            duration = duration + 'ms';
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
      do: function _do(view, value, callback) {
        'use strict';

        _SlidePanel.enter('animating');

        var duration = view.options.duration,
          easing = view.options.easing || 'ease';

        var self = this,
          style = view.makePositionStyle(value);
        var property = null;

        for (property in style) {

          if ({}.hasOwnProperty.call(style, property)) {
            break;
          }
        }

        if (view.options.useCssTransitions && Support.transition) {
          setTimeout(

            function() {
              self.prepareTransition(view.$panel, property, duration, easing);
            }
            , 20);

          view.$panel.one(Support.transition.end,

            function() {
              if (_jQuery2.default.isFunction(callback)) {
                callback();
              }

              view.$panel.css(Support.transition, '');

              _SlidePanel.leave('animating');
            }
          );
          setTimeout(

            function() {
              view.setPosition(value);
            }
            , 20);
        } else {
          (function() {
            var startTime = getTime();
            var start = view.getPosition();
            var end = value;

            var run = function run(time) {
              var percent = (time - startTime) / view.options.duration;

              if (percent > 1) {
                percent = 1;
              }

              percent = Easings[easing].fn(percent);

              var current = parseFloat(start + percent * (end - start), 10);

              view.setPosition(current);

              if (percent === 1) {
                window.cancelAnimationFrame(self._frameId);
                self._frameId = null;

                if (_jQuery2.default.isFunction(callback)) {
                  callback();
                }

                _SlidePanel.leave('animating');
              } else {
                self._frameId = window.requestAnimationFrame(run);
              }
            };

            self._frameId = window.requestAnimationFrame(run);
          })();
        }
      }
    };

    var Loading = function() {
      function Loading(view) {
        _classCallCheck(this, Loading);

        this.initialize(view);
      }

      _createClass(Loading, [{
        key: 'initialize',
        value: function initialize(view) {
          'use strict';

          this._view = view;
          this.build();
        }
      }, {
        key: 'build',
        value: function build() {
          'use strict';

          if (this._builded) {

            return;
          }

          var options = this._view.options;
          var html = options.loading.template.call(this, options);
          this.$el = (0, _jQuery2.default)(html);

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
      }, {
        key: 'show',
        value: function show(callback) {
          'use strict';

          this.build();
          var options = this._view.options;
          options.loading.showCallback.call(this, options);

          if (_jQuery2.default.isFunction(callback)) {
            callback.call(this);
          }
        }
      }, {
        key: 'hide',
        value: function hide(callback) {
          'use strict';

          var options = this._view.options;
          options.loading.hideCallback.call(this, options);

          if (_jQuery2.default.isFunction(callback)) {
            callback.call(this);
          }
        }
      }]);

      return Loading;
    }();

    var Drag = function() {
      function Drag() {
        _classCallCheck(this, Drag);
      }

      _createClass(Drag, [{
        key: 'initialize',
        value: function initialize(view) {
          this._view = view;
          this.options = view.options;
          this._drag = {
            time: null,
            pointer: null
          };

          this.bindEvents();
        }
      }, {
        key: 'bindEvents',
        value: function bindEvents() {
          var $panel = this._view.$panel,
            options = this.options;

          if (options.mouseDrag) {
            $panel.on(_SlidePanel.eventName('mousedown'), _jQuery2.default.proxy(this.onDragStart, this));
            $panel.on(_SlidePanel.eventName('dragstart selectstart'),

              function() {
                if (options.mouseDragHandler) {

                  if (!(0, _jQuery2.default)(event.target).is(options.mouseDragHandler) && !((0, _jQuery2.default)(event.target).parents(options.mouseDragHandler).length > 0)) {

                    return;
                  }
                }

                return false;
              }
            );
          }

          if (options.touchDrag && Support.touch) {
            $panel.on(_SlidePanel.eventName('touchstart'), _jQuery2.default.proxy(this.onDragStart, this));
            $panel.on(_SlidePanel.eventName('touchcancel'), _jQuery2.default.proxy(this.onDragEnd, this));
          }

          if (options.pointerDrag && Support.pointer) {
            $panel.on(_SlidePanel.eventName(Support.prefixPointerEvent('pointerdown')), _jQuery2.default.proxy(this.onDragStart, this));
            $panel.on(_SlidePanel.eventName(Support.prefixPointerEvent('pointercancel')), _jQuery2.default.proxy(this.onDragEnd, this));
          }
        }
      }, {
        key: 'onDragStart',
        value: function onDragStart(event) {
          var self = this;

          if (event.which === 3) {

            return;
          }

          var options = this.options;

          this._view.$panel.addClass(this.options.classes.dragging);

          this._position = this._view.getPosition(true);

          this._drag.time = new Date().getTime();
          this._drag.pointer = this.pointer(event);

          var callback = function callback() {
            _SlidePanel.enter('dragging');
            _SlidePanel.trigger(self._view, 'beforeDrag');
          };

          if (options.mouseDrag) {

            if (options.mouseDragHandler) {

              if (!(0, _jQuery2.default)(event.target).is(options.mouseDragHandler) & !((0, _jQuery2.default)(event.target).parents(options.mouseDragHandler).length > 0)) {

                return;
              }
            }

            (0, _jQuery2.default)(document).on(_SlidePanel.eventName('mouseup'), _jQuery2.default.proxy(this.onDragEnd, this));

            (0, _jQuery2.default)(document).one(_SlidePanel.eventName('mousemove'), _jQuery2.default.proxy(

              function() {
                (0, _jQuery2.default)(document).on(_SlidePanel.eventName('mousemove'), _jQuery2.default.proxy(this.onDragMove, this));

                callback();
              }
              , this));
          }

          if (options.touchDrag && Support.touch) {
            (0, _jQuery2.default)(document).on(_SlidePanel.eventName('touchend'), _jQuery2.default.proxy(this.onDragEnd, this));

            (0, _jQuery2.default)(document).one(_SlidePanel.eventName('touchmove'), _jQuery2.default.proxy(

              function() {
                (0, _jQuery2.default)(document).on(_SlidePanel.eventName('touchmove'), _jQuery2.default.proxy(this.onDragMove, this));

                callback();
              }
              , this));
          }

          if (options.pointerDrag && Support.pointer) {
            (0, _jQuery2.default)(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointerup')), _jQuery2.default.proxy(this.onDragEnd, this));

            (0, _jQuery2.default)(document).one(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), _jQuery2.default.proxy(

              function() {
                (0, _jQuery2.default)(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), _jQuery2.default.proxy(this.onDragMove, this));

                callback();
              }
              , this));
          }

          (0, _jQuery2.default)(document).on(_SlidePanel.eventName('blur'), _jQuery2.default.proxy(this.onDragEnd, this));

          event.preventDefault();
        }
      }, {
        key: 'onDragMove',
        value: function onDragMove(event) {
          var distance = this.distance(this._drag.pointer, this.pointer(event));

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
      }, {
        key: 'onDragEnd',
        value: function onDragEnd(event) {
          var distance = this.distance(this._drag.pointer, this.pointer(event));

          (0, _jQuery2.default)(document).off(_SlidePanel.eventName('mousemove mouseup touchmove touchend pointermove pointerup MSPointerMove MSPointerUp blur'));

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
      }, {
        key: 'pointer',
        value: function pointer(event) {
          var result = {
            x: null,
            y: null
          };

          event = event.originalEvent || event || window.event;

          event = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event;

          if (event.pageX) {
            result.x = event.pageX;
            result.y = event.pageY;
          } else {
            result.x = event.clientX;
            result.y = event.clientY;
          }

          return result;
        }
      }, {
        key: 'distance',
        value: function distance(first, second) {
          var d = this.options.direction;

          if (d === 'left' || d === 'right') {

            return second.x - first.x;
          }

          return second.y - first.y;
        }
      }, {
        key: 'move',
        value: function move(value) {
          var position = this._position + value;

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

          this._view.setPosition(position + 'px');
        }
      }]);

      return Drag;
    }();

    var isPercentage = function isPercentage(n) {
      'use strict';

      return typeof n === 'string' && n.indexOf('%') !== -1;
    };

    var isPx = function isPx(n) {
      'use strict';

      return typeof n === 'string' && n.indexOf('px') !== -1;
    };

    var convertMatrixToArray = function convertMatrixToArray(value) {
      'use strict';

      if (value && value.substr(0, 6) === 'matrix') {

        return value.replace(/^.*\((.*)\)$/g, '$1').replace(/px/g, '').split(/, +/);
      }

      return false;
    };

    var View = function() {
      function View(options) {
        _classCallCheck(this, View);

        this.initialize(options);
      }

      _createClass(View, [{
        key: 'initialize',
        value: function initialize(options) {
          this.options = options;
          this._instance = null;
          this._showed = false;
          this._isLoading = false;

          this.build();
        }
      }, {
        key: 'setLength',
        value: function setLength() {
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
      }, {
        key: 'build',
        value: function build() {
          if (this._builded) {

            return;
          }

          var options = this.options;

          var html = options.template.call(this, options);
          var self = this;

          this.$panel = (0, _jQuery2.default)(html).appendTo('body');

          if (options.skin) {
            this.$panel.addClass(options.skin);
          }
          this.$content = this.$panel.find('.' + this.options.classes.content);

          if (options.closeSelector) {
            this.$panel.on('click', options.closeSelector,

              function() {
                self.hide();

                return false;
              }
            );
          }
          this.loading = new Loading(this);

          this.setLength();
          this.setPosition(this.getHidePosition());

          if (options.mouseDrag || options.touchDrag || options.pointerDrag) {
            this.drag = new Drag(this);
          }

          this._builded = true;
        }
      }, {
        key: 'getHidePosition',
        value: function getHidePosition() {
          var options = this.options;

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

              return parseFloat(-(this._length / (0, _jQuery2.default)(window).height()) * 100, 10);
            case 'left':
            case 'right':

              return parseFloat(-(this._length / (0, _jQuery2.default)(window).width()) * 100, 10);
          // no default
          }
        }
      }, {
        key: 'empty',
        value: function empty() {
          this._instance = null;
          this.$content.empty();
        }
      }, {
        key: 'load',
        value: function load(object) {
          var self = this;
          var options = object.options;

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

            _jQuery2.default.ajax(object.url, object.settings || {}).done(

              function(data) {
                setContent(data);
              }
            );
          } else {
            setContent('');
          }
        }
      }, {
        key: 'showLoading',
        value: function showLoading() {
          var self = this;
          this.loading.show(

            function() {
              self._isLoading = true;
            }
          );
        }
      }, {
        key: 'hideLoading',
        value: function hideLoading() {
          var self = this;
          this.loading.hide(

            function() {
              self._isLoading = false;
            }
          );
        }
      }, {
        key: 'show',
        value: function show(callback) {
          this.build();

          _SlidePanel.enter('show');
          _SlidePanel.trigger(this, 'beforeShow');

          (0, _jQuery2.default)('html').addClass(this.options.classes.base + '-html');
          this.$panel.addClass(this.options.classes.show);

          var self = this;
          Animate.do(this, 0,

            function() {
              self._showed = true;
              _SlidePanel.trigger(self, 'afterShow');

              if (_jQuery2.default.isFunction(callback)) {
                callback.call(self);
              }
            }
          );
        }
      }, {
        key: 'change',
        value: function change(object) {
          _SlidePanel.trigger(this, 'beforeShow');

          _SlidePanel.trigger(this, 'onChange', object, this._instance);

          this.load(object);

          _SlidePanel.trigger(this, 'afterShow');
        }
      }, {
        key: 'revert',
        value: function revert(callback) {
          var self = this;
          Animate.do(this, 0,

            function() {
              if (_jQuery2.default.isFunction(callback)) {
                callback.call(self);
              }
            }
          );
        }
      }, {
        key: 'hide',
        value: function hide(callback) {
          _SlidePanel.leave('show');
          _SlidePanel.trigger(this, 'beforeHide');

          var self = this;

          Animate.do(this, this.getHidePosition(),

            function() {
              self.$panel.removeClass(self.options.classes.show);
              self._showed = false;
              self._instance = null;

              if (_SlidePanel._current === self) {
                _SlidePanel._current = null;
              }

              if (!_SlidePanel.is('show')) {
                (0, _jQuery2.default)('html').removeClass(self.options.classes.base + '-html');
              }

              if (_jQuery2.default.isFunction(callback)) {
                callback.call(self);
              }

              _SlidePanel.trigger(self, 'afterHide');
            }
          );
        }
      }, {
        key: 'makePositionStyle',
        value: function makePositionStyle(value) {
          var property = void 0,
            x = '0',
            y = '0';

          if (!isPercentage(value) && !isPx(value)) {
            value = value + '%';
          }

          if (this.options.useCssTransforms && Support.transform) {

            if (this.options.direction === 'left' || this.options.direction === 'right') {
              x = value;
            } else {
              y = value;
            }

            property = Support.transform.toString();

            if (this.options.useCssTransforms3d && Support.transform3d) {
              value = 'translate3d(' + x + ',' + y + ',0)';
            } else {
              value = 'translate(' + x + ',' + y + ')';
            }
          } else {
            property = this.options.direction;
          }
          var temp = {};
          temp[property] = value;

          return temp;
        }
      }, {
        key: 'getPosition',
        value: function getPosition(px) {
          var value = void 0;

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
            value = value / this._length * 100;
          }

          return parseFloat(value, 10);
        }
      }, {
        key: 'setPosition',
        value: function setPosition(value) {
          var style = this.makePositionStyle(value);
          this.$panel.css(style);
        }
      }]);

      return View;
    }();

    var getHashCode = function getHashCode(object) {
      'use strict';

      if (typeof object !== 'string') {
        object = JSON.stringify(object);
      }

      var chr = void 0,
        hash = 0,
        i = void 0,
        len = void 0;

      if (object.length === 0) {

        return hash;
      }

      for (i = 0, len = object.length; i < len; i++) {
        chr = object.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }

      return hash;
    };

    var _SlidePanel = {
      // Current state information.
      _states: {},
      _views: {},
      _current: null,

      is: function is(state) {
        'use strict';

        return this._states[state] && this._states[state] > 0;
      },
      enter: function enter(state) {
        'use strict';

        if (this._states[state] === undefined) {
          this._states[state] = 0;
        }

        this._states[state]++;
      },
      leave: function leave(state) {
        'use strict';

        this._states[state]--;
      },
      trigger: function trigger(view, event) {
        'use strict';

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var data = [view].concat(args);

        // event
        (0, _jQuery2.default)(document).trigger('slidePanel::' + event, data);

        if (_jQuery2.default.isFunction(view.options[event])) {
          view.options[event](args);
        }
      },
      eventName: function eventName(events) {
        'use strict';

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
      show: function show(object, options) {
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

        var view = this.getView(object.options);
        var self = this;
        var callback = function callback() {
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
      getView: function getView(options) {
        'use strict';

        var code = getHashCode(options);

        if (this._views.hasOwnProperty(code)) {

          return this._views[code];
        }

        return this._views[code] = new View(options);
      },
      hide: function hide(object) {
        'use strict';

        if (object.length !== 0) {
          var view = this.getView(object.options);
          view.hide();
        } else if (this._current !== null) {
          this._current.hide();
        }
      }
    };

    var SlidePanel$1 = {
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

        template: function template(options) {
          'use strict';

          return '<div class="' + options.classes.base + ' ' + options.classes.base + '-' + options.direction + '"><div class="' + options.classes.content + '"></div></div>';
        },


        loading: {
          appendTo: 'panel',
          template: function template(options) {
            'use strict';

            return '<div class="' + options.classes.loading + '"></div>';
          },
          showCallback: function showCallback(options) {
            'use strict';

            this.$el.addClass(options.classes.loading + '-show');
          },
          hideCallback: function hideCallback(options) {
            'use strict';

            this.$el.removeClass(options.classes.loading + '-show');
          }
        },

        contentFilter: function contentFilter(content, object) {
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
        beforeLoad: _jQuery2.default.noop, // Before loading
        afterLoad: _jQuery2.default.noop, // After loading
        beforeShow: _jQuery2.default.noop, // Before opening
        afterShow: _jQuery2.default.noop, // After opening
        onChange: _jQuery2.default.noop, // On changing
        beforeChange: _jQuery2.default.noop, // Before changing
        beforeHide: _jQuery2.default.noop, // Before closing
        afterHide: _jQuery2.default.noop, // After closing
        beforeDrag: _jQuery2.default.noop, // Before drag
        afterDrag: _jQuery2.default.noop // After drag
      },
      is: function is(state) {
        'use strict';

        return _SlidePanel.is(state);
      },
      show: function show(object, options) {
        'use strict';

        _SlidePanel.show(object, options);

        return this;
      },
      hide: function hide() {
        'use strict';

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _SlidePanel.hide(args);

        return this;
      }
    };

    var Instance = function() {
      function Instance(object) {
        _classCallCheck(this, Instance);

        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        this.initialize.apply(this, [object].concat(args));
      }

      _createClass(Instance, [{
        key: 'initialize',
        value: function initialize(object) {
          'use strict';

          var options = (arguments.length <= 1 ? undefined : arguments[1]) || {};

          if (typeof object === 'string') {
            object = {
              url: object
            };
          } else if (object && object.nodeType === 1) {
            var $element = (0, _jQuery2.default)(object);

            object = {
              url: $element.attr('href'),
              settings: $element.data('settings') || {},
              options: $element.data() || {}
            };
          }

          if (object && object.options) {
            object.options = _jQuery2.default.extend(true, options, object.options);
          } else {
            object.options = options;
          }

          object.options = _jQuery2.default.extend(true, {}, SlidePanel$1.options, object.options);

          _jQuery2.default.extend(this, object);

          return this;
        }
      }]);

      return Instance;
    }();

    /*! jQuery slidePanel - v0.2.2 - 2015-10-14
     * https://github.com/amazingSurge/jquery-slidePanel
     * Copyright (c) 2015 amazingSurge; Licensed GPL */
    var SlidePanel = _jQuery2.default.slidePanel = function() {
      'use strict';

      SlidePanel.show.apply(SlidePanel, arguments);
    };

    if (!Date.now) {
      Date.now = function() {
        'use strict';

        return new Date().getTime();
      }
      ;
    }

    var vendors = ['webkit', 'moz'];

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }

    if (/iP(ad|hone|od).*OS (6|7|8)/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      (function() {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
          'use strict';

          var now = getTime();
          var nextTime = Math.max(lastTime + 16, now);

          return setTimeout(

            function() {
              callback(lastTime = nextTime);
            }
            , nextTime - now);
        }
        ;
        window.cancelAnimationFrame = clearTimeout;
      })();
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

      template: function template(options) {
        'use strict';

        return '<div class="' + options.classes.base + ' ' + options.classes.base + '-' + options.direction + '"><div class="' + options.classes.content + '"></div></div>';
      },


      loading: {
        appendTo: 'panel',
        template: function template(options) {
          'use strict';

          return '<div class="' + options.classes.loading + '"></div>';
        },
        showCallback: function showCallback(options) {
          'use strict';

          this.$el.addClass(options.classes.loading + '-show');
        },
        hideCallback: function hideCallback(options) {
          'use strict';

          this.$el.removeClass(options.classes.loading + '-show');
        }
      },

      contentFilter: function contentFilter(content, object) {
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
      beforeLoad: _jQuery2.default.noop, // Before loading
      afterLoad: _jQuery2.default.noop, // After loading
      beforeShow: _jQuery2.default.noop, // Before opening
      afterShow: _jQuery2.default.noop, // After opening
      onChange: _jQuery2.default.noop, // On changing
      beforeChange: _jQuery2.default.noop, // Before changing
      beforeHide: _jQuery2.default.noop, // Before closing
      afterHide: _jQuery2.default.noop, // After closing
      beforeDrag: _jQuery2.default.noop, // Before drag
      afterDrag: _jQuery2.default.noop // After drag
    };

    _jQuery2.default.extend(SlidePanel, {
      is: function is(state) {
        'use strict';

        return _SlidePanel.is(state);
      },
      show: function show(object, options) {
        'use strict';

        _SlidePanel.show(object, options);

        return this;
      },
      hide: function hide() {
        'use strict';

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        _SlidePanel.hide(args);

        return this;
      }
    });

    _jQuery2.default.fn.slidePanel = function(options) {
      'use strict';

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      var method = options;

      if (typeof options === 'string') {

        return this.each(

          function() {
            var instance = _jQuery2.default.data(this, 'slidePanel');

            if (!(instance instanceof Instance)) {
              instance = new Instance(this, args);
              _jQuery2.default.data(this, 'slidePanel', instance);
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
          }
        );
      }

      return this.each(

        function() {
          if (!_jQuery2.default.data(this, 'slidePanel')) {
            _jQuery2.default.data(this, 'slidePanel', new Instance(this, options));

            (0, _jQuery2.default)(this).on('click',

              function(e) {
                var instance = _jQuery2.default.data(this, 'slidePanel');
                _SlidePanel.show(instance);

                e.preventDefault();
                e.stopPropagation();
              }
            );
          }
        }
      );
    }
    ;
  }
);