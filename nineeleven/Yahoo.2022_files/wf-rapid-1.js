!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("wafer-rapid",[],t):"object"==typeof exports?exports["wafer-rapid"]=t():(e.wafer=e.wafer||{},e.wafer.wafers=e.wafer.wafers||{},e.wafer.wafers["wafer-rapid"]=t())}("undefined"!=typeof self?self:this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="https://s.yimg.com/aaq/wf/",t(t.s="./src/entry.js")}({"./src/entry.js":function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(t,"__esModule",{value:!0});var l=window.wafer.utils.get,f=null,d=null,p=function(e,t){var r={};return e&&(r.id=e),t&&(r=t.split(";").reduce(function(e,t){var r=t.split(":");return 2===r.length&&(e[r[0]]=r[1]),e},r)),r},y=function(e){return e&&(d=e),!f&&d&&(f=l(window,d))&&"function"!=typeof f.refreshModule&&(d=null,f=null),f},b=function(){var e=void 0;return function(t){if(!(e=e||window.rapidPageConfig))return!1;var r=e,n=r.rapidConfig,i=void 0===n?{}:n,o=i.tracked_mods_viewability;return!!o&&!!o[t]}}(),v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},g=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),h=window.wafer,w=h.base,_=h.constants,m=h.utils,k=h.WaferBaseClass,O=m.setTimeout,j=m.clearTimeout,E=_.ATTR_PREFIX,T=[],A=["handleClick","handleRapidMouseEnter","handleRapidMouseLeave"],P=function(e){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=r.selector;n(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,{selector:o},{STATE_ATTRS:T})),s=e.getAttribute(E+"rapid-trigger");if(!s)return i(a);"click"!==s&&"eachClick"!==s||e.classList.add("has-rapid-click","has-wafer-click");var u=e.getAttribute(E+"rapid-method"),c=e.getAttribute(E+"rapid-name"),l=p(e.id,e.getAttribute("data-i13n")||e.getAttribute("data-ylk")),f=p(null,e.getAttribute("data-page-i13n")),d=e.getAttribute("data-rapid_p")||"1";return a._util=v({},a._util,{elem:e,i13n:l,name:c,pageI13n:f,pos:d,trigger:s,triggerMethod:u}),a._state=a._state||{},A.forEach(function(e){a[e]=a[e].bind(a)}),"onLoad"===s?(a._beaconTrigger(),a.destroy()):"mouseenter"===s&&(a._state.mouseEnterTimeout=null,a.addEventListeners()),a}return o(t,e),g(t,[{key:"_beaconTrigger",value:function(){var e=y();if(e){var t=this._util,r=t.name,n=t.trigger,i=t.triggerMethod,o=t.pos,a=t.i13n;if("beaconClick"===i)e.beaconClick(a.sec,a.slk,o,a);else if("beaconEvent"===i){var s=this._util.elem;w.emitLog({name:"WaferRapid",elem:s,meta:{i13n:a,name:r,type:"beaconEvent"}}),e.beaconEvent(r,a)}else if("beaconLinkViews"===i)e.beaconLinkViews([v({},a,{_links:[a]})]);else if("pageView"===i){var u=this._util.pageI13n,c=a.spaceid,l=e.getRapidAttribute("keys");e.clearRapidAttribute(["keys"]),e.setRapidAttribute({keys:Object.assign({},l,u),spaceid:c||e.getRapidAttribute("spaceid")}),e.beaconPageview(u),"click"===n&&this.destroy()}}}},{key:"handleClick",value:function(){this._beaconTrigger()}},{key:"handleRapidMouseEnter",value:function(){var e=this;this._destroyed||(j(this._state.mouseEnterTimeout,this),this._state.mouseEnterTimeout=O(function(){e._beaconTrigger()},100,this))}},{key:"handleRapidMouseLeave",value:function(){this._destroyed||j(this._state.mouseEnterTimeout,this)}}]),t}(k);P.events={click:[["has-rapid-click","handleClick"]],mouseenter:[["_self","handleRapidMouseEnter"]],mouseleave:[["_self","handleRapidMouseLeave"]]};var M=P,C=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),R=function e(t,r,n){null===t&&(t=Function.prototype);var i=Object.getOwnPropertyDescriptor(t,r);if(void 0===i){var o=Object.getPrototypeOf(t);return null===o?void 0:e(o,r,n)}if("value"in i)return i.value;var a=i.get;if(void 0!==a)return a.call(n)},L=window.wafer.controllers.WaferBaseController,x=window.wafer.utils.convertNodeListToArray,I=function(e){for(var t=e,r=void 0;t;)t.classList.contains("wafer-rapid-module")&&(r=t),t=t.parentElement;return r},W=function(e,t){var r=t.get(e);if(!r)return!1;var n=r.instance,i=n._util.trigger;if(!e.id&&i)return!1;if(!e.id)return!1;var o=y();if(!o)return!1;var a=p(e.id,e.getAttribute("data-i13n")||e.getAttribute("data-ylk")),s=a.id,u=!1;if(o.isModuleTracked(s)?b(s)||e.classList.contains("wafer-rapid-tracked")?o.refreshModule(s):(o.removeModule(s),u=!0):u=!0,u){var l=a.sec?c({},s,a.sec):[s];o.addModulesWithViewability(l)}return e.classList.add("wafer-rapid-tracked"),!0},B=function(e,t){var r=t.get(e);if(!r)return!1;var n=r.instance,i=n._util.trigger;if(!e.id&&i)return!1;if(!e.id&&!i)return!1;var o=y();if(!o)return!1;var a=p(e.id,e.getAttribute("data-i13n")||e.getAttribute("data-ylk")),s=a.id;return o.isModuleTracked(s)&&o.removeModule(s),e.classList.remove("wafer-rapid-tracked"),!0},S=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.root,n=void 0===r?document:r,i=e.selector,o=void 0===i?".wafer-rapid-module":i;a(this,t);var u=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,{root:n,selector:o,props:{selector:o},WaferClass:M}));return y((document.body.getAttribute("data-wf-rapid")||"rapidInstance").split(".")),u.sync(),u}return u(t,e),C(t,[{key:"trigger",value:function(e){var t=this._state.elementInstances,r=t.get(e),n=r.instance;if(n){"scrollChange"===n._util.trigger&&(n._beaconTrigger(),n.destroy())}}},{key:"sync",value:function(e){if(R(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"sync",this).call(this,e),e){var r=this._state.elementInstances,n=I(e);if(n)return void W(n,r);var i=x(e.getElementsByClassName("wafer-rapid-module"));i.length>0&&Array.prototype.forEach.call(i,function(e){W(e,r)})}}},{key:"destroy",value:function(e){if(!e)return void R(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this);var r=this._state.elementInstances;e.classList.contains("wafer-rapid-module")&&B(e,r);var n=x(e.getElementsByClassName("wafer-rapid-module",r));n.length>0&&Array.prototype.forEach.call(n,function(e){B(e,r)}),R(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"destroy",this).call(this,e)}}]),t}(L),V=S;t.default=new V}})});