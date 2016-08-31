export default (object) => {
  'use strict';
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
};