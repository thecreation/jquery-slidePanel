import $ from 'jquery';

class Loading {
  constructor(view) {
    this.initialize(view);
  }

  initialize(view) {
    this._view = view;
    this.build();
  }

  build() {
    if (this._builded) {
      return;
    }

    const options = this._view.options;
    const html = options.loading.template.call(this, options);
    this.$el = $(html);

    switch (options.loading.appendTo) {
      case 'panel':
        this.$el.appendTo(this._view.$panel);
        break;
      case 'body':
        this.$el.appendTo('body');
        break;
      default:
        this.$el.appendTo(options.loading.appendTo);
    }

    this._builded = true;
  }

  show(callback) {
    this.build();
    const options = this._view.options;
    options.loading.showCallback.call(this, options);

    if ($.isFunction(callback)) {
      callback.call(this);
    }
  }

  hide(callback) {
    const options = this._view.options;
    options.loading.hideCallback.call(this, options);

    if ($.isFunction(callback)) {
      callback.call(this);
    }
  }
}

export default Loading;
