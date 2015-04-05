// View
function View() {
    return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(View.prototype, {
    initialize: function(options) {
        this.options = options;
        this.build();
    },

    setLength: function() {
        switch (this.options.direction) {
            case 'top':
            case 'bottom':
                this._length = this.$panel.outerHeight();
                break;
            case 'left':
            case 'right':
                this._length = this.$panel.outerWidth();
                break;
        }
    },

    build: function() {
        if (this._build) return;

        var options = this.options;

        var html = options.template.call(options);
        this.$panel = $(html).addClass(options.classes.base + '-' + options.direction).appendTo('body');
        this.$content = this.$panel.find('.' + this.options.classes.content);

        this.loading = new Loading(this);

        this.setLength();
        this.setPosition(this.getHidePosition());

        if (options.mouseDrag || options.touchDrag || options.pointerDrag) {
            this.drag = new Drag(this);
        }

        this._build = true;
    },

    getHidePosition: function() {
        var options = this.options;

        if (options.useCssTransforms || options.useCssTransforms3d) {
            switch (options.direction) {
                case 'top':
                case 'left':
                    return '-100';
                case 'bottom':
                case 'right':
                    return '100';
            }
        } else {
            switch (options.direction) {
                case 'top':
                case 'bottom':
                    return parseFloat(-(this._length / $(window).height()) * 100, 10);
                case 'left':
                case 'right':
                    return parseFloat(-(this._length / $(window).width()) * 100, 10);
            }
        }
    },

    load: function(object) {
        var self = this;
        if (object.content) {
            this.$content.html(object.content);
        } else if (object.url) {
            $.ajax(object.url, object.settings || {}).done(function(data) {
                self.$content.html(data);
            });
        }
    },

    show: function(callback) {
        this.build();

        _SlidePanel.enter('show');

        $('html').addClass(this.options.classes.base + '-html');
        this.$panel.addClass(this.options.classes.base + '-show');

        Animate.do(this, 0);

        if ($.isFunction(callback)) {
            callback.call(this);
        }
    },

    hide: function(callback) {
        _SlidePanel.leave('show');

        var self = this;

        Animate.do(this, this.getHidePosition(), function() {
            self.$panel.removeClass(self.options.classes.base + '-show');

            if (!_SlidePanel.is('show')) {
                $('html').removeClass(self.options.classes.base + '-html');
            }
        });

        if ($.isFunction(callback)) {
            callback.call(this);
        }
    },

    makePositionStyle: function(value) {
        var property, x = '0',
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
                value = "translate3d(" + x + "," + y + ",0)";
            } else {
                value = "translate(" + x + "," + y + ")";
            }
        } else {
            property = this.options.direction;
        }
        var temp = {};
        temp[property] = value;
        return temp;
    },

    getPosition: function(px) {
        var value;

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
    },

    setPosition: function(value) {
        var style = this.makePositionStyle(value);
        this.$panel.css(style);
    }
});
