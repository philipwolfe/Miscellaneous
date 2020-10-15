//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kScrollBarWidth = 0;
var kScrollBarHeight = 0;
var kSmallImageWidth = 24;
var kSmallImageHeight = 24;
var kGutterHeight = 0;
var kGutterWidth = 0;
var kRowSize = 20;
var kRowMinimum = is.ie5up ? 0 : 20;
var kRowMaximum = 1000;
var kColumnSize = 70;
var kColumnMinimum = is.ie5up ? 0 : 40;
var kColumnMaximum = 1000;
var kAbeforeB = true;
var kBbeforeA = false;
var kEquivalent = false;
var gSortInProgress = false;
var gSheetCount = 1;
var kPopupWidgetOffset = 18;
var gMouseDownElement = null;
var gTracking = "none";
var gTrackingElement = null;
var gAdjustKind = "none";
var gAdjustPoint = null;
var gAdjustValue = null;
var gAdjustIndex = null;
var gEntry = new Object();
gEntry.cell = null;
gEntry.state = "default";
gEntry.formula = "";
gEntry.override = "";
var gSelectKind = "none";
var gSelectPrime = null;
var gSelectStart = null;
var gSelectFinal = null;
var gLockState = "none";
var gLockStart = null;
var gLockFinal = null;
var gInputs = new Object();
var gPanels = new Object();
var gModals = new Object();
var gEntryClickFocused = false;
var gEntryKeyFocused = false;
var gSortByIndex;
var gSortDirection;
var gClipboardRect;
var gClipboardSelect;
var gClipboardKind = "none";
var gTempCellID = 0;
var gColumnResizers;
var gRowResizers;
var gTempColResizerID = 0;
var gTempRowResizerID = 0;
var gRangePrime = null;
var gRangeFinal = null;
var gSelection = null;
var gClipPrime = null;
var gClipFinal = null;
var gRangeInsertionInProgress = false;
var gLastRangeStringLength = 0;
var gLastSelect;
var gInPreview = false;
var gAMenuIsShowing = false;
var gLastMenuItemMousedOver = null;
var gInitialized = false;
var gUnloadHandled = false;
var gBtnOverrideSticky = false;
var initBorderDone = false;
function InitBorderMenu(){
    if(initBorderDone)
        return;
    initBorderDone = true;
    var Z = kRootUrl + kImageDirectory + "app/border.gif";
    borderInMenu("border10", "border", Z, 0, "reset", "strNoBorder");
    borderInMenu("border11", "border", Z, 8, "none,none,thick,none,none,none", "strThickBottom");
    borderInMenu("border12", "border", Z, 9, "none,none,double,none,none,none", "strDoubleBottom");
    borderInMenu("border13", "border", Z, 11, "plain,none,double,none,none,none", "strTopRuleDoubleBottom");
    borderInMenu("border14", "border", Z, 1, "none,none,plain,none,none,none", "strBottomOnly");
    borderInMenu("border15", "border", Z, 2, "none,plain,none,none,none,none", "strLeftOnly");
    borderInMenu("border16", "border", Z, 3, "none,none,none,plain,none,none", "strRightOnly");
    borderInMenu("border17", "border", Z, 10, "plain,none,none,none,none,none", "strTopOnly");
    borderInMenu("border18", "border", Z, 4, "none,plain,none,plain,none,none", "strLeftAndRight");
    borderInMenu("border19", "border", Z, 5, "plain,none,plain,none,none,none", "strTopAndBottom");
    borderInMenu("border20", "border", Z, 6, "none,plain,none,plain,none,plain", "strColumns");
    borderInMenu("border21", "border", Z, 7, "plain,none,plain,none,plain,none", "strRows");
    borderInMenu("border22", "border", Z, 12, "plain,plain,plain,plain,none,none", "strBox");
    borderInMenu("border23", "border", Z, 13, "plain,plain,plain,plain,plain,plain", "strGrid");
    borderInMenu("border24", "border", Z, 14, "plain,plain,plain,plain,none,plain", "strBoxedColumns");
    borderInMenu("border25", "border", Z, 15, "plain,plain,plain,plain,plain,none", "strBoxedRows");
}
function HandleOpen(){
    cancelEntryFieldRefocus();
    if(WindowIsValid(window.hb_directory))
        window.hb_directory.focus();
    else{
        var Z = kRootUrl + gMyFilesScript;
        var Y = window.open(Z, "fileWindow", 'width=620,height=500,scrollbars=yes,resizable=yes');
        Y.focus();
        window.hb_directory = Y;
    }
}
function ShowSummary(){
    cancelEntryFieldRefocus();
    if(gAppId != ''){
        var Z = bestWindowSize(650, 530);
        var Y = kRootUrl + gFileSummaryScript + "?id=" + escape(gAppId);
        var X = window.open(Y, "summaryWin", 'width=' + Z.width + ',height=' + Z.height + ',resizable,scrollbars');
        X.focus();
    }
    else{
        hb_alert(getString("strSaveBeforeSummary"), getString("strSummaryInstructions"));
    }
}
function PdfDialog(){
    cancelEntryFieldRefocus();
    if(gAppId != '' &&! ss_dirty()){
        var Z = 320;
        var Y = 400;
        var X = (screen.height / 2) - (Z / 2);
        var W = (screen.width / 2) - (Y / 2);
        var V = "height=" + Z + ",width=" + Y + ",top=" + X + ",left=" + W;
        var U = kRootUrl + gPdfDialogScript + "?id=" + escape(gAppId) + "&css=dialog_spreadsheet.css";
        var T = window.open(U, "pdfWin", V);
        T.focus();
    }
    else{
        hb_alert(getString("strSaveBeforePdf"), getString("strConvertToPDF"));
    }
}
function HandleNew(){
    cancelEntryFieldRefocus();
    var Z = kRootUrl + gOpenScript + "?new=ss&mode=d";
    window.open(Z, "", 'scrollbars=' + (is.nav4 ? 'yes' : 'no') + ',resizable=yes,status=no');
}
function SetupSelectMenus(){}
function SetupMenus(){
    setElementValue("cmdToggleGrid", (gGridWidth == "0px") ? getString("strShowGrid") : getString("strHideGrid"));
    SetupSelectMenus();
}
function CellDataToXml(){
    var Z = gCellDataArray.length;
    var Y = '';
    for(var X = 0; X < Z; X ++ ){
        var W = gCellDataArray[X];
        if(W && W.entry){
            Y += "<CELL r='" + name2row(W.m_div.m_name) + "' c='" + name2column(W.m_div.m_name) + "'>";
            var V;
            if(V = W.entry)
                Y += "<ENTRY>" + XmlEncode(V) + "</ENTRY>";
            if(V = W.derived)
                Y += "<DISPLAY>" + XmlEncode(V) + "</DISPLAY>";
            Y += "</CELL>";
        }
    }
    return Y;
}
function ExecuteUserMenuItem(Z, Y){
    var X = Z.menuItems[Y];;
    if( ! emptyString(X.macro)){
        var W = __macro(X.macro);
        if(__iserror(W))
            alert(W.error + ": " + W.tooltip);
    }
    else if( ! emptyString(X.url)){
        gSpreadsheetDirty = false;
        var V = X.url;
        if(X.direct)
            gDocument.location = X.url;
        else{
            if(emptyString(V))
                V = Z.url;
            getElement("usermenuUrl").value = V;
            getElement("usermenuCommand").value = X.command;
            getElement("usermenuSelBegRow").value = name2row(gSelectPrime.m_name);
            getElement("usermenuSelEndRow").value = name2row(gSelectFinal.m_name);
            getElement("usermenuSelBegCol").value = name2column(gSelectPrime.m_name);
            getElement("usermenuSelEndCol").value = name2column(gSelectFinal.m_name);
            getElement("usermenuCellData").value = CellDataToXml();
            gDocument.usermenuForm.submit();
        }
    }
}
var kFormatCommandPrefix = "cmdFormat_";
function HandleMainMenuCommand(Z){
    var Y = Z.id;
    if(Y.indexOf(kFormatCommandPrefix) == 0){
        var X = Y.substr(kFormatCommandPrefix.length);
        if(X.indexOf("cmd") == 0){
            Y = X;
        }
        else{
            cellformat2range("_viewFormat", X);
            pulseRange();
            return;
        }
    }
    switch(Y){
        case 'cmdClose' : 
            if(ss_dirty())
                hb_confirm(getString("strSaveChanges"), getString("strCloseSpreadsheet"), getString("strSave"), getString("strDontSave"), getString("strCancel"), "ss_close(true)", "ss_close(false)", "");
            else
                ss_close(false);
            break;
        case 'cmdSave' : 
            ss_save();
            break;
        case 'cmdPrint' : 
            orientationPrompt();
            break;
        case 'cmdSetSize' : 
            openSetSize();
            break;
        case 'cmdCut' : 
            Cut();
            break;
        case 'cmdCopy' : 
            Copy();
            break;
        case 'cmdPaste' : 
            Paste();
            break;
        case 'cmdPasteSpecial' : 
            PasteSpecial();
            break;
        case 'cmdClear' : 
            var W = findSelect(true);
            ClearRange(W.rowMin, W.rowMax, W.columnMin, W.columnMax, true, true);
            break;
        case 'cmdRevert' : 
            Revert();
            break;
        case 'cmdFillDown' : 
            setTimeout("FillDown()", 0);
            break;
        case 'cmdFillRight' : 
            setTimeout("FillRight()", 0);
            break;
        case 'cmdMacros' : 
            openMacro();
            break;
        case "cmdDeleteRow" : 
            DeleteRowsWrapper();
            break;
        case "cmdDeleteColumn" : 
            DeleteColumnsWrapper();
            break;
        case "cmdRowHeight" : 
            openRowHeight();
            break;
        case "cmdColumnWidth" : 
            openColumnWidth();
            break;
        case "cmdFitRow" : 
            AutofitRowsWrapper();
            break;
        case "cmdFitColumn" : 
            AutofitColumnsWrapper();
            break;
        case "cmdSortAscending" : 
            setTimeout("SortWrapper('ascending')", 0);
            break;
        case "cmdSortDescending" : 
            setTimeout("SortWrapper('descending')", 0);
            break;
        case "cmdInsertRow" : 
            InsertRowsWrapper();
            break;
        case "cmdInsertColumn" : 
            InsertColumnsWrapper();
            break;
        case "cmdToggleGrid" : 
            ToggleGrid();
            break;
        case "cmdPreview" : 
            GoToPreview();
            break;
        case "cmdGeneral" : 
            cellformat2range("_viewFormat", "general");
            pulseRange();
            break;
        case "cmdCustom" : 
            openFormat();
            break;
        case "cmdWrapText" : 
            var V = false;
            if(gSelectPrime.cellData)
                V =! gSelectPrime.cellData._wrapText;
            cellformat2range("_wrapText", V);
            break;
        case "cmdNew" : 
            HandleNew();
            break;
        case "cmdOpen" : 
            HandleOpen();
            break;
        case "cmdSaveAs" : 
            ss_save('saveAs');
            break;
        case "cmdExcelExport" : 
            doExcelGet();
            break;
        case "cmdExcelImport" : 
            doExcelPut();
            break;
        case "cmdContents" : 
            ShowHelp();
            break;
        case "cmdIntroduction" : 
            ShowHelp('bc_intro');
            break;
        case "cmdBasics" : 
            ShowHelp('bc_basics');
            break;
        case "cmdFiles" : 
            ShowHelp('bc_files');
            break;
        case "cmdNavigating" : 
            ShowHelp('bc_navigating');
            break;
        case "cmdEditing" : 
            ShowHelp('bc_editing');
            break;
        case "cmdFormatting" : 
            ShowHelp('bc_formatting');
            break;
        case "cmdCalculators" : 
            ShowHelp('bc_calc');
            break;
        case "cmdMacrosHelp" : 
            ShowHelp('bc_macros');
            break;
        case "cmdMenuReference" : 
            ShowHelp('bc_menuref');
            break;
        case "cmdFunctionReference" : 
            ShowHelp('bc_functionref');
            break;
        case "cmdPdfDialog" : 
            PdfDialog();
            break;
        case "cmdSummary" : 
            ShowSummary();
            break;
        case "cmdAbout" : 
            OpenAbout();
            break;
        case "cmdPartner" : 
            ExecuteUserMenuItem(gPartnerMenu, Z.name);
            break;
        case "cmdPopup" : 
            ExecuteUserMenuItem(gPopupMenu, Z.name);
            break;
        case "cmdBugReport" : 
            DoBugReport("spreadsheet");
            break;
        default : 
            alert("[" + Z.id + "] " + getString("strAfterBeta"));
            break;
    }
}
function GetDefaultLock(Z){
    if(Z == null)
        return "true";
    return getLock(Z.cellData, true);
}
function GetCellLock(Z){
    if(Z && Z.cellData){
        if(Z.cellData.locked)
            return Z.cellData.locked;
        if(Z.cellData.m_locked)
            return Z.cellData.m_locked;
    }
    return GetDefaultLock(Z);
}
var stdGridColor = "lightblue";
var stdInputColor = "#a0a0e6";
var gRowCursor,
gColCursor;
function PreviewWhacker(Z, Y, X, W, V){
    var U = ["0px", "1px"];
    var T = Z ? 1 : 0;
    if(Z){
        gRowCursor = gRowResizers[1].style.cursor;
        gColCursor = gColumnResizers[1].style.cursor;
    }
    for(var S = 1; S < gRowResizers.length; S ++ )
        setStyle(gRowResizers[S], "cursor", (Z) ? "default" : gRowCursor);
    for(var R = 1; R < gColumnResizers.length; R ++ )
        setStyle(gColumnResizers[R], "cursor", (Z) ? "default" : gColCursor);
    for(var Q = 0; Q < gSheetCount; Q ++ ){
        var P = index2cell(0, 0, Q);
        if( ! is.ie4)
            SetRowHeight(0, Q, X, P.style.pixelHeight);
        SetColumnWidth(0, Q, Y, P.style.pixelWidth);
        for(var O = 0; O < gRowCount; O ++ ){
            for(var N = 0; N < gColumnCount; N ++ ){
                P = index2cell(O, N, Q);
                if((O == 0) || (N == 0)){
                    setStyle(P, "backgroundColor", V);
                    setStyle(P, "color", W);
                    if((P.style["borderBottom"] == "") || ((P.style.borderBottomStyle == "solid") && (P.style.borderBottomColor == "lightgrey") && (P.style.borderBottomWidth != U[1 - T])))
                        P.style["borderBottomWidth"] = U[1 - T];
                    if((P.style["borderRight"] == "") || ((P.style.borderRightStyle == "solid") && (P.style.borderRightColor == "lightgrey") && (P.style.borderRightWidth != U[1 - T])))
                        P.style["borderRightWidth"] = U[1 - T];
                }
                else{
                    var M = (GetCellLock(P) == "true") ? true : false;
                    if( ! M){
                        if((P.style["borderTop"] == "") || ((P.style.borderTopStyle == "solid") && ((P.style.borderTopColor == stdInputColor) || (P.style.borderTopColor == stdGridColor)) && (P.style.borderTopWidth != U[T]))){
                            P.style["borderTopColor"] = (Z) ? stdInputColor : stdGridColor;
                            P.style["borderTopWidth"] = U[T];
                        }
                        if((P.style["borderLeft"] == "") || ((P.style.borderLeftStyle == "solid") && ((P.style.borderLeftColor == stdInputColor) || (P.style.borderLeftColor == stdGridColor)) && (P.style.borderLeftWidth != U[T]))){
                            P.style["borderLeftColor"] = (Z) ? stdInputColor : stdGridColor;
                            P.style["borderLeftWidth"] = U[T];
                        }
                    }
                    var L;
                    if( ! Z)
                        L = (gGridWidth == "1px") ? 1 : 0;
                    else
                        L = M ? 0 : 1;
                    if((P.style["borderBottom"] == "") || ((P.style.borderBottomStyle == "solid") && (P.style.borderBottomColor == stdGridColor) && (P.style.borderBottomWidth != U[L])))
                        P.style["borderBottomWidth"] = U[L];
                    if((P.style["borderRight"] == "") || ((P.style.borderRightStyle == "solid") && (P.style.borderRightColor == stdGridColor) && (P.style.borderRightWidth != U[L])))
                        P.style["borderRightWidth"] = U[L];
                }
            }
        }
    }
    setVisible(gHeader["bulbLogo"] ,! Z);
    setVisible(gHeader["menuPalette"] ,! Z);
    setVisible(gHeader["menuDivision"] ,! Z);
    setVisible(gHeader["iconPalette"] ,! Z);
    setVisible(gHeader["iconDivision"] ,! Z);
    setVisible(gHeader["editPalette"] ,! Z);
    setVisible(gHeader["editDivision"] ,! Z);
    if(getTop(gHeader["previewPalette"]) > 5000)
        setTop(gHeader["previewPalette"], 0);
    setVisible(gHeader["previewPalette"], Z);
    sizeDocument();
}
function GoToPreview(Z){
    if(gInPreview){
        ExitPreview(Z);
        return;
    }
    cancelEntryFieldRefocus();
    ClipboardDeselected();
    hideSelect();
    if( ! Z && gEntryClickFocused)
        getElement('entry').blur();
    PreviewWhacker(true, 6, 6, "white", "white");
    gInPreview = true;
    if( ! Z)
        setTimeout("sheetChanged();", 100);
}
function ExitPreview(Z){
    if( ! gInPreview)
        return;
    PreviewWhacker(false, kColumnSize, kRowSize, "black", "whitesmoke");
    gInPreview = false;
    showSelect();
    if( ! Z){
        fetchEntry();
        setTimeout("sheetChanged();", 100);
    }
}
function GridWhacker(Z){
    for(var Y = 0; Y < gSheetCount; Y ++ ){
        for(var X = 1; X < gRowCount; X ++ ){
            for(var W = 1; W < gColumnCount; W ++ ){
                var V = index2cell(X, W, Y);
                if((V.style["borderBottom"] == "") || ((V.style.borderBottomStyle == "solid") && (V.style.borderBottomColor == stdGridColor) && (V.style.borderBottomWidth != Z)))
                    V.style["borderBottomWidth"] = Z;
                if((V.style["borderRight"] == "") || ((V.style.borderRightStyle == "solid") && (V.style.borderRightColor == stdGridColor) && (V.style.borderRightWidth != Z)))
                    V.style["borderRightWidth"] = Z;
            }
        }
    }
}
function ToggleGrid(){
    var Z = gGridWidth;
    hideSelect();
    if(gGridWidth == "0px")
        gGridWidth = "1px";
    else
        gGridWidth = "0px";
    GridWhacker(gGridWidth);
    showSelect();
    setElementValue("cmdToggleGrid", (gGridWidth == "0px") ? getString("strShowGrid") : getString("strHideGrid"));
}
function Munge1CellGrid(Z, Y, X){
    if(X == null)
        X = Y;
    if((Z.style["borderTop"] == "") || ((Z.style.borderTopStyle == "solid") && ((Z.style.borderTopColor == stdInputColor) || (Z.style.borderTopColor == stdGridColor)) && (Z.style.borderTopWidth != Y))){
        Z.style["borderTopColor"] = (Y == "0px") ? stdGridColor : stdInputColor;
        Z.style["borderTopWidth"] = Y;
    }
    if((Z.style["borderLeft"] == "") || ((Z.style.borderLeftStyle == "solid") && ((Z.style.borderLeftColor == stdInputColor) || (Z.style.borderLeftColor == stdGridColor)) && (Z.style.borderLeftWidth != Y))){
        Z.style["borderLeftColor"] = (Y == "0px") ? stdGridColor : stdInputColor;
        Z.style["borderLeftWidth"] = Y;
    }
    if((Z.style["borderBottom"] == "") || ((Z.style.borderBottomStyle == "solid") && (Z.style.borderBottomColor == stdGridColor) && (Z.style.borderBottomWidth != X)))
        Z.style["borderBottomWidth"] = X;
    if((Z.style["borderRight"] == "") || ((Z.style.borderRightStyle == "solid") && (Z.style.borderRightColor == stdGridColor) && (Z.style.borderRightWidth != X)))
        Z.style["borderRightWidth"] = X;
}
function Set1CellLock(Z, Y, X){
    if(Y == "true")
        Munge1CellGrid(Z, "0px", X);
    else
        Munge1CellGrid(Z, "1px", "1px");
    if(Z.cellData == null)
        CheckForCellData(Z.m_name);
    if(Z.cellData != null)
        Z.cellData.m_locked = Z.cellData.locked = Y;
}
function LockHelp(Z, Y, X, W){
    var V = name2row(Z.m_name);
    var U = name2row(Y.m_name);
    var T = name2column(Z.m_name);
    var S = name2column(Y.m_name);
    var R = Math.min(V, U);
    var Q = Math.max(V, U);
    var P = Math.min(T, S);
    var O = Math.max(T, S);
    if(R == 0)
        R = 1;
    if(P == 0)
        P = 1;
    for(var N = R; N <= Q; ++ N)
        for(var M = P; M <= O; ++ M){
            var L = index2cell(N, M, gCurrSheetIndex);
        var K = X;
        if(K == null)
            K = GetDefaultLock(L);
        Set1CellLock(L, K, W);
    }
}
function ShowLock(){
    LockHelp(gLockStart, gLockFinal, gLockState, "0px");
}
function HideLock(){
    LockHelp(gLockStart, gLockFinal, null, "0px");
}
function ToggleLock(){
    var Z = gSelectPrime;
    if(Z == null)
        return;
    var Y = "true";
    if(Z.cellData)
        Y = Z.cellData.locked;
    else
        CheckForCellData(Z.m_name);
    gLockState = (Y == "true") ? "false" : "true";
    LockHelp(gSelectStart, gSelectFinal, gLockState, gGridWidth);
    gSpreadsheetDirty = true;
}
var gSpreadsheetName;
if(typeof gRecommendedCellCount != "number")
    var gRecommendedCellCount = 0;
function loadDocument(){
    gSpreadsheetName = (gAppDescription == "") ? getString("strSpreadsheetSmall") : gAppDescription;
    if(gSpreadsheetName.length > 40){
        gSpreadsheetName = gSpreadsheetName.substring(0, 40);
        gSpreadsheetName = gSpreadsheetName.concat("...");
    }
    var Z = ("window" + Math.random()).replace(/\./gi, "");
    window.name = Z;
    AddToWindList(Z, "ss");
    doCropCheck("continueLoad();");
}
function continueLoad(){
    hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad"), 0);
    setTimeout("documentLoad0()", 0);
}
function documentLoad0(){
    window.focus();
    documentGenerate();
    hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad0"), 0.05);
    setTimeout("documentLoad1()", 0);
}
function documentLoad1(){
    if(WindowIsValid(opener) && opener.hb_directory)
        window.hb_directory = opener.hb_directory;
    BuildCellMatrix();
}
function getFormatMenuItems(){
    var Z;
    Z = gFormatMenuItems[gAppLocale];
    if(Z == null)
        return gFormatMenuItems.en;
    return Z;
}
function buildFormatMenu(){
    var Z = 16, Y = 2, X = 2, W = 4, V = 4;
    var U = "";
    var T = formatList;
    var S = getFormatMenuItems();
    var R = X;
    U += '<div id="cmdGeneral" class="largeItem" style="top:' + R + '; left:' + Y + ';">' + getString("strGeneral") + '</div>';
    R += Z;
    U += '<div id="cmdCustom" class="largeItem" style="top:' + R + '; left:' + Y + ';">' + getString("strCustom") + '...</div>';
    R += Z;
    U += '<div class="separator" style="top: ' + R + '; left:' + Y + '; width:294;"></div>';
    R += W;
    for(var Q = 0; Q < S.length; Q ++ ){
        var P = S[Q];
        if(typeof(P) == "object"){
            U += '<div id="' + kFormatCommandPrefix + P.format + '" class="largeItem" style="top:' + R + '; left:' + Y + ';">' + P.text + '</div>';
            R += Z;
        }
        else if(typeof(P) == "number"){
            U += '<div class="separator" style="top: ' + R + '; left:' + Y + '; width:294;"></div>';
            R += W;
        }
    }
    U += '<div class="separator" style="top: ' + R + '; left:' + Y + '; width:294;"></div>';
    R += W;
    U += '<div id="cmdWrapText" class="largeItem" style="top:' + R + '; left:' + Y + ';">' + getString("strWrapText") + '</div>';
    R += Z;
    T.innerHTML = U;
    T.height = R + V;
    setTimeout('setElementHeight("' + T.id + '", ' + (R + V) + ')', 0);
}
var gFileMenuItems = [{
    command : "cmdNew", string : "strNew"
}, 
{
    command : "cmdOpen",
    string : "strOpen",
    dialog : true
}, 
{
    command : "cmdClose",
    string : "strClose"
}, 0, 
{
    command : "cmdSave",
    string : "strSave"
}, 
{
    command : "cmdSaveAs",
    string : "strSaveAs",
    dialog : true
}, 
{
    command : "cmdExcelExport",
    string : "strExportToExcel",
    dialog : true
}, 
{
    command : "cmdExcelImport",
    string : "strImportExcelFile",
    dialog : true
}, 0, 
{
    command : "cmdSetSize",
    string : "strSetSize",
    dialog : true
}, 0, 
{
    command : "cmdPrint",
    string : "strPrint",
    dialog : true
}, 
{
    command : "cmdPdfDialog",
    string : "strConvertToPDF",
    dialog : true
}, 
{
    command : "cmdSummary",
    string : "strSummary",
    dialog : true
}];
function buildFileMenu(){
    var Z = 16, Y = 2, X = 2, W = 4, V = 4;
    var U = "";
    var T = fileList;
    var S = X;
    for(var R = 0; R < gFileMenuItems.length; R ++ ){
        var Q = gFileMenuItems[R];
        if(typeof(Q) == "object"){
            var P;
            var O = Q.command;
            var N = getString(Q.string);
            if(Q.dialog)
                N += "...";
            switch(Q.command){
                case "cmdSaveAs" : 
                case "cmdExcelImport" : 
                    P = (gIsMatterhorn ||! knoSaveAs);
                    break;
                case "cmdPdfDialog" : 
                    P = gIsMatterhorn;
                    break;
                default : 
                    P = true;
                    break;
            }
            if(P){
                U += '<div id="' + O + '" class="largeItem" style="top:' + S + '; left:' + Y + ';">' + N + '</div>';
                S += Z;
            }
        }
        else if(typeof(Q) == "number"){
            U += '<div class="separator" style="top: ' + S + '; left:' + Y + '; width:294;"></div>';
            S += W;
        }
    }
    T.innerHTML = U;
    T.height = S + V;
    setTimeout('setElementHeight("' + T.id + '", ' + (S + V) + ')', 0);
}
function getFontMenuItems(){
    var Z,
    Y,
    X;
    var W = new Array();
    Z = gFontMenuItems[gAppLocale];
    if(Z && Z.pre){
        for(X = 0; X < Z.pre.length; X ++ )
            W.push(Z.pre[X]);
    }
    Y = gFontMenuItems["defaultFonts"];;
    for(X = 0; X < Y.length; X ++ )
        W.push(Y[X]);
    if(Z && Z.post){
        for(X = 0; X < Z.post.length; X ++ )
            W.push(Z.post[X]);
    }
    return W;
}
function buildFontMenu(){
    var Z = 16, Y = 2, X = 2, W = 4, V = 4;
    var U = "";
    var T = getFontMenuItems();
    var S = fontList;
    var R = X;
    for(var Q = 0; Q < T.length; Q ++ ){
        var P = T[Q];
        var O = gFontMappings[P];;
        if(typeof(O) == "undefined")
            continue;
        var N = O.fontname;
        U += '<div id="' + P + '" class="smallItem" style="top:' + R + '; left:' + Y + ';">' + N + '</div>';
        R += Z;
    }
    S.innerHTML = U;
    S.height = R + V;
    setTimeout('setElementHeight("' + S.id + '", ' + (R + V) + ')', 0);
}
function documentLoad2(){
    gPanels = [bulbLogo, menuPalette, menuDivision, iconPalette, iconDivision, editPalette, editDivision, previewPalette, previewHolder, footDivision, footPalette];
    gModals = [modalDialog];
    buildFileMenu();
    buildFormatMenu();
    buildFontMenu();
    hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad2"), 0.40);
    setTimeout("documentLoad3()", 0);
}
function adjustLocaleButtons(){
    var Z = gLocaleButtonShifts[gAppLocale];
    if(Z == null)
        return;
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y];;
        var W = getElement(X.button);
        if(W != null){
            setBackgroundX(W, X.offset *- 24);
        }
    }
}
var kColorArray = [["#660000", "#993300", "#336600", "#006633", "#003366", "#000099", "#333399", "#000000"], ["#CC0000", "#FF6600", "#999900", "#009900", "#009999", "#0000FF", "#663399", "#333333"], ["#FF0000", "#FF9900", "#99CC00", "#339966", "#33CCCC", "#3366FF", "#990099", "#666666"], ["#FF00FF", "#FFCC00", "#CCFF00", "#00FF00", "#66CCCC", "#00CCFF", "#CC6699", "#999999"], ["#FF66CC", "#FFCC33", "#FFFF00", "#66FF66", "#66FFFF", "#66CCFF", "#CC66FF", "#CCCCCC"], ["#FF99CC", "#FFCC99", "#FFFF99", "#CCFFCC", "#CCFFFF", "#99CCFF", "#CC99FF", "#FFFFFF"]];
function buildColorList(Z, Y){
    var X = new Array();
    var W,
    V,
    U,
    T;
    W = 4;
    V = 2;
    U = Y;
    T = getString((Y == "none" ? "strNoColor" : "strDefault"));
    X.push('<div class="colorheader" style="position:absolute;');
    X.push('top: ' + W + ';left:' + V + ';');
    X.push('value="' + U + '">' + T + '</div>');
    X.push('<div style="position:absolute; top:24; left:0; width:128;">');
    for(r = 0; r < kColorArray.length; r ++ ){
        rowColors = kColorArray[r];
        W = r * 16;
        for(c = 0; c < rowColors.length; c ++ ){
            V = c * 16;
            X.push('<div class="holder" style="position:absolute;');
            X.push('top: ' + W + ';left:' + V + ';');
            X.push('" value="' + rowColors[c] + '">');
            X.push('<div class="swatch" style="background-color:' + rowColors[c] + ';"></div>');
            X.push('</div>');
        }
    }
    X.push('</div>');
    Z.innerHTML = X.join("");
}
function setupColorPalettes(){
    var Z,
    Y;
    Z = backgroundColorMenu;
    if(Z)
        setClass(Z, "button");
    Y = backgroundColorList;
    if(Y){
        buildColorList(Y, "none");
    }
    Z = textColorMenu;
    if(Z)
        setClass(Z, "button");
    Y = textColorList;
    if(Y){
        buildColorList(Y, "default");
    }
}
function documentLoad3(){
    for(var Z in gPanels){
        var Y = gPanels[Z];
        if( ! Y || typeof(Y) == "function")
            continue;
        var X = Y.children;
        for(var W = 0; W < Y.ownerDocument.forms.length; W ++ ){
            if( ! Y.ownerDocument.forms[0])
                continue;
            for(var V = 0; V < Y.ownerDocument.forms[W].elements.length; V ++ ){
                var U = Y.ownerDocument.forms[W].elements[V];
                if(U.id != U.name)
                    U.id = U.name;
                U.m_embedded_in = gPanels[Z];
                gInputs[U.id] = U;
            }
        }
    }
    var T,
    S,
    R;
    var Q;
    R = menuPalette;
    T = 2;
    for(S = 0; S < R.children.length; S ++ ){
        Q = R.children[S];
        if(Q.className == "largeMenu"){
            var P = getItemWidth(Q);
            setVisible(Q, true);
            setLeft(Q, T);
            if(is.ie4){
                setWidth(Q, P);
                P += 2;
            }
            T += P;
        }
    }
    setTimeout("documentLoad3_1()", 0);
}
function documentLoad3_1(){
    setMenu("", "fileMenu", "fileList");
    setMenu("", "editMenu", "editList");
    setMenu("", "toolsMenu", "toolsList");
    setMenu("", "formatMenu", "formatList");
    setMenu("", "helpMenu", "helpList");
    if(gPartnerMenu){
        initPartnerMenu();
    }
    else{
        getElement("partnerMenu").style.visibility = "hidden";
    }
    setMenu("functionSpot", "functionMenu", "functionList");
    setMenu("textColorMenuSpot", "textColorMenu", "textColorList");
    setMenu("backgroundColorMenuSpot", "backgroundColorMenu", "backgroundColorList");
    setMenu("borderSpot", "borderMenu", "borderList");
    setMenu("fontSpot", "fontMenu", "fontList");
    setMenu("sizeSpot", "sizeMenu", "sizeList");
    gMenus["popupMenuList"] = popupMenuList;
    var Z = contextualMenu;
    if(Z){
        adjustMenuWidth(Z);
    }
    setTimeout("documentLoad3_2()", 0);
}
function documentLoad3_2(){
    gHeader["bulbLogo"] = bulbLogo;
    gHeader["menuPalette"] = menuPalette;
    gHeader["menuDivision"] = menuDivision;
    gHeader["iconPalette"] = iconPalette;
    gHeader["iconDivision"] = iconDivision;
    gHeader["editPalette"] = editPalette;
    gHeader["editDivision"] = editDivision;
    gHeader["previewPalette"] = previewPalette;
    setVisible(gHeader["previewPalette"], false);
    gFooter["footDivision"] = footDivision;
    gFooter["footPalette"] = footPalette;
    var Z = copyrightText;
    Z.innerHTML = getString("strCopyright") + '&copy; 1999-2001 <A HREF="http://www.alphablox.com" target="_blank" tabIndex="-1" onFocus="this.blur()">' + getString("strAlphabloxCorp") + '</A>. ' + getString("strAllRightsReserved");
    setStyle(getElement("editPalette"), "overflow", "visible");
    setStyle(getElement("editPalette"), "zIndex", "-5");
    for(var Y = 0; Y < gColWidths.length; Y ++ ){
        if(gColWidths[Y] == 0){
            adjustZeroWidthColumnResizers(Y);
            for(var X = 0; X < gRowCount; X ++ ){
                index2cell(X, Y, 0).style.visibility = "hidden";
            }
        }
    }
    for(Y = 0; Y < gRowHeights.length; Y ++ ){
        if(gRowHeights[Y] == 0)
            adjustZeroHeightRowResizers(Y);
    }
    adjustLocaleButtons();
    if(gIsMatterhorn){
        getElement("funcStockQuote").style.display = "none";
        getElement("funcCurrency").style.display = "none";
        getElement("functionList").style.height = 38;
        getElement("funcLinkUrl").style.top = 16;
        getElement("cmdBugReport").style.display = "none";
        getElement("cmdContents").style.display = "none";
        getElement("separator60").style.display = "none";
        var W = 16, V = 2, U = 4, T = 4;
        var S = 2;
        getElement("cmdIntroduction").style.top = S;
        S += W;
        getElement("cmdBasics").style.top = S;
        S += W;
        getElement("cmdFiles").style.top = S;
        S += W;
        getElement("cmdNavigating").style.top = S;
        S += W;
        getElement("cmdEditing").style.top = S;
        S += W;
        getElement("cmdFormatting").style.top = S;
        S += W;
        getElement("cmdCalculators").style.top = S;
        S += W;
        getElement("cmdMacrosHelp").style.top = S;
        S += W;
        getElement("separator61").style.top = S;
        S += U;
        getElement("cmdMenuReference").style.top = S;
        S += W;
        getElement("cmdFunctionReference").style.top = S;
        S += W;
        getElement("separator62").style.top = S;
        S += U;
        getElement("cmdAbout").style.top = S;
        S += W;
        getElement("helpList").style.height = S + T;
    }
    sizeDocument();
    hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad3"), 0.50);
    setTimeout("documentLoad4()", 0);
}
function documentLoad4(){
    InitRestoreData(0, 'documentLoad5()');
}
function documentLoad5(){
    if(gMacroText == ""){
        setTimeout("documentLoad5_2()", 0);
        return;
    }
    var Z = needsRebuilding ? documentLoad5_2 : documentLoad5_1;
    InitMacros(gMacroText, Z);
}
function documentLoad5_1(){
    RefreshMacroCells();
    setTimeout("documentLoad5_2()", 0);
}
function documentLoad5_2(){
    if(gEntryLocale == "")
        gEntryLocale = "en";
    if(needsRebuilding){
        needsRebuilding = false;
        RebuildAllCells();
        setTimeout("documentLoad6()", 0);
    }
    else
        RebuildSelectedCells(0, "documentLoad6()");
}
function returnFalse(){
    window.event.returnValue = "false";
    window.event.cancelBubble = true;
    return false;
}
function documentLoad6(){
    gEntryLocale = gAppLocale;
    setupColorPalettes();
    ProcessDirtyCells();
    gDocument.onkeydown = keyDownDocument;
    gDocument.onkeypress = keyPressDocument;
    gDocument.onkeyup = keyUpDocument;
    gDocument.onmouseover = mouseOverDocument;
    gDocument.onmouseout = mouseOutDocument;
    gDocument.onmousedown = mouseDownDocument;
    gDocument.onmousemove = mouseMoveDocument;
    gDocument.onmouseup = mouseUpDocument;
    gDocument.onselectstart = selectStartDocument;
    gDocument.onclick = documentSingleClick;
    gDocument.ondblclick = documentDoubleClick;
    sheetSelect(0);
    setTimeout("cycleCell()", 1000);
    hb_progress("", "", null);
    if(gIsMatterhorn)
        gGridWidth = GetGridWidth();
    SetupMenus();
    if(gGridWidth)
        GridWhacker(gGridWidth);
    else
        gGridWidth = "1px";
    gInitialized = true;
    if( ! gIsMatterhorn && (is.ie4) && ( ! getPref('iLoveIE4'))){
        var Z = getString("strUpgrateIE5Cmp", kDefaultLocale, getAppName());
        var Y = [{
            type : 'raw', value : Z
        }];
        var X = [{
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
        openModal('ie4alert', getString("strUpdateToIE5"), null, "UpgradeToIE5()", "closeModal()", Y, X, null);
    }
}
function InitRestoreData(Z, Y){
    var X = 0.5;
    if((gCellDataArray) && (Z < gCellDataArray.length)){
        var W = Z + (is.ie5up ? 40 : 20);
        while((Z < W) && (Z < gCellDataArray.length)){
            initCell(Z);
            Z ++ ;
        }
        X = 0.60 + (Z / gCellDataArray.length * .20);
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad4a"), X);
        setTimeout("InitRestoreData(" + Z + ",'" + Y + "')", 0);
    }
    else{
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad4b"), 0.80);
        setTimeout(Y, 0);
    }
}
function cutDocument(){
    if( ! gEntryClickFocused)
        event.returnValue = false;
    else
        setTimeout("updateEntryHeight()", 0);
}
function pasteDocument(){
    if(( ! gEntryClickFocused) && (gClipboardKind != "none"))
        event.returnValue = false;
    else
        setTimeout("updateEntryHeight()", 0);
}
function unloadDocument(){
    if(typeof deleteFromWindList != "undefined")
        deleteFromWindList(window.name);
    if((typeof gInitialized == "undefined") || ( ! gInitialized))
        return;
    if(gUnloadHandled)
        return;
    var Z;
    if(ss_dirty()){
        var Y = gLocaleSaveCloseBoxSize[gAppLocale][0];
        if(is.ie4)
            Y += 20;
        var X = gLocaleSaveCloseBoxSize[gAppLocale][1];
        Z = window.showModalDialog(kRootUrl + gCloseBoxFile, null, "dialogWidth:" + X + "px; dialogHeight:" + Y + "px; center:yes; status:no;");
        if(Z)
            openLifeboat();
    }
    gUnloadHandled = true;
}
function resizeDocument(){
    setTimeout('sizeDocument();', 0);
}
function keyDownDocument(){
    if(filterDocument(window.event))
        return;
    window.event.cancelBubble = true;
    var Z = window.event.keyCode;
    var Y = window.event.shiftKey;
    var X = window.event.ctrlKey;
    if(gInPreview){
        if(Z == 27)
            ExitPreview();
        return;
    }
    switch(Z){
        case 9 : 
            EndRangeInsertion();
            gEntryKeyFocused = false;
            if(Y)
                moveSelect(0 ,- 1);
            else
                moveSelect(0 ,+ 1);
            break;
        case 13 : 
            if(eventInComboBox(event)){
                var W = event.srcElement.value;
                if(event.srcElement.id == "sizeSpot"){
                    W = W.replace(/pt/g, "");
                    if(isNaN(W) || (W < 1) || (W > 410)){
                        fetchEntry();
                        hb_alert(getString("strFontSizeLimited"), getString("strFontSizeOutOfRange"));
                    }
                    else{
                        cellformat2range("viewSize", W + " pt");
                        fetchEntry();
                    }
                }
                else if(event.srcElement.id == "fontSpot"){
                    W = capitalizeWords(W);
                    var V = getFontMenuItems();
                    cellformat2range("viewFamily", W);
                    fetchEntry();
                }
                return false;
            }
            if((getClipSrcWind().gClipboardKind == "cut") || (getClipSrcWind().gClipboardKind == "copy")){
                Paste();
                getClipSrcWind().ClipboardDeselected();
            }
            else{
                getElement('entry').blur();
                EndRangeInsertion();
                gEntryKeyFocused = false;
                if(Y)
                    moveSelect( - 1, 0);
                else
                    moveSelect( + 1, 0);
            }
            break;
        case 27 : 
            fetchEntry();
            ClipboardDeselected();
            EndRangeInsertion();
            gEntryKeyFocused = false;
            gEntryClickFocused = false;
            break;
        case 35 : 
        case 36 : 
            gEntryClickFocused = true;
            break;
        case 37 : 
            if(eventInComboBox(window.event))
                return;
            if(X){
                if(gSelection != null)
                    gEntryClickFocused = true;
                EndRangeInsertion();
            }
            else if(gEntryClickFocused);
            else{
                if(GoodPlace2InsertRange() &&! gRangeInsertionInProgress && gEntryKeyFocused && is.ie5up)
                    StartRangeSelect();
                if(gRangeInsertionInProgress){
                    if(Y)
                        expandShrinkRange(0 ,- 1);
                    else
                        moveRange(0 ,- 1);
                    return false;
                }
                else{
                    if(Y)
                        expandShrinkSelect(0 ,- 1);
                    else{
                        gEntryKeyFocused = false;
                        moveSelect(0 ,- 1);
                    }
                }
            }
            break;
        case 39 : 
            if(eventInComboBox(window.event))
                return;
            if(X){
                if(gSelection != null)
                    gEntryClickFocused = true;
                EndRangeInsertion();
            }
            else if(gEntryClickFocused);
            else{
                if(GoodPlace2InsertRange() &&! gRangeInsertionInProgress && gEntryKeyFocused && is.ie5up)
                    StartRangeSelect();
                if(gRangeInsertionInProgress){
                    if(Y)
                        expandShrinkRange(0 ,+ 1);
                    else
                        moveRange(0 ,+ 1);
                    return false;
                }
                else{
                    if(Y)
                        expandShrinkSelect(0 ,+ 1);
                    else{
                        gEntryKeyFocused = false;
                        moveSelect(0 ,+ 1);
                    }
                }
            }
            break;
        case 38 : 
            if(eventInComboBox(window.event))
                return;
            if(X);
            else if(gEntryClickFocused);
            else{
                if(GoodPlace2InsertRange() &&! gRangeInsertionInProgress && gEntryKeyFocused && is.ie5up)
                    StartRangeSelect();
                if(gRangeInsertionInProgress){
                    if(Y)
                        expandShrinkRange( - 1, 0);
                    else
                        moveRange( - 1, 0);
                    return false;
                }
                else{
                    if(Y)
                        expandShrinkSelect( - 1, 0);
                    else{
                        gEntryKeyFocused = false;
                        moveSelect( - 1, 0);
                    }
                }
            }
            break;
        case 40 : 
            if(eventInComboBox(window.event))
                return;
            if(X);
            else if(gEntryClickFocused);
            else{
                if(GoodPlace2InsertRange() &&! gRangeInsertionInProgress && gEntryKeyFocused && is.ie5up)
                    StartRangeSelect();
                if(gRangeInsertionInProgress){
                    if(Y)
                        expandShrinkRange( + 1, 0);
                    else
                        moveRange( + 1, 0);
                    return false;
                }
                else{
                    if(Y)
                        expandShrinkSelect( + 1, 0);
                    else{
                        gEntryKeyFocused = false;
                        moveSelect( + 1, 0);
                    }
                };
            }
            break;
        case 46 : 
            if( ! gEntryClickFocused){
                var U = findSelect(true);
                ClearRange(U.rowMin, U.rowMax, U.columnMin, U.columnMax, true, false, true);
            }
            break;
        case 115 : 
            if(is.ie5up){
                var T = gDocument.selection.createRange();
                T = expandRngToRef(T);
                if(EnteringAnEquation() && stringIsCellRef(T.text)){
                    T.select();
                    T.text = cycleCellRefString(T.text);
                    gLastRangeStringLength = T.text.length;
                }
            }
            break;
        case 120 : 
            if(gEntry.cell && isOverrideEnabled(gEntry.cell.cellData)){
                flipEntry(gEntry.state == "default" ? "override" : "default");
                resetButton(btnOverride, (gEntry.state == "default"));
                gBtnOverrideSticky = false;
                return false;
            }
            break;
        default : 
            touchEntry();
            if((Z != 16) && (Z != 17) && ( ! X) && ( ! event.altKey)){
                setTimeout("updateEntryHeight()", 0);
                gEntryKeyFocused = true;
                gRangeInsertionInProgress = false;
                ClipboardDeselected();
            }
            break;
    }
    if((X) && (is.ie5up)){
        switch(Z){
            case 88 : 
                return Cut();
                break;
            case 67 : 
                return Copy();
                break;
            case 86 : 
                return Paste();
                break;
            default : 
                break;
        }
    }
}
function keyPressDocument(){
    if(filterDocument(window.event))
        return;
    window.event.cancelBubble = true;
}
function keyUpDocument(){
    if(eventInComboBox(event)){
        if(event.keyCode == 13){
            event.srcElement.blur();
            return false;
        }
    }
    if(filterDocument(window.event))
        return;
    window.event.cancelBubble = true;
    var Z = window.event.srcElement;
    if(Z.id == "entry")
        setTimeout("SaveTextRange()", 50);
}
function ss_save(Z){
    if(gInPreview)
        ExitPreview();
    if(Z ||! gAppId)
        openSaveAs();
    else
        saveDocument(gAppId, null, gAppDescription);
}
function ss_close(Z){
    if(Z){
        gCloseAfterSave = true;
        ss_save();
    }
    else{
        gSpreadsheetDirty = false;
        window.close();
    }
}
function mouseDownDocument(){
    gMouseDownElement = window.event.srcElement;
    if(filterDocument(window.event))
        return;
    if(filterLink(window.event))
        return true;
    window.event.cancelBubble = true;
    gTracking = "none";
    gTrackingElement = null;
    var Z = window.event.srcElement;
    if(Z == null)
        return false;
    if( ! insideMenu(Z)){
        exceptMenu(null);
    }
    if(Z.id == "entry"){
        cancelEntryFieldRefocus();
        gEntryClickFocused = true;
        gRangeInsertionInProgress = false;
        ClipboardDeselected();
        return false;
    }
    Z = ContentsToCell(Z);
    switch(getClass(Z)){
        case "palette" : 
        case "division" : 
            break;
        case "tab" : 
            break;
        case "colorSpot" : 
            Z = getParent(Z);
        case "button" : 
            if(Z.list){
                if(Z.id == "borderMenu"){
                    InitBorderMenu();
                }
                exceptMenu(Z.list);
                toggleMenu(Z.list);
                setValue(Z, gAMenuIsShowing ? "true" : "false");
                offsetButton(Z, gAMenuIsShowing ? 2 : 1);
            }
            else{
                offsetButton(Z, 2, "#A7A7A7");
                gTracking = "button";
                gTrackingElement = Z;
            }
            break;
        case "largeMenu" : 
        case "smallMenu" : 
            MenuToggle(Z, 2);
            exceptMenu(Z.list);
            toggleMenu(Z.list);
            break;
        case "largeSpot" : 
        case "smallSpot" : 
            MenuToggle(Z.menu, 2);
            exceptMenu(Z.menu.list);
            toggleMenu(Z.menu.list);
            break;
        case "popupWidget" : 
            MenuToggle(Z, 2);
            var Y = popupMenuList;
            if( ! getVisible(Y)){
                var X = Z.parentElement;
                var W = getChild(Y, X.cellData.m_cellGUI.setting);
                if(W){
                    setStyle(W, "color", "white");
                    setStyle(W, "backgroundColor", "darkblue");
                }
            }
            exceptMenu(Y);
            toggleMenu(Y);
            break;
        case "largeItem" : 
        case "smallItem" : 
            break;
        case "swatch" : 
            Z = getParent(Z);
        case "holder" : 
        case "border" : 
            offsetButton(Z, 2);
            break;
        case "head" : 
            if(gInPreview)
                break;
        case "rowResizer" : 
        case "columnResizer" : 
        case "cell" : 
            var V = getClass(Z);
            if(V == "columnResizer"){
                Z = gCellElemMatrix[0][Z.m_name.match(/\d+/)[0]];
            }
            else if(V == "rowResizer"){
                Z = gCellElemMatrix[Z.m_name.match(/\d+/)[0]][0];
            }
            else{
                Z = FindMouseElement(window.event, Z);
            }
            var U = Z.m_name;
            var T = name2row(U);
            var S = name2column(U);
            var R = getPoint(event);
            var Q = getBounds(Z);
            var P = findSelect(false);
            if((window.event.button == 2) && ((getClass(Z) == "cell") || (getClass(Z) == "head")) && ((withinRange(T, P.rowMin, P.rowMax) && withinRange(S, P.columnMin, P.columnMax)))){
                return false;
            }
            var O = window.event.shiftKey;
            var N,
            M;
            var L;
            if(V == "columnResizer"){
                if(gInPreview)
                    break;
                gTracking = "adjust";
                gAdjustKind = "width";
                gAdjustPoint = R;
                gAdjustValue = getWidth(Z);
                gAdjustIndex = S;
                N = getElement("rect" + gCurrSheetIndex);
                L = getElement("sheet" + gCurrSheetIndex);
                M = getBounds(Z);
                M = newBounds(Q.top - 1, Q.left - 1, Q.top - 1 + getHeight(L), Q.left - 1 + Q.width);
                setBounds(N, M);
                setDisplay(N, true);
            }
            else if(V == "rowResizer"){
                if(gInPreview)
                    break;
                gTracking = "adjust";
                gAdjustKind = "height";
                gAdjustPoint = R;
                gAdjustValue = getHeight(Z);
                gAdjustIndex = T;
                N = getElement("rect" + gCurrSheetIndex);
                L = getElement("sheet" + gCurrSheetIndex);
                Z = Z.parentElement;
                M = getBounds(Z);
                M = newBounds(Q.top - 1, Q.left - 1, Q.top - 1 + Q.height, Q.left - 1 + getWidth(L));
                setBounds(N, M);
                setDisplay(N, true);
            }
            else if((GoodPlace2InsertRange()) && (gEntryClickFocused || gEntryKeyFocused || gRangeInsertionInProgress)){
                if(gRangeInsertionInProgress){
                    gSelection.moveStart("character" ,- gLastRangeStringLength);
                    gSelection.select();
                }
                gTracking = "rangeInsertion";
                gClipboardKind = "range";
                gRangeInsertionInProgress = true;
                if((T > 0) && (S > 0)){
                    if( ! window.event.shiftKey)
                        gRangePrime = Z;
                    gRangeFinal = Z;
                }
                else if((T == 0) && (S == 0)){
                    gRangePrime = index2cell(1, 1, gCurrSheetIndex);
                    gRangeFinal = index2cell(gRowCount - 1, gColumnCount - 1, gCurrSheetIndex);
                }
                else if(T == 0){
                    if( ! O){
                        gRangePrime = index2cell(1, S, gCurrSheetIndex);
                    }
                    gRangeFinal = index2cell(gRowCount - 1, S, gCurrSheetIndex);
                }
                else if(S == 0){
                    if( ! O){
                        gRangePrime = index2cell(T, 1, gCurrSheetIndex);
                    }
                    gRangeFinal = index2cell(T, gColumnCount - 1, gCurrSheetIndex);
                }
                DrawClipboardRect("range");
                UpdateRangeString();
                return false;
            }
            else{
                gEntryClickFocused = false;
                if(gInPreview){
                    if(Z.cellData && Z.cellData.dynamic && ((Z.cellData.dynamic.indexOf("__menu") !=- 1) || (Z.cellData.dynamic.indexOf("__button") !=- 1)))
                        return false;
                    var K = "true";
                    gTracking = "lock";
                    if(Z.cellData){
                        if(Z.cellData.m_locked)
                            K = Z.cellData.m_locked;
                    }
                    else
                        CheckForCellData(Z.m_name);
                    gLockState = (K == "true") ? "false" : "true";
                    gLockStart = gLockFinal = Z;
                    ShowLock();
                    gSpreadsheetDirty = true;
                }
                else{
                    gEntryKeyFocused = false;
                    gTracking = "select";
                    storeEntry();
                    hideSelect();
                    gSelectKind = "none";
                    if((T > 0) && (S > 0)){
                        gSelectKind = "range";
                        if( ! O){
                            gSelectPrime = Z;
                            gSelectStart = Z;
                        }
                        gSelectFinal = Z;
                    }
                    else if((T == 0) && (S == 0)){
                        gSelectKind = "sheet";
                        gSelectPrime = index2cell(1, 1, gCurrSheetIndex);
                        gSelectStart = index2cell(0, 0, gCurrSheetIndex);
                        gSelectFinal = index2cell(gRowCount - 1, gColumnCount - 1, gCurrSheetIndex);
                    }
                    else if(T == 0){
                        gSelectKind = "column";
                        if( ! O){
                            gSelectPrime = index2cell(1, S, gCurrSheetIndex);
                            gSelectStart = index2cell(0, S, gCurrSheetIndex);
                        }
                        gSelectFinal = index2cell(gRowCount - 1, S, gCurrSheetIndex);
                    }
                    else if(S == 0){
                        gSelectKind = "row";
                        if( ! O){
                            gSelectPrime = index2cell(T, 1, gCurrSheetIndex);
                            gSelectStart = index2cell(T, 0, gCurrSheetIndex);
                        }
                        gSelectFinal = index2cell(T, gColumnCount - 1, gCurrSheetIndex);
                    }
                    showSelect();
                }
            }
            break;
        default : 
            break;
    }
    return false;
}
function mouseMoveDocument(){
    if(filterDocument(window.event))
        return;
    if(filterLink(window.event))
        return true;
    window.event.cancelBubble = true;
    var Z = window.event.srcElement;
    if(Z == null)
        return false;
    if(gMouseDownElement == Z && ((Z.id == "entry") || (Z.className == "comboBox")))
        return;
    Z = ContentsToCell(Z);
    Z = FindMouseElement(window.event, Z);
    var Y;
    var X;
    var W;
    var V;
    var U;
    var T;
    switch(gTracking){
        case "none" : 
            break;
        case "button" : 
            if(gTrackingElement){
                if(Z == gTrackingElement)
                    offsetButton(gTrackingElement, 2, "#A7A7A7");
                else
                    offsetButton(gTrackingElement, 1);
            }
            break;
        case "adjust" : 
            switch(gAdjustKind){
                case "width" : 
                    Y = getElement("rect" + gCurrSheetIndex);
                    X = getPoint(event);
                    var S = gAdjustValue + X.x - gAdjustPoint.x;
                    var R = pin(S, kColumnMinimum, kColumnMaximum);
                    setWidth(Y, R);
                    break;
                case "height" : 
                    Y = getElement("rect" + gCurrSheetIndex);
                    X = getPoint(event);
                    var Q = gAdjustValue + X.y - gAdjustPoint.y;
                    var P = pin(Q, kRowMinimum, kRowMaximum);
                    setHeight(Y, P);
                    setDisplay(Y, (P != 0));
                    break;
                default : 
                    break;
            }
            break;
        case "rangeInsertion" : 
            if((Z.className != "cell"))
                return false;
            W = Z.m_name;
            V = pin(name2row(W), 1, gRowCount - 1);
            U = pin(name2column(W), 1, gColumnCount - 1);
            T = index2cell(V, U, gCurrSheetIndex);
            if(T != gRangeFinal){
                gRangeFinal = T;
                DrawClipboardRect("range");
                UpdateRangeString();
            }
            break;
        case "select" : 
            if((Z.className != "head") && (Z.className != "cell"))
                return false;
            W = Z.m_name;
            switch(gSelectKind){
                case "none" : 
                    break;
                case "range" : 
                    V = pin(name2row(W), 1, gRowCount - 1);
                    U = pin(name2column(W), 1, gColumnCount - 1);
                    T = index2cell(V, U, gCurrSheetIndex);
                    if(T != gSelectFinal){
                        gLastSelect = findSelect(false);
                        gSelectFinal = T;
                        deltaSelect();
                    }
                    break;
                case "row" : 
                    V = pin(name2row(W), 1, gRowCount - 1);
                    T = index2cell(V, gColumnCount - 1, gCurrSheetIndex);
                    if(T != gSelectFinal){
                        gLastSelect = findSelect(false);
                        gSelectFinal = T;
                        deltaSelect();
                    }
                    break;
                case "column" : 
                    U = pin(name2column(W), 1, gColumnCount - 1);
                    T = index2cell(gRowCount - 1, U, gCurrSheetIndex);
                    if(T != gSelectFinal){
                        gLastSelect = findSelect(false);
                        gSelectFinal = T;
                        deltaSelect();
                    }
                    break;
                case "sheet" : 
                    break;
                default : 
                    break;
            }
            break;
        case "lock" : 
            if((Z.className != "cell") || (gLockState == null))
                return false;
            W = Z.m_name;
            V = pin(name2row(W), 1, gRowCount - 1);
            U = pin(name2column(W), 1, gColumnCount - 1);
            T = index2cell(V, U, gCurrSheetIndex);
            if(T != gLockFinal){
                HideLock();
                gLockFinal = T;
                ShowLock();
            }
        default : 
            break;
    }
    return false;
}
function DrawClipboardRect(Z){
    var Y = (Z == "selection") ? gClipPrime : gRangePrime;
    var X = (Z == "selection") ? gClipFinal : gRangeFinal;
    var W = getBounds(Y);
    var V = getBounds(X);
    var U = Math.min(W.top, V.top);
    var T = Math.min(W.left, V.left);
    var S = Math.max(W.right - V.left, V.right - W.left);
    var R = Math.max(W.bottom - V.top, V.bottom - W.top) + 2;
    var Q = cutcopyrecttop;
    setBounds(Q, newSizedBounds(U, T, 2, S));
    setDisplay(Q, true);
    var P = cutcopyrectbottom;
    setBounds(P, newSizedBounds(Math.max(W.bottom, V.bottom), T, 2, S));
    setDisplay(P, true);
    var O = cutcopyrectleft;
    setBounds(O, newSizedBounds(U, T, R, 2));
    setDisplay(O, true);
    var N = cutcopyrectright;
    setBounds(N, newSizedBounds(U, Math.max(W.right, V.right), R, 2));
    setDisplay(N, true);
}
function HideClipboardRect(){
    var Z = cutcopyrecttop;
    var Y = cutcopyrectbottom;
    var X = cutcopyrectleft;
    var W = cutcopyrectright;
    setDisplay(Z, false);
    setDisplay(Y, false);
    setDisplay(X, false);
    setDisplay(W, false);
    setWidth(W, 0);
    setHeight(W, 0);
    setWidth(Y, 0);
    setHeight(Y, 0);
    setWidth(Z, 0);
    setHeight(Z, 0);
    setWidth(X, 0);
    setHeight(X, 0);
}
function PopulateWindowsClipboard(){
    var Z = "";
    for(var Y = gClipboardSelect.rowMin; Y <= gClipboardSelect.rowMax; Y ++ ){
        for(var X = gClipboardSelect.columnMin; X <= gClipboardSelect.columnMax; X ++ ){
            Z += getInner(index2cell(Y, X, 0), true);
            Z += "\t";
        }
        Z = Z.substring(0, Z.length - 1);
        Z += "\r\n";
    }
    Z = Z.substring(0, Z.length - 2);
    var W = getElement("clipboardPrep");
    var V = W.createTextRange();
    V.text = Z;
    V = W.createTextRange();
    V.execCommand("copy");
}
function PasteWindowsClipboard(){
    var Z = getElement("clipboardPrep");
    var Y = Z.createTextRange();
    Y.execCommand("paste");
    Y = Z.createTextRange();
    var X = new Array();
    var W = Y.text.split("\r\n");
    for(var V = 0; V < W.length; V ++ ){
        X[V] = W[V].split("\t");
    }
    var U = cell2row(gSelectPrime);
    var T = cell2column(gSelectPrime);
    for(var S = U; S < min(U + X.length, gRowCount); S ++ ){
        for(var R = T; R < min(T + X[0].length, gColumnCount); R ++ ){
            var Q = index2cell(S, R, 0);
            var P = X[S - U][R - T];
            CheckForCellData(Q.m_name);
            if(isOverrideEnabled(Q.cellData)){
                setCellOverride(Q.cellData, P);
                pulseCell(Q);
            }
            else
                buildCell(Q, P);
        }
    }
    fetchEntry();
    gSpreadsheetDirty = true;
}
function ClipboardAction(){
    if(is.ie5up){
        var Z = fetchWindRefList();
        for(var Y in Z){
            if((Z[Y].windRef != window) && (Z[Y].type == "ss") && (Z[Y].windRef.gClipboardKind != "none"))
                Z[Y].windRef.ClipboardDeselected();
        }
    }
    gClipboardRect = selectToPixelCoordRect();
    gClipboardSelect = findSelect(true);
    gClipPrime = index2cell(gClipboardSelect.rowPrime, gClipboardSelect.columnPrime, 0);
    gClipFinal = index2cell(gClipboardSelect.rowFinal, gClipboardSelect.columnFinal, 0);
    DrawClipboardRect("selection");
}
function Cut(){
    if(gEntryClickFocused || gEntryKeyFocused)
        return true;
    if((gClipboardKind == "format") || (gClipboardKind == "stickyFormat"))
        InvertButton(format);
    ClipboardAction();
    PopulateWindowsClipboard();
    gClipboardKind = "cut";
}
function Copy(){
    if(gEntryClickFocused || gEntryKeyFocused)
        return true;
    if((gClipboardKind == "format") || (gClipboardKind == "stickyFormat"))
        InvertButton(format);
    ClipboardAction();
    PopulateWindowsClipboard();
    gClipboardKind = "copy";
}
function Revert(){
    var Z = getCellOriginalValue(gEntry.cell.cellData);
    if(Z != null){
        clearOverride(gEntry.cell.cellData);
        pulseCell(gEntry.cell);
        seedEntry(gEntry.state);
        gSpreadsheetDirty = true;
    }
}
function StampFormatSelected(){
    ClipboardAction();
    gClipboardKind = "format";
}
function ClipboardDeselected(){
    if(gClipboardKind == "none")
        return;
    HideClipboardRect();
    if((gClipboardKind == "format") || (gClipboardKind == "stickyFormat"))
        InvertButton(format);
    gClipboardKind = "none";
}
function PasteSpecial(){
    if(getClipSrcWind().gClipboardKind == "cut"){
        hb_alert(getString("strPasteValuesWarning"), getString("strPasteValuesWarningTitle"));
        return;
    }
    PasteWindowsClipboard();
}
function getClipSrcWind(){
    var Z = window;
    if(is.ie5up){
        var Y = fetchWindRefList();
        for(var X in Y){
            if((Y[X].type == "ss") && (Y[X].windRef.gClipboardKind) && (Y[X].windRef.gClipboardKind != "none"))
                Z = Y[X].windRef;
        }
    }
    return Z;
}
function Paste(Z){
    if(gEntryClickFocused || gEntryKeyFocused)
        return true;
    var Y = getClipSrcWind();
    if(Y.gClipboardKind == "none"){
        PasteWindowsClipboard();
        return;
    }
    var X = Y.gClipboardSelect.columnMax - Y.gClipboardSelect.columnMin + 1;
    var W = Y.gClipboardSelect.rowMax - Y.gClipboardSelect.rowMin + 1;
    var V = findSelect(true);
    if(gSelectPrime == gSelectFinal){
        gSelectFinal = index2cell(pin(cell2row(gSelectPrime) + W - 1, 0, gRowCount - 1), pin(cell2column(gSelectPrime) + X - 1, 0, gColumnCount - 1), 0);
        V = findSelect(true);
    }
    var U = V.columnMin - Y.gClipboardSelect.columnMin;
    var T = V.rowMin - Y.gClipboardSelect.rowMin;
    var S = selectToPixelCoordRect();
    if((Y == window) && equalBounds(S, gClipboardRect)){
        if(gClipboardKind == "cut")
            ClipboardDeselected();
        fetchEntry();
        return;
    }
    var R;
    if((Y == window) && overlappingBounds(gClipboardRect, S)){
        if(equalBounds(S, unionBounds(S, gClipboardRect))){
            if(fullOverlapPasteOK(V, X, W)){
                R = TileClipIntoSelect(V, U, T, Z);
                if(R !=- 1){
                    showOverrideAmbiguityDialog(R);
                    return;
                }
            }
            else{
                hb_alert(getString("strCompleteOverlapCmp", kDefaultLocale, gClipboardKind), getString("strRegionMismatch"));
                return;
            }
        }
        else{
            if((gClipboardRect.width == S.width) && (gClipboardRect.height == S.height)){
                R = MoveCellRange(gClipboardSelect.rowMin, gClipboardSelect.rowMax, gClipboardSelect.columnMin, gClipboardSelect.columnMax, U, T, Z);
                if(R !=- 1){
                    showOverrideAmbiguityDialog(R);
                    return;
                }
                if(gClipboardKind == "cut"){
                    var Q = new Array();
                    var P = new Array();
                    diffBoundsOverlap(selectToRowColIndexRect(V), selectToRowColIndexRect(gClipboardSelect), Q, P);
                    for(i = 0; i < P.length; i ++ ){
                        var O = P[i];
                        ClearRange(O.top, O.bottom - 1, O.left, O.right - 1, true, true);
                    }
                }
                ClipboardDeselected();
            }
            else{
                hb_alert(getString("strPartialOverlapCmp", kDefaultLocale, gClipboardKind), getString("strRegionMismatch"));
                return;
            }
        }
    }
    else{
        R = TileClipIntoSelect(V, U, T, Z);
        if(R !=- 1){
            showOverrideAmbiguityDialog(R);
            return;
        }
    }
    if(Y.gClipboardKind == "cut"){
        Y.ClearRange(Y.gClipboardSelect.rowMin, Y.gClipboardSelect.rowMax, Y.gClipboardSelect.columnMin, Y.gClipboardSelect.columnMax, true, true);
        Y.ClipboardDeselected();
        Y.gClipboardKind = "none";
    }
    else if(Y.gClipboardKind == "format"){
        Y.ClipboardDeselected();
        Y.gClipboardKind = "none";
    }
    showSelect();
    fetchEntry();
    gUserAlwaysPreserveOverrides = null;
}
function showOverrideAmbiguityDialog(Z){
    var Y = "gUserAlwaysPreserveOverrides=false; Paste(" + Z + ");";
    var X = "gUserAlwaysPreserveOverrides=true; Paste(" + Z + ");";
    hb_confirm(getString("strPreserveOverridesDuringPaste"), getString("strOverrideWarning"), getString("strPasteFormulas"), null, getString("strPasteValues"), Y, null, X);
}
function TileClipIntoSelect(Z, Y, X, W){
    var V = getClipSrcWind();
    var U = V.gClipboardSelect.rowMax - V.gClipboardSelect.rowMin + 1;
    var T = V.gClipboardSelect.columnMax - V.gClipboardSelect.columnMin + 1;
    var S = 0;
    if(W == null)
        W =- 1;
    for(var R = Z.columnMin; R <= Z.columnMax; R ++ ){
        for(var Q = Z.rowMin; Q <= Z.rowMax; Q ++, S ++ ){
            if(S < W)
                continue;
            var P = Math.floor((R - Z.columnMin) / T) * T;
            var O = Math.floor((Q - Z.rowMin) / U) * U;
            var N = MoveCell(Q - X - O, R - Y - P, Y + P, X + O, V.gClipboardKind, true, false, true);
            if(N != null)
                return S;
        }
    }
    return - 1;
}
function fullOverlapPasteOK(Z, Y, X){
    return(((gClipboardSelect.rowMin - Z.rowMin) % X == 0) && ((gClipboardSelect.columnMin - Z.columnMin) % Y == 0) && ((Z.rowMax - gClipboardSelect.rowMax) % X == 0) && ((Z.columnMax - gClipboardSelect.columnMax) % Y == 0) && (gClipboardKind != "cut"));
}
function MoveCellRange(Z, Y, X, W, V, U, T){
    if((V == 0) && (U == 0))
        return;
    var S;
    var R;
    var Q = 0;
    if(T == null)
        T =- 1;
    var P;
    if((V >= 0) && (U >= 0)){
        for(S = W; S >= X; S -- ){
            for(R = Y; R >= Z; R --, Q ++ ){
                if(Q < T)
                    continue;
                P = MoveCell(R, S, V, U, gClipboardKind, true, false, true);
                if(P != null)
                    return Q;
            }
        }
    }
    else if((V < 0) && (U >= 0)){
        for(S = X; S <= W; S ++ ){
            for(R = Y; R >= Z; R --, Q ++ ){
                if(Q < T)
                    continue;
                P = MoveCell(R, S, V, U, gClipboardKind, true, false, true);
                if(P != null)
                    return Q;
            }
        }
    }
    else if((V <= 0) && (U < 0)){
        for(S = X; S <= W; S ++ ){
            for(R = Z; R <= Y; R ++, Q ++ ){
                if(Q < T)
                    continue;
                P = MoveCell(R, S, V, U, gClipboardKind, true, false, true);
                if(P != null)
                    return Q;
            }
        }
    }
    else if((V > 0) && (U < 0)){
        for(S = W; S >= X; S -- ){
            for(R = Z; R <= Y; R ++, Q ++ ){
                if(Q < T)
                    continue;
                P = MoveCell(R, S, V, U, gClipboardKind, true, false, true);
                if(P != null)
                    return Q;
            }
        }
    }
    return - 1;
}
function ClearRange(Z, Y, X, W, V, U, T){
    for(var S = X; S <= W; S ++ ){
        for(var R = Z; R <= Y; R ++ ){
            var Q = index2cell(R, S, gCurrSheetIndex);
            if(V)
                ClearCellContent(Q, T);
            if(U)
                ClearCellFormatting(Q);
            if((Q.cellData) && (Q.cellData.m_refersTo))
                unrefCell(Q);
        }
    }
    gSpreadsheetDirty = true;
}
function ClearCellContent(Z, Y){
    if( ! Z.cellData)
        return;
    if(Z.cellData.m_cellGUI != null)
        delete Z.cellData.m_cellGUI;
    if(Y && isOverrideEnabled(Z.cellData)){
        setCellOverride(Z.cellData, "");
        pulseCell(Z);
    }
    else if(Z.cellData.entry){
        SetCellText(Z, "");
        buildCell(Z, "");
        Z.style.overflow = "";
        if(Z.cellData.override){
            delete Z.cellData.override;
        }
    }
    showSelect();
    fetchEntry();
}
function ClearCellFormatting(Z){
    if( ! Z.cellData)
        return;
    ClearCellStyleAttribute(Z, "foreColor", "color");
    ClearCellStyleAttribute(Z, "bk_color", "backgroundColor");
    ClearCellStyleAttribute(Z, "viewFamily", "fontFamily");
    ClearCellStyleAttribute(Z, "viewSize", "fontSize");
    ClearCellStyleAttribute(Z, "_fontWeight", "fontWeight");
    ClearCellStyleAttribute(Z, "_textDecoration", "textDecoration");
    ClearCellStyleAttribute(Z, "_fontStyle", "fontStyle");
    ClearCellStyleAttribute(Z, "_textAlign", "textAlign");
    ClearCellStyleAttribute(Z, "textAlign", "textAlign");
    ClearCellStyleAttribute(Z, "m_backgroundImage", "backgroundImage");
    ClearCellStyleAttribute(Z, "_borderBottom", "borderBottom");
    ClearCellStyleAttribute(Z, "_borderRight", "borderRight");
    ClearCellStyleAttribute(Z, "_borderTop", "borderBottom");
    ClearCellStyleAttribute(Z, "_borderLeft", "borderRight");
    ClearCellStyleAttribute(Z, "_viewFormat", null);
    ClearCellStyleAttribute(Z, "viewFormat", null);
    showSelect();
    fetchEntry();
}
function ClearCellStyleAttribute(Z, Y, X){
    if(Y == "_borderLeft"){
        if(((Z.cellData) && (Z.cellData[Y])) && (getStyle(cellToLeft(Z), X)))
            cellToLeft(Z).style[X] = GetDefaultCellStyle(cellToLeft(Z), X);
    }
    else if(Y == "_borderTop"){
        if(((Z.cellData) && (Z.cellData[Y])) && (getStyle(cellAbove(Z), X)))
            cellAbove(Z).style[X] = GetDefaultCellStyle(cellAbove(Z), X);
    }
    else if((Y == "_borderRight") || (Y == "_borderBottom")){
        if(((Z.cellData) && (Z.cellData[Y])) && (getStyle(Z, X)))
            Z.style[X] = GetDefaultCellStyle(Z, X);
    }
    else{
        if(getStyle(Z, X))
            Z.style[X] = GetDefaultCellStyle(Z, X);
    }
    if((Z.cellData) && (Z.cellData[Y]))
        delete Z.cellData[Y];
}
function FillDown(){
    gClipboardSelect = findSelect(true);
    var Z = gClipboardSelect.rowMax - gClipboardSelect.rowMin + 1;
    if(Z == 1){
        if(gClipboardSelect.rowMin == 1){}
        else{
            for(columnIndex = gClipboardSelect.columnMin; columnIndex <= gClipboardSelect.columnMax; columnIndex ++ )
                MoveCell(gClipboardSelect.rowMin - 1, columnIndex, 0, 1, "copy", true, true);
        }
    }
    else{
        for(columnIndex = gClipboardSelect.columnMin; columnIndex <= gClipboardSelect.columnMax; columnIndex ++ ){
            for(rowIndex = gClipboardSelect.rowMin + 1; rowIndex <= gClipboardSelect.rowMax; rowIndex ++ ){
                MoveCell(gClipboardSelect.rowMin, columnIndex, 0, rowIndex - gClipboardSelect.rowMin, "copy", true, true);
            }
        }
    }
    showSelect();
    fetchEntry();
    gSpreadsheetDirty = true;
}
function FillRight(){
    gClipboardSelect = findSelect(true);
    var Z = gClipboardSelect.columnMax - gClipboardSelect.columnMin + 1;
    if(Z == 1){
        if(gClipboardSelect.columnMin == 1){}
        else{
            for(rowIndex = gClipboardSelect.rowMin; rowIndex <= gClipboardSelect.rowMax; rowIndex ++ )
                MoveCell(rowIndex, gClipboardSelect.columnMin - 1, 1, 0, "copy", true, true);
        }
    }
    else{
        for(rowIndex = gClipboardSelect.rowMin; rowIndex <= gClipboardSelect.rowMax; rowIndex ++ ){
            for(columnIndex = gClipboardSelect.columnMin + 1; columnIndex <= gClipboardSelect.columnMax; columnIndex ++ ){
                MoveCell(rowIndex, gClipboardSelect.columnMin, columnIndex - gClipboardSelect.columnMin, 0, "copy", true, true);
            }
        }
    }
    showSelect();
    fetchEntry();
    gSpreadsheetDirty = true;
}
var gUserAlwaysPreserveOverrides = null;
function MoveCell(Z, Y, X, W, V, U, T, S){
    if((Z + W > gRowCount - 1) || (Y + X > gColumnCount - 1))
        return;
    var R;
    if(T)
        R = index2cell(Z, Y, gCurrSheetIndex);
    else
        R = getClipSrcWind().index2cell(Z, Y, gCurrSheetIndex);
    var Q = index2cell(Z + W, Y + X, gCurrSheetIndex);
    var P = "";
    CheckForCellData(Q.m_name);
    MoveCellStyle(R, Q);
    MoveCellFormat(R, Q);
    if((V == "format") || (V == "stickyFormat")){
        FixupCell(Q);
        return;
    }
    var O = null;
    if(S && isOverrideEnabled(Q.cellData)){
        if( ! R.cellData || R.cellData.entry == null)
            O = "";
        else if(equalString(R.cellData.entry)){
            if(gUserAlwaysPreserveOverrides == null)
                return "overrideAmbiguity";
            if(gUserAlwaysPreserveOverrides)
                O = R.cellData.derived;
        }
        else{
            var N = R.cellData.derived;
            O = (N != "" && N != null) ? N : R.cellData.entry;
        }
    }
    if(O != null){
        setCellOverride(Q.cellData, O);
        pulseCell(Q);
    }
    else{
        if((R.cellData) && (R.cellData.entry != null)){
            if(U){
                P = AdjustCellEntryReferences(R.cellData.entry, X, W, false, false);
            }
            else{
                P = R.cellData.entry;
            }
        }
        var M;
        if(R.cellData && ((M = getCellOverride(R.cellData)) != void(0)))
            setCellOverride(Q.cellData, M, true);
        else
            clearOverride(Q.cellData);
        if((getClipSrcWind() != window) && (R.cellData) && (R.cellData.dynamic) && (R.cellData.dynamic.search(/__macro\(/) !=- 1) && ( ! getPref('noMacroWarnings'))){
            var L = [{
                type : 'raw', value : getString("strMovedMacro")
            }];
            var K = [{
                type : 'other', value : getString("strDontRemind"),
                onclick : "savePref('noMacroWarnings', true, true); closeModal();"
            }, 
            {
                type : 'accept',
                value : getString("strOK")
            }];
            openModal('macroTransferAlert', getString("strMacroWarning"), null, "closeModal()", "closeModal()", L, K, null);
        }
        if((getClipSrcWind() != window) && (R.cellData) && (R.cellData.dynamic) && ((R.cellData.dynamic.search(/__rsdata\(/) !=- 1) || (R.cellData.dynamic.search(/__rsheader\(/) !=- 1))){
            var J = R.cellData.dynamic.match(/rs\d+/g);
            for(var I = 0; I < J.length; I ++ ){
                var H = J[I];
                var G = false;
                for(var F = 0; F < gResultSets.length; F ++ )
                    if(gResultSets[F].id == H)
                        G = true;
                if( ! G){
                    var E = cloneObject(getClipSrcWind().rsGetResultSet(H));
                    var D = new Array(E);
                    addResultSets(D);
                    var C = cloneObject(getClipSrcWind().rsGetDataSource(H));
                    var B = new Array(C);
                    addDataSources(B);
                }
            }
        }
        P = P.replace(/\t/g, "");
        buildCell(Q, P);
    }
    if(V == "cut"){
        if((R.cellData) && (R.cellData.m_referredToBy)){
            var A = R.cellData.m_referredToBy;
            for(var Z1 = 0; Z1 < A.length; Z1 ++ ){
                P = AdjustCellEntryReferences(A[Z1].cellData.entry, X, W, true, true);
                P = P.replace(/\t/g, "");
                buildCell(A[Z1], P);
            }
        }
    }
    gSpreadsheetDirty = true;
}
function CellRefIsWithinClipboardRect(Z){
    var Y = getClipSrcWind();
    Z = Z.replace(/\$/g, "");
    return((withinRange(ColumnLetterToColumnIndex(Z), Y.gClipboardSelect.columnMin, Y.gClipboardSelect.columnMax)) && (withinRange(parseInt(Z.match(/\d+/)[0]), Y.gClipboardSelect.rowMin, Y.gClipboardSelect.rowMax)));
}
function AdjustCellEntryReferences(Z, Y, X, W, V){
    var U;
    var T = getClipSrcWind();
    var S = Z.split('\t');
    for(var R = 1; R < S.length; R += 2){
        if(((S[R - 1] == ":") || (S[R + 1] == ":")) && (W))
            continue;
        U = S[R];
        var Q = null;
        if(T.gClipboardSelect)
            Q = CellRefIsWithinClipboardRect(U);
        if((U != "") && ((U.charAt(0) != "$") || V)){
            if((T.gClipboardKind != "cut") || Q){
                var P = ColumnLetterToColumnIndex((U.charAt(0) == "$") ? U.substring(1, U.length) : U);
                var O = P + Y;
                if(withinRange(O, 1, gColumnCount - 1)){
                    S[R] = U.replace(/[a-zA-z]+/, ColumnIndexToColumnLetter(O));
                }
                else{
                    S[R] = "#REF!";
                }
            }
        }
        U = S[R];
        if((U != "") && (U != "#REF!") && ((U.charAt(U.search(/\d+/) - 1) != "$") || V)){
            if((T.gClipboardKind != "cut") || Q){
                var N = parseInt(U.match(/\d+/)[0]);
                var M = N + X;
                if(withinRange(parseInt(M), 1, gRowCount - 1)){
                    S[R] = U.replace(/\d+/, M);
                }
                else{
                    S[R] = "#REF!";
                }
            }
        }
    }
    return S.join('\t');
}
function MoveCellStyle(Z, Y){
    CheckForCellData(Y.m_name);
    CheckForCellData(cellAbove(Y).m_name);
    CheckForCellData(cellToLeft(Y).m_name);
    MoveCellStyleAttribute(Z, Y, "foreColor", "color");
    MoveCellStyleAttribute(Z, Y, "bk_color", "backgroundColor");
    MoveCellStyleAttribute(Z, Y, "viewFamily", "fontFamily");
    MoveCellStyleAttribute(Z, Y, "viewSize", "fontSize");
    MoveCellStyleAttribute(Z, Y, "_fontWeight", "fontWeight");
    MoveCellStyleAttribute(Z, Y, "_textDecoration", "textDecoration");
    MoveCellStyleAttribute(Z, Y, "_fontStyle", "fontStyle");
    MoveCellStyleAttribute(Z, Y, "_textAlign", "textAlign");
    if( ! gSortInProgress){
        MoveCellStyleAttribute(Z, Y, "_borderBottom", "borderBottom");
        MoveCellStyleAttribute(Z, Y, "_borderRight", "borderRight");
        MoveCellStyleAttribute(Z, Y, "_borderTop", "borderBottom");
        MoveCellStyleAttribute(Z, Y, "_borderLeft", "borderRight");
    }
}
function MoveCellStyleAttribute(Z, Y, X, W){
    if((Z.cellData) && (Z.cellData[X])){
        Y.cellData[X] = Z.cellData[X];
        if(X == "_borderLeft"){
            cellToLeft(Y).style[W] = cellToLeft(Z).style[W];
        }
        else if(X == "_borderTop"){
            cellAbove(Y).style[W] = cellAbove(Z).style[W];
        }
        else{
            Y.style[W] = Z.style[W];
        }
    }
    else if(( ! Z.cellData) || ( ! Z.cellData[X])){
        if((Y.cellData) && (Y.cellData[X]))
            delete Y.cellData[X];
        if(X == "_borderLeft"){
            if( ! cellToLeft(Y).cellData._borderRight)
                cellToLeft(Y).style[W] = GetDefaultCellStyle(cellToLeft(Y), W);
        }
        else if(X == "_borderTop"){
            if( ! cellAbove(Y).cellData._borderBottom)
                cellAbove(Y).style[W] = GetDefaultCellStyle(cellAbove(Y), W);
        }
        else{
            if(Y.style[W] != "")
                Y.style[W] = GetDefaultCellStyle(Y, W);
        }
    }
}
function MoveCellFormat(Z, Y){
    var X = Z.cellData;
    var W = Y.cellData;
    if( ! X)
        return;
    if(X._wrapText){
        W._wrapText = X._wrapText;
        dirtyCell(Y);
    }
    if(X._viewFormat){
        W._viewFormat = X._viewFormat;
        dirtyCell(Y);
    }
    if(X.viewFormat){
        W.viewFormat = X.viewFormat;
        dirtyCell(Y);
    }
    if(X.positiveFormat)
        W.positiveFormat = X.positiveFormat;
    if(X.negativeFormat)
        W.negativeFormat = X.negativeFormat;
    if(X.vanishedFormat)
        W.vanishedFormat = X.vanishedFormat;
    if(X.nonvalueFormat)
        W.nonvalueFormat = X.nonvalueFormat;
}
function HandleFunctionMenu(Z){
    var Y = getElement('entry');
    var X,
    W,
    V,
    U = '\")';
    switch(Z){
        case "funcImageUrl" : 
        {
            X = "=image(\"";
            W = getString("strPutImageURL");
            V = W;
            break;
        }
    case "funcStockQuote" : 
    {
        X = "=quote(\"";
        W = getString("strStockSymbol");
        V = W;
        break;
    }
case "funcLinkUrl" : 
{
    X = "=link(\"http:\/\/";
    W = getString("strPutURL") + "\", \"" + getString("strPutOptional");
    V = getString("strPutURL");
    break;
}
case "funcCurrency" : 
{
    var T = new Date().toLocaleString();
    T = T.split(' ')[0];
    X = "=currency(\"";
    W = getString("strPutFromCurrency") + "\", \"" + getString("strPutToCurrency") + "\", \"" + T + "\", \"bid";
    V = getString("strPutFromCurrency");
    break;
}
default : 
    alert(getString("strUnsupportedFunction") + ":\n" + Z);
    return;
}
setValue(Y, X + W + U);
var S = Y.createTextRange();
S.findText(V);
S.select();
}
function getHolderList(Z){
    var Y;
    Y = getParent(Z);
    return getParent(Y);
}
function HandleTracking(Z){
    var Y;
    var X;
    var W;
    var V;
    switch(getClass(Z)){
        case "palette" : 
        case "division" : 
        case "tab" : 
            break;
        case "button" : 
            if(Z != gTrackingElement)
                break;
            switch(Z.id){
                case "bold" : 
                    Y = toggleButton(Z) ? "bold" : "normal";
                    cellformat2range("_fontWeight", Y);
                    break;
                case "italic" : 
                    Y = toggleButton(Z) ? "italic" : "normal";
                    cellformat2range("_fontStyle", Y);
                    break;
                case "underline" : 
                    Y = toggleButton(Z) ? "underline" : "none";
                    cellformat2range("_textDecoration", Y);
                    break;
                case "left" : 
                case "center" : 
                case "right" : 
                    if(selectInGroup(Z, "left"))
                        cellformat2range("_textAlign", "left");
                    if(selectInGroup(Z, "center"))
                        cellformat2range("_textAlign", "center");
                    if(selectInGroup(Z, "right"))
                        cellformat2range("_textAlign", "right");
                    break;
                case "new" : 
                    HandleNew();
                    break;
                case "open" : 
                    HandleOpen();
                    break;
                case "save" : 
                    if(window.event.ctrlKey){
                        openLifeboat();
                        break;
                    }
                    ss_save();
                    break;
                case 'print' : 
                    orientationPrompt();
                    break;
                case "cut" : 
                    Cut();
                    break;
                case "copy" : 
                    Copy();
                    break;
                case "paste" : 
                    Paste();
                    break;
                case "sum" : 
                    AutoSum();
                    break;
                case "accept" : 
                    storeEntry();
                    fetchEntry();
                    EndRangeInsertion();
                    gEntryKeyFocused = false;
                    gEntryClickFocused = false;
                    break;
                case "cancel" : 
                    fetchEntry();
                    EndRangeInsertion();
                    gEntryKeyFocused = false;
                    gEntryClickFocused = false;
                    break;
                case "btnRevert" : 
                    Revert();
                    break;
                case "btnOverride" : 
                    Y = toggleButton(Z) ? "default" : "override";
                    flipEntry(Y);
                    gBtnOverrideSticky = false;
                    break;
                case "format" : 
                    if(toggleButton(Z))
                        StampFormatSelected();
                    else
                        ClipboardDeselected();
                    break;
                case 'btnEmail' : 
                    var U = 0;
                    if(gIsMatterhorn){
                        if(aasGetCurrVisibility() == "private"){
                            U = 1;
                        }
                    }
                    ShowEmailSpreadsheet(gAppId ,! gSpreadsheetDirty, U);
                    break;
                case 'btnEndPreview' : 
                    ExitPreview();
                    break;
                case 'print' : 
                default : 
                    alert("[" + Z.id + "] " + getString("strAfterBeta"));
                    break;
            }
            if(getValue(Z) == "true")
                offsetButton(Z, 2);
            else
                offsetButton(Z, 1);
            break;
        case "largeMenu" : 
        case "smallMenu" : 
        case "popupWidget" : 
            MenuToggle(Z, 1);
            break;
        case "largeSpot" : 
        case "smallSpot" : 
            MenuToggle(Z.menu, 1);
            break;
        case "largeItem" : 
            exceptMenu(null);
            unhighlightLargeMenuItem(Z);
            HandleMainMenuCommand(Z);
            break;
        case "smallItem" : 
            exceptMenu(null);
            unhighlightSmallMenuItem(Z);
            X = getParent(Z);
            if(X.id == "popupMenuList")
                break;
            W = X.menu;
            V = W.spot;
            var T = getInner(Z);
            switch(W.id){
                case "fontMenu" : 
                    V.value = T;
                    cellformat2range("viewFamily", Z.id);
                    break;
                case "sizeMenu" : 
                    V.value = T;
                    cellformat2range("viewSize", T);
                    break;
                case "functionMenu" : 
                    HandleFunctionMenu(Z.id);
                    break;
                default : 
                    alert("unknown menu item: '" + Z.id + "';\nmenu:'" + W.id + "'");
                    break;
            }
            break;
        case "border" : 
            exceptMenu(null);
            frame2range(getValue(Z));
            break;
        case "swatch" : 
            Z = getParent(Z);
        case "holder" : 
            exceptMenu(null);
            var S = getValue(Z);
            X = getHolderList(Z);
            W = X.menu;
            V = W.spot;
            setStyle(V, "backgroundColor", S);
            if(W.id == "textColorMenu"){
                cellformat2range("foreColor", S);
            }
            else if(W.id == "backgroundColorMenu"){
                cellformat2range("bk_color", S);
            }
            break;
        case "colorheader" : 
            exceptMenu(null);
            X = getParent(Z);
            W = X.menu;
            V = W.spot;
            if(W.id == "textColorMenu"){
                setStyle(V, "backgroundColor", "black");
                cellformat2range("foreColor", "black");
            }
            else if(W.id == "backgroundColorMenu"){
                setStyle(V, "backgroundColor", "white");
                cellformat2range("bk_color", "");
            }
            break;
        default : 
            break;
    }
}
function mouseUpDocument(){
    if(filterDocument(window.event))
        return;
    if(filterLink(window.event))
        return true;
    window.event.cancelBubble = true;
    var Z = window.event.srcElement;
    if(Z == null)
        return false;
    if(eventInComboBox(event) && (Z.hasFocus == 0)){
        if(getVisible(Z.menu.list)){
            toggleMenu(Z.menu.list);
            MenuToggle(Z.menu, 1);
        }
        Z.hasFocus = 1;
        Z.select();
        return;
    }
    if(Z.id == "entry"){
        setTimeout("SaveTextRange()", 50);
        return;
    }
    Z = ContentsToCell(Z);
    switch(gTracking){
        case "none" : 
        case "button" : 
            HandleTracking(Z);
            break;
        case "adjust" : 
            HandleAdjust(Z);
            break;
        case "select" : 
            fetchEntry();
            break;
        case "rangeInsertion" : 
            gSelection.collapse(false);
            gSelection.select();
            break;
        default : 
            break;
    }
    gTracking = "none";
    if((Z.className == "cell") || (Z.className == "head")){
        var Y = getClipSrcWind().gClipboardKind;
        if((Y == "format") || (Y == "stickyFormat"))
            Paste();
    }
    if((Z.className == "cell" || Z.className == "head") && event.button == 2){
        showContextual();
    }
    return false;
}
function selectStartDocument(){
    if(filterDocument(window.event))
        return;
    var Z = window.event.srcElement;
    if((Z.id == "entry") || (Z.className == "comboBox"))
        return;
    window.event.cancelBubble = true;
    return false;
}
function documentSingleClick(){
    if(filterDocument(window.event))
        return;
    window.event.cancelBubble = true;
}
function documentDoubleClick(){
    if(filterDocument(window.event))
        return;
    if(filterLink(window.event))
        return true;
    window.event.cancelBubble = true;
    var Z = window.event.srcElement;
    if(Z == null)
        return;
    if(Z.id == "btnOverride"){
        resetButton(Z, true);
        flipEntry("default");
        gBtnOverrideSticky = true;
        return;
    }
    if(Z.id == "format"){
        gClipboardKind = "stickyFormat";
        if(toggleButton(Z))
            ClipboardAction();
    }
    var Y = getClass(Z);
    if((Y != "rowResizer") && (Y != "columnResizer"))
        return;
    if(Y == "columnResizer"){
        Z = gCellElemMatrix[0][Z.m_name.match(/\d+/)[0]];
    }
    else{
        Z = gCellElemMatrix[Z.m_name.match(/\d+/)[0]][0];
    }
    var X = Z.m_name;
    var W = name2row(X);
    var V = name2column(X);
    if((W == 0) && (V > 0)){
        AutofitColumn(V);
    }
    else if((V == 0) && (W > 0)){
        AutofitRow(W);
    }
}
function BuildCellMatrix(){
    var Z = 0;
    gColumnResizers = new Array();
    for(var Y = 1; Y < gColumnCount; Y ++ ){
        gColumnResizers[Y] = getElement("tempColResizerID_" + Z ++ );
        setExtra(gColumnResizers[Y], "m_name", Y + "colResizer");
    }
    var X = 0;
    gRowResizers = new Array();
    var W;
    for(W = 1; W < gRowCount; W ++ ){
        gRowResizers[W] = getElement("tempRowResizerID_" + X ++ );
        setExtra(gRowResizers[W], "m_name", W + "rowResizer");
    }
    gCellElemMatrix = new Array();
    W = 0;
    BuildSomeRows(W);
}
function BuildSomeRows(Z){
    if(Z < gRowCount){
        var Y = 0.05;
        var X = Z + 20;
        while((Z < X) && (Z < gRowCount)){
            var W = getElement("row" + Z).children;
            var V = gCellElemMatrix[Z] = new Array();
            var U = 0;
            for(var T = 0; T < gColumnCount; T ++ ){
                setExtra((V[T] = W[U ++ ]), "m_name", index2name(Z, T, 0));
            }
            Z ++ ;
        }
        Y = 0.05 + (Z / gRowCount * 0.15);
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad1a"), Y);
        setTimeout("BuildSomeRows(" + Z + ", " + U + ")", 0);
    }
    else{
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad1b"), 0.30);
        setTimeout("documentLoad2()", 0);
    }
}
function Accept2DSort(Z){
    closeModal();
    gSortByIndex = getValue(columnRowEntry);
    if(isNaN(gSortByIndex)){
        gSortByIndex = ColumnLetterToColumnIndex(gSortByIndex);
        gSortDirection = "vertical";
    }
    else{
        gSortDirection = "horizontal";
    }
    gSortInProgress = true;
    openModal('sortwait', getString("strSort"), "", "", "closeModal()", [{
        type : 'raw',
        value : getString("strSortInProgress") + "..."
    }], null, null);
    setTimeout("Sort('" + Z + "')", 0);
}
function Validate2DSort(){
    var Z = findSelect(false);
    var Y = getValue(columnRowEntry);
    if(isNaN(Y)){
        Y = ColumnLetterToColumnIndex(Y);
        if((Y < Z.columnMin) || (Y > Z.columnMax))
            return getString("strInvalidEntry");
    }
    else if(((Y < Z.rowMin) || (Y > Z.rowMax)) || (Y == null)){
        return getString("strInvalidEntry");
    }
    return false;
}
function SortWrapper(Z){
    var Y = findSelect(true);
    if((Y.rowMin < Y.rowMax) && (Y.columnMin < Y.columnMax)){
        var X = ColumnIndexToColumnLetter(Y.columnMin);
        var W = getString("strSortHelpCmp", kDefaultLocale, ColumnIndexToColumnLetter(Y.columnMin), ColumnIndexToColumnLetter(Y.columnMax), Y.rowMin, Y.rowMax);
        var V = [{
            type : 'raw', value : W
        }, 
        {
            type : 'input',
            id : 'columnRowEntry',
            label : '',
            value : X,
            size : 40,
            maxlength : 200
        }];
        var U = [{
            type : 'accept', value : getString("strSort")
        }, 
        {
            type : 'cancel'
        }];
        var T = (Z == "ascending" ? getString("strAscendingSmall") : getString("strDescendingSmall"));
        openModal('sort', getString("strSortOrderCmp", kDefaultLocale, T), "Validate2DSort()", "Accept2DSort('" + Z + "')", "closeModal()", V, U, "columnRowEntry");
    }
    else if(Y.rowMin < Y.rowMax){
        gSortByIndex = Y.columnMax;
        gSortDirection = "vertical";
        gSortInProgress = true;
        openModal('sortwait', getString("strSort"), "", "", "closeModal()", [{
            type : 'raw',
            value : getString("strSortInProgress") + "..."
        }], null, null);
        setTimeout("Sort('" + Z + "')", 0);
    }
    else if(Y.columnMin < Y.columnMax){
        gSortByIndex = Y.rowMax;
        gSortDirection = "horizontal";
        gSortInProgress = true;
        openModal('sortwait', getString("strSort"), "", "", "closeModal()", [{
            type : 'raw',
            value : getString("strSortInProgress") + "..."
        }], null, null);
        setTimeout("Sort('" + Z + "')", 0);
    }
    else{
        return null;
    }
}
function Sort(Z){
    var Y = findSelect(true);
    var X;
    var W;
    if(gSortDirection == "vertical"){
        var V,
        U;
        for(V = Y.rowMin; V <= Y.rowMax; V ++ ){
            U = V;
            for(W = V + 1; W <= Y.rowMax; W ++ ){
                if(SortComparator(_cel(index2cell(W, gSortByIndex, 0).m_name), _cel(index2cell(U, gSortByIndex, 0).m_name), Z))
                    U = W;
            }
            for(X = Y.columnMin; X <= Y.columnMax; X ++ ){
                MoveCell(V, X ,- X ,- V, "copy", false, true);
                MoveCell(U, X, 0, V - U, "copy", true, true);
                MoveCell(0, 0, X, U, "copy", false, true);
                var T = getClipSrcWind().index2cell(U, X, gCurrSheetIndex);
                if(T && T.cellData && T.cellData.entry){
                    var S = AdjustCellEntryReferences(T.cellData.entry, 0, U - V, false, false);
                    S = S.replace(/\t/g, "");
                    buildCell(T, S);
                }
            }
        }
    }
    else if(gSortDirection == "horizontal"){
        var R,
        Q;
        for(R = Y.columnMin; R <= Y.columnMax; R ++ ){
            Q = R;
            for(X = R + 1; X <= Y.columnMax; X ++ ){
                if(SortComparator(_cel(index2cell(gSortByIndex, X, 0).m_name), _cel(index2cell(gSortByIndex, Q, 0).m_name), Z))
                    Q = X;
            }
            for(W = Y.rowMin; W <= Y.rowMax; W ++ ){
                MoveCell(W, R ,- R ,- W, "copy", false, true);
                MoveCell(W, Q, R - Q, 0, "copy", true, true);
                MoveCell(0, 0, Q, W, "copy", false, true);
            }
        }
    }
    closeModal();
    gSortInProgress = false;
    ClearRange(0, 0, 0, 0, true, true);
    setStyle(index2cell(0, 0, 0), "backgroundColor", "whitesmoke");
}
function SortComparator(Z, Y, X){
    if(Z == null && Y == null)
        return kEquivalent;
    else if(Z != null && Y == null)
        return(X == "ascending") ? kAbeforeB : kBbeforeA;
    else if(Z == null && Y != null)
        return(X == "ascending") ? kBbeforeA : kAbeforeB;
    var W = typeof(Z);
    var V = typeof(Y);
    if(W != "number" && V != "number"){
        if(W != "string")
            Z = Z.toString();
        if(V != "string")
            Y = Y.toString();
        var U = Z.localeCompare(Y);
        if(U ==- 1)
            return(X == "ascending") ? kAbeforeB : kBbeforeA;
        else if(U == 0)
            return kEquivalent;
        else if(U == 1)
            return(X == "ascending") ? kBbeforeA : kAbeforeB;
    }
    else if(W == "number" && V == "number"){
        if((Z - Y) < 0)
            return(X == "ascending") ? kAbeforeB : kBbeforeA;
        else if((Z - Y) == 0)
            return kEquivalent;
        else if((Z - Y) > 0)
            return(X == "ascending") ? kBbeforeA : kAbeforeB;
    }
    else if(W == "number" && V != "number"){
        return(X == "ascending") ? kAbeforeB : kBbeforeA;
    }
    else if(W != "number" && V == "number"){
        return(X == "ascending") ? kBbeforeA : kAbeforeB;
    }
}
function documentGenerate(){
    var Z;
    var Y;
    var X;
    var W;
    gColWidths = new Array(gColumnCount);
    for(Y = 0; Y < gColumnCount; Y ++ )
        gColWidths[Y] = kColumnSize;
    gRowHeights = new Array(gRowCount);
    for(Y = 0; Y < gRowCount; Y ++ )
        gRowHeights[Y] = kRowSize;
    GetColumnWidthsAndHeights(gColWidths, gRowHeights);
    var V = 0;
    for(Y = 0; Y < gRowCount; Y ++ )
        V += gRowHeights[Y];
    var U = 0;
    for(Y = 0; Y < gColumnCount; Y ++ )
        U += gColWidths[Y];
    var T = V + (kGutterHeight * 2) + 1;
    var S = U + (kGutterWidth * 2) + 1;
    var R = new Array();
    R.push("<span class='book' id='book' style='" + "top: 0; left: 0; " + "height: " + T + "; width: " + S + ";'>");
    for(var Q = 0; Q < gSheetCount; Q ++ ){
        var P = kGutterHeight;
        var O = kGutterWidth;
        T = V + 1;
        S = U + 1;
        R.push("<span class='sheet' id='sheet" + Q + "' style='" + "top: " + P + "; left: " + O + "; height: " + T + "; width: " + S + ";'>");
        P = 0;
        for(W = 0; W < gRowCount; W ++ ){
            O = 0;
            T = gRowHeights[W];
            var N = new Array();
            N.push("<span id='row" + W + "' style='position:absolute; z-index:-2; clip: rect(0px " + (U + 1) + "px " + T + "px 0px); left:0; height:" + T + "; width:" + (U + 1) + "; top:" + P + ";'>\n");
            for(X = 0; X < gColumnCount; X ++ ){
                gTempCellID ++ ;
                var M = "cell";
                var L = "";
                var K = "";
                if((W == 0) || (X == 0)){
                    M = "head";
                    if((W == 0) && (X == 0)){
                        L = "";
                    }
                    else if(W == 0){
                        L = ColumnIndexToColumnLetter(X);
                    }
                    else if(X == 0){
                        L = W + "";
                    }
                }
                else{
                    var J = InCellDataArray(W, X);
                    if(J && J.i_nr){
                        var I = HTMLEncode(J.i_nr);
                        if( ! J._wrapText){
                            L = "<SPAN style='position:absolute; left:0;'><NOBR>" + I + "</NOBR></SPAN>";
                            K = "overflow:visible;";
                        }
                        else{
                            L = I;
                            K = "overflow:hidden;";
                        }
                        K += " z-index: -1;";
                    }
                }
                S = gColWidths[X];
                N.push("<span class='" + M + "' onselectstart='return false' style='position:absolute; top:0; left:" + O + ";height:" + T + ";width:" + S + ";" + K + "'>" + L + "</span>\n");
                O += S;
            }
            P += gRowHeights[W];
            N.push("</span>\n");
            R.push(N.join(""))
        }
        P = 0;
        O = 66 + gColWidths[1];
        for(X = 1; X < gColumnCount; X ++ ){
            Z = "tempColResizerID_" + gTempColResizerID ++ ;
            R.push("<span class='columnResizer' id='" + Z + "' style='top: " + P + "; left: " + O + ";'></span>");
            S = gColWidths[X + 1];
            O += S;
        }
        P = 16 + gRowHeights[1];
        O = 0;
        for(W = 1; W < gRowCount; W ++ ){
            Z = "tempRowResizerID_" + gTempRowResizerID ++ ;
            R.push("<span class='rowResizer' id='" + Z + "' style='top: " + P + "; left: " + O + ";'></span>");
            T = gRowHeights[W + 1];
            P += T;
        }
        R.push("<span class=rect id=rect" + Q + "></span>");
        R.push("<span class=text id=text" + Q + "></span>");
        R.push("</span>");
    }
    R.push("<span class='cutcopyrect' id='cutcopyrecttop'></span>");
    R.push("<span class='cutcopyrect' id='cutcopyrectbottom'></span>");
    R.push("<span class='cutcopyrect' id='cutcopyrectleft'></span>");
    R.push("<span class='cutcopyrect' id='cutcopyrectright'></span>");
    R.push("<textarea id='clipboardPrep' style='visibility:hidden;'></textarea>");
    R.push(GenerateContextualMenu());
    R.push("</span>");
    gDocument.all.view.innerHTML = R.join("");
}
function SaveTextRange() {
	if(gDocument.selection != undefined)
    gSelection = gDocument.selection.createRange();
}
function GoodPlace2InsertRange(){
    if( ! EnteringAnEquation())
        return false;
    if(gRangeInsertionInProgress)
        return true;
    if(gSelection == null)
        return false;
    var Z = adjacentCharacter("before");
    if(Z == "")
        return false;
    return(Z.search(/\w/) ==- 1);
}
function EndRangeInsertion(){
    if(gRangeInsertionInProgress){
        gRangeInsertionInProgress = false;
        ClipboardDeselected();
    }
}
function EnteringAnEquation(){
    return getElement("entry").innerText.charAt(0) == "=";
}
function AutoSum(){
    if(window.event.ctrlKey){
        RecoverOldStyleMacros();
        RecompileMacros();
        RebuildAllCells(1);
        return;
    }
    var Z = cell2row(gSelectPrime);
    var Y = cell2column(gSelectPrime);
    var X = ColumnIndexToColumnLetter(Y);
    var W = "";
    var V = cellAbove(gSelectPrime);
    var U = cellToLeft(gSelectPrime);
    if((cell2row(V) != 0) && (V.cellData) && ( ! isNaN(V.cellData.derived))){
        var T = Z - 1;
        var S = Z;
        while((cell2row(V) != 0) && (V.cellData) && ( ! isNaN(V.cellData.derived))){
            V = cellAbove(V);
            S -- ;
        }
        ShowAutoSumSelection(index2cell(S, Y, 0), index2cell(T, Y, 0));
        W = X + S + ":" + X + T;
    }
    else if((cell2column(U) != 0) && (U.cellData) && ( ! isNaN(U.cellData.derived))){
        var R = Y - 1;
        var Q = Y;
        while((cell2column(U) != 0) && (U.cellData) && ( ! isNaN(U.cellData.derived))){
            U = cellToLeft(U);
            Q -- ;
        }
        ShowAutoSumSelection(index2cell(Z, Q, 0), index2cell(Z, R, 0));
        W = ColumnIndexToColumnLetter(Q) + Z + ":" + ColumnIndexToColumnLetter(R) + Z;
    }
    gClipboardKind = "range";
    gRangeInsertionInProgress = true;
    var P = getElement('entry');
    setValue(P, "=sum(" + W + ")");
    var O = P.createTextRange();
    if(W == ""){
        O.findText("()");
        O.moveStart("character", 1);
        O.moveEnd("character" ,- 1);
    }
    else{
        O.findText(W);
    }
    O.select();
    SaveTextRange();
    gLastRangeStringLength = W.length;
    gSelection.collapse(false);
}
function ShowAutoSumSelection(Z, Y){
    gRangePrime = Z;
    gRangeFinal = Y;
    DrawClipboardRect("range");
}
function UploadExcelFile(){
    var Z = window.open(kRootUrl + gImportExcelScript + '?source=app', "_blank", 'scrollbars=no,resizable=yes,status=no');
}
function DownloadExcelFile(Z){
    var Y = gAppDescription;
    Y = Y.replace(/\W/g, "_");
    if(Y.length > 25)
        Y = Y.substring(0, 25);
    var X = kRootUrl + gExportExcelScript;
    var W = "";
    if( ! gIsMatterhorn)
        W = '/' + Y + '.htm%6C';
    var V = X + W + '?source=app&id=' + escape(Z);
    if(gIsMatterhorn && is.ie55 && is.ieMinorVersion("sp1"))
        V = V + "&ie55sp1=true";
    window.frames.bugFrame.location = V;
}
function doExcelPut(Z){
    cancelEntryFieldRefocus();
    noBubble();
    UploadExcelFile();
}
function doExcelGet(Z){
    noBubble();
    if(Z == null){
        if(gAppId == null)
            return;
        Z = gAppId;
    }
    if(Z == "" || gSpreadsheetDirty){
        hb_alert(getString("strSaveBeforeExcel"), getString("strExportExcel"));
        return;
    }
    DownloadExcelFile(Z);
}
function noBubble(){
    if(typeof window.event != 'undefined')
        window.event.cancelBubble = true;
}
function UpdateRangeString(){
    if(gSelection != null){
        var Z;
        if(gRangePrime == gRangeFinal){
            Z = OldToNewStyle(gRangePrime.m_name);
        }
        else{
            var Y = min(name2column(gRangePrime.m_name), name2column(gRangeFinal.m_name));
            var X = min(name2row(gRangePrime.m_name), name2row(gRangeFinal.m_name));
            var W = max(name2column(gRangePrime.m_name), name2column(gRangeFinal.m_name));
            var V = max(name2row(gRangePrime.m_name), name2row(gRangeFinal.m_name));
            Y = ColumnIndexToColumnLetter(Y);
            W = ColumnIndexToColumnLetter(W);
            Z = Y + X + ":" + W + V;
        }
        gSelection.text = Z;
        gLastRangeStringLength = Z.length;
        gSelection.moveStart("character" ,- gLastRangeStringLength);
        gSelection.select();
        updateEntryHeight();
    }
}
function StartRangeSelect(){
    gRangePrime = gRangeFinal = gSelectPrime;
    gRangeInsertionInProgress = true;
    gClipboardKind = "range";
    gLastRangeStringLength = 0;
}
function initPartnerMenu(){
    setMenu("", "partnerMenu", "partnerList");
    var Z = getElement("partnerMenu");
    var Y = getElement("partnerList");
    Z.style.backgroundPositionX = gPartnerMenu.rolloverOffset *- 24;
    Z.style.backgroundPositionY = 0;
    Z.style.width = gPartnerMenu.width;
    Y.innerHTML = "";
    var X = 0;
    for(var W = 0; W < gPartnerMenu.menuItems.length; W ++ ){
        var V = gPartnerMenu.menuItems[W];
        if(V.label == "separator"){
            Y.innerHTML += "<DIV class=separator style='top:" + X + "';></DIV>";
            X += 4;
        }
        else{
            Y.innerHTML += "<DIV class=largeItem style='top:" + X + "'; id='cmdPartner' name=" + W + ">" + V.label + "</DIV>";
            X += 16;
        }
    }
    Y.style.height = X + 6;
    var U = '<form name="usermenuForm" method="POST" action="/open_partner_xml">' + '<input type="hidden" name="usermenuUrl" value="">' + '<input type="hidden" name="usermenuCommand" value="">' + '<input type="hidden" name="usermenuSelBegRow" value="">' + '<input type="hidden" name="usermenuSelBegCol" value="">' + '<input type="hidden" name="usermenuSelEndRow" value="">' + '<input type="hidden" name="usermenuSelEndCol" value="">' + '<input type="hidden" name="usermenuCellData" value="">' + '</form>';
    gDocument.body.insertAdjacentHTML('beforeEnd', U);
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
        id : 'cmdPasteSpecial',
        str : 'strPasteValues'
    }, 
    {
        id : 'cmdClear',
        str : 'strClear'
    }, 
    {
        id : 'separator'
    }, 
    {
        id : 'cmdRevert',
        str : 'strRevert',
        notInBlox : 1
    }, 
    {
        id : 'separator',
        notInBlox : 1
    }, 
    {
        id : 'cmdFillDown',
        str : 'strFillDown'
    }, 
    {
        id : 'cmdFillRight',
        str : 'strFillRight'
    }, 
    {
        id : 'separator'
    }, 
    {
        id : 'cmdInsertRow',
        str : 'strInsertRow'
    }, 
    {
        id : 'cmdInsertColumn',
        str : 'strInsertColumn'
    }, 
    {
        id : 'cmdDeleteRow',
        str : 'strDeleteRow'
    }, 
    {
        id : 'cmdDeleteColumn',
        str : 'strDeleteColumn'
    }, 
    {
        id : 'separator'
    }, 
    {
        id : 'cmdRowHeight',
        str : 'strRowHeight'
    }, 
    {
        id : 'cmdColumnWidth',
        str : 'strColumnWidth'
    }];
    return makeContextualMenu(Z, "onmousedown = 'clickContext();' onmouseup = 'clickContext();' onlosecapture  = 'handleContextLoseCapture();'");
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();