import{S as e,i as t,s as l,l as r,n as a,p as n,q as s,r as o,h as i,u as c,e as d,v as u,w as f,L as v,X as g,a as m,d as h,M as $,t as p,D as w,f as b,E as k,c as y,F as E,b as I,m as x,W as S,g as _,j as q,o as D,k as j,y as V,Y as B}from"../../chunks/index-7a36a124.js";import{H,p as F}from"../../chunks/Head_Article-f6673b2c.js";import{L as T,m as P}from"../../chunks/Layout_Main-697d9c60.js";import{H as W,a as A,b as C,c as L}from"../../chunks/Head_Twitter-7ffaea07.js";import{H as M}from"../../chunks/Hero-4c4eba03.js";import{B as U}from"../../chunks/Block_CallOutText-362690d4.js";import{B as N,c as Y,g as O}from"../../chunks/Block_Ratings-97e1c7df.js";/* empty css                                             */import{B as R}from"../../chunks/Block_CallToAction-4d3ffe01.js";import{B as G}from"../../chunks/Block_LanguagesWeSpeak-c4ac35d3.js";import{B as K}from"../../chunks/Block_Testimonials-6af64bd5.js";import{S as X}from"../../chunks/SocialMedia-521e296e.js";import{F as z}from"../../chunks/FeaturedVideo-c50c9448.js";import"../../chunks/wordpress.graphql-58acdd03.js";/* empty css                                             */function J(e){const t=e-1;return t*t*t+1}function Q(e,{delay:t=0,duration:l=400,easing:r=J}={}){const a=getComputedStyle(e),n=+a.opacity,s=parseFloat(a.height),o=parseFloat(a.paddingTop),i=parseFloat(a.paddingBottom),c=parseFloat(a.marginTop),d=parseFloat(a.marginBottom),u=parseFloat(a.borderTopWidth),f=parseFloat(a.borderBottomWidth);return{delay:t,duration:l,easing:r,css:e=>`overflow: hidden;opacity: ${Math.min(20*e,1)*n};height: ${e*s}px;padding-top: ${e*o}px;padding-bottom: ${e*i}px;margin-top: ${e*c}px;margin-bottom: ${e*d}px;border-top-width: ${e*u}px;border-bottom-width: ${e*f}px;`}}function Z(e){let t,l,m,h,$;return{c(){t=r("div"),l=r("p"),m=a(e[1]),this.h()},l(r){t=n(r,"DIV",{class:!0});var a=s(t);l=n(a,"P",{});var c=s(l);m=o(c,e[1]),c.forEach(i),a.forEach(i),this.h()},h(){c(t,"class","dropdown")},m(e,r){d(e,t,r),u(t,l),u(l,m),$=!0},p(e,t){(!$||2&t)&&f(m,e[1])},i(e){$||(v((()=>{h||(h=g(t,Q,{duration:300},!0)),h.run(1)})),$=!0)},o(e){h||(h=g(t,Q,{duration:300},!1)),h.run(0),$=!1},d(e){e&&i(t),e&&h&&h.end()}}}function ee(e){let t,l,v,g,y,E,I,x,S,_,q,D,j,V=e[2]&&Z(e);return{c(){t=r("div"),l=r("div"),v=r("i"),g=m(),y=r("i"),E=m(),I=r("div"),x=r("h3"),S=a(e[0]),_=m(),V&&V.c(),this.h()},l(r){t=n(r,"DIV",{class:!0});var a=s(t);l=n(a,"DIV",{"aria-expanded":!0,class:!0});var c=s(l);v=n(c,"I",{class:!0}),s(v).forEach(i),g=h(c),y=n(c,"I",{class:!0}),s(y).forEach(i),c.forEach(i),E=h(a),I=n(a,"DIV",{class:!0});var d=s(I);x=n(d,"H3",{});var u=s(x);S=o(u,e[0]),u.forEach(i),_=h(d),V&&V.l(d),d.forEach(i),a.forEach(i),this.h()},h(){c(v,"class","svelte-10kngos"),c(y,"class","svelte-10kngos"),c(l,"aria-expanded",e[2]),c(l,"class","icon-wrap svelte-10kngos"),c(I,"class","faq-content svelte-10kngos"),c(t,"class","single-faq-wrap svelte-10kngos")},m(r,a){d(r,t,a),u(t,l),u(l,v),u(l,g),u(l,y),u(t,E),u(t,I),u(I,x),u(x,S),u(I,_),V&&V.m(I,null),q=!0,D||(j=$(l,"click",e[3]),D=!0)},p(e,[t]){(!q||4&t)&&c(l,"aria-expanded",e[2]),(!q||1&t)&&f(S,e[0]),e[2]?V?(V.p(e,t),4&t&&p(V,1)):(V=Z(e),V.c(),p(V,1),V.m(I,null)):V&&(w(),b(V,1,1,(()=>{V=null})),k())},i(e){q||(p(V),q=!0)},o(e){b(V),q=!1},d(e){e&&i(t),V&&V.d(),D=!1,j()}}}function te(e,t,l){var r=!1,{title:a}=t,{content:n}=t;return e.$$set=e=>{"title"in e&&l(0,a=e.title),"content"in e&&l(1,n=e.content)},[a,n,r,()=>l(2,r=!r)]}class le extends e{constructor(e){super(),t(this,e,te,ee,l,{title:0,content:1})}}function re(e,t,l){const r=e.slice();return r[19]=t[l],r}function ae(e,t,l){const r=e.slice();return r[22]=t[l],r}function ne(e,t,l){const r=e.slice();return r[25]=t[l],r}function se(e,t,l){const r=e.slice();return r[28]=t[l],r}function oe(e){let t,l;return{c(){t=r("script"),this.h()},l(e){t=n(e,"SCRIPT",{defer:!0,src:!0}),s(t).forEach(i),this.h()},h(){t.defer=!0,t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},m(e,l){d(e,t,l)},p(e,r){65&r[0]&&t.src!==(l=e[28].src.startsWith("http")?`${e[28].src}`:`${e[0].site.admin_url}${e[28].src}`)&&c(t,"src",l)},d(e){e&&i(t)}}}function ie(e){let t,l;return{c(){l=V(),this.h()},l(e){l=V(),this.h()},h(){t=new B(l)},m(r,a){t.m(e[2],r,a),d(r,l,a)},p(e,l){4&l[0]&&t.p(e[2])},d(e){e&&i(l),e&&t.d()}}}function ce(e){var t,l;let f,v,g,$,y,E,I=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.serviceFaq,x=[];for(let r=0;r<I.length;r+=1)x[r]=de(ne(e,I,r));const _=e=>b(x[e],1,1,(()=>{x[e]=null}));return{c(){f=r("div"),v=r("h2"),g=a("frequently asked questions"),$=m(),y=r("div");for(let e=0;e<x.length;e+=1)x[e].c();this.h()},l(e){f=n(e,"DIV",{class:!0});var t=s(f);v=n(t,"H2",{class:!0});var l=s(v);g=o(l,"frequently asked questions"),l.forEach(i),$=h(t),y=n(t,"DIV",{class:!0});var r=s(y);for(let a=0;a<x.length;a+=1)x[a].l(r);r.forEach(i),t.forEach(i),this.h()},h(){c(v,"class","svelte-9bgt3a"),c(y,"class","flex-wrap svelte-9bgt3a"),c(f,"class","outer-wrap margin-sides-large bg-white svelte-9bgt3a")},m(e,t){d(e,f,t),u(f,v),u(v,g),u(f,$),u(f,y);for(let l=0;l<x.length;l+=1)x[l].m(y,null);E=!0},p(e,t){var l,r;if(32&t[0]){let a;for(I=null==(r=null==(l=e[19])?void 0:l.Services)?void 0:r.serviceFaq,a=0;a<I.length;a+=1){const l=ne(e,I,a);x[a]?(x[a].p(l,t),p(x[a],1)):(x[a]=de(l),x[a].c(),p(x[a],1),x[a].m(y,null))}for(w(),a=I.length;a<x.length;a+=1)_(a);k()}},i(e){if(!E){for(let e=0;e<I.length;e+=1)p(x[e]);E=!0}},o(e){x=x.filter(Boolean);for(let t=0;t<x.length;t+=1)b(x[t]);E=!1},d(e){e&&i(f),S(x,e)}}}function de(e){var t,l;let r,a;return r=new le({props:{title:null==(t=e[25])?void 0:t.faqTitle,content:null==(l=e[25])?void 0:l.faqContent}}),{c(){y(r.$$.fragment)},l(e){I(r.$$.fragment,e)},m(e,t){x(r,e,t),a=!0},p(e,t){var l,a;const n={};32&t[0]&&(n.title=null==(l=e[25])?void 0:l.faqTitle),32&t[0]&&(n.content=null==(a=e[25])?void 0:a.faqContent),r.$set(n)},i(e){a||(p(r.$$.fragment,e),a=!0)},o(e){b(r.$$.fragment,e),a=!1},d(e){_(r,e)}}}function ue(e){var t,l;let f,v,g,$,p,w=null==(l=null==(t=e[19])?void 0:t.Services)?void 0:l.relatedPosts,b=[];for(let r=0;r<w.length;r+=1)b[r]=fe(ae(e,w,r));return{c(){f=r("div"),v=r("h2"),g=a("related blog posts"),$=m(),p=r("div");for(let e=0;e<b.length;e+=1)b[e].c();this.h()},l(e){f=n(e,"DIV",{class:!0});var t=s(f);v=n(t,"H2",{class:!0});var l=s(v);g=o(l,"related blog posts"),l.forEach(i),$=h(t),p=n(t,"DIV",{class:!0});var r=s(p);for(let a=0;a<b.length;a+=1)b[a].l(r);r.forEach(i),t.forEach(i),this.h()},h(){c(v,"class","svelte-9bgt3a"),c(p,"class","flex-wrap svelte-9bgt3a"),c(f,"class","outer-wrap margin-sides-large svelte-9bgt3a")},m(e,t){d(e,f,t),u(f,v),u(v,g),u(f,$),u(f,p);for(let l=0;l<b.length;l+=1)b[l].m(p,null)},p(e,t){var l,r;if(32&t[0]){let a;for(w=null==(r=null==(l=e[19])?void 0:l.Services)?void 0:r.relatedPosts,a=0;a<w.length;a+=1){const l=ae(e,w,a);b[a]?b[a].p(l,t):(b[a]=fe(l),b[a].c(),b[a].m(p,null))}for(;a<b.length;a+=1)b[a].d(1);b.length=w.length}},d(e){e&&i(f),S(b,e)}}}function fe(e){var t;let l,v,g,$,p,w,b,k,y,E,I,x,S,_=(null==(t=e[22])?void 0:t.title)+"";return{c(){l=r("div"),v=r("div"),g=r("a"),$=r("img"),b=m(),k=r("div"),y=r("h3"),E=r("a"),I=a(_),S=m(),this.h()},l(e){l=n(e,"DIV",{class:!0});var t=s(l);v=n(t,"DIV",{class:!0});var r=s(v);g=n(r,"A",{href:!0});var a=s(g);$=n(a,"IMG",{src:!0,alt:!0}),a.forEach(i),r.forEach(i),b=h(t),k=n(t,"DIV",{class:!0});var c=s(k);y=n(c,"H3",{class:!0});var d=s(y);E=n(d,"A",{href:!0,class:!0});var u=s(E);I=o(u,_),u.forEach(i),d.forEach(i),c.forEach(i),S=h(t),t.forEach(i),this.h()},h(){var t,r,a,n;$.src!==(p=null==(r=null==(t=e[22])?void 0:t.featuredImage)?void 0:r.node.sourceUrl)&&c($,"src",p),c($,"alt",""),c(g,"href",w=`/immigration-law-blog/${null==(a=e[22])?void 0:a.slug}`),c(v,"class","img-wrap"),c(E,"href",x=`/immigration-law-blog/${null==(n=e[22])?void 0:n.slug}`),c(E,"class","svelte-9bgt3a"),c(y,"class","svelte-9bgt3a"),c(k,"class","bg-grey svelte-9bgt3a"),c(l,"class","related-post-wrap svelte-9bgt3a")},m(e,t){d(e,l,t),u(l,v),u(v,g),u(g,$),u(l,b),u(l,k),u(k,y),u(y,E),u(E,I),u(l,S)},p(e,t){var l,r,a,n,s;32&t[0]&&$.src!==(p=null==(r=null==(l=e[22])?void 0:l.featuredImage)?void 0:r.node.sourceUrl)&&c($,"src",p),32&t[0]&&w!==(w=`/immigration-law-blog/${null==(a=e[22])?void 0:a.slug}`)&&c(g,"href",w),32&t[0]&&_!==(_=(null==(n=e[22])?void 0:n.title)+"")&&f(I,_),32&t[0]&&x!==(x=`/immigration-law-blog/${null==(s=e[22])?void 0:s.slug}`)&&c(E,"href",x)},d(e){e&&i(l)}}}function ve(e){var t,l,v,g,$,E,S,q,D,j,V,B,F,T,P,W,A,C;let L,N,Y,O,R,G,K,X,J,Q,Z,ee,te,le,re,ae,ne,se,oe,de,fe,ve,ge,me,he,$e,pe,we,be,ke,ye,Ee,Ie,xe,Se,_e,qe,De,je=(null==(t=e[19])?void 0:t.title)+"",Ve=(null==(l=e[19])?void 0:l.content)+"",Be=(null==(v=e[19])?void 0:v.title)+"";L=new H({props:{author:null==(E=null==($=null==(g=e[19])?void 0:g.author)?void 0:$.node)?void 0:E.name,pubdate:null==(S=e[19])?void 0:S.date}}),Y=new M({props:{id:"blog-post-hero",image_url:null==(j=null==(D=null==(q=e[19])?void 0:q.featuredImage)?void 0:D.node)?void 0:j.sourceUrl,img_srcset:null==(F=null==(B=null==(V=e[19])?void 0:V.featuredImage)?void 0:B.node)?void 0:F.srcSet,avif_srcset:"",webp_srcset:"",title:"Harlan York and Associates",parallax:"false"}}),R=new U({props:{id:"call-out-text",blockstyle:"block-style01",extraclasses:"floating-calltoaction",title:null==(T=e[19])?void 0:T.title,$$slots:{default:[ie]},$$scope:{ctx:e}}}),ge=new z({props:{id:"featured-video",blockstyle:"",video_source:"//player.vimeo.com/video/108146056",video_jpg:"/img/video_featured.jpg",video_webp:"/img/video_featured.webp",video_avif:"/img/video_featured.avif"}});let He=(null==(W=null==(P=e[19])?void 0:P.Services)?void 0:W.serviceFaq)&&ce(e),Fe=(null==(C=null==(A=e[19])?void 0:A.Services)?void 0:C.relatedPosts)&&ue(e);return{c(){y(L.$$.fragment),N=m(),y(Y.$$.fragment),O=m(),y(R.$$.fragment),G=m(),K=r("div"),X=r("div"),J=r("div"),Q=r("div"),Z=r("a"),ee=a("Home"),te=a("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=r("a"),re=a("Services"),ae=a("\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),ne=r("a"),se=a(je),de=m(),fe=r("div"),ve=m(),y(ge.$$.fragment),me=m(),He&&He.c(),he=m(),Fe&&Fe.c(),$e=m(),pe=r("div"),we=r("h2"),be=a("We are here to answer all your questions about "),ke=a(Be),ye=m(),Ee=r("p"),Ie=a("You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),xe=m(),Se=r("p"),_e=r("strong"),qe=a("US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),this.h()},l(e){I(L.$$.fragment,e),N=h(e),I(Y.$$.fragment,e),O=h(e),I(R.$$.fragment,e),G=h(e),K=n(e,"DIV",{class:!0});var t=s(K);X=n(t,"DIV",{class:!0});var l=s(X);J=n(l,"DIV",{class:!0});var r=s(J);Q=n(r,"DIV",{class:!0});var a=s(Q);Z=n(a,"A",{href:!0,class:!0});var c=s(Z);ee=o(c,"Home"),c.forEach(i),te=o(a,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),le=n(a,"A",{href:!0,class:!0});var d=s(le);re=o(d,"Services"),d.forEach(i),ae=o(a,"\n\t\t\t\t\t\t›\n\t\t\t\t\t\t"),ne=n(a,"A",{href:!0,class:!0});var u=s(ne);se=o(u,je),u.forEach(i),a.forEach(i),r.forEach(i),de=h(l),fe=n(l,"DIV",{class:!0}),s(fe).forEach(i),l.forEach(i),t.forEach(i),ve=h(e),I(ge.$$.fragment,e),me=h(e),He&&He.l(e),he=h(e),Fe&&Fe.l(e),$e=h(e),pe=n(e,"DIV",{class:!0});var f=s(pe);we=n(f,"H2",{class:!0});var v=s(we);be=o(v,"We are here to answer all your questions about "),ke=o(v,Be),v.forEach(i),ye=h(f),Ee=n(f,"P",{});var g=s(Ee);Ie=o(g,"You don't have to try to find the answers to your questions ononline. \n\t\t\t\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law."),g.forEach(i),xe=h(f),Se=n(f,"P",{});var m=s(Se);_e=n(m,"STRONG",{});var $=s(_e);qe=o($,"US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices"),$.forEach(i),m.forEach(i),f.forEach(i),this.h()},h(){var t;c(Z,"href","/"),c(Z,"class","svelte-9bgt3a"),c(le,"href","/immigration-law-services"),c(le,"class","svelte-9bgt3a"),c(ne,"href",oe=`/immigration-law-services/${null==(t=e[19])?void 0:t.slug}`),c(ne,"class","svelte-9bgt3a"),c(Q,"class","breadcrumbs svelte-9bgt3a"),c(J,"class","blog-topbar svelte-9bgt3a"),c(fe,"class","blog-content"),c(X,"class","content-inner"),c(K,"class","content"),c(we,"class","svelte-9bgt3a"),c(pe,"class","service-info svelte-9bgt3a")},m(e,t){x(L,e,t),d(e,N,t),x(Y,e,t),d(e,O,t),x(R,e,t),d(e,G,t),d(e,K,t),u(K,X),u(X,J),u(J,Q),u(Q,Z),u(Z,ee),u(Q,te),u(Q,le),u(le,re),u(Q,ae),u(Q,ne),u(ne,se),u(X,de),u(X,fe),fe.innerHTML=Ve,d(e,ve,t),x(ge,e,t),d(e,me,t),He&&He.m(e,t),d(e,he,t),Fe&&Fe.m(e,t),d(e,$e,t),d(e,pe,t),u(pe,we),u(we,be),u(we,ke),u(pe,ye),u(pe,Ee),u(Ee,Ie),u(pe,xe),u(pe,Se),u(Se,_e),u(_e,qe),De=!0},p(e,t){var l,r,a,n,s,o,i,d,u,v,g,m,h,$,y,E,I,x,S;const _={};32&t[0]&&(_.author=null==(a=null==(r=null==(l=e[19])?void 0:l.author)?void 0:r.node)?void 0:a.name),32&t[0]&&(_.pubdate=null==(n=e[19])?void 0:n.date),L.$set(_);const q={};32&t[0]&&(q.image_url=null==(i=null==(o=null==(s=e[19])?void 0:s.featuredImage)?void 0:o.node)?void 0:i.sourceUrl),32&t[0]&&(q.img_srcset=null==(v=null==(u=null==(d=e[19])?void 0:d.featuredImage)?void 0:u.node)?void 0:v.srcSet),Y.$set(q);const D={};32&t[0]&&(D.title=null==(g=e[19])?void 0:g.title),4&t[0]|1&t[1]&&(D.$$scope={dirty:t,ctx:e}),R.$set(D),(!De||32&t[0])&&je!==(je=(null==(m=e[19])?void 0:m.title)+"")&&f(se,je),(!De||32&t[0]&&oe!==(oe=`/immigration-law-services/${null==(h=e[19])?void 0:h.slug}`))&&c(ne,"href",oe),(!De||32&t[0])&&Ve!==(Ve=(null==($=e[19])?void 0:$.content)+"")&&(fe.innerHTML=Ve),(null==(E=null==(y=e[19])?void 0:y.Services)?void 0:E.serviceFaq)?He?(He.p(e,t),32&t[0]&&p(He,1)):(He=ce(e),He.c(),p(He,1),He.m(he.parentNode,he)):He&&(w(),b(He,1,1,(()=>{He=null})),k()),(null==(x=null==(I=e[19])?void 0:I.Services)?void 0:x.relatedPosts)?Fe?Fe.p(e,t):(Fe=ue(e),Fe.c(),Fe.m($e.parentNode,$e)):Fe&&(Fe.d(1),Fe=null),(!De||32&t[0])&&Be!==(Be=(null==(S=e[19])?void 0:S.title)+"")&&f(ke,Be)},i(e){De||(p(L.$$.fragment,e),p(Y.$$.fragment,e),p(R.$$.fragment,e),p(ge.$$.fragment,e),p(He),De=!0)},o(e){b(L.$$.fragment,e),b(Y.$$.fragment,e),b(R.$$.fragment,e),b(ge.$$.fragment,e),b(He),De=!1},d(e){_(L,e),e&&i(N),_(Y,e),e&&i(O),_(R,e),e&&i(G),e&&i(K),e&&i(ve),_(ge,e),e&&i(me),He&&He.d(e),e&&i(he),Fe&&Fe.d(e),e&&i($e),e&&i(pe)}}}function ge(e){let t,l,r,a,n,s,o,c,u,f,v,g,$,E=e[5],q=[];for(let i=0;i<E.length;i+=1)q[i]=ve(re(e,E,i));const D=e=>b(q[e],1,1,(()=>{q[e]=null}));return l=new K({props:{id:"testimonials",blockstyle:"block-style05"}}),a=new R({props:{id:"call-to-action",blockstyle:"block-style01",extraclasses:"regular-calltoaction"}}),s=new G({}),c=new N({props:{id:"featured",blockstyle:""}}),f=new Y({props:{id:"ratings",blockstyle:""}}),g=new X({props:{id:"socialmedia",blockstyle:""}}),{c(){for(let e=0;e<q.length;e+=1)q[e].c();t=m(),y(l.$$.fragment),r=m(),y(a.$$.fragment),n=m(),y(s.$$.fragment),o=m(),y(c.$$.fragment),u=m(),y(f.$$.fragment),v=m(),y(g.$$.fragment)},l(e){for(let t=0;t<q.length;t+=1)q[t].l(e);t=h(e),I(l.$$.fragment,e),r=h(e),I(a.$$.fragment,e),n=h(e),I(s.$$.fragment,e),o=h(e),I(c.$$.fragment,e),u=h(e),I(f.$$.fragment,e),v=h(e),I(g.$$.fragment,e)},m(e,i){for(let t=0;t<q.length;t+=1)q[t].m(e,i);d(e,t,i),x(l,e,i),d(e,r,i),x(a,e,i),d(e,n,i),x(s,e,i),d(e,o,i),x(c,e,i),d(e,u,i),x(f,e,i),d(e,v,i),x(g,e,i),$=!0},p(e,l){if(36&l[0]){let r;for(E=e[5],r=0;r<E.length;r+=1){const a=re(e,E,r);q[r]?(q[r].p(a,l),p(q[r],1)):(q[r]=ve(a),q[r].c(),p(q[r],1),q[r].m(t.parentNode,t))}for(w(),r=E.length;r<q.length;r+=1)D(r);k()}},i(e){if(!$){for(let e=0;e<E.length;e+=1)p(q[e]);p(l.$$.fragment,e),p(a.$$.fragment,e),p(s.$$.fragment,e),p(c.$$.fragment,e),p(f.$$.fragment,e),p(g.$$.fragment,e),$=!0}},o(e){q=q.filter(Boolean);for(let t=0;t<q.length;t+=1)b(q[t]);b(l.$$.fragment,e),b(a.$$.fragment,e),b(s.$$.fragment,e),b(c.$$.fragment,e),b(f.$$.fragment,e),b(g.$$.fragment,e),$=!1},d(e){S(q,e),e&&i(t),_(l,e),e&&i(r),_(a,e),e&&i(n),_(s,e),e&&i(o),_(c,e),e&&i(u),_(f,e),e&&i(v),_(g,e)}}}function me(e){var t,l;let a,s,o,f,v,g,$,w,k,q,D,j,V=e[6],B=[];for(let r=0;r<V.length;r+=1)B[r]=oe(se(e,V,r));return o=new W({props:{lang:"en"}}),v=new A({props:{title:e[1],description:e[2],keywords:null==(l=null==(t=e[0])?void 0:t.site)?void 0:l.keywords}}),$=new C({props:{title:e[1],description:e[2],image:e[3]}}),k=new L({props:{title:e[1],description:e[2],image:e[3]}}),D=new T({props:{id:"blog-post",$$slots:{default:[ge]},$$scope:{ctx:e}}}),{c(){for(let e=0;e<B.length;e+=1)B[e].c();a=r("link"),s=m(),y(o.$$.fragment),f=m(),y(v.$$.fragment),g=m(),y($.$$.fragment),w=m(),y(k.$$.fragment),q=m(),y(D.$$.fragment),this.h()},l(e){const t=E('[data-svelte="svelte-109dn47"]',document.head);for(let l=0;l<B.length;l+=1)B[l].l(t);a=n(t,"LINK",{rel:!0,href:!0}),t.forEach(i),s=h(e),I(o.$$.fragment,e),f=h(e),I(v.$$.fragment,e),g=h(e),I($.$$.fragment,e),w=h(e),I(k.$$.fragment,e),q=h(e),I(D.$$.fragment,e),this.h()},h(){c(a,"rel","stylesheet"),c(a,"href",e[4])},m(e,t){for(let l=0;l<B.length;l+=1)B[l].m(document.head,null);u(document.head,a),d(e,s,t),x(o,e,t),d(e,f,t),x(v,e,t),d(e,g,t),x($,e,t),d(e,w,t),x(k,e,t),d(e,q,t),x(D,e,t),j=!0},p(e,t){var l,r;if(65&t[0]){let l;for(V=e[6],l=0;l<V.length;l+=1){const r=se(e,V,l);B[l]?B[l].p(r,t):(B[l]=oe(r),B[l].c(),B[l].m(a.parentNode,a))}for(;l<B.length;l+=1)B[l].d(1);B.length=V.length}(!j||16&t[0])&&c(a,"href",e[4]);const n={};2&t[0]&&(n.title=e[1]),4&t[0]&&(n.description=e[2]),1&t[0]&&(n.keywords=null==(r=null==(l=e[0])?void 0:l.site)?void 0:r.keywords),v.$set(n);const s={};2&t[0]&&(s.title=e[1]),4&t[0]&&(s.description=e[2]),8&t[0]&&(s.image=e[3]),$.$set(s);const o={};2&t[0]&&(o.title=e[1]),4&t[0]&&(o.description=e[2]),8&t[0]&&(o.image=e[3]),k.$set(o);const i={};36&t[0]|1&t[1]&&(i.$$scope={dirty:t,ctx:e}),D.$set(i)},i(e){j||(p(o.$$.fragment,e),p(v.$$.fragment,e),p($.$$.fragment,e),p(k.$$.fragment,e),p(D.$$.fragment,e),j=!0)},o(e){b(o.$$.fragment,e),b(v.$$.fragment,e),b($.$$.fragment,e),b(k.$$.fragment,e),b(D.$$.fragment,e),j=!1},d(e){S(B,e),i(a),e&&i(s),_(o,e),e&&i(f),_(v,e),e&&i(g),_($,e),e&&i(w),_(k,e),e&&i(q),_(D,e)}}}function he(e,t,l,r,a,n,s){try{var o=e[n](s),i=o.value}catch(c){return void l(c)}o.done?t(i):Promise.resolve(i).then(r,a)}function $e(e){return function(){var t=this,l=arguments;return new Promise((function(r,a){var n=e.apply(t,l);function s(e){he(n,r,a,s,o,"next",e)}function o(e){he(n,r,a,s,o,"throw",e)}s(void 0)}))}}function pe(e,t,l){let r,a;var n,s,o,i,c,d;q(e,P,(e=>l(0,r=e))),q(e,F,(e=>l(17,a=e)));var u="Immigration Services - "+(null==(n=r)||null==(s=n.site)?void 0:s.title),f=null==(o=r)||null==(i=o.site)?void 0:i.description,v=null==(c=r)||null==(d=c.site)?void 0:d.facebook_photo,{slug:g=a.params.slug}=t,m="",h=()=>{},$=[],p=[];return D($e((function*(){var e,t;l(7,g=window.location.href.substring(window.location.href.lastIndexOf("/")+1));var a={id:g},n=null==(e=r)||null==(t=e.data)?void 0:t.gql(O,r.data.sources.wordpress,a,!1,0);h=yield null==n?void 0:n.subscribe(function(){var e=$e((function*(e){var t,r,a,n,s,o,i,c,d,g=yield e;new Date(null==g||null==(t=g.service)?void 0:t.date),null==g||null==(r=g.service)||null==(a=r.enqueuedStylesheets)||a.nodes,l(6,p=(null==g||null==(n=g.service)||null==(s=n.enqueuedScripts)?void 0:s.nodes)||[]),l(5,$=[null==g?void 0:g.service]),l(1,u=null==g||null==(o=g.service)?void 0:o.title),l(2,f=null==g||null==(i=g.service.Services)?void 0:i.excerpt),l(3,v=null==g||null==(c=g.featuredImage)||null==(d=c.node)?void 0:d.sourceUrl)}));return function(t){return e.apply(this,arguments)}}())}))),j((()=>{h()})),e.$$set=e=>{"slug"in e&&l(7,g=e.slug)},e.$$.update=()=>{1&e.$$.dirty[0]&&l(4,m="/themes/"+r.config.theme+"/style.css")},[r,u,f,v,m,$,p,g]}export default class extends e{constructor(e){super(),t(this,e,pe,me,l,{slug:7},[-1,-1])}}
