import{a2 as t,S as e,i as n,s as l,p as r,e as s,q as a,c as o,d as i,a as c,b as u,u as d,r as $,v as f,g,m,h,j as p,k as v,f as b,l as y,z as k,A as w,B as _,O as B,C as I,x as E,P as S,t as x,o as D,H as A,E as j,F as M,a3 as L}from"../../chunks/milk-8ceae49c.js";import{H as N,c as W,d as T,e as q,B as H,g as O,h as V,S as F,f as P}from"../../chunks/Block_Ratings-585e510b.js";import{L as J}from"../../chunks/Layout_Main-ea0fe7a8.js";import{a as K,B as Y}from"../../chunks/Block_Languages-fc75f4f0.js";/* empty css                                             */import{B as z}from"../../chunks/Block_LanguagesWeSpeak-395b54e5.js";import{B as C}from"../../chunks/Block_Testimonials-8d0c5768.js";import{c as R}from"../../chunks/wordpress.graphql-dc27e320.js";const U={subscribe:e=>(()=>{const e=t("__svelte__");return{page:{subscribe:e.page.subscribe},navigating:{subscribe:e.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:e.navigating.subscribe}},session:e.session}})().page.subscribe(e)};function G(t){let e,n,l,g,m;const h=t[8].default,p=r(h,t,t[7],null);return{c(){e=s("meta"),n=s("meta"),l=s("meta"),g=s("meta"),p&&p.c(),this.h()},l(t){const r=a('[data-svelte="svelte-1pvvrac"]',document.head);e=o(r,"META",{property:!0,content:!0}),n=o(r,"META",{property:!0,content:!0}),l=o(r,"META",{property:!0,content:!0}),g=o(r,"META",{name:!0,type:!0,content:!0}),p&&p.l(r),r.forEach(i),this.h()},h(){c(e,"property","og:type"),c(e,"content","article"),c(n,"property","article:author"),c(n,"content",t[0]),c(l,"property","article:published_time"),c(l,"content",t[1]),c(g,"name","author"),c(g,"type","article"),c(g,"content",t[0])},m(t,r){u(document.head,e),u(document.head,n),u(document.head,l),u(document.head,g),p&&p.m(document.head,null),m=!0},p(t,[e]){(!m||1&e)&&c(n,"content",t[0]),(!m||2&e)&&c(l,"content",t[1]),(!m||1&e)&&c(g,"content",t[0]),p&&p.p&&128&e&&d(p,h,t,t[7],e,null,null)},i(t){m||($(p,t),m=!0)},o(t){f(p,t),m=!1},d(t){i(e),i(n),i(l),i(g),p&&p.d(t)}}}function Q(t,e,n){let l;g(t,m,(t=>n(6,l=t)));let{$$slots:r={},$$scope:s}=e;var a,o,i,c,{author:u}=e,{pubdate:d}=e;return t.$$set=t=>{"author"in t&&n(0,u=t.author),"pubdate"in t&&n(1,d=t.pubdate),"$$scope"in t&&n(7,s=t.$$scope)},t.$$.update=()=>{2&t.$$.dirty&&n(1,d=d&&""!=d?new Date(d).toISOString():(new Date).toISOString()),125&t.$$.dirty&&(u||n(0,u=(null==n(2,a=l)||null==n(3,o=a.site)?void 0:o.first_name)+" "+(null==n(4,i=l)||null==n(5,c=i.site)?void 0:c.last_name)))},[u,d,a,o,i,c,l,s,r]}class X extends e{constructor(t){super(),n(this,t,Q,G,l,{author:0,pubdate:1})}}function Z(t,e,n){const l=t.slice();return l[10]=e[n],l}function tt(t,e,n){const l=t.slice();return l[13]=e[n],l}function et(t,e,n){const l=t.slice();return l[16]=e[n],l}function nt(t){let e,n,l,r,a;return{c(){e=s("link"),l=h(),r=s("link"),this.h()},l(t){e=o(t,"LINK",{async:!0,href:!0,rel:!0,as:!0}),l=p(t),r=o(t,"LINK",{async:!0,href:!0,rel:!0}),this.h()},h(){c(e,"async",""),c(e,"href",n=t[16].src.startsWith("http")?`${t[16].src}`:`${t[0].site.admin_url}${t[16].src}`),c(e,"rel","preload"),c(e,"as","style"),c(r,"async",""),c(r,"href",a=t[16].src.startsWith("http")?`${t[16].src}`:`${t[0].site.admin_url}${t[16].src}`),c(r,"rel","stylesheet")},m(t,n){v(t,e,n),v(t,l,n),v(t,r,n)},p(t,l){9&l&&n!==(n=t[16].src.startsWith("http")?`${t[16].src}`:`${t[0].site.admin_url}${t[16].src}`)&&c(e,"href",n),9&l&&a!==(a=t[16].src.startsWith("http")?`${t[16].src}`:`${t[0].site.admin_url}${t[16].src}`)&&c(r,"href",a)},d(t){t&&i(e),t&&i(l),t&&i(r)}}}function lt(t){let e,n;return{c(){e=s("script"),this.h()},l(t){e=o(t,"SCRIPT",{defer:!0,src:!0}),b(e).forEach(i),this.h()},h(){e.defer=!0,e.src!==(n=t[13].src.startsWith("http")?`${t[13].src}`:`${t[0].site.admin_url}${t[13].src}`)&&c(e,"src",n)},m(t,n){v(t,e,n)},p(t,l){17&l&&e.src!==(n=t[13].src.startsWith("http")?`${t[13].src}`:`${t[0].site.admin_url}${t[13].src}`)&&c(e,"src",n)},d(t){t&&i(e)}}}function rt(t){var e,n,l;let r,a,d,$,f,g,m,y,k,w=(null==(l=null==(n=null==(e=t[10])?void 0:e.author)?void 0:n.node)?void 0:l.name)+"",_=t[6][t[5].getMonth()]+"",B=t[5].getDate()+"",I=t[5].getFullYear()+"";return{c(){r=s("div"),a=x("By: "),d=x(w),$=x("\n\t\t\t\t  |  \n\t\t\t\t"),f=x(_),g=h(),m=x(B),y=x(",\n\t\t\t\t"),k=x(I),this.h()},l(t){r=o(t,"DIV",{class:!0});var e=b(r);a=D(e,"By: "),d=D(e,w),$=D(e,"\n\t\t\t\t  |  \n\t\t\t\t"),f=D(e,_),g=p(e),m=D(e,B),y=D(e,",\n\t\t\t\t"),k=D(e,I),e.forEach(i),this.h()},h(){c(r,"class","callout-detials")},m(t,e){v(t,r,e),u(r,a),u(r,d),u(r,$),u(r,f),u(r,g),u(r,m),u(r,y),u(r,k)},p(t,e){var n,l,r;4&e&&w!==(w=(null==(r=null==(l=null==(n=t[10])?void 0:n.author)?void 0:l.node)?void 0:r.name)+"")&&A(d,w),32&e&&_!==(_=t[6][t[5].getMonth()]+"")&&A(f,_),32&e&&B!==(B=t[5].getDate()+"")&&A(m,B),32&e&&I!==(I=t[5].getFullYear()+"")&&A(k,I)},d(t){t&&i(r)}}}function st(t){var e,n,l,r,a,d,g,m,y,B,E,S,j;let M,N,W,T,q,H,O,V,F,J,K,z,C,R,U,G,Q,Z,tt,et,nt,lt,st=(null==(e=t[10])?void 0:e.title)+"",at=(null==(n=t[10])?void 0:n.content)+"";return M=new X({props:{author:null==(a=null==(r=null==(l=t[10])?void 0:l.author)?void 0:r.node)?void 0:a.name,pubdate:null==(d=t[10])?void 0:d.date}}),W=new P({props:{id:"blog-post-hero",image_url:null==(y=null==(m=null==(g=t[10])?void 0:g.featuredImage)?void 0:m.node)?void 0:y.sourceUrl,img_srcset:null==(S=null==(E=null==(B=t[10])?void 0:B.featuredImage)?void 0:E.node)?void 0:S.srcSet,avif_srcset:"",webp_srcset:"",title:"Harlan York and Associates",parallax:"false"}}),q=new Y({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:null==(j=t[10])?void 0:j.title,$$slots:{default:[rt]},$$scope:{ctx:t}}}),{c(){k(M.$$.fragment),N=h(),k(W.$$.fragment),T=h(),k(q.$$.fragment),H=h(),O=s("div"),V=s("div"),F=s("div"),J=s("div"),K=s("a"),z=x("Home"),C=x("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),R=s("a"),U=x("Blog"),G=x("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),Q=s("a"),Z=x(st),et=h(),this.h()},l(t){w(M.$$.fragment,t),N=p(t),w(W.$$.fragment,t),T=p(t),w(q.$$.fragment,t),H=p(t),O=o(t,"DIV",{class:!0});var e=b(O);V=o(e,"DIV",{class:!0});var n=b(V);F=o(n,"DIV",{class:!0});var l=b(F);J=o(l,"DIV",{class:!0});var r=b(J);K=o(r,"A",{href:!0,class:!0});var s=b(K);z=D(s,"Home"),s.forEach(i),C=D(r,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),R=o(r,"A",{href:!0,class:!0});var a=b(R);U=D(a,"Blog"),a.forEach(i),G=D(r,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),Q=o(r,"A",{href:!0,class:!0});var c=b(Q);Z=D(c,st),c.forEach(i),r.forEach(i),l.forEach(i),et=p(n),n.forEach(i),e.forEach(i),this.h()},h(){var e;c(K,"href","/"),c(K,"class","svelte-k5git7"),c(R,"href","/immigration-law-blog"),c(R,"class","svelte-k5git7"),c(Q,"href",tt=`/immigration-law-blog/${null==(e=t[10])?void 0:e.slug}`),c(Q,"class","svelte-k5git7"),c(J,"class","breadcrumbs svelte-k5git7"),c(F,"class","blog-topbar svelte-k5git7"),nt=new L(null),c(V,"class","content-inner"),c(O,"class","content")},m(t,e){_(M,t,e),v(t,N,e),_(W,t,e),v(t,T,e),_(q,t,e),v(t,H,e),v(t,O,e),u(O,V),u(V,F),u(F,J),u(J,K),u(K,z),u(J,C),u(J,R),u(R,U),u(J,G),u(J,Q),u(Q,Z),u(V,et),nt.m(at,V),lt=!0},p(t,e){var n,l,r,s,a,o,i,u,d,$,f,g,m,h;const p={};4&e&&(p.author=null==(r=null==(l=null==(n=t[10])?void 0:n.author)?void 0:l.node)?void 0:r.name),4&e&&(p.pubdate=null==(s=t[10])?void 0:s.date),M.$set(p);const v={};4&e&&(v.image_url=null==(i=null==(o=null==(a=t[10])?void 0:a.featuredImage)?void 0:o.node)?void 0:i.sourceUrl),4&e&&(v.img_srcset=null==($=null==(d=null==(u=t[10])?void 0:u.featuredImage)?void 0:d.node)?void 0:$.srcSet),W.$set(v);const b={};4&e&&(b.title=null==(f=t[10])?void 0:f.title),524324&e&&(b.$$scope={dirty:e,ctx:t}),q.$set(b),(!lt||4&e)&&st!==(st=(null==(g=t[10])?void 0:g.title)+"")&&A(Z,st),(!lt||4&e&&tt!==(tt=`/immigration-law-blog/${null==(m=t[10])?void 0:m.slug}`))&&c(Q,"href",tt),(!lt||4&e)&&at!==(at=(null==(h=t[10])?void 0:h.content)+"")&&nt.p(at)},i(t){lt||($(M.$$.fragment,t),$(W.$$.fragment,t),$(q.$$.fragment,t),lt=!0)},o(t){f(M.$$.fragment,t),f(W.$$.fragment,t),f(q.$$.fragment,t),lt=!1},d(t){I(M,t),t&&i(N),I(W,t),t&&i(T),I(q,t),t&&i(H),t&&i(O)}}}function at(t){let e,n,l,r,s,a,o,c,u,d,g,m,b,y,E,S=t[2],x=[];for(let i=0;i<S.length;i+=1)x[i]=st(Z(t,S,i));const D=t=>f(x[t],1,1,(()=>{x[t]=null}));return n=new C({props:{id:"testimonials",blockstyle:"block-style05"}}),r=new H({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),a=new z({}),c=new K({props:{id:"languages",blockstyle:"block-style04"}}),d=new O({props:{id:"featured",blockstyle:""}}),m=new V({props:{id:"ratings",blockstyle:""}}),y=new F({props:{id:"socialmedia",blockstyle:""}}),{c(){for(let t=0;t<x.length;t+=1)x[t].c();e=h(),k(n.$$.fragment),l=h(),k(r.$$.fragment),s=h(),k(a.$$.fragment),o=h(),k(c.$$.fragment),u=h(),k(d.$$.fragment),g=h(),k(m.$$.fragment),b=h(),k(y.$$.fragment)},l(t){for(let e=0;e<x.length;e+=1)x[e].l(t);e=p(t),w(n.$$.fragment,t),l=p(t),w(r.$$.fragment,t),s=p(t),w(a.$$.fragment,t),o=p(t),w(c.$$.fragment,t),u=p(t),w(d.$$.fragment,t),g=p(t),w(m.$$.fragment,t),b=p(t),w(y.$$.fragment,t)},m(t,i){for(let e=0;e<x.length;e+=1)x[e].m(t,i);v(t,e,i),_(n,t,i),v(t,l,i),_(r,t,i),v(t,s,i),_(a,t,i),v(t,o,i),_(c,t,i),v(t,u,i),_(d,t,i),v(t,g,i),_(m,t,i),v(t,b,i),_(y,t,i),E=!0},p(t,n){if(100&n){let l;for(S=t[2],l=0;l<S.length;l+=1){const r=Z(t,S,l);x[l]?(x[l].p(r,n),$(x[l],1)):(x[l]=st(r),x[l].c(),$(x[l],1),x[l].m(e.parentNode,e))}for(j(),l=S.length;l<x.length;l+=1)D(l);M()}},i(t){if(!E){for(let t=0;t<S.length;t+=1)$(x[t]);$(n.$$.fragment,t),$(r.$$.fragment,t),$(a.$$.fragment,t),$(c.$$.fragment,t),$(d.$$.fragment,t),$(m.$$.fragment,t),$(y.$$.fragment,t),E=!0}},o(t){x=x.filter(Boolean);for(let e=0;e<x.length;e+=1)f(x[e]);f(n.$$.fragment,t),f(r.$$.fragment,t),f(a.$$.fragment,t),f(c.$$.fragment,t),f(d.$$.fragment,t),f(m.$$.fragment,t),f(y.$$.fragment,t),E=!1},d(t){B(x,t),t&&i(e),I(n,t),t&&i(l),I(r,t),t&&i(s),I(a,t),t&&i(o),I(c,t),t&&i(u),I(d,t),t&&i(g),I(m,t),t&&i(b),I(y,t)}}}function ot(t){var e,n,l,r,d,g;let m,b,E,S,x,D,A,j,M,L,H,O,V,F=t[3],P=[];for(let s=0;s<F.length;s+=1)P[s]=nt(et(t,F,s));let K=t[4],Y=[];for(let s=0;s<K.length;s+=1)Y[s]=lt(tt(t,K,s));return S=new N({props:{lang:"en"}}),D=new W({props:{title:`Immigration Services - ${null==(n=null==(e=t[0])?void 0:e.site)?void 0:n.title}`,description:null==(r=null==(l=t[0])?void 0:l.site)?void 0:r.description,keywords:null==(g=null==(d=t[0])?void 0:d.site)?void 0:g.keywords}}),j=new T({}),L=new q({}),O=new J({props:{id:"blog-post",$$slots:{default:[at]},$$scope:{ctx:t}}}),{c(){for(let t=0;t<P.length;t+=1)P[t].c();m=y();for(let t=0;t<Y.length;t+=1)Y[t].c();b=s("link"),E=h(),k(S.$$.fragment),x=h(),k(D.$$.fragment),A=h(),k(j.$$.fragment),M=h(),k(L.$$.fragment),H=h(),k(O.$$.fragment),this.h()},l(t){const e=a('[data-svelte="svelte-1eol1zw"]',document.head);for(let n=0;n<P.length;n+=1)P[n].l(e);m=y();for(let n=0;n<Y.length;n+=1)Y[n].l(e);b=o(e,"LINK",{rel:!0,href:!0}),e.forEach(i),E=p(t),w(S.$$.fragment,t),x=p(t),w(D.$$.fragment,t),A=p(t),w(j.$$.fragment,t),M=p(t),w(L.$$.fragment,t),H=p(t),w(O.$$.fragment,t),this.h()},h(){c(b,"rel","stylesheet"),c(b,"href",t[1])},m(t,e){for(let n=0;n<P.length;n+=1)P[n].m(document.head,null);u(document.head,m);for(let n=0;n<Y.length;n+=1)Y[n].m(document.head,null);u(document.head,b),v(t,E,e),_(S,t,e),v(t,x,e),_(D,t,e),v(t,A,e),_(j,t,e),v(t,M,e),_(L,t,e),v(t,H,e),_(O,t,e),V=!0},p(t,[e]){var n,l,r,s,a,o;if(9&e){let n;for(F=t[3],n=0;n<F.length;n+=1){const l=et(t,F,n);P[n]?P[n].p(l,e):(P[n]=nt(l),P[n].c(),P[n].m(m.parentNode,m))}for(;n<P.length;n+=1)P[n].d(1);P.length=F.length}if(17&e){let n;for(K=t[4],n=0;n<K.length;n+=1){const l=tt(t,K,n);Y[n]?Y[n].p(l,e):(Y[n]=lt(l),Y[n].c(),Y[n].m(b.parentNode,b))}for(;n<Y.length;n+=1)Y[n].d(1);Y.length=K.length}(!V||2&e)&&c(b,"href",t[1]);const i={};1&e&&(i.title=`Immigration Services - ${null==(l=null==(n=t[0])?void 0:n.site)?void 0:l.title}`),1&e&&(i.description=null==(s=null==(r=t[0])?void 0:r.site)?void 0:s.description),1&e&&(i.keywords=null==(o=null==(a=t[0])?void 0:a.site)?void 0:o.keywords),D.$set(i);const u={};524324&e&&(u.$$scope={dirty:e,ctx:t}),O.$set(u)},i(t){V||($(S.$$.fragment,t),$(D.$$.fragment,t),$(j.$$.fragment,t),$(L.$$.fragment,t),$(O.$$.fragment,t),V=!0)},o(t){f(S.$$.fragment,t),f(D.$$.fragment,t),f(j.$$.fragment,t),f(L.$$.fragment,t),f(O.$$.fragment,t),V=!1},d(t){B(P,t),i(m),B(Y,t),i(b),t&&i(E),I(S,t),t&&i(x),I(D,t),t&&i(A),I(j,t),t&&i(M),I(L,t),t&&i(H),I(O,t)}}}function it(t,e,n,l,r,s,a){try{var o=t[s](a),i=o.value}catch(c){return void n(c)}o.done?e(i):Promise.resolve(i).then(l,r)}function ct(t){return function(){var e=this,n=arguments;return new Promise((function(l,r){var s=t.apply(e,n);function a(t){it(s,l,r,a,o,"next",t)}function o(t){it(s,l,r,a,o,"throw",t)}a(void 0)}))}}function ut(t,e,n){let l,r;g(t,U,(t=>n(9,l=t))),g(t,m,(t=>n(0,r=t)));var{slug:s=l.params.slug}=e,a="",o=()=>{},i=[],c=[],u=[],d=new Date;return E(ct((function*(){var t,e;n(7,s=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var l={slug:s},a=null==(t=r)||null==(e=t.data)?void 0:e.gql(R,r.data.sources.wordpress,l,!1,0);o=yield null==a?void 0:a.subscribe(function(){var t=ct((function*(t){var e,l,r,s,a,o=yield t;n(5,d=new Date(null==o||null==(e=o.postBy)?void 0:e.date)),n(3,c=(null==o||null==(l=o.postBy)||null==(r=l.enqueuedStylesheets)?void 0:r.nodes)||[]),n(4,u=(null==o||null==(s=o.postBy)||null==(a=s.enqueuedScripts)?void 0:a.nodes)||[]),n(2,i=[null==o?void 0:o.postBy])}));return function(e){return t.apply(this,arguments)}}())}))),S((()=>{o()})),t.$$set=t=>{"slug"in t&&n(7,s=t.slug)},t.$$.update=()=>{1&t.$$.dirty&&n(1,a="/themes/"+r.config.theme+"/style.css")},[r,a,i,c,u,d,["January","February","March","April","May","June","July","August","September","October","November","December"],s]}export default class extends e{constructor(t){super(),n(this,t,ut,ot,l,{slug:7})}}