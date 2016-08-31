import $ from 'jQuery';
import Animate from './animate';
import Loading from './loading';
import Drag from './drag';
import Support from './support';
import isPercentage from './isPercentage';
import isPx from './isPx';
import convertMatrixToArray from './convertMatrixToArray';
import _SlidePanel from './_SlidePanel';

class View {
  constructor(options) {
    this.initialize(options);
  }
  initialize(options) {
    this.options = options;
    this._instance = null;
    this._showed = false;
    this._isLoading = false;

    this.build();
  }

  setLength() {
    switch (this.options.direction) {
      case 'top':
      case 'bottom':
        this._length = this.$panel.outerHeight();
        break;
      case 'left':
      case 'right':
        this._length = this.$panel.outerWidth();
        break;
      // no default
    }
  }

  build() {
    if (this._builded) {
      return;
    }

    const options = this.options;

    const html = options.template.call(this, options);
    const self = this;

    this.$panel = $(html).appendTo('body');
    if (options.skin) {
      this.$panel.addClass(options.skin);
    }
    this.$content = this.$panel.find(`.${this.options.classes.content}`);

    if (options.closeSelector) {
      this.$panel.on('click', options.closeSelector, () => {
        self.hide();
        return false;
      });
    }
    this.loading = new Loading(this);

    this.setLength();
    this.setPosition(this.getHidePosition());

    if (options.mouseDrag || options.touchDrag || options.pointerDrag) {
      this.drag = new Drag(this);
    }

    this._builded = true;
  }

  getHidePosition() {
    const options = this.options;

    if (options.useCssTransforms || options.useCssTransforms3d) {
      switch (options.direction) {
        case 'top':
        case 'left':
          return '-100';
        case 'bottom':
        case 'right':
          return '100';
        // no default
      }
    }
    switch (options.direction) {
      case 'top':
      case 'bottom':
        return parseFloat(-(this._length / $(window).height()) * 100, 10);
      case 'left':
      case 'right':
        return parseFloat(-(this._length / $(window).width()) * 100, 10);
      // no default
    }
  }

  empty() {
    this._instance = null;
    this.$content.empty();
  }

  load(object) {
    const self = this;
    const options = object.options;

    _SlidePanel.trigger(this, 'beforeLoad', object);
    this.empty();

    function setContent(content) {
      content = options.contentFilter.call(this, content, object);
      self.$content.html(content);
      self.hideLoading();

      self._instance = object;

      _SlidePanel.trigger(self, 'afterLoad', object);
    }

    if (object.content) {
      setContent(object.content);
    } else if (object.url) {
      this.showLoading();

      $.ajax(object.url, object.settings || {}).done(data => {
        setContent(data);
      });
    } else {
      setContent('');
    }
  }

  showLoading() {
    const self = this;
    this.loading.show(() => {
      self._isLoading = true;
    });
  }

  hideLoading() {
    const self = this;
    this.loading.hide(() => {
      self._isLoading = false;
    });
  }

  show(callback) {
    this.build();

    _SlidePanel.enter('show');
    _SlidePanel.trigger(this, 'beforeShow');

    $('html').addClass(`${this.options.classes.base}-html`);
    this.$panel.addClass(this.options.classes.show);

    const self = this;
    Animate.do(this, 0, () => {
      self._showed = true;
      _SlidePanel.trigger(self, 'afterShow');

      if ($.isFunction(callback)) {
        callback.call(self);
      }
    });
  }

  change(object) {
    _SlidePanel.trigger(this, 'beforeShow');

    _SlidePanel.trigger(this, 'onChange', object, this._instance);

    this.load(object);

    _SlidePanel.trigger(this, 'afterShow');
  }

  revert(callback) {
    const self = this;
    Animate.do(this, 0, () => {
      if ($.isFunction(callback)) {
        callback.call(self);
      }
    });
  }

  hide(callback) {
    _SlidePanel.leave('show');
    _SlidePanel.trigger(this, 'beforeHide');

    const self = this;

    Animate.do(this, this.getHidePosition(), () => {
      self.$panel.removeClass(self.options.classes.show);
      self._showed = false;
      self._instance = null;

      if (_SlidePanel._current === self) {
        _SlidePanel._current = null;
      }

      if (!_SlidePanel.is('show')) {
        $('html').removeClass(`${self.options.classes.base}-html`);
      }

      if ($.isFunction(callback)) {
        callback.call(self);
      }

      _SlidePanel.trigger(self, 'afterHide');
    });
  }

  makePositionStyle(value) {
    let property, x = '0',
      y = '0';

    if (!isPercentage(value) && !isPx(value)) {
      value = `${value}%`;
    }

    if (this.options.useCssTransforms && Support.transform) {
      if (this.options.direction === 'left' || this.options.direction === 'right') {
        x = value;
      } else {
        y = value;
      }

      property = Support.transform.toString();

      if (this.options.useCssTransforms3d && Support.transform3d) {
        value = `translate3d(${x},${y},0)`;
      } else {
        value = `translate(${x},${y})`;
      }
    } else {
      property = this.options.direction;
    }
    const temp = {};
    temp[property] = value;
    return temp;
  }

  getPosition(px) {
    let value;

    if (this.options.useCssTransforms && Support.transform) {
      value = convertMatrixToArray(this.$panel.css(Support.transform));
      if (!value) {
        return 0;
      }

      if (this.options.direction === 'left' || this.options.direction === 'right') {
        value = value[12] || value[4];

      } else {
        value = value[13] || value[5];
      }
    } else {
      value = this.$panel.css(this.options.direction);

      value = parseFloat(value.replace('px', ''));
    }

    if (px !== true) {
      value = (value / this._length) * 100;
    }

    return parseFloat(value, 10);
  }

  setPosition(value) {
    const style = this.makePositionStyle(value);
    this.$panel.css(style);
  }
}

export default View;