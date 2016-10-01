import $ from 'jquery';
import info from './info';
import * as util from './util';
import DEFAULTS from './defaults';
import Instance from './instance';
import SlidePanel from './slidePanel';
import api from './api';

if (!Date.now) {
  Date.now = () => {
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
    const now = util.getTime();
    const nextTime = Math.max(lastTime + 16, now);
    return setTimeout(() => {
        callback(lastTime = nextTime);
      },
      nextTime - now);
  };
  window.cancelAnimationFrame = clearTimeout;
}

const OtherSlidePanel = $.fn.slidePanel;

const jQuerySlidePanel = function(options, ...args) {
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
          SlidePanel.hide(instance);
          break;
        case 'show':
          SlidePanel.show(instance);
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
        SlidePanel.show(instance);

        e.preventDefault();
        e.stopPropagation();
      });
    }
  });
};

$.fn.slidePanel = jQuerySlidePanel;

$.slidePanel = function(...args) {
  SlidePanel.show(...args);
};

$.extend($.slidePanel, {
  setDefaults: function(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  },
  noConflict: function() {
    $.fn.slidePanel = OtherSlidePanel;
    return jQuerySlidePanel;
  }
}, info, api);
