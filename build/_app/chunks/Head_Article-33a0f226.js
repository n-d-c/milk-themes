import{$ as t,S as e,i as s,s as a,B as n,e as r,q as o,c,d as i,a as u,b as p,F as d,y as l,z as b,g as h,m}from"./Head_Extra-cbd962d9.js";const g={subscribe:e=>(()=>{const e=t("__svelte__");return{page:{subscribe:e.page.subscribe},navigating:{subscribe:e.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:e.navigating.subscribe}},session:e.session}})().page.subscribe(e)};function $(t){let e,s,a,h,m;const g=t[8].default,$=n(g,t,t[7],null);return{c(){e=r("meta"),s=r("meta"),a=r("meta"),h=r("meta"),$&&$.c(),this.h()},l(t){const n=o('[data-svelte="svelte-1pvvrac"]',document.head);e=c(n,"META",{property:!0,content:!0}),s=c(n,"META",{property:!0,content:!0}),a=c(n,"META",{property:!0,content:!0}),h=c(n,"META",{name:!0,type:!0,content:!0}),$&&$.l(n),n.forEach(i),this.h()},h(){u(e,"property","og:type"),u(e,"content","article"),u(s,"property","article:author"),u(s,"content",t[0]),u(a,"property","article:published_time"),u(a,"content",t[1]),u(h,"name","author"),u(h,"type","article"),u(h,"content",t[0])},m(t,n){p(document.head,e),p(document.head,s),p(document.head,a),p(document.head,h),$&&$.m(document.head,null),m=!0},p(t,[e]){(!m||1&e)&&u(s,"content",t[0]),(!m||2&e)&&u(a,"content",t[1]),(!m||1&e)&&u(h,"content",t[0]),$&&$.p&&128&e&&d($,g,t,t[7],e,null,null)},i(t){m||(l($,t),m=!0)},o(t){b($,t),m=!1},d(t){i(e),i(s),i(a),i(h),$&&$.d(t)}}}function v(t,e,s){let a;h(t,m,(t=>s(6,a=t)));let{$$slots:n={},$$scope:r}=e;var o,c,i,u,{author:p}=e,{pubdate:d}=e;return t.$$set=t=>{"author"in t&&s(0,p=t.author),"pubdate"in t&&s(1,d=t.pubdate),"$$scope"in t&&s(7,r=t.$$scope)},t.$$.update=()=>{2&t.$$.dirty&&s(1,d=d&&""!=d?new Date(d).toISOString():(new Date).toISOString()),125&t.$$.dirty&&(p||s(0,p=(null==s(2,o=a)||null==s(3,c=o.site)?void 0:c.first_name)+" "+(null==s(4,i=a)||null==s(5,u=i.site)?void 0:u.last_name)))},[p,d,o,c,i,u,a,r,n]}class y extends e{constructor(t){super(),s(this,t,v,$,a,{author:0,pubdate:1})}}export{y as H,g as p};
