YUI.add("td-applet-viewer-templates-video",function(t,n){dust.cache=dust.cache||{},dust.cache[n]=function(t){function n(t,n){return t.w('<meta itemprop="datePublished" content="').f(n.get(["publicationDate"],!1),n,"h").w('"/>\n<meta itemprop="headline" content="').f(n.get(["title"],!1),n,"h",["s"]).w('"/>\n<meta itemprop="description" content="').f(n.get(["summary"],!1),n,"h",["s"]).w('"/>\n\n').h("select",n,{block:e},{key:C}).w("\n")}function e(t,n){return t.w("\n").h("eq",n,{block:o},{value:"desktop"}).w("\n\n    ").h("default",n,{block:w},{}).w("\n")}function o(t,n){return t.w('\n<div class="content-modal').x(n.getPath(!1,["cover_photo","img"]),n,{block:i},{}).w('" id="content-modal-').f(n.get(["pageIndex"],!1),n,"h").w('">\n            ').nx(n.get(["isVideoLeadItem"],!1),n,{block:a},{}).w('\n\n            <div class="body-wrapper').x(n.get(["collapseBody"],!1),n,{block:d},{}).w('">\n                ').x(n.getPath(!1,["ui","leadModal"]),n,{block:s},{}).w("\n").nx(n.get(["isVideoLeadItem"],!1),n,{block:c},{}).w("\n").p("content_body_mega",n,{}).w("\n</div>\n\n            ").x(n.get(["collapseBody"],!1),n,{block:r},{}).w("\n").x(n.getPath(!1,["ui","comments","enabled"]),n,{block:u},{}).w("\n</div>\n        ").nx(n.getPath(!1,["ui","singleRightRail"]),n,{block:p},{}).w("\n")}function i(t,n){return t.w(" With-Cover")}function a(t,n){return t.w("\n").p("header",n,{}).w("\n")}function d(t,n){return t.w(" D-n")}function s(t,n){return t.w("\n").p("share_btns_lead_mega",n,{}).w("\n")}function c(t,n){return t.w('\n<div class="Ratio-16-9 Mb-10">\n                        <div class ="js-video-placeholder RatioBox Bgc-n ').nx(n.getPath(!1,["ui","enableModalVideoDockingAlignRightRail"]),n,{block:l},{}).w('" data-yepConfig="').f(n.get(["yepConfig"],!1),n,"h",["js"]).w('"></div>\n                    </div>\n                ')}function l(t,n){return t.w("Z-5")}function r(t,n){return t.w('<button class="js-viewer-view-article C-n Fw-b Cur-p Px-0 Bd-0 Fz-m" data-index="').f(n.get(["pageIndex"],!1),n,"h").w('" ').h("rapid_data_attr",n,{},{itc:"1"}).w(">").h("i18n_string",n,{},{_key:"READ_FULL_ARTICLE"}).w('<span class="Mstart-6 D-ib arraw Mb-2"></span></button>')}function u(t,n){return t.w(' <div class="js-comments-container C-news-links"></div> ')}function p(t,n){return t.w("\n").p("modal_aside_mega",n,{}).w("\n")}function w(t,n){return t.w("\n").p("header_ads",n,{}).w("\n").x(n.get(["yepConfig"],!1),n,{block:v},{}).w("\n").h("ne",n,{block:x},{key:R,value:"off"}).w("\n")}function v(t,n){return t.w('\n<div class="Ratio-').x(n.get(["aspectRatioClass"],!1),n,{"else":_,block:g},{}).w(" ").x(n.get(["isVertical"],!1),n,{block:b},{}).w('" ').x(n.get(["isVertical"],!1),n,{block:h},{}).w('>\n            <div class="js-video-placeholder RatioBox Bgc-n" data-yepConfig="').f(n.get(["yepConfig"],!1),n,"h",["js"]).w('">').x(n.get(["isVertical"],!1),n,{block:f},{}).w("</div>\n            ").x(n.get(["isVertical"],!1),n,{block:m},{}).w("\n</div>\n        ")}function _(t,n){return t.w("16-9")}function g(t,n){return t.f(n.get(["aspectRatioClass"],!1),n,"h")}function b(t,n){return t.w("vv-box")}function h(t,n){return t.x(n.get(["id"],!1),n,{block:y},{})}function y(t,n){return t.w('data-vvid="').f(n.get(["id"],!1),n,"h").w('"')}function f(t,n){return t.w('<div class="vv-player W-100 H-100"></div>')}function m(t,n){return t.w('\n<div class="Pos-a thumbnail-placeholder W-100 H-100">\n                    ').x(n.get(["thumbnail"],!1),n,{block:B},{}).w('\n<div class="yvp-loading-screen">\n                        <div class="yvp-loading-spinner yvp-spinner-icon V-v"></div>\n                    </div>\n                </div>\n                <div class="tap-overlay">\n                    <div class="tap-btn right-tap-btn disabled">\n                        <div class="circle"></div>\n                        <div class="double-arrow">\n                            <svg viewBox="0,0,44,44">\n                                <polygon class="arrow" points="14,16.2, 24,22, 14,27.7"></polygon>\n                                <polygon class="arrow" points="24,16.2, 34,22, 24,27.7"></polygon>\n                            </svg>\n                        </div>\n                    </div>\n                    <div class="tap-btn left-tap-btn">\n                        <div class="circle"></div>\n                        <div class="double-arrow">\n                            <svg viewBox="0,0,44,44">\n                                <polygon class="arrow" points="20,16.2, 20,27.7, 10,22"></polygon>\n                                <polygon class="arrow" points="30,16.2, 30,27.7, 20,22"></polygon>\n                            </svg>\n                        </div>\n                    </div>\n                    <div class="bottom-controls">\n                        <div class="read-handle">').h("i18n_string",n,{},{_key:"READ_VV_ARTICLE"}).w("</div>\n                        ").x(n.getPath(!1,["ui","enableVerticalVideoSocial"]),n,{block:k},{}).w("\n</div>\n                </div>\n            ")}function B(t,n){return t.w('\n<img src="').f(n.get(["thumbnail"],!1),n,"h").w('" class="H-100 D-b Mx-a"/>\n                    ')}function k(t,n){return t.w('\n<div class="social-buttons enabled">\n                                <button class="social-button comments">\n                                    <i class="Icon-Fp2 IconComments"></i>\n                                    <span class="count"></span>\n                                </button>\n                                <button class="social-button share">\n                                    <i class="share-icon"></i>\n                                    <i class="close-icon"></i>\n                                </button>\n                            </div>\n                        ')}function x(t,n){return t.w('\n<div class="Whs-n ResetChildren">\n                ').p("header",n,{}).w("\n</div>\n            ").p("content_body",n,{}).w("\n")}function R(t,n){
return t.f(n.get(["description"],!1),n,"h")}function C(t,n){return t.f(n.getPath(!1,["context","device"]),n,"h")}return dust.register("td-applet-viewer-templates-video",n),n.__dustBody=!0,e.__dustBody=!0,o.__dustBody=!0,i.__dustBody=!0,a.__dustBody=!0,d.__dustBody=!0,s.__dustBody=!0,c.__dustBody=!0,l.__dustBody=!0,r.__dustBody=!0,u.__dustBody=!0,p.__dustBody=!0,w.__dustBody=!0,v.__dustBody=!0,_.__dustBody=!0,g.__dustBody=!0,b.__dustBody=!0,h.__dustBody=!0,y.__dustBody=!0,f.__dustBody=!0,m.__dustBody=!0,B.__dustBody=!0,k.__dustBody=!0,x.__dustBody=!0,R.__dustBody=!0,C.__dustBody=!0,n}(),dust.cache["td-applet-viewer:video.dust"]=dust.cache["td-applet-viewer:video"]=dust.cache[n],t.Template._cache=t.Template._cache||{},t.Template._cache["td-applet-viewer/templates/video"]=function(t,e){t=t||{},dust.render(n,t,e)}},"@VERSION@",{requires:["template-base","dust","td-applet-viewer-templates-header","td-applet-viewer-templates-share_btns_lead_mega","td-applet-viewer-templates-content_body_mega","td-applet-viewer-templates-modal_aside_mega","td-applet-viewer-templates-header_ads","td-applet-viewer-templates-content_body"]});