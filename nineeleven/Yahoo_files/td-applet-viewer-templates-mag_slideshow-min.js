YUI.add("td-applet-viewer-templates-mag_slideshow",function(t,e){dust.cache=dust.cache||{},dust.cache[e]=function(t){function e(t,e){return t.h("eq",e,{block:n},{key:g,value:"true"}).w("\n")}function n(t,e){return t.w("\n").h("if",e,{block:s},{cond:w}).w("\n")}function s(t,e){return t.w("\n").x(e.get(["magazineSlideshow"],!1),e,{"else":d,block:u},{}).w("\n")}function d(t,e){return t.w('\n<div class="Mend-neg-20 Mstart-neg-20 Ta-c Py-10 My-20 C-w" style="background-color:#0078ff">\n                <a class="Fz-l C-w Fw-200" style="0 1px 1px rgba(0,0,0,.26)" ').x(e.get(["rdSigLink"],!1),e,{"else":i,block:a},{}).w(">").h("i18n_string",e,{},{_key:"CLICK_FOR_PHOTOS"}).w("</a>\n            </div>\n        ")}function i(t,e){return t.w('href="').f(e.get(["link"],!1),e,"h").w('"')}function a(t,e){return t.w('href="').f(e.get(["rdSigLink"],!1),e,"h").w('" data-orig-link="').f(e.get(["link"],!1),e,"h").w('"')}function u(t,e){return t.w('\n<div class="magazine-slideshow Mstart-neg-20 Mend-neg-20">\n                <ul class="Reset">\n                    ').s(e.get(["magazineSlideshow"],!1),e,{block:c},{}).w("\n</ul>\n            </div>\n        ")}function c(t,e){return t.w('\n<li class="Bd-t Py-10">\n                            ').x(e.get(["title"],!1),e,{block:o},{}).w("\n").x(e.get(["description"],!1),e,{block:r},{}).w('\n<div class="RatioWrap Bgc-x My-20" style="padding-bottom:').f(e.get(["ratio"],!1),e,"h").w('%;">\n                                ').h("img",e,{},{src:l,alt:_,"class":"RatioBox"}).w("\n</div>\n                        </li>\n                    ")}function o(t,e){return t.w('\n<span class="Fw-b M-10 Fz-2xl D-ib Lh-12">').f(e.get(["title"],!1),e,"h",["s"]).w("</span>\n                            ")}function r(t,e){return t.w('\n<div class="M-10">').f(e.get(["description"],!1),e,"h",["s"]).w("</div>\n                            ")}function l(t,e){return t.f(e.get(["url"],!1),e,"h")}function _(t,e){return t.f(e.get(["title"],!1),e,"h")}function w(t,e){return t.w("'").f(e.get(["magazine_content_type"],!1),e,"h").w("' === 'ARTICLESET' || '").f(e.get(["magazine_content_type"],!1),e,"h").w("' === 'PHOTOSET'")}function g(t,e){return t.f(e.get(["is_magazine"],!1),e,"h")}return dust.register("td-applet-viewer-templates-mag_slideshow",e),e.__dustBody=!0,n.__dustBody=!0,s.__dustBody=!0,d.__dustBody=!0,i.__dustBody=!0,a.__dustBody=!0,u.__dustBody=!0,c.__dustBody=!0,o.__dustBody=!0,r.__dustBody=!0,l.__dustBody=!0,_.__dustBody=!0,w.__dustBody=!0,g.__dustBody=!0,e}(),dust.cache["td-applet-viewer:mag_slideshow.dust"]=dust.cache["td-applet-viewer:mag_slideshow"]=dust.cache[e],t.Template._cache=t.Template._cache||{},t.Template._cache["td-applet-viewer/templates/mag_slideshow"]=function(t,n){t=t||{},dust.render(e,t,n)}},"@VERSION@",{requires:["template-base","dust"]});