import $ from 'jQuery';
import SlidePanel from './slidePanel';

class Instance {
  constructor(object,...args){
    this.initialize(object,...args);
  }
  initialize(object,...args) {
    'use strict';
    const options = args[0] || {};

    if (typeof object === 'string') {
      object = {
        url: object
      };
    } else if (object && object.nodeType === 1) {
      const $element = $(object);

      object = {
        url: $element.attr('href'),
        settings: $element.data('settings') || {},
        options: $element.data() || {}
      };
    }

    if (object && object.options) {
      object.options = $.extend(true, options, object.options);
    } else {
      object.options = options;
    }

    object.options = $.extend(true, {}, SlidePanel.options, object.options);

    $.extend(this, object);

    return this;
  }
}

export default Instance;