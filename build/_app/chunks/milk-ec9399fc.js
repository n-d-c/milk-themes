function e(){}function t(e,t){for(const o in t)e[o]=t[o];return e}function o(e){return e()}function n(){return Object.create(null)}function i(e){e.forEach(o)}function s(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(t,o,n){t.$$.on_destroy.push(function(t,...o){if(null==t)return e;const n=t.subscribe(...o);return n.unsubscribe?()=>n.unsubscribe():n}(o,n))}function l(e,t,o,n){if(e){const i=c(e,t,o,n);return e[0](i)}}function c(e,o,n,i){return e[1]&&i?t(n.ctx.slice(),e[1](i(o))):n.ctx}function u(e,t,o,n,i,s,r){const a=function(e,t,o,n){if(e[2]&&n){const i=e[2](n(o));if(void 0===t.dirty)return i;if("object"==typeof i){const e=[],o=Math.max(t.dirty.length,i.length);for(let n=0;n<o;n+=1)e[n]=t.dirty[n]|i[n];return e}return t.dirty|i}return t.dirty}(t,n,i,s);if(a){const i=c(t,o,n,r);e.p(i,a)}}function f(e){return null==e?"":e}function g(e,t,o=t){return e.set(o),t}function m(e,t){e.appendChild(t)}function d(e,t,o){e.insertBefore(t,o||null)}function p(e){e.parentNode.removeChild(e)}function h(e,t){for(let o=0;o<e.length;o+=1)e[o]&&e[o].d(t)}function _(e){return document.createElement(e)}function b(e){return document.createTextNode(e)}function k(){return b(" ")}function w(){return b("")}function v(e,t,o,n){return e.addEventListener(t,o,n),()=>e.removeEventListener(t,o,n)}function y(e,t,o){null==o?e.removeAttribute(t):e.getAttribute(t)!==o&&e.setAttribute(t,o)}function S(e){return Array.from(e.childNodes)}function $(e,t,o,n){for(let i=0;i<e.length;i+=1){const n=e[i];if(n.nodeName===t){let t=0;const s=[];for(;t<n.attributes.length;){const e=n.attributes[t++];o[e.name]||s.push(e.name)}for(let e=0;e<s.length;e++)n.removeAttribute(s[e]);return e.splice(i,1)[0]}}return n?function(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}(t):_(t)}function j(e,t){for(let o=0;o<e.length;o+=1){const n=e[o];if(3===n.nodeType)return n.data=""+t,e.splice(o,1)[0]}return b(t)}function x(e){return j(e," ")}function M(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function E(e,t,o,n){e.style.setProperty(t,o,n?"important":"")}function D(e,t,o){e.classList[o?"add":"remove"](t)}function P(e,t=document.body){return Array.from(t.querySelectorAll(e))}let A;function C(e){A=e}function L(){if(!A)throw new Error("Function called outside component initialization");return A}function O(e){L().$$.on_mount.push(e)}function R(e){L().$$.after_update.push(e)}function z(e,t){L().$$.context.set(e,t)}const T=[],q=[],B=[],I=[],N=Promise.resolve();let W=!1;function G(e){B.push(e)}let J=!1;const U=new Set;function K(){if(!J){J=!0;do{for(let e=0;e<T.length;e+=1){const t=T[e];C(t),H(t.$$)}for(C(null),T.length=0;q.length;)q.pop()();for(let e=0;e<B.length;e+=1){const t=B[e];U.has(t)||(U.add(t),t())}B.length=0}while(T.length);for(;I.length;)I.pop()();W=!1,J=!1,U.clear()}}function H(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(G)}}const Q=new Set;let V;function F(){V={r:0,c:[],p:V}}function X(){V.r||i(V.c),V=V.p}function Z(e,t){e&&e.i&&(Q.delete(e),e.i(t))}function Y(e,t,o,n){if(e&&e.o){if(Q.has(e))return;Q.add(e),V.c.push((()=>{Q.delete(e),n&&(o&&e.d(1),n())})),e.o(t)}}function ee(e,t){const o={},n={},i={$$scope:1};let s=e.length;for(;s--;){const r=e[s],a=t[s];if(a){for(const e in r)e in a||(n[e]=1);for(const e in a)i[e]||(o[e]=a[e],i[e]=1);e[s]=a}else for(const e in r)i[e]=1}for(const r in n)r in o||(o[r]=void 0);return o}function te(e){return"object"==typeof e&&null!==e?e:{}}function oe(e){e&&e.c()}function ne(e,t){e&&e.l(t)}function ie(e,t,n,r){const{fragment:a,on_mount:l,on_destroy:c,after_update:u}=e.$$;a&&a.m(t,n),r||G((()=>{const t=l.map(o).filter(s);c?c.push(...t):i(t),e.$$.on_mount=[]})),u.forEach(G)}function se(e,t){const o=e.$$;null!==o.fragment&&(i(o.on_destroy),o.fragment&&o.fragment.d(t),o.on_destroy=o.fragment=null,o.ctx=[])}function re(e,t){-1===e.$$.dirty[0]&&(T.push(e),W||(W=!0,N.then(K)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ae(t,o,s,r,a,l,c=[-1]){const u=A;C(t);const f=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:c,skip_bound:!1};let g=!1;if(f.ctx=s?s(t,o.props||{},((e,o,...n)=>{const i=n.length?n[0]:o;return f.ctx&&a(f.ctx[e],f.ctx[e]=i)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](i),g&&re(t,e)),o})):[],f.update(),g=!0,i(f.before_update),f.fragment=!!r&&r(f.ctx),o.target){if(o.hydrate){const e=S(o.target);f.fragment&&f.fragment.l(e),e.forEach(p)}else f.fragment&&f.fragment.c();o.intro&&Z(t.$$.fragment),ie(t,o.target,o.anchor,o.customElement),K()}C(u)}class le{$destroy(){se(this,1),this.$destroy=e}$on(e,t){const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(t),()=>{const e=o.indexOf(t);-1!==e&&o.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ce=[];function ue(t,o=e){let n;const i=[];function s(e){if(r(t,e)&&(t=e,n)){const e=!ce.length;for(let o=0;o<i.length;o+=1){const e=i[o];e[1](),ce.push(e,t)}if(e){for(let e=0;e<ce.length;e+=2)ce[e][0](ce[e+1]);ce.length=0}}}return{set:s,update:function(e){s(e(t))},subscribe:function(r,a=e){const l=[r,a];return i.push(l),1===i.length&&(n=o(s)||e),r(t),()=>{const e=i.indexOf(l);-1!==e&&i.splice(e,1),0===i.length&&(n(),n=null)}}}}const fe=new Map,ge=(e="")=>{let t=0;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0;return Math.abs(t)},me={name:"Milk.js",title:"Milk.js - It does a website good.",tagline:"Best Developer Experience ❤ Best Finished Results",excerpt:"Svelte-Kit + Vite + SSR + SWR + PWA + CS-CSS + PostCSS + Rollup + JSON-LD + Markdown + SVX + Microformats & Microdata + Serverless + Web Components + GraphQL + REST + Accessibility + Animations + SEO + So much more, all packed in a gooey JAMStack you can host anywhere with Zero Dependency Deploys.  We handle it all so you can focus on creating amazing things, we look forward to seeing what you make. Have some Milk.",details:"Have some Milk to go with that.  Milk sits lightly on top of the shoulders of GIANTS like: Svelte-kit, Vite. Rollup, PostCSS, GraphQL, WorkBox, Wordpress, and many more.  Providing the quickest, cleantest, fastest, way to launch perfect headless websites.  We worry about all the tricky stuff so that you can just make amazing things.  We can't wait to see them.",url:"https://milkjs.com",email:"info@milkjs.com",keywords:"Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components, CS-CSS, by DevLove (https://devlove.us) & RandomUser (https://random-user.com)",logo_mini:"/milk/img/logo_milk.svg",logo:"/milk/img/logo_milkjs.svg",logo_width:"200",logo_height:"200",social:"/milk/img/socialmedia_1200x630.jpg",svelte_logo:"/milk/img/logo_svelte.svg",svelte_title:"Svelte",svelte_url:"https://svelte.dev/",graphql_logo:"/milk/img/logo_graphql.svg",graphql_title:"GraphQL",graphql_url:"https://graphql.org/",vite_logo:"/milk/img/logo_vite.svg",Vite_title:"Vite",vite_url:"https://vitejs.dev/",rollup_logo:"/milk/img/logo_rollup.svg",rollup_title:"Rollup",rollup_url:"https://postcss.org/",postcss_logo:"/milk/img/logo_postcss.svg",postcss_title:"PostCSS",postcss_url:"https://postcss.org/",markdown_logo:"/milk/img/logo_markdown.svg",markdown_title:"Markdown",markdown_url:"https://daringfireball.net/projects/markdown/syntax",hello:"Hello Milk!"};Object.freeze(me);const de={name:"Blank",slug:"blank",version:"0.0.02",date:"2021-05-12",url:"https://milkjs.com/themes/blank",author:"Random-User (DevLove)",tagline:"Example theme for Milk.js.",excerpt:"Please feel free to take this theme and copy it to start your own if you desire.",darkmode:!0,prismjs:!0};if(void 0===pe)var pe={};const he=function(){(null==pe?void 0:pe.debugging)&&console.log.apply(this,arguments)},_e=JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22blank%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22user%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:true,%22watch_mouse%22:true,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22milkjs.com%22,%22url%22:%22https://milkjs.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/milk/img/logo_milk.svg%22,%22logo_width%22:%2260%22,%22logo_height%22:%2260%22,%22title%22:%22Milk%22,%22tagline%22:%22Milk,%20it%20does%20a%20website%20good.%22,%22organization%22:%22Milk.js%22,%22first_name%22:%22Milk%22,%22last_name%22:%22JS%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@milkjs.com%22,%22phone%22:%22%22,%22fax%22:%22%22,%22address%22:%22%22,%22address2%22:%22%22,%22city%22:%22%22,%22state%22:%22%22,%22state_abbr%22:%22%22,%22zip%22:%22%22,%22country%22:%22%22,%22country_abbr%22:%22%22,%22hours_of_operation%22:%22%22,%22hours_of_operation_dt%22:%22%22,%22price_range%22:%22$%22,%22category%22:%22%22,%22description%22:%22%22,%22keywords%22:%22%22,%22established%22:%22%22,%22latitude%22:%22%22,%22longitude%22:%22%22,%22google_maps%22:%22%22,%22google_maps_embed%22:%22%22,%22google_maps_image%22:%22%22,%22google_maps_image_webp%22:%22%22,%22google_maps_image_avif%22:%22%22,%22google_business%22:%22%22,%22facebook%22:%22%22,%22facebook_photo%22:%22https://milkjs.com/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22%22,%22twitter_photo%22:%22https://milkjs.com/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22%22,%22youtube%22:%22%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22%22,%22calendar%22:%22%22%7D,%22pwa%22:%7B%22app_color%22:%22#3A0D2E%22,%22app_background%22:%22#3A0D2E%22,%22app_name%22:%22DevLove%20-%20Milk%22%7D,%22sources%22:%7B%7D%7D")),{config:be,site:ke,pwa:we,sources:ve}=_e;be.lock_config&&(Object.freeze(be),Object.freeze(ke),Object.freeze(we),Object.freeze(ve)),(null==be?void 0:be.debug)&&((e=!0)=>{pe.debugging=e,pe.debug=he})(null==be?void 0:be.debug),he("%c🥛MILK: Pouring you a glass of Milk.js v0.0.08...","font-weight: bold;");const ye=ue({version:"0.0.08",date:"2021-04-19",cwd:"/var/www/devlove-milk",hello:null==be?void 0:be.hello,credits:me,config:be,theme:de,site:ke,pwa:we,data:Object.freeze({sources:ve,get:(e,t=config.cache_swr,o=config.cache,n=config.expires)=>{const i=writable(new Promise((()=>{})));return(async()=>{let o=!1,n=ge(e);if(config.cache_swr&&t&&fe.has(n)&&i.set(Promise.resolve(fe.get(n))),config.cache){const e=await idbGet(n);if(e&&e.data&&e.timestamp){parseInt(((new Date).getTime()-new Date(e.timestamp).getTime())/1e3)<config.expires?(o=!0,console.log("good cache"),i.set(Promise.resolve(e))):o=!1}else o=!1}if(!config.cache||!o){console.log("invalid cache");const t=await fetch(e),o=await t.json();config.cache_swr&&fe.set(n,o),config.cache&&idbSet(n,{timestamp:new Date,data:o}),i.set(Promise.resolve(o))}})(),i},post:(e,t={})=>(console.log(e),console.log(t),e),rest:(e,t="GET")=>(console.log(e),e),gql:(e,t=config.cache_swr,o=config.cache,n=config.expires)=>{const i=writable(new Promise((()=>{})));return(async()=>{let o=!1,n=ge(e);if(config.cache_swr&&t&&fe.has(n)&&i.set(Promise.resolve(fe.get(n))),config.cache){const e=await idbGet(n);if(e&&e.data&&e.timestamp){parseInt(((new Date).getTime()-new Date(e.timestamp).getTime())/1e3)<config.expires?(o=!0,console.log("good cache"),i.set(Promise.resolve(e.data))):o=!1}else o=!1}if(!config.cache||!o){console.log("invalid cache");const t=await fetch(config.graphql,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e})}),o=await t.json();config.cache_swr&&fe.set(n,o.data),config.cache&&idbSet(n,{timestamp:new Date,data:o.data}),i.set(Promise.resolve(o.data))}})(),i}})}),Se=ue({online:!1,darkmode:!1});he("%c    🥛 Milk.js     ","font-size: 8rem;background: linear-gradient(320deg, #3A0D2E 0%, #60154C 50%, #B32A51 100%); text-shadow: 0.5rem 0.5rem 0.25rem rgba(0,0,0,0.4); line-height: 30rem; vertical-align: top; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';"),he("%c🥛MILK: %cPoured Milk.js v0.0.08, Enjoy!.","font-weight: bold;","font-weight: normal;"),he(`%c🪅MILKTHEME: %c${null==de?void 0:de.name} / ${null==de?void 0:de.slug} v${null==de?void 0:de.version}.`,"font-weight: bold;","font-weight: normal;");export{R as A,O as B,F as C,X as D,P as E,a as F,ye as G,l as H,u as I,Se as J,g as K,f as L,ue as M,E as N,D as O,v as P,s as Q,h as R,le as S,S as a,j as b,$ as c,p as d,_ as e,d as f,m as g,M as h,ae as i,k as j,w as k,x as l,t as m,e as n,y as o,oe as p,ne as q,ie as r,r as s,b as t,ee as u,te as v,Z as w,Y as x,se as y,z};
