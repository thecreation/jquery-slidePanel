SlidePanel.options = {
    classes: {
        base: 'slidePanel',
        loading: 'slidePanel-loading',
        content: 'slidePanel-content'
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

    direction: 'right', // top, bottom, left, right
    duration: '300',
    easing: 'ease' // linear, ease-in, ease-out, ease-in-out
};
