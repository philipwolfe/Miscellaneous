//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kScrollHeight = 20;
var kScrollWidth = 20;
var kDividerWidth = 6;
var kDividerOverlap = 1;
var kToolStripWidth = 28;
var kEditMode = "editing";
var kSortMode = "sorting";
var kShowMode = "showing";
var kPaperHeight = 8.5 * 100;
var kPaperWidth = 11 * 100;
var kPageHeight = 7 * 100;
var kPageWidth = 9.75 * 100;
var gHeaderList = new Array();
var gFooterList = new Array();
var gPageMode = null;
var gMouseDownElement = null;
var gTrackKind = "none";
var gTrackItem = null;
var gTrackMenu = null;
var gTrackNextX = 0;
var gTrackNextY = 0;
var gTrackPrevX = 0;
var gTrackPrevY = 0;
var gTrackRestrain = null;
var gTrackEditorWasOpen = false;
var gTrackBounds = null;
var gTrackLimits = null;
var gInitialized = false;
var gUnloadHandled = false;
var gEditorSelection = null;
var gEditorInsertionTimeout = null;
function loadDocument(){
    var Z = ("window" + Math.random()).replace(/\./gi, "");
    window.name = Z;
    AddToWindList(Z, "pr");
    if(is.ie4 && (gAppId != ""))
        hb_progress(getString("strMrSmartySays"), getString("strLoadingPresentation") + "...", .5);
    platformInit();
    if(typeof(kMode) == "undefined")
        kMode = "design";
    kStrDocumentLower = getString("strPresentationSmall");
    kStrDocumentCapitalized = getString("strPresentation");
    gDocument.onkeydown = keyDownDocument;
    gDocument.onkeypress = keyPressDocument;
    gDocument.onkeyup = keyUpDocument;
    gDocument.onmouseover = mouseOverDocument;
    gDocument.onmouseout = mouseOutDocument;
    gDocument.onmousedown = mouseDownDocument;
    gDocument.onmousemove = mouseMoveDocument;
    gDocument.onmouseup = mouseUpDocument;
    gDocument.onclick = singleClickDocument;
    gDocument.ondblclick = doubleClickDocument;
    gDocument.onselectstart = selectStartDocument;
    gDocument.onselect = selectTrackDocument;
    gDocument.oncontextmenu = contextMenuDocument;
    if((is.ie4) && ( ! getPref('iLoveIE4'))){
        var Y = getString("strIE5Better");
        var X = [{
            type : 'raw', value : Y
        }];
        var W = [{
            type : 'other', value : getString("strDontRemind"),
            onclick : "iLoveIE4()"
        }, 
        {
            type : 'cancel',
            value : getString("strContinue")
        }, 
        {
            type : 'accept',
            value : getString("strUpgrade")
        }];
        openModal('ie4alert', getString("strMrSmartySays"), null, "UpgradeToIE5()", "closeModal()", X, W, null);
    }
    if(typeof(kFromGallery) == "undefined")
        kFromGallery = false;
    if(kMode != "design" && gSlideData != null)
        delete(gSlideData.context);
    var V = setupModel(gSlideData);
    setupScrap();
    setupContext(gSlideData ? gSlideData.context : null, prUberCallback);
    setupRender();
    setupDivider();
    setupInsert();
    setupHandle();
    setupEditor();
    gInitialized = true;
    var U = getElement("topDivision");
    if(U)
        gHeaderList[gHeaderList.length] = U;
    U = getElement("menuPalette");
    if(U)
        gHeaderList[gHeaderList.length] = U;
    U = getElement("menuDivision");
    if(U)
        gHeaderList[gHeaderList.length] = U;
    U = getElement("iconPalette");
    if(U)
        gHeaderList[gHeaderList.length] = U;
    U = getElement("iconDivision");
    if(U)
        gHeaderList[gHeaderList.length] = U;
    U = getElement("footPalette");
    if(U)
        gFooterList[gFooterList.length] = U;
    U = getElement("footDivision");
    if(U)
        gFooterList[gFooterList.length] = U;
    if(kMode == "design"){
        attachMenu("fileMenu", "fileSpot", "fileList");
        attachMenu("editMenu", "editSpot", "editList");
        attachMenu("slideMenu", "slideSpot", "slideList");
        attachMenu("insertMenu", "insertSpot", "insertList");
        attachMenu("toolsMenu", "toolsSpot", "toolsList");
        attachMenu("helpMenu", "helpSpot", "helpList");
        attachMenu("fontMenu", "fontSpot", "fontList");
        attachMenu("sizeMenu", "sizeSpot", "sizeList");
        attachMenu("fillColorMenu", "fillColorMenuSpot", "fillColorList");
        attachMenu("lineColorMenu", "lineColorMenuSpot", "lineColorList");
        attachMenu("fontColorMenu", "fontColorMenuSpot", "fontColorList");
        attachMenu("lineMenu", "lineSpot", "lineList");
    }
    attachMenu("jumpMenu", null, "jumpList");
    setTimeout("buildJumpMenu()", 100);
    if(WindowIsValid(opener) && opener.hb_directory)
        window.hb_directory = opener.hb_directory;
    if(gSlideData == null){
        var T = newDocument();
        if(T)
            V = T.index;
    }
    else{
        if(gSlideData.context)
            delete(gSlideData.context);
    }
    if(kMode == "design")
        setTimeout("modeDocument( kEditMode, '" + V + "' )", 0);
    else
        setTimeout("modeDocument( kShowMode, 'slides' )", 0);
    if(is.ie4 && getPref('iLoveIE4'))
        setTimeout("hb_progress( '', '' )", 0);
}
function finishDocument(){
    finishEditor();
    finishHandle();
    finishInsert();
    finishDivider();
    finishRender();
    finishContext();
    finishScrap();
    finishModel();
}
function unloadDocument(){
    if(typeof deleteFromWindList != "undefined")
        deleteFromWindList(window.name);
    if((typeof gInitialized == "undefined") || ( ! gInitialized))
        return;
    if(gUnloadHandled)
        return;
    var Z;
    if(changedContext()){
        var Y = gLocaleSaveCloseBoxSize[gAppLocale][0];
        if(is.ie4)
            Y += 20;
        var X = gLocaleSaveCloseBoxSize[gAppLocale][1];
        Z = window.showModalDialog(kRootUrl + gCloseBoxFile, null, "dialogWidth:" + X + "px; dialogHeight:" + Y + "px; center:yes; status:no;");
        if(Z)
            openLifeboat();
    }
    finishDocument();
    gUnloadHandled = true;
}
function newDocument(){
    var Z = getModel();
    var Y = createModel("folder", kSlidesName);
    var X = createModel("folder", kMastersName);
    insertModel(Y, Z, false);
    insertModel(X, Z, false);
    var W = slideUtility(getString("strBasicMaster"), true, true, true);
    W.opened = false;
    var V = slideUtility(getString("strTitleMaster"), true, false);
    insertModel(W, X, false);
    insertModel(V, X, false);
    var U = slaveModel(W);
    entryModel(U, "");
    insertModel(U, Y, false);
    return U;
}
function closeDocument(){
    window.close();
}
var kSkipKeys = 
{
    "parent" : 1
};
var kDefaultKeys = 
{
    "selected" : false, "opened" : false
};
var kSkipPrefix = "_";
var gDataStr = "";
var gSaveTotal;
var gSaveCount;
var gSaveIncr;
var gSaveRestoreLevel = null;
function saveObject(Z, Y, X, W){
    if(Y == null){
        if(X && X.depth != null)
            Y = X.depth;
        else
            Y = 0;
    }
    if(W == null){
        if(X == null)
            X = new Object();
        if(X.stopCount == null)
            X.stopCount = 0;
        else
            X.accum = false;
        if(X.accum == null)
            X.accum = true;
        X.saveString = "";
        X.scanCount = 0;
    }
    switch(typeof(Z)){
        case "undefined" : 
            if(X.accum)
                X.saveString += "null";
            break;
        case "boolean" : 
        case "number" : 
            X.saveString += Z + "";
            break;
        case "string" : 
            X.saveString += '"' + escapeEntities(escapeText(Z)) + '"';
            break;
        case "function" : 
            var V = Z.toString().match(/(function )[\s]*([\w]+)([.]*)/);
            if(V && V[2])
                X.saveString += '"' + (V[2]) + '"';
            else
                X.saveString += "null";
            break;
        case "object" : 
            if(Z == null){
                if(X.accum)
                    X.saveString += "null";
            }
            else if(Z.constructor == Array){
                if(X.accum)
                    X.saveString += "[ ";
                var U = (Z[0] != null) && (typeof(Z[0]) == "object");
                var T = true;
                var S = false;
                if(X && X.stopKey && U && Z[0][X.stopKey] == X.stopValue){
                    X.scanCount ++ ;
                    if(X.accum)
                        X.saveString += "\n";
                    if(X.scanCount > X.stopCount){
                        X.accum = false;
                        X.depth = Y;
                    }
                    else if(X.scanCount == X.stopCount)
                        S = true;
                    if( ! X.accum)
                        T = false;
                }
                if(T){
                    for(var R = 0; R < Z.length; R ++ ){
                        if(X.accum){
                            if(R > 0)
                                X.saveString += ", ";
                            if(U)
                                X.saveString += "\n";
                        }
                        if(X.accum || U)
                            saveObject(Z[R], Y + 1, X, true);
                    }
                }
                if(S)
                    X.accum = true;
                if(X.accum)
                    X.saveString += " ]";
            }
            else{
                if(X.accum){
                    for(var Q = Y; Q > 0; -- Q)
                        X.saveString += " ";
                    X.saveString += "{ ";
                }
                var P = 0;
                for(var O in Z){
                    if((O.indexOf(kSkipPrefix) != 0) && (kSkipKeys[O] == null) && ((kDefaultKeys[O] == null) || (kDefaultKeys[O] != Z[O])) && (typeof(Z[O]) != "object")){
                        P ++ ;
                        if(X.accum){
                            if(P > 1)
                                X.saveString += ", ";
                            X.saveString += O + ":";
                            saveObject(Z[O], Y + 1, X, true);
                        }
                    }
                }
                for(O in Z){
                    if((O.indexOf(kSkipPrefix) != 0) && (kSkipKeys[O] == null) && ((kDefaultKeys[O] == null) || (kDefaultKeys[O] != Z[O])) && (typeof(Z[O]) == "object")){
                        if(P ++> 0)
                            if(X.accum)
                                X.saveString += ", ";
                        if(X.accum)
                            X.saveString += O + ":";
                        if((Z[O] != null) && (Z[O].constructor != Array))
                            if(X.accum)
                                X.saveString += "\n";
                        saveObject(Z[O], Y + 1, X, true);
                    }
                }
                if(X.accum)
                    X.saveString += " }";
            }
            break;
        default : 
            if(X.accum)
                X.saveString += "null";
            break;
    }
    if(W == null){
        gDataStr += X.saveString;
        X.saveString = "";
        if(X.stopKey) ++ X.stopCount;
    }
}
function saveDocumentBody(Z){
    gDataStr = '';
    var Y = getModel();
    gSaveCount = gSaveTotal = 0;
    for(var X in gStore)
        if(gStore[X].kind == "slide") ++ gSaveTotal;
        if(gSaveTotal < 50)
            gSaveIncr = 1;
        else if(gSaveTotal < 500)
            gSaveIncr = 10;
        else if(gSaveTotal < 5000)
            gSaveIncr = 100;
        else
            gSaveIncr = 1000;
    if(gSaveTotal == 0)
        gSaveTotal = 1;
    if(Z){
        saveObject(Y);
        saveDocumentBodyFinish(true);
    }
    else
        gSaveTimeout = setTimeout("saveDocumentBodyContinue()", 0);
}
gStateInfo = null;
function saveDocumentBodyContinue(){
    var Z;
    if(gStateInfo == null){
        var Y = getModel();
        gStateInfo = 
        {
            "obj" : Y, "stopKey" : "kind",
            "stopValue" : "slide",
            "which" : "slides",
            "count" : 0
        };
        saveObject(gStateInfo.obj, 0, gStateInfo);
    }
    else if(gStateInfo.which == "slides"){
        if(gStateInfo.items == null){
            Z = descendModel(gStateInfo.obj, "folder", kSlidesName);
            if(Z)
                gStateInfo.items = Z.child;
            if(gStateInfo.items == null)
                gStateInfo.items = [];
            gStateInfo.count = 0;
        }
        if(gStateInfo.count < gStateInfo.items.length){
            if(gStateInfo.count)
                gDataStr += ", \n";
            saveObject(gStateInfo.items[gStateInfo.count], gStateInfo.depth); ++ gStateInfo.count; ++ gSaveCount;
        }
        if(gStateInfo.count >= gStateInfo.items.length){
            if(gStateInfo.items.length)
                saveObject(gStateInfo.obj, 0, gStateInfo);
            gStateInfo.which = "masters";
            gStateInfo.items = null;
            gStateInfo.count = 0;
        }
    }
    else if(gStateInfo.which == "masters"){
        if(gStateInfo.items == null){
            Z = descendModel(gStateInfo.obj, "folder", kMastersName);
            if(Z)
                gStateInfo.items = Z.child;
            if(gStateInfo.items == null)
                gStateInfo.items = [];
            gStateInfo.count = 0;
        }
        if(gStateInfo.count < gStateInfo.items.length){
            if(gStateInfo.count)
                gDataStr += ", \n";
            saveObject(gStateInfo.items[gStateInfo.count], gStateInfo.depth); ++ gStateInfo.count; ++ gSaveCount;
        }
        if(gStateInfo.count >= gStateInfo.items.length){
            if(gStateInfo.items.length)
                saveObject(gStateInfo.obj, 0, gStateInfo);
            gStateInfo = null;
            setSaveTimeout('saveDocumentBodyFinish();');
            return;
        }
    }
    if(gSaveCount % gSaveIncr == 0)
        hb_progress(getString("strSavingPresentation"), getString("strProcessingData") + "...", 0.2 + ((gSaveCount / gSaveTotal) * 0.6));
    setSaveTimeout('saveDocumentBodyContinue();');
}
function saveDocumentBodyFinish(Z){
    gSaveStr += makeInputString('slidedata', fixQuotes(gDataStr));
    gDataStr = "";
    if( ! Z)
        setSaveTimeout("submitDocument()");
}
function dirtyDocument(Z){
    if(Z)
        dirtyContext();
    else
        resetContext();
}
function cancelSaveDocument(){
    gDataStr = "";
}
var gSizeDocumentTimeout = null;
function sizeDocumentTimeout(){
    sizeDocument();
    gSizeDocumentTimeout = null;
}
function resizeDocument(){
    if(gSizeDocumentTimeout == null){
        gSizeDocumentTimeout = setTimeout('sizeDocumentTimeout();', 0);
    }
}
function modeDocument(Z, Y){
    if(Z == gPageMode)
        return;
    gPageMode = Z;
    sizeDocument(is.nav4);
    var X = index2model(Y);
    if(X == null)
        X = targetModel();
    if(Z == kEditMode){
        if(node2slide(X) == null)
            Y = "slides";
    }
    else{
        if(X)
            X = node2slide(X);
        Y = X ? X.index : "slides";
    }
    jumpUtility(Y);
}
function sizeDocument(Z){
    var Y = getBounds(document.body);
    var X = false;
    var W = false;
    var V = false;
    var U = false;
    var T = false;
    var S = false;
    var R = false;
    var Q = false;
    switch(gPageMode){
        case "editing" : 
            X = true;
            W = true;
            V = true;
            U = true;
            T = true;
            S = true;
            break;
        case "sorting" : 
            X = true;
            W = true;
            R = true;
            break;
        case "showing" : 
            Q = true;
            if(kMode != "design"){
                X = true;
                W = true;
            }
            break;
        default : 
            break;
    }
    var P = getShowing();
    var O = getSorting();
    var N = getOutline();
    var M = getDrawing();
    var L = getDivider();
    var K = getElement("outlinePalette");
    if(K)
        setVisible(K, U);
    var J,
    I;
    if(gHeaderList[0] && gHeaderList[0].style.pixelHeight == 0){
        for(J = 0; J < gHeaderList.length; J ++ )
            setHeight(gHeaderList[J], gHeaderList[J].offsetHeight);
        for(J = 0; J < gFooterList.length; J ++ )
            setHeight(gFooterList[J], gFooterList[J].offsetHeight);
        if(N)
            setWidth(N, N.offsetWidth);
        if(M)
            setWidth(M, M.offsetWidth);
    }
    if(P && kMode == "design"){
        setTop(P, Y.top);
        setLeft(P, Y.left);
        setHeight(P, Y.height);
        setWidth(P, Y.width);
        setVisible(P, Q);
    }
    var H = (gUiMods["iconPalette"] != "hidden");
    for(J = 0; J < gHeaderList.length; J ++ ){
        I = gHeaderList[J];
        if(gUiMods[I.id] == 'hidden' ||! H)
            setVisible(I, false);
        else{
            setTop(I, Y.top);
            setWidth(I, Y.width - I.style.pixelLeft);
            Y.top += I.style.pixelHeight;
            Y.height -= I.style.pixelHeight;
            setVisible(I, X);
        }
    }
    if(gDocument.all["bulbLogo"])
        setVisible(gDocument.all["bulbLogo"], X);
    for(J = 0; J < gFooterList.length; J ++ ){
        I = gFooterList[J];
        Y.bottom -= I.style.pixelHeight;
        Y.height -= I.style.pixelHeight;
        setTop(I, Y.bottom);
        setWidth(I, Y.width - I.style.pixelLeft);
        setVisible(I, W);
    }
    var G = getElement("navcluster");
    if(G){
        var F = Y.width - G.style.pixelWidth;
        if(F < 300)
            F = 300;
        setLeft(G, F);
    }
    if(P && kMode != "design"){
        setTop(P, Y.top);
        setLeft(P, Y.left);
        setHeight(P, Y.height);
        setWidth(P, Y.width);
        setVisible(P, Q);
    }
    if(O){
        setTop(O, Y.top);
        setLeft(O, Y.left);
        setHeight(O, Y.height);
        setWidth(O, Y.width);
        setVisible(O, R);
    }
    Y.left += kToolStripWidth;
    Y.width -= kToolStripWidth;
    if(N){;
        var E,
        D;
        E = N.style.pixelWidth + M.style.pixelWidth;
        D = Y.width - kDividerWidth;
        setTop(N, Y.top);
        setLeft(N, Y.left);
        setHeight(N, Y.height);
        setWidth(N, (N.style.pixelWidth * D) / E);
        setVisible(N, V);
        Y.left += N.style.pixelWidth;
        Y.width -= N.style.pixelWidth;
    }
    if(L){
        setTop(L, Y.top - kDividerOverlap);
        setLeft(L, Y.left);
        setHeight(L, Y.height + (kDividerOverlap * 2));
        setWidth(L, kDividerWidth);
        setVisible(L, T);
        Y.left += L.style.pixelWidth;
        Y.width -= L.style.pixelWidth;
    }
    if(M){
        setTop(M, Y.top);
        setLeft(M, Y.left);
        setHeight(M, Y.height);
        setWidth(M, Y.width);
        setVisible(M, S);
        Y.left += M.style.pixelWidth;
        Y.width -= M.style.pixelWidth;
    }
    closeHandle();
    closeEditor();
    if( ! Z)
        outputModel();
}
function keyDownDocument(Z){
    platformFixEvent(Z);
    var Y,
    X,
    W,
    V,
    U,
    T,
    S = null;
    var R = false, Q;
    var P = kTopContext.event;
    switch(P.keyCode){
        case 16 : 
        case 17 : 
        case 18 : 
            return;
    }
    if(filterDocument(P))
        return;
    if(kMode == "design" && P.ctrlKey){
        switch(P.keyCode){
            case 49 : 
                postModeCommand(kEditMode);
                return false;
            case 50 : 
                postModeCommand(kSortMode);
                return false;
            case 51 : 
                Q = targetModel();
                if(Q)
                    Q = node2slide(Q);
                postModeCommand(kShowMode, Q ? Q.index : null);
                return false;
        }
    }
    clearEditorInsertionTimeout();
    switch(gPageMode){
        case "editing" : 
            if(P.srcElement.id == "editor")
                setTimeout("updateEditorHeight()", 0);
            switch(P.keyCode){
                case 8 : 
                    if(eventInComboBox(P))
                        return;
                    if(usingEditor() && (insertPointAt("start", gEditor))){
                        var O = gEditor.innerText;
                        Y = findModel(targetModel(), "up");
                        if(kindModel(Y) == "folder")
                            break;
                        if(((kindModel(Y) == "slide") || (kindModel(targetModel()) == "slide")) && (whereEditor() == "drawing"))
                            break;
                        closeEditor();
                        clearCommand();
                        deselectModel(targetModel());
                        selectModel(Y);
                        openEditor(targetModel());
                        var N = gEditor.createTextRange();
                        N.collapse(false);
                        if(is.ie4){
                            N.text = " ";
                            N.collapse(false);
                        }
                        var M = N.boundingLeft;
                        var L = N.boundingTop;
                        N.text = O;
                        setEditorInsertionPoint(M, L);
                        return false;
                    }
                    else if( ! usingEditor())
                        clearCommand();
                    break;
                case 46 : 
                    if(eventInComboBox(P))
                        return;
                    if( ! usingEditor())
                        clearCommand();
                    break;
                case 27 : 
                    if(usingEditor())
                        closeEditor(true);
                    break;
                case 32 : 
                    if((P.srcElement.type != "text") && (P.srcElement.type != "textarea"))
                        return false;
                    break;
                case 9 : 
                    var K = usingEditor();
                    var J = whereEditor();
                    if(K){
                        if((J == "outline" && P.ctrlKey) || (J == "drawing" &&! P.shiftKey && (P.ctrlKey || (adjacentCharacter("before") != "")))){
                            setEditorSelectionText(" ");
                            return false;
                        }
                    }
                    if(K)
                        closeEditor(false);
                    var I = targetModel(getModel());
                    if(P.shiftKey)
                        postOutlineMove(I.index, "moveLeft", getString("strPromote"), K);
                    else
                        postOutlineMove(I.index, "moveRight", getString("strDemote"), K);
                    if(K){
                        openEditor(targetModel(), null, J);
                        if(gEditorSelection)
                            setTimeout("moveToEndOfEditorSelection()", 0);
                    }
                    break;
                case 13 : 
                    var H = "";
                    if(eventInComboBox(P) && (kindModel(targetModel()) != "folder")){
                        var G = P.srcElement.value;
                        if(P.srcElement.id == "sizeSpot"){
                            G = G.replace(/pt/g, "");
                            if(isNaN(G) || (G < 1) || (G > 410)){
                                updateGUI(targetModel(getModel()));
                                hb_alert(getString("strFontSizeLimited"), getString("strMrSmartySays"));
                            }
                            else{
                                decorateUtility("fontSize", G, false);
                            }
                        }
                        else if((P.srcElement.id == "fontSpot") && (model2drawing(targetModel()))){
                            var F = model2drawing(targetModel()).style.fontFamily;
                            decorateUtility("fontFamily", G, false);
                            openEditor(targetModel(), null, "drawing");
                            var E = gEditor.createTextRange();
                            if(E.queryCommandValue("fontName").toLowerCase() != G.toLowerCase()){
                                closeEditor();
                                decorateUtility("fontFamily", F, false);
                                hb_alert("To the best of my knowledge, you don't have the font " + G + ".", getString("strMrSmartySays"));
                            }
                            else{
                                decorateUtility("fontFamily", E.queryCommandValue("fontName"), false);
                                closeEditor();
                                if(( ! isStandardFont(G.toLowerCase())) && ( ! getPref('allowCustomFonts'))){
                                    var D = G + " might not exist on other systems viewing this presentation. Would you like to use it anyway?";
                                    var C = [{
                                        type : 'raw', value : D
                                    }];
                                    var B = [{
                                        type : 'other', value : getString("strDontRemind"),
                                        onclick : "savePref('allowCustomFonts', true, true); closeModal();"
                                    }, 
                                    {
                                        type : 'cancel',
                                        value : getString("strCancel")
                                    }, 
                                    {
                                        type : 'accept',
                                        value : getString("strOK")
                                    }];
                                    openModal('customFontAlert', getString("strMrSmartySays"), null, "closeModal()", "closeModal(); decorateUtility( 'fontFamily', '" + F + "', false );", C, B, null);
                                }
                            }
                        }
                        return false;
                    }
                    Q = targetModel();
                    if(Q == null){}
                    else if(P.shiftKey){
                        if(usingEditor())
                            closeEditor();
                        else{
                            openEditor(Q);
                            return false;
                        }
                    }
                    else if(P.ctrlKey && usingEditor()){
                        if(kindModel(Q) == "slide"){
                            closeEditor();
                            var A = descendModel(Q, "frame", kItemsName);
                            if(A){
                                if(countModel(A) == 0){
                                    insertTextItem(null, null, gEditor.where);
                                }
                                else{
                                    var Z1 = childModel(A, 0);
                                    selectUtility(Z1);
                                    openEditor(Z1);
                                }
                            }
                        }
                        else{
                            insertSlide(gEditor.where);
                        }
                    }
                    else{
                        if(usingEditor() && (gEditor.where == "drawing") && ((kindModel(Q) == "slide") || (kindModel(Q) == "textbox")))
                            return true;
                        var Y1 = gDocument.selection.createRange();
                        if(usingEditor() && Y1.text == ""){
                            var X1;
                            if(is.ie4){
                                X1 = gEditor.createTextRange();
                            }
                            else{
                                gEditor.select();
                                X1 = gDocument.selection.createRange();
                            }
                            if(X1.text != ""){
                                var W1 = Y1.duplicate();
                                W1.setEndPoint("EndToEnd", X1);
                                H = W1.text;
                                if(H != ""){
                                    Y1.setEndPoint("StartToStart", X1);
                                    gEditor.innerText = Y1.text;
                                }
                            }
                        }
                        if(usingEditor())
                            closeEditor();
                        if(kindModel(Q) == "text"){
                            var V1 = ascendModel(Q, "frame", kItemsName, "prefix");
                            if( ! roomForAnotherBullet(V1))
                                hb_alert(kFullTextBoxString, getString("strMrSmartySays"));
                            else
                                insertTextItem(V1, H, null);
                        }
                        else if(kindModel(Q) == "slide"){
                            insertSlide("outline", H);
                        }
                        gEditorInsertionTimeout = setTimeout("gEditorInsertionTimeout = null; setEditorInsertion(true);", 0);
                        return false;
                    }
                    break;
                case 37 : 
                    if(eventInComboBox(P))
                        return;
                    if(usingEditor()){
                        Y = findModel(targetModel(), "up");
                        if(Y && (insertPointAt("start", gEditor))){
                            if( ! allowArrow(Y))
                                break;
                            closeEditor();
                            findUtility("up");
                            openEditor(Y);
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    if(P.shiftKey)
                        nudgeUtility("left");
                    else if(P.ctrlKey)
                        postOutlineMove(targetModel().index, "moveLeft", getString("strPromote"));
                    else
                        findUtility("left");
                    break;
                case 38 : 
                    if(eventInComboBox(P))
                        return;
                    if(usingEditor()){
                        Y = findModel(targetModel(), "up");
                        W = gDocument.selection.createRange();
                        if(((W.boundingTop - 2) <= gEditor.offsetTop) && Y){
                            if( ! allowArrow(Y))
                                break;
                            T = W.boundingLeft;
                            closeEditor();
                            findUtility("up");
                            openEditor(targetModel());
                            V = gEditor.createTextRange();
                            V.collapse(false);
                            var U1 = V.boundingTop;
                            setEditorInsertionPoint(T, U1);
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    if(P.shiftKey)
                        nudgeUtility("up");
                    else if(P.ctrlKey)
                        postOutlineMove(targetModel().index, "moveUp", getString("strMoveUp"));
                    else
                        findUtility("up");
                    break;
                case 39 : 
                    if(eventInComboBox(P))
                        return;
                    if(usingEditor()){
                        X = findModel(targetModel(), "down");
                        if(X && (insertPointAt("end", gEditor))){
                            if( ! allowArrow(X))
                                break;
                            closeEditor();
                            findUtility("down");
                            openEditor(X);
                            W = gEditor.createTextRange();
                            W.collapse();
                            W.select();
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    if(P.shiftKey)
                        nudgeUtility("right");
                    else if(P.ctrlKey)
                        postOutlineMove(targetModel().index, "moveRight", getString("strDemote"));
                    else
                        findUtility("right");
                    break;
                case 40 : 
                    if(eventInComboBox(P))
                        return;
                    if(usingEditor()){
                        X = findModel(targetModel(), "down");
                        W = gDocument.selection.createRange();
                        if(((W.boundingTop + W.boundingHeight) >= gEditor.offsetTop + gEditor.offsetHeight - 4) && X){
                            T = W.boundingLeft;
                            if( ! allowArrow(X))
                                break;
                            closeEditor();
                            findUtility("down");
                            openEditor(targetModel());
                            V = gEditor.createTextRange();
                            V.collapse();
                            var T1 = V.boundingTop;
                            setEditorInsertionPoint(T, T1);
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    if(P.shiftKey)
                        nudgeUtility("down");
                    else if(P.ctrlKey)
                        postOutlineMove(targetModel().index, "moveDown", getString("strMoveDown"));
                    else
                        findUtility("down");
                    break;
                case 88 : 
                    if(P.ctrlKey)
                        cutCommand();
                    break;
                case 67 : 
                    if(P.ctrlKey)
                        copyCommand();
                    break;
                case 86 : 
                    if(P.ctrlKey)
                        pasteCommand();
                    break;
                case 77 : 
                    if(P.ctrlKey){
                        postCreateCommand("slide");
                        return false;
                    }
                    break;
                case 90 : 
                    if(P.ctrlKey && ( ! usingEditor() || (usingEditor() && currentCommand() && (currentCommand().name == getString("strNewItem")) && (gEditor.innerText == "")))){
                        if(usingEditor()){
                            closeEditor();
                            var S1 = targetModel();
                            deselectModel(S1);
                            selectModel(prevSibling(S1));
                        }
                        undoCommand();
                    }
                    break;
                case 89 : 
                    if(P.ctrlKey &&! usingEditor())
                        redoCommand();
                    break;
                case 188 : 
                case 219 : 
                    if(P.ctrlKey){
                        if(usingEditor())
                            closeEditor();
                        bumpUtility("fontSize", P.shiftKey ?- 10 :- 2, 1, 500);
                    }
                    break;
                case 190 : 
                case 221 : 
                    if(P.ctrlKey){
                        if(usingEditor())
                            closeEditor();
                        bumpUtility("fontSize", P.shiftKey ? 10 : 2, 1, 500);
                    }
                    break;
                default : 
                    R = true;
                    break;
            }
            break;
        case "sorting" : 
            switch(P.keyCode){
                case 8 : 
                case 46 : 
                    if(kMode == "design")
                        clearCommand();
                    break;
                case 13 : 
                    Q = node2slide(targetModel());
                    if(Q){
                        if(kMode == "design")
                            postModeCommand((kMode == "design") ? kEditMode : kShowMode, Q.index);
                        else
                            modeDocument(kShowMode, Q.index);
                    }
                    break;
                case 38 : 
                case 37 : 
                case 33 : 
                    jumpUtility("prev");
                    break;
                case 40 : 
                case 39 : 
                case 34 : 
                    jumpUtility("next");
                    break;
                case 32 : 
                    jumpUtility(P.ctrlKey ? (P.shiftKey ? "first" : "last") : (P.shiftKey ? "prev" : "next"));
                    break;
                case 36 : 
                    jumpUtility("first");
                    break;
                case 35 : 
                    jumpUtility("last");
                    break;
                case 90 : 
                    if(kMode == "design" && P.ctrlKey &&! usingEditor())
                        undoCommand();
                    break;
                case 89 : 
                    if(kMode == "design" && P.ctrlKey &&! usingEditor())
                        redoCommand();
                    break;
                default : 
                    R = true;
                    break;
            }
            break;
        case "showing" : 
            switch(P.keyCode){
                case 8 : 
                case 46 : 
                case 38 : 
                case 37 : 
                case 33 : 
                    jumpUtility("prev");
                    break;
                case 40 : 
                case 39 : 
                case 34 : 
                    jumpUtility("next");
                    break;
                case 32 : 
                case 13 : 
                    jumpUtility(P.ctrlKey ? (P.shiftKey ? "first" : "last") : (P.shiftKey ? "prev" : "next"));
                    break;
                case 36 : 
                    jumpUtility("first");
                    break;
                case 35 : 
                    jumpUtility("last");
                    break;
                case 27 : 
                    modeDocument((kMode == "design") ? kEditMode : kSortMode);
                    break;
                default : 
                    R = true;
                    break;
            }
            break;
    }
    if(usingEditor()){
        focusEditor(false);
    }
    else if(eventInComboBox(P)){;
    }
    else{
        focusUtility();
        return R;
    }
}
function keyPressDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
}
function keyUpDocument(Z){
    platformFixEvent(Z);
    var Y = kTopContext.event;
    if(eventInComboBox(Y)){
        if(Y.keyCode == 13){
            Y.srcElement.blur();
            return false;
        }
    }
    if(filterDocument(Y))
        return;
    if(Y.srcElement.id == "editor")
        setTimeout("saveEditorSelection()", 50);
    finishUtility();
}
function mouseOverDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    if(is.ie4 && gDocument.body.scrollTop != 0)
        gDocument.body.scrollTop = 0;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return false;
    switch(Y.className){
        case "button" : 
        case "spinButton" : 
            overButton(Y);
            break;
        case "largeMenu" : 
        case "largeSpot" : 
        case "smallMenu" : 
        case "smallSpot" : 
        case "buttonMenu" : 
        case "colorSpot" : 
        case "comboBox" : 
            if(gTrackMenu == null){
                overMenu(Y);
            }
            else if(element2menu(Y) == gTrackMenu){}
            else{
                upMenu(gTrackMenu);
                gTrackMenu = downMenu(Y);
            }
            break;
        case "largeItem" : 
        case "smallItem" : 
        case "header" : 
        case "colorheader" : 
        case "holder" : 
        case "swatch" : 
        case "sample" : 
            overItem(Y);
            break;
        case "spot" : 
        case "icon" : 
            hiliteOutline(Y, true);
            break;
        default : 
            break;
    }
    return false;
}
function mouseOutDocument(Z){
    platformFixEvent(Z);
    filterDocument(kTopContext.event);
    if(filterLink(kTopContext.event))
        return true;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return false;
    switch(Y.className){
        case "button" : 
        case "spinButton" : 
            outButton(Y);
            break;
        case "largeMenu" : 
        case "largeSpot" : 
        case "smallMenu" : 
        case "smallSpot" : 
        case "buttonMenu" : 
        case "colorSpot" : 
        case "comboBox" : 
            if(gTrackMenu == null)
                outMenu(Y);
            break;
        case "largeItem" : 
        case "smallItem" : 
        case "header" : 
        case "colorheader" : 
        case "holder" : 
        case "swatch" : 
        case "sample" : 
            outItem(Y);
            break;
        case "spot" : 
        case "icon" : 
            hiliteOutline(Y, false);
            break;
        default : 
            break;
    }
    return false;
}
function inSlideMenu(Z){
    return Z.parentElement && (Z.parentElement.id == "slideList");
}
function inFontMenu(Z){
    return Z.parentElement && (Z.parentElement.id == "fontList");
}
function inSizeMenu(Z){
    return Z.parentElement && (Z.parentElement.id == "sizeList");
}
function inColorMenu(Z){
    return Z.className == "holder" || Z.className == "swatch";
}
function inLineMenu(Z){
    if(Z.className == "sample"){
        return Z.parentElement && Z.parentElement.parentElement && (Z.parentElement.parentElement.id == "lineList");
    }
    return Z.parentElement && (Z.parentElement.id == "lineList");
}
function startDraggingHandle(Z, Y){
    gTrackKind = "dragHandle";
    gTrackItem = Y;
    gTrackNextX = gTrackPrevX = Z.screenX;
    gTrackNextY = gTrackPrevY = Z.screenY;
    gTrackRestrain = newBounds(gTrackPrevY - 2, gTrackPrevX - 2, gTrackPrevY + 3, gTrackPrevX + 3);
    gTrackBounds = whereHandle();
    gTrackLimits = boundsDrawing();
}
function brokeHysteresis(Z, Y){
    if(gTrackRestrain == null)
        return true;
    var X = 
    {
        "x" : Z, "y" : Y
    };
    return ! testPoint(X, gTrackRestrain);
}
function mouseDownDocument(Z){
    platformFixEvent(Z);
    var Y = kTopContext.event;
    if(filterDocument(Y))
        return;
    if(filterLink(Y))
        return true;
    var X = Y.srcElement;
    gMouseDownElement = X;
    var W;
    if(insideEditor(X) || (insideDrawing(X) &&! insideHandle(X)))
        X = hitDrawing(Y, X);
    if(insideEditor(X))
        return;
    if(insideHandle(X)){
        W = targetModel();
        if(W && W.kind == "frame"){
            var V = point2drawing(Y.clientX, Y.clientY);
            if(V){
                switch(kindModel(drawing2model(V))){
                    case "text" : 
                    case "slide" : 
                    case "textbox" : 
                        X = V;
                        break;
                }
            }
        }
    }
    gTrackEditorWasOpen = false;
    if(( ! is.nav4 &&! insideMenu(X) &&! insideItem(X)) || inSlideMenu(X) || inFontMenu(X) || inSizeMenu(X) || inColorMenu(X) || inLineMenu(X)){
        gTrackEditorWasOpen = usingEditor();
        var U = X.id;
        closeEditor();
        if(U != "")
            X = getElement(U);
    }
    if(insideItem(X)){
        gTrackKind = "dragMenu";
        gTrackItem = downItem(X);
    }
    else if(insideMenu(X)){
        if(gTrackMenu != null){
            upMenu(gTrackMenu);
            gTrackMenu = null;
        }
        else if( ! eventInComboBox(Y)){
            gTrackKind = "dragMenu";
            gTrackMenu = downMenu(X);
        }
    }
    else{
        if(gTrackItem != null){
            upItem(gTrackItem);
            gTrackKind = "dragMenu";
            gTrackItem = null;
        }
        if(gTrackMenu != null){
            upMenu(gTrackMenu);
            gTrackMenu = null;
        }
    }
    if(insideButton(X)){
        gTrackKind = "dragButton";
        gTrackItem = downButton(X);
    }
    else if(insideHandle(X)){
        startDraggingHandle(Y, X);
    }
    else if(insideDrawing(X)){
        X = hitDrawing(Y, X);
        W = drawing2model(X);
        if(W != null){
            gTrackKind = "dragEditor";
            gTrackItem = X.id;
            var T = kindModel(W);
            if(T == "frame"){
                if( ! priorityDrawing(X) && (countModel(W) == 0) && containsString(W.text, kItemsName, "prefix")){
                    insertTextItem(W, null, "drawing");
                }
                else{
                    closeEditor();
                    selectUtility(W);
                    startDraggingHandle(Y, model2drawing(W));
                }
            }
            else{
                closeEditor();
                selectUtility(W);
                switch(T){
                    case "slide" : 
                    case "text" : 
                    case "textbox" : 
                        break;
                    default : 
                        startDraggingHandle(Y, model2drawing(W));
                        break;
                }
            }
        }
        else{
            closeEditor();
            selectUtility(currentDrawing());
        }
    }
    else if(insideOutline(X)){
        switch(X.className){
            case "text" : 
                selectUtility(outline2model(X));
                openEditor(outline2model(X), null, "outline");
                clearEditorInsertionTimeout();
                gEditorInsertionTimeout = setTimeout("gEditorInsertionTimeout = null; setEditorInsertionPoint(" + Y.clientX + ", " + Y.clientY + "); saveEditorSelection();", 0);
                break;
            case "spot" : 
                toggleModel(outline2model(X));
                break;
            case "icon" : 
                selectUtility(outline2model(X));
                gTrackKind = "dragOutline";
                gTrackItem = X;
                break;
            default : 
                break;
        }
    }
    else if(insideDivider(X)){
        gTrackKind = "dragDivide";
        gTrackItem = X;
        gTrackNextX = gTrackPrevX = Y.screenX;
        gTrackNextY = gTrackPrevY = Y.screenY;
        gTrackBounds = whereDivider();
        gTrackLimits = limitDivider();
    }
    else if(insideSorting(X)){
        W = sorting2model(X);
        if(W)
            selectUtility(W);
        if(kMode == "design" && W != null){
            gTrackKind = "dragThumbs";
            gTrackItem = element2sorting(X);
            gTrackNextX = gTrackPrevX = Y.screenX;
            gTrackNextY = gTrackPrevY = Y.screenY;
            gTrackBounds = thumbsSorting(gTrackItem);
            gTrackLimits = boundsSorting();
        }
    }
    else if((insideShowing(X)) && ( ! is.ie4)){
        switch(Y.button){
            case 1 : 
                jumpUtility(Y.ctrlKey ? (Y.shiftKey ? "first" : "last") : (Y.shiftKey ? "prev" : "next"));
                break;
            case 2 : 
                jumpUtility(Y.ctrlKey ? (Y.shiftKey ? "last" : "first") : (Y.shiftKey ? "next" : "prev"));
                break;
            case 4 : 
                if(kMode == "design")
                    modeDocument(kEditMode);
                break;
            default : 
                break;
        }
    }
    else if(insidePalette(X)){}
    return false;
}
function mouseMoveDocument(Z){
    platformFixEvent(Z);
    var Y = kTopContext.event;
    if(filterDocument(Y))
        return;
    if(filterLink(Y))
        return true;
    var X,
    W = Y.srcElement;
    if((W != null) && gMouseDownElement == W && ((W.id == "editor") || (W.className == "comboBox")))
        return;
    switch(gTrackKind){
        case "dragMenu" : 
            var V = element2item(W);
            if((V != null) && (V != gTrackItem)){
                upItem(gTrackItem);
                gTrackItem = downItem(V);
            }
            var U = element2menu(W);
            if((U != null) && (U != gTrackMenu)){
                upMenu(gTrackMenu);
                gTrackMenu = downMenu(U);
            }
            break;
        case "dragButton" : 
            break;
        case "dragDivide" : 
            if((Y.screenX != gTrackNextX) || (Y.screenY != gTrackNextY)){
                gTrackNextX = Y.screenX;
                gTrackNextY = Y.screenY;
                deltaDivider(gTrackItem, gTrackNextX - gTrackPrevX, gTrackNextY - gTrackPrevY, gTrackBounds, gTrackLimits);
            }
            break;
        case "dragEditor" : 
            break;
        case "dragHandle" : 
            if(brokeHysteresis(Y.screenX, Y.screenY) && ((Y.screenX != gTrackNextX) || (Y.screenY != gTrackNextY))){
                gTrackNextX = Y.screenX;
                gTrackNextY = Y.screenY;
                gTrackRestrain = null;
                deltaHandle(gTrackItem, gTrackNextX - gTrackPrevX, gTrackNextY - gTrackPrevY, gTrackBounds, gTrackLimits);
            }
            break;
        case "dragOutline" : 
            displayInsert(false);
            X = point2outline(Y.clientX, Y.clientY, insideSorting(W));
            if(dropOutline(gTrackItem, X, false)){
                positionInsert(X, "outline");
                displayInsert(true);
            }
            break;
        case "dragThumbs" : 
            if((Y.screenX != gTrackNextX) || (Y.screenY != gTrackNextY)){
                gTrackNextX = Y.screenX;
                gTrackNextY = Y.screenY;
                displayInsert(false);
                deltaSorting(gTrackItem, gTrackNextX - gTrackPrevX, gTrackNextY - gTrackPrevY, gTrackBounds, gTrackLimits);
                X = point2sorting(Y.clientX, Y.clientY, insideSorting(W));
                if(dropSorting(gTrackItem, X, false)){
                    positionInsert(X, "sorting");
                    displayInsert(true);
                }
            }
            break;
        default : 
            break;
    }
    return false;
}
function mouseUpDocument(Z){
    platformFixEvent(Z);
    var Y = kTopContext.event;
    if(filterDocument(Y))
        return;
    if(filterLink(Y))
        return true;
    var X = Y.srcElement;
    if(eventInComboBox(Y) && (X.hasFocus == 0)){
        if(usingEditor())
            closeEditor(false);
        X.hasFocus = 1;
        X.select();
        return;
    }
    if(X.id == "editor")
        setTimeout("saveEditorSelection()", 50);
    if(gTrackMenu == null){
        overMenu(X);
    }
    switch(gTrackKind){
        case "dragMenu" : 
            if(gTrackItem != null){
                upItem(gTrackItem);
                gTrackItem == null;
            }
            if(insideItem(X)){
                upMenu(gTrackMenu);
                selectItem(gTrackMenu, X);
                gTrackMenu = null;
            }
            break;
        case "dragButton" : 
            upButton(gTrackItem);
            if(element2button(X) == gTrackItem)
                pressButton(gTrackItem);
            break;
        case "dragDivide" : 
            var W = whereDivider();
            var V = W.left - gTrackBounds.left;
            if(V != 0){
                var U = getOutline();
                var T = getDrawing();
                U.style.pixelWidth += V;
                T.style.pixelWidth -= V;
                sizeDocument();
            }
            break;
        case "dragEditor" : 
            var S = getElement(gTrackItem);
            if(insideDrawing(S)){
                if(allowEditor(S)){
                    openEditor(drawing2model(S), null, "drawing");
                    clearEditorInsertionTimeout();
                    gEditorInsertionTimeout = setTimeout("gEditorInsertionTimeout = null; setEditorInsertionPoint(" + Y.clientX + ", " + Y.clientY + "); saveEditorSelection();", 0);
                }
            }
            else if(gTrackItem == X){
                if(allowEditor(X)){
                    openEditor(outline2model(X), null, "outline");
                    clearEditorInsertionTimeout();
                    gEditorInsertionTimeout = setTimeout("gEditorInsertionTimeout = null; setEditorInsertionPoint(" + Y.clientX + ", " + Y.clientY + "); saveEditorSelection();", 0);
                }
            }
            break;
        case "dragHandle" : 
            if(brokeHysteresis(Y.screenX, Y.screenY))
                mapUtility(gTrackBounds, whereHandle());
            break;
        case "dragOutline" : 
            displayInsert(false);
            if(dropOutline(gTrackItem, point2outline(Y.clientX, Y.clientY), true, Y.ctrlKey))
                outputModel();
            break;
        case "dragThumbs" : 
            thumbsSorting(null);
            displayInsert(false);
            if(dropSorting(gTrackItem, point2sorting(Y.clientX, Y.clientY, insideSorting(X)), true, Y.ctrlKey))
                outputModel();
            break;
        default : 
            break;
    }
    gTrackKind = "none";
    gTrackItem = null;
    if( ! usingEditor())
        focusUtility();
    if((insideMenu(X) || insideItem(X)) && (X.id != "cmdInsertStockQuote")){
        if( ! currModal()){
            restoreEditorSelection();
        }
    }
    return false;
}
function singleClickDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    return false;
}
function doubleClickDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    var Y = kTopContext.event.srcElement;
    var X;
    if(insideEditor(Y))
        return;
    if(gTrackItem != null){
        upItem(gTrackItem);
        gTrackItem = null;
    }
    if(gTrackMenu != null){
        upMenu(gTrackMenu);
        gTrackMenu = null;
    }
    if(insideItem(Y) || insideMenu(Y) || insideButton(Y)){
        return;
    }
    if(insideHandle(Y)){
        X = targetModel();
        if(X != null)
            optionsCommand(X);
    }
    else if(insideDrawing(Y)){
        X = drawing2model(Y);
        if(X != null)
            optionsCommand(X);
        else
            optionsCommand(currentDrawing());
    }
    else if(insideSorting(Y)){
        X = node2slide(sorting2model(Y));
        if(X){
            if(kMode == "design")
                postModeCommand(kEditMode, X.index);
            else
                modeDocument(kShowMode, X.index);
        }
    }
    else if(insideOutline(Y)){
        switch(Y.className){
            case "icon" : 
            case "text" : 
                X = outline2model(Y);
                selectUtility(X);
                optionsCommand(X);
                break;
            case "spot" : 
                toggleModel(outline2model(Y));
                break;
            default : 
                break;
        }
    }
    else if(insideDivider(Y)){}
    else if(insideShowing(Y)){
        if(false && kMode == "design"){
            X = node2slide(showing2model(Y));
            if(X)
                modeDocument(kEditMode, X.index);
        }
    }
    return false;
}
function selectStartDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(insideEditor(kTopContext.event.srcElement) || eventInComboBox(kTopContext.event))
        return;
    return false;
}
function selectTrackDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(insideEditor(kTopContext.event.srcElement) || eventInComboBox(kTopContext.event))
        return;
    return false;
}
function contextMenuDocument(Z){
    platformFixEvent(Z);
    if(kTopContext.event.ctrlKey || insideEditor(kTopContext.event.srcElement)){
        return true;
    }
    if(filterDocument(kTopContext.event))
        return;
    return false;
}
function saveEditorSelection(){
    var Z;
    Z = gDocument.selection.createRange();
    if(Z == null){
        gEditorSelection = null;
    }
    else if(gDocument.selection.type == "None" || Z.boundingWidth == 0){
        gEditorSelection = new Object();
        gEditorSelection.type = "insertion";
        gEditorSelection.range = Z;
        gEditorSelection.pointX = Z.boundingLeft;
        gEditorSelection.pointY = Z.boundingTop + Z.boundingHeight / 2;
    }
    else{
        gEditorSelection = new Object();
        gEditorSelection.type = "range";
        gEditorSelection.range = Z;
    }
}
function restoreEditorSelection(){
    if(gEditorSelection == null)
        return;
    if(gEditor.style.display == "none" || gEditor.style.visibility == "hidden")
        return;
    switch(gEditorSelection.type){
        case "insertion" : 
            setEditorInsertionPoint(gEditorSelection.pointX, gEditorSelection.pointY);
            break;
        case "range" : 
            gEditorSelection.range.select();
            break;
        default : ;
}
}
function setEditorSelectionText(Z){
    if(gEditorSelection == null)
        return;
    gEditorSelection.range.text = Z;
}
function moveToEndOfEditorSelection(){
    if(gEditorSelection == null)
        return;
    switch(gEditorSelection.type){
        case "insertion" : 
            setEditorInsertionPoint(gEditorSelection.pointX, gEditorSelection.pointY);
            break;
        case "range" : 
            gEditorSelection.range.collapse(false);
            gEditorSelection.range.select();
            break;
        default : ;
}
}
function setEditorInsertion(Z){
    if( ! usingEditor())
        return;
    clearEditorInsertionTimeout();
    var Y = gEditor.createTextRange();
    Y.collapse(Z);
    Y.select();
    setTimeout("saveEditorSelection();", 0);
}
function setEditorInsertionPoint(Z, Y){
    if(gEditor == null || gEditor == "undefined")
        return;
    if(gEditor.style.display == "none" || gEditor.style.visibility == "hidden")
        return;
    clearEditorInsertionTimeout();
    var X = gEditor.createTextRange();
    var W = X.boundingTop + X.boundingHeight;
    if(Y < (X.boundingTop + 2)){
        Y = X.boundingTop + 2;
    }
    else if(Y > W - 2 && W > 0){
        Y = W - 2;
    }
    X.moveToPoint(Z, Y);
    X.select();
}
function clearEditorInsertionTimeout(){
    if(gEditorInsertionTimeout != null){
        clearTimeout(gEditorInsertionTimeout);
        gEditorInsertionTimeout = null;
    }
}
function allowArrow(Z){
    var Y = true;
    if(kindModel(Z) == "folder")
        return false;
    if(((kindModel(Z) == "slide") || (kindModel(targetModel()) == "slide")) && (whereEditor() == "drawing"))
        return false;
    return Y;
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();