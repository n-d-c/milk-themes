import{S as e,i as s,s as i,e as l,c as a,f as t,d as o,a as r,k as c,b as d,L as n,n as v,V as u,v as h,W as f,h as p,j as w}from"./index-b6a42182.js";function m(e){let s,i,h,f,m,g,y,_,b,k,j,E;return{c(){s=l("picture"),i=l("source"),h=p(),f=l("source"),m=p(),g=l("img"),_=p(),b=l("img"),this.h()},l(e){s=a(e,"PICTURE",{class:!0});var l=t(s);i=a(l,"SOURCE",{type:!0,srcset:!0}),h=w(l),f=a(l,"SOURCE",{type:!0,srcset:!0}),m=w(l),g=a(l,"IMG",{alt:!0,loading:!0,src:!0,width:!0,height:!0,class:!0}),l.forEach(o),_=w(e),b=a(e,"IMG",{src:!0,rel:!0,"data-dev":!0,alt:!0,loading:!0,width:!0,height:!0,class:!0}),this.h()},h(){r(i,"type","image/avif"),r(i,"srcset","/img/video_featured.avif"),r(f,"type","image/webp"),r(f,"srcset","/img/video_featured.webp"),r(g,"alt","video"),r(g,"loading","lazy"),g.src!==(y="/img/video_featured.jpg")&&r(g,"src","/img/video_featured.jpg"),r(g,"width","300"),r(g,"height","150"),r(g,"class","svelte-1ayy7kw"),r(s,"class","svelte-1ayy7kw"),b.src!==(k=`/milk/img/onload_then_do_video.gif?cache=${e[3]}`)&&r(b,"src",k),r(b,"rel","nocache"),r(b,"data-dev","uncachable proximity loader"),r(b,"alt","loader"),r(b,"loading","lazy"),r(b,"width","1"),r(b,"height","1"),r(b,"class","svelte-1ayy7kw")},m(l,a){c(l,s,a),d(s,i),d(s,h),d(s,f),d(s,m),d(s,g),c(l,_,a),c(l,b,a),j||(E=[n(g,"load",e[9]),n(b,"load",e[10])],j=!0)},p:v,d(e){e&&o(s),e&&o(_),e&&o(b),j=!1,u(E)}}}function g(e){let s,i;return{c(){s=l("iframe"),this.h()},l(e){s=a(e,"IFRAME",{src:!0,title:!0,frameborder:!0,webkitallowfullscreen:!0,mozallowfullscreen:!0,allowfullscreen:!0,allow:!0,class:!0}),t(s).forEach(o),this.h()},h(){s.src!==(i=e[0])&&r(s,"src",i),r(s,"title","Video"),r(s,"frameborder","0"),r(s,"webkitallowfullscreen",""),r(s,"mozallowfullscreen",""),s.allowFullscreen=!0,r(s,"allow","accelerometer; autoplay; clipboard-write; encrypted-media;"),r(s,"class","the-video svelte-1ayy7kw")},m(e,i){c(e,s,i)},p(e,l){1&l&&s.src!==(i=e[0])&&r(s,"src",i)},d(e){e&&o(s)}}}function y(e){let s,i,h,f;function p(e,s){return e[2]?g:m}let w=p(e),y=w(e);return{c(){s=l("div"),i=l("div"),y.c(),this.h()},l(e){s=a(e,"DIV",{class:!0});var l=t(s);i=a(l,"DIV",{class:!0});var r=t(i);y.l(r),r.forEach(o),l.forEach(o),this.h()},h(){r(i,"class","video-inner svelte-1ayy7kw"),r(s,"class","video svelte-1ayy7kw")},m(l,a){c(l,s,a),d(s,i),y.m(i,null),e[11](s),h||(f=[n(s,"mouseover",e[12]),n(s,"click",e[13])],h=!0)},p(e,[s]){w===(w=p(e))&&y?y.p(e,s):(y.d(1),y=w(e),y&&(y.c(),y.m(i,null)))},i:v,o:v,d(i){i&&o(s),y.d(),e[11](null),h=!1,u(f)}}}function _(e,s,i){var l,a,{id:t}=s,{blockstyle:o=""}=s,r=!1,c=null==(l=new Date)?void 0:l.getTime(),{video_source:d=""}=s,{video_jpg:n=""}=s,{video_webp:v=""}=s,{video_avif:u=""}=s;h((()=>{var e;null==(e=new IntersectionObserver((function(e){var s;!0===(null==e||null==(s=e[0])?void 0:s.isIntersecting)&&i(2,r=!0)}),{threshold:[0]}))||e.observe(a)}));return e.$$set=e=>{"id"in e&&i(4,t=e.id),"blockstyle"in e&&i(5,o=e.blockstyle),"video_source"in e&&i(0,d=e.video_source),"video_jpg"in e&&i(6,n=e.video_jpg),"video_webp"in e&&i(7,v=e.video_webp),"video_avif"in e&&i(8,u=e.video_avif)},e.$$.update=()=>{e.$$.dirty},[d,a,r,c,t,o,n,v,u,()=>{i(2,r=!0)},()=>{i(2,r=!0)},function(e){f[e?"unshift":"push"]((()=>{i(1,a=e)}))},()=>{i(2,r=!0)},()=>{i(2,r=!0)}]}class b extends e{constructor(e){super(),s(this,e,_,y,i,{id:4,blockstyle:5,video_source:0,video_jpg:6,video_webp:7,video_avif:8})}}export{b as F};
