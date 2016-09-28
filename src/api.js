import SlidePanel from './slidePanel';

export default {
  is(state) {
    return SlidePanel.is(state);
  },

  show(object, options) {
    SlidePanel.show(object, options);
    return this;
  },

  hide(...args) {
    SlidePanel.hide(args);
    return this;
  }
};
