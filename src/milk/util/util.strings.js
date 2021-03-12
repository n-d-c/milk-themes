/* #### Strings #### */
export const uuid = () => { let dt = new Date().getTime(); let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { let r = (dt + Math.random()*16)%16 | 0; dt = Math.floor(dt/16); return (c=='x' ? r :(r&0x3|0x8)).toString(16); }); return uuid; }
export const random = (length = 10, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") => { let newrandom = ""; for (let i = 0; i < length; i++) { newrandom += possible.charAt(Math.floor(Math.random() * possible.length)); }; return newrandom; }
export const reverse = (str = '') => { return str.split("").reverse().join(""); }
export const rot13 = (str = '') => { return str.replace(/[a-zA-Z]/g, (c) => { return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26); }); };
export const xOR = (str = '', key = 51) => { let encoded = ''; for (let i = 0; i < str.length; i++) { let a = str.charCodeAt(i); let b = a ^ key; encoded = encoded+String.fromCharCode(b); }; return encoded; }
export const enc64 = (str = '') => { try { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => { return String.fromCharCode('0x' + p1); })); } catch (err) { return ''; }; }
export const dec64 = (str = '') => { try { return decodeURIComponent(atob(str).split('').map((c) => { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); } catch (err) { return ''; }; };
export const interleave = (str = '', str2 = '')  => { let c = ''; let a = Array.from(str); let b = Array.from(str2); while (a.length > 0 || b.length > 0) { if (a.length > 0) { c += a.splice(0,1); }; if (b.length > 0) { c += b.splice(0,1); }; }; return c; };
export const deinterleave = (str = '') => { let str1 = ''; let str2 = ''; for (let i = 0; i < str.length; i++) { if (i % 2 == 0) { str1 += str[i]; } else { str2 += str[i]; }; }; return [str1, str2]; }
export const obfuscate = (str = '') => { str = encodeURIComponent(rot13(reverse(enc64(xOR(interleave(str, random(str.length))))))); return str; }
export const deobfuscate = (str = '') => { str = deinterleave(xOR(dec64(reverse(rot13(decodeURIComponent(str))))))[0]; return str; }
export const hash = (str = '') => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); /* Convert to 32bit integer */ hash |= 0; }; return Math.abs(hash); };
export const strip_trailing_slash = (url = '') => { return url.replace(/\/$/, ''); };