import $ from 'jquery';
import Support from './support';
import SlidePanel from './slidePanel';

class Drag {
  constructor(...args){
    this.initialize(...args);
  }

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
      $panel.on(SlidePanel.eventName('mousedown'), $.proxy(this.onDragStart, this));
      $panel.on(SlidePanel.eventName('dragstart selectstart'), (event) => {
        /* eslint consistent-return: "off" */
        if (options.mouseDragHandler) {
          if (!($(event.target).is(options.mouseDragHandler)) && !($(event.target).parents(options.mouseDragHandler).length > 0)) {
            return;
          }
        }
        return false;
      });
    }

    if (options.touchDrag && Support.touch) {
      $panel.on(SlidePanel.eventName('touchstart'), $.proxy(this.onDragStart, this));
      $panel.on(SlidePanel.eventName('touchcancel'), $.proxy(this.onDragEnd, this));
    }

    if (options.pointerDrag && Support.pointer) {
      $panel.on(SlidePanel.eventName(Support.prefixPointerEvent('pointerdown')), $.proxy(this.onDragStart, this));
      $panel.on(SlidePanel.eventName(Support.prefixPointerEvent('pointercancel')), $.proxy(this.onDragEnd, this));
    }
  }

  /**
   * Handles `touchstart` and `mousedown` events.
   */
  onDragStart(event) {
    const that = this;

    if (event.which === 3) {
      return;
    }

    const options = this.options;

    this._view.$panel.addClass(this.options.classes.dragging);

    this._position = this._view.getPosition(true);

    this._drag.time = new Date().getTime();
    this._drag.pointer = this.pointer(event);

    const callback = () => {
      SlidePanel.enter('dragging');
      SlidePanel.trigger(that._view, 'beforeDrag');
    };

    if (options.mouseDrag) {
      if (options.mouseDragHandler) {
        if (!($(event.target).is(options.mouseDragHandler)) && !($(event.target).parents(options.mouseDragHandler).length > 0)) {
          return;
        }
      }

      $(document).on(SlidePanel.eventName('mouseup'), $.proxy(this.onDragEnd, this));

      $(document).one(SlidePanel.eventName('mousemove'), $.proxy(function () {
        $(document).on(SlidePanel.eventName('mousemove'), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    if (options.touchDrag && Support.touch) {
      $(document).on(SlidePanel.eventName('touchend'), $.proxy(this.onDragEnd, this));

      $(document).one(SlidePanel.eventName('touchmove'), $.proxy(function () {
        $(document).on(SlidePanel.eventName('touchmove'), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    if (options.pointerDrag && Support.pointer) {
      $(document).on(SlidePanel.eventName(Support.prefixPointerEvent('pointerup')), $.proxy(this.onDragEnd, this));

      $(document).one(SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(function () {
        $(document).on(SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(this.onDragMove, this));

        callback();
      }, this));
    }

    $(document).on(SlidePanel.eventName('blur'), $.proxy(this.onDragEnd, this));

    event.preventDefault();
  }

  /**
   * Handles the `touchmove` and `mousemove` events.
   */
  onDragMove(event) {
    const distance = this.distance(this._drag.pointer, this.pointer(event));

    if (!SlidePanel.is('dragging')) {
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

    if (!SlidePanel.is('dragging')) {
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

    $(document).off(SlidePanel.eventName('mousemove mouseup touchmove touchend pointermove pointerup MSPointerMove MSPointerUp blur'));

    this._view.$panel.removeClass(this.options.classes.dragging);

    if (this._willClose === true) {
      this._willClose = false;
      this._view.$panel.removeClass(this.options.classes.willClose);
    }

    if (!SlidePanel.is('dragging')) {
      return;
    }

    SlidePanel.leave('dragging');

    SlidePanel.trigger(this._view, 'afterDrag');

    if (Math.abs(distance) < this.options.dragTolerance) {
      this._view.revert();
    } else {
      this._view.hide();
      // SlidePanel.hide();
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

export default Drag;
