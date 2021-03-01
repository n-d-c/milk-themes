/* #### Requests #### */
/* # NOTE: setupParams() is optional to pre-setup the object, all the helper functions will set this up for themselves if it does not exist. # */
export const getCurrentUrl = () => { return `${window.location.origin}${window.location.pathname}`; }
export const setupParams = () => { window.params = new URLSearchParams(window.location.search); }
export const getUrlParam = (key = null) => { if (!(window.params)) { window.params = new URLSearchParams(window.location.search); }; return decodeURIComponent(window.params.get(key)); }
export const setUrlParam = (key = null, value = '') => { if (!(window.params)) { window.params = new URLSearchParams(window.location.search); }; return window.params.set(key, encodeURIComponent(value)); }
export const deleteUrlParam = (key = null) => { if (!(window.params)) { window.params = new URLSearchParams(window.location.search); }; return window.params.delete(key); }
export const getUrlParamExtra = (key = null) => { if (!(window.params)) { window.params = new URLSearchParams(window.location.search); }; return window.params.getAll(key); }
export const addUrlParamExtra = (key = null, value = '') => { if (!(window.params)) { window.params = new URLSearchParams(window.location.search); }; return window.params.append(key, value); }