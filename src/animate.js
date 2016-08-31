import $ from 'jQuery';
import getTime from './getTime';
import Support from './support';
import Easings from './easings';
import _SlidePanel from './_SlidePanel';

const Animate = {
  prepareTransition($el, property, duration, easing, delay) {
    'use strict';
    const temp = [];
    if (property) {
      temp.push(property);
    }
    if (duration) {
      if ($.isNumeric(duration)) {
        duration = `${duration}ms`;
      }
      temp.push(duration);
    }
    if (easing) {
      temp.push(easing);
    } else {
      temp.push(this.easing.css);
    }
    if (delay) {
      temp.push(delay);
    }
    $el.css(Support.transition, temp.join(' '));
  },
  do(view, value, callback) {
    'use strict';
    _SlidePanel.enter('animating');

    const duration = view.options.duration,
      easing = view.options.easing || 'ease';

    const self = this,
      style = view.makePositionStyle(value);
    let property = null;

    for (property in style) {
      if ({}.hasOwnProperty.call(style, property)) {
        break;
      }
    }

    if (view.options.useCssTransitions && Support.transition) {
      setTimeout(() => {
        self.prepareTransition(view.$panel, property, duration, easing);
      }, 20);

      view.$panel.one(Support.transition.end, () => {
        if ($.isFunction(callback)) {
          callback();
        }

        view.$panel.css(Support.transition, '');

        _SlidePanel.leave('animating');
      });
      setTimeout(() => {
        view.setPosition(value);
      }, 20);
    } else {
      const startTime = getTime();
      const start = view.getPosition();
      const end = value;

      const run = time => {
        let percent = (time - startTime) / view.options.duration;

        if (percent > 1) {
          percent = 1;
        }

        percent = Easings[easing].fn(percent);

        const current = parseFloat(start + percent * (end - start), 10);

        view.setPosition(current);

        if (percent === 1) {
          window.cancelAnimationFrame(self._frameId);
          self._frameId = null;

          if ($.isFunction(callback)) {
            callback();
          }

          _SlidePanel.leave('animating');
        } else {
          self._frameId = window.requestAnimationFrame(run);
        }
      };

      self._frameId = window.requestAnimationFrame(run);
    }
  }
};

export default Animate;