YUI.add("td-applet-viewer-templates-footer",function(e,t){dust.cache=dust.cache||{},dust.cache[t]=function(e){function t(e,t){return e.w("<div>\n").x(t.get(["hosted"],!1),t,{block:n},{}).w("\n").x(t.getPath(!1,["ui","footer"]),t,{block:a},{}).w("\n</div>\n")}function n(e,t){return e.w("\n").h("eq",t,{block:d},{key:c,value:"smartphone"}).w("\n")}function d(e,t){return e.w('\n<div id="hl-ad-LREC" class="Ta-c My-20 W-100">\n            <div id="hl-ad-LREC-9-').f(t.get(["pageIndex"],!1),t,"h").w('-iframe" class="hl-display-ads"></div>\n        </div>\n    ')}function c(e,t){return e.f(t.getPath(!1,["context","device"]),t,"h")}function a(e,t){return e.w("\n").x(t.get(["comScoreMeta"],!1),t,{block:o},{}).w("\n")}function o(e,t){return e.w("\n").x(t.get(["hosted"],!1),t,{block:r},{}).w("\n")}function r(e,t){return e.w('\n<div class="comScore Py-10 Mt-20 Bdy-1 Cl-b" style="background:#fafafa;color:rgba(0,0,0,.54);">\n    <span class="Fz-xs Mx-4 D-b Ta-c">').f(t.get(["comScoreMeta"],!1),t,"h").w("</span>\n</div>\n")}return dust.register("td-applet-viewer-templates-footer",t),t.__dustBody=!0,n.__dustBody=!0,d.__dustBody=!0,c.__dustBody=!0,a.__dustBody=!0,o.__dustBody=!0,r.__dustBody=!0,t}(),dust.cache["td-applet-viewer:footer.dust"]=dust.cache["td-applet-viewer:footer"]=dust.cache[t],e.Template._cache=e.Template._cache||{},e.Template._cache["td-applet-viewer/templates/footer"]=function(e,n){e=e||{},dust.render(t,e,n)}},"@VERSION@",{requires:["template-base","dust"]});