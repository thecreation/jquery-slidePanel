import $ from 'jQuery';
import _SlidePanel from './_SlidePanel';

const SlidePanel = {
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

export default SlidePanel;