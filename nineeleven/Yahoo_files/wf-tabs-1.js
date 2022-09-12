!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("wafer-tabs",[],e):"object"==typeof exports?exports["wafer-tabs"]=e():(t.wafer=t.wafer||{},t.wafer.wafers=t.wafer.wafers||{},t.wafer.wafers["wafer-tabs"]=e())}("undefined"!=typeof self?self:this,function(){return function(t){function e(o){if(a[o])return a[o].exports;var i=a[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var a={};return e.m=t,e.c=a,e.d=function(t,a,o){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="https://s.yimg.com/aaq/wf/",e(e.s="./src/entry.js")}({"./src/entry.js":function(t,e,a){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){var a=[],o=!0,i=!1,s=void 0;try{for(var r,n=t[Symbol.iterator]();!(o=(r=n.next()).done)&&(a.push(r.value),!e||a.length!==e);o=!0);}catch(t){i=!0,s=t}finally{try{!o&&n.return&&n.return()}finally{if(i)throw s}}return a}return function(e,a){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,a);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=function(){function t(t,e){for(var a=0;a<e.length;a++){var o=e[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,a,o){return a&&t(e.prototype,a),o&&t(e,o),e}}(),h=function t(e,a,o){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,a);if(void 0===i){var s=Object.getPrototypeOf(e);return null===s?void 0:t(s,a,o)}if("value"in i)return i.value;var r=i.get;if(void 0!==r)return r.call(o)},f=window.wafer,v=f.base,d=f.constants,b=f.utils,p=f.WaferBaseClass,m=b.bindEvent,g=b.clearTimeout,y=b.convertNodeListToArray,w=b.findAncestor,T=b.setTimeout,_=b.unbindEvent,O=d.ATTR_PREFIX,E=["handleTargetFocusIn","handleTargetFocusOut","handleTargetMouseLeave","handleTargetMouseOver","tabChange","tabClick","tabFocusIn","tabFocusOut","tabMouseLeave","tabMouseOver"],A=function(t){function e(t){o(this,e);for(var a,s=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,{},{})),r=t.getAttribute(O+"active-class")||"wafer-tab-active",n=t.getAttribute(O+"inactive-class"),u=Number(t.getAttribute(O+"scroll-restore"))||0,c=t.hasAttribute(O+"collapsable"),h=t.hasAttribute(O+"handle-hover"),f=t.hasAttribute(O+"handle-focus"),v=t.hasAttribute(O+"tabs-allowdefault"),d=Number(t.getAttribute(O+"auto-switch"))||0,b=Number(t.getAttribute(O+"auto-switch-timeout"))||2e3,p=Number(t.getAttribute(O+"active-index"))||(c?null:0),m=w(t,t.getAttribute(O+"boundary"))||document.body,g=t.getAttribute(O+"target"),T=[],_=0,A=t.getElementsByClassName("tab");a=A[_];++_)T.push({tabElem:a,hasTrigger:"tabActivate"===a.getAttribute(O+"trigger")});var S=y(m.getElementsByClassName(g)),C=l(S,1),k=C[0],F=k&&k.children,j=s._util={activeClass:r,autoSwitchTimeout:b,elem:t,inactiveClass:n,isCollapsable:c,shouldAllowDefault:v,shouldAutoSwitch:d,shouldHandleFocus:f,shouldHandleHover:h,shouldScrollRestore:u,tabsElems:T,targetElem:k,targetElems:F&&y(F)};if(s._state={activeIndex:0,activeTabElem:null},u&&(s._state.scrollPositions=s._state.scrollPositions||{},s._util.tabsElems.forEach(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=(t.tabElem,arguments[1]);s._state.scrollPositions[e]={top:window.pageYOffset||document.documentElement.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft}})),null!==p){s._state.activeIndex=p;var L=j.tabsElems[p];L&&s.activateTab(L.tabElem,!0)}return E.forEach(function(t){s[t]=s[t].bind(s)}),d&&s.setTimeoutForTabChange(),s.addEventListeners(),s}return s(e,t),c(e,[{key:"addEventListeners",value:function(){var t=this._util,a=t.shouldAutoSwitch,o=t.targetElem;a&&(m(o,"focusin",this.handleTargetFocusIn,{passive:!1}),m(o,"focusout",this.handleTargetFocusOut,{passive:!1}),m(o,"mouseleave",this.handleTargetMouseLeave,{passive:!1}),m(o,"mouseover",this.handleTargetMouseOver,{passive:!1})),h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"addEventListeners",this).call(this)}},{key:"removeEventListeners",value:function(){var t=this._util,a=t.shouldAutoSwitch,o=t.targetElem;a&&(_(o,"focusin",this.handleTargetFocusIn,{passive:!1}),_(o,"focusout",this.handleTargetFocusOut,{passive:!1}),_(o,"mouseleave",this.handleTargetMouseLeave,{passive:!1}),_(o,"mouseover",this.handleTargetMouseOver,{passive:!1})),h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"removeEventListeners",this).call(this)}},{key:"setTimeoutForTabChange",value:function(){var t=this,e=this._util.autoSwitchTimeout;this.pauseSwitching(),this._util.switchTabTimeout=T(function(){t.switchToNextTab(),t.setTimeoutForTabChange()},e,this)}},{key:"switchToNextTab",value:function(){var t=this._util.tabsElems,e=this._state.activeIndex;e===t.length-1?this.activateTab(t[0].tabElem,!0):this.activateTab(t[e+1].tabElem,!0)}},{key:"pauseSwitching",value:function(){this._util.switchTabTimeout&&g(this._util.switchTabTimeout,this)}},{key:"activateTab",value:function(t){var e=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=this._state.activeTabElem;if(!a&&t===o)return void t.classList.add("active");var i=this._util,s=i.activeClass,r=i.elem,n=i.inactiveClass,u=i.shouldAutoSwitch,l=i.shouldScrollRestore,c=i.tabsElems,h=i.targetElems,f=this._state.activeIndex;u&&this.pauseSwitching(),l&&(this._state.scrollPositions[f]={top:window.pageYOffset||document.documentElement.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft}),c.forEach(function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=a.tabElem,i=a.hasTrigger,u=arguments[1],c=h&&h[u];if(o===t){if(o.classList.add("active"),o.setAttribute("aria-selected",!0),e._state.activeIndex=u,e._state.activeTabElem=o,c){if(l){var f=e._state||{},d=f.scrollPositions,b=void 0===d?{}:d,p=b[u]||{},m=p.top,g=p.left;T(function(){window.scrollTo(g,m)},2)}n&&c.classList.remove(n),c.classList.add(s),c.setAttribute("aria-hidden",!1),v.sync(c),v.syncUI(c),i&&v.trigger(o),v.emitWaferEvent("tab:selected",{elem:r,meta:{targetElem:c}})}}else o.classList.remove("active"),o.setAttribute("aria-selected",!1),c&&(c.classList.remove(s),n&&c.classList.add(n),c.setAttribute("aria-hidden",!0))})}},{key:"deactivateTab",value:function(t){var e=this,a=this._util,o=a.activeClass,i=a.inactiveClass,s=a.tabsElems,r=a.targetElems;s.some(function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},s=a.tabElem,n=arguments[1],u=r&&r[n];if(s===t)return s.classList.remove("active"),s.setAttribute("aria-selected",!1),u&&(u.classList.remove(o),i&&u.classList.add(i),u.setAttribute("aria-hidden",!0)),e._state.activeIndex=0,!0})}},{key:"tabClick",value:function(t){!this._util.shouldAllowDefault&&t.preventDefault(),this.activateTab(t.eventTarget)}},{key:"handleTargetFocusIn",value:function(t){this._util.shouldAutoSwitch&&this.pauseSwitching()}},{key:"tabFocusIn",value:function(t){var e=this._util,a=e.shouldHandleFocus,o=e.focusOutTimeout;a&&(o&&g(o,this),this.activateTab(t.currentTarget))}},{key:"handleTargetFocusOut",value:function(t){this._util.shouldAutoSwitch&&this.setTimeoutForTabChange()}},{key:"tabFocusOut",value:function(t){var e=this,a=this._util.shouldHandleFocus,o=t.currentTarget;a&&(this._util.focusOutTimeout=T(function(){e.deactivateTab(o)},1,this))}},{key:"handleTargetMouseOver",value:function(t){this._util.shouldAutoSwitch&&this.pauseSwitching()}},{key:"tabMouseOver",value:function(t){var e=this._util,a=e.shouldAutoSwitch,o=e.shouldHandleHover;a&&this.pauseSwitching(),o&&this.activateTab(t.currentTarget)}},{key:"handleTargetMouseLeave",value:function(t){this._util.shouldAutoSwitch&&this.setTimeoutForTabChange()}},{key:"tabMouseLeave",value:function(t){var e=this._util,a=e.shouldAutoSwitch,o=e.shouldHandleHover;a&&this.setTimeoutForTabChange(),o&&this.deactivateTab(t.currentTarget)}},{key:"mouseover",value:function(){this._util.shouldAutoSwitch&&this.pauseSwitching()}},{key:"mouseleave",value:function(){this._util.shouldAutoSwitch&&this.setTimeoutForTabChange()}},{key:"tabChange",value:function(t){t.preventDefault();var e=t.eventTarget.selectedIndex||0;this.activateTab(t.eventTarget.options[e])}},{key:"destroy",value:function(){this.pauseSwitching(),this.removeEventListeners(),h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"destroy",this).call(this)}},{key:"config",get:function(){return{shouldAutoSwitch:this._util.shouldAutoSwitch}}}]),e}(p);A.events={change:[["tabs","tabChange"]],click:[["tab","tabClick"]],focusin:[["tab","tabFocusIn"]],focusout:[["tab","tabFocusOut"]],mouseleave:[["tab","tabMouseLeave"],["_self","mouseleave"]],mouseover:[["tab","tabMouseOver"],["_self","mouseover"]]};var S=A,C=function(){function t(t,e){for(var a=0;a<e.length;a++){var o=e[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,a,o){return a&&t(e.prototype,a),o&&t(e,o),e}}(),k=window.wafer.controllers.WaferBaseController,F=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=t.root,o=void 0===a?document:a,i=t.selector,s=void 0===i?".wafer-tabs":i;r(this,e);var u=n(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,{root:o,selector:s,WaferClass:S}));return u.sync(),u}return u(e,t),C(e,[{key:"handleVisibilityChange",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=this._state.elementInstances,a=!0,o=!1,i=void 0;try{for(var s,r=e.values()[Symbol.iterator]();!(a=(s=r.next()).done);a=!0){var n=s.value,u=n.instance;u.config.shouldAutoSwitch&&(t?u.setTimeoutForTabChange():u.pauseSwitching())}}catch(t){o=!0,i=t}finally{try{!a&&r.return&&r.return()}finally{if(o)throw i}}}}]),e}(k),j=F;e.default=new j({selector:".wafer-tabs"})}})});