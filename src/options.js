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

    template: function(options) {
        return '<div class="' + options.classes.base + ' ' + options.classes.base + '-' + options.direction + '">' +
            '<div class="' + options.classes.content + '"></div>' +
            '</div>';
    },

    loading: {
        appendTo: 'panel', // body, panel
        template: function(options) {
            return '<div class="' + options.classes.loading + '"></div>';
        },
        showCallback: function(options) {
            this.$el.addClass(options.classes.loading + '-show');
        },
        hideCallback: function(options) {
            this.$el.removeClass(options.classes.loading + '-show');
        }
    },

    contentFilter: function(content, object) {
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
