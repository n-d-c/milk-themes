import{S as n,i as t,s as e,e as o,q as i,c as l,d as a,a as s,b as c,n as r,f as u,m as d,p as h,u as $,r as m,v,x as p}from"./milk-0ce1a389.js";function f(n){let t;return{c(){t=o("meta"),this.h()},l(n){const e=i('[data-svelte="svelte-jw2sw1"]',document.head);t=l(e,"META",{"http-equiv":!0,content:!0}),e.forEach(a),this.h()},h(){s(t,"http-equiv","content-language"),s(t,"content",n[0])},m(n,e){c(document.head,t)},p(n,[e]){1&e&&s(t,"content",n[0])},i:r,o:r,d(n){a(t)}}}function w(n,t,e){let o;var i,l;u(n,d,(n=>e(3,o=n)));var{lang:a="en"}=t;return n.$$set=n=>{"lang"in n&&e(0,a=n.lang)},n.$$.update=()=>{15&n.$$.dirty&&(a||e(0,a=(null==e(1,i=o)||null==e(2,l=i.config)?void 0:l.lang)||"en"))},[a,i,l,o]}class y extends n{constructor(n){super(),t(this,n,w,f,e,{lang:0})}}function g(n){let t,e,r,u,d;document.title=t=n[0];const p=n[13].default,f=h(p,n,n[12],null);return{c(){e=o("meta"),r=o("meta"),u=o("link"),f&&f.c(),this.h()},l(n){const t=i('[data-svelte="svelte-gzikas"]',document.head);e=l(t,"META",{name:!0,content:!0}),r=l(t,"META",{name:!0,content:!0}),u=l(t,"LINK",{rel:!0,href:!0}),f&&f.l(t),t.forEach(a),this.h()},h(){s(e,"name","description"),s(e,"content",n[1]),s(r,"name","keywords"),s(r,"content",n[2]),s(u,"rel","canonical"),s(u,"href",n[3])},m(n,t){c(document.head,e),c(document.head,r),c(document.head,u),f&&f.m(document.head,null),d=!0},p(n,[o]){(!d||1&o)&&t!==(t=n[0])&&(document.title=t),(!d||2&o)&&s(e,"content",n[1]),(!d||4&o)&&s(r,"content",n[2]),(!d||8&o)&&s(u,"href",n[3]),f&&f.p&&4096&o&&$(f,p,n,n[12],o,null,null)},i(n){d||(m(f,n),d=!0)},o(n){v(f,n),d=!1},d(n){a(e),a(r),a(u),f&&f.d(n)}}}function k(n,t,e,o,i,l,a){try{var s=n[l](a),c=s.value}catch(r){return void e(r)}s.done?t(c):Promise.resolve(c).then(o,i)}function x(n){return function(){var t=this,e=arguments;return new Promise((function(o,i){var l=n.apply(t,e);function a(n){k(l,o,i,a,s,"next",n)}function s(n){k(l,o,i,a,s,"throw",n)}a(void 0)}))}}function E(n,t,e){let o;u(n,d,(n=>e(11,o=n)));let{$$slots:i={},$$scope:l}=t;var a,s,c,r,h,$,{title:m}=t,{description:v}=t,{keywords:f}=t,{canonical:w}=t,y="";return p(x((function*(){var n,t,i,l,a,s;e(10,y=null!=(n=window)&&null!=(t=n.location)&&t.href?null==(i=window)||null==(l=i.location)?void 0:l.href:null==(a=o)||null==(s=a.site)?void 0:s.url)}))),n.$$set=n=>{"title"in n&&e(0,m=n.title),"description"in n&&e(1,v=n.description),"keywords"in n&&e(2,f=n.keywords),"canonical"in n&&e(3,w=n.canonical),"$$scope"in n&&e(12,l=n.$$scope)},n.$$.update=()=>{2097&n.$$.dirty&&(m||e(0,m=(null==e(4,a=o)||null==e(5,s=a.site)?void 0:s.title)||"")),2242&n.$$.dirty&&(v||e(1,v=(null==e(6,c=o)||null==e(7,r=c.site)?void 0:r.description)||"")),2820&n.$$.dirty&&(f||e(2,f=(null==e(8,h=o)||null==e(9,$=h.site)?void 0:$.keywords)||"")),1032&n.$$.dirty&&(w||e(3,w=y||""))},[m,v,f,w,a,s,c,r,h,$,y,o,l,i]}class q extends n{constructor(n){super(),t(this,n,E,g,e,{title:0,description:1,keywords:2,canonical:3})}}export{y as H,q as a};
