function e(){}function t(e,t){for(const o in t)e[o]=t[o];return e}function o(e){return e()}function n(){return Object.create(null)}function a(e){e.forEach(o)}function i(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(t,o,n){t.$$.on_destroy.push(function(t,...o){if(null==t)return e;const n=t.subscribe(...o);return n.unsubscribe?()=>n.unsubscribe():n}(o,n))}function l(e,t,o,n){if(e){const a=c(e,t,o,n);return e[0](a)}}function c(e,o,n,a){return e[1]&&a?t(n.ctx.slice(),e[1](a(o))):n.ctx}function m(e,t,o,n,a,i,s){const r=function(e,t,o,n){if(e[2]&&n){const a=e[2](n(o));if(void 0===t.dirty)return a;if("object"==typeof a){const e=[],o=Math.max(t.dirty.length,a.length);for(let n=0;n<o;n+=1)e[n]=t.dirty[n]|a[n];return e}return t.dirty|a}return t.dirty}(t,n,a,i);if(r){const a=c(t,o,n,s);e.p(a,r)}}function u(e){return null==e?"":e}function g(e,t,o=t){return e.set(o),t}function p(e,t){e.appendChild(t)}function d(e,t,o){e.insertBefore(t,o||null)}function h(e){e.parentNode.removeChild(e)}function f(e,t){for(let o=0;o<e.length;o+=1)e[o]&&e[o].d(t)}function _(e){return document.createElement(e)}function w(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function y(e){return document.createTextNode(e)}function b(){return y(" ")}function k(){return y("")}function v(e,t,o,n){return e.addEventListener(t,o,n),()=>e.removeEventListener(t,o,n)}function $(e){return function(t){return t.preventDefault(),e.call(this,t)}}function x(e,t,o){null==o?e.removeAttribute(t):e.getAttribute(t)!==o&&e.setAttribute(t,o)}function j(e){return Array.from(e.childNodes)}function S(e,t,o,n){for(let a=0;a<e.length;a+=1){const n=e[a];if(n.nodeName===t){let t=0;const i=[];for(;t<n.attributes.length;){const e=n.attributes[t++];o[e.name]||i.push(e.name)}for(let e=0;e<i.length;e++)n.removeAttribute(i[e]);return e.splice(a,1)[0]}}return n?w(t):_(t)}function A(e,t){for(let o=0;o<e.length;o+=1){const n=e[o];if(3===n.nodeType)return n.data=""+t,e.splice(o,1)[0]}return y(t)}function E(e){return A(e," ")}function D(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function N(e,t){e.value=null==t?"":t}function M(e,t,o,n){e.style.setProperty(t,o,n?"important":"")}function P(e,t){for(let o=0;o<e.options.length;o+=1){const n=e.options[o];if(n.__value===t)return void(n.selected=!0)}}function I(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}function H(e,t,o){e.classList[o?"add":"remove"](t)}function C(e,t=document.body){return Array.from(t.querySelectorAll(e))}class L{constructor(e=null){this.a=e,this.e=this.n=null}m(e,t,o=null){this.e||(this.e=_(t.nodeName),this.t=t,this.h(e)),this.i(o)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let t=0;t<this.n.length;t+=1)d(this.t,this.n[t],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(h)}}let z;function Y(e){z=e}function O(){if(!z)throw new Error("Function called outside component initialization");return z}function T(e){O().$$.on_mount.push(e)}function B(e){O().$$.after_update.push(e)}function J(e){O().$$.on_destroy.push(e)}function R(e,t){O().$$.context.set(e,t)}function W(e){return O().$$.context.get(e)}const q=[],U=[],F=[],G=[],K=Promise.resolve();let V=!1;function Q(e){F.push(e)}function X(e){G.push(e)}let Z=!1;const ee=new Set;function te(){if(!Z){Z=!0;do{for(let e=0;e<q.length;e+=1){const t=q[e];Y(t),oe(t.$$)}for(Y(null),q.length=0;U.length;)U.pop()();for(let e=0;e<F.length;e+=1){const t=F[e];ee.has(t)||(ee.add(t),t())}F.length=0}while(q.length);for(;G.length;)G.pop()();V=!1,Z=!1,ee.clear()}}function oe(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(Q)}}const ne=new Set;let ae;function ie(){ae={r:0,c:[],p:ae}}function se(){ae.r||a(ae.c),ae=ae.p}function re(e,t){e&&e.i&&(ne.delete(e),e.i(t))}function le(e,t,o,n){if(e&&e.o){if(ne.has(e))return;ne.add(e),ae.c.push((()=>{ne.delete(e),n&&(o&&e.d(1),n())})),e.o(t)}}function ce(e,t){const o={},n={},a={$$scope:1};let i=e.length;for(;i--;){const s=e[i],r=t[i];if(r){for(const e in s)e in r||(n[e]=1);for(const e in r)a[e]||(o[e]=r[e],a[e]=1);e[i]=r}else for(const e in s)a[e]=1}for(const s in n)s in o||(o[s]=void 0);return o}function me(e){return"object"==typeof e&&null!==e?e:{}}function ue(e,t,o){const n=e.$$.props[t];void 0!==n&&(e.$$.bound[n]=o,o(e.$$.ctx[n]))}function ge(e){e&&e.c()}function pe(e,t){e&&e.l(t)}function de(e,t,n,s){const{fragment:r,on_mount:l,on_destroy:c,after_update:m}=e.$$;r&&r.m(t,n),s||Q((()=>{const t=l.map(o).filter(i);c?c.push(...t):a(t),e.$$.on_mount=[]})),m.forEach(Q)}function he(e,t){const o=e.$$;null!==o.fragment&&(a(o.on_destroy),o.fragment&&o.fragment.d(t),o.on_destroy=o.fragment=null,o.ctx=[])}function fe(e,t){-1===e.$$.dirty[0]&&(q.push(e),V||(V=!0,K.then(te)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function _e(t,o,i,s,r,l,c=[-1]){const m=z;Y(t);const u=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:r,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(m?m.$$.context:[]),callbacks:n(),dirty:c,skip_bound:!1};let g=!1;if(u.ctx=i?i(t,o.props||{},((e,o,...n)=>{const a=n.length?n[0]:o;return u.ctx&&r(u.ctx[e],u.ctx[e]=a)&&(!u.skip_bound&&u.bound[e]&&u.bound[e](a),g&&fe(t,e)),o})):[],u.update(),g=!0,a(u.before_update),u.fragment=!!s&&s(u.ctx),o.target){if(o.hydrate){const e=j(o.target);u.fragment&&u.fragment.l(e),e.forEach(h)}else u.fragment&&u.fragment.c();o.intro&&re(t.$$.fragment),de(t,o.target,o.anchor,o.customElement),te()}Y(m)}class we{$destroy(){he(this,1),this.$destroy=e}$on(e,t){const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(t),()=>{const e=o.indexOf(t);-1!==e&&o.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ye=[];function be(t,o=e){let n;const a=[];function i(e){if(s(t,e)&&(t=e,n)){const e=!ye.length;for(let o=0;o<a.length;o+=1){const e=a[o];e[1](),ye.push(e,t)}if(e){for(let e=0;e<ye.length;e+=2)ye[e][0](ye[e+1]);ye.length=0}}}return{set:i,update:function(e){i(e(t))},subscribe:function(s,r=e){const l=[s,r];return a.push(l),1===a.length&&(n=o(i)||e),s(t),()=>{const e=a.indexOf(l);-1!==e&&a.splice(e,1),0===a.length&&(n(),n=null)}}}}function ke(e){return new Promise(((t,o)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>o(e.error)}))}let ve;function $e(){return ve||(ve=function(e,t){const o=indexedDB.open(e);o.onupgradeneeded=()=>o.result.createObjectStore(t);const n=ke(o);return(e,o)=>n.then((n=>o(n.transaction(t,e).objectStore(t))))}("keyval-store","keyval")),ve}function xe(e,t=$e()){return t("readonly",(t=>ke(t.get(e))))}function je(e,t,o=$e()){return o("readwrite",(o=>(o.put(t,e),ke(o.transaction))))}const Se=JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:true,%22watch_mouse%22:true,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22186%22,%22logo_height%22:%2226%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D")),{config:Ae}=Se,Ee=new Map,De=(e="")=>{let t=0;for(let o=0;o<e.length;o++)t=(t<<5)-t+e.charCodeAt(o),t|=0;return Math.abs(t)},Ne={name:"Milk.js",title:"Milk.js - It does a website good.",tagline:"Best Developer Experience ❤ Best Finished Results",excerpt:"Svelte-Kit + Vite + SSR + SWR + PWA + CS-CSS + PostCSS + Rollup + JSON-LD + Markdown + SVX + Microformats & Microdata + Serverless + Web Components + GraphQL + REST + Accessibility + Animations + SEO + So much more, all packed in a gooey JAMStack you can host anywhere with Zero Dependency Deploys.  We handle it all so you can focus on creating amazing things, we look forward to seeing what you make. Have some Milk.",details:"Have some Milk to go with that.  Milk sits lightly on top of the shoulders of GIANTS like: Svelte-kit, Vite. Rollup, PostCSS, GraphQL, WorkBox, Wordpress, and many more.  Providing the quickest, cleantest, fastest, way to launch perfect headless websites.  We worry about all the tricky stuff so that you can just make amazing things.  We can't wait to see them.",url:"https://milkjs.com",email:"info@milkjs.com",keywords:"Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components, CS-CSS, by DevLove (https://devlove.us) & RandomUser (https://random-user.com)",logo_mini:"/milk/img/logo_milk.svg",logo:"/milk/img/logo_milkjs.svg",logo_width:"200",logo_height:"200",social:"/milk/img/socialmedia_1200x630.jpg",svelte_logo:"/milk/img/logo_svelte.svg",svelte_title:"Svelte",svelte_url:"https://svelte.dev/",graphql_logo:"/milk/img/logo_graphql.svg",graphql_title:"GraphQL",graphql_url:"https://graphql.org/",vite_logo:"/milk/img/logo_vite.svg",vite_title:"Vite",vite_url:"https://vitejs.dev/",rollup_logo:"/milk/img/logo_rollup.svg",rollup_title:"Rollup",rollup_url:"https://postcss.org/",postcss_logo:"/milk/img/logo_postcss.svg",postcss_title:"PostCSS",postcss_url:"https://postcss.org/",markdown_logo:"/milk/img/logo_markdown.svg",markdown_title:"Markdown",markdown_url:"https://daringfireball.net/projects/markdown/syntax",hello:"Hello Milk!"};Object.freeze(Ne);const Me={name:"HYA - Harlan York and Associates",slug:"hya",version:"0.0.11",date:"2021-06-15",url:"https://milkjs.com/themes/hya",author:"Joshua Jarman (Nelson Design Collective)",tagline:"Harlan York and Associates",excerpt:"Custom theme for Harlan York and Associates.",theme_by:"Nelson Design Collective",theme_by_url:"https://nelsondesigncollective.com",theme_by_email:"support@nelsondesigncollective.com",darkmode:!0,prismjs:!0};if(void 0===Pe)var Pe={};const Ie=function(){(null==Pe?void 0:Pe.debugging)&&console.log.apply(this,arguments)},He=JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:true,%22watch_mouse%22:true,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22186%22,%22logo_height%22:%2226%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D")),{config:Ce,site:Le,pwa:ze,sources:Ye}=He;Ce.lock_config&&(Object.freeze(Ce),Object.freeze(Le),Object.freeze(ze),Object.freeze(Ye)),(null==Ce?void 0:Ce.debug)&&((e=!0)=>{Pe.debugging=e,Pe.debug=Ie})(null==Ce?void 0:Ce.debug),Ie("%c🥛MILK: Pouring you a glass of Milk.js v0.0.08...","font-weight: bold;");const Oe=be({version:"0.0.08",date:"2021-04-19",cwd:"/var/www/milk-theme.local",hello:null==Ce?void 0:Ce.hello,credits:Ne,config:Ce,theme:Me,site:Le,pwa:ze,data:Object.freeze({sources:Ye,get:(e,t=Ae.cache_swr,o=Ae.cache,n=Ae.expires)=>{const a=be(new Promise((()=>{})));return(async()=>{let o=!1,n=De(e);if(Ae.cache_swr&&t&&Ee.has(n)&&a.set(Promise.resolve(Ee.get(n))),Ae.cache){const e=await xe(n);if(e&&e.data&&e.timestamp){parseInt(((new Date).getTime()-new Date(e.timestamp).getTime())/1e3)<Ae.expires?(o=!0,console.log("good cache"),a.set(Promise.resolve(e))):o=!1}else o=!1}if(!Ae.cache||!o){console.log("invalid cache");const t=await fetch(e),o=await t.json();Ae.cache_swr&&Ee.set(n,o),Ae.cache&&je(n,{timestamp:new Date,data:o}),a.set(Promise.resolve(o))}})(),a},post:(e,t={})=>(console.log(e),console.log(t),e),rest:(e,t="GET")=>(console.log(e),e),gql:(e,t,o={},n=Ae.cache_swr,a=Ae.cache,i=Ae.expires)=>{const s=be(new Promise((()=>{})));return(async()=>{let r=!1,l=De(`${e}${o}`);if(n&&n&&Ee.has(l)&&s.set(Promise.resolve(Ee.get(l))),a){const e=await xe(l);if(e&&e.data&&e.timestamp){parseInt(((new Date).getTime()-new Date(e.timestamp).getTime())/1e3)<i?(r=!0,console.log("good cache"),s.set(Promise.resolve(e.data))):r=!1}else r=!1}if(!a||!r){console.log("invalid cache");const i=await fetch(t,{method:"POST",referrerPolicy:"no-referrer",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:o})}),r=await i.json();console.log(r),n&&Ee.set(l,r.data),a&&je(l,{timestamp:new Date,data:r.data}),s.set(Promise.resolve(r.data))}})(),s}})}),Te=be({online:!1,darkmode:!1});Ie("%c    🥛 Milk.js     ","font-size: 8rem;background: linear-gradient(320deg, #3A0D2E 0%, #60154C 50%, #B32A51 100%); text-shadow: 0.5rem 0.5rem 0.25rem rgba(0,0,0,0.4); line-height: 30rem; vertical-align: top; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';"),Ie("%c🥛MILK: %cPoured Milk.js v0.0.08, Enjoy!.","font-weight: bold;","font-weight: normal;"),Ie(`%c🪅MILKTHEME: %c${null==Me?void 0:Me.name} / ${null==Me?void 0:Me.slug} v${null==Me?void 0:Me.version}.`,"font-weight: bold;","font-weight: normal;");export{I as $,pe as A,de as B,he as C,u as D,ie as E,se as F,t as G,D as H,ce as I,me as J,R as K,B as L,be as M,w as N,f as O,J as P,v as Q,a as R,we as S,U as T,H as U,$ as V,M as W,i as X,N as Y,Q as Z,P as _,x as a,ue as a0,X as a1,W as a2,L as a3,p as b,S as c,h as d,_ as e,j as f,r as g,b as h,_e as i,E as j,d as k,k as l,Oe as m,e as n,A as o,l as p,C as q,re as r,s,y as t,m as u,le as v,Te as w,T as x,g as y,ge as z};
