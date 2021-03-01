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
