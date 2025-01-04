(()=>{var rr=Object.create;var Be=Object.defineProperty;var ir=Object.getOwnPropertyDescriptor;var nr=Object.getOwnPropertyNames;var ar=Object.getPrototypeOf,fr=Object.prototype.hasOwnProperty;var N=(i,a)=>()=>(a||i((a={exports:{}}).exports,a),a.exports);var ur=(i,a,c,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let m of nr(a))!fr.call(i,m)&&m!==c&&Be(i,m,{get:()=>a[m],enumerable:!(l=ir(a,m))||l.enumerable});return i};var ee=(i,a,c)=>(c=i!=null?rr(ar(i)):{},ur(a||!i||!i.__esModule?Be(c,"default",{value:i,enumerable:!0}):c,i));var J=N((Sr,Ye)=>{"use strict";function X(i,a,c,l,m,s){return{tag:i,key:a,attrs:c,children:l,text:m,dom:s,domSize:void 0,state:void 0,events:void 0,instance:void 0}}X.normalize=function(i){return Array.isArray(i)?X("[",void 0,void 0,X.normalizeChildren(i),void 0,void 0):i==null||typeof i=="boolean"?null:typeof i=="object"?i:X("#",void 0,void 0,String(i),void 0,void 0)};X.normalizeChildren=function(i){var a=[];if(i.length){for(var c=i[0]!=null&&i[0].key!=null,l=1;l<i.length;l++)if((i[l]!=null&&i[l].key!=null)!==c)throw new TypeError(c&&(i[l]!=null||typeof i[l]=="boolean")?"In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole.":"In fragments, vnodes must either all have keys or none have keys.");for(var l=0;l<i.length;l++)a[l]=X.normalize(i[l])}return a};Ye.exports=X});var Re=N((Mr,Xe)=>{"use strict";var lr=J();Xe.exports=function(){var i=arguments[this],a=this+1,c;if(i==null?i={}:(typeof i!="object"||i.tag!=null||Array.isArray(i))&&(i={},a=this),arguments.length===a+1)c=arguments[a],Array.isArray(c)||(c=[c]);else for(c=[];a<arguments.length;)c.push(arguments[a++]);return lr("",i.key,i,c)}});var me=N((Ur,Ze)=>{"use strict";Ze.exports={}.hasOwnProperty});var Ie=N((Hr,et)=>{"use strict";var cr=J(),sr=Re(),Pe=me(),or=/(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g,ke=Object.create(null);function mr(i){for(var a in i)if(Pe.call(i,a))return!1;return!0}function hr(i){for(var a,c="div",l=[],m={};a=or.exec(i);){var s=a[1],u=a[2];if(s===""&&u!=="")c=u;else if(s==="#")m.id=u;else if(s===".")l.push(u);else if(a[3][0]==="["){var h=a[6];h&&(h=h.replace(/\\(["'])/g,"$1").replace(/\\\\/g,"\\")),a[4]==="class"?l.push(h):m[a[4]]=h===""?h:h||!0}}return l.length>0&&(m.className=l.join(" ")),mr(m)&&(m=null),ke[i]={tag:c,attrs:m}}function pr(i,a){var c=a.attrs,l=Pe.call(c,"class"),m=l?c.class:c.className;return a.tag=i.tag,i.attrs!=null?(c=Object.assign({},i.attrs,c),(m!=null||i.attrs.className!=null)&&(c.className=m!=null?i.attrs.className!=null?String(i.attrs.className)+" "+String(m):m:i.attrs.className!=null?i.attrs.className:null)):m!=null&&(c.className=m),l&&(c.class=null),i.tag==="input"&&Pe.call(c,"type")&&(c=Object.assign({type:c.type},c)),a.attrs=c,a}function yr(i){if(i==null||typeof i!="string"&&typeof i!="function"&&typeof i.view!="function")throw Error("The selector must be either a string or a component.");var a=sr.apply(1,arguments);return typeof i=="string"&&(a.children=cr.normalizeChildren(a.children),i!=="[")?pr(ke[i]||hr(i),a):(a.tag=i,a)}et.exports=yr});var rt=N(($r,tt)=>{"use strict";var gr=J();tt.exports=function(i){return i==null&&(i=""),gr("<",void 0,void 0,i,void 0,void 0)}});var nt=N((Gr,it)=>{"use strict";var wr=J(),dr=Re();it.exports=function(){var i=dr.apply(0,arguments);return i.tag="[",i.children=wr.normalizeChildren(i.children),i}});var ft=N((Qr,at)=>{"use strict";var Fe=Ie();Fe.trust=rt();Fe.fragment=nt();at.exports=Fe});var je=N((Wr,lt)=>{"use strict";var ut=new WeakMap;function*br(i,a={}){var c=i.dom,l=i.domSize,m=a.generation;if(c!=null)do{var s=c.nextSibling;ut.get(c)===m&&(yield c,l--),c=s}while(l)}lt.exports={delayedRemoval:ut,domFor:br}});var mt=N((Jr,ot)=>{"use strict";var _e=J(),st=je(),ct=st.delayedRemoval,De=st.domFor;ot.exports=function(){var i={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},a,c;function l(t){return t.ownerDocument}function m(t){return t.attrs&&t.attrs.xmlns||i[t.tag]}function s(t,e){if(t.state!==e)throw new Error("'vnode.state' must not be modified.")}function u(t){var e=t.state;try{return this.apply(e,arguments)}finally{s(t,e)}}function h(t){try{return l(t).activeElement}catch{return null}}function b(t,e,r,n,f,o,d){for(var E=r;E<n;E++){var p=e[E];p!=null&&x(t,p,f,d,o)}}function x(t,e,r,n,f){var o=e.tag;if(typeof o=="string")switch(e.state={},e.attrs!=null&&ve(e.attrs,e,r),o){case"#":q(t,e,f);break;case"<":L(t,e,n,f);break;case"[":g(t,e,r,n,f);break;default:_(t,e,r,n,f)}else G(t,e,r,n,f)}function q(t,e,r){e.dom=l(t).createTextNode(e.children),W(t,e.dom,r)}var O={caption:"table",thead:"table",tbody:"table",tfoot:"table",tr:"tbody",th:"tr",td:"tr",colgroup:"table",col:"colgroup"};function L(t,e,r,n){var f=e.children.match(/^\s*?<(\w+)/im)||[],o=l(t).createElement(O[f[1]]||"div");r==="http://www.w3.org/2000/svg"?(o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+e.children+"</svg>",o=o.firstChild):o.innerHTML=e.children,e.dom=o.firstChild,e.domSize=o.childNodes.length;for(var d=l(t).createDocumentFragment(),E;E=o.firstChild;)d.appendChild(E);W(t,d,n)}function g(t,e,r,n,f){var o=l(t).createDocumentFragment();if(e.children!=null){var d=e.children;b(o,d,0,d.length,r,null,n)}e.dom=o.firstChild,e.domSize=o.childNodes.length,W(t,o,f)}function _(t,e,r,n,f){var o=e.tag,d=e.attrs,E=d&&d.is;n=m(e)||n;var p=n?E?l(t).createElementNS(n,o,{is:E}):l(t).createElementNS(n,o):E?l(t).createElement(o,{is:E}):l(t).createElement(o);if(e.dom=p,d!=null&&Bt(e,d,n),W(t,p,f),!V(e)&&e.children!=null){var A=e.children;b(p,A,0,A.length,r,null,n),e.tag==="select"&&d!=null&&Xt(e,d)}}function K(t,e){var r;if(typeof t.tag.view=="function"){if(t.state=Object.create(t.tag),r=t.state.view,r.$$reentrantLock$$!=null)return;r.$$reentrantLock$$=!0}else{if(t.state=void 0,r=t.tag,r.$$reentrantLock$$!=null)return;r.$$reentrantLock$$=!0,t.state=t.tag.prototype!=null&&typeof t.tag.prototype.view=="function"?new t.tag(t):t.tag(t)}if(ve(t.state,t,e),t.attrs!=null&&ve(t.attrs,t,e),t.instance=_e.normalize(u.call(t.state.view,t)),t.instance===t)throw Error("A view cannot return the vnode it received as argument");r.$$reentrantLock$$=null}function G(t,e,r,n,f){K(e,r),e.instance!=null?(x(t,e.instance,r,n,f),e.dom=e.instance.dom,e.domSize=e.dom!=null?e.instance.domSize:0):e.domSize=0}function Q(t,e,r,n,f,o){if(!(e===r||e==null&&r==null))if(e==null||e.length===0)b(t,r,0,r.length,n,f,o);else if(r==null||r.length===0)ae(t,e,0,e.length);else{var d=e[0]!=null&&e[0].key!=null,E=r[0]!=null&&r[0].key!=null,p=0,A=0;if(!d)for(;A<e.length&&e[A]==null;)A++;if(!E)for(;p<r.length&&r[p]==null;)p++;if(d!==E)ae(t,e,A,e.length),b(t,r,p,r.length,n,f,o);else if(E){for(var U=e.length-1,D=r.length-1,oe,H,I,M,z,Te;U>=A&&D>=p&&(M=e[U],z=r[D],M.key===z.key);)M!==z&&$(t,M,z,n,f,o),z.dom!=null&&(f=z.dom),U--,D--;for(;U>=A&&D>=p&&(H=e[A],I=r[p],H.key===I.key);)A++,p++,H!==I&&$(t,H,I,n,Y(e,A,f),o);for(;U>=A&&D>=p&&!(p===D||H.key!==z.key||M.key!==I.key);)Te=Y(e,A,f),ne(t,M,Te),M!==I&&$(t,M,I,n,Te,o),++p<=--D&&ne(t,H,f),H!==z&&$(t,H,z,n,f,o),z.dom!=null&&(f=z.dom),A++,U--,M=e[U],z=r[D],H=e[A],I=r[p];for(;U>=A&&D>=p&&M.key===z.key;)M!==z&&$(t,M,z,n,f,o),z.dom!=null&&(f=z.dom),U--,D--,M=e[U],z=r[D];if(p>D)ae(t,e,A,U+1);else if(A>U)b(t,r,p,D+1,n,f,o);else{var tr=f,Ve=D-p+1,le=new Array(Ve),Ae=0,P=0,Ce=2147483647,ze=0,oe,Ne;for(P=0;P<Ve;P++)le[P]=-1;for(P=D;P>=p;P--){oe==null&&(oe=C(e,A,U+1)),z=r[P];var k=oe[z.key];k!=null&&(Ce=k<Ce?k:-1,le[P-p]=k,M=e[k],e[k]=null,M!==z&&$(t,M,z,n,f,o),z.dom!=null&&(f=z.dom),ze++)}if(f=tr,ze!==U-A+1&&ae(t,e,A,U+1),ze===0)b(t,r,p,D+1,n,f,o);else if(Ce===-1)for(Ne=j(le),Ae=Ne.length-1,P=D;P>=p;P--)I=r[P],le[P-p]===-1?x(t,I,n,o,f):Ne[Ae]===P-p?Ae--:ne(t,I,f),I.dom!=null&&(f=r[P].dom);else for(P=D;P>=p;P--)I=r[P],le[P-p]===-1&&x(t,I,n,o,f),I.dom!=null&&(f=r[P].dom)}}else{var Oe=e.length<r.length?e.length:r.length;for(p=p<A?p:A;p<Oe;p++)H=e[p],I=r[p],!(H===I||H==null&&I==null)&&(H==null?x(t,I,n,o,Y(e,p+1,f)):I==null?ce(t,H):$(t,H,I,n,Y(e,p+1,f),o));e.length>Oe&&ae(t,e,p,e.length),r.length>Oe&&b(t,r,p,r.length,n,f,o)}}}function $(t,e,r,n,f,o){var d=e.tag,E=r.tag;if(d===E){if(r.state=e.state,r.events=e.events,er(r,e))return;if(typeof d=="string")switch(r.attrs!=null&&Ee(r.attrs,r,n),d){case"#":R(e,r);break;case"<":y(t,e,r,o,f);break;case"[":T(t,e,r,n,f,o);break;default:w(e,r,n,o)}else F(t,e,r,n,f,o)}else ce(t,e),x(t,r,n,o,f)}function R(t,e){t.children.toString()!==e.children.toString()&&(t.dom.nodeValue=e.children),e.dom=t.dom}function y(t,e,r,n,f){e.children!==r.children?(se(t,e,void 0),L(t,r,n,f)):(r.dom=e.dom,r.domSize=e.domSize)}function T(t,e,r,n,f,o){Q(t,e.children,r.children,n,f,o);var d=0,E=r.children;if(r.dom=null,E!=null){for(var p=0;p<E.length;p++){var A=E[p];A!=null&&A.dom!=null&&(r.dom==null&&(r.dom=A.dom),d+=A.domSize||1)}d!==1&&(r.domSize=d)}}function w(t,e,r,n){var f=e.dom=t.dom;n=m(e)||n,Zt(e,t.attrs,e.attrs,n),V(e)||Q(f,t.children,e.children,r,null,n)}function F(t,e,r,n,f,o){if(r.instance=_e.normalize(u.call(r.state.view,r)),r.instance===r)throw Error("A view cannot return the vnode it received as argument");Ee(r.state,r,n),r.attrs!=null&&Ee(r.attrs,r,n),r.instance!=null?(e.instance==null?x(t,r.instance,n,o,f):$(t,e.instance,r.instance,n,f,o),r.dom=r.instance.dom,r.domSize=r.instance.domSize):e.instance!=null?(ce(t,e.instance),r.dom=void 0,r.domSize=0):(r.dom=e.dom,r.domSize=e.domSize)}function C(t,e,r){for(var n=Object.create(null);e<r;e++){var f=t[e];if(f!=null){var o=f.key;o!=null&&(n[o]=e)}}return n}var v=[];function j(t){for(var e=[0],r=0,n=0,f=0,o=v.length=t.length,f=0;f<o;f++)v[f]=t[f];for(var f=0;f<o;++f)if(t[f]!==-1){var d=e[e.length-1];if(t[d]<t[f]){v[f]=d,e.push(f);continue}for(r=0,n=e.length-1;r<n;){var E=(r>>>1)+(n>>>1)+(r&n&1);t[e[E]]<t[f]?r=E+1:n=E}t[f]<t[e[r]]&&(r>0&&(v[f]=e[r-1]),e[r]=f)}for(r=e.length,n=e[r-1];r-- >0;)e[r]=n,n=v[n];return v.length=0,e}function Y(t,e,r){for(;e<t.length;e++)if(t[e]!=null&&t[e].dom!=null)return t[e].dom;return r}function ne(t,e,r){if(e.dom!=null){var n;if(e.domSize==null)n=e.dom;else{n=l(t).createDocumentFragment();for(var f of De(e))n.appendChild(f)}W(t,n,r)}}function W(t,e,r){r!=null?t.insertBefore(e,r):t.appendChild(e)}function V(t){if(t.attrs==null||t.attrs.contenteditable==null&&t.attrs.contentEditable==null)return!1;var e=t.children;if(e!=null&&e.length===1&&e[0].tag==="<"){var r=e[0].children;t.dom.innerHTML!==r&&(t.dom.innerHTML=r)}else if(e!=null&&e.length!==0)throw new Error("Child node of a contenteditable must be trusted.");return!0}function ae(t,e,r,n){for(var f=r;f<n;f++){var o=e[f];o!=null&&ce(t,o)}}function ce(t,e){var r=0,n=e.state,f,o;if(typeof e.tag!="string"&&typeof e.state.onbeforeremove=="function"){var d=u.call(e.state.onbeforeremove,e);d!=null&&typeof d.then=="function"&&(r=1,f=d)}if(e.attrs&&typeof e.attrs.onbeforeremove=="function"){var d=u.call(e.attrs.onbeforeremove,e);d!=null&&typeof d.then=="function"&&(r|=2,o=d)}s(e,n);var E;if(!r)fe(e),se(t,e,E);else{E=c;for(var p of De(e))ct.set(p,E);f?.finally(function(){r&1&&(r&=2,r||(s(e,n),fe(e),se(t,e,E)))}),o?.finally(function(){r&2&&(r&=1,r||(s(e,n),fe(e),se(t,e,E)))})}}function se(t,e,r){if(e.dom!=null)if(e.domSize==null)ct.get(e.dom)===r&&t.removeChild(e.dom);else for(var n of De(e,{generation:r}))t.removeChild(n)}function fe(t){if(typeof t.tag!="string"&&typeof t.state.onremove=="function"&&u.call(t.state.onremove,t),t.attrs&&typeof t.attrs.onremove=="function"&&u.call(t.attrs.onremove,t),typeof t.tag!="string")t.instance!=null&&fe(t.instance);else{var e=t.children;if(Array.isArray(e))for(var r=0;r<e.length;r++){var n=e[r];n!=null&&fe(n)}}}function Bt(t,e,r){for(var n in e)xe(t,n,null,e[n],r)}function xe(t,e,r,n,f){if(!(e==="key"||e==="is"||n==null||Qe(e)||r===n&&!kt(t,e)&&typeof n!="object")){if(e[0]==="o"&&e[1]==="n")return Ke(t,e,n);if(e.slice(0,6)==="xlink:")t.dom.setAttributeNS("http://www.w3.org/1999/xlink",e.slice(6),n);else if(e==="style")Je(t.dom,r,n);else if(We(t,e,f)){if(e==="value"){var o=t.tag==="input"&&t.attrs.type==="file";if((t.tag==="input"||t.tag==="textarea")&&t.dom.value===""+n&&(o||t.dom===h(t.dom))||t.tag==="select"&&r!==null&&t.dom.value===""+n||t.tag==="option"&&r!==null&&t.dom.value===""+n)return;if(o&&""+n!=""){console.error("`value` is read-only on file inputs!");return}}t.tag==="input"&&e==="type"?t.dom.setAttribute(e,n):t.dom[e]=n}else typeof n=="boolean"?n?t.dom.setAttribute(e,""):t.dom.removeAttribute(e):t.dom.setAttribute(e==="className"?"class":e,n)}}function Yt(t,e,r,n){if(!(e==="key"||e==="is"||r==null||Qe(e)))if(e[0]==="o"&&e[1]==="n")Ke(t,e,void 0);else if(e==="style")Je(t.dom,r,null);else if(We(t,e,n)&&e!=="className"&&e!=="title"&&!(e==="value"&&(t.tag==="option"||t.tag==="select"&&t.dom.selectedIndex===-1&&t.dom===h(t.dom)))&&!(t.tag==="input"&&e==="type"))t.dom[e]=null;else{var f=e.indexOf(":");f!==-1&&(e=e.slice(f+1)),r!==!1&&t.dom.removeAttribute(e==="className"?"class":e)}}function Xt(t,e){if("value"in e)if(e.value===null)t.dom.selectedIndex!==-1&&(t.dom.value=null);else{var r=""+e.value;(t.dom.value!==r||t.dom.selectedIndex===-1)&&(t.dom.value=r)}"selectedIndex"in e&&xe(t,"selectedIndex",null,e.selectedIndex,void 0)}function Zt(t,e,r,n){if(e&&e===r&&console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"),r!=null)for(var f in r)xe(t,f,e&&e[f],r[f],n);var o;if(e!=null)for(var f in e)(o=e[f])!=null&&(r==null||r[f]==null)&&Yt(t,f,o,n)}function kt(t,e){return e==="value"||e==="checked"||e==="selectedIndex"||e==="selected"&&t.dom===h(t.dom)||t.tag==="option"&&t.dom.parentNode===h(t.dom)}function Qe(t){return t==="oninit"||t==="oncreate"||t==="onupdate"||t==="onremove"||t==="onbeforeremove"||t==="onbeforeupdate"}function We(t,e,r){return r===void 0&&(t.tag.indexOf("-")>-1||t.attrs!=null&&t.attrs.is||e!=="href"&&e!=="list"&&e!=="form"&&e!=="width"&&e!=="height")&&e in t.dom}function Je(t,e,r){if(e!==r)if(r==null)t.style="";else if(typeof r!="object")t.style=r;else if(e==null||typeof e!="object"){t.style.cssText="";for(var n in r){var f=r[n];f!=null&&(n.includes("-")?t.style.setProperty(n,String(f)):t.style[n]=String(f))}}else{for(var n in r){var f=r[n];f!=null&&(f=String(f))!==String(e[n])&&(n.includes("-")?t.style.setProperty(n,f):t.style[n]=f)}for(var n in e)e[n]!=null&&r[n]==null&&(n.includes("-")?t.style.removeProperty(n):t.style[n]="")}}function qe(){this._=a}qe.prototype=Object.create(null),qe.prototype.handleEvent=function(t){var e=this["on"+t.type],r;typeof e=="function"?r=e.call(t.currentTarget,t):typeof e.handleEvent=="function"&&e.handleEvent(t),this._&&t.redraw!==!1&&(0,this._)(),r===!1&&(t.preventDefault(),t.stopPropagation())};function Ke(t,e,r){if(t.events!=null){if(t.events._=a,t.events[e]===r)return;r!=null&&(typeof r=="function"||typeof r=="object")?(t.events[e]==null&&t.dom.addEventListener(e.slice(2),t.events,!1),t.events[e]=r):(t.events[e]!=null&&t.dom.removeEventListener(e.slice(2),t.events,!1),t.events[e]=void 0)}else r!=null&&(typeof r=="function"||typeof r=="object")&&(t.events=new qe,t.dom.addEventListener(e.slice(2),t.events,!1),t.events[e]=r)}function ve(t,e,r){typeof t.oninit=="function"&&u.call(t.oninit,e),typeof t.oncreate=="function"&&r.push(u.bind(t.oncreate,e))}function Ee(t,e,r){typeof t.onupdate=="function"&&r.push(u.bind(t.onupdate,e))}function er(t,e){do{if(t.attrs!=null&&typeof t.attrs.onbeforeupdate=="function"){var r=u.call(t.attrs.onbeforeupdate,t,e);if(r!==void 0&&!r)break}if(typeof t.tag!="string"&&typeof t.state.onbeforeupdate=="function"){var r=u.call(t.state.onbeforeupdate,t,e);if(r!==void 0&&!r)break}return!1}while(!1);return t.dom=e.dom,t.domSize=e.domSize,t.instance=e.instance,t.attrs=e.attrs,t.children=e.children,t.text=e.text,!0}var ue;return function(t,e,r){if(!t)throw new TypeError("DOM element being rendered to does not exist.");if(ue!=null&&t.contains(ue))throw new TypeError("Node is currently being rendered to and thus is locked.");var n=a,f=ue,o=[],d=h(t),E=t.namespaceURI;ue=t,a=typeof r=="function"?r:void 0,c={};try{t.vnodes==null&&(t.textContent=""),e=_e.normalizeChildren(Array.isArray(e)?e:[e]),Q(t,t.vnodes,e,o,null,E==="http://www.w3.org/1999/xhtml"?void 0:E),t.vnodes=e,d!=null&&h(t)!==d&&typeof d.focus=="function"&&d.focus();for(var p=0;p<o.length;p++)o[p]()}finally{a=n,ue=f}}}});var Le=N((Kr,ht)=>{"use strict";ht.exports=mt()(typeof window<"u"?window:null)});var gt=N((Vr,yt)=>{"use strict";var pt=J();yt.exports=function(i,a,c){var l=[],m=!1,s=-1;function u(){for(s=0;s<l.length;s+=2)try{i(l[s],pt(l[s+1]),h)}catch(x){c.error(x)}s=-1}function h(){m||(m=!0,a(function(){m=!1,u()}))}h.sync=u;function b(x,q){if(q!=null&&q.view==null&&typeof q!="function")throw new TypeError("m.mount expects a component, not a vnode.");var O=l.indexOf(x);O>=0&&(l.splice(O,2),O<=s&&(s-=2),i(x,[])),q!=null&&(l.push(x,q),i(x,pt(q),h))}return{mount:b,redraw:h}}});var he=N((Br,wt)=>{"use strict";var xr=Le();wt.exports=gt()(xr,typeof requestAnimationFrame<"u"?requestAnimationFrame:null,typeof console<"u"?console:null)});var Se=N((Yr,dt)=>{"use strict";dt.exports=function(i){if(Object.prototype.toString.call(i)!=="[object Object]")return"";var a=[];for(var c in i)l(c,i[c]);return a.join("&");function l(m,s){if(Array.isArray(s))for(var u=0;u<s.length;u++)l(m+"["+u+"]",s[u]);else if(Object.prototype.toString.call(s)==="[object Object]")for(var u in s)l(m+"["+u+"]",s[u]);else a.push(encodeURIComponent(m)+(s!=null&&s!==""?"="+encodeURIComponent(s):""))}}});var pe=N((Xr,bt)=>{"use strict";var qr=Se();bt.exports=function(i,a){if(/:([^\/\.-]+)(\.{3})?:/.test(i))throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");if(a==null)return i;var c=i.indexOf("?"),l=i.indexOf("#"),m=l<0?i.length:l,s=c<0?m:c,u=i.slice(0,s),h={};Object.assign(h,a);var b=u.replace(/:([^\/\.-]+)(\.{3})?/g,function(K,G,Q){return delete h[G],a[G]==null?K:Q?a[G]:encodeURIComponent(String(a[G]))}),x=b.indexOf("?"),q=b.indexOf("#"),O=q<0?b.length:q,L=x<0?O:x,g=b.slice(0,L);c>=0&&(g+=i.slice(c,m)),x>=0&&(g+=(c<0?"?":"&")+b.slice(x,O));var _=qr(h);return _&&(g+=(c<0&&x<0?"?":"&")+_),l>=0&&(g+=i.slice(l)),q>=0&&(g+=(l<0?"":"&")+b.slice(q)),g}});var vt=N((Zr,qt)=>{"use strict";var vr=pe(),xt=me();qt.exports=function(i,a){function c(s){return new Promise(s)}function l(s,u){return new Promise(function(h,b){s=vr(s,u.params);var x=u.method!=null?u.method.toUpperCase():"GET",q=u.body,O=(u.serialize==null||u.serialize===JSON.serialize)&&!(q instanceof i.FormData||q instanceof i.URLSearchParams),L=u.responseType||(typeof u.extract=="function"?"":"json"),g=new i.XMLHttpRequest,_=!1,K=!1,G=g,Q,$=g.abort;g.abort=function(){_=!0,$.call(this)},g.open(x,s,u.async!==!1,typeof u.user=="string"?u.user:void 0,typeof u.password=="string"?u.password:void 0),O&&q!=null&&!m(u,"content-type")&&g.setRequestHeader("Content-Type","application/json; charset=utf-8"),typeof u.deserialize!="function"&&!m(u,"accept")&&g.setRequestHeader("Accept","application/json, text/*"),u.withCredentials&&(g.withCredentials=u.withCredentials),u.timeout&&(g.timeout=u.timeout),g.responseType=L;for(var R in u.headers)xt.call(u.headers,R)&&g.setRequestHeader(R,u.headers[R]);g.onreadystatechange=function(y){if(!_&&y.target.readyState===4)try{var T=y.target.status>=200&&y.target.status<300||y.target.status===304||/^file:\/\//i.test(s),w=y.target.response,F;if(L==="json"){if(!y.target.responseType&&typeof u.extract!="function")try{w=JSON.parse(y.target.responseText)}catch{w=null}}else(!L||L==="text")&&w==null&&(w=y.target.responseText);if(typeof u.extract=="function"?(w=u.extract(y.target,u),T=!0):typeof u.deserialize=="function"&&(w=u.deserialize(w)),T){if(typeof u.type=="function")if(Array.isArray(w))for(var C=0;C<w.length;C++)w[C]=new u.type(w[C]);else w=new u.type(w);h(w)}else{var v=function(){try{F=y.target.responseText}catch{F=w}var j=new Error(F);j.code=y.target.status,j.response=w,b(j)};g.status===0?setTimeout(function(){K||v()}):v()}}catch(j){b(j)}},g.ontimeout=function(y){K=!0;var T=new Error("Request timed out");T.code=y.target.status,b(T)},typeof u.config=="function"&&(g=u.config(g,u,s)||g,g!==G&&(Q=g.abort,g.abort=function(){_=!0,Q.call(this)})),q==null?g.send():typeof u.serialize=="function"?g.send(u.serialize(q)):q instanceof i.FormData||q instanceof i.URLSearchParams?g.send(q):g.send(JSON.stringify(q))})}c.prototype=Promise.prototype,c.__proto__=Promise;function m(s,u){for(var h in s.headers)if(xt.call(s.headers,h)&&h.toLowerCase()===u)return!0;return!1}return{request:function(s,u){typeof s!="string"?(u=s,s=s.url):u==null&&(u={});var h=l(s,u);if(u.background===!0)return h;var b=0;function x(){--b===0&&typeof a=="function"&&a()}return q(h);function q(O){var L=O.then;return O.constructor=c,O.then=function(){b++;var g=L.apply(O,arguments);return g.then(x,function(_){if(x(),b===0)throw _}),q(g)},O}}}}});var Ot=N((kr,Et)=>{"use strict";var Er=he();Et.exports=vt()(typeof window<"u"?window:null,Er.redraw)});var Me=N((ei,At)=>{"use strict";function Tt(i){try{return decodeURIComponent(i)}catch{return i}}At.exports=function(i){if(i===""||i==null)return{};i.charAt(0)==="?"&&(i=i.slice(1));for(var a=i.split("&"),c={},l={},m=0;m<a.length;m++){var s=a[m].split("="),u=Tt(s[0]),h=s.length===2?Tt(s[1]):"";h==="true"?h=!0:h==="false"&&(h=!1);var b=u.split(/\]\[?|\[/),x=l;u.indexOf("[")>-1&&b.pop();for(var q=0;q<b.length;q++){var O=b[q],L=b[q+1],g=L==""||!isNaN(parseInt(L,10));if(O===""){var u=b.slice(0,q).join();c[u]==null&&(c[u]=Array.isArray(x)?x.length:0),O=c[u]++}else if(O==="__proto__")break;if(q===b.length-1)x[O]=h;else{var _=Object.getOwnPropertyDescriptor(x,O);_!=null&&(_=_.value),_==null&&(x[O]=_=g?[]:{}),x=_}}}return l}});var ye=N((ti,Ct)=>{"use strict";var Or=Me();Ct.exports=function(i){var a=i.indexOf("?"),c=i.indexOf("#"),l=c<0?i.length:c,m=a<0?l:a,s=i.slice(0,m).replace(/\/{2,}/g,"/");return s?s[0]!=="/"&&(s="/"+s):s="/",{path:s,params:a<0?{}:Or(i.slice(a+1,l))}}});var Nt=N((ri,zt)=>{"use strict";var Tr=ye();zt.exports=function(i){var a=Tr(i),c=Object.keys(a.params),l=[],m=new RegExp("^"+a.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,function(s,u,h){return u==null?"\\"+s:(l.push({k:u,r:h==="..."}),h==="..."?"(.*)":h==="."?"([^/]+)\\.":"([^/]+)"+(h||""))})+"$");return function(s){for(var u=0;u<c.length;u++)if(a.params[c[u]]!==s.params[c[u]])return!1;if(!l.length)return m.test(s.path);var h=m.exec(s.path);if(h==null)return!1;for(var u=0;u<l.length;u++)s.params[l[u].k]=l[u].r?h[u+1]:decodeURIComponent(h[u+1]);return!0}}});var Ue=N((ii,It)=>{"use strict";var Rt=me(),Pt=new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");It.exports=function(i,a){var c={};if(a!=null)for(var l in i)Rt.call(i,l)&&!Pt.test(l)&&a.indexOf(l)<0&&(c[l]=i[l]);else for(var l in i)Rt.call(i,l)&&!Pt.test(l)&&(c[l]=i[l]);return c}});var Dt=N((ni,_t)=>{"use strict";var Ar=J(),Cr=Ie(),Ft=pe(),jt=ye(),zr=Nt(),Nr=Ue(),He={};function Rr(i){try{return decodeURIComponent(i)}catch{return i}}_t.exports=function(i,a){var c=i==null?null:typeof i.setImmediate=="function"?i.setImmediate:i.setTimeout,l=Promise.resolve(),m=!1,s=!1,u=0,h,b,x=He,q,O,L,g,_={onbeforeupdate:function(){return u=u?2:1,!(!u||He===x)},onremove:function(){i.removeEventListener("popstate",Q,!1),i.removeEventListener("hashchange",G,!1)},view:function(){if(!(!u||He===x)){var y=[Ar(q,O.key,O)];return x&&(y=x.render(y[0])),y}}},K=R.SKIP={};function G(){m=!1;var y=i.location.hash;R.prefix[0]!=="#"&&(y=i.location.search+y,R.prefix[0]!=="?"&&(y=i.location.pathname+y,y[0]!=="/"&&(y="/"+y)));var T=y.concat().replace(/(?:%[a-f89][a-f0-9])+/gim,Rr).slice(R.prefix.length),w=jt(T);Object.assign(w.params,i.history.state);function F(v){console.error(v),$(b,null,{replace:!0})}C(0);function C(v){for(;v<h.length;v++)if(h[v].check(w)){var j=h[v].component,Y=h[v].route,ne=j,W=g=function(V){if(W===g){if(V===K)return C(v+1);q=V!=null&&(typeof V.view=="function"||typeof V=="function")?V:"div",O=w.params,L=T,g=null,x=j.render?j:null,u===2?a.redraw():(u=2,a.redraw.sync())}};j.view||typeof j=="function"?(j={},W(ne)):j.onmatch?l.then(function(){return j.onmatch(w.params,T,Y)}).then(W,T===b?null:F):W("div");return}if(T===b)throw new Error("Could not resolve default route "+b+".");$(b,null,{replace:!0})}}function Q(){m||(m=!0,c(G))}function $(y,T,w){if(y=Ft(y,T),s){Q();var F=w?w.state:null,C=w?w.title:null;w&&w.replace?i.history.replaceState(F,C,R.prefix+y):i.history.pushState(F,C,R.prefix+y)}else i.location.href=R.prefix+y}function R(y,T,w){if(!y)throw new TypeError("DOM element being rendered to does not exist.");if(h=Object.keys(w).map(function(C){if(C[0]!=="/")throw new SyntaxError("Routes must start with a '/'.");if(/:([^\/\.-]+)(\.{3})?:/.test(C))throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");return{route:C,component:w[C],check:zr(C)}}),b=T,T!=null){var F=jt(T);if(!h.some(function(C){return C.check(F)}))throw new ReferenceError("Default route doesn't match any known routes.")}typeof i.history.pushState=="function"?i.addEventListener("popstate",Q,!1):R.prefix[0]==="#"&&i.addEventListener("hashchange",G,!1),s=!0,a.mount(y,_),G()}return R.set=function(y,T,w){g!=null&&(w=w||{},w.replace=!0),g=null,$(y,T,w)},R.get=function(){return L},R.prefix="#!",R.Link={view:function(y){var T=Cr(y.attrs.selector||"a",Nr(y.attrs,["options","params","selector","onclick"]),y.children),w,F,C;return(T.attrs.disabled=!!T.attrs.disabled)?(T.attrs.href=null,T.attrs["aria-disabled"]="true"):(w=y.attrs.options,F=y.attrs.onclick,C=Ft(T.attrs.href,y.attrs.params),T.attrs.href=R.prefix+C,T.attrs.onclick=function(v){var j;typeof F=="function"?j=F.call(v.currentTarget,v):F==null||typeof F!="object"||typeof F.handleEvent=="function"&&F.handleEvent(v),j!==!1&&!v.defaultPrevented&&(v.button===0||v.which===0||v.which===1)&&(!v.currentTarget.target||v.currentTarget.target==="_self")&&!v.ctrlKey&&!v.metaKey&&!v.shiftKey&&!v.altKey&&(v.preventDefault(),v.redraw=!1,R.set(C,null,w))}),T}},R.param=function(y){return O&&y!=null?O[y]:O},R}});var St=N((ai,Lt)=>{"use strict";var Pr=he();Lt.exports=Dt()(typeof window<"u"?window:null,Pr)});var Z=N((fi,Ut)=>{"use strict";var ge=ft(),Ir=Ot(),Mt=he(),Fr=je(),S=function(){return ge.apply(this,arguments)};S.m=ge;S.trust=ge.trust;S.fragment=ge.fragment;S.Fragment="[";S.mount=Mt.mount;S.route=St();S.render=Le();S.redraw=Mt.redraw;S.request=Ir.request;S.parseQueryString=Me();S.buildQueryString=Se();S.parsePathname=ye();S.buildPathname=pe();S.vnode=J();S.censor=Ue();S.domFor=Fr.domFor;Ut.exports=S});var Ge=ee(Z());var Wt=ee(Z());var de=ee(Z());var Ht=ee(Z()),$t={user:"unknown",lang:"en",feeds:[]};function we(){Ht.default.request({method:"GET",url:"/ytod/api/user_info"}).then(function(i){$t=i})}function Gt(i){for(var a of $t.feeds)if(a===i)return!0;return!1}function jr(i){return function(a){return function(){de.default.request({method:"POST",url:"/ytod/api/download",body:{video_id:a}}).then(c=>{alert(JSON.stringify(c))})}}(i.video_id)}function _r(i){return function(a){return function(){de.default.route.set("/watch/:videoid",{videoid:a})}}(i.watch)}function Qt(i,a){return function(c,l){return function(){de.default.request({method:"GET",url:`/ytod/api/${l}`,params:{channel_id:c}}).then(()=>{we()})}}(i.channel_id,a?"subscribe":"unsubscribe")}var $e={last_id:0,view:function(i){let a=i.attrs.item;if(console.log(a),!a)return mCreateElement("div",{class:"invalid_item"},"Invalid use of Item");let c=a.thumbnail?mCreateElement("img",{style:"width:auto",src:a.thumbnail.url,width:a.thumbnail.width,height:a.thumbnail.height}):mCreateElement("span",null),l=a.watch?mCreateElement("button",{class:"btn--green",onclick:_r(a)},"Watch"):mCreateElement("button",{class:"btn--yellow",onclick:jr(a)},"Download"),m=mCreateElement("span",null),s;if(Gt(a.channel_id)?s=mCreateElement("button",{class:"btn--red",onclick:Qt(a,!0)},"Unsubscribe"):s=mCreateElement("button",{class:"btn--blue",onclick:Qt(a,!0)},"Subscribe"),a.description){let u=$e.last_id++;m=mCreateElement("div",{class:"collapsible-wrap card no-pad"},mCreateElement("input",{type:"checkbox",id:`item-collapsible-${u}`}),mCreateElement("label",{for:`item-collapsible-${u}`},"Description"),mCreateElement("div",{class:`item-collapsible-${u}-area`},mCreateElement("p",null,a.description)))}return mCreateElement("div",{class:"card g--6",style:"margin-bottom: 1em"},mCreateElement("h3",null,a.title),c,mCreateElement("br",null),mCreateElement("a",{href:a.link},"Watch on YouTube"),mCreateElement("br",null),"Channel: ",a.channel,s,l,m)}};var te={view:function(i){let a=i.attrs.feed||{items:[],title:""},c=[];c.push(mCreateElement("div",{class:"g--12 g-m--12"},mCreateElement("h2",null,a.title)));for(let l of a.items)c.push(mCreateElement($e,{item:l}));return mCreateElement("div",{class:"container-wrap",style:"width: 1024px"},c)}};var B={view:function(){return mCreateElement("header",{class:"container"},mCreateElement("div",{class:"g--4",style:"text-align: center"},mCreateElement("a",{href:"#/index"},mCreateElement("h3",null,"Feeds"))),mCreateElement("div",{class:"g--4",style:"text-align: center"},mCreateElement("a",{href:"#/search"},mCreateElement("h3",null,"Search"))),mCreateElement("div",{class:"g--4",style:"text-align: center"},mCreateElement("a",{href:"#/archive"},mCreateElement("h3",null,"Archive"))))}};var re={feeds:[],view:function(){allFeeds=[];for(let i in re.feeds)allFeeds.push(mCreateElement(te,{feed:re.feeds[i]}));return mCreateElement("div",null,mCreateElement(B,null),allFeeds)},updateFeed:function(){Wt.default.request({method:"GET",url:"/ytod/api/feeds"}).then(i=>{re.feeds=i})}};var Jt={view:function(i){return mCreateElement("div",null,mCreateElement(B,null),mCreateElement("video",{controls:!0},mCreateElement("source",{src:`/ytod/api/video/${i.attrs.videoid}`})))}};var Kt=ee(Z());function Dr(){let i=document.getElementById("search_query").value;Kt.default.request({method:"GET",url:"/ytod/api/search",params:{q:i}}).then(function(a){be.result=a})}var be={result:{title:"",items:[]},view:function(){return mCreateElement("div",null,mCreateElement(B,null),mCreateElement("input",{type:"search",id:"search_query"}),mCreateElement("button",{class:"btn--primary",onclick:Dr},"Search"),mCreateElement(te,{feed:be.result}))}};var Vt=ee(Z()),ie={data:{title:"Archive",items:[]},view:function(){return console.log(ie.data),mCreateElement("div",null,mCreateElement(B,null),mCreateElement(te,{feed:ie.data}))},update:function(){Vt.default.request({method:"GET",url:"/ytod/api/local_videos"}).then(function(i){ie.data.items=i.result})}};window.mCreateElement=Ge.default;window.mFragment={view:i=>i.children};window.onload=function(){we(),ie.update(),Ge.default.route(document.body,"/index",{"/index":re,"/watch/:videoid":Jt,"/search":be,"/archive":ie}),re.updateFeed()};})();
//# sourceMappingURL=index.js.map