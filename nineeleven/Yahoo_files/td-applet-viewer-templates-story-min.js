YUI.add("td-applet-viewer-templates-story",function(t,e){dust.cache=dust.cache||{},dust.cache[e]=function(t){function e(t,e){return t.w('<meta itemprop="datePublished" content="').f(e.get(["publicationDate"],!1),e,"h").w('"/>\n<meta itemprop="headline" content="').f(e.get(["title"],!1),e,"h",["s"]).w('"/>\n').x(e.getPath(!1,["cover_photo","img"]),e,{block:n},{}).w('\n<meta itemprop="description" content="').f(e.get(["summary"],!1),e,"h",["s"]).w('"/>\n\n').h("select",e,{block:o},{key:y}).w("\n")}function n(t,e){return t.w('<meta itemprop="image" content="').f(e.getPath(!1,["cover_photo","img","src"]),e,"h").w('"/>')}function o(t,e){return t.w("\n").h("eq",e,{block:a},{value:"desktop"}).w("\n\n    ").h("default",e,{block:f},{}).w("\n")}function a(t,e){return t.w('\n<div class="content-modal').x(e.getPath(!1,["cover_photo","img"]),e,{block:d},{}).w('" id="content-modal-').f(e.get(["pageIndex"],!1),e,"h").w('">\n            ').p("header",e,{}).w('\n<div class="body-wrapper').x(e.get(["collapseBody"],!1),e,{block:i},{}).w('">\n                ').x(e.getPath(!1,["ui","leadModal"]),e,{block:r},{}).w("\n").x(e.get(["lead_video"],!1),e,{block:c},{}).w("\n").p("content_body_mega",e,{}).w("\n</div>\n            ").x(e.get(["collapseBody"],!1),e,{block:u},{}).w("\n").x(e.get(["promoConfig"],!1),e,{block:p},{}).w("\n").x(e.getPath(!1,["ui","comments","enabled"]),e,{block:h},{}).w("\n").x(e.getPath(!1,["ui","trending","enabled"]),e,{block:g},{}).w("\n</div>\n        ").nx(e.getPath(!1,["ui","singleRightRail"]),e,{block:m},{}).w("\n")}function d(t,e){return t.w("  With-Cover ").f(e.getPath(!1,["cover_photo","img","className"]),e,"h")}function i(t,e){return t.w(" D-n")}function r(t,e){return t.w("\n").p("share_btns_lead_mega",e,{}).w("\n")}function c(t,e){return t.w("\n").x(e.getPath(!1,["lead_video","yepConfig"]),e,{block:s},{}).w("\n")}function s(t,e){return t.w('\n<div class="Ratio-16-9 Mb-10">\n                            <div class ="js-video-placeholder RatioBox Bgc-n ').nx(e.getPath(!1,["ui","enableModalVideoDockingAlignRightRail"]),e,{block:l},{}).w('" data-yepConfig="').f(e.getPath(!1,["lead_video","yepConfig"]),e,"h",["js"]).w('"></div>\n                        </div>\n                    ')}function l(t,e){return t.w("Z-5")}function u(t,e){return t.w('<button class="js-viewer-view-article C-n Fw-b Cur-p Px-0 Bd-0 Fz-m" data-index="').f(e.get(["pageIndex"],!1),e,"h").w('" ').h("rapid_data_attr",e,{},{itc:"1"}).w(' data-ylk="itc:1">').h("i18n_string",e,{},{_key:"READ_FULL_ARTICLE"}).w('<span class="Mstart-6 D-ib arraw Mb-2"></span></button>')}function p(t,e){return t.w('\n<div class="js-promo-container My-10">\n                    <a href="').f(e.getPath(!1,["promoConfig","url"]),e,"h").w('">\n                        ').h("img",e,{},{src:_,alt:w}).w("\n</a>\n                </div>\n            ")}function _(t,e){return t.f(e.getPath(!1,["promoConfig","image"]),e,"h")}function w(t,e){return t.f(e.getPath(!1,["promoConfig","title"]),e,"h")}function h(t,e){return t.w(' <div class="js-comments-container C-news-links"></div> ')}function g(t,e){return t.w(' <div class="My-20 js-trending-container"></div> ')}function m(t,e){return t.w("\n").p("modal_aside_mega",e,{}).w("\n")}function f(t,e){return t.w("\n").p("story_cover",e,{}).w("\n\n        ").p("content_body",e,{}).w("\n")}function y(t,e){return t.f(e.getPath(!1,["context","device"]),e,"h")}return dust.register("td-applet-viewer-templates-story",e),e.__dustBody=!0,n.__dustBody=!0,o.__dustBody=!0,a.__dustBody=!0,d.__dustBody=!0,i.__dustBody=!0,r.__dustBody=!0,c.__dustBody=!0,s.__dustBody=!0,l.__dustBody=!0,u.__dustBody=!0,p.__dustBody=!0,_.__dustBody=!0,w.__dustBody=!0,h.__dustBody=!0,g.__dustBody=!0,m.__dustBody=!0,f.__dustBody=!0,y.__dustBody=!0,e}(),dust.cache["td-applet-viewer:story.dust"]=dust.cache["td-applet-viewer:story"]=dust.cache[e],t.Template._cache=t.Template._cache||{},t.Template._cache["td-applet-viewer/templates/story"]=function(t,n){t=t||{},dust.render(e,t,n)}},"@VERSION@",{requires:["template-base","dust","td-applet-viewer-templates-header","td-applet-viewer-templates-share_btns_lead_mega","td-applet-viewer-templates-content_body_mega","td-applet-viewer-templates-modal_aside_mega","td-applet-viewer-templates-story_cover","td-applet-viewer-templates-content_body"]});