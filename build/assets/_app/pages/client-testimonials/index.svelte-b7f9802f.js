import{S as t,i as e,s as n,e as a,t as i,h as l,c as s,f as o,m as r,d as m,j as c,a as $,k as d,b as u,F as f,B as g,n as v,L as p,g as h,v as w,M as k,x as y,y as b,z as _,p as T,r as x,A as j}from"../../chunks/index-eebdc0b4.js";import{m as B}from"../../chunks/milk-e4e45209.js";import{H as E,a as I,b as V,c as D}from"../../chunks/Head_Twitter-47149dd5.js";import{a as S,L as C}from"../../chunks/Layout_Main-75a53143.js";import{H,S as L}from"../../chunks/SocialMedia-a60c3949.js";import{B as R}from"../../chunks/Block_CallOutText-de942ba9.js";import{F as q}from"../../chunks/FeaturedVideo-a8c61085.js";import{k as z,e as A,B as F,c as M,d as O}from"../../chunks/Block_Ratings-9ba6a143.js";import{B as P}from"../../chunks/Block_LanguagesWeSpeak-a97b87e1.js";function G(t,e,n){const a=t.slice();return a[6]=e[n],a}function N(t){var e,n;let a,l=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.relationship)+"";return{c(){a=i(l)},l(t){a=r(t,l)},m(t,e){d(t,a,e)},p(t,e){var n,i;4&e&&l!==(l=(null==(i=null==(n=t[6])?void 0:n.Testimonial)?void 0:i.relationship)+"")&&f(a,l)},d(t){t&&m(a)}}}function U(t){var e,n;let l,c,g,v=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)+"";return{c(){l=a("div"),c=i(v),this.h()},l(t){l=s(t,"DIV",{class:!0,style:!0});var e=o(l);c=r(e,v),e.forEach(m),this.h()},h(){var e,n;$(l,"class","rating svelte-1iluwwd"),$(l,"style",g=`width: ${18*(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)}px`)},m(t,e){d(t,l,e),u(l,c)},p(t,e){var n,a,i,s;4&e&&v!==(v=(null==(a=null==(n=t[6])?void 0:n.Testimonial)?void 0:a.rating)+"")&&f(c,v),4&e&&g!==(g=`width: ${18*(null==(s=null==(i=t[6])?void 0:i.Testimonial)?void 0:s.rating)}px`)&&$(l,"style",g)},d(t){t&&m(l)}}}function W(t){var e,n,g,v,p,h,w;let k,y,b,_,T,x,j,B,E,I,V,D,S,C=(null==(e=t[6])?void 0:e.title)+"",H=(null==(g=null==(n=t[6])?void 0:n.Testimonial)?void 0:g.testimonial)+"",L=(null==(p=null==(v=t[6])?void 0:v.Testimonial)?void 0:p.relationship)&&N(t),R=(null==(w=null==(h=t[6])?void 0:h.Testimonial)?void 0:w.rating)&&U(t);return{c(){k=a("div"),y=a("div"),b=a("div"),_=a("strong"),T=i(C),x=i(",\n\t\t\t\t\t\t"),L&&L.c(),j=l(),B=a("div"),E=i('"'),I=i(H),V=i('"'),D=l(),R&&R.c(),S=l(),this.h()},l(t){k=s(t,"DIV",{class:!0});var e=o(k);y=s(e,"DIV",{class:!0});var n=o(y);b=s(n,"DIV",{class:!0});var a=o(b);_=s(a,"STRONG",{});var i=o(_);T=r(i,C),i.forEach(m),x=r(a,",\n\t\t\t\t\t\t"),L&&L.l(a),a.forEach(m),j=c(n),B=s(n,"DIV",{class:!0});var l=o(B);E=r(l,'"'),I=r(l,H),V=r(l,'"'),l.forEach(m),D=c(n),R&&R.l(n),n.forEach(m),S=c(e),e.forEach(m),this.h()},h(){$(b,"class","testimonial-title"),$(B,"class","testimonial-quote svelte-1iluwwd"),$(y,"class","testimonial-content svelte-1iluwwd"),$(k,"class","testimonial svelte-1iluwwd")},m(t,e){d(t,k,e),u(k,y),u(y,b),u(b,_),u(_,T),u(b,x),L&&L.m(b,null),u(y,j),u(y,B),u(B,E),u(B,I),u(B,V),u(y,D),R&&R.m(y,null),u(k,S)},p(t,e){var n,a,i,l,s,o,r;4&e&&C!==(C=(null==(n=t[6])?void 0:n.title)+"")&&f(T,C),(null==(i=null==(a=t[6])?void 0:a.Testimonial)?void 0:i.relationship)?L?L.p(t,e):(L=N(t),L.c(),L.m(b,null)):L&&(L.d(1),L=null),4&e&&H!==(H=(null==(s=null==(l=t[6])?void 0:l.Testimonial)?void 0:s.testimonial)+"")&&f(I,H),(null==(r=null==(o=t[6])?void 0:o.Testimonial)?void 0:r.rating)?R?R.p(t,e):(R=U(t),R.c(),R.m(y,null)):R&&(R.d(1),R=null)},d(t){t&&m(k),L&&L.d(),R&&R.d()}}}function X(t){let e,n,i,l=t[2],r=[];for(let a=0;a<l.length;a+=1)r[a]=W(G(t,l,a));return{c(){e=a("div"),n=a("div");for(let t=0;t<r.length;t+=1)r[t].c();this.h()},l(t){e=s(t,"DIV",{id:!0,class:!0});var a=o(e);n=s(a,"DIV",{class:!0});var i=o(n);for(let e=0;e<r.length;e+=1)r[e].l(i);i.forEach(m),a.forEach(m),this.h()},h(){$(n,"class","testimonials-inner svelte-1iluwwd"),$(e,"id",t[0]),$(e,"class",i=g(t[1])+" svelte-1iluwwd")},m(t,a){d(t,e,a),u(e,n);for(let e=0;e<r.length;e+=1)r[e].m(n,null)},p(t,[a]){if(4&a){let e;for(l=t[2],e=0;e<l.length;e+=1){const i=G(t,l,e);r[e]?r[e].p(i,a):(r[e]=W(i),r[e].c(),r[e].m(n,null))}for(;e<r.length;e+=1)r[e].d(1);r.length=l.length}1&a&&$(e,"id",t[0]),2&a&&i!==(i=g(t[1])+" svelte-1iluwwd")&&$(e,"class",i)},i:v,o:v,d(t){t&&m(e),p(r,t)}}}function Y(t,e,n,a,i,l,s){try{var o=t[l](s),r=o.value}catch(m){return void n(m)}o.done?e(r):Promise.resolve(r).then(a,i)}function J(t){return function(){var e=this,n=arguments;return new Promise((function(a,i){var l=t.apply(e,n);function s(t){Y(l,a,i,s,o,"next",t)}function o(t){Y(l,a,i,s,o,"throw",t)}s(void 0)}))}}function K(t,e,n){let a;h(t,B,(t=>n(5,a=t)));var{id:i}=e,{blockstyle:l=""}=e,s="testimonials",o=z,r=()=>{};return w(J((function*(){var t,e,i=null==(t=a)||null==(e=t.data)?void 0:e.gql(A,a.data.sources.wordpress,{size:99});r=yield null==i?void 0:i.subscribe(function(){var t=J((function*(t){var e,a=yield t,i=null==a||null==(e=a.testimonials)?void 0:e.nodes;S(i),n(2,o=i.slice(0,20)),console.log(o)}));return function(e){return t.apply(this,arguments)}}())}))),k((()=>{r()})),t.$$set=t=>{"id"in t&&n(0,i=t.id),"blockstyle"in t&&n(3,l=t.blockstyle)},t.$$.update=()=>{8&t.$$.dirty&&n(1,s="testimonials "+l)},[i,s,o,l]}class Q extends t{constructor(t){super(),e(this,t,K,X,n,{id:0,blockstyle:3})}}function Z(t){let e,n;return{c(){e=a("p"),n=i(nt)},l(t){e=s(t,"P",{});var a=o(e);n=r(a,nt),a.forEach(m)},m(t,a){d(t,e,a),u(e,n)},p:v,d(t){t&&m(e)}}}function tt(t){let e,n,i,o,r,$,u,f,g,v,p,h,w,k,B,E,I,V,D,S,C;return e=new H({props:{id:"hero-client-testimonials-02",image_url:"/img/hero_testimonial_01.jpg",image_loading:"eager",img_srcset:"/img/hero_testimonial_01.jpg",avif_srcset:"/img/hero_testimonial_01.avif",webp_srcset:"/img/hero_testimonial_01.webp",title:"Client Testimonials",parallax:"false"}}),i=new R({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:"Immigration Testimonials",$$slots:{default:[Z]},$$scope:{ctx:t}}}),r=new Q({props:{id:"testimonials",blockstyle:""}}),u=new q({props:{id:"testimonial-video-02",blockstyle:"",video_source:"//www.youtube.com/embed/13GqCdXBr80",video_jpg:"/img/espanol-video-02.jpg",video_webp:"/img/espanol-video-02.webp",video_avif:"/img/espanol-video-02.avif"}}),h=new F({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),k=new P({}),E=new M({props:{id:"featured",blockstyle:""}}),V=new O({props:{id:"ratings",blockstyle:""}}),S=new L({props:{id:"socialmedia",blockstyle:""}}),{c(){y(e.$$.fragment),n=l(),y(i.$$.fragment),o=l(),y(r.$$.fragment),$=l(),y(u.$$.fragment),f=l(),g=a("br"),v=a("br"),p=l(),y(h.$$.fragment),w=l(),y(k.$$.fragment),B=l(),y(E.$$.fragment),I=l(),y(V.$$.fragment),D=l(),y(S.$$.fragment)},l(t){b(e.$$.fragment,t),n=c(t),b(i.$$.fragment,t),o=c(t),b(r.$$.fragment,t),$=c(t),b(u.$$.fragment,t),f=c(t),g=s(t,"BR",{}),v=s(t,"BR",{}),p=c(t),b(h.$$.fragment,t),w=c(t),b(k.$$.fragment,t),B=c(t),b(E.$$.fragment,t),I=c(t),b(V.$$.fragment,t),D=c(t),b(S.$$.fragment,t)},m(t,a){_(e,t,a),d(t,n,a),_(i,t,a),d(t,o,a),_(r,t,a),d(t,$,a),_(u,t,a),d(t,f,a),d(t,g,a),d(t,v,a),d(t,p,a),_(h,t,a),d(t,w,a),_(k,t,a),d(t,B,a),_(E,t,a),d(t,I,a),_(V,t,a),d(t,D,a),_(S,t,a),C=!0},p(t,e){const n={};16&e&&(n.$$scope={dirty:e,ctx:t}),i.$set(n)},i(t){C||(T(e.$$.fragment,t),T(i.$$.fragment,t),T(r.$$.fragment,t),T(u.$$.fragment,t),T(h.$$.fragment,t),T(k.$$.fragment,t),T(E.$$.fragment,t),T(V.$$.fragment,t),T(S.$$.fragment,t),C=!0)},o(t){x(e.$$.fragment,t),x(i.$$.fragment,t),x(r.$$.fragment,t),x(u.$$.fragment,t),x(h.$$.fragment,t),x(k.$$.fragment,t),x(E.$$.fragment,t),x(V.$$.fragment,t),x(S.$$.fragment,t),C=!1},d(t){j(e,t),t&&m(n),j(i,t),t&&m(o),j(r,t),t&&m($),j(u,t),t&&m(f),t&&m(g),t&&m(v),t&&m(p),j(h,t),t&&m(w),j(k,t),t&&m(B),j(E,t),t&&m(I),j(V,t),t&&m(D),j(S,t)}}}function et(t){var e,n;let a,i,s,o,r,$,u,f,g,v;return a=new E({props:{lang:"en"}}),s=new I({props:{title:t[1],description:nt,keywords:null==(n=null==(e=t[0])?void 0:e.site)?void 0:n.keywords}}),r=new V({props:{title:t[1],description:nt,image:"/img/hero_homepage_02.jpg"}}),u=new D({props:{title:t[1],description:nt,image:"/img/hero_homepage_02.jpg"}}),g=new C({props:{id:"immigration-attorneys",$$slots:{default:[tt]},$$scope:{ctx:t}}}),{c(){y(a.$$.fragment),i=l(),y(s.$$.fragment),o=l(),y(r.$$.fragment),$=l(),y(u.$$.fragment),f=l(),y(g.$$.fragment)},l(t){b(a.$$.fragment,t),i=c(t),b(s.$$.fragment,t),o=c(t),b(r.$$.fragment,t),$=c(t),b(u.$$.fragment,t),f=c(t),b(g.$$.fragment,t)},m(t,e){_(a,t,e),d(t,i,e),_(s,t,e),d(t,o,e),_(r,t,e),d(t,$,e),_(u,t,e),d(t,f,e),_(g,t,e),v=!0},p(t,[e]){var n,a;const i={};1&e&&(i.keywords=null==(a=null==(n=t[0])?void 0:n.site)?void 0:a.keywords),s.$set(i);const l={};16&e&&(l.$$scope={dirty:e,ctx:t}),g.$set(l)},i(t){v||(T(a.$$.fragment,t),T(s.$$.fragment,t),T(r.$$.fragment,t),T(u.$$.fragment,t),T(g.$$.fragment,t),v=!0)},o(t){x(a.$$.fragment,t),x(s.$$.fragment,t),x(r.$$.fragment,t),x(u.$$.fragment,t),x(g.$$.fragment,t),v=!1},d(t){j(a,t),t&&m(i),j(s,t),t&&m(o),j(r,t),t&&m($),j(u,t),t&&m(f),j(g,t)}}}var nt="Our Immigration Attorneys help thousands of clients avoid deportation, get their green cards and become US citizens. See what our clients and colleagues have to say about how Harlan York & Associates helped them with their case.";function at(t,e,n){let a;var i,l;h(t,B,(t=>n(0,a=t)));var s="Client Testimonials - "+(null==(i=a)||null==(l=i.site)?void 0:l.title);return[a,s]}export default class extends t{constructor(t){super(),e(this,t,at,et,n,{})}}
