YUI.add("td-applet-viewer-templates-yapnativead",function(t,e){dust.cache=dust.cache||{},dust.cache[e]=function(t){function e(t,e){return t.x(e.get(["item"],!1),e,{block:a},{}).w("\n")}function a(t,e){return t.w('\n<div class="Mb-20 Mx-a Ta-start" style="width:300px">\n    <div class="Lh-14 Va-m Mt-4" style="color: #9d9d9d;">\n        <span class="Fw-b Fz-xs">').h("i18n_string",e,{},{_key:"SPONSORED"}).w('</span>\n        <a href="').f(e.get(["adChoicesUrl"],!1),e,"h").w('" target="_blank" class="Mstart-6 D-ib">\n            <i class="Dimmed Icon Fz-s">&#xe080;</i>\n        </a>\n    </div>\n    <a href="').f(e.getPath(!1,["item","tag","clickUrl"]),e,"h").w('" class="D-b" target="_blank" rel="nofollow">\n        <div class="Mb-8 Lh-12 Fz-m Fw-b">').f(e.getPath(!1,["item","tag","headline"]),e,"h",["s"]).w('</div>\n        <div class="Pos-r">\n            <img src="').f(e.getPath(!1,["item","tag","image","url"]),e,"h").w('" width="300px" height="156px"/>\n        </div>\n    </a>\n    <span class="D-ib Mt-6 Fz-s">').f(e.getPath(!1,["item","tag","source"]),e,"h").w("</span>\n</div>\n")}return dust.register("td-applet-viewer-templates-yapnativead",e),e.__dustBody=!0,a.__dustBody=!0,e}(),dust.cache["td-applet-viewer:yapnativead.dust"]=dust.cache["td-applet-viewer:yapnativead"]=dust.cache[e],t.Template._cache=t.Template._cache||{},t.Template._cache["td-applet-viewer/templates/yapnativead"]=function(t,a){t=t||{},dust.render(e,t,a)}},"@VERSION@",{requires:["template-base","dust"]});