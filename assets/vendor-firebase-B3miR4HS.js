const f_=()=>{};var Dc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eh={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=function(n,e){if(!n)throw jn(e)},jn=function(n){return new Error("Firebase Database ("+Eh.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},p_=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],a=n[t++],l=n[t++],u=((i&7)<<18|(r&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(u>>10)),e[s++]=String.fromCharCode(56320+(u&1023))}else{const r=n[t++],a=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|a&63)}}return e.join("")},Ea={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],a=i+1<n.length,l=a?n[i+1]:0,u=i+2<n.length,h=u?n[i+2]:0,f=r>>2,p=(r&3)<<4|l>>4;let m=(l&15)<<2|h>>6,w=h&63;u||(w=64,a||(m=64)),s.push(t[f],t[p],t[m],t[w])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Th(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):p_(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const h=i<n.length?t[n.charAt(i)]:64;++i;const p=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||l==null||h==null||p==null)throw new __;const m=r<<2|l>>4;if(s.push(m),h!==64){const w=l<<4&240|h>>2;if(s.push(w),p!==64){const R=h<<6&192|p;s.push(R)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class __ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ih=function(n){const e=Th(n);return Ea.encodeByteArray(e,!0)},Hi=function(n){return Ih(n).replace(/\./g,"")},xo=function(n){try{return Ea.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m_(n){return wh(void 0,n)}function wh(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!g_(t)||(n[t]=wh(n[t],e[t]));return n}function g_(n){return n!=="__proto__"}/**
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
 */function y_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const v_=()=>y_().__FIREBASE_DEFAULTS__,E_=()=>{if(typeof process>"u"||typeof Dc>"u")return;const n=Dc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},T_=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&xo(n[1]);return e&&JSON.parse(e)},vr=()=>{try{return f_()||v_()||E_()||T_()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},I_=n=>{var e,t;return(t=(e=vr())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Ch=n=>{const e=I_(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Ah=()=>{var n;return(n=vr())===null||n===void 0?void 0:n.config},Ew=n=>{var e;return(e=vr())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function ei(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Sh(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function Rh(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Hi(JSON.stringify(t)),Hi(JSON.stringify(a)),""].join(".")}const Cs={};function w_(){const n={prod:[],emulator:[]};for(const e of Object.keys(Cs))Cs[e]?n.emulator.push(e):n.prod.push(e);return n}function C_(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let kc=!1;function bh(n,e){if(typeof window>"u"||typeof document>"u"||!ei(window.location.host)||Cs[n]===e||Cs[n]||kc)return;Cs[n]=e;function t(m){return`__firebase__banner__${m}`}const s="__firebase__banner",r=w_().prod.length>0;function a(){const m=document.getElementById(s);m&&m.remove()}function l(m){m.style.display="flex",m.style.background="#7faaf0",m.style.position="fixed",m.style.bottom="5px",m.style.left="5px",m.style.padding=".5em",m.style.borderRadius="5px",m.style.alignItems="center"}function u(m,w){m.setAttribute("width","24"),m.setAttribute("id",w),m.setAttribute("height","24"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.style.marginLeft="-6px"}function h(){const m=document.createElement("span");return m.style.cursor="pointer",m.style.marginLeft="16px",m.style.fontSize="24px",m.innerHTML=" &times;",m.onclick=()=>{kc=!0,a()},m}function f(m,w){m.setAttribute("id",w),m.innerText="Learn more",m.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",m.setAttribute("target","__blank"),m.style.paddingLeft="5px",m.style.textDecoration="underline"}function p(){const m=C_(s),w=t("text"),R=document.getElementById(w)||document.createElement("span"),D=t("learnmore"),N=document.getElementById(D)||document.createElement("a"),q=t("preprendIcon"),j=document.getElementById(q)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(m.created){const G=m.element;l(G),f(N,D);const ue=h();u(j,q),G.append(j,R,N,ue),document.body.appendChild(G)}r?(R.innerText="Preview backend disconnected.",j.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(j.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,R.innerText="Preview backend running in this workspace."),R.setAttribute("id",w)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ta(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ph(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ta())}function A_(){var n;const e=(n=vr())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Tw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Iw(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function S_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ww(){const n=Ta();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function R_(){return Eh.NODE_ADMIN===!0}function b_(){return!A_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function P_(){try{return typeof indexedDB=="object"}catch{return!1}}function N_(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D_="FirebaseError";class qn extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=D_,Object.setPrototypeOf(this,qn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Nh.prototype.create)}}class Nh{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],a=r?k_(r,s):"Error",l=`${this.serviceName}: ${a} (${i}).`;return new qn(i,l,s)}}function k_(n,e){return n.replace(V_,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const V_=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xs(n){return JSON.parse(n)}function me(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=xs(xo(r[0])||""),t=xs(xo(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},x_=function(n){const e=Dh(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},O_=function(n){const e=Dh(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function bn(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Oo(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Gi(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function Os(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],a=e[i];if(Vc(r)&&Vc(a)){if(!Os(r,a))return!1}else if(r!==a)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function Vc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M_(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Cw(n){const e={};return n.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[i,r]=s.split("=");e[decodeURIComponent(i)]=decodeURIComponent(r)}}),e}function Aw(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)s[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)s[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const m=s[p-3]^s[p-8]^s[p-14]^s[p-16];s[p]=(m<<1|m>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],a=this.chain_[2],l=this.chain_[3],u=this.chain_[4],h,f;for(let p=0;p<80;p++){p<40?p<20?(h=l^r&(a^l),f=1518500249):(h=r^a^l,f=1859775393):p<60?(h=r&a|l&(r|a),f=2400959708):(h=r^a^l,f=3395469782);const m=(i<<5|i>>>27)+h+u+f+s[p]&4294967295;u=l,l=a,a=(r<<30|r>>>2)&4294967295,r=i,i=m}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+u&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let a=this.inbuf_;for(;i<t;){if(a===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[a]=e.charCodeAt(i),++a,++i,a===this.blockSize){this.compress_(r),a=0;break}}else for(;i<t;)if(r[a]=e[i],++a,++i,a===this.blockSize){this.compress_(r),a=0;break}}this.inbuf_=a,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function Sw(n,e){const t=new F_(n,e);return t.subscribe.bind(t)}class F_{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let i;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");U_(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:s},i.next===void 0&&(i.next=yo),i.error===void 0&&(i.error=yo),i.complete===void 0&&(i.complete=yo);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function U_(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function yo(){}function Pn(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B_=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,k(s<n.length,"Surrogate pair missing trail surrogate.");const a=n.charCodeAt(s)-56320;i=65536+(r<<10)+a}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Er=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
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
 */function He(n){return n&&n._delegate?n._delegate:n}class Nn{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Yt="[DEFAULT]";/**
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
 */class j_{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new et;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(W_(e))try{this.getOrInitializeService({instanceIdentifier:Yt})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=Yt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Yt){return this.instances.has(e)}getOptions(e=Yt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&a.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const a=this.instances.get(i);return a&&e(a,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:q_(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Yt){return this.component?this.component.multipleInstances?e:Yt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function q_(n){return n===Yt?void 0:n}function W_(n){return n.instantiationMode==="EAGER"}/**
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
 */class z_{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new j_(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Q||(Q={}));const $_={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},H_=Q.INFO,G_={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},K_=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=G_[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ia{constructor(e){this.name=e,this._logLevel=H_,this._logHandler=K_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?$_[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const Q_=(n,e)=>e.some(t=>n instanceof t);let xc,Oc;function Y_(){return xc||(xc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function X_(){return Oc||(Oc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const kh=new WeakMap,Mo=new WeakMap,Vh=new WeakMap,vo=new WeakMap,wa=new WeakMap;function J_(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",a)},r=()=>{t(Rt(n.result)),i()},a=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&kh.set(t,n)}).catch(()=>{}),wa.set(e,n),e}function Z_(n){if(Mo.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",a),n.removeEventListener("abort",a)},r=()=>{t(),i()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",a),n.addEventListener("abort",a)});Mo.set(n,e)}let Lo={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Mo.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Vh.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Rt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function em(n){Lo=n(Lo)}function tm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(Eo(this),e,...t);return Vh.set(s,e.sort?e.sort():[e]),Rt(s)}:X_().includes(n)?function(...e){return n.apply(Eo(this),e),Rt(kh.get(this))}:function(...e){return Rt(n.apply(Eo(this),e))}}function nm(n){return typeof n=="function"?tm(n):(n instanceof IDBTransaction&&Z_(n),Q_(n,Y_())?new Proxy(n,Lo):n)}function Rt(n){if(n instanceof IDBRequest)return J_(n);if(vo.has(n))return vo.get(n);const e=nm(n);return e!==n&&(vo.set(n,e),wa.set(e,n)),e}const Eo=n=>wa.get(n);function sm(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const a=indexedDB.open(n,e),l=Rt(a);return s&&a.addEventListener("upgradeneeded",u=>{s(Rt(a.result),u.oldVersion,u.newVersion,Rt(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),l.then(u=>{r&&u.addEventListener("close",()=>r()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const im=["get","getKey","getAll","getAllKeys","count"],rm=["put","add","delete","clear"],To=new Map;function Mc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(To.get(e))return To.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=rm.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||im.includes(t)))return;const r=async function(a,...l){const u=this.transaction(a,i?"readwrite":"readonly");let h=u.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),i&&u.done]))[0]};return To.set(e,r),r}em(n=>({...n,get:(e,t,s)=>Mc(e,t)||n.get(e,t,s),has:(e,t)=>!!Mc(e,t)||n.has(e,t)}));/**
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
 */class om{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(am(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function am(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Fo="@firebase/app",Lc="0.13.2";/**
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
 */const mt=new Ia("@firebase/app"),lm="@firebase/app-compat",cm="@firebase/analytics-compat",um="@firebase/analytics",hm="@firebase/app-check-compat",dm="@firebase/app-check",fm="@firebase/auth",pm="@firebase/auth-compat",_m="@firebase/database",mm="@firebase/data-connect",gm="@firebase/database-compat",ym="@firebase/functions",vm="@firebase/functions-compat",Em="@firebase/installations",Tm="@firebase/installations-compat",Im="@firebase/messaging",wm="@firebase/messaging-compat",Cm="@firebase/performance",Am="@firebase/performance-compat",Sm="@firebase/remote-config",Rm="@firebase/remote-config-compat",bm="@firebase/storage",Pm="@firebase/storage-compat",Nm="@firebase/firestore",Dm="@firebase/ai",km="@firebase/firestore-compat",Vm="firebase",xm="11.10.0";/**
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
 */const Uo="[DEFAULT]",Om={[Fo]:"fire-core",[lm]:"fire-core-compat",[um]:"fire-analytics",[cm]:"fire-analytics-compat",[dm]:"fire-app-check",[hm]:"fire-app-check-compat",[fm]:"fire-auth",[pm]:"fire-auth-compat",[_m]:"fire-rtdb",[mm]:"fire-data-connect",[gm]:"fire-rtdb-compat",[ym]:"fire-fn",[vm]:"fire-fn-compat",[Em]:"fire-iid",[Tm]:"fire-iid-compat",[Im]:"fire-fcm",[wm]:"fire-fcm-compat",[Cm]:"fire-perf",[Am]:"fire-perf-compat",[Sm]:"fire-rc",[Rm]:"fire-rc-compat",[bm]:"fire-gcs",[Pm]:"fire-gcs-compat",[Nm]:"fire-fst",[km]:"fire-fst-compat",[Dm]:"fire-vertex","fire-js":"fire-js",[Vm]:"fire-js-all"};/**
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
 */const tn=new Map,Bo=new Map,jo=new Map;function Fc(n,e){try{n.container.addComponent(e)}catch(t){mt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ms(n){const e=n.name;if(jo.has(e))return mt.debug(`There were multiple attempts to register component ${e}.`),!1;jo.set(e,n);for(const t of tn.values())Fc(t,n);for(const t of Bo.values())Fc(t,n);return!0}function xh(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Oh(n){return n==null?!1:n.settings!==void 0}/**
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
 */const Mm={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},bt=new Nh("app","Firebase",Mm);/**
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
 */class Lm{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Nn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw bt.create("app-deleted",{appName:this._name})}}/**
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
 */const Mh=xm;function Fm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Uo,automaticDataCollectionEnabled:!0},e),i=s.name;if(typeof i!="string"||!i)throw bt.create("bad-app-name",{appName:String(i)});if(t||(t=Ah()),!t)throw bt.create("no-options");const r=tn.get(i);if(r){if(Os(t,r.options)&&Os(s,r.config))return r;throw bt.create("duplicate-app",{appName:i})}const a=new z_(i);for(const u of jo.values())a.addComponent(u);const l=new Lm(t,s,a);return tn.set(i,l),l}function Lh(n=Uo){const e=tn.get(n);if(!e&&n===Uo&&Ah())return Fm();if(!e)throw bt.create("no-app",{appName:n});return e}function Rw(){return Array.from(tn.values())}async function bw(n){let e=!1;const t=n.name;tn.has(t)?(e=!0,tn.delete(t)):Bo.has(t)&&n.decRefCount()<=0&&(Bo.delete(t),e=!0),e&&(await Promise.all(n.container.getProviders().map(s=>s.delete())),n.isDeleted=!0)}function Pt(n,e,t){var s;let i=(s=Om[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),a=e.match(/\s|\//);if(r||a){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),mt.warn(l.join(" "));return}Ms(new Nn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Um="firebase-heartbeat-database",Bm=1,Ls="firebase-heartbeat-store";let Io=null;function Fh(){return Io||(Io=sm(Um,Bm,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Ls)}catch(t){console.warn(t)}}}}).catch(n=>{throw bt.create("idb-open",{originalErrorMessage:n.message})})),Io}async function jm(n){try{const t=(await Fh()).transaction(Ls),s=await t.objectStore(Ls).get(Uh(n));return await t.done,s}catch(e){if(e instanceof qn)mt.warn(e.message);else{const t=bt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});mt.warn(t.message)}}}async function Uc(n,e){try{const s=(await Fh()).transaction(Ls,"readwrite");await s.objectStore(Ls).put(e,Uh(n)),await s.done}catch(t){if(t instanceof qn)mt.warn(t.message);else{const s=bt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});mt.warn(s.message)}}}function Uh(n){return`${n.name}!${n.options.appId}`}/**
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
 */const qm=1024,Wm=30;class zm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Hm(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Bc();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats.length>Wm){const a=Gm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){mt.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Bc(),{heartbeatsToSend:s,unsentEntries:i}=$m(this._heartbeatsCache.heartbeats),r=Hi(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return mt.warn(t),""}}}function Bc(){return new Date().toISOString().substring(0,10)}function $m(n,e=qm){const t=[];let s=n.slice();for(const i of n){const r=t.find(a=>a.agent===i.agent);if(r){if(r.dates.push(i.date),jc(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),jc(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Hm{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return P_()?N_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Uc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Uc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function jc(n){return Hi(JSON.stringify({version:2,heartbeats:n})).length}function Gm(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
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
 */function Km(n){Ms(new Nn("platform-logger",e=>new om(e),"PRIVATE")),Ms(new Nn("heartbeat",e=>new zm(e),"PRIVATE")),Pt(Fo,Lc,n),Pt(Fo,Lc,"esm2017"),Pt("fire-js","")}Km("");var Qm="firebase",Ym="11.10.0";/**
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
 */Pt(Qm,Ym,"app");var qc={};const Wc="@firebase/database",zc="1.0.20";/**
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
 */let Bh="";function Xm(n){Bh=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jm{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),me(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:xs(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return lt(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Jm(e)}}catch{}return new Zm},Jt=jh("localStorage"),eg=jh("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn=new Ia("@firebase/database"),tg=(function(){let n=1;return function(){return n++}})(),qh=function(n){const e=B_(n),t=new L_;t.update(e);const s=t.digest();return Ea.encodeByteArray(s)},ti=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=ti.apply(null,s):typeof s=="object"?e+=me(s):e+=s,e+=" "}return e};let As=null,$c=!0;const ng=function(n,e){k(!0,"Can't turn on custom loggers persistently."),Cn.logLevel=Q.VERBOSE,As=Cn.log.bind(Cn)},Ie=function(...n){if($c===!0&&($c=!1,As===null&&eg.get("logging_enabled")===!0&&ng()),As){const e=ti.apply(null,n);As(e)}},ni=function(n){return function(...e){Ie(n,...e)}},qo=function(...n){const e="FIREBASE INTERNAL ERROR: "+ti(...n);Cn.error(e)},gt=function(...n){const e=`FIREBASE FATAL ERROR: ${ti(...n)}`;throw Cn.error(e),new Error(e)},Ue=function(...n){const e="FIREBASE WARNING: "+ti(...n);Cn.warn(e)},sg=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&Ue("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Tr=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},ig=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Dn="[MIN_NAME]",nn="[MAX_NAME]",ln=function(n,e){if(n===e)return 0;if(n===Dn||e===nn)return-1;if(e===Dn||n===nn)return 1;{const t=Hc(n),s=Hc(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},rg=function(n,e){return n===e?0:n<e?-1:1},ps=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+me(e))},Ca=function(n){if(typeof n!="object"||n===null)return me(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=me(e[s]),t+=":",t+=Ca(n[e[s]]);return t+="}",t},Wh=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function we(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const zh=function(n){k(!Tr(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,a,l,u;n===0?(r=0,a=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=l+s,a=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,a=Math.round(n/Math.pow(2,1-s-t))));const h=[];for(u=t;u;u-=1)h.push(a%2?1:0),a=Math.floor(a/2);for(u=e;u;u-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(i?1:0),h.reverse();const f=h.join("");let p="";for(u=0;u<64;u+=8){let m=parseInt(f.substr(u,8),2).toString(16);m.length===1&&(m="0"+m),p=p+m}return p.toLowerCase()},og=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ag=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function lg(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const cg=new RegExp("^-?(0*)\\d{1,10}$"),ug=-2147483648,hg=2147483647,Hc=function(n){if(cg.test(n)){const e=Number(n);if(e>=ug&&e<=hg)return e}return null},Wn=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw Ue("Exception was thrown by user callback.",t),e},Math.floor(0))}},dg=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Ss=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class fg{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Oh(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){Ue(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pg{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Ie("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Ue(e)}}class Fi{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Fi.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aa="5",$h="v",Hh="s",Gh="r",Kh="f",Qh=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Yh="ls",Xh="p",Wo="ac",Jh="websocket",Zh="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{constructor(e,t,s,i,r=!1,a="",l=!1,u=!1,h=null){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=a,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=u,this.emulatorOptions=h,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Jt.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Jt.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function _g(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function td(n,e,t){k(typeof e=="string","typeof type must == string"),k(typeof t=="object","typeof params must == object");let s;if(e===Jh)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Zh)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);_g(n)&&(t.ns=n.namespace);const i=[];return we(t,(r,a)=>{i.push(r+"="+a)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(){this.counters_={}}incrementCounter(e,t=1){lt(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return m_(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo={},Co={};function Sa(n){const e=n.toString();return wo[e]||(wo[e]=new mg),wo[e]}function gg(n,e){const t=n.toString();return Co[t]||(Co[t]=e()),Co[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yg{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&Wn(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gc="start",vg="close",Eg="pLPCommand",Tg="pRTLPCB",nd="id",sd="pw",id="ser",Ig="cb",wg="seg",Cg="ts",Ag="d",Sg="dframe",rd=1870,od=30,Rg=rd-od,bg=25e3,Pg=3e4;class wn{constructor(e,t,s,i,r,a,l){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=a,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=ni(e),this.stats_=Sa(t),this.urlFn=u=>(this.appCheckToken&&(u[Wo]=this.appCheckToken),td(t,Zh,u))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new yg(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Pg)),ig(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Ra((...r)=>{const[a,l,u,h,f]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,a===Gc)this.id=l,this.password=u;else if(a===vg)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+a)},(...r)=>{const[a,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(a,l)},()=>{this.onClosed_()},this.urlFn);const s={};s[Gc]="t",s[id]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[Ig]=this.scriptTagHolder.uniqueCallbackIdentifier),s[$h]=Aa,this.transportSessionId&&(s[Hh]=this.transportSessionId),this.lastSessionId&&(s[Yh]=this.lastSessionId),this.applicationId&&(s[Xh]=this.applicationId),this.appCheckToken&&(s[Wo]=this.appCheckToken),typeof location<"u"&&location.hostname&&Qh.test(location.hostname)&&(s[Gh]=Kh);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){wn.forceAllow_=!0}static forceDisallow(){wn.forceDisallow_=!0}static isAvailable(){return wn.forceAllow_?!0:!wn.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!og()&&!ag()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=me(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Ih(t),i=Wh(s,Rg);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[Sg]="t",s[nd]=e,s[sd]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=me(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Ra{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=tg(),window[Eg+this.uniqueCallbackIdentifier]=e,window[Tg+this.uniqueCallbackIdentifier]=t,this.myIFrame=Ra.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const a="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(a),this.myIFrame.doc.close()}catch(l){Ie("frame writing exception"),l.stack&&Ie(l.stack),Ie(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Ie("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[nd]=this.myID,e[sd]=this.myPW,e[id]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+od+s.length<=rd;){const a=this.pendingSegs.shift();s=s+"&"+wg+i+"="+a.seg+"&"+Cg+i+"="+a.ts+"&"+Ag+i+"="+a.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(bg)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{Ie("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ng=16384,Dg=45e3;let Ki=null;typeof MozWebSocket<"u"?Ki=MozWebSocket:typeof WebSocket<"u"&&(Ki=WebSocket);class Qe{constructor(e,t,s,i,r,a,l){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=ni(this.connId),this.stats_=Sa(t),this.connURL=Qe.connectionURL_(t,a,l,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const a={};return a[$h]=Aa,typeof location<"u"&&location.hostname&&Qh.test(location.hostname)&&(a[Gh]=Kh),t&&(a[Hh]=t),s&&(a[Yh]=s),i&&(a[Wo]=i),r&&(a[Xh]=r),td(e,Jh,a)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Jt.set("previous_websocket_failure",!0);try{let s;R_(),this.mySock=new Ki(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Qe.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&Ki!==null&&!Qe.forceDisallow_}static previouslyFailed(){return Jt.isInMemoryStorage||Jt.get("previous_websocket_failure")===!0}markConnectionHealthy(){Jt.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=xs(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(k(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=me(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Wh(t,Ng);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Dg))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Qe.responsesRequiredToBeHealthy=2;Qe.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{static get ALL_TRANSPORTS(){return[wn,Qe]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Qe&&Qe.isAvailable();let s=t&&!Qe.previouslyFailed();if(e.webSocketOnly&&(t||Ue("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[Qe];else{const i=this.transports_=[];for(const r of Fs.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);Fs.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Fs.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kg=6e4,Vg=5e3,xg=10*1024,Og=100*1024,Ao="t",Kc="d",Mg="s",Qc="r",Lg="e",Yc="o",Xc="a",Jc="n",Zc="p",Fg="h";class Ug{constructor(e,t,s,i,r,a,l,u,h,f){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=a,this.onReady_=l,this.onDisconnect_=u,this.onKill_=h,this.lastSessionId=f,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=ni("c:"+this.id+":"),this.transportManager_=new Fs(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Ss(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Og?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>xg?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Ao in e){const t=e[Ao];t===Xc?this.upgradeIfSecondaryHealthy_():t===Qc?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Yc&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=ps("t",e),s=ps("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Zc,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Xc,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Jc,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=ps("t",e),s=ps("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=ps(Ao,e);if(Kc in e){const s=e[Kc];if(t===Fg){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===Jc){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Mg?this.onConnectionShutdown_(s):t===Qc?this.onReset_(s):t===Lg?qo("Server Error: "+s):t===Yc?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):qo("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Aa!==s&&Ue("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),Ss(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(kg))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Ss(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Vg))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Zc,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Jt.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ld{constructor(e){this.allowedEvents_=e,this.listeners_={},k(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){k(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi extends ld{static getInstance(){return new Qi}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Ph()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return k(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eu=32,tu=768;class ee{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function J(){return new ee("")}function W(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function Ot(n){return n.pieces_.length-n.pieceNum_}function ne(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new ee(n.pieces_,e)}function ba(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Bg(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function Us(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function cd(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new ee(e,0)}function ae(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof ee)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new ee(t,0)}function $(n){return n.pieceNum_>=n.pieces_.length}function Fe(n,e){const t=W(n),s=W(e);if(t===null)return e;if(t===s)return Fe(ne(n),ne(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function jg(n,e){const t=Us(n,0),s=Us(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=ln(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function Pa(n,e){if(Ot(n)!==Ot(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function $e(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(Ot(n)>Ot(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class qg{constructor(e,t){this.errorPrefix_=t,this.parts_=Us(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=Er(this.parts_[s]);ud(this)}}function Wg(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Er(e),ud(n)}function zg(n){const e=n.parts_.pop();n.byteLength_-=Er(e),n.parts_.length>0&&(n.byteLength_-=1)}function ud(n){if(n.byteLength_>tu)throw new Error(n.errorPrefix_+"has a key path longer than "+tu+" bytes ("+n.byteLength_+").");if(n.parts_.length>eu)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+eu+") or object contains a cycle "+Xt(n))}function Xt(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na extends ld{static getInstance(){return new Na}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}getInitialEvent(e){return k(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _s=1e3,$g=300*1e3,nu=30*1e3,Hg=1.3,Gg=3e4,Kg="server_kill",su=3;class pt extends ad{constructor(e,t,s,i,r,a,l,u){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=a,this.appCheckTokenProvider_=l,this.authOverride_=u,this.id=pt.nextPersistentConnectionId_++,this.log_=ni("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=_s,this.maxReconnectDelay_=$g,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,u)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Na.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Qi.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(me(r)),k(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new et,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:a=>{const l=a.d;a.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,a=e._path.toString();this.log_("Listen called for "+a+" "+r),this.listens.has(a)||this.listens.set(a,new Map),k(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),k(!this.listens.get(a).has(r),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(a).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},a="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(a,r,l=>{const u=l.d,h=l.s;pt.warnOnListenWarnings_(u,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(h,u))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&lt(e,"w")){const s=bn(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();Ue(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||O_(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=nu)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=x_(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,a=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,a))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),k(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},a="n";i&&(r.q=s,r.t=i),this.sendRequest(a,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,a=>{i&&setTimeout(()=>{i(a.s,a.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const a={p:t,d:s};r!==void 0&&(a.h=r),this.outstandingPuts_.push({action:e,request:a,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+me(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):qo("Unrecognized action received from server: "+me(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){k(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=_s,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=_s,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Gg&&(this.reconnectDelay_=_s),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Hg)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+pt.nextConnectionId_++,r=this.lastSessionId;let a=!1,l=null;const u=function(){l?l.close():(a=!0,s())},h=function(p){k(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:u,sendRequest:h};const f=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,m]=await Promise.all([this.authTokenProvider_.getToken(f),this.appCheckTokenProvider_.getToken(f)]);a?Ie("getToken() completed but was canceled"):(Ie("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=m&&m.token,l=new Ug(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,w=>{Ue(w+" ("+this.repoInfo_.toString()+")"),this.interrupt(Kg)},r))}catch(p){this.log_("Failed to get token: "+p),a||(this.repoInfo_.nodeAdmin&&Ue(p),u())}}}interrupt(e){Ie("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Ie("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Oo(this.interruptReasons_)&&(this.reconnectDelay_=_s,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>Ca(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new ee(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){Ie("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=su&&(this.reconnectDelay_=nu,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Ie("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=su&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Bh.replace(/\./g,"-")]=1,Ph()?e["framework.cordova"]=1:S_()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Qi.getInstance().currentlyOnline();return Oo(this.interruptReasons_)&&e}}pt.nextPersistentConnectionId_=0;pt.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ir{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new H(Dn,e),i=new H(Dn,t);return this.compare(s,i)!==0}minPost(){return H.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Di;class hd extends Ir{static get __EMPTY_NODE(){return Di}static set __EMPTY_NODE(e){Di=e}compare(e,t){return ln(e.name,t.name)}isDefinedOn(e){throw jn("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return H.MIN}maxPost(){return new H(nn,Di)}makePost(e,t){return k(typeof e=="string","KeyIndex indexValue must always be a string."),new H(e,Di)}toString(){return".key"}}const An=new hd;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ki=class{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let a=1;for(;!e.isEmpty();)if(e=e,a=t?s(e.key,t):1,i&&(a*=-1),a<0)this.isReverse_?e=e.left:e=e.right;else if(a===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},qe=class ys{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??ys.RED,this.left=i??tt.EMPTY_NODE,this.right=r??tt.EMPTY_NODE}copy(e,t,s,i,r){return new ys(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return tt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return tt.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,ys.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,ys.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};qe.RED=!0;qe.BLACK=!1;class Qg{copy(e,t,s,i,r){return this}insert(e,t,s){return new qe(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let tt=class Ui{constructor(e,t=Ui.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new Ui(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,qe.BLACK,null,null))}remove(e){return new Ui(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,qe.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ki(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ki(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ki(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ki(this.root_,null,this.comparator_,!0,e)}};tt.EMPTY_NODE=new Qg;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yg(n,e){return ln(n.name,e.name)}function Da(n,e){return ln(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zo;function Xg(n){zo=n}const dd=function(n){return typeof n=="number"?"number:"+zh(n):"string:"+n},fd=function(n){if(n.isLeafNode()){const e=n.val();k(typeof e=="string"||typeof e=="number"||typeof e=="object"&&lt(e,".sv"),"Priority must be a string or number.")}else k(n===zo||n.isEmpty(),"priority of unexpected type.");k(n===zo||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let iu;class Ee{static set __childrenNodeConstructor(e){iu=e}static get __childrenNodeConstructor(){return iu}constructor(e,t=Ee.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,k(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),fd(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Ee(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Ee.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return $(e)?this:W(e)===".priority"?this.priorityNode_:Ee.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Ee.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=W(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(k(s!==".priority"||Ot(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,Ee.__childrenNodeConstructor.EMPTY_NODE.updateChild(ne(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+dd(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=zh(this.value_):e+=this.value_,this.lazyHash_=qh(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Ee.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Ee.__childrenNodeConstructor?-1:(k(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=Ee.VALUE_TYPE_ORDER.indexOf(t),r=Ee.VALUE_TYPE_ORDER.indexOf(s);return k(i>=0,"Unknown leaf type: "+t),k(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Ee.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pd,_d;function Jg(n){pd=n}function Zg(n){_d=n}class ey extends Ir{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?ln(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return H.MIN}maxPost(){return new H(nn,new Ee("[PRIORITY-POST]",_d))}makePost(e,t){const s=pd(e);return new H(t,new Ee("[PRIORITY-POST]",s))}toString(){return".priority"}}const le=new ey;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ty=Math.log(2);class ny{constructor(e){const t=r=>parseInt(Math.log(r)/ty,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Yi=function(n,e,t,s){n.sort(e);const i=function(u,h){const f=h-u;let p,m;if(f===0)return null;if(f===1)return p=n[u],m=t?t(p):p,new qe(m,p.node,qe.BLACK,null,null);{const w=parseInt(f/2,10)+u,R=i(u,w),D=i(w+1,h);return p=n[w],m=t?t(p):p,new qe(m,p.node,qe.BLACK,R,D)}},r=function(u){let h=null,f=null,p=n.length;const m=function(R,D){const N=p-R,q=p;p-=R;const j=i(N+1,q),G=n[N],ue=t?t(G):G;w(new qe(ue,G.node,D,null,j))},w=function(R){h?(h.left=R,h=R):(f=R,h=R)};for(let R=0;R<u.count;++R){const D=u.nextBitIsOne(),N=Math.pow(2,u.count-(R+1));D?m(N,qe.BLACK):(m(N,qe.BLACK),m(N,qe.RED))}return f},a=new ny(n.length),l=r(a);return new tt(s||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let So;const yn={};class ft{static get Default(){return k(yn&&le,"ChildrenNode.ts has not been loaded"),So=So||new ft({".priority":yn},{".priority":le}),So}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=bn(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof tt?t:null}hasIndex(e){return lt(this.indexSet_,e.toString())}addIndex(e,t){k(e!==An,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(H.Wrap);let a=r.getNext();for(;a;)i=i||e.isDefinedOn(a.node),s.push(a),a=r.getNext();let l;i?l=Yi(s,e.getCompare()):l=yn;const u=e.toString(),h=Object.assign({},this.indexSet_);h[u]=e;const f=Object.assign({},this.indexes_);return f[u]=l,new ft(f,h)}addToIndexes(e,t){const s=Gi(this.indexes_,(i,r)=>{const a=bn(this.indexSet_,r);if(k(a,"Missing index implementation for "+r),i===yn)if(a.isDefinedOn(e.node)){const l=[],u=t.getIterator(H.Wrap);let h=u.getNext();for(;h;)h.name!==e.name&&l.push(h),h=u.getNext();return l.push(e),Yi(l,a.getCompare())}else return yn;else{const l=t.get(e.name);let u=i;return l&&(u=u.remove(new H(e.name,l))),u.insert(e,e.node)}});return new ft(s,this.indexSet_)}removeFromIndexes(e,t){const s=Gi(this.indexes_,i=>{if(i===yn)return i;{const r=t.get(e.name);return r?i.remove(new H(e.name,r)):i}});return new ft(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ms;class L{static get EMPTY_NODE(){return ms||(ms=new L(new tt(Da),null,ft.Default))}constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&fd(this.priorityNode_),this.children_.isEmpty()&&k(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||ms}updatePriority(e){return this.children_.isEmpty()?this:new L(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?ms:t}}getChild(e){const t=W(e);return t===null?this:this.getImmediateChild(t).getChild(ne(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(k(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new H(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const a=i.isEmpty()?ms:this.priorityNode_;return new L(i,a,r)}}updateChild(e,t){const s=W(e);if(s===null)return t;{k(W(e)!==".priority"||Ot(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(ne(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(le,(a,l)=>{t[a]=l.val(e),s++,r&&L.INTEGER_REGEXP_.test(a)?i=Math.max(i,Number(a)):r=!1}),!e&&r&&i<2*s){const a=[];for(const l in t)a[l]=t[l];return a}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+dd(this.getPriority().val())+":"),this.forEachChild(le,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":qh(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new H(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new H(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new H(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,H.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,H.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===si?-1:0}withIndex(e){if(e===An||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new L(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===An||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(le),i=t.getIterator(le);let r=s.getNext(),a=i.getNext();for(;r&&a;){if(r.name!==a.name||!r.node.equals(a.node))return!1;r=s.getNext(),a=i.getNext()}return r===null&&a===null}else return!1;else return!1}}resolveIndex_(e){return e===An?null:this.indexMap_.get(e.toString())}}L.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class sy extends L{constructor(){super(new tt(Da),L.EMPTY_NODE,ft.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return L.EMPTY_NODE}isEmpty(){return!1}}const si=new sy;Object.defineProperties(H,{MIN:{value:new H(Dn,L.EMPTY_NODE)},MAX:{value:new H(nn,si)}});hd.__EMPTY_NODE=L.EMPTY_NODE;Ee.__childrenNodeConstructor=L;Xg(si);Zg(si);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy=!0;function de(n,e=null){if(n===null)return L.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),k(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new Ee(t,de(e))}if(!(n instanceof Array)&&iy){const t=[];let s=!1;if(we(n,(a,l)=>{if(a.substring(0,1)!=="."){const u=de(l);u.isEmpty()||(s=s||!u.getPriority().isEmpty(),t.push(new H(a,u)))}}),t.length===0)return L.EMPTY_NODE;const r=Yi(t,Yg,a=>a.name,Da);if(s){const a=Yi(t,le.getCompare());return new L(r,de(e),new ft({".priority":a},{".priority":le}))}else return new L(r,de(e),ft.Default)}else{let t=L.EMPTY_NODE;return we(n,(s,i)=>{if(lt(n,s)&&s.substring(0,1)!=="."){const r=de(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(de(e))}}Jg(de);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry extends Ir{constructor(e){super(),this.indexPath_=e,k(!$(e)&&W(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?ln(e.name,t.name):r}makePost(e,t){const s=de(e),i=L.EMPTY_NODE.updateChild(this.indexPath_,s);return new H(t,i)}maxPost(){const e=L.EMPTY_NODE.updateChild(this.indexPath_,si);return new H(nn,e)}toString(){return Us(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy extends Ir{compare(e,t){const s=e.node.compareTo(t.node);return s===0?ln(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return H.MIN}maxPost(){return H.MAX}makePost(e,t){const s=de(e);return new H(t,s)}toString(){return".value"}}const ay=new oy;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(n){return{type:"value",snapshotNode:n}}function kn(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Bs(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function js(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function ly(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ka{constructor(e){this.index_=e}updateChild(e,t,s,i,r,a){k(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(i).equals(s.getChild(i))&&l.isEmpty()===s.isEmpty()||(a!=null&&(s.isEmpty()?e.hasChild(t)?a.trackChildChange(Bs(t,l)):k(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?a.trackChildChange(kn(t,s)):a.trackChildChange(js(t,s,l))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(le,(i,r)=>{t.hasChild(i)||s.trackChildChange(Bs(i,r))}),t.isLeafNode()||t.forEachChild(le,(i,r)=>{if(e.hasChild(i)){const a=e.getImmediateChild(i);a.equals(r)||s.trackChildChange(js(i,r,a))}else s.trackChildChange(kn(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?L.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e){this.indexedFilter_=new ka(e.getIndex()),this.index_=e.getIndex(),this.startPost_=qs.getStartPost_(e),this.endPost_=qs.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,a){return this.matches(new H(t,s))||(s=L.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,a)}updateFullNode(e,t,s){t.isLeafNode()&&(t=L.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(L.EMPTY_NODE);const r=this;return t.forEachChild(le,(a,l)=>{r.matches(new H(a,l))||(i=i.updateImmediateChild(a,L.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new qs(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,a){return this.rangedFilter_.matches(new H(t,s))||(s=L.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,a):this.fullLimitUpdateChild_(e,t,s,r,a)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=L.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=L.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let a=0;for(;r.hasNext()&&a<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),a++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(L.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let a=0;for(;r.hasNext();){const l=r.getNext();a<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?a++:i=i.updateImmediateChild(l.name,L.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let a;if(this.reverse_){const p=this.index_.getCompare();a=(m,w)=>p(w,m)}else a=this.index_.getCompare();const l=e;k(l.numChildren()===this.limit_,"");const u=new H(t,s),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),f=this.rangedFilter_.matches(u);if(l.hasChild(t)){const p=l.getImmediateChild(t);let m=i.getChildAfterChild(this.index_,h,this.reverse_);for(;m!=null&&(m.name===t||l.hasChild(m.name));)m=i.getChildAfterChild(this.index_,m,this.reverse_);const w=m==null?1:a(m,u);if(f&&!s.isEmpty()&&w>=0)return r!=null&&r.trackChildChange(js(t,s,p)),l.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(Bs(t,p));const D=l.updateImmediateChild(t,L.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(r!=null&&r.trackChildChange(kn(m.name,m.node)),D.updateImmediateChild(m.name,m.node)):D}}else return s.isEmpty()?e:f&&a(h,u)>=0?(r!=null&&(r.trackChildChange(Bs(h.name,h.node)),r.trackChildChange(kn(t,s))),l.updateImmediateChild(t,s).updateImmediateChild(h.name,L.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=le}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return k(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return k(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Dn}hasEnd(){return this.endSet_}getIndexEndValue(){return k(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return k(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:nn}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return k(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===le}copy(){const e=new Va;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function uy(n){return n.loadsAllData()?new ka(n.getIndex()):n.hasLimit()?new cy(n):new qs(n)}function ru(n){const e={};if(n.isDefault())return e;let t;if(n.index_===le?t="$priority":n.index_===ay?t="$value":n.index_===An?t="$key":(k(n.index_ instanceof ry,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=me(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=me(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+me(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=me(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+me(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function ou(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==le&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi extends ad{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(k(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=ni("p:rest:"),this.listens_={}}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const a=Xi.getListenId_(e,s),l={};this.listens_[a]=l;const u=ru(e._queryParams);this.restRequest_(r+".json",u,(h,f)=>{let p=f;if(h===404&&(p=null,h=null),h===null&&this.onDataUpdate_(r,p,!1,s),bn(this.listens_,a)===l){let m;h?h===401?m="permission_denied":m="rest_error:"+h:m="ok",i(m,null)}})}unlisten(e,t){const s=Xi.getListenId_(e,t);delete this.listens_[s]}get(e){const t=ru(e._queryParams),s=e._path.toString(),i=new et;return this.restRequest_(s+".json",t,(r,a)=>{let l=a;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(s,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const a=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+M_(t);this.log_("Sending REST request for "+a);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(s&&l.readyState===4){this.log_("REST Response for "+a+" received. status:",l.status,"response:",l.responseText);let u=null;if(l.status>=200&&l.status<300){try{u=xs(l.responseText)}catch{Ue("Failed to parse JSON response for "+a+": "+l.responseText)}s(null,u)}else l.status!==401&&l.status!==404&&Ue("Got unsuccessful REST response for "+a+" Status: "+l.status),s(l.status);s=null}},l.open("GET",a,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hy{constructor(){this.rootNode_=L.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ji(){return{value:null,children:new Map}}function zn(n,e,t){if($(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=W(e);n.children.has(s)||n.children.set(s,Ji());const i=n.children.get(s);e=ne(e),zn(i,e,t)}}function $o(n,e){if($(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{const t=n.value;return n.value=null,t.forEachChild(le,(s,i)=>{zn(n,new ee(s),i)}),$o(n,e)}}else if(n.children.size>0){const t=W(e);return e=ne(e),n.children.has(t)&&$o(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function Ho(n,e,t){n.value!==null?t(e,n.value):dy(n,(s,i)=>{const r=new ee(e.toString()+"/"+s);Ho(i,r,t)})}function dy(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fy{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&we(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const au=10*1e3,py=30*1e3,_y=300*1e3;class my{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new fy(e);const s=au+(py-au)*Math.random();Ss(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;we(e,(i,r)=>{r>0&&lt(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),Ss(this.reportStats_.bind(this),Math.floor(Math.random()*2*_y))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ye;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Ye||(Ye={}));function xa(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Oa(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ma(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=Ye.ACK_USER_WRITE,this.source=xa()}operationForChild(e){if($(this.path)){if(this.affectedTree.value!=null)return k(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new ee(e));return new Zi(J(),t,this.revert)}}else return k(W(this.path)===e,"operationForChild called for unrelated child."),new Zi(ne(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(e,t){this.source=e,this.path=t,this.type=Ye.LISTEN_COMPLETE}operationForChild(e){return $(this.path)?new Ws(this.source,J()):new Ws(this.source,ne(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=Ye.OVERWRITE}operationForChild(e){return $(this.path)?new sn(this.source,J(),this.snap.getImmediateChild(e)):new sn(this.source,ne(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=Ye.MERGE}operationForChild(e){if($(this.path)){const t=this.children.subtree(new ee(e));return t.isEmpty()?null:t.value?new sn(this.source,J(),t.value):new Vn(this.source,J(),t)}else return k(W(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Vn(this.source,ne(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if($(e))return this.isFullyInitialized()&&!this.filtered_;const t=W(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function yy(n,e,t,s){const i=[],r=[];return e.forEach(a=>{a.type==="child_changed"&&n.index_.indexedValueChanged(a.oldSnap,a.snapshotNode)&&r.push(ly(a.childName,a.snapshotNode))}),gs(n,i,"child_removed",e,s,t),gs(n,i,"child_added",e,s,t),gs(n,i,"child_moved",r,s,t),gs(n,i,"child_changed",e,s,t),gs(n,i,"value",e,s,t),i}function gs(n,e,t,s,i,r){const a=s.filter(l=>l.type===t);a.sort((l,u)=>Ey(n,l,u)),a.forEach(l=>{const u=vy(n,l,r);i.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(u,n.query_))})})}function vy(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function Ey(n,e,t){if(e.childName==null||t.childName==null)throw jn("Should only compare child_ events.");const s=new H(e.childName,e.snapshotNode),i=new H(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(n,e){return{eventCache:n,serverCache:e}}function Rs(n,e,t,s){return wr(new Mt(e,t,s),n.serverCache)}function gd(n,e,t,s){return wr(n.eventCache,new Mt(e,t,s))}function er(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function rn(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ro;const Ty=()=>(Ro||(Ro=new tt(rg)),Ro);class se{static fromObject(e){let t=new se(null);return we(e,(s,i)=>{t=t.set(new ee(s),i)}),t}constructor(e,t=Ty()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:J(),value:this.value};if($(e))return null;{const s=W(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(ne(e),t);return r!=null?{path:ae(new ee(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if($(e))return this;{const t=W(e),s=this.children.get(t);return s!==null?s.subtree(ne(e)):new se(null)}}set(e,t){if($(e))return new se(t,this.children);{const s=W(e),r=(this.children.get(s)||new se(null)).set(ne(e),t),a=this.children.insert(s,r);return new se(this.value,a)}}remove(e){if($(e))return this.children.isEmpty()?new se(null):new se(null,this.children);{const t=W(e),s=this.children.get(t);if(s){const i=s.remove(ne(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new se(null):new se(this.value,r)}else return this}}get(e){if($(e))return this.value;{const t=W(e),s=this.children.get(t);return s?s.get(ne(e)):null}}setTree(e,t){if($(e))return t;{const s=W(e),r=(this.children.get(s)||new se(null)).setTree(ne(e),t);let a;return r.isEmpty()?a=this.children.remove(s):a=this.children.insert(s,r),new se(this.value,a)}}fold(e){return this.fold_(J(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(ae(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,J(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if($(e))return null;{const r=W(e),a=this.children.get(r);return a?a.findOnPath_(ne(e),ae(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,J(),t)}foreachOnPath_(e,t,s){if($(e))return this;{this.value&&s(t,this.value);const i=W(e),r=this.children.get(i);return r?r.foreachOnPath_(ne(e),ae(t,i),s):new se(null)}}foreach(e){this.foreach_(J(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(ae(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.writeTree_=e}static empty(){return new Je(new se(null))}}function bs(n,e,t){if($(e))return new Je(new se(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const a=Fe(i,e);return r=r.updateChild(a,t),new Je(n.writeTree_.set(i,r))}else{const i=new se(t),r=n.writeTree_.setTree(e,i);return new Je(r)}}}function Go(n,e,t){let s=n;return we(t,(i,r)=>{s=bs(s,ae(e,i),r)}),s}function lu(n,e){if($(e))return Je.empty();{const t=n.writeTree_.setTree(e,new se(null));return new Je(t)}}function Ko(n,e){return cn(n,e)!=null}function cn(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(Fe(t.path,e)):null}function cu(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(le,(s,i)=>{e.push(new H(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new H(s,i.value))}),e}function Nt(n,e){if($(e))return n;{const t=cn(n,e);return t!=null?new Je(new se(t)):new Je(n.writeTree_.subtree(e))}}function Qo(n){return n.writeTree_.isEmpty()}function xn(n,e){return yd(J(),n.writeTree_,e)}function yd(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(k(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=yd(ae(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(ae(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cr(n,e){return Id(e,n)}function Iy(n,e,t,s,i){k(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=bs(n.visibleWrites,e,t)),n.lastWriteId=s}function wy(n,e,t,s){k(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=Go(n.visibleWrites,e,t),n.lastWriteId=s}function Cy(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function Ay(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);k(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,a=n.allWrites.length-1;for(;i&&a>=0;){const l=n.allWrites[a];l.visible&&(a>=t&&Sy(l,s.path)?i=!1:$e(s.path,l.path)&&(r=!0)),a--}if(i){if(r)return Ry(n),!0;if(s.snap)n.visibleWrites=lu(n.visibleWrites,s.path);else{const l=s.children;we(l,u=>{n.visibleWrites=lu(n.visibleWrites,ae(s.path,u))})}return!0}else return!1}function Sy(n,e){if(n.snap)return $e(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&$e(ae(n.path,t),e))return!0;return!1}function Ry(n){n.visibleWrites=vd(n.allWrites,by,J()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function by(n){return n.visible}function vd(n,e,t){let s=Je.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const a=r.path;let l;if(r.snap)$e(t,a)?(l=Fe(t,a),s=bs(s,l,r.snap)):$e(a,t)&&(l=Fe(a,t),s=bs(s,J(),r.snap.getChild(l)));else if(r.children){if($e(t,a))l=Fe(t,a),s=Go(s,l,r.children);else if($e(a,t))if(l=Fe(a,t),$(l))s=Go(s,J(),r.children);else{const u=bn(r.children,W(l));if(u){const h=u.getChild(ne(l));s=bs(s,J(),h)}}}else throw jn("WriteRecord should have .snap or .children")}}return s}function Ed(n,e,t,s,i){if(!s&&!i){const r=cn(n.visibleWrites,e);if(r!=null)return r;{const a=Nt(n.visibleWrites,e);if(Qo(a))return t;if(t==null&&!Ko(a,J()))return null;{const l=t||L.EMPTY_NODE;return xn(a,l)}}}else{const r=Nt(n.visibleWrites,e);if(!i&&Qo(r))return t;if(!i&&t==null&&!Ko(r,J()))return null;{const a=function(h){return(h.visible||i)&&(!s||!~s.indexOf(h.writeId))&&($e(h.path,e)||$e(e,h.path))},l=vd(n.allWrites,a,e),u=t||L.EMPTY_NODE;return xn(l,u)}}}function Py(n,e,t){let s=L.EMPTY_NODE;const i=cn(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(le,(r,a)=>{s=s.updateImmediateChild(r,a)}),s;if(t){const r=Nt(n.visibleWrites,e);return t.forEachChild(le,(a,l)=>{const u=xn(Nt(r,new ee(a)),l);s=s.updateImmediateChild(a,u)}),cu(r).forEach(a=>{s=s.updateImmediateChild(a.name,a.node)}),s}else{const r=Nt(n.visibleWrites,e);return cu(r).forEach(a=>{s=s.updateImmediateChild(a.name,a.node)}),s}}function Ny(n,e,t,s,i){k(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=ae(e,t);if(Ko(n.visibleWrites,r))return null;{const a=Nt(n.visibleWrites,r);return Qo(a)?i.getChild(t):xn(a,i.getChild(t))}}function Dy(n,e,t,s){const i=ae(e,t),r=cn(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const a=Nt(n.visibleWrites,i);return xn(a,s.getNode().getImmediateChild(t))}else return null}function ky(n,e){return cn(n.visibleWrites,e)}function Vy(n,e,t,s,i,r,a){let l;const u=Nt(n.visibleWrites,e),h=cn(u,J());if(h!=null)l=h;else if(t!=null)l=xn(u,t);else return[];if(l=l.withIndex(a),!l.isEmpty()&&!l.isLeafNode()){const f=[],p=a.getCompare(),m=r?l.getReverseIteratorFrom(s,a):l.getIteratorFrom(s,a);let w=m.getNext();for(;w&&f.length<i;)p(w,s)!==0&&f.push(w),w=m.getNext();return f}else return[]}function xy(){return{visibleWrites:Je.empty(),allWrites:[],lastWriteId:-1}}function tr(n,e,t,s){return Ed(n.writeTree,n.treePath,e,t,s)}function La(n,e){return Py(n.writeTree,n.treePath,e)}function uu(n,e,t,s){return Ny(n.writeTree,n.treePath,e,t,s)}function nr(n,e){return ky(n.writeTree,ae(n.treePath,e))}function Oy(n,e,t,s,i,r){return Vy(n.writeTree,n.treePath,e,t,s,i,r)}function Fa(n,e,t){return Dy(n.writeTree,n.treePath,e,t)}function Td(n,e){return Id(ae(n.treePath,e),n.writeTree)}function Id(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;k(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),k(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,js(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,Bs(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,kn(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,js(s,e.snapshotNode,i.oldSnap));else throw jn("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const wd=new Ly;class Ua{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new Mt(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Fa(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:rn(this.viewCache_),r=Oy(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fy(n){return{filter:n}}function Uy(n,e){k(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),k(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function By(n,e,t,s,i){const r=new My;let a,l;if(t.type===Ye.OVERWRITE){const h=t;h.source.fromUser?a=Yo(n,e,h.path,h.snap,s,i,r):(k(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!$(h.path),a=sr(n,e,h.path,h.snap,s,i,l,r))}else if(t.type===Ye.MERGE){const h=t;h.source.fromUser?a=qy(n,e,h.path,h.children,s,i,r):(k(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),a=Xo(n,e,h.path,h.children,s,i,l,r))}else if(t.type===Ye.ACK_USER_WRITE){const h=t;h.revert?a=$y(n,e,h.path,s,i,r):a=Wy(n,e,h.path,h.affectedTree,s,i,r)}else if(t.type===Ye.LISTEN_COMPLETE)a=zy(n,e,t.path,s,r);else throw jn("Unknown operation type: "+t.type);const u=r.getChanges();return jy(e,a,u),{viewCache:a,changes:u}}function jy(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=er(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(md(er(e)))}}function Cd(n,e,t,s,i,r){const a=e.eventCache;if(nr(s,t)!=null)return e;{let l,u;if($(t))if(k(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=rn(e),f=h instanceof L?h:L.EMPTY_NODE,p=La(s,f);l=n.filter.updateFullNode(e.eventCache.getNode(),p,r)}else{const h=tr(s,rn(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=W(t);if(h===".priority"){k(Ot(t)===1,"Can't have a priority with additional path components");const f=a.getNode();u=e.serverCache.getNode();const p=uu(s,t,f,u);p!=null?l=n.filter.updatePriority(f,p):l=a.getNode()}else{const f=ne(t);let p;if(a.isCompleteForChild(h)){u=e.serverCache.getNode();const m=uu(s,t,a.getNode(),u);m!=null?p=a.getNode().getImmediateChild(h).updateChild(f,m):p=a.getNode().getImmediateChild(h)}else p=Fa(s,h,e.serverCache);p!=null?l=n.filter.updateChild(a.getNode(),h,p,f,i,r):l=a.getNode()}}return Rs(e,l,a.isFullyInitialized()||$(t),n.filter.filtersNodes())}}function sr(n,e,t,s,i,r,a,l){const u=e.serverCache;let h;const f=a?n.filter:n.filter.getIndexedFilter();if($(t))h=f.updateFullNode(u.getNode(),s,null);else if(f.filtersNodes()&&!u.isFiltered()){const w=u.getNode().updateChild(t,s);h=f.updateFullNode(u.getNode(),w,null)}else{const w=W(t);if(!u.isCompleteForPath(t)&&Ot(t)>1)return e;const R=ne(t),N=u.getNode().getImmediateChild(w).updateChild(R,s);w===".priority"?h=f.updatePriority(u.getNode(),N):h=f.updateChild(u.getNode(),w,N,R,wd,null)}const p=gd(e,h,u.isFullyInitialized()||$(t),f.filtersNodes()),m=new Ua(i,p,r);return Cd(n,p,t,i,m,l)}function Yo(n,e,t,s,i,r,a){const l=e.eventCache;let u,h;const f=new Ua(i,e,r);if($(t))h=n.filter.updateFullNode(e.eventCache.getNode(),s,a),u=Rs(e,h,!0,n.filter.filtersNodes());else{const p=W(t);if(p===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),s),u=Rs(e,h,l.isFullyInitialized(),l.isFiltered());else{const m=ne(t),w=l.getNode().getImmediateChild(p);let R;if($(m))R=s;else{const D=f.getCompleteChild(p);D!=null?ba(m)===".priority"&&D.getChild(cd(m)).isEmpty()?R=D:R=D.updateChild(m,s):R=L.EMPTY_NODE}if(w.equals(R))u=e;else{const D=n.filter.updateChild(l.getNode(),p,R,m,f,a);u=Rs(e,D,l.isFullyInitialized(),n.filter.filtersNodes())}}}return u}function hu(n,e){return n.eventCache.isCompleteForChild(e)}function qy(n,e,t,s,i,r,a){let l=e;return s.foreach((u,h)=>{const f=ae(t,u);hu(e,W(f))&&(l=Yo(n,l,f,h,i,r,a))}),s.foreach((u,h)=>{const f=ae(t,u);hu(e,W(f))||(l=Yo(n,l,f,h,i,r,a))}),l}function du(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function Xo(n,e,t,s,i,r,a,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let u=e,h;$(t)?h=s:h=new se(null).setTree(t,s);const f=e.serverCache.getNode();return h.children.inorderTraversal((p,m)=>{if(f.hasChild(p)){const w=e.serverCache.getNode().getImmediateChild(p),R=du(n,w,m);u=sr(n,u,new ee(p),R,i,r,a,l)}}),h.children.inorderTraversal((p,m)=>{const w=!e.serverCache.isCompleteForChild(p)&&m.value===null;if(!f.hasChild(p)&&!w){const R=e.serverCache.getNode().getImmediateChild(p),D=du(n,R,m);u=sr(n,u,new ee(p),D,i,r,a,l)}}),u}function Wy(n,e,t,s,i,r,a){if(nr(i,t)!=null)return e;const l=e.serverCache.isFiltered(),u=e.serverCache;if(s.value!=null){if($(t)&&u.isFullyInitialized()||u.isCompleteForPath(t))return sr(n,e,t,u.getNode().getChild(t),i,r,l,a);if($(t)){let h=new se(null);return u.getNode().forEachChild(An,(f,p)=>{h=h.set(new ee(f),p)}),Xo(n,e,t,h,i,r,l,a)}else return e}else{let h=new se(null);return s.foreach((f,p)=>{const m=ae(t,f);u.isCompleteForPath(m)&&(h=h.set(f,u.getNode().getChild(m)))}),Xo(n,e,t,h,i,r,l,a)}}function zy(n,e,t,s,i){const r=e.serverCache,a=gd(e,r.getNode(),r.isFullyInitialized()||$(t),r.isFiltered());return Cd(n,a,t,s,wd,i)}function $y(n,e,t,s,i,r){let a;if(nr(s,t)!=null)return e;{const l=new Ua(s,e,i),u=e.eventCache.getNode();let h;if($(t)||W(t)===".priority"){let f;if(e.serverCache.isFullyInitialized())f=tr(s,rn(e));else{const p=e.serverCache.getNode();k(p instanceof L,"serverChildren would be complete if leaf node"),f=La(s,p)}f=f,h=n.filter.updateFullNode(u,f,r)}else{const f=W(t);let p=Fa(s,f,e.serverCache);p==null&&e.serverCache.isCompleteForChild(f)&&(p=u.getImmediateChild(f)),p!=null?h=n.filter.updateChild(u,f,p,ne(t),l,r):e.eventCache.getNode().hasChild(f)?h=n.filter.updateChild(u,f,L.EMPTY_NODE,ne(t),l,r):h=u,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(a=tr(s,rn(e)),a.isLeafNode()&&(h=n.filter.updateFullNode(h,a,r)))}return a=e.serverCache.isFullyInitialized()||nr(s,J())!=null,Rs(e,h,a,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new ka(s.getIndex()),r=uy(s);this.processor_=Fy(r);const a=t.serverCache,l=t.eventCache,u=i.updateFullNode(L.EMPTY_NODE,a.getNode(),null),h=r.updateFullNode(L.EMPTY_NODE,l.getNode(),null),f=new Mt(u,a.isFullyInitialized(),i.filtersNodes()),p=new Mt(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=wr(p,f),this.eventGenerator_=new gy(this.query_)}get query(){return this.query_}}function Gy(n){return n.viewCache_.serverCache.getNode()}function Ky(n){return er(n.viewCache_)}function Qy(n,e){const t=rn(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!$(e)&&!t.getImmediateChild(W(e)).isEmpty())?t.getChild(e):null}function fu(n){return n.eventRegistrations_.length===0}function Yy(n,e){n.eventRegistrations_.push(e)}function pu(n,e,t){const s=[];if(t){k(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const a=r.createCancelEvent(t,i);a&&s.push(a)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const a=n.eventRegistrations_[r];if(!a.matches(e))i.push(a);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function _u(n,e,t,s){e.type===Ye.MERGE&&e.source.queryId!==null&&(k(rn(n.viewCache_),"We should always have a full cache before handling merges"),k(er(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=By(n.processor_,i,e,t,s);return Uy(n.processor_,r.viewCache),k(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Ad(n,r.changes,r.viewCache.eventCache.getNode(),null)}function Xy(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(le,(r,a)=>{s.push(kn(r,a))}),t.isFullyInitialized()&&s.push(md(t.getNode())),Ad(n,s,t.getNode(),e)}function Ad(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return yy(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ir;class Sd{constructor(){this.views=new Map}}function Jy(n){k(!ir,"__referenceConstructor has already been defined"),ir=n}function Zy(){return k(ir,"Reference.ts has not been loaded"),ir}function ev(n){return n.views.size===0}function Ba(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return k(r!=null,"SyncTree gave us an op for an invalid query."),_u(r,e,t,s)}else{let r=[];for(const a of n.views.values())r=r.concat(_u(a,e,t,s));return r}}function Rd(n,e,t,s,i){const r=e._queryIdentifier,a=n.views.get(r);if(!a){let l=tr(t,i?s:null),u=!1;l?u=!0:s instanceof L?(l=La(t,s),u=!1):(l=L.EMPTY_NODE,u=!1);const h=wr(new Mt(l,u,!1),new Mt(s,i,!1));return new Hy(e,h)}return a}function tv(n,e,t,s,i,r){const a=Rd(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,a),Yy(a,t),Xy(a,t)}function nv(n,e,t,s){const i=e._queryIdentifier,r=[];let a=[];const l=Lt(n);if(i==="default")for(const[u,h]of n.views.entries())a=a.concat(pu(h,t,s)),fu(h)&&(n.views.delete(u),h.query._queryParams.loadsAllData()||r.push(h.query));else{const u=n.views.get(i);u&&(a=a.concat(pu(u,t,s)),fu(u)&&(n.views.delete(i),u.query._queryParams.loadsAllData()||r.push(u.query)))}return l&&!Lt(n)&&r.push(new(Zy())(e._repo,e._path)),{removed:r,events:a}}function bd(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Dt(n,e){let t=null;for(const s of n.views.values())t=t||Qy(s,e);return t}function Pd(n,e){if(e._queryParams.loadsAllData())return Ar(n);{const s=e._queryIdentifier;return n.views.get(s)}}function Nd(n,e){return Pd(n,e)!=null}function Lt(n){return Ar(n)!=null}function Ar(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rr;function sv(n){k(!rr,"__referenceConstructor has already been defined"),rr=n}function iv(){return k(rr,"Reference.ts has not been loaded"),rr}let rv=1;class mu{constructor(e){this.listenProvider_=e,this.syncPointTree_=new se(null),this.pendingWriteTree_=xy(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Dd(n,e,t,s,i){return Iy(n.pendingWriteTree_,e,t,s,i),i?$n(n,new sn(xa(),e,t)):[]}function ov(n,e,t,s){wy(n.pendingWriteTree_,e,t,s);const i=se.fromObject(t);return $n(n,new Vn(xa(),e,i))}function At(n,e,t=!1){const s=Cy(n.pendingWriteTree_,e);if(Ay(n.pendingWriteTree_,e)){let r=new se(null);return s.snap!=null?r=r.set(J(),!0):we(s.children,a=>{r=r.set(new ee(a),!0)}),$n(n,new Zi(s.path,r,t))}else return[]}function ii(n,e,t){return $n(n,new sn(Oa(),e,t))}function av(n,e,t){const s=se.fromObject(t);return $n(n,new Vn(Oa(),e,s))}function lv(n,e){return $n(n,new Ws(Oa(),e))}function cv(n,e,t){const s=qa(n,t);if(s){const i=Wa(s),r=i.path,a=i.queryId,l=Fe(r,e),u=new Ws(Ma(a),l);return za(n,r,u)}else return[]}function or(n,e,t,s,i=!1){const r=e._path,a=n.syncPointTree_.get(r);let l=[];if(a&&(e._queryIdentifier==="default"||Nd(a,e))){const u=nv(a,e,t,s);ev(a)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=u.removed;if(l=u.events,!i){const f=h.findIndex(m=>m._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(r,(m,w)=>Lt(w));if(f&&!p){const m=n.syncPointTree_.subtree(r);if(!m.isEmpty()){const w=dv(m);for(let R=0;R<w.length;++R){const D=w[R],N=D.query,q=Od(n,D);n.listenProvider_.startListening(Ps(N),zs(n,N),q.hashFn,q.onComplete)}}}!p&&h.length>0&&!s&&(f?n.listenProvider_.stopListening(Ps(e),null):h.forEach(m=>{const w=n.queryToTagMap.get(Sr(m));n.listenProvider_.stopListening(Ps(m),w)}))}fv(n,h)}return l}function kd(n,e,t,s){const i=qa(n,s);if(i!=null){const r=Wa(i),a=r.path,l=r.queryId,u=Fe(a,e),h=new sn(Ma(l),u,t);return za(n,a,h)}else return[]}function uv(n,e,t,s){const i=qa(n,s);if(i){const r=Wa(i),a=r.path,l=r.queryId,u=Fe(a,e),h=se.fromObject(t),f=new Vn(Ma(l),u,h);return za(n,a,f)}else return[]}function Jo(n,e,t,s=!1){const i=e._path;let r=null,a=!1;n.syncPointTree_.foreachOnPath(i,(m,w)=>{const R=Fe(m,i);r=r||Dt(w,R),a=a||Lt(w)});let l=n.syncPointTree_.get(i);l?(a=a||Lt(l),r=r||Dt(l,J())):(l=new Sd,n.syncPointTree_=n.syncPointTree_.set(i,l));let u;r!=null?u=!0:(u=!1,r=L.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((w,R)=>{const D=Dt(R,J());D&&(r=r.updateImmediateChild(w,D))}));const h=Nd(l,e);if(!h&&!e._queryParams.loadsAllData()){const m=Sr(e);k(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const w=pv();n.queryToTagMap.set(m,w),n.tagToQueryMap.set(w,m)}const f=Cr(n.pendingWriteTree_,i);let p=tv(l,e,t,f,r,u);if(!h&&!a&&!s){const m=Pd(l,e);p=p.concat(_v(n,e,m))}return p}function ja(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(a,l)=>{const u=Fe(a,e),h=Dt(l,u);if(h)return h});return Ed(i,e,r,t,!0)}function hv(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(h,f)=>{const p=Fe(h,t);s=s||Dt(f,p)});let i=n.syncPointTree_.get(t);i?s=s||Dt(i,J()):(i=new Sd,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,a=r?new Mt(s,!0,!1):null,l=Cr(n.pendingWriteTree_,e._path),u=Rd(i,e,l,r?a.getNode():L.EMPTY_NODE,r);return Ky(u)}function $n(n,e){return Vd(e,n.syncPointTree_,null,Cr(n.pendingWriteTree_,J()))}function Vd(n,e,t,s){if($(n.path))return xd(n,e,t,s);{const i=e.get(J());t==null&&i!=null&&(t=Dt(i,J()));let r=[];const a=W(n.path),l=n.operationForChild(a),u=e.children.get(a);if(u&&l){const h=t?t.getImmediateChild(a):null,f=Td(s,a);r=r.concat(Vd(l,u,h,f))}return i&&(r=r.concat(Ba(i,n,s,t))),r}}function xd(n,e,t,s){const i=e.get(J());t==null&&i!=null&&(t=Dt(i,J()));let r=[];return e.children.inorderTraversal((a,l)=>{const u=t?t.getImmediateChild(a):null,h=Td(s,a),f=n.operationForChild(a);f&&(r=r.concat(xd(f,l,u,h)))}),i&&(r=r.concat(Ba(i,n,s,t))),r}function Od(n,e){const t=e.query,s=zs(n,t);return{hashFn:()=>(Gy(e)||L.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?cv(n,t._path,s):lv(n,t._path);{const r=lg(i,t);return or(n,t,null,r)}}}}function zs(n,e){const t=Sr(e);return n.queryToTagMap.get(t)}function Sr(n){return n._path.toString()+"$"+n._queryIdentifier}function qa(n,e){return n.tagToQueryMap.get(e)}function Wa(n){const e=n.indexOf("$");return k(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new ee(n.substr(0,e))}}function za(n,e,t){const s=n.syncPointTree_.get(e);k(s,"Missing sync point for query tag that we're tracking");const i=Cr(n.pendingWriteTree_,e);return Ba(s,t,i,null)}function dv(n){return n.fold((e,t,s)=>{if(t&&Lt(t))return[Ar(t)];{let i=[];return t&&(i=bd(t)),we(s,(r,a)=>{i=i.concat(a)}),i}})}function Ps(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(iv())(n._repo,n._path):n}function fv(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Sr(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function pv(){return rv++}function _v(n,e,t){const s=e._path,i=zs(n,e),r=Od(n,t),a=n.listenProvider_.startListening(Ps(e),i,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(s);if(i)k(!Lt(l.value),"If we're adding a query, it shouldn't be shadowed");else{const u=l.fold((h,f,p)=>{if(!$(h)&&f&&Lt(f))return[Ar(f).query];{let m=[];return f&&(m=m.concat(bd(f).map(w=>w.query))),we(p,(w,R)=>{m=m.concat(R)}),m}});for(let h=0;h<u.length;++h){const f=u[h];n.listenProvider_.stopListening(Ps(f),zs(n,f))}}return a}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new $a(t)}node(){return this.node_}}class Ha{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=ae(this.path_,e);return new Ha(this.syncTree_,t)}node(){return ja(this.syncTree_,this.path_)}}const mv=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},gu=function(n,e,t){if(!n||typeof n!="object")return n;if(k(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return gv(n[".sv"],e,t);if(typeof n[".sv"]=="object")return yv(n[".sv"],e);k(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},gv=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:k(!1,"Unexpected server value: "+n)}},yv=function(n,e,t){n.hasOwnProperty("increment")||k(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&k(!1,"Unexpected increment value: "+s);const i=e.node();if(k(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const a=i.getValue();return typeof a!="number"?s:a+s},Md=function(n,e,t,s){return Ga(e,new Ha(t,n),s)},Ld=function(n,e,t){return Ga(n,new $a(e),t)};function Ga(n,e,t){const s=n.getPriority().val(),i=gu(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const a=n,l=gu(a.getValue(),e,t);return l!==a.getValue()||i!==a.getPriority().val()?new Ee(l,de(i)):n}else{const a=n;return r=a,i!==a.getPriority().val()&&(r=r.updatePriority(new Ee(i))),a.forEachChild(le,(l,u)=>{const h=Ga(u,e.getImmediateChild(l),t);h!==u&&(r=r.updateImmediateChild(l,h))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function Qa(n,e){let t=e instanceof ee?e:new ee(e),s=n,i=W(t);for(;i!==null;){const r=bn(s.node.children,i)||{children:{},childCount:0};s=new Ka(i,s,r),t=ne(t),i=W(t)}return s}function Hn(n){return n.node.value}function Fd(n,e){n.node.value=e,Zo(n)}function Ud(n){return n.node.childCount>0}function vv(n){return Hn(n)===void 0&&!Ud(n)}function Rr(n,e){we(n.node.children,(t,s)=>{e(new Ka(t,n,s))})}function Bd(n,e,t,s){t&&e(n),Rr(n,i=>{Bd(i,e,!0)})}function Ev(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function ri(n){return new ee(n.parent===null?n.name:ri(n.parent)+"/"+n.name)}function Zo(n){n.parent!==null&&Tv(n.parent,n.name,n)}function Tv(n,e,t){const s=vv(t),i=lt(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,Zo(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,Zo(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iv=/[\[\].#$\/\u0000-\u001F\u007F]/,wv=/[\[\].#$\u0000-\u001F\u007F]/,bo=10*1024*1024,Ya=function(n){return typeof n=="string"&&n.length!==0&&!Iv.test(n)},jd=function(n){return typeof n=="string"&&n.length!==0&&!wv.test(n)},Cv=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),jd(n)},qd=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Tr(n)||n&&typeof n=="object"&&lt(n,".sv")},ea=function(n,e,t,s){br(Pn(n,"value"),e,t)},br=function(n,e,t){const s=t instanceof ee?new qg(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Xt(s));if(typeof e=="function")throw new Error(n+"contains a function "+Xt(s)+" with contents = "+e.toString());if(Tr(e))throw new Error(n+"contains "+e.toString()+" "+Xt(s));if(typeof e=="string"&&e.length>bo/3&&Er(e)>bo)throw new Error(n+"contains a string greater than "+bo+" utf8 bytes "+Xt(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(we(e,(a,l)=>{if(a===".value")i=!0;else if(a!==".priority"&&a!==".sv"&&(r=!0,!Ya(a)))throw new Error(n+" contains an invalid key ("+a+") "+Xt(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Wg(s,a),br(n,l,s),zg(s)}),i&&r)throw new Error(n+' contains ".value" child '+Xt(s)+" in addition to actual children.")}},Av=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=Us(s);for(let a=0;a<r.length;a++)if(!(r[a]===".priority"&&a===r.length-1)){if(!Ya(r[a]))throw new Error(n+"contains an invalid key ("+r[a]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(jg);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&$e(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},Wd=function(n,e,t,s){const i=Pn(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];we(e,(a,l)=>{const u=new ee(a);if(br(i,l,ae(t,u)),ba(u)===".priority"&&!qd(l))throw new Error(i+"contains an invalid value for '"+u.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(u)}),Av(i,r)},Sv=function(n,e,t){if(Tr(e))throw new Error(Pn(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!qd(e))throw new Error(Pn(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},zd=function(n,e,t,s){if(!jd(t))throw new Error(Pn(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Rv=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),zd(n,e,t)},vs=function(n,e){if(W(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},bv=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Ya(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!Cv(t))throw new Error(Pn(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pv{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Pr(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!Pa(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function $d(n,e,t){Pr(n,t),Hd(n,s=>Pa(s,e))}function Ge(n,e,t){Pr(n,t),Hd(n,s=>$e(s,e)||$e(e,s))}function Hd(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(Nv(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function Nv(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();As&&Ie("event: "+t.toString()),Wn(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dv="repo_interrupt",kv=25;class Vv{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Pv,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Ji(),this.transactionQueueTree_=new Ka,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function xv(n,e,t){if(n.stats_=Sa(n.repoInfo_),n.forceRestClient_||dg())n.server_=new Xi(n.repoInfo_,(s,i,r,a)=>{yu(n,s,i,r,a)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>vu(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{me(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new pt(n.repoInfo_,e,(s,i,r,a)=>{yu(n,s,i,r,a)},s=>{vu(n,s)},s=>{Mv(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=gg(n.repoInfo_,()=>new my(n.stats_,n.server_)),n.infoData_=new hy,n.infoSyncTree_=new mu({startListening:(s,i,r,a)=>{let l=[];const u=n.infoData_.getNode(s._path);return u.isEmpty()||(l=ii(n.infoSyncTree_,s._path,u),setTimeout(()=>{a("ok")},0)),l},stopListening:()=>{}}),Xa(n,"connected",!1),n.serverSyncTree_=new mu({startListening:(s,i,r,a)=>(n.server_.listen(s,r,i,(l,u)=>{const h=a(l,u);Ge(n.eventQueue_,s._path,h)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function Ov(n){const t=n.infoData_.getNode(new ee(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Nr(n){return mv({timestamp:Ov(n)})}function yu(n,e,t,s,i){n.dataUpdateCount++;const r=new ee(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let a=[];if(i)if(s){const u=Gi(t,h=>de(h));a=uv(n.serverSyncTree_,r,u,i)}else{const u=de(t);a=kd(n.serverSyncTree_,r,u,i)}else if(s){const u=Gi(t,h=>de(h));a=av(n.serverSyncTree_,r,u)}else{const u=de(t);a=ii(n.serverSyncTree_,r,u)}let l=r;a.length>0&&(l=On(n,r)),Ge(n.eventQueue_,l,a)}function vu(n,e){Xa(n,"connected",e),e===!1&&Bv(n)}function Mv(n,e){we(e,(t,s)=>{Xa(n,t,s)})}function Xa(n,e,t){const s=new ee("/.info/"+e),i=de(t);n.infoData_.updateSnapshot(s,i);const r=ii(n.infoSyncTree_,s,i);Ge(n.eventQueue_,s,r)}function Ja(n){return n.nextWriteId_++}function Lv(n,e,t){const s=hv(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=de(i).withIndex(e._queryParams.getIndex());Jo(n.serverSyncTree_,e,t,!0);let a;if(e._queryParams.loadsAllData())a=ii(n.serverSyncTree_,e._path,r);else{const l=zs(n.serverSyncTree_,e);a=kd(n.serverSyncTree_,e._path,r,l)}return Ge(n.eventQueue_,e._path,a),or(n.serverSyncTree_,e,t,null,!0),r},i=>(oi(n,"get for query "+me(e)+" failed: "+i),Promise.reject(new Error(i))))}function Fv(n,e,t,s,i){oi(n,"set",{path:e.toString(),value:t,priority:s});const r=Nr(n),a=de(t,s),l=ja(n.serverSyncTree_,e),u=Ld(a,l,r),h=Ja(n),f=Dd(n.serverSyncTree_,e,u,h,!0);Pr(n.eventQueue_,f),n.server_.put(e.toString(),a.val(!0),(m,w)=>{const R=m==="ok";R||Ue("set at "+e+" failed: "+m);const D=At(n.serverSyncTree_,h,!R);Ge(n.eventQueue_,e,D),Ft(n,i,m,w)});const p=el(n,e);On(n,p),Ge(n.eventQueue_,p,[])}function Uv(n,e,t,s){oi(n,"update",{path:e.toString(),value:t});let i=!0;const r=Nr(n),a={};if(we(t,(l,u)=>{i=!1,a[l]=Md(ae(e,l),de(u),n.serverSyncTree_,r)}),i)Ie("update() called with empty data.  Don't do anything."),Ft(n,s,"ok",void 0);else{const l=Ja(n),u=ov(n.serverSyncTree_,e,a,l);Pr(n.eventQueue_,u),n.server_.merge(e.toString(),t,(h,f)=>{const p=h==="ok";p||Ue("update at "+e+" failed: "+h);const m=At(n.serverSyncTree_,l,!p),w=m.length>0?On(n,e):e;Ge(n.eventQueue_,w,m),Ft(n,s,h,f)}),we(t,h=>{const f=el(n,ae(e,h));On(n,f)}),Ge(n.eventQueue_,e,[])}}function Bv(n){oi(n,"onDisconnectEvents");const e=Nr(n),t=Ji();Ho(n.onDisconnect_,J(),(i,r)=>{const a=Md(i,r,n.serverSyncTree_,e);zn(t,i,a)});let s=[];Ho(t,J(),(i,r)=>{s=s.concat(ii(n.serverSyncTree_,i,r));const a=el(n,i);On(n,a)}),n.onDisconnect_=Ji(),Ge(n.eventQueue_,J(),s)}function jv(n,e,t){n.server_.onDisconnectCancel(e.toString(),(s,i)=>{s==="ok"&&$o(n.onDisconnect_,e),Ft(n,t,s,i)})}function Eu(n,e,t,s){const i=de(t);n.server_.onDisconnectPut(e.toString(),i.val(!0),(r,a)=>{r==="ok"&&zn(n.onDisconnect_,e,i),Ft(n,s,r,a)})}function qv(n,e,t,s,i){const r=de(t,s);n.server_.onDisconnectPut(e.toString(),r.val(!0),(a,l)=>{a==="ok"&&zn(n.onDisconnect_,e,r),Ft(n,i,a,l)})}function Wv(n,e,t,s){if(Oo(t)){Ie("onDisconnect().update() called with empty data.  Don't do anything."),Ft(n,s,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(i,r)=>{i==="ok"&&we(t,(a,l)=>{const u=de(l);zn(n.onDisconnect_,ae(e,a),u)}),Ft(n,s,i,r)})}function zv(n,e,t){let s;W(e._path)===".info"?s=Jo(n.infoSyncTree_,e,t):s=Jo(n.serverSyncTree_,e,t),$d(n.eventQueue_,e._path,s)}function Tu(n,e,t){let s;W(e._path)===".info"?s=or(n.infoSyncTree_,e,t):s=or(n.serverSyncTree_,e,t),$d(n.eventQueue_,e._path,s)}function $v(n){n.persistentConnection_&&n.persistentConnection_.interrupt(Dv)}function oi(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Ie(t,...e)}function Ft(n,e,t,s){e&&Wn(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const a=new Error(r);a.code=i,e(a)}})}function Gd(n,e,t){return ja(n.serverSyncTree_,e,t)||L.EMPTY_NODE}function Za(n,e=n.transactionQueueTree_){if(e||Dr(n,e),Hn(e)){const t=Qd(n,e);k(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&Hv(n,ri(e),t)}else Ud(e)&&Rr(e,t=>{Za(n,t)})}function Hv(n,e,t){const s=t.map(h=>h.currentWriteId),i=Gd(n,e,s);let r=i;const a=i.hash();for(let h=0;h<t.length;h++){const f=t[h];k(f.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),f.status=1,f.retryCount++;const p=Fe(e,f.path);r=r.updateChild(p,f.currentOutputSnapshotRaw)}const l=r.val(!0),u=e;n.server_.put(u.toString(),l,h=>{oi(n,"transaction put response",{path:u.toString(),status:h});let f=[];if(h==="ok"){const p=[];for(let m=0;m<t.length;m++)t[m].status=2,f=f.concat(At(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&p.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();Dr(n,Qa(n.transactionQueueTree_,e)),Za(n,n.transactionQueueTree_),Ge(n.eventQueue_,e,f);for(let m=0;m<p.length;m++)Wn(p[m])}else{if(h==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{Ue("transaction at "+u.toString()+" failed: "+h);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=h}On(n,e)}},a)}function On(n,e){const t=Kd(n,e),s=ri(t),i=Qd(n,t);return Gv(n,i,s),s}function Gv(n,e,t){if(e.length===0)return;const s=[];let i=[];const a=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const u=e[l],h=Fe(t,u.path);let f=!1,p;if(k(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),u.status===4)f=!0,p=u.abortReason,i=i.concat(At(n.serverSyncTree_,u.currentWriteId,!0));else if(u.status===0)if(u.retryCount>=kv)f=!0,p="maxretry",i=i.concat(At(n.serverSyncTree_,u.currentWriteId,!0));else{const m=Gd(n,u.path,a);u.currentInputSnapshot=m;const w=e[l].update(m.val());if(w!==void 0){br("transaction failed: Data returned ",w,u.path);let R=de(w);typeof w=="object"&&w!=null&&lt(w,".priority")||(R=R.updatePriority(m.getPriority()));const N=u.currentWriteId,q=Nr(n),j=Ld(R,m,q);u.currentOutputSnapshotRaw=R,u.currentOutputSnapshotResolved=j,u.currentWriteId=Ja(n),a.splice(a.indexOf(N),1),i=i.concat(Dd(n.serverSyncTree_,u.path,j,u.currentWriteId,u.applyLocally)),i=i.concat(At(n.serverSyncTree_,N,!0))}else f=!0,p="nodata",i=i.concat(At(n.serverSyncTree_,u.currentWriteId,!0))}Ge(n.eventQueue_,t,i),i=[],f&&(e[l].status=2,(function(m){setTimeout(m,Math.floor(0))})(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?s.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):s.push(()=>e[l].onComplete(new Error(p),!1,null))))}Dr(n,n.transactionQueueTree_);for(let l=0;l<s.length;l++)Wn(s[l]);Za(n,n.transactionQueueTree_)}function Kd(n,e){let t,s=n.transactionQueueTree_;for(t=W(e);t!==null&&Hn(s)===void 0;)s=Qa(s,t),e=ne(e),t=W(e);return s}function Qd(n,e){const t=[];return Yd(n,e,t),t.sort((s,i)=>s.order-i.order),t}function Yd(n,e,t){const s=Hn(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);Rr(e,i=>{Yd(n,i,t)})}function Dr(n,e){const t=Hn(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,Fd(e,t.length>0?t:void 0)}Rr(e,s=>{Dr(n,s)})}function el(n,e){const t=ri(Kd(n,e)),s=Qa(n.transactionQueueTree_,e);return Ev(s,i=>{Po(n,i)}),Po(n,s),Bd(s,i=>{Po(n,i)}),t}function Po(n,e){const t=Hn(e);if(t){const s=[];let i=[],r=-1;for(let a=0;a<t.length;a++)t[a].status===3||(t[a].status===1?(k(r===a-1,"All SENT items should be at beginning of queue."),r=a,t[a].status=3,t[a].abortReason="set"):(k(t[a].status===0,"Unexpected transaction status in abort"),t[a].unwatcher(),i=i.concat(At(n.serverSyncTree_,t[a].currentWriteId,!0)),t[a].onComplete&&s.push(t[a].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Fd(e,void 0):t.length=r+1,Ge(n.eventQueue_,ri(e),i);for(let a=0;a<s.length;a++)Wn(s[a])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kv(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function Qv(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):Ue(`Invalid query segment '${t}' in query '${n}'`)}return e}const Iu=function(n,e){const t=Yv(n),s=t.namespace;t.domain==="firebase.com"&&gt(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&gt("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||sg();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new ed(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new ee(t.pathString)}},Yv=function(n){let e="",t="",s="",i="",r="",a=!0,l="https",u=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let f=n.indexOf("/");f===-1&&(f=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(f,p)),f<p&&(i=Kv(n.substring(f,p)));const m=Qv(n.substring(Math.min(n.length,p)));h=e.indexOf(":"),h>=0?(a=l==="https"||l==="wss",u=parseInt(e.substring(h+1),10)):h=e.length;const w=e.slice(0,h);if(w.toLowerCase()==="localhost")t="localhost";else if(w.split(".").length<=2)t=w;else{const R=e.indexOf(".");s=e.substring(0,R).toLowerCase(),t=e.substring(R+1),r=s}"ns"in m&&(r=m.ns)}return{host:e,port:u,domain:t,subdomain:s,secure:a,scheme:l,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+me(this.snapshot.exportVal())}}class Jv{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return k(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class Zv{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new et;return jv(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){vs("OnDisconnect.remove",this._path);const e=new et;return Eu(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){vs("OnDisconnect.set",this._path),ea("OnDisconnect.set",e,this._path);const t=new et;return Eu(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){vs("OnDisconnect.setWithPriority",this._path),ea("OnDisconnect.setWithPriority",e,this._path),Sv("OnDisconnect.setWithPriority",t);const s=new et;return qv(this._repo,this._path,e,t,s.wrapCallback(()=>{})),s.promise}update(e){vs("OnDisconnect.update",this._path),Wd("OnDisconnect.update",e,this._path);const t=new et;return Wv(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}}/**
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
 */class tl{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return $(this._path)?null:ba(this._path)}get ref(){return new Et(this._repo,this._path)}get _queryIdentifier(){const e=ou(this._queryParams),t=Ca(e);return t==="{}"?"default":t}get _queryObject(){return ou(this._queryParams)}isEqual(e){if(e=He(e),!(e instanceof tl))return!1;const t=this._repo===e._repo,s=Pa(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Bg(this._path)}}class Et extends tl{constructor(e,t){super(e,t,new Va,!1)}get parent(){const e=cd(this._path);return e===null?null:new Et(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class $s{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new ee(e),s=ta(this.ref,e);return new $s(this._node.getChild(t),s,le)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new $s(i,ta(this.ref,s),le)))}hasChild(e){const t=new ee(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Nw(n,e){return n=He(n),n._checkNotDeleted("ref"),e!==void 0?ta(n._root,e):n._root}function ta(n,e){return n=He(n),W(n._path)===null?Rv("child","path",e):zd("child","path",e),new Et(n._repo,ae(n._path,e))}function Dw(n){return n=He(n),new Zv(n._repo,n._path)}function kw(n,e){n=He(n),vs("set",n._path),ea("set",e,n._path);const t=new et;return Fv(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function Vw(n,e){Wd("update",e,n._path);const t=new et;return Uv(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function xw(n){n=He(n);const e=new Xd(()=>{}),t=new kr(e);return Lv(n._repo,n,t).then(s=>new $s(s,new Et(n._repo,n._path),n._queryParams.getIndex()))}class kr{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new Xv("value",this,new $s(e.snapshotNode,new Et(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Jv(this,e,t):null}matches(e){return e instanceof kr?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function eE(n,e,t,s,i){let r;if(typeof s=="object"&&(r=void 0,i=s),typeof s=="function"&&(r=s),i&&i.onlyOnce){const u=t,h=(f,p)=>{Tu(n._repo,n,l),u(f,p)};h.userCallback=t.userCallback,h.context=t.context,t=h}const a=new Xd(t,r||void 0),l=new kr(a);return zv(n._repo,n,l),()=>Tu(n._repo,n,l)}function Ow(n,e,t,s){return eE(n,"value",e,t,s)}Jy(Et);sv(Et);/**
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
 */const tE="FIREBASE_DATABASE_EMULATOR_HOST",na={};let nE=!1;function sE(n,e,t,s){const i=e.lastIndexOf(":"),r=e.substring(0,i),a=ei(r);n.repoInfo_=new ed(e,a,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),s&&(n.authTokenProvider_=s)}function iE(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||gt("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Ie("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let a=Iu(r,i),l=a.repoInfo,u;typeof process<"u"&&qc&&(u=qc[tE]),u?(r=`http://${u}?ns=${l.namespace}`,a=Iu(r,i),l=a.repoInfo):a.repoInfo.secure;const h=new pg(n.name,n.options,e);bv("Invalid Firebase Database URL",a),$(a.path)||gt("Database URL must point to the root of a Firebase Database (not including a child path).");const f=oE(l,n,h,new fg(n,t));return new aE(f,n)}function rE(n,e){const t=na[e];(!t||t[n.key]!==n)&&gt(`Database ${e}(${n.repoInfo_}) has already been deleted.`),$v(n),delete t[n.key]}function oE(n,e,t,s){let i=na[e.name];i||(i={},na[e.name]=i);let r=i[n.toURLString()];return r&&gt("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new Vv(n,nE,t,s),i[n.toURLString()]=r,r}class aE{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(xv(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Et(this._repo,J())),this._rootInternal}_delete(){return this._rootInternal!==null&&(rE(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&gt("Cannot call "+e+" on a deleted database.")}}function Mw(n=Lh(),e){const t=xh(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Ch("database");s&&lE(t,...s)}return t}function lE(n,e,t,s={}){n=He(n),n._checkNotDeleted("useEmulator");const i=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(i===n._repoInternal.repoInfo_.host&&Os(s,r.repoInfo_.emulatorOptions))return;gt("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let a;if(r.repoInfo_.nodeAdmin)s.mockUserToken&&gt('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),a=new Fi(Fi.OWNER);else if(s.mockUserToken){const l=typeof s.mockUserToken=="string"?s.mockUserToken:Rh(s.mockUserToken,n.app.options.projectId);a=new Fi(l)}ei(e)&&(Sh(e),bh("Database",!0)),sE(r,i,s,a)}/**
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
 */function cE(n){Xm(Mh),Ms(new Nn("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return iE(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Pt(Wc,zc,n),Pt(Wc,zc,"esm2017")}pt.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};pt.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};cE();var wu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var kt,Jd;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function v(){}v.prototype=g.prototype,I.D=g.prototype,I.prototype=new v,I.prototype.constructor=I,I.C=function(E,T,A){for(var y=Array(arguments.length-2),ut=2;ut<arguments.length;ut++)y[ut-2]=arguments[ut];return g.prototype[T].apply(E,y)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,g,v){v||(v=0);var E=Array(16);if(typeof g=="string")for(var T=0;16>T;++T)E[T]=g.charCodeAt(v++)|g.charCodeAt(v++)<<8|g.charCodeAt(v++)<<16|g.charCodeAt(v++)<<24;else for(T=0;16>T;++T)E[T]=g[v++]|g[v++]<<8|g[v++]<<16|g[v++]<<24;g=I.g[0],v=I.g[1],T=I.g[2];var A=I.g[3],y=g+(A^v&(T^A))+E[0]+3614090360&4294967295;g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[1]+3905402710&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[2]+606105819&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[3]+3250441966&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[4]+4118548399&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[5]+1200080426&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[6]+2821735955&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[7]+4249261313&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[8]+1770035416&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[9]+2336552879&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[10]+4294925233&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[11]+2304563134&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(A^v&(T^A))+E[12]+1804603682&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(T^g&(v^T))+E[13]+4254626195&4294967295,A=g+(y<<12&4294967295|y>>>20),y=T+(v^A&(g^v))+E[14]+2792965006&4294967295,T=A+(y<<17&4294967295|y>>>15),y=v+(g^T&(A^g))+E[15]+1236535329&4294967295,v=T+(y<<22&4294967295|y>>>10),y=g+(T^A&(v^T))+E[1]+4129170786&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[6]+3225465664&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[11]+643717713&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[0]+3921069994&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[5]+3593408605&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[10]+38016083&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[15]+3634488961&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[4]+3889429448&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[9]+568446438&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[14]+3275163606&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[3]+4107603335&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[8]+1163531501&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(T^A&(v^T))+E[13]+2850285829&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^T&(g^v))+E[2]+4243563512&4294967295,A=g+(y<<9&4294967295|y>>>23),y=T+(g^v&(A^g))+E[7]+1735328473&4294967295,T=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(T^A))+E[12]+2368359562&4294967295,v=T+(y<<20&4294967295|y>>>12),y=g+(v^T^A)+E[5]+4294588738&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[8]+2272392833&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[11]+1839030562&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[14]+4259657740&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[1]+2763975236&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[4]+1272893353&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[7]+4139469664&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[10]+3200236656&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[13]+681279174&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[0]+3936430074&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[3]+3572445317&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[6]+76029189&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(v^T^A)+E[9]+3654602809&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^T)+E[12]+3873151461&4294967295,A=g+(y<<11&4294967295|y>>>21),y=T+(A^g^v)+E[15]+530742520&4294967295,T=A+(y<<16&4294967295|y>>>16),y=v+(T^A^g)+E[2]+3299628645&4294967295,v=T+(y<<23&4294967295|y>>>9),y=g+(T^(v|~A))+E[0]+4096336452&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[7]+1126891415&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[14]+2878612391&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[5]+4237533241&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[12]+1700485571&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[3]+2399980690&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[10]+4293915773&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[1]+2240044497&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[8]+1873313359&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[15]+4264355552&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[6]+2734768916&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[13]+1309151649&4294967295,v=T+(y<<21&4294967295|y>>>11),y=g+(T^(v|~A))+E[4]+4149444226&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~T))+E[11]+3174756917&4294967295,A=g+(y<<10&4294967295|y>>>22),y=T+(g^(A|~v))+E[2]+718787259&4294967295,T=A+(y<<15&4294967295|y>>>17),y=v+(A^(T|~g))+E[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(T+(y<<21&4294967295|y>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+A&4294967295}s.prototype.u=function(I,g){g===void 0&&(g=I.length);for(var v=g-this.blockSize,E=this.B,T=this.h,A=0;A<g;){if(T==0)for(;A<=v;)i(this,I,A),A+=this.blockSize;if(typeof I=="string"){for(;A<g;)if(E[T++]=I.charCodeAt(A++),T==this.blockSize){i(this,E),T=0;break}}else for(;A<g;)if(E[T++]=I[A++],T==this.blockSize){i(this,E),T=0;break}}this.h=T,this.o+=g},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;var v=8*this.o;for(g=I.length-8;g<I.length;++g)I[g]=v&255,v/=256;for(this.u(I),I=Array(16),g=v=0;4>g;++g)for(var E=0;32>E;E+=8)I[v++]=this.g[g]>>>E&255;return I};function r(I,g){var v=l;return Object.prototype.hasOwnProperty.call(v,I)?v[I]:v[I]=g(I)}function a(I,g){this.h=g;for(var v=[],E=!0,T=I.length-1;0<=T;T--){var A=I[T]|0;E&&A==g||(v[T]=A,E=!1)}this.g=v}var l={};function u(I){return-128<=I&&128>I?r(I,function(g){return new a([g|0],0>g?-1:0)}):new a([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return N(h(-I));for(var g=[],v=1,E=0;I>=v;E++)g[E]=I/v|0,v*=4294967296;return new a(g,0)}function f(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return N(f(I.substring(1),g));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(g,8)),E=p,T=0;T<I.length;T+=8){var A=Math.min(8,I.length-T),y=parseInt(I.substring(T,T+A),g);8>A?(A=h(Math.pow(g,A)),E=E.j(A).add(h(y))):(E=E.j(v),E=E.add(h(y)))}return E}var p=u(0),m=u(1),w=u(16777216);n=a.prototype,n.m=function(){if(D(this))return-N(this).m();for(var I=0,g=1,v=0;v<this.g.length;v++){var E=this.i(v);I+=(0<=E?E:4294967296+E)*g,g*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(R(this))return"0";if(D(this))return"-"+N(this).toString(I);for(var g=h(Math.pow(I,6)),v=this,E="";;){var T=ue(v,g).g;v=q(v,T.j(g));var A=((0<v.g.length?v.g[0]:v.h)>>>0).toString(I);if(v=T,R(v))return A+E;for(;6>A.length;)A="0"+A;E=A+E}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function R(I){if(I.h!=0)return!1;for(var g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function D(I){return I.h==-1}n.l=function(I){return I=q(this,I),D(I)?-1:R(I)?0:1};function N(I){for(var g=I.g.length,v=[],E=0;E<g;E++)v[E]=~I.g[E];return new a(v,~I.h).add(m)}n.abs=function(){return D(this)?N(this):this},n.add=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0,T=0;T<=g;T++){var A=E+(this.i(T)&65535)+(I.i(T)&65535),y=(A>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);E=y>>>16,A&=65535,y&=65535,v[T]=y<<16|A}return new a(v,v[v.length-1]&-2147483648?-1:0)};function q(I,g){return I.add(N(g))}n.j=function(I){if(R(this)||R(I))return p;if(D(this))return D(I)?N(this).j(N(I)):N(N(this).j(I));if(D(I))return N(this.j(N(I)));if(0>this.l(w)&&0>I.l(w))return h(this.m()*I.m());for(var g=this.g.length+I.g.length,v=[],E=0;E<2*g;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var T=0;T<I.g.length;T++){var A=this.i(E)>>>16,y=this.i(E)&65535,ut=I.i(T)>>>16,Xn=I.i(T)&65535;v[2*E+2*T]+=y*Xn,j(v,2*E+2*T),v[2*E+2*T+1]+=A*Xn,j(v,2*E+2*T+1),v[2*E+2*T+1]+=y*ut,j(v,2*E+2*T+1),v[2*E+2*T+2]+=A*ut,j(v,2*E+2*T+2)}for(E=0;E<g;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=g;E<2*g;E++)v[E]=0;return new a(v,0)};function j(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function G(I,g){this.g=I,this.h=g}function ue(I,g){if(R(g))throw Error("division by zero");if(R(I))return new G(p,p);if(D(I))return g=ue(N(I),g),new G(N(g.g),N(g.h));if(D(g))return g=ue(I,N(g)),new G(N(g.g),g.h);if(30<I.g.length){if(D(I)||D(g))throw Error("slowDivide_ only works with positive integers.");for(var v=m,E=g;0>=E.l(I);)v=ct(v),E=ct(E);var T=Ce(v,1),A=Ce(E,1);for(E=Ce(E,2),v=Ce(v,2);!R(E);){var y=A.add(E);0>=y.l(I)&&(T=T.add(v),A=y),E=Ce(E,1),v=Ce(v,1)}return g=q(I,T.j(g)),new G(T,g)}for(T=p;0<=I.l(g);){for(v=Math.max(1,Math.floor(I.m()/g.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),A=h(v),y=A.j(g);D(y)||0<y.l(I);)v-=E,A=h(v),y=A.j(g);R(A)&&(A=m),T=T.add(A),I=q(I,y)}return new G(T,I)}n.A=function(I){return ue(this,I).h},n.and=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)&I.i(E);return new a(v,this.h&I.h)},n.or=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)|I.i(E);return new a(v,this.h|I.h)},n.xor=function(I){for(var g=Math.max(this.g.length,I.g.length),v=[],E=0;E<g;E++)v[E]=this.i(E)^I.i(E);return new a(v,this.h^I.h)};function ct(I){for(var g=I.g.length+1,v=[],E=0;E<g;E++)v[E]=I.i(E)<<1|I.i(E-1)>>>31;return new a(v,I.h)}function Ce(I,g){var v=g>>5;g%=32;for(var E=I.g.length-v,T=[],A=0;A<E;A++)T[A]=0<g?I.i(A+v)>>>g|I.i(A+v+1)<<32-g:I.i(A+v);return new a(T,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Jd=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=f,kt=a}).apply(typeof wu<"u"?wu:typeof self<"u"?self:typeof window<"u"?window:{});var Vi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zd,Es,ef,Bi,sa,tf,nf,sf;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,c,d){return o==Array.prototype||o==Object.prototype||(o[c]=d.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Vi=="object"&&Vi];for(var c=0;c<o.length;++c){var d=o[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var s=t(this);function i(o,c){if(c)e:{var d=s;o=o.split(".");for(var _=0;_<o.length-1;_++){var C=o[_];if(!(C in d))break e;d=d[C]}o=o[o.length-1],_=d[o],c=c(_),c!=_&&c!=null&&e(d,o,{configurable:!0,writable:!0,value:c})}}function r(o,c){o instanceof String&&(o+="");var d=0,_=!1,C={next:function(){if(!_&&d<o.length){var S=d++;return{value:c(S,o[S]),done:!1}}return _=!0,{done:!0,value:void 0}}};return C[Symbol.iterator]=function(){return C},C}i("Array.prototype.values",function(o){return o||function(){return r(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(o){var c=typeof o;return c=c!="object"?c:o?Array.isArray(o)?"array":c:"null",c=="array"||c=="object"&&typeof o.length=="number"}function h(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function f(o,c,d){return o.call.apply(o.bind,arguments)}function p(o,c,d){if(!o)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var C=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(C,_),o.apply(c,C)}}return function(){return o.apply(c,arguments)}}function m(o,c,d){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,m.apply(null,arguments)}function w(o,c){var d=Array.prototype.slice.call(arguments,1);return function(){var _=d.slice();return _.push.apply(_,arguments),o.apply(this,_)}}function R(o,c){function d(){}d.prototype=c.prototype,o.aa=c.prototype,o.prototype=new d,o.prototype.constructor=o,o.Qb=function(_,C,S){for(var V=Array(arguments.length-2),te=2;te<arguments.length;te++)V[te-2]=arguments[te];return c.prototype[C].apply(_,V)}}function D(o){const c=o.length;if(0<c){const d=Array(c);for(let _=0;_<c;_++)d[_]=o[_];return d}return[]}function N(o,c){for(let d=1;d<arguments.length;d++){const _=arguments[d];if(u(_)){const C=o.length||0,S=_.length||0;o.length=C+S;for(let V=0;V<S;V++)o[C+V]=_[V]}else o.push(_)}}class q{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function j(o){return/^[\s\xa0]*$/.test(o)}function G(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function ue(o){return ue[" "](o),o}ue[" "]=function(){};var ct=G().indexOf("Gecko")!=-1&&!(G().toLowerCase().indexOf("webkit")!=-1&&G().indexOf("Edge")==-1)&&!(G().indexOf("Trident")!=-1||G().indexOf("MSIE")!=-1)&&G().indexOf("Edge")==-1;function Ce(o,c,d){for(const _ in o)c.call(d,o[_],_,o)}function I(o,c){for(const d in o)c.call(void 0,o[d],d,o)}function g(o){const c={};for(const d in o)c[d]=o[d];return c}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(o,c){let d,_;for(let C=1;C<arguments.length;C++){_=arguments[C];for(d in _)o[d]=_[d];for(let S=0;S<v.length;S++)d=v[S],Object.prototype.hasOwnProperty.call(_,d)&&(o[d]=_[d])}}function T(o){var c=1;o=o.split(":");const d=[];for(;0<c&&o.length;)d.push(o.shift()),c--;return o.length&&d.push(o.join(":")),d}function A(o){l.setTimeout(()=>{throw o},0)}function y(){var o=Gr;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class ut{constructor(){this.h=this.g=null}add(c,d){const _=Xn.get();_.set(c,d),this.h?this.h.next=_:this.g=_,this.h=_}}var Xn=new q(()=>new kp,o=>o.reset());class kp{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Jn,Zn=!1,Gr=new ut,Dl=()=>{const o=l.Promise.resolve(void 0);Jn=()=>{o.then(Vp)}};var Vp=()=>{for(var o;o=y();){try{o.h.call(o.g)}catch(d){A(d)}var c=Xn;c.j(o),100>c.h&&(c.h++,o.next=c.g,c.g=o)}Zn=!1};function Tt(){this.s=this.s,this.C=this.C}Tt.prototype.s=!1,Tt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Tt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Pe(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}Pe.prototype.h=function(){this.defaultPrevented=!0};var xp=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const d=()=>{};l.addEventListener("test",d,c),l.removeEventListener("test",d,c)}catch{}return o})();function es(o,c){if(Pe.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var d=this.type=o.type,_=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget){if(ct){e:{try{ue(c.nodeName);var C=!0;break e}catch{}C=!1}C||(c=null)}}else d=="mouseover"?c=o.fromElement:d=="mouseout"&&(c=o.toElement);this.relatedTarget=c,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Op[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&es.aa.h.call(this)}}R(es,Pe);var Op={2:"touch",3:"pen",4:"mouse"};es.prototype.h=function(){es.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var di="closure_listenable_"+(1e6*Math.random()|0),Mp=0;function Lp(o,c,d,_,C){this.listener=o,this.proxy=null,this.src=c,this.type=d,this.capture=!!_,this.ha=C,this.key=++Mp,this.da=this.fa=!1}function fi(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function pi(o){this.src=o,this.g={},this.h=0}pi.prototype.add=function(o,c,d,_,C){var S=o.toString();o=this.g[S],o||(o=this.g[S]=[],this.h++);var V=Qr(o,c,_,C);return-1<V?(c=o[V],d||(c.fa=!1)):(c=new Lp(c,this.src,S,!!_,C),c.fa=d,o.push(c)),c};function Kr(o,c){var d=c.type;if(d in o.g){var _=o.g[d],C=Array.prototype.indexOf.call(_,c,void 0),S;(S=0<=C)&&Array.prototype.splice.call(_,C,1),S&&(fi(c),o.g[d].length==0&&(delete o.g[d],o.h--))}}function Qr(o,c,d,_){for(var C=0;C<o.length;++C){var S=o[C];if(!S.da&&S.listener==c&&S.capture==!!d&&S.ha==_)return C}return-1}var Yr="closure_lm_"+(1e6*Math.random()|0),Xr={};function kl(o,c,d,_,C){if(Array.isArray(c)){for(var S=0;S<c.length;S++)kl(o,c[S],d,_,C);return null}return d=Ol(d),o&&o[di]?o.K(c,d,h(_)?!!_.capture:!1,C):Fp(o,c,d,!1,_,C)}function Fp(o,c,d,_,C,S){if(!c)throw Error("Invalid event type");var V=h(C)?!!C.capture:!!C,te=Zr(o);if(te||(o[Yr]=te=new pi(o)),d=te.add(c,d,_,V,S),d.proxy)return d;if(_=Up(),d.proxy=_,_.src=o,_.listener=d,o.addEventListener)xp||(C=V),C===void 0&&(C=!1),o.addEventListener(c.toString(),_,C);else if(o.attachEvent)o.attachEvent(xl(c.toString()),_);else if(o.addListener&&o.removeListener)o.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Up(){function o(d){return c.call(o.src,o.listener,d)}const c=Bp;return o}function Vl(o,c,d,_,C){if(Array.isArray(c))for(var S=0;S<c.length;S++)Vl(o,c[S],d,_,C);else _=h(_)?!!_.capture:!!_,d=Ol(d),o&&o[di]?(o=o.i,c=String(c).toString(),c in o.g&&(S=o.g[c],d=Qr(S,d,_,C),-1<d&&(fi(S[d]),Array.prototype.splice.call(S,d,1),S.length==0&&(delete o.g[c],o.h--)))):o&&(o=Zr(o))&&(c=o.g[c.toString()],o=-1,c&&(o=Qr(c,d,_,C)),(d=-1<o?c[o]:null)&&Jr(d))}function Jr(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[di])Kr(c.i,o);else{var d=o.type,_=o.proxy;c.removeEventListener?c.removeEventListener(d,_,o.capture):c.detachEvent?c.detachEvent(xl(d),_):c.addListener&&c.removeListener&&c.removeListener(_),(d=Zr(c))?(Kr(d,o),d.h==0&&(d.src=null,c[Yr]=null)):fi(o)}}}function xl(o){return o in Xr?Xr[o]:Xr[o]="on"+o}function Bp(o,c){if(o.da)o=!0;else{c=new es(c,this);var d=o.listener,_=o.ha||o.src;o.fa&&Jr(o),o=d.call(_,c)}return o}function Zr(o){return o=o[Yr],o instanceof pi?o:null}var eo="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ol(o){return typeof o=="function"?o:(o[eo]||(o[eo]=function(c){return o.handleEvent(c)}),o[eo])}function Ne(){Tt.call(this),this.i=new pi(this),this.M=this,this.F=null}R(Ne,Tt),Ne.prototype[di]=!0,Ne.prototype.removeEventListener=function(o,c,d,_){Vl(this,o,c,d,_)};function Me(o,c){var d,_=o.F;if(_)for(d=[];_;_=_.F)d.push(_);if(o=o.M,_=c.type||c,typeof c=="string")c=new Pe(c,o);else if(c instanceof Pe)c.target=c.target||o;else{var C=c;c=new Pe(_,o),E(c,C)}if(C=!0,d)for(var S=d.length-1;0<=S;S--){var V=c.g=d[S];C=_i(V,_,!0,c)&&C}if(V=c.g=o,C=_i(V,_,!0,c)&&C,C=_i(V,_,!1,c)&&C,d)for(S=0;S<d.length;S++)V=c.g=d[S],C=_i(V,_,!1,c)&&C}Ne.prototype.N=function(){if(Ne.aa.N.call(this),this.i){var o=this.i,c;for(c in o.g){for(var d=o.g[c],_=0;_<d.length;_++)fi(d[_]);delete o.g[c],o.h--}}this.F=null},Ne.prototype.K=function(o,c,d,_){return this.i.add(String(o),c,!1,d,_)},Ne.prototype.L=function(o,c,d,_){return this.i.add(String(o),c,!0,d,_)};function _i(o,c,d,_){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();for(var C=!0,S=0;S<c.length;++S){var V=c[S];if(V&&!V.da&&V.capture==d){var te=V.listener,Ae=V.ha||V.src;V.fa&&Kr(o.i,V),C=te.call(Ae,_)!==!1&&C}}return C&&!_.defaultPrevented}function Ml(o,c,d){if(typeof o=="function")d&&(o=m(o,d));else if(o&&typeof o.handleEvent=="function")o=m(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(o,c||0)}function Ll(o){o.g=Ml(()=>{o.g=null,o.i&&(o.i=!1,Ll(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class jp extends Tt{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Ll(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ts(o){Tt.call(this),this.h=o,this.g={}}R(ts,Tt);var Fl=[];function Ul(o){Ce(o.g,function(c,d){this.g.hasOwnProperty(d)&&Jr(c)},o),o.g={}}ts.prototype.N=function(){ts.aa.N.call(this),Ul(this)},ts.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var to=l.JSON.stringify,qp=l.JSON.parse,Wp=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function no(){}no.prototype.h=null;function Bl(o){return o.h||(o.h=o.i())}function jl(){}var ns={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function so(){Pe.call(this,"d")}R(so,Pe);function io(){Pe.call(this,"c")}R(io,Pe);var Ht={},ql=null;function mi(){return ql=ql||new Ne}Ht.La="serverreachability";function Wl(o){Pe.call(this,Ht.La,o)}R(Wl,Pe);function ss(o){const c=mi();Me(c,new Wl(c))}Ht.STAT_EVENT="statevent";function zl(o,c){Pe.call(this,Ht.STAT_EVENT,o),this.stat=c}R(zl,Pe);function Le(o){const c=mi();Me(c,new zl(c,o))}Ht.Ma="timingevent";function $l(o,c){Pe.call(this,Ht.Ma,o),this.size=c}R($l,Pe);function is(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},c)}function rs(){this.g=!0}rs.prototype.xa=function(){this.g=!1};function zp(o,c,d,_,C,S){o.info(function(){if(o.g)if(S)for(var V="",te=S.split("&"),Ae=0;Ae<te.length;Ae++){var X=te[Ae].split("=");if(1<X.length){var De=X[0];X=X[1];var ke=De.split("_");V=2<=ke.length&&ke[1]=="type"?V+(De+"="+X+"&"):V+(De+"=redacted&")}}else V=null;else V=S;return"XMLHTTP REQ ("+_+") [attempt "+C+"]: "+c+`
`+d+`
`+V})}function $p(o,c,d,_,C,S,V){o.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+C+"]: "+c+`
`+d+`
`+S+" "+V})}function pn(o,c,d,_){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+Gp(o,d)+(_?" "+_:"")})}function Hp(o,c){o.info(function(){return"TIMEOUT: "+c})}rs.prototype.info=function(){};function Gp(o,c){if(!o.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(o=0;o<d.length;o++)if(Array.isArray(d[o])){var _=d[o];if(!(2>_.length)){var C=_[1];if(Array.isArray(C)&&!(1>C.length)){var S=C[0];if(S!="noop"&&S!="stop"&&S!="close")for(var V=1;V<C.length;V++)C[V]=""}}}}return to(d)}catch{return c}}var gi={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Hl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ro;function yi(){}R(yi,no),yi.prototype.g=function(){return new XMLHttpRequest},yi.prototype.i=function(){return{}},ro=new yi;function It(o,c,d,_){this.j=o,this.i=c,this.l=d,this.R=_||1,this.U=new ts(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Gl}function Gl(){this.i=null,this.g="",this.h=!1}var Kl={},oo={};function ao(o,c,d){o.L=1,o.v=Ii(ht(c)),o.m=d,o.P=!0,Ql(o,null)}function Ql(o,c){o.F=Date.now(),vi(o),o.A=ht(o.v);var d=o.A,_=o.R;Array.isArray(_)||(_=[String(_)]),cc(d.i,"t",_),o.C=0,d=o.j.J,o.h=new Gl,o.g=Rc(o.j,d?c:null,!o.m),0<o.O&&(o.M=new jp(m(o.Y,o,o.g),o.O)),c=o.U,d=o.g,_=o.ca;var C="readystatechange";Array.isArray(C)||(C&&(Fl[0]=C.toString()),C=Fl);for(var S=0;S<C.length;S++){var V=kl(d,C[S],_||c.handleEvent,!1,c.h||c);if(!V)break;c.g[V.key]=V}c=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,c)):(o.u="GET",o.g.ea(o.A,o.u,null,c)),ss(),zp(o.i,o.u,o.A,o.l,o.R,o.m)}It.prototype.ca=function(o){o=o.target;const c=this.M;c&&dt(o)==3?c.j():this.Y(o)},It.prototype.Y=function(o){try{if(o==this.g)e:{const ke=dt(this.g);var c=this.g.Ba();const gn=this.g.Z();if(!(3>ke)&&(ke!=3||this.g&&(this.h.h||this.g.oa()||mc(this.g)))){this.J||ke!=4||c==7||(c==8||0>=gn?ss(3):ss(2)),lo(this);var d=this.g.Z();this.X=d;t:if(Yl(this)){var _=mc(this.g);o="";var C=_.length,S=dt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Gt(this),os(this);var V="";break t}this.h.i=new l.TextDecoder}for(c=0;c<C;c++)this.h.h=!0,o+=this.h.i.decode(_[c],{stream:!(S&&c==C-1)});_.length=0,this.h.g+=o,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=d==200,$p(this.i,this.u,this.A,this.l,this.R,ke,d),this.o){if(this.T&&!this.K){t:{if(this.g){var te,Ae=this.g;if((te=Ae.g?Ae.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(te)){var X=te;break t}}X=null}if(d=X)pn(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,co(this,d);else{this.o=!1,this.s=3,Le(12),Gt(this),os(this);break e}}if(this.P){d=!0;let Ke;for(;!this.J&&this.C<V.length;)if(Ke=Kp(this,V),Ke==oo){ke==4&&(this.s=4,Le(14),d=!1),pn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ke==Kl){this.s=4,Le(15),pn(this.i,this.l,V,"[Invalid Chunk]"),d=!1;break}else pn(this.i,this.l,Ke,null),co(this,Ke);if(Yl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ke!=4||V.length!=0||this.h.h||(this.s=1,Le(16),d=!1),this.o=this.o&&d,!d)pn(this.i,this.l,V,"[Invalid Chunked Response]"),Gt(this),os(this);else if(0<V.length&&!this.W){this.W=!0;var De=this.j;De.g==this&&De.ba&&!De.M&&(De.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),mo(De),De.M=!0,Le(11))}}else pn(this.i,this.l,V,null),co(this,V);ke==4&&Gt(this),this.o&&!this.J&&(ke==4?wc(this.j,this):(this.o=!1,vi(this)))}else h_(this.g),d==400&&0<V.indexOf("Unknown SID")?(this.s=3,Le(12)):(this.s=0,Le(13)),Gt(this),os(this)}}}catch{}finally{}};function Yl(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Kp(o,c){var d=o.C,_=c.indexOf(`
`,d);return _==-1?oo:(d=Number(c.substring(d,_)),isNaN(d)?Kl:(_+=1,_+d>c.length?oo:(c=c.slice(_,_+d),o.C=_+d,c)))}It.prototype.cancel=function(){this.J=!0,Gt(this)};function vi(o){o.S=Date.now()+o.I,Xl(o,o.I)}function Xl(o,c){if(o.B!=null)throw Error("WatchDog timer not null");o.B=is(m(o.ba,o),c)}function lo(o){o.B&&(l.clearTimeout(o.B),o.B=null)}It.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Hp(this.i,this.A),this.L!=2&&(ss(),Le(17)),Gt(this),this.s=2,os(this)):Xl(this,this.S-o)};function os(o){o.j.G==0||o.J||wc(o.j,o)}function Gt(o){lo(o);var c=o.M;c&&typeof c.ma=="function"&&c.ma(),o.M=null,Ul(o.U),o.g&&(c=o.g,o.g=null,c.abort(),c.ma())}function co(o,c){try{var d=o.j;if(d.G!=0&&(d.g==o||uo(d.h,o))){if(!o.K&&uo(d.h,o)&&d.G==3){try{var _=d.Da.g.parse(c)}catch{_=null}if(Array.isArray(_)&&_.length==3){var C=_;if(C[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<o.F)bi(d),Si(d);else break e;_o(d),Le(18)}}else d.za=C[1],0<d.za-d.T&&37500>C[2]&&d.F&&d.v==0&&!d.C&&(d.C=is(m(d.Za,d),6e3));if(1>=ec(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else Qt(d,11)}else if((o.K||d.g==o)&&bi(d),!j(c))for(C=d.Da.g.parse(c),c=0;c<C.length;c++){let X=C[c];if(d.T=X[0],X=X[1],d.G==2)if(X[0]=="c"){d.K=X[1],d.ia=X[2];const De=X[3];De!=null&&(d.la=De,d.j.info("VER="+d.la));const ke=X[4];ke!=null&&(d.Aa=ke,d.j.info("SVER="+d.Aa));const gn=X[5];gn!=null&&typeof gn=="number"&&0<gn&&(_=1.5*gn,d.L=_,d.j.info("backChannelRequestTimeoutMs_="+_)),_=d;const Ke=o.g;if(Ke){const Ni=Ke.g?Ke.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ni){var S=_.h;S.g||Ni.indexOf("spdy")==-1&&Ni.indexOf("quic")==-1&&Ni.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(ho(S,S.h),S.h=null))}if(_.D){const go=Ke.g?Ke.g.getResponseHeader("X-HTTP-Session-Id"):null;go&&(_.ya=go,ie(_.I,_.D,go))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-o.F,d.j.info("Handshake RTT: "+d.R+"ms")),_=d;var V=o;if(_.qa=Sc(_,_.J?_.ia:null,_.W),V.K){tc(_.h,V);var te=V,Ae=_.L;Ae&&(te.I=Ae),te.B&&(lo(te),vi(te)),_.g=V}else Tc(_);0<d.i.length&&Ri(d)}else X[0]!="stop"&&X[0]!="close"||Qt(d,7);else d.G==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?Qt(d,7):po(d):X[0]!="noop"&&d.l&&d.l.ta(X),d.v=0)}}ss(4)}catch{}}var Qp=class{constructor(o,c){this.g=o,this.map=c}};function Jl(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Zl(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function ec(o){return o.h?1:o.g?o.g.size:0}function uo(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function ho(o,c){o.g?o.g.add(c):o.h=c}function tc(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}Jl.prototype.cancel=function(){if(this.i=nc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function nc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const d of o.g.values())c=c.concat(d.D);return c}return D(o.i)}function Yp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var c=[],d=o.length,_=0;_<d;_++)c.push(o[_]);return c}c=[],d=0;for(_ in o)c[d++]=o[_];return c}function Xp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var c=[];o=o.length;for(var d=0;d<o;d++)c.push(d);return c}c=[],d=0;for(const _ in o)c[d++]=_;return c}}}function sc(o,c){if(o.forEach&&typeof o.forEach=="function")o.forEach(c,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,c,void 0);else for(var d=Xp(o),_=Yp(o),C=_.length,S=0;S<C;S++)c.call(void 0,_[S],d&&d[S],o)}var ic=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Jp(o,c){if(o){o=o.split("&");for(var d=0;d<o.length;d++){var _=o[d].indexOf("="),C=null;if(0<=_){var S=o[d].substring(0,_);C=o[d].substring(_+1)}else S=o[d];c(S,C?decodeURIComponent(C.replace(/\+/g," ")):"")}}}function Kt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Kt){this.h=o.h,Ei(this,o.j),this.o=o.o,this.g=o.g,Ti(this,o.s),this.l=o.l;var c=o.i,d=new cs;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),rc(this,d),this.m=o.m}else o&&(c=String(o).match(ic))?(this.h=!1,Ei(this,c[1]||"",!0),this.o=as(c[2]||""),this.g=as(c[3]||"",!0),Ti(this,c[4]),this.l=as(c[5]||"",!0),rc(this,c[6]||"",!0),this.m=as(c[7]||"")):(this.h=!1,this.i=new cs(null,this.h))}Kt.prototype.toString=function(){var o=[],c=this.j;c&&o.push(ls(c,oc,!0),":");var d=this.g;return(d||c=="file")&&(o.push("//"),(c=this.o)&&o.push(ls(c,oc,!0),"@"),o.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&o.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&o.push("/"),o.push(ls(d,d.charAt(0)=="/"?t_:e_,!0))),(d=this.i.toString())&&o.push("?",d),(d=this.m)&&o.push("#",ls(d,s_)),o.join("")};function ht(o){return new Kt(o)}function Ei(o,c,d){o.j=d?as(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function Ti(o,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);o.s=c}else o.s=null}function rc(o,c,d){c instanceof cs?(o.i=c,i_(o.i,o.h)):(d||(c=ls(c,n_)),o.i=new cs(c,o.h))}function ie(o,c,d){o.i.set(c,d)}function Ii(o){return ie(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function as(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function ls(o,c,d){return typeof o=="string"?(o=encodeURI(o).replace(c,Zp),d&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Zp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var oc=/[#\/\?@]/g,e_=/[#\?:]/g,t_=/[#\?]/g,n_=/[#\?@]/g,s_=/#/g;function cs(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function wt(o){o.g||(o.g=new Map,o.h=0,o.i&&Jp(o.i,function(c,d){o.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=cs.prototype,n.add=function(o,c){wt(this),this.i=null,o=_n(this,o);var d=this.g.get(o);return d||this.g.set(o,d=[]),d.push(c),this.h+=1,this};function ac(o,c){wt(o),c=_n(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function lc(o,c){return wt(o),c=_n(o,c),o.g.has(c)}n.forEach=function(o,c){wt(this),this.g.forEach(function(d,_){d.forEach(function(C){o.call(c,C,_,this)},this)},this)},n.na=function(){wt(this);const o=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let _=0;_<c.length;_++){const C=o[_];for(let S=0;S<C.length;S++)d.push(c[_])}return d},n.V=function(o){wt(this);let c=[];if(typeof o=="string")lc(this,o)&&(c=c.concat(this.g.get(_n(this,o))));else{o=Array.from(this.g.values());for(let d=0;d<o.length;d++)c=c.concat(o[d])}return c},n.set=function(o,c){return wt(this),this.i=null,o=_n(this,o),lc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},n.get=function(o,c){return o?(o=this.V(o),0<o.length?String(o[0]):c):c};function cc(o,c,d){ac(o,c),0<d.length&&(o.i=null,o.g.set(_n(o,c),D(d)),o.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var _=c[d];const S=encodeURIComponent(String(_)),V=this.V(_);for(_=0;_<V.length;_++){var C=S;V[_]!==""&&(C+="="+encodeURIComponent(String(V[_]))),o.push(C)}}return this.i=o.join("&")};function _n(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function i_(o,c){c&&!o.j&&(wt(o),o.i=null,o.g.forEach(function(d,_){var C=_.toLowerCase();_!=C&&(ac(this,_),cc(this,C,d))},o)),o.j=c}function r_(o,c){const d=new rs;if(l.Image){const _=new Image;_.onload=w(Ct,d,"TestLoadImage: loaded",!0,c,_),_.onerror=w(Ct,d,"TestLoadImage: error",!1,c,_),_.onabort=w(Ct,d,"TestLoadImage: abort",!1,c,_),_.ontimeout=w(Ct,d,"TestLoadImage: timeout",!1,c,_),l.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=o}else c(!1)}function o_(o,c){const d=new rs,_=new AbortController,C=setTimeout(()=>{_.abort(),Ct(d,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:_.signal}).then(S=>{clearTimeout(C),S.ok?Ct(d,"TestPingServer: ok",!0,c):Ct(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(C),Ct(d,"TestPingServer: error",!1,c)})}function Ct(o,c,d,_,C){try{C&&(C.onload=null,C.onerror=null,C.onabort=null,C.ontimeout=null),_(d)}catch{}}function a_(){this.g=new Wp}function l_(o,c,d){const _=d||"";try{sc(o,function(C,S){let V=C;h(C)&&(V=to(C)),c.push(_+S+"="+encodeURIComponent(V))})}catch(C){throw c.push(_+"type="+encodeURIComponent("_badmap")),C}}function wi(o){this.l=o.Ub||null,this.j=o.eb||!1}R(wi,no),wi.prototype.g=function(){return new Ci(this.l,this.j)},wi.prototype.i=(function(o){return function(){return o}})({});function Ci(o,c){Ne.call(this),this.D=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(Ci,Ne),n=Ci.prototype,n.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=c,this.readyState=1,hs(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(c.body=o),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,us(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,hs(this)),this.g&&(this.readyState=3,hs(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;uc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function uc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?us(this):hs(this),this.readyState==3&&uc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,us(this))},n.Qa=function(o){this.g&&(this.response=o,us(this))},n.ga=function(){this.g&&us(this)};function us(o){o.readyState=4,o.l=null,o.j=null,o.v=null,hs(o)}n.setRequestHeader=function(o,c){this.u.append(o,c)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,o.push(d[0]+": "+d[1]),d=c.next();return o.join(`\r
`)};function hs(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ci.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function hc(o){let c="";return Ce(o,function(d,_){c+=_,c+=":",c+=d,c+=`\r
`}),c}function fo(o,c,d){e:{for(_ in d){var _=!1;break e}_=!0}_||(d=hc(d),typeof o=="string"?d!=null&&encodeURIComponent(String(d)):ie(o,c,d))}function he(o){Ne.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(he,Ne);var c_=/^https?$/i,u_=["POST","PUT"];n=he.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,c,d,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ro.g(),this.v=this.o?Bl(this.o):Bl(ro),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(S){dc(this,S);return}if(o=d||"",d=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var C in _)d.set(C,_[C]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const S of _.keys())d.set(S,_.get(S));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),C=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(u_,c,void 0))||_||C||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,V]of d)this.g.setRequestHeader(S,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{_c(this),this.u=!0,this.g.send(o),this.u=!1}catch(S){dc(this,S)}};function dc(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.m=5,fc(o),Ai(o)}function fc(o){o.A||(o.A=!0,Me(o,"complete"),Me(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Me(this,"complete"),Me(this,"abort"),Ai(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ai(this,!0)),he.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?pc(this):this.bb())},n.bb=function(){pc(this)};function pc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||dt(o)!=4||o.Z()!=2)){if(o.u&&dt(o)==4)Ml(o.Ea,0,o);else if(Me(o,"readystatechange"),dt(o)==4){o.h=!1;try{const V=o.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var _;if(_=V===0){var C=String(o.D).match(ic)[1]||null;!C&&l.self&&l.self.location&&(C=l.self.location.protocol.slice(0,-1)),_=!c_.test(C?C.toLowerCase():"")}d=_}if(d)Me(o,"complete"),Me(o,"success");else{o.m=6;try{var S=2<dt(o)?o.g.statusText:""}catch{S=""}o.l=S+" ["+o.Z()+"]",fc(o)}}finally{Ai(o)}}}}function Ai(o,c){if(o.g){_c(o);const d=o.g,_=o.v[0]?()=>{}:null;o.g=null,o.v=null,c||Me(o,"ready");try{d.onreadystatechange=_}catch{}}}function _c(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function dt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<dt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),qp(c)}};function mc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function h_(o){const c={};o=(o.g&&2<=dt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<o.length;_++){if(j(o[_]))continue;var d=T(o[_]);const C=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=c[C]||[];c[C]=S,S.push(d)}I(c,function(_){return _.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ds(o,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[o]||c}function gc(o){this.Aa=0,this.i=[],this.j=new rs,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ds("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ds("baseRetryDelayMs",5e3,o),this.cb=ds("retryDelaySeedMs",1e4,o),this.Wa=ds("forwardChannelMaxRetries",2,o),this.wa=ds("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Jl(o&&o.concurrentRequestLimit),this.Da=new a_,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=gc.prototype,n.la=8,n.G=1,n.connect=function(o,c,d,_){Le(0),this.W=o,this.H=c||{},d&&_!==void 0&&(this.H.OSID=d,this.H.OAID=_),this.F=this.X,this.I=Sc(this,null,this.W),Ri(this)};function po(o){if(yc(o),o.G==3){var c=o.U++,d=ht(o.I);if(ie(d,"SID",o.K),ie(d,"RID",c),ie(d,"TYPE","terminate"),fs(o,d),c=new It(o,o.j,c),c.L=2,c.v=Ii(ht(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=c.v,d=!0),d||(c.g=Rc(c.j,null),c.g.ea(c.v)),c.F=Date.now(),vi(c)}Ac(o)}function Si(o){o.g&&(mo(o),o.g.cancel(),o.g=null)}function yc(o){Si(o),o.u&&(l.clearTimeout(o.u),o.u=null),bi(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ri(o){if(!Zl(o.h)&&!o.s){o.s=!0;var c=o.Ga;Jn||Dl(),Zn||(Jn(),Zn=!0),Gr.add(c,o),o.B=0}}function d_(o,c){return ec(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=c.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=is(m(o.Ga,o,c),Cc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const C=new It(this,this.j,o);let S=this.o;if(this.S&&(S?(S=g(S),E(S,this.S)):S=this.S),this.m!==null||this.O||(C.H=S,S=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var _=this.i[d];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(c+=_,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Ec(this,C,c),d=ht(this.I),ie(d,"RID",o),ie(d,"CVER",22),this.D&&ie(d,"X-HTTP-Session-Id",this.D),fs(this,d),S&&(this.O?c="headers="+encodeURIComponent(String(hc(S)))+"&"+c:this.m&&fo(d,this.m,S)),ho(this.h,C),this.Ua&&ie(d,"TYPE","init"),this.P?(ie(d,"$req",c),ie(d,"SID","null"),C.T=!0,ao(C,d,null)):ao(C,d,c),this.G=2}}else this.G==3&&(o?vc(this,o):this.i.length==0||Zl(this.h)||vc(this))};function vc(o,c){var d;c?d=c.l:d=o.U++;const _=ht(o.I);ie(_,"SID",o.K),ie(_,"RID",d),ie(_,"AID",o.T),fs(o,_),o.m&&o.o&&fo(_,o.m,o.o),d=new It(o,o.j,d,o.B+1),o.m===null&&(d.H=o.o),c&&(o.i=c.D.concat(o.i)),c=Ec(o,d,1e3),d.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),ho(o.h,d),ao(d,_,c)}function fs(o,c){o.H&&Ce(o.H,function(d,_){ie(c,_,d)}),o.l&&sc({},function(d,_){ie(c,_,d)})}function Ec(o,c,d){d=Math.min(o.i.length,d);var _=o.l?m(o.l.Na,o.l,o):null;e:{var C=o.i;let S=-1;for(;;){const V=["count="+d];S==-1?0<d?(S=C[0].g,V.push("ofs="+S)):S=0:V.push("ofs="+S);let te=!0;for(let Ae=0;Ae<d;Ae++){let X=C[Ae].g;const De=C[Ae].map;if(X-=S,0>X)S=Math.max(0,C[Ae].g-100),te=!1;else try{l_(De,V,"req"+X+"_")}catch{_&&_(De)}}if(te){_=V.join("&");break e}}}return o=o.i.splice(0,d),c.D=o,_}function Tc(o){if(!o.g&&!o.u){o.Y=1;var c=o.Fa;Jn||Dl(),Zn||(Jn(),Zn=!0),Gr.add(c,o),o.v=0}}function _o(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=is(m(o.Fa,o),Cc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Ic(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=is(m(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Le(10),Si(this),Ic(this))};function mo(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Ic(o){o.g=new It(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var c=ht(o.qa);ie(c,"RID","rpc"),ie(c,"SID",o.K),ie(c,"AID",o.T),ie(c,"CI",o.F?"0":"1"),!o.F&&o.ja&&ie(c,"TO",o.ja),ie(c,"TYPE","xmlhttp"),fs(o,c),o.m&&o.o&&fo(c,o.m,o.o),o.L&&(o.g.I=o.L);var d=o.g;o=o.ia,d.L=1,d.v=Ii(ht(c)),d.m=null,d.P=!0,Ql(d,o)}n.Za=function(){this.C!=null&&(this.C=null,Si(this),_o(this),Le(19))};function bi(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function wc(o,c){var d=null;if(o.g==c){bi(o),mo(o),o.g=null;var _=2}else if(uo(o.h,c))d=c.D,tc(o.h,c),_=1;else return;if(o.G!=0){if(c.o)if(_==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var C=o.B;_=mi(),Me(_,new $l(_,d)),Ri(o)}else Tc(o);else if(C=c.s,C==3||C==0&&0<c.X||!(_==1&&d_(o,c)||_==2&&_o(o)))switch(d&&0<d.length&&(c=o.h,c.i=c.i.concat(d)),C){case 1:Qt(o,5);break;case 4:Qt(o,10);break;case 3:Qt(o,6);break;default:Qt(o,2)}}}function Cc(o,c){let d=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(d*=2),d*c}function Qt(o,c){if(o.j.info("Error code "+c),c==2){var d=m(o.fb,o),_=o.Xa;const C=!_;_=new Kt(_||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Ei(_,"https"),Ii(_),C?r_(_.toString(),d):o_(_.toString(),d)}else Le(2);o.G=0,o.l&&o.l.sa(c),Ac(o),yc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Le(2)):(this.j.info("Failed to ping google.com"),Le(1))};function Ac(o){if(o.G=0,o.ka=[],o.l){const c=nc(o.h);(c.length!=0||o.i.length!=0)&&(N(o.ka,c),N(o.ka,o.i),o.h.i.length=0,D(o.i),o.i.length=0),o.l.ra()}}function Sc(o,c,d){var _=d instanceof Kt?ht(d):new Kt(d);if(_.g!="")c&&(_.g=c+"."+_.g),Ti(_,_.s);else{var C=l.location;_=C.protocol,c=c?c+"."+C.hostname:C.hostname,C=+C.port;var S=new Kt(null);_&&Ei(S,_),c&&(S.g=c),C&&Ti(S,C),d&&(S.l=d),_=S}return d=o.D,c=o.ya,d&&c&&ie(_,d,c),ie(_,"VER",o.la),fs(o,_),_}function Rc(o,c,d){if(c&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Ca&&!o.pa?new he(new wi({eb:d})):new he(o.pa),c.Ha(o.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function bc(){}n=bc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Pi(){}Pi.prototype.g=function(o,c){return new je(o,c)};function je(o,c){Ne.call(this),this.g=new gc(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(o?o["X-WebChannel-Client-Profile"]=c.va:o={"X-WebChannel-Client-Profile":c.va}),this.g.S=o,(o=c&&c.Sb)&&!j(o)&&(this.g.m=o),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!j(c)&&(this.g.D=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new mn(this)}R(je,Ne),je.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},je.prototype.close=function(){po(this.g)},je.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var d={};d.__data__=o,o=d}else this.u&&(d={},d.__data__=to(o),o=d);c.i.push(new Qp(c.Ya++,o)),c.G==3&&Ri(c)},je.prototype.N=function(){this.g.l=null,delete this.j,po(this.g),delete this.g,je.aa.N.call(this)};function Pc(o){so.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){e:{for(const d in c){o=d;break e}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}R(Pc,so);function Nc(){io.call(this),this.status=1}R(Nc,io);function mn(o){this.g=o}R(mn,bc),mn.prototype.ua=function(){Me(this.g,"a")},mn.prototype.ta=function(o){Me(this.g,new Pc(o))},mn.prototype.sa=function(o){Me(this.g,new Nc)},mn.prototype.ra=function(){Me(this.g,"b")},Pi.prototype.createWebChannel=Pi.prototype.g,je.prototype.send=je.prototype.o,je.prototype.open=je.prototype.m,je.prototype.close=je.prototype.close,sf=function(){return new Pi},nf=function(){return mi()},tf=Ht,sa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},gi.NO_ERROR=0,gi.TIMEOUT=8,gi.HTTP_ERROR=6,Bi=gi,Hl.COMPLETE="complete",ef=Hl,jl.EventType=ns,ns.OPEN="a",ns.CLOSE="b",ns.ERROR="c",ns.MESSAGE="d",Ne.prototype.listen=Ne.prototype.K,Es=jl,he.prototype.listenOnce=he.prototype.L,he.prototype.getLastError=he.prototype.Ka,he.prototype.getLastErrorCode=he.prototype.Ba,he.prototype.getStatus=he.prototype.Z,he.prototype.getResponseJson=he.prototype.Oa,he.prototype.getResponseText=he.prototype.oa,he.prototype.send=he.prototype.ea,he.prototype.setWithCredentials=he.prototype.Ha,Zd=he}).apply(typeof Vi<"u"?Vi:typeof self<"u"?self:typeof window<"u"?window:{});const Cu="@firebase/firestore",Au="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}xe.UNAUTHENTICATED=new xe(null),xe.GOOGLE_CREDENTIALS=new xe("google-credentials-uid"),xe.FIRST_PARTY=new xe("first-party-uid"),xe.MOCK_USER=new xe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gn="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const on=new Ia("@firebase/firestore");function vn(){return on.logLevel}function x(n,...e){if(on.logLevel<=Q.DEBUG){const t=e.map(nl);on.debug(`Firestore (${Gn}): ${n}`,...t)}}function yt(n,...e){if(on.logLevel<=Q.ERROR){const t=e.map(nl);on.error(`Firestore (${Gn}): ${n}`,...t)}}function Ut(n,...e){if(on.logLevel<=Q.WARN){const t=e.map(nl);on.warn(`Firestore (${Gn}): ${n}`,...t)}}function nl(n){if(typeof n=="string")return n;try{/**
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
 */function F(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,rf(n,s,t)}function rf(n,e,t){let s=`FIRESTORE (${Gn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw yt(s),new Error(s)}function Z(n,e,t,s){let i="Unexpected state";typeof t=="string"?i=t:s=t,n||rf(e,i,s)}function B(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class O extends qn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class uE{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(xe.UNAUTHENTICATED)))}shutdown(){}}class hE{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class dE{constructor(e){this.t=e,this.currentUser=xe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Z(this.o===void 0,42304);let s=this.i;const i=u=>this.i!==s?(s=this.i,t(u)):Promise.resolve();let r=new Vt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Vt,e.enqueueRetryable((()=>i(this.currentUser)))};const a=()=>{const u=r;e.enqueueRetryable((async()=>{await u.promise,await i(this.currentUser)}))},l=u=>{x("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((u=>l(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(x("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Vt)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(x("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Z(typeof s.accessToken=="string",31837,{l:s}),new of(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Z(e===null||typeof e=="string",2055,{h:e}),new xe(e)}}class fE{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=xe.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class pE{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new fE(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(xe.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Su{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class _E{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Oh(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Z(this.o===void 0,3512);const s=r=>{r.error!=null&&x("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const a=r.token!==this.m;return this.m=r.token,x("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable((()=>s(r)))};const i=r=>{x("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((r=>i(r))),setTimeout((()=>{if(!this.appCheck){const r=this.V.getImmediate({optional:!0});r?i(r):x("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Su(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Z(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Su(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function mE(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
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
 */function af(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const i=mE(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<t&&(s+=e.charAt(i[r]%62))}return s}}function z(n,e){return n<e?-1:n>e?1:0}function ia(n,e){let t=0;for(;t<n.length&&t<e.length;){const s=n.codePointAt(t),i=e.codePointAt(t);if(s!==i){if(s<128&&i<128)return z(s,i);{const r=af(),a=gE(r.encode(Ru(n,t)),r.encode(Ru(e,t)));return a!==0?a:z(s,i)}}t+=s>65535?2:1}return z(n.length,e.length)}function Ru(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function gE(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return z(n[t],e[t]);return z(n.length,e.length)}function Mn(n,e,t){return n.length===e.length&&n.every(((s,i)=>t(s,e[i])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bu="__name__";class Ze{constructor(e,t,s){t===void 0?t=0:t>e.length&&F(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&F(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Ze.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ze?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let i=0;i<s;i++){const r=Ze.compareSegments(e.get(i),t.get(i));if(r!==0)return r}return z(e.length,t.length)}static compareSegments(e,t){const s=Ze.isNumericId(e),i=Ze.isNumericId(t);return s&&!i?-1:!s&&i?1:s&&i?Ze.extractNumericId(e).compare(Ze.extractNumericId(t)):ia(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return kt.fromString(e.substring(4,e.length-2))}}class oe extends Ze{construct(e,t,s){return new oe(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new O(P.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((i=>i.length>0)))}return new oe(t)}static emptyPath(){return new oe([])}}const yE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Re extends Ze{construct(e,t,s){return new Re(e,t,s)}static isValidIdentifier(e){return yE.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Re.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===bu}static keyField(){return new Re([bu])}static fromServerFormat(e){const t=[];let s="",i=0;const r=()=>{if(s.length===0)throw new O(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new O(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new O(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,i+=2}else l==="`"?(a=!a,i++):l!=="."||a?(s+=l,i++):(r(),i++)}if(r(),a)throw new O(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Re(t)}static emptyPath(){return new Re([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */function vE(n,e,t){if(!t)throw new O(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function EE(n,e,t,s){if(e===!0&&s===!0)throw new O(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Pu(n){if(!M.isDocumentKey(n))throw new O(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function lf(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function il(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":F(12329,{type:typeof n})}function xt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new O(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=il(n);throw new O(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */function _e(n,e){const t={typeString:n};return e&&(t.value=e),t}function ai(n,e){if(!lf(n))throw new O(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const i=e[s].typeString,r="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const a=n[s];if(i&&typeof a!==i){t=`JSON field '${s}' must be a ${i}.`;break}if(r!==void 0&&a!==r.value){t=`Expected '${s}' field to equal '${r.value}'`;break}}if(t)throw new O(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu=-62135596800,Du=1e6;class re{static now(){return re.fromMillis(Date.now())}static fromDate(e){return re.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Du);return new re(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Nu)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Du}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:re._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ai(e,re._jsonSchema))return new re(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Nu;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}re._jsonSchemaVersion="firestore/timestamp/1.0",re._jsonSchema={type:_e("string",re._jsonSchemaVersion),seconds:_e("number"),nanoseconds:_e("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */const Hs=-1;function TE(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=U.fromTimestamp(s===1e9?new re(t+1,0):new re(t,s));return new Bt(i,M.empty(),e)}function IE(n){return new Bt(n.readTime,n.key,Hs)}class Bt{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Bt(U.min(),M.empty(),Hs)}static max(){return new Bt(U.max(),M.empty(),Hs)}}function wE(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(n.documentKey,e.documentKey),t!==0?t:z(n.largestBatchId,e.largestBatchId))}/**
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
 */const CE="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class AE{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kn(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==CE)throw n;x("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new b(((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(t,r).next(s,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof b?t:b.resolve(t)}catch(t){return b.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):b.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):b.reject(t)}static resolve(e){return new b(((t,s)=>{t(e)}))}static reject(e){return new b(((t,s)=>{s(e)}))}static waitFor(e){return new b(((t,s)=>{let i=0,r=0,a=!1;e.forEach((l=>{++i,l.next((()=>{++r,a&&r===i&&t()}),(u=>s(u)))})),a=!0,r===i&&t()}))}static or(e){let t=b.resolve(!1);for(const s of e)t=t.next((i=>i?b.resolve(i):s()));return t}static forEach(e,t){const s=[];return e.forEach(((i,r)=>{s.push(t.call(this,i,r))})),this.waitFor(s)}static mapArray(e,t){return new b(((s,i)=>{const r=e.length,a=new Array(r);let l=0;for(let u=0;u<r;u++){const h=u;t(e[h]).next((f=>{a[h]=f,++l,l===r&&s(a)}),(f=>i(f)))}}))}static doWhile(e,t){return new b(((s,i)=>{const r=()=>{e()===!0?t().next((()=>{r()}),i):s()};r()}))}}function SE(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Qn(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Vr{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Vr.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl=-1;function xr(n){return n==null}function ar(n){return n===0&&1/n==-1/0}function RE(n){return typeof n=="number"&&Number.isInteger(n)&&!ar(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf="";function bE(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=ku(e)),e=PE(n.get(t),e);return ku(e)}function PE(n,e){let t=e;const s=n.length;for(let i=0;i<s;i++){const r=n.charAt(i);switch(r){case"\0":t+="";break;case cf:t+="";break;default:t+=r}}return t}function ku(n){return n+cf+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vu(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function un(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function uf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t){this.comparator=e,this.root=t||Se.EMPTY}insert(e,t){return new ce(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Se.BLACK,null,null))}remove(e){return new ce(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Se.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return t+s.left.size;i<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new xi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new xi(this.root,e,this.comparator,!1)}getReverseIterator(){return new xi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new xi(this.root,e,this.comparator,!0)}}class xi{constructor(e,t,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?s(e.key,t):1,t&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Se{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??Se.RED,this.left=i??Se.EMPTY,this.right=r??Se.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,i,r){return new Se(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Se.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Se.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Se.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Se.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw F(43730,{key:this.key,value:this.value});if(this.right.isRed())throw F(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw F(27949);return e+(this.isRed()?0:1)}}Se.EMPTY=null,Se.RED=!0,Se.BLACK=!1;Se.EMPTY=new class{constructor(){this.size=0}get key(){throw F(57766)}get value(){throw F(16141)}get color(){throw F(16727)}get left(){throw F(29726)}get right(){throw F(36894)}copy(e,t,s,i,r){return this}insert(e,t,s){return new Se(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e){this.comparator=e,this.data=new ce(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new xu(this.data.getIterator())}getIteratorFrom(e){return new xu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof ve)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ve(this.comparator);return t.data=e,t}}class xu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Xe{constructor(e){this.fields=e,e.sort(Re.comparator)}static empty(){return new Xe([])}unionWith(e){let t=new ve(Re.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Xe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Mn(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
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
 */class hf extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class be{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new hf("Invalid base64 string: "+r):r}})(e);return new be(t)}static fromUint8Array(e){const t=(function(i){let r="";for(let a=0;a<i.length;++a)r+=String.fromCharCode(i[a]);return r})(e);return new be(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}be.EMPTY_BYTE_STRING=new be("");const NE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function jt(n){if(Z(!!n,39018),typeof n=="string"){let e=0;const t=NE.exec(n);if(Z(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:fe(n.seconds),nanos:fe(n.nanos)}}function fe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function qt(n){return typeof n=="string"?be.fromBase64String(n):be.fromUint8Array(n)}/**
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
 */const df="server_timestamp",ff="__type__",pf="__previous_value__",_f="__local_write_time__";function ol(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[ff])===null||t===void 0?void 0:t.stringValue)===df}function Or(n){const e=n.mapValue.fields[pf];return ol(e)?Or(e):e}function Gs(n){const e=jt(n.mapValue.fields[_f].timestampValue);return new re(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DE{constructor(e,t,s,i,r,a,l,u,h,f){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f}}const lr="(default)";class Ks{constructor(e,t){this.projectId=e,this.database=t||lr}static empty(){return new Ks("","")}get isDefaultDatabase(){return this.database===lr}isEqual(e){return e instanceof Ks&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const mf="__type__",kE="__max__",Oi={mapValue:{}},gf="__vector__",cr="value";function Wt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ol(n)?4:xE(n)?9007199254740991:VE(n)?10:11:F(28295,{value:n})}function ot(n,e){if(n===e)return!0;const t=Wt(n);if(t!==Wt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Gs(n).isEqual(Gs(e));case 3:return(function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const a=jt(i.timestampValue),l=jt(r.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,r){return qt(i.bytesValue).isEqual(qt(r.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,r){return fe(i.geoPointValue.latitude)===fe(r.geoPointValue.latitude)&&fe(i.geoPointValue.longitude)===fe(r.geoPointValue.longitude)})(n,e);case 2:return(function(i,r){if("integerValue"in i&&"integerValue"in r)return fe(i.integerValue)===fe(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const a=fe(i.doubleValue),l=fe(r.doubleValue);return a===l?ar(a)===ar(l):isNaN(a)&&isNaN(l)}return!1})(n,e);case 9:return Mn(n.arrayValue.values||[],e.arrayValue.values||[],ot);case 10:case 11:return(function(i,r){const a=i.mapValue.fields||{},l=r.mapValue.fields||{};if(Vu(a)!==Vu(l))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(l[u]===void 0||!ot(a[u],l[u])))return!1;return!0})(n,e);default:return F(52216,{left:n})}}function Qs(n,e){return(n.values||[]).find((t=>ot(t,e)))!==void 0}function Ln(n,e){if(n===e)return 0;const t=Wt(n),s=Wt(e);if(t!==s)return z(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(n.booleanValue,e.booleanValue);case 2:return(function(r,a){const l=fe(r.integerValue||r.doubleValue),u=fe(a.integerValue||a.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1})(n,e);case 3:return Ou(n.timestampValue,e.timestampValue);case 4:return Ou(Gs(n),Gs(e));case 5:return ia(n.stringValue,e.stringValue);case 6:return(function(r,a){const l=qt(r),u=qt(a);return l.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(r,a){const l=r.split("/"),u=a.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=z(l[h],u[h]);if(f!==0)return f}return z(l.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(r,a){const l=z(fe(r.latitude),fe(a.latitude));return l!==0?l:z(fe(r.longitude),fe(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Mu(n.arrayValue,e.arrayValue);case 10:return(function(r,a){var l,u,h,f;const p=r.fields||{},m=a.fields||{},w=(l=p[cr])===null||l===void 0?void 0:l.arrayValue,R=(u=m[cr])===null||u===void 0?void 0:u.arrayValue,D=z(((h=w==null?void 0:w.values)===null||h===void 0?void 0:h.length)||0,((f=R==null?void 0:R.values)===null||f===void 0?void 0:f.length)||0);return D!==0?D:Mu(w,R)})(n.mapValue,e.mapValue);case 11:return(function(r,a){if(r===Oi.mapValue&&a===Oi.mapValue)return 0;if(r===Oi.mapValue)return 1;if(a===Oi.mapValue)return-1;const l=r.fields||{},u=Object.keys(l),h=a.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const m=ia(u[p],f[p]);if(m!==0)return m;const w=Ln(l[u[p]],h[f[p]]);if(w!==0)return w}return z(u.length,f.length)})(n.mapValue,e.mapValue);default:throw F(23264,{le:t})}}function Ou(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return z(n,e);const t=jt(n),s=jt(e),i=z(t.seconds,s.seconds);return i!==0?i:z(t.nanos,s.nanos)}function Mu(n,e){const t=n.values||[],s=e.values||[];for(let i=0;i<t.length&&i<s.length;++i){const r=Ln(t[i],s[i]);if(r)return r}return z(t.length,s.length)}function Fn(n){return ra(n)}function ra(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=jt(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return qt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return M.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",i=!0;for(const r of t.values||[])i?i=!1:s+=",",s+=ra(r);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let i="{",r=!0;for(const a of s)r?r=!1:i+=",",i+=`${a}:${ra(t.fields[a])}`;return i+"}"})(n.mapValue):F(61005,{value:n})}function ji(n){switch(Wt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Or(n);return e?16+ji(e):16;case 5:return 2*n.stringValue.length;case 6:return qt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((i,r)=>i+ji(r)),0)})(n.arrayValue);case 10:case 11:return(function(s){let i=0;return un(s.fields,((r,a)=>{i+=r.length+ji(a)})),i})(n.mapValue);default:throw F(13486,{value:n})}}function oa(n){return!!n&&"integerValue"in n}function al(n){return!!n&&"arrayValue"in n}function Lu(n){return!!n&&"nullValue"in n}function Fu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function qi(n){return!!n&&"mapValue"in n}function VE(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[mf])===null||t===void 0?void 0:t.stringValue)===gf}function Ns(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return un(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Ns(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ns(n.arrayValue.values[t]);return e}return Object.assign({},n)}function xE(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===kE}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.value=e}static empty(){return new We({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!qi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ns(t)}setAll(e){let t=Re.emptyPath(),s={},i=[];e.forEach(((a,l)=>{if(!t.isImmediateParentOf(l)){const u=this.getFieldsMap(t);this.applyChanges(u,s,i),s={},i=[],t=l.popLast()}a?s[l.lastSegment()]=Ns(a):i.push(l.lastSegment())}));const r=this.getFieldsMap(t);this.applyChanges(r,s,i)}delete(e){const t=this.field(e.popLast());qi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ot(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=t.mapValue.fields[e.get(s)];qi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,s){un(t,((i,r)=>e[i]=r));for(const i of s)delete e[i]}clone(){return new We(Ns(this.value))}}function yf(n){const e=[];return un(n.fields,((t,s)=>{const i=new Re([t]);if(qi(s)){const r=yf(s.mapValue).fields;if(r.length===0)e.push(i);else for(const a of r)e.push(i.child(a))}else e.push(i)})),new Xe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,t,s,i,r,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=i,this.createTime=r,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Oe(e,0,U.min(),U.min(),U.min(),We.empty(),0)}static newFoundDocument(e,t,s,i){return new Oe(e,1,t,U.min(),s,i,0)}static newNoDocument(e,t){return new Oe(e,2,t,U.min(),U.min(),We.empty(),0)}static newUnknownDocument(e,t){return new Oe(e,3,t,U.min(),U.min(),We.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=We.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=We.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Oe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Oe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class ur{constructor(e,t){this.position=e,this.inclusive=t}}function Uu(n,e,t){let s=0;for(let i=0;i<n.position.length;i++){const r=e[i],a=n.position[i];if(r.field.isKeyField()?s=M.comparator(M.fromName(a.referenceValue),t.key):s=Ln(a,t.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Bu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ot(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class hr{constructor(e,t="asc"){this.field=e,this.dir=t}}function OE(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class vf{}class ge extends vf{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new LE(e,t,s):t==="array-contains"?new BE(e,s):t==="in"?new jE(e,s):t==="not-in"?new qE(e,s):t==="array-contains-any"?new WE(e,s):new ge(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new FE(e,s):new UE(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Ln(t,this.value)):t!==null&&Wt(this.value)===Wt(t)&&this.matchesComparison(Ln(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class at extends vf{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new at(e,t)}matches(e){return Ef(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Ef(n){return n.op==="and"}function Tf(n){return ME(n)&&Ef(n)}function ME(n){for(const e of n.filters)if(e instanceof at)return!1;return!0}function aa(n){if(n instanceof ge)return n.field.canonicalString()+n.op.toString()+Fn(n.value);if(Tf(n))return n.filters.map((e=>aa(e))).join(",");{const e=n.filters.map((t=>aa(t))).join(",");return`${n.op}(${e})`}}function If(n,e){return n instanceof ge?(function(s,i){return i instanceof ge&&s.op===i.op&&s.field.isEqual(i.field)&&ot(s.value,i.value)})(n,e):n instanceof at?(function(s,i){return i instanceof at&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce(((r,a,l)=>r&&If(a,i.filters[l])),!0):!1})(n,e):void F(19439)}function wf(n){return n instanceof ge?(function(t){return`${t.field.canonicalString()} ${t.op} ${Fn(t.value)}`})(n):n instanceof at?(function(t){return t.op.toString()+" {"+t.getFilters().map(wf).join(" ,")+"}"})(n):"Filter"}class LE extends ge{constructor(e,t,s){super(e,t,s),this.key=M.fromName(s.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class FE extends ge{constructor(e,t){super(e,"in",t),this.keys=Cf("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class UE extends ge{constructor(e,t){super(e,"not-in",t),this.keys=Cf("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Cf(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>M.fromName(s.referenceValue)))}class BE extends ge{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return al(t)&&Qs(t.arrayValue,this.value)}}class jE extends ge{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Qs(this.value.arrayValue,t)}}class qE extends ge{constructor(e,t){super(e,"not-in",t)}matches(e){if(Qs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Qs(this.value.arrayValue,t)}}class WE extends ge{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!al(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>Qs(this.value.arrayValue,s)))}}/**
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
 */class zE{constructor(e,t=null,s=[],i=[],r=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=a,this.endAt=l,this.Pe=null}}function ju(n,e=null,t=[],s=[],i=null,r=null,a=null){return new zE(n,e,t,s,i,r,a)}function ll(n){const e=B(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>aa(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(r){return r.field.canonicalString()+r.dir})(s))).join(","),xr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>Fn(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>Fn(s))).join(",")),e.Pe=t}return e.Pe}function cl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!OE(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!If(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Bu(n.startAt,e.startAt)&&Bu(n.endAt,e.endAt)}function la(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(e,t=null,s=[],i=[],r=null,a="F",l=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=a,this.startAt=l,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function $E(n,e,t,s,i,r,a,l){return new Mr(n,e,t,s,i,r,a,l)}function Lr(n){return new Mr(n)}function qu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function HE(n){return n.collectionGroup!==null}function Ds(n){const e=B(n);if(e.Te===null){e.Te=[];const t=new Set;for(const r of e.explicitOrderBy)e.Te.push(r),t.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new ve(Re.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(l=l.add(h.field))}))})),l})(e).forEach((r=>{t.has(r.canonicalString())||r.isKeyField()||e.Te.push(new hr(r,s))})),t.has(Re.keyField().canonicalString())||e.Te.push(new hr(Re.keyField(),s))}return e.Te}function nt(n){const e=B(n);return e.Ie||(e.Ie=GE(e,Ds(n))),e.Ie}function GE(n,e){if(n.limitType==="F")return ju(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((i=>{const r=i.dir==="desc"?"asc":"desc";return new hr(i.field,r)}));const t=n.endAt?new ur(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new ur(n.startAt.position,n.startAt.inclusive):null;return ju(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function ca(n,e,t){return new Mr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Fr(n,e){return cl(nt(n),nt(e))&&n.limitType===e.limitType}function Af(n){return`${ll(nt(n))}|lt:${n.limitType}`}function En(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((i=>wf(i))).join(", ")}]`),xr(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((i=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(i))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((i=>Fn(i))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((i=>Fn(i))).join(",")),`Target(${s})`})(nt(n))}; limitType=${n.limitType})`}function Ur(n,e){return e.isFoundDocument()&&(function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):M.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)})(n,e)&&(function(s,i){for(const r of Ds(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0})(n,e)&&(function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0})(n,e)&&(function(s,i){return!(s.startAt&&!(function(a,l,u){const h=Uu(a,l,u);return a.inclusive?h<=0:h<0})(s.startAt,Ds(s),i)||s.endAt&&!(function(a,l,u){const h=Uu(a,l,u);return a.inclusive?h>=0:h>0})(s.endAt,Ds(s),i))})(n,e)}function KE(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Sf(n){return(e,t)=>{let s=!1;for(const i of Ds(n)){const r=QE(i,e,t);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function QE(n,e,t){const s=n.field.isKeyField()?M.comparator(e.key,t.key):(function(r,a,l){const u=a.data.field(r),h=l.data.field(r);return u!==null&&h!==null?Ln(u,h):F(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return F(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[t]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){un(this.inner,((t,s)=>{for(const[i,r]of s)e(i,r)}))}isEmpty(){return uf(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YE=new ce(M.comparator);function vt(){return YE}const Rf=new ce(M.comparator);function Ts(...n){let e=Rf;for(const t of n)e=e.insert(t.key,t);return e}function bf(n){let e=Rf;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function Zt(){return ks()}function Pf(){return ks()}function ks(){return new hn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const XE=new ce(M.comparator),JE=new ve(M.comparator);function K(...n){let e=JE;for(const t of n)e=e.add(t);return e}const ZE=new ve(z);function eT(){return ZE}/**
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
 */function ul(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ar(e)?"-0":e}}function Nf(n){return{integerValue:""+n}}function tT(n,e){return RE(e)?Nf(e):ul(n,e)}/**
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
 */class Br{constructor(){this._=void 0}}function nT(n,e,t){return n instanceof dr?(function(i,r){const a={fields:{[ff]:{stringValue:df},[_f]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&ol(r)&&(r=Or(r)),r&&(a.fields[pf]=r),{mapValue:a}})(t,e):n instanceof Ys?kf(n,e):n instanceof Xs?Vf(n,e):(function(i,r){const a=Df(i,r),l=Wu(a)+Wu(i.Ee);return oa(a)&&oa(i.Ee)?Nf(l):ul(i.serializer,l)})(n,e)}function sT(n,e,t){return n instanceof Ys?kf(n,e):n instanceof Xs?Vf(n,e):t}function Df(n,e){return n instanceof fr?(function(s){return oa(s)||(function(r){return!!r&&"doubleValue"in r})(s)})(e)?e:{integerValue:0}:null}class dr extends Br{}class Ys extends Br{constructor(e){super(),this.elements=e}}function kf(n,e){const t=xf(e);for(const s of n.elements)t.some((i=>ot(i,s)))||t.push(s);return{arrayValue:{values:t}}}class Xs extends Br{constructor(e){super(),this.elements=e}}function Vf(n,e){let t=xf(e);for(const s of n.elements)t=t.filter((i=>!ot(i,s)));return{arrayValue:{values:t}}}class fr extends Br{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Wu(n){return fe(n.integerValue||n.doubleValue)}function xf(n){return al(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function iT(n,e){return n.field.isEqual(e.field)&&(function(s,i){return s instanceof Ys&&i instanceof Ys||s instanceof Xs&&i instanceof Xs?Mn(s.elements,i.elements,ot):s instanceof fr&&i instanceof fr?ot(s.Ee,i.Ee):s instanceof dr&&i instanceof dr})(n.transform,e.transform)}class rT{constructor(e,t){this.version=e,this.transformResults=t}}class _t{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new _t}static exists(e){return new _t(void 0,e)}static updateTime(e){return new _t(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Wi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class jr{}function Of(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Lf(n.key,_t.none()):new li(n.key,n.data,_t.none());{const t=n.data,s=We.empty();let i=new ve(Re.comparator);for(let r of e.fields)if(!i.has(r)){let a=t.field(r);a===null&&r.length>1&&(r=r.popLast(),a=t.field(r)),a===null?s.delete(r):s.set(r,a),i=i.add(r)}return new dn(n.key,s,new Xe(i.toArray()),_t.none())}}function oT(n,e,t){n instanceof li?(function(i,r,a){const l=i.value.clone(),u=$u(i.fieldTransforms,r,a.transformResults);l.setAll(u),r.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):n instanceof dn?(function(i,r,a){if(!Wi(i.precondition,r))return void r.convertToUnknownDocument(a.version);const l=$u(i.fieldTransforms,r,a.transformResults),u=r.data;u.setAll(Mf(i)),u.setAll(l),r.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(i,r,a){r.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Vs(n,e,t,s){return n instanceof li?(function(r,a,l,u){if(!Wi(r.precondition,a))return l;const h=r.value.clone(),f=Hu(r.fieldTransforms,u,a);return h.setAll(f),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null})(n,e,t,s):n instanceof dn?(function(r,a,l,u){if(!Wi(r.precondition,a))return l;const h=Hu(r.fieldTransforms,u,a),f=a.data;return f.setAll(Mf(r)),f.setAll(h),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map((p=>p.field)))})(n,e,t,s):(function(r,a,l){return Wi(r.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l})(n,e,t)}function aT(n,e){let t=null;for(const s of n.fieldTransforms){const i=e.data.field(s.field),r=Df(s.transform,i||null);r!=null&&(t===null&&(t=We.empty()),t.set(s.field,r))}return t||null}function zu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Mn(s,i,((r,a)=>iT(r,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class li extends jr{constructor(e,t,s,i=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class dn extends jr{constructor(e,t,s,i,r=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function Mf(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function $u(n,e,t){const s=new Map;Z(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let i=0;i<t.length;i++){const r=n[i],a=r.transform,l=e.data.field(r.field);s.set(r.field,sT(a,l,t[i]))}return s}function Hu(n,e,t){const s=new Map;for(const i of n){const r=i.transform,a=t.data.field(i.field);s.set(i.field,nT(r,a,e))}return s}class Lf extends jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class lT extends jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cT{constructor(e,t,s,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&oT(r,e,s[i])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Vs(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Vs(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Pf();return this.mutations.forEach((i=>{const r=e.get(i.key),a=r.overlayedDocument;let l=this.applyToLocalView(a,r.mutatedFields);l=t.has(i.key)?null:l;const u=Of(a,l);u!==null&&s.set(i.key,u),a.isValidDocument()||a.convertToNoDocument(U.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),K())}isEqual(e){return this.batchId===e.batchId&&Mn(this.mutations,e.mutations,((t,s)=>zu(t,s)))&&Mn(this.baseMutations,e.baseMutations,((t,s)=>zu(t,s)))}}class hl{constructor(e,t,s,i){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=i}static from(e,t,s){Z(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let i=(function(){return XE})();const r=e.mutations;for(let a=0;a<r.length;a++)i=i.insert(r[a].key,s[a].version);return new hl(e,t,s,i)}}/**
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
 */class uT{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class hT{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pe,Y;function dT(n){switch(n){case P.OK:return F(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return F(15467,{code:n})}}function Ff(n){if(n===void 0)return yt("GRPC error has no .code"),P.UNKNOWN;switch(n){case pe.OK:return P.OK;case pe.CANCELLED:return P.CANCELLED;case pe.UNKNOWN:return P.UNKNOWN;case pe.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case pe.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case pe.INTERNAL:return P.INTERNAL;case pe.UNAVAILABLE:return P.UNAVAILABLE;case pe.UNAUTHENTICATED:return P.UNAUTHENTICATED;case pe.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case pe.NOT_FOUND:return P.NOT_FOUND;case pe.ALREADY_EXISTS:return P.ALREADY_EXISTS;case pe.PERMISSION_DENIED:return P.PERMISSION_DENIED;case pe.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case pe.ABORTED:return P.ABORTED;case pe.OUT_OF_RANGE:return P.OUT_OF_RANGE;case pe.UNIMPLEMENTED:return P.UNIMPLEMENTED;case pe.DATA_LOSS:return P.DATA_LOSS;default:return F(39323,{code:n})}}(Y=pe||(pe={}))[Y.OK=0]="OK",Y[Y.CANCELLED=1]="CANCELLED",Y[Y.UNKNOWN=2]="UNKNOWN",Y[Y.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Y[Y.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Y[Y.NOT_FOUND=5]="NOT_FOUND",Y[Y.ALREADY_EXISTS=6]="ALREADY_EXISTS",Y[Y.PERMISSION_DENIED=7]="PERMISSION_DENIED",Y[Y.UNAUTHENTICATED=16]="UNAUTHENTICATED",Y[Y.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Y[Y.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Y[Y.ABORTED=10]="ABORTED",Y[Y.OUT_OF_RANGE=11]="OUT_OF_RANGE",Y[Y.UNIMPLEMENTED=12]="UNIMPLEMENTED",Y[Y.INTERNAL=13]="INTERNAL",Y[Y.UNAVAILABLE=14]="UNAVAILABLE",Y[Y.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const fT=new kt([4294967295,4294967295],0);function Gu(n){const e=af().encode(n),t=new Jd;return t.update(e),new Uint8Array(t.digest())}function Ku(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new kt([t,s],0),new kt([i,r],0)]}class dl{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Is(`Invalid padding: ${t}`);if(s<0)throw new Is(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Is(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Is(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=kt.fromNumber(this.fe)}pe(e,t,s){let i=e.add(t.multiply(kt.fromNumber(s)));return i.compare(fT)===1&&(i=new kt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Gu(e),[s,i]=Ku(t);for(let r=0;r<this.hashCount;r++){const a=this.pe(s,i,r);if(!this.ye(a))return!1}return!0}static create(e,t,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),a=new dl(r,i,t);return s.forEach((l=>a.insert(l))),a}insert(e){if(this.fe===0)return;const t=Gu(e),[s,i]=Ku(t);for(let r=0;r<this.hashCount;r++){const a=this.pe(s,i,r);this.we(a)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Is extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e,t,s,i,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const i=new Map;return i.set(e,ci.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new qr(U.min(),i,new ce(z),vt(),K())}}class ci{constructor(e,t,s,i,r){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new ci(s,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e,t,s,i){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=i}}class Uf{constructor(e,t){this.targetId=e,this.De=t}}class Bf{constructor(e,t,s=be.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=i}}class Qu{constructor(){this.ve=0,this.Ce=Yu(),this.Fe=be.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=K(),t=K(),s=K();return this.Ce.forEach(((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:s=s.add(i);break;default:F(38017,{changeType:r})}})),new ci(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=Yu()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Z(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class pT{constructor(e){this.We=e,this.Ge=new Map,this.ze=vt(),this.je=Mi(),this.Je=Mi(),this.He=new ce(z)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:F(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,i)=>{this.nt(i)&&t(i)}))}it(e){const t=e.targetId,s=e.De.count,i=this.st(t);if(i){const r=i.target;if(la(r))if(s===0){const a=new M(r.path);this.Xe(t,a,Oe.newNoDocument(a,U.min()))}else Z(s===1,20013,{expectedCount:s});else{const a=this.ot(t);if(a!==s){const l=this._t(e),u=l?this.ut(l,e,a):1;if(u!==0){this.rt(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,h)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=t;let a,l;try{a=qt(s).toUint8Array()}catch(u){if(u instanceof hf)return Ut("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new dl(a,i,r)}catch(u){return Ut(u instanceof Is?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.fe===0?null:l}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let i=0;return s.forEach((r=>{const a=this.We.lt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Xe(t,r,null),i++)})),i}Pt(e){const t=new Map;this.Ge.forEach(((r,a)=>{const l=this.st(a);if(l){if(r.current&&la(l.target)){const u=new M(l.target.path);this.Tt(u).has(a)||this.It(a,u)||this.Xe(a,u,Oe.newNoDocument(u,e))}r.Ne&&(t.set(a,r.Le()),r.ke())}}));let s=K();this.Je.forEach(((r,a)=>{let l=!0;a.forEachWhile((u=>{const h=this.st(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(s=s.add(r))})),this.ze.forEach(((r,a)=>a.setReadTime(e)));const i=new qr(e,t,this.He,this.ze,s);return this.ze=vt(),this.je=Mi(),this.Je=Mi(),this.He=new ce(z),i}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Qu,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new ve(z),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new ve(z),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||x("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Qu),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Mi(){return new ce(M.comparator)}function Yu(){return new ce(M.comparator)}const _T={asc:"ASCENDING",desc:"DESCENDING"},mT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gT={and:"AND",or:"OR"};class yT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ua(n,e){return n.useProto3Json||xr(e)?e:{value:e}}function pr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function jf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function vT(n,e){return pr(n,e.toTimestamp())}function st(n){return Z(!!n,49232),U.fromTimestamp((function(t){const s=jt(t);return new re(s.seconds,s.nanos)})(n))}function fl(n,e){return ha(n,e).canonicalString()}function ha(n,e){const t=(function(i){return new oe(["projects",i.projectId,"databases",i.database])})(n).child("documents");return e===void 0?t:t.child(e)}function qf(n){const e=oe.fromString(n);return Z(Gf(e),10190,{key:e.toString()}),e}function da(n,e){return fl(n.databaseId,e.path)}function No(n,e){const t=qf(e);if(t.get(1)!==n.databaseId.projectId)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new M(zf(t))}function Wf(n,e){return fl(n.databaseId,e)}function ET(n){const e=qf(n);return e.length===4?oe.emptyPath():zf(e)}function fa(n){return new oe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function zf(n){return Z(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Xu(n,e,t){return{name:da(n,e),fields:t.value.mapValue.fields}}function TT(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:F(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=(function(h,f){return h.useProto3Json?(Z(f===void 0||typeof f=="string",58123),be.fromBase64String(f||"")):(Z(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),be.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&(function(h){const f=h.code===void 0?P.UNKNOWN:Ff(h.code);return new O(f,h.message||"")})(a);t=new Bf(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=No(n,s.document.name),r=st(s.document.updateTime),a=s.document.createTime?st(s.document.createTime):U.min(),l=new We({mapValue:{fields:s.document.fields}}),u=Oe.newFoundDocument(i,r,a,l),h=s.targetIds||[],f=s.removedTargetIds||[];t=new zi(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=No(n,s.document),r=s.readTime?st(s.readTime):U.min(),a=Oe.newNoDocument(i,r),l=s.removedTargetIds||[];t=new zi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=No(n,s.document),r=s.removedTargetIds||[];t=new zi([],r,i,null)}else{if(!("filter"in e))return F(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,a=new hT(i,r),l=s.targetId;t=new Uf(l,a)}}return t}function IT(n,e){let t;if(e instanceof li)t={update:Xu(n,e.key,e.value)};else if(e instanceof Lf)t={delete:da(n,e.key)};else if(e instanceof dn)t={update:Xu(n,e.key,e.data),updateMask:DT(e.fieldMask)};else{if(!(e instanceof lT))return F(16599,{Rt:e.type});t={verify:da(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(r,a){const l=a.transform;if(l instanceof dr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Ys)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Xs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof fr)return{fieldPath:a.field.canonicalString(),increment:l.Ee};throw F(20930,{transform:a.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(i,r){return r.updateTime!==void 0?{updateTime:vT(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:F(27497)})(n,e.precondition)),t}function wT(n,e){return n&&n.length>0?(Z(e!==void 0,14353),n.map((t=>(function(i,r){let a=i.updateTime?st(i.updateTime):st(r);return a.isEqual(U.min())&&(a=st(r)),new rT(a,i.transformResults||[])})(t,e)))):[]}function CT(n,e){return{documents:[Wf(n,e.path)]}}function AT(n,e){const t={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Wf(n,i);const r=(function(h){if(h.length!==0)return Hf(at.create(h,"and"))})(e.filters);r&&(t.structuredQuery.where=r);const a=(function(h){if(h.length!==0)return h.map((f=>(function(m){return{field:Tn(m.field),direction:bT(m.dir)}})(f)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=ua(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{Vt:t,parent:i}}function ST(n){let e=ET(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let i=null;if(s>0){Z(s===1,65062);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let r=[];t.where&&(r=(function(p){const m=$f(p);return m instanceof at&&Tf(m)?m.getFilters():[m]})(t.where));let a=[];t.orderBy&&(a=(function(p){return p.map((m=>(function(R){return new hr(In(R.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(m)))})(t.orderBy));let l=null;t.limit&&(l=(function(p){let m;return m=typeof p=="object"?p.value:p,xr(m)?null:m})(t.limit));let u=null;t.startAt&&(u=(function(p){const m=!!p.before,w=p.values||[];return new ur(w,m)})(t.startAt));let h=null;return t.endAt&&(h=(function(p){const m=!p.before,w=p.values||[];return new ur(w,m)})(t.endAt)),$E(e,i,a,r,l,"F",u,h)}function RT(n,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F(28987,{purpose:i})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function $f(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=In(t.unaryFilter.field);return ge.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=In(t.unaryFilter.field);return ge.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=In(t.unaryFilter.field);return ge.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=In(t.unaryFilter.field);return ge.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return F(61313);default:return F(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ge.create(In(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return F(58110);default:return F(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return at.create(t.compositeFilter.filters.map((s=>$f(s))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return F(1026)}})(t.compositeFilter.op))})(n):F(30097,{filter:n})}function bT(n){return _T[n]}function PT(n){return mT[n]}function NT(n){return gT[n]}function Tn(n){return{fieldPath:n.canonicalString()}}function In(n){return Re.fromServerFormat(n.fieldPath)}function Hf(n){return n instanceof ge?(function(t){if(t.op==="=="){if(Fu(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NAN"}};if(Lu(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Fu(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NOT_NAN"}};if(Lu(t.value))return{unaryFilter:{field:Tn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Tn(t.field),op:PT(t.op),value:t.value}}})(n):n instanceof at?(function(t){const s=t.getFilters().map((i=>Hf(i)));return s.length===1?s[0]:{compositeFilter:{op:NT(t.op),filters:s}}})(n):F(54877,{filter:n})}function DT(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Gf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e,t,s,i,r=U.min(),a=U.min(),l=be.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new St(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new St(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new St(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new St(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kT{constructor(e){this.gt=e}}function VT(n){const e=ST({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ca(e,e.limit,"L"):e}/**
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
 */class xT{constructor(){this.Dn=new OT}addToCollectionParentIndex(e,t){return this.Dn.add(t),b.resolve()}getCollectionParents(e,t){return b.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return b.resolve()}deleteFieldIndex(e,t){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,t){return b.resolve()}getDocumentsMatchingTarget(e,t){return b.resolve(null)}getIndexType(e,t){return b.resolve(0)}getFieldIndexes(e,t){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,t){return b.resolve(Bt.min())}getMinOffsetFromCollectionGroup(e,t){return b.resolve(Bt.min())}updateCollectionGroup(e,t,s){return b.resolve()}updateIndexEntries(e,t){return b.resolve()}}class OT{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t]||new ve(oe.comparator),r=!i.has(s);return this.index[t]=i.add(s),r}has(e){const t=e.lastSegment(),s=e.popLast(),i=this.index[t];return i&&i.has(s)}getEntries(e){return(this.index[e]||new ve(oe.comparator)).toArray()}}/**
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
 */const Ju={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Kf=41943040;class Be{static withCacheSize(e){return new Be(e,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be.DEFAULT_COLLECTION_PERCENTILE=10,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Be.DEFAULT=new Be(Kf,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Be.DISABLED=new Be(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Un(0)}static ur(){return new Un(-1)}}/**
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
 */const Zu="LruGarbageCollector",MT=1048576;function eh([n,e],[t,s]){const i=z(n,t);return i===0?z(e,s):i}class LT{constructor(e){this.Tr=e,this.buffer=new ve(eh),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();eh(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class FT{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){x(Zu,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Qn(t)?x(Zu,"Ignoring IndexedDB error during garbage collection: ",t):await Kn(t)}await this.Rr(3e5)}))}}class UT{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return b.resolve(Vr.ue);const s=new LT(t);return this.Vr.forEachTarget(e,(i=>s.Er(i.sequenceNumber))).next((()=>this.Vr.gr(e,(i=>s.Er(i))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(x("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve(Ju)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(x("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ju):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,i,r,a,l,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(x("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,a=Date.now(),this.nthSequenceNumber(e,i)))).next((p=>(s=p,l=Date.now(),this.removeTargets(e,s,t)))).next((p=>(r=p,u=Date.now(),this.removeOrphanedDocuments(e,s)))).next((p=>(h=Date.now(),vn()<=Q.DEBUG&&x("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${i} in `+(l-a)+`ms
	Removed ${r} targets in `+(u-l)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:r,documentsRemoved:p}))))}}function BT(n,e){return new UT(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jT{constructor(){this.changes=new hn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Oe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?b.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class qT{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WT{constructor(e,t,s,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(s=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(s!==null&&Vs(s.mutation,i,Xe.empty(),re.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,K()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=K()){const i=Zt();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,s).next((r=>{let a=Ts();return r.forEach(((l,u)=>{a=a.insert(l,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const s=Zt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,K())))}populateOverlays(e,t,s){const i=[];return s.forEach((r=>{t.has(r)||i.push(r)})),this.documentOverlayCache.getOverlays(e,i).next((r=>{r.forEach(((a,l)=>{t.set(a,l)}))}))}computeViews(e,t,s,i){let r=vt();const a=ks(),l=(function(){return ks()})();return t.forEach(((u,h)=>{const f=s.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof dn)?r=r.insert(h.key,h):f!==void 0?(a.set(h.key,f.mutation.getFieldMask()),Vs(f.mutation,h,f.mutation.getFieldMask(),re.now())):a.set(h.key,Xe.empty())})),this.recalculateAndSaveOverlays(e,r).next((u=>(u.forEach(((h,f)=>a.set(h,f))),t.forEach(((h,f)=>{var p;return l.set(h,new qT(f,(p=a.get(h))!==null&&p!==void 0?p:null))})),l)))}recalculateAndSaveOverlays(e,t){const s=ks();let i=new ce(((a,l)=>a-l)),r=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const l of a)l.keys().forEach((u=>{const h=t.get(u);if(h===null)return;let f=s.get(u)||Xe.empty();f=l.applyToLocalView(h,f),s.set(u,f);const p=(i.get(l.batchId)||K()).add(u);i=i.insert(l.batchId,p)}))})).next((()=>{const a=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,p=Pf();f.forEach((m=>{if(!r.has(m)){const w=Of(t.get(m),s.get(m));w!==null&&p.set(m,w),r=r.add(m)}})),a.push(this.documentOverlayCache.saveOverlays(e,h,p))}return b.waitFor(a)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,i){return(function(a){return M.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):HE(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,i):this.getDocumentsMatchingCollectionQuery(e,t,s,i)}getNextDocuments(e,t,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,i).next((r=>{const a=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,i-r.size):b.resolve(Zt());let l=Hs,u=r;return a.next((h=>b.forEach(h,((f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),r.get(f)?b.resolve():this.remoteDocumentCache.getEntry(e,f).next((m=>{u=u.insert(f,m)}))))).next((()=>this.populateOverlays(e,h,r))).next((()=>this.computeViews(e,u,h,K()))).next((f=>({batchId:l,changes:bf(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next((s=>{let i=Ts();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,i){const r=t.collectionGroup;let a=Ts();return this.indexManager.getCollectionParents(e,r).next((l=>b.forEach(l,(u=>{const h=(function(p,m){return new Mr(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,s,i).next((f=>{f.forEach(((p,m)=>{a=a.insert(p,m)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((a=>(r=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,r,i)))).next((a=>{r.forEach(((u,h)=>{const f=h.getKey();a.get(f)===null&&(a=a.insert(f,Oe.newInvalidDocument(f)))}));let l=Ts();return a.forEach(((u,h)=>{const f=r.get(u);f!==void 0&&Vs(f.mutation,h,Xe.empty(),re.now()),Ur(t,h)&&(l=l.insert(u,h))})),l}))}}/**
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
 */class zT{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return b.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:st(i.createTime)}})(t)),b.resolve()}getNamedQuery(e,t){return b.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(i){return{name:i.name,query:VT(i.bundledQuery),readTime:st(i.readTime)}})(t)),b.resolve()}}/**
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
 */class $T{constructor(){this.overlays=new ce(M.comparator),this.kr=new Map}getOverlay(e,t){return b.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Zt();return b.forEach(t,(i=>this.getOverlay(e,i).next((r=>{r!==null&&s.set(i,r)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((i,r)=>{this.wt(e,t,r)})),b.resolve()}removeOverlaysForBatchId(e,t,s){const i=this.kr.get(s);return i!==void 0&&(i.forEach((r=>this.overlays=this.overlays.remove(r))),this.kr.delete(s)),b.resolve()}getOverlaysForCollection(e,t,s){const i=Zt(),r=t.length+1,a=new M(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&u.largestBatchId>s&&i.set(u.getKey(),u)}return b.resolve(i)}getOverlaysForCollectionGroup(e,t,s,i){let r=new ce(((h,f)=>h-f));const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let f=r.get(h.largestBatchId);f===null&&(f=Zt(),r=r.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=Zt(),u=r.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,f)=>l.set(h,f))),!(l.size()>=i)););return b.resolve(l)}wt(e,t,s){const i=this.overlays.get(s.key);if(i!==null){const a=this.kr.get(i.largestBatchId).delete(s.key);this.kr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new uT(t,s));let r=this.kr.get(t);r===void 0&&(r=K(),this.kr.set(t,r)),this.kr.set(t,r.add(s.key))}}/**
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
 */class HT{constructor(){this.sessionToken=be.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(){this.qr=new ve(Te.Qr),this.$r=new ve(Te.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new Te(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new Te(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new M(new oe([])),s=new Te(t,e),i=new Te(t,e+1),r=[];return this.$r.forEachInRange([s,i],(a=>{this.Wr(a),r.push(a.key)})),r}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new M(new oe([])),s=new Te(t,e),i=new Te(t,e+1);let r=K();return this.$r.forEachInRange([s,i],(a=>{r=r.add(a.key)})),r}containsKey(e){const t=new Te(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Te{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return M.comparator(e.key,t.key)||z(e.Hr,t.Hr)}static Ur(e,t){return z(e.Hr,t.Hr)||M.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GT{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new ve(Te.Qr)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,i){const r=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new cT(r,t,s,i);this.mutationQueue.push(a);for(const l of i)this.Yr=this.Yr.add(new Te(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return b.resolve(a)}lookupMutationBatch(e,t){return b.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,i=this.Xr(s),r=i<0?0:i;return b.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?rl:this.er-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Te(t,0),i=new Te(t,Number.POSITIVE_INFINITY),r=[];return this.Yr.forEachInRange([s,i],(a=>{const l=this.Zr(a.Hr);r.push(l)})),b.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new ve(z);return t.forEach((i=>{const r=new Te(i,0),a=new Te(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([r,a],(l=>{s=s.add(l.Hr)}))})),b.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,i=s.length+1;let r=s;M.isDocumentKey(r)||(r=r.child(""));const a=new Te(new M(r),0);let l=new ve(z);return this.Yr.forEachWhile((u=>{const h=u.key.path;return!!s.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.Hr)),!0)}),a),b.resolve(this.ei(l))}ei(e){const t=[];return e.forEach((s=>{const i=this.Zr(s);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){Z(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return b.forEach(t.mutations,(i=>{const r=new Te(i.key,t.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new Te(t,0),i=this.Yr.firstAfterOrEqual(s);return b.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KT{constructor(e){this.ni=e,this.docs=(function(){return new ce(M.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,i=this.docs.get(s),r=i?i.size:0,a=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return b.resolve(s?s.document.mutableCopy():Oe.newInvalidDocument(t))}getEntries(e,t){let s=vt();return t.forEach((i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():Oe.newInvalidDocument(i))})),b.resolve(s)}getDocumentsMatchingQuery(e,t,s,i){let r=vt();const a=t.path,l=new M(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!a.isPrefixOf(h.path))break;h.path.length>a.length+1||wE(IE(f),s)<=0||(i.has(f.key)||Ur(t,f))&&(r=r.insert(f.key,f.mutableCopy()))}return b.resolve(r)}getAllFromCollectionGroup(e,t,s,i){F(9500)}ri(e,t){return b.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new QT(this)}getSize(e){return b.resolve(this.size)}}class QT extends jT{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(s)})),b.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YT{constructor(e){this.persistence=e,this.ii=new hn((t=>ll(t)),cl),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.si=0,this.oi=new pl,this.targetCount=0,this._i=Un.ar()}forEachTarget(e,t){return this.ii.forEach(((s,i)=>t(i))),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),b.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Un(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,b.resolve()}updateTargetData(e,t){return this.hr(t),b.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,t,s){let i=0;const r=[];return this.ii.forEach(((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.ii.delete(a),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)})),b.waitFor(r).next((()=>i))}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return b.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),b.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const i=this.persistence.referenceDelegate,r=[];return i&&t.forEach((a=>{r.push(i.markPotentiallyOrphaned(e,a))})),b.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),b.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return b.resolve(s)}containsKey(e,t){return b.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf{constructor(e,t){this.ai={},this.overlays={},this.ui=new Vr(0),this.ci=!1,this.ci=!0,this.li=new HT,this.referenceDelegate=e(this),this.hi=new YT(this),this.indexManager=new xT,this.remoteDocumentCache=(function(i){return new KT(i)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new kT(t),this.Ti=new zT(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new $T,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new GT(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){x("MemoryPersistence","Starting transaction:",e);const i=new XT(this.ui.next());return this.referenceDelegate.Ii(),s(i).next((r=>this.referenceDelegate.di(i).next((()=>r)))).toPromise().then((r=>(i.raiseOnCommittedEvent(),r)))}Ei(e,t){return b.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class XT extends AE{constructor(e){super(),this.currentSequenceNumber=e}}class _l{constructor(e){this.persistence=e,this.Ai=new pl,this.Ri=null}static Vi(e){return new _l(e)}get mi(){if(this.Ri)return this.Ri;throw F(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),b.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),b.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),b.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((i=>this.mi.add(i.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((r=>this.mi.add(r.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.mi,(s=>{const i=M.fromPath(s);return this.fi(e,i).next((r=>{r||t.removeEntry(i,U.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return b.or([()=>b.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class _r{constructor(e,t){this.persistence=e,this.gi=new hn((s=>bE(s.path)),((s,i)=>s.isEqual(i))),this.garbageCollector=BT(this,t)}static Vi(e,t){return new _r(e,t)}Ii(){}di(e){return b.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((i=>s+i))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return b.forEach(this.gi,((s,i)=>this.Sr(e,s,i).next((r=>r?b.resolve():t(i)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const i=this.persistence.getRemoteDocumentCache(),r=i.newChangeBuffer();return i.ri(e,(a=>this.Sr(e,a,t).next((l=>{l||(s++,r.removeEntry(a,U.min()))})))).next((()=>r.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),b.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),b.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),b.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),b.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ji(e.data.value)),t}Sr(e,t,s){return b.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return b.resolve(i!==void 0&&i>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e,t,s,i){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=i}static Es(e,t){let s=K(),i=K();for(const r of t.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new ml(e,t.fromCache,s,i)}}/**
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
 */class JT{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class ZT{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return b_()?8:SE(Ta())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,i){const r={result:null};return this.ps(e,t).next((a=>{r.result=a})).next((()=>{if(!r.result)return this.ys(e,t,i,s).next((a=>{r.result=a}))})).next((()=>{if(r.result)return;const a=new JT;return this.ws(e,t,a).next((l=>{if(r.result=l,this.Rs)return this.Ss(e,t,a,l.size)}))})).next((()=>r.result))}Ss(e,t,s,i){return s.documentReadCount<this.Vs?(vn()<=Q.DEBUG&&x("QueryEngine","SDK will not create cache indexes for query:",En(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),b.resolve()):(vn()<=Q.DEBUG&&x("QueryEngine","Query:",En(t),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.fs*i?(vn()<=Q.DEBUG&&x("QueryEngine","The SDK decides to create cache indexes for query:",En(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,nt(t))):b.resolve())}ps(e,t){if(qu(t))return b.resolve(null);let s=nt(t);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=ca(t,null,"F"),s=nt(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((r=>{const a=K(...r);return this.gs.getDocuments(e,a).next((l=>this.indexManager.getMinOffset(e,s).next((u=>{const h=this.bs(t,l);return this.Ds(t,h,a,u.readTime)?this.ps(e,ca(t,null,"F")):this.vs(e,h,t,u)}))))})))))}ys(e,t,s,i){return qu(t)||i.isEqual(U.min())?b.resolve(null):this.gs.getDocuments(e,s).next((r=>{const a=this.bs(t,r);return this.Ds(t,a,s,i)?b.resolve(null):(vn()<=Q.DEBUG&&x("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),En(t)),this.vs(e,a,t,TE(i,Hs)).next((l=>l)))}))}bs(e,t){let s=new ve(Sf(e));return t.forEach(((i,r)=>{Ur(e,r)&&(s=s.add(r))})),s}Ds(e,t,s,i){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}ws(e,t,s){return vn()<=Q.DEBUG&&x("QueryEngine","Using full collection scan to execute query:",En(t)),this.gs.getDocumentsMatchingQuery(e,t,Bt.min(),s)}vs(e,t,s,i){return this.gs.getDocumentsMatchingQuery(e,s,i).next((r=>(t.forEach((a=>{r=r.insert(a.key,a)})),r)))}}/**
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
 */const gl="LocalStore",eI=3e8;class tI{constructor(e,t,s,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new ce(z),this.Ms=new hn((r=>ll(r)),cl),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new WT(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function nI(n,e,t,s){return new tI(n,e,t,s)}async function Yf(n,e){const t=B(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let i;return t.mutationQueue.getAllMutationBatches(s).next((r=>(i=r,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((r=>{const a=[],l=[];let u=K();for(const h of i){a.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of r){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(s,u).next((h=>({Bs:h,removedBatchIds:a,addedBatchIds:l})))}))}))}function sI(n,e){const t=B(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const i=e.batch.keys(),r=t.Os.newChangeBuffer({trackRemovals:!0});return(function(l,u,h,f){const p=h.batch,m=p.keys();let w=b.resolve();return m.forEach((R=>{w=w.next((()=>f.getEntry(u,R))).next((D=>{const N=h.docVersions.get(R);Z(N!==null,48541),D.version.compareTo(N)<0&&(p.applyToRemoteDocument(D,h),D.isValidDocument()&&(D.setReadTime(h.commitVersion),f.addEntry(D)))}))})),w.next((()=>l.mutationQueue.removeMutationBatch(u,p)))})(t,s,e,r).next((()=>r.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(l){let u=K();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(s,i)))}))}function Xf(n){const e=B(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function iI(n,e){const t=B(n),s=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(r=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const l=[];e.targetChanges.forEach(((f,p)=>{const m=i.get(p);if(!m)return;l.push(t.hi.removeMatchingKeys(r,f.removedDocuments,p).next((()=>t.hi.addMatchingKeys(r,f.addedDocuments,p))));let w=m.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(p)!==null?w=w.withResumeToken(be.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):f.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(f.resumeToken,s)),i=i.insert(p,w),(function(D,N,q){return D.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=eI?!0:q.addedDocuments.size+q.modifiedDocuments.size+q.removedDocuments.size>0})(m,w,f)&&l.push(t.hi.updateTargetData(r,w))}));let u=vt(),h=K();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,f))})),l.push(rI(r,a,e.documentUpdates).next((f=>{u=f.Ls,h=f.ks}))),!s.isEqual(U.min())){const f=t.hi.getLastRemoteSnapshotVersion(r).next((p=>t.hi.setTargetsMetadata(r,r.currentSequenceNumber,s)));l.push(f)}return b.waitFor(l).next((()=>a.apply(r))).next((()=>t.localDocuments.getLocalViewOfDocuments(r,u,h))).next((()=>u))})).then((r=>(t.Fs=i,r)))}function rI(n,e,t){let s=K(),i=K();return t.forEach((r=>s=s.add(r))),e.getEntries(n,s).next((r=>{let a=vt();return t.forEach(((l,u)=>{const h=r.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(U.min())?(e.removeEntry(l,u.readTime),a=a.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),a=a.insert(l,u)):x(gl,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)})),{Ls:a,ks:i}}))}function oI(n,e){const t=B(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=rl),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function aI(n,e){const t=B(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let i;return t.hi.getTargetData(s,e).next((r=>r?(i=r,b.resolve(i)):t.hi.allocateTargetId(s).next((a=>(i=new St(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,i).next((()=>i)))))))})).then((s=>{const i=t.Fs.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function pa(n,e,t){const s=B(n),i=s.Fs.get(e),r=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",r,(a=>s.persistence.referenceDelegate.removeTarget(a,i)))}catch(a){if(!Qn(a))throw a;x(gl,`Failed to update sequence numbers for target ${e}: ${a}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(i.target)}function th(n,e,t){const s=B(n);let i=U.min(),r=K();return s.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,h,f){const p=B(u),m=p.Ms.get(f);return m!==void 0?b.resolve(p.Fs.get(m)):p.hi.getTargetData(h,f)})(s,a,nt(e)).next((l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(a,l.targetId).next((u=>{r=u}))})).next((()=>s.Cs.getDocumentsMatchingQuery(a,e,t?i:U.min(),t?r:K()))).next((l=>(lI(s,KE(e),l),{documents:l,qs:r})))))}function lI(n,e,t){let s=n.xs.get(e)||U.min();t.forEach(((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)})),n.xs.set(e,s)}class nh{constructor(){this.activeTargetIds=eT()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class cI{constructor(){this.Fo=new nh,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new nh,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class uI{xo(e){}shutdown(){}}/**
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
 */const sh="ConnectivityMonitor";class ih{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){x(sh,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){x(sh,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Li=null;function _a(){return Li===null?Li=(function(){return 268435456+Math.round(2147483648*Math.random())})():Li++,"0x"+Li.toString(16)}/**
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
 */const Do="RestConnection",hI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class dI{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${i}`,this.Ko=this.databaseId.database===lr?`project_id=${s}`:`project_id=${s}&database_id=${i}`}Wo(e,t,s,i,r){const a=_a(),l=this.Go(e,t.toUriEncodedString());x(Do,`Sending RPC '${e}' ${a}:`,l,s);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,i,r);const{host:h}=new URL(l),f=ei(h);return this.jo(e,l,u,s,f).then((p=>(x(Do,`Received RPC '${e}' ${a}: `,p),p)),(p=>{throw Ut(Do,`RPC '${e}' ${a} failed with error: `,p,"url: ",l,"request:",s),p}))}Jo(e,t,s,i,r,a){return this.Wo(e,t,s,i,r)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Gn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,r)=>e[r]=i)),s&&s.headers.forEach(((i,r)=>e[r]=i))}Go(e,t){const s=hI[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fI{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ve="WebChannelConnection";class pI extends dI{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,i,r){const a=_a();return new Promise(((l,u)=>{const h=new Zd;h.setWithCredentials(!0),h.listenOnce(ef.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case Bi.NO_ERROR:const p=h.getResponseJson();x(Ve,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(p)),l(p);break;case Bi.TIMEOUT:x(Ve,`RPC '${e}' ${a} timed out`),u(new O(P.DEADLINE_EXCEEDED,"Request time out"));break;case Bi.HTTP_ERROR:const m=h.getStatus();if(x(Ve,`RPC '${e}' ${a} failed with status:`,m,"response text:",h.getResponseText()),m>0){let w=h.getResponseJson();Array.isArray(w)&&(w=w[0]);const R=w==null?void 0:w.error;if(R&&R.status&&R.message){const D=(function(q){const j=q.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(j)>=0?j:P.UNKNOWN})(R.status);u(new O(D,R.message))}else u(new O(P.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new O(P.UNAVAILABLE,"Connection failed."));break;default:F(9055,{c_:e,streamId:a,l_:h.getLastErrorCode(),h_:h.getLastError()})}}finally{x(Ve,`RPC '${e}' ${a} completed.`)}}));const f=JSON.stringify(i);x(Ve,`RPC '${e}' ${a} sending request:`,i),h.send(t,"POST",f,s,15)}))}P_(e,t,s){const i=_a(),r=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=sf(),l=nf(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,t,s),u.encodeInitMessageHeaders=!0;const f=r.join("");x(Ve,`Creating RPC '${e}' stream ${i}: ${f}`,u);const p=a.createWebChannel(f,u);this.T_(p);let m=!1,w=!1;const R=new fI({Ho:N=>{w?x(Ve,`Not sending because RPC '${e}' stream ${i} is closed:`,N):(m||(x(Ve,`Opening RPC '${e}' stream ${i} transport.`),p.open(),m=!0),x(Ve,`RPC '${e}' stream ${i} sending:`,N),p.send(N))},Yo:()=>p.close()}),D=(N,q,j)=>{N.listen(q,(G=>{try{j(G)}catch(ue){setTimeout((()=>{throw ue}),0)}}))};return D(p,Es.EventType.OPEN,(()=>{w||(x(Ve,`RPC '${e}' stream ${i} transport opened.`),R.s_())})),D(p,Es.EventType.CLOSE,(()=>{w||(w=!0,x(Ve,`RPC '${e}' stream ${i} transport closed`),R.__(),this.I_(p))})),D(p,Es.EventType.ERROR,(N=>{w||(w=!0,Ut(Ve,`RPC '${e}' stream ${i} transport errored. Name:`,N.name,"Message:",N.message),R.__(new O(P.UNAVAILABLE,"The operation could not be completed")))})),D(p,Es.EventType.MESSAGE,(N=>{var q;if(!w){const j=N.data[0];Z(!!j,16349);const G=j,ue=(G==null?void 0:G.error)||((q=G[0])===null||q===void 0?void 0:q.error);if(ue){x(Ve,`RPC '${e}' stream ${i} received error:`,ue);const ct=ue.status;let Ce=(function(v){const E=pe[v];if(E!==void 0)return Ff(E)})(ct),I=ue.message;Ce===void 0&&(Ce=P.INTERNAL,I="Unknown error status: "+ct+" with message "+ue.message),w=!0,R.__(new O(Ce,I)),p.close()}else x(Ve,`RPC '${e}' stream ${i} received:`,j),R.a_(j)}})),D(l,tf.STAT_EVENT,(N=>{N.stat===sa.PROXY?x(Ve,`RPC '${e}' stream ${i} detected buffering proxy`):N.stat===sa.NOPROXY&&x(Ve,`RPC '${e}' stream ${i} detected no buffering proxy`)})),setTimeout((()=>{R.o_()}),0),R}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function ko(){return typeof document<"u"?document:null}/**
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
 */function Wr(n){return new yT(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e,t,s=1e3,i=1.5,r=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=i,this.A_=r,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-s);i>0&&x("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh="PersistentStream";class Zf{constructor(e,t,s,i,r,a,l,u){this.Fi=e,this.w_=s,this.S_=i,this.connection=r,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new Jf(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(yt(t.toString()),yt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,i])=>{this.b_===t&&this.W_(s,i)}),(s=>{e((()=>{const i=new O(P.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(i)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((i=>{s((()=>this.G_(i)))})),this.stream.onMessage((i=>{s((()=>++this.C_==1?this.j_(i):this.onNext(i)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return x(rh,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(x(rh,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class _I extends Zf{constructor(e,t,s,i,r,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,i,a),this.serializer=r}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=TT(this.serializer,e),s=(function(r){if(!("targetChange"in r))return U.min();const a=r.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?st(a.readTime):U.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=fa(this.serializer),t.addTarget=(function(r,a){let l;const u=a.target;if(l=la(u)?{documents:CT(r,u)}:{query:AT(r,u).Vt},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=jf(r,a.resumeToken);const h=ua(r,a.expectedCount);h!==null&&(l.expectedCount=h)}else if(a.snapshotVersion.compareTo(U.min())>0){l.readTime=pr(r,a.snapshotVersion.toTimestamp());const h=ua(r,a.expectedCount);h!==null&&(l.expectedCount=h)}return l})(this.serializer,e);const s=RT(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=fa(this.serializer),t.removeTarget=e,this.k_(t)}}class mI extends Zf{constructor(e,t,s,i,r,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,i,a),this.serializer=r}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Z(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Z(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Z(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=wT(e.writeResults,e.commitTime),s=st(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=fa(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>IT(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gI{}class yI extends gI{constructor(e,t,s,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([r,a])=>this.connection.Wo(e,ha(t,s),i,r,a))).catch((r=>{throw r.name==="FirebaseError"?(r.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new O(P.UNKNOWN,r.toString())}))}Jo(e,t,s,i,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,l])=>this.connection.Jo(e,ha(t,s),i,a,l,r))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new O(P.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class vI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
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
 */const an="RemoteStore";class EI{constructor(e,t,s,i,r){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=r,this.Ea.xo((a=>{s.enqueueAndForget((async()=>{fn(this)&&(x(an,"Restarting streams for network reachability change."),await(async function(u){const h=B(u);h.Ia.add(4),await ui(h),h.Aa.set("Unknown"),h.Ia.delete(4),await zr(h)})(this))}))})),this.Aa=new vI(s,i)}}async function zr(n){if(fn(n))for(const e of n.da)await e(!0)}async function ui(n){for(const e of n.da)await e(!1)}function ep(n,e){const t=B(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Tl(t)?El(t):Yn(t).x_()&&vl(t,e))}function yl(n,e){const t=B(n),s=Yn(t);t.Ta.delete(e),s.x_()&&tp(t,e),t.Ta.size===0&&(s.x_()?s.B_():fn(t)&&t.Aa.set("Unknown"))}function vl(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Yn(n).H_(e)}function tp(n,e){n.Ra.$e(e),Yn(n).Y_(e)}function El(n){n.Ra=new pT({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Yn(n).start(),n.Aa.aa()}function Tl(n){return fn(n)&&!Yn(n).M_()&&n.Ta.size>0}function fn(n){return B(n).Ia.size===0}function np(n){n.Ra=void 0}async function TI(n){n.Aa.set("Online")}async function II(n){n.Ta.forEach(((e,t)=>{vl(n,e)}))}async function wI(n,e){np(n),Tl(n)?(n.Aa.la(e),El(n)):n.Aa.set("Unknown")}async function CI(n,e,t){if(n.Aa.set("Online"),e instanceof Bf&&e.state===2&&e.cause)try{await(async function(i,r){const a=r.cause;for(const l of r.targetIds)i.Ta.has(l)&&(await i.remoteSyncer.rejectListen(l,a),i.Ta.delete(l),i.Ra.removeTarget(l))})(n,e)}catch(s){x(an,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await mr(n,s)}else if(e instanceof zi?n.Ra.Ye(e):e instanceof Uf?n.Ra.it(e):n.Ra.et(e),!t.isEqual(U.min()))try{const s=await Xf(n.localStore);t.compareTo(s)>=0&&await(function(r,a){const l=r.Ra.Pt(a);return l.targetChanges.forEach(((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=r.Ta.get(h);f&&r.Ta.set(h,f.withResumeToken(u.resumeToken,a))}})),l.targetMismatches.forEach(((u,h)=>{const f=r.Ta.get(u);if(!f)return;r.Ta.set(u,f.withResumeToken(be.EMPTY_BYTE_STRING,f.snapshotVersion)),tp(r,u);const p=new St(f.target,u,h,f.sequenceNumber);vl(r,p)})),r.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(s){x(an,"Failed to raise snapshot:",s),await mr(n,s)}}async function mr(n,e,t){if(!Qn(e))throw e;n.Ia.add(1),await ui(n),n.Aa.set("Offline"),t||(t=()=>Xf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{x(an,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await zr(n)}))}function sp(n,e){return e().catch((t=>mr(n,t,e)))}async function $r(n){const e=B(n),t=zt(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:rl;for(;AI(e);)try{const i=await oI(e.localStore,s);if(i===null){e.Pa.length===0&&t.B_();break}s=i.batchId,SI(e,i)}catch(i){await mr(e,i)}ip(e)&&rp(e)}function AI(n){return fn(n)&&n.Pa.length<10}function SI(n,e){n.Pa.push(e);const t=zt(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function ip(n){return fn(n)&&!zt(n).M_()&&n.Pa.length>0}function rp(n){zt(n).start()}async function RI(n){zt(n).na()}async function bI(n){const e=zt(n);for(const t of n.Pa)e.X_(t.mutations)}async function PI(n,e,t){const s=n.Pa.shift(),i=hl.from(s,e,t);await sp(n,(()=>n.remoteSyncer.applySuccessfulWrite(i))),await $r(n)}async function NI(n,e){e&&zt(n).Z_&&await(async function(s,i){if((function(a){return dT(a)&&a!==P.ABORTED})(i.code)){const r=s.Pa.shift();zt(s).N_(),await sp(s,(()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i))),await $r(s)}})(n,e),ip(n)&&rp(n)}async function oh(n,e){const t=B(n);t.asyncQueue.verifyOperationInProgress(),x(an,"RemoteStore received new credentials");const s=fn(t);t.Ia.add(3),await ui(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await zr(t)}async function DI(n,e){const t=B(n);e?(t.Ia.delete(2),await zr(t)):e||(t.Ia.add(2),await ui(t),t.Aa.set("Unknown"))}function Yn(n){return n.Va||(n.Va=(function(t,s,i){const r=B(t);return r.ia(),new _I(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)})(n.datastore,n.asyncQueue,{Zo:TI.bind(null,n),e_:II.bind(null,n),n_:wI.bind(null,n),J_:CI.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),Tl(n)?El(n):n.Aa.set("Unknown")):(await n.Va.stop(),np(n))}))),n.Va}function zt(n){return n.ma||(n.ma=(function(t,s,i){const r=B(t);return r.ia(),new mI(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:RI.bind(null,n),n_:NI.bind(null,n),ea:bI.bind(null,n),ta:PI.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await $r(n)):(await n.ma.stop(),n.Pa.length>0&&(x(an,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e,t,s,i,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Vt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,i,r){const a=Date.now()+s,l=new Il(e,t,a,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function wl(n,e){if(yt("AsyncQueue",`${e}: ${n}`),Qn(n))return new O(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{static emptySet(e){return new Sn(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||M.comparator(t.key,s.key):(t,s)=>M.comparator(t.key,s.key),this.keyedMap=Ts(),this.sortedSet=new ce(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Sn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Sn;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah{constructor(){this.fa=new ce(M.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):F(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Bn{constructor(e,t,s,i,r,a,l,u,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,i,r){const a=[];return t.forEach((l=>{a.push({type:0,doc:l})})),new Bn(e,t,Sn.emptySet(t),a,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Fr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==s[i].type||!t[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kI{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class VI{constructor(){this.queries=lh(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const i=B(t),r=i.queries;i.queries=lh(),r.forEach(((a,l)=>{for(const u of l.wa)u.onError(s)}))})(this,new O(P.ABORTED,"Firestore shutting down"))}}function lh(){return new hn((n=>Af(n)),Fr)}async function op(n,e){const t=B(n);let s=3;const i=e.query;let r=t.queries.get(i);r?!r.Sa()&&e.ba()&&(s=2):(r=new kI,s=e.ba()?0:1);try{switch(s){case 0:r.ya=await t.onListen(i,!0);break;case 1:r.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const l=wl(a,`Initialization of query '${En(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,r),r.wa.push(e),e.va(t.onlineState),r.ya&&e.Ca(r.ya)&&Cl(t)}async function ap(n,e){const t=B(n),s=e.query;let i=3;const r=t.queries.get(s);if(r){const a=r.wa.indexOf(e);a>=0&&(r.wa.splice(a,1),r.wa.length===0?i=e.ba()?0:1:!r.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function xI(n,e){const t=B(n);let s=!1;for(const i of e){const r=i.query,a=t.queries.get(r);if(a){for(const l of a.wa)l.Ca(i)&&(s=!0);a.ya=i}}s&&Cl(t)}function OI(n,e,t){const s=B(n),i=s.queries.get(e);if(i)for(const r of i.wa)r.onError(t);s.queries.delete(e)}function Cl(n){n.Da.forEach((e=>{e.next()}))}var ma,ch;(ch=ma||(ma={})).Fa="default",ch.Cache="cache";class lp{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new Bn(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Bn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==ma.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{constructor(e){this.key=e}}class up{constructor(e){this.key=e}}class MI{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=K(),this.mutatedKeys=K(),this.Xa=Sf(e),this.eu=new Sn(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new ah,i=t?t.eu:this.eu;let r=t?t.mutatedKeys:this.mutatedKeys,a=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,p)=>{const m=i.get(f),w=Ur(this.query,p)?p:null,R=!!m&&this.mutatedKeys.has(m.key),D=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let N=!1;m&&w?m.data.isEqual(w.data)?R!==D&&(s.track({type:3,doc:w}),N=!0):this.iu(m,w)||(s.track({type:2,doc:w}),N=!0,(u&&this.Xa(w,u)>0||h&&this.Xa(w,h)<0)&&(l=!0)):!m&&w?(s.track({type:0,doc:w}),N=!0):m&&!w&&(s.track({type:1,doc:m}),N=!0,(u||h)&&(l=!0)),N&&(w?(a=a.add(w),r=D?r.add(f):r.delete(f)):(a=a.delete(f),r=r.delete(f)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),r=r.delete(f.key),s.track({type:1,doc:f})}return{eu:a,ru:s,Ds:l,mutatedKeys:r}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,i){const r=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort(((f,p)=>(function(w,R){const D=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F(20277,{At:N})}};return D(w)-D(R)})(f.type,p.type)||this.Xa(f.doc,p.doc))),this.su(s),i=i!=null&&i;const l=t&&!i?this.ou():[],u=this.Za.size===0&&this.current&&!i?1:0,h=u!==this.Ya;return this.Ya=u,a.length!==0||h?{snapshot:new Bn(this.query,e.eu,r,a,e.mutatedKeys,u===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new ah,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=K(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new up(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new cp(s))})),t}uu(e){this.Ha=e.qs,this.Za=K();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Bn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Al="SyncEngine";class LI{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class FI{constructor(e){this.key=e,this.lu=!1}}class UI{constructor(e,t,s,i,r,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new hn((l=>Af(l)),Fr),this.Tu=new Map,this.Iu=new Set,this.du=new ce(M.comparator),this.Eu=new Map,this.Au=new pl,this.Ru={},this.Vu=new Map,this.mu=Un.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function BI(n,e,t=!0){const s=mp(n);let i;const r=s.Pu.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.cu()):i=await hp(s,e,t,!0),i}async function jI(n,e){const t=mp(n);await hp(t,e,!0,!1)}async function hp(n,e,t,s){const i=await aI(n.localStore,nt(e)),r=i.targetId,a=n.sharedClientState.addLocalQueryTarget(r,t);let l;return s&&(l=await qI(n,e,r,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&ep(n.remoteStore,i),l}async function qI(n,e,t,s,i){n.gu=(p,m,w)=>(async function(D,N,q,j){let G=N.view.nu(q);G.Ds&&(G=await th(D.localStore,N.query,!1).then((({documents:I})=>N.view.nu(I,G))));const ue=j&&j.targetChanges.get(N.targetId),ct=j&&j.targetMismatches.get(N.targetId)!=null,Ce=N.view.applyChanges(G,D.isPrimaryClient,ue,ct);return hh(D,N.targetId,Ce._u),Ce.snapshot})(n,p,m,w);const r=await th(n.localStore,e,!0),a=new MI(e,r.qs),l=a.nu(r.documents),u=ci.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",i),h=a.applyChanges(l,n.isPrimaryClient,u);hh(n,t,h._u);const f=new LI(e,t,a);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),h.snapshot}async function WI(n,e,t){const s=B(n),i=s.Pu.get(e),r=s.Tu.get(i.targetId);if(r.length>1)return s.Tu.set(i.targetId,r.filter((a=>!Fr(a,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await pa(s.localStore,i.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(i.targetId),t&&yl(s.remoteStore,i.targetId),ga(s,i.targetId)})).catch(Kn)):(ga(s,i.targetId),await pa(s.localStore,i.targetId,!0))}async function zI(n,e){const t=B(n),s=t.Pu.get(e),i=t.Tu.get(s.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),yl(t.remoteStore,s.targetId))}async function $I(n,e,t){const s=JI(n);try{const i=await(function(a,l){const u=B(a),h=re.now(),f=l.reduce(((w,R)=>w.add(R.key)),K());let p,m;return u.persistence.runTransaction("Locally write mutations","readwrite",(w=>{let R=vt(),D=K();return u.Os.getEntries(w,f).next((N=>{R=N,R.forEach(((q,j)=>{j.isValidDocument()||(D=D.add(q))}))})).next((()=>u.localDocuments.getOverlayedDocuments(w,R))).next((N=>{p=N;const q=[];for(const j of l){const G=aT(j,p.get(j.key).overlayedDocument);G!=null&&q.push(new dn(j.key,G,yf(G.value.mapValue),_t.exists(!0)))}return u.mutationQueue.addMutationBatch(w,h,q,l)})).next((N=>{m=N;const q=N.applyToLocalDocumentSet(p,D);return u.documentOverlayCache.saveOverlays(w,N.batchId,q)}))})).then((()=>({batchId:m.batchId,changes:bf(p)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),(function(a,l,u){let h=a.Ru[a.currentUser.toKey()];h||(h=new ce(z)),h=h.insert(l,u),a.Ru[a.currentUser.toKey()]=h})(s,i.batchId,t),await hi(s,i.changes),await $r(s.remoteStore)}catch(i){const r=wl(i,"Failed to persist write");t.reject(r)}}async function dp(n,e){const t=B(n);try{const s=await iI(t.localStore,e);e.targetChanges.forEach(((i,r)=>{const a=t.Eu.get(r);a&&(Z(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?a.lu=!0:i.modifiedDocuments.size>0?Z(a.lu,14607):i.removedDocuments.size>0&&(Z(a.lu,42227),a.lu=!1))})),await hi(t,s,e)}catch(s){await Kn(s)}}function uh(n,e,t){const s=B(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const i=[];s.Pu.forEach(((r,a)=>{const l=a.view.va(e);l.snapshot&&i.push(l.snapshot)})),(function(a,l){const u=B(a);u.onlineState=l;let h=!1;u.queries.forEach(((f,p)=>{for(const m of p.wa)m.va(l)&&(h=!0)})),h&&Cl(u)})(s.eventManager,e),i.length&&s.hu.J_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function HI(n,e,t){const s=B(n);s.sharedClientState.updateQueryState(e,"rejected",t);const i=s.Eu.get(e),r=i&&i.key;if(r){let a=new ce(M.comparator);a=a.insert(r,Oe.newNoDocument(r,U.min()));const l=K().add(r),u=new qr(U.min(),new Map,new ce(z),a,l);await dp(s,u),s.du=s.du.remove(r),s.Eu.delete(e),Sl(s)}else await pa(s.localStore,e,!1).then((()=>ga(s,e,t))).catch(Kn)}async function GI(n,e){const t=B(n),s=e.batch.batchId;try{const i=await sI(t.localStore,e);pp(t,s,null),fp(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await hi(t,i)}catch(i){await Kn(i)}}async function KI(n,e,t){const s=B(n);try{const i=await(function(a,l){const u=B(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next((p=>(Z(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>u.localDocuments.getDocuments(h,f)))}))})(s.localStore,e);pp(s,e,t),fp(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await hi(s,i)}catch(i){await Kn(i)}}function fp(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function pp(n,e,t){const s=B(n);let i=s.Ru[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(t?r.reject(t):r.resolve(),i=i.remove(e)),s.Ru[s.currentUser.toKey()]=i}}function ga(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Tu.get(e))n.Pu.delete(s),t&&n.hu.pu(s,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((s=>{n.Au.containsKey(s)||_p(n,s)}))}function _p(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(yl(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),Sl(n))}function hh(n,e,t){for(const s of t)s instanceof cp?(n.Au.addReference(s.key,e),QI(n,s)):s instanceof up?(x(Al,"Document no longer in limbo: "+s.key),n.Au.removeReference(s.key,e),n.Au.containsKey(s.key)||_p(n,s.key)):F(19791,{yu:s})}function QI(n,e){const t=e.key,s=t.path.canonicalString();n.du.get(t)||n.Iu.has(s)||(x(Al,"New document in limbo: "+t),n.Iu.add(s),Sl(n))}function Sl(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new M(oe.fromString(e)),s=n.mu.next();n.Eu.set(s,new FI(t)),n.du=n.du.insert(t,s),ep(n.remoteStore,new St(nt(Lr(t.path)),s,"TargetPurposeLimboResolution",Vr.ue))}}async function hi(n,e,t){const s=B(n),i=[],r=[],a=[];s.Pu.isEmpty()||(s.Pu.forEach(((l,u)=>{a.push(s.gu(u,e,t).then((h=>{var f;if((h||t)&&s.isPrimaryClient){const p=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;s.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){i.push(h);const p=ml.Es(u.targetId,h);r.push(p)}})))})),await Promise.all(a),s.hu.J_(i),await(async function(u,h){const f=B(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>b.forEach(h,(m=>b.forEach(m.Is,(w=>f.persistence.referenceDelegate.addReference(p,m.targetId,w))).next((()=>b.forEach(m.ds,(w=>f.persistence.referenceDelegate.removeReference(p,m.targetId,w)))))))))}catch(p){if(!Qn(p))throw p;x(gl,"Failed to update sequence numbers: "+p)}for(const p of h){const m=p.targetId;if(!p.fromCache){const w=f.Fs.get(m),R=w.snapshotVersion,D=w.withLastLimboFreeSnapshotVersion(R);f.Fs=f.Fs.insert(m,D)}}})(s.localStore,r))}async function YI(n,e){const t=B(n);if(!t.currentUser.isEqual(e)){x(Al,"User change. New user:",e.toKey());const s=await Yf(t.localStore,e);t.currentUser=e,(function(r,a){r.Vu.forEach((l=>{l.forEach((u=>{u.reject(new O(P.CANCELLED,a))}))})),r.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await hi(t,s.Bs)}}function XI(n,e){const t=B(n),s=t.Eu.get(e);if(s&&s.lu)return K().add(s.key);{let i=K();const r=t.Tu.get(e);if(!r)return i;for(const a of r){const l=t.Pu.get(a);i=i.unionWith(l.view.tu)}return i}}function mp(n){const e=B(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=dp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=XI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=HI.bind(null,e),e.hu.J_=xI.bind(null,e.eventManager),e.hu.pu=OI.bind(null,e.eventManager),e}function JI(n){const e=B(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=GI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=KI.bind(null,e),e}class gr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Wr(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return nI(this.persistence,new ZT,e.initialUser,this.serializer)}Du(e){return new Qf(_l.Vi,this.serializer)}bu(e){return new cI}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}gr.provider={build:()=>new gr};class ZI extends gr{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Z(this.persistence.referenceDelegate instanceof _r,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new FT(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Be.withCacheSize(this.cacheSizeBytes):Be.DEFAULT;return new Qf((s=>_r.Vi(s,t)),this.serializer)}}class ya{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>uh(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=YI.bind(null,this.syncEngine),await DI(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new VI})()}createDatastore(e){const t=Wr(e.databaseInfo.databaseId),s=(function(r){return new pI(r)})(e.databaseInfo);return(function(r,a,l,u){return new yI(r,a,l,u)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,i,r,a,l){return new EI(s,i,r,a,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>uh(this.syncEngine,t,0)),(function(){return ih.C()?new ih:new uI})())}createSyncEngine(e,t){return(function(i,r,a,l,u,h,f){const p=new UI(i,r,a,l,u,h);return f&&(p.fu=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(i){const r=B(i);x(an,"RemoteStore shutting down."),r.Ia.add(5),await ui(r),r.Ea.shutdown(),r.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}ya.provider={build:()=>new ya};/**
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
 */class gp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):yt("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $t="FirestoreClient";class ew{constructor(e,t,s,i,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=i,this.user=xe.UNAUTHENTICATED,this.clientId=sl.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,(async a=>{x($t,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(s,(a=>(x($t,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Vt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=wl(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Vo(n,e){n.asyncQueue.verifyOperationInProgress(),x($t,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async i=>{s.isEqual(i)||(await Yf(e.localStore,i),s=i)})),e.persistence.setDatabaseDeletedListener((()=>{Ut("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{x("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((i=>{Ut("Terminating Firestore due to IndexedDb database deletion failed",i)}))})),n._offlineComponents=e}async function dh(n,e){n.asyncQueue.verifyOperationInProgress();const t=await tw(n);x($t,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>oh(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,i)=>oh(e.remoteStore,i))),n._onlineComponents=e}async function tw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){x($t,"Using user provided OfflineComponentProvider");try{await Vo(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(i){return i.name==="FirebaseError"?i.code===P.FAILED_PRECONDITION||i.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(t))throw t;Ut("Error using user provided cache. Falling back to memory cache: "+t),await Vo(n,new gr)}}else x($t,"Using default OfflineComponentProvider"),await Vo(n,new ZI(void 0));return n._offlineComponents}async function yp(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(x($t,"Using user provided OnlineComponentProvider"),await dh(n,n._uninitializedComponentsProvider._online)):(x($t,"Using default OnlineComponentProvider"),await dh(n,new ya))),n._onlineComponents}function nw(n){return yp(n).then((e=>e.syncEngine))}async function va(n){const e=await yp(n),t=e.eventManager;return t.onListen=BI.bind(null,e.syncEngine),t.onUnlisten=WI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=jI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=zI.bind(null,e.syncEngine),t}function sw(n,e,t={}){const s=new Vt;return n.asyncQueue.enqueueAndForget((async()=>(function(r,a,l,u,h){const f=new gp({next:m=>{f.Ou(),a.enqueueAndForget((()=>ap(r,p)));const w=m.docs.has(l);!w&&m.fromCache?h.reject(new O(P.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&m.fromCache&&u&&u.source==="server"?h.reject(new O(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(m)},error:m=>h.reject(m)}),p=new lp(Lr(l.path),f,{includeMetadataChanges:!0,ka:!0});return op(r,p)})(await va(n),n.asyncQueue,e,t,s))),s.promise}/**
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
 */function vp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const fh=new Map;/**
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
 */const Ep="firestore.googleapis.com",ph=!0;class _h{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new O(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Ep,this.ssl=ph}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:ph;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Kf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<MT)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}EE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=vp((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,i){return s.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Rl{constructor(e,t,s,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _h({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _h(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new uE;switch(s.type){case"firstParty":return new pE(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new O(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=fh.get(t);s&&(x("ComponentProvider","Removing Datastore"),fh.delete(t),s.terminate())})(this),Promise.resolve()}}function iw(n,e,t,s={}){var i;n=xt(n,Rl);const r=ei(e),a=n._getSettings(),l=Object.assign(Object.assign({},a),{emulatorOptions:n._getEmulatorOptions()}),u=`${e}:${t}`;r&&(Sh(`https://${u}`),bh("Firestore",!0)),a.host!==Ep&&a.host!==u&&Ut("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h=Object.assign(Object.assign({},a),{host:u,ssl:r,emulatorOptions:s});if(!Os(h,l)&&(n._setSettings(h),s.mockUserToken)){let f,p;if(typeof s.mockUserToken=="string")f=s.mockUserToken,p=xe.MOCK_USER;else{f=Rh(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const m=s.mockUserToken.sub||s.mockUserToken.user_id;if(!m)throw new O(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new xe(m)}n._authCredentials=new hE(new of(f,p))}}/**
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
 */class Hr{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Hr(this.firestore,e,this._query)}}class ye{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Js(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ye(this.firestore,e,this._key)}toJSON(){return{type:ye._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(ai(t,ye._jsonSchema))return new ye(e,s||null,new M(oe.fromString(t.referencePath)))}}ye._jsonSchemaVersion="firestore/documentReference/1.0",ye._jsonSchema={type:_e("string",ye._jsonSchemaVersion),referencePath:_e("string")};class Js extends Hr{constructor(e,t,s){super(e,t,Lr(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ye(this.firestore,null,new M(e))}withConverter(e){return new Js(this.firestore,e,this._path)}}function Fw(n,e,...t){if(n=He(n),arguments.length===1&&(e=sl.newId()),vE("doc","path",e),n instanceof Rl){const s=oe.fromString(e,...t);return Pu(s),new ye(n,null,new M(s))}{if(!(n instanceof ye||n instanceof Js))throw new O(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(oe.fromString(e,...t));return Pu(s),new ye(n.firestore,n instanceof Js?n.converter:null,new M(s))}}/**
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
 */const mh="AsyncQueue";class gh{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Jf(this,"async_queue_retry"),this.oc=()=>{const s=ko();s&&x(mh,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=ko();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=ko();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Vt;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Qn(e))throw e;x(mh,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,yt("INTERNAL UNHANDLED ERROR: ",yh(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=Il.createAndSchedule(this,e,t,s,(r=>this.lc(r)));return this.ec.push(i),i}ac(){this.tc&&F(47125,{hc:yh(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function yh(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
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
 */function vh(n){return(function(t,s){if(typeof t!="object"||t===null)return!1;const i=t;for(const r of s)if(r in i&&typeof i[r]=="function")return!0;return!1})(n,["next","error","complete"])}class Zs extends Rl{constructor(e,t,s,i){super(e,t,s,i),this.type="firestore",this._queue=new gh,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new gh(e),this._firestoreClient=void 0,await e}}}function Uw(n,e){const t=typeof n=="object"?n:Lh(),s=typeof n=="string"?n:lr,i=xh(t,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=Ch("firestore");r&&iw(i,...r)}return i}function bl(n){if(n._terminated)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||rw(n),n._firestoreClient}function rw(n){var e,t,s;const i=n._freezeSettings(),r=(function(l,u,h,f){return new DE(l,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,vp(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new ew(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&(function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}})(n._componentsProvider))}/**
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
 */class ze{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ze(be.fromBase64String(e))}catch(t){throw new O(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ze(be.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ze._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ai(e,ze._jsonSchema))return ze.fromBase64String(e.bytes)}}ze._jsonSchemaVersion="firestore/bytes/1.0",ze._jsonSchema={type:_e("string",ze._jsonSchemaVersion),bytes:_e("string")};/**
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
 */class Pl{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Re(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Tp{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:it._jsonSchemaVersion}}static fromJSON(e){if(ai(e,it._jsonSchema))return new it(e.latitude,e.longitude)}}it._jsonSchemaVersion="firestore/geoPoint/1.0",it._jsonSchema={type:_e("string",it._jsonSchemaVersion),latitude:_e("number"),longitude:_e("number")};/**
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
 */class rt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0})(this._values,e._values)}toJSON(){return{type:rt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ai(e,rt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new rt(e.vectorValues);throw new O(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}rt._jsonSchemaVersion="firestore/vectorValue/1.0",rt._jsonSchema={type:_e("string",rt._jsonSchemaVersion),vectorValues:_e("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ow=/^__.*__$/;class aw{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new dn(e,this.data,this.fieldMask,t,this.fieldTransforms):new li(e,this.data,t,this.fieldTransforms)}}function Ip(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F(40011,{Ec:n})}}class Nl{constructor(e,t,s,i,r,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.Ac(),this.fieldTransforms=r||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Nl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:s,mc:!1});return i.fc(e),i}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:s,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return yr(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Ip(this.Ec)&&ow.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class lw{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Wr(e)}Dc(e,t,s,i=!1){return new Nl({Ec:e,methodName:t,bc:s,path:Re.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function cw(n){const e=n._freezeSettings(),t=Wr(n._databaseId);return new lw(n._databaseId,!!e.ignoreUndefinedProperties,t)}function uw(n,e,t,s,i,r={}){const a=n.Dc(r.merge||r.mergeFields?2:0,e,t,i);Sp("Data must be an object, but it was:",a,s);const l=Cp(s,a);let u,h;if(r.merge)u=new Xe(a.fieldMask),h=a.fieldTransforms;else if(r.mergeFields){const f=[];for(const p of r.mergeFields){const m=hw(e,p,t);if(!a.contains(m))throw new O(P.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);fw(f,m)||f.push(m)}u=new Xe(f),h=a.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,h=a.fieldTransforms;return new aw(new We(l),u,h)}function wp(n,e){if(Ap(n=He(n)))return Sp("Unsupported field value:",e,n),Cp(n,e);if(n instanceof Tp)return(function(s,i){if(!Ip(i.Ec))throw i.wc(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,i){const r=[];let a=0;for(const l of s){let u=wp(l,i.yc(a));u==null&&(u={nullValue:"NULL_VALUE"}),r.push(u),a++}return{arrayValue:{values:r}}})(n,e)}return(function(s,i){if((s=He(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return tT(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=re.fromDate(s);return{timestampValue:pr(i.serializer,r)}}if(s instanceof re){const r=new re(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:pr(i.serializer,r)}}if(s instanceof it)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ze)return{bytesValue:jf(i.serializer,s._byteString)};if(s instanceof ye){const r=i.databaseId,a=s.firestore._databaseId;if(!a.isEqual(r))throw i.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:fl(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof rt)return(function(a,l){return{mapValue:{fields:{[mf]:{stringValue:gf},[cr]:{arrayValue:{values:a.toArray().map((h=>{if(typeof h!="number")throw l.wc("VectorValues must only contain numeric values.");return ul(l.serializer,h)}))}}}}}})(s,i);throw i.wc(`Unsupported field value: ${il(s)}`)})(n,e)}function Cp(n,e){const t={};return uf(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):un(n,((s,i)=>{const r=wp(i,e.Vc(s));r!=null&&(t[s]=r)})),{mapValue:{fields:t}}}function Ap(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof re||n instanceof it||n instanceof ze||n instanceof ye||n instanceof Tp||n instanceof rt)}function Sp(n,e,t){if(!Ap(t)||!lf(t)){const s=il(t);throw s==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+s)}}function hw(n,e,t){if((e=He(e))instanceof Pl)return e._internalPath;if(typeof e=="string")return Rp(n,e);throw yr("Field path arguments must be of type string or ",n,!1,void 0,t)}const dw=new RegExp("[~\\*/\\[\\]]");function Rp(n,e,t){if(e.search(dw)>=0)throw yr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Pl(...e.split("."))._internalPath}catch{throw yr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function yr(n,e,t,s,i){const r=s&&!s.isEmpty(),a=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(r||a)&&(u+=" (found",r&&(u+=` in field ${s}`),a&&(u+=` in document ${i}`),u+=")"),new O(P.INVALID_ARGUMENT,l+n+u)}function fw(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class bp{constructor(e,t,s,i,r){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new ye(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new pw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Pp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class pw extends bp{data(){return super.data()}}function Pp(n,e){return typeof e=="string"?Rp(n,e):e instanceof Pl?e._internalPath:e._delegate._internalPath}/**
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
 */function _w(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new O(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class mw{convertValue(e,t="none"){switch(Wt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return fe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(qt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return un(e,((i,r)=>{s[i]=this.convertValue(r,t)})),s}convertVectorValue(e){var t,s,i;const r=(i=(s=(t=e.fields)===null||t===void 0?void 0:t[cr].arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map((a=>fe(a.doubleValue)));return new rt(r)}convertGeoPoint(e){return new it(fe(e.latitude),fe(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Or(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Gs(e));default:return null}}convertTimestamp(e){const t=jt(e);return new re(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=oe.fromString(e);Z(Gf(s),9688,{name:e});const i=new Ks(s.get(1),s.get(3)),r=new M(s.popFirst(5));return i.isEqual(t)||yt(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
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
 */function gw(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class ws{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class en extends bp{constructor(e,t,s,i,r,a){super(e,t,s,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new $i(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Pp("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=en._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}en._jsonSchemaVersion="firestore/documentSnapshot/1.0",en._jsonSchema={type:_e("string",en._jsonSchemaVersion),bundleSource:_e("string","DocumentSnapshot"),bundleName:_e("string"),bundle:_e("string")};class $i extends en{data(e={}){return super.data(e)}}class Rn{constructor(e,t,s,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new ws(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new $i(this._firestore,this._userDataWriter,s.key,s,new ws(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,r){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map((l=>{const u=new $i(i._firestore,i._userDataWriter,l.doc.key,l.doc,new ws(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((l=>r||l.type!==3)).map((l=>{const u=new $i(i._firestore,i._userDataWriter,l.doc.key,l.doc,new ws(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return l.type!==0&&(h=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:yw(l.type),doc:u,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Rn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=sl.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],i=[];return this.docs.forEach((r=>{r._document!==null&&(t.push(r._document),s.push(this._userDataWriter.convertObjectMap(r._document.data.value.mapValue.fields,"previous")),i.push(r.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function yw(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F(61501,{type:n})}}/**
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
 */function Bw(n){n=xt(n,ye);const e=xt(n.firestore,Zs);return sw(bl(e),n._key).then((t=>Dp(e,n,t)))}Rn._jsonSchemaVersion="firestore/querySnapshot/1.0",Rn._jsonSchema={type:_e("string",Rn._jsonSchemaVersion),bundleSource:_e("string","QuerySnapshot"),bundleName:_e("string"),bundle:_e("string")};class Np extends mw{constructor(e){super(),this.firestore=e}convertBytes(e){return new ze(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ye(this.firestore,null,t)}}function jw(n,e,t){n=xt(n,ye);const s=xt(n.firestore,Zs),i=gw(n.converter,e,t);return vw(s,[uw(cw(s),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,_t.none())])}function qw(n,...e){var t,s,i;n=He(n);let r={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||vh(e[a])||(r=e[a++]);const l={includeMetadataChanges:r.includeMetadataChanges,source:r.source};if(vh(e[a])){const p=e[a];e[a]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[a+1]=(s=p.error)===null||s===void 0?void 0:s.bind(p),e[a+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let u,h,f;if(n instanceof ye)h=xt(n.firestore,Zs),f=Lr(n._key.path),u={next:p=>{e[a]&&e[a](Dp(h,n,p))},error:e[a+1],complete:e[a+2]};else{const p=xt(n,Hr);h=xt(p.firestore,Zs),f=p._query;const m=new Np(h);u={next:w=>{e[a]&&e[a](new Rn(h,m,p,w))},error:e[a+1],complete:e[a+2]},_w(n._query)}return(function(m,w,R,D){const N=new gp(D),q=new lp(w,N,R);return m.asyncQueue.enqueueAndForget((async()=>op(await va(m),q))),()=>{N.Ou(),m.asyncQueue.enqueueAndForget((async()=>ap(await va(m),q)))}})(bl(h),f,l,u)}function vw(n,e){return(function(s,i){const r=new Vt;return s.asyncQueue.enqueueAndForget((async()=>$I(await nw(s),i,r))),r.promise})(bl(n),e)}function Dp(n,e,t){const s=t.docs.get(e._key),i=new Np(n);return new en(n,i,e._key,s,new ws(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(i){Gn=i})(Mh),Ms(new Nn("firestore",((s,{instanceIdentifier:i,options:r})=>{const a=s.getProvider("app").getImmediate(),l=new Zs(new dE(s.getProvider("auth-internal")),new _E(a,s.getProvider("app-check-internal")),(function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new O(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ks(h.options.projectId,f)})(a,i),a);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l}),"PUBLIC").setMultipleInstances(!0)),Pt(Cu,Au,e),Pt(Cu,Au,"esm2017")})();export{Nw as A,kw as B,Nn as C,Dw as D,Nh as E,qn as F,Bw as G,xw as H,Fm as I,bw as J,qw as K,Ia as L,Ow as M,Rw as N,Uw as O,Mw as P,Vw as Q,Mh as S,Ms as _,S_ as a,Iw as b,Oh as c,He as d,Sw as e,Q as f,Ew as g,Ta as h,Ph as i,xo as j,ei as k,xh as l,I_ as m,Lh as n,Os as o,Sh as p,M_ as q,Pt as r,Cw as s,Aw as t,bh as u,ww as v,Oo as w,Tw as x,Fw as y,jw as z};
