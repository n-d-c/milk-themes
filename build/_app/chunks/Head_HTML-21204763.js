import{S as n,i as t,s as e,e as o,E as i,c as l,d as a,o as s,g as c,n as r,F as u,G as d,H as h,I as $,w as m,x as f,B as v}from"./milk-721eff6a.js";function p(n){let t;return{c(){t=o("meta"),this.h()},l(n){const e=i('[data-svelte="svelte-jw2sw1"]',document.head);t=l(e,"META",{"http-equiv":!0,content:!0}),e.forEach(a),this.h()},h(){s(t,"http-equiv","content-language"),s(t,"content",n[0])},m(n,e){c(document.head,t)},p(n,[e]){1&e&&s(t,"content",n[0])},i:r,o:r,d(n){a(t)}}}function w(n,t,e){let o;var i,l;u(n,d,(n=>e(3,o=n)));var{lang:a="en"}=t;return n.$$set=n=>{"lang"in n&&e(0,a=n.lang)},n.$$.update=()=>{15&n.$$.dirty&&(a||e(0,a=(null==e(1,i=o)||null==e(2,l=i.config)?void 0:l.lang)||"en"))},[a,i,l,o]}class y extends n{constructor(n){super(),t(this,n,w,p,e,{lang:0})}}function g(n){let t,e,r,u,d;document.title=t=n[0];const v=n[13].default,p=h(v,n,n[12],null);return{c(){e=o("meta"),r=o("meta"),u=o("link"),p&&p.c(),this.h()},l(n){const t=i('[data-svelte="svelte-gzikas"]',document.head);e=l(t,"META",{name:!0,content:!0}),r=l(t,"META",{name:!0,content:!0}),u=l(t,"LINK",{rel:!0,href:!0}),p&&p.l(t),t.forEach(a),this.h()},h(){s(e,"name","description"),s(e,"content",n[1]),s(r,"name","keywords"),s(r,"content",n[2]),s(u,"rel","canonical"),s(u,"href",n[3])},m(n,t){c(document.head,e),c(document.head,r),c(document.head,u),p&&p.m(document.head,null),d=!0},p(n,[o]){(!d||1&o)&&t!==(t=n[0])&&(document.title=t),(!d||2&o)&&s(e,"content",n[1]),(!d||4&o)&&s(r,"content",n[2]),(!d||8&o)&&s(u,"href",n[3]),p&&p.p&&4096&o&&$(p,v,n,n[12],o,null,null)},i(n){d||(m(p,n),d=!0)},o(n){f(p,n),d=!1},d(n){a(e),a(r),a(u),p&&p.d(n)}}}function k(n,t,e,o,i,l,a){try{var s=n[l](a),c=s.value}catch(r){return void e(r)}s.done?t(c):Promise.resolve(c).then(o,i)}function E(n){return function(){var t=this,e=arguments;return new Promise((function(o,i){var l=n.apply(t,e);function a(n){k(l,o,i,a,s,"next",n)}function s(n){k(l,o,i,a,s,"throw",n)}a(void 0)}))}}function x(n,t,e){let o;u(n,d,(n=>e(11,o=n)));let{$$slots:i={},$$scope:l}=t;var a,s,c,r,h,$,{title:m}=t,{description:f}=t,{keywords:p}=t,{canonical:w}=t,y="";return v(E((function*(){var n,t,i,l,a,s;e(10,y=null!=(n=window)&&null!=(t=n.location)&&t.href?null==(i=window)||null==(l=i.location)?void 0:l.href:null==(a=o)||null==(s=a.site)?void 0:s.url)}))),n.$$set=n=>{"title"in n&&e(0,m=n.title),"description"in n&&e(1,f=n.description),"keywords"in n&&e(2,p=n.keywords),"canonical"in n&&e(3,w=n.canonical),"$$scope"in n&&e(12,l=n.$$scope)},n.$$.update=()=>{2097&n.$$.dirty&&(m||e(0,m=(null==e(4,a=o)||null==e(5,s=a.site)?void 0:s.title)||"")),2242&n.$$.dirty&&(f||e(1,f=(null==e(6,c=o)||null==e(7,r=c.site)?void 0:r.description)||"")),2820&n.$$.dirty&&(p||e(2,p=(null==e(8,h=o)||null==e(9,$=h.site)?void 0:$.keywords)||"")),1032&n.$$.dirty&&(w||e(3,w=y||""))},[m,f,p,w,a,s,c,r,h,$,y,o,l,i]}class A extends n{constructor(n){super(),t(this,n,x,g,e,{title:0,description:1,keywords:2,canonical:3})}}export{y as H,A as a};
