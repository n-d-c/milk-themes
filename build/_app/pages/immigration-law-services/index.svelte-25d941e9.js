import{S as e,i as s,s as t,e as n,h as l,t as r,c as a,f as i,d as o,j as c,o as v,a as d,k as f,b as u,H as $,D as m,n as g,O as h,g as p,m as y,x as k,P as w,z as b,A as E,B as S,r as x,v as I,C as D}from"../../chunks/milk-b99fda1c.js";import{a as A,b as _,k as L,l as z,H as V,c as j,d as H,e as M,f as B,B as P,g as T,h as q,S as Q}from"../../chunks/Block_Ratings-6b5cd295.js";import{s as F,b as N,L as Y}from"../../chunks/Layout_Main-d40ea2c2.js";import{B as U,a as C}from"../../chunks/Block_Languages-88a07edc.js";/* empty css                                             */import{B as O}from"../../chunks/Block_LanguagesWeSpeak-02a4d2b6.js";import{B as R}from"../../chunks/Block_Testimonials-31634ea5.js";function G(e,s,t){const n=e.slice();return n[7]=s[t],n}function W(e){var s,t,m,g,h;let p,y,k,w,b,E,S,x,I,D,A,_,L,z,V,j,H,M,B,P,T,q,Q,F,N=(null==(s=e[7])?void 0:s.title)+"",Y=e[3](null==(m=null==(t=e[7])?void 0:t.Services)?void 0:m.excerpt)+"",U=(null==(h=null==(g=e[7])?void 0:g.Services)?void 0:h.description)+"";return{c(){p=n("div"),y=n("div"),k=n("img"),E=l(),S=n("div"),x=n("h4"),I=r(N),D=l(),A=n("div"),_=l(),L=n("div"),z=n("details"),V=n("summary"),j=n("span"),H=r("Show More"),M=l(),B=n("span"),P=r("Show Less"),T=l(),q=n("div"),Q=l(),this.h()},l(e){p=a(e,"DIV",{class:!0,id:!0});var s=i(p);y=a(s,"DIV",{class:!0});var t=i(y);k=a(t,"IMG",{class:!0,src:!0,alt:!0,width:!0,height:!0}),t.forEach(o),E=c(s),S=a(s,"DIV",{class:!0});var n=i(S);x=a(n,"H4",{class:!0});var l=i(x);I=v(l,N),l.forEach(o),D=c(n),A=a(n,"DIV",{}),i(A).forEach(o),_=c(n),L=a(n,"DIV",{});var r=i(L);z=a(r,"DETAILS",{class:!0});var d=i(z);V=a(d,"SUMMARY",{class:!0});var f=i(V);j=a(f,"SPAN",{class:!0});var u=i(j);H=v(u,"Show More"),u.forEach(o),M=c(f),B=a(f,"SPAN",{class:!0});var $=i(B);P=v($,"Show Less"),$.forEach(o),f.forEach(o),T=c(d),q=a(d,"DIV",{class:!0}),i(q).forEach(o),d.forEach(o),r.forEach(o),n.forEach(o),Q=c(s),s.forEach(o),this.h()},h(){var s,t,n,l,r;d(k,"class","icon svelte-dslvzp"),k.src!==(w=null==(n=null==(t=null==(s=e[7])?void 0:s.Services)?void 0:t.icon)?void 0:n.sourceUrl)&&d(k,"src",w),d(k,"alt",b=null==(l=e[7])?void 0:l.title),d(k,"width","40"),d(k,"height","40"),d(y,"class","service-icon svelte-dslvzp"),d(x,"class","svelte-dslvzp"),d(j,"class","more svelte-dslvzp"),d(B,"class","less svelte-dslvzp"),d(V,"class","svelte-dslvzp"),d(q,"class","content svelte-dslvzp"),d(z,"class","svelte-dslvzp"),d(S,"class","service-content svelte-dslvzp"),d(p,"class","service svelte-dslvzp"),d(p,"id",F=null==(r=e[7])?void 0:r.slug)},m(e,s){f(e,p,s),u(p,y),u(y,k),u(p,E),u(p,S),u(S,x),u(x,I),u(S,D),u(S,A),A.innerHTML=Y,u(S,_),u(S,L),u(L,z),u(z,V),u(V,j),u(j,H),u(V,M),u(V,B),u(B,P),u(z,T),u(z,q),q.innerHTML=U,u(p,Q)},p(e,s){var t,n,l,r,a,i,o,c,v,f;4&s&&k.src!==(w=null==(l=null==(n=null==(t=e[7])?void 0:t.Services)?void 0:n.icon)?void 0:l.sourceUrl)&&d(k,"src",w),4&s&&b!==(b=null==(r=e[7])?void 0:r.title)&&d(k,"alt",b),4&s&&N!==(N=(null==(a=e[7])?void 0:a.title)+"")&&$(I,N),12&s&&Y!==(Y=e[3](null==(o=null==(i=e[7])?void 0:i.Services)?void 0:o.excerpt)+"")&&(A.innerHTML=Y),4&s&&U!==(U=(null==(v=null==(c=e[7])?void 0:c.Services)?void 0:v.description)+"")&&(q.innerHTML=U),4&s&&F!==(F=null==(f=e[7])?void 0:f.slug)&&d(p,"id",F)},d(e){e&&o(p)}}}function J(e){let s,t,l,r,c=e[2],v=[];for(let n=0;n<c.length;n+=1)v[n]=W(G(e,c,n));return{c(){s=n("div"),t=n("div"),l=n("div");for(let e=0;e<v.length;e+=1)v[e].c();this.h()},l(e){s=a(e,"DIV",{id:!0,class:!0});var n=i(s);t=a(n,"DIV",{class:!0});var r=i(t);l=a(r,"DIV",{class:!0});var c=i(l);for(let s=0;s<v.length;s+=1)v[s].l(c);c.forEach(o),r.forEach(o),n.forEach(o),this.h()},h(){d(l,"class","services-list"),d(t,"class","services-inner svelte-dslvzp"),d(s,"id",e[0]),d(s,"class",r=m(e[1])+" svelte-dslvzp")},m(e,n){f(e,s,n),u(s,t),u(t,l);for(let s=0;s<v.length;s+=1)v[s].m(l,null)},p(e,[t]){if(12&t){let s;for(c=e[2],s=0;s<c.length;s+=1){const n=G(e,c,s);v[s]?v[s].p(n,t):(v[s]=W(n),v[s].c(),v[s].m(l,null))}for(;s<v.length;s+=1)v[s].d(1);v.length=c.length}1&t&&d(s,"id",e[0]),2&t&&r!==(r=m(e[1])+" svelte-dslvzp")&&d(s,"class",r)},i:g,o:g,d(e){e&&o(s),h(v,e)}}}function K(e,s,t,n,l,r,a){try{var i=e[r](a),o=i.value}catch(c){return void t(c)}i.done?s(o):Promise.resolve(o).then(n,l)}function X(e){return function(){var s=this,t=arguments;return new Promise((function(n,l){var r=e.apply(s,t);function a(e){K(r,n,l,a,i,"next",e)}function i(e){K(r,n,l,a,i,"throw",e)}a(void 0)}))}}function Z(e,s,t){let n;p(e,y,(e=>t(6,n=e)));var{id:l}=s,{blockstyle:r=""}=s,a="services",i=A,o=()=>{},c=e=>e.replace(/\u00a0/g," ");return k(X((function*(){var e,s;t(3,c=e=>F(e).replace(/\u00a0/g," "));var l=null==(e=n)||null==(s=e.data)?void 0:s.gql(_,n.data.sources.wordpress,{size:999});o=yield null==l?void 0:l.subscribe(function(){var e=X((function*(e){var s=yield e;t(2,i=s.services.nodes),setTimeout(N,1e3)}));return function(s){return e.apply(this,arguments)}}())}))),w((()=>{o()})),e.$$set=e=>{"id"in e&&t(0,l=e.id),"blockstyle"in e&&t(4,r=e.blockstyle)},e.$$.update=()=>{16&e.$$.dirty&&t(1,a="services "+r)},[l,a,i,c,r]}class ee extends e{constructor(e){super(),s(this,e,Z,J,t,{id:0,blockstyle:4})}}function se(e,s,t){const n=e.slice();return n[6]=s[t],n}function te(e){var s,t,m;let g,h,p,y,k,w,b,E,S,x=(null==(s=e[6])?void 0:s.title)+"",I=(null==(m=null==(t=e[6])?void 0:t.FAQ)?void 0:m.answer)+"";return{c(){g=n("div"),h=n("details"),p=n("summary"),y=n("span"),k=r(x),w=l(),b=n("div"),E=l(),this.h()},l(e){g=a(e,"DIV",{class:!0,id:!0});var s=i(g);h=a(s,"DETAILS",{class:!0});var t=i(h);p=a(t,"SUMMARY",{class:!0});var n=i(p);y=a(n,"SPAN",{class:!0});var l=i(y);k=v(l,x),l.forEach(o),n.forEach(o),w=c(t),b=a(t,"DIV",{class:!0}),i(b).forEach(o),t.forEach(o),E=c(s),s.forEach(o),this.h()},h(){var s;d(y,"class","svelte-1fnrex5"),d(p,"class","svelte-1fnrex5"),d(b,"class","content svelte-1fnrex5"),d(h,"class","svelte-1fnrex5"),d(g,"class","faq svelte-1fnrex5"),d(g,"id",S=null==(s=e[6])?void 0:s.slug)},m(e,s){f(e,g,s),u(g,h),u(h,p),u(p,y),u(y,k),u(h,w),u(h,b),b.innerHTML=I,u(g,E)},p(e,s){var t,n,l,r;4&s&&x!==(x=(null==(t=e[6])?void 0:t.title)+"")&&$(k,x),4&s&&I!==(I=(null==(l=null==(n=e[6])?void 0:n.FAQ)?void 0:l.answer)+"")&&(b.innerHTML=I),4&s&&S!==(S=null==(r=e[6])?void 0:r.slug)&&d(g,"id",S)},d(e){e&&o(g)}}}function ne(e){let s,t,$,p,y,k,w,b,E,S,x=e[2],I=[];for(let n=0;n<x.length;n+=1)I[n]=te(se(e,x,n));return{c(){s=n("div"),t=n("div"),$=n("h2"),p=r("Frequently Asked Questions"),y=l(),k=n("p"),w=r("Loren Ipsum Dolor Sit Amet, Consetetur Sadipschin Elitr, Sed Diam\n\t\t\tNonumy Eirmod."),b=l(),E=n("div");for(let e=0;e<I.length;e+=1)I[e].c();this.h()},l(e){s=a(e,"DIV",{id:!0,class:!0});var n=i(s);t=a(n,"DIV",{class:!0});var l=i(t);$=a(l,"H2",{class:!0});var r=i($);p=v(r,"Frequently Asked Questions"),r.forEach(o),y=c(l),k=a(l,"P",{});var d=i(k);w=v(d,"Loren Ipsum Dolor Sit Amet, Consetetur Sadipschin Elitr, Sed Diam\n\t\t\tNonumy Eirmod."),d.forEach(o),b=c(l),E=a(l,"DIV",{class:!0});var f=i(E);for(let s=0;s<I.length;s+=1)I[s].l(f);f.forEach(o),l.forEach(o),n.forEach(o),this.h()},h(){d($,"class","svelte-1fnrex5"),d(E,"class","faq-list"),d(t,"class","faqs-inner svelte-1fnrex5"),d(s,"id",e[0]),d(s,"class",S=m(e[1])+" svelte-1fnrex5")},m(e,n){f(e,s,n),u(s,t),u(t,$),u($,p),u(t,y),u(t,k),u(k,w),u(t,b),u(t,E);for(let s=0;s<I.length;s+=1)I[s].m(E,null)},p(e,[t]){if(4&t){let s;for(x=e[2],s=0;s<x.length;s+=1){const n=se(e,x,s);I[s]?I[s].p(n,t):(I[s]=te(n),I[s].c(),I[s].m(E,null))}for(;s<I.length;s+=1)I[s].d(1);I.length=x.length}1&t&&d(s,"id",e[0]),2&t&&S!==(S=m(e[1])+" svelte-1fnrex5")&&d(s,"class",S)},i:g,o:g,d(e){e&&o(s),h(I,e)}}}function le(e,s,t,n,l,r,a){try{var i=e[r](a),o=i.value}catch(c){return void t(c)}i.done?s(o):Promise.resolve(o).then(n,l)}function re(e){return function(){var s=this,t=arguments;return new Promise((function(n,l){var r=e.apply(s,t);function a(e){le(r,n,l,a,i,"next",e)}function i(e){le(r,n,l,a,i,"throw",e)}a(void 0)}))}}function ae(e,s,t){let n;p(e,y,(e=>t(5,n=e)));var{id:l}=s,{blockstyle:r=""}=s,a="faqs",i=L,o=()=>{};return k(re((function*(){var e,s,l=null==(e=n)||null==(s=e.data)?void 0:s.gql(z,n.data.sources.wordpress,{size:99});o=yield null==l?void 0:l.subscribe(function(){var e=re((function*(e){var s=yield e;t(2,i=s.fAQs.nodes),console.log(i)}));return function(s){return e.apply(this,arguments)}}())}))),w((()=>{o()})),e.$$set=e=>{"id"in e&&t(0,l=e.id),"blockstyle"in e&&t(3,r=e.blockstyle)},e.$$.update=()=>{8&e.$$.dirty&&t(1,a="faqs "+r)},[l,a,i,r]}class ie extends e{constructor(e){super(),s(this,e,ae,ne,t,{id:0,blockstyle:3})}}function oe(e){let s,t;return{c(){s=n("p"),t=r("At Harlan York & Associates our immigration attorneys use their\n\t\t\textensive experience on thousands of cases and daily reviews of new\n\t\t\tdevelopments in the constantly changing field of immigration law to\n\t\t\tgive you the best legal counsel available.")},l(e){s=a(e,"P",{});var n=i(s);t=v(n,"At Harlan York & Associates our immigration attorneys use their\n\t\t\textensive experience on thousands of cases and daily reviews of new\n\t\t\tdevelopments in the constantly changing field of immigration law to\n\t\t\tgive you the best legal counsel available."),n.forEach(o)},m(e,n){f(e,s,n),u(s,t)},d(e){e&&o(s)}}}function ce(e){let s,t,$,m,g,h,p,y,k,w,A,_,L,z,V,j,H,M,F,N,Y,G,W,J,K,X;return s=new B({props:{id:"hero-immigration-services",image_url:"/img/hero_services_01.jpg",img_srcset:"/img/hero_services_01.jpg",avif_srcset:"/img/hero_services_01.avif",webp_srcset:"/img/hero_services_01.webp",title:"Harlan York and Associates",parallax:"false"}}),$=new U({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:"Immigation Services",$$slots:{default:[oe]},$$scope:{ctx:e}}}),k=new ee({props:{id:"services",blockstyle:""}}),A=new R({props:{id:"testimonials",blockstyle:"block-style05"}}),L=new P({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),V=new O({}),H=new C({props:{id:"languages",blockstyle:"block-style04"}}),F=new ie({props:{id:"FAQs",blockstyle:""}}),Y=new T({props:{id:"featured",blockstyle:""}}),W=new q({props:{id:"ratings",blockstyle:""}}),K=new Q({props:{id:"socialmedia",blockstyle:""}}),{c(){b(s.$$.fragment),t=l(),b($.$$.fragment),m=l(),g=n("div"),h=n("h1"),p=r("Our Services"),y=l(),b(k.$$.fragment),w=l(),b(A.$$.fragment),_=l(),b(L.$$.fragment),z=l(),b(V.$$.fragment),j=l(),b(H.$$.fragment),M=l(),b(F.$$.fragment),N=l(),b(Y.$$.fragment),G=l(),b(W.$$.fragment),J=l(),b(K.$$.fragment),this.h()},l(e){E(s.$$.fragment,e),t=c(e),E($.$$.fragment,e),m=c(e),g=a(e,"DIV",{class:!0});var n=i(g);h=a(n,"H1",{class:!0});var l=i(h);p=v(l,"Our Services"),l.forEach(o),n.forEach(o),y=c(e),E(k.$$.fragment,e),w=c(e),E(A.$$.fragment,e),_=c(e),E(L.$$.fragment,e),z=c(e),E(V.$$.fragment,e),j=c(e),E(H.$$.fragment,e),M=c(e),E(F.$$.fragment,e),N=c(e),E(Y.$$.fragment,e),G=c(e),E(W.$$.fragment,e),J=c(e),E(K.$$.fragment,e),this.h()},h(){d(h,"class","title svelte-j5jhya"),d(g,"class","content svelte-j5jhya")},m(e,n){S(s,e,n),f(e,t,n),S($,e,n),f(e,m,n),f(e,g,n),u(g,h),u(h,p),f(e,y,n),S(k,e,n),f(e,w,n),S(A,e,n),f(e,_,n),S(L,e,n),f(e,z,n),S(V,e,n),f(e,j,n),S(H,e,n),f(e,M,n),S(F,e,n),f(e,N,n),S(Y,e,n),f(e,G,n),S(W,e,n),f(e,J,n),S(K,e,n),X=!0},p(e,s){const t={};2&s&&(t.$$scope={dirty:s,ctx:e}),$.$set(t)},i(e){X||(x(s.$$.fragment,e),x($.$$.fragment,e),x(k.$$.fragment,e),x(A.$$.fragment,e),x(L.$$.fragment,e),x(V.$$.fragment,e),x(H.$$.fragment,e),x(F.$$.fragment,e),x(Y.$$.fragment,e),x(W.$$.fragment,e),x(K.$$.fragment,e),X=!0)},o(e){I(s.$$.fragment,e),I($.$$.fragment,e),I(k.$$.fragment,e),I(A.$$.fragment,e),I(L.$$.fragment,e),I(V.$$.fragment,e),I(H.$$.fragment,e),I(F.$$.fragment,e),I(Y.$$.fragment,e),I(W.$$.fragment,e),I(K.$$.fragment,e),X=!1},d(e){D(s,e),e&&o(t),D($,e),e&&o(m),e&&o(g),e&&o(y),D(k,e),e&&o(w),D(A,e),e&&o(_),D(L,e),e&&o(z),D(V,e),e&&o(j),D(H,e),e&&o(M),D(F,e),e&&o(N),D(Y,e),e&&o(G),D(W,e),e&&o(J),D(K,e)}}}function ve(e){var s,t,n,r,a,i;let v,d,u,$,m,g,h,p,y,k;return v=new V({props:{lang:"en"}}),u=new j({props:{title:`Immigration Services - ${null==(t=null==(s=e[0])?void 0:s.site)?void 0:t.title}`,description:null==(r=null==(n=e[0])?void 0:n.site)?void 0:r.description,keywords:null==(i=null==(a=e[0])?void 0:a.site)?void 0:i.keywords}}),m=new H({}),h=new M({}),y=new Y({props:{id:"immigration-attorneys",$$slots:{default:[ce]},$$scope:{ctx:e}}}),{c(){b(v.$$.fragment),d=l(),b(u.$$.fragment),$=l(),b(m.$$.fragment),g=l(),b(h.$$.fragment),p=l(),b(y.$$.fragment)},l(e){E(v.$$.fragment,e),d=c(e),E(u.$$.fragment,e),$=c(e),E(m.$$.fragment,e),g=c(e),E(h.$$.fragment,e),p=c(e),E(y.$$.fragment,e)},m(e,s){S(v,e,s),f(e,d,s),S(u,e,s),f(e,$,s),S(m,e,s),f(e,g,s),S(h,e,s),f(e,p,s),S(y,e,s),k=!0},p(e,[s]){var t,n,l,r,a,i;const o={};1&s&&(o.title=`Immigration Services - ${null==(n=null==(t=e[0])?void 0:t.site)?void 0:n.title}`),1&s&&(o.description=null==(r=null==(l=e[0])?void 0:l.site)?void 0:r.description),1&s&&(o.keywords=null==(i=null==(a=e[0])?void 0:a.site)?void 0:i.keywords),u.$set(o);const c={};2&s&&(c.$$scope={dirty:s,ctx:e}),y.$set(c)},i(e){k||(x(v.$$.fragment,e),x(u.$$.fragment,e),x(m.$$.fragment,e),x(h.$$.fragment,e),x(y.$$.fragment,e),k=!0)},o(e){I(v.$$.fragment,e),I(u.$$.fragment,e),I(m.$$.fragment,e),I(h.$$.fragment,e),I(y.$$.fragment,e),k=!1},d(e){D(v,e),e&&o(d),D(u,e),e&&o($),D(m,e),e&&o(g),D(h,e),e&&o(p),D(y,e)}}}function de(e,s,t){let n;return p(e,y,(e=>t(0,n=e))),[n]}export default class extends e{constructor(e){super(),s(this,e,de,ve,t,{})}}
