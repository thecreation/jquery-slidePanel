import $ from 'jQuery';

const Support = ((() => {
  'use strict';
  const prefixes = ['webkit', 'Moz', 'O', 'ms'],
    style = $('<support>').get(0).style;

  function test(property, prefixed) {
    let result = false;
    const upper = property.charAt(0).toUpperCase() + property.slice(1);

    if (style[property] !== undefined) {
      result = property;
    }

    if (!result) {
      $.each(prefixes, (i, prefix) => {
        if (style[prefix + upper] !== undefined) {
          result = `-${prefix.toLowerCase()}-${upper}`;
          return false;
        }
      });
    }

    if (prefixed) {
      return result;
    }
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  const events = {
      transition: {
        end: {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd',
          transition: 'transitionend'
        }
      },
      animation: {
        end: {
          WebkitAnimation: 'webkitAnimationEnd',
          MozAnimation: 'animationend',
          OAnimation: 'oAnimationEnd',
          animation: 'animationend'
        }
      }
    },
    tests = {
      csstransforms() {
        return Boolean(test('transform'));
      },
      csstransforms3d() {
        return Boolean(test('perspective'));
      },
      csstransitions() {
        return Boolean(test('transition'));
      },
      cssanimations() {
        return Boolean(test('animation'));
      }
    };



  function prefixed(property) {
    return test(property, true);
  }
  const support = {};
  if (tests.csstransitions()) {
    /* jshint -W053 */
    support.transition = new String(prefixed('transition'));
    support.transition.end = events.transition.end[support.transition];
  }

  if (tests.cssanimations()) {
    /* jshint -W053 */
    support.animation = new String(prefixed('animation'));
    support.animation.end = events.animation.end[support.animation];
  }

  if (tests.csstransforms()) {
    /* jshint -W053 */
    support.transform = new String(prefixed('transform'));
    support.transform3d = tests.csstransforms3d();
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
    support.touch = true;
  } else {
    support.touch = false;
  }

  if (window.PointerEvent || window.MSPointerEvent) {
    support.pointer = true;
  } else {
    support.pointer = false;
  }

  support.prefixPointerEvent = pointerEvent => window.MSPointerEvent ?
    `MSPointer${pointerEvent.charAt(9).toUpperCase()}${pointerEvent.substr(10)}` :
    pointerEvent;

  return support;
}))();

export default Support;