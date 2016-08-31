export default (n) => {
  'use strict';
  return typeof n === 'string' && n.indexOf('px') !== -1;
};