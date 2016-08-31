/*! jQuery slidePanel - v0.2.2 - 2015-10-14
 * https://github.com/amazingSurge/jquery-slidePanel
 * Copyright (c) 2015 amazingSurge; Licensed GPL */
import $ from 'jQuery';
import getTime from './getTime';
import Instance from './instance';
import _SlidePanel from './_SlidePanel';

const SlidePanel = $.slidePanel = function(...args) {
  'use strict';
  SlidePanel.show.apply(this, args);
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