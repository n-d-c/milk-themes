import{S as e,i as t,s as l,e as a,t as n,c as r,f as s,m as o,d as i,a as c,k as d,b as u,F as f,P as v,X as g,h as m,j as h,Q as $,p,C as b,r as w,D as y,x as k,q as E,y as x,z as I,L as S,A as _,g as q,v as D,M as V,l as j,Y as B}from"../../chunks/index-eebdc0b4.js";import{H,p as F}from"../../chunks/Head_Article-b6cce70e.js";import{m as P}from"../../chunks/milk-e4e45209.js";import{H as T,a as W,b as A,c as C}from"../../chunks/Head_Twitter-47149dd5.js";import{L}from"../../chunks/Layout_Main-75a53143.js";import{S as M,H as U}from"../../chunks/SocialMedia-a60c3949.js";import{B as N}from"../../chunks/Block_CallOutText-de942ba9.js";import{B as Y,c as O,d as R,h as G}from"../../chunks/Block_Ratings-9ba6a143.js";/* empty css                                             */import{B as z}from"../../chunks/Block_LanguagesWeSpeak-a97b87e1.js";import{B as K}from"../../chunks/Block_Testimonials-bbd9f93d.js";import{F as Q}from"../../chunks/FeaturedVideo-a8c61085.js";/* empty css                                             */function X(e){const t=e-1;return t*t*t+1}function J(e,{delay:t=0,duration:l=400,easing:a=X}={}){const n=getComputedStyle(e),r=+n.opacity,s=parseFloat(n.height),o=parseFloat(n.paddingTop),i=parseFloat(n.paddingBottom),c=parseFloat(n.marginTop),d=parseFloat(n.marginBottom),u=parseFloat(n.borderTopWidth),f=parseFloat(n.borderBottomWidth);return{delay:t,duration:l,easing:a,css:e=>`overflow: hidden;opacity: ${Math.min(20*e,1)*r};height: ${e*s}px;padding-top: ${e*o}px;padding-bottom: ${e*i}px;margin-top: ${e*c}px;margin-bottom: ${e*d}px;border-top-width: ${e*u}px;border-bottom-width: ${e*f}px;`}}function Z(e){let t,l,m,h,$;return{c(){t=a("div"),l=a("p"),m=n(e[1]),this.h()},l(a){t=r(a,"DIV",{class:!0});var n=s(t);l=r(n,"P",{});var c=s(l);m=o(c,e[1]),c.forEach(i),n.forEach(i),this.h()},h(){c(t,"class","dropdown")},m(e,a){d(e,t,a),u(t,l),u(l,m),$=!0},p(e,t){(!$||2&t)&&f(m,e[1])},i(e){$||(v((()=>{h||(h=g(t,J,{duration:300},!0)),h.run(1)})),$=!0)},o(e){h||(h=g(t,J,{duration:300},!1)),h.run(0),$=!1},d(e){e&&i(t),e&&h&&h.end()}}}function ee(e){let t,l,v,g,k,E,x,I,S,_,q,D,V,j=e[2]&&Z(e);return{c(){t=a("div"),l=a("div"),v=a("i"),g=m(),k=a("i"),E=m(),x=a("div"),I=a("h3"),S=n(e[0]),_=m(),j&&j.c(),this.h()},l(a){t=r(a,"DIV",{class:!0});var n=s(t);l=r(n,"DIV",{"aria-expanded":!0,class:!0});var c=s(l);v=r(c,"I",{class:!0}),s(v).forEach(i),g=h(c),k=r(c,"I",{class:!0}),s(k).forEach(i),c.forEach(i),E=h(n),x=r(n,"DIV",{class:!0});var d=s(x);I=r(d,"H3",{});var u=s(I);S=o(u,e[0]),u.forEach(i),_=h(d),j&&j.l(d),d.forEach(i),n.forEach(i),this.h()},h(){c(v,"class","svelte-10kngos"),c(k,"class","svelte-10kngos"),c(l,"aria-expanded",e[2]),c(l,"class","icon-wrap svelte-10kngos"),c(x,"class","faq-content svelte-10kngos"),c(t,"class","single-faq-wrap svelte-10kngos")},m(a,n){d(a,t,n),u(t,l),u(l,v),u(l,g),u(l,k),u(t,E),u(t,x),u(x,I),u(I,S),u(x,_),j&&j.m(x,null),q=!0,D||(V=$(l,"click",e[3]),D=!0)},p(e,[t]){(!q||4&t)&&c(l,"aria-expanded",e[2]),(!q||1&t)&&f(S,e[0]),e[2]?j?(j.p(e,t),4&t&&p(j,1)):(j=Z(e),j.c(),p(j,1),j.m(x,null)):j&&(b(),w(j,1,1,(()=>{j=null})),y())},i(e){q||(p(j),q=!0)},o(e){w(j),q=!1},d(e){e&&i(t),j&&j.d(),D=!1,V()}}}function te(e,t,l){var a=!1,{title:n}=t,{content:r}=t;return e.$$set=e=>{"title"in e&&l(0,n=e.title),"content"in e&&l(1,r=e.content)},[n,r,a,()=>l(2,a=!a)]}class le extends e{constructor(e){super(),t(this,e,te,ee,l,{title:0,content:1})}}function ae(e,t,l){const a=e.slice();return a[19]=t[l],a}function ne(e,t,l){const a=e.slice();return a[22]=t[l],a}function re(e,t,l){const a=e.slice();return a[25]=t[l],a}function se(e,t,l){const a=e.slice();return a[28]=t[l],a}function oe(e){let t,l;return{c(){t=a("script"),this.h()},l(e){t=r(e,"SCRIPT",{defer:!0,src:!0}),s(t).forEach(i),this.h()},h(){t.defer=!0,t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},m(e,l){d(e,t,l)},p(e,a){65&a[0]&&t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},d(e){e&&i(t)}}}function ie(e){let t,l;return{c(){l=j(),this.h()},l(e){l=j(),this.h()},h(){t=new B(l)},m(a,n){t.m(e[2],a,n),d(a,l,n)},p(e,l){4&l[0]&&t.p(e[2])},d(e){e&&i(l),e&&t.d()}}}function ce(e){var t,l;let f,v,g,$,k,E,x=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.serviceFaq,I=[];for(let a=0;a<x.length;a+=1)I[a]=de(re(e,x,a));const _=e=>w(I[e],1,1,(()=>{I[e]=null}));return{c(){f=a("div"),v=a("h2"),g=n("frequently asked questions"),$=m(),k=a("div");for(let e=0;e<I.length;e+=1)I[e].c();this.h()},l(e){f=r(e,"DIV",{class:!0});var t=s(f);v=r(t,"H2",{class:!0});var l=s(v);g=o(l,"frequently asked questions"),l.forEach(i),$=h(t),k=r(t,"DIV",{class:!0});var a=s(k);for(let n=0;n<I.length;n+=1)I[n].l(a);a.forEach(i),t.forEach(i),this.h()},h(){c(v,"class","svelte-9bgt3a"),c(k,"class","flex-wrap svelte-9bgt3a"),c(f,"class","outer-wrap margin-sides-large bg-white svelte-9bgt3a")},m(e,t){d(e,f,t),u(f,v),u(v,g),u(f,$),u(f,k);for(let l=0;l<I.length;l+=1)I[l].m(k,null);E=!0},p(e,t){var l,a;if(32&t[0]){let n;for(x=null==(a=null==(l=e[19])?void 0:l.Services)?void 0:a.serviceFaq,n=0;n<x.length;n+=1){const l=re(e,x,n);I[n]?(I[n].p(l,t),p(I[n],1)):(I[n]=de(l),I[n].c(),p(I[n],1),I[n].m(k,null))}for(b(),n=x.length;n<I.length;n+=1)_(n);y()}},i(e){if(!E){for(let e=0;e<x.length;e+=1)p(I[e]);E=!0}},o(e){I=I.filter(Boolean);for(let t=0;t<I.length;t+=1)w(I[t]);E=!1},d(e){e&&i(f),S(I,e)}}}function de(e){var t,l;let a,n;return a=new le({props:{title:null==(t=e[25])?void 0:t.faqTitle,content:null==(l=e[25])?void 0:l.faqContent}}),{c(){k(a.$$.fragment)},l(e){x(a.$$.fragment,e)},m(e,t){I(a,e,t),n=!0},p(e,t){var l,n;const r={};32&t[0]&&(r.title=null==(l=e[25])?void 0:l.faqTitle),32&t[0]&&(r.content=null==(n=e[25])?void 0:n.faqContent),a.$set(r)},i(e){n||(p(a.$$.fragment,e),n=!0)},o(e){w(a.$$.fragment,e),n=!1},d(e){_(a,e)}}}function ue(e){var t,l;let f,v,g,$,p,b=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.relatedPosts,w=[];for(let a=0;a<b.length;a+=1)w[a]=fe(ne(e,b,a));return{c(){f=a("div"),v=a("h2"),g=n("related blog posts"),$=m(),p=a("div");for(let e=0;e<w.length;e+=1)w[e].c();this.h()},l(e){f=r(e,"DIV",{class:!0});var t=s(f);v=r(t,"H2",{class:!0});var l=s(v);g=o(l,"related blog posts"),l.forEach(i),$=h(t),p=r(t,"DIV",{class:!0});var a=s(p);for(let n=0;n<w.length;n+=1)w[n].l(a);a.forEach(i),t.forEach(i),this.h()},h(){c(v,"class","svelte-9bgt3a"),c(p,"class","flex-wrap svelte-9bgt3a"),c(f,"class","outer-wrap margin-sides-large svelte-9bgt3a")},m(e,t){d(e,f,t),u(f,v),u(v,g),u(f,$),u(f,p);for(let l=0;l<w.length;l+=1)w[l].m(p,null)},p(e,t){var l,a;if(32&t[0]){let n;for(b=null==(a=null==(l=e[19])?void 0:l.Services)?void 0:a.relatedPosts,n=0;n<b.length;n+=1){const l=ne(e,b,n);w[n]?w[n].p(l,t):(w[n]=fe(l),w[n].c(),w[n].m(p,null))}for(;n<w.length;n+=1)w[n].d(1);w.length=b.length}},d(e){e&&i(f),S(w,e)}}}function fe(e){var t;let l,v,g,$,p,b,w,y,k,E,x,I,S,_=(null==(t=e[22])?void 0:t.title)+"";return{c(){l=a("div"),v=a("div"),g=a("a"),$=a("img"),w=m(),y=a("div"),k=a("h3"),E=a("a"),x=n(_),S=m(),this.h()},l(e){l=r(e,"DIV",{class:!0});var t=s(l);v=r(t,"DIV",{class:!0});var a=s(v);g=r(a,"A",{href:!0});var n=s(g);$=r(n,"IMG",{src:!0,alt:!0}),n.forEach(i),a.forEach(i),w=h(t),y=r(t,"DIV",{class:!0});var c=s(y);k=r(c,"H3",{class:!0});var d=s(k);E=r(d,"A",{href:!0,class:!0});var u=s(E);x=o(u,_),u.forEach(i),d.forEach(i),c.forEach(i),S=h(t),t.forEach(i),this.h()},h(){var t,a,n,r;$.src!==(p=null==(a=null==(t=e[22])?void 0:t.featuredImage)?void 0:a.node.sourceUrl)&&c($,"src",p),c($,"alt",""),c(g,"href",b=`/immigration-law-blog/${null==(n=e[22])?void 0:n.slug}`),c(v,"class","img-wrap"),c(E,"href",I=`/immigration-law-blog/${null==(r=e[22])?void 0:r.slug}`),c(E,"class","svelte-9bgt3a"),c(k,"class","svelte-9bgt3a"),c(y,"class","bg-grey svelte-9bgt3a"),c(l,"class","related-post-wrap svelte-9bgt3a")},m(e,t){d(e,l,t),u(l,v),u(v,g),u(g,$),u(l,w),u(l,y),u(y,k),u(k,E),u(E,x),u(l,S)},p(e,t){var l,a,n,r,s;32&t[0]&&$.src!==(p=null==(a=null==(l=e[22])?void 0:l.featuredImage)?void 0:a.node.sourceUrl)&&c($,"src",p),32&t[0]&&b!==(b=`/immigration-law-blog/${null==(n=e[22])?void 0:n.slug}`)&&c(g,"href",b),32&t[0]&&_!==(_=(null==(r=e[22])?void 0:r.title)+"")&&f(x,_),32&t[0]&&I!==(I=`/immigration-law-blog/${null==(s=e[22])?void 0:s.slug}`)&&c(E,"href",I)},d(e){e&&i(l)}}}function ve(e){var t,l,v,g,$,E,S,q,D,V,j,B,F,P,T,W,A,C;let L,M,Y,O,R,G,z,K,X,J,Z,ee,te,le,ae,ne,re,se,oe,de,fe,ve,ge,me,he,$e,pe,be,we,ye,ke,Ee,xe,Ie,Se,_e,qe,De,Ve=(null==(t=e[19])?void 0:t.title)+"",je=(null==(l=e[19])?void 0:l.content)+"",Be=(null==(v=e[19])?void 0:v.title)+"";L=new H({props:{author:null==(E=null==($=null==(g=e[19])?void 0:g.author)?void 0:$.node)?void 0:E.name,pubdate:null==(S=e[19])?void 0:S.date}}),Y=new U({props:{id:"blog-post-hero",image_url:null==(V=null==(D=null==(q=e[19])?void 0:q.featuredImage)?void 0:D.node)?void 0:V.sourceUrl,img_srcset:null==(F=null==(B=null==(j=e[19])?void 0:j.featuredImage)?void 0:B.node)?void 0:F.srcSet,avif_srcset:"",webp_srcset:"",title:"Harlan York and Associates",parallax:"false"}}),R=new N({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:null==(P=e[19])?void 0:P.title,$$slots:{default:[ie]},$$scope:{ctx:e}}}),ge=new Q({props:{id:"featured-video",blockstyle:"",video_source:"//player.vimeo.com/video/108146056",video_jpg:"/img/video_featured.jpg",video_webp:"/img/video_featured.webp",video_avif:"/img/video_featured.avif"}});let He=(null==(W=null==(T=e[19])?void 0:T.Services)?void 0:W.serviceFaq)&&ce(e),Fe=(null==(C=null==(A=e[19])?void 0:A.Services)?void 0:C.relatedPosts)&&ue(e);return{c(){k(L.$$.fragment),M=m(),k(Y.$$.fragment),O=m(),k(R.$$.fragment),G=m(),z=a("div"),K=a("div"),X=a("div"),J=a("div"),Z=a("a"),ee=n("Home"),te=n("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=a("a"),ae=n("Services"),ne=n("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),re=a("a"),se=n(Ve),de=m(),fe=a("div"),ve=m(),k(ge.$$.fragment),me=m(),He&&He.c(),he=m(),Fe&&Fe.c(),$e=m(),pe=a("div"),be=a("h2"),we=n("We are here to answer all your questions about "),ye=n(Be),ke=m(),Ee=a("p"),xe=n("You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),Ie=m(),Se=a("p"),_e=a("strong"),qe=n("US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),this.h()},l(e){x(L.$$.fragment,e),M=h(e),x(Y.$$.fragment,e),O=h(e),x(R.$$.fragment,e),G=h(e),z=r(e,"DIV",{class:!0});var t=s(z);K=r(t,"DIV",{class:!0});var l=s(K);X=r(l,"DIV",{class:!0});var a=s(X);J=r(a,"DIV",{class:!0});var n=s(J);Z=r(n,"A",{href:!0,class:!0});var c=s(Z);ee=o(c,"Home"),c.forEach(i),te=o(n,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=r(n,"A",{href:!0,class:!0});var d=s(le);ae=o(d,"Services"),d.forEach(i),ne=o(n,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),re=r(n,"A",{href:!0,class:!0});var u=s(re);se=o(u,Ve),u.forEach(i),n.forEach(i),a.forEach(i),de=h(l),fe=r(l,"DIV",{class:!0}),s(fe).forEach(i),l.forEach(i),t.forEach(i),ve=h(e),x(ge.$$.fragment,e),me=h(e),He&&He.l(e),he=h(e),Fe&&Fe.l(e),$e=h(e),pe=r(e,"DIV",{class:!0});var f=s(pe);be=r(f,"H2",{class:!0});var v=s(be);we=o(v,"We are here to answer all your questions about "),ye=o(v,Be),v.forEach(i),ke=h(f),Ee=r(f,"P",{});var g=s(Ee);xe=o(g,"You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),g.forEach(i),Ie=h(f),Se=r(f,"P",{});var m=s(Se);_e=r(m,"STRONG",{});var $=s(_e);qe=o($,"US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),$.forEach(i),m.forEach(i),f.forEach(i),this.h()},h(){var t;c(Z,"href","/"),c(Z,"class","svelte-9bgt3a"),c(le,"href","/immigration-law-services"),c(le,"class","svelte-9bgt3a"),c(re,"href",oe=`/immigration-law-services/${null==(t=e[19])?void 0:t.slug}`),c(re,"class","svelte-9bgt3a"),c(J,"class","breadcrumbs svelte-9bgt3a"),c(X,"class","blog-topbar svelte-9bgt3a"),c(fe,"class","blog-content"),c(K,"class","content-inner"),c(z,"class","content"),c(be,"class","svelte-9bgt3a"),c(pe,"class","service-info svelte-9bgt3a")},m(e,t){I(L,e,t),d(e,M,t),I(Y,e,t),d(e,O,t),I(R,e,t),d(e,G,t),d(e,z,t),u(z,K),u(K,X),u(X,J),u(J,Z),u(Z,ee),u(J,te),u(J,le),u(le,ae),u(J,ne),u(J,re),u(re,se),u(K,de),u(K,fe),fe.innerHTML=je,d(e,ve,t),I(ge,e,t),d(e,me,t),He&&He.m(e,t),d(e,he,t),Fe&&Fe.m(e,t),d(e,$e,t),d(e,pe,t),u(pe,be),u(be,we),u(be,ye),u(pe,ke),u(pe,Ee),u(Ee,xe),u(pe,Ie),u(pe,Se),u(Se,_e),u(_e,qe),De=!0},p(e,t){var l,a,n,r,s,o,i,d,u,v,g,m,h,$,k,E,x,I,S;const _={};32&t[0]&&(_.author=null==(n=null==(a=null==(l=e[19])?void 0:l.author)?void 0:a.node)?void 0:n.name),32&t[0]&&(_.pubdate=null==(r=e[19])?void 0:r.date),L.$set(_);const q={};32&t[0]&&(q.image_url=null==(i=null==(o=null==(s=e[19])?void 0:s.featuredImage)?void 0:o.node)?void 0:i.sourceUrl),32&t[0]&&(q.img_srcset=null==(v=null==(u=null==(d=e[19])?void 0:d.featuredImage)?void 0:u.node)?void 0:v.srcSet),Y.$set(q);const D={};32&t[0]&&(D.title=null==(g=e[19])?void 0:g.title),4&t[0]|1&t[1]&&(D.$$scope={dirty:t,ctx:e}),R.$set(D),(!De||32&t[0])&&Ve!==(Ve=(null==(m=e[19])?void 0:m.title)+"")&&f(se,Ve),(!De||32&t[0]&&oe!==(oe=`/immigration-law-services/${null==(h=e[19])?void 0:h.slug}`))&&c(re,"href",oe),(!De||32&t[0])&&je!==(je=(null==($=e[19])?void 0:$.content)+"")&&(fe.innerHTML=je),(null==(E=null==(k=e[19])?void 0:k.Services)?void 0:E.serviceFaq)?He?(He.p(e,t),32&t[0]&&p(He,1)):(He=ce(e),He.c(),p(He,1),He.m(he.parentNode,he)):He&&(b(),w(He,1,1,(()=>{He=null})),y()),(null==(I=null==(x=e[19])?void 0:x.Services)?void 0:I.relatedPosts)?Fe?Fe.p(e,t):(Fe=ue(e),Fe.c(),Fe.m($e.parentNode,$e)):Fe&&(Fe.d(1),Fe=null),(!De||32&t[0])&&Be!==(Be=(null==(S=e[19])?void 0:S.title)+"")&&f(ye,Be)},i(e){De||(p(L.$$.fragment,e),p(Y.$$.fragment,e),p(R.$$.fragment,e),p(ge.$$.fragment,e),p(He),De=!0)},o(e){w(L.$$.fragment,e),w(Y.$$.fragment,e),w(R.$$.fragment,e),w(ge.$$.fragment,e),w(He),De=!1},d(e){_(L,e),e&&i(M),_(Y,e),e&&i(O),_(R,e),e&&i(G),e&&i(z),e&&i(ve),_(ge,e),e&&i(me),He&&He.d(e),e&&i(he),Fe&&Fe.d(e),e&&i($e),e&&i(pe)}}}function ge(e){let t,l,a,n,r,s,o,c,u,f,v,g,$,E=e[5],q=[];for(let i=0;i<E.length;i+=1)q[i]=ve(ae(e,E,i));const D=e=>w(q[e],1,1,(()=>{q[e]=null}));return l=new K({props:{id:"testimonials",blockstyle:"block-style05"}}),n=new Y({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),s=new z({}),c=new O({props:{id:"featured",blockstyle:""}}),f=new R({props:{id:"ratings",blockstyle:""}}),g=new M({props:{id:"socialmedia",blockstyle:""}}),{c(){for(let e=0;e<q.length;e+=1)q[e].c();t=m(),k(l.$$.fragment),a=m(),k(n.$$.fragment),r=m(),k(s.$$.fragment),o=m(),k(c.$$.fragment),u=m(),k(f.$$.fragment),v=m(),k(g.$$.fragment)},l(e){for(let t=0;t<q.length;t+=1)q[t].l(e);t=h(e),x(l.$$.fragment,e),a=h(e),x(n.$$.fragment,e),r=h(e),x(s.$$.fragment,e),o=h(e),x(c.$$.fragment,e),u=h(e),x(f.$$.fragment,e),v=h(e),x(g.$$.fragment,e)},m(e,i){for(let t=0;t<q.length;t+=1)q[t].m(e,i);d(e,t,i),I(l,e,i),d(e,a,i),I(n,e,i),d(e,r,i),I(s,e,i),d(e,o,i),I(c,e,i),d(e,u,i),I(f,e,i),d(e,v,i),I(g,e,i),$=!0},p(e,l){if(36&l[0]){let a;for(E=e[5],a=0;a<E.length;a+=1){const n=ae(e,E,a);q[a]?(q[a].p(n,l),p(q[a],1)):(q[a]=ve(n),q[a].c(),p(q[a],1),q[a].m(t.parentNode,t))}for(b(),a=E.length;a<q.length;a+=1)D(a);y()}},i(e){if(!$){for(let e=0;e<E.length;e+=1)p(q[e]);p(l.$$.fragment,e),p(n.$$.fragment,e),p(s.$$.fragment,e),p(c.$$.fragment,e),p(f.$$.fragment,e),p(g.$$.fragment,e),$=!0}},o(e){q=q.filter(Boolean);for(let t=0;t<q.length;t+=1)w(q[t]);w(l.$$.fragment,e),w(n.$$.fragment,e),w(s.$$.fragment,e),w(c.$$.fragment,e),w(f.$$.fragment,e),w(g.$$.fragment,e),$=!1},d(e){S(q,e),e&&i(t),_(l,e),e&&i(a),_(n,e),e&&i(r),_(s,e),e&&i(o),_(c,e),e&&i(u),_(f,e),e&&i(v),_(g,e)}}}function me(e){var t,l;let n,s,o,f,v,g,$,b,y,q,D,V,j=e[6],B=[];for(let a=0;a<j.length;a+=1)B[a]=oe(se(e,j,a));return o=new T({props:{lang:"en"}}),v=new W({props:{title:e[1],description:e[2],keywords:null==(l=null==(t=e[0])?void 0:t.site)?void 0:l.keywords}}),$=new A({props:{title:e[1],description:e[2],image:e[3]}}),y=new C({props:{title:e[1],description:e[2],image:e[3]}}),D=new L({props:{id:"blog-post",$$slots:{default:[ge]},$$scope:{ctx:e}}}),{c(){for(let e=0;e<B.length;e+=1)B[e].c();n=a("link"),s=m(),k(o.$$.fragment),f=m(),k(v.$$.fragment),g=m(),k($.$$.fragment),b=m(),k(y.$$.fragment),q=m(),k(D.$$.fragment),this.h()},l(e){const t=E('[data-svelte="svelte-109dn47"]',document.head);for(let l=0;l<B.length;l+=1)B[l].l(t);n=r(t,"LINK",{rel:!0,href:!0}),t.forEach(i),s=h(e),x(o.$$.fragment,e),f=h(e),x(v.$$.fragment,e),g=h(e),x($.$$.fragment,e),b=h(e),x(y.$$.fragment,e),q=h(e),x(D.$$.fragment,e),this.h()},h(){c(n,"rel","stylesheet"),c(n,"href",e[4])},m(e,t){for(let l=0;l<B.length;l+=1)B[l].m(document.head,null);u(document.head,n),d(e,s,t),I(o,e,t),d(e,f,t),I(v,e,t),d(e,g,t),I($,e,t),d(e,b,t),I(y,e,t),d(e,q,t),I(D,e,t),V=!0},p(e,t){var l,a;if(65&t[0]){let l;for(j=e[6],l=0;l<j.length;l+=1){const a=se(e,j,l);B[l]?B[l].p(a,t):(B[l]=oe(a),B[l].c(),B[l].m(n.parentNode,n))}for(;l<B.length;l+=1)B[l].d(1);B.length=j.length}(!V||16&t[0])&&c(n,"href",e[4]);const r={};2&t[0]&&(r.title=e[1]),4&t[0]&&(r.description=e[2]),1&t[0]&&(r.keywords=null==(a=null==(l=e[0])?void 0:l.site)?void 0:a.keywords),v.$set(r);const s={};2&t[0]&&(s.title=e[1]),4&t[0]&&(s.description=e[2]),8&t[0]&&(s.image=e[3]),$.$set(s);const o={};2&t[0]&&(o.title=e[1]),4&t[0]&&(o.description=e[2]),8&t[0]&&(o.image=e[3]),y.$set(o);const i={};36&t[0]|1&t[1]&&(i.$$scope={dirty:t,ctx:e}),D.$set(i)},i(e){V||(p(o.$$.fragment,e),p(v.$$.fragment,e),p($.$$.fragment,e),p(y.$$.fragment,e),p(D.$$.fragment,e),V=!0)},o(e){w(o.$$.fragment,e),w(v.$$.fragment,e),w($.$$.fragment,e),w(y.$$.fragment,e),w(D.$$.fragment,e),V=!1},d(e){S(B,e),i(n),e&&i(s),_(o,e),e&&i(f),_(v,e),e&&i(g),_($,e),e&&i(b),_(y,e),e&&i(q),_(D,e)}}}function he(e,t,l,a,n,r,s){try{var o=e[r](s),i=o.value}catch(c){return void l(c)}o.done?t(i):Promise.resolve(i).then(a,n)}function $e(e){return function(){var t=this,l=arguments;return new Promise((function(a,n){var r=e.apply(t,l);function s(e){he(r,a,n,s,o,"next",e)}function o(e){he(r,a,n,s,o,"throw",e)}s(void 0)}))}}function pe(e,t,l){let a,n;var r,s,o,i,c,d;q(e,P,(e=>l(0,a=e))),q(e,F,(e=>l(17,n=e)));var u="Immigration Services - "+(null==(r=a)||null==(s=r.site)?void 0:s.title),f=null==(o=a)||null==(i=o.site)?void 0:i.description,v=null==(c=a)||null==(d=c.site)?void 0:d.facebook_photo,{slug:g=n.params.slug}=t,m="",h=()=>{},$=[],p=[];return D($e((function*(){var e,t;l(7,g=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var n={id:g},r=null==(e=a)||null==(t=e.data)?void 0:t.gql(G,a.data.sources.wordpress,n,!1,0);h=yield null==r?void 0:r.subscribe(function(){var e=$e((function*(e){var t,a,n,r,s,o,i,c,d,g=yield e;new Date(null==g||null==(t=g.service)?void 0:t.date),null==g||null==(a=g.service)||null==(n=a.enqueuedStylesheets)||n.nodes,l(6,p=(null==g||null==(r=g.service)||null==(s=r.enqueuedScripts)?void 0:s.nodes)||[]),l(5,$=[null==g?void 0:g.service]),l(1,u=null==g||null==(o=g.service)?void 0:o.title),l(2,f=null==g||null==(i=g.service.Services)?void 0:i.excerpt),l(3,v=null==g||null==(c=g.featuredImage)||null==(d=c.node)?void 0:d.sourceUrl)}));return function(t){return e.apply(this,arguments)}}())}))),V((()=>{h()})),e.$$set=e=>{"slug"in e&&l(7,g=e.slug)},e.$$.update=()=>{1&e.$$.dirty[0]&&l(4,m="/themes/"+a.config.theme+"/style.css")},[a,u,f,v,m,$,p,g]}export default class extends e{constructor(e){super(),t(this,e,pe,me,l,{slug:7},[-1,-1])}}
