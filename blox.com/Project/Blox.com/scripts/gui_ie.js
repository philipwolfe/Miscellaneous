//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gHeader = new Object();
var gFooter = new Object();
var gCurrSheetIndex = null;
var gColWidths;
var gRowHeights;
var gOverrideEditBgColor = "#d4faf0";
function NotHidden(Z){
    var Y = getStyle(Z, "visibility");
    return(Y != "hidden");
}
function getAppName(){
    return((typeof gIsMatterhorn != "undefined") && gIsMatterhorn) ? getString("strAlphabloxSpreadsheet") : getString("strBrainMatter");
}
function containedBySheet(Z){
    var Y = Z;
    while(Y != null){
        if(Y.className == "sheet")
            return true;
        Y = getParent(Y);
    }
    return false;
}
function handleContextMenuEvent(Z){
    if(containedBySheet(Z.event.srcElement))
        return false;
    if(Z.event.srcElement.id == "entry")
        return true;
    if( ! Z.event.ctrlKey)
        return false;
    return true;
}
function sizeDocument(){
    var Z = windowBounds();
    var Y = windowBounds();
    var X;
    var W;
    var V = 0;
    var U;
    for(W in gHeader){
        X = gHeader[W];
        setWidth(X, Z.width - getLeft(X));
        U = getTop(X) + getHeight(X);
        if(NotHidden(X) && (U > V))
            V = U;
    }
    var T = 0;
    for(W in gFooter){
        X = gFooter[W];
        U = getTop(X) + getHeight(X);
        if(U > T)
            T = U;
    }
    var S = Y.height;
    for(W in gFooter){
        X = gFooter[W];
        var R = getTop(X) + Z.height - T;
        if(R < S)
            S = R;
        setTop(X, R);
        setWidth(X, Z.width);
        setVisible(X, true);
    }
    X = view;
    setWidth(X, Z.width);
    setTop(X, V);
    setHeight(X, S - V);
    setDisplay(X, true);
    setVisible(X, true);
    if(gInitialized)
        fixupModal();
}
function doCropCheck(Z){
    var Y = (gRowCount - 1) * (gColumnCount - 1);
    if(emptyString(gAppId) && (gRecommendedCellCount > 0) && (Y > gRecommendedCellCount)){
        var X = getString("strCropCheckCmp", kDefaultLocale, gRecommendedCellCount, Y);
        var W = [{
            type : 'raw', value : X
        }];
        var V = [{
            type : 'accept', value : getString("strCropCells")
        }, 
        {
            type : 'cancel',
            value : getString("strKeepCells")
        }];
        openModal('sizealert', getString("strSizeWarning") + ':', null, "closeModal();cropSheet();" + Z, "closeModal();" + Z, W, V, null);
    }
    else
        eval(Z);
}
function cropSheet(){
    gRowCount = Math.floor(gRecommendedCellCount / gColumnCount);
    if(gRowCount < 1)
        gRowCount = 1;
    var Z = gCellDataArray.length;
    while( -- Z >= 0)
        if(gCellDataArray[Z].m_row < gRowCount)
            break;
    gCellDataArray = gCellDataArray.slice(0, Z + 1);
}
function swapInMenu(Z){
    if((Z != gLastMenuItemMousedOver) && (gAMenuIsShowing)){
        exceptMenu(Z);
        toggleMenu(Z);
    }
    gLastMenuItemMousedOver = Z;
}
var activeMenu;
function MenuToggle(Z, Y){
    if(gAMenuIsShowing)
        Y = 2;
    if(activeMenu && Z != activeMenu){
        offsetMenu(activeMenu, 0);
        activeMenu = null;
    }
    switch(Y){
        case 0 : 
            activeMenu = null;
            break;
        case 1 : 
        case 2 : 
            activeMenu = Z;
            break;
        default : ;
        return;
}
offsetMenu(Z, Y);
}
function offsetMenu(Z, Y, X){
    var W = getClass(Z);
    if(W == "popupWidget"){
        setBackgroundY(Z, Y *- 18);
    }
    else if(W == "largeMenu"){
        if(Y == 0){
            setStyle(Z, "borderColor", "#c0c0c0");
        }
        else if(Y == 1){
            setStyle(Z, "borderColor", "#FFFFFF #808080 #808080 #FFFFFF");
        }
        else{
            setStyle(Z, "borderColor", "#808080 #FFFFFF #FFFFFF #808080");
        }
    }
    else{
        setBackgroundY(Z, Y *- 24);
        if(X){
            setBackgroundColor(Z, X);
        }
    }
}
var gMenus = new Object();
function exceptMenu(Z){
    if( ! gAMenuIsShowing)
        return;
    for(var Y in gMenus)
        if(gMenus[Y] != Z)
            setVisible(gMenus[Y], false);
    if(Z == null){
        gAMenuIsShowing = false;
        if(gLastMenuItemMousedOver)
            MenuToggle(gLastMenuItemMousedOver, 0);
    }
    if(kMode == "design" && typeof(refocusEntryField) != "undefined"){
        if( ! gAMenuIsShowing){
            refocusEntryField();
        }
        else
            cancelEntryFieldRefocus();
    }
}
function toggleMenu(Z){
    var Y = getVisible(Z);
    var X = view;
    var W;
    var V = Z.originalLeft;
    if(V && Z.id != "popupMenuList")
        W = V;
    else{
        W = parseInt(Z.style.left);
        Z.originalLeft = W;
    }
    var U = X.scrollLeft + X.clientWidth - getWidth(Z);
    if(W > U)
        W = U;
    Z.style.left = W;
    setVisible(Z ,! Y);
    gAMenuIsShowing = getVisible(Z);
    if(kMode == "design" && typeof(refocusEntryField) != "undefined"){
        if( ! gAMenuIsShowing){
            refocusEntryField();
        }
        else
            cancelEntryFieldRefocus();
    }
}
function unhighlightItems(Z){
    for(var Y = 0; Y < Z.children.length; Y ++ ){
        var X = Z.children[Y];
        var W = getClass(X);
        if(W == "smallItem"){
            unhighlightSmallMenuItem(X);
        }
        else if(W == "largeItem"){
            unhighlightLargeMenuItem(X);
        }
    }
}
function highlightMenuItem(Z){
    setStyle(Z, "color", "white");
    setStyle(Z, "backgroundColor", "darkblue");
}
function unhighlightSmallMenuItem(Z){
    setStyle(Z, "color", "black");
    setStyle(Z, "backgroundColor", "white");
}
function unhighlightLargeMenuItem(Z){
    setStyle(Z, "color", "black");
    setStyle(Z, "backgroundColor", "lightgrey");
}
function insideMenu(Z){
    var Y = null;
    if((getClass(Z) == "popupWidget") || ((Y = getParent(Z)) && (Y.id == "popupMenuList")))
        return true;
    for(var X = Z; X != null; X = getParent(X))
        if((X.list != null) || (X.menu != null))
            return true;
    return false;
}
function adjustMenuWidth(Z){;
    if(Z == null)
        return;
    var Y,
    X,
    W;
    Y =- 1;
    for(X = 0; X < Z.children.length; X ++ ){
        W = Z.children[X];
        if(W.className == "largeItem" || W.className == "smallItem"){
            var V = getItemWidth(W);
            if(V > Y)
                Y = V;
        }
    }
    if(Y !=- 1){
        for(X = 0; X < Z.children.length; X ++ ){
            W = Z.children[X];
            setWidth(W, Y);
        }
        setWidth(Z, Y + 6);
    }
}
function makeContextualMenu(Z, Y){
    var X = '', W = '';
    var V = 16, U = 2, T = 2, S = 4, R = 4;
    var Q = T;
    for(var P = 0; P < Z.length; P ++ ){
        if(gIsMatterhorn || (Z[P].notInBlox != 1)){
            if(Z[P].id == 'separator'){
                W += "<div class='separator' style='top:" + Q + "; left:" + U + ";'></div>";
                Q += S;
            }
            else{
                W += "<div id='" + Z[P].id + "' class='largeItem' style='top:" + Q + "; left:" + U + ";'>" + getString(Z[P].str) + "</div>";
                Q += V;
            }
        }
    }
    if(typeof gPopupMenu != 'undefined' && gPopupMenu){
        W += "<DIV class=separator style='top:" + Q + "';></DIV>";
        Q += S;
        for(P = 0; P < gPopupMenu.menuItems.length; P ++ ){
            var O = gPopupMenu.menuItems[P];
            if(O.label == "separator"){
                W += "<DIV class=separator style='top:" + Q + "';left:" + U + ";></DIV>";
                Q += S;
            }
            else{
                W += "<DIV class=largeItem style='top:" + Q + ";left:" + U + ";'; id='cmdPopup' name=" + P + ">" + O.label + "</DIV>";
                Q += V;
            }
        }
    }
    X = "<div class='largeList' id=contextualMenu " + Y;
    X += " style='width:300; height:" + (Q + R) + "'>";
    X += W + "</div>";
    return X;
}
function mouseOverDocument(Z){
    platformFixEvent(Z);
    if(filterDocument(kTopContext.event))
        return;
    if(filterLink(kTopContext.event))
        return true;
    kTopContext.event.cancelBubble = true;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return false;
    var X = getClass(Y);
    if(X == null)
        return false;
    switch(X){
        case "palette" : 
        case "division" : 
            break;
        case "colorSpot" : 
            Y = getParent(Y);
        case "button" : 
        case "tab" : 
            if(Y.list){
                if(Y.id == "borderMenu"){
                    InitBorderMenu();
                }
                swapInMenu(Y.list);
                setValue(Y, gAMenuIsShowing ? "true" : "false");
            }
            if(getValue(Y) == "true")
                offsetButton(Y, 2);
            else
                offsetButton(Y, 1);
            break;
        case "largeMenu" : 
        case "smallMenu" : 
            swapInMenu(Y.list);
            MenuToggle(Y, 1);
            break;
        case "popupWidget" : 
            BuildPopup(Y);
            swapInMenu(popupMenuList);
            MenuToggle(Y, 1);
            break;
        case "largeSpot" : 
        case "smallSpot" : 
        case "comboBox" : 
            swapInMenu(Y.menu.list);
            MenuToggle(Y.menu, 1);
            break;
        case "largeItem" : 
            highlightMenuItem(Y);
            break;
        case "smallItem" : 
            if(Y.parentElement.id == "popupMenuList")
                unhighlightItems(Y.parentElement);
            highlightMenuItem(Y);
            break;
        case "colorheader" : 
            highlightMenuItem(Y);
            break;
        case "swatch" : 
            Y = getParent(Y);
        case "holder" : 
        case "border" : 
            offsetButton(Y, 1);
            break;
        case "view" : 
            break;
        default : 
            break;
    }
    return false;
}
var gPopupCell;
function BuildPopup(Z){
    var Y = popupMenuList;
    var X = Z.parentElement;
    setExtra(Y, "popupCell", X);
    if(is.nav)
        gPopupCell = X;
    var W = view;
    var V = getHeight(getChild(X, "popupWidgetRect"));
    var U = W.scrollLeft;
    var T = W.scrollTop;
    var S = getBounds(X);
    S.top += V;
    S.left += ((kMode == "design") ? 1 : 0);
    var R = X.cellData.m_cellGUI.data;
    var Q = ((R.length / 2) * 16) + 4;
    var P = getWidth(X) - 3 + ((kMode == "design") ? 0 : 1);
    S = newBounds(S.top, S.left, S.top + Q, S.left + P);
    setBounds(Y, S);
    setDepth(Y, 1000);
    if(is.nav){
        Y.clip.bottom = Q;
        Y.clip.left = 0;
        Y.clip.right = P;
        Y.clip.top = 0;
    }
    var O = "";
    var N = (getWidth(X) - 6);
    for(var M = 0; M < R.length; M += 2)
        if(is.nav){
            var L = '<layer id="a' + (M / 2) + '"';
        L += ' top=' + ((M / 2) * 16 + 1) + ' left=1 width=' + (N + 4) + ' height=16';
        L += ' onmouseover="ns_popupItemOver(this)" onmouseout="ns_popupItemOutSmall(this)" bgcolor=white';
        L += ' style="font-family:tahoma,helvetica,arial,sans-serif;';
        L += ' font-size:9pt; padding:0px 5px; color:black;">';
        L += R[M] + '</layer>';
        O += L;
    }
    else{
        O += '<div id="' + (M / 2) + '" onmouseup="popupItemSelected()" class="smallItem" style="left:2px; clip: rect( 0, ' + N + ', 16, 0 ); top:' + ((M / 2) * 16) + 'px;">' + R[M] + '</div>';
    }
    if(is.nav){
        var K = getEditBounds();
        if(K && overlappingBounds(S, K))
            showEdit(false);
        O = "<layer id='popupMenuList' onload='" + ns_simpleClassLoaderString("smallItem") + "ns_simpleClassLoader(this);'>" + O + "</layer>";
        setElementSrc(Y, O, true);
    }
    else{
        Y.innerHTML = O;
    }
}
function mouseOutDocument(Z){
    platformFixEvent(Z);
    filterDocument(kTopContext.event);
    if(filterLink(kTopContext.event))
        return true;
    kTopContext.event.cancelBubble = true;
    var Y = kTopContext.event.srcElement;
    if(Y == null)
        return false;
    var X = getClass(Y);
    if(X == null)
        return false;
    switch(X){
        case "palette" : 
        case "division" : 
            break;
        case "colorSpot" : 
            Y = getParent(Y);
        case "button" : 
        case "tab" : 
            if(Y.list)
                setValue(Y, "false");
            if(getValue(Y) == "true")
                offsetButton(Y, 2);
            else
                offsetButton(Y, 0);
            break;
        case "largeMenu" : 
        case "smallMenu" : 
            MenuToggle(Y, 0);
            break;
        case "largeSpot" : 
        case "smallSpot" : 
            MenuToggle(Y.menu, 0);
            break;
        case "popupWidget" : 
            MenuToggle(Y, 0);
            break;
        case "largeItem" : 
            unhighlightLargeMenuItem(Y);
            break;
        case "smallItem" : 
        case "colorheader" : 
            unhighlightSmallMenuItem(Y);
            break;
        case "swatch" : 
            Y = getParent(Y);
        case "holder" : 
        case "border" : 
            offsetButton(Y, 0);
            break;
        case "view" : 
            break;
        default : 
            break;
    }
    return false;
}
function offsetButton(Z, Y, X){
    var W = getClass(Z);
    if(W == "popupWidget"){
        setBackgroundY(Z, Y *- 18);
    }
    else if(W == "holder"){
        setBackgroundY(Z, Y *- 16);
    }
    else{
        setBackgroundY(Z, Y *- 24);
        if(X)
            setBackgroundColor(Z, X);
        else
            setBackgroundColor(Z, getBackgroundColor(Z.parentElement));
    }
}
function PlaceBackgroundImage(Z, Y){
    setBackgroundImage(Z, Y);
    if(Y){
        var X =- getLeft(Z) - 2 * getLeft(Z.offsetParent);
        var W =- getTop(Z) +- 2 * getTop(Z.offsetParent);
        setStyle(Z, "backgroundPosition", X + "px " + W + "px");
    }
}
var gSpreadsheetDirty = false;
function saveDocumentBody(Z){
    if(Z){
        buildSaveBody1();
        buildSaveBody2();
    }
    else{
        buildSaveBody1();
        hb_progress(getString("strSavingSpreadsheet"), getString("strProcessingData") + "...", 0.4);
        setSaveTimeout("saveDocumentBody2()");
    }
}
function saveDocumentBody2(){
    buildSaveBody2();
    hb_progress(getString("strSavingSpreadsheet"), getString("strProcessingData") + "...", 0.6);
    setSaveTimeout("submitDocument()");
}
function buildSaveBody1(){
    var Z = escapeText(gMacroText);
    var Y = 40;
    for(var X = 0; X < Z.length; X += Y){
        gSaveStr += makeInputString('macroText', fixQuotes(escapeEntities(Z.slice(X, X + Y))));
    }
    if(gDataSources)
        for(X = 0; X < gDataSources.length; ++ X)
            gSaveStr += saveSource(gDataSources[X]);
    if((typeof gDerivedFrom != 'undefined') && gDerivedFrom)
        gSaveStr += makeInputString('derivedFrom', (gDerivedFrom));
    gSaveStr += makeInputString('columnCount', (gColumnCount - 1));
    gSaveStr += makeInputString('rowCount', (gRowCount - 1));
    gSaveStr += makeInputString('gridWidth', gGridWidth);
    var W;
    var V,
    U;
    for(var T = 0; T < gSheetCount; T ++ ){
        for(var S = 1; S < gColumnCount; S ++ ){
            W = index2cell(0, S, T);
            var R = gColWidths[S];
            V = U;
            if(W !=- 1){
                R = getWidth(W);
                V = W._borderBottom;
            }
            if(R != kColumnSize || V){
                gSaveStr += makeInputString('columnId', S);
                gSaveStr += makeInputString('columnWidth', R);
                gSaveStr += makeInputString('columnBorder', V);
            }
        }
        for(var Q = 1; Q < gRowCount; Q ++ ){
            W = index2cell(Q, 0, T);
            var P = gRowHeights[Q];
            V = U;
            if(W !=- 1){
                P = getPixelHeight(W);
                V = W._borderRight;
            }
            if(P != kRowSize || V){
                gSaveStr += makeInputString('rowId', Q);
                gSaveStr += makeInputString('rowHeight', P);
                gSaveStr += makeInputString('rowBorder', V);
            }
        }
    }
}
function buildSaveBody2(){
    var Z = gCellDataArray.length;
    var Y = new Array();
    for(var X = 0; X < Z; X ++ )
        if(gCellDataArray[X])
            Y.push(saveCell(gCellDataArray[X]));
    gSaveStr += Y.join("");
    var W = "";
    for(var V in gRecalcDirty)
        W += gRecalcDirty[V].m_name + ' ';
    gSaveStr += makeInputString('dirty', W);
}
var kSavers = new Array('locked', 'hidden', 'positiveFormat', 'negativeFormat', 'vanishedFormat', 'nonvalueFormat', 'view', 'foreColor', 'bk_color', 'viewFamily', 'viewSize', '_fontWeight', '_textDecoration', '_fontStyle', '_borderTop', '_borderLeft', '_borderBottom', '_borderRight', 'm_dirtyOnInit', '_wrapText', 'm_backgroundImage', '_widthClue');
function saveCell(Z){;
    var Y = "\n";
    var X = "";
    var W;
    var V = false;
    for(var U = 0; U < kSavers.length; U ++ ){
        var T = kSavers[U];
        if(T != "_widthClue" && Z[T])
            V = true;
    }
    if(Z.entry || Z.m_referredToBy)
        V = true;
    if( ! V)
        return "";
    X += 'id=' + Z.m_div.m_name + Y;
    if((W = mungeString(fixQuotes(getInner(Z.m_div, true)), 
    {
        "escapeReturns" : true
    })) != null)X += 'inner=' + W + Y;
    if(W = fixQuotes(Z.entry)){
        X += 'entry=' + W + Y;
    }
    if(W = fixQuotes(Z.dynamic))
        X += 'dynamic=' + W + Y;
    if((W = fixQuotes(Z.derived)) != null)
        X += 'derived=' + W + Y;
    if(Z.override && ((W = fixQuotes(Z.override.userValue)) != null))
        X += 'userValue=' + W + Y;
    if(Z.override && (W = fixQuotes(Z.override.origValue)))
        X += 'origValue=' + W + Y;
    if(Z.m_cellGUI){
        X += "m_cellGUI={type:\\'" + Z.m_cellGUI.type + "\\', setting:" + Z.m_cellGUI.setting + ", label:\\'" + fixQuotes(Z.m_cellGUI.label) + "\\'}" + Y;
    }
    for(var S = 0; S < kSavers.length; S ++ ){
        var R = kSavers[S];
        if(Z[R])
            X += R + '=' + Z[R] + Y;
    }
    if(Z['_textAlign'])
        X += '_textAlign' + '=' + Z['_textAlign'] + Y;
    else if(Z['textAlign'])
        X += 'textAlign' + '=' + Z['textAlign'] + Y;
    if(Z['_viewFormat'])
        X += '_viewFormat' + '=' + Z['_viewFormat'] + Y;
    else if(Z['viewFormat'])
        X += 'viewFormat' + '=' + Z['viewFormat'] + Y;
    X += 'm_refersTo=' + CellListToString(Z.m_refersTo) + Y;
    X += 'm_referredToBy=' + CellListToString(Z.m_referredToBy) + Y;
    return makeInputString('cell', X);
}
function saveSource(Z){
    var Y = "\n";
    var X = "";
    var W;
    for(var V in Z){
        if(typeof Z[V] == "number" || typeof Z[V] == "string")
            X += V + '=' + fixQuotes(Z[V]) + Y;
    }
    return makeInputString('source', X);
}
function dirtyDocument(Z){
    gSpreadsheetDirty = Z;
}
gPrintOrientation = null;
function orientationPrompt(){
    var Z = getString("strLayoutChoiceCmp", kDefaultLocale, getAppName());
    var Y = [{
        type : 'raw', value : Z
    }];
    var X = [{
        type : 'other', value : getString("strLandscape"),
        onclick : "gPrintOrientation='landscape'; ssShowPrintable(); closeModal();"
    }, 
    {
        type : 'accept',
        value : getString("strPortrait")
    }];
    openModal('orientation', getString("strPageOrientation"), null, 'gPrintOrientation = "portrait"; ssShowPrintable(); closeModal(); ', null, Y, X, null);
}
function ssShowPrintable(){
    var Z = getElement("sheet" + (gCurrSheetIndex ? gCurrSheetIndex : 0));
    ShowPrintable(PrintableContents(), [gPrintCSS], Z.offsetWidth, Z.offsetHeight, is.nav ? cl_dirty() : false);
}
function PrintableContents(){
    if(kMode == "design")
        hideSelect();
    var Z = getElement("sheet" + (gCurrSheetIndex ? gCurrSheetIndex : 0));
    var Y = Z.innerHTML.substr(0);
    if(kMode == "design")
        showSelect();
    Y = Y.replace(/BORDER\-BOTTOM\:[^;]+lightblue[^;]+\;/ig, "");
    Y = Y.replace(/BORDER\-RIGHT\:[^;]+lightblue[^;]+\;/ig, "");
    Y = Y.replace(/BORDER\-TOP\:[^;]+\#a0a0e6[^;]+\;/ig, "");
    Y = Y.replace(/BORDER\-LEFT\:[^;]+\#a0a0e6[^;]+\;/ig, "");
    Y = Y.replace(/(m_name[ '"]*=[ '"]*r0[^\>]{4,9}\>)[\w ]{1,5}(\<\/SPAN)/gi, "$1$2");
    Y = Y.replace(/(m_name[ '"]*=[ '"]*[^\>]{2,5}c0[^\>]{2,5}\>)[\w ]{1,5}(\<\/SPAN)/gi, "$1$2");
    if(kMode == "design")
        Y = "<SPAN style='position:absolute; top:-17px; left:-67px;'>" + Y + "</SPAN>";
    return Y;
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();