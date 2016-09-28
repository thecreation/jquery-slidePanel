import $ from 'jquery';
import * as util from './util';
import Support from './support';
import Easings from './easings';
import SlidePanel from './slidePanel';

const Animate = {
  prepareTransition($el, property, duration, easing, delay) {
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
        SlidePanel.enter('animating');

    const duration = view.options.duration,
      easing = view.options.easing || 'ease';

    const that = this;
    let style = view.makePositionStyle(value);
    let property = null;

    for (property in style) {
      if ({}.hasOwnProperty.call(style, property)) {
        break;
      }
    }

    if (view.options.useCssTransitions && Support.transition) {
      setTimeout(() => {
        that.prepareTransition(view.$panel, property, duration, easing);
      }, 20);

      view.$panel.one(Support.transition.end, () => {
        if ($.isFunction(callback)) {
          callback();
        }

        view.$panel.css(Support.transition, '');

        SlidePanel.leave('animating');
      });
      setTimeout(() => {
        view.setPosition(value);
      }, 20);
    } else {
      const startTime = util.getTime();
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
          window.cancelAnimationFrame(that._frameId);
          that._frameId = null;

          if ($.isFunction(callback)) {
            callback();
          }

          SlidePanel.leave('animating');
        } else {
          that._frameId = window.requestAnimationFrame(run);
        }
      };

      that._frameId = window.requestAnimationFrame(run);
    }
  }
};

export default Animate;
