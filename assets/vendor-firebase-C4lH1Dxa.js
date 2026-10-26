const t_=()=>{};var Ic={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=function(n,e){if(!n)throw Un(e)},Un=function(n){return new Error("Firebase Database ("+ph.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},n_=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],a=n[t++],l=n[t++],u=((i&7)<<18|(r&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(u>>10)),e[s++]=String.fromCharCode(56320+(u&1023))}else{const r=n[t++],a=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|a&63)}}return e.join("")},ca={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],a=i+1<n.length,l=a?n[i+1]:0,u=i+2<n.length,h=u?n[i+2]:0,f=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,C=h&63;u||(C=64,a||(m=64)),s.push(t[f],t[p],t[m],t[C])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(_h(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):n_(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||p==null)throw new s_;const m=r<<2|l>>4;if(s.push(m),h!==64){const C=l<<4&240|h>>2;if(s.push(C),p!==64){const R=h<<6&192|p;s.push(R)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class s_ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const mh=function(n){const e=_h(n);return ca.encodeByteArray(e,!0)},Bi=function(n){return mh(n).replace(/\./g,"")},Co=function(n){try{return ca.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(n){return gh(void 0,n)}function gh(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!r_(t)||(n[t]=gh(n[t],e[t]));return n}function r_(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function o_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a_=()=>o_().__FIREBASE_DEFAULTS__,l_=()=>{if(typeof process>"u"||typeof Ic>"u")return;const n=Ic.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},c_=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Co(n[1]);return e&&JSON.parse(e)},ua=()=>{try{return t_()||a_()||l_()||c_()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},u_=n=>{var e,t;return(t=(e=ua())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},yh=n=>{const e=u_(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},vh=()=>{var n;return(n=ua())===null||n===void 0?void 0:n.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qs(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Eh(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Th(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Bi(JSON.stringify(t)),Bi(JSON.stringify(a)),""].join(".")}const Ts={};function h_(){const n={prod:[],emulator:[]};for(const e of Object.keys(Ts))Ts[e]?n.emulator.push(e):n.prod.push(e);return n}function d_(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let wc=!1;function Ih(n,e){if(typeof window>"u"||typeof document>"u"||!Qs(window.location.host)||Ts[n]===e||Ts[n]||wc)return;Ts[n]=e;function t(m){return`__firebase__banner__${m}`}const s="__firebase__banner",r=h_().prod.length>0;function a(){const m=document.getElementById(s);m&&m.remove()}function l(m){m.style.display="flex",m.style.background="#7faaf0",m.style.position="fixed",m.style.bottom="5px",m.style.left="5px",m.style.padding=".5em",m.style.borderRadius="5px",m.style.alignItems="center"}function u(m,C){m.setAttribute("width","24"),m.setAttribute("id",C),m.setAttribute("height","24"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.style.marginLeft="-6px"}function h(){const m=document.createElement("span");return m.style.cursor="pointer",m.style.marginLeft="16px",m.style.fontSize="24px",m.innerHTML=" &times;",m.onclick=()=>{wc=!0,a()},m}function f(m,C){m.setAttribute("id",C),m.innerText="Learn more",m.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",m.setAttribute("target","__blank"),m.style.paddingLeft="5px",m.style.textDecoration="underline"}function p(){const m=d_(s),C=t("text"),R=document.getElementById(C)||document.createElement("span"),D=t("learnmore"),N=document.getElementById(D)||document.createElement("a"),j=t("preprendIcon"),q=document.getElementById(j)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(m.created){const G=m.element;l(G),f(N,D);const ce=h();u(q,j),G.append(q,R,N,ce),document.body.appendChild(G)}r?(R.innerText="Preview backend disconnected.",q.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(q.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,R.innerText="Preview backend running in this workspace."),R.setAttribute("id",C)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wh(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ch(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(wh())}function f_(){var n;const e=(n=ua())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function p_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function __(){return ph.NODE_ADMIN===!0}function m_(){return!f_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function g_(){try{return typeof indexedDB=="object"}catch{return!1}}function y_(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v_="FirebaseError";class Bn extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=v_,Object.setPrototypeOf(this,Bn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ah.prototype.create)}}class Ah{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],a=r?E_(r,s):"Error",l=`${this.serviceName}: ${a} (${i}).`;return new Bn(i,l,s)}}function E_(n,e){return n.replace(T_,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const T_=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ds(n){return JSON.parse(n)}function Ee(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sh=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Ds(Co(r[0])||""),t=Ds(Co(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},I_=function(n){const e=Sh(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},w_=function(n){const e=Sh(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Rn(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Ao(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function qi(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function ks(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],a=e[i];if(Cc(r)&&Cc(a)){if(!ks(r,a))return!1}else if(r!==a)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function Cc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C_(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A_{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)s[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)s[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const m=s[p-3]^s[p-8]^s[p-14]^s[p-16];s[p]=(m<<1|m>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],a=this.chain_[2],l=this.chain_[3],u=this.chain_[4],h,f;for(let p=0;p<80;p++){p<40?p<20?(h=l^r&(a^l),f=1518500249):(h=r^a^l,f=1859775393):p<60?(h=r&a|l&(r|a),f=2400959708):(h=r^a^l,f=3395469782);const m=(i<<5|i>>>27)+h+u+f+s[p]&4294967295;u=l,l=a,a=(r<<30|r>>>2)&4294967295,r=i,i=m}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+u&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let a=this.inbuf_;for(;i<t;){if(a===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[a]=e.charCodeAt(i),++a,++i,a===this.blockSize){this.compress_(r),a=0;break}}else for(;i<t;)if(r[a]=e[i],++a,++i,a===this.blockSize){this.compress_(r),a=0;break}}this.inbuf_=a,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function bn(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S_=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,k(s<n.length,"Surrogate pair missing trail surrogate.");const a=n.charCodeAt(s)-56320;i=65536+(r<<10)+a}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},pr=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(n){return n&&n._delegate?n._delegate:n}class Pn{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R_{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new ht;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(P_(e))try{this.getOrInitializeService({instanceIdentifier:zt})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=zt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=zt){return this.instances.has(e)}getOptions(e=zt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&a.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const a=this.instances.get(i);return a&&e(a,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:b_(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=zt){return this.component?this.component.multipleInstances?e:zt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function b_(n){return n===zt?void 0:n}function P_(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new R_(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Q||(Q={}));const D_={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},k_=Q.INFO,V_={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},x_=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=V_[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ha{constructor(e){this.name=e,this._logLevel=k_,this._logHandler=x_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?D_[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const O_=(n,e)=>e.some(t=>n instanceof t);let Ac,Sc;function M_(){return Ac||(Ac=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function L_(){return Sc||(Sc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Rh=new WeakMap,So=new WeakMap,bh=new WeakMap,lo=new WeakMap,da=new WeakMap;function F_(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",a)},r=()=>{t(At(n.result)),i()},a=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Rh.set(t,n)}).catch(()=>{}),da.set(e,n),e}function U_(n){if(So.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",a),n.removeEventListener("abort",a)},r=()=>{t(),i()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",a),n.addEventListener("abort",a)});So.set(n,e)}let Ro={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return So.get(n);if(e==="objectStoreNames")return n.objectStoreNames||bh.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return At(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function B_(n){Ro=n(Ro)}function q_(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(co(this),e,...t);return bh.set(s,e.sort?e.sort():[e]),At(s)}:L_().includes(n)?function(...e){return n.apply(co(this),e),At(Rh.get(this))}:function(...e){return At(n.apply(co(this),e))}}function j_(n){return typeof n=="function"?q_(n):(n instanceof IDBTransaction&&U_(n),O_(n,M_())?new Proxy(n,Ro):n)}function At(n){if(n instanceof IDBRequest)return F_(n);if(lo.has(n))return lo.get(n);const e=j_(n);return e!==n&&(lo.set(n,e),da.set(e,n)),e}const co=n=>da.get(n);function W_(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const a=indexedDB.open(n,e),l=At(a);return s&&a.addEventListener("upgradeneeded",u=>{s(At(a.result),u.oldVersion,u.newVersion,At(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),l.then(u=>{r&&u.addEventListener("close",()=>r()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const z_=["get","getKey","getAll","getAllKeys","count"],$_=["put","add","delete","clear"],uo=new Map;function Rc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(uo.get(e))return uo.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=$_.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||z_.includes(t)))return;const r=async function(a,...l){const u=this.transaction(a,i?"readwrite":"readonly");let h=u.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&u.done]))[0]};return uo.set(e,r),r}B_(n=>({...n,get:(e,t,s)=>Rc(e,t)||n.get(e,t,s),has:(e,t)=>!!Rc(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(G_(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function G_(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const bo="@firebase/app",bc="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t=new ha("@firebase/app"),K_="@firebase/app-compat",Q_="@firebase/analytics-compat",Y_="@firebase/analytics",X_="@firebase/app-check-compat",J_="@firebase/app-check",Z_="@firebase/auth",em="@firebase/auth-compat",tm="@firebase/database",nm="@firebase/data-connect",sm="@firebase/database-compat",im="@firebase/functions",rm="@firebase/functions-compat",om="@firebase/installations",am="@firebase/installations-compat",lm="@firebase/messaging",cm="@firebase/messaging-compat",um="@firebase/performance",hm="@firebase/performance-compat",dm="@firebase/remote-config",fm="@firebase/remote-config-compat",pm="@firebase/storage",_m="@firebase/storage-compat",mm="@firebase/firestore",gm="@firebase/ai",ym="@firebase/firestore-compat",vm="firebase",Em="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Po="[DEFAULT]",Tm={[bo]:"fire-core",[K_]:"fire-core-compat",[Y_]:"fire-analytics",[Q_]:"fire-analytics-compat",[J_]:"fire-app-check",[X_]:"fire-app-check-compat",[Z_]:"fire-auth",[em]:"fire-auth-compat",[tm]:"fire-rtdb",[nm]:"fire-data-connect",[sm]:"fire-rtdb-compat",[im]:"fire-fn",[rm]:"fire-fn-compat",[om]:"fire-iid",[am]:"fire-iid-compat",[lm]:"fire-fcm",[cm]:"fire-fcm-compat",[um]:"fire-perf",[hm]:"fire-perf-compat",[dm]:"fire-rc",[fm]:"fire-rc-compat",[pm]:"fire-gcs",[_m]:"fire-gcs-compat",[mm]:"fire-fst",[ym]:"fire-fst-compat",[gm]:"fire-vertex","fire-js":"fire-js",[vm]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xt=new Map,No=new Map,Do=new Map;function Pc(n,e){try{n.container.addComponent(e)}catch(t){_t.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Vs(n){const e=n.name;if(Do.has(e))return _t.debug(`There were multiple attempts to register component ${e}.`),!1;Do.set(e,n);for(const t of Xt.values())Pc(t,n);for(const t of No.values())Pc(t,n);return!0}function Ph(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Nh(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},St=new Ah("app","Firebase",Im);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Pn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw St.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh=Em;function Cm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Po,automaticDataCollectionEnabled:!0},e),i=s.name;if(typeof i!="string"||!i)throw St.create("bad-app-name",{appName:String(i)});if(t||(t=vh()),!t)throw St.create("no-options");const r=Xt.get(i);if(r){if(ks(t,r.options)&&ks(s,r.config))return r;throw St.create("duplicate-app",{appName:i})}const a=new N_(i);for(const u of Do.values())a.addComponent(u);const l=new wm(t,s,a);return Xt.set(i,l),l}function kh(n=Po){const e=Xt.get(n);if(!e&&n===Po&&vh())return Cm();if(!e)throw St.create("no-app",{appName:n});return e}function uw(){return Array.from(Xt.values())}async function hw(n){let e=!1;const t=n.name;Xt.has(t)?(e=!0,Xt.delete(t)):No.has(t)&&n.decRefCount()<=0&&(No.delete(t),e=!0),e&&(await Promise.all(n.container.getProviders().map(s=>s.delete())),n.isDeleted=!0)}function Rt(n,e,t){var s;let i=(s=Tm[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),a=e.match(/\s|\//);if(r||a){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_t.warn(l.join(" "));return}Vs(new Pn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Am="firebase-heartbeat-database",Sm=1,xs="firebase-heartbeat-store";let ho=null;function Vh(){return ho||(ho=W_(Am,Sm,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(xs)}catch(t){console.warn(t)}}}}).catch(n=>{throw St.create("idb-open",{originalErrorMessage:n.message})})),ho}async function Rm(n){try{const t=(await Vh()).transaction(xs),s=await t.objectStore(xs).get(xh(n));return await t.done,s}catch(e){if(e instanceof Bn)_t.warn(e.message);else{const t=St.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});_t.warn(t.message)}}}async function Nc(n,e){try{const s=(await Vh()).transaction(xs,"readwrite");await s.objectStore(xs).put(e,xh(n)),await s.done}catch(t){if(t instanceof Bn)_t.warn(t.message);else{const s=St.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});_t.warn(s.message)}}}function xh(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bm=1024,Pm=30;class Nm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new km(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Dc();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats.length>Pm){const a=Vm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){_t.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Dc(),{heartbeatsToSend:s,unsentEntries:i}=Dm(this._heartbeatsCache.heartbeats),r=Bi(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return _t.warn(t),""}}}function Dc(){return new Date().toISOString().substring(0,10)}function Dm(n,e=bm){const t=[];let s=n.slice();for(const i of n){const r=t.find(a=>a.agent===i.agent);if(r){if(r.dates.push(i.date),kc(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),kc(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class km{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return g_()?y_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Rm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Nc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Nc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function kc(n){return Bi(JSON.stringify({version:2,heartbeats:n})).length}function Vm(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xm(n){Vs(new Pn("platform-logger",e=>new H_(e),"PRIVATE")),Vs(new Pn("heartbeat",e=>new Nm(e),"PRIVATE")),Rt(bo,bc,n),Rt(bo,bc,"esm2017"),Rt("fire-js","")}xm("");var Om="firebase",Mm="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Rt(Om,Mm,"app");var Vc={};const xc="@firebase/database",Oc="1.0.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oh="";function Lm(n){Oh=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Ee(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ds(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return ot(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mh=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Fm(e)}}catch{}return new Um},Ht=Mh("localStorage"),Bm=Mh("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tn=new ha("@firebase/database"),qm=(function(){let n=1;return function(){return n++}})(),Lh=function(n){const e=S_(n),t=new A_;t.update(e);const s=t.digest();return ca.encodeByteArray(s)},Ys=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=Ys.apply(null,s):typeof s=="object"?e+=Ee(s):e+=s,e+=" "}return e};let Is=null,Mc=!0;const jm=function(n,e){k(!0,"Can't turn on custom loggers persistently."),Tn.logLevel=Q.VERBOSE,Is=Tn.log.bind(Tn)},Ae=function(...n){if(Mc===!0&&(Mc=!1,Is===null&&Bm.get("logging_enabled")===!0&&jm()),Is){const e=Ys.apply(null,n);Is(e)}},Xs=function(n){return function(...e){Ae(n,...e)}},ko=function(...n){const e="FIREBASE INTERNAL ERROR: "+Ys(...n);Tn.error(e)},mt=function(...n){const e=`FIREBASE FATAL ERROR: ${Ys(...n)}`;throw Tn.error(e),new Error(e)},Be=function(...n){const e="FIREBASE WARNING: "+Ys(...n);Tn.warn(e)},Wm=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&Be("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},_r=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},zm=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Nn="[MIN_NAME]",Jt="[MAX_NAME]",rn=function(n,e){if(n===e)return 0;if(n===Nn||e===Jt)return-1;if(e===Nn||n===Jt)return 1;{const t=Lc(n),s=Lc(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},$m=function(n,e){return n===e?0:n<e?-1:1},hs=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Ee(e))},fa=function(n){if(typeof n!="object"||n===null)return Ee(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=Ee(e[s]),t+=":",t+=fa(n[e[s]]);return t+="}",t},Fh=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function Oe(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Uh=function(n){k(!_r(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,a,l,u;n===0?(r=0,a=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,a=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,a=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(u=t;u;u-=1)h.push(a%2?1:0),a=Math.floor(a/2);for(u=e;u;u-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const f=h.join("");let p="";for(u=0;u<64;u+=8){let m=parseInt(f.substr(u,8),2).toString(16);m.length===1&&(m="0"+m),p=p+m}return p.toLowerCase()},Hm=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Gm=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Km(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const Qm=new RegExp("^-?(0*)\\d{1,10}$"),Ym=-2147483648,Xm=2147483647,Lc=function(n){if(Qm.test(n)){const e=Number(n);if(e>=Ym&&e<=Xm)return e}return null},qn=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw Be("Exception was thrown by user callback.",t),e},Math.floor(0))}},Jm=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},ws=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Nh(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){Be(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Ae("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Be(e)}}class ki{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}ki.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa="5",Bh="v",qh="s",jh="r",Wh="f",zh=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,$h="ls",Hh="p",Vo="ac",Gh="websocket",Kh="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qh{constructor(e,t,s,i,r=!1,a="",l=!1,u=!1,h=null){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=a,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=u,this.emulatorOptions=h,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Ht.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Ht.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function tg(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function Yh(n,e,t){k(typeof e=="string","typeof type must == string"),k(typeof t=="object","typeof params must == object");let s;if(e===Gh)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Kh)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);tg(n)&&(t.ns=n.namespace);const i=[];return Oe(t,(r,a)=>{i.push(r+"="+a)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(){this.counters_={}}incrementCounter(e,t=1){ot(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return i_(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fo={},po={};function _a(n){const e=n.toString();return fo[e]||(fo[e]=new ng),fo[e]}function sg(n,e){const t=n.toString();return po[t]||(po[t]=e()),po[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&qn(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc="start",rg="close",og="pLPCommand",ag="pRTLPCB",Xh="id",Jh="pw",Zh="ser",lg="cb",cg="seg",ug="ts",hg="d",dg="dframe",ed=1870,td=30,fg=ed-td,pg=25e3,_g=3e4;class En{constructor(e,t,s,i,r,a,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=a,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Xs(e),this.stats_=_a(t),this.urlFn=u=>(this.appCheckToken&&(u[Vo]=this.appCheckToken),Yh(t,Kh,u))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new ig(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(_g)),zm(()=>{if(this.isClosed_)return;this.scriptTagHolder=new ma((...r)=>{const[a,l,u,h,f]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,a===Fc)this.id=l,this.password=u;else if(a===rg)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+a)},(...r)=>{const[a,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(a,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[Fc]="t",s[Zh]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[lg]=this.scriptTagHolder.uniqueCallbackIdentifier),s[Bh]=pa,this.transportSessionId&&(s[qh]=this.transportSessionId),this.lastSessionId&&(s[$h]=this.lastSessionId),this.applicationId&&(s[Hh]=this.applicationId),this.appCheckToken&&(s[Vo]=this.appCheckToken),typeof location<"u"&&location.hostname&&zh.test(location.hostname)&&(s[jh]=Wh);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){En.forceAllow_=!0}static forceDisallow(){En.forceDisallow_=!0}static isAvailable(){return En.forceAllow_?!0:!En.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Hm()&&!Gm()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Ee(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=mh(t),i=Fh(s,fg);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[dg]="t",s[Xh]=e,s[Jh]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Ee(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class ma{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=qm(),window[og+this.uniqueCallbackIdentifier]=e,window[ag+this.uniqueCallbackIdentifier]=t,this.myIFrame=ma.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const a="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(a),this.myIFrame.doc.close()}catch(l){Ae("frame writing exception"),l.stack&&Ae(l.stack),Ae(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Ae("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Xh]=this.myID,e[Jh]=this.myPW,e[Zh]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+td+s.length<=ed;){const a=this.pendingSegs.shift();s=s+"&"+cg+i+"="+a.seg+"&"+ug+i+"="+a.ts+"&"+hg+i+"="+a.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(pg)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{Ae("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mg=16384,gg=45e3;let ji=null;typeof MozWebSocket<"u"?ji=MozWebSocket:typeof WebSocket<"u"&&(ji=WebSocket);class Ge{constructor(e,t,s,i,r,a,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Xs(this.connId),this.stats_=_a(t),this.connURL=Ge.connectionURL_(t,a,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const a={};return a[Bh]=pa,typeof location<"u"&&location.hostname&&zh.test(location.hostname)&&(a[jh]=Wh),t&&(a[qh]=t),s&&(a[$h]=s),i&&(a[Vo]=i),r&&(a[Hh]=r),Yh(e,Gh,a)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Ht.set("previous_websocket_failure",!0);try{let s;__(),this.mySock=new ji(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Ge.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&ji!==null&&!Ge.forceDisallow_}static previouslyFailed(){return Ht.isInMemoryStorage||Ht.get("previous_websocket_failure")===!0}markConnectionHealthy(){Ht.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Ds(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(k(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=Ee(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Fh(t,mg);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(gg))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Ge.responsesRequiredToBeHealthy=2;Ge.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{static get ALL_TRANSPORTS(){return[En,Ge]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Ge&&Ge.isAvailable();let s=t&&!Ge.previouslyFailed();if(e.webSocketOnly&&(t||Be("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[Ge];else{const i=this.transports_=[];for(const r of Os.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);Os.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Os.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yg=6e4,vg=5e3,Eg=10*1024,Tg=100*1024,_o="t",Uc="d",Ig="s",Bc="r",wg="e",qc="o",jc="a",Wc="n",zc="p",Cg="h";class Ag{constructor(e,t,s,i,r,a,l,u,h,f){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=a,this.onReady_=l,this.onDisconnect_=u,this.onKill_=h,this.lastSessionId=f,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Xs("c:"+this.id+":"),this.transportManager_=new Os(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=ws(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Tg?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Eg?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(_o in e){const t=e[_o];t===jc?this.upgradeIfSecondaryHealthy_():t===Bc?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===qc&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=hs("t",e),s=hs("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:zc,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:jc,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Wc,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=hs("t",e),s=hs("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=hs(_o,e);if(Uc in e){const s=e[Uc];if(t===Cg){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===Wc){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Ig?this.onConnectionShutdown_(s):t===Bc?this.onReset_(s):t===wg?ko("Server Error: "+s):t===qc?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):ko("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),pa!==s&&Be("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),ws(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(yg))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):ws(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(vg))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:zc,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Ht.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(e){this.allowedEvents_=e,this.listeners_={},k(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){k(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi extends sd{static getInstance(){return new Wi}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Ch()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return k(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c=32,Hc=768;class ee{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function J(){return new ee("")}function W(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function Nt(n){return n.pieces_.length-n.pieceNum_}function ne(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new ee(n.pieces_,e)}function ga(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Sg(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function Ms(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function id(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new ee(e,0)}function de(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof ee)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new ee(t,0)}function $(n){return n.pieceNum_>=n.pieces_.length}function Ue(n,e){const t=W(n),s=W(e);if(t===null)return e;if(t===s)return Ue(ne(n),ne(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function Rg(n,e){const t=Ms(n,0),s=Ms(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=rn(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function ya(n,e){if(Nt(n)!==Nt(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function $e(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(Nt(n)>Nt(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class bg{constructor(e,t){this.errorPrefix_=t,this.parts_=Ms(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=pr(this.parts_[s]);rd(this)}}function Pg(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=pr(e),rd(n)}function Ng(n){const e=n.parts_.pop();n.byteLength_-=pr(e),n.parts_.length>0&&(n.byteLength_-=1)}function rd(n){if(n.byteLength_>Hc)throw new Error(n.errorPrefix_+"has a key path longer than "+Hc+" bytes ("+n.byteLength_+").");if(n.parts_.length>$c)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+$c+") or object contains a cycle "+$t(n))}function $t(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va extends sd{static getInstance(){return new va}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}getInitialEvent(e){return k(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds=1e3,Dg=300*1e3,Gc=30*1e3,kg=1.3,Vg=3e4,xg="server_kill",Kc=3;class ft extends nd{constructor(e,t,s,i,r,a,l,u){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=a,this.appCheckTokenProvider_=l,this.authOverride_=u,this.id=ft.nextPersistentConnectionId_++,this.log_=Xs("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=ds,this.maxReconnectDelay_=Dg,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,u)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");va.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Wi.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(Ee(r)),k(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new ht,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:a=>{const l=a.d;a.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,a=e._path.toString();this.log_("Listen called for "+a+" "+r),this.listens.has(a)||this.listens.set(a,new Map),k(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),k(!this.listens.get(a).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(a).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},a="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(a,r,l=>{const u=l.d,h=l.s;ft.warnOnListenWarnings_(u,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,u))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&ot(e,"w")){const s=Rn(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();Be(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||w_(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Gc)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=I_(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,a=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,a))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),k(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},a="n";i&&(r.q=s,r.t=i),this.sendRequest(a,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,a=>{i&&setTimeout(()=>{i(a.s,a.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const a={p:t,d:s};r!==void 0&&(a.h=r),this.outstandingPuts_.push({action:e,request:a,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Ee(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):ko("Unrecognized action received from server: "+Ee(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){k(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=ds,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=ds,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Vg&&(this.reconnectDelay_=ds),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*kg)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+ft.nextConnectionId_++,r=this.lastSessionId;let a=!1,l=null;const u=function(){l?l.close():(a=!0,s())},h=function(p){k(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:u,sendRequest:h};const f=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,m]=await Promise.all([this.authTokenProvider_.getToken(f),this.appCheckTokenProvider_.getToken(f)]);a?Ae("getToken() completed but was canceled"):(Ae("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=m&&m.token,l=new Ag(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,C=>{Be(C+" ("+this.repoInfo_.toString()+")"),this.interrupt(xg)},r))}catch(p){this.log_("Failed to get token: "+p),a||(this.repoInfo_.nodeAdmin&&Be(p),u())}}}interrupt(e){Ae("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Ae("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Ao(this.interruptReasons_)&&(this.reconnectDelay_=ds,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>fa(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new ee(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){Ae("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Kc&&(this.reconnectDelay_=Gc,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Ae("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Kc&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Oh.replace(/\./g,"-")]=1,Ch()?e["framework.cordova"]=1:p_()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Wi.getInstance().currentlyOnline();return Ao(this.interruptReasons_)&&e}}ft.nextPersistentConnectionId_=0;ft.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new H(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new H(Nn,e),i=new H(Nn,t);return this.compare(s,i)!==0}minPost(){return H.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ai;class od extends mr{static get __EMPTY_NODE(){return Ai}static set __EMPTY_NODE(e){Ai=e}compare(e,t){return rn(e.name,t.name)}isDefinedOn(e){throw Un("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return H.MIN}maxPost(){return new H(Jt,Ai)}makePost(e,t){return k(typeof e=="string","KeyIndex indexValue must always be a string."),new H(e,Ai)}toString(){return".key"}}const In=new od;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Si=class{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let a=1;for(;!e.isEmpty();)if(e=e,a=t?s(e.key,t):1,i&&(a*=-1),a<0)this.isReverse_?e=e.left:e=e.right;else if(a===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},je=class _s{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??_s.RED,this.left=i??Ze.EMPTY_NODE,this.right=r??Ze.EMPTY_NODE}copy(e,t,s,i,r){return new _s(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return Ze.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return Ze.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,_s.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,_s.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};je.RED=!0;je.BLACK=!1;class Og{copy(e,t,s,i,r){return this}insert(e,t,s){return new je(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let Ze=class Vi{constructor(e,t=Vi.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new Vi(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,je.BLACK,null,null))}remove(e){return new Vi(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,je.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Si(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Si(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Si(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Si(this.root_,null,this.comparator_,!0,e)}};Ze.EMPTY_NODE=new Og;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mg(n,e){return rn(n.name,e.name)}function Ea(n,e){return rn(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xo;function Lg(n){xo=n}const ad=function(n){return typeof n=="number"?"number:"+Uh(n):"string:"+n},ld=function(n){if(n.isLeafNode()){const e=n.val();k(typeof e=="string"||typeof e=="number"||typeof e=="object"&&ot(e,".sv"),"Priority must be a string or number.")}else k(n===xo||n.isEmpty(),"priority of unexpected type.");k(n===xo||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qc;class ye{static set __childrenNodeConstructor(e){Qc=e}static get __childrenNodeConstructor(){return Qc}constructor(e,t=ye.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,k(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),ld(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new ye(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:ye.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return $(e)?this:W(e)===".priority"?this.priorityNode_:ye.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:ye.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=W(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(k(s!==".priority"||Nt(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,ye.__childrenNodeConstructor.EMPTY_NODE.updateChild(ne(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+ad(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Uh(this.value_):e+=this.value_,this.lazyHash_=Lh(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===ye.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof ye.__childrenNodeConstructor?-1:(k(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=ye.VALUE_TYPE_ORDER.indexOf(t),r=ye.VALUE_TYPE_ORDER.indexOf(s);return k(i>=0,"Unknown leaf type: "+t),k(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}ye.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cd,ud;function Fg(n){cd=n}function Ug(n){ud=n}class Bg extends mr{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?rn(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return H.MIN}maxPost(){return new H(Jt,new ye("[PRIORITY-POST]",ud))}makePost(e,t){const s=cd(e);return new H(t,new ye("[PRIORITY-POST]",s))}toString(){return".priority"}}const ae=new Bg;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg=Math.log(2);class jg{constructor(e){const t=r=>parseInt(Math.log(r)/qg,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const zi=function(n,e,t,s){n.sort(e);const i=function(u,h){const f=h-u;let p,m;if(f===0)return null;if(f===1)return p=n[u],m=t?t(p):p,new je(m,p.node,je.BLACK,null,null);{const C=parseInt(f/2,10)+u,R=i(u,C),D=i(C+1,h);return p=n[C],m=t?t(p):p,new je(m,p.node,je.BLACK,R,D)}},r=function(u){let h=null,f=null,p=n.length;const m=function(R,D){const N=p-R,j=p;p-=R;const q=i(N+1,j),G=n[N],ce=t?t(G):G;C(new je(ce,G.node,D,null,q))},C=function(R){h?(h.left=R,h=R):(f=R,h=R)};for(let R=0;R<u.count;++R){const D=u.nextBitIsOne(),N=Math.pow(2,u.count-(R+1));D?m(N,je.BLACK):(m(N,je.BLACK),m(N,je.RED))}return f},a=new jg(n.length),l=r(a);return new Ze(s||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mo;const _n={};class dt{static get Default(){return k(_n&&ae,"ChildrenNode.ts has not been loaded"),mo=mo||new dt({".priority":_n},{".priority":ae}),mo}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Rn(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof Ze?t:null}hasIndex(e){return ot(this.indexSet_,e.toString())}addIndex(e,t){k(e!==In,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(H.Wrap);let a=r.getNext();for(;a;)i=i||e.isDefinedOn(a.node),s.push(a),a=r.getNext();let l;i?l=zi(s,e.getCompare()):l=_n;const u=e.toString(),h=Object.assign({},this.indexSet_);h[u]=e;const f=Object.assign({},this.indexes_);return f[u]=l,new dt(f,h)}addToIndexes(e,t){const s=qi(this.indexes_,(i,r)=>{const a=Rn(this.indexSet_,r);if(k(a,"Missing index implementation for "+r),i===_n)if(a.isDefinedOn(e.node)){const l=[],u=t.getIterator(H.Wrap);let h=u.getNext();for(;h;)h.name!==e.name&&l.push(h),h=u.getNext();return l.push(e),zi(l,a.getCompare())}else return _n;else{const l=t.get(e.name);let u=i;return l&&(u=u.remove(new H(e.name,l))),u.insert(e,e.node)}});return new dt(s,this.indexSet_)}removeFromIndexes(e,t){const s=qi(this.indexes_,i=>{if(i===_n)return i;{const r=t.get(e.name);return r?i.remove(new H(e.name,r)):i}});return new dt(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fs;class F{static get EMPTY_NODE(){return fs||(fs=new F(new Ze(Ea),null,dt.Default))}constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&ld(this.priorityNode_),this.children_.isEmpty()&&k(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||fs}updatePriority(e){return this.children_.isEmpty()?this:new F(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?fs:t}}getChild(e){const t=W(e);return t===null?this:this.getImmediateChild(t).getChild(ne(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(k(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new H(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const a=i.isEmpty()?fs:this.priorityNode_;return new F(i,a,r)}}updateChild(e,t){const s=W(e);if(s===null)return t;{k(W(e)!==".priority"||Nt(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(ne(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(ae,(a,l)=>{t[a]=l.val(e),s++,r&&F.INTEGER_REGEXP_.test(a)?i=Math.max(i,Number(a)):r=!1}),!e&&r&&i<2*s){const a=[];for(const l in t)a[l]=t[l];return a}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+ad(this.getPriority().val())+":"),this.forEachChild(ae,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":Lh(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new H(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new H(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new H(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,H.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,H.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Js?-1:0}withIndex(e){if(e===In||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new F(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===In||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(ae),i=t.getIterator(ae);let r=s.getNext(),a=i.getNext();for(;r&&a;){if(r.name!==a.name||!r.node.equals(a.node))return!1;r=s.getNext(),a=i.getNext()}return r===null&&a===null}else return!1;else return!1}}resolveIndex_(e){return e===In?null:this.indexMap_.get(e.toString())}}F.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Wg extends F{constructor(){super(new Ze(Ea),F.EMPTY_NODE,dt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return F.EMPTY_NODE}isEmpty(){return!1}}const Js=new Wg;Object.defineProperties(H,{MIN:{value:new H(Nn,F.EMPTY_NODE)},MAX:{value:new H(Jt,Js)}});od.__EMPTY_NODE=F.EMPTY_NODE;ye.__childrenNodeConstructor=F;Lg(Js);Ug(Js);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zg=!0;function pe(n,e=null){if(n===null)return F.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),k(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new ye(t,pe(e))}if(!(n instanceof Array)&&zg){const t=[];let s=!1;if(Oe(n,(a,l)=>{if(a.substring(0,1)!=="."){const u=pe(l);u.isEmpty()||(s=s||!u.getPriority().isEmpty(),t.push(new H(a,u)))}}),t.length===0)return F.EMPTY_NODE;const r=zi(t,Mg,a=>a.name,Ea);if(s){const a=zi(t,ae.getCompare());return new F(r,pe(e),new dt({".priority":a},{".priority":ae}))}else return new F(r,pe(e),dt.Default)}else{let t=F.EMPTY_NODE;return Oe(n,(s,i)=>{if(ot(n,s)&&s.substring(0,1)!=="."){const r=pe(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(pe(e))}}Fg(pe);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $g extends mr{constructor(e){super(),this.indexPath_=e,k(!$(e)&&W(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?rn(e.name,t.name):r}makePost(e,t){const s=pe(e),i=F.EMPTY_NODE.updateChild(this.indexPath_,s);return new H(t,i)}maxPost(){const e=F.EMPTY_NODE.updateChild(this.indexPath_,Js);return new H(Jt,e)}toString(){return Ms(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hg extends mr{compare(e,t){const s=e.node.compareTo(t.node);return s===0?rn(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return H.MIN}maxPost(){return H.MAX}makePost(e,t){const s=pe(e);return new H(t,s)}toString(){return".value"}}const Gg=new Hg;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hd(n){return{type:"value",snapshotNode:n}}function Dn(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Ls(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function Fs(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Kg(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(e){this.index_=e}updateChild(e,t,s,i,r,a){k(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(a!=null&&(s.isEmpty()?e.hasChild(t)?a.trackChildChange(Ls(t,l)):k(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?a.trackChildChange(Dn(t,s)):a.trackChildChange(Fs(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(ae,(i,r)=>{t.hasChild(i)||s.trackChildChange(Ls(i,r))}),t.isLeafNode()||t.forEachChild(ae,(i,r)=>{if(e.hasChild(i)){const a=e.getImmediateChild(i);a.equals(r)||s.trackChildChange(Fs(i,r,a))}else s.trackChildChange(Dn(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?F.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us{constructor(e){this.indexedFilter_=new Ta(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Us.getStartPost_(e),this.endPost_=Us.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,a){return this.matches(new H(t,s))||(s=F.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,a)}updateFullNode(e,t,s){t.isLeafNode()&&(t=F.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(F.EMPTY_NODE);const r=this;return t.forEachChild(ae,(a,l)=>{r.matches(new H(a,l))||(i=i.updateImmediateChild(a,F.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new Us(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,a){return this.rangedFilter_.matches(new H(t,s))||(s=F.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,a):this.fullLimitUpdateChild_(e,t,s,r,a)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=F.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=F.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let a=0;for(;r.hasNext()&&a<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),a++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(F.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let a=0;for(;r.hasNext();){const l=r.getNext();a<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?a++:i=i.updateImmediateChild(l.name,F.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let a;if(this.reverse_){const p=this.index_.getCompare();a=(m,C)=>p(C,m)}else a=this.index_.getCompare();const l=e;k(l.numChildren()===this.limit_,"");const u=new H(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),f=this.rangedFilter_.matches(u);if(l.hasChild(t)){const p=l.getImmediateChild(t);let m=i.getChildAfterChild(this.index_,h,this.reverse_);for(;m!=null&&(m.name===t||l.hasChild(m.name));)m=i.getChildAfterChild(this.index_,m,this.reverse_);const C=m==null?1:a(m,u);if(f&&!s.isEmpty()&&C>=0)return r!=null&&r.trackChildChange(Fs(t,s,p)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(Ls(t,p));const D=l.updateImmediateChild(t,F.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(r!=null&&r.trackChildChange(Dn(m.name,m.node)),D.updateImmediateChild(m.name,m.node)):D}}else return s.isEmpty()?e:f&&a(h,u)>=0?(r!=null&&(r.trackChildChange(Ls(h.name,h.node)),r.trackChildChange(Dn(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,F.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ia{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=ae}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return k(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return k(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Nn}hasEnd(){return this.endSet_}getIndexEndValue(){return k(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return k(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Jt}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return k(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===ae}copy(){const e=new Ia;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Yg(n){return n.loadsAllData()?new Ta(n.getIndex()):n.hasLimit()?new Qg(n):new Us(n)}function Yc(n){const e={};if(n.isDefault())return e;let t;if(n.index_===ae?t="$priority":n.index_===Gg?t="$value":n.index_===In?t="$key":(k(n.index_ instanceof $g,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Ee(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=Ee(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+Ee(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=Ee(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+Ee(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Xc(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==ae&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i extends nd{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(k(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=Xs("p:rest:"),this.listens_={}}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const a=$i.getListenId_(e,s),l={};this.listens_[a]=l;const u=Yc(e._queryParams);this.restRequest_(r+".json",u,(h,f)=>{let p=f;if(h===404&&(p=null,h=null),h===null&&this.onDataUpdate_(r,p,!1,s),Rn(this.listens_,a)===l){let m;h?h===401?m="permission_denied":m="rest_error:"+h:m="ok",i(m,null)}})}unlisten(e,t){const s=$i.getListenId_(e,t);delete this.listens_[s]}get(e){const t=Yc(e._queryParams),s=e._path.toString(),i=new ht;return this.restRequest_(s+".json",t,(r,a)=>{let l=a;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const a=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+C_(t);this.log_("Sending REST request for "+a);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+a+" received. status:",l.status,"response:",l.responseText);let u=null;if(l.status>=200&&l.status<300){try{u=Ds(l.responseText)}catch{Be("Failed to parse JSON response for "+a+": "+l.responseText)}s(null,u)}else l.status!==401&&l.status!==404&&Be("Got unsuccessful REST response for "+a+" Status: "+l.status),s(l.status);s=null}},l.open("GET",a,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xg{constructor(){this.rootNode_=F.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hi(){return{value:null,children:new Map}}function jn(n,e,t){if($(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=W(e);n.children.has(s)||n.children.set(s,Hi());const i=n.children.get(s);e=ne(e),jn(i,e,t)}}function Oo(n,e){if($(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(ae,(s,i)=>{jn(n,new ee(s),i)}),Oo(n,e)}}else if(n.children.size>0){const t=W(e);return e=ne(e),n.children.has(t)&&Oo(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function Mo(n,e,t){n.value!==null?t(e,n.value):Jg(n,(s,i)=>{const r=new ee(e.toString()+"/"+s);Mo(i,r,t)})}function Jg(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zg{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&Oe(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc=10*1e3,ey=30*1e3,ty=300*1e3;class ny{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new Zg(e);const s=Jc+(ey-Jc)*Math.random();ws(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;Oe(e,(i,r)=>{r>0&&ot(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),ws(this.reportStats_.bind(this),Math.floor(Math.random()*2*ty))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ke;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Ke||(Ke={}));function dd(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function wa(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ca(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=Ke.ACK_USER_WRITE,this.source=dd()}operationForChild(e){if($(this.path)){if(this.affectedTree.value!=null)return k(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new ee(e));return new Gi(J(),t,this.revert)}}else return k(W(this.path)===e,"operationForChild called for unrelated child."),new Gi(ne(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,t){this.source=e,this.path=t,this.type=Ke.LISTEN_COMPLETE}operationForChild(e){return $(this.path)?new Bs(this.source,J()):new Bs(this.source,ne(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=Ke.OVERWRITE}operationForChild(e){return $(this.path)?new Zt(this.source,J(),this.snap.getImmediateChild(e)):new Zt(this.source,ne(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=Ke.MERGE}operationForChild(e){if($(this.path)){const t=this.children.subtree(new ee(e));return t.isEmpty()?null:t.value?new Zt(this.source,J(),t.value):new qs(this.source,J(),t)}else return k(W(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new qs(this.source,ne(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if($(e))return this.isFullyInitialized()&&!this.filtered_;const t=W(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function iy(n,e,t,s){const i=[],r=[];return e.forEach(a=>{a.type==="child_changed"&&n.index_.indexedValueChanged(a.oldSnap,a.snapshotNode)&&r.push(Kg(a.childName,a.snapshotNode))}),ps(n,i,"child_removed",e,s,t),ps(n,i,"child_added",e,s,t),ps(n,i,"child_moved",r,s,t),ps(n,i,"child_changed",e,s,t),ps(n,i,"value",e,s,t),i}function ps(n,e,t,s,i,r){const a=s.filter(l=>l.type===t);a.sort((l,u)=>oy(n,l,u)),a.forEach(l=>{const u=ry(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(u,n.query_))})})}function ry(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function oy(n,e,t){if(e.childName==null||t.childName==null)throw Un("Should only compare child_ events.");const s=new H(e.childName,e.snapshotNode),i=new H(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gr(n,e){return{eventCache:n,serverCache:e}}function Cs(n,e,t,s){return gr(new en(e,t,s),n.serverCache)}function fd(n,e,t,s){return gr(n.eventCache,new en(e,t,s))}function Lo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function tn(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let go;const ay=()=>(go||(go=new Ze($m)),go);class ie{static fromObject(e){let t=new ie(null);return Oe(e,(s,i)=>{t=t.set(new ee(s),i)}),t}constructor(e,t=ay()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:J(),value:this.value};if($(e))return null;{const s=W(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(ne(e),t);return r!=null?{path:de(new ee(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if($(e))return this;{const t=W(e),s=this.children.get(t);return s!==null?s.subtree(ne(e)):new ie(null)}}set(e,t){if($(e))return new ie(t,this.children);{const s=W(e),r=(this.children.get(s)||new ie(null)).set(ne(e),t),a=this.children.insert(s,r);return new ie(this.value,a)}}remove(e){if($(e))return this.children.isEmpty()?new ie(null):new ie(null,this.children);{const t=W(e),s=this.children.get(t);if(s){const i=s.remove(ne(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new ie(null):new ie(this.value,r)}else return this}}get(e){if($(e))return this.value;{const t=W(e),s=this.children.get(t);return s?s.get(ne(e)):null}}setTree(e,t){if($(e))return t;{const s=W(e),r=(this.children.get(s)||new ie(null)).setTree(ne(e),t);let a;return r.isEmpty()?a=this.children.remove(s):a=this.children.insert(s,r),new ie(this.value,a)}}fold(e){return this.fold_(J(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(de(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,J(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if($(e))return null;{const r=W(e),a=this.children.get(r);return a?a.findOnPath_(ne(e),de(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,J(),t)}foreachOnPath_(e,t,s){if($(e))return this;{this.value&&s(t,this.value);const i=W(e),r=this.children.get(i);return r?r.foreachOnPath_(ne(e),de(t,i),s):new ie(null)}}foreach(e){this.foreach_(J(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(de(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.writeTree_=e}static empty(){return new Ye(new ie(null))}}function As(n,e,t){if($(e))return new Ye(new ie(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const a=Ue(i,e);return r=r.updateChild(a,t),new Ye(n.writeTree_.set(i,r))}else{const i=new ie(t),r=n.writeTree_.setTree(e,i);return new Ye(r)}}}function Zc(n,e,t){let s=n;return Oe(t,(i,r)=>{s=As(s,de(e,i),r)}),s}function eu(n,e){if($(e))return Ye.empty();{const t=n.writeTree_.setTree(e,new ie(null));return new Ye(t)}}function Fo(n,e){return on(n,e)!=null}function on(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(Ue(t.path,e)):null}function tu(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(ae,(s,i)=>{e.push(new H(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new H(s,i.value))}),e}function bt(n,e){if($(e))return n;{const t=on(n,e);return t!=null?new Ye(new ie(t)):new Ye(n.writeTree_.subtree(e))}}function Uo(n){return n.writeTree_.isEmpty()}function kn(n,e){return pd(J(),n.writeTree_,e)}function pd(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(k(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=pd(de(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(de(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(n,e){return yd(e,n)}function ly(n,e,t,s,i){k(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=As(n.visibleWrites,e,t)),n.lastWriteId=s}function cy(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function uy(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);k(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,a=n.allWrites.length-1;for(;i&&a>=0;){const l=n.allWrites[a];l.visible&&(a>=t&&hy(l,s.path)?i=!1:$e(s.path,l.path)&&(r=!0)),a--}if(i){if(r)return dy(n),!0;if(s.snap)n.visibleWrites=eu(n.visibleWrites,s.path);else{const l=s.children;Oe(l,u=>{n.visibleWrites=eu(n.visibleWrites,de(s.path,u))})}return!0}else return!1}function hy(n,e){if(n.snap)return $e(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&$e(de(n.path,t),e))return!0;return!1}function dy(n){n.visibleWrites=_d(n.allWrites,fy,J()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function fy(n){return n.visible}function _d(n,e,t){let s=Ye.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const a=r.path;let l;if(r.snap)$e(t,a)?(l=Ue(t,a),s=As(s,l,r.snap)):$e(a,t)&&(l=Ue(a,t),s=As(s,J(),r.snap.getChild(l)));else if(r.children){if($e(t,a))l=Ue(t,a),s=Zc(s,l,r.children);else if($e(a,t))if(l=Ue(a,t),$(l))s=Zc(s,J(),r.children);else{const u=Rn(r.children,W(l));if(u){const h=u.getChild(ne(l));s=As(s,J(),h)}}}else throw Un("WriteRecord should have .snap or .children")}}return s}function md(n,e,t,s,i){if(!s&&!i){const r=on(n.visibleWrites,e);if(r!=null)return r;{const a=bt(n.visibleWrites,e);if(Uo(a))return t;if(t==null&&!Fo(a,J()))return null;{const l=t||F.EMPTY_NODE;return kn(a,l)}}}else{const r=bt(n.visibleWrites,e);if(!i&&Uo(r))return t;if(!i&&t==null&&!Fo(r,J()))return null;{const a=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&($e(h.path,e)||$e(e,h.path))},l=_d(n.allWrites,a,e),u=t||F.EMPTY_NODE;return kn(l,u)}}}function py(n,e,t){let s=F.EMPTY_NODE;const i=on(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(ae,(r,a)=>{s=s.updateImmediateChild(r,a)}),s;if(t){const r=bt(n.visibleWrites,e);return t.forEachChild(ae,(a,l)=>{const u=kn(bt(r,new ee(a)),l);s=s.updateImmediateChild(a,u)}),tu(r).forEach(a=>{s=s.updateImmediateChild(a.name,a.node)}),s}else{const r=bt(n.visibleWrites,e);return tu(r).forEach(a=>{s=s.updateImmediateChild(a.name,a.node)}),s}}function _y(n,e,t,s,i){k(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=de(e,t);if(Fo(n.visibleWrites,r))return null;{const a=bt(n.visibleWrites,r);return Uo(a)?i.getChild(t):kn(a,i.getChild(t))}}function my(n,e,t,s){const i=de(e,t),r=on(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const a=bt(n.visibleWrites,i);return kn(a,s.getNode().getImmediateChild(t))}else return null}function gy(n,e){return on(n.visibleWrites,e)}function yy(n,e,t,s,i,r,a){let l;const u=bt(n.visibleWrites,e),h=on(u,J());if(h!=null)l=h;else if(t!=null)l=kn(u,t);else return[];if(l=l.withIndex(a),!l.isEmpty()&&!l.isLeafNode()){const f=[],p=a.getCompare(),m=r?l.getReverseIteratorFrom(s,a):l.getIteratorFrom(s,a);let C=m.getNext();for(;C&&f.length<i;)p(C,s)!==0&&f.push(C),C=m.getNext();return f}else return[]}function vy(){return{visibleWrites:Ye.empty(),allWrites:[],lastWriteId:-1}}function Ki(n,e,t,s){return md(n.writeTree,n.treePath,e,t,s)}function Sa(n,e){return py(n.writeTree,n.treePath,e)}function nu(n,e,t,s){return _y(n.writeTree,n.treePath,e,t,s)}function Qi(n,e){return gy(n.writeTree,de(n.treePath,e))}function Ey(n,e,t,s,i,r){return yy(n.writeTree,n.treePath,e,t,s,i,r)}function Ra(n,e,t){return my(n.writeTree,n.treePath,e,t)}function gd(n,e){return yd(de(n.treePath,e),n.writeTree)}function yd(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ty{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;k(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),k(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,Fs(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,Ls(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,Dn(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,Fs(s,e.snapshotNode,i.oldSnap));else throw Un("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const vd=new Iy;class ba{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new en(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Ra(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:tn(this.viewCache_),r=Ey(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wy(n){return{filter:n}}function Cy(n,e){k(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),k(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function Ay(n,e,t,s,i){const r=new Ty;let a,l;if(t.type===Ke.OVERWRITE){const h=t;h.source.fromUser?a=Bo(n,e,h.path,h.snap,s,i,r):(k(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!$(h.path),a=Yi(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===Ke.MERGE){const h=t;h.source.fromUser?a=Ry(n,e,h.path,h.children,s,i,r):(k(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),a=qo(n,e,h.path,h.children,s,i,l,r))}else if(t.type===Ke.ACK_USER_WRITE){const h=t;h.revert?a=Ny(n,e,h.path,s,i,r):a=by(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===Ke.LISTEN_COMPLETE)a=Py(n,e,t.path,s,r);else throw Un("Unknown operation type: "+t.type);const u=r.getChanges();return Sy(e,a,u),{viewCache:a,changes:u}}function Sy(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Lo(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(hd(Lo(e)))}}function Ed(n,e,t,s,i,r){const a=e.eventCache;if(Qi(s,t)!=null)return e;{let l,u;if($(t))if(k(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=tn(e),f=h instanceof F?h:F.EMPTY_NODE,p=Sa(s,f);l=n.filter.updateFullNode(e.eventCache.getNode(),p,r)}else{const h=Ki(s,tn(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=W(t);if(h===".priority"){k(Nt(t)===1,"Can't have a priority with additional path components");const f=a.getNode();u=e.serverCache.getNode();const p=nu(s,t,f,u);p!=null?l=n.filter.updatePriority(f,p):l=a.getNode()}else{const f=ne(t);let p;if(a.isCompleteForChild(h)){u=e.serverCache.getNode();const m=nu(s,t,a.getNode(),u);m!=null?p=a.getNode().getImmediateChild(h).updateChild(f,m):p=a.getNode().getImmediateChild(h)}else p=Ra(s,h,e.serverCache);p!=null?l=n.filter.updateChild(a.getNode(),h,p,f,i,r):l=a.getNode()}}return Cs(e,l,a.isFullyInitialized()||$(t),n.filter.filtersNodes())}}function Yi(n,e,t,s,i,r,a,l){const u=e.serverCache;let h;const f=a?n.filter:n.filter.getIndexedFilter();if($(t))h=f.updateFullNode(u.getNode(),s,null);else if(f.filtersNodes()&&!u.isFiltered()){const C=u.getNode().updateChild(t,s);h=f.updateFullNode(u.getNode(),C,null)}else{const C=W(t);if(!u.isCompleteForPath(t)&&Nt(t)>1)return e;const R=ne(t),N=u.getNode().getImmediateChild(C).updateChild(R,s);C===".priority"?h=f.updatePriority(u.getNode(),N):h=f.updateChild(u.getNode(),C,N,R,vd,null)}const p=fd(e,h,u.isFullyInitialized()||$(t),f.filtersNodes()),m=new ba(i,p,r);return Ed(n,p,t,i,m,l)}function Bo(n,e,t,s,i,r,a){const l=e.eventCache;let u,h;const f=new ba(i,e,r);if($(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,a),u=Cs(e,h,!0,n.filter.filtersNodes());else{const p=W(t);if(p===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),u=Cs(e,h,l.isFullyInitialized(),l.isFiltered());else{const m=ne(t),C=l.getNode().getImmediateChild(p);let R;if($(m))R=s;else{const D=f.getCompleteChild(p);D!=null?ga(m)===".priority"&&D.getChild(id(m)).isEmpty()?R=D:R=D.updateChild(m,s):R=F.EMPTY_NODE}if(C.equals(R))u=e;else{const D=n.filter.updateChild(l.getNode(),p,R,m,f,a);u=Cs(e,D,l.isFullyInitialized(),n.filter.filtersNodes())}}}return u}function su(n,e){return n.eventCache.isCompleteForChild(e)}function Ry(n,e,t,s,i,r,a){let l=e;return s.foreach((u,h)=>{const f=de(t,u);su(e,W(f))&&(l=Bo(n,l,f,h,i,r,a))}),s.foreach((u,h)=>{const f=de(t,u);su(e,W(f))||(l=Bo(n,l,f,h,i,r,a))}),l}function iu(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function qo(n,e,t,s,i,r,a,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let u=e,h;$(t)?h=s:h=new ie(null).setTree(t,s);const f=e.serverCache.getNode();return h.children.inorderTraversal((p,m)=>{if(f.hasChild(p)){const C=e.serverCache.getNode().getImmediateChild(p),R=iu(n,C,m);u=Yi(n,u,new ee(p),R,i,r,a,l)}}),h.children.inorderTraversal((p,m)=>{const C=!e.serverCache.isCompleteForChild(p)&&m.value===null;if(!f.hasChild(p)&&!C){const R=e.serverCache.getNode().getImmediateChild(p),D=iu(n,R,m);u=Yi(n,u,new ee(p),D,i,r,a,l)}}),u}function by(n,e,t,s,i,r,a){if(Qi(i,t)!=null)return e;const l=e.serverCache.isFiltered(),u=e.serverCache;if(s.value!=null){if($(t)&&u.isFullyInitialized()||u.isCompleteForPath(t))return Yi(n,e,t,u.getNode().getChild(t),i,r,l,a);if($(t)){let h=new ie(null);return u.getNode().forEachChild(In,(f,p)=>{h=h.set(new ee(f),p)}),qo(n,e,t,h,i,r,l,a)}else return e}else{let h=new ie(null);return s.foreach((f,p)=>{const m=de(t,f);u.isCompleteForPath(m)&&(h=h.set(f,u.getNode().getChild(m)))}),qo(n,e,t,h,i,r,l,a)}}function Py(n,e,t,s,i){const r=e.serverCache,a=fd(e,r.getNode(),r.isFullyInitialized()||$(t),r.isFiltered());return Ed(n,a,t,s,vd,i)}function Ny(n,e,t,s,i,r){let a;if(Qi(s,t)!=null)return e;{const l=new ba(s,e,i),u=e.eventCache.getNode();let h;if($(t)||W(t)===".priority"){let f;if(e.serverCache.isFullyInitialized())f=Ki(s,tn(e));else{const p=e.serverCache.getNode();k(p instanceof F,"serverChildren would be complete if leaf node"),f=Sa(s,p)}f=f,h=n.filter.updateFullNode(u,f,r)}else{const f=W(t);let p=Ra(s,f,e.serverCache);p==null&&e.serverCache.isCompleteForChild(f)&&(p=u.getImmediateChild(f)),p!=null?h=n.filter.updateChild(u,f,p,ne(t),l,r):e.eventCache.getNode().hasChild(f)?h=n.filter.updateChild(u,f,F.EMPTY_NODE,ne(t),l,r):h=u,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(a=Ki(s,tn(e)),a.isLeafNode()&&(h=n.filter.updateFullNode(h,a,r)))}return a=e.serverCache.isFullyInitialized()||Qi(s,J())!=null,Cs(e,h,a,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new Ta(s.getIndex()),r=Yg(s);this.processor_=wy(r);const a=t.serverCache,l=t.eventCache,u=i.updateFullNode(F.EMPTY_NODE,a.getNode(),null),h=r.updateFullNode(F.EMPTY_NODE,l.getNode(),null),f=new en(u,a.isFullyInitialized(),i.filtersNodes()),p=new en(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=gr(p,f),this.eventGenerator_=new sy(this.query_)}get query(){return this.query_}}function ky(n){return n.viewCache_.serverCache.getNode()}function Vy(n,e){const t=tn(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!$(e)&&!t.getImmediateChild(W(e)).isEmpty())?t.getChild(e):null}function ru(n){return n.eventRegistrations_.length===0}function xy(n,e){n.eventRegistrations_.push(e)}function ou(n,e,t){const s=[];if(t){k(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const a=r.createCancelEvent(t,i);a&&s.push(a)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const a=n.eventRegistrations_[r];if(!a.matches(e))i.push(a);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function au(n,e,t,s){e.type===Ke.MERGE&&e.source.queryId!==null&&(k(tn(n.viewCache_),"We should always have a full cache before handling merges"),k(Lo(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=Ay(n.processor_,i,e,t,s);return Cy(n.processor_,r.viewCache),k(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Td(n,r.changes,r.viewCache.eventCache.getNode(),null)}function Oy(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(ae,(r,a)=>{s.push(Dn(r,a))}),t.isFullyInitialized()&&s.push(hd(t.getNode())),Td(n,s,t.getNode(),e)}function Td(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return iy(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xi;class My{constructor(){this.views=new Map}}function Ly(n){k(!Xi,"__referenceConstructor has already been defined"),Xi=n}function Fy(){return k(Xi,"Reference.ts has not been loaded"),Xi}function Uy(n){return n.views.size===0}function Pa(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return k(r!=null,"SyncTree gave us an op for an invalid query."),au(r,e,t,s)}else{let r=[];for(const a of n.views.values())r=r.concat(au(a,e,t,s));return r}}function By(n,e,t,s,i){const r=e._queryIdentifier,a=n.views.get(r);if(!a){let l=Ki(t,i?s:null),u=!1;l?u=!0:s instanceof F?(l=Sa(t,s),u=!1):(l=F.EMPTY_NODE,u=!1);const h=gr(new en(l,u,!1),new en(s,i,!1));return new Dy(e,h)}return a}function qy(n,e,t,s,i,r){const a=By(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,a),xy(a,t),Oy(a,t)}function jy(n,e,t,s){const i=e._queryIdentifier,r=[];let a=[];const l=Dt(n);if(i==="default")for(const[u,h]of n.views.entries())a=a.concat(ou(h,t,s)),ru(h)&&(n.views.delete(u),h.query._queryParams.loadsAllData()||r.push(h.query));else{const u=n.views.get(i);u&&(a=a.concat(ou(u,t,s)),ru(u)&&(n.views.delete(i),u.query._queryParams.loadsAllData()||r.push(u.query)))}return l&&!Dt(n)&&r.push(new(Fy())(e._repo,e._path)),{removed:r,events:a}}function Id(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function wn(n,e){let t=null;for(const s of n.views.values())t=t||Vy(s,e);return t}function wd(n,e){if(e._queryParams.loadsAllData())return yr(n);{const s=e._queryIdentifier;return n.views.get(s)}}function Cd(n,e){return wd(n,e)!=null}function Dt(n){return yr(n)!=null}function yr(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ji;function Wy(n){k(!Ji,"__referenceConstructor has already been defined"),Ji=n}function zy(){return k(Ji,"Reference.ts has not been loaded"),Ji}let $y=1;class lu{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ie(null),this.pendingWriteTree_=vy(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Ad(n,e,t,s,i){return ly(n.pendingWriteTree_,e,t,s,i),i?Zs(n,new Zt(dd(),e,t)):[]}function Gt(n,e,t=!1){const s=cy(n.pendingWriteTree_,e);if(uy(n.pendingWriteTree_,e)){let r=new ie(null);return s.snap!=null?r=r.set(J(),!0):Oe(s.children,a=>{r=r.set(new ee(a),!0)}),Zs(n,new Gi(s.path,r,t))}else return[]}function vr(n,e,t){return Zs(n,new Zt(wa(),e,t))}function Hy(n,e,t){const s=ie.fromObject(t);return Zs(n,new qs(wa(),e,s))}function Gy(n,e){return Zs(n,new Bs(wa(),e))}function Ky(n,e,t){const s=Da(n,t);if(s){const i=ka(s),r=i.path,a=i.queryId,l=Ue(r,e),u=new Bs(Ca(a),l);return Va(n,r,u)}else return[]}function jo(n,e,t,s,i=!1){const r=e._path,a=n.syncPointTree_.get(r);let l=[];if(a&&(e._queryIdentifier==="default"||Cd(a,e))){const u=jy(a,e,t,s);Uy(a)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=u.removed;if(l=u.events,!i){const f=h.findIndex(m=>m._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(r,(m,C)=>Dt(C));if(f&&!p){const m=n.syncPointTree_.subtree(r);if(!m.isEmpty()){const C=Xy(m);for(let R=0;R<C.length;++R){const D=C[R],N=D.query,j=bd(n,D);n.listenProvider_.startListening(Ss(N),Zi(n,N),j.hashFn,j.onComplete)}}}!p&&h.length>0&&!s&&(f?n.listenProvider_.stopListening(Ss(e),null):h.forEach(m=>{const C=n.queryToTagMap.get(Er(m));n.listenProvider_.stopListening(Ss(m),C)}))}Jy(n,h)}return l}function Qy(n,e,t,s){const i=Da(n,s);if(i!=null){const r=ka(i),a=r.path,l=r.queryId,u=Ue(a,e),h=new Zt(Ca(l),u,t);return Va(n,a,h)}else return[]}function Yy(n,e,t,s){const i=Da(n,s);if(i){const r=ka(i),a=r.path,l=r.queryId,u=Ue(a,e),h=ie.fromObject(t),f=new qs(Ca(l),u,h);return Va(n,a,f)}else return[]}function cu(n,e,t,s=!1){const i=e._path;let r=null,a=!1;n.syncPointTree_.foreachOnPath(i,(m,C)=>{const R=Ue(m,i);r=r||wn(C,R),a=a||Dt(C)});let l=n.syncPointTree_.get(i);l?(a=a||Dt(l),r=r||wn(l,J())):(l=new My,n.syncPointTree_=n.syncPointTree_.set(i,l));let u;r!=null?u=!0:(u=!1,r=F.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((C,R)=>{const D=wn(R,J());D&&(r=r.updateImmediateChild(C,D))}));const h=Cd(l,e);if(!h&&!e._queryParams.loadsAllData()){const m=Er(e);k(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const C=Zy();n.queryToTagMap.set(m,C),n.tagToQueryMap.set(C,m)}const f=Aa(n.pendingWriteTree_,i);let p=qy(l,e,t,f,r,u);if(!h&&!a&&!s){const m=wd(l,e);p=p.concat(ev(n,e,m))}return p}function Na(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(a,l)=>{const u=Ue(a,e),h=wn(l,u);if(h)return h});return md(i,e,r,t,!0)}function Zs(n,e){return Sd(e,n.syncPointTree_,null,Aa(n.pendingWriteTree_,J()))}function Sd(n,e,t,s){if($(n.path))return Rd(n,e,t,s);{const i=e.get(J());t==null&&i!=null&&(t=wn(i,J()));let r=[];const a=W(n.path),l=n.operationForChild(a),u=e.children.get(a);if(u&&l){const h=t?t.getImmediateChild(a):null,f=gd(s,a);r=r.concat(Sd(l,u,h,f))}return i&&(r=r.concat(Pa(i,n,s,t))),r}}function Rd(n,e,t,s){const i=e.get(J());t==null&&i!=null&&(t=wn(i,J()));let r=[];return e.children.inorderTraversal((a,l)=>{const u=t?t.getImmediateChild(a):null,h=gd(s,a),f=n.operationForChild(a);f&&(r=r.concat(Rd(f,l,u,h)))}),i&&(r=r.concat(Pa(i,n,s,t))),r}function bd(n,e){const t=e.query,s=Zi(n,t);return{hashFn:()=>(ky(e)||F.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?Ky(n,t._path,s):Gy(n,t._path);{const r=Km(i,t);return jo(n,t,null,r)}}}}function Zi(n,e){const t=Er(e);return n.queryToTagMap.get(t)}function Er(n){return n._path.toString()+"$"+n._queryIdentifier}function Da(n,e){return n.tagToQueryMap.get(e)}function ka(n){const e=n.indexOf("$");return k(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new ee(n.substr(0,e))}}function Va(n,e,t){const s=n.syncPointTree_.get(e);k(s,"Missing sync point for query tag that we're tracking");const i=Aa(n.pendingWriteTree_,e);return Pa(s,t,i,null)}function Xy(n){return n.fold((e,t,s)=>{if(t&&Dt(t))return[yr(t)];{let i=[];return t&&(i=Id(t)),Oe(s,(r,a)=>{i=i.concat(a)}),i}})}function Ss(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(zy())(n._repo,n._path):n}function Jy(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Er(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function Zy(){return $y++}function ev(n,e,t){const s=e._path,i=Zi(n,e),r=bd(n,t),a=n.listenProvider_.startListening(Ss(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)k(!Dt(l.value),"If we're adding a query, it shouldn't be shadowed");else{const u=l.fold((h,f,p)=>{if(!$(h)&&f&&Dt(f))return[yr(f).query];{let m=[];return f&&(m=m.concat(Id(f).map(C=>C.query))),Oe(p,(C,R)=>{m=m.concat(R)}),m}});for(let h=0;h<u.length;++h){const f=u[h];n.listenProvider_.stopListening(Ss(f),Zi(n,f))}}return a}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new xa(t)}node(){return this.node_}}class Oa{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=de(this.path_,e);return new Oa(this.syncTree_,t)}node(){return Na(this.syncTree_,this.path_)}}const tv=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},uu=function(n,e,t){if(!n||typeof n!="object")return n;if(k(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return nv(n[".sv"],e,t);if(typeof n[".sv"]=="object")return sv(n[".sv"],e);k(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},nv=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:k(!1,"Unexpected server value: "+n)}},sv=function(n,e,t){n.hasOwnProperty("increment")||k(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&k(!1,"Unexpected increment value: "+s);const i=e.node();if(k(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const a=i.getValue();return typeof a!="number"?s:a+s},iv=function(n,e,t,s){return Ma(e,new Oa(t,n),s)},Pd=function(n,e,t){return Ma(n,new xa(e),t)};function Ma(n,e,t){const s=n.getPriority().val(),i=uu(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const a=n,l=uu(a.getValue(),e,t);return l!==a.getValue()||i!==a.getPriority().val()?new ye(l,pe(i)):n}else{const a=n;return r=a,i!==a.getPriority().val()&&(r=r.updatePriority(new ye(i))),a.forEachChild(ae,(l,u)=>{const h=Ma(u,e.getImmediateChild(l),t);h!==u&&(r=r.updateImmediateChild(l,h))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Fa(n,e){let t=e instanceof ee?e:new ee(e),s=n,i=W(t);for(;i!==null;){const r=Rn(s.node.children,i)||{children:{},childCount:0};s=new La(i,s,r),t=ne(t),i=W(t)}return s}function Wn(n){return n.node.value}function Nd(n,e){n.node.value=e,Wo(n)}function Dd(n){return n.node.childCount>0}function rv(n){return Wn(n)===void 0&&!Dd(n)}function Tr(n,e){Oe(n.node.children,(t,s)=>{e(new La(t,n,s))})}function kd(n,e,t,s){t&&e(n),Tr(n,i=>{kd(i,e,!0)})}function ov(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function ei(n){return new ee(n.parent===null?n.name:ei(n.parent)+"/"+n.name)}function Wo(n){n.parent!==null&&av(n.parent,n.name,n)}function av(n,e,t){const s=rv(t),i=ot(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,Wo(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,Wo(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lv=/[\[\].#$\/\u0000-\u001F\u007F]/,cv=/[\[\].#$\u0000-\u001F\u007F]/,yo=10*1024*1024,Ua=function(n){return typeof n=="string"&&n.length!==0&&!lv.test(n)},Vd=function(n){return typeof n=="string"&&n.length!==0&&!cv.test(n)},uv=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Vd(n)},xd=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!_r(n)||n&&typeof n=="object"&&ot(n,".sv")},zo=function(n,e,t,s){Ir(bn(n,"value"),e,t)},Ir=function(n,e,t){const s=t instanceof ee?new bg(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+$t(s));if(typeof e=="function")throw new Error(n+"contains a function "+$t(s)+" with contents = "+e.toString());if(_r(e))throw new Error(n+"contains "+e.toString()+" "+$t(s));if(typeof e=="string"&&e.length>yo/3&&pr(e)>yo)throw new Error(n+"contains a string greater than "+yo+" utf8 bytes "+$t(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(Oe(e,(a,l)=>{if(a===".value")i=!0;else if(a!==".priority"&&a!==".sv"&&(r=!0,!Ua(a)))throw new Error(n+" contains an invalid key ("+a+") "+$t(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Pg(s,a),Ir(n,l,s),Ng(s)}),i&&r)throw new Error(n+' contains ".value" child '+$t(s)+" in addition to actual children.")}},hv=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=Ms(s);for(let a=0;a<r.length;a++)if(!(r[a]===".priority"&&a===r.length-1)){if(!Ua(r[a]))throw new Error(n+"contains an invalid key ("+r[a]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Rg);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&$e(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},dv=function(n,e,t,s){const i=bn(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];Oe(e,(a,l)=>{const u=new ee(a);if(Ir(i,l,de(t,u)),ga(u)===".priority"&&!xd(l))throw new Error(i+"contains an invalid value for '"+u.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(u)}),hv(i,r)},fv=function(n,e,t){if(_r(e))throw new Error(bn(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!xd(e))throw new Error(bn(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},Od=function(n,e,t,s){if(!Vd(t))throw new Error(bn(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},pv=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Od(n,e,t)},ms=function(n,e){if(W(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},_v=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Ua(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!uv(t))throw new Error(bn(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ba(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!ya(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function Md(n,e,t){Ba(n,t),Ld(n,s=>ya(s,e))}function gt(n,e,t){Ba(n,t),Ld(n,s=>$e(s,e)||$e(e,s))}function Ld(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(gv(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function gv(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();Is&&Ae("event: "+t.toString()),qn(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yv="repo_interrupt",vv=25;class Ev{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new mv,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Hi(),this.transactionQueueTree_=new La,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function Tv(n,e,t){if(n.stats_=_a(n.repoInfo_),n.forceRestClient_||Jm())n.server_=new $i(n.repoInfo_,(s,i,r,a)=>{hu(n,s,i,r,a)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>du(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Ee(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new ft(n.repoInfo_,e,(s,i,r,a)=>{hu(n,s,i,r,a)},s=>{du(n,s)},s=>{wv(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=sg(n.repoInfo_,()=>new ny(n.stats_,n.server_)),n.infoData_=new Xg,n.infoSyncTree_=new lu({startListening:(s,i,r,a)=>{let l=[];const u=n.infoData_.getNode(s._path);return u.isEmpty()||(l=vr(n.infoSyncTree_,s._path,u),setTimeout(()=>{a("ok")},0)),l},stopListening:()=>{}}),ja(n,"connected",!1),n.serverSyncTree_=new lu({startListening:(s,i,r,a)=>(n.server_.listen(s,r,i,(l,u)=>{const h=a(l,u);gt(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function Iv(n){const t=n.infoData_.getNode(new ee(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function qa(n){return tv({timestamp:Iv(n)})}function hu(n,e,t,s,i){n.dataUpdateCount++;const r=new ee(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let a=[];if(i)if(s){const u=qi(t,h=>pe(h));a=Yy(n.serverSyncTree_,r,u,i)}else{const u=pe(t);a=Qy(n.serverSyncTree_,r,u,i)}else if(s){const u=qi(t,h=>pe(h));a=Hy(n.serverSyncTree_,r,u)}else{const u=pe(t);a=vr(n.serverSyncTree_,r,u)}let l=r;a.length>0&&(l=wr(n,r)),gt(n.eventQueue_,l,a)}function du(n,e){ja(n,"connected",e),e===!1&&Av(n)}function wv(n,e){Oe(e,(t,s)=>{ja(n,t,s)})}function ja(n,e,t){const s=new ee("/.info/"+e),i=pe(t);n.infoData_.updateSnapshot(s,i);const r=vr(n.infoSyncTree_,s,i);gt(n.eventQueue_,s,r)}function Fd(n){return n.nextWriteId_++}function Cv(n,e,t,s,i){Wa(n,"set",{path:e.toString(),value:t,priority:s});const r=qa(n),a=pe(t,s),l=Na(n.serverSyncTree_,e),u=Pd(a,l,r),h=Fd(n),f=Ad(n.serverSyncTree_,e,u,h,!0);Ba(n.eventQueue_,f),n.server_.put(e.toString(),a.val(!0),(m,C)=>{const R=m==="ok";R||Be("set at "+e+" failed: "+m);const D=Gt(n.serverSyncTree_,h,!R);gt(n.eventQueue_,e,D),Vn(n,i,m,C)});const p=Wd(n,e);wr(n,p),gt(n.eventQueue_,p,[])}function Av(n){Wa(n,"onDisconnectEvents");const e=qa(n),t=Hi();Mo(n.onDisconnect_,J(),(i,r)=>{const a=iv(i,r,n.serverSyncTree_,e);jn(t,i,a)});let s=[];Mo(t,J(),(i,r)=>{s=s.concat(vr(n.serverSyncTree_,i,r));const a=Wd(n,i);wr(n,a)}),n.onDisconnect_=Hi(),gt(n.eventQueue_,J(),s)}function Sv(n,e,t){n.server_.onDisconnectCancel(e.toString(),(s,i)=>{s==="ok"&&Oo(n.onDisconnect_,e),Vn(n,t,s,i)})}function fu(n,e,t,s){const i=pe(t);n.server_.onDisconnectPut(e.toString(),i.val(!0),(r,a)=>{r==="ok"&&jn(n.onDisconnect_,e,i),Vn(n,s,r,a)})}function Rv(n,e,t,s,i){const r=pe(t,s);n.server_.onDisconnectPut(e.toString(),r.val(!0),(a,l)=>{a==="ok"&&jn(n.onDisconnect_,e,r),Vn(n,i,a,l)})}function bv(n,e,t,s){if(Ao(t)){Ae("onDisconnect().update() called with empty data.  Don't do anything."),Vn(n,s,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(i,r)=>{i==="ok"&&Oe(t,(a,l)=>{const u=pe(l);jn(n.onDisconnect_,de(e,a),u)}),Vn(n,s,i,r)})}function Pv(n,e,t){let s;W(e._path)===".info"?s=cu(n.infoSyncTree_,e,t):s=cu(n.serverSyncTree_,e,t),Md(n.eventQueue_,e._path,s)}function pu(n,e,t){let s;W(e._path)===".info"?s=jo(n.infoSyncTree_,e,t):s=jo(n.serverSyncTree_,e,t),Md(n.eventQueue_,e._path,s)}function Nv(n){n.persistentConnection_&&n.persistentConnection_.interrupt(yv)}function Wa(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Ae(t,...e)}function Vn(n,e,t,s){e&&qn(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const a=new Error(r);a.code=i,e(a)}})}function Ud(n,e,t){return Na(n.serverSyncTree_,e,t)||F.EMPTY_NODE}function za(n,e=n.transactionQueueTree_){if(e||Cr(n,e),Wn(e)){const t=qd(n,e);k(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&Dv(n,ei(e),t)}else Dd(e)&&Tr(e,t=>{za(n,t)})}function Dv(n,e,t){const s=t.map(h=>h.currentWriteId),i=Ud(n,e,s);let r=i;const a=i.hash();for(let h=0;h<t.length;h++){const f=t[h];k(f.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),f.status=1,f.retryCount++;const p=Ue(e,f.path);r=r.updateChild(p,f.currentOutputSnapshotRaw)}const l=r.val(!0),u=e;n.server_.put(u.toString(),l,h=>{Wa(n,"transaction put response",{path:u.toString(),status:h});let f=[];if(h==="ok"){const p=[];for(let m=0;m<t.length;m++)t[m].status=2,f=f.concat(Gt(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&p.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();Cr(n,Fa(n.transactionQueueTree_,e)),za(n,n.transactionQueueTree_),gt(n.eventQueue_,e,f);for(let m=0;m<p.length;m++)qn(p[m])}else{if(h==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{Be("transaction at "+u.toString()+" failed: "+h);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=h}wr(n,e)}},a)}function wr(n,e){const t=Bd(n,e),s=ei(t),i=qd(n,t);return kv(n,i,s),s}function kv(n,e,t){if(e.length===0)return;const s=[];let i=[];const a=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const u=e[l],h=Ue(t,u.path);let f=!1,p;if(k(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),u.status===4)f=!0,p=u.abortReason,i=i.concat(Gt(n.serverSyncTree_,u.currentWriteId,!0));else if(u.status===0)if(u.retryCount>=vv)f=!0,p="maxretry",i=i.concat(Gt(n.serverSyncTree_,u.currentWriteId,!0));else{const m=Ud(n,u.path,a);u.currentInputSnapshot=m;const C=e[l].update(m.val());if(C!==void 0){Ir("transaction failed: Data returned ",C,u.path);let R=pe(C);typeof C=="object"&&C!=null&&ot(C,".priority")||(R=R.updatePriority(m.getPriority()));const N=u.currentWriteId,j=qa(n),q=Pd(R,m,j);u.currentOutputSnapshotRaw=R,u.currentOutputSnapshotResolved=q,u.currentWriteId=Fd(n),a.splice(a.indexOf(N),1),i=i.concat(Ad(n.serverSyncTree_,u.path,q,u.currentWriteId,u.applyLocally)),i=i.concat(Gt(n.serverSyncTree_,N,!0))}else f=!0,p="nodata",i=i.concat(Gt(n.serverSyncTree_,u.currentWriteId,!0))}gt(n.eventQueue_,t,i),i=[],f&&(e[l].status=2,(function(m){setTimeout(m,Math.floor(0))})(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(p),!1,null))))}Cr(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)qn(s[l]);za(n,n.transactionQueueTree_)}function Bd(n,e){let t,s=n.transactionQueueTree_;for(t=W(e);t!==null&&Wn(s)===void 0;)s=Fa(s,t),e=ne(e),t=W(e);return s}function qd(n,e){const t=[];return jd(n,e,t),t.sort((s,i)=>s.order-i.order),t}function jd(n,e,t){const s=Wn(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Tr(e,i=>{jd(n,i,t)})}function Cr(n,e){const t=Wn(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,Nd(e,t.length>0?t:void 0)}Tr(e,s=>{Cr(n,s)})}function Wd(n,e){const t=ei(Bd(n,e)),s=Fa(n.transactionQueueTree_,e);return ov(s,i=>{vo(n,i)}),vo(n,s),kd(s,i=>{vo(n,i)}),t}function vo(n,e){const t=Wn(e);if(t){const s=[];let i=[],r=-1;for(let a=0;a<t.length;a++)t[a].status===3||(t[a].status===1?(k(r===a-1,"All SENT items should be at beginning of queue."),r=a,t[a].status=3,t[a].abortReason="set"):(k(t[a].status===0,"Unexpected transaction status in abort"),t[a].unwatcher(),i=i.concat(Gt(n.serverSyncTree_,t[a].currentWriteId,!0)),t[a].onComplete&&s.push(t[a].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Nd(e,void 0):t.length=r+1,gt(n.eventQueue_,ei(e),i);for(let a=0;a<s.length;a++)qn(s[a])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vv(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function xv(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):Be(`Invalid query segment '${t}' in query '${n}'`)}return e}const _u=function(n,e){const t=Ov(n),s=t.namespace;t.domain==="firebase.com"&&mt(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&mt("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Wm();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new Qh(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new ee(t.pathString)}},Ov=function(n){let e="",t="",s="",i="",r="",a=!0,l="https",u=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let f=n.indexOf("/");f===-1&&(f=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(f,p)),f<p&&(i=Vv(n.substring(f,p)));const m=xv(n.substring(Math.min(n.length,p)));h=e.indexOf(":"),h>=0?(a=l==="https"||l==="wss",u=parseInt(e.substring(h+1),10)):h=e.length;const C=e.slice(0,h);if(C.toLowerCase()==="localhost")t="localhost";else if(C.split(".").length<=2)t=C;else{const R=e.indexOf(".");s=e.substring(0,R).toLowerCase(),t=e.substring(R+1),r=s}"ns"in m&&(r=m.ns)}return{host:e,port:u,domain:t,subdomain:s,secure:a,scheme:l,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mv{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Ee(this.snapshot.exportVal())}}class Lv{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return k(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new ht;return Sv(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){ms("OnDisconnect.remove",this._path);const e=new ht;return fu(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){ms("OnDisconnect.set",this._path),zo("OnDisconnect.set",e,this._path);const t=new ht;return fu(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){ms("OnDisconnect.setWithPriority",this._path),zo("OnDisconnect.setWithPriority",e,this._path),fv("OnDisconnect.setWithPriority",t);const s=new ht;return Rv(this._repo,this._path,e,t,s.wrapCallback(()=>{})),s.promise}update(e){ms("OnDisconnect.update",this._path),dv("OnDisconnect.update",e,this._path);const t=new ht;return bv(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return $(this._path)?null:ga(this._path)}get ref(){return new Ut(this._repo,this._path)}get _queryIdentifier(){const e=Xc(this._queryParams),t=fa(e);return t==="{}"?"default":t}get _queryObject(){return Xc(this._queryParams)}isEqual(e){if(e=Xe(e),!(e instanceof $a))return!1;const t=this._repo===e._repo,s=ya(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Sg(this._path)}}class Ut extends $a{constructor(e,t){super(e,t,new Ia,!1)}get parent(){const e=id(this._path);return e===null?null:new Ut(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class er{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new ee(e),s=$o(this.ref,e);return new er(this._node.getChild(t),s,ae)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new er(i,$o(this.ref,s),ae)))}hasChild(e){const t=new ee(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function fw(n,e){return n=Xe(n),n._checkNotDeleted("ref"),e!==void 0?$o(n._root,e):n._root}function $o(n,e){return n=Xe(n),W(n._path)===null?pv("child","path",e):Od("child","path",e),new Ut(n._repo,de(n._path,e))}function pw(n){return n=Xe(n),new Uv(n._repo,n._path)}function _w(n,e){n=Xe(n),ms("set",n._path),zo("set",e,n._path);const t=new ht;return Cv(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}class Ha{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new Mv("value",this,new er(e.snapshotNode,new Ut(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Lv(this,e,t):null}matches(e){return e instanceof Ha?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function Bv(n,e,t,s,i){let r;if(typeof s=="object"&&(r=void 0,i=s),typeof s=="function"&&(r=s),i&&i.onlyOnce){const u=t,h=(f,p)=>{pu(n._repo,n,l),u(f,p)};h.userCallback=t.userCallback,h.context=t.context,t=h}const a=new Fv(t,r||void 0),l=new Ha(a);return Pv(n._repo,n,l),()=>pu(n._repo,n,l)}function mw(n,e,t,s){return Bv(n,"value",e,t,s)}Ly(Ut);Wy(Ut);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qv="FIREBASE_DATABASE_EMULATOR_HOST",Ho={};let jv=!1;function Wv(n,e,t,s){const i=e.lastIndexOf(":"),r=e.substring(0,i),a=Qs(r);n.repoInfo_=new Qh(e,a,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),s&&(n.authTokenProvider_=s)}function zv(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||mt("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Ae("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let a=_u(r,i),l=a.repoInfo,u;typeof process<"u"&&Vc&&(u=Vc[qv]),u?(r=`http://${u}?ns=${l.namespace}`,a=_u(r,i),l=a.repoInfo):a.repoInfo.secure;const h=new eg(n.name,n.options,e);_v("Invalid Firebase Database URL",a),$(a.path)||mt("Database URL must point to the root of a Firebase Database (not including a child path).");const f=Hv(l,n,h,new Zm(n,t));return new Gv(f,n)}function $v(n,e){const t=Ho[e];(!t||t[n.key]!==n)&&mt(`Database ${e}(${n.repoInfo_}) has already been deleted.`),Nv(n),delete t[n.key]}function Hv(n,e,t,s){let i=Ho[e.name];i||(i={},Ho[e.name]=i);let r=i[n.toURLString()];return r&&mt("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new Ev(n,jv,t,s),i[n.toURLString()]=r,r}class Gv{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(Tv(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Ut(this._repo,J())),this._rootInternal}_delete(){return this._rootInternal!==null&&($v(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&mt("Cannot call "+e+" on a deleted database.")}}function gw(n=kh(),e){const t=Ph(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=yh("database");s&&Kv(t,...s)}return t}function Kv(n,e,t,s={}){n=Xe(n),n._checkNotDeleted("useEmulator");const i=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(i===n._repoInternal.repoInfo_.host&&ks(s,r.repoInfo_.emulatorOptions))return;mt("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let a;if(r.repoInfo_.nodeAdmin)s.mockUserToken&&mt('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),a=new ki(ki.OWNER);else if(s.mockUserToken){const l=typeof s.mockUserToken=="string"?s.mockUserToken:Th(s.mockUserToken,n.app.options.projectId);a=new ki(l)}Qs(e)&&(Eh(e),Ih("Database",!0)),Wv(r,i,s,a)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qv(n){Lm(Dh),Vs(new Pn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return zv(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Rt(xc,Oc,n),Rt(xc,Oc,"esm2017")}ft.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};ft.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};Qv();var mu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Pt,zd;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function v(){}v.prototype=g.prototype,I.D=g.prototype,I.prototype=new v,I.prototype.constructor=I,I.C=function(E,T,A){for(var y=Array(arguments.length-2),lt=2;lt<arguments.length;lt++)y[lt-2]=arguments[lt];return g.prototype[T].apply(E,y)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,g,v){v||(v=0);var E=Array(16);if(typeof g=="string")for(var T=0;16>T;++T)E[T]=g.charCodeAt(v++)|g.charCodeAt(v++)<<8|g.charCodeAt(v++)<<16|g.charCodeAt(v++)<<24;else for(T=0;16>T;++T)E[T]=g[v++]|g[v++]<<8|g[v++]<<16|g[v++]<<24;g=I.g[0],v=I.g[1],T=I.g[2];var A=I.g[3],y=g+(A^v&(T^A))+E[0]+3614090360&4294967295;g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[1]+3905402710&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[2]+606105819&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[3]+3250441966&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[4]+4118548399&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[5]+1200080426&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[6]+2821735955&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[7]+4249261313&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[8]+1770035416&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[9]+2336552879&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[10]+4294925233&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[11]+2304563134&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[12]+1804603682&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[13]+4254626195&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[14]+2792965006&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[15]+1236535329&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(T^A&(v^T))+E[1]+4129170786&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[6]+3225465664&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[11]+643717713&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[0]+3921069994&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[5]+3593408605&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[10]+38016083&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[15]+3634488961&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[4]+3889429448&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[9]+568446438&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[14]+3275163606&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[3]+4107603335&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[8]+1163531501&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[13]+2850285829&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[2]+4243563512&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[7]+1735328473&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[12]+2368359562&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(v^T^A)+E[5]+4294588738&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[8]+2272392833&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[11]+1839030562&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[14]+4259657740&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[1]+2763975236&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[4]+1272893353&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[7]+4139469664&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[10]+3200236656&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[13]+681279174&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[0]+3936430074&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[3]+3572445317&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[6]+76029189&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[9]+3654602809&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[12]+3873151461&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[15]+530742520&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[2]+3299628645&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(T^(v|~A))+E[0]+4096336452&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[7]+1126891415&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[14]+2878612391&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[5]+4237533241&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[12]+1700485571&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[3]+2399980690&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[10]+4293915773&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[1]+2240044497&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[8]+1873313359&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[15]+4264355552&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[6]+2734768916&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[13]+1309151649&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[4]+4149444226&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[11]+3174756917&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[2]+718787259&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(T+(y<<21&4294967295|y>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+A&4294967295}s.prototype.u=function(I,g){g===void 0&&(g=I.length);for(var v=g-this.blockSize,E=this.B,T=this.h,A=0;A<g;){if(T==0)for(;A<=v;)i(this,I,A),A+=this.blockSize;if(typeof I=="string"){for(;A<g;)if(E[T++]=I.charCodeAt(A++),T==this.blockSize){i(this,E),T=0;break}}else for(;A<g;)if(E[T++]=I[A++],T==this.blockSize){i(this,E),T=0;break}}this.h=T,this.o+=g},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;var v=8*this.o;for(g=I.length-8;g<I.length;++g)I[g]=v&255,v/=256;for(this.u(I),I=Array(16),g=v=0;4>g;++g)for(var E=0;32>E;E+=8)I[v++]=this.g[g]>>>E&255;return I};function r(I,g){var v=l;return Object.prototype.hasOwnProperty.call(v,I)?v[I]:v[I]=g(I)}function a(I,g){this.h=g;for(var v=[],E=!0,T=I.length-1;0<=T;T--){var A=I[T]|0;E&&A==g||(v[T]=A,E=!1)}this.g=v}var l={};function u(I){return-128<=I&&128>I?r(I,function(g){return new a([g|0],0>g?-1:0)}):new a([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return N(h(-I));for(var g=[],v=1,E=0;I>=v;E++)g[E]=I/v|0,v*=4294967296;return new a(g,0)}function f(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return N(f(I.substring(1),g));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(g,8)),E=p,T=0;T<I.length;T+=8){var A=Math.min(8,I.length-T),y=parseInt(I.substring(T,T+A),g);8>A?(A=h(Math.pow(g,A)),E=E.j(A).add(h(y))):(E=E.j(v),E=E.add(h(y)))}return E}var p=u(0),m=u(1),C=u(16777216);n=a.prototype,n.m=function(){if(D(this))return-N(this).m();for(var I=0,g=1,v=0;v<this.g.length;v++){var E=this.i(v);I+=(0<=E?E:4294967296+E)*g,g*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(R(this))return"0";if(D(this))return"-"+N(this).toString(I);for(var g=h(Math.pow(I,6)),v=this,E="";;){var T=ce(v,g).g;v=j(v,T.j(g));var A=((0<v.g.length?v.g[0]:v.h)>>>0).toString(I);if(v=T,R(v))return A+E;for(;6>A.length;)A="0"+A;E=A+E}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function R(I){if(I.h!=0)return!1;for(var g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function D(I){return I.h==-1}n.l=function(I){return I=j(this,I),D(I)?-1:R(I)?0:1};function N(I){for(var g=I.g.length,v=[],E=0;E<g;E++)v[E]=~I.g[E];return new a(v,~I.h).add(m)}n.abs=function(){return D(this)?N(this):this},n.add=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0,T=0;T<=g;T++){var A=E+(this.i(T)&65535)+(I.i(T)&65535),y=(A>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);E=y>>>16,A&=65535,y&=65535,v[T]=y<<16|A}return new a(v,v[v.length-1]&-2147483648?-1:0)};function j(I,g){return I.add(N(g))}n.j=function(I){if(R(this)||R(I))return p;if(D(this))return D(I)?N(this).j(N(I)):N(N(this).j(I));if(D(I))return N(this.j(N(I)));if(0>this.l(C)&&0>I.l(C))return h(this.m()*I.m());for(var g=this.g.length+I.g.length,v=[],E=0;E<2*g;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var T=0;T<I.g.length;T++){var A=this.i(E)>>>16,y=this.i(E)&65535,lt=I.i(T)>>>16,Kn=I.i(T)&65535;v[2*E+2*T]+=y*Kn,q(v,2*E+2*T),v[2*E+2*T+1]+=A*Kn,q(v,2*E+2*T+1),v[2*E+2*T+1]+=y*lt,q(v,2*E+2*T+1),v[2*E+2*T+2]+=A*lt,q(v,2*E+2*T+2)}for(E=0;E<g;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=g;E<2*g;E++)v[E]=0;return new a(v,0)};function q(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function G(I,g){this.g=I,this.h=g}function ce(I,g){if(R(g))throw Error("division by zero");if(R(I))return new G(p,p);if(D(I))return g=ce(N(I),g),new G(N(g.g),N(g.h));if(D(g))return g=ce(I,N(g)),new G(N(g.g),g.h);if(30<I.g.length){if(D(I)||D(g))throw Error("slowDivide_ only works with positive integers.");for(var v=m,E=g;0>=E.l(I);)v=at(v),E=at(E);var T=Ie(v,1),A=Ie(E,1);for(E=Ie(E,2),v=Ie(v,2);!R(E);){var y=A.add(E);0>=y.l(I)&&(T=T.add(v),A=y),E=Ie(E,1),v=Ie(v,1)}return g=j(I,T.j(g)),new G(T,g)}for(T=p;0<=I.l(g);){for(v=Math.max(1,Math.floor(I.m()/g.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),A=h(v),y=A.j(g);D(y)||0<y.l(I);)v-=E,A=h(v),y=A.j(g);R(A)&&(A=m),T=T.add(A),I=j(I,y)}return new G(T,I)}n.A=function(I){return ce(this,I).h},n.and=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)&I.i(E);return new a(v,this.h&I.h)},n.or=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)|I.i(E);return new a(v,this.h|I.h)},n.xor=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)^I.i(E);return new a(v,this.h^I.h)};function at(I){for(var g=I.g.length+1,v=[],E=0;E<g;E++)v[E]=I.i(E)<<1|I.i(E-1)>>>31;return new a(v,I.h)}function Ie(I,g){var v=g>>5;g%=32;for(var E=I.g.length-v,T=[],A=0;A<E;A++)T[A]=0<g?I.i(A+v)>>>g|I.i(A+v+1)<<32-g:I.i(A+v);return new a(T,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,zd=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=f,Pt=a}).apply(typeof mu<"u"?mu:typeof self<"u"?self:typeof window<"u"?window:{});var Ri=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var $d,gs,Hd,xi,Go,Gd,Kd,Qd;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,c,d){return o==Array.prototype||o==Object.prototype||(o[c]=d.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ri=="object"&&Ri];for(var c=0;c<o.length;++c){var d=o[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var s=t(this);function i(o,c){if(c)e:{var d=s;o=o.split(".");for(var _=0;_<o.length-1;_++){var w=o[_];if(!(w in d))break e;d=d[w]}o=o[o.length-1],_=d[o],c=c(_),c!=_&&c!=null&&e(d,o,{configurable:!0,writable:!0,value:c})}}function r(o,c){o instanceof String&&(o+="");var d=0,_=!1,w={next:function(){if(!_&&d<o.length){var S=d++;return{value:c(S,o[S]),done:!1}}return _=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}i("Array.prototype.values",function(o){return o||function(){return r(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(o){var c=typeof o;return c=c!="object"?c:o?Array.isArray(o)?"array":c:"null",c=="array"||c=="object"&&typeof o.length=="number"}function h(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function f(o,c,d){return o.call.apply(o.bind,arguments)}function p(o,c,d){if(!o)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,_),o.apply(c,w)}}return function(){return o.apply(c,arguments)}}function m(o,c,d){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,m.apply(null,arguments)}function C(o,c){var d=Array.prototype.slice.call(arguments,1);return function(){var _=d.slice();return _.push.apply(_,arguments),o.apply(this,_)}}function R(o,c){function d(){}d.prototype=c.prototype,o.aa=c.prototype,o.prototype=new d,o.prototype.constructor=o,o.Qb=function(_,w,S){for(var V=Array(arguments.length-2),te=2;te<arguments.length;te++)V[te-2]=arguments[te];return c.prototype[w].apply(_,V)}}function D(o){const c=o.length;if(0<c){const d=Array(c);for(let _=0;_<c;_++)d[_]=o[_];return d}return[]}function N(o,c){for(let d=1;d<arguments.length;d++){const _=arguments[d];if(u(_)){const w=o.length||0,S=_.length||0;o.length=w+S;for(let V=0;V<S;V++)o[w+V]=_[V]}else o.push(_)}}class j{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function q(o){return/^[\s\xa0]*$/.test(o)}function G(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function ce(o){return ce[" "](o),o}ce[" "]=function(){};var at=G().indexOf("Gecko")!=-1&&!(G().toLowerCase().indexOf("webkit")!=-1&&G().indexOf("Edge")==-1)&&!(G().indexOf("Trident")!=-1||G().indexOf("MSIE")!=-1)&&G().indexOf("Edge")==-1;function Ie(o,c,d){for(const _ in o)c.call(d,o[_],_,o)}function I(o,c){for(const d in o)c.call(void 0,o[d],d,o)}function g(o){const c={};for(const d in o)c[d]=o[d];return c}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(o,c){let d,_;for(let w=1;w<arguments.length;w++){_=arguments[w];for(d in _)o[d]=_[d];for(let S=0;S<v.length;S++)d=v[S],Object.prototype.hasOwnProperty.call(_,d)&&(o[d]=_[d])}}function T(o){var c=1;o=o.split(":");const d=[];for(;0<c&&o.length;)d.push(o.shift()),c--;return o.length&&d.push(o.join(":")),d}function A(o){l.setTimeout(()=>{throw o},0)}function y(){var o=Fr;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class lt{constructor(){this.h=this.g=null}add(c,d){const _=Kn.get();_.set(c,d),this.h?this.h.next=_:this.g=_,this.h=_}}var Kn=new j(()=>new Ep,o=>o.reset());class Ep{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Qn,Yn=!1,Fr=new lt,Il=()=>{const o=l.Promise.resolve(void 0);Qn=()=>{o.then(Tp)}};var Tp=()=>{for(var o;o=y();){try{o.h.call(o.g)}catch(d){A(d)}var c=Kn;c.j(o),100>c.h&&(c.h++,o.next=c.g,c.g=o)}Yn=!1};function Et(){this.s=this.s,this.C=this.C}Et.prototype.s=!1,Et.prototype.ma=function(){this.s||(this.s=!0,this.N())},Et.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function be(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}be.prototype.h=function(){this.defaultPrevented=!0};var Ip=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const d=()=>{};l.addEventListener("test",d,c),l.removeEventListener("test",d,c)}catch{}return o})();function Xn(o,c){if(be.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var d=this.type=o.type,_=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget){if(at){e:{try{ce(c.nodeName);var w=!0;break e}catch{}w=!1}w||(c=null)}}else d=="mouseover"?c=o.fromElement:d=="mouseout"&&(c=o.toElement);this.relatedTarget=c,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:wp[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Xn.aa.h.call(this)}}R(Xn,be);var wp={2:"touch",3:"pen",4:"mouse"};Xn.prototype.h=function(){Xn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var oi="closure_listenable_"+(1e6*Math.random()|0),Cp=0;function Ap(o,c,d,_,w){this.listener=o,this.proxy=null,this.src=c,this.type=d,this.capture=!!_,this.ha=w,this.key=++Cp,this.da=this.fa=!1}function ai(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function li(o){this.src=o,this.g={},this.h=0}li.prototype.add=function(o,c,d,_,w){var S=o.toString();o=this.g[S],o||(o=this.g[S]=[],this.h++);var V=Br(o,c,_,w);return-1<V?(c=o[V],d||(c.fa=!1)):(c=new Ap(c,this.src,S,!!_,w),c.fa=d,o.push(c)),c};function Ur(o,c){var d=c.type;if(d in o.g){var _=o.g[d],w=Array.prototype.indexOf.call(_,c,void 0),S;(S=0<=w)&&Array.prototype.splice.call(_,w,1),S&&(ai(c),o.g[d].length==0&&(delete o.g[d],o.h--))}}function Br(o,c,d,_){for(var w=0;w<o.length;++w){var S=o[w];if(!S.da&&S.listener==c&&S.capture==!!d&&S.ha==_)return w}return-1}var qr="closure_lm_"+(1e6*Math.random()|0),jr={};function wl(o,c,d,_,w){if(Array.isArray(c)){for(var S=0;S<c.length;S++)wl(o,c[S],d,_,w);return null}return d=Sl(d),o&&o[oi]?o.K(c,d,h(_)?!!_.capture:!1,w):Sp(o,c,d,!1,_,w)}function Sp(o,c,d,_,w,S){if(!c)throw Error("Invalid event type");var V=h(w)?!!w.capture:!!w,te=zr(o);if(te||(o[qr]=te=new li(o)),d=te.add(c,d,_,V,S),d.proxy)return d;if(_=Rp(),d.proxy=_,_.src=o,_.listener=d,o.addEventListener)Ip||(w=V),w===void 0&&(w=!1),o.addEventListener(c.toString(),_,w);else if(o.attachEvent)o.attachEvent(Al(c.toString()),_);else if(o.addListener&&o.removeListener)o.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Rp(){function o(d){return c.call(o.src,o.listener,d)}const c=bp;return o}function Cl(o,c,d,_,w){if(Array.isArray(c))for(var S=0;S<c.length;S++)Cl(o,c[S],d,_,w);else _=h(_)?!!_.capture:!!_,d=Sl(d),o&&o[oi]?(o=o.i,c=String(c).toString(),c in o.g&&(S=o.g[c],d=Br(S,d,_,w),-1<d&&(ai(S[d]),Array.prototype.splice.call(S,d,1),S.length==0&&(delete o.g[c],o.h--)))):o&&(o=zr(o))&&(c=o.g[c.toString()],o=-1,c&&(o=Br(c,d,_,w)),(d=-1<o?c[o]:null)&&Wr(d))}function Wr(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[oi])Ur(c.i,o);else{var d=o.type,_=o.proxy;c.removeEventListener?c.removeEventListener(d,_,o.capture):c.detachEvent?c.detachEvent(Al(d),_):c.addListener&&c.removeListener&&c.removeListener(_),(d=zr(c))?(Ur(d,o),d.h==0&&(d.src=null,c[qr]=null)):ai(o)}}}function Al(o){return o in jr?jr[o]:jr[o]="on"+o}function bp(o,c){if(o.da)o=!0;else{c=new Xn(c,this);var d=o.listener,_=o.ha||o.src;o.fa&&Wr(o),o=d.call(_,c)}return o}function zr(o){return o=o[qr],o instanceof li?o:null}var $r="__closure_events_fn_"+(1e9*Math.random()>>>0);function Sl(o){return typeof o=="function"?o:(o[$r]||(o[$r]=function(c){return o.handleEvent(c)}),o[$r])}function Pe(){Et.call(this),this.i=new li(this),this.M=this,this.F=null}R(Pe,Et),Pe.prototype[oi]=!0,Pe.prototype.removeEventListener=function(o,c,d,_){Cl(this,o,c,d,_)};function Me(o,c){var d,_=o.F;if(_)for(d=[];_;_=_.F)d.push(_);if(o=o.M,_=c.type||c,typeof c=="string")c=new be(c,o);else if(c instanceof be)c.target=c.target||o;else{var w=c;c=new be(_,o),E(c,w)}if(w=!0,d)for(var S=d.length-1;0<=S;S--){var V=c.g=d[S];w=ci(V,_,!0,c)&&w}if(V=c.g=o,w=ci(V,_,!0,c)&&w,w=ci(V,_,!1,c)&&w,d)for(S=0;S<d.length;S++)V=c.g=d[S],w=ci(V,_,!1,c)&&w}Pe.prototype.N=function(){if(Pe.aa.N.call(this),this.i){var o=this.i,c;for(c in o.g){for(var d=o.g[c],_=0;_<d.length;_++)ai(d[_]);delete o.g[c],o.h--}}this.F=null},Pe.prototype.K=function(o,c,d,_){return this.i.add(String(o),c,!1,d,_)},Pe.prototype.L=function(o,c,d,_){return this.i.add(String(o),c,!0,d,_)};function ci(o,c,d,_){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();for(var w=!0,S=0;S<c.length;++S){var V=c[S];if(V&&!V.da&&V.capture==d){var te=V.listener,we=V.ha||V.src;V.fa&&Ur(o.i,V),w=te.call(we,_)!==!1&&w}}return w&&!_.defaultPrevented}function Rl(o,c,d){if(typeof o=="function")d&&(o=m(o,d));else if(o&&typeof o.handleEvent=="function")o=m(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(o,c||0)}function bl(o){o.g=Rl(()=>{o.g=null,o.i&&(o.i=!1,bl(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class Pp extends Et{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:bl(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Jn(o){Et.call(this),this.h=o,this.g={}}R(Jn,Et);var Pl=[];function Nl(o){Ie(o.g,function(c,d){this.g.hasOwnProperty(d)&&Wr(c)},o),o.g={}}Jn.prototype.N=function(){Jn.aa.N.call(this),Nl(this)},Jn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Hr=l.JSON.stringify,Np=l.JSON.parse,Dp=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Gr(){}Gr.prototype.h=null;function Dl(o){return o.h||(o.h=o.i())}function kl(){}var Zn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Kr(){be.call(this,"d")}R(Kr,be);function Qr(){be.call(this,"c")}R(Qr,be);var Bt={},Vl=null;function ui(){return Vl=Vl||new Pe}Bt.La="serverreachability";function xl(o){be.call(this,Bt.La,o)}R(xl,be);function es(o){const c=ui();Me(c,new xl(c))}Bt.STAT_EVENT="statevent";function Ol(o,c){be.call(this,Bt.STAT_EVENT,o),this.stat=c}R(Ol,be);function Le(o){const c=ui();Me(c,new Ol(c,o))}Bt.Ma="timingevent";function Ml(o,c){be.call(this,Bt.Ma,o),this.size=c}R(Ml,be);function ts(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},c)}function ns(){this.g=!0}ns.prototype.xa=function(){this.g=!1};function kp(o,c,d,_,w,S){o.info(function(){if(o.g)if(S)for(var V="",te=S.split("&"),we=0;we<te.length;we++){var X=te[we].split("=");if(1<X.length){var Ne=X[0];X=X[1];var De=Ne.split("_");V=2<=De.length&&De[1]=="type"?V+(Ne+"="+X+"&"):V+(Ne+"=redacted&")}}else V=null;else V=S;return"XMLHTTP REQ ("+_+") [attempt "+w+"]: "+c+`
`+d+`
`+V})}function Vp(o,c,d,_,w,S,V){o.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+w+"]: "+c+`
`+d+`
`+S+" "+V})}function hn(o,c,d,_){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+Op(o,d)+(_?" "+_:"")})}function xp(o,c){o.info(function(){return"TIMEOUT: "+c})}ns.prototype.info=function(){};function Op(o,c){if(!o.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(o=0;o<d.length;o++)if(Array.isArray(d[o])){var _=d[o];if(!(2>_.length)){var w=_[1];if(Array.isArray(w)&&!(1>w.length)){var S=w[0];if(S!="noop"&&S!="stop"&&S!="close")for(var V=1;V<w.length;V++)w[V]=""}}}}return Hr(d)}catch{return c}}var hi={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ll={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Yr;function di(){}R(di,Gr),di.prototype.g=function(){return new XMLHttpRequest},di.prototype.i=function(){return{}},Yr=new di;function Tt(o,c,d,_){this.j=o,this.i=c,this.l=d,this.R=_||1,this.U=new Jn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Fl}function Fl(){this.i=null,this.g="",this.h=!1}var Ul={},Xr={};function Jr(o,c,d){o.L=1,o.v=mi(ct(c)),o.m=d,o.P=!0,Bl(o,null)}function Bl(o,c){o.F=Date.now(),fi(o),o.A=ct(o.v);var d=o.A,_=o.R;Array.isArray(_)||(_=[String(_)]),ec(d.i,"t",_),o.C=0,d=o.j.J,o.h=new Fl,o.g=yc(o.j,d?c:null,!o.m),0<o.O&&(o.M=new Pp(m(o.Y,o,o.g),o.O)),c=o.U,d=o.g,_=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(Pl[0]=w.toString()),w=Pl);for(var S=0;S<w.length;S++){var V=wl(d,w[S],_||c.handleEvent,!1,c.h||c);if(!V)break;c.g[V.key]=V}c=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,c)):(o.u="GET",o.g.ea(o.A,o.u,null,c)),es(),kp(o.i,o.u,o.A,o.l,o.R,o.m)}Tt.prototype.ca=function(o){o=o.target;const c=this.M;c&&ut(o)==3?c.j():this.Y(o)},Tt.prototype.Y=function(o){try{if(o==this.g)e:{const De=ut(this.g);var c=this.g.Ba();const pn=this.g.Z();if(!(3>De)&&(De!=3||this.g&&(this.h.h||this.g.oa()||ac(this.g)))){this.J||De!=4||c==7||(c==8||0>=pn?es(3):es(2)),Zr(this);var d=this.g.Z();this.X=d;t:if(ql(this)){var _=ac(this.g);o="";var w=_.length,S=ut(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qt(this),ss(this);var V="";break t}this.h.i=new l.TextDecoder}for(c=0;c<w;c++)this.h.h=!0,o+=this.h.i.decode(_[c],{stream:!(S&&c==w-1)});_.length=0,this.h.g+=o,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=d==200,Vp(this.i,this.u,this.A,this.l,this.R,De,d),this.o){if(this.T&&!this.K){t:{if(this.g){var te,we=this.g;if((te=we.g?we.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!q(te)){var X=te;break t}}X=null}if(d=X)hn(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,eo(this,d);else{this.o=!1,this.s=3,Le(12),qt(this),ss(this);break e}}if(this.P){d=!0;let He;for(;!this.J&&this.C<V.length;)if(He=Mp(this,V),He==Xr){De==4&&(this.s=4,Le(14),d=!1),hn(this.i,this.l,null,"[Incomplete Response]");break}else if(He==Ul){this.s=4,Le(15),hn(this.i,this.l,V,"[Invalid Chunk]"),d=!1;break}else hn(this.i,this.l,He,null),eo(this,He);if(ql(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),De!=4||V.length!=0||this.h.h||(this.s=1,Le(16),d=!1),this.o=this.o&&d,!d)hn(this.i,this.l,V,"[Invalid Chunked Response]"),qt(this),ss(this);else if(0<V.length&&!this.W){this.W=!0;var Ne=this.j;Ne.g==this&&Ne.ba&&!Ne.M&&(Ne.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),oo(Ne),Ne.M=!0,Le(11))}}else hn(this.i,this.l,V,null),eo(this,V);De==4&&qt(this),this.o&&!this.J&&(De==4?pc(this.j,this):(this.o=!1,fi(this)))}else Zp(this.g),d==400&&0<V.indexOf("Unknown SID")?(this.s=3,Le(12)):(this.s=0,Le(13)),qt(this),ss(this)}}}catch{}finally{}};function ql(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Mp(o,c){var d=o.C,_=c.indexOf(`
`,d);return _==-1?Xr:(d=Number(c.substring(d,_)),isNaN(d)?Ul:(_+=1,_+d>c.length?Xr:(c=c.slice(_,_+d),o.C=_+d,c)))}Tt.prototype.cancel=function(){this.J=!0,qt(this)};function fi(o){o.S=Date.now()+o.I,jl(o,o.I)}function jl(o,c){if(o.B!=null)throw Error("WatchDog timer not null");o.B=ts(m(o.ba,o),c)}function Zr(o){o.B&&(l.clearTimeout(o.B),o.B=null)}Tt.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(xp(this.i,this.A),this.L!=2&&(es(),Le(17)),qt(this),this.s=2,ss(this)):jl(this,this.S-o)};function ss(o){o.j.G==0||o.J||pc(o.j,o)}function qt(o){Zr(o);var c=o.M;c&&typeof c.ma=="function"&&c.ma(),o.M=null,Nl(o.U),o.g&&(c=o.g,o.g=null,c.abort(),c.ma())}function eo(o,c){try{var d=o.j;if(d.G!=0&&(d.g==o||to(d.h,o))){if(!o.K&&to(d.h,o)&&d.G==3){try{var _=d.Da.g.parse(c)}catch{_=null}if(Array.isArray(_)&&_.length==3){var w=_;if(w[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<o.F)Ii(d),Ei(d);else break e;ro(d),Le(18)}}else d.za=w[1],0<d.za-d.T&&37500>w[2]&&d.F&&d.v==0&&!d.C&&(d.C=ts(m(d.Za,d),6e3));if(1>=$l(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else Wt(d,11)}else if((o.K||d.g==o)&&Ii(d),!q(c))for(w=d.Da.g.parse(c),c=0;c<w.length;c++){let X=w[c];if(d.T=X[0],X=X[1],d.G==2)if(X[0]=="c"){d.K=X[1],d.ia=X[2];const Ne=X[3];Ne!=null&&(d.la=Ne,d.j.info("VER="+d.la));const De=X[4];De!=null&&(d.Aa=De,d.j.info("SVER="+d.Aa));const pn=X[5];pn!=null&&typeof pn=="number"&&0<pn&&(_=1.5*pn,d.L=_,d.j.info("backChannelRequestTimeoutMs_="+_)),_=d;const He=o.g;if(He){const Ci=He.g?He.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ci){var S=_.h;S.g||Ci.indexOf("spdy")==-1&&Ci.indexOf("quic")==-1&&Ci.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(no(S,S.h),S.h=null))}if(_.D){const ao=He.g?He.g.getResponseHeader("X-HTTP-Session-Id"):null;ao&&(_.ya=ao,se(_.I,_.D,ao))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-o.F,d.j.info("Handshake RTT: "+d.R+"ms")),_=d;var V=o;if(_.qa=gc(_,_.J?_.ia:null,_.W),V.K){Hl(_.h,V);var te=V,we=_.L;we&&(te.I=we),te.B&&(Zr(te),fi(te)),_.g=V}else dc(_);0<d.i.length&&Ti(d)}else X[0]!="stop"&&X[0]!="close"||Wt(d,7);else d.G==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?Wt(d,7):io(d):X[0]!="noop"&&d.l&&d.l.ta(X),d.v=0)}}es(4)}catch{}}var Lp=class{constructor(o,c){this.g=o,this.map=c}};function Wl(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function zl(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function $l(o){return o.h?1:o.g?o.g.size:0}function to(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function no(o,c){o.g?o.g.add(c):o.h=c}function Hl(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}Wl.prototype.cancel=function(){if(this.i=Gl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Gl(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const d of o.g.values())c=c.concat(d.D);return c}return D(o.i)}function Fp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var c=[],d=o.length,_=0;_<d;_++)c.push(o[_]);return c}c=[],d=0;for(_ in o)c[d++]=o[_];return c}function Up(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var c=[];o=o.length;for(var d=0;d<o;d++)c.push(d);return c}c=[],d=0;for(const _ in o)c[d++]=_;return c}}}function Kl(o,c){if(o.forEach&&typeof o.forEach=="function")o.forEach(c,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,c,void 0);else for(var d=Up(o),_=Fp(o),w=_.length,S=0;S<w;S++)c.call(void 0,_[S],d&&d[S],o)}var Ql=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Bp(o,c){if(o){o=o.split("&");for(var d=0;d<o.length;d++){var _=o[d].indexOf("="),w=null;if(0<=_){var S=o[d].substring(0,_);w=o[d].substring(_+1)}else S=o[d];c(S,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function jt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof jt){this.h=o.h,pi(this,o.j),this.o=o.o,this.g=o.g,_i(this,o.s),this.l=o.l;var c=o.i,d=new os;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),Yl(this,d),this.m=o.m}else o&&(c=String(o).match(Ql))?(this.h=!1,pi(this,c[1]||"",!0),this.o=is(c[2]||""),this.g=is(c[3]||"",!0),_i(this,c[4]),this.l=is(c[5]||"",!0),Yl(this,c[6]||"",!0),this.m=is(c[7]||"")):(this.h=!1,this.i=new os(null,this.h))}jt.prototype.toString=function(){var o=[],c=this.j;c&&o.push(rs(c,Xl,!0),":");var d=this.g;return(d||c=="file")&&(o.push("//"),(c=this.o)&&o.push(rs(c,Xl,!0),"@"),o.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&o.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&o.push("/"),o.push(rs(d,d.charAt(0)=="/"?Wp:jp,!0))),(d=this.i.toString())&&o.push("?",d),(d=this.m)&&o.push("#",rs(d,$p)),o.join("")};function ct(o){return new jt(o)}function pi(o,c,d){o.j=d?is(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function _i(o,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);o.s=c}else o.s=null}function Yl(o,c,d){c instanceof os?(o.i=c,Hp(o.i,o.h)):(d||(c=rs(c,zp)),o.i=new os(c,o.h))}function se(o,c,d){o.i.set(c,d)}function mi(o){return se(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function is(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function rs(o,c,d){return typeof o=="string"?(o=encodeURI(o).replace(c,qp),d&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function qp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Xl=/[#\/\?@]/g,jp=/[#\?:]/g,Wp=/[#\?]/g,zp=/[#\?@]/g,$p=/#/g;function os(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function It(o){o.g||(o.g=new Map,o.h=0,o.i&&Bp(o.i,function(c,d){o.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=os.prototype,n.add=function(o,c){It(this),this.i=null,o=dn(this,o);var d=this.g.get(o);return d||this.g.set(o,d=[]),d.push(c),this.h+=1,this};function Jl(o,c){It(o),c=dn(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function Zl(o,c){return It(o),c=dn(o,c),o.g.has(c)}n.forEach=function(o,c){It(this),this.g.forEach(function(d,_){d.forEach(function(w){o.call(c,w,_,this)},this)},this)},n.na=function(){It(this);const o=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let _=0;_<c.length;_++){const w=o[_];for(let S=0;S<w.length;S++)d.push(c[_])}return d},n.V=function(o){It(this);let c=[];if(typeof o=="string")Zl(this,o)&&(c=c.concat(this.g.get(dn(this,o))));else{o=Array.from(this.g.values());for(let d=0;d<o.length;d++)c=c.concat(o[d])}return c},n.set=function(o,c){return It(this),this.i=null,o=dn(this,o),Zl(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},n.get=function(o,c){return o?(o=this.V(o),0<o.length?String(o[0]):c):c};function ec(o,c,d){Jl(o,c),0<d.length&&(o.i=null,o.g.set(dn(o,c),D(d)),o.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var _=c[d];const S=encodeURIComponent(String(_)),V=this.V(_);for(_=0;_<V.length;_++){var w=S;V[_]!==""&&(w+="="+encodeURIComponent(String(V[_]))),o.push(w)}}return this.i=o.join("&")};function dn(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function Hp(o,c){c&&!o.j&&(It(o),o.i=null,o.g.forEach(function(d,_){var w=_.toLowerCase();_!=w&&(Jl(this,_),ec(this,w,d))},o)),o.j=c}function Gp(o,c){const d=new ns;if(l.Image){const _=new Image;_.onload=C(wt,d,"TestLoadImage: loaded",!0,c,_),_.onerror=C(wt,d,"TestLoadImage: error",!1,c,_),_.onabort=C(wt,d,"TestLoadImage: abort",!1,c,_),_.ontimeout=C(wt,d,"TestLoadImage: timeout",!1,c,_),l.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=o}else c(!1)}function Kp(o,c){const d=new ns,_=new AbortController,w=setTimeout(()=>{_.abort(),wt(d,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:_.signal}).then(S=>{clearTimeout(w),S.ok?wt(d,"TestPingServer: ok",!0,c):wt(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),wt(d,"TestPingServer: error",!1,c)})}function wt(o,c,d,_,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),_(d)}catch{}}function Qp(){this.g=new Dp}function Yp(o,c,d){const _=d||"";try{Kl(o,function(w,S){let V=w;h(w)&&(V=Hr(w)),c.push(_+S+"="+encodeURIComponent(V))})}catch(w){throw c.push(_+"type="+encodeURIComponent("_badmap")),w}}function gi(o){this.l=o.Ub||null,this.j=o.eb||!1}R(gi,Gr),gi.prototype.g=function(){return new yi(this.l,this.j)},gi.prototype.i=(function(o){return function(){return o}})({});function yi(o,c){Pe.call(this),this.D=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(yi,Pe),n=yi.prototype,n.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=c,this.readyState=1,ls(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(c.body=o),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,as(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,ls(this)),this.g&&(this.readyState=3,ls(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;tc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function tc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?as(this):ls(this),this.readyState==3&&tc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,as(this))},n.Qa=function(o){this.g&&(this.response=o,as(this))},n.ga=function(){this.g&&as(this)};function as(o){o.readyState=4,o.l=null,o.j=null,o.v=null,ls(o)}n.setRequestHeader=function(o,c){this.u.append(o,c)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,o.push(d[0]+": "+d[1]),d=c.next();return o.join(`\r
`)};function ls(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(yi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function nc(o){let c="";return Ie(o,function(d,_){c+=_,c+=":",c+=d,c+=`\r
`}),c}function so(o,c,d){e:{for(_ in d){var _=!1;break e}_=!0}_||(d=nc(d),typeof o=="string"?d!=null&&encodeURIComponent(String(d)):se(o,c,d))}function ue(o){Pe.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(ue,Pe);var Xp=/^https?$/i,Jp=["POST","PUT"];n=ue.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,c,d,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Yr.g(),this.v=this.o?Dl(this.o):Dl(Yr),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(S){sc(this,S);return}if(o=d||"",d=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var w in _)d.set(w,_[w]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const S of _.keys())d.set(S,_.get(S));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),w=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Jp,c,void 0))||_||w||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,V]of d)this.g.setRequestHeader(S,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{oc(this),this.u=!0,this.g.send(o),this.u=!1}catch(S){sc(this,S)}};function sc(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.m=5,ic(o),vi(o)}function ic(o){o.A||(o.A=!0,Me(o,"complete"),Me(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Me(this,"complete"),Me(this,"abort"),vi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),vi(this,!0)),ue.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?rc(this):this.bb())},n.bb=function(){rc(this)};function rc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||ut(o)!=4||o.Z()!=2)){if(o.u&&ut(o)==4)Rl(o.Ea,0,o);else if(Me(o,"readystatechange"),ut(o)==4){o.h=!1;try{const V=o.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var _;if(_=V===0){var w=String(o.D).match(Ql)[1]||null;!w&&l.self&&l.self.location&&(w=l.self.location.protocol.slice(0,-1)),_=!Xp.test(w?w.toLowerCase():"")}d=_}if(d)Me(o,"complete"),Me(o,"success");else{o.m=6;try{var S=2<ut(o)?o.g.statusText:""}catch{S=""}o.l=S+" ["+o.Z()+"]",ic(o)}}finally{vi(o)}}}}function vi(o,c){if(o.g){oc(o);const d=o.g,_=o.v[0]?()=>{}:null;o.g=null,o.v=null,c||Me(o,"ready");try{d.onreadystatechange=_}catch{}}}function oc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function ut(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<ut(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),Np(c)}};function ac(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Zp(o){const c={};o=(o.g&&2<=ut(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<o.length;_++){if(q(o[_]))continue;var d=T(o[_]);const w=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=c[w]||[];c[w]=S,S.push(d)}I(c,function(_){return _.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function cs(o,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[o]||c}function lc(o){this.Aa=0,this.i=[],this.j=new ns,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=cs("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=cs("baseRetryDelayMs",5e3,o),this.cb=cs("retryDelaySeedMs",1e4,o),this.Wa=cs("forwardChannelMaxRetries",2,o),this.wa=cs("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Wl(o&&o.concurrentRequestLimit),this.Da=new Qp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=lc.prototype,n.la=8,n.G=1,n.connect=function(o,c,d,_){Le(0),this.W=o,this.H=c||{},d&&_!==void 0&&(this.H.OSID=d,this.H.OAID=_),this.F=this.X,this.I=gc(this,null,this.W),Ti(this)};function io(o){if(cc(o),o.G==3){var c=o.U++,d=ct(o.I);if(se(d,"SID",o.K),se(d,"RID",c),se(d,"TYPE","terminate"),us(o,d),c=new Tt(o,o.j,c),c.L=2,c.v=mi(ct(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=c.v,d=!0),d||(c.g=yc(c.j,null),c.g.ea(c.v)),c.F=Date.now(),fi(c)}mc(o)}function Ei(o){o.g&&(oo(o),o.g.cancel(),o.g=null)}function cc(o){Ei(o),o.u&&(l.clearTimeout(o.u),o.u=null),Ii(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ti(o){if(!zl(o.h)&&!o.s){o.s=!0;var c=o.Ga;Qn||Il(),Yn||(Qn(),Yn=!0),Fr.add(c,o),o.B=0}}function e_(o,c){return $l(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=c.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=ts(m(o.Ga,o,c),_c(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new Tt(this,this.j,o);let S=this.o;if(this.S&&(S?(S=g(S),E(S,this.S)):S=this.S),this.m!==null||this.O||(w.H=S,S=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var _=this.i[d];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(c+=_,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=hc(this,w,c),d=ct(this.I),se(d,"RID",o),se(d,"CVER",22),this.D&&se(d,"X-HTTP-Session-Id",this.D),us(this,d),S&&(this.O?c="headers="+encodeURIComponent(String(nc(S)))+"&"+c:this.m&&so(d,this.m,S)),no(this.h,w),this.Ua&&se(d,"TYPE","init"),this.P?(se(d,"$req",c),se(d,"SID","null"),w.T=!0,Jr(w,d,null)):Jr(w,d,c),this.G=2}}else this.G==3&&(o?uc(this,o):this.i.length==0||zl(this.h)||uc(this))};function uc(o,c){var d;c?d=c.l:d=o.U++;const _=ct(o.I);se(_,"SID",o.K),se(_,"RID",d),se(_,"AID",o.T),us(o,_),o.m&&o.o&&so(_,o.m,o.o),d=new Tt(o,o.j,d,o.B+1),o.m===null&&(d.H=o.o),c&&(o.i=c.D.concat(o.i)),c=hc(o,d,1e3),d.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),no(o.h,d),Jr(d,_,c)}function us(o,c){o.H&&Ie(o.H,function(d,_){se(c,_,d)}),o.l&&Kl({},function(d,_){se(c,_,d)})}function hc(o,c,d){d=Math.min(o.i.length,d);var _=o.l?m(o.l.Na,o.l,o):null;e:{var w=o.i;let S=-1;for(;;){const V=["count="+d];S==-1?0<d?(S=w[0].g,V.push("ofs="+S)):S=0:V.push("ofs="+S);let te=!0;for(let we=0;we<d;we++){let X=w[we].g;const Ne=w[we].map;if(X-=S,0>X)S=Math.max(0,w[we].g-100),te=!1;else try{Yp(Ne,V,"req"+X+"_")}catch{_&&_(Ne)}}if(te){_=V.join("&");break e}}}return o=o.i.splice(0,d),c.D=o,_}function dc(o){if(!o.g&&!o.u){o.Y=1;var c=o.Fa;Qn||Il(),Yn||(Qn(),Yn=!0),Fr.add(c,o),o.v=0}}function ro(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=ts(m(o.Fa,o),_c(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,fc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=ts(m(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Le(10),Ei(this),fc(this))};function oo(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function fc(o){o.g=new Tt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var c=ct(o.qa);se(c,"RID","rpc"),se(c,"SID",o.K),se(c,"AID",o.T),se(c,"CI",o.F?"0":"1"),!o.F&&o.ja&&se(c,"TO",o.ja),se(c,"TYPE","xmlhttp"),us(o,c),o.m&&o.o&&so(c,o.m,o.o),o.L&&(o.g.I=o.L);var d=o.g;o=o.ia,d.L=1,d.v=mi(ct(c)),d.m=null,d.P=!0,Bl(d,o)}n.Za=function(){this.C!=null&&(this.C=null,Ei(this),ro(this),Le(19))};function Ii(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function pc(o,c){var d=null;if(o.g==c){Ii(o),oo(o),o.g=null;var _=2}else if(to(o.h,c))d=c.D,Hl(o.h,c),_=1;else return;if(o.G!=0){if(c.o)if(_==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var w=o.B;_=ui(),Me(_,new Ml(_,d)),Ti(o)}else dc(o);else if(w=c.s,w==3||w==0&&0<c.X||!(_==1&&e_(o,c)||_==2&&ro(o)))switch(d&&0<d.length&&(c=o.h,c.i=c.i.concat(d)),w){case 1:Wt(o,5);break;case 4:Wt(o,10);break;case 3:Wt(o,6);break;default:Wt(o,2)}}}function _c(o,c){let d=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(d*=2),d*c}function Wt(o,c){if(o.j.info("Error code "+c),c==2){var d=m(o.fb,o),_=o.Xa;const w=!_;_=new jt(_||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||pi(_,"https"),mi(_),w?Gp(_.toString(),d):Kp(_.toString(),d)}else Le(2);o.G=0,o.l&&o.l.sa(c),mc(o),cc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Le(2)):(this.j.info("Failed to ping google.com"),Le(1))};function mc(o){if(o.G=0,o.ka=[],o.l){const c=Gl(o.h);(c.length!=0||o.i.length!=0)&&(N(o.ka,c),N(o.ka,o.i),o.h.i.length=0,D(o.i),o.i.length=0),o.l.ra()}}function gc(o,c,d){var _=d instanceof jt?ct(d):new jt(d);if(_.g!="")c&&(_.g=c+"."+_.g),_i(_,_.s);else{var w=l.location;_=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;var S=new jt(null);_&&pi(S,_),c&&(S.g=c),w&&_i(S,w),d&&(S.l=d),_=S}return d=o.D,c=o.ya,d&&c&&se(_,d,c),se(_,"VER",o.la),us(o,_),_}function yc(o,c,d){if(c&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Ca&&!o.pa?new ue(new gi({eb:d})):new ue(o.pa),c.Ha(o.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function vc(){}n=vc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function wi(){}wi.prototype.g=function(o,c){return new qe(o,c)};function qe(o,c){Pe.call(this),this.g=new lc(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(o?o["X-WebChannel-Client-Profile"]=c.va:o={"X-WebChannel-Client-Profile":c.va}),this.g.S=o,(o=c&&c.Sb)&&!q(o)&&(this.g.m=o),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!q(c)&&(this.g.D=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new fn(this)}R(qe,Pe),qe.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},qe.prototype.close=function(){io(this.g)},qe.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var d={};d.__data__=o,o=d}else this.u&&(d={},d.__data__=Hr(o),o=d);c.i.push(new Lp(c.Ya++,o)),c.G==3&&Ti(c)},qe.prototype.N=function(){this.g.l=null,delete this.j,io(this.g),delete this.g,qe.aa.N.call(this)};function Ec(o){Kr.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){e:{for(const d in c){o=d;break e}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}R(Ec,Kr);function Tc(){Qr.call(this),this.status=1}R(Tc,Qr);function fn(o){this.g=o}R(fn,vc),fn.prototype.ua=function(){Me(this.g,"a")},fn.prototype.ta=function(o){Me(this.g,new Ec(o))},fn.prototype.sa=function(o){Me(this.g,new Tc)},fn.prototype.ra=function(){Me(this.g,"b")},wi.prototype.createWebChannel=wi.prototype.g,qe.prototype.send=qe.prototype.o,qe.prototype.open=qe.prototype.m,qe.prototype.close=qe.prototype.close,Qd=function(){return new wi},Kd=function(){return ui()},Gd=Bt,Go={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},hi.NO_ERROR=0,hi.TIMEOUT=8,hi.HTTP_ERROR=6,xi=hi,Ll.COMPLETE="complete",Hd=Ll,kl.EventType=Zn,Zn.OPEN="a",Zn.CLOSE="b",Zn.ERROR="c",Zn.MESSAGE="d",Pe.prototype.listen=Pe.prototype.K,gs=kl,ue.prototype.listenOnce=ue.prototype.L,ue.prototype.getLastError=ue.prototype.Ka,ue.prototype.getLastErrorCode=ue.prototype.Ba,ue.prototype.getStatus=ue.prototype.Z,ue.prototype.getResponseJson=ue.prototype.Oa,ue.prototype.getResponseText=ue.prototype.oa,ue.prototype.send=ue.prototype.ea,ue.prototype.setWithCredentials=ue.prototype.Ha,$d=ue}).apply(typeof Ri<"u"?Ri:typeof self<"u"?self:typeof window<"u"?window:{});const gu="@firebase/firestore",yu="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ve.UNAUTHENTICATED=new Ve(null),Ve.GOOGLE_CREDENTIALS=new Ve("google-credentials-uid"),Ve.FIRST_PARTY=new Ve("first-party-uid"),Ve.MOCK_USER=new Ve("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zn="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=new ha("@firebase/firestore");function mn(){return nn.logLevel}function x(n,...e){if(nn.logLevel<=Q.DEBUG){const t=e.map(Ga);nn.debug(`Firestore (${zn}): ${n}`,...t)}}function yt(n,...e){if(nn.logLevel<=Q.ERROR){const t=e.map(Ga);nn.error(`Firestore (${zn}): ${n}`,...t)}}function kt(n,...e){if(nn.logLevel<=Q.WARN){const t=e.map(Ga);nn.warn(`Firestore (${zn}): ${n}`,...t)}}function Ga(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Yd(n,s,t)}function Yd(n,e,t){let s=`FIRESTORE (${zn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw yt(s),new Error(s)}function Z(n,e,t,s){let i="Unexpected state";typeof t=="string"?i=t:s=t,n||Yd(e,i,s)}function B(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class O extends Bn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Yv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ve.UNAUTHENTICATED)))}shutdown(){}}class Xv{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Jv{constructor(e){this.t=e,this.currentUser=Ve.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Z(this.o===void 0,42304);let s=this.i;const i=u=>this.i!==s?(s=this.i,t(u)):Promise.resolve();let r=new Qt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Qt,e.enqueueRetryable((()=>i(this.currentUser)))};const a=()=>{const u=r;e.enqueueRetryable((async()=>{await u.promise,await i(this.currentUser)}))},l=u=>{x("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((u=>l(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(x("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Qt)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(x("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Z(typeof s.accessToken=="string",31837,{l:s}),new Xd(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Z(e===null||typeof e=="string",2055,{h:e}),new Ve(e)}}class Zv{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Ve.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class eE{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new Zv(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ve.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class vu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class tE{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Nh(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Z(this.o===void 0,3512);const s=r=>{r.error!=null&&x("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const a=r.token!==this.m;return this.m=r.token,x("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable((()=>s(r)))};const i=r=>{x("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((r=>i(r))),setTimeout((()=>{if(!this.appCheck){const r=this.V.getImmediate({optional:!0});r?i(r):x("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new vu(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Z(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new vu(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nE(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const i=nE(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%62))}return s}}function z(n,e){return n<e?-1:n>e?1:0}function Ko(n,e){let t=0;for(;t<n.length&&t<e.length;){const s=n.codePointAt(t),i=e.codePointAt(t);if(s!==i){if(s<128&&i<128)return z(s,i);{const r=Jd(),a=sE(r.encode(Eu(n,t)),r.encode(Eu(e,t)));return a!==0?a:z(s,i)}}t+=s>65535?2:1}return z(n.length,e.length)}function Eu(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function sE(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return z(n[t],e[t]);return z(n.length,e.length)}function xn(n,e,t){return n.length===e.length&&n.every(((s,i)=>t(s,e[i])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tu="__name__";class Je{constructor(e,t,s){t===void 0?t=0:t>e.length&&L(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&L(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Je.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Je?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=Je.compareSegments(e.get(i),t.get(i));if(r!==0)return r}return z(e.length,t.length)}static compareSegments(e,t){const s=Je.isNumericId(e),i=Je.isNumericId(t);return s&&!i?-1:!s&&i?1:s&&i?Je.extractNumericId(e).compare(Je.extractNumericId(t)):Ko(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Pt.fromString(e.substring(4,e.length-2))}}class oe extends Je{construct(e,t,s){return new oe(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new O(P.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((i=>i.length>0)))}return new oe(t)}static emptyPath(){return new oe([])}}const iE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Se extends Je{construct(e,t,s){return new Se(e,t,s)}static isValidIdentifier(e){return iE.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Se.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Tu}static keyField(){return new Se([Tu])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new O(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new O(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new O(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,i+=2}else l==="`"?(a=!a,i++):l!=="."||a?(s+=l,i++):(r(),i++)}if(r(),a)throw new O(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Se(t)}static emptyPath(){return new Se([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.path=e}static fromPath(e){return new M(oe.fromString(e))}static fromName(e){return new M(oe.fromString(e).popFirst(5))}static empty(){return new M(oe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&oe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return oe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new M(new oe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rE(n,e,t){if(!t)throw new O(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function oE(n,e,t,s){if(e===!0&&s===!0)throw new O(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Iu(n){if(!M.isDocumentKey(n))throw new O(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Zd(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Qa(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":L(12329,{type:typeof n})}function Cn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new O(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Qa(n);throw new O(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(n,e){const t={typeString:n};return e&&(t.value=e),t}function ti(n,e){if(!Zd(n))throw new O(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const i=e[s].typeString,r="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const a=n[s];if(i&&typeof a!==i){t=`JSON field '${s}' must be a ${i}.`;break}if(r!==void 0&&a!==r.value){t=`Expected '${s}' field to equal '${r.value}'`;break}}if(t)throw new O(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wu=-62135596800,Cu=1e6;class re{static now(){return re.fromMillis(Date.now())}static fromDate(e){return re.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Cu);return new re(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<wu)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Cu}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:re._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ti(e,re._jsonSchema))return new re(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-wu;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}re._jsonSchemaVersion="firestore/timestamp/1.0",re._jsonSchema={type:_e("string",re._jsonSchemaVersion),seconds:_e("number"),nanoseconds:_e("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new re(0,0))}static max(){return new U(new re(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js=-1;function aE(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=U.fromTimestamp(s===1e9?new re(t+1,0):new re(t,s));return new Vt(i,M.empty(),e)}function lE(n){return new Vt(n.readTime,n.key,js)}class Vt{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Vt(U.min(),M.empty(),js)}static max(){return new Vt(U.max(),M.empty(),js)}}function cE(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(n.documentKey,e.documentKey),t!==0?t:z(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uE="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class hE{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $n(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==uE)throw n;x("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&L(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new b(((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof b?t:b.resolve(t)}catch(t){return b.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):b.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):b.reject(t)}static resolve(e){return new b(((t,s)=>{t(e)}))}static reject(e){return new b(((t,s)=>{s(e)}))}static waitFor(e){return new b(((t,s)=>{let i=0,r=0,a=!1;e.forEach((l=>{++i,l.next((()=>{++r,a&&r===i&&t()}),(u=>s(u)))})),a=!0,r===i&&t()}))}static or(e){let t=b.resolve(!1);for(const s of e)t=t.next((i=>i?b.resolve(i):s()));return t}static forEach(e,t){const s=[];return e.forEach(((i,r)=>{s.push(t.call(this,i,r))})),this.waitFor(s)}static mapArray(e,t){return new b(((s,i)=>{const r=e.length,a=new Array(r);let l=0;for(let u=0;u<r;u++){const h=u;t(e[h]).next((f=>{a[h]=f,++l,l===r&&s(a)}),(f=>i(f)))}}))}static doWhile(e,t){return new b(((s,i)=>{const r=()=>{e()===!0?t().next((()=>{r()}),i):s()};r()}))}}function dE(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Hn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Ar.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ya=-1;function Sr(n){return n==null}function tr(n){return n===0&&1/n==-1/0}function fE(n){return typeof n=="number"&&Number.isInteger(n)&&!tr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ef="";function pE(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Au(e)),e=_E(n.get(t),e);return Au(e)}function _E(n,e){let t=e;const s=n.length;for(let i=0;i<s;i++){const r=n.charAt(i);switch(r){case"\0":t+="";break;case ef:t+="";break;default:t+=r}}return t}function Au(n){return n+ef+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Su(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function an(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function tf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e,t){this.comparator=e,this.root=t||Ce.EMPTY}insert(e,t){return new le(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ce.BLACK,null,null))}remove(e){return new le(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ce.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new bi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new bi(this.root,e,this.comparator,!1)}getReverseIterator(){return new bi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new bi(this.root,e,this.comparator,!0)}}class bi{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ce{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Ce.RED,this.left=i??Ce.EMPTY,this.right=r??Ce.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new Ce(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Ce.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Ce.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ce.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ce.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw L(43730,{key:this.key,value:this.value});if(this.right.isRed())throw L(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw L(27949);return e+(this.isRed()?0:1)}}Ce.EMPTY=null,Ce.RED=!0,Ce.BLACK=!1;Ce.EMPTY=new class{constructor(){this.size=0}get key(){throw L(57766)}get value(){throw L(16141)}get color(){throw L(16727)}get left(){throw L(29726)}get right(){throw L(36894)}copy(e,t,s,i,r){return this}insert(e,t,s){return new Ce(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.comparator=e,this.data=new le(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ru(this.data.getIterator())}getIteratorFrom(e){return new Ru(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof ge)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ge(this.comparator);return t.data=e,t}}class Ru{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.fields=e,e.sort(Se.comparator)}static empty(){return new Qe([])}unionWith(e){let t=new ge(Se.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Qe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return xn(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new nf("Invalid base64 string: "+r):r}})(e);return new Re(t)}static fromUint8Array(e){const t=(function(i){let r="";for(let a=0;a<i.length;++a)r+=String.fromCharCode(i[a]);return r})(e);return new Re(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Re.EMPTY_BYTE_STRING=new Re("");const mE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function xt(n){if(Z(!!n,39018),typeof n=="string"){let e=0;const t=mE.exec(n);if(Z(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:he(n.seconds),nanos:he(n.nanos)}}function he(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ot(n){return typeof n=="string"?Re.fromBase64String(n):Re.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sf="server_timestamp",rf="__type__",of="__previous_value__",af="__local_write_time__";function Xa(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[rf])===null||t===void 0?void 0:t.stringValue)===sf}function Rr(n){const e=n.mapValue.fields[of];return Xa(e)?Rr(e):e}function Ws(n){const e=xt(n.mapValue.fields[af].timestampValue);return new re(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gE{constructor(e,t,s,i,r,a,l,u,h,f){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f}}const nr="(default)";class zs{constructor(e,t){this.projectId=e,this.database=t||nr}static empty(){return new zs("","")}get isDefaultDatabase(){return this.database===nr}isEqual(e){return e instanceof zs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf="__type__",yE="__max__",Pi={mapValue:{}},cf="__vector__",sr="value";function Mt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Xa(n)?4:EE(n)?9007199254740991:vE(n)?10:11:L(28295,{value:n})}function it(n,e){if(n===e)return!0;const t=Mt(n);if(t!==Mt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Ws(n).isEqual(Ws(e));case 3:return(function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const a=xt(i.timestampValue),l=xt(r.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,r){return Ot(i.bytesValue).isEqual(Ot(r.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,r){return he(i.geoPointValue.latitude)===he(r.geoPointValue.latitude)&&he(i.geoPointValue.longitude)===he(r.geoPointValue.longitude)})(n,e);case 2:return(function(i,r){if("integerValue"in i&&"integerValue"in r)return he(i.integerValue)===he(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const a=he(i.doubleValue),l=he(r.doubleValue);return a===l?tr(a)===tr(l):isNaN(a)&&isNaN(l)}return!1})(n,e);case 9:return xn(n.arrayValue.values||[],e.arrayValue.values||[],it);case 10:case 11:return(function(i,r){const a=i.mapValue.fields||{},l=r.mapValue.fields||{};if(Su(a)!==Su(l))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(l[u]===void 0||!it(a[u],l[u])))return!1;return!0})(n,e);default:return L(52216,{left:n})}}function $s(n,e){return(n.values||[]).find((t=>it(t,e)))!==void 0}function On(n,e){if(n===e)return 0;const t=Mt(n),s=Mt(e);if(t!==s)return z(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(n.booleanValue,e.booleanValue);case 2:return(function(r,a){const l=he(r.integerValue||r.doubleValue),u=he(a.integerValue||a.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1})(n,e);case 3:return bu(n.timestampValue,e.timestampValue);case 4:return bu(Ws(n),Ws(e));case 5:return Ko(n.stringValue,e.stringValue);case 6:return(function(r,a){const l=Ot(r),u=Ot(a);return l.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(r,a){const l=r.split("/"),u=a.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=z(l[h],u[h]);if(f!==0)return f}return z(l.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(r,a){const l=z(he(r.latitude),he(a.latitude));return l!==0?l:z(he(r.longitude),he(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Pu(n.arrayValue,e.arrayValue);case 10:return(function(r,a){var l,u,h,f;const p=r.fields||{},m=a.fields||{},C=(l=p[sr])===null||l===void 0?void 0:l.arrayValue,R=(u=m[sr])===null||u===void 0?void 0:u.arrayValue,D=z(((h=C==null?void 0:C.values)===null||h===void 0?void 0:h.length)||0,((f=R==null?void 0:R.values)===null||f===void 0?void 0:f.length)||0);return D!==0?D:Pu(C,R)})(n.mapValue,e.mapValue);case 11:return(function(r,a){if(r===Pi.mapValue&&a===Pi.mapValue)return 0;if(r===Pi.mapValue)return 1;if(a===Pi.mapValue)return-1;const l=r.fields||{},u=Object.keys(l),h=a.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const m=Ko(u[p],f[p]);if(m!==0)return m;const C=On(l[u[p]],h[f[p]]);if(C!==0)return C}return z(u.length,f.length)})(n.mapValue,e.mapValue);default:throw L(23264,{le:t})}}function bu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return z(n,e);const t=xt(n),s=xt(e),i=z(t.seconds,s.seconds);return i!==0?i:z(t.nanos,s.nanos)}function Pu(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=On(t[i],s[i]);if(r)return r}return z(t.length,s.length)}function Mn(n){return Qo(n)}function Qo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=xt(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Ot(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return M.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=Qo(r);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const a of s)r?r=!1:i+=",",i+=`${a}:${Qo(t.fields[a])}`;return i+"}"})(n.mapValue):L(61005,{value:n})}function Oi(n){switch(Mt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Rr(n);return e?16+Oi(e):16;case 5:return 2*n.stringValue.length;case 6:return Ot(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((i,r)=>i+Oi(r)),0)})(n.arrayValue);case 10:case 11:return(function(s){let i=0;return an(s.fields,((r,a)=>{i+=r.length+Oi(a)})),i})(n.mapValue);default:throw L(13486,{value:n})}}function Yo(n){return!!n&&"integerValue"in n}function Ja(n){return!!n&&"arrayValue"in n}function Nu(n){return!!n&&"nullValue"in n}function Du(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Mi(n){return!!n&&"mapValue"in n}function vE(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[lf])===null||t===void 0?void 0:t.stringValue)===cf}function Rs(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return an(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Rs(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Rs(n.arrayValue.values[t]);return e}return Object.assign({},n)}function EE(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===yE}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.value=e}static empty(){return new We({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!Mi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Rs(t)}setAll(e){let t=Se.emptyPath(),s={},i=[];e.forEach(((a,l)=>{if(!t.isImmediateParentOf(l)){const u=this.getFieldsMap(t);this.applyChanges(u,s,i),s={},i=[],t=l.popLast()}a?s[l.lastSegment()]=Rs(a):i.push(l.lastSegment())}));const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());Mi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return it(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];Mi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){an(t,((i,r)=>e[i]=r));for(const i of s)delete e[i]}clone(){return new We(Rs(this.value))}}function uf(n){const e=[];return an(n.fields,((t,s)=>{const i=new Se([t]);if(Mi(s)){const r=uf(s.mapValue).fields;if(r.length===0)e.push(i);else for(const a of r)e.push(i.child(a))}else e.push(i)})),new Qe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t,s,i,r,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=a,this.documentState=l}static newInvalidDocument(e){return new xe(e,0,U.min(),U.min(),U.min(),We.empty(),0)}static newFoundDocument(e,t,s,i){return new xe(e,1,t,U.min(),s,i,0)}static newNoDocument(e,t){return new xe(e,2,t,U.min(),U.min(),We.empty(),0)}static newUnknownDocument(e,t){return new xe(e,3,t,U.min(),U.min(),We.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=We.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=We.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,t){this.position=e,this.inclusive=t}}function ku(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],a=n.position[i];if(r.field.isKeyField()?s=M.comparator(M.fromName(a.referenceValue),t.key):s=On(a,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Vu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!it(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t="asc"){this.field=e,this.dir=t}}function TE(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{}class me extends hf{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new wE(e,t,s):t==="array-contains"?new SE(e,s):t==="in"?new RE(e,s):t==="not-in"?new bE(e,s):t==="array-contains-any"?new PE(e,s):new me(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new CE(e,s):new AE(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(On(t,this.value)):t!==null&&Mt(this.value)===Mt(t)&&this.matchesComparison(On(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return L(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class rt extends hf{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new rt(e,t)}matches(e){return df(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function df(n){return n.op==="and"}function ff(n){return IE(n)&&df(n)}function IE(n){for(const e of n.filters)if(e instanceof rt)return!1;return!0}function Xo(n){if(n instanceof me)return n.field.canonicalString()+n.op.toString()+Mn(n.value);if(ff(n))return n.filters.map((e=>Xo(e))).join(",");{const e=n.filters.map((t=>Xo(t))).join(",");return`${n.op}(${e})`}}function pf(n,e){return n instanceof me?(function(s,i){return i instanceof me&&s.op===i.op&&s.field.isEqual(i.field)&&it(s.value,i.value)})(n,e):n instanceof rt?(function(s,i){return i instanceof rt&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce(((r,a,l)=>r&&pf(a,i.filters[l])),!0):!1})(n,e):void L(19439)}function _f(n){return n instanceof me?(function(t){return`${t.field.canonicalString()} ${t.op} ${Mn(t.value)}`})(n):n instanceof rt?(function(t){return t.op.toString()+" {"+t.getFilters().map(_f).join(" ,")+"}"})(n):"Filter"}class wE extends me{constructor(e,t,s){super(e,t,s),this.key=M.fromName(s.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class CE extends me{constructor(e,t){super(e,"in",t),this.keys=mf("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class AE extends me{constructor(e,t){super(e,"not-in",t),this.keys=mf("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function mf(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>M.fromName(s.referenceValue)))}class SE extends me{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ja(t)&&$s(t.arrayValue,this.value)}}class RE extends me{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&$s(this.value.arrayValue,t)}}class bE extends me{constructor(e,t){super(e,"not-in",t)}matches(e){if($s(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!$s(this.value.arrayValue,t)}}class PE extends me{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ja(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>$s(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NE{constructor(e,t=null,s=[],i=[],r=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=a,this.endAt=l,this.Pe=null}}function xu(n,e=null,t=[],s=[],i=null,r=null,a=null){return new NE(n,e,t,s,i,r,a)}function Za(n){const e=B(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Xo(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(r){return r.field.canonicalString()+r.dir})(s))).join(","),Sr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>Mn(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>Mn(s))).join(",")),e.Pe=t}return e.Pe}function el(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!TE(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!pf(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Vu(n.startAt,e.startAt)&&Vu(n.endAt,e.endAt)}function Jo(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,t=null,s=[],i=[],r=null,a="F",l=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=a,this.startAt=l,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function DE(n,e,t,s,i,r,a,l){return new br(n,e,t,s,i,r,a,l)}function tl(n){return new br(n)}function Ou(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function kE(n){return n.collectionGroup!==null}function bs(n){const e=B(n);if(e.Te===null){e.Te=[];const t=new Set;for(const r of e.explicitOrderBy)e.Te.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new ge(Se.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(l=l.add(h.field))}))})),l})(e).forEach((r=>{t.has(r.canonicalString())||r.isKeyField()||e.Te.push(new rr(r,s))})),t.has(Se.keyField().canonicalString())||e.Te.push(new rr(Se.keyField(),s))}return e.Te}function et(n){const e=B(n);return e.Ie||(e.Ie=VE(e,bs(n))),e.Ie}function VE(n,e){if(n.limitType==="F")return xu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((i=>{const r=i.dir==="desc"?"asc":"desc";return new rr(i.field,r)}));const t=n.endAt?new ir(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new ir(n.startAt.position,n.startAt.inclusive):null;return xu(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Zo(n,e,t){return new br(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Pr(n,e){return el(et(n),et(e))&&n.limitType===e.limitType}function gf(n){return`${Za(et(n))}|lt:${n.limitType}`}function gn(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((i=>_f(i))).join(", ")}]`),Sr(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((i=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(i))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((i=>Mn(i))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((i=>Mn(i))).join(",")),`Target(${s})`})(et(n))}; limitType=${n.limitType})`}function Nr(n,e){return e.isFoundDocument()&&(function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):M.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)})(n,e)&&(function(s,i){for(const r of bs(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0})(n,e)&&(function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0})(n,e)&&(function(s,i){return!(s.startAt&&!(function(a,l,u){const h=ku(a,l,u);return a.inclusive?h<=0:h<0})(s.startAt,bs(s),i)||s.endAt&&!(function(a,l,u){const h=ku(a,l,u);return a.inclusive?h>=0:h>0})(s.endAt,bs(s),i))})(n,e)}function xE(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function yf(n){return(e,t)=>{let s=!1;for(const i of bs(n)){const r=OE(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function OE(n,e,t){const s=n.field.isKeyField()?M.comparator(e.key,t.key):(function(r,a,l){const u=a.data.field(r),h=l.data.field(r);return u!==null&&h!==null?On(u,h):L(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return L(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){an(this.inner,((t,s)=>{for(const[i,r]of s)e(i,r)}))}isEmpty(){return tf(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ME=new le(M.comparator);function vt(){return ME}const vf=new le(M.comparator);function ys(...n){let e=vf;for(const t of n)e=e.insert(t.key,t);return e}function Ef(n){let e=vf;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function Kt(){return Ps()}function Tf(){return Ps()}function Ps(){return new ln((n=>n.toString()),((n,e)=>n.isEqual(e)))}const LE=new le(M.comparator),FE=new ge(M.comparator);function K(...n){let e=FE;for(const t of n)e=e.add(t);return e}const UE=new ge(z);function BE(){return UE}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nl(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:tr(e)?"-0":e}}function If(n){return{integerValue:""+n}}function qE(n,e){return fE(e)?If(e):nl(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(){this._=void 0}}function jE(n,e,t){return n instanceof or?(function(i,r){const a={fields:{[rf]:{stringValue:sf},[af]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Xa(r)&&(r=Rr(r)),r&&(a.fields[of]=r),{mapValue:a}})(t,e):n instanceof Hs?Cf(n,e):n instanceof Gs?Af(n,e):(function(i,r){const a=wf(i,r),l=Mu(a)+Mu(i.Ee);return Yo(a)&&Yo(i.Ee)?If(l):nl(i.serializer,l)})(n,e)}function WE(n,e,t){return n instanceof Hs?Cf(n,e):n instanceof Gs?Af(n,e):t}function wf(n,e){return n instanceof ar?(function(s){return Yo(s)||(function(r){return!!r&&"doubleValue"in r})(s)})(e)?e:{integerValue:0}:null}class or extends Dr{}class Hs extends Dr{constructor(e){super(),this.elements=e}}function Cf(n,e){const t=Sf(e);for(const s of n.elements)t.some((i=>it(i,s)))||t.push(s);return{arrayValue:{values:t}}}class Gs extends Dr{constructor(e){super(),this.elements=e}}function Af(n,e){let t=Sf(e);for(const s of n.elements)t=t.filter((i=>!it(i,s)));return{arrayValue:{values:t}}}class ar extends Dr{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Mu(n){return he(n.integerValue||n.doubleValue)}function Sf(n){return Ja(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function zE(n,e){return n.field.isEqual(e.field)&&(function(s,i){return s instanceof Hs&&i instanceof Hs||s instanceof Gs&&i instanceof Gs?xn(s.elements,i.elements,it):s instanceof ar&&i instanceof ar?it(s.Ee,i.Ee):s instanceof or&&i instanceof or})(n.transform,e.transform)}class $E{constructor(e,t){this.version=e,this.transformResults=t}}class pt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new pt}static exists(e){return new pt(void 0,e)}static updateTime(e){return new pt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Li(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class kr{}function Rf(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Pf(n.key,pt.none()):new ni(n.key,n.data,pt.none());{const t=n.data,s=We.empty();let i=new ge(Se.comparator);for(let r of e.fields)if(!i.has(r)){let a=t.field(r);a===null&&r.length>1&&(r=r.popLast(),a=t.field(r)),a===null?s.delete(r):s.set(r,a),i=i.add(r)}return new cn(n.key,s,new Qe(i.toArray()),pt.none())}}function HE(n,e,t){n instanceof ni?(function(i,r,a){const l=i.value.clone(),u=Fu(i.fieldTransforms,r,a.transformResults);l.setAll(u),r.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):n instanceof cn?(function(i,r,a){if(!Li(i.precondition,r))return void r.convertToUnknownDocument(a.version);const l=Fu(i.fieldTransforms,r,a.transformResults),u=r.data;u.setAll(bf(i)),u.setAll(l),r.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(i,r,a){r.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Ns(n,e,t,s){return n instanceof ni?(function(r,a,l,u){if(!Li(r.precondition,a))return l;const h=r.value.clone(),f=Uu(r.fieldTransforms,u,a);return h.setAll(f),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null})(n,e,t,s):n instanceof cn?(function(r,a,l,u){if(!Li(r.precondition,a))return l;const h=Uu(r.fieldTransforms,u,a),f=a.data;return f.setAll(bf(r)),f.setAll(h),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map((p=>p.field)))})(n,e,t,s):(function(r,a,l){return Li(r.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l})(n,e,t)}function GE(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=wf(s.transform,i||null);r!=null&&(t===null&&(t=We.empty()),t.set(s.field,r))}return t||null}function Lu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&xn(s,i,((r,a)=>zE(r,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ni extends kr{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class cn extends kr{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function bf(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function Fu(n,e,t){const s=new Map;Z(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let i=0;i<t.length;i++){const r=n[i],a=r.transform,l=e.data.field(r.field);s.set(r.field,WE(a,l,t[i]))}return s}function Uu(n,e,t){const s=new Map;for(const i of n){const r=i.transform,a=t.data.field(i.field);s.set(i.field,jE(r,a,e))}return s}class Pf extends kr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class KE extends kr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QE{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&HE(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Ns(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Ns(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Tf();return this.mutations.forEach((i=>{const r=e.get(i.key),a=r.overlayedDocument;let l=this.applyToLocalView(a,r.mutatedFields);l=t.has(i.key)?null:l;const u=Rf(a,l);u!==null&&s.set(i.key,u),a.isValidDocument()||a.convertToNoDocument(U.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),K())}isEqual(e){return this.batchId===e.batchId&&xn(this.mutations,e.mutations,((t,s)=>Lu(t,s)))&&xn(this.baseMutations,e.baseMutations,((t,s)=>Lu(t,s)))}}class sl{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){Z(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let i=(function(){return LE})();const r=e.mutations;for(let a=0;a<r.length;a++)i=i.insert(r[a].key,s[a].version);return new sl(e,t,s,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YE{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XE{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fe,Y;function JE(n){switch(n){case P.OK:return L(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return L(15467,{code:n})}}function Nf(n){if(n===void 0)return yt("GRPC error has no .code"),P.UNKNOWN;switch(n){case fe.OK:return P.OK;case fe.CANCELLED:return P.CANCELLED;case fe.UNKNOWN:return P.UNKNOWN;case fe.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case fe.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case fe.INTERNAL:return P.INTERNAL;case fe.UNAVAILABLE:return P.UNAVAILABLE;case fe.UNAUTHENTICATED:return P.UNAUTHENTICATED;case fe.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case fe.NOT_FOUND:return P.NOT_FOUND;case fe.ALREADY_EXISTS:return P.ALREADY_EXISTS;case fe.PERMISSION_DENIED:return P.PERMISSION_DENIED;case fe.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case fe.ABORTED:return P.ABORTED;case fe.OUT_OF_RANGE:return P.OUT_OF_RANGE;case fe.UNIMPLEMENTED:return P.UNIMPLEMENTED;case fe.DATA_LOSS:return P.DATA_LOSS;default:return L(39323,{code:n})}}(Y=fe||(fe={}))[Y.OK=0]="OK",Y[Y.CANCELLED=1]="CANCELLED",Y[Y.UNKNOWN=2]="UNKNOWN",Y[Y.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Y[Y.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Y[Y.NOT_FOUND=5]="NOT_FOUND",Y[Y.ALREADY_EXISTS=6]="ALREADY_EXISTS",Y[Y.PERMISSION_DENIED=7]="PERMISSION_DENIED",Y[Y.UNAUTHENTICATED=16]="UNAUTHENTICATED",Y[Y.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Y[Y.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Y[Y.ABORTED=10]="ABORTED",Y[Y.OUT_OF_RANGE=11]="OUT_OF_RANGE",Y[Y.UNIMPLEMENTED=12]="UNIMPLEMENTED",Y[Y.INTERNAL=13]="INTERNAL",Y[Y.UNAVAILABLE=14]="UNAVAILABLE",Y[Y.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZE=new Pt([4294967295,4294967295],0);function Bu(n){const e=Jd().encode(n),t=new zd;return t.update(e),new Uint8Array(t.digest())}function qu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new Pt([t,s],0),new Pt([i,r],0)]}class il{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new vs(`Invalid padding: ${t}`);if(s<0)throw new vs(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new vs(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new vs(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Pt.fromNumber(this.fe)}pe(e,t,s){let i=e.add(t.multiply(Pt.fromNumber(s)));return i.compare(ZE)===1&&(i=new Pt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Bu(e),[s,i]=qu(t);for(let r=0;r<this.hashCount;r++){const a=this.pe(s,i,r);if(!this.ye(a))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),a=new il(r,i,t);return s.forEach((l=>a.insert(l))),a}insert(e){if(this.fe===0)return;const t=Bu(e),[s,i]=qu(t);for(let r=0;r<this.hashCount;r++){const a=this.pe(s,i,r);this.we(a)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class vs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,si.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Vr(U.min(),i,new le(z),vt(),K())}}class si{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new si(s,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(e,t,s,i){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=i}}class Df{constructor(e,t){this.targetId=e,this.De=t}}class kf{constructor(e,t,s=Re.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class ju{constructor(){this.ve=0,this.Ce=Wu(),this.Fe=Re.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=K(),t=K(),s=K();return this.Ce.forEach(((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:L(38017,{changeType:r})}})),new si(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=Wu()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Z(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class eT{constructor(e){this.We=e,this.Ge=new Map,this.ze=vt(),this.je=Ni(),this.Je=Ni(),this.He=new le(z)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:L(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,i)=>{this.nt(i)&&t(i)}))}it(e){const t=e.targetId,s=e.De.count,i=this.st(t);if(i){const r=i.target;if(Jo(r))if(s===0){const a=new M(r.path);this.Xe(t,a,xe.newNoDocument(a,U.min()))}else Z(s===1,20013,{expectedCount:s});else{const a=this.ot(t);if(a!==s){const l=this._t(e),u=l?this.ut(l,e,a):1;if(u!==0){this.rt(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,h)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let a,l;try{a=Ot(s).toUint8Array()}catch(u){if(u instanceof nf)return kt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new il(a,i,r)}catch(u){return kt(u instanceof vs?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.fe===0?null:l}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let i=0;return s.forEach((r=>{const a=this.We.lt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Xe(t,r,null),i++)})),i}Pt(e){const t=new Map;this.Ge.forEach(((r,a)=>{const l=this.st(a);if(l){if(r.current&&Jo(l.target)){const u=new M(l.target.path);this.Tt(u).has(a)||this.It(a,u)||this.Xe(a,u,xe.newNoDocument(u,e))}r.Ne&&(t.set(a,r.Le()),r.ke())}}));let s=K();this.Je.forEach(((r,a)=>{let l=!0;a.forEachWhile((u=>{const h=this.st(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(s=s.add(r))})),this.ze.forEach(((r,a)=>a.setReadTime(e)));const i=new Vr(e,t,this.He,this.ze,s);return this.ze=vt(),this.je=Ni(),this.Je=Ni(),this.He=new le(z),i}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new ju,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new ge(z),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new ge(z),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||x("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new ju),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Ni(){return new le(M.comparator)}function Wu(){return new le(M.comparator)}const tT={asc:"ASCENDING",desc:"DESCENDING"},nT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},sT={and:"AND",or:"OR"};class iT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ea(n,e){return n.useProto3Json||Sr(e)?e:{value:e}}function lr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Vf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function rT(n,e){return lr(n,e.toTimestamp())}function tt(n){return Z(!!n,49232),U.fromTimestamp((function(t){const s=xt(t);return new re(s.seconds,s.nanos)})(n))}function rl(n,e){return ta(n,e).canonicalString()}function ta(n,e){const t=(function(i){return new oe(["projects",i.projectId,"databases",i.database])})(n).child("documents");return e===void 0?t:t.child(e)}function xf(n){const e=oe.fromString(n);return Z(Uf(e),10190,{key:e.toString()}),e}function na(n,e){return rl(n.databaseId,e.path)}function Eo(n,e){const t=xf(e);if(t.get(1)!==n.databaseId.projectId)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new M(Mf(t))}function Of(n,e){return rl(n.databaseId,e)}function oT(n){const e=xf(n);return e.length===4?oe.emptyPath():Mf(e)}function sa(n){return new oe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Mf(n){return Z(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function zu(n,e,t){return{name:na(n,e),fields:t.value.mapValue.fields}}function aT(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:L(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=(function(h,f){return h.useProto3Json?(Z(f===void 0||typeof f=="string",58123),Re.fromBase64String(f||"")):(Z(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),Re.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&(function(h){const f=h.code===void 0?P.UNKNOWN:Nf(h.code);return new O(f,h.message||"")})(a);t=new kf(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=Eo(n,s.document.name),r=tt(s.document.updateTime),a=s.document.createTime?tt(s.document.createTime):U.min(),l=new We({mapValue:{fields:s.document.fields}}),u=xe.newFoundDocument(i,r,a,l),h=s.targetIds||[],f=s.removedTargetIds||[];t=new Fi(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=Eo(n,s.document),r=s.readTime?tt(s.readTime):U.min(),a=xe.newNoDocument(i,r),l=s.removedTargetIds||[];t=new Fi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=Eo(n,s.document),r=s.removedTargetIds||[];t=new Fi([],r,i,null)}else{if(!("filter"in e))return L(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,a=new XE(i,r),l=s.targetId;t=new Df(l,a)}}return t}function lT(n,e){let t;if(e instanceof ni)t={update:zu(n,e.key,e.value)};else if(e instanceof Pf)t={delete:na(n,e.key)};else if(e instanceof cn)t={update:zu(n,e.key,e.data),updateMask:gT(e.fieldMask)};else{if(!(e instanceof KE))return L(16599,{Rt:e.type});t={verify:na(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(r,a){const l=a.transform;if(l instanceof or)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Hs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Gs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ar)return{fieldPath:a.field.canonicalString(),increment:l.Ee};throw L(20930,{transform:a.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(i,r){return r.updateTime!==void 0?{updateTime:rT(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:L(27497)})(n,e.precondition)),t}function cT(n,e){return n&&n.length>0?(Z(e!==void 0,14353),n.map((t=>(function(i,r){let a=i.updateTime?tt(i.updateTime):tt(r);return a.isEqual(U.min())&&(a=tt(r)),new $E(a,i.transformResults||[])})(t,e)))):[]}function uT(n,e){return{documents:[Of(n,e.path)]}}function hT(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Of(n,i);const r=(function(h){if(h.length!==0)return Ff(rt.create(h,"and"))})(e.filters);r&&(t.structuredQuery.where=r);const a=(function(h){if(h.length!==0)return h.map((f=>(function(m){return{field:yn(m.field),direction:pT(m.dir)}})(f)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=ea(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{Vt:t,parent:i}}function dT(n){let e=oT(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){Z(s===1,65062);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let r=[];t.where&&(r=(function(p){const m=Lf(p);return m instanceof rt&&ff(m)?m.getFilters():[m]})(t.where));let a=[];t.orderBy&&(a=(function(p){return p.map((m=>(function(R){return new rr(vn(R.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(m)))})(t.orderBy));let l=null;t.limit&&(l=(function(p){let m;return m=typeof p=="object"?p.value:p,Sr(m)?null:m})(t.limit));let u=null;t.startAt&&(u=(function(p){const m=!!p.before,C=p.values||[];return new ir(C,m)})(t.startAt));let h=null;return t.endAt&&(h=(function(p){const m=!p.before,C=p.values||[];return new ir(C,m)})(t.endAt)),DE(e,i,a,r,l,"F",u,h)}function fT(n,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return L(28987,{purpose:i})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Lf(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=vn(t.unaryFilter.field);return me.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=vn(t.unaryFilter.field);return me.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=vn(t.unaryFilter.field);return me.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=vn(t.unaryFilter.field);return me.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return L(61313);default:return L(60726)}})(n):n.fieldFilter!==void 0?(function(t){return me.create(vn(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return L(58110);default:return L(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return rt.create(t.compositeFilter.filters.map((s=>Lf(s))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return L(1026)}})(t.compositeFilter.op))})(n):L(30097,{filter:n})}function pT(n){return tT[n]}function _T(n){return nT[n]}function mT(n){return sT[n]}function yn(n){return{fieldPath:n.canonicalString()}}function vn(n){return Se.fromServerFormat(n.fieldPath)}function Ff(n){return n instanceof me?(function(t){if(t.op==="=="){if(Du(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NAN"}};if(Nu(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Du(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NOT_NAN"}};if(Nu(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:yn(t.field),op:_T(t.op),value:t.value}}})(n):n instanceof rt?(function(t){const s=t.getFilters().map((i=>Ff(i)));return s.length===1?s[0]:{compositeFilter:{op:mT(t.op),filters:s}}})(n):L(54877,{filter:n})}function gT(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Uf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t,s,i,r=U.min(),a=U.min(),l=Re.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new Ct(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yT{constructor(e){this.gt=e}}function vT(n){const e=dT({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Zo(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ET{constructor(){this.Dn=new TT}addToCollectionParentIndex(e,t){return this.Dn.add(t),b.resolve()}getCollectionParents(e,t){return b.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return b.resolve()}deleteFieldIndex(e,t){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,t){return b.resolve()}getDocumentsMatchingTarget(e,t){return b.resolve(null)}getIndexType(e,t){return b.resolve(0)}getFieldIndexes(e,t){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,t){return b.resolve(Vt.min())}getMinOffsetFromCollectionGroup(e,t){return b.resolve(Vt.min())}updateCollectionGroup(e,t,s){return b.resolve()}updateIndexEntries(e,t){return b.resolve()}}class TT{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new ge(oe.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new ge(oe.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $u={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Bf=41943040;class Fe{static withCacheSize(e){return new Fe(e,Fe.DEFAULT_COLLECTION_PERCENTILE,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Fe.DEFAULT_COLLECTION_PERCENTILE=10,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Fe.DEFAULT=new Fe(Bf,Fe.DEFAULT_COLLECTION_PERCENTILE,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Fe.DISABLED=new Fe(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Ln(0)}static ur(){return new Ln(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hu="LruGarbageCollector",IT=1048576;function Gu([n,e],[t,s]){const i=z(n,t);return i===0?z(e,s):i}class wT{constructor(e){this.Tr=e,this.buffer=new ge(Gu),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();Gu(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class CT{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){x(Hu,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Hn(t)?x(Hu,"Ignoring IndexedDB error during garbage collection: ",t):await $n(t)}await this.Rr(3e5)}))}}class AT{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return b.resolve(Ar.ue);const s=new wT(t);return this.Vr.forEachTarget(e,(i=>s.Er(i.sequenceNumber))).next((()=>this.Vr.gr(e,(i=>s.Er(i))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(x("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve($u)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(x("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),$u):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,i,r,a,l,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(x("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,a=Date.now(),this.nthSequenceNumber(e,i)))).next((p=>(s=p,l=Date.now(),this.removeTargets(e,s,t)))).next((p=>(r=p,u=Date.now(),this.removeOrphanedDocuments(e,s)))).next((p=>(h=Date.now(),mn()<=Q.DEBUG&&x("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${i} in `+(l-a)+`ms
	Removed ${r} targets in `+(u-l)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:r,documentsRemoved:p}))))}}function ST(n,e){return new AT(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RT{constructor(){this.changes=new ln((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,xe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?b.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bT{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PT{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(s=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(s!==null&&Ns(s.mutation,i,Qe.empty(),re.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,K()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=K()){const i=Kt();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,s).next((r=>{let a=ys();return r.forEach(((l,u)=>{a=a.insert(l,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const s=Kt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,K())))}populateOverlays(e,t,s){const i=[];return s.forEach((r=>{t.has(r)||i.push(r)})),this.documentOverlayCache.getOverlays(e,i).next((r=>{r.forEach(((a,l)=>{t.set(a,l)}))}))}computeViews(e,t,s,i){let r=vt();const a=Ps(),l=(function(){return Ps()})();return t.forEach(((u,h)=>{const f=s.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof cn)?r=r.insert(h.key,h):f!==void 0?(a.set(h.key,f.mutation.getFieldMask()),Ns(f.mutation,h,f.mutation.getFieldMask(),re.now())):a.set(h.key,Qe.empty())})),this.recalculateAndSaveOverlays(e,r).next((u=>(u.forEach(((h,f)=>a.set(h,f))),t.forEach(((h,f)=>{var p;return l.set(h,new bT(f,(p=a.get(h))!==null&&p!==void 0?p:null))})),l)))}recalculateAndSaveOverlays(e,t){const s=Ps();let i=new le(((a,l)=>a-l)),r=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const l of a)l.keys().forEach((u=>{const h=t.get(u);if(h===null)return;let f=s.get(u)||Qe.empty();f=l.applyToLocalView(h,f),s.set(u,f);const p=(i.get(l.batchId)||K()).add(u);i=i.insert(l.batchId,p)}))})).next((()=>{const a=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,p=Tf();f.forEach((m=>{if(!r.has(m)){const C=Rf(t.get(m),s.get(m));C!==null&&p.set(m,C),r=r.add(m)}})),a.push(this.documentOverlayCache.saveOverlays(e,h,p))}return b.waitFor(a)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,i){return(function(a){return M.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):kE(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next((r=>{const a=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):b.resolve(Kt());let l=js,u=r;return a.next((h=>b.forEach(h,((f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),r.get(f)?b.resolve():this.remoteDocumentCache.getEntry(e,f).next((m=>{u=u.insert(f,m)}))))).next((()=>this.populateOverlays(e,h,r))).next((()=>this.computeViews(e,u,h,K()))).next((f=>({batchId:l,changes:Ef(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next((s=>{let i=ys();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let a=ys();return this.indexManager.getCollectionParents(e,r).next((l=>b.forEach(l,(u=>{const h=(function(p,m){return new br(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next((f=>{f.forEach(((p,m)=>{a=a.insert(p,m)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((a=>(r=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i)))).next((a=>{r.forEach(((u,h)=>{const f=h.getKey();a.get(f)===null&&(a=a.insert(f,xe.newInvalidDocument(f)))}));let l=ys();return a.forEach(((u,h)=>{const f=r.get(u);f!==void 0&&Ns(f.mutation,h,Qe.empty(),re.now()),Nr(t,h)&&(l=l.insert(u,h))})),l}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NT{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return b.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:tt(i.createTime)}})(t)),b.resolve()}getNamedQuery(e,t){return b.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(i){return{name:i.name,query:vT(i.bundledQuery),readTime:tt(i.readTime)}})(t)),b.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DT{constructor(){this.overlays=new le(M.comparator),this.kr=new Map}getOverlay(e,t){return b.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Kt();return b.forEach(t,(i=>this.getOverlay(e,i).next((r=>{r!==null&&s.set(i,r)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((i,r)=>{this.wt(e,t,r)})),b.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.kr.get(s);return i!==void 0&&(i.forEach((r=>this.overlays=this.overlays.remove(r))),this.kr.delete(s)),b.resolve()}getOverlaysForCollection(e,t,s){const i=Kt(),r=t.length+1,a=new M(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&u.largestBatchId>s&&i.set(u.getKey(),u)}return b.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new le(((h,f)=>h-f));const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let f=r.get(h.largestBatchId);f===null&&(f=Kt(),r=r.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=Kt(),u=r.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,f)=>l.set(h,f))),!(l.size()>=i)););return b.resolve(l)}wt(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const a=this.kr.get(i.largestBatchId).delete(s.key);this.kr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new YE(t,s));let r=this.kr.get(t);r===void 0&&(r=K(),this.kr.set(t,r)),this.kr.set(t,r.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kT{constructor(){this.sessionToken=Re.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(){this.qr=new ge(ve.Qr),this.$r=new ge(ve.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new ve(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new ve(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new M(new oe([])),s=new ve(t,e),i=new ve(t,e+1),r=[];return this.$r.forEachInRange([s,i],(a=>{this.Wr(a),r.push(a.key)})),r}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new M(new oe([])),s=new ve(t,e),i=new ve(t,e+1);let r=K();return this.$r.forEachInRange([s,i],(a=>{r=r.add(a.key)})),r}containsKey(e){const t=new ve(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class ve{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return M.comparator(e.key,t.key)||z(e.Hr,t.Hr)}static Ur(e,t){return z(e.Hr,t.Hr)||M.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VT{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new ge(ve.Qr)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new QE(r,t,s,i);this.mutationQueue.push(a);for(const l of i)this.Yr=this.Yr.add(new ve(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return b.resolve(a)}lookupMutationBatch(e,t){return b.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.Xr(s),r=i<0?0:i;return b.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?Ya:this.er-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new ve(t,0),i=new ve(t,Number.POSITIVE_INFINITY),r=[];return this.Yr.forEachInRange([s,i],(a=>{const l=this.Zr(a.Hr);r.push(l)})),b.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new ge(z);return t.forEach((i=>{const r=new ve(i,0),a=new ve(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([r,a],(l=>{s=s.add(l.Hr)}))})),b.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;M.isDocumentKey(r)||(r=r.child(""));const a=new ve(new M(r),0);let l=new ge(z);return this.Yr.forEachWhile((u=>{const h=u.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.Hr)),!0)}),a),b.resolve(this.ei(l))}ei(e){const t=[];return e.forEach((s=>{const i=this.Zr(s);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){Z(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return b.forEach(t.mutations,(i=>{const r=new ve(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new ve(t,0),i=this.Yr.firstAfterOrEqual(s);return b.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xT{constructor(e){this.ni=e,this.docs=(function(){return new le(M.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,a=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return b.resolve(s?s.document.mutableCopy():xe.newInvalidDocument(t))}getEntries(e,t){let s=vt();return t.forEach((i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():xe.newInvalidDocument(i))})),b.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=vt();const a=t.path,l=new M(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!a.isPrefixOf(h.path))break;h.path.length>a.length+1||cE(lE(f),s)<=0||(i.has(f.key)||Nr(t,f))&&(r=r.insert(f.key,f.mutableCopy()))}return b.resolve(r)}getAllFromCollectionGroup(e,t,s,i){L(9500)}ri(e,t){return b.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new OT(this)}getSize(e){return b.resolve(this.size)}}class OT extends RT{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(s)})),b.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MT{constructor(e){this.persistence=e,this.ii=new ln((t=>Za(t)),el),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.si=0,this.oi=new ol,this.targetCount=0,this._i=Ln.ar()}forEachTarget(e,t){return this.ii.forEach(((s,i)=>t(i))),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),b.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Ln(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,b.resolve()}updateTargetData(e,t){return this.hr(t),b.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.ii.forEach(((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.ii.delete(a),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)})),b.waitFor(r).next((()=>i))}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return b.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),b.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach((a=>{r.push(i.markPotentiallyOrphaned(e,a))})),b.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),b.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return b.resolve(s)}containsKey(e,t){return b.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(e,t){this.ai={},this.overlays={},this.ui=new Ar(0),this.ci=!1,this.ci=!0,this.li=new kT,this.referenceDelegate=e(this),this.hi=new MT(this),this.indexManager=new ET,this.remoteDocumentCache=(function(i){return new xT(i)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new yT(t),this.Ti=new NT(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new DT,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new VT(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){x("MemoryPersistence","Starting transaction:",e);const i=new LT(this.ui.next());return this.referenceDelegate.Ii(),s(i).next((r=>this.referenceDelegate.di(i).next((()=>r)))).toPromise().then((r=>(i.raiseOnCommittedEvent(),r)))}Ei(e,t){return b.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class LT extends hE{constructor(e){super(),this.currentSequenceNumber=e}}class al{constructor(e){this.persistence=e,this.Ai=new ol,this.Ri=null}static Vi(e){return new al(e)}get mi(){if(this.Ri)return this.Ri;throw L(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),b.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),b.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),b.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((i=>this.mi.add(i.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((r=>this.mi.add(r.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.mi,(s=>{const i=M.fromPath(s);return this.fi(e,i).next((r=>{r||t.removeEntry(i,U.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return b.or([()=>b.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class cr{constructor(e,t){this.persistence=e,this.gi=new ln((s=>pE(s.path)),((s,i)=>s.isEqual(i))),this.garbageCollector=ST(this,t)}static Vi(e,t){return new cr(e,t)}Ii(){}di(e){return b.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((i=>s+i))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return b.forEach(this.gi,((s,i)=>this.Sr(e,s,i).next((r=>r?b.resolve():t(i)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const i=this.persistence.getRemoteDocumentCache(),r=i.newChangeBuffer();return i.ri(e,(a=>this.Sr(e,a,t).next((l=>{l||(s++,r.removeEntry(a,U.min()))})))).next((()=>r.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),b.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),b.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),b.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),b.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Oi(e.data.value)),t}Sr(e,t,s){return b.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return b.resolve(i!==void 0&&i>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(e,t,s,i){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=i}static Es(e,t){let s=K(),i=K();for(const r of t.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new ll(e,t.fromCache,s,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FT{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UT{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return m_()?8:dE(wh())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.ps(e,t).next((a=>{r.result=a})).next((()=>{if(!r.result)return this.ys(e,t,i,s).next((a=>{r.result=a}))})).next((()=>{if(r.result)return;const a=new FT;return this.ws(e,t,a).next((l=>{if(r.result=l,this.Rs)return this.Ss(e,t,a,l.size)}))})).next((()=>r.result))}Ss(e,t,s,i){return s.documentReadCount<this.Vs?(mn()<=Q.DEBUG&&x("QueryEngine","SDK will not create cache indexes for query:",gn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),b.resolve()):(mn()<=Q.DEBUG&&x("QueryEngine","Query:",gn(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.fs*i?(mn()<=Q.DEBUG&&x("QueryEngine","The SDK decides to create cache indexes for query:",gn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,et(t))):b.resolve())}ps(e,t){if(Ou(t))return b.resolve(null);let s=et(t);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=Zo(t,null,"F"),s=et(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((r=>{const a=K(...r);return this.gs.getDocuments(e,a).next((l=>this.indexManager.getMinOffset(e,s).next((u=>{const h=this.bs(t,l);return this.Ds(t,h,a,u.readTime)?this.ps(e,Zo(t,null,"F")):this.vs(e,h,t,u)}))))})))))}ys(e,t,s,i){return Ou(t)||i.isEqual(U.min())?b.resolve(null):this.gs.getDocuments(e,s).next((r=>{const a=this.bs(t,r);return this.Ds(t,a,s,i)?b.resolve(null):(mn()<=Q.DEBUG&&x("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),gn(t)),this.vs(e,a,t,aE(i,js)).next((l=>l)))}))}bs(e,t){let s=new ge(yf(e));return t.forEach(((i,r)=>{Nr(e,r)&&(s=s.add(r))})),s}Ds(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}ws(e,t,s){return mn()<=Q.DEBUG&&x("QueryEngine","Using full collection scan to execute query:",gn(t)),this.gs.getDocumentsMatchingQuery(e,t,Vt.min(),s)}vs(e,t,s,i){return this.gs.getDocumentsMatchingQuery(e,s,i).next((r=>(t.forEach((a=>{r=r.insert(a.key,a)})),r)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cl="LocalStore",BT=3e8;class qT{constructor(e,t,s,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new le(z),this.Ms=new ln((r=>Za(r)),el),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new PT(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function jT(n,e,t,s){return new qT(n,e,t,s)}async function jf(n,e){const t=B(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next((r=>(i=r,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((r=>{const a=[],l=[];let u=K();for(const h of i){a.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of r){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(s,u).next((h=>({Bs:h,removedBatchIds:a,addedBatchIds:l})))}))}))}function WT(n,e){const t=B(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const i=e.batch.keys(),r=t.Os.newChangeBuffer({trackRemovals:!0});return(function(l,u,h,f){const p=h.batch,m=p.keys();let C=b.resolve();return m.forEach((R=>{C=C.next((()=>f.getEntry(u,R))).next((D=>{const N=h.docVersions.get(R);Z(N!==null,48541),D.version.compareTo(N)<0&&(p.applyToRemoteDocument(D,h),D.isValidDocument()&&(D.setReadTime(h.commitVersion),f.addEntry(D)))}))})),C.next((()=>l.mutationQueue.removeMutationBatch(u,p)))})(t,s,e,r).next((()=>r.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(l){let u=K();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(s,i)))}))}function Wf(n){const e=B(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function zT(n,e){const t=B(n),s=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(r=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const l=[];e.targetChanges.forEach(((f,p)=>{const m=i.get(p);if(!m)return;l.push(t.hi.removeMatchingKeys(r,f.removedDocuments,p).next((()=>t.hi.addMatchingKeys(r,f.addedDocuments,p))));let C=m.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(p)!==null?C=C.withResumeToken(Re.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):f.resumeToken.approximateByteSize()>0&&(C=C.withResumeToken(f.resumeToken,s)),i=i.insert(p,C),(function(D,N,j){return D.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=BT?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0})(m,C,f)&&l.push(t.hi.updateTargetData(r,C))}));let u=vt(),h=K();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,f))})),l.push($T(r,a,e.documentUpdates).next((f=>{u=f.Ls,h=f.ks}))),!s.isEqual(U.min())){const f=t.hi.getLastRemoteSnapshotVersion(r).next((p=>t.hi.setTargetsMetadata(r,r.currentSequenceNumber,s)));l.push(f)}return b.waitFor(l).next((()=>a.apply(r))).next((()=>t.localDocuments.getLocalViewOfDocuments(r,u,h))).next((()=>u))})).then((r=>(t.Fs=i,r)))}function $T(n,e,t){let s=K(),i=K();return t.forEach((r=>s=s.add(r))),e.getEntries(n,s).next((r=>{let a=vt();return t.forEach(((l,u)=>{const h=r.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(U.min())?(e.removeEntry(l,u.readTime),a=a.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),a=a.insert(l,u)):x(cl,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)})),{Ls:a,ks:i}}))}function HT(n,e){const t=B(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=Ya),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function GT(n,e){const t=B(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let i;return t.hi.getTargetData(s,e).next((r=>r?(i=r,b.resolve(i)):t.hi.allocateTargetId(s).next((a=>(i=new Ct(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,i).next((()=>i)))))))})).then((s=>{const i=t.Fs.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function ia(n,e,t){const s=B(n),i=s.Fs.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,(a=>s.persistence.referenceDelegate.removeTarget(a,i)))}catch(a){if(!Hn(a))throw a;x(cl,`Failed to update sequence numbers for target ${e}: ${a}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(i.target)}function Ku(n,e,t){const s=B(n);let i=U.min(),r=K();return s.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,h,f){const p=B(u),m=p.Ms.get(f);return m!==void 0?b.resolve(p.Fs.get(m)):p.hi.getTargetData(h,f)})(s,a,et(e)).next((l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(a,l.targetId).next((u=>{r=u}))})).next((()=>s.Cs.getDocumentsMatchingQuery(a,e,t?i:U.min(),t?r:K()))).next((l=>(KT(s,xE(e),l),{documents:l,qs:r})))))}function KT(n,e,t){let s=n.xs.get(e)||U.min();t.forEach(((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)})),n.xs.set(e,s)}class Qu{constructor(){this.activeTargetIds=BE()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class QT{constructor(){this.Fo=new Qu,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Qu,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YT{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yu="ConnectivityMonitor";class Xu{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){x(Yu,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){x(Yu,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Di=null;function ra(){return Di===null?Di=(function(){return 268435456+Math.round(2147483648*Math.random())})():Di++,"0x"+Di.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To="RestConnection",XT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class JT{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${i}`,this.Ko=this.databaseId.database===nr?`project_id=${s}`:`project_id=${s}&database_id=${i}`}Wo(e,t,s,i,r){const a=ra(),l=this.Go(e,t.toUriEncodedString());x(To,`Sending RPC '${e}' ${a}:`,l,s);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,i,r);const{host:h}=new URL(l),f=Qs(h);return this.jo(e,l,u,s,f).then((p=>(x(To,`Received RPC '${e}' ${a}: `,p),p)),(p=>{throw kt(To,`RPC '${e}' ${a} failed with error: `,p,"url: ",l,"request:",s),p}))}Jo(e,t,s,i,r,a){return this.Wo(e,t,s,i,r)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+zn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,r)=>e[r]=i)),s&&s.headers.forEach(((i,r)=>e[r]=i))}Go(e,t){const s=XT[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZT{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ke="WebChannelConnection";class eI extends JT{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,i,r){const a=ra();return new Promise(((l,u)=>{const h=new $d;h.setWithCredentials(!0),h.listenOnce(Hd.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case xi.NO_ERROR:const p=h.getResponseJson();x(ke,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(p)),l(p);break;case xi.TIMEOUT:x(ke,`RPC '${e}' ${a} timed out`),u(new O(P.DEADLINE_EXCEEDED,"Request time out"));break;case xi.HTTP_ERROR:const m=h.getStatus();if(x(ke,`RPC '${e}' ${a} failed with status:`,m,"response text:",h.getResponseText()),m>0){let C=h.getResponseJson();Array.isArray(C)&&(C=C[0]);const R=C==null?void 0:C.error;if(R&&R.status&&R.message){const D=(function(j){const q=j.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(q)>=0?q:P.UNKNOWN})(R.status);u(new O(D,R.message))}else u(new O(P.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new O(P.UNAVAILABLE,"Connection failed."));break;default:L(9055,{c_:e,streamId:a,l_:h.getLastErrorCode(),h_:h.getLastError()})}}finally{x(ke,`RPC '${e}' ${a} completed.`)}}));const f=JSON.stringify(i);x(ke,`RPC '${e}' ${a} sending request:`,i),h.send(t,"POST",f,s,15)}))}P_(e,t,s){const i=ra(),r=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Qd(),l=Kd(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,t,s),u.encodeInitMessageHeaders=!0;const f=r.join("");x(ke,`Creating RPC '${e}' stream ${i}: ${f}`,u);const p=a.createWebChannel(f,u);this.T_(p);let m=!1,C=!1;const R=new ZT({Ho:N=>{C?x(ke,`Not sending because RPC '${e}' stream ${i} is closed:`,N):(m||(x(ke,`Opening RPC '${e}' stream ${i} transport.`),p.open(),m=!0),x(ke,`RPC '${e}' stream ${i} sending:`,N),p.send(N))},Yo:()=>p.close()}),D=(N,j,q)=>{N.listen(j,(G=>{try{q(G)}catch(ce){setTimeout((()=>{throw ce}),0)}}))};return D(p,gs.EventType.OPEN,(()=>{C||(x(ke,`RPC '${e}' stream ${i} transport opened.`),R.s_())})),D(p,gs.EventType.CLOSE,(()=>{C||(C=!0,x(ke,`RPC '${e}' stream ${i} transport closed`),R.__(),this.I_(p))})),D(p,gs.EventType.ERROR,(N=>{C||(C=!0,kt(ke,`RPC '${e}' stream ${i} transport errored. Name:`,N.name,"Message:",N.message),R.__(new O(P.UNAVAILABLE,"The operation could not be completed")))})),D(p,gs.EventType.MESSAGE,(N=>{var j;if(!C){const q=N.data[0];Z(!!q,16349);const G=q,ce=(G==null?void 0:G.error)||((j=G[0])===null||j===void 0?void 0:j.error);if(ce){x(ke,`RPC '${e}' stream ${i} received error:`,ce);const at=ce.status;let Ie=(function(v){const E=fe[v];if(E!==void 0)return Nf(E)})(at),I=ce.message;Ie===void 0&&(Ie=P.INTERNAL,I="Unknown error status: "+at+" with message "+ce.message),C=!0,R.__(new O(Ie,I)),p.close()}else x(ke,`RPC '${e}' stream ${i} received:`,q),R.a_(q)}})),D(l,Gd.STAT_EVENT,(N=>{N.stat===Go.PROXY?x(ke,`RPC '${e}' stream ${i} detected buffering proxy`):N.stat===Go.NOPROXY&&x(ke,`RPC '${e}' stream ${i} detected no buffering proxy`)})),setTimeout((()=>{R.o_()}),0),R}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Io(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(n){return new iT(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(e,t,s=1e3,i=1.5,r=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=i,this.A_=r,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-s);i>0&&x("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju="PersistentStream";class $f{constructor(e,t,s,i,r,a,l,u){this.Fi=e,this.w_=s,this.S_=i,this.connection=r,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new zf(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(yt(t.toString()),yt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,i])=>{this.b_===t&&this.W_(s,i)}),(s=>{e((()=>{const i=new O(P.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(i)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((i=>{s((()=>this.G_(i)))})),this.stream.onMessage((i=>{s((()=>++this.C_==1?this.j_(i):this.onNext(i)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return x(Ju,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(x(Ju,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class tI extends $f{constructor(e,t,s,i,r,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,a),this.serializer=r}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=aT(this.serializer,e),s=(function(r){if(!("targetChange"in r))return U.min();const a=r.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?tt(a.readTime):U.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=sa(this.serializer),t.addTarget=(function(r,a){let l;const u=a.target;if(l=Jo(u)?{documents:uT(r,u)}:{query:hT(r,u).Vt},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Vf(r,a.resumeToken);const h=ea(r,a.expectedCount);h!==null&&(l.expectedCount=h)}else if(a.snapshotVersion.compareTo(U.min())>0){l.readTime=lr(r,a.snapshotVersion.toTimestamp());const h=ea(r,a.expectedCount);h!==null&&(l.expectedCount=h)}return l})(this.serializer,e);const s=fT(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=sa(this.serializer),t.removeTarget=e,this.k_(t)}}class nI extends $f{constructor(e,t,s,i,r,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,a),this.serializer=r}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Z(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Z(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Z(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=cT(e.writeResults,e.commitTime),s=tt(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=sa(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>lT(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sI{}class iI extends sI{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([r,a])=>this.connection.Wo(e,ta(t,s),i,r,a))).catch((r=>{throw r.name==="FirebaseError"?(r.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new O(P.UNKNOWN,r.toString())}))}Jo(e,t,s,i,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,l])=>this.connection.Jo(e,ta(t,s),i,a,l,r))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new O(P.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class rI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(yt(t),this._a=!1):x("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn="RemoteStore";class oI{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=r,this.Ea.xo((a=>{s.enqueueAndForget((async()=>{un(this)&&(x(sn,"Restarting streams for network reachability change."),await(async function(u){const h=B(u);h.Ia.add(4),await ii(h),h.Aa.set("Unknown"),h.Ia.delete(4),await Or(h)})(this))}))})),this.Aa=new rI(s,i)}}async function Or(n){if(un(n))for(const e of n.da)await e(!0)}async function ii(n){for(const e of n.da)await e(!1)}function Hf(n,e){const t=B(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),fl(t)?dl(t):Gn(t).x_()&&hl(t,e))}function ul(n,e){const t=B(n),s=Gn(t);t.Ta.delete(e),s.x_()&&Gf(t,e),t.Ta.size===0&&(s.x_()?s.B_():un(t)&&t.Aa.set("Unknown"))}function hl(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Gn(n).H_(e)}function Gf(n,e){n.Ra.$e(e),Gn(n).Y_(e)}function dl(n){n.Ra=new eT({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Gn(n).start(),n.Aa.aa()}function fl(n){return un(n)&&!Gn(n).M_()&&n.Ta.size>0}function un(n){return B(n).Ia.size===0}function Kf(n){n.Ra=void 0}async function aI(n){n.Aa.set("Online")}async function lI(n){n.Ta.forEach(((e,t)=>{hl(n,e)}))}async function cI(n,e){Kf(n),fl(n)?(n.Aa.la(e),dl(n)):n.Aa.set("Unknown")}async function uI(n,e,t){if(n.Aa.set("Online"),e instanceof kf&&e.state===2&&e.cause)try{await(async function(i,r){const a=r.cause;for(const l of r.targetIds)i.Ta.has(l)&&(await i.remoteSyncer.rejectListen(l,a),i.Ta.delete(l),i.Ra.removeTarget(l))})(n,e)}catch(s){x(sn,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await ur(n,s)}else if(e instanceof Fi?n.Ra.Ye(e):e instanceof Df?n.Ra.it(e):n.Ra.et(e),!t.isEqual(U.min()))try{const s=await Wf(n.localStore);t.compareTo(s)>=0&&await(function(r,a){const l=r.Ra.Pt(a);return l.targetChanges.forEach(((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=r.Ta.get(h);f&&r.Ta.set(h,f.withResumeToken(u.resumeToken,a))}})),l.targetMismatches.forEach(((u,h)=>{const f=r.Ta.get(u);if(!f)return;r.Ta.set(u,f.withResumeToken(Re.EMPTY_BYTE_STRING,f.snapshotVersion)),Gf(r,u);const p=new Ct(f.target,u,h,f.sequenceNumber);hl(r,p)})),r.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(s){x(sn,"Failed to raise snapshot:",s),await ur(n,s)}}async function ur(n,e,t){if(!Hn(e))throw e;n.Ia.add(1),await ii(n),n.Aa.set("Offline"),t||(t=()=>Wf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{x(sn,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Or(n)}))}function Qf(n,e){return e().catch((t=>ur(n,t,e)))}async function Mr(n){const e=B(n),t=Lt(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Ya;for(;hI(e);)try{const i=await HT(e.localStore,s);if(i===null){e.Pa.length===0&&t.B_();break}s=i.batchId,dI(e,i)}catch(i){await ur(e,i)}Yf(e)&&Xf(e)}function hI(n){return un(n)&&n.Pa.length<10}function dI(n,e){n.Pa.push(e);const t=Lt(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Yf(n){return un(n)&&!Lt(n).M_()&&n.Pa.length>0}function Xf(n){Lt(n).start()}async function fI(n){Lt(n).na()}async function pI(n){const e=Lt(n);for(const t of n.Pa)e.X_(t.mutations)}async function _I(n,e,t){const s=n.Pa.shift(),i=sl.from(s,e,t);await Qf(n,(()=>n.remoteSyncer.applySuccessfulWrite(i))),await Mr(n)}async function mI(n,e){e&&Lt(n).Z_&&await(async function(s,i){if((function(a){return JE(a)&&a!==P.ABORTED})(i.code)){const r=s.Pa.shift();Lt(s).N_(),await Qf(s,(()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i))),await Mr(s)}})(n,e),Yf(n)&&Xf(n)}async function Zu(n,e){const t=B(n);t.asyncQueue.verifyOperationInProgress(),x(sn,"RemoteStore received new credentials");const s=un(t);t.Ia.add(3),await ii(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Or(t)}async function gI(n,e){const t=B(n);e?(t.Ia.delete(2),await Or(t)):e||(t.Ia.add(2),await ii(t),t.Aa.set("Unknown"))}function Gn(n){return n.Va||(n.Va=(function(t,s,i){const r=B(t);return r.ia(),new tI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)})(n.datastore,n.asyncQueue,{Zo:aI.bind(null,n),e_:lI.bind(null,n),n_:cI.bind(null,n),J_:uI.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),fl(n)?dl(n):n.Aa.set("Unknown")):(await n.Va.stop(),Kf(n))}))),n.Va}function Lt(n){return n.ma||(n.ma=(function(t,s,i){const r=B(t);return r.ia(),new nI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:fI.bind(null,n),n_:mI.bind(null,n),ea:pI.bind(null,n),ta:_I.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await Mr(n)):(await n.ma.stop(),n.Pa.length>0&&(x(sn,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Qt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const a=Date.now()+s,l=new pl(e,t,a,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function _l(n,e){if(yt("AsyncQueue",`${e}: ${n}`),Hn(n))return new O(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{static emptySet(e){return new An(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||M.comparator(t.key,s.key):(t,s)=>M.comparator(t.key,s.key),this.keyedMap=ys(),this.sortedSet=new le(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof An)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new An;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh{constructor(){this.fa=new le(M.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):L(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Fn{constructor(e,t,s,i,r,a,l,u,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const a=[];return t.forEach((l=>{a.push({type:0,doc:l})})),new Fn(e,t,An.emptySet(t),a,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Pr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yI{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class vI{constructor(){this.queries=th(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const i=B(t),r=i.queries;i.queries=th(),r.forEach(((a,l)=>{for(const u of l.wa)u.onError(s)}))})(this,new O(P.ABORTED,"Firestore shutting down"))}}function th(){return new ln((n=>gf(n)),Pr)}async function EI(n,e){const t=B(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.Sa()&&e.ba()&&(s=2):(r=new yI,s=e.ba()?0:1);try{switch(s){case 0:r.ya=await t.onListen(i,!0);break;case 1:r.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const l=_l(a,`Initialization of query '${gn(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.wa.push(e),e.va(t.onlineState),r.ya&&e.Ca(r.ya)&&ml(t)}async function TI(n,e){const t=B(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const a=r.wa.indexOf(e);a>=0&&(r.wa.splice(a,1),r.wa.length===0?i=e.ba()?0:1:!r.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function II(n,e){const t=B(n);let s=!1;for(const i of e){const r=i.query,a=t.queries.get(r);if(a){for(const l of a.wa)l.Ca(i)&&(s=!0);a.ya=i}}s&&ml(t)}function wI(n,e,t){const s=B(n),i=s.queries.get(e);if(i)for(const r of i.wa)r.onError(t);s.queries.delete(e)}function ml(n){n.Da.forEach((e=>{e.next()}))}var oa,nh;(nh=oa||(oa={})).Fa="default",nh.Cache="cache";class CI{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new Fn(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Fn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==oa.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e){this.key=e}}class Zf{constructor(e){this.key=e}}class AI{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=K(),this.mutatedKeys=K(),this.Xa=yf(e),this.eu=new An(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new eh,i=t?t.eu:this.eu;let r=t?t.mutatedKeys:this.mutatedKeys,a=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,p)=>{const m=i.get(f),C=Nr(this.query,p)?p:null,R=!!m&&this.mutatedKeys.has(m.key),D=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let N=!1;m&&C?m.data.isEqual(C.data)?R!==D&&(s.track({type:3,doc:C}),N=!0):this.iu(m,C)||(s.track({type:2,doc:C}),N=!0,(u&&this.Xa(C,u)>0||h&&this.Xa(C,h)<0)&&(l=!0)):!m&&C?(s.track({type:0,doc:C}),N=!0):m&&!C&&(s.track({type:1,doc:m}),N=!0,(u||h)&&(l=!0)),N&&(C?(a=a.add(C),r=D?r.add(f):r.delete(f)):(a=a.delete(f),r=r.delete(f)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),r=r.delete(f.key),s.track({type:1,doc:f})}return{eu:a,ru:s,Ds:l,mutatedKeys:r}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort(((f,p)=>(function(C,R){const D=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return L(20277,{At:N})}};return D(C)-D(R)})(f.type,p.type)||this.Xa(f.doc,p.doc))),this.su(s),i=i!=null&&i;const l=t&&!i?this.ou():[],u=this.Za.size===0&&this.current&&!i?1:0,h=u!==this.Ya;return this.Ya=u,a.length!==0||h?{snapshot:new Fn(this.query,e.eu,r,a,e.mutatedKeys,u===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new eh,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=K(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Zf(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new Jf(s))})),t}uu(e){this.Ha=e.qs,this.Za=K();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Fn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const gl="SyncEngine";class SI{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class RI{constructor(e){this.key=e,this.lu=!1}}class bI{constructor(e,t,s,i,r,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new ln((l=>gf(l)),Pr),this.Tu=new Map,this.Iu=new Set,this.du=new le(M.comparator),this.Eu=new Map,this.Au=new ol,this.Ru={},this.Vu=new Map,this.mu=Ln.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function PI(n,e,t=!0){const s=rp(n);let i;const r=s.Pu.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.cu()):i=await ep(s,e,t,!0),i}async function NI(n,e){const t=rp(n);await ep(t,e,!0,!1)}async function ep(n,e,t,s){const i=await GT(n.localStore,et(e)),r=i.targetId,a=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await DI(n,e,r,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&Hf(n.remoteStore,i),l}async function DI(n,e,t,s,i){n.gu=(p,m,C)=>(async function(D,N,j,q){let G=N.view.nu(j);G.Ds&&(G=await Ku(D.localStore,N.query,!1).then((({documents:I})=>N.view.nu(I,G))));const ce=q&&q.targetChanges.get(N.targetId),at=q&&q.targetMismatches.get(N.targetId)!=null,Ie=N.view.applyChanges(G,D.isPrimaryClient,ce,at);return ih(D,N.targetId,Ie._u),Ie.snapshot})(n,p,m,C);const r=await Ku(n.localStore,e,!0),a=new AI(e,r.qs),l=a.nu(r.documents),u=si.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=a.applyChanges(l,n.isPrimaryClient,u);ih(n,t,h._u);const f=new SI(e,t,a);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),h.snapshot}async function kI(n,e,t){const s=B(n),i=s.Pu.get(e),r=s.Tu.get(i.targetId);if(r.length>1)return s.Tu.set(i.targetId,r.filter((a=>!Pr(a,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await ia(s.localStore,i.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(i.targetId),t&&ul(s.remoteStore,i.targetId),aa(s,i.targetId)})).catch($n)):(aa(s,i.targetId),await ia(s.localStore,i.targetId,!0))}async function VI(n,e){const t=B(n),s=t.Pu.get(e),i=t.Tu.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),ul(t.remoteStore,s.targetId))}async function xI(n,e,t){const s=qI(n);try{const i=await(function(a,l){const u=B(a),h=re.now(),f=l.reduce(((C,R)=>C.add(R.key)),K());let p,m;return u.persistence.runTransaction("Locally write mutations","readwrite",(C=>{let R=vt(),D=K();return u.Os.getEntries(C,f).next((N=>{R=N,R.forEach(((j,q)=>{q.isValidDocument()||(D=D.add(j))}))})).next((()=>u.localDocuments.getOverlayedDocuments(C,R))).next((N=>{p=N;const j=[];for(const q of l){const G=GE(q,p.get(q.key).overlayedDocument);G!=null&&j.push(new cn(q.key,G,uf(G.value.mapValue),pt.exists(!0)))}return u.mutationQueue.addMutationBatch(C,h,j,l)})).next((N=>{m=N;const j=N.applyToLocalDocumentSet(p,D);return u.documentOverlayCache.saveOverlays(C,N.batchId,j)}))})).then((()=>({batchId:m.batchId,changes:Ef(p)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),(function(a,l,u){let h=a.Ru[a.currentUser.toKey()];h||(h=new le(z)),h=h.insert(l,u),a.Ru[a.currentUser.toKey()]=h})(s,i.batchId,t),await ri(s,i.changes),await Mr(s.remoteStore)}catch(i){const r=_l(i,"Failed to persist write");t.reject(r)}}async function tp(n,e){const t=B(n);try{const s=await zT(t.localStore,e);e.targetChanges.forEach(((i,r)=>{const a=t.Eu.get(r);a&&(Z(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?a.lu=!0:i.modifiedDocuments.size>0?Z(a.lu,14607):i.removedDocuments.size>0&&(Z(a.lu,42227),a.lu=!1))})),await ri(t,s,e)}catch(s){await $n(s)}}function sh(n,e,t){const s=B(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Pu.forEach(((r,a)=>{const l=a.view.va(e);l.snapshot&&i.push(l.snapshot)})),(function(a,l){const u=B(a);u.onlineState=l;let h=!1;u.queries.forEach(((f,p)=>{for(const m of p.wa)m.va(l)&&(h=!0)})),h&&ml(u)})(s.eventManager,e),i.length&&s.hu.J_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function OI(n,e,t){const s=B(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Eu.get(e),r=i&&i.key;if(r){let a=new le(M.comparator);a=a.insert(r,xe.newNoDocument(r,U.min()));const l=K().add(r),u=new Vr(U.min(),new Map,new le(z),a,l);await tp(s,u),s.du=s.du.remove(r),s.Eu.delete(e),yl(s)}else await ia(s.localStore,e,!1).then((()=>aa(s,e,t))).catch($n)}async function MI(n,e){const t=B(n),s=e.batch.batchId;try{const i=await WT(t.localStore,e);sp(t,s,null),np(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await ri(t,i)}catch(i){await $n(i)}}async function LI(n,e,t){const s=B(n);try{const i=await(function(a,l){const u=B(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next((p=>(Z(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>u.localDocuments.getDocuments(h,f)))}))})(s.localStore,e);sp(s,e,t),np(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await ri(s,i)}catch(i){await $n(i)}}function np(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function sp(n,e,t){const s=B(n);let i=s.Ru[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ru[s.currentUser.toKey()]=i}}function aa(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Tu.get(e))n.Pu.delete(s),t&&n.hu.pu(s,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((s=>{n.Au.containsKey(s)||ip(n,s)}))}function ip(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(ul(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),yl(n))}function ih(n,e,t){for(const s of t)s instanceof Jf?(n.Au.addReference(s.key,e),FI(n,s)):s instanceof Zf?(x(gl,"Document no longer in limbo: "+s.key),n.Au.removeReference(s.key,e),n.Au.containsKey(s.key)||ip(n,s.key)):L(19791,{yu:s})}function FI(n,e){const t=e.key,s=t.path.canonicalString();n.du.get(t)||n.Iu.has(s)||(x(gl,"New document in limbo: "+t),n.Iu.add(s),yl(n))}function yl(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new M(oe.fromString(e)),s=n.mu.next();n.Eu.set(s,new RI(t)),n.du=n.du.insert(t,s),Hf(n.remoteStore,new Ct(et(tl(t.path)),s,"TargetPurposeLimboResolution",Ar.ue))}}async function ri(n,e,t){const s=B(n),i=[],r=[],a=[];s.Pu.isEmpty()||(s.Pu.forEach(((l,u)=>{a.push(s.gu(u,e,t).then((h=>{var f;if((h||t)&&s.isPrimaryClient){const p=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;s.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){i.push(h);const p=ll.Es(u.targetId,h);r.push(p)}})))})),await Promise.all(a),s.hu.J_(i),await(async function(u,h){const f=B(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>b.forEach(h,(m=>b.forEach(m.Is,(C=>f.persistence.referenceDelegate.addReference(p,m.targetId,C))).next((()=>b.forEach(m.ds,(C=>f.persistence.referenceDelegate.removeReference(p,m.targetId,C)))))))))}catch(p){if(!Hn(p))throw p;x(cl,"Failed to update sequence numbers: "+p)}for(const p of h){const m=p.targetId;if(!p.fromCache){const C=f.Fs.get(m),R=C.snapshotVersion,D=C.withLastLimboFreeSnapshotVersion(R);f.Fs=f.Fs.insert(m,D)}}})(s.localStore,r))}async function UI(n,e){const t=B(n);if(!t.currentUser.isEqual(e)){x(gl,"User change. New user:",e.toKey());const s=await jf(t.localStore,e);t.currentUser=e,(function(r,a){r.Vu.forEach((l=>{l.forEach((u=>{u.reject(new O(P.CANCELLED,a))}))})),r.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ri(t,s.Bs)}}function BI(n,e){const t=B(n),s=t.Eu.get(e);if(s&&s.lu)return K().add(s.key);{let i=K();const r=t.Tu.get(e);if(!r)return i;for(const a of r){const l=t.Pu.get(a);i=i.unionWith(l.view.tu)}return i}}function rp(n){const e=B(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=tp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=BI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=OI.bind(null,e),e.hu.J_=II.bind(null,e.eventManager),e.hu.pu=wI.bind(null,e.eventManager),e}function qI(n){const e=B(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=MI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=LI.bind(null,e),e}class hr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=xr(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return jT(this.persistence,new UT,e.initialUser,this.serializer)}Du(e){return new qf(al.Vi,this.serializer)}bu(e){return new QT}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}hr.provider={build:()=>new hr};class jI extends hr{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Z(this.persistence.referenceDelegate instanceof cr,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new CT(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Fe.withCacheSize(this.cacheSizeBytes):Fe.DEFAULT;return new qf((s=>cr.Vi(s,t)),this.serializer)}}class la{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>sh(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=UI.bind(null,this.syncEngine),await gI(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new vI})()}createDatastore(e){const t=xr(e.databaseInfo.databaseId),s=(function(r){return new eI(r)})(e.databaseInfo);return(function(r,a,l,u){return new iI(r,a,l,u)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,i,r,a,l){return new oI(s,i,r,a,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>sh(this.syncEngine,t,0)),(function(){return Xu.C()?new Xu:new YT})())}createSyncEngine(e,t){return(function(i,r,a,l,u,h,f){const p=new bI(i,r,a,l,u,h);return f&&(p.fu=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(i){const r=B(i);x(sn,"RemoteStore shutting down."),r.Ia.add(5),await ii(r),r.Ea.shutdown(),r.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}la.provider={build:()=>new la};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WI{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):yt("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="FirestoreClient";class zI{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=Ve.UNAUTHENTICATED,this.clientId=Ka.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,(async a=>{x(Ft,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(s,(a=>(x(Ft,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Qt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=_l(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function wo(n,e){n.asyncQueue.verifyOperationInProgress(),x(Ft,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async i=>{s.isEqual(i)||(await jf(e.localStore,i),s=i)})),e.persistence.setDatabaseDeletedListener((()=>{kt("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{x("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((i=>{kt("Terminating Firestore due to IndexedDb database deletion failed",i)}))})),n._offlineComponents=e}async function rh(n,e){n.asyncQueue.verifyOperationInProgress();const t=await $I(n);x(Ft,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>Zu(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,i)=>Zu(e.remoteStore,i))),n._onlineComponents=e}async function $I(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){x(Ft,"Using user provided OfflineComponentProvider");try{await wo(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(i){return i.name==="FirebaseError"?i.code===P.FAILED_PRECONDITION||i.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(t))throw t;kt("Error using user provided cache. Falling back to memory cache: "+t),await wo(n,new hr)}}else x(Ft,"Using default OfflineComponentProvider"),await wo(n,new jI(void 0));return n._offlineComponents}async function op(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(x(Ft,"Using user provided OnlineComponentProvider"),await rh(n,n._uninitializedComponentsProvider._online)):(x(Ft,"Using default OnlineComponentProvider"),await rh(n,new la))),n._onlineComponents}function HI(n){return op(n).then((e=>e.syncEngine))}async function oh(n){const e=await op(n),t=e.eventManager;return t.onListen=PI.bind(null,e.syncEngine),t.onUnlisten=kI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=NI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=VI.bind(null,e.syncEngine),t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ap(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ah=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp="firestore.googleapis.com",lh=!0;class ch{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new O(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=lp,this.ssl=lh}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:lh;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Bf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<IT)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}oE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ap((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,i){return s.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class vl{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ch({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ch(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new Yv;switch(s.type){case"firstParty":return new eE(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new O(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=ah.get(t);s&&(x("ComponentProvider","Removing Datastore"),ah.delete(t),s.terminate())})(this),Promise.resolve()}}function GI(n,e,t,s={}){var i;n=Cn(n,vl);const r=Qs(e),a=n._getSettings(),l=Object.assign(Object.assign({},a),{emulatorOptions:n._getEmulatorOptions()}),u=`${e}:${t}`;r&&(Eh(`https://${u}`),Ih("Firestore",!0)),a.host!==lp&&a.host!==u&&kt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h=Object.assign(Object.assign({},a),{host:u,ssl:r,emulatorOptions:s});if(!ks(h,l)&&(n._setSettings(h),s.mockUserToken)){let f,p;if(typeof s.mockUserToken=="string")f=s.mockUserToken,p=Ve.MOCK_USER;else{f=Th(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const m=s.mockUserToken.sub||s.mockUserToken.user_id;if(!m)throw new O(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new Ve(m)}n._authCredentials=new Xv(new Xd(f,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Lr(this.firestore,e,this._query)}}class Te{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ks(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Te(this.firestore,e,this._key)}toJSON(){return{type:Te._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(ti(t,Te._jsonSchema))return new Te(e,s||null,new M(oe.fromString(t.referencePath)))}}Te._jsonSchemaVersion="firestore/documentReference/1.0",Te._jsonSchema={type:_e("string",Te._jsonSchemaVersion),referencePath:_e("string")};class Ks extends Lr{constructor(e,t,s){super(e,t,tl(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Te(this.firestore,null,new M(e))}withConverter(e){return new Ks(this.firestore,e,this._path)}}function vw(n,e,...t){if(n=Xe(n),arguments.length===1&&(e=Ka.newId()),rE("doc","path",e),n instanceof vl){const s=oe.fromString(e,...t);return Iu(s),new Te(n,null,new M(s))}{if(!(n instanceof Te||n instanceof Ks))throw new O(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(oe.fromString(e,...t));return Iu(s),new Te(n.firestore,n instanceof Ks?n.converter:null,new M(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh="AsyncQueue";class hh{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new zf(this,"async_queue_retry"),this.oc=()=>{const s=Io();s&&x(uh,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=Io();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Io();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Qt;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Hn(e))throw e;x(uh,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,yt("INTERNAL UNHANDLED ERROR: ",dh(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=pl.createAndSchedule(this,e,t,s,(r=>this.lc(r)));return this.ec.push(i),i}ac(){this.tc&&L(47125,{hc:dh(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function dh(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fh(n){return(function(t,s){if(typeof t!="object"||t===null)return!1;const i=t;for(const r of s)if(r in i&&typeof i[r]=="function")return!0;return!1})(n,["next","error","complete"])}class dr extends vl{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new hh,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new hh(e),this._firestoreClient=void 0,await e}}}function Ew(n,e){const t=typeof n=="object"?n:kh(),s=typeof n=="string"?n:nr,i=Ph(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=yh("firestore");r&&GI(i,...r)}return i}function cp(n){if(n._terminated)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||KI(n),n._firestoreClient}function KI(n){var e,t,s;const i=n._freezeSettings(),r=(function(l,u,h,f){return new gE(l,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,ap(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new zI(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&(function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ze(Re.fromBase64String(e))}catch(t){throw new O(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ze(Re.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ze._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ti(e,ze._jsonSchema))return ze.fromBase64String(e.bytes)}}ze._jsonSchemaVersion="firestore/bytes/1.0",ze._jsonSchema={type:_e("string",ze._jsonSchemaVersion),bytes:_e("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Se(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:nt._jsonSchemaVersion}}static fromJSON(e){if(ti(e,nt._jsonSchema))return new nt(e.latitude,e.longitude)}}nt._jsonSchemaVersion="firestore/geoPoint/1.0",nt._jsonSchema={type:_e("string",nt._jsonSchemaVersion),latitude:_e("number"),longitude:_e("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0})(this._values,e._values)}toJSON(){return{type:st._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ti(e,st._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new st(e.vectorValues);throw new O(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}st._jsonSchemaVersion="firestore/vectorValue/1.0",st._jsonSchema={type:_e("string",st._jsonSchemaVersion),vectorValues:_e("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI=/^__.*__$/;class YI{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new cn(e,this.data,this.fieldMask,t,this.fieldTransforms):new ni(e,this.data,t,this.fieldTransforms)}}function hp(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw L(40011,{Ec:n})}}class Tl{constructor(e,t,s,i,r,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.Ac(),this.fieldTransforms=r||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Tl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:s,mc:!1});return i.fc(e),i}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:s,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return fr(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(hp(this.Ec)&&QI.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class XI{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||xr(e)}Dc(e,t,s,i=!1){return new Tl({Ec:e,methodName:t,bc:s,path:Se.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function JI(n){const e=n._freezeSettings(),t=xr(n._databaseId);return new XI(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ZI(n,e,t,s,i,r={}){const a=n.Dc(r.merge||r.mergeFields?2:0,e,t,i);_p("Data must be an object, but it was:",a,s);const l=fp(s,a);let u,h;if(r.merge)u=new Qe(a.fieldMask),h=a.fieldTransforms;else if(r.mergeFields){const f=[];for(const p of r.mergeFields){const m=ew(e,p,t);if(!a.contains(m))throw new O(P.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);nw(f,m)||f.push(m)}u=new Qe(f),h=a.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,h=a.fieldTransforms;return new YI(new We(l),u,h)}function dp(n,e){if(pp(n=Xe(n)))return _p("Unsupported field value:",e,n),fp(n,e);if(n instanceof up)return(function(s,i){if(!hp(i.Ec))throw i.wc(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,i){const r=[];let a=0;for(const l of s){let u=dp(l,i.yc(a));u==null&&(u={nullValue:"NULL_VALUE"}),r.push(u),a++}return{arrayValue:{values:r}}})(n,e)}return(function(s,i){if((s=Xe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return qE(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=re.fromDate(s);return{timestampValue:lr(i.serializer,r)}}if(s instanceof re){const r=new re(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:lr(i.serializer,r)}}if(s instanceof nt)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ze)return{bytesValue:Vf(i.serializer,s._byteString)};if(s instanceof Te){const r=i.databaseId,a=s.firestore._databaseId;if(!a.isEqual(r))throw i.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:rl(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof st)return(function(a,l){return{mapValue:{fields:{[lf]:{stringValue:cf},[sr]:{arrayValue:{values:a.toArray().map((h=>{if(typeof h!="number")throw l.wc("VectorValues must only contain numeric values.");return nl(l.serializer,h)}))}}}}}})(s,i);throw i.wc(`Unsupported field value: ${Qa(s)}`)})(n,e)}function fp(n,e){const t={};return tf(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):an(n,((s,i)=>{const r=dp(i,e.Vc(s));r!=null&&(t[s]=r)})),{mapValue:{fields:t}}}function pp(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof re||n instanceof nt||n instanceof ze||n instanceof Te||n instanceof up||n instanceof st)}function _p(n,e,t){if(!pp(t)||!Zd(t)){const s=Qa(t);throw s==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+s)}}function ew(n,e,t){if((e=Xe(e))instanceof El)return e._internalPath;if(typeof e=="string")return mp(n,e);throw fr("Field path arguments must be of type string or ",n,!1,void 0,t)}const tw=new RegExp("[~\\*/\\[\\]]");function mp(n,e,t){if(e.search(tw)>=0)throw fr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new El(...e.split("."))._internalPath}catch{throw fr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function fr(n,e,t,s,i){const r=s&&!s.isEmpty(),a=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(r||a)&&(u+=" (found",r&&(u+=` in field ${s}`),a&&(u+=` in document ${i}`),u+=")"),new O(P.INVALID_ARGUMENT,l+n+u)}function nw(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gp{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Te(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new sw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(yp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class sw extends gp{data(){return super.data()}}function yp(n,e){return typeof e=="string"?mp(n,e):e instanceof El?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iw(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new O(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class rw{convertValue(e,t="none"){switch(Mt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return he(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ot(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw L(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return an(e,((i,r)=>{s[i]=this.convertValue(r,t)})),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t[sr].arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map((a=>he(a.doubleValue)));return new st(r)}convertGeoPoint(e){return new nt(he(e.latitude),he(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Rr(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Ws(e));default:return null}}convertTimestamp(e){const t=xt(e);return new re(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=oe.fromString(e);Z(Uf(s),9688,{name:e});const i=new zs(s.get(1),s.get(3)),r=new M(s.popFirst(5));return i.isEqual(t)||yt(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ow(n,e,t){let s;return s=n?n.toFirestore(e):e,s}class Es{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Yt extends gp{constructor(e,t,s,i,r,a){super(e,t,s,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ui(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(yp("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Yt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Yt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Yt._jsonSchema={type:_e("string",Yt._jsonSchemaVersion),bundleSource:_e("string","DocumentSnapshot"),bundleName:_e("string"),bundle:_e("string")};class Ui extends Yt{data(e={}){return super.data(e)}}class Sn{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Es(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new Ui(this._firestore,this._userDataWriter,s.key,s,new Es(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,r){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map((l=>{const u=new Ui(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Es(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((l=>r||l.type!==3)).map((l=>{const u=new Ui(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Es(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return l.type!==0&&(h=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:aw(l.type),doc:u,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Sn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ka.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],i=[];return this.docs.forEach((r=>{r._document!==null&&(t.push(r._document),s.push(this._userDataWriter.convertObjectMap(r._document.data.value.mapValue.fields,"previous")),i.push(r.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function aw(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return L(61501,{type:n})}}Sn._jsonSchemaVersion="firestore/querySnapshot/1.0",Sn._jsonSchema={type:_e("string",Sn._jsonSchemaVersion),bundleSource:_e("string","QuerySnapshot"),bundleName:_e("string"),bundle:_e("string")};class vp extends rw{constructor(e){super(),this.firestore=e}convertBytes(e){return new ze(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Te(this.firestore,null,t)}}function Tw(n,e,t){n=Cn(n,Te);const s=Cn(n.firestore,dr),i=ow(n.converter,e);return lw(s,[ZI(JI(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,pt.none())])}function Iw(n,...e){var t,s,i;n=Xe(n);let r={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||fh(e[a])||(r=e[a++]);const l={includeMetadataChanges:r.includeMetadataChanges,source:r.source};if(fh(e[a])){const p=e[a];e[a]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[a+1]=(s=p.error)===null||s===void 0?void 0:s.bind(p),e[a+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let u,h,f;if(n instanceof Te)h=Cn(n.firestore,dr),f=tl(n._key.path),u={next:p=>{e[a]&&e[a](cw(h,n,p))},error:e[a+1],complete:e[a+2]};else{const p=Cn(n,Lr);h=Cn(p.firestore,dr),f=p._query;const m=new vp(h);u={next:C=>{e[a]&&e[a](new Sn(h,m,p,C))},error:e[a+1],complete:e[a+2]},iw(n._query)}return(function(m,C,R,D){const N=new WI(D),j=new CI(C,N,R);return m.asyncQueue.enqueueAndForget((async()=>EI(await oh(m),j))),()=>{N.Ou(),m.asyncQueue.enqueueAndForget((async()=>TI(await oh(m),j)))}})(cp(h),f,l,u)}function lw(n,e){return(function(s,i){const r=new Qt;return s.asyncQueue.enqueueAndForget((async()=>xI(await HI(s),i,r))),r.promise})(cp(n),e)}function cw(n,e,t){const s=t.docs.get(e._key),i=new vp(n);return new Yt(n,i,e._key,s,new Es(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(i){zn=i})(Dh),Vs(new Pn("firestore",((s,{instanceIdentifier:i,options:r})=>{const a=s.getProvider("app").getImmediate(),l=new dr(new Jv(s.getProvider("auth-internal")),new tE(a,s.getProvider("app-check-internal")),(function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new O(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zs(h.options.projectId,f)})(a,i),a);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l}),"PUBLIC").setMultipleInstances(!0)),Rt(gu,yu,e),Rt(gu,yu,"esm2017")})();export{Ew as a,vw as b,gw as c,hw as d,pw as e,mw as f,uw as g,Tw as h,Cm as i,Iw as o,fw as r,_w as s};
