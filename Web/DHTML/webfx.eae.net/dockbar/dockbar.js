
var floatWidth = 200;
var floatHeight = 24;	// extra 4 for the border
var snapHorizSize = 50;
var snapVertSize = 20;
var horizDockWidth = 50;	// When docked to the left or right
var vertDockHeight = 20;
var toolbarPos = "top";	// Start at this position


// The following three are global, don't edit
var errorInSetup = false;
var dragging = false;
var tx;
var ty;

var ie4 = document.all != null;;
var ie5 = document.all != null && document.getElementsByTagName != null;

/////////////////////////////////////////////////////////////////////////////
// Set up the event handlers
if	(ie5) {	// IE5 way of setting up event handlers is way too good to ignore
	window.attachEvent("onload", fixSize);
	window.attachEvent("onresize", fixSize);
	document.attachEvent("onmousedown", dockBarOnMouseDown);
	document.attachEvent("onmouseup", dockBarOnMouseUp);
	document.attachEvent("onmousemove", dockBarOnMouseMove);
}
else if (ie4) {
	window.onload=fixSize;
	window.onresize=fixSize;
	document.onmousedown = dockBarOnMouseDown;
	document.onmouseup = dockBarOnMouseUp;
	document.onmousemove = dockBarOnMouseMove;
}

// Set up the CSS
if (ie4 || ie5) {
document.styleSheets[0].addRule("#handle", "border-left: 1 solid buttonhighlight; border-right: 1 solid buttonshadow; border-top: 1 solid buttonhighlight; border-bottom: 1 solid buttonshadow;" +
								"padding: 0; margin: 1; cursor: move; width: 3; height: 18; overflow: hidden;");
document.styleSheets[0].addRule("#toolbar", "cursor: default; position: absolute; top: 0; left: 0; background: buttonface; border: 0;" +
								"height: 20; width: 100%; padding: 0px;	overflow: hidden;");
document.styleSheets[0].addRule("#contentDiv","position: absolute; overflow:auto; z-index: -1; height: 100%; width:100%; border: 2 inset white;");
document.styleSheets[0].addRule("body", "margin: 0; border: 0; overflow: hidden;");
}

function fixSize() {
	if (toolbar == null || handle == null || contentDiv == null || !(ie4 || ie5)) {
		if (!errorInSetup)
			alert("The setup of this page is not correct for this script to work. Contact the author of the page.");
		errorInSetup = true;
		return;
	}
	
	switch (toolbarPos) {
		case"top":
		toolbar.style.border = "0 solid buttonface";
		toolbar.style.width = "100%";
		toolbar.style.height = vertDockHeight;
		toolbar.style.top = 0;
		toolbar.style.left = 0;
		
		contentDiv.style.top = vertDockHeight;
		contentDiv.style.left = 0;
		contentDiv.style.height = document.body.clientHeight - vertDockHeight;
		contentDiv.style.width = "100%";

		handle.style.height = vertDockHeight - 2;
		handle.style.width = 3;
		break;
	
		case "bottom":
		toolbar.style.border = "0 solid buttonface";
		toolbar.style.width = "100%";
		toolbar.style.height = vertDockHeight;
		toolbar.style.top = document.body.clientHeight - vertDockHeight;
		toolbar.style.left = 0;
	
		contentDiv.style.top = 0;
		contentDiv.style.left = 0;
		contentDiv.style.height = document.body.clientHeight - vertDockHeight;
		contentDiv.style.width = "100%";

		handle.style.height = vertDockHeight - 2;
		handle.style.width = 3;
		break;
	
		case "left":
		toolbar.style.border = "0 solid buttonface";
		toolbar.style.width = horizDockWidth;
		toolbar.style.height = "100%";
		toolbar.style.top = 0;
		toolbar.style.left = 0;

		contentDiv.style.top = 0;
		contentDiv.style.left = horizDockWidth;
		contentDiv.style.height = "100%";
		contentDiv.style.width = document.body.clientWidth - horizDockWidth;
		
		handle.style.height = 3;
		handle.style.width = horizDockWidth -2;
		break;

		case "right":
		toolbar.style.border = "0 solid buttonface";
		toolbar.style.width = horizDockWidth;
		toolbar.style.height = "100%";
		toolbar.style.top = 0;
		toolbar.style.left = document.body.clientWidth - horizDockWidth;
		
		contentDiv.style.top = 0;
		contentDiv.style.left = 0;
		contentDiv.style.height = "100%";
		contentDiv.style.width = document.body.clientWidth - horizDockWidth;
		
		handle.style.height = 3;
		handle.style.width = horizDockWidth -2;
		break;
		
		case "float":
		toolbar.style.width = floatWidth;
		toolbar.style.height = floatHeight;
		toolbar.style.border = "2px outset white";
		
		contentDiv.style.top = 0;
		contentDiv.style.left = 0;
		contentDiv.style.height = "100%";
		contentDiv.style.width = "100%";			

		handle.style.height = floatHeight - 6;
		handle.style.width = 3;
	}
}
/////////////////////////////////////////////////////////////////////////////


function dockBarOnMouseDown() {
	if(window.event.srcElement.id == "handle") {
		ty = (window.event.clientY - toolbar.style.pixelTop);
		tx = (window.event.clientX - toolbar.style.pixelLeft);

		dragging = true;
		
		window.event.returnValue = false;
		window.event.cancelBubble = true;
	}
	else {
		dragging = false;
	}	
}

function dockBarOnMouseUp() {
	dragging = false;
}

function dockBarOnMouseMove() {
	if(dragging) {
		// Top
		if((window.event.clientY) <= snapVertSize
			&& toolbarPos != "left" && toolbarPos != "right") {
			toolbarPos = "top";
			fixSize();
		}
		// Bottom
		else if (window.event.clientY >= document.body.clientHeight - snapVertSize
			&& toolbarPos != "left" && toolbarPos != "right") {

			toolbarPos="bottom";
			fixSize();
		}
		// Left
		else if (window.event.clientX <= snapHorizSize
			&& toolbarPos != "top" && toolbarPos != "bottom") {

			toolbarPos = "left";
			fixSize();	
		}
		// Right
		else if (window.event.clientX >= document.body.clientWidth - snapHorizSize
			&& toolbarPos != "top" && toolbarPos != "bottom") {

			toolbarPos = "right";
			fixSize();	
		}
		else {
			toolbar.style.left = window.event.clientX;
			toolbar.style.top = window.event.clientY - ty;

			toolbarPos = "float";
			fixSize();
		}

		window.event.returnValue = false;
		window.event.cancelBubble = true;
	} 
}
