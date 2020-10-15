//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kStrDocumentLower = getString("strDocumentSmall");
var kStrDocumentCapitalized = getString("strDocument");
if(typeof gDocumentTitleBase == "undefined")
    gDocumentTitleBase = " - " + getString("strInfoApp");
var gInLifeBoat = 0;
var kInputBegin = '<input type="hidden" name="';
var kInputMiddle = '" value="';
var kInputEnd = '">';
function makeInputString(Z, Y){
    return kInputBegin + Z + kInputMiddle + Y + kInputEnd;
}
function makeHeaderString(Z, Y, X, W){
    var V = "";
    if(Z)
        V += makeInputString('appId', Z);
    if(Y)
        V += makeInputString('copiedFromAppId', Y);
    var U = fixQuotes(X);
    V += makeInputString('fileDescription', (U == null ? "" : U));
    V += makeInputString('auth', gAppAuthor);
    V += makeInputString('version', gAppVersion);
    V += makeInputString('mode', kMode);
    V += makeInputString('visibility', (W == null ? "" : W));
    V += makeInputString('appLocale', gAppLocale);
    if(typeof gAASApplicationName != "undefined")
        V += makeInputString('aasApplicationName', gAASApplicationName);
    if(typeof gAASBloxName != "undefined")
        V += makeInputString('aasBloxName', gAASBloxName);
    return V;
}
var gSaveTimeout = null;
var gSaveStr = '';
var gSaveStrPartial = null;
var gSaveFollowUp = null;
var gCloseAfterSave = false;
function saveDocument(Z, Y, X, W){
    if( ! window.frames.saveFrame.saveForm)
        window.frames.saveFrame.location.href = kRootUrl + gSaveFrameFile;
    if( ! gIsMatterhorn){
        if( ! isLoggedIn()){
            delaySaveUntilLogin(Z, Y, X);
            return;
        }
        if(Z){
            var V = getMemberInfo();
            if(V && V.id != gOwnerId){
                openSaveAs(gInLifeBoat, 1);
                return;
            }
        }
    }
    else{
        if(Z && gVisibilityOptions.findIgnoreCase(aasGetCurrVisibility()) ==- 1){
            openSaveAs(gInLifeBoat, 1);
            return;
        }
    }
    gSaveStr = makeHeaderString(Z, Y, X, W);
    if(gSaveStrPartial != null){
        gSaveStr += gSaveStrPartial;
        hb_progress(getString("strSavingSpreadsheet"), getString("strCommunicating") + "...", 0.6);
        setSaveTimeout("submitDocument()");
    }
    else{
        var U = [{
            type : 'other', value : getString("strCancel"),
            onclick : 'cancelSave()'
        }];
        hb_progress(getString("strSavingCmp", kDefaultLocale, kStrDocumentLower), getString("strProcessingData") + "...", 0.2, U);;
        setSaveTimeout("saveDocumentBody()");
    }
}
var gSaver;
function submitDocument(){;
    var Z = gSaveStr;
    var Y = gSaveScript ? ((gIsMatterhorn ? kRootUrl : '/') + gSaveScript) : null;;
    gSaver = window.frames.saveFrame;
    if( ! gSaver.saveForm){
        gSaver.location.href = addCharsetHint(kRootUrl + gSaveFrameFile, "UTF-8");
        hb_progress(getString("strSavingCmp", kDefaultLocale, kStrDocumentLower), getString("strTryingAgain") + "...", 0.6);
        setSaveTimeout("submitDocument()", 1000);
        return;
    }
    gSaver.saveForm.innerHTML = Z;
    gSaver.saveForm.action = addCharsetHint(Y, "UTF-8");
    gSaver.submitIt();
    gSaveStr = '';
    hb_progress(getString("strSavingCmp", kDefaultLocale, kStrDocumentLower), getString("strCommunicating") + "...", 0.8);
}
function releaseSave(Z){
    if(typeof dirtyDocument == 'function')
        dirtyDocument(false);
    if(Z == null || Z == ""){
        hb_progress(getString("strSavingCmp", kDefaultLocale, kStrDocumentLower), getString("strSavingDoneCmp", kDefaultLocale, kStrDocumentCapitalized), 1);
        setTimeout('hb_progress("", "", null)', 1000);
        if(typeof kFromGallery != 'undefined' && kFromGallery && typeof btnRate != 'undefined'){
            setVisible(btnRate, false);
            setVisible(btnRateText, false);
            setVisible(break5, false);
            kFromGallery = false;
        }
        if(typeof gDerivedFrom != 'undefined' && gDerivedFrom){
            if(typeof btnInstruction != 'undefined'){
                setVisible(btnInstruction, true);
                setVisible(btnInstructionText, true);
                setVisible(break3, true);
            }
            if(typeof btnEdit != 'undefined'){
                setVisible(btnEdit, true);
                setVisible(btnEditText, true);
                setVisible(break4, true);
            }
            if(typeof btnEmail != 'undefined')
                setVisible(btnEmail, true);
            if(typeof btnEmailText != 'undefined')
                setVisible(btnEmailText, true);
        }
        var Y = getMemberInfo();
        if(Y)
            gOwnerId = Y.id;
        document.title = gAppDescription + gDocumentTitleBase;
    }
    else{
        alert(getString("strSaveFailed") + "\n\n" + Z);
        hb_progress("", "", null);
    }
    if(gSaveFollowUp)
        setTimeout(gSaveFollowUp, 1001);
    if(gCloseAfterSave)
        setInterval('window.close()', 1002);
    gSaveFollowUp = null;
}
function cancelSave(){
    var Z = window.frames.saveFrame;
    if(typeof cancelSaveDocument == "function")
        cancelSaveDocument();
    if(kTopContext.event && kTopContext.event.ctrlKey){
        var Y = window.open('', 'debugWin', 'resizable,scrollbars');
        Y.ownerDocument.write(Z.ownerDocument.body.outerHTML);
        Y.ownerDocument.close();
        return;
    }
    gSaveTimeout = killTimeout(gSaveTimeout);
    gSaveStr = '';
    if(Z.stop)
        Z.stop();
    Z.ownerDocument.write('');
    Z.ownerDocument.close();
    hb_progress("", "", null);
}
function setSaveTimeout(Z, Y){
    gSaveTimeout = killTimeout(gSaveTimeout);
    gSaveTimeout = setTimeout(Z, Y ? Y : 0);
    return gSaveTimeout;
}
if(typeof gVisibilityOptions == "undefined" || gVisibilityOptions.length == 0)
    var gVisibilityOptions = new Array("public", "private");
function getVisibilityString(Z){
    if(Z == "public"){
        return getString("strPublicSmall");
    }
    else if(Z == "private"){
        return getString("strPrivateSmall");
    }
    return Z;
}
function openSaveAs(Z, Y){
    var X = gAppDescription;
    if(X){
        if(gImported)
            Y = 1;
        if(gAppId &&! Y)
            X = getString("strDocumentCopyCmp", kDefaultLocale, X);
    }
    else
        X = getString("strDumbFileNameCmp", kDefaultLocale, kStrDocumentCapitalized);
    var W = "";
    if(gIsMatterhorn){
        var V = "";
        for(var U = 0; U < gVisibilityOptions.length; U ++ )
            V += '<option value="' + gVisibilityOptions[U] + '">' + getVisibilityString(gVisibilityOptions[U]) + '</option>';
        W = '<div style="white-space: nowrap; text-align:right;">' + "<nobr>" + getString("strVisibility") + ' <select id=visPop style="width:188px">' + V + '</select></nobr></div>';
    }
    var T = [{
        type : 'input', id : 'filenameEntry',
        label : getString("strFilename"),
        value : X,
        size : 25,
        maxlength : 200
    }, 
    {
        type : 'raw',
        value : W
    }];
    var S = Z ? [{
        type : 'accept', value : getString("strSave")
    }] : [{
        type : 'accept',
        value : getString("strSave")
    }, 
    {
        type : 'cancel'
    }];
    openModal('save_as', getString("strSaveAs"), "validateSaveAs()", "acceptSaveAs()", Z ? "" : "closeModal()", T, S, "filenameEntry");
}
function validateSaveAs(){
    var Z = getElement("filenameEntry");
    var Y = getValue(Z);
    if(Y.length == 0){
        Z.select();
        return getString("strNoFilename");
    }
    return false;
}
function acceptSaveAs(){
    closeModal();
    var Z = getValue(getElement("filenameEntry"));
    gAppDescription = Z;
    var Y = (gIsMatterhorn) ? visPop.value : null;
    saveDocument(null, gAppId, gAppDescription, Y);
}
function delaySaveUntilLogin(Z, Y, X){
    gDelay_toAppId = Z;
    gDelay_fromAppId = Y;
    gDelay_description = X;
    setTimeout('openLogin()', 0);
    setTimeout('openLoginModal()', 10);
}
function openLoginModal(){
    var Z;
    var Y = getString("strDontSave");
    var X;
    if(isMember()){
        Z = getString("strLoginNow");
        X = getString("strLoginBeforeSaveCmp", kDefaultLocale, kStrDocumentLower);
    }
    else{
        Z = getString("strJoinNow");
        X = getString("strSignUpBeforeSaveCmp", kDefaultLocale, kStrDocumentLower);
    }
    var W = [{
        type : "accept", value : Z
    }, 
    {
        type : "cancel",
        value : Y
    }];
    var V = [{
        type : 'raw', value : X
    }];
    openModal("login", getString("strSavingCmp", kDefaultLocale, kStrDocumentLower), "", "openLogin()", "closeModal()", V, W);
}
function openLogin(){
    var Z;
    var Y;
    if(isMember()){
        Z = kRootUrl + 'login';
        Y = window.open(Z, "loginThenSave", "resizable,scrollbars,statusbar");
    }
    else{
        Z = kRootUrl + 'join?whyjoin=1';
        Y = window.open(Z, "ad", "width=545,height=320,resizable");
    }
}
function resumeSaveAfterLogin(){
    var Z = gDelay_toAppId;
    var Y = gDelay_fromAppId;
    var X = gDelay_description;
    gDelay_toAppId = "";
    gDelay_fromAppId = "";
    gDelay_description = "";
    closeModal();;
    saveDocument(Z, Y, X);
}
function cancelDelayedSave(){
    gDelay_toAppId = "";
    gDelay_fromAppId = "";
    gDelay_description = "";
    closeModal();
}
function openLifeboat(Z){
    if(Z == null)
        Z = false;;
    gSaveStr = '';
    saveDocumentBody(true);
    var Y;
    var X = (gIsMatterhorn) ? 180 : 160;
    if(Z)
        Y = window.open("", "", "width=350,height=" + X + ",status:no,scrollbars:no");
    else
        Y = window.open(kRootUrl + gSaveLifeboat, "", "width=425,height=" + X + ",status:no,scrollbars:no");
    Y.__kRootUrl = kRootUrl;
    Y.__kMode = kMode;
    Y.__kSaveHostname = kSaveHostname;
    Y.__gOwnerId = gOwnerId;
    Y.__gImported = gImported;
    Y.__gAppId = gAppId + '';
    if(typeof gDerivedFrom != 'undefined')
        Y.__gDerivedFrom = gDerivedFrom + '';
    else
        Y.__gDerivedFrom = null;
    Y.__gAppDescription = gAppDescription + '';
    Y.__gAppVersion = gAppVersion;
    Y.__gAppAuthor = gAppAuthor;
    Y.__gCloseAfterSave = true;
    Y.__gSaveStrPartial = gSaveStr + '';
    Y.__gSaveSafe = Z;
    Y.__gSaveScript = gSaveScript;
    Y.__gSaveLifeboat = gSaveLifeboat;
    Y.__gSaveFrameFile = gSaveFrameFile;
    Y.__gIsMatterhorn = gIsMatterhorn;
    Y.__gAppLocale = gAppLocale;
    if(typeof gAASApplicationName != 'undefined')
        Y.__gAASApplicationName = gAASApplicationName;
    if(typeof gAASBloxName != 'undefined')
        Y.__gAASBloxName = gAASBloxName;
    if(typeof gVisibilityOptions != 'undefined')
        Y.__gVisibilityOptions = gVisibilityOptions.join(",");
    if(typeof window.hb_directory != 'undefined')
        Y.__hb_directory = window.hb_directory;
    Y.focus();
}
var gPrintWindow = null;
var gPrintWidth,
gPrintHeight;
var gPrintContents = null;
var gPrintStyles = null;
var gPrintDirty = false;
function ShowPrintable(Z, Y, X, W, V){
    gPrintContents = Z;
    gPrintWidth = Math.max(500, X + 16);
    gPrintHeight = Math.max(300, W + 16);
    var U = bestWindowSize(gPrintWidth, gPrintHeight);
    gPrintWidth = U.width;
    gPrintHeight = U.height;
    gPrintStyles = Y;
    if( ! gPrintStyles)
        gPrintStyles = [(typeof gPrintCSS == "undefined" ? 'css/calculator_ie4.css' : gPrintCSS)];
    else if(typeof gPrintStyles == 'string')
        gPrintStyles = [gPrintStyles];
    gPrintDirty = V ? V : false;
    ShowPrintableIE();
    if(kMode == "design" && typeof(cancelEntryFieldRefocus) != "undefined")
        blockNextEntryFieldRefocus();
}
var gIE4PrintText = "IE4Print = function () {\n" + "var printObjText = '<OBJECT ID=\"WBPrintObj\"; WIDTH=0 HEIGHT=0 CLASSID=\"CLSID:8856F961-340A-11D0-A96B-00C04FD705A2\"></OBJECT>';\n" + "document.body.insertAdjacentHTML('beforeEnd', printObjText);\n" + "var oldHandler = window.onerror;\n" + "window.onerror = cleanUp;\n" + "WBPrintObj.ExecWB(6, 1);\n" + "WBPrintObj.outerHTML = \"\";\n" + "window.onerror = oldHandler;\n" + "function cleanUp() {\n" + "WBPrintObj.outerHTML = \"\";\n" + "window.onerror = oldHandler;\n" + "return true;\n" + "}\n" + "}\n";
function ShowPrintableIE(){
    var Z = is.ie4 ? (kRootUrl + gOpenScript + "?new=bl&title=" + fixQuotes(gAppDescription)) : "";
    gPrintWindow = window.open(Z, "printWin", 'width=' + gPrintWidth + ',height=' + gPrintHeight + ',resizable,scrollbars,menubar,toolbar');
    if(gPrintWindow){
        if(is.ie4)
            setTimeout('StartPrintableIE();', 1000);
        else
            StartPrintableIE();
    }
}
function StartPrintableIE(){
    if( ! gPrintWindow)
        return;
    var Z = gAppDescription;
    if((Z == null) || (Z == ""))
        Z = document.title;
    var Y = '<HTML><HEAD><TITLE>' + Z + '</TITLE>\n';
    if(gPrintStyles)
        for(var X = 0; X < gPrintStyles.length; ++ X)
            Y += '<link rel="stylesheet" type="text/css" href="' + kRootUrl + gPrintStyles[X] + '"/>\n';
    Y += '</HEAD><BODY>';
    if(is.ie4)
        Y += '<B>' + getString("strPreparingPrinting") + '...</B>';
    Y += '</BODY></HTML>';
    gPrintWindow.ownerDocument.open();
    gPrintWindow.ownerDocument.write(Y);
    gPrintWindow.ownerDocument.close();
    if(is.ie4)
        setTimeout('FinishPrintableIE();', 1000);
    else
        FinishPrintableIE();
}
function FinishPrintableIE(){
    if( ! gPrintWindow)
        return;
    if(is.ie4){
        gPrintWindow.printContents = gPrintContents;
        gPrintWindow.gIE4PrintText = gIE4PrintText;
        gPrintWindow.setTimeout("document.body.innerHTML=printContents;setTimeout('eval(gIE4PrintText);IE4Print();',1000)", 1000);
    }
    else{
        gPrintWindow.ownerDocument.body.innerHTML = gPrintContents;
        gPrintWindow.showContextual = new Function("", "");
        SafeEval("nukeHiddenText();");
        SafeEval("addPageBreaks();");
        if(is.ie5up){
            if(WindowIsValid(gPrintWindow))
                gPrintWindow.focus();
            if(WindowIsValid(gPrintWindow))
                gPrintWindow.print();
        }
        else
            alert(getString("strBrowserPrint"));
    }
    gPrintWindow = null;
}
function nukeHiddenText(){
    var Z = gPrintWindow.ownerDocument.body.children[0].children;
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y].children;
        setStyle(Z[Y], "overflow", "hidden");
        for(var W = 0; W < X.length; W ++ ){
            if((X[W].style.color != "") && (X[W].style.color == X[W].style.backgroundColor))
                X[W].innerText = "";
        }
    }
}
function addPageBreaks(){
    var Z = (kMode == "design") ? gPrintWindow.ownerDocument.body.children[0].children : gPrintWindow.ownerDocument.body.children;
    var Y = 0;
    var X = (gPrintOrientation == "portrait") ? 880 : 585;
    var W = "<div style='page-break-after:always;'>";
    for(var V = (kMode == "design") ? 1 : 0; V < Z.length; V ++ ){
        if(Z[V].id.search(/^row\d+/) !=- 1){
            if((Y + parseInt(Z[V].style.height)) > X){
                W += "</div><div style='page-break-after:always;'>";
                Y = 0;
            }
            Z[V].style.top = 0;
            W += "<span  style='position:relative; left: " + ((kMode == "design") ?- 70 : 0) + "px; width:" + gPrintWidth + "; height:" + Z[V].style.height + "'>" + Z[V].outerHTML + "</SPAN>";
            Y += parseInt(Z[V].style.height);
        }
    }
    W += "</div>";
    gPrintWindow.ownerDocument.body.innerHTML = W;
}
function filterLink(Z, Y){
    var X = Z.srcElement;
    if((X.tagName == "IMG") && X.parentElement && (X.parentElement.tagName == "A")){
        X = X.parentElement;
    }
    if(X.tagName == "A"){
        if( ! Y && (X.target != "_blank"))
            X.target = "_blank";
        return true;
    }
    return false;
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();