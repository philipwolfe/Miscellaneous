var localHeadingDownloadURL = "";

function includeHeading(title, url) {
	dw = new Function("x", "document.write(x)");	
	if (url != null)
		localHeadingDownloadURL = url;

	if (document.all != null) {
		dw('<style type="text/css">');
		dw('<!--');
		dw('#hdBox		{position: relative;');
		dw('			width: 300; height: 80; padding-left: 20px; padding-right: 50px;');
		dw('			border: 10 solid #eeeeee; background: white; margin-right: -55;}');
		dw('#hdCircle1	{position: relative; top:20; left: 0; width: 100; cursor: hand;');
		dw('			font-family: webdings; font-size: 80;');
		dw('			color: #eeeeee; margin-right: -90;}');
		dw('#hdCircle2	{position: relative; top: 10; left: 0; width: 80; cursor: hand;');
		dw('			font-family: webdings; font-size: 60;');
		dw('			color: white; margin-right: -52;}');
		dw('#hdTitle	{position: relative; top: 0; left: 0;');
		dw('			color: navy; font-family: arial black; font-size: 40px;');
		dw('			font-style: italic;}');
		
		dw('#hdDl		{position: relative; top: -12; left: 4;');
		dw('				filter: gray(); cursor: hand;}');
		dw('-->');
		dw('</style>');
		
		dw('<div style="text-align: center; margin: 20px; margin-left: 0; margin-right: 0; width: 500px;" nowrap>');
		dw('<span id="hdBox">');
		
		dw('<div id="hdTitle" nowrap>');
		
	// Title inserted here
		dw(title);
		
		dw('</div>');
		
		dw('</span>');
		
		
		dw('<span id="hdCircle1" onmouseover="headDownloadHigh()" onmouseout="headDownloadLow()" onclick="headDownload()">n</span>');
		dw('<span id="hdCircle2" onmouseover="headDownloadHigh()" onmouseout="headDownloadLow()" onclick="headDownload()">n</span>');
		dw('<img id="hdDl" onmouseover="headDownloadHigh()" onmouseout="headDownloadLow()" onclick="headDownload()"');
		dw(' src="http://webfx.eae.net/images/downloadicon.gif" width=16 height=16 border=0 alt="Download">');
		dw('</div>');
		
	// Include the custom Error Window
		dw('<script src="http://webfx.eae.net/error.js"></script>');
	}
	else {
		dw('<h1>' + title + '</h1>');
		if (localHeadingDownloadURL != "")
			dw('<p><a href="' + localHeadingDownloadURL + '">Download</a></p>');
	}
}

function headDownloadHigh() {
	hdCircle1.style.color ="navy";
	hdDl.style.filter ="";
	window.status = "Download this sample";
}
	
function headDownloadLow() {
	toEl = window.event.toElement;
	if (toEl == null || toEl.id != "hdCircle1" && toEl.id != "hdCircle2" && toEl.id != "hdDl") {
		hdCircle1.style.color ="#eeeeee";
		hdDl.style.filter ="gray()";
		window.status = "";
	}
}
//URL inserted here	
function headDownload() {
	if (localHeadingDownloadURL != "")
		window.open(localHeadingDownloadURL,'_top');
	else
		alert("There is currently no downloadable file for this page");
}
