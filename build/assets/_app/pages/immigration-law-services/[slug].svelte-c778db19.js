import{S as e,i as t,s as l,e as r,t as n,c as s,f as a,m as o,d as i,a as c,k as d,b as u,F as f,R as h,X as v,h as m,j as g,L as $,p,C as w,r as y,D as b,l as k,x as E,q as I,y as x,z as j,N as _,A as D,g as S,v as q,O as V,Y as F}from"../../chunks/index-b6a42182.js";import{H,p as B}from"../../chunks/Head_Article-304c0607.js";import{m as W}from"../../chunks/milk-0fba135e.js";import{H as P,a as T,b as N,c as A}from"../../chunks/Head_Twitter-0458c92f.js";import{L}from"../../chunks/Layout_Main-21e6a800.js";import{B as M,c as C,d as z,S as U,H as Y,i as O}from"../../chunks/Block_Ratings-49a8d14b.js";import{B as R}from"../../chunks/Block_CallOutText-f8620481.js";/* empty css                                             */import{B as J}from"../../chunks/Block_LanguagesWeSpeak-ae46a675.js";import{B as K}from"../../chunks/Block_Testimonials-70bbe164.js";import{F as G}from"../../chunks/FeaturedVideo-b0ea6aef.js";function X(e){const t=e-1;return t*t*t+1}function Q(e,{delay:t=0,duration:l=400,easing:r=X}={}){const n=getComputedStyle(e),s=+n.opacity,a=parseFloat(n.height),o=parseFloat(n.paddingTop),i=parseFloat(n.paddingBottom),c=parseFloat(n.marginTop),d=parseFloat(n.marginBottom),u=parseFloat(n.borderTopWidth),f=parseFloat(n.borderBottomWidth);return{delay:t,duration:l,easing:r,css:e=>`overflow: hidden;opacity: ${Math.min(20*e,1)*s};height: ${e*a}px;padding-top: ${e*o}px;padding-bottom: ${e*i}px;margin-top: ${e*c}px;margin-bottom: ${e*d}px;border-top-width: ${e*u}px;border-bottom-width: ${e*f}px;`}}function Z(e){let t,l,m,g,$;return{c(){t=r("div"),l=r("p"),m=n(e[1]),this.h()},l(r){t=s(r,"DIV",{class:!0});var n=a(t);l=s(n,"P",{});var c=a(l);m=o(c,e[1]),c.forEach(i),n.forEach(i),this.h()},h(){c(t,"class","dropdown")},m(e,r){d(e,t,r),u(t,l),u(l,m),$=!0},p(e,t){(!$||2&t)&&f(m,e[1])},i(e){$||(h((()=>{g||(g=v(t,Q,{duration:300},!0)),g.run(1)})),$=!0)},o(e){g||(g=v(t,Q,{duration:300},!1)),g.run(0),$=!1},d(e){e&&i(t),e&&g&&g.end()}}}function ee(e){let t,l,h,v,k,E,I,x,j,_,D,S,q,V=e[2]&&Z(e);return{c(){t=r("div"),l=r("div"),h=r("i"),v=m(),k=r("i"),E=m(),I=r("div"),x=r("h3"),j=n(e[0]),_=m(),V&&V.c(),this.h()},l(r){t=s(r,"DIV",{class:!0});var n=a(t);l=s(n,"DIV",{"aria-expanded":!0,class:!0});var c=a(l);h=s(c,"I",{class:!0}),a(h).forEach(i),v=g(c),k=s(c,"I",{class:!0}),a(k).forEach(i),c.forEach(i),E=g(n),I=s(n,"DIV",{class:!0});var d=a(I);x=s(d,"H3",{});var u=a(x);j=o(u,e[0]),u.forEach(i),_=g(d),V&&V.l(d),d.forEach(i),n.forEach(i),this.h()},h(){c(h,"class","svelte-193lzp6"),c(k,"class","svelte-193lzp6"),c(l,"aria-expanded",e[2]),c(l,"class","icon-wrap svelte-193lzp6"),c(I,"class","faq-content svelte-193lzp6"),c(t,"class","single-faq-wrap svelte-193lzp6")},m(r,n){d(r,t,n),u(t,l),u(l,h),u(l,v),u(l,k),u(t,E),u(t,I),u(I,x),u(x,j),u(I,_),V&&V.m(I,null),D=!0,S||(q=$(l,"click",e[3]),S=!0)},p(e,[t]){(!D||4&t)&&c(l,"aria-expanded",e[2]),(!D||1&t)&&f(j,e[0]),e[2]?V?(V.p(e,t),4&t&&p(V,1)):(V=Z(e),V.c(),p(V,1),V.m(I,null)):V&&(w(),y(V,1,1,(()=>{V=null})),b())},i(e){D||(p(V),D=!0)},o(e){y(V),D=!1},d(e){e&&i(t),V&&V.d(),S=!1,q()}}}function te(e,t,l){var r=!1,{title:n}=t,{content:s}=t;return e.$$set=e=>{"title"in e&&l(0,n=e.title),"content"in e&&l(1,s=e.content)},[n,s,r,()=>l(2,r=!r)]}class le extends e{constructor(e){super(),t(this,e,te,ee,l,{title:0,content:1})}}function re(e,t,l){const r=e.slice();return r[19]=t[l],r}function ne(e,t,l){const r=e.slice();return r[22]=t[l],r}function se(e,t,l){const r=e.slice();return r[25]=t[l],r}function ae(e,t,l){const r=e.slice();return r[28]=t[l],r}function oe(e,t,l){const r=e.slice();return r[31]=t[l],r}function ie(e){let t,l,n,a,o;return{c(){t=r("link"),n=m(),a=r("link"),this.h()},l(e){t=s(e,"LINK",{async:!0,href:!0,rel:!0,as:!0}),n=g(e),a=s(e,"LINK",{async:!0,href:!0,rel:!0}),this.h()},h(){c(t,"async",""),c(t,"href",l=e[31].src.startsWith("http")?`${e[31].src}`:`${e[0].site.admin_url}${e[31].src}`),c(t,"rel","preload"),c(t,"as","style"),c(a,"async",""),c(a,"href",o=e[31].src.startsWith("http")?`${e[31].src}`:`${e[0].site.admin_url}${e[31].src}`),c(a,"rel","stylesheet")},m(e,l){d(e,t,l),d(e,n,l),d(e,a,l)},p(e,r){65&r[0]&&l!==(l=e[31].src.startsWith("http")?`${e[31].src}`:`${e[0].site.admin_url}${e[31].src}`)&&c(t,"href",l),65&r[0]&&o!==(o=e[31].src.startsWith("http")?`${e[31].src}`:`${e[0].site.admin_url}${e[31].src}`)&&c(a,"href",o)},d(e){e&&i(t),e&&i(n),e&&i(a)}}}function ce(e){let t,l;return{c(){t=r("script"),this.h()},l(e){t=s(e,"SCRIPT",{defer:!0,src:!0}),a(t).forEach(i),this.h()},h(){t.defer=!0,t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},m(e,l){d(e,t,l)},p(e,r){129&r[0]&&t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},d(e){e&&i(t)}}}function de(e){let t,l,h,v,$,p,w,y,b=e[9][e[8].getMonth()]+"",k=e[8].getDate()+"",E=e[8].getFullYear()+"";return{c(){l=m(),h=r("div"),v=n(b),$=m(),p=n(k),w=n(",\n\t\t\t\t"),y=n(E),this.h()},l(e){l=g(e),h=s(e,"DIV",{class:!0});var t=a(h);v=o(t,b),$=g(t),p=o(t,k),w=o(t,",\n\t\t\t\t"),y=o(t,E),t.forEach(i),this.h()},h(){t=new F(l),c(h,"class","callout-detials")},m(r,n){t.m(e[2],r,n),d(r,l,n),d(r,h,n),u(h,v),u(h,$),u(h,p),u(h,w),u(h,y)},p(e,l){4&l[0]&&t.p(e[2]),256&l[0]&&b!==(b=e[9][e[8].getMonth()]+"")&&f(v,b),256&l[0]&&k!==(k=e[8].getDate()+"")&&f(p,k),256&l[0]&&E!==(E=e[8].getFullYear()+"")&&f(y,E)},d(e){e&&t.d(),e&&i(l),e&&i(h)}}}function ue(e){var t,l;let f,h,v,$,k,E,I=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.serviceFaq,x=[];for(let r=0;r<I.length;r+=1)x[r]=fe(se(e,I,r));const j=e=>y(x[e],1,1,(()=>{x[e]=null}));return{c(){f=r("div"),h=r("h2"),v=n("frequently asked questions"),$=m(),k=r("div");for(let e=0;e<x.length;e+=1)x[e].c();this.h()},l(e){f=s(e,"DIV",{class:!0});var t=a(f);h=s(t,"H2",{class:!0});var l=a(h);v=o(l,"frequently asked questions"),l.forEach(i),$=g(t),k=s(t,"DIV",{class:!0});var r=a(k);for(let n=0;n<x.length;n+=1)x[n].l(r);r.forEach(i),t.forEach(i),this.h()},h(){c(h,"class","svelte-1wf9tyj"),c(k,"class","flex-wrap svelte-1wf9tyj"),c(f,"class","outer-wrap margin-sides-large bg-white svelte-1wf9tyj")},m(e,t){d(e,f,t),u(f,h),u(h,v),u(f,$),u(f,k);for(let l=0;l<x.length;l+=1)x[l].m(k,null);E=!0},p(e,t){var l,r;if(32&t[0]){let n;for(I=null==(r=null==(l=e[19])?void 0:l.Services)?void 0:r.serviceFaq,n=0;n<I.length;n+=1){const l=se(e,I,n);x[n]?(x[n].p(l,t),p(x[n],1)):(x[n]=fe(l),x[n].c(),p(x[n],1),x[n].m(k,null))}for(w(),n=I.length;n<x.length;n+=1)j(n);b()}},i(e){if(!E){for(let e=0;e<I.length;e+=1)p(x[e]);E=!0}},o(e){x=x.filter(Boolean);for(let t=0;t<x.length;t+=1)y(x[t]);E=!1},d(e){e&&i(f),_(x,e)}}}function fe(e){var t,l;let r,n;return r=new le({props:{title:null==(t=e[25])?void 0:t.faqTitle,content:null==(l=e[25])?void 0:l.faqContent}}),{c(){E(r.$$.fragment)},l(e){x(r.$$.fragment,e)},m(e,t){j(r,e,t),n=!0},p(e,t){var l,n;const s={};32&t[0]&&(s.title=null==(l=e[25])?void 0:l.faqTitle),32&t[0]&&(s.content=null==(n=e[25])?void 0:n.faqContent),r.$set(s)},i(e){n||(p(r.$$.fragment,e),n=!0)},o(e){y(r.$$.fragment,e),n=!1},d(e){D(r,e)}}}function he(e){var t,l;let f,h,v,$,p,w=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.relatedPosts,y=[];for(let r=0;r<w.length;r+=1)y[r]=ve(ne(e,w,r));return{c(){f=r("div"),h=r("h2"),v=n("related blog posts"),$=m(),p=r("div");for(let e=0;e<y.length;e+=1)y[e].c();this.h()},l(e){f=s(e,"DIV",{class:!0});var t=a(f);h=s(t,"H2",{class:!0});var l=a(h);v=o(l,"related blog posts"),l.forEach(i),$=g(t),p=s(t,"DIV",{class:!0});var r=a(p);for(let n=0;n<y.length;n+=1)y[n].l(r);r.forEach(i),t.forEach(i),this.h()},h(){c(h,"class","svelte-1wf9tyj"),c(p,"class","flex-wrap svelte-1wf9tyj"),c(f,"class","outer-wrap margin-sides-large svelte-1wf9tyj")},m(e,t){d(e,f,t),u(f,h),u(h,v),u(f,$),u(f,p);for(let l=0;l<y.length;l+=1)y[l].m(p,null)},p(e,t){var l,r;if(32&t[0]){let n;for(w=null==(r=null==(l=e[19])?void 0:l.Services)?void 0:r.relatedPosts,n=0;n<w.length;n+=1){const l=ne(e,w,n);y[n]?y[n].p(l,t):(y[n]=ve(l),y[n].c(),y[n].m(p,null))}for(;n<y.length;n+=1)y[n].d(1);y.length=w.length}},d(e){e&&i(f),_(y,e)}}}function ve(e){var t;let l,h,v,$,p,w,y,b,k,E,I,x,j,_=(null==(t=e[22])?void 0:t.title)+"";return{c(){l=r("div"),h=r("div"),v=r("a"),$=r("img"),y=m(),b=r("div"),k=r("h3"),E=r("a"),I=n(_),j=m(),this.h()},l(e){l=s(e,"DIV",{class:!0});var t=a(l);h=s(t,"DIV",{class:!0});var r=a(h);v=s(r,"A",{href:!0});var n=a(v);$=s(n,"IMG",{src:!0,alt:!0}),n.forEach(i),r.forEach(i),y=g(t),b=s(t,"DIV",{class:!0});var c=a(b);k=s(c,"H3",{class:!0});var d=a(k);E=s(d,"A",{href:!0,class:!0});var u=a(E);I=o(u,_),u.forEach(i),d.forEach(i),c.forEach(i),j=g(t),t.forEach(i),this.h()},h(){var t,r,n,s;$.src!==(p=null==(r=null==(t=e[22])?void 0:t.featuredImage)?void 0:r.node.sourceUrl)&&c($,"src",p),c($,"alt",""),c(v,"href",w=`/immigration-law-blog/${null==(n=e[22])?void 0:n.slug}`),c(h,"class","img-wrap"),c(E,"href",x=`/immigration-law-blog/${null==(s=e[22])?void 0:s.slug}`),c(E,"class","svelte-1wf9tyj"),c(k,"class","svelte-1wf9tyj"),c(b,"class","bg-grey svelte-1wf9tyj"),c(l,"class","related-post-wrap")},m(e,t){d(e,l,t),u(l,h),u(h,v),u(v,$),u(l,y),u(l,b),u(b,k),u(k,E),u(E,I),u(l,j)},p(e,t){var l,r,n,s,a;32&t[0]&&$.src!==(p=null==(r=null==(l=e[22])?void 0:l.featuredImage)?void 0:r.node.sourceUrl)&&c($,"src",p),32&t[0]&&w!==(w=`/immigration-law-blog/${null==(n=e[22])?void 0:n.slug}`)&&c(v,"href",w),32&t[0]&&_!==(_=(null==(s=e[22])?void 0:s.title)+"")&&f(I,_),32&t[0]&&x!==(x=`/immigration-law-blog/${null==(a=e[22])?void 0:a.slug}`)&&c(E,"href",x)},d(e){e&&i(l)}}}function me(e){var t,l,h,v,$,k,I,_,S,q,V,F,B,W,P,T,N,A;let L,M,C,z,U,O,J,K,X,Q,Z,ee,te,le,re,ne,se,ae,oe,ie,ce,fe,ve,me,ge,$e,pe,we,ye,be,ke,Ee,Ie,xe,je,_e,De,Se,qe=(null==(t=e[19])?void 0:t.title)+"",Ve=(null==(l=e[19])?void 0:l.content)+"",Fe=(null==(h=e[19])?void 0:h.title)+"";L=new H({props:{author:null==(k=null==($=null==(v=e[19])?void 0:v.author)?void 0:$.node)?void 0:k.name,pubdate:null==(I=e[19])?void 0:I.date}}),C=new Y({props:{id:"blog-post-hero",image_url:null==(q=null==(S=null==(_=e[19])?void 0:_.featuredImage)?void 0:S.node)?void 0:q.sourceUrl,img_srcset:null==(B=null==(F=null==(V=e[19])?void 0:V.featuredImage)?void 0:F.node)?void 0:B.srcSet,avif_srcset:"",webp_srcset:"",title:"Harlan York and Associates",parallax:"false"}}),U=new R({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:null==(W=e[19])?void 0:W.title,$$slots:{default:[de]},$$scope:{ctx:e}}}),ve=new G({props:{id:"featured-video",blockstyle:"",video_source:"//player.vimeo.com/video/108146056",video_jpg:"/img/video_featured.jpg",video_webp:"/img/video_featured.webp",video_avif:"/img/video_featured.avif"}});let He=(null==(T=null==(P=e[19])?void 0:P.Services)?void 0:T.serviceFaq)&&ue(e),Be=(null==(A=null==(N=e[19])?void 0:N.Services)?void 0:A.relatedPosts)&&he(e);return{c(){E(L.$$.fragment),M=m(),E(C.$$.fragment),z=m(),E(U.$$.fragment),O=m(),J=r("div"),K=r("div"),X=r("div"),Q=r("div"),Z=r("a"),ee=n("Home"),te=n("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=r("a"),re=n("Services"),ne=n("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),se=r("a"),ae=n(qe),ie=m(),ce=r("div"),fe=m(),E(ve.$$.fragment),me=m(),He&&He.c(),ge=m(),Be&&Be.c(),$e=m(),pe=r("div"),we=r("h2"),ye=n("We are here to answer all your questions about "),be=n(Fe),ke=m(),Ee=r("p"),Ie=n("You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),xe=m(),je=r("p"),_e=r("strong"),De=n("US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),this.h()},l(e){x(L.$$.fragment,e),M=g(e),x(C.$$.fragment,e),z=g(e),x(U.$$.fragment,e),O=g(e),J=s(e,"DIV",{class:!0});var t=a(J);K=s(t,"DIV",{class:!0});var l=a(K);X=s(l,"DIV",{class:!0});var r=a(X);Q=s(r,"DIV",{class:!0});var n=a(Q);Z=s(n,"A",{href:!0,class:!0});var c=a(Z);ee=o(c,"Home"),c.forEach(i),te=o(n,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=s(n,"A",{href:!0,class:!0});var d=a(le);re=o(d,"Services"),d.forEach(i),ne=o(n,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),se=s(n,"A",{href:!0,class:!0});var u=a(se);ae=o(u,qe),u.forEach(i),n.forEach(i),r.forEach(i),ie=g(l),ce=s(l,"DIV",{class:!0}),a(ce).forEach(i),l.forEach(i),t.forEach(i),fe=g(e),x(ve.$$.fragment,e),me=g(e),He&&He.l(e),ge=g(e),Be&&Be.l(e),$e=g(e),pe=s(e,"DIV",{class:!0});var f=a(pe);we=s(f,"H2",{class:!0});var h=a(we);ye=o(h,"We are here to answer all your questions about "),be=o(h,Fe),h.forEach(i),ke=g(f),Ee=s(f,"P",{});var v=a(Ee);Ie=o(v,"You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),v.forEach(i),xe=g(f),je=s(f,"P",{});var m=a(je);_e=s(m,"STRONG",{});var $=a(_e);De=o($,"US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),$.forEach(i),m.forEach(i),f.forEach(i),this.h()},h(){var t;c(Z,"href","/"),c(Z,"class","svelte-1wf9tyj"),c(le,"href","/immigration-law-services"),c(le,"class","svelte-1wf9tyj"),c(se,"href",oe=`/immigration-law-services/${null==(t=e[19])?void 0:t.slug}`),c(se,"class","svelte-1wf9tyj"),c(Q,"class","breadcrumbs svelte-1wf9tyj"),c(X,"class","blog-topbar svelte-1wf9tyj"),c(ce,"class","blog-content"),c(K,"class","content-inner"),c(J,"class","content"),c(we,"class","svelte-1wf9tyj"),c(pe,"class","service-info svelte-1wf9tyj")},m(e,t){j(L,e,t),d(e,M,t),j(C,e,t),d(e,z,t),j(U,e,t),d(e,O,t),d(e,J,t),u(J,K),u(K,X),u(X,Q),u(Q,Z),u(Z,ee),u(Q,te),u(Q,le),u(le,re),u(Q,ne),u(Q,se),u(se,ae),u(K,ie),u(K,ce),ce.innerHTML=Ve,d(e,fe,t),j(ve,e,t),d(e,me,t),He&&He.m(e,t),d(e,ge,t),Be&&Be.m(e,t),d(e,$e,t),d(e,pe,t),u(pe,we),u(we,ye),u(we,be),u(pe,ke),u(pe,Ee),u(Ee,Ie),u(pe,xe),u(pe,je),u(je,_e),u(_e,De),Se=!0},p(e,t){var l,r,n,s,a,o,i,d,u,h,v,m,g,$,k,E,I,x,j;const _={};32&t[0]&&(_.author=null==(n=null==(r=null==(l=e[19])?void 0:l.author)?void 0:r.node)?void 0:n.name),32&t[0]&&(_.pubdate=null==(s=e[19])?void 0:s.date),L.$set(_);const D={};32&t[0]&&(D.image_url=null==(i=null==(o=null==(a=e[19])?void 0:a.featuredImage)?void 0:o.node)?void 0:i.sourceUrl),32&t[0]&&(D.img_srcset=null==(h=null==(u=null==(d=e[19])?void 0:d.featuredImage)?void 0:u.node)?void 0:h.srcSet),C.$set(D);const S={};32&t[0]&&(S.title=null==(v=e[19])?void 0:v.title),260&t[0]|8&t[1]&&(S.$$scope={dirty:t,ctx:e}),U.$set(S),(!Se||32&t[0])&&qe!==(qe=(null==(m=e[19])?void 0:m.title)+"")&&f(ae,qe),(!Se||32&t[0]&&oe!==(oe=`/immigration-law-services/${null==(g=e[19])?void 0:g.slug}`))&&c(se,"href",oe),(!Se||32&t[0])&&Ve!==(Ve=(null==($=e[19])?void 0:$.content)+"")&&(ce.innerHTML=Ve),(null==(E=null==(k=e[19])?void 0:k.Services)?void 0:E.serviceFaq)?He?(He.p(e,t),32&t[0]&&p(He,1)):(He=ue(e),He.c(),p(He,1),He.m(ge.parentNode,ge)):He&&(w(),y(He,1,1,(()=>{He=null})),b()),(null==(x=null==(I=e[19])?void 0:I.Services)?void 0:x.relatedPosts)?Be?Be.p(e,t):(Be=he(e),Be.c(),Be.m($e.parentNode,$e)):Be&&(Be.d(1),Be=null),(!Se||32&t[0])&&Fe!==(Fe=(null==(j=e[19])?void 0:j.title)+"")&&f(be,Fe)},i(e){Se||(p(L.$$.fragment,e),p(C.$$.fragment,e),p(U.$$.fragment,e),p(ve.$$.fragment,e),p(He),Se=!0)},o(e){y(L.$$.fragment,e),y(C.$$.fragment,e),y(U.$$.fragment,e),y(ve.$$.fragment,e),y(He),Se=!1},d(e){D(L,e),e&&i(M),D(C,e),e&&i(z),D(U,e),e&&i(O),e&&i(J),e&&i(fe),D(ve,e),e&&i(me),He&&He.d(e),e&&i(ge),Be&&Be.d(e),e&&i($e),e&&i(pe)}}}function ge(e){let t,l,r,n,s,a,o,c,u,f,h,v,$,k=e[5],I=[];for(let i=0;i<k.length;i+=1)I[i]=me(re(e,k,i));const S=e=>y(I[e],1,1,(()=>{I[e]=null}));return l=new K({props:{id:"testimonials",blockstyle:"block-style05"}}),n=new M({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),a=new J({}),c=new C({props:{id:"featured",blockstyle:""}}),f=new z({props:{id:"ratings",blockstyle:""}}),v=new U({props:{id:"socialmedia",blockstyle:""}}),{c(){for(let e=0;e<I.length;e+=1)I[e].c();t=m(),E(l.$$.fragment),r=m(),E(n.$$.fragment),s=m(),E(a.$$.fragment),o=m(),E(c.$$.fragment),u=m(),E(f.$$.fragment),h=m(),E(v.$$.fragment)},l(e){for(let t=0;t<I.length;t+=1)I[t].l(e);t=g(e),x(l.$$.fragment,e),r=g(e),x(n.$$.fragment,e),s=g(e),x(a.$$.fragment,e),o=g(e),x(c.$$.fragment,e),u=g(e),x(f.$$.fragment,e),h=g(e),x(v.$$.fragment,e)},m(e,i){for(let t=0;t<I.length;t+=1)I[t].m(e,i);d(e,t,i),j(l,e,i),d(e,r,i),j(n,e,i),d(e,s,i),j(a,e,i),d(e,o,i),j(c,e,i),d(e,u,i),j(f,e,i),d(e,h,i),j(v,e,i),$=!0},p(e,l){if(804&l[0]){let r;for(k=e[5],r=0;r<k.length;r+=1){const n=re(e,k,r);I[r]?(I[r].p(n,l),p(I[r],1)):(I[r]=me(n),I[r].c(),p(I[r],1),I[r].m(t.parentNode,t))}for(w(),r=k.length;r<I.length;r+=1)S(r);b()}},i(e){if(!$){for(let e=0;e<k.length;e+=1)p(I[e]);p(l.$$.fragment,e),p(n.$$.fragment,e),p(a.$$.fragment,e),p(c.$$.fragment,e),p(f.$$.fragment,e),p(v.$$.fragment,e),$=!0}},o(e){I=I.filter(Boolean);for(let t=0;t<I.length;t+=1)y(I[t]);y(l.$$.fragment,e),y(n.$$.fragment,e),y(a.$$.fragment,e),y(c.$$.fragment,e),y(f.$$.fragment,e),y(v.$$.fragment,e),$=!1},d(e){_(I,e),e&&i(t),D(l,e),e&&i(r),D(n,e),e&&i(s),D(a,e),e&&i(o),D(c,e),e&&i(u),D(f,e),e&&i(h),D(v,e)}}}function $e(e){var t,l;let n,a,o,f,h,v,$,w,b,S,q,V,F,H=e[6],B=[];for(let r=0;r<H.length;r+=1)B[r]=ie(oe(e,H,r));let W=e[7],M=[];for(let r=0;r<W.length;r+=1)M[r]=ce(ae(e,W,r));return f=new P({props:{lang:"en"}}),v=new T({props:{title:e[1],description:e[2],keywords:null==(l=null==(t=e[0])?void 0:t.site)?void 0:l.keywords}}),w=new N({props:{title:e[1],description:e[2],image:e[3]}}),S=new A({props:{title:e[1],description:e[2],image:e[3]}}),V=new L({props:{id:"blog-post",$$slots:{default:[ge]},$$scope:{ctx:e}}}),{c(){for(let e=0;e<B.length;e+=1)B[e].c();n=k();for(let e=0;e<M.length;e+=1)M[e].c();a=r("link"),o=m(),E(f.$$.fragment),h=m(),E(v.$$.fragment),$=m(),E(w.$$.fragment),b=m(),E(S.$$.fragment),q=m(),E(V.$$.fragment),this.h()},l(e){const t=I('[data-svelte="svelte-1eol1zw"]',document.head);for(let l=0;l<B.length;l+=1)B[l].l(t);n=k();for(let l=0;l<M.length;l+=1)M[l].l(t);a=s(t,"LINK",{rel:!0,href:!0}),t.forEach(i),o=g(e),x(f.$$.fragment,e),h=g(e),x(v.$$.fragment,e),$=g(e),x(w.$$.fragment,e),b=g(e),x(S.$$.fragment,e),q=g(e),x(V.$$.fragment,e),this.h()},h(){c(a,"rel","stylesheet"),c(a,"href",e[4])},m(e,t){for(let l=0;l<B.length;l+=1)B[l].m(document.head,null);u(document.head,n);for(let l=0;l<M.length;l+=1)M[l].m(document.head,null);u(document.head,a),d(e,o,t),j(f,e,t),d(e,h,t),j(v,e,t),d(e,$,t),j(w,e,t),d(e,b,t),j(S,e,t),d(e,q,t),j(V,e,t),F=!0},p(e,t){var l,r;if(65&t[0]){let l;for(H=e[6],l=0;l<H.length;l+=1){const r=oe(e,H,l);B[l]?B[l].p(r,t):(B[l]=ie(r),B[l].c(),B[l].m(n.parentNode,n))}for(;l<B.length;l+=1)B[l].d(1);B.length=H.length}if(129&t[0]){let l;for(W=e[7],l=0;l<W.length;l+=1){const r=ae(e,W,l);M[l]?M[l].p(r,t):(M[l]=ce(r),M[l].c(),M[l].m(a.parentNode,a))}for(;l<M.length;l+=1)M[l].d(1);M.length=W.length}(!F||16&t[0])&&c(a,"href",e[4]);const s={};2&t[0]&&(s.title=e[1]),4&t[0]&&(s.description=e[2]),1&t[0]&&(s.keywords=null==(r=null==(l=e[0])?void 0:l.site)?void 0:r.keywords),v.$set(s);const o={};2&t[0]&&(o.title=e[1]),4&t[0]&&(o.description=e[2]),8&t[0]&&(o.image=e[3]),w.$set(o);const i={};2&t[0]&&(i.title=e[1]),4&t[0]&&(i.description=e[2]),8&t[0]&&(i.image=e[3]),S.$set(i);const d={};292&t[0]|8&t[1]&&(d.$$scope={dirty:t,ctx:e}),V.$set(d)},i(e){F||(p(f.$$.fragment,e),p(v.$$.fragment,e),p(w.$$.fragment,e),p(S.$$.fragment,e),p(V.$$.fragment,e),F=!0)},o(e){y(f.$$.fragment,e),y(v.$$.fragment,e),y(w.$$.fragment,e),y(S.$$.fragment,e),y(V.$$.fragment,e),F=!1},d(e){_(B,e),i(n),_(M,e),i(a),e&&i(o),D(f,e),e&&i(h),D(v,e),e&&i($),D(w,e),e&&i(b),D(S,e),e&&i(q),D(V,e)}}}function pe(e,t,l,r,n,s,a){try{var o=e[s](a),i=o.value}catch(c){return void l(c)}o.done?t(i):Promise.resolve(i).then(r,n)}function we(e){return function(){var t=this,l=arguments;return new Promise((function(r,n){var s=e.apply(t,l);function a(e){pe(s,r,n,a,o,"next",e)}function o(e){pe(s,r,n,a,o,"throw",e)}a(void 0)}))}}function ye(e,t,l){let r,n;var s,a,o,i,c,d;S(e,W,(e=>l(0,r=e))),S(e,B,(e=>l(18,n=e)));var u="Immigration Services - "+(null==(s=r)||null==(a=s.site)?void 0:a.title),f=null==(o=r)||null==(i=o.site)?void 0:i.description,h=null==(c=r)||null==(d=c.site)?void 0:d.facebook_photo,{slug:v=n.params.slug}=t,m="",g=()=>{},$=[],p=[],w=[],y=new Date;return q(we((function*(){var e,t;l(10,v=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var n={id:v},s=null==(e=r)||null==(t=e.data)?void 0:t.gql(O,r.data.sources.wordpress,n,!1,0);g=yield null==s?void 0:s.subscribe(function(){var e=we((function*(e){var t,r,n,s,a,o,i,c,d,v=yield e;l(8,y=new Date(null==v||null==(t=v.service)?void 0:t.date)),l(6,p=(null==v||null==(r=v.service)||null==(n=r.enqueuedStylesheets)?void 0:n.nodes)||[]),l(7,w=(null==v||null==(s=v.service)||null==(a=s.enqueuedScripts)?void 0:a.nodes)||[]),l(5,$=[null==v?void 0:v.service]),l(1,u=null==v||null==(o=v.service)?void 0:o.title),l(2,f=null==v||null==(i=v.service.Services)?void 0:i.excerpt),l(3,h=null==v||null==(c=v.featuredImage)||null==(d=c.node)?void 0:d.sourceUrl)}));return function(t){return e.apply(this,arguments)}}())}))),V((()=>{g()})),e.$$set=e=>{"slug"in e&&l(10,v=e.slug)},e.$$.update=()=>{1&e.$$.dirty[0]&&l(4,m="/themes/"+r.config.theme+"/style.css")},[r,u,f,h,m,$,p,w,y,["January","February","March","April","May","June","July","August","September","October","November","December"],v]}export default class extends e{constructor(e){super(),t(this,e,ye,$e,l,{slug:10},[-1,-1])}}