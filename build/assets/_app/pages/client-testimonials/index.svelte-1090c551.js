import{S as t,i as e,s as n,e as a,t as i,h as l,c as s,f as o,m as r,d as m,j as c,a as $,k as g,b as d,F as f,B as u,n as v,N as p,g as h,v as w,O as b,x as k,y,z as _,p as j,r as T,A as x}from"../../chunks/index-b6a42182.js";import{m as B}from"../../chunks/milk-0fba135e.js";import{H as E,a as I,b as V,c as D}from"../../chunks/Head_Twitter-0458c92f.js";import{a as S,L as C}from"../../chunks/Layout_Main-1607eb61.js";import{H,S as L}from"../../chunks/SocialMedia-c63ba219.js";import{B as F}from"../../chunks/Block_CallOutText-f8620481.js";import{F as O}from"../../chunks/FeaturedVideo-b0ea6aef.js";import{n as R,e as q,B as z,c as A,d as P}from"../../chunks/Block_Ratings-224f5889.js";import{B as G}from"../../chunks/Block_LanguagesWeSpeak-65f11e27.js";import{B as M}from"../../chunks/Block_Languages-a40860b7.js";/* empty css                                          */function N(t,e,n){const a=t.slice();return a[6]=e[n],a}function W(t){var e,n;let a,l=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.relationship)+"";return{c(){a=i(l)},l(t){a=r(t,l)},m(t,e){g(t,a,e)},p(t,e){var n,i;4&e&&l!==(l=(null==(i=null==(n=t[6])?void 0:n.Testimonial)?void 0:i.relationship)+"")&&f(a,l)},d(t){t&&m(a)}}}function U(t){var e,n;let l,c,u,v=(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)+"";return{c(){l=a("div"),c=i(v),this.h()},l(t){l=s(t,"DIV",{class:!0,style:!0});var e=o(l);c=r(e,v),e.forEach(m),this.h()},h(){var e,n;$(l,"class","rating svelte-4lwhug"),$(l,"style",u=`width: ${18*(null==(n=null==(e=t[6])?void 0:e.Testimonial)?void 0:n.rating)}px`)},m(t,e){g(t,l,e),d(l,c)},p(t,e){var n,a,i,s;4&e&&v!==(v=(null==(a=null==(n=t[6])?void 0:n.Testimonial)?void 0:a.rating)+"")&&f(c,v),4&e&&u!==(u=`width: ${18*(null==(s=null==(i=t[6])?void 0:i.Testimonial)?void 0:s.rating)}px`)&&$(l,"style",u)},d(t){t&&m(l)}}}function X(t){var e,n,u,v,p,h,w;let b,k,y,_,j,T,x,B,E,I,V,D,S,C=(null==(e=t[6])?void 0:e.title)+"",H=(null==(u=null==(n=t[6])?void 0:n.Testimonial)?void 0:u.testimonial)+"",L=(null==(p=null==(v=t[6])?void 0:v.Testimonial)?void 0:p.relationship)&&W(t),F=(null==(w=null==(h=t[6])?void 0:h.Testimonial)?void 0:w.rating)&&U(t);return{c(){b=a("div"),k=a("div"),y=a("div"),_=a("strong"),j=i(C),T=i(",\n\t\t\t\t\t\t"),L&&L.c(),x=l(),B=a("div"),E=i('"'),I=i(H),V=i('"'),D=l(),F&&F.c(),S=l(),this.h()},l(t){b=s(t,"DIV",{class:!0});var e=o(b);k=s(e,"DIV",{class:!0});var n=o(k);y=s(n,"DIV",{class:!0});var a=o(y);_=s(a,"STRONG",{});var i=o(_);j=r(i,C),i.forEach(m),T=r(a,",\n\t\t\t\t\t\t"),L&&L.l(a),a.forEach(m),x=c(n),B=s(n,"DIV",{class:!0});var l=o(B);E=r(l,'"'),I=r(l,H),V=r(l,'"'),l.forEach(m),D=c(n),F&&F.l(n),n.forEach(m),S=c(e),e.forEach(m),this.h()},h(){$(y,"class","testimonial-title"),$(B,"class","testimonial-quote svelte-4lwhug"),$(k,"class","testimonial-content svelte-4lwhug"),$(b,"class","testimonial svelte-4lwhug")},m(t,e){g(t,b,e),d(b,k),d(k,y),d(y,_),d(_,j),d(y,T),L&&L.m(y,null),d(k,x),d(k,B),d(B,E),d(B,I),d(B,V),d(k,D),F&&F.m(k,null),d(b,S)},p(t,e){var n,a,i,l,s,o,r;4&e&&C!==(C=(null==(n=t[6])?void 0:n.title)+"")&&f(j,C),(null==(i=null==(a=t[6])?void 0:a.Testimonial)?void 0:i.relationship)?L?L.p(t,e):(L=W(t),L.c(),L.m(y,null)):L&&(L.d(1),L=null),4&e&&H!==(H=(null==(s=null==(l=t[6])?void 0:l.Testimonial)?void 0:s.testimonial)+"")&&f(I,H),(null==(r=null==(o=t[6])?void 0:o.Testimonial)?void 0:r.rating)?F?F.p(t,e):(F=U(t),F.c(),F.m(k,null)):F&&(F.d(1),F=null)},d(t){t&&m(b),L&&L.d(),F&&F.d()}}}function Y(t){let e,n,i,l=t[2],r=[];for(let a=0;a<l.length;a+=1)r[a]=X(N(t,l,a));return{c(){e=a("div"),n=a("div");for(let t=0;t<r.length;t+=1)r[t].c();this.h()},l(t){e=s(t,"DIV",{id:!0,class:!0});var a=o(e);n=s(a,"DIV",{class:!0});var i=o(n);for(let e=0;e<r.length;e+=1)r[e].l(i);i.forEach(m),a.forEach(m),this.h()},h(){$(n,"class","testimonials-inner svelte-4lwhug"),$(e,"id",t[0]),$(e,"class",i=u(t[1])+" svelte-4lwhug")},m(t,a){g(t,e,a),d(e,n);for(let e=0;e<r.length;e+=1)r[e].m(n,null)},p(t,[a]){if(4&a){let e;for(l=t[2],e=0;e<l.length;e+=1){const i=N(t,l,e);r[e]?r[e].p(i,a):(r[e]=X(i),r[e].c(),r[e].m(n,null))}for(;e<r.length;e+=1)r[e].d(1);r.length=l.length}1&a&&$(e,"id",t[0]),2&a&&i!==(i=u(t[1])+" svelte-4lwhug")&&$(e,"class",i)},i:v,o:v,d(t){t&&m(e),p(r,t)}}}function J(t,e,n,a,i,l,s){try{var o=t[l](s),r=o.value}catch(m){return void n(m)}o.done?e(r):Promise.resolve(r).then(a,i)}function K(t){return function(){var e=this,n=arguments;return new Promise((function(a,i){var l=t.apply(e,n);function s(t){J(l,a,i,s,o,"next",t)}function o(t){J(l,a,i,s,o,"throw",t)}s(void 0)}))}}function Q(t,e,n){let a;h(t,B,(t=>n(5,a=t)));var{id:i}=e,{blockstyle:l=""}=e,s="testimonials",o=R,r=()=>{};return w(K((function*(){var t,e,i=null==(t=a)||null==(e=t.data)?void 0:e.gql(q,a.data.sources.wordpress,{size:99});r=yield null==i?void 0:i.subscribe(function(){var t=K((function*(t){var e,a=yield t,i=null==a||null==(e=a.testimonials)?void 0:e.nodes;S(i),n(2,o=i.slice(0,20)),console.log(o)}));return function(e){return t.apply(this,arguments)}}())}))),b((()=>{r()})),t.$$set=t=>{"id"in t&&n(0,i=t.id),"blockstyle"in t&&n(3,l=t.blockstyle)},t.$$.update=()=>{8&t.$$.dirty&&n(1,s="testimonials "+l)},[i,s,o,l]}class Z extends t{constructor(t){super(),e(this,t,Q,Y,n,{id:0,blockstyle:3})}}function tt(t){let e,n;return{c(){e=a("p"),n=i(at)},l(t){e=s(t,"P",{});var a=o(e);n=r(a,at),a.forEach(m)},m(t,a){g(t,e,a),d(e,n)},p:v,d(t){t&&m(e)}}}function et(t){let e,n,f,u,v,p,h,w,b,B,E,I,V,D,S,C,R,q,N,W,U,X,Y,J,K,Q,et,nt,at;return e=new H({props:{id:"hero-client-testimonials-02",image_url:"/img/hero_testimonial_01.jpg",img_srcset:"/img/hero_testimonial_01.jpg",avif_srcset:"/img/hero_testimonial_01.avif",webp_srcset:"/img/hero_testimonial_01.webp",title:"Client Testimonials",parallax:"false"}}),f=new F({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:"Immigration Testimonials",$$slots:{default:[tt]},$$scope:{ctx:t}}}),b=new O({props:{id:"testimonial-video-01",blockstyle:"",video_source:"//www.youtube.com/embed/l071-FSWk4E",video_jpg:"/img/testimonial-video-01.jpg",video_webp:"/img/testimonial-video-01.webp",video_avif:"/img/testimonial-video-01.avif"}}),E=new Z({props:{id:"testimonials",blockstyle:""}}),V=new O({props:{id:"testimonial-video-02",blockstyle:"",video_source:"//www.youtube.com/embed/13GqCdXBr80",video_jpg:"/img/espanol-video-02.jpg",video_webp:"/img/espanol-video-02.webp",video_avif:"/img/espanol-video-02.avif"}}),q=new z({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),W=new G({}),X=new M({props:{id:"languages",blockstyle:"block-style04"}}),J=new A({props:{id:"featured",blockstyle:""}}),Q=new P({props:{id:"ratings",blockstyle:""}}),nt=new L({props:{id:"socialmedia",blockstyle:""}}),{c(){k(e.$$.fragment),n=l(),k(f.$$.fragment),u=l(),v=a("div"),p=a("h1"),h=i("Client Testimonials"),w=l(),k(b.$$.fragment),B=l(),k(E.$$.fragment),I=l(),k(V.$$.fragment),D=l(),S=a("br"),C=a("br"),R=l(),k(q.$$.fragment),N=l(),k(W.$$.fragment),U=l(),k(X.$$.fragment),Y=l(),k(J.$$.fragment),K=l(),k(Q.$$.fragment),et=l(),k(nt.$$.fragment),this.h()},l(t){y(e.$$.fragment,t),n=c(t),y(f.$$.fragment,t),u=c(t),v=s(t,"DIV",{class:!0});var a=o(v);p=s(a,"H1",{class:!0});var i=o(p);h=r(i,"Client Testimonials"),i.forEach(m),a.forEach(m),w=c(t),y(b.$$.fragment,t),B=c(t),y(E.$$.fragment,t),I=c(t),y(V.$$.fragment,t),D=c(t),S=s(t,"BR",{}),C=s(t,"BR",{}),R=c(t),y(q.$$.fragment,t),N=c(t),y(W.$$.fragment,t),U=c(t),y(X.$$.fragment,t),Y=c(t),y(J.$$.fragment,t),K=c(t),y(Q.$$.fragment,t),et=c(t),y(nt.$$.fragment,t),this.h()},h(){$(p,"class","title svelte-h689c5"),$(v,"class","content svelte-h689c5")},m(t,a){_(e,t,a),g(t,n,a),_(f,t,a),g(t,u,a),g(t,v,a),d(v,p),d(p,h),g(t,w,a),_(b,t,a),g(t,B,a),_(E,t,a),g(t,I,a),_(V,t,a),g(t,D,a),g(t,S,a),g(t,C,a),g(t,R,a),_(q,t,a),g(t,N,a),_(W,t,a),g(t,U,a),_(X,t,a),g(t,Y,a),_(J,t,a),g(t,K,a),_(Q,t,a),g(t,et,a),_(nt,t,a),at=!0},p(t,e){const n={};16&e&&(n.$$scope={dirty:e,ctx:t}),f.$set(n)},i(t){at||(j(e.$$.fragment,t),j(f.$$.fragment,t),j(b.$$.fragment,t),j(E.$$.fragment,t),j(V.$$.fragment,t),j(q.$$.fragment,t),j(W.$$.fragment,t),j(X.$$.fragment,t),j(J.$$.fragment,t),j(Q.$$.fragment,t),j(nt.$$.fragment,t),at=!0)},o(t){T(e.$$.fragment,t),T(f.$$.fragment,t),T(b.$$.fragment,t),T(E.$$.fragment,t),T(V.$$.fragment,t),T(q.$$.fragment,t),T(W.$$.fragment,t),T(X.$$.fragment,t),T(J.$$.fragment,t),T(Q.$$.fragment,t),T(nt.$$.fragment,t),at=!1},d(t){x(e,t),t&&m(n),x(f,t),t&&m(u),t&&m(v),t&&m(w),x(b,t),t&&m(B),x(E,t),t&&m(I),x(V,t),t&&m(D),t&&m(S),t&&m(C),t&&m(R),x(q,t),t&&m(N),x(W,t),t&&m(U),x(X,t),t&&m(Y),x(J,t),t&&m(K),x(Q,t),t&&m(et),x(nt,t)}}}function nt(t){var e,n;let a,i,s,o,r,$,d,f,u,v;return a=new E({props:{lang:"en"}}),s=new I({props:{title:t[1],description:at,keywords:null==(n=null==(e=t[0])?void 0:e.site)?void 0:n.keywords}}),r=new V({props:{title:t[1],description:at,image:"/img/hero_homepage_02.jpg"}}),d=new D({props:{title:t[1],description:at,image:"/img/hero_homepage_02.jpg"}}),u=new C({props:{id:"immigration-attorneys",$$slots:{default:[et]},$$scope:{ctx:t}}}),{c(){k(a.$$.fragment),i=l(),k(s.$$.fragment),o=l(),k(r.$$.fragment),$=l(),k(d.$$.fragment),f=l(),k(u.$$.fragment)},l(t){y(a.$$.fragment,t),i=c(t),y(s.$$.fragment,t),o=c(t),y(r.$$.fragment,t),$=c(t),y(d.$$.fragment,t),f=c(t),y(u.$$.fragment,t)},m(t,e){_(a,t,e),g(t,i,e),_(s,t,e),g(t,o,e),_(r,t,e),g(t,$,e),_(d,t,e),g(t,f,e),_(u,t,e),v=!0},p(t,[e]){var n,a;const i={};1&e&&(i.keywords=null==(a=null==(n=t[0])?void 0:n.site)?void 0:a.keywords),s.$set(i);const l={};16&e&&(l.$$scope={dirty:e,ctx:t}),u.$set(l)},i(t){v||(j(a.$$.fragment,t),j(s.$$.fragment,t),j(r.$$.fragment,t),j(d.$$.fragment,t),j(u.$$.fragment,t),v=!0)},o(t){T(a.$$.fragment,t),T(s.$$.fragment,t),T(r.$$.fragment,t),T(d.$$.fragment,t),T(u.$$.fragment,t),v=!1},d(t){x(a,t),t&&m(i),x(s,t),t&&m(o),x(r,t),t&&m($),x(d,t),t&&m(f),x(u,t)}}}var at="Our Immigration Attorneys help thousands of clients avoid deportation, get their green cards and become US citizens. See what our clients and colleagues have to say about how Harlan York & Associates helped them with their case.";function it(t,e,n){let a;var i,l;h(t,B,(t=>n(0,a=t)));var s="Client Testimonials - "+(null==(i=a)||null==(l=i.site)?void 0:l.title);return[a,s]}export default class extends t{constructor(t){super(),e(this,t,it,nt,n,{})}}
