Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var SVG_NS = "http://www.w3.org/2000/svg";

var BOX_BUFFER = 10;
var ROW_SIZE = 9;
var COL_SIZE = 32;
var BPM = 500; // beats per minute
var FADE_DURATION = 5; // seconds
var FADE_UPDATE = 4; // Hz
var FADE_MIN = 0.1;
var TIMER_RESET = 100; // beats

var boxSize = 0;
var boxHeight = 0;
var svgWidth = 0;
var svgHeight = 0;

var rows = [];
var progressBar = [];
var playerInterval = 0;
var previousBeat = 0;
var currentBeat = 0;
var shiftDown = false;
var dragging = false;
var isLoaded = false;
var beatCount = 0;
var infoElem = null;
var screenHeight, screenWidth;

var g_ctx;
var g_ctx2;
var g_ctx3;
var g_ctx4;
var g_ctx5;
var g_bgctx;
var grdnt;

var g_canvas1,
    g_canvas3,
    g_canvas4,
    g_bgCanvas;

var scaleX = 1;
var scaleY = 1;

var lastX;
var lastY;
var hue = 0;
var cw, ch;
var bars = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var grad;
var linePos = 0;

var soundsPlayed = 0;
var soundsTried = 0;

var BPM_Actual = 0;
var BPM_Latest = 0;

var particles = new Array();
var eSVG;

var audioBuffer = new Array();
var audioFilenames = ["hihat", "crash", "effect", "scratch", "snare", "bonga", "kick", "bass2", "bass1"];
var nextAudio = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var fpsMeter, fpsMeter2;
var g_ctxBpsCanvas;

var WantToPlay = 0;
var HasPlayed = 0;

var pianoRoll;

var sideCanvas, g_sideCanvasCtx;
var audioElementPointer;
var instrumentBuffer;
var grdntFillStyle = "rgba(0,0,255,.2)";
var left;
var bpsMeterCanvas;
var tempoDown, tempoUp;
var loadAudioInterval;
var highestLoadedCount = 0;
var myspace, myspaceDiv;


function init(resizing) {
    document.getElementById("introDiv").style.top = document.documentElement.clientHeight/2 - 75 + "px";
    document.getElementById("introDiv").style.left = document.documentElement.clientWidth/2 - 350 + "px";
    InitAudio();
    audioLoadedInterval = setInterval(CheckLoaded,100);
}

function init2(resizing) {
    document.getElementById("introDiv").style.display = "none";
    document.getElementById("controls").style.display = "block";
    document.getElementById("SoundLabels").style.display = "block";
    document.getElementById("urlbox").style.display = "block";

    if(!resizing){
        fpsMeter = new TempoMeter(0, "beat");
        fpsMeter.Show();
        fpsMeter2 = new FpsMeter(0, "fps");
        fpsMeter2.Show();
        InitAudio();
    }
    
    InitControls();
    PositionMeters();
    
    if(!resizing){
        SetCanvasEffects();
    }
    
    previousBeat = 0;
    currentBeat = 0;
    
    start(resizing);
}

function PositionMeters(){
    fpsMeter.canvas.setAttribute("tabindex", "-1");
    fpsMeter.canvas.style.top = g_ctx.canvas.height/2 + 10 + "px";
    fpsMeter.canvas.style.left = left + (svgWidth/4*3) + svgWidth/4/2 - fpsMeter.canvas.width/2 + "px";
    
    fpsMeter2.canvas.setAttribute("tabindex", "-1");
    fpsMeter2.canvas.style.top = g_ctx.canvas.height/2-50 + "px";
    fpsMeter2.canvas.style.left = left + (svgWidth/4*3) + svgWidth/4/2 - fpsMeter.canvas.width/2 + "px";
}

function InitAudio() {
    audioBuffer.push([document.getElementById("Audio01"), document.getElementById("Audio02"), document.getElementById("Audio03")]);
    audioBuffer.push([document.getElementById("Audio11"), document.getElementById("Audio12"), document.getElementById("Audio13")]);
    audioBuffer.push([document.getElementById("Audio21"), document.getElementById("Audio22"), document.getElementById("Audio23")]);
    audioBuffer.push([document.getElementById("Audio31"), document.getElementById("Audio32"), document.getElementById("Audio33")]);
    audioBuffer.push([document.getElementById("Audio41"), document.getElementById("Audio42"), document.getElementById("Audio43")]);
    audioBuffer.push([document.getElementById("Audio51"), document.getElementById("Audio52"), document.getElementById("Audio53")]);
    audioBuffer.push([document.getElementById("Audio61"), document.getElementById("Audio62"), document.getElementById("Audio63")]);
    audioBuffer.push([document.getElementById("Audio71"), document.getElementById("Audio72"), document.getElementById("Audio73")]);
    audioBuffer.push([document.getElementById("Audio81"), document.getElementById("Audio82"), document.getElementById("Audio83")]);
    
    audioBuffer[0][0].volume = .8;
    audioBuffer[0][1].volume = .8;
    audioBuffer[0][2].volume = .8;
    
    audioBuffer[4][0].volume = .3;
    audioBuffer[4][1].volume = .3;
    audioBuffer[4][2].volume = .3;
}

function soundWasPlayed() {
    HasPlayed++;
}

function CreateAudio(filename) {
    var aud = document.createElement("audio");
    var srcMp3 = document.createElement("source");

    srcMp3.src = "assets/sounds/mp3/" + filename + ".mp3";
    srcMp3.type = "audio/mp3";

    aud.appendChild(srcMp3);

    aud.preload = "true";

    return aud;
}

function OnWindowResize(){
    init2(true);
}

function InitControls() {
    screenWidth = document.documentElement.clientWidth;
    screenHeight = document.documentElement.clientHeight;

    window.addEventListener("resize", OnWindowResize, false);

    myspace = document.getElementById("myspaceImg");
    myspace.style.display = "block";
    myspaceDiv = document.getElementById("myspaceDiv");
    myspaceDiv.style.display = "block";
    
    left = screenWidth / 10;
    var canvasHeight = screenHeight / 4;
    svgHeight = screenHeight / 5 * 3;
    var svgTop = screenHeight * 5 / 16;
    svgWidth = screenWidth - screenWidth / 5;	
    boxSize = (svgWidth - BOX_BUFFER * (COL_SIZE + 1)) / COL_SIZE;
    boxHeight = (svgHeight - BOX_BUFFER * (ROW_SIZE + 1)) / ROW_SIZE / 19 * 18;

    var eSoundLabels = document.getElementById("SoundLabels");
    eSoundLabels.style.top = svgTop + "px";
    eSoundLabels.style.left = left - 55 + "px";
    eSoundLabels.style.lineHeight = boxHeight + BOX_BUFFER + "px";

    eSVG = document.getElementById("svg-root");
    eSVG.setAttribute("tabindex", "-1");
    eSVG.style.left = left + "px";
    eSVG.style.top = svgTop + "px";
    eSVG.style.border = "2px solid white";
    eSVG.setAttribute("width", svgWidth);
    eSVG.setAttribute("height", svgHeight);

    var eControls = document.getElementById("controls");
    eControls.style.left = left + "px";
    eControls.style.top = svgTop - 30 + "px";
    eControls.style.width = svgWidth + "px";

    var eURLBox = document.getElementById("urlbox");
    eURLBox.style.left = left + "px";
    eURLBox.style.top = (screenHeight / 3.1 + svgHeight) + "px";
    eURLBox.style.width = svgWidth + "px";

    g_bgCanvas = document.getElementById("bgCanvas");
    g_bgCanvas.width = screenWidth;
    g_bgCanvas.height = screenHeight;
    g_bgctx = g_bgCanvas.getContext("2d");
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";

    if(!sideCanvas){
        sideCanvas = document.createElement("canvas");
        document.body.appendChild(sideCanvas);
    }
    sideCanvas.height = svgHeight;
    sideCanvas.style.position = "absolute";
    sideCanvas.style.left = "0px";
    sideCanvas.style.top = svgTop + "px";
    sideCanvas.style.tabindex = -1;
    sideCanvas.width = screenWidth - left - svgWidth;

    g_sideCanvasCtx = sideCanvas.getContext("2d");
    g_sideCanvasCtx.lineWidth = 20;
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";


    document.getElementById("canvasContainer").style.left = left + "px";

    g_canvas1 = document.getElementById("canvas1");
    g_canvas1.width = svgWidth/4*3;
    g_canvas1.height = canvasHeight;
    g_canvas1.style.left = "0px";
    g_ctx = g_canvas1.getContext("2d");
    
    if(!bpsMeterCanvas){
        bpsMeterCanvas = document.createElement("canvas");
        bpsMeterCanvas.style.position = "absolute";
        bpsMeterCanvas.style.top = "90px";
        bpsMeterCanvas.id = "bpsMeterCanvas";
        bpsMeterCanvas.style.zIndex = "200";
        bpsMeterCanvas.setAttribute("tabindex", "-1");
        document.body.insertBefore(bpsMeterCanvas, document.body.firstChild);
    }
    
    bpsMeterCanvas.setAttribute('width', svgWidth/4);
    bpsMeterCanvas.setAttribute('height', canvasHeight*.75);
    bpsMeterCanvas.style.left = left + g_canvas1.width + "px";
    
    g_ctxBpsCanvas = bpsMeterCanvas.getContext("2d");

    if(!tempoDown){
        tempoDown = document.createElement("input");
        tempoDown.className = "tempocontrols";
        tempoDown.type = "button";
        tempoDown.value = "-";
        tempoDown.width = 20;
        tempoDown.style.border = "2px solid white";
        tempoDown.style.position = "absolute";
        tempoDown.style.color = 'white';
        tempoDown.style.zIndex = "5000";
        tempoDown.addEventListener("click", decreaseTempo, false);
        document.body.insertBefore(tempoDown, document.body.firstChild);
    }
    tempoDown.style.left = left + (svgWidth / 4 * 3) + svgWidth / 4 / 2 - fpsMeter.canvas.width + 15 + "px";
    tempoDown.style.top = g_ctx.canvas.height/2 + 30 + "px";
    
    if(!tempoUp){
        tempoUp = document.createElement("input");
        tempoUp.className = "tempocontrols";
        tempoUp.type = "button";
        tempoUp.value = "+";
        tempoUp.width = 20;
        tempoUp.style.border = "2px solid white";
        tempoUp.style.position = "absolute";
        tempoUp.style.color = 'white';
        tempoUp.style.zIndex = "5000";
        tempoUp.addEventListener("click", increaseTempo, false);
        document.body.insertBefore(tempoUp, document.body.firstChild);
    }
    tempoUp.style.left = left + (svgWidth / 4 * 3) + svgWidth / 4 / 2 + fpsMeter.canvas.width - 40 + "px";
    tempoUp.style.top = g_ctx.canvas.height/2 + 30 + "px";
}

function decreaseTempo() {
    if (BPM > 20) {
        BPM -= 20;
        clearInterval(playerInterval);
        setBeatURLShort();
        playerInterval = 0;
        StartTimer();
    }
}
function increaseTempo() {
    BPM += 20;
    clearInterval(playerInterval);
    setBeatURLShort();
    playerInterval = 0;
    StartTimer();
}


// Called each time a beat is hit
function PlayCanvas(index) {
    equalizer(g_sideCanvasCtx, index);
    increaseScale();
    pulsate();
    equalizerHit(index);
    WantToPlay++;
}

function pulsate() {
    var intensity = 0;

    for (var i = 0; i < ROW_SIZE; i++) {
        if (IsBeatEnabled(rows[i][currentBeat])) {
            intensity++;
        }
    }
    
    if (intensity >= 0) {
        grdnt = g_bgctx.createRadialGradient(g_bgctx.canvas.width/2,g_bgctx.canvas.height/2,g_bgctx.canvas.height/8, g_bgctx.canvas.width/2,g_bgctx.canvas.height/2,g_bgctx.canvas.height/1.1);
        grdnt.addColorStop(0, "rgba(0,0,0,0)");
        grdnt.addColorStop(1, grdntFillStyle);
        g_bgctx.fillStyle = grdnt;
        g_bgctx.fillRect(0, 0, g_bgCanvas.width, g_bgCanvas.height);
    }
}

// Called initially to set timers.
function SetCanvasEffects() {
    setInterval(MeterEffects, 1);
    setInterval(pulseE, 1);
    setInterval(pulseHeader, 1);
    g_bgctx.fillStyle = "rgba(0,0,0,0.5)";
    setInterval("fadeToBlack(g_bgctx, .05)", 40);
}

function equalizer(ctx, index) {
    bars[index] = ctx.canvas.width;
}


function MeterEffects() {
    fpsMeter.Draw(BPM_Latest/4, null, BPM/4);

    
    g_ctxBpsCanvas.clearRect(0, 0, g_ctxBpsCanvas.canvas.width, g_ctxBpsCanvas.canvas.height);
    g_ctxBpsCanvas.fillStyle = 'white';
    g_ctxBpsCanvas.font = "16px Verdana";
    g_ctxBpsCanvas.textAlign = "center";
    g_ctxBpsCanvas.fillText("Target Tempo = " + BPM/4, g_ctxBpsCanvas.canvas.width / 2, g_ctx.canvas.height/2, g_ctxBpsCanvas.canvas.width);
}

function fadeToBlack(ctxptr, alpha) {
    ctxptr.fillStyle = "rgba(0,0,0,0.1)";
    ctxptr.fillRect(0, 0, ctxptr.canvas.width, ctxptr.canvas.height);
}


function BeatsEnabled(index) {
    var beatsEnabled = 0;

    for (var j = 0; j < rows[index].length; j++) {
        if (IsBeatEnabled(rows[index][j])) {
            beatsEnabled++;
        }
    }
    return beatsEnabled;
}

function pulseE() {
    fpsMeter2.Draw();
    
    var top = 100;
    var textSize = 50;

    g_sideCanvasCtx.clearRect(0, 0, g_sideCanvasCtx.canvas.width, g_sideCanvasCtx.canvas.height);

    for (var i = 0; i < bars.length; i++) {
        
        if(bars[i] > 0){
            g_sideCanvasCtx.fillRect(g_sideCanvasCtx.canvas.width - bars[i] / 1.2,
                                     boxHeight * i + BOX_BUFFER * i + BOX_BUFFER*2,
                                     bars[i] / 1.2,
                                     g_sideCanvasCtx.canvas.height / ROW_SIZE / 2);

            g_sideCanvasCtx.strokeRect(g_sideCanvasCtx.canvas.width - bars[i] / 1.2,
                                        boxHeight * i + BOX_BUFFER * i + BOX_BUFFER * 2,
                                        bars[i] / 1.2,
                                        g_sideCanvasCtx.canvas.height / ROW_SIZE / 2);
        }
        bars[i] -= 10;
    }
}
function equalizerHit(index) {
    g_sideCanvasCtx.lineWidth = 50;
    var tmpStyle = g_sideCanvasCtx.strokeStyle;
    g_sideCanvasCtx.strokeStyle = "#dd6600";
    g_sideCanvasCtx.strokeRect(g_sideCanvasCtx.canvas.width - bars[index] / 1.2,
                                    boxHeight * index + BOX_BUFFER * index + BOX_BUFFER * 2,
                                    bars[index] / 1.2,
                                    g_sideCanvasCtx.canvas.height / ROW_SIZE / 2);
    g_sideCanvasCtx.strokeStyle = tmpStyle;
    g_sideCanvasCtx.lineWidth = 20;
}

function fillCircle(radius, color){
    g_ctx.beginPath();
    g_ctx.moveTo(0-radius,0);
    g_ctx.arc(0,0,radius,2*Math.PI,0,false);
    g_ctx.fillStyle = color;
    g_ctx.fill();
}
function strokeCircle(radius, color){
    g_ctx.beginPath();
    g_ctx.moveTo(radius,0);
    g_ctx.arc(0,0,radius,2*Math.PI,0,false);
    g_ctx.strokeStyle = color;
    g_ctx.stroke();
}

function pulseHeader() {
    
    var speakerTop = 70;
    var speakerLeft = 20;
    
    var leftTemp = 0;
    var topTemp = 100;
    
    var textSize = g_ctx.canvas.width/10;
    var textSizeScore = g_ctx.canvas.height/6;

    var speakerWidth = g_ctx.canvas.height / 6;
    if (screenWidth > 1000) {
        speakerWidth += screenWidth / 30;
    }

    g_ctx.clearRect(0, 0, g_ctx.canvas.width, g_ctx.canvas.height);
    
    

    g_ctx.save();
    g_ctx.translate(-(100 * scaleX - 100) / 2 + speakerWidth + 20, -(100 * scaleY - 100) / 2 + g_ctx.canvas.height/2);
    g_ctx.scale(scaleX - g_ctx.canvas.height/g_ctx.canvas.width, scaleY - g_ctx.canvas.height/g_ctx.canvas.width);
    
    


    fillCircle(speakerWidth, 'white');
    fillCircle(speakerWidth*.8, 'black');
    strokeCircle(speakerWidth*.2, 'white');

    g_ctx.restore();
    g_ctx.save();

    g_ctx.translate(-(100 * scaleX - 100) / 2 + g_ctx.canvas.width - speakerWidth - 20, -(100 * scaleY - 100) / 2 + g_ctx.canvas.height/2);
    g_ctx.scale(scaleX - g_ctx.canvas.height/g_ctx.canvas.width, scaleY - g_ctx.canvas.height/g_ctx.canvas.width);


    fillCircle(speakerWidth, 'white');
    fillCircle(speakerWidth*.8, 'black');
    strokeCircle(speakerWidth*.2, 'white');


    g_ctx.restore();
    
    g_ctx.textBaseline = "middle";
    g_ctx.textAlign = "center";
    g_ctx.fillStyle = "White";
    g_ctx.font = textSize + "px Helvetica";
    g_ctx.fillText("IE Beatz", 
                   g_ctx.canvas.width/2.5, 
                   g_ctx.canvas.height/2);
    
    g_ctx.font = textSize/4 + "px Helvetica";
    g_ctx.fillText("Powered by " + fpsMeter.browserName + " " + fpsMeter.browserVersion, 
                   g_ctx.canvas.width/2.5, 
                   g_ctx.canvas.height/2 + textSize/1.5);

    myspaceDiv.style.left = left + g_ctx.canvas.width / 2 - 100 + "px";
    myspaceDiv.style.top = g_ctx.canvas.height / 2 - textSize + "px";

    g_ctx.textAlign = "center";
    g_ctx.fillStyle = "#ED9121";
    g_ctx.font = textSizeScore + "px Helvetica";
    g_ctx.fillText(BPM_Latest/4 * fpsMeter2.meterFps, 
                   g_ctx.canvas.width/1.4, 
                   g_ctx.canvas.height/2);
    
    g_ctx.fillStyle = "white";
    g_ctx.font = textSizeScore/4 + "px Helvetica";
    g_ctx.fillText("Score (BPSxFPS)", 
                   g_ctx.canvas.width/1.4, 
                   g_ctx.canvas.height/2 + textSizeScore/1.5);

    if (scaleX > 1) {
        scaleX -= .05;
        scaleY -= .05;
        if (scaleX < 1) {
            scaleX = 1;
            scaleY = 1;
        }
    }

    
}

function increaseScale() {
    scaleX += .02;
    scaleY += .02;
}


function SoundPlayed(evt) {
    soundsPlayed++;
}

function start(resizing) {
    rows = BuildGrid(ROW_SIZE, COL_SIZE, resizing);
    progressBar = BuildProgress(ROW_SIZE, COL_SIZE);
    
    DrawGrid(rows);
    DrawProgress(progressBar);
    
    
    if( isInitiallyPaused() ){
        PauseTimer();
    }
    
    if(!resizing){
        setTimeout(UpdateBPM, 3000);
        LoadGetBeat();
        StartTimer();
    }
}

function isInitiallyPaused(){
    if( window.location.href.indexOf('paused') == -1 ){
        return false;
    }
    else{
        return true;
    }
}

function GetBinForHex(hexStr){
    switch( hexStr )
    {
        case "0":
            return "0000";
        case "1":
            return "0001";
        case "2":
            return "0010";
        case "3":
            return "0011";
        case "4":
            return "0100";
        case "5":
            return "0101";
        case "6":
            return "0110";
        case "7":
            return "0111";
        case "8":
            return "1000";
        case "9":
            return "1001";
        case "A":
            return "1010";
        case "B":
            return "1011";
        case "C":
            return "1100";
        case "D":
            return "1101";
        case "E":
            return "1110";
        case "F":
            return "1111";
        case "a":
            return "1010";
        case "b":
            return "1011";
        case "c":
            return "1100";
        case "d":
            return "1101";
        case "e":
            return "1110";
        case "f":
            return "1111";
    }
}

function LoadHexBeat(str, tempo) {
    BPM = tempo * 4;

    var binStr = "";

    for (var i = 0; i < str.length; i++) {
        binStr += GetBinForHex(str[i]);
    }

    var index = 0;

    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < COL_SIZE; j++) {
            if (binStr[index] == 1) {
                EnableBeat(rows[i][j], true);
            }
            index++;
        }
    }

    clearInterval(playerInterval);
    setBeatURLShort();
    playerInterval = 0;
    StartTimer();
}

function LoadGetBeat() {
    if (window.location.href.indexOf('=') > -1) {
        if (window.location.href.indexOf('tempo') == -1) {
            var beats = window.location.href.slice(window.location.href.indexOf('=') + 1);
            var binStr = "";
            
            for( var i = 0; i < beats.length; i++ ){
                binStr += GetBinForHex(beats[i]);				
            }

            var index = 0;

            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < COL_SIZE; j++) {
                    if (binStr[index] == 1) {
                        //alert("enabling beat");
                        EnableBeat(rows[i][j], true);
                    }
                    index++;
                }
            }
        }
        else {
            var beats = window.location.href.slice(window.location.href.indexOf('beats=') + 6).split('&')[0];
            var getTempo = window.location.href.slice(window.location.href.indexOf('tempo=') + 6);

            BPM = getTempo * 4;
            
            var binStr = "";
            
            for( var i = 0; i < beats.length; i++ ){
                binStr += GetBinForHex(beats[i]);				
            }

            var index = 0;

            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < COL_SIZE; j++) {
                    if (binStr[index] == 1) {
                        //alert("enabling beat");
                        EnableBeat(rows[i][j], true);
                    }
                    index++;
                }
            }
        }
    }
    else {
        loadPreset1();
    }
}

function LoadBeat(str, t) {
    var index = 0;

    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < COL_SIZE; j++) {
            if (str[index] == 1) {
                EnableBeat(rows[i][j], true);
            }
            index++;
        }
    }

    BPM = t * 4;

    clearInterval(playerInterval);
    setBeatURLShort();
    playerInterval = 0;
    StartTimer();
}

function LoadGetVars() {
    var getVars = new Array();
    var hash;
    var rawArray = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (var i = 0; i < rawArray.length; i++) {
        hash = rawArray[i].split('=');
        getVars.push(hash[0]);
        getVars[hash[0]] = hash[1];
    }

    return getVars;
}

function ClearBeats() {
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[0].length; j++) {
            DisableBeat(rows[i][j]);
        }
    }
}

function HideControls() {
    var elem = document.getElementById("controls");
    elem.style.visibility = "hidden";
}

function ShowControls() {
    var elem = document.getElementById("controls");
    elem.style.visibility = "visible";
}

function ControlsHidden() {
    var elem = document.getElementById("controls");
    return elem.style.visibility == "hidden";
}

function ShowHideControls() {
    if (ControlsHidden()) {
        ShowControls();
    }
    else {
        HideControls();
    }
}

function loadPreset1() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";
    grdntFillStyle = "rgba(0,0,255,.2)";
    LoadBeat("100000001000000010000000100000000000000010100000000000001000100000100000000000000010000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 230);
}

function loadPreset2() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(255,0,0,.2)";
    g_sideCanvasCtx.strokeStyle = "rgba(255,0,0,1)";
    g_sideCanvasCtx.fillStyle = "rgba(255,0,0,1)";
    grdntFillStyle = "rgba(255,0,0,.8)";
    LoadBeat("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 500);
}


function loadPreset3() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";
    grdntFillStyle = "rgba(0,0,255,.2)";
    LoadBeat("111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010101000000000000000000000000001010101000000000000000000000000", 230);
}

function loadPreset4() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";
    grdntFillStyle = "rgba(0,0,255,.2)";
    LoadBeat("000000000000000000000000000000000000000000001000000000000000100010001010001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010001010000000100010100010000000000000000000000000000000000000000000001000000000000000000000000000100001001000100000001000", 245);
}

function loadPreset5() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";
    grdntFillStyle = "rgba(0,0,255,.2)";
    LoadHexBeat("2222aaaa00000000ccccc00c000000000000022202222232000002000c0c0ccc00c00300", 70);
}

function loadPreset6() {
    ClearBeats();
    g_bgctx.strokeStyle = "rgba(0,0,255,.07)";
    g_sideCanvasCtx.strokeStyle = "#0066dd";
    g_sideCanvasCtx.fillStyle = "#0066dd";
    grdntFillStyle = "rgba(0,0,255,.2)";
    LoadHexBeat("a8a8a8a8008000808202080000008000000000008202802a00a8002a0000820080080008", 230);
}

function PlayPauseTimer() {
    if (playerInterval == 0) {
        StartTimer();
    }
    else {
        PauseTimer();
    }
}

function UpdateBPM() {
    BPM_Latest = BPM_Actual * 20;
    BPM_Actual = 0;
    setTimeout(UpdateBPM, 3000);
}

function StartTimer() {
    if (playerInterval == 0) {
        playerInterval = setInterval(NextBeat, 60000 / BPM);
    }
}

function PauseTimer() {
    clearInterval(playerInterval);
    playerInterval = 0;
}

function NextBeat() {
    BPM_Actual++;
    
    if (isLoaded) {
        previousBeat = currentBeat;
        currentBeat++;

        // Update Canvas Line
        linePos = boxSize * currentBeat + BOX_BUFFER * currentBeat + ( BOX_BUFFER*2 + boxSize )/2;

        if (currentBeat >= COL_SIZE) {
            currentBeat = 0;
        }

        // work around 'web page not responding' bug

        beatCount++;

        if (beatCount >= TIMER_RESET) {
            var elem = document.getElementById("benignElem");
            elem.style.visibility = "visible";
            elem.style.visibility = "hidden";
            beatCount = 0;
        }

        UpdateProgress();
        PlayBeats();
    }
}

function PlaySound(instrument) {
    // Grab a pointer to the instrument buffer we want to play
    instrumentBuffer = audioBuffer[instrument];
    // Play the latest available audio track for the sound
    instrumentBuffer[nextAudio[instrument]].play();

    // Choose the next one that will be played
    nextAudio[instrument] == 2 ? nextAudio[instrument] = 0 : nextAudio[instrument]++;
    // Get this audio element ready to play
    audioElementPointer = instrumentBuffer[nextAudio[instrument]];
    audioElementPointer.pause();
    audioElementPointer.currentTime = 0;
}

function PlayBeats() {
    for (var row = 0; row < rows.length; row++) {
        if (IsBeatEnabled(rows[row][currentBeat])) {
            PlaySound(row);
            PlayCanvas(row);
            // Highlight beat as you play it
            rows[row][currentBeat].setAttribute("fill", "#ED9121");
        }

        var lastBeat = currentBeat - 1;
        if (lastBeat < 0) {
            lastBeat = COL_SIZE - 1;
        }
        var currentfill = rows[row][lastBeat].getAttribute("fill");
        if (currentfill == "#ed9121" || currentfill == "#ED9121") {
            // Set previous column back to normal color
            rows[row][lastBeat].setAttribute("fill", "#0066dd");
        }
        
    }
}

function CheckLoaded() {
    var loadedCount = 0;
    for (var i = 0; i < audioBuffer.length; i++) {
        for (var j = 0; j < audioBuffer[i].length; j++) {
            var current = audioBuffer[i][j];
            var canPlayMp3 = false;
            try{
                var canPlayResponse = current.canPlayType("audio/mp3");
                if(canPlayResponse != ""){
                    canPlayMp3 = true;
                }
            }
            catch(e){}
            
            if(!canPlayMp3){
                var fontSize = 20;
                
                clearInterval(playerInterval);
                var alertDiv = document.getElementById("noSupportAlert");

                alertDiv.style.top = screenHeight/2 - fontSize;
                alertDiv.style.left = screenHeight*.1/2;
                alertDiv.style.display = "block";
            }
            
            if (current.readyState == 4) {
                loadedCount++;
            }
        }
    }

    if (loadedCount == audioBuffer.length * audioBuffer[0].length) {
        isLoaded = true;
        clearInterval(audioLoadedInterval);
        setTimeout("init2(false)", 800);
    }
    
    if( loadedCount > highestLoadedCount ){
        highestLoadedCount = loadedCount;
    }
    
    document.getElementById("loadedCountDiv").innerHTML = "Loading... " + highestLoadedCount + "/27 audio elements";
    
    if(highestLoadedCount == 27){
        document.getElementById("doneText").style.display = "block";
    }
}

function UpdateProgress() {
    DisableProgress(progressBar[previousBeat]);
    EnableProgress(progressBar[currentBeat]);
    pianoRoll.setAttribute("x1", BOX_BUFFER + boxSize * currentBeat + BOX_BUFFER * currentBeat + boxSize/2);
    pianoRoll.setAttribute("x2", BOX_BUFFER + boxSize * currentBeat + BOX_BUFFER * currentBeat + boxSize / 2);
}

function BuildGrid(numRows, numCols, resizing) {
    var rowArr = [];

    for (var row = 0; row < numRows; row++) {
        rowArr[row] = new Array();
        for (var col = 0; col < numCols; col++) {
            var square = document.createElementNS(SVG_NS, "rect");
            square.setAttribute("x", BOX_BUFFER + boxSize * col + BOX_BUFFER * col);
            square.setAttribute("y", BOX_BUFFER + boxHeight * row + BOX_BUFFER * row);
            square.setAttribute("width", boxSize);
            square.setAttribute("height", boxHeight);
            
            if( resizing && IsBeatEnabled(rows[row][col]) ){
                square.setAttribute("fill", "#0066dd");
            }
            else{
                square.setAttribute("fill", "black");
            }
            square.setAttribute("stroke", "white");
            //square.setAttribute("opc", "0.5");
            square.setAttribute("rx", "10");
            square.addEventListener("mousedown", ClickBeat, false);
            square.addEventListener("mouseover", MouseOverBeat, false);
            square.addEventListener("mouseup", MouseUpBeat, false);
            square.addEventListener("mouseout", MouseOutBeat, false);

            rowArr[row][col] = square;

        }
    }

    return rowArr;
}

function BuildProgress(rows, cols) {
    var rowArr = []
    for (var col = 0; col < cols; col++) {
        var square = document.createElementNS(SVG_NS, "rect");
        square.setAttribute("x", BOX_BUFFER + boxSize * col + BOX_BUFFER * col);
        square.setAttribute("y", screenHeight/5*3 - boxHeight/2);
        square.setAttribute("width", boxSize);
        square.setAttribute("height", boxSize / 4);
        square.setAttribute("fill", "#729fcf");
        square.setAttribute("stroke", "white");
        square.setAttribute("rx", "10");

        rowArr[col] = square;
    }

    return rowArr;
}

function ClickBeat(evt) {
    var clicked = evt.target;

    if (IsBeatEnabled(clicked)) {
        DisableBeat(clicked);
    }
    else {
        EnableBeat(clicked, true);
    }


    dragging = shiftDown;
}

function HoverBeat(evt) {
    var hovered = evt.target;
    if (!IsBeatEnabled(hovered)) {
        hovered.setAttribute("fill", "rgba(0,0,255,.8)");
    }
}

function MouseOverBeat(evt) {
    if (dragging) {
        ClickBeat(evt);
    }
    else {
        HoverBeat(evt);
    }
}

function MouseOutBeat(evt) {
    if (!IsBeatEnabled(evt.target)) {
        DisableBeat(evt.target);
    }
}


function MouseUpBeat(evt) {
    dragging = false;
    document.onmousemove = null;
}

function DisableBeat(beat) {
    beat.setAttribute("fill", "black");
    setBeatURLShort();
}

function EnableBeat(beat, isInitialLoad) {
    beat.setAttribute("fill", "#0066dd");
    
    if(isInitialLoad == null || isInitialLoad == false){
        setBeatURLShort();
    }
}

function setBeatURLShort(){
    var url = document.getElementById("beatURL");
    var str = window.location.href.split('?')[0] + "?beats=";
    var binarystr = "";
    var hexstr = "";
    var tempLength;
    var tempNum;

    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < COL_SIZE; j++) {
            if (IsBeatEnabled(rows[i][j])) {
                binarystr += "1";
            }
            else {
                binarystr += "0";
            }
            if((j+1)%4 == 0){
                tempLength = binarystr.length;
                tempNum = 0;
                var a,b;
                for(a = 0, b = tempLength-1; a < tempLength; a++, b--)
                {	
                    tempNum = tempNum + parseInt(binarystr.charAt(a)) * Math.pow(2, b);
                }
                tempNum = new Number(tempNum);
                hexstr += tempNum.toString(16) + "";
                binarystr = "";
            }
        }
    }
    
    str += hexstr;

    str += "&tempo=" + (BPM / 4);

    url.value = str;
}

function setBeatURL() {
    var url = document.getElementById("beatURL");
    var str = window.location.href.split('?')[0] + "?beats=";
    var binarystr = "";

    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < COL_SIZE; j++) {
            if (IsBeatEnabled(rows[i][j])) {
                str += "1";
            }
            else {
                str += "0";
            }
        }
    }

    str += "&tempo=" + (BPM / 4);

    url.value = str;
}

function DisableProgress(beat) {
    beat.setAttribute("fill", "#729fcf");
}

function EnableProgress(beat) {
    beat.setAttribute("fill", "orange");
}

function IsBeatEnabled(beat) {
    var currentFill = beat.getAttribute("fill");

    return ("#0066dd" == currentFill || "#ED9121" == currentFill || "#ed9121" == currentFill)
}


function DrawGrid(grid) {
    var base = document.getElementById("grid");
    
    if(base.hasChildNodes()){
        while( base.childNodes.length > 0 ){
            base.removeChild(base.firstChild);
        }
    }
    
    pianoRoll = document.createElementNS(SVG_NS, "line");
    pianoRoll.setAttribute("x1", 0);
    pianoRoll.setAttribute("y1", 0);
    pianoRoll.setAttribute("x2", 0);
    pianoRoll.setAttribute("y2", svgHeight);
    pianoRoll.setAttribute("width", 1);
    pianoRoll.setAttribute("height", 50);
    pianoRoll.setAttribute("fill", "yellow");
    pianoRoll.setAttribute("stroke", "yellow");
    pianoRoll.setAttribute("stroke-width", 5);
    pianoRoll.setAttribute("stroke-opacity", .4);
    base.appendChild(pianoRoll);

    for (var col = 0; col < grid[0].length; col++) {
        if (col % 4 == 0 && col > 0) {
            var line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("x1", BOX_BUFFER/2 + boxSize * col + BOX_BUFFER * col);
            line.setAttribute("y1", 0);
            line.setAttribute("x2", BOX_BUFFER / 2 + boxSize * col + BOX_BUFFER * col);
            line.setAttribute("y2", svgHeight);
            line.setAttribute("width", 1);
            line.setAttribute("height", 50);
            line.setAttribute("fill", "white");
            line.setAttribute("stroke", "white");
            line.setAttribute("stroke-width", 1);
            line.setAttribute("stroke-opacity", .4);
            base.appendChild(line);
        }
    }

    for (var row = 0; row < grid.length; row++) {
        for( var col = 0; col < grid[row].length; col++) {
            base.appendChild(grid[row][col]);
        }
    }
}

function DrawProgress(grid) {
    var base = document.getElementById("grid");

    for (var col = 0; col < grid.length; col++) {
        base.appendChild(grid[col]);
    }
}
















