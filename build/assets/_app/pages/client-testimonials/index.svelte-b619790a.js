import{S as t,i as e,s as n,e as i,t as a,h as l,c as s,f as o,m as r,d as m,j as c,a as $,k as d,b as u,F as f,B as g,n as v,N as p,g as h,v as w,O as k,x as y,y as b,z as _,p as T,r as x,A as j}from"../../chunks/index-b6a42182.js";import{m as B}from"../../chunks/milk-0fba135e.js";import{H as E,a as I,b as V,c as D}from"../../chunks/Head_Twitter-0458c92f.js";import{a as S,L as C}from"../../chunks/Layout_Main-256fac1f.js";import{H,S as O}from"../../chunks/SocialMedia-171b165f.js";import{B as R}from"../../chunks/Block_CallOutText-f8620481.js";import{F as q}from"../../chunks/FeaturedVideo-99b2b7c1.js";import{k as z,e as A,B as F,c as L,d as P}from"../../chunks/Block_Ratings-df229d8f.js";import{B as G}from"../../chunks/Block_LanguagesWeSpeak-65f11e27.js";function M(t,e,n){const i=t.slice();return i[6]=e[n],i}function N(t){var e,n;let i,l=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.relationship)+"";return{c(){i=a(l)},l(t){i=r(t,l)},m(t,e){d(t,i,e)},p(t,e){var n,a;4&e&&l!==(l=(null==(a=null==(n=t[6])?void 0:n.Testimonial)?void 0:a.relationship)+"")&&f(i,l)},d(t){t&&m(i)}}}function U(t){var e,n;let l,c,g,v=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)+"";return{c(){l=i("div"),c=a(v),this.h()},l(t){l=s(t,"DIV",{class:!0,style:!0});var e=o(l);c=r(e,v),e.forEach(m),this.h()},h(){var e,n;$(l,"class","rating svelte-1iluwwd"),$(l,"style",g=`width: ${18*(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)}px`)},m(t,e){d(t,l,e),u(l,c)},p(t,e){var n,i,a,s;4&e&&v!==(v=(null==(i=null==(n=t[6])?void 0:n.Testimonial)?void 0:i.rating)+"")&&f(c,v),4&e&&g!==(g=`width: ${18*(null==(s=null==(a=t[6])?void 0:a.Testimonial)?void 0:s.rating)}px`)&&$(l,"style",g)},d(t){t&&m(l)}}}function W(t){var e,n,g,v,p,h,w;let k,y,b,_,T,x,j,B,E,I,V,D,S,C=(null==(e=t[6])?void 0:e.title)+"",H=(null==(g=null==(n=t[6])?void 0:n.Testimonial)?void 0:g.testimonial)+"",O=(null==(p=null==(v=t[6])?void 0:v.Testimonial)?void 0:p.relationship)&&N(t),R=(null==(w=null==(h=t[6])?void 0:h.Testimonial)?void 0:w.rating)&&U(t);return{c(){k=i("div"),y=i("div"),b=i("div"),_=i("strong"),T=a(C),x=a(",\n\t\t\t\t\t\t"),O&&O.c(),j=l(),B=i("div"),E=a('"'),I=a(H),V=a('"'),D=l(),R&&R.c(),S=l(),this.h()},l(t){k=s(t,"DIV",{class:!0});var e=o(k);y=s(e,"DIV",{class:!0});var n=o(y);b=s(n,"DIV",{class:!0});var i=o(b);_=s(i,"STRONG",{});var a=o(_);T=r(a,C),a.forEach(m),x=r(i,",\n\t\t\t\t\t\t"),O&&O.l(i),i.forEach(m),j=c(n),B=s(n,"DIV",{class:!0});var l=o(B);E=r(l,'"'),I=r(l,H),V=r(l,'"'),l.forEach(m),D=c(n),R&&R.l(n),n.forEach(m),S=c(e),e.forEach(m),this.h()},h(){$(b,"class","testimonial-title"),$(B,"class","testimonial-quote svelte-1iluwwd"),$(y,"class","testimonial-content svelte-1iluwwd"),$(k,"class","testimonial svelte-1iluwwd")},m(t,e){d(t,k,e),u(k,y),u(y,b),u(b,_),u(_,T),u(b,x),O&&O.m(b,null),u(y,j),u(y,B),u(B,E),u(B,I),u(B,V),u(y,D),R&&R.m(y,null),u(k,S)},p(t,e){var n,i,a,l,s,o,r;4&e&&C!==(C=(null==(n=t[6])?void 0:n.title)+"")&&f(T,C),(null==(a=null==(i=t[6])?void 0:i.Testimonial)?void 0:a.relationship)?O?O.p(t,e):(O=N(t),O.c(),O.m(b,null)):O&&(O.d(1),O=null),4&e&&H!==(H=(null==(s=null==(l=t[6])?void 0:l.Testimonial)?void 0:s.testimonial)+"")&&f(I,H),(null==(r=null==(o=t[6])?void 0:o.Testimonial)?void 0:r.rating)?R?R.p(t,e):(R=U(t),R.c(),R.m(y,null)):R&&(R.d(1),R=null)},d(t){t&&m(k),O&&O.d(),R&&R.d()}}}function X(t){let e,n,a,l=t[2],r=[];for(let i=0;i<l.length;i+=1)r[i]=W(M(t,l,i));return{c(){e=i("div"),n=i("div");for(let t=0;t<r.length;t+=1)r[t].c();this.h()},l(t){e=s(t,"DIV",{id:!0,class:!0});var i=o(e);n=s(i,"DIV",{class:!0});var a=o(n);for(let e=0;e<r.length;e+=1)r[e].l(a);a.forEach(m),i.forEach(m),this.h()},h(){$(n,"class","testimonials-inner svelte-1iluwwd"),$(e,"id",t[0]),$(e,"class",a=g(t[1])+" svelte-1iluwwd")},m(t,i){d(t,e,i),u(e,n);for(let e=0;e<r.length;e+=1)r[e].m(n,null)},p(t,[i]){if(4&i){let e;for(l=t[2],e=0;e<l.length;e+=1){const a=M(t,l,e);r[e]?r[e].p(a,i):(r[e]=W(a),r[e].c(),r[e].m(n,null))}for(;e<r.length;e+=1)r[e].d(1);r.length=l.length}1&i&&$(e,"id",t[0]),2&i&&a!==(a=g(t[1])+" svelte-1iluwwd")&&$(e,"class",a)},i:v,o:v,d(t){t&&m(e),p(r,t)}}}function Y(t,e,n,i,a,l,s){try{var o=t[l](s),r=o.value}catch(m){return void n(m)}o.done?e(r):Promise.resolve(r).then(i,a)}function J(t){return function(){var e=this,n=arguments;return new Promise((function(i,a){var l=t.apply(e,n);function s(t){Y(l,i,a,s,o,"next",t)}function o(t){Y(l,i,a,s,o,"throw",t)}s(void 0)}))}}function K(t,e,n){let i;h(t,B,(t=>n(5,i=t)));var{id:a}=e,{blockstyle:l=""}=e,s="testimonials",o=z,r=()=>{};return w(J((function*(){var t,e,a=null==(t=i)||null==(e=t.data)?void 0:e.gql(A,i.data.sources.wordpress,{size:99});r=yield null==a?void 0:a.subscribe(function(){var t=J((function*(t){var e,i=yield t,a=null==i||null==(e=i.testimonials)?void 0:e.nodes;S(a),n(2,o=a.slice(0,20)),console.log(o)}));return function(e){return t.apply(this,arguments)}}())}))),k((()=>{r()})),t.$$set=t=>{"id"in t&&n(0,a=t.id),"blockstyle"in t&&n(3,l=t.blockstyle)},t.$$.update=()=>{8&t.$$.dirty&&n(1,s="testimonials "+l)},[a,s,o,l]}class Q extends t{constructor(t){super(),e(this,t,K,X,n,{id:0,blockstyle:3})}}function Z(t){let e,n;return{c(){e=i("p"),n=a(nt)},l(t){e=s(t,"P",{});var i=o(e);n=r(i,nt),i.forEach(m)},m(t,i){d(t,e,i),u(e,n)},p:v,d(t){t&&m(e)}}}function tt(t){let e,n,a,o,r,$,u,f,g,v,p,h,w,k,B,E,I,V,D,S,C;return e=new H({props:{id:"hero-client-testimonials-02",image_url:"/img/hero_testimonial_01.jpg",image_loading:"eager",img_srcset:"/img/hero_testimonial_01.jpg",avif_srcset:"/img/hero_testimonial_01.avif",webp_srcset:"/img/hero_testimonial_01.webp",title:"Client Testimonials",parallax:"false"}}),a=new R({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:"Immigration Testimonials",$$slots:{default:[Z]},$$scope:{ctx:t}}}),r=new Q({props:{id:"testimonials",blockstyle:""}}),u=new q({props:{id:"testimonial-video-02",blockstyle:"",video_source:"//www.youtube.com/embed/13GqCdXBr80",video_jpg:"/img/espanol-video-02.jpg",video_webp:"/img/espanol-video-02.webp",video_avif:"/img/espanol-video-02.avif"}}),h=new F({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),k=new G({}),E=new L({props:{id:"featured",blockstyle:""}}),V=new P({props:{id:"ratings",blockstyle:""}}),S=new O({props:{id:"socialmedia",blockstyle:""}}),{c(){y(e.$$.fragment),n=l(),y(a.$$.fragment),o=l(),y(r.$$.fragment),$=l(),y(u.$$.fragment),f=l(),g=i("br"),v=i("br"),p=l(),y(h.$$.fragment),w=l(),y(k.$$.fragment),B=l(),y(E.$$.fragment),I=l(),y(V.$$.fragment),D=l(),y(S.$$.fragment)},l(t){b(e.$$.fragment,t),n=c(t),b(a.$$.fragment,t),o=c(t),b(r.$$.fragment,t),$=c(t),b(u.$$.fragment,t),f=c(t),g=s(t,"BR",{}),v=s(t,"BR",{}),p=c(t),b(h.$$.fragment,t),w=c(t),b(k.$$.fragment,t),B=c(t),b(E.$$.fragment,t),I=c(t),b(V.$$.fragment,t),D=c(t),b(S.$$.fragment,t)},m(t,i){_(e,t,i),d(t,n,i),_(a,t,i),d(t,o,i),_(r,t,i),d(t,$,i),_(u,t,i),d(t,f,i),d(t,g,i),d(t,v,i),d(t,p,i),_(h,t,i),d(t,w,i),_(k,t,i),d(t,B,i),_(E,t,i),d(t,I,i),_(V,t,i),d(t,D,i),_(S,t,i),C=!0},p(t,e){const n={};16&e&&(n.$$scope={dirty:e,ctx:t}),a.$set(n)},i(t){C||(T(e.$$.fragment,t),T(a.$$.fragment,t),T(r.$$.fragment,t),T(u.$$.fragment,t),T(h.$$.fragment,t),T(k.$$.fragment,t),T(E.$$.fragment,t),T(V.$$.fragment,t),T(S.$$.fragment,t),C=!0)},o(t){x(e.$$.fragment,t),x(a.$$.fragment,t),x(r.$$.fragment,t),x(u.$$.fragment,t),x(h.$$.fragment,t),x(k.$$.fragment,t),x(E.$$.fragment,t),x(V.$$.fragment,t),x(S.$$.fragment,t),C=!1},d(t){j(e,t),t&&m(n),j(a,t),t&&m(o),j(r,t),t&&m($),j(u,t),t&&m(f),t&&m(g),t&&m(v),t&&m(p),j(h,t),t&&m(w),j(k,t),t&&m(B),j(E,t),t&&m(I),j(V,t),t&&m(D),j(S,t)}}}function et(t){var e,n;let i,a,s,o,r,$,u,f,g,v;return i=new E({props:{lang:"en"}}),s=new I({props:{title:t[1],description:nt,keywords:null==(n=null==(e=t[0])?void 0:e.site)?void 0:n.keywords}}),r=new V({props:{title:t[1],description:nt,image:"/img/hero_homepage_02.jpg"}}),u=new D({props:{title:t[1],description:nt,image:"/img/hero_homepage_02.jpg"}}),g=new C({props:{id:"immigration-attorneys",$$slots:{default:[tt]},$$scope:{ctx:t}}}),{c(){y(i.$$.fragment),a=l(),y(s.$$.fragment),o=l(),y(r.$$.fragment),$=l(),y(u.$$.fragment),f=l(),y(g.$$.fragment)},l(t){b(i.$$.fragment,t),a=c(t),b(s.$$.fragment,t),o=c(t),b(r.$$.fragment,t),$=c(t),b(u.$$.fragment,t),f=c(t),b(g.$$.fragment,t)},m(t,e){_(i,t,e),d(t,a,e),_(s,t,e),d(t,o,e),_(r,t,e),d(t,$,e),_(u,t,e),d(t,f,e),_(g,t,e),v=!0},p(t,[e]){var n,i;const a={};1&e&&(a.keywords=null==(i=null==(n=t[0])?void 0:n.site)?void 0:i.keywords),s.$set(a);const l={};16&e&&(l.$$scope={dirty:e,ctx:t}),g.$set(l)},i(t){v||(T(i.$$.fragment,t),T(s.$$.fragment,t),T(r.$$.fragment,t),T(u.$$.fragment,t),T(g.$$.fragment,t),v=!0)},o(t){x(i.$$.fragment,t),x(s.$$.fragment,t),x(r.$$.fragment,t),x(u.$$.fragment,t),x(g.$$.fragment,t),v=!1},d(t){j(i,t),t&&m(a),j(s,t),t&&m(o),j(r,t),t&&m($),j(u,t),t&&m(f),j(g,t)}}}var nt="Our Immigration Attorneys help thousands of clients avoid deportation, get their green cards and become US citizens. See what our clients and colleagues have to say about how Harlan York & Associates helped them with their case.";function it(t,e,n){let i;var a,l;h(t,B,(t=>n(0,i=t)));var s="Client Testimonials - "+(null==(a=i)||null==(l=a.site)?void 0:l.title);return[i,s]}export default class extends t{constructor(t){super(),e(this,t,it,et,n,{})}}