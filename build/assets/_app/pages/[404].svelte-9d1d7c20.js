import{S as a,i as t,s as e,c as r,a as s,b as n,d as o,m as i,e as l,t as c,f as g,g as u,h as $,j as f,o as m,k as d,l as p,n as h,p as v,q as w,r as y,u as b,v as k}from"../chunks/index-7a36a124.js";import{L as _,m as j}from"../chunks/Layout_Main-b0b29ee4.js";import{H as x}from"../chunks/Hero-2cad16d2.js";import{H,a as E,b as I,c as q}from"../chunks/Head_Twitter-b974afef.js";import{Q as A}from"../chunks/wordpress.graphql-58acdd03.js";function P(a){let t,e;return{c(){t=p("h1"),e=h("We couldn't find that page. If your search matches an available post\n\t\t\tyou will be redirected shortly"),this.h()},l(a){t=v(a,"H1",{class:!0});var r=w(t);e=y(r,"We couldn't find that page. If your search matches an available post\n\t\t\tyou will be redirected shortly"),r.forEach($),this.h()},h(){b(t,"class","darker-bg svelte-nca4y")},m(a,r){l(a,t,r),k(t,e)},d(a){a&&$(t)}}}function L(a){let t,e,f,m,d;return t=new x({props:{id:"hero-home-01",image_url:"/img/hya-404-page.jpg",img_srcset:"/img/hya-404-page.jpg",avif_srcset:"/img/hya-404-page.avif",image_loading:"eager",webp_srcset:"/img/hya-404-page.webp",title:"Harlan York and Associates",parallax:"false",$$slots:{default:[P]},$$scope:{ctx:a}}}),{c(){r(t.$$.fragment),e=s(),f=p("h1"),m=h("Error: 404"),this.h()},l(a){n(t.$$.fragment,a),e=o(a),f=v(a,"H1",{class:!0});var r=w(f);m=y(r,"Error: 404"),r.forEach($),this.h()},h(){b(f,"class","error-code svelte-nca4y")},m(a,r){i(t,a,r),l(a,e,r),l(a,f,r),k(f,m),d=!0},p(a,e){const r={};128&e&&(r.$$scope={dirty:e,ctx:a}),t.$set(r)},i(a){d||(c(t.$$.fragment,a),d=!0)},o(a){g(t.$$.fragment,a),d=!1},d(a){u(t,a),a&&$(e),a&&$(f)}}}function Q(a){var t,e;let f,m,d,p,h,v,w,y,b,k;return f=new H({props:{lang:"en"}}),d=new E({props:{title:a[1],description:T,keywords:null==(e=null==(t=a[0])?void 0:t.site)?void 0:e.keywords}}),h=new I({props:{title:a[1],description:T,image:"/img/hero_homepage_01.jpg"}}),w=new q({props:{title:a[1],description:T,image:"/img/hero_homepage_01.jpg"}}),b=new _({props:{id:"page-homepage",$$slots:{default:[L]},$$scope:{ctx:a}}}),{c(){r(f.$$.fragment),m=s(),r(d.$$.fragment),p=s(),r(h.$$.fragment),v=s(),r(w.$$.fragment),y=s(),r(b.$$.fragment)},l(a){n(f.$$.fragment,a),m=o(a),n(d.$$.fragment,a),p=o(a),n(h.$$.fragment,a),v=o(a),n(w.$$.fragment,a),y=o(a),n(b.$$.fragment,a)},m(a,t){i(f,a,t),l(a,m,t),i(d,a,t),l(a,p,t),i(h,a,t),l(a,v,t),i(w,a,t),l(a,y,t),i(b,a,t),k=!0},p(a,[t]){var e,r;const s={};1&t&&(s.keywords=null==(r=null==(e=a[0])?void 0:e.site)?void 0:r.keywords),d.$set(s);const n={};128&t&&(n.$$scope={dirty:t,ctx:a}),b.$set(n)},i(a){k||(c(f.$$.fragment,a),c(d.$$.fragment,a),c(h.$$.fragment,a),c(w.$$.fragment,a),c(b.$$.fragment,a),k=!0)},o(a){g(f.$$.fragment,a),g(d.$$.fragment,a),g(h.$$.fragment,a),g(w.$$.fragment,a),g(b.$$.fragment,a),k=!1},d(a){u(f,a),a&&$(m),u(d,a),a&&$(p),u(h,a),a&&$(v),u(w,a),a&&$(y),u(b,a)}}}var T="Protecting The Rights of Immigrants Across America for a Quarter Century";function W(a,t,e,r,s,n,o){try{var i=a[n](o),l=i.value}catch(c){return void e(c)}i.done?t(l):Promise.resolve(l).then(r,s)}function B(a){return function(){var t=this,e=arguments;return new Promise((function(r,s){var n=a.apply(t,e);function o(a){W(n,r,s,o,i,"next",a)}function i(a){W(n,r,s,o,i,"throw",a)}o(void 0)}))}}function C(a,t,e){let r;var s,n;f(a,j,(a=>e(0,r=a)));var o=()=>{},{status:i}=t,{slug:l}=t,c=null==(s=r)||null==(n=s.site)?void 0:n.title;return m(B((function*(){var a,t;e(2,l=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var s={slug:l},n=null==(a=r)||null==(t=a.data)?void 0:t.gql(A,r.data.sources.wordpress,s,!1,0);o=yield null==n?void 0:n.subscribe(function(){var a=B((function*(a){null!=(yield a).postBy&&(window.location="/immigration-law-blog/"+l)}));return function(t){return a.apply(this,arguments)}}())}))),d((()=>{o()})),a.$$set=a=>{"status"in a&&e(3,i=a.status),"slug"in a&&e(2,l=a.slug)},[r,c,l,i]}export default class extends a{constructor(a){super(),t(this,a,C,Q,e,{status:3,slug:2})}}