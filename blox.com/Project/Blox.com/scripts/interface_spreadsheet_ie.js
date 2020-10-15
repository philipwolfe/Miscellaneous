//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kLightYellow = "FFFFBB";
function openFormat(){
    var Z = '';
    var Y = '';
    var X = '';
    var W = '';
    if(gSelectPrime.cellData){
        Z = forceString(gSelectPrime.cellData.positiveFormat);
        Y = forceString(gSelectPrime.cellData.negativeFormat);
        X = forceString(gSelectPrime.cellData.vanishedFormat);
        W = forceString(gSelectPrime.cellData.nonvalueFormat);
    }
    var V = [{
        type : "input", id : "positiveEntry",
        label : getString("strPositive"),
        value : Z,
        size : 25,
        maxlength : 200
    }, 
    {
        type : "input",
        id : "negativeEntry",
        label : getString("strNegative"),
        value : Y,
        size : 25,
        maxlength : 200
    }, 
    {
        type : "input",
        id : "vanishedEntry",
        label : getString("strZero"),
        value : X,
        size : 25,
        maxlength : 200
    }, 
    {
        type : "input",
        id : "nonvalueEntry",
        label : getString("strError"),
        value : W,
        size : 25,
        maxlength : 200
    }];
    var U = [{
        type : "accept"
    }, 
    {
        type : "cancel"
    }];
    openModal("custom_format", getString("strCustomFormat"), "", "acceptFormat()", "closeModal()", V, U, "positiveEntry");
}
function acceptFormat(){
    closeModal();
    cellformat2range("positiveFormat", getValue(positiveEntry));
    cellformat2range("negativeFormat", getValue(negativeEntry));
    cellformat2range("vanishedFormat", getValue(vanishedEntry));
    cellformat2range("nonvalueFormat", getValue(nonvalueEntry));
    cellformat2range("_viewFormat", "custom");
    pulseRange();
}
var gDefaultMacroText = "\r\nfunction init() {\r\n\t// " + getString("strPutInitializationCode") + "\r\n}\r\n\r\n";
var gLastMacroSelection = null;
function openMacro(){
    var Z = '<div style="margin-bottom:10px;">' + '<select id="macroFnPopup" style="width:180px;" onChange="jumpToMacro(this.options[this.selectedIndex])">' + '<option value="_">' + getString("strJumpToFunction") + '...' + '<option value="_">-------------------------' + '</select>' + '</div>' + '<textarea id="macroText" wrap="off" allowTabs="true" style="overflow:scroll; width:550; height:275;" onChange="refreshMacroFunctionPopup()"></textarea>';
    var Y = [{
        type : 'raw', value : Z
    }];
    var X = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }, 
    {
        type : 'other', value : getString("strHelp"),
        onclick : "ShowHelp('bc_macros');"
    }];
    openModal('edit_macros', getString("strMacros"), "validateMacros()", "acceptMacros()", "closeModal()", Y, X, "macroText", true);
    setTimeout("populateMacros()", 0);
    gLastMacroSelection = null;
}
function populateMacros(){
    if( ! gMacroText){
        macroText.value = gDefaultMacroText;
    }
    else{
        macroText.value = gMacroText;
        gMacroText = macroText.value;
    }
    refreshMacroFunctionPopup();
}
function refreshMacroFunctionPopup(){
    var Z = macroFnPopup;
    var Y = getValue(macroText);
    Y = Y.replace(/\r\n/g, "\n");
    var X = extractJsFunctionNames(Y);
    X.sort();
    Z.length = 2;
    for(var W = 0; W < X.length; W ++ )
        Z.options[W + 2] = new Option(X[W][0], X[W][1]);
}
function jumpToMacro(Z){;
    var Y = macroFnPopup;
    var X = macroText;
    Y.selectedIndex = 0;
    X.focus();
    var W = Z.text;
    var V = Z.value;
    if(V == "_")
        return;
    var U = getValue(X);
    U = U.replace(/\r\n/g, "\n");
    var T = X.createTextRange();
    T.moveStart('character', V);
    T.scrollIntoView();
    T.moveEnd('character' ,- (U.length - V - 9 - W.length));
    T.select();
}
function storeMacroSelection(){
    var Z = document.selection.createRange();
    gLastMacroSelection = Z;
}
function doMacroFind(){
    var Z;
    var Y = getValue(macroFind);
    if(gLastMacroSelection){
        Z = gLastMacroSelection.duplicate();
        Z.collapse(false);
    }
    else{
        Z = macroText.createTextRange();
        Z.collapse(true);
    }
    var X = Z.findText(Y);
    if(X)
        Z.select();
    else{
        Z.move('textedit' ,- 1);
        X = Z.findText(Y);
        if(X)
            Z.select();
    }
    return X;
}
function validateMacros(){
    var Z = null;
    gSafeEvalReturn = 0;
    var Y = SafeEval("gSafeEvalReturn = new Function( getValue( getElement('macroText') ) )");
    if(Y || typeof gSafeEvalReturn != 'function')
        Z = getString("strMacroSyntaxError") + ": " + Y;
    gSafeEvalReturn = 0;
    if(Z)
        return Z;
    var X = extractJsFunctionNames(getValue(getElement('macroText')));
    for(var W = 0; W < X.length; W ++ ){
        var V = X[W][0];
        if(functSymbol(V))
            return getString("strCantOverrideFunction", kDefaultLocale, V.toLowerCase());
    }
}
function acceptMacros(){
    closeModal();
    var Z = macroText;
    var Y = getValue(Z);
    if(Y == gDefaultMacroText)
        return;
    if(trimString(Y) != trimString(gMacroText))
        gSpreadsheetDirty = true;
    gMacroText = Y;
    RecompileMacros();
}
function openRowHeight(){
    var Z = findSelect();
    var Y = (Z.rowStart == Z.rowFinal) ? parseInt(gSelectStart.style.height) : "";
    var X = [{
        type : 'raw', value : getString("strRowHeight") + ': <INPUT id=rowHeight value="' + Y + '" size=2 maxlength=4>&nbsp;' + getString("strPixelsSmall")
    }];
    var W = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('rowHeight', getString("strRowHeight"), "validateRowHeight()", "acceptRowHeight()", "closeModal()", X, W, "rowHeight");
}
function acceptRowHeight(){
    closeModal();
    var Z = findSelect(true);
    var Y = getElementIntegerValue("rowHeight");
    if(is.ie5up){
        for(var X = Z.rowMin; X <= Z.rowMax; X ++ ){
            SetRowHeight(X, gCurrSheetIndex, Y, getHeight(gCellElemMatrix[X][0]));
        }
    }
    else{
        SetRowHeight(Z.rowStart, gCurrSheetIndex, Y, parseInt(gSelectPrime.style.height));
    }
    setTimeout("sheetChanged();", 100);
    gSpreadsheetDirty = true;
}
function validateRowHeight(){
    var Z = getElementIntegerValue("rowHeight");
    var Y = getElement("rowHeight");
    if(Z == null){
        Y.select();
        return getString("strRowHeightNumber");
    }
    if((Z < kRowMinimum) || (Z > kRowMaximum)){
        Y.select();
        return getString("strRowHeightRangeCmp", kDefaultLocale, kRowMinimum, kRowMaximum);
    }
    return false;
}
function openColumnWidth(){
    var Z = findSelect();
    var Y = (Z.columnStart == Z.columnFinal) ? parseInt(gSelectStart.style.width) : "";
    var X = [{
        type : 'raw', value : getString("strColumnWidth") + ': <INPUT id=columnWidth value="' + Y + '" size=2 maxlength=4>&nbsp;' + getString("strPixelsSmall")
    }];
    var W = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('columnWidth', getString("strColumnWidth"), "validateColumnWidth()", "acceptColumnWidth()", "closeModal()", X, W, "columnWidth");
}
function acceptColumnWidth(){
    closeModal();
    var Z = findSelect(true);
    var Y = getElementIntegerValue("columnWidth");
    if(is.ie5up){
        for(var X = Z.columnMin; X <= Z.columnMax; X ++ ){
            SetColumnWidth(X, gCurrSheetIndex, Y, getWidth(gCellElemMatrix[0][X]));
        }
    }
    else{
        SetColumnWidth(Z.columnStart, gCurrSheetIndex, Y, parseInt(gSelectPrime.style.width));
    }
    setTimeout("sheetChanged();", 100);
    gSpreadsheetDirty = true;
}
function validateColumnWidth(){
    var Z = getElementIntegerValue("columnWidth");
    var Y = getElement("columnWidth");
    if(Z == null){
        Y.select();
        return getString("strColumnWidthNumber");
    }
    if((Z < kColumnMinimum) || (Z > kColumnMaximum)){
        Y.select();
        return getString("strColumnWidthRangeCmp", kDefaultLocale, kColumnMinimum, kColumnMaximum);
    }
    return false;
}
function openSetSize(){
    var Z = [{
        type : 'input', id : 'columnsEntry',
        label : getString("strColumns"),
        value : (gColumnCount - 1),
        size : 3,
        maxlength : 3
    }, 
    {
        type : 'input',
        id : 'rowsEntry',
        label : getString("strRows"),
        value : (gRowCount - 1),
        size : 3,
        maxlength : 3
    }];
    var Y = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('set_size', getString("strSetSpreadsheetSize"), "validateSetSize()", "acceptSetSize()", "closeModal()", Z, Y, "columnsEntry");
}
function validateSetSize(){
    var Z = getElementIntegerValue("columnsEntry");
    var Y = getElement("columnsEntry");
    if(Z == null){
        Y.select();
        return getString("strColumnFieldNumber");
    }
    var X = getElementIntegerValue("rowsEntry");
    var W = getElement("rowsEntry");
    if(X == null){
        W.select();
        return getString("strRowFieldNumber");
    }
    if(Z < kMinColumns){
        Y.select();
        return getString("strMinColumnsCmp", kDefaultLocale, kMinColumns);
    }
    if(Z > kMaxColumns){
        Y.select();
        return getString("strMaxColumnsCmp", kDefaultLocale, kMaxColumns);
    }
    if(X < kMinRows){
        W.select();
        return getString("strMinRowsCmp", kDefaultLocale, kMinRows);
    }
    if(X > kMaxRows){
        W.select();
        return getString("strMaxRowsCmp", kDefaultLocale, kMaxRows);
    }
    if(X * Z > gMaximumCellCount){
        return getString("strMaxCellsCmp", kDefaultLocale, gMaximumCellCount);
    }
    return false;
}
function acceptSetSize(){
    closeModal();
    var Z = getElementIntegerValue("columnsEntry");
    var Y = getElementIntegerValue("rowsEntry");
    if((Y == gRowCount - 1) && (Z == gColumnCount - 1))
        return;
    if((Y < gRowCount - 1) || (Z < gColumnCount - 1)){
        var X = getString("strCropWarning");
        hb_confirm(X, getString("strSetSpreadsheetSize"), getString("strYes"), "", getString("strNo"), "doSetSize(" + Y + ", " + Z + ", true)", "", "");
    }
    else
        doSetSize(Y, Z, false);
}
function doSetSize(Z, Y, X){
    hb_progress(getString("strResizing"), "", 0);
    setTimeout("monitoredSetSize(" + Z + ", " + Y + ", true)", 0);
}
var currentSizeProgress = 0;
function monitoredSetSize(Z, Y, X){
    var W = Z - gRowCount + 1;
    var V = Y - gColumnCount + 1;
    var U = 0;
    var T = 0;
    var S = 0.1;
    if(Math.abs(W) <= 5 && W != 0)
        U = 1;
    else{
        if(Math.floor(W / 5) == 0 && W != 0){
            U = 1;
        }
        else if(Math.abs(W / 5) - Math.floor(W / 5) > 0){
            U = Math.floor(W / 5) + 1;
        }
        else{
            U = Math.floor(W / 5);
        }
        U = Math.abs(U);
    }
    if(Math.abs(V) <= 5 && V != 0)
        T = 1;
    else{
        if(Math.floor(V / 5) == 0 && V != 0){
            T = 1;
        }
        else if(Math.abs(V / 5) - Math.floor(V / 5) > 0){
            T = Math.floor(V / 5) + 1;
        }
        else{
            T = Math.floor(V / 5);
        }
        T = Math.abs(T);
    }
    S = 1 / (U + T);
    setTimeout("doMonitoredAddRows(" + W + ", " + V + ", " + X + ", " + S + ")", 0);
}
function doMonitoredAddRows(Z, Y, X, W){
    if(Z > 0){
        if(Z > 5){
            updateRowSize(5, X);
            Z -= 5;
        }
        else{
            updateRowSize(Z, X);
            Z = 0;
        }
    }
    else if(Z < 0){
        if(Z <- 5){
            updateRowSize( - 5, X);
            Z += 5;
        }
        else{
            updateRowSize(Z, X);
            Z = 0;
        }
    }
    setTimeout("updateRowProgress(" + Z + ", " + Y + ", " + X + ", " + W + ")", 0);
}
function updateRowProgress(Z, Y, X, W){
    currentSizeProgress += W;
    hb_progress(getString("strResizing"), "", currentSizeProgress);
    if(Z != 0){
        setTimeout("doMonitoredAddRows(" + Z + ", " + Y + ", " + X + ", " + W + ")", 0);
    }
    else{
        setTimeout("doMonitoredAddColumns(" + Y + ", " + X + ", " + W + ")", 0);
    }
}
function doMonitoredAddColumns(Z, Y, X){
    if(Z > 0){
        if(Z > 5){
            updateColumnSize(5, Y);
            Z -= 5;
        }
        else{
            updateColumnSize(Z, Y);
            Z = 0;
        }
    }
    else if(Z < 0){
        if(Z <- 5){
            updateColumnSize( - 5, Y);
            Z += 5;
        }
        else{
            updateColumnSize(Z, Y);
            Z = 0;
        }
    }
    setTimeout("updateColumnProgress(" + Z + ", " + Y + ", " + X + ")", 0);
}
function updateColumnProgress(Z, Y, X){
    currentSizeProgress += X;
    hb_progress(getString("strResizing"), "", currentSizeProgress);
    if(Z != 0)
        setTimeout("doMonitoredAddColumns(" + Z + ", " + Y + ", " + X + ")", 0);
    else
        setTimeout("doMonitoredSetSizeCleanUp()", 0);
}
function doMonitoredSetSizeCleanUp(){
    currentSizeProgress = 0;
    hb_progress("", "", null);
}
function updateRowSize(Z, Y){
    if(Y && Z < 0){
        var X =- Z;
        var W = gRowCount - X;
        var V = gRowCount - 1;
        hideSelect();
        gSelectPrime = gSelectFinal = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
        DeleteRows(W, V, X);
        showSelect();
    }
    if(Z > 0){
        var U = Z;
        var T = gRowCount;
        InsertRows(U, T);
    }
}
function updateColumnSize(Z, Y){
    if(Y && Z < 0){
        var X =- Z;
        var W = gColumnCount - X;
        var V = gColumnCount - 1;
        hideSelect();
        gSelectPrime = gSelectFinal = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
        DeleteColumns(W, V, X);
        showSelect();
    }
    if(Z > 0){
        var U = Z;
        var T = gColumnCount;
        InsertColumns(U, T);
    }
}
function doSetSize2(Z, Y, X){
    if(X){
        if(Z < gRowCount - 1){
            var W = gRowCount - Z - 1;
            var V = Z + 1;
            var U = gRowCount - 1;
            hideSelect();
            gSelectPrime = gSelectFinal = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
            DeleteRows(V, U, W);
            showSelect();
        }
        if(Y < gColumnCount - 1){
            var T = gColumnCount - Y - 1;
            var S = Y + 1;
            var R = gColumnCount - 1;
            hideSelect();
            gSelectPrime = gSelectFinal = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
            DeleteColumns(S, R, T);
            showSelect();
        }
    }
    if(Y > gColumnCount - 1){
        var Q = Y - gColumnCount + 1;
        var P = gColumnCount;
        InsertColumns(Q, P);
    }
    if(Z > gRowCount - 1){
        var O = Z - gRowCount + 1;
        var N = gRowCount;
        InsertRows(O, N);
    }
}
function OpenAbout(){
    var Z = ["Joe Ternasky", "Steve Guttman", "Don Vail", "Ethan Diamond", "Shawn Grunberger", "Iain Lamb", "Don Marzetta", "Sailaja Suresh", "Mari Frediani", "Samuel Im", "Michal Krombholz", "Kevin Johnston", "John Daggett", "J.C. Lopez-Melgar", "Gino Relampagos", "Katya Petkova", "Robbie Scott", "Tony Lu", "Kevin Brown", "Deanna Kosaraju", "Seth Sternglanz", "Alexander Hong", "Akie Nakayama", "Arvind Srivastava", "John Sidik"];
    var Y = ["Thanh Mai", "Ayanna Sawyer", "Lane Pasut", "Kasem Abotel", "Julio Santos", "Dave Messink", "Matt Stave", "Connie Yang", "Christina Warren", "Jessica Lu", "Steve Wagner", "Yelena Martynov", "Ramesh Raghavan", "Meghana Venugopal", "Danny Sokolsky", "Charles Eubanks", "Carol Ewton"];
    var X = "";
    var W,
    V,
    U;
    U = Z.length;
    V = randInt(0, U - 1);
    for(W = V; W < U; W ++ )
        X += Z[W] + ", ";
    for(W = 0; W < V; W ++ )
        X += Z[W] + ", ";
    U = Y.length;
    V = randInt(0, U - 1);
    for(W = V; W < U; W ++ )
        X += Y[W] + ", ";
    for(W = 0; W < V; W ++ )
        X += Y[W] + ", ";
    X = X.substring(0, X.length - 2);
    X += " " + getString("strAndChase");
    var T = '<img src="' + kRootUrl + kImageDirectory + (gIsMatterhorn ? 'ablox_logo_200x50_yellow.gif' : 'blox_logo_165x50_trans.gif') + '" width=' + (gIsMatterhorn ? '200' : '165') + ' height=50 border=0 alt=""><br>' + '<div style="margin-left:12px; margin-top:10px; margin-right:10px;">' + '<nobr><b>' + (gIsMatterhorn ? getString("strAlphabloxSpreadsheet") : getString("strBloxBrainmatter")) + ' v1.5</b></nobr><br><br>' + '<nobr>' + getString("strCopyright") + ' &copy; 1999-2001 <A HREF="http://www.alphablox.com" target="_blank" tabIndex="-1" onFocus="this.blur()">' + getString("strAlphabloxCorp") + '</A></nobr> ' + getString("strAllRightsReserved") + '.' + '<br><br><small><b>' + getString("strCreatedBy") + ': </b>' + X + '</small>' + '</div>';
    hb_alert(T, getString("strAboutCmp", kDefaultLocale, getAppName()));
}
function showContextual(){
    if(gInPreview)
        return;
    var Z = view;
    var Y = event.clientX + Z.scrollLeft;
    var X = event.clientY + Z.scrollTop - 81;
    var W = Z.scrollLeft + Z.clientWidth - getWidth(contextualMenu);
    var V = Z.scrollTop + Z.clientHeight - getHeight(contextualMenu);
    if(Y > W)
        Y = W;
    if(X > V)
        X = V;
    contextualMenu.style.leftPos += 7;
    contextualMenu.style.posLeft = Y;
    contextualMenu.style.posTop = X;
    contextualMenu.style.visibility = "visible";
    contextualMenu.setCapture();
}
function clickContext(){
    if((event.type == "mousedown" && event.srcElement.className != "largeItem") || event.type == "mouseup"){
        contextualMenu.releaseCapture();
        contextualMenu.style.visibility = "hidden";
    }
}
function handleContextLoseCapture(){
    contextualMenu.style.visibility = "hidden";
}
function sheetSelect(Z){
    if((Z < 0) || (Z >= gSheetCount))
        return;
    if(Z == gCurrSheetIndex)
        return;
    hideSelect();
    gCurrSheetIndex = Z;
    gSelectKind = "range";
    gSelectPrime = index2cell(1, 1, gCurrSheetIndex);
    gSelectStart = gSelectPrime;
    gSelectFinal = gSelectPrime;
    for(var Y = 0; Y < gSheetCount; Y ++ )
        setDisplay(getElement("sheet" + Y), (Y == Z));
    showSelect();
    fetchEntry();
}
function sheetChanged(){
    var Z = 0;
    var Y = 0;
    for(var X = 0; X < gSheetCount; X ++ ){
        var W = getElement("sheet" + X);
        Z = max(Z, getWidth(W));
        Y = max(Y, getHeight(W));
    }
    var V = book;
    setHeight(V, Y + (kGutterHeight * 2));
    setWidth(V, Z + (kGutterWidth * 2));
}
function selectToPixelCoordRect(){
    var Z = new Object();
    var Y = getBounds(gSelectPrime);
    var X = getBounds(gSelectFinal);
    Z.left = min(Y.left, X.left);
    Z.top = min(Y.top, X.top);
    Z.right = max(Y.right, X.right);
    Z.bottom = max(Y.bottom, X.bottom);
    Z.height = Z.bottom - Z.top;
    Z.width = Z.right - Z.left;
    return Z;
}
function selectToRowColIndexRect(Z){
    var Y = new Object();
    Y.left = Z.columnMin;
    Y.top = Z.rowMin;
    Y.right = Z.columnMax + 1;
    Y.bottom = Z.rowMax + 1;
    Y.height = Y.bottom - Y.top;
    Y.width = Y.right - Y.left;
    return Y;
}
function findSelect(Z){
    var Y = new Object();
    Y.rowPrime = cell2row(gSelectPrime);
    Y.rowStart = cell2row(gSelectStart);
    Y.rowFinal = cell2row(gSelectFinal);
    if(Z){
        Y.rowStart = pin(Y.rowStart, 1, gRowCount - 1);
        Y.rowFinal = pin(Y.rowFinal, 1, gRowCount - 1);
    }
    Y.rowMin = min(Y.rowStart, Y.rowFinal);
    Y.rowMax = max(Y.rowStart, Y.rowFinal);
    Y.columnPrime = cell2column(gSelectPrime);
    Y.columnStart = cell2column(gSelectStart);
    Y.columnFinal = cell2column(gSelectFinal);
    if(Z){
        Y.columnStart = pin(Y.columnStart, 1, gColumnCount - 1);
        Y.columnFinal = pin(Y.columnFinal, 1, gColumnCount - 1);
    }
    Y.columnMin = min(Y.columnStart, Y.columnFinal);
    Y.columnMax = max(Y.columnStart, Y.columnFinal);
    return Y;
}
function moveSelect(Z, Y){
    var X = findSelect(true);
    var W = X.rowPrime + Z;
    var V = X.columnPrime + Y;
    if(W < 1)
        W = gRowCount - 1;
    else if(W >= gRowCount)
        W = 1;
    if(V < 1)
        V = gColumnCount - 1;
    else if(V >= gColumnCount)
        V = 1;
    var U = index2cell(W, V, gCurrSheetIndex);
    if(U != gSelectPrime){
        storeEntry();
        hideSelect();
        gSelectKind = "range";
        gSelectPrime = U;
        gSelectStart = gSelectPrime;
        gSelectFinal = gSelectPrime;
        showSelect();
        fetchEntry();
    }
    if((parseInt(U.style.width) == 0) || (parseInt(U.style.height) == 0))
        moveSelect(Z, Y);
}
function moveRange(Z, Y){
    var X = cell2row(gRangePrime) + Z;
    var W = cell2column(gRangePrime) + Y;
    if(X < 1)
        X = gRowCount - 1;
    else if(X >= gRowCount)
        X = 1;
    if(W < 1)
        W = gColumnCount - 1;
    else if(W >= gColumnCount)
        W = 1;
    var V = index2cell(X, W, gCurrSheetIndex);
    if(V != gRangePrime){
        gRangePrime = V;
        gRangeFinal = gRangePrime;
        DrawClipboardRect("range");
        gSelection.moveStart("character" ,- gLastRangeStringLength);
        gSelection.select();
        UpdateRangeString();
        gSelection.collapse(false);
        gSelection.select();
    }
    if((parseInt(V.style.width) == 0) || (parseInt(V.style.height) == 0))
        moveRange(Z, Y);
}
function expandShrinkSelect(Z, Y){
    var X = findSelect(true);
    var W = X.rowFinal + Z;
    var V = X.columnFinal + Y;
    W = pin(W, 1, gRowCount - 1);
    V = pin(V, 1, gColumnCount - 1);
    var U = index2cell(W, V, gCurrSheetIndex);
    hideSelect();
    gSelectFinal = U;
    showSelect();
    fetchEntry();
    if((parseInt(U.style.width) == 0) || (parseInt(U.style.height) == 0))
        expandShrinkSelect(Z, Y);
}
function expandShrinkRange(Z, Y){
    var X = cell2row(gRangeFinal) + Z;
    var W = cell2column(gRangeFinal) + Y;
    X = pin(X, 1, gRowCount - 1);
    W = pin(W, 1, gColumnCount - 1);
    var V = index2cell(X, W, gCurrSheetIndex);
    gRangeFinal = V;
    DrawClipboardRect("range");
    gSelection.moveStart("character" ,- gLastRangeStringLength);
    gSelection.select();
    UpdateRangeString();
    gSelection.collapse(false);
    gSelection.select();
    if((parseInt(V.style.width) == 0) || (parseInt(V.style.height) == 0))
        expandShrinkRange(Z, Y);
}
function showSelect(){
    paintSelect("black", "yellow", "black", kLightYellow);
    if(gSelectPrime != null){
        setStyle(index2cell(0, cell2column(gSelectPrime), gCurrSheetIndex), "fontWeight", "bold");
        setStyle(index2cell(cell2row(gSelectPrime), 0, gCurrSheetIndex), "fontWeight", "bold");
    }
}
function hideSelect(){
    paintSelect(null, null, null, null);
    if(gSelectPrime != null){
        setStyle(index2cell(0, cell2column(gSelectPrime), gCurrSheetIndex), "fontWeight", "normal");
        setStyle(index2cell(cell2row(gSelectPrime), 0, gCurrSheetIndex), "fontWeight", "normal");
    }
}
function paintSelect(Z, Y, X, W){
    if((gSelectStart == null) || (gSelectFinal == null))
        return;
    var V = findSelect(false);
    for(var U = V.rowMin; U <= V.rowMax; U ++ ){
        for(var T = V.columnMin; T <= V.columnMax; T ++ ){
            var S = index2cell(U, T, gCurrSheetIndex);
            paintSelectCell(S, Z, Y, X, W, ((T == 0) || (U == 0)));
        }
    }
}
function paintSelectCell(Z, Y, X, W, V, U){
    var T = W;
    if(Z == gSelectPrime)
        T = Y;
    if(T == null && Z.cellData)
        T = Z.cellData.foreColor;
    if(T == null)
        T = "black";
    var S = V;
    if(Z == gSelectPrime)
        S = X;
    if(S == null && Z.cellData)
        S = Z.cellData.bk_color;
    if(S == null)
        S = "white";
    if(U){
        if(S == "white"){
            S = "whitesmoke";
        }
        else{
            S = "rgb(180,180,180)";
        }
    }
    setStyle(Z, "color", T);
    setStyle(Z, "backgroundColor", S);
    if(is.ie4){
        var R = getChild(Z, "SPAN");
        if(R)
            setStyle(R, "color", T);
    }
}
function deltaSelect(){
    var Z = findSelect(false);
    var Y = selectToRowColIndexRect(Z);
    var X = selectToRowColIndexRect(gLastSelect);
    var W = new Array();
    var V = new Array();
    diffBoundsOverlap(Y, X, W, V);
    if(window.event.shiftKey){
        var U = 3;
    }
    var T;
    var S;
    var R;
    var Q;
    for(T = 0; T < W.length; T ++ ){
        S = W[T];
        for(R = S.left; R < S.right; R ++ ){
            for(Q = S.top; Q < S.bottom; Q ++ ){
                paintSelectCell(index2cell(Q, R, gCurrSheetIndex), "black", "yellow", "black", kLightYellow, ((R == 0) || (Q == 0)));
            }
        }
    }
    for(T = 0; T < V.length; T ++ ){
        S = V[T];
        for(R = S.left; R < S.right; R ++ ){
            for(Q = S.top; Q < S.bottom; Q ++ ){
                paintSelectCell(index2cell(Q, R, gCurrSheetIndex), null, null, null, null, ((R == 0) || (Q == 0)));
            }
        }
    }
}
var gEntryTimer = null;
function ss_dirty(){
    return gSpreadsheetDirty && (window.location.href.search(/savePrompt=0/i) ==- 1);
}
function fetchEntry(){
    gEntryTimer = killTimeout(gEntryTimer);
    gEntryTimer = setTimeout("timerEntry();", 100);
}
function timerEntry(){
    var Z = getElement('entry');
    gEntry.cell = gSelectPrime;
    if(isOverrideEnabled(gEntry.cell.cellData)){
        seedEntry(gBtnOverrideSticky ? "default" : "override");
        showOverrideButton(true);
        resetButton(btnOverride, gBtnOverrideSticky);
    }
    else{
        seedEntry("default");
        showOverrideButton(false);
    }
    setInner(label, OldToNewStyle(gEntry.cell.m_name) + ":");
    gEntryTimer = killTimeout(gEntryTimer);
    var Y = gEntry.cell;
    var X;
    value = getExtraDefault(Y.cellData, "viewFamily", getDefaultFont());
    fontSpot.value = getFontFamilyName(value);
    value = getExtraDefault(Y.cellData, "viewSize", "10 pt");
    sizeSpot.value = value;
    value = getStyle(Y, "fontWeight");
    resetButton(bold, value == "bold");
    value = getStyle(Y, "fontStyle");
    resetButton(italic, value == "italic");
    value = getStyle(Y, "textDecoration");
    resetButton(underline, value == "underline");
    value = getExtraDefault(Y.cellData, "foreColor", "black");
    setStyle(textColorMenuSpot, "backgroundColor", value);
    value = getExtraDefault(Y.cellData, "bk_color", "white");
    setStyle(backgroundColorMenuSpot, "backgroundColor", value);
    value = getExtraDefault(Y.cellData, "_textAlign", null);
    if(emptyString(value))
        value = getExtraDefault(Y.cellData, "textAlign", null);
    if(emptyString(value))
        value = getStyle(Y, "textAlign");
    if(emptyString(value))
        value = null;
    X = value ? getElement(value) : null;
    selectInGroup(X, "left");
    selectInGroup(X, "center");
    selectInGroup(X, "right");
}
function storeEntry(){
    setStyle(getElement("editPalette"), "zIndex", "-5");
    getElement("entry").style.height = 22;
    var Z = (gEntry.cell && gEntry.cell.cellData) ? gEntry.cell.cellData : null;
    cacheEntry();
    var Y = gEntry.formula;
    var X = gEntry.override;
    var W = "";
    var V = "";
    if(Z){
        W = typeof Z.entry != "undefined" ? Z.entry.replace(/\t/g, "") : "";
        V = getCellOverride(Z);
    }
    if( ! isOverrideEnabled(Z)){
        if(Y == W)
            return;
    }
    else{
        var U = {};
        if(Y == "")
            clearOverride(Z);
        else if(X != null && floatString(X, U, false, gEntryLocale))
            X = U.value;
        if((X == void(0) || X == V || (X == gEntry.cell.cellData.derived && V == void(0))) &&! (Y != W || Y == "")){
            return;
        }
    }
    CheckForCellData(gEntry.cell.m_name);
    if(isOverrideEnabled(gEntry.cell.cellData) && X != gEntry.cell.cellData.derived &&! gBtnOverrideSticky)
        setCellOverride(gEntry.cell.cellData, X);
    if(Y != W)
        buildCell(gEntry.cell, Y);
    else
        pulseCell(gEntry.cell);
    gEntry.formula = "";
    gEntry.override = "";
    gSpreadsheetDirty = true;
}
function seedEntry(Z){
    var Y = "";
    var X = "";
    var W = "";
    if(gEntry.cell.cellData){
        Y = getExtraDefault(gEntry.cell.cellData, "entry", "");
        Y = Y.replace(/\t/g, "");
        X = getCellOverrideFormatted(gEntry.cell.cellData);
    }
    gEntry.formula = Y;
    gEntry.override = X;
    setEntryState(Z);
}
function flipEntry(Z){
    cacheEntry();
    setEntryState(Z);
}
function cacheEntry(){
    var Z = GetEntryText();
    if(gEntry.state == "override")
        gEntry.override = Z;
    else
        gEntry.formula = Z;
}
function drawEntry(Z, Y){
    var X = getElement('entry');
    if(Z == null)
        Z == "";
    Z = Z.replace(/&lt;/g, '<');
    Z = Z.replace(/&gt;/g, '>');
    setValue(X, Z);
    focusEntry();
}
function setEntryState(Z){
    var Y;
    if(Z == "override"){
        gEntry.state = "override";
        Y = gEntry.override;
    }
    else{
        gEntry.state = "default";
        Y = gEntry.formula;
    }
    drawEntry(Y, Z);
}
function touchEntry(){
    if(gEntryTimer){
        timerEntry();
        focusEntry();
    }
}
function handleOnBlurEntryField(){
    gEntryClickFocused = 0;
}
var gRefocusEntryFieldTimer = null;
gbEntryRefocusBlocked = false;
function refocusEntryField(){
    if(gbEntryRefocusBlocked == true){
        gbEntryRefocusBlocked = false;
        return;
    }
    gRefocusEntryFieldTimer = setTimeout("refocusEntryFieldHelper()", 500);
}
function refocusEntryFieldHelper(){
    var Z = getElement("entry");
    if(Z != null)
        Z.focus();
}
function cancelEntryFieldRefocus(){
    if(gRefocusEntryFieldTimer != null)
        clearTimeout(gRefocusEntryFieldTimer);
}
function blockNextEntryFieldRefocus(){
    gbEntryRefocusBlocked = true;
}
function focusEntry(){
    var Z = getElement('entry');
    updateEntryHeight();
    if(getDisplay(Z)){
        Z.focus();
        Z.select();
    }
}
function SetEntryText(Z){
    var Y = getElement('entry');
    setValue(Y, Z);
    focusEntry();
}
function GetEntryText(){
    var Z = getElement('entry');
    return getValue(Z);
}
function showOverrideButton(Z){
    var Y = entryHolder;
    var X = btnOverride;
    var W = btnRevert;
    if(Z){
        setStyle(X, "left", "auto");
        setLeft(W, 150);
        setLeft(X, 180);
        setLeft(Y, 210);
        setVisible(W, true);
        setVisible(X, true);
    }
    else{
        setVisible(X, false);
        setVisible(W, false);
        setLeft(Y, 150);
    }
}
function pulseRange(){
    var Z = findSelect(true);
    for(var Y = Z.rowMin; Y <= Z.rowMax; Y ++ )
        for(var X = Z.columnMin; X <= Z.columnMax; X ++ )
            pulseCell(index2cell(Y, X, gCurrSheetIndex));
}
function dirtyRange(){
    var Z = findSelect(true);
    for(var Y = Z.rowMin; Y <= Z.rowMax; Y ++ )
        for(var X = Z.columnMin; X <= Z.columnMax; X ++ )
            dirtyCell(index2cell(Y, X, gCurrSheetIndex));
}
function cellformat2range(Z, Y){
    var X = findSelect(true);
    for(var W = X.rowMin; W <= X.rowMax; W ++ )
        for(var V = X.columnMin; V <= X.columnMax; V ++ ){
            var U = CheckForCellData(index2name(W, V, gCurrSheetIndex));
        setCellFormat(U, Z, Y);
    }
    gSpreadsheetDirty = true;
}
function frame2range(Z){
    var Y;
    var X;
    var W = findSelect(true);
    if(Z == "reset"){
        for(Y = W.rowMin; Y <= W.rowMax; Y ++ )
            for(X = W.columnMin; X <= W.columnMax; X ++ )
                nukeCellBorderFromOrbit(index2cell(Y, X, gCurrSheetIndex));
        gSpreadsheetDirty = true;
        return;
    }
    var V = Z.split(",");
    if(V.length != 6)
        return;
    for(Y = W.rowMin; Y <= W.rowMax; Y ++ ){
        frame2cell(index2cell(Y, W.columnMin, gCurrSheetIndex), "left", V[1]);
        frame2cell(index2cell(Y, W.columnMax, gCurrSheetIndex), "right", V[3]);
    }
    for(X = W.columnMin; X <= W.columnMax; X ++ ){
        frame2cell(index2cell(W.rowMin, X, gCurrSheetIndex), "top", V[0]);
        frame2cell(index2cell(W.rowMax, X, gCurrSheetIndex), "bottom", V[2]);
    }
    for(Y = W.rowMin; Y <= W.rowMax; Y ++ )
        for(X = W.columnMin; X < W.columnMax; X ++ )
            frame2cell(index2cell(Y, X, gCurrSheetIndex), "right", V[5]);
    for(Y = W.rowMin; Y < W.rowMax; Y ++ )
        for(X = W.columnMin; X <= W.columnMax; X ++ )
            frame2cell(index2cell(Y, X, gCurrSheetIndex), "bottom", V[4]);
    gSpreadsheetDirty = true;
}
function InvertButton(Z){
    if(getValue(Z)){
        setValue(Z, "false");
        offsetButton(Z, 0);
    }
    else{
        setValue(Z, "true");
        offsetButton(Z, 2);
    }
}
function toggleButton(Z){
    offsetButton(Z, 2);
    if(getValue(Z) == "true"){
        setValue(Z, "false");
        return false;
    }
    setValue(Z, "true");
    return true;
}
function resetButton(Z, Y){
    if(Y == true){
        setValue(Z, "true");
        offsetButton(Z, 2);
    }
    else{
        setValue(Z, "false");
        offsetButton(Z, 0);
    }
}
function selectInGroup(Z, Y){
    var X = getElement(Y);
    if(X == Z){
        offsetButton(X, 2);
        setValue(X, "true");
        return true;
    }
    offsetButton(X, 0);
    setValue(X, "false");
    return false;
}
function exceptPopup(Z, Y){
    for(id in Z){
        var X = Z[id];
        if(getDisplay(X) && (id != Y))
            setDisplay(X, false);
    }
}
function setMenu(Z, Y, X){
    var W = getElement(Y);
    var V = getElement(X);
    var U;
    if(existsElement(Z)){
        U = getElement(Z);
        U.menu = W;
        W.spot = U;
    }
    V.menu = W;
    W.list = V;
    gMenus[X] = V;
    var T = getBounds(W);
    if(W.className == "largeMenu"){
        T = insetBounds(T, 1, 2);
    }
    else if(W.className == "smallMenu"){
        T = insetBounds(T, 3, 5);
    }
    adjustMenuWidth(V);
    setTop(V, T.bottom);
    setLeft(V, T.left);
}
function setLabel(Z, Y){
    var X = getElement(Z);
    setStyle(X, "backgroundColor", "white");
    setStyle(X, "fontFamily", "tahoma, helvetica, arial, sans-serif");
    setStyle(X, "fontSize", "8pt");
    setInner(X, Y);
    setClass(X, "label");
    setVisible(X, true);
}
function viewSelect(){
    if((gSelectStart == null) || (gSelectFinal == null))
        return;
    var Z = findSelect(false);
    var Y = zeroBounds();
    for(var X = Z.rowMin; X <= Z.rowMax; X ++ )
        for(var W = Z.columnMin; W <= Z.columnMax; W ++ )
            Y = unionBounds(Y, getBounds(index2cell(X, W, gCurrSheetIndex)));
    Y.top -= 1;
    Y.left -= 1;
    var V = view;
    var U = getBounds(V);
    U.bottom -= 16;
    U.right -= 16;
    var T = getHorizontal(V, true);
    var S = getVertical(V, true);
    if(Y.right - T > U.right)
        T = Y.right - U.right;
    if(Y.left - T < U.left)
        T = Y.left - U.left;
    if(Y.bottom - S > U.bottom)
        S = Y.bottom - U.bottom;
    if(Y.top - S < U.top)
        S = Y.top - U.top;
    setHorizontal(V, T);
    setVertical(V, S);
}
function borderInMenu(Z, Y, X, W, V, U){
    var T = getElement(Z);
    setClass(T, Y);
    setBackgroundImage(T, X);
    setBackgroundX(T, W *- 24);
    if(U)
        setToolTip(T, getString(U));
    setExtra(T, "value", V);
}
function updateEntryHeight(){
    var Z = getElement("entry");
    if(Z == null)
        return;
    var Y,
    X,
    W;
    Y = parseInt(Z.style.height);
    X = parseInt(Z.scrollHeight);
    if(Math.abs(Y - X) > 4){
        W = X + 4;
        if(W > Y){
            Z.style.height = W;
            setStyle(getElement("editPalette"), "zIndex", "1");
        }
    }
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();