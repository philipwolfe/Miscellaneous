YUI.add("type_sda",function(a){a.namespace("My.Extensions.Sda");var m="#my-adsLREC2-config",b="#my-adsLREC2",p="#my-adsMAST",d="#sticky-lrec2-footer",g="fetch_selective_ad",r=window.DARLA||null,o="LREC2",k="LREC3",n="LREC4",h="MON2",f=false,j=1000,l="hlAdsAll",q="",e="2023538075",c=100;function i(){var s=this;YMedia.after("appletsinit",function(t){s.init();});}i.prototype.init=function(){var u=this;var t=a.one(m);if(!t){return;}var x=t.getData("config");if(!x){return;}try{lrec2PositionMeta=a.JSON.parse(x);}catch(w){return;}b="#my-ads"+lrec2PositionMeta.pos;this.container=a.one(b);this.streamRestoreState=false;if(!this.container||!r){return;}var v=a.one("body");var y=v&&!!v.one("#bbnavdetect");v.plug(a.Plugin.ScrollInfo);this.scrollInfo=v.scrollInfo;this.scrollevent=this.scrollInfo.on("scroll",a.bind(this.VisibleLREC2Ads,this,true),this);if(y){a.Global.on("stream:normal-load",function(){u.addAutoEvent();u.registerTabswitch();u.registerScrollRotate();u.VisibleLREC2Ads();u.fetchDarlaAd(false,true);});a.Global.on("stream:restore-state",function(){if(u.isNodeInViewport(b)){var z=true;u.fetchDarlaAd(z);}},u);}else{setTimeout(function(){u.addAutoEvent();u.registerTabswitch();u.registerScrollRotate();u.VisibleLREC2Ads();u.fetchDarlaAd(false,true);},300);}var s=t.getData("offset");c=s&&parseInt(s,10)||c;};i.prototype.isNodeInViewport=function(s){var t=this.scrollInfo.getOnscreenNodes(s,c);if(a.one("html").hasClass("Reader-open")&&!a.one("html").hasClass("Reader-closed")){return false;}return !t.isEmpty();},i.prototype.VisibleLREC2Ads=function(){if(this.isNodeInViewport(b)){this.fetchDarlaAd();if(this.scrollevent){this.scrollevent.detach();this.scrollevent=null;}}};i.prototype.registerTabswitch=function(){var z=this;var v=a.one(m);var u=v.getData("tabswitchrotate");u=u&&parseInt(u,10)||0;var w=u>0;if(!w){return;}var A=Date.now||function(){return new Date().getTime();};var y=A();var x=a.Af&&a.Af.PageViz&&a.Af.PageViz.isHidden()||false;function s(){if(!x){y=A();x=true;}}function t(){if(window.disableAdboost){return;}var C=A();if(C-y<u){return;}if(a.Af&&a.Af.PageViz&&a.Af.PageViz.isHidden()){x=true;return;}x=false;if(!window._darlaAutoEvt){window._darlaAutoEvt=z.getAutoEvent();}var E=[].concat(a.Object.keys(window._darlaAutoEvt.ps),"MON");var B=[];if(!window.DARLA||window.DARLA.inProgress()){return;}a.Array.each(E,function(G){if(B.indexOf(G)<0){var H=window.DARLA.posSettings(G);if(H){if(z.isNodeInViewport("#"+H.dest)){var F=a.one("#"+H.dest);if(F&&F.get("offsetHeight")>1){B.push(G);}}}}});if(B.length>0){var D={ps:B.join(","),name:"tabswitch",sp:window._darlaAutoEvt.sp,sa:window._darlaAutoEvt.sa+" "+(window.customSiteAttr||""),ssl:window._darlaAutoEvt.ssl,secure:window._darlaAutoEvt.secure,ref:window.location.href,npv:1,property:"fp",ult:window._darlaAutoEvt.ult,experience:window._darlaAutoEvt.experience};window.DARLA.add(D);window.DARLA.event("tabswitch");}}a.on("blur",s,window);a.on("focus",t,window);if(a.Af&&a.Af.PageViz){a.Af.PageViz.on("visible",t,z);a.Af.PageViz.on("hidden",s,z);}},i.prototype.registerScrollRotate=function(){var u=this;var t=a.one(m);var z=t.getData("scrollrotate");var w=t.getData("lrec2SelectiveEnabled")==="1",z=z&&parseInt(z,10)||0;var v=z>0;if(!v){return;}var s=0;var x=0;function y(){s++;if(s-x<z){return;}if(!window._darlaAutoEvt){window._darlaAutoEvt=u.getAutoEvent();}var B=w?["LREC3","LREC4","MON2"]:[];var D=[].concat(a.Object.keys(window._darlaAutoEvt.ps),["MON"],B);var A=[];if(!window.DARLA||window.DARLA.inProgress()){return;}a.Array.each(D,function(F){if(A.indexOf(F)<0){var G=window.DARLA.posSettings(F);if(G){if(u.isNodeInViewport("#"+G.dest)){var E=a.one("#"+G.dest);if(E&&E.get("offsetHeight")>1){A.push(F);}}}}});if(A.length>0){x=s;var C={ps:A.join(","),name:"scrollrotate",sp:window._darlaAutoEvt.sp,sa:window._darlaAutoEvt.sa+" "+(window.customSiteAttr||""),ssl:window._darlaAutoEvt.ssl,secure:window._darlaAutoEvt.secure,ref:window.location.href,npv:1,property:"fp",ult:window._darlaAutoEvt.ult,experience:window._darlaAutoEvt.experience};window.DARLA.add(C);window.DARLA.event("scrollrotate");}}window.sdaAvpCallback=y;},i.prototype.addAutoEvent=function(){var t=this;var s=a.one(m);var u=s.getData("autorotate")==="1";if(!u){return;}if(window.DARLA&&window.DARLA.inProgress()){setTimeout(function(){t.addAutoEvent();},500);}else{window._darlaAutoEvt=t.getAutoEvent();if(window.DARLA&&window._darlaAutoEvt){window.DARLA.add(window._darlaAutoEvt);}}},i.prototype.getAutoEvent=function(){var s={pg:{property:"fp",test:window.Af.context.bucket,intl:window.Af.context.region,rid:window.Af.context.rid,device:window.Af.context.device}},v='Y-BUCKET="'+window.Af.context.bucket+'"',E=(window.location.protocol==="http:")?0:1,B=a.one(m),L=B.getData("disablerotation")==="1",x=B.getData("lrec4enabled")==="1",F=B.getData("mon2Enabled")==="1",G=B.getData("autoeventrt"),t=B.getData("mastrt"),H=B.getData("lrecrt"),w=B.getData("ldrbrt"),K=B.getData("defaultrt"),D=B.getData("currentpos"),I={},z=B.getData("lrec2SelectiveEnabled")==="1",u,C="",A=e;if(window.facCustomTimout&&window.facCustomTimout>0){v+=" ctout="+window.facCustomTimout;}if(window.flSAKey&&"undefined"!==window.flInstalled){v+=" "+window.flSAKey+"="+window.flInstalled;}if(window.segBlob){var J="";var M="";for(var y in window.segBlob){if(window.segBlob.hasOwnProperty(y)){J+=M+y+":"+window.segBlob[y];M=";";}}v+=' rs="'+J+'"';}if(window.YAHOO&&window.YAHOO.i13n){C=window.YAHOO.i13n.currentSID||"";A=window.YAHOO.i13n.SPACEID||e;}if(!L){I[D]={autoIV:1,autoMax:25,autoRT:K};if(x){I.LREC4={autoIV:1,autoMax:25,autoRT:K};}if(F){I.MON2={autoIV:1,autoMax:25,autoRT:K};}}if(t&&a.Array.indexOf(window.pageloadNonCollapsedAds||[],"MAST")>=0){I.MAST={autoIV:1,autoMax:25,autoRT:t};}if(w&&a.Array.indexOf(window.pageloadNonCollapsedAds||[],"LDRB")>=0){I.LDRB={autoIV:1,autoMax:25,autoRT:w};}if(H&&a.Array.indexOf(window.pageloadNonCollapsedAds||[],"LREC")>=0){I.LREC={autoIV:1,autoMax:25,autoRT:H};}u={ps:I,name:"AUTO",sp:A,autoStart:1,autoMax:25,autoRT:G,autoIV:1,autoDDG:1,ssl:E,secure:1,ref:window.location.href,npv:1,property:"fp",ult:s,experience:{pt:"index",pd:"modal",rid:window.Af.context.rid,sid:C,bucket:window.Af.context.bucket}};if(bucketSAEnabled){u.sa=v;}return u;},i.prototype.fetchAdLater=function(v){var u=this;var s=0;var t=setInterval(function(){if(s>20){clearInterval(t);return;}if(!r.inProgress()){clearInterval(t);u.fetchDarlaAd(v);}s++;},500);},i.prototype.fetchDarlaAd=function(K,F){var N,P,G,s,ac,W,A=this,E,x=false,R=false,C=false,V=a.one(m),M=V.getData("config"),y=V.getData("lrec4pos")||"LREC4",O=V.getData("mon2pos")||"MON2",v=a.one("#my-adsLREC3")&&a.one("#my-adsLREC3").getData("config"),X=a.one("#my-ads"+y)&&a.one("#my-ads"+y).getData("config"),I=a.one("#my-ads"+O)&&a.one("#my-ads"+O).getData("config"),H={pos:"LREC2",clean:"my-adsLREC2",dest:"my-adsLREC2-iframe",metaSize:true,w:300,h:250,supports:false},w={pos:"LREC3",clean:"my-adsLREC3",dest:"my-adsLREC3-iframe",metaSize:true,w:300,h:250,supports:false},Y={pos:y,clean:"my-ads"+y,dest:"my-ads"+y+"-iframe",metaSize:true,w:300,h:250,supports:false},S={pos:O,clean:"my-ads"+O,dest:"my-ads"+O+"-iframe",metaSize:true,w:300,h:600,supports:false},D={pg:{property:"fp",test:window.Af.context.bucket,intl:window.Af.context.region,rid:window.Af.context.rid,device:window.Af.context.device}},T='Y-BUCKET="'+window.Af.context.bucket+'"',z=(window.location.protocol==="http:")?0:1,J,L=a.one(m).getData("lrec2SelectiveEnabled")==="1",t="",aa=e;ac=V.getData("autoeventrt");if(ac){ac=parseInt(ac,10);}if(window.facCustomTimout&&window.facCustomTimout>0){T+=" ctout="+window.facCustomTimout;}if(window.flSAKey&&"undefined"!==window.flInstalled){T+=" "+window.flSAKey+"="+window.flInstalled;}if(window.segBlob){var B="";var Q="";for(var ab in window.segBlob){if(window.segBlob.hasOwnProperty(ab)){B+=Q+ab+":"+window.segBlob[ab];Q=";";}}T+=' rs="'+B+'"';}if(window.YAHOO&&window.YAHOO.i13n){t=window.YAHOO.i13n.currentSID||"";aa=window.YAHOO.i13n.SPACEID||e;}if(M){H=a.JSON.parse(M);o=H.pos;}if(X){Y=a.JSON.parse(X);n=Y.pos;}if(I){S=a.JSON.parse(I);h=S.pos;}H.id=o;x=V.getData("autorotate")==="1";G=g+"_"+o.toLowerCase();C=V.getData("lrec4enabled")==="1";mon2Enabled=V.getData("mon2enabled")==="1";E=o;if(C){E=E+","+n;}if(mon2Enabled){E=E+","+h;}N={ps:E,name:G,sp:aa,ssl:z,secure:1,ref:window.location.href,npv:1,property:"fp",ult:D,experience:{pt:"index",pd:"modal",rid:window.Af.context.rid,sid:t,bucket:window.Af.context.bucket}};if(bucketSAEnabled){N.sa=T;}var Z=C?[Y,H]:[H];if(mon2Enabled){Z.push(S);}if(!F){if(r.inProgress()){var U=r.inProgress();if(U&&U===l){A.detachScroll=true;r.abort();r.add(N);r.addPos(Z);r.event(G);}else{this.fetchAdLater(K);return;}}else{if(L){A.detachScroll=true;r.add(N);r.addPos([Z]);r.event(G);}}}W=A.getAutoEvent();if(x){r.add(W);}if(!r.isAutoOn()){r.startAuto();}var u=function(){if(r.inProgress()){var ad=r.inProgress();if(ad&&ad===l){r.abort();}else{return;}}f=true;if(A.detachScroll&&A.scrollevent){A.scrollevent.detach();A.scrollevent=null;}if(x){r.add(W);if(!r.isAutoOn()){r.startAuto();}}q="";var af=false;var ae=document.getElementById("my-adsMON2");af=ae&&ae.className.indexOf("D-n")===-1;if(A.isNodeInViewport(d)){if((mon2Enabled&&!af)||!mon2Enabled){q=q?q+","+o:o;}if(mon2Enabled&&af){q=q?q+","+h:h;}else{if((C&&!af)||!mon2Enabled){q=q?q+","+n:n;}}}if(q){A.detachScroll=true;N.ps=q;r.add(N);r.event(G);}};a.Af.Event.on("modal:hide",u);};i.prototype.destructor=function(){};a.My.Extensions.Sda.init=new i();},"0.0.1",{requires:["node-scroll-info","json-parse"]});/* Copyright (c) 2019, Yahoo! Inc.  All rights reserved. */
