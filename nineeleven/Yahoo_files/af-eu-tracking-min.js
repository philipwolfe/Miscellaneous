YUI.add("af-eu-tracking",function(n,o){"use strict";n.namespace("Af").EuTracking={agof:function(o){var e={},a=o&&o.spaceid||"";a&&n.Media.Agof&&n.Media.Agof.beacon&&(e={st:o&&o.domain||"mobyahoo",co:o&&o.comment||"kommentar",cp:a},n.Media.Agof.beacon(e))},whap:function(o){var e,a=o&&o.serial||"800000206964",c=o&&o.channel||"",t=o&&o.brand||"",r=encodeURIComponent(document.referrer);e=window.location.protocol+"//w.estat.com/m/web/"+a+"?n="+Math.round(1e9*Math.random())+"&type=whap&v=0.09&r="+r,c&&(e+="&chn="+encodeURIComponent(c)),t&&(e+="&brnd="+encodeURIComponent(t)),n.Af.Beacon.send(e)}}},"@VERSION@",{requires:["af-beacon","media-agof-tracking"]});