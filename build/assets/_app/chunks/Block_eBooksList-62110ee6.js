import{S as l,i as e,s,e as t,t as o,c as n,f as i,m as a,d as c,a as r,k as u,b as d,F as v,h,j as p,Q as m,R as f,n as k,x as g,y as b,z as w,p as y,r as _,A as I,B,C as E,D as T,L as U,g as $,v as q,M as D}from"./index-eebdc0b4.js";import{m as P}from"./milk-e4e45209.js";import"./Layout_Main-75a53143.js";import{f as L,g as j}from"./Block_Ratings-6eff8be5.js";function x(l){let e,s,h=l[1].input_1+"";return{c(){e=t("p"),s=o(h),this.h()},l(l){e=n(l,"P",{class:!0});var t=i(e);s=a(t,h),t.forEach(c),this.h()},h(){r(e,"class","svelte-w6q27d")},m(l,t){u(l,e,t),d(e,s)},p(l,e){2&e&&h!==(h=l[1].input_1+"")&&v(s,h)},d(l){l&&c(e)}}}function N(l){let e,s,h=l[1].input_2+"";return{c(){e=t("p"),s=o(h),this.h()},l(l){e=n(l,"P",{class:!0});var t=i(e);s=a(t,h),t.forEach(c),this.h()},h(){r(e,"class","svelte-w6q27d")},m(l,t){u(l,e,t),d(e,s)},p(l,e){2&e&&h!==(h=l[1].input_2+"")&&v(s,h)},d(l){l&&c(e)}}}function V(l){let e,s,h=l[1].input_3+"";return{c(){e=t("p"),s=o(h),this.h()},l(l){e=n(l,"P",{class:!0});var t=i(e);s=a(t,h),t.forEach(c),this.h()},h(){r(e,"class","svelte-w6q27d")},m(l,t){u(l,e,t),d(e,s)},p(l,e){2&e&&h!==(h=l[1].input_3+"")&&v(s,h)},d(l){l&&c(e)}}}function S(l){let e,s;return{c(){e=t("p"),s=o(l[2]),this.h()},l(t){e=n(t,"P",{class:!0});var o=i(e);s=a(o,l[2]),o.forEach(c),this.h()},h(){r(e,"class","response-msg svelte-w6q27d")},m(l,t){u(l,e,t),d(e,s)},p(l,e){4&e&&v(s,l[2])},d(l){l&&c(e)}}}function M(l){let e,s,v,g,b,w,y,_,I,B,E,T,U,$,q,D,P,L,j,M,O=l[1].input_1&&x(l),R=l[1].input_2&&N(l),C=l[1].input_3&&V(l),F=l[2]&&S(l);return{c(){e=t("div"),s=t("form"),v=t("input"),g=h(),O&&O.c(),b=h(),w=t("input"),y=h(),_=t("input"),I=h(),R&&R.c(),B=h(),E=t("input"),T=h(),C&&C.c(),U=h(),$=t("input"),q=h(),D=t("button"),P=o("Submit"),L=h(),F&&F.c(),this.h()},l(l){e=n(l,"DIV",{class:!0});var t=i(e);s=n(t,"FORM",{method:!0,class:!0});var o=i(s);v=n(o,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0}),g=p(o),O&&O.l(o),b=p(o),w=n(o,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0}),y=p(o),_=n(o,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0}),I=p(o),R&&R.l(o),B=p(o),E=n(o,"INPUT",{type:!0,name:!0,placeholder:!0,class:!0}),T=p(o),C&&C.l(o),U=p(o),$=n(o,"INPUT",{type:!0,name:!0,value:!0,class:!0}),q=p(o),D=n(o,"BUTTON",{type:!0,class:!0});var r=i(D);P=a(r,"Submit"),r.forEach(c),L=p(o),F&&F.l(o),o.forEach(c),t.forEach(c),this.h()},h(){r(v,"type","text"),r(v,"name","input_1_3"),r(v,"placeholder","First Name"),r(v,"class","svelte-w6q27d"),r(w,"type","text"),r(w,"name","input_1_6"),r(w,"placeholder","Last Name"),r(w,"class","svelte-w6q27d"),r(_,"type","email"),r(_,"name","input_2"),r(_,"placeholder","Email"),r(_,"class","svelte-w6q27d"),r(E,"type","tel"),r(E,"name","input_3"),r(E,"placeholder","000-000-0000"),r(E,"class","svelte-w6q27d"),r($,"type","hidden"),r($,"name","input_4"),$.value=l[0],r($,"class","svelte-w6q27d"),r(D,"type","submit"),r(D,"class","svelte-w6q27d"),r(s,"method","post"),r(s,"class","svelte-w6q27d"),r(e,"class","modal svelte-w6q27d")},m(t,o){u(t,e,o),d(e,s),d(s,v),d(s,g),O&&O.m(s,null),d(s,b),d(s,w),d(s,y),d(s,_),d(s,I),R&&R.m(s,null),d(s,B),d(s,E),d(s,T),C&&C.m(s,null),d(s,U),d(s,$),d(s,q),d(s,D),d(D,P),d(s,L),F&&F.m(s,null),j||(M=m(s,"submit",f(l[3])),j=!0)},p(l,[e]){l[1].input_1?O?O.p(l,e):(O=x(l),O.c(),O.m(s,b)):O&&(O.d(1),O=null),l[1].input_2?R?R.p(l,e):(R=N(l),R.c(),R.m(s,B)):R&&(R.d(1),R=null),l[1].input_3?C?C.p(l,e):(C=V(l),C.c(),C.m(s,U)):C&&(C.d(1),C=null),1&e&&($.value=l[0]),l[2]?F?F.p(l,e):(F=S(l),F.c(),F.m(s,null)):F&&(F.d(1),F=null)},i:k,o:k,d(l){l&&c(e),O&&O.d(),R&&R.d(),C&&C.d(),F&&F.d(),j=!1,M()}}}function O(l,e,s){var{eBookTitle:t}=e,{downloadLink:o}=e,n={},i="";return l.$$set=l=>{"eBookTitle"in l&&s(0,t=l.eBookTitle),"downloadLink"in l&&s(4,o=l.downloadLink)},[t,n,i,function(){var l=this,e=l.method,t=new FormData(l);fetch("https://admin.immigrationlawnj.com/wp-json/gf/v2/forms/3/submissions",{method:e,body:t}).then((l=>l.json())).then((l=>(l=>{console.log(l);var e=l.is_valid,t=e?l.confirmation_message.replace(/(<([^>]+)>)/gi,""):"There was a problem with your submission.",o=e?{}:Object.fromEntries(Object.entries(l.validation_messages).map((l=>{var[e,s]=l;return["input_"+e,s]})));return s(1,n=o),s(2,i=t),{isSuccess:e,message:t,validationError:o}})(l))).then((e=>{e.isSuccess&&(window.location=o,l.reset())})).catch((l=>{console.log(l)}))},o]}class R extends l{constructor(l){super(),e(this,l,O,M,s,{eBookTitle:0,downloadLink:4})}}function C(l,e,s){const t=l.slice();return t[7]=e[s],t}function F(l){var e,s,m,f,k,B,E;let T,U,$,q,D,P,L,j,x,N,V,S,M,O,C,F,z,H,A,G,Q,J,K,W=(null==(e=l[7])?void 0:e.title)+"",X=(null==(m=null==(s=l[7])?void 0:s.eBook)?void 0:m.shortDescription)+"";return G=new R({props:{downloadLink:null==(B=null==(k=null==(f=l[7])?void 0:f.eBook)?void 0:k.pdf)?void 0:B.mediaItemUrl,eBookTitle:null==(E=l[7])?void 0:E.title}}),{c(){T=t("div"),U=t("div"),$=t("picture"),q=t("source"),P=h(),L=t("source"),x=h(),N=t("img"),M=h(),O=t("div"),C=t("h2"),F=o(W),z=h(),H=t("div"),A=h(),g(G.$$.fragment),Q=h(),this.h()},l(l){T=n(l,"DIV",{id:!0,class:!0});var e=i(T);U=n(e,"DIV",{class:!0});var s=i(U);$=n(s,"PICTURE",{});var t=i($);q=n(t,"SOURCE",{type:!0,srcset:!0}),P=p(t),L=n(t,"SOURCE",{type:!0,srcset:!0}),x=p(t),N=n(t,"IMG",{src:!0,alt:!0,loading:!0,width:!0,height:!0,class:!0}),t.forEach(c),s.forEach(c),M=p(e),O=n(e,"DIV",{class:!0});var o=i(O);C=n(o,"H2",{});var r=i(C);F=a(r,W),r.forEach(c),z=p(o),H=n(o,"DIV",{class:!0}),i(H).forEach(c),A=p(o),b(G.$$.fragment,o),o.forEach(c),Q=p(e),e.forEach(c),this.h()},h(){var e,s,t,o,n,i,a,c,u,d,v;r(q,"type","image/avif"),r(q,"srcset",D=null==(t=null==(s=null==(e=l[7])?void 0:e.eBook)?void 0:s.avifImage)?void 0:t.sourceUrl),r(L,"type","image/webp"),r(L,"srcset",j=null==(i=null==(n=null==(o=l[7])?void 0:o.eBook)?void 0:n.webpImage)?void 0:i.sourceUrl),N.src!==(V=null==(u=null==(c=null==(a=l[7])?void 0:a.eBook)?void 0:c.pngImage)?void 0:u.sourceUrl)&&r(N,"src",V),r(N,"alt",S=null==(d=l[7])?void 0:d.title),r(N,"loading","lazy"),r(N,"width","200"),r(N,"height","275"),r(N,"class","svelte-1btcfck"),r(U,"class","ebook-img svelte-1btcfck"),r(H,"class","ebook-description svelte-1btcfck"),r(O,"class","ebook-content"),r(T,"id",J=null==(v=l[7])?void 0:v.slug),r(T,"class","ebook block-style04 svelte-1btcfck")},m(l,e){u(l,T,e),d(T,U),d(U,$),d($,q),d($,P),d($,L),d($,x),d($,N),d(T,M),d(T,O),d(O,C),d(C,F),d(O,z),d(O,H),H.innerHTML=X,d(O,A),w(G,O,null),d(T,Q),K=!0},p(l,e){var s,t,o,n,i,a,c,u,d,h,p,m,f,k,g,b,w,y;(!K||4&e&&D!==(D=null==(o=null==(t=null==(s=l[7])?void 0:s.eBook)?void 0:t.avifImage)?void 0:o.sourceUrl))&&r(q,"srcset",D),(!K||4&e&&j!==(j=null==(a=null==(i=null==(n=l[7])?void 0:n.eBook)?void 0:i.webpImage)?void 0:a.sourceUrl))&&r(L,"srcset",j),(!K||4&e&&N.src!==(V=null==(d=null==(u=null==(c=l[7])?void 0:c.eBook)?void 0:u.pngImage)?void 0:d.sourceUrl))&&r(N,"src",V),(!K||4&e&&S!==(S=null==(h=l[7])?void 0:h.title))&&r(N,"alt",S),(!K||4&e)&&W!==(W=(null==(p=l[7])?void 0:p.title)+"")&&v(F,W),(!K||4&e)&&X!==(X=(null==(f=null==(m=l[7])?void 0:m.eBook)?void 0:f.shortDescription)+"")&&(H.innerHTML=X);const _={};4&e&&(_.downloadLink=null==(b=null==(g=null==(k=l[7])?void 0:k.eBook)?void 0:g.pdf)?void 0:b.mediaItemUrl),4&e&&(_.eBookTitle=null==(w=l[7])?void 0:w.title),G.$set(_),(!K||4&e&&J!==(J=null==(y=l[7])?void 0:y.slug))&&r(T,"id",J)},i(l){K||(y(G.$$.fragment,l),K=!0)},o(l){_(G.$$.fragment,l),K=!1},d(l){l&&c(T),I(G)}}}function z(l){let e,s,o,a,v,h=l[2],p=[];for(let t=0;t<h.length;t+=1)p[t]=F(C(l,h,t));const m=l=>_(p[l],1,1,(()=>{p[l]=null}));return{c(){e=t("div"),s=t("div"),o=t("div");for(let l=0;l<p.length;l+=1)p[l].c();this.h()},l(l){e=n(l,"DIV",{id:!0,class:!0});var t=i(e);s=n(t,"DIV",{class:!0});var a=i(s);o=n(a,"DIV",{class:!0});var r=i(o);for(let e=0;e<p.length;e+=1)p[e].l(r);r.forEach(c),a.forEach(c),t.forEach(c),this.h()},h(){r(o,"class","ebooks-list svelte-1btcfck"),r(s,"class","ebooks-inner svelte-1btcfck"),r(e,"id",l[0]),r(e,"class",a=B(l[1])+" svelte-1btcfck")},m(l,t){u(l,e,t),d(e,s),d(s,o);for(let e=0;e<p.length;e+=1)p[e].m(o,null);v=!0},p(l,[s]){if(4&s){let e;for(h=l[2],e=0;e<h.length;e+=1){const t=C(l,h,e);p[e]?(p[e].p(t,s),y(p[e],1)):(p[e]=F(t),p[e].c(),y(p[e],1),p[e].m(o,null))}for(E(),e=h.length;e<p.length;e+=1)m(e);T()}(!v||1&s)&&r(e,"id",l[0]),(!v||2&s&&a!==(a=B(l[1])+" svelte-1btcfck"))&&r(e,"class",a)},i(l){if(!v){for(let l=0;l<h.length;l+=1)y(p[l]);v=!0}},o(l){p=p.filter(Boolean);for(let e=0;e<p.length;e+=1)_(p[e]);v=!1},d(l){l&&c(e),U(p,l)}}}function H(l,e,s,t,o,n,i){try{var a=l[n](i),c=a.value}catch(r){return void s(r)}a.done?e(c):Promise.resolve(c).then(t,o)}function A(l){return function(){var e=this,s=arguments;return new Promise((function(t,o){var n=l.apply(e,s);function i(l){H(n,t,o,i,a,"next",l)}function a(l){H(n,t,o,i,a,"throw",l)}i(void 0)}))}}function G(l,e,s){let t;$(l,P,(l=>s(6,t=l)));var{id:o}=e,{blockstyle:n=""}=e,i="ebooks",a=L,c=()=>{};return q(A((function*(){var l,e,o=null==(l=t)||null==(e=l.data)?void 0:e.gql(j,t.data.sources.wordpress,{size:999});c=yield null==o?void 0:o.subscribe(function(){var l=A((function*(l){var e=yield l;s(2,a=e.eBooks.nodes)}));return function(e){return l.apply(this,arguments)}}())}))),D((()=>{c()})),l.$$set=l=>{"id"in l&&s(0,o=l.id),"blockstyle"in l&&s(3,n=l.blockstyle)},l.$$.update=()=>{8&l.$$.dirty&&s(1,i="ebooks "+n)},[o,i,a,n]}class Q extends l{constructor(l){super(),e(this,l,G,z,s,{id:0,blockstyle:3})}}export{Q as B};
