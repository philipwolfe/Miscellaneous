/**
 * @classDescription	The FPS-O-Meter renders the frames per second and the following other metrics:
 * 					 		-Window dimensions (resolution)
 * 							-Browser name and version
 * 							-Score value (customizable, calculated value)
 * 							-Controls (list of links)
 */
function TempoMeter(initialScore, scoreLabel) {
	
	//get browser information
    
    var UA = navigator.userAgent.toLowerCase();
     
    var index;

    if (document.documentMode) {
        index = UA.indexOf('msie');
        this.browserName = "Internet Explorer";
        this.browserVersion = "" + document.documentMode;
    }
    else if (UA.indexOf('chrome') > -1) {
        index = UA.indexOf('chrome');
        this.browserName = "Chrome";
        this.browserVersion = "" + parseFloat('' + UA.substring(index + 7));
    }
    else if (UA.indexOf('firefox') > -1) {
        index = UA.indexOf('firefox');
        this.browserName = "Firefox";
        this.browserVersion = "" + parseFloat('' + UA.substring(index + 8));
    }


    else if (UA.indexOf('opera') > -1) browserName = "Opera";
    else if (UA.indexOf('safari') > -1) {
        index = UA.indexOf('safari');
        this.browserName = "Safari";
        this.browserVersion = "" + parseFloat('' + UA.substring(index + 7));
    }


    //create canvas and divs
    this.canvas = document.createElement("canvas");
    this.canvas.id = "fpsCanvas";
    this.canvas.setAttribute('width', 110);
    this.canvas.setAttribute('tabIndex', '-1');
    this.canvas.setAttribute('height', 60);
    this.ctx = this.canvas.getContext("2d");
	document.body.insertBefore(this.canvas, document.body.firstChild);
    

    this.infoPanel = document.createElement("div");
    this.infoPanel.setAttribute("id", "infoPanel");
    this.infoPanel.setAttribute('tabIndex', '-1');
    document.body.insertBefore(this.infoPanel, document.body.firstChild);
    this.infoPanel.innerHTML = "<div></div>";

    this.fpsometerDiv = document.createElement("div");
    this.fpsometerDiv.setAttribute("id", "fpsometer");
    //document.body.insertBefore(this.fpsometerDiv, document.body.firstChild);
    this.fpsometerDiv.innerHTML = "<div class='meter' id='fps'></div><div class='meterLabel' id='fpsLabel'>FPS</div>";

    //add resize handlers
    var self = this;
	var resizeHandler = function(e) { self.OnWindowResize(e); }
    window.addEventListener("resize", resizeHandler, false);
    
    //populate fps-o-meter with initial data  
	//this.infoPanelFps = document.getElementById("fps");  
    //this.infoPanelFps.setAttribute("title", "Frames per second");
    //this.infoPanelFps.innerHTML = 0;   
	
	this.infoPanelScore = document.getElementById("score"); 
    this.infoPanelScore.innerHTML = initialScore;
	
	this.windowSize = document.getElementById("windowSize");
    this.bodyWidth = window.innerWidth; //document.body.offsetWidth;
    this.bodyHeight = window.innerHeight; //document.body.offsetHeight;
    this.windowSize = this.bodyWidth + " x " + this.bodyHeight;

    document.getElementById("scoreLabel").innerHTML = scoreLabel;
    document.getElementById("windowSizeLabel").innerHTML = this.windowSizeLabel;
    document.getElementById("windowSize").innerHTML = this.windowSize;
	
	this.Reset();
	
}

/**
 * Class properties
 */
TempoMeter.prototype.fps = 0;                            //how many frames per second are calculated.
TempoMeter.prototype.displayedFps = 0;					//the displayed FPS. This is updated to match fps according to fpsDisplayUpdateFrequency
TempoMeter.prototype.lastFrameTime = new Date();         //time of the last frame
TempoMeter.prototype.timeDelta = .001;                      //milliseconds since the last frame
TempoMeter.prototype.timeDeltaS = .1;                     //seconds since the last frame
TempoMeter.prototype.currentSecond = 0;					
TempoMeter.prototype.framesThisSecond = 0;
TempoMeter.prototype.timeDeltaSinceLastFrame = 0;
TempoMeter.prototype.timeFpsDisplayLastChanged = 0;
TempoMeter.prototype.fpsDisplayUpdateFrequency = 500;
TempoMeter.prototype.frames = 0;

TempoMeter.prototype.bodyWidth;
TempoMeter.prototype.bodyHeight;
TempoMeter.prototype.windowSize;
TempoMeter.prototype.fpsLabel = "FPS";

TempoMeter.prototype.windowSizeLabel = "window size";

TempoMeter.prototype.ctx;
TempoMeter.prototype.canvas;

TempoMeter.prototype.infoPanel = null;
TempoMeter.prototype.infoPanelScore = null;
TempoMeter.prototype.infoPanelFps = null;
TempoMeter.prototype.infoPanelWindowSize = null;
TempoMeter.prototype.infoPanelScoreLabel = null;
TempoMeter.prototype.infoPanelWindowSizeLabel = null;

TempoMeter.prototype.meterPercent = -1;
TempoMeter.prototype.meterPercentGoal = -1;

TempoMeter.prototype.browserVersion = "";
TempoMeter.prototype.browserName = "Other Browser";


/**
 * Set settings
 * @param {Object} score
 */
TempoMeter.prototype.SetSettingsHtml = function(html) {
	document.getElementById("settings").innerHTML = html;
}

/**
 * Reset meter
 */
TempoMeter.prototype.Reset = function() {
	this.fpsResetTime = new Date();
	this.frames = 0;
}

/**
 * Draw meter with updated values
 * @param {Object} score
 */
TempoMeter.prototype.Draw = function (score, snap, total) {


    var now = new Date();

    /*	Calculate time delta since last time this method was called ---------*/
    this.timeDeltaSinceLastFrame = .001;
    if (this.lastFrameTime != 0)
        this.timeDeltaSinceLastFrame = now - this.lastFrameTime;

    this.timeDeltaS = this.timeDeltaSinceLastFrame / 1000;
    this.lastFrameTime = now;



    /*	Calculate frame rate, since last time this method was called ---------*/
    if (now.getSeconds() == this.currentSecond) {
        this.framesThisSecond++;
    }
    else {
        this.currentSecond = now.getSeconds();
        this.fps = this.framesThisSecond;
        this.framesThisSecond = 1;

        var timingDelayReached = ((now.getTime() - this.timeFpsDisplayLastChanged) > this.fpsDisplayUpdateFrequency);
        var fpsNotChangedYet = (this.timeFpsDisplayLastChanged == 0);

        if (timingDelayReached || fpsNotChangedYet) {
            this.timeFpsDisplayLastChanged = now.getTime();
            this.displayedFps = (this.fps > 60 ? 60 : this.fps);
            this.canvas.setAttribute("title", "Demo is running at " + this.fps + " FPS");
        }
    }

    //if ((now - this.fpsResetTime < 1000) || snap) {
    if ((now - this.fpsResetTime < 1000)) {
        this.frames++;
        // calculate frames live
        this.fps = Math.min(this.frames / ((now - this.fpsResetTime) / 1000), 60);
        this.displayedFps = this.fps;

    }


    //-----display the score-----------------------------------------------------------------------------------------------
    if (score == undefined)
        score = 0;
    this.infoPanelScore.innerHTML = score;

    //-----draw the FPS-o-meter--------------------------------------------------------------------------------------------
    this.ctx.clearRect(0, 0, 110, 110);

    //draw translucent background
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(75,175,225,.75)";

    try {
        this.ctx.fillStyle = this.CssRule("#infoPanel").style.backgroundColor;
    }
    catch (e) {
        // unable to load color from stylesheet
    }
    this.globalAlpha = .9;
    this.ctx.arc(55, 55, 50, Math.PI, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.restore();



    //draw meter
    if (this.displayedFps > 1) {
        this.meterPercentGoal = score / total;
        if (this.meterPercent == -1) {
            this.meterPercent = .01;
        }

        var delta = Math.abs(this.meterPercent - this.meterPercentGoal);

        if (this.meterPercent < this.meterPercentGoal) {

            if (!snap) {
                this.meterPercent *= 1 + delta / 3;
                if (this.meterPercent > this.meterPercentGoal) {
                    this.meterPercent = this.meterPercentGoal;
                }
            }
            else {
                this.meterPercent = this.meterPercentGoal;
            }
        }
        else {
            if (this.meterPercent > this.meterPercentGoal) {
                if (!snap) {
                    this.meterPercent *= 1 - delta;

                    if (this.meterPercent < this.meterPercentGoal) {
                        this.meterPercent = this.meterPercentGoal;
                    }
                }
                else {
                    this.meterPercent = this.meterPercentGoal;
                }
            }
        }


        var lingrad = this.ctx.createLinearGradient(0, 55, 100, -45);
        lingrad.addColorStop(0, "rgba(255,0,0,1)");
        lingrad.addColorStop(Math.ceil((.75 - this.meterPercent) * 100) / 100 < 0 ? 0 : Math.ceil((.75 - this.meterPercent) * 100) / 100, "rgba(0,0,255,.9)");
        lingrad.addColorStop(1, "rgb(0,128,0)");
        this.ctx.fillStyle = lingrad;
        this.ctx.beginPath();
        this.ctx.arc(55, 55, 50, Math.PI, Math.PI + Math.PI * (this.meterPercent), false);
        this.ctx.arc(55, 55, 18, Math.PI + Math.PI * (this.meterPercent), Math.PI, true);
        this.ctx.lineTo(5, 55);
        this.ctx.strokeStyle = "black";
        this.ctx.fill();




    }

    //draw line along bottom of the meter
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(5, 55);
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(37, 55);
    this.ctx.arc(55, 55, 18, Math.PI, Math.PI * 2, false);
    this.ctx.lineTo(105, 55);
    this.ctx.globalAlpha = .5;
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";

    try {
        this.ctx.fillStyle = this.CssRule("#fpsometer").style.backgroundColor;
    }
    catch (e) {
        // unable to load color from stylesheet
    }

    this.ctx.stroke();
    this.globalAlpha = 1;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(37, 55);
    this.ctx.lineWidth = 1;

    this.ctx.arc(55, 55, 18, Math.PI, Math.PI * 2, false);
    this.ctx.lineTo(37, 55);
    this.ctx.strokeStyle = "white";

    this.ctx.fillStyle = "black";
    //this.ctx.fill();
    //this.ctx.stroke();
    this.ctx.restore();

    //draw needle
    if (this.meterPercent != -1) {
        this.ctx.save();
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.globalAlpha = .8;
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.arc(55, 55, 3, 0, Math.PI * 2, false);
        this.ctx.moveTo(55, 55);


        this.ctx.lineTo(55 + 50 * -Math.cos(Math.PI * this.meterPercent), 55 + 50 * -Math.sin(Math.PI * this.meterPercent));
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();

        this.ctx.restore();
    }

    //draw fps
    this.ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = .7;
    this.ctx.font = "bold 15px arial";

    //var fpsString = this.displayedFps+" FPS";
    var fpsString = " BPM";

    var displayedFps = Math.round((this.meterPercent * total));
	if(displayedFps > total)
	{
		displayedFps = total;
	}
    if (this.meterPercent > 0) {
        fpsString = displayedFps + " BPM";
    }
    this.meterFps = displayedFps;
    var textSize = this.ctx.measureText(fpsString)
    var x = this.ctx.canvas.width / 2 - textSize.width / 2;
    var y = this.ctx.canvas.height / 2;

    this.ctx.fillText(fpsString, x, y);
    //this.ctx.fillText("ASDFASDF", 10, 10);
    this.ctx.restore();




}

/**
 * Hide meter
 * @param {Object} e
 */
TempoMeter.prototype.Hide = function() {
	this.canvas.style.display = "none";
	//this.infoPanel.style.display = "none";
}

/**
 * Show meter
 * @param {Object} e
 */
TempoMeter.prototype.Show = function() {
	this.canvas.style.display = "inline";
	//this.infoPanel.style.display = "inline";
}

/**
 * Handle window resize
 * @param {Object} e
 */
TempoMeter.prototype.OnWindowResize = function(e) {

    if (typeof e == 'undefined') e = window.event;
	
    //on resize update width and height
    this.bodyWidth = window.innerWidth; //document.body.offsetWidth;
    this.bodyHeight = window.innerHeight; //document.body.offsetHeight;
    this.windowSize = this.bodyWidth + " x " + this.bodyHeight;    

    //update infoPanel text
    document.getElementById("windowSizeLabel").innerHTML = this.windowSizeLabel;
    document.getElementById("windowSize").innerHTML = this.windowSize;
}

TempoMeter.prototype.CssRule = function(rulestr) {
	
	rulestr = rulestr.toLowerCase();
	
	var retVal = null;
	
	if(document.styleSheets) {
		for(var i = 0; i < document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			
			for(var ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
				//gLog.Debug(rule.selectorText);
				var rule = sheet.cssRules[ruleIndex];
				if(rule.selectorText.toLowerCase() == rulestr) {
					retVal = rule;
					break;
				}
			}
		}
	}
	
	if(retVal == null) {
		throw new Error("CSS Rule does not exist.");
	}
	
	return retVal;	
}
