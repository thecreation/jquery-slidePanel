// Drag
function Drag() {
    return this.initialize.apply(this, Array.prototype.slice.call(arguments));
}

$.extend(Drag.prototype, {
    initialize: function(view) {
        this._view = view;
        this.options = view.options;
        this._drag = {
            time: null,
            pointer: null
        };

        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        var options = this.options,
            $panel = this._view.$panel;

        if (options.mouseDrag) {
            $panel.on(_SlidePanel.eventName('mousedown'), $.proxy(this.onDragStart, this));
            $panel.on(_SlidePanel.eventName('dragstart selectstart'), function() {
                if (options.mouseDragHandler) {
                    if (!$(event.target).is(options.mouseDragHandler) && !($(event.target).parents(options.mouseDragHandler).length > 0)) {
                        return;
                    }
                }
                return false
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
    },

    /**
     * Handles `touchstart` and `mousedown` events.
     */
    onDragStart: function(event) {
        var self = this;

        if (event.which === 3) {
            return;
        }

        var options = this.options;

        this._view.$panel.addClass(this.options.classes.dragging);

        this._position = this._view.getPosition(true);

        this._drag.time = new Date().getTime();
        this._drag.pointer = this.pointer(event);

        var callback = function() {
            _SlidePanel.enter('dragging');
            _SlidePanel.trigger(self._view, 'beforeDrag');
        }

        if (options.mouseDrag) {
            if (options.mouseDragHandler) {
                if (!$(event.target).is(options.mouseDragHandler) && !($(event.target).parents(options.mouseDragHandler).length > 0)) {
                    return;
                }
            }

            $(document).on(_SlidePanel.eventName('mouseup'), $.proxy(this.onDragEnd, this));

            $(document).one(_SlidePanel.eventName('mousemove'), $.proxy(function() {
                $(document).on(_SlidePanel.eventName('mousemove'), $.proxy(this.onDragMove, this));

                callback();
            }, this));
        }

        if (options.touchDrag && Support.touch) {
            $(document).on(_SlidePanel.eventName('touchend'), $.proxy(this.onDragEnd, this));

            $(document).one(_SlidePanel.eventName('touchmove'), $.proxy(function() {
                $(document).on(_SlidePanel.eventName('touchmove'), $.proxy(this.onDragMove, this));

                callback();
            }, this));
        }

        if (options.pointerDrag && Support.pointer) {
            $(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointerup')), $.proxy(this.onDragEnd, this));

            $(document).one(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(function() {
                $(document).on(_SlidePanel.eventName(Support.prefixPointerEvent('pointermove')), $.proxy(this.onDragMove, this));

                callback();
            }, this));
        }

        $(document).on(_SlidePanel.eventName('blur'), $.proxy(this.onDragEnd, this));

        event.preventDefault();
    },

    /**
     * Handles the `touchmove` and `mousemove` events.
     */
    onDragMove: function(event) {
        var distance = this.distance(this._drag.pointer, this.pointer(event));

        if (!_SlidePanel.is('dragging')) {
            return;
        }

        if (Math.abs(distance) > this.options.dragTolerance) {
            if (this._willClose !== true) {
                this._willClose = true;
                this._view.$panel.addClass(this.options.classes.willClose);
            }
        } else {
            if (this._willClose !== false) {
                this._willClose = false;
                this._view.$panel.removeClass(this.options.classes.willClose);
            }
        }

        if (!_SlidePanel.is('dragging')) {
            return;
        }

        event.preventDefault();
        this.move(distance);
    },

    /**
     * Handles the `touchend` and `mouseup` events.
     */
    onDragEnd: function(event) {
        var distance = this.distance(this._drag.pointer, this.pointer(event));

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
    },

    /**
     * Gets unified pointer coordinates from event.
     * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
     */
    pointer: function(event) {
        var result = {
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
    },

    /**distance
     * Gets the distance of two pointer.
     */
    distance: function(first, second) {
        var d = this.options.direction;
        if (d === 'left' || d === 'right') {
            return second.x - first.x;
        } else {
            return second.y - first.y;
        }
    },

    move: function(value) {
        var position = this._position + value;

        if (this.options.direction === 'right' || this.options.direction === 'bottom') {
            if (position < 0) {
                return;
            }
        } else {
            if (position > 0) {
                return;
            }
        }

        if (!this.options.useCssTransforms && !this.options.useCssTransforms3d) {
            if (this.options.direction === 'right' || this.options.direction === 'bottom') {
                position = -position;
            }
        }

        this._view.setPosition(position + 'px');
    }
});
