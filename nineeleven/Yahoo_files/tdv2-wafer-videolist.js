"use strict";window.YUI&&YUI().use("node-base",function(e){e.Global.on("ymediaReady",function(e){YMedia=e.e,window.wafer.ready(function(){window.wafer.on("fetch:success",function(e){var i=e.elem;if("videolist-wafer"===i.id){var n=i.querySelectorAll("script.videoListJs")[0],t=n&&n.innerText;if(t)try{t=JSON.parse(t);var a=YMedia.Af.Event.fire;a&&a("content:init",t)}catch(e){}}})})})});