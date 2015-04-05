SlidePanel.options = {
    skin: null,

    classes: {
        base: 'slidePanel',
        loading: 'slidePanel-loading',
        content: 'slidePanel-content',
        dragging: 'slidePanel-dragging',
        willClose: 'slidePanel-will-close',
    },

    template: function() {
        return '<div class="' + this.classes.base + '"><div class="' + this.classes.content + '"></div></div>';
    },

    loadingAppendTo: 'panel', // body, panel

    loadingTemplate: function() {
        return '<div class="' + this.classes.loading + '"></div>';
    },

    useCssTransforms3d: true,
    useCssTransforms: true,
    useCssTransitions: true,

    dragTolerance: 90,

    mouseDrag: true,
    touchDrag: true,
    pointerDrag: true,

    direction: 'right', // top, bottom, left, right
    duration: '500',
    easing: 'ease' // linear, ease-in, ease-out, ease-in-out
};
