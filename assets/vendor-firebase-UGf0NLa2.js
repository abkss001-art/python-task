const by=()=>{};var Nh={};/**
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
 */const Qf={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const D=function(n,e){if(!n)throw Ri(e)},Ri=function(n){return new Error("Firebase Database ("+Qf.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
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
 */const Yf=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},Py=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const r=n[t++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=n[t++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=n[t++],o=n[t++],l=n[t++],c=((r&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const s=n[t++],o=n[t++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Vo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<n.length;r+=3){const s=n[r],o=r+1<n.length,l=o?n[r+1]:0,c=r+2<n.length,u=c?n[r+2]:0,f=s>>2,p=(s&3)<<4|l>>4;let g=(l&15)<<2|u>>6,w=u&63;c||(w=64,o||(g=64)),i.push(t[f],t[p],t[g],t[w])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Yf(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Py(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<n.length;){const s=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const u=r<n.length?t[n.charAt(r)]:64;++r;const p=r<n.length?t[n.charAt(r)]:64;if(++r,s==null||l==null||u==null||p==null)throw new ky;const g=s<<2|l>>4;if(i.push(g),u!==64){const w=l<<4&240|u>>2;if(i.push(w),p!==64){const S=u<<6&192|p;i.push(S)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class ky extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Xf=function(n){const e=Yf(n);return Vo.encodeByteArray(e,!0)},Ks=function(n){return Xf(n).replace(/\./g,"")},Qs=function(n){try{return Vo.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Ny(n){return Jf(void 0,n)}function Jf(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!Dy(t)||(n[t]=Jf(n[t],e[t]));return n}function Dy(n){return n!=="__proto__"}/**
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
 */function Zf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Oy=()=>Zf().__FIREBASE_DEFAULTS__,Vy=()=>{if(typeof process>"u"||typeof Nh>"u")return;const n=Nh.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},xy=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Qs(n[1]);return e&&JSON.parse(e)},xo=()=>{try{return by()||Oy()||Vy()||xy()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},ep=n=>{var e,t;return(t=(e=xo())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},tp=n=>{const e=ep(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},np=()=>{var n;return(n=xo())===null||n===void 0?void 0:n.config},ip=n=>{var e;return(e=xo())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class He{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
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
 */function Tn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function zl(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function rp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",r=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ks(JSON.stringify(t)),Ks(JSON.stringify(o)),""].join(".")}const pr={};function My(){const n={prod:[],emulator:[]};for(const e of Object.keys(pr))pr[e]?n.emulator.push(e):n.prod.push(e);return n}function Ly(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Dh=!1;function Gl(n,e){if(typeof window>"u"||typeof document>"u"||!Tn(window.location.host)||pr[n]===e||pr[n]||Dh)return;pr[n]=e;function t(g){return`__firebase__banner__${g}`}const i="__firebase__banner",s=My().prod.length>0;function o(){const g=document.getElementById(i);g&&g.remove()}function l(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function c(g,w){g.setAttribute("width","24"),g.setAttribute("id",w),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function u(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Dh=!0,o()},g}function f(g,w){g.setAttribute("id",w),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function p(){const g=Ly(i),w=t("text"),S=document.getElementById(w)||document.createElement("span"),N=t("learnmore"),k=document.getElementById(N)||document.createElement("a"),j=t("preprendIcon"),B=document.getElementById(j)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const $=g.element;l($),f(k,N);const ae=u();c(B,j),$.append(B,S,k,ae),document.body.appendChild($)}s?(S.innerText="Preview backend disconnected.",B.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(B.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,S.innerText="Preview backend running in this workspace."),S.setAttribute("id",w)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
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
 */function Be(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kl(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Be())}function Fy(){var n;const e=(n=xo())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Uy(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function By(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function sp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function qy(){const n=Be();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Wy(){return Qf.NODE_ADMIN===!0}function jy(){return!Fy()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ql(){try{return typeof indexedDB=="object"}catch{return!1}}function $y(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
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
 */const Hy="FirebaseError";class Ft extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=Hy,Object.setPrototypeOf(this,Ft.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Si.prototype.create)}}class Si{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?zy(s,i):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new Ft(r,l,i)}}function zy(n,e){return n.replace(Gy,(t,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const Gy=/\{\$([^}]+)}/g;/**
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
 */function Cr(n){return JSON.parse(n)}function Te(n){return JSON.stringify(n)}/**
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
 */const op=function(n){let e={},t={},i={},r="";try{const s=n.split(".");e=Cr(Qs(s[0])||""),t=Cr(Qs(s[1])||""),r=s[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:r}},Ky=function(n){const e=op(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},Qy=function(n){const e=op(n).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function It(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function pi(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Ys(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Xs(n,e,t){const i={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(i[r]=e.call(t,n[r],r,n));return i}function ln(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const r of t){if(!i.includes(r))return!1;const s=n[r],o=e[r];if(Oh(s)&&Oh(o)){if(!ln(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!t.includes(r))return!1;return!0}function Oh(n){return n!==null&&typeof n=="object"}/**
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
 */function bi(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function ar(n){const e={};return n.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[r,s]=i.split("=");e[decodeURIComponent(r)]=decodeURIComponent(s)}}),e}function lr(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
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
 */class Yy{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)i[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)i[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const g=i[p-3]^i[p-8]^i[p-14]^i[p-16];i[p]=(g<<1|g>>>31)&4294967295}let r=this.chain_[0],s=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],u,f;for(let p=0;p<80;p++){p<40?p<20?(u=l^s&(o^l),f=1518500249):(u=s^o^l,f=1859775393):p<60?(u=s&o|l&(s|o),f=2400959708):(u=s^o^l,f=3395469782);const g=(r<<5|r>>>27)+u+c+f+i[p]&4294967295;c=l,l=o,o=(s<<30|s>>>2)&4294967295,s=r,r=g}this.chain_[0]=this.chain_[0]+r&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let r=0;const s=this.buf_;let o=this.inbuf_;for(;r<t;){if(o===0)for(;r<=i;)this.compress_(e,r),r+=this.blockSize;if(typeof e=="string"){for(;r<t;)if(s[o]=e.charCodeAt(r),++o,++r,o===this.blockSize){this.compress_(s),o=0;break}}else for(;r<t;)if(s[o]=e[r],++o,++r,o===this.blockSize){this.compress_(s),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let r=this.blockSize-1;r>=56;r--)this.buf_[r]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let r=0;r<5;r++)for(let s=24;s>=0;s-=8)e[i]=this.chain_[r]>>s&255,++i;return e}}function Xy(n,e){const t=new Jy(n,e);return t.subscribe.bind(t)}class Jy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let r;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");Zy(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:i},r.next===void 0&&(r.next=Ua),r.error===void 0&&(r.error=Ua),r.complete===void 0&&(r.complete=Ua);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Zy(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ua(){}function _i(n,e){return`${n} failed: ${e} argument `}/**
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
 */const ev=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);if(r>=55296&&r<=56319){const s=r-55296;i++,D(i<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(i)-56320;r=65536+(s<<10)+o}r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):r<65536?(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},Mo=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
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
 */const tv=1e3,nv=2,iv=14400*1e3,rv=.5;function sv(n,e=tv,t=nv){const i=e*Math.pow(t,n),r=Math.round(rv*i*(Math.random()-.5)*2);return Math.min(iv,i+r)}/**
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
 */function re(n){return n&&n._delegate?n._delegate:n}class Et{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Sn="[DEFAULT]";/**
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
 */class ov{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new He;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(lv(e))try{this.getOrInitializeService({instanceIdentifier:Sn})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=Sn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Sn){return this.instances.has(e)}getOptions(e=Sn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);i===l&&o.resolve(r)}return r}onInit(e,t){var i;const r=this.normalizeInstanceIdentifier(t),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const r of i)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:av(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Sn){return this.component?this.component.multipleInstances?e:Sn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function av(n){return n===Sn?void 0:n}function lv(n){return n.instantiationMode==="EAGER"}/**
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
 */class cv{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new ov(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Q||(Q={}));const uv={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},hv=Q.INFO,dv={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},fv=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),r=dv[e];if(r)console[r](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class $r{constructor(e){this.name=e,this._logLevel=hv,this._logHandler=fv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?uv[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const pv=(n,e)=>e.some(t=>n instanceof t);let Vh,xh;function _v(){return Vh||(Vh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function gv(){return xh||(xh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ap=new WeakMap,sl=new WeakMap,lp=new WeakMap,Ba=new WeakMap,Yl=new WeakMap;function mv(n){const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(tn(n.result)),r()},o=()=>{i(n.error),r()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ap.set(t,n)}).catch(()=>{}),Yl.set(e,n),e}function yv(n){if(sl.has(n))return;const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),r()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});sl.set(n,e)}let ol={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return sl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||lp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return tn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function vv(n){ol=n(ol)}function Ev(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(qa(this),e,...t);return lp.set(i,e.sort?e.sort():[e]),tn(i)}:gv().includes(n)?function(...e){return n.apply(qa(this),e),tn(ap.get(this))}:function(...e){return tn(n.apply(qa(this),e))}}function Tv(n){return typeof n=="function"?Ev(n):(n instanceof IDBTransaction&&yv(n),pv(n,_v())?new Proxy(n,ol):n)}function tn(n){if(n instanceof IDBRequest)return mv(n);if(Ba.has(n))return Ba.get(n);const e=Tv(n);return e!==n&&(Ba.set(n,e),Yl.set(e,n)),e}const qa=n=>Yl.get(n);function Iv(n,e,{blocked:t,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(n,e),l=tn(o);return i&&o.addEventListener("upgradeneeded",c=>{i(tn(o.result),c.oldVersion,c.newVersion,tn(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const wv=["get","getKey","getAll","getAllKeys","count"],Av=["put","add","delete","clear"],Wa=new Map;function Mh(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Wa.get(e))return Wa.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,r=Av.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(r||wv.includes(t)))return;const s=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let u=c.store;return i&&(u=u.index(l.shift())),(await Promise.all([u[t](...l),r&&c.done]))[0]};return Wa.set(e,s),s}vv(n=>({...n,get:(e,t,i)=>Mh(e,t)||n.get(e,t,i),has:(e,t)=>!!Mh(e,t)||n.has(e,t)}));/**
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
 */class Cv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Rv(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function Rv(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const al="@firebase/app",Lh="0.13.2";/**
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
 */const Dt=new $r("@firebase/app"),Sv="@firebase/app-compat",bv="@firebase/analytics-compat",Pv="@firebase/analytics",kv="@firebase/app-check-compat",Nv="@firebase/app-check",Dv="@firebase/auth",Ov="@firebase/auth-compat",Vv="@firebase/database",xv="@firebase/data-connect",Mv="@firebase/database-compat",Lv="@firebase/functions",Fv="@firebase/functions-compat",Uv="@firebase/installations",Bv="@firebase/installations-compat",qv="@firebase/messaging",Wv="@firebase/messaging-compat",jv="@firebase/performance",$v="@firebase/performance-compat",Hv="@firebase/remote-config",zv="@firebase/remote-config-compat",Gv="@firebase/storage",Kv="@firebase/storage-compat",Qv="@firebase/firestore",Yv="@firebase/ai",Xv="@firebase/firestore-compat",Jv="firebase",Zv="11.10.0";/**
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
 */const ll="[DEFAULT]",eE={[al]:"fire-core",[Sv]:"fire-core-compat",[Pv]:"fire-analytics",[bv]:"fire-analytics-compat",[Nv]:"fire-app-check",[kv]:"fire-app-check-compat",[Dv]:"fire-auth",[Ov]:"fire-auth-compat",[Vv]:"fire-rtdb",[xv]:"fire-data-connect",[Mv]:"fire-rtdb-compat",[Lv]:"fire-fn",[Fv]:"fire-fn-compat",[Uv]:"fire-iid",[Bv]:"fire-iid-compat",[qv]:"fire-fcm",[Wv]:"fire-fcm-compat",[jv]:"fire-perf",[$v]:"fire-perf-compat",[Hv]:"fire-rc",[zv]:"fire-rc-compat",[Gv]:"fire-gcs",[Kv]:"fire-gcs-compat",[Qv]:"fire-fst",[Xv]:"fire-fst-compat",[Yv]:"fire-vertex","fire-js":"fire-js",[Jv]:"fire-js-all"};/**
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
 */const xn=new Map,cl=new Map,ul=new Map;function Fh(n,e){try{n.container.addComponent(e)}catch(t){Dt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ot(n){const e=n.name;if(ul.has(e))return Dt.debug(`There were multiple attempts to register component ${e}.`),!1;ul.set(e,n);for(const t of xn.values())Fh(t,n);for(const t of cl.values())Fh(t,n);return!0}function Pi(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Qe(n){return n==null?!1:n.settings!==void 0}/**
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
 */const tE={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},nn=new Si("app","Firebase",tE);/**
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
 */class nE{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Et("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw nn.create("app-deleted",{appName:this._name})}}/**
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
 */const $n=Zv;function iE(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i=Object.assign({name:ll,automaticDataCollectionEnabled:!0},e),r=i.name;if(typeof r!="string"||!r)throw nn.create("bad-app-name",{appName:String(r)});if(t||(t=np()),!t)throw nn.create("no-options");const s=xn.get(r);if(s){if(ln(t,s.options)&&ln(i,s.config))return s;throw nn.create("duplicate-app",{appName:r})}const o=new cv(r);for(const c of ul.values())o.addComponent(c);const l=new nE(t,i,o);return xn.set(r,l),l}function Lo(n=ll){const e=xn.get(n);if(!e&&n===ll&&np())return iE();if(!e)throw nn.create("no-app",{appName:n});return e}function FP(){return Array.from(xn.values())}async function UP(n){let e=!1;const t=n.name;xn.has(t)?(e=!0,xn.delete(t)):cl.has(t)&&n.decRefCount()<=0&&(cl.delete(t),e=!0),e&&(await Promise.all(n.container.getProviders().map(i=>i.delete())),n.isDeleted=!0)}function ot(n,e,t){var i;let r=(i=eE[n])!==null&&i!==void 0?i:n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${r}" with version "${e}":`];s&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Dt.warn(l.join(" "));return}Ot(new Et(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const rE="firebase-heartbeat-database",sE=1,Rr="firebase-heartbeat-store";let ja=null;function cp(){return ja||(ja=Iv(rE,sE,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Rr)}catch(t){console.warn(t)}}}}).catch(n=>{throw nn.create("idb-open",{originalErrorMessage:n.message})})),ja}async function oE(n){try{const t=(await cp()).transaction(Rr),i=await t.objectStore(Rr).get(up(n));return await t.done,i}catch(e){if(e instanceof Ft)Dt.warn(e.message);else{const t=nn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Dt.warn(t.message)}}}async function Uh(n,e){try{const i=(await cp()).transaction(Rr,"readwrite");await i.objectStore(Rr).put(e,up(n)),await i.done}catch(t){if(t instanceof Ft)Dt.warn(t.message);else{const i=nn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Dt.warn(i.message)}}}function up(n){return`${n.name}!${n.options.appId}`}/**
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
 */const aE=1024,lE=30;class cE{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new hE(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Bh();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:r}),this._heartbeatsCache.heartbeats.length>lE){const o=dE(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){Dt.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Bh(),{heartbeatsToSend:i,unsentEntries:r}=uE(this._heartbeatsCache.heartbeats),s=Ks(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Dt.warn(t),""}}}function Bh(){return new Date().toISOString().substring(0,10)}function uE(n,e=aE){const t=[];let i=n.slice();for(const r of n){const s=t.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),qh(t)>e){s.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),qh(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class hE{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ql()?$y().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await oE(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Uh(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Uh(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function qh(n){return Ks(JSON.stringify({version:2,heartbeats:n})).length}function dE(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
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
 */function fE(n){Ot(new Et("platform-logger",e=>new Cv(e),"PRIVATE")),Ot(new Et("heartbeat",e=>new cE(e),"PRIVATE")),ot(al,Lh,n),ot(al,Lh,"esm2017"),ot("fire-js","")}fE("");var pE="firebase",_E="11.10.0";/**
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
 */ot(pE,_E,"app");/**
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
 */const hl=new Map,hp={activated:!1,tokenObservers:[]},gE={initialized:!1,enabled:!1};function Ie(n){return hl.get(n)||Object.assign({},hp)}function mE(n,e){return hl.set(n,e),hl.get(n)}function Fo(){return gE}/**
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
 */const dp="https://content-firebaseappcheck.googleapis.com/v1",yE="exchangeRecaptchaEnterpriseToken",vE="exchangeDebugToken",Wh={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},EE=1440*60*1e3;/**
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
 */class TE{constructor(e,t,i,r,s){if(this.operation=e,this.retryPolicy=t,this.getWaitDuration=i,this.lowerBound=r,this.upperBound=s,this.pending=null,this.nextErrorWaitInterval=r,r>s)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new He,this.pending.promise.catch(t=>{}),await IE(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new He,this.pending.promise.catch(t=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(t){this.retryPolicy(t)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const t=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),t}}}function IE(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */const wE={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},ze=new Si("appCheck","AppCheck",wE);/**
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
 */function jh(n=!1){var e;return n?(e=self.grecaptcha)===null||e===void 0?void 0:e.enterprise:self.grecaptcha}function Xl(n){if(!Ie(n).activated)throw ze.create("use-before-activation",{appName:n.name})}function fp(n){const e=Math.round(n/1e3),t=Math.floor(e/(3600*24)),i=Math.floor((e-t*3600*24)/3600),r=Math.floor((e-t*3600*24-i*3600)/60),s=e-t*3600*24-i*3600-r*60;let o="";return t&&(o+=Rs(t)+"d:"),i&&(o+=Rs(i)+"h:"),o+=Rs(r)+"m:"+Rs(s)+"s",o}function Rs(n){return n===0?"00":n>=10?n.toString():"0"+n}/**
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
 */async function Jl({url:n,body:e},t){const i={"Content-Type":"application/json"},r=t.getImmediate({optional:!0});if(r){const p=await r.getHeartbeatsHeader();p&&(i["X-Firebase-Client"]=p)}const s={method:"POST",body:JSON.stringify(e),headers:i};let o;try{o=await fetch(n,s)}catch(p){throw ze.create("fetch-network-error",{originalErrorMessage:p==null?void 0:p.message})}if(o.status!==200)throw ze.create("fetch-status-error",{httpStatus:o.status});let l;try{l=await o.json()}catch(p){throw ze.create("fetch-parse-error",{originalErrorMessage:p==null?void 0:p.message})}const c=l.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw ze.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${l.ttl}`});const u=Number(c[1])*1e3,f=Date.now();return{token:l.token,expireTimeMillis:f+u,issuedAtTimeMillis:f}}function AE(n,e){const{projectId:t,appId:i,apiKey:r}=n.options;return{url:`${dp}/projects/${t}/apps/${i}:${yE}?key=${r}`,body:{recaptcha_enterprise_token:e}}}function pp(n,e){const{projectId:t,appId:i,apiKey:r}=n.options;return{url:`${dp}/projects/${t}/apps/${i}:${vE}?key=${r}`,body:{debug_token:e}}}/**
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
 */const CE="firebase-app-check-database",RE=1,Sr="firebase-app-check-store",_p="debug-token";let Ss=null;function gp(){return Ss||(Ss=new Promise((n,e)=>{try{const t=indexedDB.open(CE,RE);t.onsuccess=i=>{n(i.target.result)},t.onerror=i=>{var r;e(ze.create("storage-open",{originalErrorMessage:(r=i.target.error)===null||r===void 0?void 0:r.message}))},t.onupgradeneeded=i=>{const r=i.target.result;switch(i.oldVersion){case 0:r.createObjectStore(Sr,{keyPath:"compositeKey"})}}}catch(t){e(ze.create("storage-open",{originalErrorMessage:t==null?void 0:t.message}))}}),Ss)}function SE(n){return yp(vp(n))}function bE(n,e){return mp(vp(n),e)}function PE(n){return mp(_p,n)}function kE(){return yp(_p)}async function mp(n,e){const i=(await gp()).transaction(Sr,"readwrite"),s=i.objectStore(Sr).put({compositeKey:n,value:e});return new Promise((o,l)=>{s.onsuccess=c=>{o()},i.onerror=c=>{var u;l(ze.create("storage-set",{originalErrorMessage:(u=c.target.error)===null||u===void 0?void 0:u.message}))}})}async function yp(n){const t=(await gp()).transaction(Sr,"readonly"),r=t.objectStore(Sr).get(n);return new Promise((s,o)=>{r.onsuccess=l=>{const c=l.target.result;s(c?c.value:void 0)},t.onerror=l=>{var c;o(ze.create("storage-get",{originalErrorMessage:(c=l.target.error)===null||c===void 0?void 0:c.message}))}})}function vp(n){return`${n.options.appId}-${n.name}`}/**
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
 */const Jt=new $r("@firebase/app-check");/**
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
 */async function NE(n){if(Ql()){let e;try{e=await SE(n)}catch(t){Jt.warn(`Failed to read token from IndexedDB. Error: ${t}`)}return e}}function $a(n,e){return Ql()?bE(n,e).catch(t=>{Jt.warn(`Failed to write token to IndexedDB. Error: ${t}`)}):Promise.resolve()}async function DE(){let n;try{n=await kE()}catch{}if(n)return n;{const e=crypto.randomUUID();return PE(e).catch(t=>Jt.warn(`Failed to persist debug token to IndexedDB. Error: ${t}`)),e}}/**
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
 */function Zl(){return Fo().enabled}async function ec(){const n=Fo();if(n.enabled&&n.token)return n.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function OE(){const n=Zf(),e=Fo();if(e.initialized=!0,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&n.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;e.enabled=!0;const t=new He;e.token=t,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?t.resolve(n.FIREBASE_APPCHECK_DEBUG_TOKEN):t.resolve(DE())}/**
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
 */const VE={error:"UNKNOWN_ERROR"};function xE(n){return Vo.encodeString(JSON.stringify(n),!1)}async function Js(n,e=!1,t=!1){const i=n.app;Xl(i);const r=Ie(i);let s=r.token,o;if(s&&!oi(s)&&(r.token=void 0,s=void 0),!s){const u=await r.cachedTokenPromise;u&&(oi(u)?s=u:await $a(i,void 0))}if(!e&&s&&oi(s))return{token:s.token};let l=!1;if(Zl())try{r.exchangeTokenPromise||(r.exchangeTokenPromise=Jl(pp(i,await ec()),n.heartbeatServiceProvider).finally(()=>{r.exchangeTokenPromise=void 0}),l=!0);const u=await r.exchangeTokenPromise;return await $a(i,u),r.token=u,{token:u.token}}catch(u){return u.code==="appCheck/throttled"||u.code==="appCheck/initial-throttle"?Jt.warn(u.message):t&&Jt.error(u),Ha(u)}try{r.exchangeTokenPromise||(r.exchangeTokenPromise=r.provider.getToken().finally(()=>{r.exchangeTokenPromise=void 0}),l=!0),s=await Ie(i).exchangeTokenPromise}catch(u){u.code==="appCheck/throttled"||u.code==="appCheck/initial-throttle"?Jt.warn(u.message):t&&Jt.error(u),o=u}let c;return s?o?oi(s)?c={token:s.token,internalError:o}:c=Ha(o):(c={token:s.token},r.token=s,await $a(i,s)):c=Ha(o),l&&Ep(i,c),c}async function ME(n){const e=n.app;Xl(e);const{provider:t}=Ie(e);if(Zl()){const i=await ec(),{token:r}=await Jl(pp(e,i),n.heartbeatServiceProvider);return{token:r}}else{const{token:i}=await t.getToken();return{token:i}}}function tc(n,e,t,i){const{app:r}=n,s=Ie(r),o={next:t,error:i,type:e};if(s.tokenObservers=[...s.tokenObservers,o],s.token&&oi(s.token)){const l=s.token;Promise.resolve().then(()=>{t({token:l.token}),$h(n)}).catch(()=>{})}s.cachedTokenPromise.then(()=>$h(n))}function nc(n,e){const t=Ie(n),i=t.tokenObservers.filter(r=>r.next!==e);i.length===0&&t.tokenRefresher&&t.tokenRefresher.isRunning()&&t.tokenRefresher.stop(),t.tokenObservers=i}function $h(n){const{app:e}=n,t=Ie(e);let i=t.tokenRefresher;i||(i=LE(n),t.tokenRefresher=i),!i.isRunning()&&t.isTokenAutoRefreshEnabled&&i.start()}function LE(n){const{app:e}=n;return new TE(async()=>{const t=Ie(e);let i;if(t.token?i=await Js(n,!0):i=await Js(n),i.error)throw i.error;if(i.internalError)throw i.internalError},()=>!0,()=>{const t=Ie(e);if(t.token){let i=t.token.issuedAtTimeMillis+(t.token.expireTimeMillis-t.token.issuedAtTimeMillis)*.5+3e5;const r=t.token.expireTimeMillis-300*1e3;return i=Math.min(i,r),Math.max(0,i-Date.now())}else return 0},Wh.RETRIAL_MIN_WAIT,Wh.RETRIAL_MAX_WAIT)}function Ep(n,e){const t=Ie(n).tokenObservers;for(const i of t)try{i.type==="EXTERNAL"&&e.error!=null?i.error(e.error):i.next(e)}catch{}}function oi(n){return n.expireTimeMillis-Date.now()>0}function Ha(n){return{token:xE(VE),error:n}}/**
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
 */class FE{constructor(e,t){this.app=e,this.heartbeatServiceProvider=t}_delete(){const{tokenObservers:e}=Ie(this.app);for(const t of e)nc(this.app,t.next);return Promise.resolve()}}function UE(n,e){return new FE(n,e)}function BE(n){return{getToken:e=>Js(n,e),getLimitedUseToken:()=>ME(n),addTokenListener:e=>tc(n,"INTERNAL",e),removeTokenListener:e=>nc(n.app,e)}}const qE="@firebase/app-check",WE="0.10.1",jE="https://www.google.com/recaptcha/enterprise.js";function $E(n,e){const t=new He,i=Ie(n);i.reCAPTCHAState={initialized:t};const r=HE(n),s=jh(!0);return s?Hh(n,e,s,r,t):KE(()=>{const o=jh(!0);if(!o)throw new Error("no recaptcha");Hh(n,e,o,r,t)}),t.promise}function Hh(n,e,t,i,r){t.ready(()=>{GE(n,e,t,i),r.resolve(t)})}function HE(n){const e=`fire_app_check_${n.name}`,t=document.createElement("div");return t.id=e,t.style.display="none",document.body.appendChild(t),e}async function zE(n){Xl(n);const t=await Ie(n).reCAPTCHAState.initialized.promise;return new Promise((i,r)=>{const s=Ie(n).reCAPTCHAState;t.ready(()=>{i(t.execute(s.widgetId,{action:"fire_app_check"}))})})}function GE(n,e,t,i){const r=t.render(i,{sitekey:e,size:"invisible",callback:()=>{Ie(n).reCAPTCHAState.succeeded=!0},"error-callback":()=>{Ie(n).reCAPTCHAState.succeeded=!1}}),s=Ie(n);s.reCAPTCHAState=Object.assign(Object.assign({},s.reCAPTCHAState),{widgetId:r})}function KE(n){const e=document.createElement("script");e.src=jE,e.onload=n,document.head.appendChild(e)}class Tp{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(){var e,t,i;YE(this._throttleData);const r=await zE(this._app).catch(o=>{throw ze.create("recaptcha-error")});if(!(!((e=Ie(this._app).reCAPTCHAState)===null||e===void 0)&&e.succeeded))throw ze.create("recaptcha-error");let s;try{s=await Jl(AE(this._app,r),this._heartbeatServiceProvider)}catch(o){throw!((t=o.code)===null||t===void 0)&&t.includes("fetch-status-error")?(this._throttleData=QE(Number((i=o.customData)===null||i===void 0?void 0:i.httpStatus),this._throttleData),ze.create("initial-throttle",{time:fp(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):o}return this._throttleData=null,s}initialize(e){this._app=e,this._heartbeatServiceProvider=Pi(e,"heartbeat"),$E(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof Tp?this._siteKey===e._siteKey:!1}}function QE(n,e){if(n===404||n===403)return{backoffCount:1,allowRequestsAfter:Date.now()+EE,httpStatus:n};{const t=e?e.backoffCount:0,i=sv(t,1e3,2);return{backoffCount:t+1,allowRequestsAfter:Date.now()+i,httpStatus:n}}}function YE(n){if(n&&Date.now()-n.allowRequestsAfter<=0)throw ze.create("throttled",{time:fp(n.allowRequestsAfter-Date.now()),httpStatus:n.httpStatus})}/**
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
 */function BP(n=Lo(),e){n=re(n);const t=Pi(n,"app-check");if(Fo().initialized||OE(),Zl()&&ec().then(r=>console.log(`App Check debug token: ${r}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)),t.isInitialized()){const r=t.getImmediate(),s=t.getOptions();if(s.isTokenAutoRefreshEnabled===e.isTokenAutoRefreshEnabled&&s.provider.isEqual(e.provider))return r;throw ze.create("already-initialized",{appName:n.name})}const i=t.initialize({options:e});return XE(n,e.provider,e.isTokenAutoRefreshEnabled),Ie(n).isTokenAutoRefreshEnabled&&tc(i,"INTERNAL",()=>{}),i}function XE(n,e,t=!1){const i=mE(n,Object.assign({},hp));i.activated=!0,i.provider=e,i.cachedTokenPromise=NE(n).then(r=>(r&&oi(r)&&(i.token=r,Ep(n,{token:r.token})),r)),i.isTokenAutoRefreshEnabled=t&&n.automaticDataCollectionEnabled,!n.automaticDataCollectionEnabled&&t&&Jt.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),i.provider.initialize(n)}async function qP(n,e){const t=await Js(n,e);if(t.error)throw t.error;if(t.internalError)throw t.internalError;return{token:t.token}}function WP(n,e,t,i){let r=()=>{},s=()=>{};return e.next!=null?r=e.next.bind(e):r=e,e.error!=null&&(s=e.error.bind(e)),tc(n,"EXTERNAL",r,s),()=>nc(n.app,r)}const JE="app-check",zh="app-check-internal";function ZE(){Ot(new Et(JE,n=>{const e=n.getProvider("app").getImmediate(),t=n.getProvider("heartbeat");return UE(e,t)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((n,e,t)=>{n.getProvider(zh).initialize()})),Ot(new Et(zh,n=>{const e=n.getProvider("app-check").getImmediate();return BE(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),ot(qE,WE)}ZE();function ic(n,e){var t={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&e.indexOf(i)<0&&(t[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(n);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(n,i[r])&&(t[i[r]]=n[i[r]]);return t}function Ip(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const eT=Ip,wp=new Si("auth","Firebase",Ip());/**
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
 */const Zs=new $r("@firebase/auth");function tT(n,...e){Zs.logLevel<=Q.WARN&&Zs.warn(`Auth (${$n}): ${n}`,...e)}function Ms(n,...e){Zs.logLevel<=Q.ERROR&&Zs.error(`Auth (${$n}): ${n}`,...e)}/**
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
 */function ct(n,...e){throw rc(n,...e)}function ft(n,...e){return rc(n,...e)}function Ap(n,e,t){const i=Object.assign(Object.assign({},eT()),{[e]:t});return new Si("auth","Firebase",i).create(e,{appName:n.name})}function Pt(n){return Ap(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function rc(n,...e){if(typeof n!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return wp.create(n,...e)}function L(n,e,...t){if(!n)throw rc(e,...t)}function Rt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ms(e),new Error(e)}function Vt(n,e){n||Rt(e)}/**
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
 */function dl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function nT(){return Gh()==="http:"||Gh()==="https:"}function Gh(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function iT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(nT()||By()||"connection"in navigator)?navigator.onLine:!0}function rT(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Hr{constructor(e,t){this.shortDelay=e,this.longDelay=t,Vt(t>e,"Short delay should be less than long delay!"),this.isMobile=Kl()||sp()}get(){return iT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function sc(n,e){Vt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Cp{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Rt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Rt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Rt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const sT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const oT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],aT=new Hr(3e4,6e4);function Ut(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Bt(n,e,t,i,r={}){return Rp(n,r,async()=>{let s={},o={};i&&(e==="GET"?o=i:s={body:JSON.stringify(i)});const l=bi(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const u=Object.assign({method:e,headers:c},s);return Uy()||(u.referrerPolicy="no-referrer"),n.emulatorConfig&&Tn(n.emulatorConfig.host)&&(u.credentials="include"),Cp.fetch()(await Sp(n,n.config.apiHost,t,l),u)})}async function Rp(n,e,t){n._canInitEmulator=!1;const i=Object.assign(Object.assign({},sT),e);try{const r=new cT(n),s=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw bs(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[c,u]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw bs(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw bs(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw bs(n,"user-disabled",o);const f=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Ap(n,f,u);ct(n,f)}}catch(r){if(r instanceof Ft)throw r;ct(n,"network-request-failed",{message:String(r)})}}async function zr(n,e,t,i,r={}){const s=await Bt(n,e,t,i,r);return"mfaPendingCredential"in s&&ct(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function Sp(n,e,t,i){const r=`${e}${t}?${i}`,s=n,o=s.config.emulator?sc(n.config,r):`${n.config.apiScheme}://${r}`;return oT.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function lT(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class cT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(ft(this.auth,"network-request-failed")),aT.get())})}}function bs(n,e,t){const i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const r=ft(n,e,i);return r.customData._tokenResponse=t,r}function Kh(n){return n!==void 0&&n.enterprise!==void 0}class uT{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return lT(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function hT(n,e){return Bt(n,"GET","/v2/recaptchaConfig",Ut(n,e))}/**
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
 */async function dT(n,e){return Bt(n,"POST","/v1/accounts:delete",e)}async function eo(n,e){return Bt(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function _r(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function fT(n,e=!1){const t=re(n),i=await t.getIdToken(e),r=oc(i);L(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const s=typeof r.firebase=="object"?r.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:r,token:i,authTime:_r(za(r.auth_time)),issuedAtTime:_r(za(r.iat)),expirationTime:_r(za(r.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function za(n){return Number(n)*1e3}function oc(n){const[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return Ms("JWT malformed, contained fewer than 3 sections"),null;try{const r=Qs(t);return r?JSON.parse(r):(Ms("Failed to decode base64 JWT payload"),null)}catch(r){return Ms("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Qh(n){const e=oc(n);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function br(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof Ft&&pT(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function pT({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class _T{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class fl{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=_r(this.lastLoginAt),this.creationTime=_r(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function to(n){var e;const t=n.auth,i=await n.getIdToken(),r=await br(n,eo(t,{idToken:i}));L(r==null?void 0:r.users.length,t,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?bp(s.providerUserInfo):[],l=mT(n.providerData,o),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?u:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new fl(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,p)}async function gT(n){const e=re(n);await to(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function mT(n,e){return[...n.filter(i=>!e.some(r=>r.providerId===i.providerId)),...e]}function bp(n){return n.map(e=>{var{providerId:t}=e,i=ic(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
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
 */async function yT(n,e){const t=await Rp(n,{},async()=>{const i=bi({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:s}=n.config,o=await Sp(n,r,"/v1/token",`key=${s}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:i};return n.emulatorConfig&&Tn(n.emulatorConfig.host)&&(c.credentials="include"),Cp.fetch()(o,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function vT(n,e){return Bt(n,"POST","/v2/accounts:revokeToken",Ut(n,e))}/**
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
 */class ci{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Qh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){L(e.length!==0,"internal-error");const t=Qh(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:r,expiresIn:s}=await yT(e,t);this.updateTokensAndExpiration(i,r,Number(s))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:r,expirationTime:s}=t,o=new ci;return i&&(L(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),r&&(L(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),s&&(L(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ci,this.toJSON())}_performRefresh(){return Rt("not implemented")}}/**
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
 */function Gt(n,e){L(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class it{constructor(e){var{uid:t,auth:i,stsTokenManager:r}=e,s=ic(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new _T(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new fl(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await br(this,this.stsTokenManager.getToken(this.auth,e));return L(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return fT(this,e)}reload(){return gT(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new it(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await to(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qe(this.auth.app))return Promise.reject(Pt(this.auth));const e=await this.getIdToken();return await br(this,dT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,r,s,o,l,c,u,f;const p=(i=t.displayName)!==null&&i!==void 0?i:void 0,g=(r=t.email)!==null&&r!==void 0?r:void 0,w=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,S=(o=t.photoURL)!==null&&o!==void 0?o:void 0,N=(l=t.tenantId)!==null&&l!==void 0?l:void 0,k=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,j=(u=t.createdAt)!==null&&u!==void 0?u:void 0,B=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:$,emailVerified:ae,isAnonymous:Ye,providerData:_e,stsTokenManager:T}=t;L($&&T,e,"internal-error");const m=ci.fromJSON(this.name,T);L(typeof $=="string",e,"internal-error"),Gt(p,e.name),Gt(g,e.name),L(typeof ae=="boolean",e,"internal-error"),L(typeof Ye=="boolean",e,"internal-error"),Gt(w,e.name),Gt(S,e.name),Gt(N,e.name),Gt(k,e.name),Gt(j,e.name),Gt(B,e.name);const v=new it({uid:$,auth:e,email:g,emailVerified:ae,displayName:p,isAnonymous:Ye,photoURL:S,phoneNumber:w,tenantId:N,stsTokenManager:m,createdAt:j,lastLoginAt:B});return _e&&Array.isArray(_e)&&(v.providerData=_e.map(E=>Object.assign({},E))),k&&(v._redirectEventId=k),v}static async _fromIdTokenResponse(e,t,i=!1){const r=new ci;r.updateFromServerResponse(t);const s=new it({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:i});return await to(s),s}static async _fromGetAccountInfoResponse(e,t,i){const r=t.users[0];L(r.localId!==void 0,"internal-error");const s=r.providerUserInfo!==void 0?bp(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(s!=null&&s.length),l=new ci;l.updateFromIdToken(i);const c=new it({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new fl(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,u),c}}/**
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
 */const Yh=new Map;function St(n){Vt(n instanceof Function,"Expected a class definition");let e=Yh.get(n);return e?(Vt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Yh.set(n,e),e)}/**
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
 */class Pp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Pp.type="NONE";const Xh=Pp;/**
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
 */function Ls(n,e,t){return`firebase:${n}:${e}:${t}`}class ui{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:r,name:s}=this.auth;this.fullUserKey=Ls(this.userKey,r.apiKey,s),this.fullPersistenceKey=Ls("persistence",r.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await eo(this.auth,{idToken:e}).catch(()=>{});return t?it._fromGetAccountInfoResponse(this.auth,t,e):null}return it._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new ui(St(Xh),e,i);const r=(await Promise.all(t.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=r[0]||St(Xh);const o=Ls(i,e.config.apiKey,e.name);let l=null;for(const u of t)try{const f=await u._get(o);if(f){let p;if(typeof f=="string"){const g=await eo(e,{idToken:f}).catch(()=>{});if(!g)break;p=await it._fromGetAccountInfoResponse(e,g,f)}else p=it._fromJSON(e,f);u!==s&&(l=p),s=u;break}}catch{}const c=r.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new ui(s,e,i):(s=c[0],l&&await s._set(o,l.toJSON()),await Promise.all(t.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new ui(s,e,i))}}/**
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
 */function Jh(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Op(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(kp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xp(e))return"Blackberry";if(Mp(e))return"Webos";if(Np(e))return"Safari";if((e.includes("chrome/")||Dp(e))&&!e.includes("edge/"))return"Chrome";if(Vp(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function kp(n=Be()){return/firefox\//i.test(n)}function Np(n=Be()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Dp(n=Be()){return/crios\//i.test(n)}function Op(n=Be()){return/iemobile/i.test(n)}function Vp(n=Be()){return/android/i.test(n)}function xp(n=Be()){return/blackberry/i.test(n)}function Mp(n=Be()){return/webos/i.test(n)}function ac(n=Be()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ET(n=Be()){var e;return ac(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function TT(){return qy()&&document.documentMode===10}function Lp(n=Be()){return ac(n)||Vp(n)||Mp(n)||xp(n)||/windows phone/i.test(n)||Op(n)}/**
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
 */function Fp(n,e=[]){let t;switch(n){case"Browser":t=Jh(Be());break;case"Worker":t=`${Jh(Be())}-${n}`;break;default:t=n}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${$n}/${i}`}/**
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
 */class IT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=s=>new Promise((o,l)=>{try{const c=e(s);o(c)}catch(c){l(c)}});i.onAbort=t,this.queue.push(i);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function wT(n,e={}){return Bt(n,"GET","/v2/passwordPolicy",Ut(n,e))}/**
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
 */const AT=6;class CT{constructor(e){var t,i,r,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:AT,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,r,s,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(i=c.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let r=0;r<e.length;r++)i=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class RT{constructor(e,t,i,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Zh(this),this.idTokenSubscription=new Zh(this),this.beforeStateQueue=new IT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=wp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=St(t)),this._initializationPromise=this.queue(async()=>{var i,r,s;if(!this._deleted&&(this.persistenceManager=await ui.create(this,e),(i=this._resolvePersistenceManagerAvailable)===null||i===void 0||i.call(this),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await eo(this,{idToken:e}),i=await it._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Qe(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let r=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await to(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=rT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Qe(this.app))return Promise.reject(Pt(this));const t=e?re(e):null;return t&&L(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Qe(this.app)?Promise.reject(Pt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Qe(this.app)?Promise.reject(Pt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(St(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await wT(this),t=new CT(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Si("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await vT(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&St(e)||this._popupRedirectResolver;L(t,this,"argument-error"),this.redirectPersistenceManager=await ui.create(this,[St(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,r){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,i,r);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Fp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(Qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&tT(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function In(n){return re(n)}class Zh{constructor(e){this.auth=e,this.observer=null,this.addObserver=Xy(t=>this.observer=t)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Uo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ST(n){Uo=n}function Up(n){return Uo.loadJS(n)}function bT(){return Uo.recaptchaEnterpriseScript}function PT(){return Uo.gapiScript}function kT(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class NT{constructor(){this.enterprise=new DT}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class DT{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const OT="recaptcha-enterprise",Bp="NO_RECAPTCHA";class VT{constructor(e){this.type=OT,this.auth=In(e)}async verify(e="verify",t=!1){async function i(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{hT(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const u=new uT(c);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(c=>{l(c)})})}function r(s,o,l){const c=window.grecaptcha;Kh(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(Bp)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new NT().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{i(this.auth).then(l=>{if(!t&&Kh(window.grecaptcha))r(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=bT();c.length!==0&&(c+=l),Up(c).then(()=>{r(l,s,o)}).catch(u=>{o(u)})}}).catch(l=>{o(l)})})}}async function ed(n,e,t,i=!1,r=!1){const s=new VT(n);let o;if(r)o=Bp;else try{o=await s.verify(t)}catch{o=await s.verify(t,!0)}const l=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in l){const c=l.phoneEnrollmentInfo.phoneNumber,u=l.phoneEnrollmentInfo.recaptchaToken;Object.assign(l,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in l){const c=l.phoneSignInInfo.recaptchaToken;Object.assign(l,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return l}return i?Object.assign(l,{captchaResp:o}):Object.assign(l,{captchaResponse:o}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function no(n,e,t,i,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await ed(n,e,t,t==="getOobCode");return i(n,o)}else return i(n,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const l=await ed(n,e,t,t==="getOobCode");return i(n,l)}else return Promise.reject(o)})}/**
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
 */function xT(n,e){const t=Pi(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),s=t.getOptions();if(ln(s,e??{}))return r;ct(r,"already-initialized")}return t.initialize({options:e})}function MT(n,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(St);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function LT(n,e,t){const i=In(n);L(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const r=!1,s=qp(e),{host:o,port:l}=FT(e),c=l===null?"":`:${l}`,u={url:`${s}//${o}${c}/`},f=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!i._canInitEmulator){L(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),L(ln(u,i.config.emulator)&&ln(f,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=u,i.emulatorConfig=f,i.settings.appVerificationDisabledForTesting=!0,Tn(o)?(zl(`${s}//${o}${c}`),Gl("Auth",!0)):UT()}function qp(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function FT(n){const e=qp(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(i);if(r){const s=r[1];return{host:s,port:td(i.substr(s.length+1))}}else{const[s,o]=i.split(":");return{host:s,port:td(o)}}}function td(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function UT(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class lc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Rt("not implemented")}_getIdTokenResponse(e){return Rt("not implemented")}_linkToIdToken(e,t){return Rt("not implemented")}_getReauthenticationResolver(e){return Rt("not implemented")}}async function BT(n,e){return Bt(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function qT(n,e){return zr(n,"POST","/v1/accounts:signInWithPassword",Ut(n,e))}async function WT(n,e){return Bt(n,"POST","/v1/accounts:sendOobCode",Ut(n,e))}async function jT(n,e){return WT(n,e)}/**
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
 */async function $T(n,e){return zr(n,"POST","/v1/accounts:signInWithEmailLink",Ut(n,e))}async function HT(n,e){return zr(n,"POST","/v1/accounts:signInWithEmailLink",Ut(n,e))}/**
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
 */class Pr extends lc{constructor(e,t,i,r=null){super("password",i),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new Pr(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new Pr(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return no(e,t,"signInWithPassword",qT);case"emailLink":return $T(e,{email:this._email,oobCode:this._password});default:ct(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return no(e,i,"signUpPassword",BT);case"emailLink":return HT(e,{idToken:t,email:this._email,oobCode:this._password});default:ct(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function hi(n,e){return zr(n,"POST","/v1/accounts:signInWithIdp",Ut(n,e))}/**
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
 */const zT="http://localhost";class Mn extends lc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Mn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ct("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:r}=t,s=ic(t,["providerId","signInMethod"]);if(!i||!r)return null;const o=new Mn(i,r);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return hi(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,hi(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,hi(e,t)}buildRequest(){const e={requestUri:zT,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=bi(t)}return e}}/**
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
 */function GT(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function KT(n){const e=ar(lr(n)).link,t=e?ar(lr(e)).deep_link_id:null,i=ar(lr(n)).deep_link_id;return(i?ar(lr(i)).link:null)||i||t||e||n}class cc{constructor(e){var t,i,r,s,o,l;const c=ar(lr(e)),u=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(i=c.oobCode)!==null&&i!==void 0?i:null,p=GT((r=c.mode)!==null&&r!==void 0?r:null);L(u&&f&&p,"argument-error"),this.apiKey=u,this.operation=p,this.code=f,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=c.lang)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=KT(e);try{return new cc(t)}catch{return null}}}/**
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
 */class ki{constructor(){this.providerId=ki.PROVIDER_ID}static credential(e,t){return Pr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=cc.parseLink(t);return L(i,"argument-error"),Pr._fromEmailAndCode(e,i.code,i.tenantId)}}ki.PROVIDER_ID="password";ki.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ki.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Wp{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Gr extends Wp{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Kt extends Gr{constructor(){super("facebook.com")}static credential(e){return Mn._fromParams({providerId:Kt.PROVIDER_ID,signInMethod:Kt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Kt.credentialFromTaggedObject(e)}static credentialFromError(e){return Kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Kt.credential(e.oauthAccessToken)}catch{return null}}}Kt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Kt.PROVIDER_ID="facebook.com";/**
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
 */class Qt extends Gr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Mn._fromParams({providerId:Qt.PROVIDER_ID,signInMethod:Qt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Qt.credentialFromTaggedObject(e)}static credentialFromError(e){return Qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return Qt.credential(t,i)}catch{return null}}}Qt.GOOGLE_SIGN_IN_METHOD="google.com";Qt.PROVIDER_ID="google.com";/**
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
 */class Yt extends Gr{constructor(){super("github.com")}static credential(e){return Mn._fromParams({providerId:Yt.PROVIDER_ID,signInMethod:Yt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Yt.credentialFromTaggedObject(e)}static credentialFromError(e){return Yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Yt.credential(e.oauthAccessToken)}catch{return null}}}Yt.GITHUB_SIGN_IN_METHOD="github.com";Yt.PROVIDER_ID="github.com";/**
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
 */class Xt extends Gr{constructor(){super("twitter.com")}static credential(e,t){return Mn._fromParams({providerId:Xt.PROVIDER_ID,signInMethod:Xt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Xt.credentialFromTaggedObject(e)}static credentialFromError(e){return Xt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Xt.credential(t,i)}catch{return null}}}Xt.TWITTER_SIGN_IN_METHOD="twitter.com";Xt.PROVIDER_ID="twitter.com";/**
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
 */async function QT(n,e){return zr(n,"POST","/v1/accounts:signUp",Ut(n,e))}/**
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
 */class Ln{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,r=!1){const s=await it._fromIdTokenResponse(e,i,r),o=nd(i);return new Ln({user:s,providerId:o,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const r=nd(i);return new Ln({user:e,providerId:r,_tokenResponse:i,operationType:t})}}function nd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class io extends Ft{constructor(e,t,i,r){var s;super(t.code,t.message),this.operationType=i,this.user=r,Object.setPrototypeOf(this,io.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,r){return new io(e,t,i,r)}}function jp(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?io._fromErrorAndOperation(n,s,e,i):s})}async function YT(n,e,t=!1){const i=await br(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Ln._forOperation(n,"link",i)}/**
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
 */async function XT(n,e,t=!1){const{auth:i}=n;if(Qe(i.app))return Promise.reject(Pt(i));const r="reauthenticate";try{const s=await br(n,jp(i,r,e,n),t);L(s.idToken,i,"internal-error");const o=oc(s.idToken);L(o,i,"internal-error");const{sub:l}=o;return L(n.uid===l,i,"user-mismatch"),Ln._forOperation(n,r,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ct(i,"user-mismatch"),s}}/**
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
 */async function $p(n,e,t=!1){if(Qe(n.app))return Promise.reject(Pt(n));const i="signIn",r=await jp(n,i,e),s=await Ln._fromIdTokenResponse(n,i,r);return t||await n._updateCurrentUser(s.user),s}async function JT(n,e){return $p(In(n),e)}/**
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
 */async function Hp(n){const e=In(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function jP(n,e,t){const i=In(n);await no(i,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",jT)}async function $P(n,e,t){if(Qe(n.app))return Promise.reject(Pt(n));const i=In(n),o=await no(i,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",QT).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Hp(n),c}),l=await Ln._fromIdTokenResponse(i,"signIn",o);return await i._updateCurrentUser(l.user),l}function HP(n,e,t){return Qe(n.app)?Promise.reject(Pt(n)):JT(re(n),ki.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&Hp(n),i})}function ZT(n,e,t,i){return re(n).onIdTokenChanged(e,t,i)}function eI(n,e,t){return re(n).beforeAuthStateChanged(e,t)}function zP(n,e,t,i){return re(n).onAuthStateChanged(e,t,i)}function GP(n){return re(n).signOut()}const ro="__sak";/**
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
 */class zp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ro,"1"),this.storage.removeItem(ro),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const tI=1e3,nI=10;class Gp extends zp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Lp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),r=this.localCache[t];i!==r&&e(t,r,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const i=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(i);!t&&this.localCache[i]===o||this.notifyListeners(i,o)},s=this.storage.getItem(i);TT()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,nI):r()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},tI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Gp.type="LOCAL";const iI=Gp;/**
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
 */class Kp extends zp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Kp.type="SESSION";const Qp=Kp;/**
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
 */function rI(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Bo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const i=new Bo(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:r,data:s}=t.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:r});const l=Array.from(o).map(async u=>u(t.origin,s)),c=await rI(l);t.ports[0].postMessage({status:"done",eventId:i,eventType:r,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Bo.receivers=[];/**
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
 */function uc(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class sI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,o;return new Promise((l,c)=>{const u=uc("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:r,onMessage(p){const g=p;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(g.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function pt(){return window}function oI(n){pt().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */function Yp(){return typeof pt().WorkerGlobalScope<"u"&&typeof pt().importScripts=="function"}async function aI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function lI(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function cI(){return Yp()?self:null}/**
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
 */const Xp="firebaseLocalStorageDb",uI=1,so="firebaseLocalStorage",Jp="fbase_key";class Kr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function qo(n,e){return n.transaction([so],e?"readwrite":"readonly").objectStore(so)}function hI(){const n=indexedDB.deleteDatabase(Xp);return new Kr(n).toPromise()}function pl(){const n=indexedDB.open(Xp,uI);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(so,{keyPath:Jp})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(so)?e(i):(i.close(),await hI(),e(await pl()))})})}async function id(n,e,t){const i=qo(n,!0).put({[Jp]:e,value:t});return new Kr(i).toPromise()}async function dI(n,e){const t=qo(n,!1).get(e),i=await new Kr(t).toPromise();return i===void 0?null:i.value}function rd(n,e){const t=qo(n,!0).delete(e);return new Kr(t).toPromise()}const fI=800,pI=3;class Zp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await pl(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>pI)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Yp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Bo._getInstance(cI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await aI(),!this.activeServiceWorker)return;this.sender=new sI(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((t=i[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||lI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await pl();return await id(e,ro,"1"),await rd(e,ro),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>id(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>dI(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>rd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const s=qo(r,!1).getAll();return new Kr(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:r,value:s}of e)i.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!i.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),fI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Zp.type="LOCAL";const _I=Zp;new Hr(3e4,6e4);/**
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
 */function gI(n,e){return e?St(e):(L(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class hc extends lc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return hi(e,this._buildIdpRequest())}_linkToIdToken(e,t){return hi(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return hi(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function mI(n){return $p(n.auth,new hc(n),n.bypassAuthState)}function yI(n){const{auth:e,user:t}=n;return L(t,e,"internal-error"),XT(t,new hc(n),n.bypassAuthState)}async function vI(n){const{auth:e,user:t}=n;return L(t,e,"internal-error"),YT(t,new hc(n),n.bypassAuthState)}/**
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
 */class e_{constructor(e,t,i,r,s=!1){this.auth=e,this.resolver=i,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:r,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:i,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mI;case"linkViaPopup":case"linkViaRedirect":return vI;case"reauthViaPopup":case"reauthViaRedirect":return yI;default:ct(this.auth,"internal-error")}}resolve(e){Vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const EI=new Hr(2e3,1e4);class ai extends e_{constructor(e,t,i,r,s){super(e,t,r,s),this.provider=i,this.authWindow=null,this.pollId=null,ai.currentPopupAction&&ai.currentPopupAction.cancel(),ai.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Vt(this.filter.length===1,"Popup operations only handle one event");const e=uc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(ft(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ft(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ai.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if(!((i=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ft(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,EI.get())};e()}}ai.currentPopupAction=null;/**
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
 */const TI="pendingRedirect",Fs=new Map;class II extends e_{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=Fs.get(this.auth._key());if(!e){try{const i=await wI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}Fs.set(this.auth._key(),e)}return this.bypassAuthState||Fs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function wI(n,e){const t=RI(e),i=CI(n);if(!await i._isAvailable())return!1;const r=await i._get(t)==="true";return await i._remove(t),r}function AI(n,e){Fs.set(n._key(),e)}function CI(n){return St(n._redirectPersistence)}function RI(n){return Ls(TI,n.config.apiKey,n.name)}async function SI(n,e,t=!1){if(Qe(n.app))return Promise.reject(Pt(n));const i=In(n),r=gI(i,e),o=await new II(i,r,t).execute();return o&&!t&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
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
 */const bI=600*1e3;class PI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!kI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!t_(e)){const r=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";t.onError(ft(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bI&&this.cachedEventUids.clear(),this.cachedEventUids.has(sd(e))}saveEventToCache(e){this.cachedEventUids.add(sd(e)),this.lastProcessedEventTime=Date.now()}}function sd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function t_({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function kI(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return t_(n);default:return!1}}/**
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
 */async function NI(n,e={}){return Bt(n,"GET","/v1/projects",e)}/**
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
 */const DI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,OI=/^https?/;async function VI(n){if(n.config.emulator)return;const{authorizedDomains:e}=await NI(n);for(const t of e)try{if(xI(t))return}catch{}ct(n,"unauthorized-domain")}function xI(n){const e=dl(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===i}if(!OI.test(t))return!1;if(DI.test(n))return i===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const MI=new Hr(3e4,6e4);function od(){const n=pt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function LI(n){return new Promise((e,t)=>{var i,r,s;function o(){od(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{od(),t(ft(n,"network-request-failed"))},timeout:MI.get()})}if(!((r=(i=pt().gapi)===null||i===void 0?void 0:i.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((s=pt().gapi)===null||s===void 0)&&s.load)o();else{const l=kT("iframefcb");return pt()[l]=()=>{gapi.load?o():t(ft(n,"network-request-failed"))},Up(`${PT()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw Us=null,e})}let Us=null;function FI(n){return Us=Us||LI(n),Us}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const UI=new Hr(5e3,15e3),BI="__/auth/iframe",qI="emulator/auth/iframe",WI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function $I(n){const e=n.config;L(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?sc(e,qI):`https://${n.config.authDomain}/${BI}`,i={apiKey:e.apiKey,appName:n.name,v:$n},r=jI.get(n.config.apiHost);r&&(i.eid=r);const s=n._getFrameworks();return s.length&&(i.fw=s.join(",")),`${t}?${bi(i).slice(1)}`}async function HI(n){const e=await FI(n),t=pt().gapi;return L(t,n,"internal-error"),e.open({where:document.body,url:$I(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:WI,dontclear:!0},i=>new Promise(async(r,s)=>{await i.restyle({setHideOnLeave:!1});const o=ft(n,"network-request-failed"),l=pt().setTimeout(()=>{s(o)},UI.get());function c(){pt().clearTimeout(l),r(i)}i.ping(c).then(c,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const zI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},GI=500,KI=600,QI="_blank",YI="http://localhost";class ad{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function XI(n,e,t,i=GI,r=KI){const s=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const c=Object.assign(Object.assign({},zI),{width:i.toString(),height:r.toString(),top:s,left:o}),u=Be().toLowerCase();t&&(l=Dp(u)?QI:t),kp(u)&&(e=e||YI,c.scrollbars="yes");const f=Object.entries(c).reduce((g,[w,S])=>`${g}${w}=${S},`,"");if(ET(u)&&l!=="_self")return JI(e||"",l),new ad(null);const p=window.open(e||"",l,f);L(p,n,"popup-blocked");try{p.focus()}catch{}return new ad(p)}function JI(n,e){const t=document.createElement("a");t.href=n,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
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
 */const ZI="__/auth/handler",ew="emulator/auth/handler",tw=encodeURIComponent("fac");async function ld(n,e,t,i,r,s){L(n.config.authDomain,n,"auth-domain-config-required"),L(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:$n,eventId:r};if(e instanceof Wp){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Ys(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof Gr){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),u=c?`#${tw}=${encodeURIComponent(c)}`:"";return`${nw(n)}?${bi(l).slice(1)}${u}`}function nw({config:n}){return n.emulator?sc(n,ew):`https://${n.authDomain}/${ZI}`}/**
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
 */const Ga="webStorageSupport";class iw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Qp,this._completeRedirectFn=SI,this._overrideRedirectResult=AI}async _openPopup(e,t,i,r){var s;Vt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await ld(e,t,i,dl(),r);return XI(e,o,uc())}async _openRedirect(e,t,i,r){await this._originValidation(e);const s=await ld(e,t,i,dl(),r);return oI(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:s}=this.eventManagers[t];return r?Promise.resolve(r):(Vt(s,"If manager is not set, promise should be"),s)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await HI(e),i=new PI(e);return t.register("authEvent",r=>(L(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:i.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ga,{type:Ga},r=>{var s;const o=(s=r==null?void 0:r[0])===null||s===void 0?void 0:s[Ga];o!==void 0&&t(!!o),ct(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=VI(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Lp()||Np()||ac()}}const rw=iw;var cd="@firebase/auth",ud="1.10.8";/**
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
 */class sw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function ow(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function aw(n){Ot(new Et("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;L(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Fp(n)},u=new RT(i,r,s,c);return MT(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Ot(new Et("auth-internal",e=>{const t=In(e.getProvider("auth").getImmediate());return(i=>new sw(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ot(cd,ud,ow(n)),ot(cd,ud,"esm2017")}/**
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
 */const lw=300,cw=ip("authIdTokenMaxAge")||lw;let hd=null;const uw=n=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>cw)return;const r=t==null?void 0:t.token;hd!==r&&(hd=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function KP(n=Lo()){const e=Pi(n,"auth");if(e.isInitialized())return e.getImmediate();const t=xT(n,{popupRedirectResolver:rw,persistence:[_I,iI,Qp]}),i=ip("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(i,location.origin);if(location.origin===s.origin){const o=uw(s.toString());eI(t,o,()=>o(t.currentUser)),ZT(t,l=>o(l))}}const r=ep("auth");return r&&LT(t,`http://${r}`),t}function hw(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}ST({loadJS(n){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=r=>{const s=ft("internal-error");s.customData=r,t(s)},i.type="text/javascript",i.charset="UTF-8",hw().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});aw("Browser");var dd={};const fd="@firebase/database",pd="1.0.20";/**
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
 */let n_="";function dw(n){n_=n}/**
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
 */class fw{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Te(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Cr(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class pw{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return It(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const i_=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new fw(e)}}catch{}return new pw},Pn=i_("localStorage"),_w=i_("sessionStorage");/**
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
 */const di=new $r("@firebase/database"),gw=(function(){let n=1;return function(){return n++}})(),r_=function(n){const e=ev(n),t=new Yy;t.update(e);const i=t.digest();return Vo.encodeByteArray(i)},Qr=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Qr.apply(null,i):typeof i=="object"?e+=Te(i):e+=i,e+=" "}return e};let gr=null,_d=!0;const mw=function(n,e){D(!0,"Can't turn on custom loggers persistently."),di.logLevel=Q.VERBOSE,gr=di.log.bind(di)},Re=function(...n){if(_d===!0&&(_d=!1,gr===null&&_w.get("logging_enabled")===!0&&mw()),gr){const e=Qr.apply(null,n);gr(e)}},Yr=function(n){return function(...e){Re(n,...e)}},_l=function(...n){const e="FIREBASE INTERNAL ERROR: "+Qr(...n);di.error(e)},xt=function(...n){const e=`FIREBASE FATAL ERROR: ${Qr(...n)}`;throw di.error(e),new Error(e)},Ue=function(...n){const e="FIREBASE WARNING: "+Qr(...n);di.warn(e)},yw=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&Ue("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Wo=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},vw=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Fn="[MIN_NAME]",cn="[MAX_NAME]",Hn=function(n,e){if(n===e)return 0;if(n===Fn||e===cn)return-1;if(e===Fn||n===cn)return 1;{const t=gd(n),i=gd(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},Ew=function(n,e){return n===e?0:n<e?-1:1},ir=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Te(e))},dc=function(n){if(typeof n!="object"||n===null)return Te(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=Te(e[i]),t+=":",t+=dc(n[e[i]]);return t+="}",t},s_=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let r=0;r<t;r+=e)r+e>t?i.push(n.substring(r,t)):i.push(n.substring(r,r+e));return i};function Se(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const o_=function(n){D(!Wo(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let r,s,o,l,c;n===0?(s=0,o=0,r=1/n===-1/0?1:0):(r=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),i),s=l+i,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(s=0,o=Math.round(n/Math.pow(2,1-i-t))));const u=[];for(c=t;c;c-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)u.push(s%2?1:0),s=Math.floor(s/2);u.push(r?1:0),u.reverse();const f=u.join("");let p="";for(c=0;c<64;c+=8){let g=parseInt(f.substr(c,8),2).toString(16);g.length===1&&(g="0"+g),p=p+g}return p.toLowerCase()},Tw=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Iw=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function ww(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const Aw=new RegExp("^-?(0*)\\d{1,10}$"),Cw=-2147483648,Rw=2147483647,gd=function(n){if(Aw.test(n)){const e=Number(n);if(e>=Cw&&e<=Rw)return e}return null},Ni=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw Ue("Exception was thrown by user callback.",t),e},Math.floor(0))}},Sw=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},mr=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class bw{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Qe(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){Ue(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
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
 */class Pw{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(r=>this.auth_=r)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Re("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Ue(e)}}class Bs{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Bs.OWNER="owner";/**
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
 */const fc="5",a_="v",l_="s",c_="r",u_="f",h_=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,d_="ls",f_="p",gl="ac",p_="websocket",__="long_polling";/**
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
 */class g_{constructor(e,t,i,r,s=!1,o="",l=!1,c=!1,u=null){this.secure=t,this.namespace=i,this.webSocketOnly=r,this.nodeAdmin=s,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this.emulatorOptions=u,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Pn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Pn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function kw(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function m_(n,e,t){D(typeof e=="string","typeof type must == string"),D(typeof t=="object","typeof params must == object");let i;if(e===p_)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===__)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);kw(n)&&(t.ns=n.namespace);const r=[];return Se(t,(s,o)=>{r.push(s+"="+o)}),i+r.join("&")}/**
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
 */class Nw{constructor(){this.counters_={}}incrementCounter(e,t=1){It(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return Ny(this.counters_)}}/**
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
 */const Ka={},Qa={};function pc(n){const e=n.toString();return Ka[e]||(Ka[e]=new Nw),Ka[e]}function Dw(n,e){const t=n.toString();return Qa[t]||(Qa[t]=e()),Qa[t]}/**
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
 */class Ow{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let r=0;r<i.length;++r)i[r]&&Ni(()=>{this.onMessage_(i[r])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const md="start",Vw="close",xw="pLPCommand",Mw="pRTLPCB",y_="id",v_="pw",E_="ser",Lw="cb",Fw="seg",Uw="ts",Bw="d",qw="dframe",T_=1870,I_=30,Ww=T_-I_,jw=25e3,$w=3e4;class kn{constructor(e,t,i,r,s,o,l){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=r,this.authToken=s,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Yr(e),this.stats_=pc(t),this.urlFn=c=>(this.appCheckToken&&(c[gl]=this.appCheckToken),m_(t,__,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new Ow(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor($w)),vw(()=>{if(this.isClosed_)return;this.scriptTagHolder=new _c((...s)=>{const[o,l,c,u,f]=s;if(this.incrementIncomingBytes_(s),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===md)this.id=l,this.password=c;else if(o===Vw)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...s)=>{const[o,l]=s;this.incrementIncomingBytes_(s),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const i={};i[md]="t",i[E_]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[Lw]=this.scriptTagHolder.uniqueCallbackIdentifier),i[a_]=fc,this.transportSessionId&&(i[l_]=this.transportSessionId),this.lastSessionId&&(i[d_]=this.lastSessionId),this.applicationId&&(i[f_]=this.applicationId),this.appCheckToken&&(i[gl]=this.appCheckToken),typeof location<"u"&&location.hostname&&h_.test(location.hostname)&&(i[c_]=u_);const r=this.urlFn(i);this.log_("Connecting via long-poll to "+r),this.scriptTagHolder.addTag(r,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){kn.forceAllow_=!0}static forceDisallow(){kn.forceDisallow_=!0}static isAvailable(){return kn.forceAllow_?!0:!kn.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Tw()&&!Iw()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Te(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=Xf(t),r=s_(i,Ww);for(let s=0;s<r.length;s++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,r.length,r[s]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[qw]="t",i[y_]=e,i[v_]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Te(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class _c{constructor(e,t,i,r){this.onDisconnect=i,this.urlFn=r,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=gw(),window[xw+this.uniqueCallbackIdentifier]=e,window[Mw+this.uniqueCallbackIdentifier]=t,this.myIFrame=_c.createIFrame_();let s="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(s='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+s+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){Re("frame writing exception"),l.stack&&Re(l.stack),Re(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Re("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[y_]=this.myID,e[v_]=this.myPW,e[E_]=this.currentSerial;let t=this.urlFn(e),i="",r=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+I_+i.length<=T_;){const o=this.pendingSegs.shift();i=i+"&"+Fw+r+"="+o.seg+"&"+Uw+r+"="+o.ts+"&"+Bw+r+"="+o.d,r++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},r=setTimeout(i,Math.floor(jw)),s=()=>{clearTimeout(r),i()};this.addTag(e,s)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const r=i.readyState;(!r||r==="loaded"||r==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{Re("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
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
 */const Hw=16384,zw=45e3;let oo=null;typeof MozWebSocket<"u"?oo=MozWebSocket:typeof WebSocket<"u"&&(oo=WebSocket);class nt{constructor(e,t,i,r,s,o,l){this.connId=e,this.applicationId=i,this.appCheckToken=r,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Yr(this.connId),this.stats_=pc(t),this.connURL=nt.connectionURL_(t,o,l,r,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,r,s){const o={};return o[a_]=fc,typeof location<"u"&&location.hostname&&h_.test(location.hostname)&&(o[c_]=u_),t&&(o[l_]=t),i&&(o[d_]=i),r&&(o[gl]=r),s&&(o[f_]=s),m_(e,p_,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Pn.set("previous_websocket_failure",!0);try{let i;Wy(),this.mySock=new oo(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_()}}start(){}static forceDisallow(){nt.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&oo!==null&&!nt.forceDisallow_}static previouslyFailed(){return Pn.isInMemoryStorage||Pn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Pn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=Cr(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(D(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=Te(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=s_(t,Hw);i.length>1&&this.sendString_(String(i.length));for(let r=0;r<i.length;r++)this.sendString_(i[r])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(zw))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}nt.responsesRequiredToBeHealthy=2;nt.healthyTimeout=3e4;/**
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
 */class gi{static get ALL_TRANSPORTS(){return[kn,nt]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=nt&&nt.isAvailable();let i=t&&!nt.previouslyFailed();if(e.webSocketOnly&&(t||Ue("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[nt];else{const r=this.transports_=[];for(const s of gi.ALL_TRANSPORTS)s&&s.isAvailable()&&r.push(s);gi.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}gi.globalTransportInitialized_=!1;/**
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
 */const Gw=6e4,Kw=5e3,Qw=10*1024,Yw=100*1024,Ya="t",yd="d",Xw="s",vd="r",Jw="e",Ed="o",Td="a",Id="n",wd="p",Zw="h";class eA{constructor(e,t,i,r,s,o,l,c,u,f){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=r,this.authToken_=s,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=u,this.lastSessionId=f,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Yr("c:"+this.id+":"),this.transportManager_=new gi(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const r=e.healthyTimeout||0;r>0&&(this.healthyTimeout_=mr(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Yw?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Qw?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(r)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Ya in e){const t=e[Ya];t===Td?this.upgradeIfSecondaryHealthy_():t===vd?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Ed&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=ir("t",e),i=ir("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:wd,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Td,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Id,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=ir("t",e),i=ir("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=ir(Ya,e);if(yd in e){const i=e[yd];if(t===Zw){const r=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(r.h=this.repoInfo_.host),this.onHandshake_(r)}else if(t===Id){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let r=0;r<this.pendingDataMessages.length;++r)this.onDataMessage_(this.pendingDataMessages[r]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Xw?this.onConnectionShutdown_(i):t===vd?this.onReset_(i):t===Jw?_l("Server Error: "+i):t===Ed?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):_l("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,r=e.h;this.sessionId=e.s,this.repoInfo_.host=r,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),fc!==i&&Ue("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),mr(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Gw))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):mr(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Kw))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:wd,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Pn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class w_{put(e,t,i,r){}merge(e,t,i,r){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
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
 */class A_{constructor(e){this.allowedEvents_=e,this.listeners_={},D(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let r=0;r<i.length;r++)i[r].callback.apply(i[r].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const r=this.getInitialEvent(e);r&&t.apply(i,r)}off(e,t,i){this.validateEventType_(e);const r=this.listeners_[e]||[];for(let s=0;s<r.length;s++)if(r[s].callback===t&&(!i||i===r[s].context)){r.splice(s,1);return}}validateEventType_(e){D(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
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
 */class ao extends A_{static getInstance(){return new ao}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Kl()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return D(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const Ad=32,Cd=768;class te{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let r=0;r<this.pieces_.length;r++)this.pieces_[r].length>0&&(this.pieces_[i]=this.pieces_[r],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function Z(){return new te("")}function H(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function un(n){return n.pieces_.length-n.pieceNum_}function ie(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new te(n.pieces_,e)}function gc(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function tA(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function kr(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function C_(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new te(e,0)}function he(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof te)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let r=0;r<i.length;r++)i[r].length>0&&t.push(i[r])}return new te(t,0)}function z(n){return n.pieceNum_>=n.pieces_.length}function je(n,e){const t=H(n),i=H(e);if(t===null)return e;if(t===i)return je(ie(n),ie(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function nA(n,e){const t=kr(n,0),i=kr(e,0);for(let r=0;r<t.length&&r<i.length;r++){const s=Hn(t[r],i[r]);if(s!==0)return s}return t.length===i.length?0:t.length<i.length?-1:1}function mc(n,e){if(un(n)!==un(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function Ze(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(un(n)>un(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class iA{constructor(e,t){this.errorPrefix_=t,this.parts_=kr(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=Mo(this.parts_[i]);R_(this)}}function rA(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Mo(e),R_(n)}function sA(n){const e=n.parts_.pop();n.byteLength_-=Mo(e),n.parts_.length>0&&(n.byteLength_-=1)}function R_(n){if(n.byteLength_>Cd)throw new Error(n.errorPrefix_+"has a key path longer than "+Cd+" bytes ("+n.byteLength_+").");if(n.parts_.length>Ad)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Ad+") or object contains a cycle "+bn(n))}function bn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
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
 */class yc extends A_{static getInstance(){return new yc}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return D(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const rr=1e3,oA=300*1e3,Rd=30*1e3,aA=1.3,lA=3e4,cA="server_kill",Sd=3;class kt extends w_{constructor(e,t,i,r,s,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=r,this.onServerInfoUpdate_=s,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=kt.nextPersistentConnectionId_++,this.log_=Yr("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=rr,this.maxReconnectDelay_=oA,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");yc.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&ao.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const r=++this.requestNumber_,s={r,a:e,b:t};this.log_(Te(s)),D(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),i&&(this.requestCBHash_[r]=i)}get(e){this.initConnection_();const t=new He,r={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(r),this.outstandingGetCount_++;const s=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(s),t.promise}listen(e,t,i,r){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),D(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const l={onComplete:r,hashFn:t,query:e,tag:i};this.listens.get(o).set(s,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),r=t._queryIdentifier;this.log_("Listen on "+i+" for "+r);const s={p:i},o="q";e.tag&&(s.q=t._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest(o,s,l=>{const c=l.d,u=l.s;kt.warnOnListenWarnings_(c,t),(this.listens.get(i)&&this.listens.get(i).get(r))===e&&(this.log_("listen response",l),u!=="ok"&&this.removeListen_(i,r),e.onComplete&&e.onComplete(u,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&It(e,"w")){const i=pi(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const r='".indexOn": "'+t._queryParams.getIndex().toString()+'"',s=t._path.toString();Ue(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${r} at ${s} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Qy(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Rd)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=Ky(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,r=>{const s=r.s,o=r.d||"error";this.authToken_===e&&(s==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(s,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),r=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+r),D(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,r)&&this.connected_&&this.sendUnlisten_(i,r,e._queryObject,t)}sendUnlisten_(e,t,i,r){this.log_("Unlisten on "+e+" for "+t);const s={p:e},o="n";r&&(s.q=i,s.t=r),this.sendRequest(o,s)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,r){const s={p:t,d:i};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,o=>{r&&setTimeout(()=>{r(o.s,o.d)},Math.floor(0))})}put(e,t,i,r){this.putInternal("p",e,t,i,r)}merge(e,t,i,r){this.putInternal("m",e,t,i,r)}putInternal(e,t,i,r,s){this.initConnection_();const o={p:t,d:i};s!==void 0&&(o.h=s),this.outstandingPuts_.push({action:e,request:o,onComplete:r}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,r=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,s=>{this.log_(t+" response",s),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),r&&r(s.s,s.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const s=i.d;this.log_("reportStats","Error sending stats: "+s)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Te(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):_l("Unrecognized action received from server: "+Te(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){D(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=rr,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=rr,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>lA&&(this.reconnectDelay_=rr),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*aA)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),r=this.id+":"+kt.nextConnectionId_++,s=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,i())},u=function(p){D(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:c,sendRequest:u};const f=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,g]=await Promise.all([this.authTokenProvider_.getToken(f),this.appCheckTokenProvider_.getToken(f)]);o?Re("getToken() completed but was canceled"):(Re("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=g&&g.token,l=new eA(r,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,w=>{Ue(w+" ("+this.repoInfo_.toString()+")"),this.interrupt(cA)},s))}catch(p){this.log_("Failed to get token: "+p),o||(this.repoInfo_.nodeAdmin&&Ue(p),c())}}}interrupt(e){Re("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Re("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Ys(this.interruptReasons_)&&(this.reconnectDelay_=rr,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(s=>dc(s)).join("$"):i="default";const r=this.removeListen_(e,i);r&&r.onComplete&&r.onComplete("permission_denied")}removeListen_(e,t){const i=new te(e).toString();let r;if(this.listens.has(i)){const s=this.listens.get(i);r=s.get(t),s.delete(t),s.size===0&&this.listens.delete(i)}else r=void 0;return r}onAuthRevoked_(e,t){Re("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Sd&&(this.reconnectDelay_=Rd,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Re("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Sd&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+n_.replace(/\./g,"-")]=1,Kl()?e["framework.cordova"]=1:sp()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=ao.getInstance().currentlyOnline();return Ys(this.interruptReasons_)&&e}}kt.nextPersistentConnectionId_=0;kt.nextConnectionId_=0;/**
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
 */class K{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new K(e,t)}}/**
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
 */class jo{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new K(Fn,e),r=new K(Fn,t);return this.compare(i,r)!==0}minPost(){return K.MIN}}/**
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
 */let Ps;class S_ extends jo{static get __EMPTY_NODE(){return Ps}static set __EMPTY_NODE(e){Ps=e}compare(e,t){return Hn(e.name,t.name)}isDefinedOn(e){throw Ri("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return K.MIN}maxPost(){return new K(cn,Ps)}makePost(e,t){return D(typeof e=="string","KeyIndex indexValue must always be a string."),new K(e,Ps)}toString(){return".key"}}const Dn=new S_;/**
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
 */let ks=class{constructor(e,t,i,r,s=null){this.isReverse_=r,this.resultGenerator_=s,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,r&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},Ke=class cr{constructor(e,t,i,r,s){this.key=e,this.value=t,this.color=i??cr.RED,this.left=r??dt.EMPTY_NODE,this.right=s??dt.EMPTY_NODE}copy(e,t,i,r,s){return new cr(e??this.key,t??this.value,i??this.color,r??this.left,s??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let r=this;const s=i(e,r.key);return s<0?r=r.copy(null,null,null,r.left.insert(e,t,i),null):s===0?r=r.copy(null,t,null,null,null):r=r.copy(null,null,null,null,r.right.insert(e,t,i)),r.fixUp_()}removeMin_(){if(this.left.isEmpty())return dt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,r;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return dt.EMPTY_NODE;r=i.right.min_(),i=i.copy(r.key,r.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,cr.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,cr.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};Ke.RED=!0;Ke.BLACK=!1;class uA{copy(e,t,i,r,s){return this}insert(e,t,i){return new Ke(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let dt=class qs{constructor(e,t=qs.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new qs(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Ke.BLACK,null,null))}remove(e){return new qs(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Ke.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,r=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return r?r.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(r=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ks(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ks(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ks(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ks(this.root_,null,this.comparator_,!0,e)}};dt.EMPTY_NODE=new uA;/**
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
 */function hA(n,e){return Hn(n.name,e.name)}function vc(n,e){return Hn(n,e)}/**
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
 */let ml;function dA(n){ml=n}const b_=function(n){return typeof n=="number"?"number:"+o_(n):"string:"+n},P_=function(n){if(n.isLeafNode()){const e=n.val();D(typeof e=="string"||typeof e=="number"||typeof e=="object"&&It(e,".sv"),"Priority must be a string or number.")}else D(n===ml||n.isEmpty(),"priority of unexpected type.");D(n===ml||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let bd;class Ae{static set __childrenNodeConstructor(e){bd=e}static get __childrenNodeConstructor(){return bd}constructor(e,t=Ae.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,D(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),P_(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Ae(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Ae.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return z(e)?this:H(e)===".priority"?this.priorityNode_:Ae.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Ae.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=H(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(D(i!==".priority"||un(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,Ae.__childrenNodeConstructor.EMPTY_NODE.updateChild(ie(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+b_(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=o_(this.value_):e+=this.value_,this.lazyHash_=r_(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Ae.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Ae.__childrenNodeConstructor?-1:(D(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,r=Ae.VALUE_TYPE_ORDER.indexOf(t),s=Ae.VALUE_TYPE_ORDER.indexOf(i);return D(r>=0,"Unknown leaf type: "+t),D(s>=0,"Unknown leaf type: "+i),r===s?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-r}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Ae.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let k_,N_;function fA(n){k_=n}function pA(n){N_=n}class _A extends jo{compare(e,t){const i=e.node.getPriority(),r=t.node.getPriority(),s=i.compareTo(r);return s===0?Hn(e.name,t.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return K.MIN}maxPost(){return new K(cn,new Ae("[PRIORITY-POST]",N_))}makePost(e,t){const i=k_(e);return new K(t,new Ae("[PRIORITY-POST]",i))}toString(){return".priority"}}const ue=new _A;/**
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
 */const gA=Math.log(2);class mA{constructor(e){const t=s=>parseInt(Math.log(s)/gA,10),i=s=>parseInt(Array(s+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const r=i(this.count);this.bits_=e+1&r}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const lo=function(n,e,t,i){n.sort(e);const r=function(c,u){const f=u-c;let p,g;if(f===0)return null;if(f===1)return p=n[c],g=t?t(p):p,new Ke(g,p.node,Ke.BLACK,null,null);{const w=parseInt(f/2,10)+c,S=r(c,w),N=r(w+1,u);return p=n[w],g=t?t(p):p,new Ke(g,p.node,Ke.BLACK,S,N)}},s=function(c){let u=null,f=null,p=n.length;const g=function(S,N){const k=p-S,j=p;p-=S;const B=r(k+1,j),$=n[k],ae=t?t($):$;w(new Ke(ae,$.node,N,null,B))},w=function(S){u?(u.left=S,u=S):(f=S,u=S)};for(let S=0;S<c.count;++S){const N=c.nextBitIsOne(),k=Math.pow(2,c.count-(S+1));N?g(k,Ke.BLACK):(g(k,Ke.BLACK),g(k,Ke.RED))}return f},o=new mA(n.length),l=s(o);return new dt(i||e,l)};/**
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
 */let Xa;const ti={};class bt{static get Default(){return D(ti&&ue,"ChildrenNode.ts has not been loaded"),Xa=Xa||new bt({".priority":ti},{".priority":ue}),Xa}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=pi(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof dt?t:null}hasIndex(e){return It(this.indexSet_,e.toString())}addIndex(e,t){D(e!==Dn,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let r=!1;const s=t.getIterator(K.Wrap);let o=s.getNext();for(;o;)r=r||e.isDefinedOn(o.node),i.push(o),o=s.getNext();let l;r?l=lo(i,e.getCompare()):l=ti;const c=e.toString(),u=Object.assign({},this.indexSet_);u[c]=e;const f=Object.assign({},this.indexes_);return f[c]=l,new bt(f,u)}addToIndexes(e,t){const i=Xs(this.indexes_,(r,s)=>{const o=pi(this.indexSet_,s);if(D(o,"Missing index implementation for "+s),r===ti)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(K.Wrap);let u=c.getNext();for(;u;)u.name!==e.name&&l.push(u),u=c.getNext();return l.push(e),lo(l,o.getCompare())}else return ti;else{const l=t.get(e.name);let c=r;return l&&(c=c.remove(new K(e.name,l))),c.insert(e,e.node)}});return new bt(i,this.indexSet_)}removeFromIndexes(e,t){const i=Xs(this.indexes_,r=>{if(r===ti)return r;{const s=t.get(e.name);return s?r.remove(new K(e.name,s)):r}});return new bt(i,this.indexSet_)}}/**
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
 */let sr;class F{static get EMPTY_NODE(){return sr||(sr=new F(new dt(vc),null,bt.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&P_(this.priorityNode_),this.children_.isEmpty()&&D(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||sr}updatePriority(e){return this.children_.isEmpty()?this:new F(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?sr:t}}getChild(e){const t=H(e);return t===null?this:this.getImmediateChild(t).getChild(ie(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(D(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new K(e,t);let r,s;t.isEmpty()?(r=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(i,this.children_)):(r=this.children_.insert(e,t),s=this.indexMap_.addToIndexes(i,this.children_));const o=r.isEmpty()?sr:this.priorityNode_;return new F(r,o,s)}}updateChild(e,t){const i=H(e);if(i===null)return t;{D(H(e)!==".priority"||un(e)===1,".priority must be the last token in a path");const r=this.getImmediateChild(i).updateChild(ie(e),t);return this.updateImmediateChild(i,r)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,r=0,s=!0;if(this.forEachChild(ue,(o,l)=>{t[o]=l.val(e),i++,s&&F.INTEGER_REGEXP_.test(o)?r=Math.max(r,Number(o)):s=!1}),!e&&s&&r<2*i){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+b_(this.getPriority().val())+":"),this.forEachChild(ue,(t,i)=>{const r=i.hash();r!==""&&(e+=":"+t+":"+r)}),this.lazyHash_=e===""?"":r_(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const r=this.resolveIndex_(i);if(r){const s=r.getPredecessorKey(new K(e,t));return s?s.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new K(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new K(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(r=>t(r.name,r.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,r=>r);{const r=this.children_.getIteratorFrom(e.name,K.Wrap);let s=r.peek();for(;s!=null&&t.compare(s,e)<0;)r.getNext(),s=r.peek();return r}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,r=>r);{const r=this.children_.getReverseIteratorFrom(e.name,K.Wrap);let s=r.peek();for(;s!=null&&t.compare(s,e)>0;)r.getNext(),s=r.peek();return r}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Xr?-1:0}withIndex(e){if(e===Dn||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new F(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Dn||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(ue),r=t.getIterator(ue);let s=i.getNext(),o=r.getNext();for(;s&&o;){if(s.name!==o.name||!s.node.equals(o.node))return!1;s=i.getNext(),o=r.getNext()}return s===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Dn?null:this.indexMap_.get(e.toString())}}F.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class yA extends F{constructor(){super(new dt(vc),F.EMPTY_NODE,bt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return F.EMPTY_NODE}isEmpty(){return!1}}const Xr=new yA;Object.defineProperties(K,{MIN:{value:new K(Fn,F.EMPTY_NODE)},MAX:{value:new K(cn,Xr)}});S_.__EMPTY_NODE=F.EMPTY_NODE;Ae.__childrenNodeConstructor=F;dA(Xr);pA(Xr);/**
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
 */const vA=!0;function pe(n,e=null){if(n===null)return F.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),D(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new Ae(t,pe(e))}if(!(n instanceof Array)&&vA){const t=[];let i=!1;if(Se(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=pe(l);c.isEmpty()||(i=i||!c.getPriority().isEmpty(),t.push(new K(o,c)))}}),t.length===0)return F.EMPTY_NODE;const s=lo(t,hA,o=>o.name,vc);if(i){const o=lo(t,ue.getCompare());return new F(s,pe(e),new bt({".priority":o},{".priority":ue}))}else return new F(s,pe(e),bt.Default)}else{let t=F.EMPTY_NODE;return Se(n,(i,r)=>{if(It(n,i)&&i.substring(0,1)!=="."){const s=pe(r);(s.isLeafNode()||!s.isEmpty())&&(t=t.updateImmediateChild(i,s))}}),t.updatePriority(pe(e))}}fA(pe);/**
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
 */class Ec extends jo{constructor(e){super(),this.indexPath_=e,D(!z(e)&&H(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),r=this.extractChild(t.node),s=i.compareTo(r);return s===0?Hn(e.name,t.name):s}makePost(e,t){const i=pe(e),r=F.EMPTY_NODE.updateChild(this.indexPath_,i);return new K(t,r)}maxPost(){const e=F.EMPTY_NODE.updateChild(this.indexPath_,Xr);return new K(cn,e)}toString(){return kr(this.indexPath_,0).join("/")}}/**
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
 */class EA extends jo{compare(e,t){const i=e.node.compareTo(t.node);return i===0?Hn(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return K.MIN}maxPost(){return K.MAX}makePost(e,t){const i=pe(e);return new K(t,i)}toString(){return".value"}}const D_=new EA;/**
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
 */function O_(n){return{type:"value",snapshotNode:n}}function mi(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Nr(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function Dr(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function TA(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
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
 */class Tc{constructor(e){this.index_=e}updateChild(e,t,i,r,s,o){D(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(r).equals(i.getChild(r))&&l.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(Nr(t,l)):D(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(mi(t,i)):o.trackChildChange(Dr(t,i,l))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(ue,(r,s)=>{t.hasChild(r)||i.trackChildChange(Nr(r,s))}),t.isLeafNode()||t.forEachChild(ue,(r,s)=>{if(e.hasChild(r)){const o=e.getImmediateChild(r);o.equals(s)||i.trackChildChange(Dr(r,s,o))}else i.trackChildChange(mi(r,s))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?F.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class Or{constructor(e){this.indexedFilter_=new Tc(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Or.getStartPost_(e),this.endPost_=Or.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,r,s,o){return this.matches(new K(t,i))||(i=F.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,r,s,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=F.EMPTY_NODE);let r=t.withIndex(this.index_);r=r.updatePriority(F.EMPTY_NODE);const s=this;return t.forEachChild(ue,(o,l)=>{s.matches(new K(o,l))||(r=r.updateImmediateChild(o,F.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
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
 */class IA{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new Or(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,r,s,o){return this.rangedFilter_.matches(new K(t,i))||(i=F.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,r,s,o):this.fullLimitUpdateChild_(e,t,i,s,o)}updateFullNode(e,t,i){let r;if(t.isLeafNode()||t.isEmpty())r=F.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){r=F.EMPTY_NODE.withIndex(this.index_);let s;this.reverse_?s=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):s=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;s.hasNext()&&o<this.limit_;){const l=s.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))r=r.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{r=t.withIndex(this.index_),r=r.updatePriority(F.EMPTY_NODE);let s;this.reverse_?s=r.getReverseIterator(this.index_):s=r.getIterator(this.index_);let o=0;for(;s.hasNext();){const l=s.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:r=r.updateImmediateChild(l.name,F.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,r,s){let o;if(this.reverse_){const p=this.index_.getCompare();o=(g,w)=>p(w,g)}else o=this.index_.getCompare();const l=e;D(l.numChildren()===this.limit_,"");const c=new K(t,i),u=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),f=this.rangedFilter_.matches(c);if(l.hasChild(t)){const p=l.getImmediateChild(t);let g=r.getChildAfterChild(this.index_,u,this.reverse_);for(;g!=null&&(g.name===t||l.hasChild(g.name));)g=r.getChildAfterChild(this.index_,g,this.reverse_);const w=g==null?1:o(g,c);if(f&&!i.isEmpty()&&w>=0)return s!=null&&s.trackChildChange(Dr(t,i,p)),l.updateImmediateChild(t,i);{s!=null&&s.trackChildChange(Nr(t,p));const N=l.updateImmediateChild(t,F.EMPTY_NODE);return g!=null&&this.rangedFilter_.matches(g)?(s!=null&&s.trackChildChange(mi(g.name,g.node)),N.updateImmediateChild(g.name,g.node)):N}}else return i.isEmpty()?e:f&&o(u,c)>=0?(s!=null&&(s.trackChildChange(Nr(u.name,u.node)),s.trackChildChange(mi(t,i))),l.updateImmediateChild(t,i).updateImmediateChild(u.name,F.EMPTY_NODE)):e}}/**
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
 */class Ic{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=ue}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return D(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return D(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Fn}hasEnd(){return this.endSet_}getIndexEndValue(){return D(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return D(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:cn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return D(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===ue}copy(){const e=new Ic;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function wA(n){return n.loadsAllData()?new Tc(n.getIndex()):n.hasLimit()?new IA(n):new Or(n)}function AA(n,e){const t=n.copy();return t.limitSet_=!0,t.limit_=e,t.viewFrom_="r",t}function CA(n,e){const t=n.copy();return t.index_=e,t}function Pd(n){const e={};if(n.isDefault())return e;let t;if(n.index_===ue?t="$priority":n.index_===D_?t="$value":n.index_===Dn?t="$key":(D(n.index_ instanceof Ec,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Te(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=Te(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+Te(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=Te(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+Te(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function kd(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==ue&&(e.i=n.index_.toString()),e}/**
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
 */class co extends w_{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(D(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,r){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=r,this.log_=Yr("p:rest:"),this.listens_={}}listen(e,t,i,r){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const o=co.getListenId_(e,i),l={};this.listens_[o]=l;const c=Pd(e._queryParams);this.restRequest_(s+".json",c,(u,f)=>{let p=f;if(u===404&&(p=null,u=null),u===null&&this.onDataUpdate_(s,p,!1,i),pi(this.listens_,o)===l){let g;u?u===401?g="permission_denied":g="rest_error:"+u:g="ok",r(g,null)}})}unlisten(e,t){const i=co.getListenId_(e,t);delete this.listens_[i]}get(e){const t=Pd(e._queryParams),i=e._path.toString(),r=new He;return this.restRequest_(i+".json",t,(s,o)=>{let l=o;s===404&&(l=null,s=null),s===null?(this.onDataUpdate_(i,l,!1,null),r.resolve(l)):r.reject(new Error(l))}),r.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([r,s])=>{r&&r.accessToken&&(t.auth=r.accessToken),s&&s.token&&(t.ac=s.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+bi(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(i&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Cr(l.responseText)}catch{Ue("Failed to parse JSON response for "+o+": "+l.responseText)}i(null,c)}else l.status!==401&&l.status!==404&&Ue("Got unsuccessful REST response for "+o+" Status: "+l.status),i(l.status);i=null}},l.open("GET",o,!0),l.send()})}}/**
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
 */class RA{constructor(){this.rootNode_=F.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
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
 */function uo(){return{value:null,children:new Map}}function Di(n,e,t){if(z(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=H(e);n.children.has(i)||n.children.set(i,uo());const r=n.children.get(i);e=ie(e),Di(r,e,t)}}function yl(n,e){if(z(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(ue,(i,r)=>{Di(n,new te(i),r)}),yl(n,e)}}else if(n.children.size>0){const t=H(e);return e=ie(e),n.children.has(t)&&yl(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function vl(n,e,t){n.value!==null?t(e,n.value):SA(n,(i,r)=>{const s=new te(e.toString()+"/"+i);vl(r,s,t)})}function SA(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
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
 */class bA{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&Se(this.last_,(i,r)=>{t[i]=t[i]-r}),this.last_=e,t}}/**
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
 */const Nd=10*1e3,PA=30*1e3,kA=300*1e3;class NA{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new bA(e);const i=Nd+(PA-Nd)*Math.random();mr(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;Se(e,(r,s)=>{s>0&&It(this.statsToReport_,r)&&(t[r]=s,i=!0)}),i&&this.server_.reportStats(t),mr(this.reportStats_.bind(this),Math.floor(Math.random()*2*kA))}}/**
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
 */var rt;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(rt||(rt={}));function wc(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Ac(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Cc(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
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
 */class ho{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=rt.ACK_USER_WRITE,this.source=wc()}operationForChild(e){if(z(this.path)){if(this.affectedTree.value!=null)return D(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new te(e));return new ho(Z(),t,this.revert)}}else return D(H(this.path)===e,"operationForChild called for unrelated child."),new ho(ie(this.path),this.affectedTree,this.revert)}}/**
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
 */class Vr{constructor(e,t){this.source=e,this.path=t,this.type=rt.LISTEN_COMPLETE}operationForChild(e){return z(this.path)?new Vr(this.source,Z()):new Vr(this.source,ie(this.path))}}/**
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
 */class Un{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=rt.OVERWRITE}operationForChild(e){return z(this.path)?new Un(this.source,Z(),this.snap.getImmediateChild(e)):new Un(this.source,ie(this.path),this.snap)}}/**
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
 */class yi{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=rt.MERGE}operationForChild(e){if(z(this.path)){const t=this.children.subtree(new te(e));return t.isEmpty()?null:t.value?new Un(this.source,Z(),t.value):new yi(this.source,Z(),t)}else return D(H(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new yi(this.source,ie(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class hn{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(z(e))return this.isFullyInitialized()&&!this.filtered_;const t=H(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class DA{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function OA(n,e,t,i){const r=[],s=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&s.push(TA(o.childName,o.snapshotNode))}),or(n,r,"child_removed",e,i,t),or(n,r,"child_added",e,i,t),or(n,r,"child_moved",s,i,t),or(n,r,"child_changed",e,i,t),or(n,r,"value",e,i,t),r}function or(n,e,t,i,r,s){const o=i.filter(l=>l.type===t);o.sort((l,c)=>xA(n,l,c)),o.forEach(l=>{const c=VA(n,l,s);r.forEach(u=>{u.respondsTo(l.type)&&e.push(u.createEvent(c,n.query_))})})}function VA(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function xA(n,e,t){if(e.childName==null||t.childName==null)throw Ri("Should only compare child_ events.");const i=new K(e.childName,e.snapshotNode),r=new K(t.childName,t.snapshotNode);return n.index_.compare(i,r)}/**
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
 */function $o(n,e){return{eventCache:n,serverCache:e}}function yr(n,e,t,i){return $o(new hn(e,t,i),n.serverCache)}function V_(n,e,t,i){return $o(n.eventCache,new hn(e,t,i))}function fo(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function Bn(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
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
 */let Ja;const MA=()=>(Ja||(Ja=new dt(Ew)),Ja);class se{static fromObject(e){let t=new se(null);return Se(e,(i,r)=>{t=t.set(new te(i),r)}),t}constructor(e,t=MA()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:Z(),value:this.value};if(z(e))return null;{const i=H(e),r=this.children.get(i);if(r!==null){const s=r.findRootMostMatchingPathAndValue(ie(e),t);return s!=null?{path:he(new te(i),s.path),value:s.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(z(e))return this;{const t=H(e),i=this.children.get(t);return i!==null?i.subtree(ie(e)):new se(null)}}set(e,t){if(z(e))return new se(t,this.children);{const i=H(e),s=(this.children.get(i)||new se(null)).set(ie(e),t),o=this.children.insert(i,s);return new se(this.value,o)}}remove(e){if(z(e))return this.children.isEmpty()?new se(null):new se(null,this.children);{const t=H(e),i=this.children.get(t);if(i){const r=i.remove(ie(e));let s;return r.isEmpty()?s=this.children.remove(t):s=this.children.insert(t,r),this.value===null&&s.isEmpty()?new se(null):new se(this.value,s)}else return this}}get(e){if(z(e))return this.value;{const t=H(e),i=this.children.get(t);return i?i.get(ie(e)):null}}setTree(e,t){if(z(e))return t;{const i=H(e),s=(this.children.get(i)||new se(null)).setTree(ie(e),t);let o;return s.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,s),new se(this.value,o)}}fold(e){return this.fold_(Z(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((r,s)=>{i[r]=s.fold_(he(e,r),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,Z(),t)}findOnPath_(e,t,i){const r=this.value?i(t,this.value):!1;if(r)return r;if(z(e))return null;{const s=H(e),o=this.children.get(s);return o?o.findOnPath_(ie(e),he(t,s),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,Z(),t)}foreachOnPath_(e,t,i){if(z(e))return this;{this.value&&i(t,this.value);const r=H(e),s=this.children.get(r);return s?s.foreachOnPath_(ie(e),he(t,r),i):new se(null)}}foreach(e){this.foreach_(Z(),e)}foreach_(e,t){this.children.inorderTraversal((i,r)=>{r.foreach_(he(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
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
 */class at{constructor(e){this.writeTree_=e}static empty(){return new at(new se(null))}}function vr(n,e,t){if(z(e))return new at(new se(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const r=i.path;let s=i.value;const o=je(r,e);return s=s.updateChild(o,t),new at(n.writeTree_.set(r,s))}else{const r=new se(t),s=n.writeTree_.setTree(e,r);return new at(s)}}}function El(n,e,t){let i=n;return Se(t,(r,s)=>{i=vr(i,he(e,r),s)}),i}function Dd(n,e){if(z(e))return at.empty();{const t=n.writeTree_.setTree(e,new se(null));return new at(t)}}function Tl(n,e){return zn(n,e)!=null}function zn(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(je(t.path,e)):null}function Od(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(ue,(i,r)=>{e.push(new K(i,r))}):n.writeTree_.children.inorderTraversal((i,r)=>{r.value!=null&&e.push(new K(i,r.value))}),e}function rn(n,e){if(z(e))return n;{const t=zn(n,e);return t!=null?new at(new se(t)):new at(n.writeTree_.subtree(e))}}function Il(n){return n.writeTree_.isEmpty()}function vi(n,e){return x_(Z(),n.writeTree_,e)}function x_(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((r,s)=>{r===".priority"?(D(s.value!==null,"Priority writes must always be leaf nodes"),i=s.value):t=x_(he(n,r),s,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(he(n,".priority"),i)),t}}/**
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
 */function Ho(n,e){return U_(e,n)}function LA(n,e,t,i,r){D(i>n.lastWriteId,"Stacking an older write on top of newer ones"),r===void 0&&(r=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:r}),r&&(n.visibleWrites=vr(n.visibleWrites,e,t)),n.lastWriteId=i}function FA(n,e,t,i){D(i>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:i,visible:!0}),n.visibleWrites=El(n.visibleWrites,e,t),n.lastWriteId=i}function UA(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function BA(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);D(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let r=i.visible,s=!1,o=n.allWrites.length-1;for(;r&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&qA(l,i.path)?r=!1:Ze(i.path,l.path)&&(s=!0)),o--}if(r){if(s)return WA(n),!0;if(i.snap)n.visibleWrites=Dd(n.visibleWrites,i.path);else{const l=i.children;Se(l,c=>{n.visibleWrites=Dd(n.visibleWrites,he(i.path,c))})}return!0}else return!1}function qA(n,e){if(n.snap)return Ze(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&Ze(he(n.path,t),e))return!0;return!1}function WA(n){n.visibleWrites=M_(n.allWrites,jA,Z()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function jA(n){return n.visible}function M_(n,e,t){let i=at.empty();for(let r=0;r<n.length;++r){const s=n[r];if(e(s)){const o=s.path;let l;if(s.snap)Ze(t,o)?(l=je(t,o),i=vr(i,l,s.snap)):Ze(o,t)&&(l=je(o,t),i=vr(i,Z(),s.snap.getChild(l)));else if(s.children){if(Ze(t,o))l=je(t,o),i=El(i,l,s.children);else if(Ze(o,t))if(l=je(o,t),z(l))i=El(i,Z(),s.children);else{const c=pi(s.children,H(l));if(c){const u=c.getChild(ie(l));i=vr(i,Z(),u)}}}else throw Ri("WriteRecord should have .snap or .children")}}return i}function L_(n,e,t,i,r){if(!i&&!r){const s=zn(n.visibleWrites,e);if(s!=null)return s;{const o=rn(n.visibleWrites,e);if(Il(o))return t;if(t==null&&!Tl(o,Z()))return null;{const l=t||F.EMPTY_NODE;return vi(o,l)}}}else{const s=rn(n.visibleWrites,e);if(!r&&Il(s))return t;if(!r&&t==null&&!Tl(s,Z()))return null;{const o=function(u){return(u.visible||r)&&(!i||!~i.indexOf(u.writeId))&&(Ze(u.path,e)||Ze(e,u.path))},l=M_(n.allWrites,o,e),c=t||F.EMPTY_NODE;return vi(l,c)}}}function $A(n,e,t){let i=F.EMPTY_NODE;const r=zn(n.visibleWrites,e);if(r)return r.isLeafNode()||r.forEachChild(ue,(s,o)=>{i=i.updateImmediateChild(s,o)}),i;if(t){const s=rn(n.visibleWrites,e);return t.forEachChild(ue,(o,l)=>{const c=vi(rn(s,new te(o)),l);i=i.updateImmediateChild(o,c)}),Od(s).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const s=rn(n.visibleWrites,e);return Od(s).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function HA(n,e,t,i,r){D(i||r,"Either existingEventSnap or existingServerSnap must exist");const s=he(e,t);if(Tl(n.visibleWrites,s))return null;{const o=rn(n.visibleWrites,s);return Il(o)?r.getChild(t):vi(o,r.getChild(t))}}function zA(n,e,t,i){const r=he(e,t),s=zn(n.visibleWrites,r);if(s!=null)return s;if(i.isCompleteForChild(t)){const o=rn(n.visibleWrites,r);return vi(o,i.getNode().getImmediateChild(t))}else return null}function GA(n,e){return zn(n.visibleWrites,e)}function KA(n,e,t,i,r,s,o){let l;const c=rn(n.visibleWrites,e),u=zn(c,Z());if(u!=null)l=u;else if(t!=null)l=vi(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const f=[],p=o.getCompare(),g=s?l.getReverseIteratorFrom(i,o):l.getIteratorFrom(i,o);let w=g.getNext();for(;w&&f.length<r;)p(w,i)!==0&&f.push(w),w=g.getNext();return f}else return[]}function QA(){return{visibleWrites:at.empty(),allWrites:[],lastWriteId:-1}}function po(n,e,t,i){return L_(n.writeTree,n.treePath,e,t,i)}function Rc(n,e){return $A(n.writeTree,n.treePath,e)}function Vd(n,e,t,i){return HA(n.writeTree,n.treePath,e,t,i)}function _o(n,e){return GA(n.writeTree,he(n.treePath,e))}function YA(n,e,t,i,r,s){return KA(n.writeTree,n.treePath,e,t,i,r,s)}function Sc(n,e,t){return zA(n.writeTree,n.treePath,e,t)}function F_(n,e){return U_(he(n.treePath,e),n.writeTree)}function U_(n,e){return{treePath:n,writeTree:e}}/**
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
 */class XA{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;D(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),D(i!==".priority","Only non-priority child changes can be tracked.");const r=this.changeMap.get(i);if(r){const s=r.type;if(t==="child_added"&&s==="child_removed")this.changeMap.set(i,Dr(i,e.snapshotNode,r.snapshotNode));else if(t==="child_removed"&&s==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&s==="child_changed")this.changeMap.set(i,Nr(i,r.oldSnap));else if(t==="child_changed"&&s==="child_added")this.changeMap.set(i,mi(i,e.snapshotNode));else if(t==="child_changed"&&s==="child_changed")this.changeMap.set(i,Dr(i,e.snapshotNode,r.oldSnap));else throw Ri("Illegal combination of changes: "+e+" occurred after "+r)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class JA{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const B_=new JA;class bc{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new hn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Sc(this.writes_,e,i)}}getChildAfterChild(e,t,i){const r=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Bn(this.viewCache_),s=YA(this.writes_,r,t,1,i,e);return s.length===0?null:s[0]}}/**
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
 */function ZA(n){return{filter:n}}function eC(n,e){D(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),D(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function tC(n,e,t,i,r){const s=new XA;let o,l;if(t.type===rt.OVERWRITE){const u=t;u.source.fromUser?o=wl(n,e,u.path,u.snap,i,r,s):(D(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered()&&!z(u.path),o=go(n,e,u.path,u.snap,i,r,l,s))}else if(t.type===rt.MERGE){const u=t;u.source.fromUser?o=iC(n,e,u.path,u.children,i,r,s):(D(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered(),o=Al(n,e,u.path,u.children,i,r,l,s))}else if(t.type===rt.ACK_USER_WRITE){const u=t;u.revert?o=oC(n,e,u.path,i,r,s):o=rC(n,e,u.path,u.affectedTree,i,r,s)}else if(t.type===rt.LISTEN_COMPLETE)o=sC(n,e,t.path,i,s);else throw Ri("Unknown operation type: "+t.type);const c=s.getChanges();return nC(e,o,c),{viewCache:o,changes:c}}function nC(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const r=i.getNode().isLeafNode()||i.getNode().isEmpty(),s=fo(n);(t.length>0||!n.eventCache.isFullyInitialized()||r&&!i.getNode().equals(s)||!i.getNode().getPriority().equals(s.getPriority()))&&t.push(O_(fo(e)))}}function q_(n,e,t,i,r,s){const o=e.eventCache;if(_o(i,t)!=null)return e;{let l,c;if(z(t))if(D(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=Bn(e),f=u instanceof F?u:F.EMPTY_NODE,p=Rc(i,f);l=n.filter.updateFullNode(e.eventCache.getNode(),p,s)}else{const u=po(i,Bn(e));l=n.filter.updateFullNode(e.eventCache.getNode(),u,s)}else{const u=H(t);if(u===".priority"){D(un(t)===1,"Can't have a priority with additional path components");const f=o.getNode();c=e.serverCache.getNode();const p=Vd(i,t,f,c);p!=null?l=n.filter.updatePriority(f,p):l=o.getNode()}else{const f=ie(t);let p;if(o.isCompleteForChild(u)){c=e.serverCache.getNode();const g=Vd(i,t,o.getNode(),c);g!=null?p=o.getNode().getImmediateChild(u).updateChild(f,g):p=o.getNode().getImmediateChild(u)}else p=Sc(i,u,e.serverCache);p!=null?l=n.filter.updateChild(o.getNode(),u,p,f,r,s):l=o.getNode()}}return yr(e,l,o.isFullyInitialized()||z(t),n.filter.filtersNodes())}}function go(n,e,t,i,r,s,o,l){const c=e.serverCache;let u;const f=o?n.filter:n.filter.getIndexedFilter();if(z(t))u=f.updateFullNode(c.getNode(),i,null);else if(f.filtersNodes()&&!c.isFiltered()){const w=c.getNode().updateChild(t,i);u=f.updateFullNode(c.getNode(),w,null)}else{const w=H(t);if(!c.isCompleteForPath(t)&&un(t)>1)return e;const S=ie(t),k=c.getNode().getImmediateChild(w).updateChild(S,i);w===".priority"?u=f.updatePriority(c.getNode(),k):u=f.updateChild(c.getNode(),w,k,S,B_,null)}const p=V_(e,u,c.isFullyInitialized()||z(t),f.filtersNodes()),g=new bc(r,p,s);return q_(n,p,t,r,g,l)}function wl(n,e,t,i,r,s,o){const l=e.eventCache;let c,u;const f=new bc(r,e,s);if(z(t))u=n.filter.updateFullNode(e.eventCache.getNode(),i,o),c=yr(e,u,!0,n.filter.filtersNodes());else{const p=H(t);if(p===".priority")u=n.filter.updatePriority(e.eventCache.getNode(),i),c=yr(e,u,l.isFullyInitialized(),l.isFiltered());else{const g=ie(t),w=l.getNode().getImmediateChild(p);let S;if(z(g))S=i;else{const N=f.getCompleteChild(p);N!=null?gc(g)===".priority"&&N.getChild(C_(g)).isEmpty()?S=N:S=N.updateChild(g,i):S=F.EMPTY_NODE}if(w.equals(S))c=e;else{const N=n.filter.updateChild(l.getNode(),p,S,g,f,o);c=yr(e,N,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function xd(n,e){return n.eventCache.isCompleteForChild(e)}function iC(n,e,t,i,r,s,o){let l=e;return i.foreach((c,u)=>{const f=he(t,c);xd(e,H(f))&&(l=wl(n,l,f,u,r,s,o))}),i.foreach((c,u)=>{const f=he(t,c);xd(e,H(f))||(l=wl(n,l,f,u,r,s,o))}),l}function Md(n,e,t){return t.foreach((i,r)=>{e=e.updateChild(i,r)}),e}function Al(n,e,t,i,r,s,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,u;z(t)?u=i:u=new se(null).setTree(t,i);const f=e.serverCache.getNode();return u.children.inorderTraversal((p,g)=>{if(f.hasChild(p)){const w=e.serverCache.getNode().getImmediateChild(p),S=Md(n,w,g);c=go(n,c,new te(p),S,r,s,o,l)}}),u.children.inorderTraversal((p,g)=>{const w=!e.serverCache.isCompleteForChild(p)&&g.value===null;if(!f.hasChild(p)&&!w){const S=e.serverCache.getNode().getImmediateChild(p),N=Md(n,S,g);c=go(n,c,new te(p),N,r,s,o,l)}}),c}function rC(n,e,t,i,r,s,o){if(_o(r,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(i.value!=null){if(z(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return go(n,e,t,c.getNode().getChild(t),r,s,l,o);if(z(t)){let u=new se(null);return c.getNode().forEachChild(Dn,(f,p)=>{u=u.set(new te(f),p)}),Al(n,e,t,u,r,s,l,o)}else return e}else{let u=new se(null);return i.foreach((f,p)=>{const g=he(t,f);c.isCompleteForPath(g)&&(u=u.set(f,c.getNode().getChild(g)))}),Al(n,e,t,u,r,s,l,o)}}function sC(n,e,t,i,r){const s=e.serverCache,o=V_(e,s.getNode(),s.isFullyInitialized()||z(t),s.isFiltered());return q_(n,o,t,i,B_,r)}function oC(n,e,t,i,r,s){let o;if(_o(i,t)!=null)return e;{const l=new bc(i,e,r),c=e.eventCache.getNode();let u;if(z(t)||H(t)===".priority"){let f;if(e.serverCache.isFullyInitialized())f=po(i,Bn(e));else{const p=e.serverCache.getNode();D(p instanceof F,"serverChildren would be complete if leaf node"),f=Rc(i,p)}f=f,u=n.filter.updateFullNode(c,f,s)}else{const f=H(t);let p=Sc(i,f,e.serverCache);p==null&&e.serverCache.isCompleteForChild(f)&&(p=c.getImmediateChild(f)),p!=null?u=n.filter.updateChild(c,f,p,ie(t),l,s):e.eventCache.getNode().hasChild(f)?u=n.filter.updateChild(c,f,F.EMPTY_NODE,ie(t),l,s):u=c,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=po(i,Bn(e)),o.isLeafNode()&&(u=n.filter.updateFullNode(u,o,s)))}return o=e.serverCache.isFullyInitialized()||_o(i,Z())!=null,yr(e,u,o,n.filter.filtersNodes())}}/**
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
 */class aC{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,r=new Tc(i.getIndex()),s=wA(i);this.processor_=ZA(s);const o=t.serverCache,l=t.eventCache,c=r.updateFullNode(F.EMPTY_NODE,o.getNode(),null),u=s.updateFullNode(F.EMPTY_NODE,l.getNode(),null),f=new hn(c,o.isFullyInitialized(),r.filtersNodes()),p=new hn(u,l.isFullyInitialized(),s.filtersNodes());this.viewCache_=$o(p,f),this.eventGenerator_=new DA(this.query_)}get query(){return this.query_}}function lC(n){return n.viewCache_.serverCache.getNode()}function cC(n){return fo(n.viewCache_)}function uC(n,e){const t=Bn(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!z(e)&&!t.getImmediateChild(H(e)).isEmpty())?t.getChild(e):null}function Ld(n){return n.eventRegistrations_.length===0}function hC(n,e){n.eventRegistrations_.push(e)}function Fd(n,e,t){const i=[];if(t){D(e==null,"A cancel should cancel all event registrations.");const r=n.query._path;n.eventRegistrations_.forEach(s=>{const o=s.createCancelEvent(t,r);o&&i.push(o)})}if(e){let r=[];for(let s=0;s<n.eventRegistrations_.length;++s){const o=n.eventRegistrations_[s];if(!o.matches(e))r.push(o);else if(e.hasAnyCallback()){r=r.concat(n.eventRegistrations_.slice(s+1));break}}n.eventRegistrations_=r}else n.eventRegistrations_=[];return i}function Ud(n,e,t,i){e.type===rt.MERGE&&e.source.queryId!==null&&(D(Bn(n.viewCache_),"We should always have a full cache before handling merges"),D(fo(n.viewCache_),"Missing event cache, even though we have a server cache"));const r=n.viewCache_,s=tC(n.processor_,r,e,t,i);return eC(n.processor_,s.viewCache),D(s.viewCache.serverCache.isFullyInitialized()||!r.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=s.viewCache,W_(n,s.changes,s.viewCache.eventCache.getNode(),null)}function dC(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(ue,(s,o)=>{i.push(mi(s,o))}),t.isFullyInitialized()&&i.push(O_(t.getNode())),W_(n,i,t.getNode(),e)}function W_(n,e,t,i){const r=i?[i]:n.eventRegistrations_;return OA(n.eventGenerator_,e,t,r)}/**
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
 */let mo;class j_{constructor(){this.views=new Map}}function fC(n){D(!mo,"__referenceConstructor has already been defined"),mo=n}function pC(){return D(mo,"Reference.ts has not been loaded"),mo}function _C(n){return n.views.size===0}function Pc(n,e,t,i){const r=e.source.queryId;if(r!==null){const s=n.views.get(r);return D(s!=null,"SyncTree gave us an op for an invalid query."),Ud(s,e,t,i)}else{let s=[];for(const o of n.views.values())s=s.concat(Ud(o,e,t,i));return s}}function $_(n,e,t,i,r){const s=e._queryIdentifier,o=n.views.get(s);if(!o){let l=po(t,r?i:null),c=!1;l?c=!0:i instanceof F?(l=Rc(t,i),c=!1):(l=F.EMPTY_NODE,c=!1);const u=$o(new hn(l,c,!1),new hn(i,r,!1));return new aC(e,u)}return o}function gC(n,e,t,i,r,s){const o=$_(n,e,i,r,s);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),hC(o,t),dC(o,t)}function mC(n,e,t,i){const r=e._queryIdentifier,s=[];let o=[];const l=dn(n);if(r==="default")for(const[c,u]of n.views.entries())o=o.concat(Fd(u,t,i)),Ld(u)&&(n.views.delete(c),u.query._queryParams.loadsAllData()||s.push(u.query));else{const c=n.views.get(r);c&&(o=o.concat(Fd(c,t,i)),Ld(c)&&(n.views.delete(r),c.query._queryParams.loadsAllData()||s.push(c.query)))}return l&&!dn(n)&&s.push(new(pC())(e._repo,e._path)),{removed:s,events:o}}function H_(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function sn(n,e){let t=null;for(const i of n.views.values())t=t||uC(i,e);return t}function z_(n,e){if(e._queryParams.loadsAllData())return zo(n);{const i=e._queryIdentifier;return n.views.get(i)}}function G_(n,e){return z_(n,e)!=null}function dn(n){return zo(n)!=null}function zo(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let yo;function yC(n){D(!yo,"__referenceConstructor has already been defined"),yo=n}function vC(){return D(yo,"Reference.ts has not been loaded"),yo}let EC=1;class Bd{constructor(e){this.listenProvider_=e,this.syncPointTree_=new se(null),this.pendingWriteTree_=QA(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function K_(n,e,t,i,r){return LA(n.pendingWriteTree_,e,t,i,r),r?Oi(n,new Un(wc(),e,t)):[]}function TC(n,e,t,i){FA(n.pendingWriteTree_,e,t,i);const r=se.fromObject(t);return Oi(n,new yi(wc(),e,r))}function Zt(n,e,t=!1){const i=UA(n.pendingWriteTree_,e);if(BA(n.pendingWriteTree_,e)){let s=new se(null);return i.snap!=null?s=s.set(Z(),!0):Se(i.children,o=>{s=s.set(new te(o),!0)}),Oi(n,new ho(i.path,s,t))}else return[]}function Jr(n,e,t){return Oi(n,new Un(Ac(),e,t))}function IC(n,e,t){const i=se.fromObject(t);return Oi(n,new yi(Ac(),e,i))}function wC(n,e){return Oi(n,new Vr(Ac(),e))}function AC(n,e,t){const i=Nc(n,t);if(i){const r=Dc(i),s=r.path,o=r.queryId,l=je(s,e),c=new Vr(Cc(o),l);return Oc(n,s,c)}else return[]}function vo(n,e,t,i,r=!1){const s=e._path,o=n.syncPointTree_.get(s);let l=[];if(o&&(e._queryIdentifier==="default"||G_(o,e))){const c=mC(o,e,t,i);_C(o)&&(n.syncPointTree_=n.syncPointTree_.remove(s));const u=c.removed;if(l=c.events,!r){const f=u.findIndex(g=>g._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(s,(g,w)=>dn(w));if(f&&!p){const g=n.syncPointTree_.subtree(s);if(!g.isEmpty()){const w=SC(g);for(let S=0;S<w.length;++S){const N=w[S],k=N.query,j=J_(n,N);n.listenProvider_.startListening(Er(k),xr(n,k),j.hashFn,j.onComplete)}}}!p&&u.length>0&&!i&&(f?n.listenProvider_.stopListening(Er(e),null):u.forEach(g=>{const w=n.queryToTagMap.get(Go(g));n.listenProvider_.stopListening(Er(g),w)}))}bC(n,u)}return l}function Q_(n,e,t,i){const r=Nc(n,i);if(r!=null){const s=Dc(r),o=s.path,l=s.queryId,c=je(o,e),u=new Un(Cc(l),c,t);return Oc(n,o,u)}else return[]}function CC(n,e,t,i){const r=Nc(n,i);if(r){const s=Dc(r),o=s.path,l=s.queryId,c=je(o,e),u=se.fromObject(t),f=new yi(Cc(l),c,u);return Oc(n,o,f)}else return[]}function Cl(n,e,t,i=!1){const r=e._path;let s=null,o=!1;n.syncPointTree_.foreachOnPath(r,(g,w)=>{const S=je(g,r);s=s||sn(w,S),o=o||dn(w)});let l=n.syncPointTree_.get(r);l?(o=o||dn(l),s=s||sn(l,Z())):(l=new j_,n.syncPointTree_=n.syncPointTree_.set(r,l));let c;s!=null?c=!0:(c=!1,s=F.EMPTY_NODE,n.syncPointTree_.subtree(r).foreachChild((w,S)=>{const N=sn(S,Z());N&&(s=s.updateImmediateChild(w,N))}));const u=G_(l,e);if(!u&&!e._queryParams.loadsAllData()){const g=Go(e);D(!n.queryToTagMap.has(g),"View does not exist, but we have a tag");const w=PC();n.queryToTagMap.set(g,w),n.tagToQueryMap.set(w,g)}const f=Ho(n.pendingWriteTree_,r);let p=gC(l,e,t,f,s,c);if(!u&&!o&&!i){const g=z_(l,e);p=p.concat(kC(n,e,g))}return p}function kc(n,e,t){const r=n.pendingWriteTree_,s=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=je(o,e),u=sn(l,c);if(u)return u});return L_(r,e,s,t,!0)}function RC(n,e){const t=e._path;let i=null;n.syncPointTree_.foreachOnPath(t,(u,f)=>{const p=je(u,t);i=i||sn(f,p)});let r=n.syncPointTree_.get(t);r?i=i||sn(r,Z()):(r=new j_,n.syncPointTree_=n.syncPointTree_.set(t,r));const s=i!=null,o=s?new hn(i,!0,!1):null,l=Ho(n.pendingWriteTree_,e._path),c=$_(r,e,l,s?o.getNode():F.EMPTY_NODE,s);return cC(c)}function Oi(n,e){return Y_(e,n.syncPointTree_,null,Ho(n.pendingWriteTree_,Z()))}function Y_(n,e,t,i){if(z(n.path))return X_(n,e,t,i);{const r=e.get(Z());t==null&&r!=null&&(t=sn(r,Z()));let s=[];const o=H(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const u=t?t.getImmediateChild(o):null,f=F_(i,o);s=s.concat(Y_(l,c,u,f))}return r&&(s=s.concat(Pc(r,n,i,t))),s}}function X_(n,e,t,i){const r=e.get(Z());t==null&&r!=null&&(t=sn(r,Z()));let s=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,u=F_(i,o),f=n.operationForChild(o);f&&(s=s.concat(X_(f,l,c,u)))}),r&&(s=s.concat(Pc(r,n,i,t))),s}function J_(n,e){const t=e.query,i=xr(n,t);return{hashFn:()=>(lC(e)||F.EMPTY_NODE).hash(),onComplete:r=>{if(r==="ok")return i?AC(n,t._path,i):wC(n,t._path);{const s=ww(r,t);return vo(n,t,null,s)}}}}function xr(n,e){const t=Go(e);return n.queryToTagMap.get(t)}function Go(n){return n._path.toString()+"$"+n._queryIdentifier}function Nc(n,e){return n.tagToQueryMap.get(e)}function Dc(n){const e=n.indexOf("$");return D(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new te(n.substr(0,e))}}function Oc(n,e,t){const i=n.syncPointTree_.get(e);D(i,"Missing sync point for query tag that we're tracking");const r=Ho(n.pendingWriteTree_,e);return Pc(i,t,r,null)}function SC(n){return n.fold((e,t,i)=>{if(t&&dn(t))return[zo(t)];{let r=[];return t&&(r=H_(t)),Se(i,(s,o)=>{r=r.concat(o)}),r}})}function Er(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(vC())(n._repo,n._path):n}function bC(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const r=Go(i),s=n.queryToTagMap.get(r);n.queryToTagMap.delete(r),n.tagToQueryMap.delete(s)}}}function PC(){return EC++}function kC(n,e,t){const i=e._path,r=xr(n,e),s=J_(n,t),o=n.listenProvider_.startListening(Er(e),r,s.hashFn,s.onComplete),l=n.syncPointTree_.subtree(i);if(r)D(!dn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((u,f,p)=>{if(!z(u)&&f&&dn(f))return[zo(f).query];{let g=[];return f&&(g=g.concat(H_(f).map(w=>w.query))),Se(p,(w,S)=>{g=g.concat(S)}),g}});for(let u=0;u<c.length;++u){const f=c[u];n.listenProvider_.stopListening(Er(f),xr(n,f))}}return o}/**
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
 */class Vc{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Vc(t)}node(){return this.node_}}class xc{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=he(this.path_,e);return new xc(this.syncTree_,t)}node(){return kc(this.syncTree_,this.path_)}}const NC=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},qd=function(n,e,t){if(!n||typeof n!="object")return n;if(D(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return DC(n[".sv"],e,t);if(typeof n[".sv"]=="object")return OC(n[".sv"],e);D(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},DC=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:D(!1,"Unexpected server value: "+n)}},OC=function(n,e,t){n.hasOwnProperty("increment")||D(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&D(!1,"Unexpected increment value: "+i);const r=e.node();if(D(r!==null&&typeof r<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!r.isLeafNode())return i;const o=r.getValue();return typeof o!="number"?i:o+i},Z_=function(n,e,t,i){return Mc(e,new xc(t,n),i)},eg=function(n,e,t){return Mc(n,new Vc(e),t)};function Mc(n,e,t){const i=n.getPriority().val(),r=qd(i,e.getImmediateChild(".priority"),t);let s;if(n.isLeafNode()){const o=n,l=qd(o.getValue(),e,t);return l!==o.getValue()||r!==o.getPriority().val()?new Ae(l,pe(r)):n}else{const o=n;return s=o,r!==o.getPriority().val()&&(s=s.updatePriority(new Ae(r))),o.forEachChild(ue,(l,c)=>{const u=Mc(c,e.getImmediateChild(l),t);u!==c&&(s=s.updateImmediateChild(l,u))}),s}}/**
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
 */class Lc{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function Fc(n,e){let t=e instanceof te?e:new te(e),i=n,r=H(t);for(;r!==null;){const s=pi(i.node.children,r)||{children:{},childCount:0};i=new Lc(r,i,s),t=ie(t),r=H(t)}return i}function Vi(n){return n.node.value}function tg(n,e){n.node.value=e,Rl(n)}function ng(n){return n.node.childCount>0}function VC(n){return Vi(n)===void 0&&!ng(n)}function Ko(n,e){Se(n.node.children,(t,i)=>{e(new Lc(t,n,i))})}function ig(n,e,t,i){t&&e(n),Ko(n,r=>{ig(r,e,!0)})}function xC(n,e,t){let i=n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function Zr(n){return new te(n.parent===null?n.name:Zr(n.parent)+"/"+n.name)}function Rl(n){n.parent!==null&&MC(n.parent,n.name,n)}function MC(n,e,t){const i=VC(t),r=It(n.node.children,e);i&&r?(delete n.node.children[e],n.node.childCount--,Rl(n)):!i&&!r&&(n.node.children[e]=t.node,n.node.childCount++,Rl(n))}/**
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
 */const LC=/[\[\].#$\/\u0000-\u001F\u007F]/,FC=/[\[\].#$\u0000-\u001F\u007F]/,Za=10*1024*1024,Uc=function(n){return typeof n=="string"&&n.length!==0&&!LC.test(n)},rg=function(n){return typeof n=="string"&&n.length!==0&&!FC.test(n)},UC=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),rg(n)},Eo=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Wo(n)||n&&typeof n=="object"&&It(n,".sv")},Sl=function(n,e,t,i){Qo(_i(n,"value"),e,t)},Qo=function(n,e,t){const i=t instanceof te?new iA(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+bn(i));if(typeof e=="function")throw new Error(n+"contains a function "+bn(i)+" with contents = "+e.toString());if(Wo(e))throw new Error(n+"contains "+e.toString()+" "+bn(i));if(typeof e=="string"&&e.length>Za/3&&Mo(e)>Za)throw new Error(n+"contains a string greater than "+Za+" utf8 bytes "+bn(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let r=!1,s=!1;if(Se(e,(o,l)=>{if(o===".value")r=!0;else if(o!==".priority"&&o!==".sv"&&(s=!0,!Uc(o)))throw new Error(n+" contains an invalid key ("+o+") "+bn(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);rA(i,o),Qo(n,l,i),sA(i)}),r&&s)throw new Error(n+' contains ".value" child '+bn(i)+" in addition to actual children.")}},BC=function(n,e){let t,i;for(t=0;t<e.length;t++){i=e[t];const s=kr(i);for(let o=0;o<s.length;o++)if(!(s[o]===".priority"&&o===s.length-1)){if(!Uc(s[o]))throw new Error(n+"contains an invalid key ("+s[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(nA);let r=null;for(t=0;t<e.length;t++){if(i=e[t],r!==null&&Ze(r,i))throw new Error(n+"contains a path "+r.toString()+" that is ancestor of another path "+i.toString());r=i}},sg=function(n,e,t,i){const r=_i(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(r+" must be an object containing the children to replace.");const s=[];Se(e,(o,l)=>{const c=new te(o);if(Qo(r,l,he(t,c)),gc(c)===".priority"&&!Eo(l))throw new Error(r+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(c)}),BC(r,s)},qC=function(n,e,t){if(Wo(e))throw new Error(_i(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Eo(e))throw new Error(_i(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},Bc=function(n,e,t,i){if(!rg(t))throw new Error(_i(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},WC=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Bc(n,e,t)},li=function(n,e){if(H(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},jC=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Uc(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!UC(t))throw new Error(_i(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class $C{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Yo(n,e){let t=null;for(let i=0;i<e.length;i++){const r=e[i],s=r.getPath();t!==null&&!mc(s,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:s}),t.events.push(r)}t&&n.eventLists_.push(t)}function og(n,e,t){Yo(n,t),ag(n,i=>mc(i,e))}function et(n,e,t){Yo(n,t),ag(n,i=>Ze(i,e)||Ze(e,i))}function ag(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const r=n.eventLists_[i];if(r){const s=r.path;e(s)?(HC(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function HC(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();gr&&Re("event: "+t.toString()),Ni(i)}}}/**
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
 */const lg="repo_interrupt",zC=25;class GC{constructor(e,t,i,r){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=r,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new $C,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=uo(),this.transactionQueueTree_=new Lc,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function KC(n,e,t){if(n.stats_=pc(n.repoInfo_),n.forceRestClient_||Sw())n.server_=new co(n.repoInfo_,(i,r,s,o)=>{Wd(n,i,r,s,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>jd(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Te(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new kt(n.repoInfo_,e,(i,r,s,o)=>{Wd(n,i,r,s,o)},i=>{jd(n,i)},i=>{YC(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=Dw(n.repoInfo_,()=>new NA(n.stats_,n.server_)),n.infoData_=new RA,n.infoSyncTree_=new Bd({startListening:(i,r,s,o)=>{let l=[];const c=n.infoData_.getNode(i._path);return c.isEmpty()||(l=Jr(n.infoSyncTree_,i._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),qc(n,"connected",!1),n.serverSyncTree_=new Bd({startListening:(i,r,s,o)=>(n.server_.listen(i,s,r,(l,c)=>{const u=o(l,c);et(n.eventQueue_,i._path,u)}),[]),stopListening:(i,r)=>{n.server_.unlisten(i,r)}})}function QC(n){const t=n.infoData_.getNode(new te(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Xo(n){return NC({timestamp:QC(n)})}function Wd(n,e,t,i,r){n.dataUpdateCount++;const s=new te(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(r)if(i){const c=Xs(t,u=>pe(u));o=CC(n.serverSyncTree_,s,c,r)}else{const c=pe(t);o=Q_(n.serverSyncTree_,s,c,r)}else if(i){const c=Xs(t,u=>pe(u));o=IC(n.serverSyncTree_,s,c)}else{const c=pe(t);o=Jr(n.serverSyncTree_,s,c)}let l=s;o.length>0&&(l=Ei(n,s)),et(n.eventQueue_,l,o)}function jd(n,e){qc(n,"connected",e),e===!1&&eR(n)}function YC(n,e){Se(e,(t,i)=>{qc(n,t,i)})}function qc(n,e,t){const i=new te("/.info/"+e),r=pe(t);n.infoData_.updateSnapshot(i,r);const s=Jr(n.infoSyncTree_,i,r);et(n.eventQueue_,i,s)}function Wc(n){return n.nextWriteId_++}function XC(n,e,t){const i=RC(n.serverSyncTree_,e);return i!=null?Promise.resolve(i):n.server_.get(e).then(r=>{const s=pe(r).withIndex(e._queryParams.getIndex());Cl(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Jr(n.serverSyncTree_,e._path,s);else{const l=xr(n.serverSyncTree_,e);o=Q_(n.serverSyncTree_,e._path,s,l)}return et(n.eventQueue_,e._path,o),vo(n.serverSyncTree_,e,t,null,!0),s},r=>(es(n,"get for query "+Te(e)+" failed: "+r),Promise.reject(new Error(r))))}function JC(n,e,t,i,r){es(n,"set",{path:e.toString(),value:t,priority:i});const s=Xo(n),o=pe(t,i),l=kc(n.serverSyncTree_,e),c=eg(o,l,s),u=Wc(n),f=K_(n.serverSyncTree_,e,c,u,!0);Yo(n.eventQueue_,f),n.server_.put(e.toString(),o.val(!0),(g,w)=>{const S=g==="ok";S||Ue("set at "+e+" failed: "+g);const N=Zt(n.serverSyncTree_,u,!S);et(n.eventQueue_,e,N),fn(n,r,g,w)});const p=$c(n,e);Ei(n,p),et(n.eventQueue_,p,[])}function ZC(n,e,t,i){es(n,"update",{path:e.toString(),value:t});let r=!0;const s=Xo(n),o={};if(Se(t,(l,c)=>{r=!1,o[l]=Z_(he(e,l),pe(c),n.serverSyncTree_,s)}),r)Re("update() called with empty data.  Don't do anything."),fn(n,i,"ok",void 0);else{const l=Wc(n),c=TC(n.serverSyncTree_,e,o,l);Yo(n.eventQueue_,c),n.server_.merge(e.toString(),t,(u,f)=>{const p=u==="ok";p||Ue("update at "+e+" failed: "+u);const g=Zt(n.serverSyncTree_,l,!p),w=g.length>0?Ei(n,e):e;et(n.eventQueue_,w,g),fn(n,i,u,f)}),Se(t,u=>{const f=$c(n,he(e,u));Ei(n,f)}),et(n.eventQueue_,e,[])}}function eR(n){es(n,"onDisconnectEvents");const e=Xo(n),t=uo();vl(n.onDisconnect_,Z(),(r,s)=>{const o=Z_(r,s,n.serverSyncTree_,e);Di(t,r,o)});let i=[];vl(t,Z(),(r,s)=>{i=i.concat(Jr(n.serverSyncTree_,r,s));const o=$c(n,r);Ei(n,o)}),n.onDisconnect_=uo(),et(n.eventQueue_,Z(),i)}function tR(n,e,t){n.server_.onDisconnectCancel(e.toString(),(i,r)=>{i==="ok"&&yl(n.onDisconnect_,e),fn(n,t,i,r)})}function $d(n,e,t,i){const r=pe(t);n.server_.onDisconnectPut(e.toString(),r.val(!0),(s,o)=>{s==="ok"&&Di(n.onDisconnect_,e,r),fn(n,i,s,o)})}function nR(n,e,t,i,r){const s=pe(t,i);n.server_.onDisconnectPut(e.toString(),s.val(!0),(o,l)=>{o==="ok"&&Di(n.onDisconnect_,e,s),fn(n,r,o,l)})}function iR(n,e,t,i){if(Ys(t)){Re("onDisconnect().update() called with empty data.  Don't do anything."),fn(n,i,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(r,s)=>{r==="ok"&&Se(t,(o,l)=>{const c=pe(l);Di(n.onDisconnect_,he(e,o),c)}),fn(n,i,r,s)})}function rR(n,e,t){let i;H(e._path)===".info"?i=Cl(n.infoSyncTree_,e,t):i=Cl(n.serverSyncTree_,e,t),og(n.eventQueue_,e._path,i)}function Hd(n,e,t){let i;H(e._path)===".info"?i=vo(n.infoSyncTree_,e,t):i=vo(n.serverSyncTree_,e,t),og(n.eventQueue_,e._path,i)}function cg(n){n.persistentConnection_&&n.persistentConnection_.interrupt(lg)}function sR(n){n.persistentConnection_&&n.persistentConnection_.resume(lg)}function es(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Re(t,...e)}function fn(n,e,t,i){e&&Ni(()=>{if(t==="ok")e(null);else{const r=(t||"error").toUpperCase();let s=r;i&&(s+=": "+i);const o=new Error(s);o.code=r,e(o)}})}function ug(n,e,t){return kc(n.serverSyncTree_,e,t)||F.EMPTY_NODE}function jc(n,e=n.transactionQueueTree_){if(e||Jo(n,e),Vi(e)){const t=dg(n,e);D(t.length>0,"Sending zero length transaction queue"),t.every(r=>r.status===0)&&oR(n,Zr(e),t)}else ng(e)&&Ko(e,t=>{jc(n,t)})}function oR(n,e,t){const i=t.map(u=>u.currentWriteId),r=ug(n,e,i);let s=r;const o=r.hash();for(let u=0;u<t.length;u++){const f=t[u];D(f.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),f.status=1,f.retryCount++;const p=je(e,f.path);s=s.updateChild(p,f.currentOutputSnapshotRaw)}const l=s.val(!0),c=e;n.server_.put(c.toString(),l,u=>{es(n,"transaction put response",{path:c.toString(),status:u});let f=[];if(u==="ok"){const p=[];for(let g=0;g<t.length;g++)t[g].status=2,f=f.concat(Zt(n.serverSyncTree_,t[g].currentWriteId)),t[g].onComplete&&p.push(()=>t[g].onComplete(null,!0,t[g].currentOutputSnapshotResolved)),t[g].unwatcher();Jo(n,Fc(n.transactionQueueTree_,e)),jc(n,n.transactionQueueTree_),et(n.eventQueue_,e,f);for(let g=0;g<p.length;g++)Ni(p[g])}else{if(u==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{Ue("transaction at "+c.toString()+" failed: "+u);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=u}Ei(n,e)}},o)}function Ei(n,e){const t=hg(n,e),i=Zr(t),r=dg(n,t);return aR(n,r,i),i}function aR(n,e,t){if(e.length===0)return;const i=[];let r=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],u=je(t,c.path);let f=!1,p;if(D(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)f=!0,p=c.abortReason,r=r.concat(Zt(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=zC)f=!0,p="maxretry",r=r.concat(Zt(n.serverSyncTree_,c.currentWriteId,!0));else{const g=ug(n,c.path,o);c.currentInputSnapshot=g;const w=e[l].update(g.val());if(w!==void 0){Qo("transaction failed: Data returned ",w,c.path);let S=pe(w);typeof w=="object"&&w!=null&&It(w,".priority")||(S=S.updatePriority(g.getPriority()));const k=c.currentWriteId,j=Xo(n),B=eg(S,g,j);c.currentOutputSnapshotRaw=S,c.currentOutputSnapshotResolved=B,c.currentWriteId=Wc(n),o.splice(o.indexOf(k),1),r=r.concat(K_(n.serverSyncTree_,c.path,B,c.currentWriteId,c.applyLocally)),r=r.concat(Zt(n.serverSyncTree_,k,!0))}else f=!0,p="nodata",r=r.concat(Zt(n.serverSyncTree_,c.currentWriteId,!0))}et(n.eventQueue_,t,r),r=[],f&&(e[l].status=2,(function(g){setTimeout(g,Math.floor(0))})(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?i.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):i.push(()=>e[l].onComplete(new Error(p),!1,null))))}Jo(n,n.transactionQueueTree_);for(let l=0;l<i.length;l++)Ni(i[l]);jc(n,n.transactionQueueTree_)}function hg(n,e){let t,i=n.transactionQueueTree_;for(t=H(e);t!==null&&Vi(i)===void 0;)i=Fc(i,t),e=ie(e),t=H(e);return i}function dg(n,e){const t=[];return fg(n,e,t),t.sort((i,r)=>i.order-r.order),t}function fg(n,e,t){const i=Vi(e);if(i)for(let r=0;r<i.length;r++)t.push(i[r]);Ko(e,r=>{fg(n,r,t)})}function Jo(n,e){const t=Vi(e);if(t){let i=0;for(let r=0;r<t.length;r++)t[r].status!==2&&(t[i]=t[r],i++);t.length=i,tg(e,t.length>0?t:void 0)}Ko(e,i=>{Jo(n,i)})}function $c(n,e){const t=Zr(hg(n,e)),i=Fc(n.transactionQueueTree_,e);return xC(i,r=>{el(n,r)}),el(n,i),ig(i,r=>{el(n,r)}),t}function el(n,e){const t=Vi(e);if(t){const i=[];let r=[],s=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(D(s===o-1,"All SENT items should be at beginning of queue."),s=o,t[o].status=3,t[o].abortReason="set"):(D(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),r=r.concat(Zt(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));s===-1?tg(e,void 0):t.length=s+1,et(n.eventQueue_,Zr(e),r);for(let o=0;o<i.length;o++)Ni(i[o])}}/**
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
 */function lR(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let r=t[i];try{r=decodeURIComponent(r.replace(/\+/g," "))}catch{}e+="/"+r}return e}function cR(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):Ue(`Invalid query segment '${t}' in query '${n}'`)}return e}const zd=function(n,e){const t=uR(n),i=t.namespace;t.domain==="firebase.com"&&xt(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&xt("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||yw();const r=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new g_(t.host,t.secure,i,r,e,"",i!==t.subdomain),path:new te(t.pathString)}},uR=function(n){let e="",t="",i="",r="",s="",o=!0,l="https",c=443;if(typeof n=="string"){let u=n.indexOf("//");u>=0&&(l=n.substring(0,u-1),n=n.substring(u+2));let f=n.indexOf("/");f===-1&&(f=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(f,p)),f<p&&(r=lR(n.substring(f,p)));const g=cR(n.substring(Math.min(n.length,p)));u=e.indexOf(":"),u>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(u+1),10)):u=e.length;const w=e.slice(0,u);if(w.toLowerCase()==="localhost")t="localhost";else if(w.split(".").length<=2)t=w;else{const S=e.indexOf(".");i=e.substring(0,S).toLowerCase(),t=e.substring(S+1),s=i}"ns"in g&&(s=g.ns)}return{host:e,port:c,domain:t,subdomain:i,secure:o,scheme:l,pathString:r,namespace:s}};/**
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
 */class hR{constructor(e,t,i,r){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=r}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Te(this.snapshot.exportVal())}}class dR{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class pg{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return D(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class fR{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new He;return tR(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){li("OnDisconnect.remove",this._path);const e=new He;return $d(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){li("OnDisconnect.set",this._path),Sl("OnDisconnect.set",e,this._path);const t=new He;return $d(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){li("OnDisconnect.setWithPriority",this._path),Sl("OnDisconnect.setWithPriority",e,this._path),qC("OnDisconnect.setWithPriority",t);const i=new He;return nR(this._repo,this._path,e,t,i.wrapCallback(()=>{})),i.promise}update(e){li("OnDisconnect.update",this._path),sg("OnDisconnect.update",e,this._path);const t=new He;return iR(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
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
 */class ts{constructor(e,t,i,r){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=r}get key(){return z(this._path)?null:gc(this._path)}get ref(){return new qt(this._repo,this._path)}get _queryIdentifier(){const e=kd(this._queryParams),t=dc(e);return t==="{}"?"default":t}get _queryObject(){return kd(this._queryParams)}isEqual(e){if(e=re(e),!(e instanceof ts))return!1;const t=this._repo===e._repo,i=mc(this._path,e._path),r=this._queryIdentifier===e._queryIdentifier;return t&&i&&r}toJSON(){return this.toString()}toString(){return this._repo.toString()+tA(this._path)}}function pR(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function _R(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===Dn){const i="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",r="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==Fn)throw new Error(i);if(typeof e!="string")throw new Error(r)}if(n.hasEnd()){if(n.getIndexEndName()!==cn)throw new Error(i);if(typeof t!="string")throw new Error(r)}}else if(n.getIndex()===ue){if(e!=null&&!Eo(e)||t!=null&&!Eo(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(D(n.getIndex()instanceof Ec||n.getIndex()===D_,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}class qt extends ts{constructor(e,t){super(e,t,new Ic,!1)}get parent(){const e=C_(this._path);return e===null?null:new qt(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Mr{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new te(e),i=bl(this.ref,e);return new Mr(this._node.getChild(t),i,ue)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,r)=>e(new Mr(r,bl(this.ref,i),ue)))}hasChild(e){const t=new te(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function YP(n,e){return n=re(n),n._checkNotDeleted("ref"),e!==void 0?bl(n._root,e):n._root}function bl(n,e){return n=re(n),H(n._path)===null?WC("child","path",e):Bc("child","path",e),new qt(n._repo,he(n._path,e))}function XP(n){return n=re(n),new fR(n._repo,n._path)}function JP(n){return li("remove",n._path),gR(n,null)}function gR(n,e){n=re(n),li("set",n._path),Sl("set",e,n._path);const t=new He;return JC(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function ZP(n,e){sg("update",e,n._path);const t=new He;return ZC(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function e0(n){n=re(n);const e=new pg(()=>{}),t=new Zo(e);return XC(n._repo,n,t).then(i=>new Mr(i,new qt(n._repo,n._path),n._queryParams.getIndex()))}class Zo{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new hR("value",this,new Mr(e.snapshotNode,new qt(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new dR(this,e,t):null}matches(e){return e instanceof Zo?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function mR(n,e,t,i,r){let s;if(typeof i=="object"&&(s=void 0,r=i),typeof i=="function"&&(s=i),r&&r.onlyOnce){const c=t,u=(f,p)=>{Hd(n._repo,n,l),c(f,p)};u.userCallback=t.userCallback,u.context=t.context,t=u}const o=new pg(t,s||void 0),l=new Zo(o);return rR(n._repo,n,l),()=>Hd(n._repo,n,l)}function t0(n,e,t,i){return mR(n,"value",e,t,i)}let _g=class{};class yR extends _g{constructor(e){super(),this._limit=e,this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new ts(e._repo,e._path,AA(e._queryParams,this._limit),e._orderByCalled)}}function i0(n){if(typeof n!="number"||Math.floor(n)!==n||n<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new yR(n)}class vR extends _g{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){pR(e,"orderByChild");const t=new te(this._path);if(z(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const i=new Ec(t),r=CA(e._queryParams,i);return _R(r),new ts(e._repo,e._path,r,!0)}}function r0(n){return Bc("orderByChild","path",n),new vR(n)}function s0(n,...e){let t=re(n);for(const i of e)t=i._apply(t);return t}fC(qt);yC(qt);/**
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
 */const ER="FIREBASE_DATABASE_EMULATOR_HOST",Pl={};let TR=!1;function IR(n,e,t,i){const r=e.lastIndexOf(":"),s=e.substring(0,r),o=Tn(s);n.repoInfo_=new g_(e,o,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function wR(n,e,t,i,r){let s=i||n.options.databaseURL;s===void 0&&(n.options.projectId||xt("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Re("Using default host for project ",n.options.projectId),s=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=zd(s,r),l=o.repoInfo,c;typeof process<"u"&&dd&&(c=dd[ER]),c?(s=`http://${c}?ns=${l.namespace}`,o=zd(s,r),l=o.repoInfo):o.repoInfo.secure;const u=new Pw(n.name,n.options,e);jC("Invalid Firebase Database URL",o),z(o.path)||xt("Database URL must point to the root of a Firebase Database (not including a child path).");const f=CR(l,n,u,new bw(n,t));return new RR(f,n)}function AR(n,e){const t=Pl[e];(!t||t[n.key]!==n)&&xt(`Database ${e}(${n.repoInfo_}) has already been deleted.`),cg(n),delete t[n.key]}function CR(n,e,t,i){let r=Pl[e.name];r||(r={},Pl[e.name]=r);let s=r[n.toURLString()];return s&&xt("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),s=new GC(n,TR,t,i),r[n.toURLString()]=s,s}class RR{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(KC(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new qt(this._repo,Z())),this._rootInternal}_delete(){return this._rootInternal!==null&&(AR(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&xt("Cannot call "+e+" on a deleted database.")}}function SR(){gi.IS_TRANSPORT_INITIALIZED&&Ue("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function o0(){SR(),kn.forceDisallow()}function a0(n=Lo(),e){const t=Pi(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=tp("database");i&&bR(t,...i)}return t}function bR(n,e,t,i={}){n=re(n),n._checkNotDeleted("useEmulator");const r=`${e}:${t}`,s=n._repoInternal;if(n._instanceStarted){if(r===n._repoInternal.repoInfo_.host&&ln(i,s.repoInfo_.emulatorOptions))return;xt("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(s.repoInfo_.nodeAdmin)i.mockUserToken&&xt('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Bs(Bs.OWNER);else if(i.mockUserToken){const l=typeof i.mockUserToken=="string"?i.mockUserToken:rp(i.mockUserToken,n.app.options.projectId);o=new Bs(l)}Tn(e)&&(zl(e),Gl("Database",!0)),IR(s,r,i,o)}function l0(n){n=re(n),n._checkNotDeleted("goOffline"),cg(n._repo)}function c0(n){n=re(n),n._checkNotDeleted("goOnline"),sR(n._repo)}/**
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
 */function PR(n){dw($n),Ot(new Et("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return wR(i,r,s,t)},"PUBLIC").setMultipleInstances(!0)),ot(fd,pd,n),ot(fd,pd,"esm2017")}kt.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};kt.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};PR();var Gd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var on,gg;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,m){function v(){}v.prototype=m.prototype,T.D=m.prototype,T.prototype=new v,T.prototype.constructor=T,T.C=function(E,I,C){for(var y=Array(arguments.length-2),wt=2;wt<arguments.length;wt++)y[wt-2]=arguments[wt];return m.prototype[I].apply(E,y)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,t),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(T,m,v){v||(v=0);var E=Array(16);if(typeof m=="string")for(var I=0;16>I;++I)E[I]=m.charCodeAt(v++)|m.charCodeAt(v++)<<8|m.charCodeAt(v++)<<16|m.charCodeAt(v++)<<24;else for(I=0;16>I;++I)E[I]=m[v++]|m[v++]<<8|m[v++]<<16|m[v++]<<24;m=T.g[0],v=T.g[1],I=T.g[2];var C=T.g[3],y=m+(C^v&(I^C))+E[0]+3614090360&4294967295;m=v+(y<<7&4294967295|y>>>25),y=C+(I^m&(v^I))+E[1]+3905402710&4294967295,C=m+(y<<12&4294967295|y>>>20),y=I+(v^C&(m^v))+E[2]+606105819&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(m^I&(C^m))+E[3]+3250441966&4294967295,v=I+(y<<22&4294967295|y>>>10),y=m+(C^v&(I^C))+E[4]+4118548399&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(I^m&(v^I))+E[5]+1200080426&4294967295,C=m+(y<<12&4294967295|y>>>20),y=I+(v^C&(m^v))+E[6]+2821735955&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(m^I&(C^m))+E[7]+4249261313&4294967295,v=I+(y<<22&4294967295|y>>>10),y=m+(C^v&(I^C))+E[8]+1770035416&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(I^m&(v^I))+E[9]+2336552879&4294967295,C=m+(y<<12&4294967295|y>>>20),y=I+(v^C&(m^v))+E[10]+4294925233&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(m^I&(C^m))+E[11]+2304563134&4294967295,v=I+(y<<22&4294967295|y>>>10),y=m+(C^v&(I^C))+E[12]+1804603682&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(I^m&(v^I))+E[13]+4254626195&4294967295,C=m+(y<<12&4294967295|y>>>20),y=I+(v^C&(m^v))+E[14]+2792965006&4294967295,I=C+(y<<17&4294967295|y>>>15),y=v+(m^I&(C^m))+E[15]+1236535329&4294967295,v=I+(y<<22&4294967295|y>>>10),y=m+(I^C&(v^I))+E[1]+4129170786&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(m^v))+E[6]+3225465664&4294967295,C=m+(y<<9&4294967295|y>>>23),y=I+(m^v&(C^m))+E[11]+643717713&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(I^C))+E[0]+3921069994&4294967295,v=I+(y<<20&4294967295|y>>>12),y=m+(I^C&(v^I))+E[5]+3593408605&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(m^v))+E[10]+38016083&4294967295,C=m+(y<<9&4294967295|y>>>23),y=I+(m^v&(C^m))+E[15]+3634488961&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(I^C))+E[4]+3889429448&4294967295,v=I+(y<<20&4294967295|y>>>12),y=m+(I^C&(v^I))+E[9]+568446438&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(m^v))+E[14]+3275163606&4294967295,C=m+(y<<9&4294967295|y>>>23),y=I+(m^v&(C^m))+E[3]+4107603335&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(I^C))+E[8]+1163531501&4294967295,v=I+(y<<20&4294967295|y>>>12),y=m+(I^C&(v^I))+E[13]+2850285829&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^I&(m^v))+E[2]+4243563512&4294967295,C=m+(y<<9&4294967295|y>>>23),y=I+(m^v&(C^m))+E[7]+1735328473&4294967295,I=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(I^C))+E[12]+2368359562&4294967295,v=I+(y<<20&4294967295|y>>>12),y=m+(v^I^C)+E[5]+4294588738&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^I)+E[8]+2272392833&4294967295,C=m+(y<<11&4294967295|y>>>21),y=I+(C^m^v)+E[11]+1839030562&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^m)+E[14]+4259657740&4294967295,v=I+(y<<23&4294967295|y>>>9),y=m+(v^I^C)+E[1]+2763975236&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^I)+E[4]+1272893353&4294967295,C=m+(y<<11&4294967295|y>>>21),y=I+(C^m^v)+E[7]+4139469664&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^m)+E[10]+3200236656&4294967295,v=I+(y<<23&4294967295|y>>>9),y=m+(v^I^C)+E[13]+681279174&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^I)+E[0]+3936430074&4294967295,C=m+(y<<11&4294967295|y>>>21),y=I+(C^m^v)+E[3]+3572445317&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^m)+E[6]+76029189&4294967295,v=I+(y<<23&4294967295|y>>>9),y=m+(v^I^C)+E[9]+3654602809&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^I)+E[12]+3873151461&4294967295,C=m+(y<<11&4294967295|y>>>21),y=I+(C^m^v)+E[15]+530742520&4294967295,I=C+(y<<16&4294967295|y>>>16),y=v+(I^C^m)+E[2]+3299628645&4294967295,v=I+(y<<23&4294967295|y>>>9),y=m+(I^(v|~C))+E[0]+4096336452&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~I))+E[7]+1126891415&4294967295,C=m+(y<<10&4294967295|y>>>22),y=I+(m^(C|~v))+E[14]+2878612391&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~m))+E[5]+4237533241&4294967295,v=I+(y<<21&4294967295|y>>>11),y=m+(I^(v|~C))+E[12]+1700485571&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~I))+E[3]+2399980690&4294967295,C=m+(y<<10&4294967295|y>>>22),y=I+(m^(C|~v))+E[10]+4293915773&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~m))+E[1]+2240044497&4294967295,v=I+(y<<21&4294967295|y>>>11),y=m+(I^(v|~C))+E[8]+1873313359&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~I))+E[15]+4264355552&4294967295,C=m+(y<<10&4294967295|y>>>22),y=I+(m^(C|~v))+E[6]+2734768916&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~m))+E[13]+1309151649&4294967295,v=I+(y<<21&4294967295|y>>>11),y=m+(I^(v|~C))+E[4]+4149444226&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~I))+E[11]+3174756917&4294967295,C=m+(y<<10&4294967295|y>>>22),y=I+(m^(C|~v))+E[2]+718787259&4294967295,I=C+(y<<15&4294967295|y>>>17),y=v+(C^(I|~m))+E[9]+3951481745&4294967295,T.g[0]=T.g[0]+m&4294967295,T.g[1]=T.g[1]+(I+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+I&4294967295,T.g[3]=T.g[3]+C&4294967295}i.prototype.u=function(T,m){m===void 0&&(m=T.length);for(var v=m-this.blockSize,E=this.B,I=this.h,C=0;C<m;){if(I==0)for(;C<=v;)r(this,T,C),C+=this.blockSize;if(typeof T=="string"){for(;C<m;)if(E[I++]=T.charCodeAt(C++),I==this.blockSize){r(this,E),I=0;break}}else for(;C<m;)if(E[I++]=T[C++],I==this.blockSize){r(this,E),I=0;break}}this.h=I,this.o+=m},i.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var m=1;m<T.length-8;++m)T[m]=0;var v=8*this.o;for(m=T.length-8;m<T.length;++m)T[m]=v&255,v/=256;for(this.u(T),T=Array(16),m=v=0;4>m;++m)for(var E=0;32>E;E+=8)T[v++]=this.g[m]>>>E&255;return T};function s(T,m){var v=l;return Object.prototype.hasOwnProperty.call(v,T)?v[T]:v[T]=m(T)}function o(T,m){this.h=m;for(var v=[],E=!0,I=T.length-1;0<=I;I--){var C=T[I]|0;E&&C==m||(v[I]=C,E=!1)}this.g=v}var l={};function c(T){return-128<=T&&128>T?s(T,function(m){return new o([m|0],0>m?-1:0)}):new o([T|0],0>T?-1:0)}function u(T){if(isNaN(T)||!isFinite(T))return p;if(0>T)return k(u(-T));for(var m=[],v=1,E=0;T>=v;E++)m[E]=T/v|0,v*=4294967296;return new o(m,0)}function f(T,m){if(T.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(T.charAt(0)=="-")return k(f(T.substring(1),m));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=u(Math.pow(m,8)),E=p,I=0;I<T.length;I+=8){var C=Math.min(8,T.length-I),y=parseInt(T.substring(I,I+C),m);8>C?(C=u(Math.pow(m,C)),E=E.j(C).add(u(y))):(E=E.j(v),E=E.add(u(y)))}return E}var p=c(0),g=c(1),w=c(16777216);n=o.prototype,n.m=function(){if(N(this))return-k(this).m();for(var T=0,m=1,v=0;v<this.g.length;v++){var E=this.i(v);T+=(0<=E?E:4294967296+E)*m,m*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(S(this))return"0";if(N(this))return"-"+k(this).toString(T);for(var m=u(Math.pow(T,6)),v=this,E="";;){var I=ae(v,m).g;v=j(v,I.j(m));var C=((0<v.g.length?v.g[0]:v.h)>>>0).toString(T);if(v=I,S(v))return C+E;for(;6>C.length;)C="0"+C;E=C+E}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function S(T){if(T.h!=0)return!1;for(var m=0;m<T.g.length;m++)if(T.g[m]!=0)return!1;return!0}function N(T){return T.h==-1}n.l=function(T){return T=j(this,T),N(T)?-1:S(T)?0:1};function k(T){for(var m=T.g.length,v=[],E=0;E<m;E++)v[E]=~T.g[E];return new o(v,~T.h).add(g)}n.abs=function(){return N(this)?k(this):this},n.add=function(T){for(var m=Math.max(this.g.length,T.g.length),v=[],E=0,I=0;I<=m;I++){var C=E+(this.i(I)&65535)+(T.i(I)&65535),y=(C>>>16)+(this.i(I)>>>16)+(T.i(I)>>>16);E=y>>>16,C&=65535,y&=65535,v[I]=y<<16|C}return new o(v,v[v.length-1]&-2147483648?-1:0)};function j(T,m){return T.add(k(m))}n.j=function(T){if(S(this)||S(T))return p;if(N(this))return N(T)?k(this).j(k(T)):k(k(this).j(T));if(N(T))return k(this.j(k(T)));if(0>this.l(w)&&0>T.l(w))return u(this.m()*T.m());for(var m=this.g.length+T.g.length,v=[],E=0;E<2*m;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var I=0;I<T.g.length;I++){var C=this.i(E)>>>16,y=this.i(E)&65535,wt=T.i(I)>>>16,Bi=T.i(I)&65535;v[2*E+2*I]+=y*Bi,B(v,2*E+2*I),v[2*E+2*I+1]+=C*Bi,B(v,2*E+2*I+1),v[2*E+2*I+1]+=y*wt,B(v,2*E+2*I+1),v[2*E+2*I+2]+=C*wt,B(v,2*E+2*I+2)}for(E=0;E<m;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=m;E<2*m;E++)v[E]=0;return new o(v,0)};function B(T,m){for(;(T[m]&65535)!=T[m];)T[m+1]+=T[m]>>>16,T[m]&=65535,m++}function $(T,m){this.g=T,this.h=m}function ae(T,m){if(S(m))throw Error("division by zero");if(S(T))return new $(p,p);if(N(T))return m=ae(k(T),m),new $(k(m.g),k(m.h));if(N(m))return m=ae(T,k(m)),new $(k(m.g),m.h);if(30<T.g.length){if(N(T)||N(m))throw Error("slowDivide_ only works with positive integers.");for(var v=g,E=m;0>=E.l(T);)v=Ye(v),E=Ye(E);var I=_e(v,1),C=_e(E,1);for(E=_e(E,2),v=_e(v,2);!S(E);){var y=C.add(E);0>=y.l(T)&&(I=I.add(v),C=y),E=_e(E,1),v=_e(v,1)}return m=j(T,I.j(m)),new $(I,m)}for(I=p;0<=T.l(m);){for(v=Math.max(1,Math.floor(T.m()/m.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),C=u(v),y=C.j(m);N(y)||0<y.l(T);)v-=E,C=u(v),y=C.j(m);S(C)&&(C=g),I=I.add(C),T=j(T,y)}return new $(I,T)}n.A=function(T){return ae(this,T).h},n.and=function(T){for(var m=Math.max(this.g.length,T.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)&T.i(E);return new o(v,this.h&T.h)},n.or=function(T){for(var m=Math.max(this.g.length,T.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)|T.i(E);return new o(v,this.h|T.h)},n.xor=function(T){for(var m=Math.max(this.g.length,T.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)^T.i(E);return new o(v,this.h^T.h)};function Ye(T){for(var m=T.g.length+1,v=[],E=0;E<m;E++)v[E]=T.i(E)<<1|T.i(E-1)>>>31;return new o(v,T.h)}function _e(T,m){var v=m>>5;m%=32;for(var E=T.g.length-v,I=[],C=0;C<E;C++)I[C]=0<m?T.i(C+v)>>>m|T.i(C+v+1)<<32-m:T.i(C+v);return new o(I,T.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,gg=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=f,on=o}).apply(typeof Gd<"u"?Gd:typeof self<"u"?self:typeof window<"u"?window:{});var Ns=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mg,ur,yg,Ws,kl,vg,Eg,Tg;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,h,d){return a==Array.prototype||a==Object.prototype||(a[h]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ns=="object"&&Ns];for(var h=0;h<a.length;++h){var d=a[h];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var i=t(this);function r(a,h){if(h)e:{var d=i;a=a.split(".");for(var _=0;_<a.length-1;_++){var A=a[_];if(!(A in d))break e;d=d[A]}a=a[a.length-1],_=d[a],h=h(_),h!=_&&h!=null&&e(d,a,{configurable:!0,writable:!0,value:h})}}function s(a,h){a instanceof String&&(a+="");var d=0,_=!1,A={next:function(){if(!_&&d<a.length){var R=d++;return{value:h(R,a[R]),done:!1}}return _=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}r("Array.prototype.values",function(a){return a||function(){return s(this,function(h,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var h=typeof a;return h=h!="object"?h:a?Array.isArray(a)?"array":h:"null",h=="array"||h=="object"&&typeof a.length=="number"}function u(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function f(a,h,d){return a.call.apply(a.bind,arguments)}function p(a,h,d){if(!a)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,_),a.apply(h,A)}}return function(){return a.apply(h,arguments)}}function g(a,h,d){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,g.apply(null,arguments)}function w(a,h){var d=Array.prototype.slice.call(arguments,1);return function(){var _=d.slice();return _.push.apply(_,arguments),a.apply(this,_)}}function S(a,h){function d(){}d.prototype=h.prototype,a.aa=h.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(_,A,R){for(var O=Array(arguments.length-2),ne=2;ne<arguments.length;ne++)O[ne-2]=arguments[ne];return h.prototype[A].apply(_,O)}}function N(a){const h=a.length;if(0<h){const d=Array(h);for(let _=0;_<h;_++)d[_]=a[_];return d}return[]}function k(a,h){for(let d=1;d<arguments.length;d++){const _=arguments[d];if(c(_)){const A=a.length||0,R=_.length||0;a.length=A+R;for(let O=0;O<R;O++)a[A+O]=_[O]}else a.push(_)}}class j{constructor(h,d){this.i=h,this.j=d,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function B(a){return/^[\s\xa0]*$/.test(a)}function $(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function ae(a){return ae[" "](a),a}ae[" "]=function(){};var Ye=$().indexOf("Gecko")!=-1&&!($().toLowerCase().indexOf("webkit")!=-1&&$().indexOf("Edge")==-1)&&!($().indexOf("Trident")!=-1||$().indexOf("MSIE")!=-1)&&$().indexOf("Edge")==-1;function _e(a,h,d){for(const _ in a)h.call(d,a[_],_,a)}function T(a,h){for(const d in a)h.call(void 0,a[d],d,a)}function m(a){const h={};for(const d in a)h[d]=a[d];return h}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(a,h){let d,_;for(let A=1;A<arguments.length;A++){_=arguments[A];for(d in _)a[d]=_[d];for(let R=0;R<v.length;R++)d=v[R],Object.prototype.hasOwnProperty.call(_,d)&&(a[d]=_[d])}}function I(a){var h=1;a=a.split(":");const d=[];for(;0<h&&a.length;)d.push(a.shift()),h--;return a.length&&d.push(a.join(":")),d}function C(a){l.setTimeout(()=>{throw a},0)}function y(){var a=_a;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class wt{constructor(){this.h=this.g=null}add(h,d){const _=Bi.get();_.set(h,d),this.h?this.h.next=_:this.g=_,this.h=_}}var Bi=new j(()=>new Gm,a=>a.reset());class Gm{constructor(){this.next=this.g=this.h=null}set(h,d){this.h=h,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let qi,Wi=!1,_a=new wt,Nu=()=>{const a=l.Promise.resolve(void 0);qi=()=>{a.then(Km)}};var Km=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){C(d)}var h=Bi;h.j(a),100>h.h&&(h.h++,a.next=h.g,h.g=a)}Wi=!1};function jt(){this.s=this.s,this.C=this.C}jt.prototype.s=!1,jt.prototype.ma=function(){this.s||(this.s=!0,this.N())},jt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function De(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}De.prototype.h=function(){this.defaultPrevented=!0};var Qm=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};l.addEventListener("test",d,h),l.removeEventListener("test",d,h)}catch{}return a})();function ji(a,h){if(De.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,_=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget){if(Ye){e:{try{ae(h.nodeName);var A=!0;break e}catch{}A=!1}A||(h=null)}}else d=="mouseover"?h=a.fromElement:d=="mouseout"&&(h=a.toElement);this.relatedTarget=h,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Ym[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&ji.aa.h.call(this)}}S(ji,De);var Ym={2:"touch",3:"pen",4:"mouse"};ji.prototype.h=function(){ji.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var as="closure_listenable_"+(1e6*Math.random()|0),Xm=0;function Jm(a,h,d,_,A){this.listener=a,this.proxy=null,this.src=h,this.type=d,this.capture=!!_,this.ha=A,this.key=++Xm,this.da=this.fa=!1}function ls(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function cs(a){this.src=a,this.g={},this.h=0}cs.prototype.add=function(a,h,d,_,A){var R=a.toString();a=this.g[R],a||(a=this.g[R]=[],this.h++);var O=ma(a,h,_,A);return-1<O?(h=a[O],d||(h.fa=!1)):(h=new Jm(h,this.src,R,!!_,A),h.fa=d,a.push(h)),h};function ga(a,h){var d=h.type;if(d in a.g){var _=a.g[d],A=Array.prototype.indexOf.call(_,h,void 0),R;(R=0<=A)&&Array.prototype.splice.call(_,A,1),R&&(ls(h),a.g[d].length==0&&(delete a.g[d],a.h--))}}function ma(a,h,d,_){for(var A=0;A<a.length;++A){var R=a[A];if(!R.da&&R.listener==h&&R.capture==!!d&&R.ha==_)return A}return-1}var ya="closure_lm_"+(1e6*Math.random()|0),va={};function Du(a,h,d,_,A){if(Array.isArray(h)){for(var R=0;R<h.length;R++)Du(a,h[R],d,_,A);return null}return d=xu(d),a&&a[as]?a.K(h,d,u(_)?!!_.capture:!1,A):Zm(a,h,d,!1,_,A)}function Zm(a,h,d,_,A,R){if(!h)throw Error("Invalid event type");var O=u(A)?!!A.capture:!!A,ne=Ta(a);if(ne||(a[ya]=ne=new cs(a)),d=ne.add(h,d,_,O,R),d.proxy)return d;if(_=ey(),d.proxy=_,_.src=a,_.listener=d,a.addEventListener)Qm||(A=O),A===void 0&&(A=!1),a.addEventListener(h.toString(),_,A);else if(a.attachEvent)a.attachEvent(Vu(h.toString()),_);else if(a.addListener&&a.removeListener)a.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return d}function ey(){function a(d){return h.call(a.src,a.listener,d)}const h=ty;return a}function Ou(a,h,d,_,A){if(Array.isArray(h))for(var R=0;R<h.length;R++)Ou(a,h[R],d,_,A);else _=u(_)?!!_.capture:!!_,d=xu(d),a&&a[as]?(a=a.i,h=String(h).toString(),h in a.g&&(R=a.g[h],d=ma(R,d,_,A),-1<d&&(ls(R[d]),Array.prototype.splice.call(R,d,1),R.length==0&&(delete a.g[h],a.h--)))):a&&(a=Ta(a))&&(h=a.g[h.toString()],a=-1,h&&(a=ma(h,d,_,A)),(d=-1<a?h[a]:null)&&Ea(d))}function Ea(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[as])ga(h.i,a);else{var d=a.type,_=a.proxy;h.removeEventListener?h.removeEventListener(d,_,a.capture):h.detachEvent?h.detachEvent(Vu(d),_):h.addListener&&h.removeListener&&h.removeListener(_),(d=Ta(h))?(ga(d,a),d.h==0&&(d.src=null,h[ya]=null)):ls(a)}}}function Vu(a){return a in va?va[a]:va[a]="on"+a}function ty(a,h){if(a.da)a=!0;else{h=new ji(h,this);var d=a.listener,_=a.ha||a.src;a.fa&&Ea(a),a=d.call(_,h)}return a}function Ta(a){return a=a[ya],a instanceof cs?a:null}var Ia="__closure_events_fn_"+(1e9*Math.random()>>>0);function xu(a){return typeof a=="function"?a:(a[Ia]||(a[Ia]=function(h){return a.handleEvent(h)}),a[Ia])}function Oe(){jt.call(this),this.i=new cs(this),this.M=this,this.F=null}S(Oe,jt),Oe.prototype[as]=!0,Oe.prototype.removeEventListener=function(a,h,d,_){Ou(this,a,h,d,_)};function qe(a,h){var d,_=a.F;if(_)for(d=[];_;_=_.F)d.push(_);if(a=a.M,_=h.type||h,typeof h=="string")h=new De(h,a);else if(h instanceof De)h.target=h.target||a;else{var A=h;h=new De(_,a),E(h,A)}if(A=!0,d)for(var R=d.length-1;0<=R;R--){var O=h.g=d[R];A=us(O,_,!0,h)&&A}if(O=h.g=a,A=us(O,_,!0,h)&&A,A=us(O,_,!1,h)&&A,d)for(R=0;R<d.length;R++)O=h.g=d[R],A=us(O,_,!1,h)&&A}Oe.prototype.N=function(){if(Oe.aa.N.call(this),this.i){var a=this.i,h;for(h in a.g){for(var d=a.g[h],_=0;_<d.length;_++)ls(d[_]);delete a.g[h],a.h--}}this.F=null},Oe.prototype.K=function(a,h,d,_){return this.i.add(String(a),h,!1,d,_)},Oe.prototype.L=function(a,h,d,_){return this.i.add(String(a),h,!0,d,_)};function us(a,h,d,_){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();for(var A=!0,R=0;R<h.length;++R){var O=h[R];if(O&&!O.da&&O.capture==d){var ne=O.listener,be=O.ha||O.src;O.fa&&ga(a.i,O),A=ne.call(be,_)!==!1&&A}}return A&&!_.defaultPrevented}function Mu(a,h,d){if(typeof a=="function")d&&(a=g(a,d));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:l.setTimeout(a,h||0)}function Lu(a){a.g=Mu(()=>{a.g=null,a.i&&(a.i=!1,Lu(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class ny extends jt{constructor(h,d){super(),this.m=h,this.l=d,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Lu(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function $i(a){jt.call(this),this.h=a,this.g={}}S($i,jt);var Fu=[];function Uu(a){_e(a.g,function(h,d){this.g.hasOwnProperty(d)&&Ea(h)},a),a.g={}}$i.prototype.N=function(){$i.aa.N.call(this),Uu(this)},$i.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var wa=l.JSON.stringify,iy=l.JSON.parse,ry=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Aa(){}Aa.prototype.h=null;function Bu(a){return a.h||(a.h=a.i())}function qu(){}var Hi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ca(){De.call(this,"d")}S(Ca,De);function Ra(){De.call(this,"c")}S(Ra,De);var wn={},Wu=null;function hs(){return Wu=Wu||new Oe}wn.La="serverreachability";function ju(a){De.call(this,wn.La,a)}S(ju,De);function zi(a){const h=hs();qe(h,new ju(h))}wn.STAT_EVENT="statevent";function $u(a,h){De.call(this,wn.STAT_EVENT,a),this.stat=h}S($u,De);function We(a){const h=hs();qe(h,new $u(h,a))}wn.Ma="timingevent";function Hu(a,h){De.call(this,wn.Ma,a),this.size=h}S(Hu,De);function Gi(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},h)}function Ki(){this.g=!0}Ki.prototype.xa=function(){this.g=!1};function sy(a,h,d,_,A,R){a.info(function(){if(a.g)if(R)for(var O="",ne=R.split("&"),be=0;be<ne.length;be++){var J=ne[be].split("=");if(1<J.length){var Ve=J[0];J=J[1];var xe=Ve.split("_");O=2<=xe.length&&xe[1]=="type"?O+(Ve+"="+J+"&"):O+(Ve+"=redacted&")}}else O=null;else O=R;return"XMLHTTP REQ ("+_+") [attempt "+A+"]: "+h+`
`+d+`
`+O})}function oy(a,h,d,_,A,R,O){a.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+A+"]: "+h+`
`+d+`
`+R+" "+O})}function Xn(a,h,d,_){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+ly(a,d)+(_?" "+_:"")})}function ay(a,h){a.info(function(){return"TIMEOUT: "+h})}Ki.prototype.info=function(){};function ly(a,h){if(!a.g)return h;if(!h)return null;try{var d=JSON.parse(h);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var _=d[a];if(!(2>_.length)){var A=_[1];if(Array.isArray(A)&&!(1>A.length)){var R=A[0];if(R!="noop"&&R!="stop"&&R!="close")for(var O=1;O<A.length;O++)A[O]=""}}}}return wa(d)}catch{return h}}var ds={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},zu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Sa;function fs(){}S(fs,Aa),fs.prototype.g=function(){return new XMLHttpRequest},fs.prototype.i=function(){return{}},Sa=new fs;function $t(a,h,d,_){this.j=a,this.i=h,this.l=d,this.R=_||1,this.U=new $i(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Gu}function Gu(){this.i=null,this.g="",this.h=!1}var Ku={},ba={};function Pa(a,h,d){a.L=1,a.v=ms(At(h)),a.m=d,a.P=!0,Qu(a,null)}function Qu(a,h){a.F=Date.now(),ps(a),a.A=At(a.v);var d=a.A,_=a.R;Array.isArray(_)||(_=[String(_)]),ch(d.i,"t",_),a.C=0,d=a.j.J,a.h=new Gu,a.g=Sh(a.j,d?h:null,!a.m),0<a.O&&(a.M=new ny(g(a.Y,a,a.g),a.O)),h=a.U,d=a.g,_=a.ca;var A="readystatechange";Array.isArray(A)||(A&&(Fu[0]=A.toString()),A=Fu);for(var R=0;R<A.length;R++){var O=Du(d,A[R],_||h.handleEvent,!1,h.h||h);if(!O)break;h.g[O.key]=O}h=a.H?m(a.H):{},a.m?(a.u||(a.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,h)):(a.u="GET",a.g.ea(a.A,a.u,null,h)),zi(),sy(a.i,a.u,a.A,a.l,a.R,a.m)}$t.prototype.ca=function(a){a=a.target;const h=this.M;h&&Ct(a)==3?h.j():this.Y(a)},$t.prototype.Y=function(a){try{if(a==this.g)e:{const xe=Ct(this.g);var h=this.g.Ba();const ei=this.g.Z();if(!(3>xe)&&(xe!=3||this.g&&(this.h.h||this.g.oa()||gh(this.g)))){this.J||xe!=4||h==7||(h==8||0>=ei?zi(3):zi(2)),ka(this);var d=this.g.Z();this.X=d;t:if(Yu(this)){var _=gh(this.g);a="";var A=_.length,R=Ct(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){An(this),Qi(this);var O="";break t}this.h.i=new l.TextDecoder}for(h=0;h<A;h++)this.h.h=!0,a+=this.h.i.decode(_[h],{stream:!(R&&h==A-1)});_.length=0,this.h.g+=a,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=d==200,oy(this.i,this.u,this.A,this.l,this.R,xe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var ne,be=this.g;if((ne=be.g?be.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!B(ne)){var J=ne;break t}}J=null}if(d=J)Xn(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Na(this,d);else{this.o=!1,this.s=3,We(12),An(this),Qi(this);break e}}if(this.P){d=!0;let tt;for(;!this.J&&this.C<O.length;)if(tt=cy(this,O),tt==ba){xe==4&&(this.s=4,We(14),d=!1),Xn(this.i,this.l,null,"[Incomplete Response]");break}else if(tt==Ku){this.s=4,We(15),Xn(this.i,this.l,O,"[Invalid Chunk]"),d=!1;break}else Xn(this.i,this.l,tt,null),Na(this,tt);if(Yu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),xe!=4||O.length!=0||this.h.h||(this.s=1,We(16),d=!1),this.o=this.o&&d,!d)Xn(this.i,this.l,O,"[Invalid Chunked Response]"),An(this),Qi(this);else if(0<O.length&&!this.W){this.W=!0;var Ve=this.j;Ve.g==this&&Ve.ba&&!Ve.M&&(Ve.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),La(Ve),Ve.M=!0,We(11))}}else Xn(this.i,this.l,O,null),Na(this,O);xe==4&&An(this),this.o&&!this.J&&(xe==4?wh(this.j,this):(this.o=!1,ps(this)))}else Ry(this.g),d==400&&0<O.indexOf("Unknown SID")?(this.s=3,We(12)):(this.s=0,We(13)),An(this),Qi(this)}}}catch{}finally{}};function Yu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function cy(a,h){var d=a.C,_=h.indexOf(`
`,d);return _==-1?ba:(d=Number(h.substring(d,_)),isNaN(d)?Ku:(_+=1,_+d>h.length?ba:(h=h.slice(_,_+d),a.C=_+d,h)))}$t.prototype.cancel=function(){this.J=!0,An(this)};function ps(a){a.S=Date.now()+a.I,Xu(a,a.I)}function Xu(a,h){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Gi(g(a.ba,a),h)}function ka(a){a.B&&(l.clearTimeout(a.B),a.B=null)}$t.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(ay(this.i,this.A),this.L!=2&&(zi(),We(17)),An(this),this.s=2,Qi(this)):Xu(this,this.S-a)};function Qi(a){a.j.G==0||a.J||wh(a.j,a)}function An(a){ka(a);var h=a.M;h&&typeof h.ma=="function"&&h.ma(),a.M=null,Uu(a.U),a.g&&(h=a.g,a.g=null,h.abort(),h.ma())}function Na(a,h){try{var d=a.j;if(d.G!=0&&(d.g==a||Da(d.h,a))){if(!a.K&&Da(d.h,a)&&d.G==3){try{var _=d.Da.g.parse(h)}catch{_=null}if(Array.isArray(_)&&_.length==3){var A=_;if(A[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)ws(d),Ts(d);else break e;Ma(d),We(18)}}else d.za=A[1],0<d.za-d.T&&37500>A[2]&&d.F&&d.v==0&&!d.C&&(d.C=Gi(g(d.Za,d),6e3));if(1>=eh(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else Rn(d,11)}else if((a.K||d.g==a)&&ws(d),!B(h))for(A=d.Da.g.parse(h),h=0;h<A.length;h++){let J=A[h];if(d.T=J[0],J=J[1],d.G==2)if(J[0]=="c"){d.K=J[1],d.ia=J[2];const Ve=J[3];Ve!=null&&(d.la=Ve,d.j.info("VER="+d.la));const xe=J[4];xe!=null&&(d.Aa=xe,d.j.info("SVER="+d.Aa));const ei=J[5];ei!=null&&typeof ei=="number"&&0<ei&&(_=1.5*ei,d.L=_,d.j.info("backChannelRequestTimeoutMs_="+_)),_=d;const tt=a.g;if(tt){const Cs=tt.g?tt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Cs){var R=_.h;R.g||Cs.indexOf("spdy")==-1&&Cs.indexOf("quic")==-1&&Cs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Oa(R,R.h),R.h=null))}if(_.D){const Fa=tt.g?tt.g.getResponseHeader("X-HTTP-Session-Id"):null;Fa&&(_.ya=Fa,le(_.I,_.D,Fa))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),_=d;var O=a;if(_.qa=Rh(_,_.J?_.ia:null,_.W),O.K){th(_.h,O);var ne=O,be=_.L;be&&(ne.I=be),ne.B&&(ka(ne),ps(ne)),_.g=O}else Th(_);0<d.i.length&&Is(d)}else J[0]!="stop"&&J[0]!="close"||Rn(d,7);else d.G==3&&(J[0]=="stop"||J[0]=="close"?J[0]=="stop"?Rn(d,7):xa(d):J[0]!="noop"&&d.l&&d.l.ta(J),d.v=0)}}zi(4)}catch{}}var uy=class{constructor(a,h){this.g=a,this.map=h}};function Ju(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Zu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function eh(a){return a.h?1:a.g?a.g.size:0}function Da(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function Oa(a,h){a.g?a.g.add(h):a.h=h}function th(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}Ju.prototype.cancel=function(){if(this.i=nh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function nh(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const d of a.g.values())h=h.concat(d.D);return h}return N(a.i)}function hy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var h=[],d=a.length,_=0;_<d;_++)h.push(a[_]);return h}h=[],d=0;for(_ in a)h[d++]=a[_];return h}function dy(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var h=[];a=a.length;for(var d=0;d<a;d++)h.push(d);return h}h=[],d=0;for(const _ in a)h[d++]=_;return h}}}function ih(a,h){if(a.forEach&&typeof a.forEach=="function")a.forEach(h,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,h,void 0);else for(var d=dy(a),_=hy(a),A=_.length,R=0;R<A;R++)h.call(void 0,_[R],d&&d[R],a)}var rh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function fy(a,h){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var _=a[d].indexOf("="),A=null;if(0<=_){var R=a[d].substring(0,_);A=a[d].substring(_+1)}else R=a[d];h(R,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function Cn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Cn){this.h=a.h,_s(this,a.j),this.o=a.o,this.g=a.g,gs(this,a.s),this.l=a.l;var h=a.i,d=new Ji;d.i=h.i,h.g&&(d.g=new Map(h.g),d.h=h.h),sh(this,d),this.m=a.m}else a&&(h=String(a).match(rh))?(this.h=!1,_s(this,h[1]||"",!0),this.o=Yi(h[2]||""),this.g=Yi(h[3]||"",!0),gs(this,h[4]),this.l=Yi(h[5]||"",!0),sh(this,h[6]||"",!0),this.m=Yi(h[7]||"")):(this.h=!1,this.i=new Ji(null,this.h))}Cn.prototype.toString=function(){var a=[],h=this.j;h&&a.push(Xi(h,oh,!0),":");var d=this.g;return(d||h=="file")&&(a.push("//"),(h=this.o)&&a.push(Xi(h,oh,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Xi(d,d.charAt(0)=="/"?gy:_y,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Xi(d,yy)),a.join("")};function At(a){return new Cn(a)}function _s(a,h,d){a.j=d?Yi(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function gs(a,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);a.s=h}else a.s=null}function sh(a,h,d){h instanceof Ji?(a.i=h,vy(a.i,a.h)):(d||(h=Xi(h,my)),a.i=new Ji(h,a.h))}function le(a,h,d){a.i.set(h,d)}function ms(a){return le(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Yi(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Xi(a,h,d){return typeof a=="string"?(a=encodeURI(a).replace(h,py),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function py(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var oh=/[#\/\?@]/g,_y=/[#\?:]/g,gy=/[#\?]/g,my=/[#\?@]/g,yy=/#/g;function Ji(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function Ht(a){a.g||(a.g=new Map,a.h=0,a.i&&fy(a.i,function(h,d){a.add(decodeURIComponent(h.replace(/\+/g," ")),d)}))}n=Ji.prototype,n.add=function(a,h){Ht(this),this.i=null,a=Jn(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(h),this.h+=1,this};function ah(a,h){Ht(a),h=Jn(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function lh(a,h){return Ht(a),h=Jn(a,h),a.g.has(h)}n.forEach=function(a,h){Ht(this),this.g.forEach(function(d,_){d.forEach(function(A){a.call(h,A,_,this)},this)},this)},n.na=function(){Ht(this);const a=Array.from(this.g.values()),h=Array.from(this.g.keys()),d=[];for(let _=0;_<h.length;_++){const A=a[_];for(let R=0;R<A.length;R++)d.push(h[_])}return d},n.V=function(a){Ht(this);let h=[];if(typeof a=="string")lh(this,a)&&(h=h.concat(this.g.get(Jn(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)h=h.concat(a[d])}return h},n.set=function(a,h){return Ht(this),this.i=null,a=Jn(this,a),lh(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},n.get=function(a,h){return a?(a=this.V(a),0<a.length?String(a[0]):h):h};function ch(a,h,d){ah(a,h),0<d.length&&(a.i=null,a.g.set(Jn(a,h),N(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(var d=0;d<h.length;d++){var _=h[d];const R=encodeURIComponent(String(_)),O=this.V(_);for(_=0;_<O.length;_++){var A=R;O[_]!==""&&(A+="="+encodeURIComponent(String(O[_]))),a.push(A)}}return this.i=a.join("&")};function Jn(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function vy(a,h){h&&!a.j&&(Ht(a),a.i=null,a.g.forEach(function(d,_){var A=_.toLowerCase();_!=A&&(ah(this,_),ch(this,A,d))},a)),a.j=h}function Ey(a,h){const d=new Ki;if(l.Image){const _=new Image;_.onload=w(zt,d,"TestLoadImage: loaded",!0,h,_),_.onerror=w(zt,d,"TestLoadImage: error",!1,h,_),_.onabort=w(zt,d,"TestLoadImage: abort",!1,h,_),_.ontimeout=w(zt,d,"TestLoadImage: timeout",!1,h,_),l.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=a}else h(!1)}function Ty(a,h){const d=new Ki,_=new AbortController,A=setTimeout(()=>{_.abort(),zt(d,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:_.signal}).then(R=>{clearTimeout(A),R.ok?zt(d,"TestPingServer: ok",!0,h):zt(d,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(A),zt(d,"TestPingServer: error",!1,h)})}function zt(a,h,d,_,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),_(d)}catch{}}function Iy(){this.g=new ry}function wy(a,h,d){const _=d||"";try{ih(a,function(A,R){let O=A;u(A)&&(O=wa(A)),h.push(_+R+"="+encodeURIComponent(O))})}catch(A){throw h.push(_+"type="+encodeURIComponent("_badmap")),A}}function ys(a){this.l=a.Ub||null,this.j=a.eb||!1}S(ys,Aa),ys.prototype.g=function(){return new vs(this.l,this.j)},ys.prototype.i=(function(a){return function(){return a}})({});function vs(a,h){Oe.call(this),this.D=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(vs,Oe),n=vs.prototype,n.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=h,this.readyState=1,er(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(h.body=a),(this.D||l).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Zi(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,er(this)),this.g&&(this.readyState=3,er(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;uh(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function uh(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?Zi(this):er(this),this.readyState==3&&uh(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,Zi(this))},n.Qa=function(a){this.g&&(this.response=a,Zi(this))},n.ga=function(){this.g&&Zi(this)};function Zi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,er(a)}n.setRequestHeader=function(a,h){this.u.append(a,h)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var d=h.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=h.next();return a.join(`\r
`)};function er(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(vs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function hh(a){let h="";return _e(a,function(d,_){h+=_,h+=":",h+=d,h+=`\r
`}),h}function Va(a,h,d){e:{for(_ in d){var _=!1;break e}_=!0}_||(d=hh(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):le(a,h,d))}function fe(a){Oe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(fe,Oe);var Ay=/^https?$/i,Cy=["POST","PUT"];n=fe.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,h,d,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Sa.g(),this.v=this.o?Bu(this.o):Bu(Sa),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(R){dh(this,R);return}if(a=d||"",d=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var A in _)d.set(A,_[A]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const R of _.keys())d.set(R,_.get(R));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(d.keys()).find(R=>R.toLowerCase()=="content-type"),A=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Cy,h,void 0))||_||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,O]of d)this.g.setRequestHeader(R,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{_h(this),this.u=!0,this.g.send(a),this.u=!1}catch(R){dh(this,R)}};function dh(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.m=5,fh(a),Es(a)}function fh(a){a.A||(a.A=!0,qe(a,"complete"),qe(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,qe(this,"complete"),qe(this,"abort"),Es(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Es(this,!0)),fe.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?ph(this):this.bb())},n.bb=function(){ph(this)};function ph(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Ct(a)!=4||a.Z()!=2)){if(a.u&&Ct(a)==4)Mu(a.Ea,0,a);else if(qe(a,"readystatechange"),Ct(a)==4){a.h=!1;try{const O=a.Z();e:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var d;if(!(d=h)){var _;if(_=O===0){var A=String(a.D).match(rh)[1]||null;!A&&l.self&&l.self.location&&(A=l.self.location.protocol.slice(0,-1)),_=!Ay.test(A?A.toLowerCase():"")}d=_}if(d)qe(a,"complete"),qe(a,"success");else{a.m=6;try{var R=2<Ct(a)?a.g.statusText:""}catch{R=""}a.l=R+" ["+a.Z()+"]",fh(a)}}finally{Es(a)}}}}function Es(a,h){if(a.g){_h(a);const d=a.g,_=a.v[0]?()=>{}:null;a.g=null,a.v=null,h||qe(a,"ready");try{d.onreadystatechange=_}catch{}}}function _h(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function Ct(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<Ct(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),iy(h)}};function gh(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Ry(a){const h={};a=(a.g&&2<=Ct(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<a.length;_++){if(B(a[_]))continue;var d=I(a[_]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const R=h[A]||[];h[A]=R,R.push(d)}T(h,function(_){return _.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function tr(a,h,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||h}function mh(a){this.Aa=0,this.i=[],this.j=new Ki,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tr("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tr("baseRetryDelayMs",5e3,a),this.cb=tr("retryDelaySeedMs",1e4,a),this.Wa=tr("forwardChannelMaxRetries",2,a),this.wa=tr("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Ju(a&&a.concurrentRequestLimit),this.Da=new Iy,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=mh.prototype,n.la=8,n.G=1,n.connect=function(a,h,d,_){We(0),this.W=a,this.H=h||{},d&&_!==void 0&&(this.H.OSID=d,this.H.OAID=_),this.F=this.X,this.I=Rh(this,null,this.W),Is(this)};function xa(a){if(yh(a),a.G==3){var h=a.U++,d=At(a.I);if(le(d,"SID",a.K),le(d,"RID",h),le(d,"TYPE","terminate"),nr(a,d),h=new $t(a,a.j,h),h.L=2,h.v=ms(At(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(h.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=h.v,d=!0),d||(h.g=Sh(h.j,null),h.g.ea(h.v)),h.F=Date.now(),ps(h)}Ch(a)}function Ts(a){a.g&&(La(a),a.g.cancel(),a.g=null)}function yh(a){Ts(a),a.u&&(l.clearTimeout(a.u),a.u=null),ws(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Is(a){if(!Zu(a.h)&&!a.s){a.s=!0;var h=a.Ga;qi||Nu(),Wi||(qi(),Wi=!0),_a.add(h,a),a.B=0}}function Sy(a,h){return eh(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=h.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Gi(g(a.Ga,a,h),Ah(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const A=new $t(this,this.j,a);let R=this.o;if(this.S&&(R?(R=m(R),E(R,this.S)):R=this.S),this.m!==null||this.O||(A.H=R,R=null),this.P)e:{for(var h=0,d=0;d<this.i.length;d++){t:{var _=this.i[d];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(h+=_,4096<h){h=d;break e}if(h===4096||d===this.i.length-1){h=d+1;break e}}h=1e3}else h=1e3;h=Eh(this,A,h),d=At(this.I),le(d,"RID",a),le(d,"CVER",22),this.D&&le(d,"X-HTTP-Session-Id",this.D),nr(this,d),R&&(this.O?h="headers="+encodeURIComponent(String(hh(R)))+"&"+h:this.m&&Va(d,this.m,R)),Oa(this.h,A),this.Ua&&le(d,"TYPE","init"),this.P?(le(d,"$req",h),le(d,"SID","null"),A.T=!0,Pa(A,d,null)):Pa(A,d,h),this.G=2}}else this.G==3&&(a?vh(this,a):this.i.length==0||Zu(this.h)||vh(this))};function vh(a,h){var d;h?d=h.l:d=a.U++;const _=At(a.I);le(_,"SID",a.K),le(_,"RID",d),le(_,"AID",a.T),nr(a,_),a.m&&a.o&&Va(_,a.m,a.o),d=new $t(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),h&&(a.i=h.D.concat(a.i)),h=Eh(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Oa(a.h,d),Pa(d,_,h)}function nr(a,h){a.H&&_e(a.H,function(d,_){le(h,_,d)}),a.l&&ih({},function(d,_){le(h,_,d)})}function Eh(a,h,d){d=Math.min(a.i.length,d);var _=a.l?g(a.l.Na,a.l,a):null;e:{var A=a.i;let R=-1;for(;;){const O=["count="+d];R==-1?0<d?(R=A[0].g,O.push("ofs="+R)):R=0:O.push("ofs="+R);let ne=!0;for(let be=0;be<d;be++){let J=A[be].g;const Ve=A[be].map;if(J-=R,0>J)R=Math.max(0,A[be].g-100),ne=!1;else try{wy(Ve,O,"req"+J+"_")}catch{_&&_(Ve)}}if(ne){_=O.join("&");break e}}}return a=a.i.splice(0,d),h.D=a,_}function Th(a){if(!a.g&&!a.u){a.Y=1;var h=a.Fa;qi||Nu(),Wi||(qi(),Wi=!0),_a.add(h,a),a.v=0}}function Ma(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Gi(g(a.Fa,a),Ah(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Ih(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Gi(g(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,We(10),Ts(this),Ih(this))};function La(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Ih(a){a.g=new $t(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var h=At(a.qa);le(h,"RID","rpc"),le(h,"SID",a.K),le(h,"AID",a.T),le(h,"CI",a.F?"0":"1"),!a.F&&a.ja&&le(h,"TO",a.ja),le(h,"TYPE","xmlhttp"),nr(a,h),a.m&&a.o&&Va(h,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=ms(At(h)),d.m=null,d.P=!0,Qu(d,a)}n.Za=function(){this.C!=null&&(this.C=null,Ts(this),Ma(this),We(19))};function ws(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function wh(a,h){var d=null;if(a.g==h){ws(a),La(a),a.g=null;var _=2}else if(Da(a.h,h))d=h.D,th(a.h,h),_=1;else return;if(a.G!=0){if(h.o)if(_==1){d=h.m?h.m.length:0,h=Date.now()-h.F;var A=a.B;_=hs(),qe(_,new Hu(_,d)),Is(a)}else Th(a);else if(A=h.s,A==3||A==0&&0<h.X||!(_==1&&Sy(a,h)||_==2&&Ma(a)))switch(d&&0<d.length&&(h=a.h,h.i=h.i.concat(d)),A){case 1:Rn(a,5);break;case 4:Rn(a,10);break;case 3:Rn(a,6);break;default:Rn(a,2)}}}function Ah(a,h){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*h}function Rn(a,h){if(a.j.info("Error code "+h),h==2){var d=g(a.fb,a),_=a.Xa;const A=!_;_=new Cn(_||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||_s(_,"https"),ms(_),A?Ey(_.toString(),d):Ty(_.toString(),d)}else We(2);a.G=0,a.l&&a.l.sa(h),Ch(a),yh(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),We(2)):(this.j.info("Failed to ping google.com"),We(1))};function Ch(a){if(a.G=0,a.ka=[],a.l){const h=nh(a.h);(h.length!=0||a.i.length!=0)&&(k(a.ka,h),k(a.ka,a.i),a.h.i.length=0,N(a.i),a.i.length=0),a.l.ra()}}function Rh(a,h,d){var _=d instanceof Cn?At(d):new Cn(d);if(_.g!="")h&&(_.g=h+"."+_.g),gs(_,_.s);else{var A=l.location;_=A.protocol,h=h?h+"."+A.hostname:A.hostname,A=+A.port;var R=new Cn(null);_&&_s(R,_),h&&(R.g=h),A&&gs(R,A),d&&(R.l=d),_=R}return d=a.D,h=a.ya,d&&h&&le(_,d,h),le(_,"VER",a.la),nr(a,_),_}function Sh(a,h,d){if(h&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Ca&&!a.pa?new fe(new ys({eb:d})):new fe(a.pa),h.Ha(a.J),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function bh(){}n=bh.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function As(){}As.prototype.g=function(a,h){return new Ge(a,h)};function Ge(a,h){Oe.call(this),this.g=new mh(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(a?a["X-WebChannel-Client-Profile"]=h.va:a={"X-WebChannel-Client-Profile":h.va}),this.g.S=a,(a=h&&h.Sb)&&!B(a)&&(this.g.m=a),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!B(h)&&(this.g.D=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new Zn(this)}S(Ge,Oe),Ge.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ge.prototype.close=function(){xa(this.g)},Ge.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=wa(a),a=d);h.i.push(new uy(h.Ya++,a)),h.G==3&&Is(h)},Ge.prototype.N=function(){this.g.l=null,delete this.j,xa(this.g),delete this.g,Ge.aa.N.call(this)};function Ph(a){Ca.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const d in h){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}S(Ph,Ca);function kh(){Ra.call(this),this.status=1}S(kh,Ra);function Zn(a){this.g=a}S(Zn,bh),Zn.prototype.ua=function(){qe(this.g,"a")},Zn.prototype.ta=function(a){qe(this.g,new Ph(a))},Zn.prototype.sa=function(a){qe(this.g,new kh)},Zn.prototype.ra=function(){qe(this.g,"b")},As.prototype.createWebChannel=As.prototype.g,Ge.prototype.send=Ge.prototype.o,Ge.prototype.open=Ge.prototype.m,Ge.prototype.close=Ge.prototype.close,Tg=function(){return new As},Eg=function(){return hs()},vg=wn,kl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ds.NO_ERROR=0,ds.TIMEOUT=8,ds.HTTP_ERROR=6,Ws=ds,zu.COMPLETE="complete",yg=zu,qu.EventType=Hi,Hi.OPEN="a",Hi.CLOSE="b",Hi.ERROR="c",Hi.MESSAGE="d",Oe.prototype.listen=Oe.prototype.K,ur=qu,fe.prototype.listenOnce=fe.prototype.L,fe.prototype.getLastError=fe.prototype.Ka,fe.prototype.getLastErrorCode=fe.prototype.Ba,fe.prototype.getStatus=fe.prototype.Z,fe.prototype.getResponseJson=fe.prototype.Oa,fe.prototype.getResponseText=fe.prototype.oa,fe.prototype.send=fe.prototype.ea,fe.prototype.setWithCredentials=fe.prototype.Ha,mg=fe}).apply(typeof Ns<"u"?Ns:typeof self<"u"?self:typeof window<"u"?window:{});const Kd="@firebase/firestore",Qd="4.8.0";/**
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
 */class Le{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Le.UNAUTHENTICATED=new Le(null),Le.GOOGLE_CREDENTIALS=new Le("google-credentials-uid"),Le.FIRST_PARTY=new Le("first-party-uid"),Le.MOCK_USER=new Le("mock-user");/**
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
 */let xi="11.10.0";/**
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
 */const qn=new $r("@firebase/firestore");function ni(){return qn.logLevel}function x(n,...e){if(qn.logLevel<=Q.DEBUG){const t=e.map(Hc);qn.debug(`Firestore (${xi}): ${n}`,...t)}}function Mt(n,...e){if(qn.logLevel<=Q.ERROR){const t=e.map(Hc);qn.error(`Firestore (${xi}): ${n}`,...t)}}function pn(n,...e){if(qn.logLevel<=Q.WARN){const t=e.map(Hc);qn.warn(`Firestore (${xi}): ${n}`,...t)}}function Hc(n){if(typeof n=="string")return n;try{/**
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
 */function U(n,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,Ig(n,i,t)}function Ig(n,e,t){let i=`FIRESTORE (${xi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Mt(i),new Error(i)}function ee(n,e,t,i){let r="Unexpected state";typeof t=="string"?r=t:i=t,n||Ig(e,r,i)}function W(n,e){return n}/**
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
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends Ft{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Nt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class wg{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class kR{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Le.UNAUTHENTICATED)))}shutdown(){}}class NR{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class DR{constructor(e){this.t=e,this.currentUser=Le.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ee(this.o===void 0,42304);let i=this.i;const r=c=>this.i!==i?(i=this.i,t(c)):Promise.resolve();let s=new Nt;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Nt,e.enqueueRetryable((()=>r(this.currentUser)))};const o=()=>{const c=s;e.enqueueRetryable((async()=>{await c.promise,await r(this.currentUser)}))},l=c=>{x("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((c=>l(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(x("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Nt)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(x("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(ee(typeof i.accessToken=="string",31837,{l:i}),new wg(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ee(e===null||typeof e=="string",2055,{h:e}),new Le(e)}}class OR{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=Le.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class VR{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new OR(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Le.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Yd{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class xR{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Qe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ee(this.o===void 0,3512);const i=s=>{s.error!=null&&x("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,x("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>i(s)))};const r=s=>{x("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((s=>r(s))),setTimeout((()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?r(s):x("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Yd(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ee(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Yd(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function MR(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<n;i++)t[i]=Math.floor(256*Math.random());return t}/**
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
 */function Ag(){return new TextEncoder}/**
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
 */class zc{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const r=MR(40);for(let s=0;s<r.length;++s)i.length<20&&r[s]<t&&(i+=e.charAt(r[s]%62))}return i}}function G(n,e){return n<e?-1:n>e?1:0}function Nl(n,e){let t=0;for(;t<n.length&&t<e.length;){const i=n.codePointAt(t),r=e.codePointAt(t);if(i!==r){if(i<128&&r<128)return G(i,r);{const s=Ag(),o=LR(s.encode(Xd(n,t)),s.encode(Xd(e,t)));return o!==0?o:G(i,r)}}t+=i>65535?2:1}return G(n.length,e.length)}function Xd(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function LR(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return G(n[t],e[t]);return G(n.length,e.length)}function Ti(n,e,t){return n.length===e.length&&n.every(((i,r)=>t(i,e[r])))}/**
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
 */const Jd="__name__";class ht{constructor(e,t,i){t===void 0?t=0:t>e.length&&U(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&U(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return ht.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ht?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let r=0;r<i;r++){const s=ht.compareSegments(e.get(r),t.get(r));if(s!==0)return s}return G(e.length,t.length)}static compareSegments(e,t){const i=ht.isNumericId(e),r=ht.isNumericId(t);return i&&!r?-1:!i&&r?1:i&&r?ht.extractNumericId(e).compare(ht.extractNumericId(t)):Nl(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return on.fromString(e.substring(4,e.length-2))}}class oe extends ht{construct(e,t,i){return new oe(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new V(b.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((r=>r.length>0)))}return new oe(t)}static emptyPath(){return new oe([])}}const FR=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ke extends ht{construct(e,t,i){return new ke(e,t,i)}static isValidIdentifier(e){return FR.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ke.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Jd}static keyField(){return new ke([Jd])}static fromServerFormat(e){const t=[];let i="",r=0;const s=()=>{if(i.length===0)throw new V(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new V(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new V(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(i+=l,r++):(s(),r++)}if(s(),o)throw new V(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ke(t)}static emptyPath(){return new ke([])}}/**
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
 */function Cg(n,e,t){if(!t)throw new V(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function UR(n,e,t,i){if(e===!0&&i===!0)throw new V(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Zd(n){if(!M.isDocumentKey(n))throw new V(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ef(n){if(M.isDocumentKey(n))throw new V(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Rg(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function ea(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":U(12329,{type:typeof n})}function lt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ea(n);throw new V(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function BR(n,e){if(e<=0)throw new V(b.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
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
 */function Ee(n,e){const t={typeString:n};return e&&(t.value=e),t}function ns(n,e){if(!Rg(n))throw new V(b.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const r=e[i].typeString,s="value"in e[i]?{value:e[i].value}:void 0;if(!(i in n)){t=`JSON missing required field: '${i}'`;break}const o=n[i];if(r&&typeof o!==r){t=`JSON field '${i}' must be a ${r}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${i}' field to equal '${s.value}'`;break}}if(t)throw new V(b.INVALID_ARGUMENT,t);return!0}/**
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
 */const tf=-62135596800,nf=1e6;class ce{static now(){return ce.fromMillis(Date.now())}static fromDate(e){return ce.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*nf);return new ce(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<tf)throw new V(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/nf}_compareTo(e){return this.seconds===e.seconds?G(this.nanoseconds,e.nanoseconds):G(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ce._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ns(e,ce._jsonSchema))return new ce(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-tf;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ce._jsonSchemaVersion="firestore/timestamp/1.0",ce._jsonSchema={type:Ee("string",ce._jsonSchemaVersion),seconds:Ee("number"),nanoseconds:Ee("number")};/**
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
 */class q{static fromTimestamp(e){return new q(e)}static min(){return new q(new ce(0,0))}static max(){return new q(new ce(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const Lr=-1;function qR(n,e){const t=n.toTimestamp().seconds,i=n.toTimestamp().nanoseconds+1,r=q.fromTimestamp(i===1e9?new ce(t+1,0):new ce(t,i));return new _n(r,M.empty(),e)}function WR(n){return new _n(n.readTime,n.key,Lr)}class _n{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new _n(q.min(),M.empty(),Lr)}static max(){return new _n(q.max(),M.empty(),Lr)}}function jR(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(n.documentKey,e.documentKey),t!==0?t:G(n.largestBatchId,e.largestBatchId))}/**
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
 */const $R="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class HR{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function Mi(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==$R)throw n;x("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&U(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P(((i,r)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(i,r)},this.catchCallback=s=>{this.wrapFailure(t,s).next(i,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):P.reject(t)}static resolve(e){return new P(((t,i)=>{t(e)}))}static reject(e){return new P(((t,i)=>{i(e)}))}static waitFor(e){return new P(((t,i)=>{let r=0,s=0,o=!1;e.forEach((l=>{++r,l.next((()=>{++s,o&&s===r&&t()}),(c=>i(c)))})),o=!0,s===r&&t()}))}static or(e){let t=P.resolve(!1);for(const i of e)t=t.next((r=>r?P.resolve(r):i()));return t}static forEach(e,t){const i=[];return e.forEach(((r,s)=>{i.push(t.call(this,r,s))})),this.waitFor(i)}static mapArray(e,t){return new P(((i,r)=>{const s=e.length,o=new Array(s);let l=0;for(let c=0;c<s;c++){const u=c;t(e[u]).next((f=>{o[u]=f,++l,l===s&&i(o)}),(f=>r(f)))}}))}static doWhile(e,t){return new P(((i,r)=>{const s=()=>{e()===!0?t().next((()=>{s()}),r):i()};s()}))}}function zR(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Li(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class ta{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this._e(i),this.ae=i=>t.writeSequenceNumber(i))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}ta.ue=-1;/**
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
 */const Gc=-1;function na(n){return n==null}function To(n){return n===0&&1/n==-1/0}function GR(n){return typeof n=="number"&&Number.isInteger(n)&&!To(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const Sg="";function KR(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=rf(e)),e=QR(n.get(t),e);return rf(e)}function QR(n,e){let t=e;const i=n.length;for(let r=0;r<i;r++){const s=n.charAt(r);switch(s){case"\0":t+="";break;case Sg:t+="";break;default:t+=s}}return t}function rf(n){return n+Sg+""}/**
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
 */function sf(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Gn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function bg(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class de{constructor(e,t){this.comparator=e,this.root=t||Pe.EMPTY}insert(e,t){return new de(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Pe.BLACK,null,null))}remove(e){return new de(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Pe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const r=this.comparator(e,i.key);if(r===0)return t+i.left.size;r<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ds(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ds(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ds(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ds(this.root,e,this.comparator,!0)}}class Ds{constructor(e,t,i,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?i(e.key,t):1,t&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Pe{constructor(e,t,i,r,s){this.key=e,this.value=t,this.color=i??Pe.RED,this.left=r??Pe.EMPTY,this.right=s??Pe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,r,s){return new Pe(e??this.key,t??this.value,i??this.color,r??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let r=this;const s=i(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,t,i),null):s===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,i)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Pe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return Pe.EMPTY;i=r.right.min(),r=r.copy(i.key,i.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Pe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Pe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw U(43730,{key:this.key,value:this.value});if(this.right.isRed())throw U(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw U(27949);return e+(this.isRed()?0:1)}}Pe.EMPTY=null,Pe.RED=!0,Pe.BLACK=!1;Pe.EMPTY=new class{constructor(){this.size=0}get key(){throw U(57766)}get value(){throw U(16141)}get color(){throw U(16727)}get left(){throw U(29726)}get right(){throw U(36894)}copy(e,t,i,r,s){return this}insert(e,t,i){return new Pe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class we{constructor(e){this.comparator=e,this.data=new de(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const r=i.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new of(this.data.getIterator())}getIteratorFrom(e){return new of(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof we)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,s=i.getNext().key;if(this.comparator(r,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new we(this.comparator);return t.data=e,t}}class of{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class st{constructor(e){this.fields=e,e.sort(ke.comparator)}static empty(){return new st([])}unionWith(e){let t=new we(ke.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new st(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ti(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
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
 */class Pg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Ne{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Pg("Invalid base64 string: "+s):s}})(e);return new Ne(t)}static fromUint8Array(e){const t=(function(r){let s="";for(let o=0;o<r.length;++o)s+=String.fromCharCode(r[o]);return s})(e);return new Ne(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let r=0;r<t.length;r++)i[r]=t.charCodeAt(r);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return G(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ne.EMPTY_BYTE_STRING=new Ne("");const YR=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function gn(n){if(ee(!!n,39018),typeof n=="string"){let e=0;const t=YR.exec(n);if(ee(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const i=new Date(n);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:ge(n.seconds),nanos:ge(n.nanos)}}function ge(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function mn(n){return typeof n=="string"?Ne.fromBase64String(n):Ne.fromUint8Array(n)}/**
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
 */const kg="server_timestamp",Ng="__type__",Dg="__previous_value__",Og="__local_write_time__";function Kc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Ng])===null||t===void 0?void 0:t.stringValue)===kg}function ia(n){const e=n.mapValue.fields[Dg];return Kc(e)?ia(e):e}function Fr(n){const e=gn(n.mapValue.fields[Og].timestampValue);return new ce(e.seconds,e.nanos)}/**
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
 */class XR{constructor(e,t,i,r,s,o,l,c,u,f){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=r,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=u,this.isUsingEmulator=f}}const Io="(default)";class Ur{constructor(e,t){this.projectId=e,this.database=t||Io}static empty(){return new Ur("","")}get isDefaultDatabase(){return this.database===Io}isEqual(e){return e instanceof Ur&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Vg="__type__",JR="__max__",Os={mapValue:{}},xg="__vector__",wo="value";function yn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Kc(n)?4:eS(n)?9007199254740991:ZR(n)?10:11:U(28295,{value:n})}function Tt(n,e){if(n===e)return!0;const t=yn(n);if(t!==yn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Fr(n).isEqual(Fr(e));case 3:return(function(r,s){if(typeof r.timestampValue=="string"&&typeof s.timestampValue=="string"&&r.timestampValue.length===s.timestampValue.length)return r.timestampValue===s.timestampValue;const o=gn(r.timestampValue),l=gn(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,s){return mn(r.bytesValue).isEqual(mn(s.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,s){return ge(r.geoPointValue.latitude)===ge(s.geoPointValue.latitude)&&ge(r.geoPointValue.longitude)===ge(s.geoPointValue.longitude)})(n,e);case 2:return(function(r,s){if("integerValue"in r&&"integerValue"in s)return ge(r.integerValue)===ge(s.integerValue);if("doubleValue"in r&&"doubleValue"in s){const o=ge(r.doubleValue),l=ge(s.doubleValue);return o===l?To(o)===To(l):isNaN(o)&&isNaN(l)}return!1})(n,e);case 9:return Ti(n.arrayValue.values||[],e.arrayValue.values||[],Tt);case 10:case 11:return(function(r,s){const o=r.mapValue.fields||{},l=s.mapValue.fields||{};if(sf(o)!==sf(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Tt(o[c],l[c])))return!1;return!0})(n,e);default:return U(52216,{left:n})}}function Br(n,e){return(n.values||[]).find((t=>Tt(t,e)))!==void 0}function Ii(n,e){if(n===e)return 0;const t=yn(n),i=yn(e);if(t!==i)return G(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return G(n.booleanValue,e.booleanValue);case 2:return(function(s,o){const l=ge(s.integerValue||s.doubleValue),c=ge(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1})(n,e);case 3:return af(n.timestampValue,e.timestampValue);case 4:return af(Fr(n),Fr(e));case 5:return Nl(n.stringValue,e.stringValue);case 6:return(function(s,o){const l=mn(s),c=mn(o);return l.compareTo(c)})(n.bytesValue,e.bytesValue);case 7:return(function(s,o){const l=s.split("/"),c=o.split("/");for(let u=0;u<l.length&&u<c.length;u++){const f=G(l[u],c[u]);if(f!==0)return f}return G(l.length,c.length)})(n.referenceValue,e.referenceValue);case 8:return(function(s,o){const l=G(ge(s.latitude),ge(o.latitude));return l!==0?l:G(ge(s.longitude),ge(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return lf(n.arrayValue,e.arrayValue);case 10:return(function(s,o){var l,c,u,f;const p=s.fields||{},g=o.fields||{},w=(l=p[wo])===null||l===void 0?void 0:l.arrayValue,S=(c=g[wo])===null||c===void 0?void 0:c.arrayValue,N=G(((u=w==null?void 0:w.values)===null||u===void 0?void 0:u.length)||0,((f=S==null?void 0:S.values)===null||f===void 0?void 0:f.length)||0);return N!==0?N:lf(w,S)})(n.mapValue,e.mapValue);case 11:return(function(s,o){if(s===Os.mapValue&&o===Os.mapValue)return 0;if(s===Os.mapValue)return 1;if(o===Os.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),u=o.fields||{},f=Object.keys(u);c.sort(),f.sort();for(let p=0;p<c.length&&p<f.length;++p){const g=Nl(c[p],f[p]);if(g!==0)return g;const w=Ii(l[c[p]],u[f[p]]);if(w!==0)return w}return G(c.length,f.length)})(n.mapValue,e.mapValue);default:throw U(23264,{le:t})}}function af(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return G(n,e);const t=gn(n),i=gn(e),r=G(t.seconds,i.seconds);return r!==0?r:G(t.nanos,i.nanos)}function lf(n,e){const t=n.values||[],i=e.values||[];for(let r=0;r<t.length&&r<i.length;++r){const s=Ii(t[r],i[r]);if(s)return s}return G(t.length,i.length)}function wi(n){return Dl(n)}function Dl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const i=gn(t);return`time(${i.seconds},${i.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return mn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return M.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let i="[",r=!0;for(const s of t.values||[])r?r=!1:i+=",",i+=Dl(s);return i+"]"})(n.arrayValue):"mapValue"in n?(function(t){const i=Object.keys(t.fields||{}).sort();let r="{",s=!0;for(const o of i)s?s=!1:r+=",",r+=`${o}:${Dl(t.fields[o])}`;return r+"}"})(n.mapValue):U(61005,{value:n})}function js(n){switch(yn(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ia(n);return e?16+js(e):16;case 5:return 2*n.stringValue.length;case 6:return mn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((r,s)=>r+js(s)),0)})(n.arrayValue);case 10:case 11:return(function(i){let r=0;return Gn(i.fields,((s,o)=>{r+=s.length+js(o)})),r})(n.mapValue);default:throw U(13486,{value:n})}}function cf(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Ol(n){return!!n&&"integerValue"in n}function Qc(n){return!!n&&"arrayValue"in n}function uf(n){return!!n&&"nullValue"in n}function hf(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function $s(n){return!!n&&"mapValue"in n}function ZR(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Vg])===null||t===void 0?void 0:t.stringValue)===xg}function Tr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Gn(n.mapValue.fields,((t,i)=>e.mapValue.fields[t]=Tr(i))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Tr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function eS(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===JR}/**
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
 */class Xe{constructor(e){this.value=e}static empty(){return new Xe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!$s(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Tr(t)}setAll(e){let t=ke.emptyPath(),i={},r=[];e.forEach(((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,i,r),i={},r=[],t=l.popLast()}o?i[l.lastSegment()]=Tr(o):r.push(l.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,i,r)}delete(e){const t=this.field(e.popLast());$s(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Tt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let r=t.mapValue.fields[e.get(i)];$s(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,i){Gn(t,((r,s)=>e[r]=s));for(const r of i)delete e[r]}clone(){return new Xe(Tr(this.value))}}function Mg(n){const e=[];return Gn(n.fields,((t,i)=>{const r=new ke([t]);if($s(i)){const s=Mg(i.mapValue).fields;if(s.length===0)e.push(r);else for(const o of s)e.push(r.child(o))}else e.push(r)})),new st(e)}/**
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
 */class Fe{constructor(e,t,i,r,s,o,l){this.key=e,this.documentType=t,this.version=i,this.readTime=r,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Fe(e,0,q.min(),q.min(),q.min(),Xe.empty(),0)}static newFoundDocument(e,t,i,r){return new Fe(e,1,t,q.min(),i,r,0)}static newNoDocument(e,t){return new Fe(e,2,t,q.min(),q.min(),Xe.empty(),0)}static newUnknownDocument(e,t){return new Fe(e,3,t,q.min(),q.min(),Xe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Xe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Xe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Fe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Fe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Ao{constructor(e,t){this.position=e,this.inclusive=t}}function df(n,e,t){let i=0;for(let r=0;r<n.position.length;r++){const s=e[r],o=n.position[r];if(s.field.isKeyField()?i=M.comparator(M.fromName(o.referenceValue),t.key):i=Ii(o,t.data.field(s.field)),s.dir==="desc"&&(i*=-1),i!==0)break}return i}function ff(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Tt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class qr{constructor(e,t="asc"){this.field=e,this.dir=t}}function tS(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Lg{}class ve extends Lg{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new iS(e,t,i):t==="array-contains"?new oS(e,i):t==="in"?new aS(e,i):t==="not-in"?new lS(e,i):t==="array-contains-any"?new cS(e,i):new ve(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new rS(e,i):new sS(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Ii(t,this.value)):t!==null&&yn(this.value)===yn(t)&&this.matchesComparison(Ii(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return U(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ut extends Lg{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new ut(e,t)}matches(e){return Fg(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Fg(n){return n.op==="and"}function Ug(n){return nS(n)&&Fg(n)}function nS(n){for(const e of n.filters)if(e instanceof ut)return!1;return!0}function Vl(n){if(n instanceof ve)return n.field.canonicalString()+n.op.toString()+wi(n.value);if(Ug(n))return n.filters.map((e=>Vl(e))).join(",");{const e=n.filters.map((t=>Vl(t))).join(",");return`${n.op}(${e})`}}function Bg(n,e){return n instanceof ve?(function(i,r){return r instanceof ve&&i.op===r.op&&i.field.isEqual(r.field)&&Tt(i.value,r.value)})(n,e):n instanceof ut?(function(i,r){return r instanceof ut&&i.op===r.op&&i.filters.length===r.filters.length?i.filters.reduce(((s,o,l)=>s&&Bg(o,r.filters[l])),!0):!1})(n,e):void U(19439)}function qg(n){return n instanceof ve?(function(t){return`${t.field.canonicalString()} ${t.op} ${wi(t.value)}`})(n):n instanceof ut?(function(t){return t.op.toString()+" {"+t.getFilters().map(qg).join(" ,")+"}"})(n):"Filter"}class iS extends ve{constructor(e,t,i){super(e,t,i),this.key=M.fromName(i.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class rS extends ve{constructor(e,t){super(e,"in",t),this.keys=Wg("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class sS extends ve{constructor(e,t){super(e,"not-in",t),this.keys=Wg("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Wg(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((i=>M.fromName(i.referenceValue)))}class oS extends ve{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Qc(t)&&Br(t.arrayValue,this.value)}}class aS extends ve{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Br(this.value.arrayValue,t)}}class lS extends ve{constructor(e,t){super(e,"not-in",t)}matches(e){if(Br(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Br(this.value.arrayValue,t)}}class cS extends ve{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Qc(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>Br(this.value.arrayValue,i)))}}/**
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
 */class uS{constructor(e,t=null,i=[],r=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=r,this.limit=s,this.startAt=o,this.endAt=l,this.Pe=null}}function pf(n,e=null,t=[],i=[],r=null,s=null,o=null){return new uS(n,e,t,i,r,s,o)}function Yc(n){const e=W(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>Vl(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(s){return s.field.canonicalString()+s.dir})(i))).join(","),na(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>wi(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>wi(i))).join(",")),e.Pe=t}return e.Pe}function Xc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!tS(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Bg(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!ff(n.startAt,e.startAt)&&ff(n.endAt,e.endAt)}function xl(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Fi{constructor(e,t=null,i=[],r=[],s=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=r,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function hS(n,e,t,i,r,s,o,l){return new Fi(n,e,t,i,r,s,o,l)}function ra(n){return new Fi(n)}function _f(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function jg(n){return n.collectionGroup!==null}function Ir(n){const e=W(n);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new we(ke.comparator);return o.filters.forEach((c=>{c.getFlattenedFilters().forEach((u=>{u.isInequality()&&(l=l.add(u.field))}))})),l})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new qr(s,i))})),t.has(ke.keyField().canonicalString())||e.Te.push(new qr(ke.keyField(),i))}return e.Te}function _t(n){const e=W(n);return e.Ie||(e.Ie=dS(e,Ir(n))),e.Ie}function dS(n,e){if(n.limitType==="F")return pf(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const s=r.dir==="desc"?"asc":"desc";return new qr(r.field,s)}));const t=n.endAt?new Ao(n.endAt.position,n.endAt.inclusive):null,i=n.startAt?new Ao(n.startAt.position,n.startAt.inclusive):null;return pf(n.path,n.collectionGroup,e,n.filters,n.limit,t,i)}}function Ml(n,e){const t=n.filters.concat([e]);return new Fi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Co(n,e,t){return new Fi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function sa(n,e){return Xc(_t(n),_t(e))&&n.limitType===e.limitType}function $g(n){return`${Yc(_t(n))}|lt:${n.limitType}`}function ii(n){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((r=>qg(r))).join(", ")}]`),na(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((r=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(r))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((r=>wi(r))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((r=>wi(r))).join(",")),`Target(${i})`})(_t(n))}; limitType=${n.limitType})`}function oa(n,e){return e.isFoundDocument()&&(function(i,r){const s=r.key.path;return i.collectionGroup!==null?r.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(s):M.isDocumentKey(i.path)?i.path.isEqual(s):i.path.isImmediateParentOf(s)})(n,e)&&(function(i,r){for(const s of Ir(i))if(!s.field.isKeyField()&&r.data.field(s.field)===null)return!1;return!0})(n,e)&&(function(i,r){for(const s of i.filters)if(!s.matches(r))return!1;return!0})(n,e)&&(function(i,r){return!(i.startAt&&!(function(o,l,c){const u=df(o,l,c);return o.inclusive?u<=0:u<0})(i.startAt,Ir(i),r)||i.endAt&&!(function(o,l,c){const u=df(o,l,c);return o.inclusive?u>=0:u>0})(i.endAt,Ir(i),r))})(n,e)}function fS(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Hg(n){return(e,t)=>{let i=!1;for(const r of Ir(n)){const s=pS(r,e,t);if(s!==0)return s;i=i||r.field.isKeyField()}return 0}}function pS(n,e,t){const i=n.field.isKeyField()?M.comparator(e.key,t.key):(function(s,o,l){const c=o.data.field(s),u=l.data.field(s);return c!==null&&u!==null?Ii(c,u):U(42886)})(n.field,e,t);switch(n.dir){case"asc":return i;case"desc":return-1*i;default:return U(19790,{direction:n.dir})}}/**
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
 */class Kn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[r,s]of i)if(this.equalsFn(r,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),r=this.inner[i];if(r===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return i.length===1?delete this.inner[t]:i.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Gn(this.inner,((t,i)=>{for(const[r,s]of i)e(r,s)}))}isEmpty(){return bg(this.inner)}size(){return this.innerSize}}/**
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
 */const _S=new de(M.comparator);function Lt(){return _S}const zg=new de(M.comparator);function hr(...n){let e=zg;for(const t of n)e=e.insert(t.key,t);return e}function Gg(n){let e=zg;return n.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function Nn(){return wr()}function Kg(){return wr()}function wr(){return new Kn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const gS=new de(M.comparator),mS=new we(M.comparator);function Y(...n){let e=mS;for(const t of n)e=e.add(t);return e}const yS=new we(G);function vS(){return yS}/**
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
 */function Jc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:To(e)?"-0":e}}function Qg(n){return{integerValue:""+n}}function ES(n,e){return GR(e)?Qg(e):Jc(n,e)}/**
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
 */class aa{constructor(){this._=void 0}}function TS(n,e,t){return n instanceof Ro?(function(r,s){const o={fields:{[Ng]:{stringValue:kg},[Og]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return s&&Kc(s)&&(s=ia(s)),s&&(o.fields[Dg]=s),{mapValue:o}})(t,e):n instanceof Wr?Xg(n,e):n instanceof jr?Jg(n,e):(function(r,s){const o=Yg(r,s),l=gf(o)+gf(r.Ee);return Ol(o)&&Ol(r.Ee)?Qg(l):Jc(r.serializer,l)})(n,e)}function IS(n,e,t){return n instanceof Wr?Xg(n,e):n instanceof jr?Jg(n,e):t}function Yg(n,e){return n instanceof So?(function(i){return Ol(i)||(function(s){return!!s&&"doubleValue"in s})(i)})(e)?e:{integerValue:0}:null}class Ro extends aa{}class Wr extends aa{constructor(e){super(),this.elements=e}}function Xg(n,e){const t=Zg(e);for(const i of n.elements)t.some((r=>Tt(r,i)))||t.push(i);return{arrayValue:{values:t}}}class jr extends aa{constructor(e){super(),this.elements=e}}function Jg(n,e){let t=Zg(e);for(const i of n.elements)t=t.filter((r=>!Tt(r,i)));return{arrayValue:{values:t}}}class So extends aa{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function gf(n){return ge(n.integerValue||n.doubleValue)}function Zg(n){return Qc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function wS(n,e){return n.field.isEqual(e.field)&&(function(i,r){return i instanceof Wr&&r instanceof Wr||i instanceof jr&&r instanceof jr?Ti(i.elements,r.elements,Tt):i instanceof So&&r instanceof So?Tt(i.Ee,r.Ee):i instanceof Ro&&r instanceof Ro})(n.transform,e.transform)}class AS{constructor(e,t){this.version=e,this.transformResults=t}}class gt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new gt}static exists(e){return new gt(void 0,e)}static updateTime(e){return new gt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Hs(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class la{}function em(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Zc(n.key,gt.none()):new is(n.key,n.data,gt.none());{const t=n.data,i=Xe.empty();let r=new we(ke.comparator);for(let s of e.fields)if(!r.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?i.delete(s):i.set(s,o),r=r.add(s)}return new Qn(n.key,i,new st(r.toArray()),gt.none())}}function CS(n,e,t){n instanceof is?(function(r,s,o){const l=r.value.clone(),c=yf(r.fieldTransforms,s,o.transformResults);l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()})(n,e,t):n instanceof Qn?(function(r,s,o){if(!Hs(r.precondition,s))return void s.convertToUnknownDocument(o.version);const l=yf(r.fieldTransforms,s,o.transformResults),c=s.data;c.setAll(tm(r)),c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):(function(r,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Ar(n,e,t,i){return n instanceof is?(function(s,o,l,c){if(!Hs(s.precondition,o))return l;const u=s.value.clone(),f=vf(s.fieldTransforms,c,o);return u.setAll(f),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null})(n,e,t,i):n instanceof Qn?(function(s,o,l,c){if(!Hs(s.precondition,o))return l;const u=vf(s.fieldTransforms,c,o),f=o.data;return f.setAll(tm(s)),f.setAll(u),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((p=>p.field)))})(n,e,t,i):(function(s,o,l){return Hs(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l})(n,e,t)}function RS(n,e){let t=null;for(const i of n.fieldTransforms){const r=e.data.field(i.field),s=Yg(i.transform,r||null);s!=null&&(t===null&&(t=Xe.empty()),t.set(i.field,s))}return t||null}function mf(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(i,r){return i===void 0&&r===void 0||!(!i||!r)&&Ti(i,r,((s,o)=>wS(s,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class is extends la{constructor(e,t,i,r=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Qn extends la{constructor(e,t,i,r,s=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function tm(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=n.data.field(t);e.set(t,i)}})),e}function yf(n,e,t){const i=new Map;ee(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let r=0;r<t.length;r++){const s=n[r],o=s.transform,l=e.data.field(s.field);i.set(s.field,IS(o,l,t[r]))}return i}function vf(n,e,t){const i=new Map;for(const r of n){const s=r.transform,o=t.data.field(r.field);i.set(r.field,TS(s,o,e))}return i}class Zc extends la{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class SS extends la{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class bS{constructor(e,t,i,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=r}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const s=this.mutations[r];s.key.isEqual(e.key)&&CS(s,e,i[r])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=Ar(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=Ar(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=Kg();return this.mutations.forEach((r=>{const s=e.get(r.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=t.has(r.key)?null:l;const c=em(o,l);c!==null&&i.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(q.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Y())}isEqual(e){return this.batchId===e.batchId&&Ti(this.mutations,e.mutations,((t,i)=>mf(t,i)))&&Ti(this.baseMutations,e.baseMutations,((t,i)=>mf(t,i)))}}class eu{constructor(e,t,i,r){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=r}static from(e,t,i){ee(e.mutations.length===i.length,58842,{Ve:e.mutations.length,me:i.length});let r=(function(){return gS})();const s=e.mutations;for(let o=0;o<s.length;o++)r=r.insert(s[o].key,i[o].version);return new eu(e,t,i,r)}}/**
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
 */class PS{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class kS{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var ye,X;function NS(n){switch(n){case b.OK:return U(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return U(15467,{code:n})}}function nm(n){if(n===void 0)return Mt("GRPC error has no .code"),b.UNKNOWN;switch(n){case ye.OK:return b.OK;case ye.CANCELLED:return b.CANCELLED;case ye.UNKNOWN:return b.UNKNOWN;case ye.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case ye.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case ye.INTERNAL:return b.INTERNAL;case ye.UNAVAILABLE:return b.UNAVAILABLE;case ye.UNAUTHENTICATED:return b.UNAUTHENTICATED;case ye.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case ye.NOT_FOUND:return b.NOT_FOUND;case ye.ALREADY_EXISTS:return b.ALREADY_EXISTS;case ye.PERMISSION_DENIED:return b.PERMISSION_DENIED;case ye.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case ye.ABORTED:return b.ABORTED;case ye.OUT_OF_RANGE:return b.OUT_OF_RANGE;case ye.UNIMPLEMENTED:return b.UNIMPLEMENTED;case ye.DATA_LOSS:return b.DATA_LOSS;default:return U(39323,{code:n})}}(X=ye||(ye={}))[X.OK=0]="OK",X[X.CANCELLED=1]="CANCELLED",X[X.UNKNOWN=2]="UNKNOWN",X[X.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",X[X.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",X[X.NOT_FOUND=5]="NOT_FOUND",X[X.ALREADY_EXISTS=6]="ALREADY_EXISTS",X[X.PERMISSION_DENIED=7]="PERMISSION_DENIED",X[X.UNAUTHENTICATED=16]="UNAUTHENTICATED",X[X.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",X[X.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",X[X.ABORTED=10]="ABORTED",X[X.OUT_OF_RANGE=11]="OUT_OF_RANGE",X[X.UNIMPLEMENTED=12]="UNIMPLEMENTED",X[X.INTERNAL=13]="INTERNAL",X[X.UNAVAILABLE=14]="UNAVAILABLE",X[X.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const DS=new on([4294967295,4294967295],0);function Ef(n){const e=Ag().encode(n),t=new gg;return t.update(e),new Uint8Array(t.digest())}function Tf(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),r=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new on([t,i],0),new on([r,s],0)]}class tu{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new dr(`Invalid padding: ${t}`);if(i<0)throw new dr(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new dr(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new dr(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=on.fromNumber(this.fe)}pe(e,t,i){let r=e.add(t.multiply(on.fromNumber(i)));return r.compare(DS)===1&&(r=new on([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Ef(e),[i,r]=Tf(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(i,r,s);if(!this.ye(o))return!1}return!0}static create(e,t,i){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new tu(s,r,t);return i.forEach((l=>o.insert(l))),o}insert(e){if(this.fe===0)return;const t=Ef(e),[i,r]=Tf(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(i,r,s);this.we(o)}}we(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class dr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class ca{constructor(e,t,i,r,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const r=new Map;return r.set(e,rs.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new ca(q.min(),r,new de(G),Lt(),Y())}}class rs{constructor(e,t,i,r,s){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new rs(i,t,Y(),Y(),Y())}}/**
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
 */class zs{constructor(e,t,i,r){this.Se=e,this.removedTargetIds=t,this.key=i,this.be=r}}class im{constructor(e,t){this.targetId=e,this.De=t}}class rm{constructor(e,t,i=Ne.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=r}}class If{constructor(){this.ve=0,this.Ce=wf(),this.Fe=Ne.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Y(),t=Y(),i=Y();return this.Ce.forEach(((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:i=i.add(r);break;default:U(38017,{changeType:s})}})),new rs(this.Fe,this.Me,e,t,i)}ke(){this.xe=!1,this.Ce=wf()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,ee(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class OS{constructor(e){this.We=e,this.Ge=new Map,this.ze=Lt(),this.je=Vs(),this.Je=Vs(),this.He=new de(G)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const i=this.tt(t);switch(e.state){case 0:this.nt(t)&&i.Be(e.resumeToken);break;case 1:i.Ue(),i.Oe||i.ke(),i.Be(e.resumeToken);break;case 2:i.Ue(),i.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Ke(),i.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Be(e.resumeToken));break;default:U(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((i,r)=>{this.nt(r)&&t(r)}))}it(e){const t=e.targetId,i=e.De.count,r=this.st(t);if(r){const s=r.target;if(xl(s))if(i===0){const o=new M(s.path);this.Xe(t,o,Fe.newNoDocument(o,q.min()))}else ee(i===1,20013,{expectedCount:i});else{const o=this.ot(t);if(o!==i){const l=this._t(e),c=l?this.ut(l,e,o):1;if(c!==0){this.rt(t);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,u)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:r=0},hashCount:s=0}=t;let o,l;try{o=mn(i).toUint8Array()}catch(c){if(c instanceof Pg)return pn("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new tu(o,r,s)}catch(c){return pn(c instanceof dr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.fe===0?null:l}ut(e,t,i){return t.De.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.We.getRemoteKeysForTarget(t);let r=0;return i.forEach((s=>{const o=this.We.lt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Xe(t,s,null),r++)})),r}Pt(e){const t=new Map;this.Ge.forEach(((s,o)=>{const l=this.st(o);if(l){if(s.current&&xl(l.target)){const c=new M(l.target.path);this.Tt(c).has(o)||this.It(o,c)||this.Xe(o,c,Fe.newNoDocument(c,e))}s.Ne&&(t.set(o,s.Le()),s.ke())}}));let i=Y();this.Je.forEach(((s,o)=>{let l=!0;o.forEachWhile((c=>{const u=this.st(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(i=i.add(s))})),this.ze.forEach(((s,o)=>o.setReadTime(e)));const r=new ca(e,t,this.He,this.ze,i);return this.ze=Lt(),this.je=Vs(),this.Je=Vs(),this.He=new de(G),r}Ze(e,t){if(!this.nt(e))return;const i=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,i),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,i){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),i&&(this.ze=this.ze.insert(t,i))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new If,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new we(G),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new we(G),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||x("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new If),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Vs(){return new de(M.comparator)}function wf(){return new de(M.comparator)}const VS={asc:"ASCENDING",desc:"DESCENDING"},xS={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},MS={and:"AND",or:"OR"};class LS{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ll(n,e){return n.useProto3Json||na(e)?e:{value:e}}function bo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function sm(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function FS(n,e){return bo(n,e.toTimestamp())}function mt(n){return ee(!!n,49232),q.fromTimestamp((function(t){const i=gn(t);return new ce(i.seconds,i.nanos)})(n))}function nu(n,e){return Fl(n,e).canonicalString()}function Fl(n,e){const t=(function(r){return new oe(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function om(n){const e=oe.fromString(n);return ee(hm(e),10190,{key:e.toString()}),e}function Ul(n,e){return nu(n.databaseId,e.path)}function tl(n,e){const t=om(e);if(t.get(1)!==n.databaseId.projectId)throw new V(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new M(lm(t))}function am(n,e){return nu(n.databaseId,e)}function US(n){const e=om(n);return e.length===4?oe.emptyPath():lm(e)}function Bl(n){return new oe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function lm(n){return ee(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Af(n,e,t){return{name:Ul(n,e),fields:t.value.mapValue.fields}}function BS(n,e){let t;if("targetChange"in e){e.targetChange;const i=(function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:U(39313,{state:u})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],s=(function(u,f){return u.useProto3Json?(ee(f===void 0||typeof f=="string",58123),Ne.fromBase64String(f||"")):(ee(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),Ne.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&(function(u){const f=u.code===void 0?b.UNKNOWN:nm(u.code);return new V(f,u.message||"")})(o);t=new rm(i,r,s,l||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const r=tl(n,i.document.name),s=mt(i.document.updateTime),o=i.document.createTime?mt(i.document.createTime):q.min(),l=new Xe({mapValue:{fields:i.document.fields}}),c=Fe.newFoundDocument(r,s,o,l),u=i.targetIds||[],f=i.removedTargetIds||[];t=new zs(u,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const r=tl(n,i.document),s=i.readTime?mt(i.readTime):q.min(),o=Fe.newNoDocument(r,s),l=i.removedTargetIds||[];t=new zs([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const r=tl(n,i.document),s=i.removedTargetIds||[];t=new zs([],s,r,null)}else{if(!("filter"in e))return U(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:r=0,unchangedNames:s}=i,o=new kS(r,s),l=i.targetId;t=new im(l,o)}}return t}function qS(n,e){let t;if(e instanceof is)t={update:Af(n,e.key,e.value)};else if(e instanceof Zc)t={delete:Ul(n,e.key)};else if(e instanceof Qn)t={update:Af(n,e.key,e.data),updateMask:YS(e.fieldMask)};else{if(!(e instanceof SS))return U(16599,{Rt:e.type});t={verify:Ul(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(s,o){const l=o.transform;if(l instanceof Ro)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Wr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof jr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof So)return{fieldPath:o.field.canonicalString(),increment:l.Ee};throw U(20930,{transform:o.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(r,s){return s.updateTime!==void 0?{updateTime:FS(r,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:U(27497)})(n,e.precondition)),t}function WS(n,e){return n&&n.length>0?(ee(e!==void 0,14353),n.map((t=>(function(r,s){let o=r.updateTime?mt(r.updateTime):mt(s);return o.isEqual(q.min())&&(o=mt(s)),new AS(o,r.transformResults||[])})(t,e)))):[]}function jS(n,e){return{documents:[am(n,e.path)]}}function $S(n,e){const t={structuredQuery:{}},i=e.path;let r;e.collectionGroup!==null?(r=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=am(n,r);const s=(function(u){if(u.length!==0)return um(ut.create(u,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const o=(function(u){if(u.length!==0)return u.map((f=>(function(g){return{field:ri(g.field),direction:GS(g.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=Ll(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(u){return{before:u.inclusive,values:u.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(u){return{before:!u.inclusive,values:u.position}})(e.endAt)),{Vt:t,parent:r}}function HS(n){let e=US(n.parent);const t=n.structuredQuery,i=t.from?t.from.length:0;let r=null;if(i>0){ee(i===1,65062);const f=t.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=(function(p){const g=cm(p);return g instanceof ut&&Ug(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((g=>(function(S){return new qr(si(S.field),(function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(S.direction))})(g)))})(t.orderBy));let l=null;t.limit&&(l=(function(p){let g;return g=typeof p=="object"?p.value:p,na(g)?null:g})(t.limit));let c=null;t.startAt&&(c=(function(p){const g=!!p.before,w=p.values||[];return new Ao(w,g)})(t.startAt));let u=null;return t.endAt&&(u=(function(p){const g=!p.before,w=p.values||[];return new Ao(w,g)})(t.endAt)),hS(e,r,o,s,l,"F",c,u)}function zS(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return U(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function cm(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=si(t.unaryFilter.field);return ve.create(i,"==",{doubleValue:NaN});case"IS_NULL":const r=si(t.unaryFilter.field);return ve.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=si(t.unaryFilter.field);return ve.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=si(t.unaryFilter.field);return ve.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return U(61313);default:return U(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ve.create(si(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return U(58110);default:return U(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return ut.create(t.compositeFilter.filters.map((i=>cm(i))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return U(1026)}})(t.compositeFilter.op))})(n):U(30097,{filter:n})}function GS(n){return VS[n]}function KS(n){return xS[n]}function QS(n){return MS[n]}function ri(n){return{fieldPath:n.canonicalString()}}function si(n){return ke.fromServerFormat(n.fieldPath)}function um(n){return n instanceof ve?(function(t){if(t.op==="=="){if(hf(t.value))return{unaryFilter:{field:ri(t.field),op:"IS_NAN"}};if(uf(t.value))return{unaryFilter:{field:ri(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(hf(t.value))return{unaryFilter:{field:ri(t.field),op:"IS_NOT_NAN"}};if(uf(t.value))return{unaryFilter:{field:ri(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ri(t.field),op:KS(t.op),value:t.value}}})(n):n instanceof ut?(function(t){const i=t.getFilters().map((r=>um(r)));return i.length===1?i[0]:{compositeFilter:{op:QS(t.op),filters:i}}})(n):U(54877,{filter:n})}function YS(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function hm(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class en{constructor(e,t,i,r,s=q.min(),o=q.min(),l=Ne.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new en(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new en(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new en(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new en(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class XS{constructor(e){this.gt=e}}function JS(n){const e=HS({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Co(e,e.limit,"L"):e}/**
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
 */class ZS{constructor(){this.Dn=new eb}addToCollectionParentIndex(e,t){return this.Dn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(_n.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(_n.min())}updateCollectionGroup(e,t,i){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class eb{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),r=this.index[t]||new we(oe.comparator),s=!r.has(i);return this.index[t]=r.add(i),s}has(e){const t=e.lastSegment(),i=e.popLast(),r=this.index[t];return r&&r.has(i)}getEntries(e){return(this.index[e]||new we(oe.comparator)).toArray()}}/**
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
 */const Cf={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},dm=41943040;class $e{static withCacheSize(e){return new $e(e,$e.DEFAULT_COLLECTION_PERCENTILE,$e.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
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
 */$e.DEFAULT_COLLECTION_PERCENTILE=10,$e.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,$e.DEFAULT=new $e(dm,$e.DEFAULT_COLLECTION_PERCENTILE,$e.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),$e.DISABLED=new $e(-1,0,0);/**
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
 */class Ai{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Ai(0)}static ur(){return new Ai(-1)}}/**
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
 */const Rf="LruGarbageCollector",tb=1048576;function Sf([n,e],[t,i]){const r=G(n,t);return r===0?G(e,i):r}class nb{constructor(e){this.Tr=e,this.buffer=new we(Sf),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();Sf(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class ib{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){x(Rf,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Li(t)?x(Rf,"Ignoring IndexedDB error during garbage collection: ",t):await Mi(t)}await this.Rr(3e5)}))}}class rb{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return P.resolve(ta.ue);const i=new nb(t);return this.Vr.forEachTarget(e,(r=>i.Er(r.sequenceNumber))).next((()=>this.Vr.gr(e,(r=>i.Er(r))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Vr.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(x("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(Cf)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(x("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Cf):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let i,r,s,o,l,c,u;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(x("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),r=this.params.maximumSequenceNumbersToCollect):r=p,o=Date.now(),this.nthSequenceNumber(e,r)))).next((p=>(i=p,l=Date.now(),this.removeTargets(e,i,t)))).next((p=>(s=p,c=Date.now(),this.removeOrphanedDocuments(e,i)))).next((p=>(u=Date.now(),ni()<=Q.DEBUG&&x("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${r} in `+(l-o)+`ms
	Removed ${s} targets in `+(c-l)+`ms
	Removed ${p} documents in `+(u-c)+`ms
Total Duration: ${u-f}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:s,documentsRemoved:p}))))}}function sb(n,e){return new rb(n,e)}/**
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
 */class ob{constructor(){this.changes=new Kn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Fe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?P.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class ab{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class lb{constructor(e,t,i,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=r}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(i=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(i!==null&&Ar(i.mutation,r,st.empty(),ce.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,Y()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=Y()){const r=Nn();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,i).next((s=>{let o=hr();return s.forEach(((l,c)=>{o=o.insert(l,c.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const i=Nn();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,Y())))}populateOverlays(e,t,i){const r=[];return i.forEach((s=>{t.has(s)||r.push(s)})),this.documentOverlayCache.getOverlays(e,r).next((s=>{s.forEach(((o,l)=>{t.set(o,l)}))}))}computeViews(e,t,i,r){let s=Lt();const o=wr(),l=(function(){return wr()})();return t.forEach(((c,u)=>{const f=i.get(u.key);r.has(u.key)&&(f===void 0||f.mutation instanceof Qn)?s=s.insert(u.key,u):f!==void 0?(o.set(u.key,f.mutation.getFieldMask()),Ar(f.mutation,u,f.mutation.getFieldMask(),ce.now())):o.set(u.key,st.empty())})),this.recalculateAndSaveOverlays(e,s).next((c=>(c.forEach(((u,f)=>o.set(u,f))),t.forEach(((u,f)=>{var p;return l.set(u,new ab(f,(p=o.get(u))!==null&&p!==void 0?p:null))})),l)))}recalculateAndSaveOverlays(e,t){const i=wr();let r=new de(((o,l)=>o-l)),s=Y();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const l of o)l.keys().forEach((c=>{const u=t.get(c);if(u===null)return;let f=i.get(c)||st.empty();f=l.applyToLocalView(u,f),i.set(c,f);const p=(r.get(l.batchId)||Y()).add(c);r=r.insert(l.batchId,p)}))})).next((()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),u=c.key,f=c.value,p=Kg();f.forEach((g=>{if(!s.has(g)){const w=em(t.get(g),i.get(g));w!==null&&p.set(g,w),s=s.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,u,p))}return P.waitFor(o)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,r){return(function(o){return M.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):jg(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,r):this.getDocumentsMatchingCollectionQuery(e,t,i,r)}getNextDocuments(e,t,i,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,r).next((s=>{const o=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,r-s.size):P.resolve(Nn());let l=Lr,c=s;return o.next((u=>P.forEach(u,((f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),s.get(f)?P.resolve():this.remoteDocumentCache.getEntry(e,f).next((g=>{c=c.insert(f,g)}))))).next((()=>this.populateOverlays(e,u,s))).next((()=>this.computeViews(e,c,u,Y()))).next((f=>({batchId:l,changes:Gg(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next((i=>{let r=hr();return i.isFoundDocument()&&(r=r.insert(i.key,i)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,r){const s=t.collectionGroup;let o=hr();return this.indexManager.getCollectionParents(e,s).next((l=>P.forEach(l,(c=>{const u=(function(p,g){return new Fi(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,i,r).next((f=>{f.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,i,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,s,r)))).next((o=>{s.forEach(((c,u)=>{const f=u.getKey();o.get(f)===null&&(o=o.insert(f,Fe.newInvalidDocument(f)))}));let l=hr();return o.forEach(((c,u)=>{const f=s.get(c);f!==void 0&&Ar(f.mutation,u,st.empty(),ce.now()),oa(t,u)&&(l=l.insert(c,u))})),l}))}}/**
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
 */class cb{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return P.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:mt(r.createTime)}})(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(r){return{name:r.name,query:JS(r.bundledQuery),readTime:mt(r.readTime)}})(t)),P.resolve()}}/**
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
 */class ub{constructor(){this.overlays=new de(M.comparator),this.kr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const i=Nn();return P.forEach(t,(r=>this.getOverlay(e,r).next((s=>{s!==null&&i.set(r,s)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((r,s)=>{this.wt(e,t,s)})),P.resolve()}removeOverlaysForBatchId(e,t,i){const r=this.kr.get(i);return r!==void 0&&(r.forEach((s=>this.overlays=this.overlays.remove(s))),this.kr.delete(i)),P.resolve()}getOverlaysForCollection(e,t,i){const r=Nn(),s=t.length+1,o=new M(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,u=c.getKey();if(!t.isPrefixOf(u.path))break;u.path.length===s&&c.largestBatchId>i&&r.set(c.getKey(),c)}return P.resolve(r)}getOverlaysForCollectionGroup(e,t,i,r){let s=new de(((u,f)=>u-f));const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===t&&u.largestBatchId>i){let f=s.get(u.largestBatchId);f===null&&(f=Nn(),s=s.insert(u.largestBatchId,f)),f.set(u.getKey(),u)}}const l=Nn(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((u,f)=>l.set(u,f))),!(l.size()>=r)););return P.resolve(l)}wt(e,t,i){const r=this.overlays.get(i.key);if(r!==null){const o=this.kr.get(r.largestBatchId).delete(i.key);this.kr.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new PS(t,i));let s=this.kr.get(t);s===void 0&&(s=Y(),this.kr.set(t,s)),this.kr.set(t,s.add(i.key))}}/**
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
 */class hb{constructor(){this.sessionToken=Ne.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
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
 */class iu{constructor(){this.qr=new we(Ce.Qr),this.$r=new we(Ce.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const i=new Ce(e,t);this.qr=this.qr.add(i),this.$r=this.$r.add(i)}Kr(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.Wr(new Ce(e,t))}Gr(e,t){e.forEach((i=>this.removeReference(i,t)))}zr(e){const t=new M(new oe([])),i=new Ce(t,e),r=new Ce(t,e+1),s=[];return this.$r.forEachInRange([i,r],(o=>{this.Wr(o),s.push(o.key)})),s}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new M(new oe([])),i=new Ce(t,e),r=new Ce(t,e+1);let s=Y();return this.$r.forEachInRange([i,r],(o=>{s=s.add(o.key)})),s}containsKey(e){const t=new Ce(e,0),i=this.qr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class Ce{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return M.comparator(e.key,t.key)||G(e.Hr,t.Hr)}static Ur(e,t){return G(e.Hr,t.Hr)||M.comparator(e.key,t.key)}}/**
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
 */class db{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new we(Ce.Qr)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,r){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new bS(s,t,i,r);this.mutationQueue.push(o);for(const l of r)this.Yr=this.Yr.add(new Ce(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return P.resolve(o)}lookupMutationBatch(e,t){return P.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,r=this.Xr(i),s=r<0?0:r;return P.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?Gc:this.er-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new Ce(t,0),r=new Ce(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([i,r],(o=>{const l=this.Zr(o.Hr);s.push(l)})),P.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new we(G);return t.forEach((r=>{const s=new Ce(r,0),o=new Ce(r,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],(l=>{i=i.add(l.Hr)}))})),P.resolve(this.ei(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,r=i.length+1;let s=i;M.isDocumentKey(s)||(s=s.child(""));const o=new Ce(new M(s),0);let l=new we(G);return this.Yr.forEachWhile((c=>{const u=c.key.path;return!!i.isPrefixOf(u)&&(u.length===r&&(l=l.add(c.Hr)),!0)}),o),P.resolve(this.ei(l))}ei(e){const t=[];return e.forEach((i=>{const r=this.Zr(i);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){ee(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Yr;return P.forEach(t.mutations,(r=>{const s=new Ce(r.key,t.batchId);return i=i.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Yr=i}))}rr(e){}containsKey(e,t){const i=new Ce(t,0),r=this.Yr.firstAfterOrEqual(i);return P.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class fb{constructor(e){this.ni=e,this.docs=(function(){return new de(M.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,r=this.docs.get(i),s=r?r.size:0,o=this.ni(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return P.resolve(i?i.document.mutableCopy():Fe.newInvalidDocument(t))}getEntries(e,t){let i=Lt();return t.forEach((r=>{const s=this.docs.get(r);i=i.insert(r,s?s.document.mutableCopy():Fe.newInvalidDocument(r))})),P.resolve(i)}getDocumentsMatchingQuery(e,t,i,r){let s=Lt();const o=t.path,l=new M(o.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:u,value:{document:f}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||jR(WR(f),i)<=0||(r.has(f.key)||oa(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return P.resolve(s)}getAllFromCollectionGroup(e,t,i,r){U(9500)}ri(e,t){return P.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new pb(this)}getSize(e){return P.resolve(this.size)}}class pb extends ob{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((i,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(i)})),P.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
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
 */class _b{constructor(e){this.persistence=e,this.ii=new Kn((t=>Yc(t)),Xc),this.lastRemoteSnapshotVersion=q.min(),this.highestTargetId=0,this.si=0,this.oi=new iu,this.targetCount=0,this._i=Ai.ar()}forEachTarget(e,t){return this.ii.forEach(((i,r)=>t(r))),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.si&&(this.si=t),P.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Ai(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.hr(t),P.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,i){let r=0;const s=[];return this.ii.forEach(((o,l)=>{l.sequenceNumber<=t&&i.get(l.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)})),P.waitFor(s).next((()=>r))}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const i=this.ii.get(t)||null;return P.resolve(i)}addMatchingKeys(e,t,i){return this.oi.Kr(t,i),P.resolve()}removeMatchingKeys(e,t,i){this.oi.Gr(t,i);const r=this.persistence.referenceDelegate,s=[];return r&&t.forEach((o=>{s.push(r.markPotentiallyOrphaned(e,o))})),P.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const i=this.oi.Jr(t);return P.resolve(i)}containsKey(e,t){return P.resolve(this.oi.containsKey(t))}}/**
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
 */class fm{constructor(e,t){this.ai={},this.overlays={},this.ui=new ta(0),this.ci=!1,this.ci=!0,this.li=new hb,this.referenceDelegate=e(this),this.hi=new _b(this),this.indexManager=new ZS,this.remoteDocumentCache=(function(r){return new fb(r)})((i=>this.referenceDelegate.Pi(i))),this.serializer=new XS(t),this.Ti=new cb(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ub,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.ai[e.toKey()];return i||(i=new db(t,this.referenceDelegate),this.ai[e.toKey()]=i),i}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,i){x("MemoryPersistence","Starting transaction:",e);const r=new gb(this.ui.next());return this.referenceDelegate.Ii(),i(r).next((s=>this.referenceDelegate.di(r).next((()=>s)))).toPromise().then((s=>(r.raiseOnCommittedEvent(),s)))}Ei(e,t){return P.or(Object.values(this.ai).map((i=>()=>i.containsKey(e,t))))}}class gb extends HR{constructor(e){super(),this.currentSequenceNumber=e}}class ru{constructor(e){this.persistence=e,this.Ai=new iu,this.Ri=null}static Vi(e){return new ru(e)}get mi(){if(this.Ri)return this.Ri;throw U(60996)}addReference(e,t,i){return this.Ai.addReference(i,t),this.mi.delete(i.toString()),P.resolve()}removeReference(e,t,i){return this.Ai.removeReference(i,t),this.mi.add(i.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((r=>this.mi.add(r.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((s=>this.mi.add(s.toString())))})).next((()=>i.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.mi,(i=>{const r=M.fromPath(i);return this.fi(e,r).next((s=>{s||t.removeEntry(r,q.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((i=>{i?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return P.or([()=>P.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Po{constructor(e,t){this.persistence=e,this.gi=new Kn((i=>KR(i.path)),((i,r)=>i.isEqual(r))),this.garbageCollector=sb(this,t)}static Vi(e,t){return new Po(e,t)}Ii(){}di(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((r=>i+r))))}yr(e){let t=0;return this.gr(e,(i=>{t++})).next((()=>t))}gr(e,t){return P.forEach(this.gi,((i,r)=>this.Sr(e,i,r).next((s=>s?P.resolve():t(r)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const r=this.persistence.getRemoteDocumentCache(),s=r.newChangeBuffer();return r.ri(e,(o=>this.Sr(e,o,t).next((l=>{l||(i++,s.removeEntry(o,q.min()))})))).next((()=>s.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),P.resolve()}removeReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=js(e.data.value)),t}Sr(e,t,i){return P.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.gi.get(t);return P.resolve(r!==void 0&&r>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class su{constructor(e,t,i,r){this.targetId=e,this.fromCache=t,this.Is=i,this.ds=r}static Es(e,t){let i=Y(),r=Y();for(const s of t.docChanges)switch(s.type){case 0:i=i.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new su(e,t.fromCache,i,r)}}/**
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
 */class mb{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class yb{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return jy()?8:zR(Be())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,i,r){const s={result:null};return this.ps(e,t).next((o=>{s.result=o})).next((()=>{if(!s.result)return this.ys(e,t,r,i).next((o=>{s.result=o}))})).next((()=>{if(s.result)return;const o=new mb;return this.ws(e,t,o).next((l=>{if(s.result=l,this.Rs)return this.Ss(e,t,o,l.size)}))})).next((()=>s.result))}Ss(e,t,i,r){return i.documentReadCount<this.Vs?(ni()<=Q.DEBUG&&x("QueryEngine","SDK will not create cache indexes for query:",ii(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),P.resolve()):(ni()<=Q.DEBUG&&x("QueryEngine","Query:",ii(t),"scans",i.documentReadCount,"local documents and returns",r,"documents as results."),i.documentReadCount>this.fs*r?(ni()<=Q.DEBUG&&x("QueryEngine","The SDK decides to create cache indexes for query:",ii(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,_t(t))):P.resolve())}ps(e,t){if(_f(t))return P.resolve(null);let i=_t(t);return this.indexManager.getIndexType(e,i).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=Co(t,null,"F"),i=_t(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((s=>{const o=Y(...s);return this.gs.getDocuments(e,o).next((l=>this.indexManager.getMinOffset(e,i).next((c=>{const u=this.bs(t,l);return this.Ds(t,u,o,c.readTime)?this.ps(e,Co(t,null,"F")):this.vs(e,u,t,c)}))))})))))}ys(e,t,i,r){return _f(t)||r.isEqual(q.min())?P.resolve(null):this.gs.getDocuments(e,i).next((s=>{const o=this.bs(t,s);return this.Ds(t,o,i,r)?P.resolve(null):(ni()<=Q.DEBUG&&x("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),ii(t)),this.vs(e,o,t,qR(r,Lr)).next((l=>l)))}))}bs(e,t){let i=new we(Hg(e));return t.forEach(((r,s)=>{oa(e,s)&&(i=i.add(s))})),i}Ds(e,t,i,r){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}ws(e,t,i){return ni()<=Q.DEBUG&&x("QueryEngine","Using full collection scan to execute query:",ii(t)),this.gs.getDocumentsMatchingQuery(e,t,_n.min(),i)}vs(e,t,i,r){return this.gs.getDocumentsMatchingQuery(e,i,r).next((s=>(t.forEach((o=>{s=s.insert(o.key,o)})),s)))}}/**
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
 */const ou="LocalStore",vb=3e8;class Eb{constructor(e,t,i,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new de(G),this.Ms=new Kn((s=>Yc(s)),Xc),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(i)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new lb(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function Tb(n,e,t,i){return new Eb(n,e,t,i)}async function pm(n,e){const t=W(n);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let r;return t.mutationQueue.getAllMutationBatches(i).next((s=>(r=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(i)))).next((s=>{const o=[],l=[];let c=Y();for(const u of r){o.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}for(const u of s){l.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(i,c).next((u=>({Bs:u,removedBatchIds:o,addedBatchIds:l})))}))}))}function Ib(n,e){const t=W(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const r=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return(function(l,c,u,f){const p=u.batch,g=p.keys();let w=P.resolve();return g.forEach((S=>{w=w.next((()=>f.getEntry(c,S))).next((N=>{const k=u.docVersions.get(S);ee(k!==null,48541),N.version.compareTo(k)<0&&(p.applyToRemoteDocument(N,u),N.isValidDocument()&&(N.setReadTime(u.commitVersion),f.addEntry(N)))}))})),w.next((()=>l.mutationQueue.removeMutationBatch(c,p)))})(t,i,e,s).next((()=>s.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(l){let c=Y();for(let u=0;u<l.mutationResults.length;++u)l.mutationResults[u].transformResults.length>0&&(c=c.add(l.batch.mutations[u].key));return c})(e)))).next((()=>t.localDocuments.getDocuments(i,r)))}))}function _m(n){const e=W(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function wb(n,e){const t=W(n),i=e.snapshotVersion;let r=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const o=t.Os.newChangeBuffer({trackRemovals:!0});r=t.Fs;const l=[];e.targetChanges.forEach(((f,p)=>{const g=r.get(p);if(!g)return;l.push(t.hi.removeMatchingKeys(s,f.removedDocuments,p).next((()=>t.hi.addMatchingKeys(s,f.addedDocuments,p))));let w=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?w=w.withResumeToken(Ne.EMPTY_BYTE_STRING,q.min()).withLastLimboFreeSnapshotVersion(q.min()):f.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(f.resumeToken,i)),r=r.insert(p,w),(function(N,k,j){return N.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=vb?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0})(g,w,f)&&l.push(t.hi.updateTargetData(s,w))}));let c=Lt(),u=Y();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))})),l.push(Ab(s,o,e.documentUpdates).next((f=>{c=f.Ls,u=f.ks}))),!i.isEqual(q.min())){const f=t.hi.getLastRemoteSnapshotVersion(s).next((p=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,i)));l.push(f)}return P.waitFor(l).next((()=>o.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,c,u))).next((()=>c))})).then((s=>(t.Fs=r,s)))}function Ab(n,e,t){let i=Y(),r=Y();return t.forEach((s=>i=i.add(s))),e.getEntries(n,i).next((s=>{let o=Lt();return t.forEach(((l,c)=>{const u=s.get(l);c.isFoundDocument()!==u.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(q.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):x(ou,"Ignoring outdated watch update for ",l,". Current version:",u.version," Watch version:",c.version)})),{Ls:o,ks:r}}))}function Cb(n,e){const t=W(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Gc),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function Rb(n,e){const t=W(n);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let r;return t.hi.getTargetData(i,e).next((s=>s?(r=s,P.resolve(r)):t.hi.allocateTargetId(i).next((o=>(r=new en(e,o,"TargetPurposeListen",i.currentSequenceNumber),t.hi.addTargetData(i,r).next((()=>r)))))))})).then((i=>{const r=t.Fs.get(i.targetId);return(r===null||i.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(i.targetId,i),t.Ms.set(e,i.targetId)),i}))}async function ql(n,e,t){const i=W(n),r=i.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",s,(o=>i.persistence.referenceDelegate.removeTarget(o,r)))}catch(o){if(!Li(o))throw o;x(ou,`Failed to update sequence numbers for target ${e}: ${o}`)}i.Fs=i.Fs.remove(e),i.Ms.delete(r.target)}function bf(n,e,t){const i=W(n);let r=q.min(),s=Y();return i.persistence.runTransaction("Execute query","readwrite",(o=>(function(c,u,f){const p=W(c),g=p.Ms.get(f);return g!==void 0?P.resolve(p.Fs.get(g)):p.hi.getTargetData(u,f)})(i,o,_t(e)).next((l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,i.hi.getMatchingKeysForTargetId(o,l.targetId).next((c=>{s=c}))})).next((()=>i.Cs.getDocumentsMatchingQuery(o,e,t?r:q.min(),t?s:Y()))).next((l=>(Sb(i,fS(e),l),{documents:l,qs:s})))))}function Sb(n,e,t){let i=n.xs.get(e)||q.min();t.forEach(((r,s)=>{s.readTime.compareTo(i)>0&&(i=s.readTime)})),n.xs.set(e,i)}class Pf{constructor(){this.activeTargetIds=vS()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class bb{constructor(){this.Fo=new Pf,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,i){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Pf,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Pb{xo(e){}shutdown(){}}/**
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
 */const kf="ConnectivityMonitor";class Nf{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){x(kf,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){x(kf,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let xs=null;function Wl(){return xs===null?xs=(function(){return 268435456+Math.round(2147483648*Math.random())})():xs++,"0x"+xs.toString(16)}/**
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
 */const nl="RestConnection",kb={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Nb{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${i}/databases/${r}`,this.Ko=this.databaseId.database===Io?`project_id=${i}`:`project_id=${i}&database_id=${r}`}Wo(e,t,i,r,s){const o=Wl(),l=this.Go(e,t.toUriEncodedString());x(nl,`Sending RPC '${e}' ${o}:`,l,i);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(c,r,s);const{host:u}=new URL(l),f=Tn(u);return this.jo(e,l,c,i,f).then((p=>(x(nl,`Received RPC '${e}' ${o}: `,p),p)),(p=>{throw pn(nl,`RPC '${e}' ${o} failed with error: `,p,"url: ",l,"request:",i),p}))}Jo(e,t,i,r,s,o){return this.Wo(e,t,i,r,s)}zo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+xi})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,s)=>e[s]=r)),i&&i.headers.forEach(((r,s)=>e[s]=r))}Go(e,t){const i=kb[e];return`${this.$o}/v1/${t}:${i}`}terminate(){}}/**
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
 */class Db{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
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
 */const Me="WebChannelConnection";class Ob extends Nb{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,i,r,s){const o=Wl();return new Promise(((l,c)=>{const u=new mg;u.setWithCredentials(!0),u.listenOnce(yg.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case Ws.NO_ERROR:const p=u.getResponseJson();x(Me,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),l(p);break;case Ws.TIMEOUT:x(Me,`RPC '${e}' ${o} timed out`),c(new V(b.DEADLINE_EXCEEDED,"Request time out"));break;case Ws.HTTP_ERROR:const g=u.getStatus();if(x(Me,`RPC '${e}' ${o} failed with status:`,g,"response text:",u.getResponseText()),g>0){let w=u.getResponseJson();Array.isArray(w)&&(w=w[0]);const S=w==null?void 0:w.error;if(S&&S.status&&S.message){const N=(function(j){const B=j.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(B)>=0?B:b.UNKNOWN})(S.status);c(new V(N,S.message))}else c(new V(b.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new V(b.UNAVAILABLE,"Connection failed."));break;default:U(9055,{c_:e,streamId:o,l_:u.getLastErrorCode(),h_:u.getLastError()})}}finally{x(Me,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(r);x(Me,`RPC '${e}' ${o} sending request:`,r),u.send(t,"POST",f,i,15)}))}P_(e,t,i){const r=Wl(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Tg(),l=Eg(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.zo(c.initMessageHeaders,t,i),c.encodeInitMessageHeaders=!0;const f=s.join("");x(Me,`Creating RPC '${e}' stream ${r}: ${f}`,c);const p=o.createWebChannel(f,c);this.T_(p);let g=!1,w=!1;const S=new Db({Ho:k=>{w?x(Me,`Not sending because RPC '${e}' stream ${r} is closed:`,k):(g||(x(Me,`Opening RPC '${e}' stream ${r} transport.`),p.open(),g=!0),x(Me,`RPC '${e}' stream ${r} sending:`,k),p.send(k))},Yo:()=>p.close()}),N=(k,j,B)=>{k.listen(j,($=>{try{B($)}catch(ae){setTimeout((()=>{throw ae}),0)}}))};return N(p,ur.EventType.OPEN,(()=>{w||(x(Me,`RPC '${e}' stream ${r} transport opened.`),S.s_())})),N(p,ur.EventType.CLOSE,(()=>{w||(w=!0,x(Me,`RPC '${e}' stream ${r} transport closed`),S.__(),this.I_(p))})),N(p,ur.EventType.ERROR,(k=>{w||(w=!0,pn(Me,`RPC '${e}' stream ${r} transport errored. Name:`,k.name,"Message:",k.message),S.__(new V(b.UNAVAILABLE,"The operation could not be completed")))})),N(p,ur.EventType.MESSAGE,(k=>{var j;if(!w){const B=k.data[0];ee(!!B,16349);const $=B,ae=($==null?void 0:$.error)||((j=$[0])===null||j===void 0?void 0:j.error);if(ae){x(Me,`RPC '${e}' stream ${r} received error:`,ae);const Ye=ae.status;let _e=(function(v){const E=ye[v];if(E!==void 0)return nm(E)})(Ye),T=ae.message;_e===void 0&&(_e=b.INTERNAL,T="Unknown error status: "+Ye+" with message "+ae.message),w=!0,S.__(new V(_e,T)),p.close()}else x(Me,`RPC '${e}' stream ${r} received:`,B),S.a_(B)}})),N(l,vg.STAT_EVENT,(k=>{k.stat===kl.PROXY?x(Me,`RPC '${e}' stream ${r} detected buffering proxy`):k.stat===kl.NOPROXY&&x(Me,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{S.o_()}),0),S}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function il(){return typeof document<"u"?document:null}/**
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
 */function ua(n){return new LS(n,!0)}/**
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
 */class gm{constructor(e,t,i=1e3,r=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=i,this.E_=r,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),i=Math.max(0,Date.now()-this.m_),r=Math.max(0,t-i);r>0&&x("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,r,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */const Df="PersistentStream";class mm{constructor(e,t,i,r,s,o,l,c){this.Fi=e,this.w_=i,this.S_=r,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new gm(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(Mt(t.toString()),Mt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,r])=>{this.b_===t&&this.W_(i,r)}),(i=>{e((()=>{const r=new V(b.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(r)}))}))}W_(e,t){const i=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{i((()=>this.listener.Zo()))})),this.stream.e_((()=>{i((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((r=>{i((()=>this.G_(r)))})),this.stream.onMessage((r=>{i((()=>++this.C_==1?this.j_(r):this.onNext(r)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return x(Df,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(x(Df,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Vb extends mm{constructor(e,t,i,r,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,r,o),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=BS(this.serializer,e),i=(function(s){if(!("targetChange"in s))return q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?q.min():o.readTime?mt(o.readTime):q.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=Bl(this.serializer),t.addTarget=(function(s,o){let l;const c=o.target;if(l=xl(c)?{documents:jS(s,c)}:{query:$S(s,c).Vt},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=sm(s,o.resumeToken);const u=Ll(s,o.expectedCount);u!==null&&(l.expectedCount=u)}else if(o.snapshotVersion.compareTo(q.min())>0){l.readTime=bo(s,o.snapshotVersion.toTimestamp());const u=Ll(s,o.expectedCount);u!==null&&(l.expectedCount=u)}return l})(this.serializer,e);const i=zS(this.serializer,e);i&&(t.labels=i),this.k_(t)}Y_(e){const t={};t.database=Bl(this.serializer),t.removeTarget=e,this.k_(t)}}class xb extends mm{constructor(e,t,i,r,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,r,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return ee(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ee(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){ee(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=WS(e.writeResults,e.commitTime),i=mt(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=Bl(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>qS(this.serializer,i)))};this.k_(t)}}/**
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
 */class Mb{}class Lb extends Mb{constructor(e,t,i,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new V(b.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,i,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.Wo(e,Fl(t,i),r,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new V(b.UNKNOWN,s.toString())}))}Jo(e,t,i,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Jo(e,Fl(t,i),r,o,l,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(b.UNKNOWN,o.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class Fb{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Mt(t),this._a=!1):x("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const Wn="RemoteStore";class Ub{constructor(e,t,i,r,s){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo((o=>{i.enqueueAndForget((async()=>{Yn(this)&&(x(Wn,"Restarting streams for network reachability change."),await(async function(c){const u=W(c);u.Ia.add(4),await ss(u),u.Aa.set("Unknown"),u.Ia.delete(4),await ha(u)})(this))}))})),this.Aa=new Fb(i,r)}}async function ha(n){if(Yn(n))for(const e of n.da)await e(!0)}async function ss(n){for(const e of n.da)await e(!1)}function ym(n,e){const t=W(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),uu(t)?cu(t):Ui(t).x_()&&lu(t,e))}function au(n,e){const t=W(n),i=Ui(t);t.Ta.delete(e),i.x_()&&vm(t,e),t.Ta.size===0&&(i.x_()?i.B_():Yn(t)&&t.Aa.set("Unknown"))}function lu(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(q.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Ui(n).H_(e)}function vm(n,e){n.Ra.$e(e),Ui(n).Y_(e)}function cu(n){n.Ra=new OS({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Ui(n).start(),n.Aa.aa()}function uu(n){return Yn(n)&&!Ui(n).M_()&&n.Ta.size>0}function Yn(n){return W(n).Ia.size===0}function Em(n){n.Ra=void 0}async function Bb(n){n.Aa.set("Online")}async function qb(n){n.Ta.forEach(((e,t)=>{lu(n,e)}))}async function Wb(n,e){Em(n),uu(n)?(n.Aa.la(e),cu(n)):n.Aa.set("Unknown")}async function jb(n,e,t){if(n.Aa.set("Online"),e instanceof rm&&e.state===2&&e.cause)try{await(async function(r,s){const o=s.cause;for(const l of s.targetIds)r.Ta.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.Ta.delete(l),r.Ra.removeTarget(l))})(n,e)}catch(i){x(Wn,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await ko(n,i)}else if(e instanceof zs?n.Ra.Ye(e):e instanceof im?n.Ra.it(e):n.Ra.et(e),!t.isEqual(q.min()))try{const i=await _m(n.localStore);t.compareTo(i)>=0&&await(function(s,o){const l=s.Ra.Pt(o);return l.targetChanges.forEach(((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.Ta.get(u);f&&s.Ta.set(u,f.withResumeToken(c.resumeToken,o))}})),l.targetMismatches.forEach(((c,u)=>{const f=s.Ta.get(c);if(!f)return;s.Ta.set(c,f.withResumeToken(Ne.EMPTY_BYTE_STRING,f.snapshotVersion)),vm(s,c);const p=new en(f.target,c,u,f.sequenceNumber);lu(s,p)})),s.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(i){x(Wn,"Failed to raise snapshot:",i),await ko(n,i)}}async function ko(n,e,t){if(!Li(e))throw e;n.Ia.add(1),await ss(n),n.Aa.set("Offline"),t||(t=()=>_m(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{x(Wn,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await ha(n)}))}function Tm(n,e){return e().catch((t=>ko(n,t,e)))}async function da(n){const e=W(n),t=vn(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Gc;for(;$b(e);)try{const r=await Cb(e.localStore,i);if(r===null){e.Pa.length===0&&t.B_();break}i=r.batchId,Hb(e,r)}catch(r){await ko(e,r)}Im(e)&&wm(e)}function $b(n){return Yn(n)&&n.Pa.length<10}function Hb(n,e){n.Pa.push(e);const t=vn(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Im(n){return Yn(n)&&!vn(n).M_()&&n.Pa.length>0}function wm(n){vn(n).start()}async function zb(n){vn(n).na()}async function Gb(n){const e=vn(n);for(const t of n.Pa)e.X_(t.mutations)}async function Kb(n,e,t){const i=n.Pa.shift(),r=eu.from(i,e,t);await Tm(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await da(n)}async function Qb(n,e){e&&vn(n).Z_&&await(async function(i,r){if((function(o){return NS(o)&&o!==b.ABORTED})(r.code)){const s=i.Pa.shift();vn(i).N_(),await Tm(i,(()=>i.remoteSyncer.rejectFailedWrite(s.batchId,r))),await da(i)}})(n,e),Im(n)&&wm(n)}async function Of(n,e){const t=W(n);t.asyncQueue.verifyOperationInProgress(),x(Wn,"RemoteStore received new credentials");const i=Yn(t);t.Ia.add(3),await ss(t),i&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await ha(t)}async function Yb(n,e){const t=W(n);e?(t.Ia.delete(2),await ha(t)):e||(t.Ia.add(2),await ss(t),t.Aa.set("Unknown"))}function Ui(n){return n.Va||(n.Va=(function(t,i,r){const s=W(t);return s.ia(),new Vb(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)})(n.datastore,n.asyncQueue,{Zo:Bb.bind(null,n),e_:qb.bind(null,n),n_:Wb.bind(null,n),J_:jb.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),uu(n)?cu(n):n.Aa.set("Unknown")):(await n.Va.stop(),Em(n))}))),n.Va}function vn(n){return n.ma||(n.ma=(function(t,i,r){const s=W(t);return s.ia(),new xb(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:zb.bind(null,n),n_:Qb.bind(null,n),ea:Gb.bind(null,n),ta:Kb.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await da(n)):(await n.ma.stop(),n.Pa.length>0&&(x(Wn,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
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
 */class hu{constructor(e,t,i,r,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=r,this.removalCallback=s,this.deferred=new Nt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,r,s){const o=Date.now()+i,l=new hu(e,t,o,r,s);return l.start(i),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function du(n,e){if(Mt("AsyncQueue",`${e}: ${n}`),Li(n))return new V(b.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class fi{static emptySet(e){return new fi(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||M.comparator(t.key,i.key):(t,i)=>M.comparator(t.key,i.key),this.keyedMap=hr(),this.sortedSet=new de(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof fi)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,s=i.getNext().key;if(!r.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new fi;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
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
 */class Vf{constructor(){this.fa=new de(M.comparator)}track(e){const t=e.doc.key,i=this.fa.get(t);i?e.type!==0&&i.type===3?this.fa=this.fa.insert(t,e):e.type===3&&i.type!==1?this.fa=this.fa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.fa=this.fa.remove(t):e.type===1&&i.type===2?this.fa=this.fa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):U(63341,{At:e,ga:i}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Ci{constructor(e,t,i,r,s,o,l,c,u){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=r,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,t,i,r,s){const o=[];return t.forEach((l=>{o.push({type:0,doc:l})})),new Ci(e,t,fi.emptySet(t),o,i,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&sa(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==i[r].type||!t[r].doc.isEqual(i[r].doc))return!1;return!0}}/**
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
 */class Xb{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class Jb{constructor(){this.queries=xf(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,i){const r=W(t),s=r.queries;r.queries=xf(),s.forEach(((o,l)=>{for(const c of l.wa)c.onError(i)}))})(this,new V(b.ABORTED,"Firestore shutting down"))}}function xf(){return new Kn((n=>$g(n)),sa)}async function fu(n,e){const t=W(n);let i=3;const r=e.query;let s=t.queries.get(r);s?!s.Sa()&&e.ba()&&(i=2):(s=new Xb,i=e.ba()?0:1);try{switch(i){case 0:s.ya=await t.onListen(r,!0);break;case 1:s.ya=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(o){const l=du(o,`Initialization of query '${ii(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&_u(t)}async function pu(n,e){const t=W(n),i=e.query;let r=3;const s=t.queries.get(i);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?r=e.ba()?0:1:!s.Sa()&&e.ba()&&(r=2))}switch(r){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function Zb(n,e){const t=W(n);let i=!1;for(const r of e){const s=r.query,o=t.queries.get(s);if(o){for(const l of o.wa)l.Ca(r)&&(i=!0);o.ya=r}}i&&_u(t)}function eP(n,e,t){const i=W(n),r=i.queries.get(e);if(r)for(const s of r.wa)s.onError(t);i.queries.delete(e)}function _u(n){n.Da.forEach((e=>{e.next()}))}var jl,Mf;(Mf=jl||(jl={})).Fa="default",Mf.Cache="cache";class gu{constructor(e,t,i){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=i||{}}Ca(e){if(!this.options.includeMetadataChanges){const i=[];for(const r of e.docChanges)r.type!==3&&i.push(r);e=new Ci(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const i=t!=="Offline";return(!this.options.ka||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Ci.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==jl.Cache}}/**
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
 */class Am{constructor(e){this.key=e}}class Cm{constructor(e){this.key=e}}class tP{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Y(),this.mutatedKeys=Y(),this.Xa=Hg(e),this.eu=new fi(this.Xa)}get tu(){return this.Ha}nu(e,t){const i=t?t.ru:new Vf,r=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,o=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,u=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((f,p)=>{const g=r.get(f),w=oa(this.query,p)?p:null,S=!!g&&this.mutatedKeys.has(g.key),N=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let k=!1;g&&w?g.data.isEqual(w.data)?S!==N&&(i.track({type:3,doc:w}),k=!0):this.iu(g,w)||(i.track({type:2,doc:w}),k=!0,(c&&this.Xa(w,c)>0||u&&this.Xa(w,u)<0)&&(l=!0)):!g&&w?(i.track({type:0,doc:w}),k=!0):g&&!w&&(i.track({type:1,doc:g}),k=!0,(c||u)&&(l=!0)),k&&(w?(o=o.add(w),s=N?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),i.track({type:1,doc:f})}return{eu:o,ru:i,Ds:l,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,r){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort(((f,p)=>(function(w,S){const N=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return U(20277,{At:k})}};return N(w)-N(S)})(f.type,p.type)||this.Xa(f.doc,p.doc))),this.su(i),r=r!=null&&r;const l=t&&!r?this.ou():[],c=this.Za.size===0&&this.current&&!r?1:0,u=c!==this.Ya;return this.Ya=c,o.length!==0||u?{snapshot:new Ci(this.query,e.eu,s,o,e.mutatedKeys,c===0,u,!1,!!i&&i.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Vf,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Y(),this.eu.forEach((i=>{this.au(i.key)&&(this.Za=this.Za.add(i.key))}));const t=[];return e.forEach((i=>{this.Za.has(i)||t.push(new Cm(i))})),this.Za.forEach((i=>{e.has(i)||t.push(new Am(i))})),t}uu(e){this.Ha=e.qs,this.Za=Y();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Ci.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const mu="SyncEngine";class nP{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class iP{constructor(e){this.key=e,this.lu=!1}}class rP{constructor(e,t,i,r,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new Kn((l=>$g(l)),sa),this.Tu=new Map,this.Iu=new Set,this.du=new de(M.comparator),this.Eu=new Map,this.Au=new iu,this.Ru={},this.Vu=new Map,this.mu=Ai.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function sP(n,e,t=!0){const i=Nm(n);let r;const s=i.Pu.get(e);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.cu()):r=await Rm(i,e,t,!0),r}async function oP(n,e){const t=Nm(n);await Rm(t,e,!0,!1)}async function Rm(n,e,t,i){const r=await Rb(n.localStore,_t(e)),s=r.targetId,o=n.sharedClientState.addLocalQueryTarget(s,t);let l;return i&&(l=await aP(n,e,s,o==="current",r.resumeToken)),n.isPrimaryClient&&t&&ym(n.remoteStore,r),l}async function aP(n,e,t,i,r){n.gu=(p,g,w)=>(async function(N,k,j,B){let $=k.view.nu(j);$.Ds&&($=await bf(N.localStore,k.query,!1).then((({documents:T})=>k.view.nu(T,$))));const ae=B&&B.targetChanges.get(k.targetId),Ye=B&&B.targetMismatches.get(k.targetId)!=null,_e=k.view.applyChanges($,N.isPrimaryClient,ae,Ye);return Ff(N,k.targetId,_e._u),_e.snapshot})(n,p,g,w);const s=await bf(n.localStore,e,!0),o=new tP(e,s.qs),l=o.nu(s.documents),c=rs.createSynthesizedTargetChangeForCurrentChange(t,i&&n.onlineState!=="Offline",r),u=o.applyChanges(l,n.isPrimaryClient,c);Ff(n,t,u._u);const f=new nP(e,t,o);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),u.snapshot}async function lP(n,e,t){const i=W(n),r=i.Pu.get(e),s=i.Tu.get(r.targetId);if(s.length>1)return i.Tu.set(r.targetId,s.filter((o=>!sa(o,e)))),void i.Pu.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(r.targetId),i.sharedClientState.isActiveQueryTarget(r.targetId)||await ql(i.localStore,r.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(r.targetId),t&&au(i.remoteStore,r.targetId),$l(i,r.targetId)})).catch(Mi)):($l(i,r.targetId),await ql(i.localStore,r.targetId,!0))}async function cP(n,e){const t=W(n),i=t.Pu.get(e),r=t.Tu.get(i.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),au(t.remoteStore,i.targetId))}async function uP(n,e,t){const i=mP(n);try{const r=await(function(o,l){const c=W(o),u=ce.now(),f=l.reduce(((w,S)=>w.add(S.key)),Y());let p,g;return c.persistence.runTransaction("Locally write mutations","readwrite",(w=>{let S=Lt(),N=Y();return c.Os.getEntries(w,f).next((k=>{S=k,S.forEach(((j,B)=>{B.isValidDocument()||(N=N.add(j))}))})).next((()=>c.localDocuments.getOverlayedDocuments(w,S))).next((k=>{p=k;const j=[];for(const B of l){const $=RS(B,p.get(B.key).overlayedDocument);$!=null&&j.push(new Qn(B.key,$,Mg($.value.mapValue),gt.exists(!0)))}return c.mutationQueue.addMutationBatch(w,u,j,l)})).next((k=>{g=k;const j=k.applyToLocalDocumentSet(p,N);return c.documentOverlayCache.saveOverlays(w,k.batchId,j)}))})).then((()=>({batchId:g.batchId,changes:Gg(p)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(r.batchId),(function(o,l,c){let u=o.Ru[o.currentUser.toKey()];u||(u=new de(G)),u=u.insert(l,c),o.Ru[o.currentUser.toKey()]=u})(i,r.batchId,t),await os(i,r.changes),await da(i.remoteStore)}catch(r){const s=du(r,"Failed to persist write");t.reject(s)}}async function Sm(n,e){const t=W(n);try{const i=await wb(t.localStore,e);e.targetChanges.forEach(((r,s)=>{const o=t.Eu.get(s);o&&(ee(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?o.lu=!0:r.modifiedDocuments.size>0?ee(o.lu,14607):r.removedDocuments.size>0&&(ee(o.lu,42227),o.lu=!1))})),await os(t,i,e)}catch(i){await Mi(i)}}function Lf(n,e,t){const i=W(n);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const r=[];i.Pu.forEach(((s,o)=>{const l=o.view.va(e);l.snapshot&&r.push(l.snapshot)})),(function(o,l){const c=W(o);c.onlineState=l;let u=!1;c.queries.forEach(((f,p)=>{for(const g of p.wa)g.va(l)&&(u=!0)})),u&&_u(c)})(i.eventManager,e),r.length&&i.hu.J_(r),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function hP(n,e,t){const i=W(n);i.sharedClientState.updateQueryState(e,"rejected",t);const r=i.Eu.get(e),s=r&&r.key;if(s){let o=new de(M.comparator);o=o.insert(s,Fe.newNoDocument(s,q.min()));const l=Y().add(s),c=new ca(q.min(),new Map,new de(G),o,l);await Sm(i,c),i.du=i.du.remove(s),i.Eu.delete(e),yu(i)}else await ql(i.localStore,e,!1).then((()=>$l(i,e,t))).catch(Mi)}async function dP(n,e){const t=W(n),i=e.batch.batchId;try{const r=await Ib(t.localStore,e);Pm(t,i,null),bm(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await os(t,r)}catch(r){await Mi(r)}}async function fP(n,e,t){const i=W(n);try{const r=await(function(o,l){const c=W(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",(u=>{let f;return c.mutationQueue.lookupMutationBatch(u,l).next((p=>(ee(p!==null,37113),f=p.keys(),c.mutationQueue.removeMutationBatch(u,p)))).next((()=>c.mutationQueue.performConsistencyCheck(u))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(u,f,l))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,f))).next((()=>c.localDocuments.getDocuments(u,f)))}))})(i.localStore,e);Pm(i,e,t),bm(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await os(i,r)}catch(r){await Mi(r)}}function bm(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function Pm(n,e,t){const i=W(n);let r=i.Ru[i.currentUser.toKey()];if(r){const s=r.get(e);s&&(t?s.reject(t):s.resolve(),r=r.remove(e)),i.Ru[i.currentUser.toKey()]=r}}function $l(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const i of n.Tu.get(e))n.Pu.delete(i),t&&n.hu.pu(i,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((i=>{n.Au.containsKey(i)||km(n,i)}))}function km(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(au(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),yu(n))}function Ff(n,e,t){for(const i of t)i instanceof Am?(n.Au.addReference(i.key,e),pP(n,i)):i instanceof Cm?(x(mu,"Document no longer in limbo: "+i.key),n.Au.removeReference(i.key,e),n.Au.containsKey(i.key)||km(n,i.key)):U(19791,{yu:i})}function pP(n,e){const t=e.key,i=t.path.canonicalString();n.du.get(t)||n.Iu.has(i)||(x(mu,"New document in limbo: "+t),n.Iu.add(i),yu(n))}function yu(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new M(oe.fromString(e)),i=n.mu.next();n.Eu.set(i,new iP(t)),n.du=n.du.insert(t,i),ym(n.remoteStore,new en(_t(ra(t.path)),i,"TargetPurposeLimboResolution",ta.ue))}}async function os(n,e,t){const i=W(n),r=[],s=[],o=[];i.Pu.isEmpty()||(i.Pu.forEach(((l,c)=>{o.push(i.gu(c,e,t).then((u=>{var f;if((u||t)&&i.isPrimaryClient){const p=u?!u.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;i.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(u){r.push(u);const p=su.Es(c.targetId,u);s.push(p)}})))})),await Promise.all(o),i.hu.J_(r),await(async function(c,u){const f=W(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>P.forEach(u,(g=>P.forEach(g.Is,(w=>f.persistence.referenceDelegate.addReference(p,g.targetId,w))).next((()=>P.forEach(g.ds,(w=>f.persistence.referenceDelegate.removeReference(p,g.targetId,w)))))))))}catch(p){if(!Li(p))throw p;x(ou,"Failed to update sequence numbers: "+p)}for(const p of u){const g=p.targetId;if(!p.fromCache){const w=f.Fs.get(g),S=w.snapshotVersion,N=w.withLastLimboFreeSnapshotVersion(S);f.Fs=f.Fs.insert(g,N)}}})(i.localStore,s))}async function _P(n,e){const t=W(n);if(!t.currentUser.isEqual(e)){x(mu,"User change. New user:",e.toKey());const i=await pm(t.localStore,e);t.currentUser=e,(function(s,o){s.Vu.forEach((l=>{l.forEach((c=>{c.reject(new V(b.CANCELLED,o))}))})),s.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await os(t,i.Bs)}}function gP(n,e){const t=W(n),i=t.Eu.get(e);if(i&&i.lu)return Y().add(i.key);{let r=Y();const s=t.Tu.get(e);if(!s)return r;for(const o of s){const l=t.Pu.get(o);r=r.unionWith(l.view.tu)}return r}}function Nm(n){const e=W(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Sm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=gP.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=hP.bind(null,e),e.hu.J_=Zb.bind(null,e.eventManager),e.hu.pu=eP.bind(null,e.eventManager),e}function mP(n){const e=W(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=dP.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=fP.bind(null,e),e}class No{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ua(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Tb(this.persistence,new yb,e.initialUser,this.serializer)}Du(e){return new fm(ru.Vi,this.serializer)}bu(e){return new bb}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}No.provider={build:()=>new No};class yP extends No{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){ee(this.persistence.referenceDelegate instanceof Po,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new ib(i,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?$e.withCacheSize(this.cacheSizeBytes):$e.DEFAULT;return new fm((i=>Po.Vi(i,t)),this.serializer)}}class Hl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Lf(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=_P.bind(null,this.syncEngine),await Yb(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Jb})()}createDatastore(e){const t=ua(e.databaseInfo.databaseId),i=(function(s){return new Ob(s)})(e.databaseInfo);return(function(s,o,l,c){return new Lb(s,o,l,c)})(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,r,s,o,l){return new Ub(i,r,s,o,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>Lf(this.syncEngine,t,0)),(function(){return Nf.C()?new Nf:new Pb})())}createSyncEngine(e,t){return(function(r,s,o,l,c,u,f){const p=new rP(r,s,o,l,c,u);return f&&(p.fu=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const s=W(r);x(Wn,"RemoteStore shutting down."),s.Ia.add(5),await ss(s),s.Ea.shutdown(),s.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Hl.provider={build:()=>new Hl};/**
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
 */class vu{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Mt("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const En="FirestoreClient";class vP{constructor(e,t,i,r,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=r,this.user=Le.UNAUTHENTICATED,this.clientId=zc.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(i,(async o=>{x(En,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(i,(o=>(x(En,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Nt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=du(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function rl(n,e){n.asyncQueue.verifyOperationInProgress(),x(En,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let i=t.initialUser;n.setCredentialChangeListener((async r=>{i.isEqual(r)||(await pm(e.localStore,r),i=r)})),e.persistence.setDatabaseDeletedListener((()=>{pn("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{x("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((r=>{pn("Terminating Firestore due to IndexedDb database deletion failed",r)}))})),n._offlineComponents=e}async function Uf(n,e){n.asyncQueue.verifyOperationInProgress();const t=await EP(n);x(En,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((i=>Of(e.remoteStore,i))),n.setAppCheckTokenChangeListener(((i,r)=>Of(e.remoteStore,r))),n._onlineComponents=e}async function EP(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){x(En,"Using user provided OfflineComponentProvider");try{await rl(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===b.FAILED_PRECONDITION||r.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;pn("Error using user provided cache. Falling back to memory cache: "+t),await rl(n,new No)}}else x(En,"Using default OfflineComponentProvider"),await rl(n,new yP(void 0));return n._offlineComponents}async function Dm(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(x(En,"Using user provided OnlineComponentProvider"),await Uf(n,n._uninitializedComponentsProvider._online)):(x(En,"Using default OnlineComponentProvider"),await Uf(n,new Hl))),n._onlineComponents}function TP(n){return Dm(n).then((e=>e.syncEngine))}async function Do(n){const e=await Dm(n),t=e.eventManager;return t.onListen=sP.bind(null,e.syncEngine),t.onUnlisten=lP.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=oP.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=cP.bind(null,e.syncEngine),t}function IP(n,e,t={}){const i=new Nt;return n.asyncQueue.enqueueAndForget((async()=>(function(s,o,l,c,u){const f=new vu({next:g=>{f.Ou(),o.enqueueAndForget((()=>pu(s,p)));const w=g.docs.has(l);!w&&g.fromCache?u.reject(new V(b.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&g.fromCache&&c&&c.source==="server"?u.reject(new V(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(g)},error:g=>u.reject(g)}),p=new gu(ra(l.path),f,{includeMetadataChanges:!0,ka:!0});return fu(s,p)})(await Do(n),n.asyncQueue,e,t,i))),i.promise}function wP(n,e,t={}){const i=new Nt;return n.asyncQueue.enqueueAndForget((async()=>(function(s,o,l,c,u){const f=new vu({next:g=>{f.Ou(),o.enqueueAndForget((()=>pu(s,p))),g.fromCache&&c.source==="server"?u.reject(new V(b.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(g)},error:g=>u.reject(g)}),p=new gu(l,f,{includeMetadataChanges:!0,ka:!0});return fu(s,p)})(await Do(n),n.asyncQueue,e,t,i))),i.promise}/**
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
 */function Om(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Bf=new Map;/**
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
 */const Vm="firestore.googleapis.com",qf=!0;class Wf{constructor(e){var t,i;if(e.host===void 0){if(e.ssl!==void 0)throw new V(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Vm,this.ssl=qf}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:qf;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=dm;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<tb)throw new V(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}UR("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Om((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,r){return i.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class fa{constructor(e,t,i,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Wf({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Wf(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new kR;switch(i.type){case"firstParty":return new VR(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new V(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=Bf.get(t);i&&(x("ComponentProvider","Removing Datastore"),Bf.delete(t),i.terminate())})(this),Promise.resolve()}}function AP(n,e,t,i={}){var r;n=lt(n,fa);const s=Tn(e),o=n._getSettings(),l=Object.assign(Object.assign({},o),{emulatorOptions:n._getEmulatorOptions()}),c=`${e}:${t}`;s&&(zl(`https://${c}`),Gl("Firestore",!0)),o.host!==Vm&&o.host!==c&&pn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:c,ssl:s,emulatorOptions:i});if(!ln(u,l)&&(n._setSettings(u),i.mockUserToken)){let f,p;if(typeof i.mockUserToken=="string")f=i.mockUserToken,p=Le.MOCK_USER;else{f=rp(i.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const g=i.mockUserToken.sub||i.mockUserToken.user_id;if(!g)throw new V(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new Le(g)}n._authCredentials=new NR(new wg(f,p))}}/**
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
 */class Wt{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Wt(this.firestore,e,this._query)}}class me{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new an(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new me(this.firestore,e,this._key)}toJSON(){return{type:me._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(ns(t,me._jsonSchema))return new me(e,i||null,new M(oe.fromString(t.referencePath)))}}me._jsonSchemaVersion="firestore/documentReference/1.0",me._jsonSchema={type:Ee("string",me._jsonSchemaVersion),referencePath:Ee("string")};class an extends Wt{constructor(e,t,i){super(e,t,ra(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new me(this.firestore,null,new M(e))}withConverter(e){return new an(this.firestore,e,this._path)}}function h0(n,e,...t){if(n=re(n),Cg("collection","path",e),n instanceof fa){const i=oe.fromString(e,...t);return ef(i),new an(n,null,i)}{if(!(n instanceof me||n instanceof an))throw new V(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(oe.fromString(e,...t));return ef(i),new an(n.firestore,null,i)}}function d0(n,e,...t){if(n=re(n),arguments.length===1&&(e=zc.newId()),Cg("doc","path",e),n instanceof fa){const i=oe.fromString(e,...t);return Zd(i),new me(n,null,new M(i))}{if(!(n instanceof me||n instanceof an))throw new V(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(oe.fromString(e,...t));return Zd(i),new me(n.firestore,n instanceof an?n.converter:null,new M(i))}}/**
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
 */const jf="AsyncQueue";class $f{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new gm(this,"async_queue_retry"),this.oc=()=>{const i=il();i&&x(jf,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this._c=e;const t=il();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=il();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Nt;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Li(e))throw e;x(jf,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((i=>{throw this.tc=i,this.nc=!1,Mt("INTERNAL UNHANDLED ERROR: ",Hf(i)),i})).then((i=>(this.nc=!1,i))))));return this._c=t,t}enqueueAfterDelay(e,t,i){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=hu.createAndSchedule(this,e,t,i,(s=>this.lc(s)));return this.ec.push(r),r}ac(){this.tc&&U(47125,{hc:Hf(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Hf(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
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
 */function zf(n){return(function(t,i){if(typeof t!="object"||t===null)return!1;const r=t;for(const s of i)if(s in r&&typeof r[s]=="function")return!0;return!1})(n,["next","error","complete"])}class jn extends fa{constructor(e,t,i,r){super(e,t,i,r),this.type="firestore",this._queue=new $f,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new $f(e),this._firestoreClient=void 0,await e}}}function f0(n,e){const t=typeof n=="object"?n:Lo(),i=typeof n=="string"?n:Io,r=Pi(t,"firestore").getImmediate({identifier:i});if(!r._initialized){const s=tp("firestore");s&&AP(r,...s)}return r}function pa(n){if(n._terminated)throw new V(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||CP(n),n._firestoreClient}function CP(n){var e,t,i;const r=n._freezeSettings(),s=(function(l,c,u,f){return new XR(l,c,u,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Om(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((i=r.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new vP(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&(function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}})(n._componentsProvider))}/**
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
 */class Je{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Je(Ne.fromBase64String(e))}catch(t){throw new V(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Je(Ne.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Je._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ns(e,Je._jsonSchema))return Je.fromBase64String(e.bytes)}}Je._jsonSchemaVersion="firestore/bytes/1.0",Je._jsonSchema={type:Ee("string",Je._jsonSchemaVersion),bytes:Ee("string")};/**
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
 */class Eu{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ke(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class xm{constructor(e){this._methodName=e}}/**
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
 */class yt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return G(this._lat,e._lat)||G(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:yt._jsonSchemaVersion}}static fromJSON(e){if(ns(e,yt._jsonSchema))return new yt(e.latitude,e.longitude)}}yt._jsonSchemaVersion="firestore/geoPoint/1.0",yt._jsonSchema={type:Ee("string",yt._jsonSchemaVersion),latitude:Ee("number"),longitude:Ee("number")};/**
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
 */class vt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,r){if(i.length!==r.length)return!1;for(let s=0;s<i.length;++s)if(i[s]!==r[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:vt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ns(e,vt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new vt(e.vectorValues);throw new V(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}vt._jsonSchemaVersion="firestore/vectorValue/1.0",vt._jsonSchema={type:Ee("string",vt._jsonSchemaVersion),vectorValues:Ee("object")};/**
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
 */const RP=/^__.*__$/;class SP{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new Qn(e,this.data,this.fieldMask,t,this.fieldTransforms):new is(e,this.data,t,this.fieldTransforms)}}function Mm(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw U(40011,{Ec:n})}}class Tu{constructor(e,t,i,r,s,o){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=r,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Tu(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:i,mc:!1});return r.fc(e),r}gc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:i,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Oo(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Mm(this.Ec)&&RP.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class bP{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||ua(e)}Dc(e,t,i,r=!1){return new Tu({Ec:e,methodName:t,bc:i,path:ke.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Lm(n){const e=n._freezeSettings(),t=ua(n._databaseId);return new bP(n._databaseId,!!e.ignoreUndefinedProperties,t)}function PP(n,e,t,i,r,s={}){const o=n.Dc(s.merge||s.mergeFields?2:0,e,t,r);Bm("Data must be an object, but it was:",o,i);const l=Fm(i,o);let c,u;if(s.merge)c=new st(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const p of s.mergeFields){const g=NP(e,p,t);if(!o.contains(g))throw new V(b.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);OP(f,g)||f.push(g)}c=new st(f),u=o.fieldTransforms.filter((p=>c.covers(p.field)))}else c=null,u=o.fieldTransforms;return new SP(new Xe(l),c,u)}function kP(n,e,t,i=!1){return Iu(t,n.Dc(i?4:3,e))}function Iu(n,e){if(Um(n=re(n)))return Bm("Unsupported field value:",e,n),Fm(n,e);if(n instanceof xm)return(function(i,r){if(!Mm(r.Ec))throw r.wc(`${i._methodName}() can only be used with update() and set()`);if(!r.path)throw r.wc(`${i._methodName}() is not currently supported inside arrays`);const s=i._toFieldTransform(r);s&&r.fieldTransforms.push(s)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(i,r){const s=[];let o=0;for(const l of i){let c=Iu(l,r.yc(o));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),o++}return{arrayValue:{values:s}}})(n,e)}return(function(i,r){if((i=re(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return ES(r.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const s=ce.fromDate(i);return{timestampValue:bo(r.serializer,s)}}if(i instanceof ce){const s=new ce(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:bo(r.serializer,s)}}if(i instanceof yt)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof Je)return{bytesValue:sm(r.serializer,i._byteString)};if(i instanceof me){const s=r.databaseId,o=i.firestore._databaseId;if(!o.isEqual(s))throw r.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:nu(i.firestore._databaseId||r.databaseId,i._key.path)}}if(i instanceof vt)return(function(o,l){return{mapValue:{fields:{[Vg]:{stringValue:xg},[wo]:{arrayValue:{values:o.toArray().map((u=>{if(typeof u!="number")throw l.wc("VectorValues must only contain numeric values.");return Jc(l.serializer,u)}))}}}}}})(i,r);throw r.wc(`Unsupported field value: ${ea(i)}`)})(n,e)}function Fm(n,e){const t={};return bg(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Gn(n,((i,r)=>{const s=Iu(r,e.Vc(i));s!=null&&(t[i]=s)})),{mapValue:{fields:t}}}function Um(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ce||n instanceof yt||n instanceof Je||n instanceof me||n instanceof xm||n instanceof vt)}function Bm(n,e,t){if(!Um(t)||!Rg(t)){const i=ea(t);throw i==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+i)}}function NP(n,e,t){if((e=re(e))instanceof Eu)return e._internalPath;if(typeof e=="string")return qm(n,e);throw Oo("Field path arguments must be of type string or ",n,!1,void 0,t)}const DP=new RegExp("[~\\*/\\[\\]]");function qm(n,e,t){if(e.search(DP)>=0)throw Oo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Eu(...e.split("."))._internalPath}catch{throw Oo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Oo(n,e,t,i,r){const s=i&&!i.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${i}`),o&&(c+=` in document ${r}`),c+=")"),new V(b.INVALID_ARGUMENT,l+n+c)}function OP(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class Wm{constructor(e,t,i,r,s){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new me(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new VP(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(wu("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class VP extends Wm{data(){return super.data()}}function wu(n,e){return typeof e=="string"?qm(n,e):e instanceof Eu?e._internalPath:e._delegate._internalPath}/**
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
 */function jm(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new V(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Au{}class Cu extends Au{}function p0(n,e,...t){let i=[];e instanceof Au&&i.push(e),i=i.concat(t),(function(s){const o=s.filter((c=>c instanceof Su)).length,l=s.filter((c=>c instanceof Ru)).length;if(o>1||o>0&&l>0)throw new V(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const r of i)n=r._apply(n);return n}class Ru extends Cu{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new Ru(e,t,i)}_apply(e){const t=this._parse(e);return $m(e._query,t),new Wt(e.firestore,e.converter,Ml(e._query,t))}_parse(e){const t=Lm(e.firestore);return(function(s,o,l,c,u,f,p){let g;if(u.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new V(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Kf(p,f);const S=[];for(const N of p)S.push(Gf(c,s,N));g={arrayValue:{values:S}}}else g=Gf(c,s,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Kf(p,f),g=kP(l,o,p,f==="in"||f==="not-in");return ve.create(u,f,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class Su extends Au{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Su(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:ut.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(r,s){let o=r;const l=s.getFlattenedFilters();for(const c of l)$m(o,c),o=Ml(o,c)})(e._query,t),new Wt(e.firestore,e.converter,Ml(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class bu extends Cu{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new bu(e,t)}_apply(e){const t=(function(r,s,o){if(r.startAt!==null)throw new V(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new V(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new qr(s,o)})(e._query,this._field,this._direction);return new Wt(e.firestore,e.converter,(function(r,s){const o=r.explicitOrderBy.concat([s]);return new Fi(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)})(e._query,t))}}function _0(n,e="asc"){const t=e,i=wu("orderBy",n);return bu._create(i,t)}class Pu extends Cu{constructor(e,t,i){super(),this.type=e,this._limit=t,this._limitType=i}static _create(e,t,i){return new Pu(e,t,i)}_apply(e){return new Wt(e.firestore,e.converter,Co(e._query,this._limit,this._limitType))}}function g0(n){return BR("limit",n),Pu._create("limit",n,"F")}function Gf(n,e,t){if(typeof(t=re(t))=="string"){if(t==="")throw new V(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!jg(e)&&t.indexOf("/")!==-1)throw new V(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(oe.fromString(t));if(!M.isDocumentKey(i))throw new V(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return cf(n,new M(i))}if(t instanceof me)return cf(n,t._key);throw new V(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ea(t)}.`)}function Kf(n,e){if(!Array.isArray(n)||n.length===0)throw new V(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function $m(n,e){const t=(function(r,s){for(const o of r)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null})(n.filters,(function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new V(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class xP{convertValue(e,t="none"){switch(yn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ge(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(mn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw U(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return Gn(e,((r,s)=>{i[r]=this.convertValue(s,t)})),i}convertVectorValue(e){var t,i,r;const s=(r=(i=(t=e.fields)===null||t===void 0?void 0:t[wo].arrayValue)===null||i===void 0?void 0:i.values)===null||r===void 0?void 0:r.map((o=>ge(o.doubleValue)));return new vt(s)}convertGeoPoint(e){return new yt(ge(e.latitude),ge(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=ia(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(Fr(e));default:return null}}convertTimestamp(e){const t=gn(e);return new ce(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=oe.fromString(e);ee(hm(i),9688,{name:e});const r=new Ur(i.get(1),i.get(3)),s=new M(i.popFirst(5));return r.isEqual(t)||Mt(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
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
 */function MP(n,e,t){let i;return i=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,i}class fr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class On extends Wm{constructor(e,t,i,r,s,o){super(e,t,i,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Gs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(wu("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new V(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=On._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}On._jsonSchemaVersion="firestore/documentSnapshot/1.0",On._jsonSchema={type:Ee("string",On._jsonSchemaVersion),bundleSource:Ee("string","DocumentSnapshot"),bundleName:Ee("string"),bundle:Ee("string")};class Gs extends On{data(e={}){return super.data(e)}}class Vn{constructor(e,t,i,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new fr(r.hasPendingWrites,r.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new Gs(this._firestore,this._userDataWriter,i.key,i,new fr(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,s){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map((l=>{const c=new Gs(r._firestore,r._userDataWriter,l.doc.key,l.doc,new fr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}}))}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((l=>s||l.type!==3)).map((l=>{const c=new Gs(r._firestore,r._userDataWriter,l.doc.key,l.doc,new fr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let u=-1,f=-1;return l.type!==0&&(u=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:LP(l.type),doc:c,oldIndex:u,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new V(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Vn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=zc.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],r=[];return this.docs.forEach((s=>{s._document!==null&&(t.push(s._document),i.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),r.push(s.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function LP(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return U(61501,{type:n})}}/**
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
 */function m0(n){n=lt(n,me);const e=lt(n.firestore,jn);return IP(pa(e),n._key).then((t=>zm(e,n,t)))}Vn._jsonSchemaVersion="firestore/querySnapshot/1.0",Vn._jsonSchema={type:Ee("string",Vn._jsonSchemaVersion),bundleSource:Ee("string","QuerySnapshot"),bundleName:Ee("string"),bundle:Ee("string")};class ku extends xP{constructor(e){super(),this.firestore=e}convertBytes(e){return new Je(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new me(this.firestore,null,t)}}function y0(n){n=lt(n,Wt);const e=lt(n.firestore,jn),t=pa(e),i=new ku(e);return jm(n._query),wP(t,n._query).then((r=>new Vn(e,i,n,r)))}function v0(n,e,t){n=lt(n,me);const i=lt(n.firestore,jn),r=MP(n.converter,e,t);return Hm(i,[PP(Lm(i),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,gt.none())])}function E0(n){return Hm(lt(n.firestore,jn),[new Zc(n._key,gt.none())])}function T0(n,...e){var t,i,r;n=re(n);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||zf(e[o])||(s=e[o++]);const l={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(zf(e[o])){const p=e[o];e[o]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[o+1]=(i=p.error)===null||i===void 0?void 0:i.bind(p),e[o+2]=(r=p.complete)===null||r===void 0?void 0:r.bind(p)}let c,u,f;if(n instanceof me)u=lt(n.firestore,jn),f=ra(n._key.path),c={next:p=>{e[o]&&e[o](zm(u,n,p))},error:e[o+1],complete:e[o+2]};else{const p=lt(n,Wt);u=lt(p.firestore,jn),f=p._query;const g=new ku(u);c={next:w=>{e[o]&&e[o](new Vn(u,g,p,w))},error:e[o+1],complete:e[o+2]},jm(n._query)}return(function(g,w,S,N){const k=new vu(N),j=new gu(w,k,S);return g.asyncQueue.enqueueAndForget((async()=>fu(await Do(g),j))),()=>{k.Ou(),g.asyncQueue.enqueueAndForget((async()=>pu(await Do(g),j)))}})(pa(u),f,l,c)}function Hm(n,e){return(function(i,r){const s=new Nt;return i.asyncQueue.enqueueAndForget((async()=>uP(await TP(i),r,s))),s.promise})(pa(n),e)}function zm(n,e,t){const i=t.docs.get(e._key),r=new ku(n);return new On(n,r,e._key,i,new fr(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(r){xi=r})($n),Ot(new Et("firestore",((i,{instanceIdentifier:r,options:s})=>{const o=i.getProvider("app").getImmediate(),l=new jn(new DR(i.getProvider("auth-internal")),new xR(o,i.getProvider("app-check-internal")),(function(u,f){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new V(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ur(u.options.projectId,f)})(o,r),o);return s=Object.assign({useFetchStreams:t},s),l._setSettings(s),l}),"PUBLIC").setMultipleInstances(!0)),ot(Kd,Qd,e),ot(Kd,Qd,"esm2017")})();export{p0 as A,g0 as B,_0 as C,s0 as D,i0 as E,r0 as F,FP as G,WP as H,iI as I,Qp as J,KP as K,f0 as L,o0 as M,a0 as N,zP as O,Tp as R,gR as a,E0 as b,JP as c,d0 as d,l0 as e,c0 as f,qP as g,e0 as h,m0 as i,y0 as j,h0 as k,HP as l,jP as m,T0 as n,XP as o,t0 as p,$P as q,YP as r,v0 as s,iE as t,BP as u,xT as v,Xh as w,GP as x,UP as y,ZP as z};
