/* #### Helpers #### */
/* ## Objects, Arrays, and Functions #### */
export const existsOn = (rootObj, deepFind) => { let currentObj = rootObj; let wasFound = true; if (typeof rootObj !== 'undefined') { if (typeof deepFind === 'string') { deepFind = deepFind.split('.'); }; [...deepFind].forEach((key, index) => { if (typeof currentObj === 'undefined') { wasFound = false; } else { if (currentObj.hasOwnProperty(key)) { currentObj = currentObj[key]; } else { wasFound = false; }; }; }); } else { wasFound = false; }; return wasFound; }
export const isObject = (checkThis) => { if (typeof checkThis !== 'undefined') { return checkThis && {}.toString.call(checkThis) === '[object Object]'; } }
export const isArray = (checkThis) => { if (typeof checkThis !== 'undefined') { return checkThis && {}.toString.call(checkThis) === '[object Array]'; } }
export const isFunction = (checkThis) => { if (typeof checkThis !== 'undefined') { return checkThis && {}.toString.call(checkThis) === '[object Function]'; } }
export const ensureArray = (checkThis) => { return ((checkThis) && isArray(checkThis)) ? checkThis : ((checkThis) && isArray(JSON.parse(checkThis))) ? JSON.parse(checkThis) : []; }
export const deepClone = (src) => { let target = {}; for (let prop in src) { if (src.hasOwnProperty(prop)) { target[prop] = src[prop]; } } return target; }
export const deepValue = (o, p) => p.split('.').reduce((a, v) => a[v], o);
export const isArrayEmpty = (a) => (!Array.isArray(a) || !a.length)
export const arrayBufferToStr = (buffer, encoding = 'utf-8') => { return new TextDecoder(encoding).decode(buffer); }
export const strToArrayBuffer = (str, encoding = 'utf-8') => { return new TextEncoder(encoding).encode(str); }
export const isValidEmail = (addr = '') => { let lastseg = (addr.split('@')[1]||'').split('.')[1]||'', input = document.createElement('input'); input.type = "email"; input.required = true; input.value = addr; return !!(addr && (input.validity && input.validity.valid) && lastseg.length); };
export const stripTags = (htmlstr) => { let div = document.createElement('div'); div.innerHTML = htmlstr; return div.textContent; };
export const shuffleArray = (array) => { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; }; };
export const getAbsoluteUrl = (url) => { let a; if(!a) { a = document.createElement('a'); }; a.href = url; return a.href; };

export const debounce = (func, wait, immediate) => { let timeout; return function() { let context = this, args = arguments; let later = function() { timeout = null; if (!immediate) { func.apply(context, args); }; }; let callNow = immediate && !timeout; clearTimeout(timeout); timeout = setTimeout(later, wait); if (callNow) { func.apply(context, args); }; }; };
export const poll = (fn, timeout, interval) => { let endTime = Number(new Date()) + (timeout || 2000); interval = interval || 100; let checkCondition = function(resolve, reject) { var result = fn(); if (result) { resolve(result); } else if (Number(new Date()) < endTime) { setTimeout(checkCondition, interval, resolve, reject); } else { reject(new Error('timed out for '+fn+': '+arguments)); }; }; return new Promise(checkCondition); };
export const once = (fn, context) => { let result; return function() { if (fn) { result = fn.apply(context || this, arguments); fn = null; }; return result; }; };

export const scrollToHash = () => { const elementId = window.location.hash.split('#').pop(); if (elementId) { const element = document.getElementById(elementId); if (element) { element.scrollIntoView(true); }; }; };

// let myFunc = debounce(() => { console.log('ran'); }, 2000);

// poll(() => {
// 	/* test */ return document.getElementById('topdog');
// }, 6000, 150).then(() => {
// 	/* success */ console.log('goose');
// }).catch(() => {
// 	/* timeout */ console.log('duck');
// });

// let myFunc = once(() => { console.log('ran'); });

