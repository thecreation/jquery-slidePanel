# [jQuery slidePanel](https://github.com/amazingSurge/jquery-slidePanel) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that show a slide panel on side.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-slidePanel.js
├── jquery-slidePanel.es.js
├── jquery-slidePanel.min.js
└── css/
    ├── slidePanel.css
    └── slidePanel.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-slidePanel/master/dist/jquery-slidePanel.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-slidePanel/master/dist/jquery-slidePanel.min.js) - minified

#### Install From Bower
```sh
bower install jquery-slidePanel --save
```

#### Install From Npm
```sh
npm install jquery-slidePanel --save
```

#### Install From Yarn
```sh
yarn add jquery-slidePanel
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-slidePanel.git
cd jquery-slidePanel
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-slidePanel` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/slidePanel.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-slidePanel.js"></script>
```

#### Required HTML structure

```html
<a href="ajax.html" class="example" data-direction="left">Trigger</a>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').slidePanel(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-slidePanel/tree/master/examples).

## Options
`jquery-slidePanel` can accept an options object to alter the way it behaves. You can see the default options by call `$.slidePanel.setDefaults()`. The structure of an options object is as follows:

```
{
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
    return `<div class="${options.classes.base} ${options.classes.base}-${options.direction}"><div class="${options.classes.content}"></div></div>`;
  },

  loading: {
    appendTo: 'panel', // body, panel
    template(options) {
      return `<div class="${options.classes.loading}"></div>`;
    },
    showCallback(options) {
      this.$el.addClass(`${options.classes.loading}-show`);
    },
    hideCallback(options) {
      this.$el.removeClass(`${options.classes.loading}-show`);
    }
  },

  contentFilter(content, object) {
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
  beforeHide: $.noop, // Before closing
  afterHide: $.noop, // After closing
  beforeDrag: $.noop, // Before drag
  afterDrag: $.noop // After drag
}
```

## Methods
Methods are called on slidePanel instances through the slidePanel method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().slidePanel('show');

// or
var api = $().data('slidePanel');
api.show();
```

#### show()
Show the slide panel.
```javascript
$().slidePanel('show');
```

#### hide()
Hide the slide panel.
```javascript
$().slidePanel('hide');
```

### Api
SlidePanel have global api to easy work with.

#### show()
```javascript
// show the ajax content within slide panel
$.slidePanel.show({
  url: 'ajax.html',
  settings: {
    method: 'GET'
  }
});

// show the slide panel with options
$.slidePanel.show({
  url: 'ajax.html'
}, {
  direction: 'top',
  beforeLoad: function(coming, previous) {
    console.info('beforeLoad');
  }
};

// show the slide panel with contents
$.slidePanel.show({
  content: '<div><h2>Title</h2><p>content here</p></div>'
});
```

#### hide()
Hide the current slidepanel.

```javascript
$.slidePanel.hide();
```

## Events
`jquery-slidePanel` provides custom events for the plugin’s unique actions. 

```javascript
$(document).on('slidePanel::beforeShow', function (e) {
  // on instance ready
});

```

Event       | Description
----------- | -----------
beforeLoad  | Fires before loading the content.
afterLoad   | Fires after the content loaded.
beforeShow  | Fires before show the slidepanel.
afterShow   | Fires after the slidepanel is shown.
onChange    | Fires when the slidepanel content is changing. 
beforeHide  | Fires before hide the slidepanel. 
afterHide   | Fires after the slidepanel is hidden. 
beforeDrag  | Fires before drag the slidepanel.
afterDrag   | Fires after drag the slidepanel. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.slidePanel.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-slidePanel.js"></script>
<script>
  $.slidePanel.noConflict();
  // Code that uses other plugin's "$().slidePanel" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-slidePanel` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-slidePanel` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-slidePanel/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-slidePanel.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-slidePanel/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-slidePanel.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-slidePanel
[license]: https://img.shields.io/npm/l/jquery-slidePanel.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-slidePanel.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-slidePanel
