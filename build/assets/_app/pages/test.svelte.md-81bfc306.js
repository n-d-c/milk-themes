import{S as s,i as a,s as t,x as n,y as e,z as o,p as c,r,A as l,o as p,u as i,E as u,G as $,H as f,e as d,t as h,h as m,c as g,f as k,m as x,d as j,j as y,a as E,k as T,b,n as v}from"../chunks/index-b6a42182.js";import{L as H}from"../chunks/Layout_Main-256fac1f.js";import"../chunks/milk-0fba135e.js";function L(s){let a;const t=s[0].default,n=p(t,s,s[1],null);return{c(){n&&n.c()},l(s){n&&n.l(s)},m(s,t){n&&n.m(s,t),a=!0},p(s,a){n&&n.p&&2&a&&i(n,t,s,s[1],a,null,null)},i(s){a||(c(n,s),a=!0)},o(s){r(n,s),a=!1},d(s){n&&n.d(s)}}}function M(s){let a,t;return a=new H({props:{$$slots:{default:[L]},$$scope:{ctx:s}}}),{c(){n(a.$$.fragment)},l(s){e(a.$$.fragment,s)},m(s,n){o(a,s,n),t=!0},p(s,[t]){const n={};2&t&&(n.$$scope={dirty:t,ctx:s}),a.$set(n)},i(s){t||(c(a.$$.fragment,s),t=!0)},o(s){r(a.$$.fragment,s),t=!1},d(s){l(a,s)}}}function w(s,a,t){let{$$slots:n={},$$scope:e}=a;return s.$$set=s=>{"$$scope"in s&&t(1,e=s.$$scope)},[n,e]}class A extends s{constructor(s){super(),a(this,s,w,M,t,{})}}function P(s){let a,t,n,e,o,c,r,l,p,i,u;return{c(){a=d("h1"),t=d("a"),n=h("This is a Test"),e=m(),o=d("pre"),c=m(),r=d("pre"),l=m(),p=d("p"),i=d("img"),this.h()},l(s){a=g(s,"H1",{id:!0});var u=k(a);t=g(u,"A",{href:!0});var $=k(t);n=x($,"This is a Test"),$.forEach(j),u.forEach(j),e=y(s),o=g(s,"PRE",{class:!0}),k(o).forEach(j),c=y(s),r=g(s,"PRE",{class:!0}),k(r).forEach(j),l=y(s),p=g(s,"P",{});var f=k(p);i=g(f,"IMG",{src:!0,alt:!0}),f.forEach(j),this.h()},h(){E(t,"href","#this-is-a-test"),E(a,"id","this-is-a-test"),E(o,"class","language-js"),E(r,"class","language-css"),i.src!==(u="/img/profile_1200x1200.jpg")&&E(i,"src","/img/profile_1200x1200.jpg"),E(i,"alt","A super cool pic or somthing.")},m(s,u){T(s,a,u),b(a,t),b(t,n),T(s,e,u),T(s,o,u),o.innerHTML='<code class="language-js"><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code>',T(s,c,u),T(s,r,u),r.innerHTML='<code class="language-css"><span class="token selector">body</span> <span class="token punctuation">&#123;</span> <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span> <span class="token punctuation">&#125;</span></code>',T(s,l,u),T(s,p,u),b(p,i)},p:v,d(s){s&&j(a),s&&j(e),s&&j(o),s&&j(c),s&&j(r),s&&j(l),s&&j(p)}}}function _(s){let a,t;const p=[G];let i={$$slots:{default:[P]},$$scope:{ctx:s}};for(let n=0;n<p.length;n+=1)i=u(i,p[n]);return a=new A({props:i}),{c(){n(a.$$.fragment)},l(s){e(a.$$.fragment,s)},m(s,n){o(a,s,n),t=!0},p(s,[t]){const n=0&t?$(p,[f(G)]):{};1&t&&(n.$$scope={dirty:t,ctx:s}),a.$set(n)},i(s){t||(c(a.$$.fragment,s),t=!0)},o(s){r(a.$$.fragment,s),t=!1},d(s){l(a,s)}}}var G={layout:"default"};export default class extends s{constructor(s){super(),a(this,s,null,_,t,{})}}export{G as metadata};