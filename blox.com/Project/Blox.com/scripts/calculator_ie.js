//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kGutterHeight = 3;
var kGutterWidth = 3;
var kRowSize = 20;
var kColumnSize = 70;
var kRowMinimum = 20;
var kPopupWidgetOffset = 17;
var gSheetCount = 1;
var gTracking = "none";
var gTrackingElement = null;
var gCellClickFocused = false;
var gUnloadHandled = false;
var gInitialized = false;
var gAMenuIsShowing = false;
var gLastMenuItemMousedOver = null;
var gSpreadsheetName = 'calculator';
function calculatorInit(){}
function loadDocument(){
    gCurrSheetIndex = 0;
    platformInit();
    window.focus();
    if(WindowIsValid(opener) && opener.hb_directory)
        window.hb_directory = opener.hb_directory;
    setupInterface();
    doCropCheck("writeDocument();");
}
var kDefaultSpacing = 5;
function positionChildren(Z, Y){;
    if(Z == null)
        return;
    if(Z.children.length == 0)
        return;
    if(typeof(Y) == "undefined")
        Y = kDefaultSpacing;
    var X = getWidth(Z.children[0]);
    X += Y;
    for(var W = 1; W < Z.children.length; W ++ ){
        var V = Z.children[W];
        if(V.style && V.style.visibility != "hidden"){
            setLeft(V, X);
            X += getWidth(V);
            X += Y;
        }
    }
}
function setupInterface(){
    if(typeof topDivision != 'undefined')
        gHeader["topDivision"] = topDivision;
    if(typeof buttonPalette != 'undefined')
        gHeader["buttonPalette"] = buttonPalette;
    if(typeof buttonDivision != 'undefined')
        gHeader["buttonDivision"] = buttonDivision;
    if(typeof footDivision != 'undefined')
        gFooter["footDivision"] = footDivision;
    if(typeof footPalette != 'undefined')
        gFooter["footPalette"] = footPalette;
    if(gFooter["footPalette"]){
        var Z = "";
        Z += "<nobr>";
        Z += "<span style='width: 5px;' />";
        Z += getString("strCopyright");
        Z += '&copy; 1999-2001 <A HREF="http://www.alphablox.com" target="_blank" tabIndex="-1" onFocus="this.blur()">';
        Z += getString("strAlphabloxCorp");
        Z += '</A>. ';
        Z += getString("strAllRightsReserved");
        Z += "</nobr>";
        gFooter["footPalette"].innerHTML = Z;
    }
    if(typeof gIsMatterhorn == "undefined" ||! gIsMatterhorn){
        var Y = getElement("bulbLogo");
        if(Y){
            Y.title = "Blox.com";
            Y.style.cursor = "hand";
        }
    }
}
function loadDocument2(){
    BuildCellMatrix();
}
function loadDocument3(){
    calculatorInit();
    if( ! gAppId){
        if(getElement("btnInstruction")){
            setVisible(btnInstruction, false);
            setVisible(btnInstructionText, false);
            setVisible(break4, false);
        }
        if(getElement("btnEdit")){
            setVisible(btnEdit, false);
            setVisible(btnEditText, false);
            setVisible(break5, false);
        }
        if(getElement("btnEmail")){
            setVisible(btnEmail, false);
            setVisible(btnEmailText, false);
        }
        if(getElement("btnRate")){
            setVisible(break6, false);
            setVisible(btnRate, false);
            setVisible(btnRateText, false);
        }
    }
    if(gHeader["buttonPalette"]){
        positionChildren(gHeader["buttonPalette"]);
    }
    var Z = contextualMenu;
    if(Z){
        adjustMenuWidth(Z);
    }
    for(var Y = 0; Y < gColWidths.length; Y ++ ){
        if(gColWidths[Y] == 0){
            for(var X = 0; X < gRowCount; X ++ ){
                var W = index2cell(X, Y, 0);
                if(W !=- 1)
                    setVisible(W, false);
            }
        }
    }
    documentSize();
    gDocument.onkeydown = keyDownDocument;
    gDocument.onmouseover = mouseOverDocument;
    gDocument.onmouseout = mouseOutDocument;
    gDocument.onmousedown = mouseDownDocument;
    gDocument.onmousemove = mouseMoveDocument;
    gDocument.onmouseup = mouseUpDocument;
    gDocument.oncontextmenu = showContextMenu;
    setTimeout("loadDocument4()", 0);
}
var gEditTimer = null;
function loadDocument4(){
    InitRestoreData(0);
    if(gHeader["topDivision"] && typeof gTopDivisionVisibility != "undefined")
        setVisible(gHeader["topDivision"], gTopDivisionVisibility);
    if(gHeader["buttonPalette"]){
        if(typeof gButtonsVisibility != "undefined")
            setVisible(gHeader["buttonPalette"], gButtonsVisibility);
        if(typeof gButtonsTop != "undefined")
            setTop(gHeader["buttonPalette"], gButtonsTop);
    }
    if(gHeader["buttonDivision"] && typeof gButtonsBottom != "undefined")
        setTop(gHeader["buttonDivision"], gButtonsBottom);
}
function loadDocument5(){
    if(gMacroText == ""){
        setTimeout("loadDocument5_1()", 0);
        return;
    }
    InitMacros(gMacroText, loadDocument5_1);
}
function loadDocument5_1(){
    if(gEntryLocale == "")
        gEntryLocale = "en";
    RebuildSelectedCells(0, "loadDocument6()");
}
function loadDocument6(){
    gEntryLocale = gAppLocale;
    RefreshMacroCells();
    gMenus["popupMenuList"] = popupMenuList;
    var Z = (kMode == 'embed' ? 'true' : 'false');
    gEditTimer = setTimeout("startEdit(" + Z + ");", (is.nav ? 100 : 0));
    setDisplay(sheet0, true);
    setVisible(view, true);
    ProcessDirtyCells();
    hb_progress("", "", null);
    gInitialized = true;
    gCycleTimer = killTimeout(gCycleTimer);
    gCycleTimer = setTimeout("cycleCell()", 100);
}
var gSafeSave = false;
function unloadDocument(){
    if((typeof gInitialized == "undefined") || ( ! gInitialized))
        return;
    if(gUnloadHandled)
        return;
    if(cl_dirty()){
        var Z = gLocaleSaveCloseBoxSize[gAppLocale][0];
        if(is.ie4)
            Z += 20;
        var Y = gLocaleSaveCloseBoxSize[gAppLocale][1];
        var X = window.showModalDialog(kRootUrl + gCloseBoxFile, null, "dialogWidth:" + Y + "px; dialogHeight:" + Z + "px; center:yes; status:no;");
        if(X){
            saveEdit();
            openLifeboat();
        }
    }
    gUnloadHandled = true;
}
function addSpaceForRevert(Z){
    var Y = (Z) ? 113 :- 113;
    var X = btnInstruction;
    var W = btnInstructionText;
    var V = break4;
    var U = btnEdit;
    var T = btnEditText;
    var S = break5;
    var R = btnEmail;
    var Q = btnEmailText;
    var P = break6;
    var O = btnRate;
    var N = btnRateText;
    setLeft(X, getLeft(X) + Y);
    setLeft(W, getLeft(W) + Y);
    setLeft(V, getLeft(V) + Y);
    setLeft(U, getLeft(U) + Y);
    setLeft(T, getLeft(T) + Y);
    setLeft(S, getLeft(S) + Y);
    setLeft(R, getLeft(R) + Y);
    setLeft(Q, getLeft(Q) + Y);
    setLeft(P, getLeft(P) + Y);
}
var gLifeboatTimer = null;
function ss_save(){
    saveEdit();
    saveDocument(gAppId, null, gAppDescription);
}
function keyDownDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    kTopContext.event.cancelBubble = true;
    var Y = kTopContext.event.keyCode;
    var X = kTopContext.event.shiftKey;
    var W = kTopContext.event.ctrlKey;
    switch(Y){
        case 9 : 
            gCellClickFocused = false;
            pressEdit(0, (X ?- 1 : 1), true);
            break;
        case 13 : 
            gCellClickFocused = false;
            pressEdit((X ?- 1 : 1), 0);
            break;
        case 27 : 
            gCellClickFocused = false;
            contextualMenu.releaseCapture();
            contextualMenu.style.visibility = "hidden";
            fetchEdit();
            break;
        case 35 : 
            break;
        case 36 : 
            break;
        case 37 : 
            if(W || X);
            else if(gCellClickFocused);
            else
                pressEdit(0 ,- 1);
            break;
        case 39 : 
            if(W || X);
            else if(gCellClickFocused);
            else
                pressEdit(0 ,+ 1);
            break;
        case 38 : 
            gCellClickFocused = false;
            if(W || X);
            else
                pressEdit( - 1, 0);
            break;
        case 40 : 
            gCellClickFocused = false;
            if(W || X);
            else
                pressEdit( + 1, 0);
            break;
        default : 
            touchEdit();
            break;
    }
    return;
}
function ShowSummary(){
    if(gAppId != ''){
        var Z = bestWindowSize(650, 530);
        var Y = kRootUrl + gFileSummaryScript + "?read=true&id=" + escape(gAppId);
        var X = window.open(Y, "summaryWin", 'width=' + Z.width + ',height=' + Z.height + ',resizable,scrollbars');
        X.focus();
    }
}
function ReopenInEditor(Z){
    if(Z){
        gSaveFollowUp = "ReopenInEditor(false);";
        ss_save();
    }
    else{
        gSpreadsheetDirty = false;
        var Y = window.location.href.replace(/mode=[^&]+&?/, "");
        Y += "&mode=d";
        window.location.href = Y;
    }
}
function EditAsSpreadsheet(){
    if(cl_dirty())
        hb_confirm(getString("strSaveBeforeEdit"), getString("strEditSpreadsheet"), getString("strSave"), getString("strDontSave"), getString("strCancel"), "ReopenInEditor(true)", "ReopenInEditor(false)", "");
    else
        ReopenInEditor(false);
}
function Cut(){
    document.execCommand("cut");
}
function Copy(){
    document.execCommand("copy");
}
function Paste(){
    document.execCommand("paste");
}
function Clear(){
    var Z = document.selection.createRange().text;
    if(Z != "")
        document.selection.clear();
}
function SelectAll(){
    var Z = getElement("edit");
    var Y = Z.createTextRange();
    Y.select();
}
function revertOverride(){
    if(isOverridden(gEditCell.cellData)){
        delete gEditCell.cellData.override;
        RebuildCell(gEditCell);
        refreshEdit(gEditCell);
        gSpreadsheetDirty = true;
    }
}
function HandleButtons(Z){
    switch(Z){
        case 'btnSave' : 
            ss_save();
            break;
        case 'btnPrint' : 
            orientationPrompt();
            break;
        case 'btnEmail' : 
            var Y = 0;
            if(gIsMatterhorn){
                if(aasGetCurrVisibility() == "private"){
                    Y = 1;
                }
            }
            ShowEmailSpreadsheet(gAppId ,! gSpreadsheetDirty, Y);
            break;
        case 'btnInstruction' : 
            ShowSummary();
            break;
        case 'btnEdit' : 
            EditAsSpreadsheet();
            break;
        case 'btnRate' : 
            RateSheet(gAppId);
            break;
        default : 
            alert("[" + Z + "] " + getString("strAfterBeta"));
    }
}
function GenerateContextualMenu(){
    var Z = [{
        id : 'cmdCut', str : 'strCut'
    }, 
    {
        id : 'cmdCopy',
        str : 'strCopy'
    }, 
    {
        id : 'cmdPaste',
        str : 'strPaste'
    }, 
    {
        id : 'cmdClear',
        str : 'strClear'
    }, 
    {
        id : 'cmdSelectAll',
        str : 'strSelectAll'
    }, 
    {
        id : 'separator'
    }, 
    {
        id : 'cmdRevert',
        str : 'strRevert'
    }];
    return makeContextualMenu(Z, "onclick='clickContext();' oncontextmenu='return false'");
}
function showContextMenu(Z){
    kTopContext.event.cancelBubble = true;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return false;
    if(Y.id == "edit"){
        if(gRightClickInvokedEdit)
            Y.select();
        gRightClickInvokedEdit = false;
        if(isOverridden(gEditCell.cellData)){
            cmdRevert.style.visibility = "inherit";
            contextualMenu.style.height = 106;
        }
        else{
            cmdRevert.style.visibility = "hidden";
            contextualMenu.style.height = 84;
        }
        contextualMenu.style.posLeft = event.clientX;
        contextualMenu.style.posTop = event.clientY - 20;
        contextualMenu.style.visibility = "visible";
        contextualMenu.setCapture();
    }
    else{
        clickContext();
    }
    return false;
}
function clickContext(){
    switch(window.event.srcElement.id){
        case "cmdCut" : 
            Cut();
            break;
        case "cmdCopy" : 
            Copy();
            break;
        case "cmdPaste" : 
            Paste();
            break;
        case "cmdClear" : 
            Clear();
            break;
        case "cmdSelectAll" : 
            SelectAll();
            break;
        case "cmdRevert" : 
            revertOverride();
            break;
        default : 
            break;
    }
    contextualMenu.releaseCapture();
    contextualMenu.style.visibility = "hidden";
}
var gRightClickInvokedEdit = false;
function mouseDownDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    kTopContext.event.cancelBubble = true;
    gTracking = "none";
    gTrackingElement = null;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return;
    if( ! insideMenu(Y))
        exceptMenu(null);
    Y = ContentsToCell(Y);
    if(getClass(Y) == "edit"){
        gCellClickFocused = true;
    }
    var X = getClass(Y);
    switch(X){
        case "cell" : 
            Y = FindMouseElement(kTopContext.event, Y);
            if(event.button == 2)
                gRightClickInvokedEdit = (Y != gEditCell);
            var W = clickEdit(Y);
            break;
        case "button" : 
            offsetButton(Y, 2, "#A7A7A7");
            gTracking = "button";
            gTrackingElement = Y;
            break;
        case "palette" : 
            break;
        case "popupWidget" : 
            MenuToggle(Y, 2);
            var V = popupMenuList;
            if( ! getVisible(V)){
                var U = Y.parentElement;
            }
            exceptMenu(V);
            toggleMenu(V);
            break;
    }
    return false;
}
function mouseMoveDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    kTopContext.event.cancelBubble = true;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return;
    if(getClass(Y) == "edit")
        return;
    Y = ContentsToCell(Y);
    Y = FindMouseElement(kTopContext.event, Y);
    switch(gTracking){
        case "button" : 
            if(gTrackingElement){
                if(Y == gTrackingElement)
                    offsetButton(gTrackingElement, 2, "#A7A7A7");
                else
                    offsetButton(gTrackingElement, 1);
            }
            break;
        case "cell" : 
        case "palette" : 
            break;
    }
    return false;
}
function mouseUpDocument(Z){
    var Y = false;
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    kTopContext.event.cancelBubble = true;
    var X = kTopContext.event.srcElement;
    if( ! gIsMatterhorn){
        if(X.id == "bulbLogo"){
            window.open(kRootUrl);
            return;
        }
    }
    if(X == null){
        gTracking = "none";
        gTrackingElement = null;
        return;
    }
    X = ContentsToCell(X);
    X = FindMouseElement(kTopContext.event, X);
    switch(getClass(X)){
        case "popupWidget" : 
            MenuToggle(X, 1);
            break;
        case "smallItem" : 
            exceptMenu(null);
            unhighlightSmallMenuItem(X);
            if(is.nav)
                popupItemSelected();
            break;
    }
    switch(gTracking){
        case "button" : 
            if(X != gTrackingElement){
                if(gTrackingElement)
                    offsetButton(gTrackingElement, 0);
                break;
            }
            if(getValue(X) == "true")
                offsetButton(X, 2);
            else
                offsetButton(X, 1);
            HandleButtons(X.id);
            break;
        case "cell" : 
        case "palette" : 
            break;
    }
    gTracking = "none";
    gTrackingElement = null;
    return Y;
}
function resizeDocument(){
    setTimeout('documentSize();', 0);
}
function documentSize(){
    sizeDocument();
}
function BuildCellMatrix(){
    var Z = 0;
    BuildSomeRows(Z);
}
var gLoadTimer = null;
function BuildSomeRows(Z){
    if(Z < gRowCount){
        var Y = 0.05;
        var X = Z + 20;
        while((Z < X) && (Z < gRowCount)){
            var W = getChildren(getElement("row" + Z));
            var V = gCellElemMatrix[Z];
            var U = 0;
            for(var T = 0; T < gColumnCount; T ++ ){
                if(V[T] >- 1){
                    setExtra((V[T] = W[U ++ ]), "m_name", index2name(Z, T, 0));
                }
            }
            Z ++ ;
        }
        Y = 0.05 + (Z / gRowCount * .20);
        hb_progress(getString("strLoadingCalc"), getLoadingString("strSpreadsheetLoad1a"), Y);
        gLoadTimer = setTimeout("BuildSomeRows(" + Z + ")", 0);
    }
    else{
        hb_progress(getString("strLoadingCalc"), getLoadingString("strSpreadsheetLoad1b"), 0.30);
        gLoadTimer = setTimeout("loadDocument3()", 0);
    }
}
function InitRestoreData(Z){
    var Y = 0.5;
    if((gCellDataArray) && (Z < gCellDataArray.length)){
        var X = Z + (is.ie5up ? 40 : 20);
        while((Z < X) && (Z < gCellDataArray.length)){
            initCell(Z);
            Z ++ ;
        }
        Y = 0.5 + (Z / gCellDataArray.length * .19);
        hb_progress(getString("strLoadingCalc"), getLoadingString("strSpreadsheetLoad4a"), Y);
        gLoadTimer = setTimeout("InitRestoreData(" + Z + ")", 0);
    }
    else{
        hb_progress(getString("strLoadingCalc"), getLoadingString("strSpreadsheetLoad4b"), 0.70);
        gLoadTimer = setTimeout("loadDocument5()", 0);
    }
}
function writeDocument(){
    var Z;
    gColWidths = new Array(gColumnCount);
    gColWidths.initToValue(kColumnSize);
    gRowHeights = new Array(gRowCount);
    gRowHeights.initToValue(kRowSize);
    GetColumnWidthsAndHeights(gColWidths, gRowHeights);
    gColWidths[0] = 3;
    gRowHeights[0] = 3;
    var Y = gRowHeights.sum();
    var X = gColWidths.sum();
    var W = Y + (kGutterHeight * 2) + 1;
    var V = X + (kGutterWidth * 2) + 1;
    var U = new Array();
    U.push("<span class='book' id='book' style='position:absolute;" + "top: 0; left: 0; " + "height: " + W + "; width: " + V + ";'>");
    gCellElemMatrix = new Array();
    for(var T = 0; T < gSheetCount; T ++ ){
        var S = kGutterHeight;
        var R = kGutterWidth;
        W = Y + 1;
        V = X + 1;
        U.push("<span class='sheet' id='sheet" + T + "' style='position:absolute;" + "top: " + S + "; left: " + R + "; height: " + W + "; width: " + V + ";'>");
        S = 0;
        var Q = 0;
        for(var P = 0; P < gRowCount; P ++ ){
            var O = gCellElemMatrix[P] = new Array();
            R = 0;
            W = gRowHeights[P];
            var N = new Array();
            N.push("<span id='row" + P + "' style='position:absolute; z-index:-2; clip: rect(0px " + (X + 1) + "px " + W + "px 0px); left:0; height:" + W + "; width:" + (X + 1) + "; top:" + S + ";'>\n");
            for(var M = 0; M < gColumnCount; M ++ ){
                var L = "cell";
                var K = "";
                var J = "overflow:visible;";
                V = gColWidths[M];
                O[M] =- 1;
                var I = InCellDataArray(P, M);
                if((P == 0) || I ||! Q){
                    if(I && I.i_nr){
                        var H = HTMLEncode(I.i_nr);
                        if( ! I._wrapText){
                            K = "<SPAN style='position:absolute; left:0'><NOBR>" + H + "</NOBR></SPAN>";
                            J = "overflow:visible;";
                        }
                        else{
                            K = H;
                            J = "overflow:hidden;";
                        }
                        J += " z-index: -1;";
                    }
                    N.push("<span class='" + L + "' " + "style='position:absolute; " + "top:0;left:" + R + ";height:" + W + ";width:" + V + ";" + J + "'>" + K + "</span>");
                    O[M] = Q ++ ;
                }
                R += V;
            }
            S += gRowHeights[P];
            N.push("</span>\n");
            U.push(N.join(""));
            var G = (P / gRowCount) * 0.05;
            hb_progress(getString("strLoadingCalc"), getLoadingString("strSpreadsheetLoad00"), G);
        }
        U.push("</span>");
        U.push("<textarea id='clipboardPrep' style='visibility:hidden;'></textarea>");
        U.push(GenerateContextualMenu());
    }
    U.push("<input class='edit' id='edit' type='text' value=''>");
    U.push("</span>");
    gDocument.all.view.innerHTML = U.join("");
    loadDocument2();
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();