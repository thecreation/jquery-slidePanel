export function convertMatrixToArray(value) {
    if (value && (value.substr(0, 6) === 'matrix')) {
    return value.replace(/^.*\((.*)\)$/g, '$1').replace(/px/g, '').split(/, +/);
  }
  return false;
}

export function getHashCode(object) {
  /* eslint no-bitwise: "off" */
  if (typeof object !== 'string') {
    object = JSON.stringify(object);
  }

  let chr, hash = 0,
    i, len;
  if (object.length === 0) {
    return hash;
  }
  for (i = 0, len = object.length; i < len; i++) {
    chr = object.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

export function getTime() {
  if (typeof window.performance !== 'undefined' && window.performance.now) {
    return window.performance.now();
  }
  return Date.now();
}

export function isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}

export function isPx(n) {
  return typeof n === 'string' && n.indexOf('px') !== -1;
}
