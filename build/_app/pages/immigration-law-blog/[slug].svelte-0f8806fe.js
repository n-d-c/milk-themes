import{a2 as t,S as e,i as n,s as l,p as r,e as s,q as a,c as o,d as i,a as c,b as u,u as d,r as $,v as f,g,m,h,j as p,k as v,f as b,l as y,z as k,A as w,B as _,O as B,C as I,x as E,P as x,t as S,o as D,H as A,E as j,F as M,a3 as L}from"../../chunks/milk-b0ce08a4.js";import{H as N,c as W,d as T,e as q,B as H,g as O,h as V,S as F,f as P}from"../../chunks/Block_Ratings-6fb7cdca.js";import{L as J}from"../../chunks/Layout_Main-c42cedc2.js";import{a as K,B as U}from"../../chunks/Block_Languages-442d1328.js";/* empty css                                             */import{B as Y}from"../../chunks/Block_LanguagesWeSpeak-cebed143.js";import{B as z}from"../../chunks/Block_Testimonials-d371e35b.js";import{c as C}from"../../chunks/wordpress.graphql-a56b2c9d.js";const R={subscribe:e=>(()=>{const e=t("__svelte__");return{page:{subscribe:e.page.subscribe},navigating:{subscribe:e.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:e.navigating.subscribe}},session:e.session}})().page.subscribe(e)};function G(t){let e,n,l,g,m;const h=t[8].default,p=r(h,t,t[7],null);return{c(){e=s("meta"),n=s("meta"),l=s("meta"),g=s("meta"),p&&p.c(),this.h()},l(t){const r=a('[data-svelte="svelte-1pvvrac"]',document.head);e=o(r,"META",{property:!0,content:!0}),n=o(r,"META",{property:!0,content:!0}),l=o(r,"META",{property:!0,content:!0}),g=o(r,"META",{name:!0,type:!0,content:!0}),p&&p.l(r),r.forEach(i),this.h()},h(){c(e,"property","og:type"),c(e,"content","article"),c(n,"property","article:author"),c(n,"content",t[0]),c(l,"property","article:published_time"),c(l,"content",t[1]),c(g,"name","author"),c(g,"type","article"),c(g,"content",t[0])},m(t,r){u(document.head,e),u(document.head,n),u(document.head,l),u(document.head,g),p&&p.m(document.head,null),m=!0},p(t,[e]){(!m||1&e)&&c(n,"content",t[0]),(!m||2&e)&&c(l,"content",t[1]),(!m||1&e)&&c(g,"content",t[0]),p&&p.p&&128&e&&d(p,h,t,t[7],e,null,null)},i(t){m||($(p,t),m=!0)},o(t){f(p,t),m=!1},d(t){i(e),i(n),i(l),i(g),p&&p.d(t)}}}function Q(t,e,n){let l;g(t,m,(t=>n(6,l=t)));let{$$slots:r={},$$scope:s}=e;var a,o,i,c,{author:u}=e,{pubdate:d}=e;return t.$$set=t=>{"author"in t&&n(0,u=t.author),"pubdate"in t&&n(1,d=t.pubdate),"$$scope"in t&&n(7,s=t.$$scope)},t.$$.update=()=>{2&t.$$.dirty&&n(1,d=d&&""!=d?new Date(d).toISOString():(new Date).toISOString()),125&t.$$.dirty&&(u||n(0,u=(null==n(2,a=l)||null==n(3,o=a.site)?void 0:o.first_name)+" "+(null==n(4,i=l)||null==n(5,c=i.site)?void 0:c.last_name)))},[u,d,a,o,i,c,l,s,r]}class X extends e{constructor(t){super(),n(this,t,Q,G,l,{author:0,pubdate:1})}}function Z(t,e,n){const l=t.slice();return l[19]=e[n],l}function tt(t,e,n){const l=t.slice();return l[22]=e[n],l}function et(t,e,n){const l=t.slice();return l[25]=e[n],l}function nt(t){let e,n,l,r,a;return{c(){e=s("link"),l=h(),r=s("link"),this.h()},l(t){e=o(t,"LINK",{async:!0,href:!0,rel:!0,as:!0}),l=p(t),r=o(t,"LINK",{async:!0,href:!0,rel:!0}),this.h()},h(){c(e,"async",""),c(e,"href",n=t[25].src.startsWith("http")?`${t[25].src}`:`${t[0].site.admin_url}${t[25].src}`),c(e,"rel","preload"),c(e,"as","style"),c(r,"async",""),c(r,"href",a=t[25].src.startsWith("http")?`${t[25].src}`:`${t[0].site.admin_url}${t[25].src}`),c(r,"rel","stylesheet")},m(t,n){v(t,e,n),v(t,l,n),v(t,r,n)},p(t,l){65&l&&n!==(n=t[25].src.startsWith("http")?`${t[25].src}`:`${t[0].site.admin_url}${t[25].src}`)&&c(e,"href",n),65&l&&a!==(a=t[25].src.startsWith("http")?`${t[25].src}`:`${t[0].site.admin_url}${t[25].src}`)&&c(r,"href",a)},d(t){t&&i(e),t&&i(l),t&&i(r)}}}function lt(t){let e,n;return{c(){e=s("script"),this.h()},l(t){e=o(t,"SCRIPT",{defer:!0,src:!0}),b(e).forEach(i),this.h()},h(){e.defer=!0,e.src!==(n=t[22].src.startsWith("http")?`${t[22].src}`:`${t[0].site.admin_url}${t[22].src}`)&&c(e,"src",n)},m(t,n){v(t,e,n)},p(t,l){129&l&&e.src!==(n=t[22].src.startsWith("http")?`${t[22].src}`:`${t[0].site.admin_url}${t[22].src}`)&&c(e,"src",n)},d(t){t&&i(e)}}}function rt(t){var e,n,l;let r,a,d,$,f,g,m,y,k,w=(null==(l=null==(n=null==(e=t[19])?void 0:e.author)?void 0:n.node)?void 0:l.name)+"",_=t[9][t[8].getMonth()]+"",B=t[8].getDate()+"",I=t[8].getFullYear()+"";return{c(){r=s("div"),a=S("By: "),d=S(w),$=S("\n\t\t\t\t  |  \n\t\t\t\t"),f=S(_),g=h(),m=S(B),y=S(",\n\t\t\t\t"),k=S(I),this.h()},l(t){r=o(t,"DIV",{class:!0});var e=b(r);a=D(e,"By: "),d=D(e,w),$=D(e,"\n\t\t\t\t  |  \n\t\t\t\t"),f=D(e,_),g=p(e),m=D(e,B),y=D(e,",\n\t\t\t\t"),k=D(e,I),e.forEach(i),this.h()},h(){c(r,"class","callout-detials")},m(t,e){v(t,r,e),u(r,a),u(r,d),u(r,$),u(r,f),u(r,g),u(r,m),u(r,y),u(r,k)},p(t,e){var n,l,r;32&e&&w!==(w=(null==(r=null==(l=null==(n=t[19])?void 0:n.author)?void 0:l.node)?void 0:r.name)+"")&&A(d,w),256&e&&_!==(_=t[9][t[8].getMonth()]+"")&&A(f,_),256&e&&B!==(B=t[8].getDate()+"")&&A(m,B),256&e&&I!==(I=t[8].getFullYear()+"")&&A(k,I)},d(t){t&&i(r)}}}function st(t){var e,n,l,r,a,d,g,m,y,B,E,x,j;let M,N,W,T,q,H,O,V,F,J,K,Y,z,C,R,G,Q,Z,tt,et,nt,lt,st=(null==(e=t[19])?void 0:e.title)+"",at=(null==(n=t[19])?void 0:n.content)+"";return M=new X({props:{author:null==(a=null==(r=null==(l=t[19])?void 0:l.author)?void 0:r.node)?void 0:a.name,pubdate:null==(d=t[19])?void 0:d.date}}),W=new P({props:{id:"blog-post-hero",image_url:null==(y=null==(m=null==(g=t[19])?void 0:g.featuredImage)?void 0:m.node)?void 0:y.sourceUrl,img_srcset:null==(x=null==(E=null==(B=t[19])?void 0:B.featuredImage)?void 0:E.node)?void 0:x.srcSet,avif_srcset:"",webp_srcset:"",title:"Harlan York and Associates",parallax:"false"}}),q=new U({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:null==(j=t[19])?void 0:j.title,$$slots:{default:[rt]},$$scope:{ctx:t}}}),{c(){k(M.$$.fragment),N=h(),k(W.$$.fragment),T=h(),k(q.$$.fragment),H=h(),O=s("div"),V=s("div"),F=s("div"),J=s("div"),K=s("a"),Y=S("Home"),z=S("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),C=s("a"),R=S("Blog"),G=S("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),Q=s("a"),Z=S(st),et=h(),this.h()},l(t){w(M.$$.fragment,t),N=p(t),w(W.$$.fragment,t),T=p(t),w(q.$$.fragment,t),H=p(t),O=o(t,"DIV",{class:!0});var e=b(O);V=o(e,"DIV",{class:!0});var n=b(V);F=o(n,"DIV",{class:!0});var l=b(F);J=o(l,"DIV",{class:!0});var r=b(J);K=o(r,"A",{href:!0,class:!0});var s=b(K);Y=D(s,"Home"),s.forEach(i),z=D(r,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),C=o(r,"A",{href:!0,class:!0});var a=b(C);R=D(a,"Blog"),a.forEach(i),G=D(r,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),Q=o(r,"A",{href:!0,class:!0});var c=b(Q);Z=D(c,st),c.forEach(i),r.forEach(i),l.forEach(i),et=p(n),n.forEach(i),e.forEach(i),this.h()},h(){var e;c(K,"href","/"),c(K,"class","svelte-k5git7"),c(C,"href","/immigration-law-blog"),c(C,"class","svelte-k5git7"),c(Q,"href",tt=`/immigration-law-blog/${null==(e=t[19])?void 0:e.slug}`),c(Q,"class","svelte-k5git7"),c(J,"class","breadcrumbs svelte-k5git7"),c(F,"class","blog-topbar svelte-k5git7"),nt=new L(null),c(V,"class","content-inner"),c(O,"class","content")},m(t,e){_(M,t,e),v(t,N,e),_(W,t,e),v(t,T,e),_(q,t,e),v(t,H,e),v(t,O,e),u(O,V),u(V,F),u(F,J),u(J,K),u(K,Y),u(J,z),u(J,C),u(C,R),u(J,G),u(J,Q),u(Q,Z),u(V,et),nt.m(at,V),lt=!0},p(t,e){var n,l,r,s,a,o,i,u,d,$,f,g,m,h;const p={};32&e&&(p.author=null==(r=null==(l=null==(n=t[19])?void 0:n.author)?void 0:l.node)?void 0:r.name),32&e&&(p.pubdate=null==(s=t[19])?void 0:s.date),M.$set(p);const v={};32&e&&(v.image_url=null==(i=null==(o=null==(a=t[19])?void 0:a.featuredImage)?void 0:o.node)?void 0:i.sourceUrl),32&e&&(v.img_srcset=null==($=null==(d=null==(u=t[19])?void 0:u.featuredImage)?void 0:d.node)?void 0:$.srcSet),W.$set(v);const b={};32&e&&(b.title=null==(f=t[19])?void 0:f.title),268435744&e&&(b.$$scope={dirty:e,ctx:t}),q.$set(b),(!lt||32&e)&&st!==(st=(null==(g=t[19])?void 0:g.title)+"")&&A(Z,st),(!lt||32&e&&tt!==(tt=`/immigration-law-blog/${null==(m=t[19])?void 0:m.slug}`))&&c(Q,"href",tt),(!lt||32&e)&&at!==(at=(null==(h=t[19])?void 0:h.content)+"")&&nt.p(at)},i(t){lt||($(M.$$.fragment,t),$(W.$$.fragment,t),$(q.$$.fragment,t),lt=!0)},o(t){f(M.$$.fragment,t),f(W.$$.fragment,t),f(q.$$.fragment,t),lt=!1},d(t){I(M,t),t&&i(N),I(W,t),t&&i(T),I(q,t),t&&i(H),t&&i(O)}}}function at(t){let e,n,l,r,s,a,o,c,u,d,g,m,b,y,E,x=t[5],S=[];for(let i=0;i<x.length;i+=1)S[i]=st(Z(t,x,i));const D=t=>f(S[t],1,1,(()=>{S[t]=null}));return n=new z({props:{id:"testimonials",blockstyle:"block-style05"}}),r=new H({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),a=new Y({}),c=new K({props:{id:"languages",blockstyle:"block-style04"}}),d=new O({props:{id:"featured",blockstyle:""}}),m=new V({props:{id:"ratings",blockstyle:""}}),y=new F({props:{id:"socialmedia",blockstyle:""}}),{c(){for(let t=0;t<S.length;t+=1)S[t].c();e=h(),k(n.$$.fragment),l=h(),k(r.$$.fragment),s=h(),k(a.$$.fragment),o=h(),k(c.$$.fragment),u=h(),k(d.$$.fragment),g=h(),k(m.$$.fragment),b=h(),k(y.$$.fragment)},l(t){for(let e=0;e<S.length;e+=1)S[e].l(t);e=p(t),w(n.$$.fragment,t),l=p(t),w(r.$$.fragment,t),s=p(t),w(a.$$.fragment,t),o=p(t),w(c.$$.fragment,t),u=p(t),w(d.$$.fragment,t),g=p(t),w(m.$$.fragment,t),b=p(t),w(y.$$.fragment,t)},m(t,i){for(let e=0;e<S.length;e+=1)S[e].m(t,i);v(t,e,i),_(n,t,i),v(t,l,i),_(r,t,i),v(t,s,i),_(a,t,i),v(t,o,i),_(c,t,i),v(t,u,i),_(d,t,i),v(t,g,i),_(m,t,i),v(t,b,i),_(y,t,i),E=!0},p(t,n){if(800&n){let l;for(x=t[5],l=0;l<x.length;l+=1){const r=Z(t,x,l);S[l]?(S[l].p(r,n),$(S[l],1)):(S[l]=st(r),S[l].c(),$(S[l],1),S[l].m(e.parentNode,e))}for(j(),l=x.length;l<S.length;l+=1)D(l);M()}},i(t){if(!E){for(let t=0;t<x.length;t+=1)$(S[t]);$(n.$$.fragment,t),$(r.$$.fragment,t),$(a.$$.fragment,t),$(c.$$.fragment,t),$(d.$$.fragment,t),$(m.$$.fragment,t),$(y.$$.fragment,t),E=!0}},o(t){S=S.filter(Boolean);for(let e=0;e<S.length;e+=1)f(S[e]);f(n.$$.fragment,t),f(r.$$.fragment,t),f(a.$$.fragment,t),f(c.$$.fragment,t),f(d.$$.fragment,t),f(m.$$.fragment,t),f(y.$$.fragment,t),E=!1},d(t){B(S,t),t&&i(e),I(n,t),t&&i(l),I(r,t),t&&i(s),I(a,t),t&&i(o),I(c,t),t&&i(u),I(d,t),t&&i(g),I(m,t),t&&i(b),I(y,t)}}}function ot(t){var e,n;let l,r,d,g,m,b,E,x,S,D,A,j,M,L=t[6],H=[];for(let s=0;s<L.length;s+=1)H[s]=nt(et(t,L,s));let O=t[7],V=[];for(let s=0;s<O.length;s+=1)V[s]=lt(tt(t,O,s));return g=new N({props:{lang:"en"}}),b=new W({props:{title:t[1],description:t[2],keywords:null==(n=null==(e=t[0])?void 0:e.site)?void 0:n.keywords}}),x=new T({props:{title:t[1],description:t[2],image:t[3]}}),D=new q({props:{title:t[1],description:t[2],image:t[3]}}),j=new J({props:{id:"blog-post",$$slots:{default:[at]},$$scope:{ctx:t}}}),{c(){for(let t=0;t<H.length;t+=1)H[t].c();l=y();for(let t=0;t<V.length;t+=1)V[t].c();r=s("link"),d=h(),k(g.$$.fragment),m=h(),k(b.$$.fragment),E=h(),k(x.$$.fragment),S=h(),k(D.$$.fragment),A=h(),k(j.$$.fragment),this.h()},l(t){const e=a('[data-svelte="svelte-1eol1zw"]',document.head);for(let n=0;n<H.length;n+=1)H[n].l(e);l=y();for(let n=0;n<V.length;n+=1)V[n].l(e);r=o(e,"LINK",{rel:!0,href:!0}),e.forEach(i),d=p(t),w(g.$$.fragment,t),m=p(t),w(b.$$.fragment,t),E=p(t),w(x.$$.fragment,t),S=p(t),w(D.$$.fragment,t),A=p(t),w(j.$$.fragment,t),this.h()},h(){c(r,"rel","stylesheet"),c(r,"href",t[4])},m(t,e){for(let n=0;n<H.length;n+=1)H[n].m(document.head,null);u(document.head,l);for(let n=0;n<V.length;n+=1)V[n].m(document.head,null);u(document.head,r),v(t,d,e),_(g,t,e),v(t,m,e),_(b,t,e),v(t,E,e),_(x,t,e),v(t,S,e),_(D,t,e),v(t,A,e),_(j,t,e),M=!0},p(t,[e]){var n,s;if(65&e){let n;for(L=t[6],n=0;n<L.length;n+=1){const r=et(t,L,n);H[n]?H[n].p(r,e):(H[n]=nt(r),H[n].c(),H[n].m(l.parentNode,l))}for(;n<H.length;n+=1)H[n].d(1);H.length=L.length}if(129&e){let n;for(O=t[7],n=0;n<O.length;n+=1){const l=tt(t,O,n);V[n]?V[n].p(l,e):(V[n]=lt(l),V[n].c(),V[n].m(r.parentNode,r))}for(;n<V.length;n+=1)V[n].d(1);V.length=O.length}(!M||16&e)&&c(r,"href",t[4]);const a={};2&e&&(a.title=t[1]),4&e&&(a.description=t[2]),1&e&&(a.keywords=null==(s=null==(n=t[0])?void 0:n.site)?void 0:s.keywords),b.$set(a);const o={};2&e&&(o.title=t[1]),4&e&&(o.description=t[2]),8&e&&(o.image=t[3]),x.$set(o);const i={};2&e&&(i.title=t[1]),4&e&&(i.description=t[2]),8&e&&(i.image=t[3]),D.$set(i);const u={};268435744&e&&(u.$$scope={dirty:e,ctx:t}),j.$set(u)},i(t){M||($(g.$$.fragment,t),$(b.$$.fragment,t),$(x.$$.fragment,t),$(D.$$.fragment,t),$(j.$$.fragment,t),M=!0)},o(t){f(g.$$.fragment,t),f(b.$$.fragment,t),f(x.$$.fragment,t),f(D.$$.fragment,t),f(j.$$.fragment,t),M=!1},d(t){B(H,t),i(l),B(V,t),i(r),t&&i(d),I(g,t),t&&i(m),I(b,t),t&&i(E),I(x,t),t&&i(S),I(D,t),t&&i(A),I(j,t)}}}function it(t,e,n,l,r,s,a){try{var o=t[s](a),i=o.value}catch(c){return void n(c)}o.done?e(i):Promise.resolve(i).then(l,r)}function ct(t){return function(){var e=this,n=arguments;return new Promise((function(l,r){var s=t.apply(e,n);function a(t){it(s,l,r,a,o,"next",t)}function o(t){it(s,l,r,a,o,"throw",t)}a(void 0)}))}}function ut(t,e,n){let l,r;var s,a,o,i,c,u;g(t,m,(t=>n(0,l=t))),g(t,R,(t=>n(18,r=t)));var d="Immigration Services - "+(null==(s=l)||null==(a=s.site)?void 0:a.title),$=null==(o=l)||null==(i=o.site)?void 0:i.description,f=null==(c=l)||null==(u=c.site)?void 0:u.facebook_photo,{slug:h=r.params.slug}=e,p="",v=()=>{},b=[],y=[],k=[],w=new Date;return E(ct((function*(){var t,e;n(10,h=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var r={slug:h},s=null==(t=l)||null==(e=t.data)?void 0:e.gql(C,l.data.sources.wordpress,r,!1,0);v=yield null==s?void 0:s.subscribe(function(){var t=ct((function*(t){var e,l,r,s,a,o,i,c=yield t;n(8,w=new Date(null==c||null==(e=c.postBy)?void 0:e.date)),n(6,y=(null==c||null==(l=c.postBy)||null==(r=l.enqueuedStylesheets)?void 0:r.nodes)||[]),n(7,k=(null==c||null==(s=c.postBy)||null==(a=s.enqueuedScripts)?void 0:a.nodes)||[]),n(5,b=[null==c?void 0:c.postBy]),n(1,d=null==c?void 0:c.title),n(2,$=null==c?void 0:c.excerpt),n(3,f=null==c||null==(o=c.featuredImage)||null==(i=o.node)?void 0:i.sourceUrl)}));return function(e){return t.apply(this,arguments)}}())}))),x((()=>{v()})),t.$$set=t=>{"slug"in t&&n(10,h=t.slug)},t.$$.update=()=>{1&t.$$.dirty&&n(4,p="/themes/"+l.config.theme+"/style.css")},[l,d,$,f,p,b,y,k,w,["January","February","March","April","May","June","July","August","September","October","November","December"],h]}export default class extends e{constructor(t){super(),n(this,t,ut,ot,l,{slug:10})}}
