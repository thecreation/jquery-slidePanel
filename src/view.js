// View
function View() { 
	return this.initialize.apply(this, Array.prototype.slice.call(arguments));
};

$.extend(View.prototype, {
    initialize: function(options) {
        this.options = options;

        // if(options.direction === 'top' || options.direction === 'bottom'){
        //     this._axis = 'Y';
        // } else {
        //     this._axis = 'X';
        // }

        this._show = false;
        this.build();
    },

    build: function() {
        if (this._build) return;

        var options = this.options;

        var html = options.template.call(options);
        this.$panel = $(html).addClass(options.classes.base + '-' + options.direction).appendTo('body');
        this.$content = this.$panel.find('.'+this.options.classes.content);
        
        this.loading = new Loading(this);

        this.setPosition(this.getHidePosition());
        this._build = true;
    },

    getHidePosition: function(){
        switch(this.options.direction){
            case 'top':
            case 'left':
                return '-100';
            case 'bottom':
            case 'right':
                return '100';
        }

        // switch(this.options.direction){
        //     case 'top':
        //         return '-' + this.$panel.height();
        //     case 'left':
        //         return '-' + this.$panel.width();
        //     case 'bottom':
        //         return this.$panel.height();
        //     case 'right':
        //         return this.$panel.width();
        // }
    },

    show: function(callback) {
        this.build();

        $('html').addClass(this.options.classes.base + '-html');
        this.$panel.addClass(this.options.classes.base + '-show');

        this._show = true;

        Animate.do(this, 0);

        if($.isFunction(callback)){
            callback.call(this);
        }
    },

    hide: function(callback) {
        this._show = false;

        var self = this;

        Animate.do(this, this.getHidePosition(), function(){
            self.$panel.removeClass(self.options.classes.base + '-show');
            $('html').removeClass(self.options.classes.base + '-html');
        });

        if($.isFunction(callback)){
            callback.call(this);
        }
    },

    makePositionStyle: function(value) {
        var property, x = '0',
            y = '0';

        if(!isPercentage(value)){
            value = value + '%';
        }

        if (this.options.useCssTransforms && Support.transform) {
            if(this.options.direction === 'left' || this.options.direction === 'right'){
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

    getPosition: function() {
        var value;

        if (this.options.useCssTransforms && Support.transform) {
            value = convertMatrixToArray(this.$panel.css(Support.transform));
            if (!value) {
                return 0;
            }

            if(this.options.direction === 'left' || this.options.direction === 'right'){
                value = value[12] || value[4];
                value = (value/this.$panel.width())*100;
            } else {
                value = value[13] || value[5];
                value = (value/this.$panel.height())*100;
            }
        } else {
            value = this.$panel.css(this.options.direction);
            value = parseFloat(value.replace('px', ''))
        }

        return value;
    },

    setPosition: function(value) {
        var style = this.makePositionStyle(value);
            this.$panel.css(style);
    }
});