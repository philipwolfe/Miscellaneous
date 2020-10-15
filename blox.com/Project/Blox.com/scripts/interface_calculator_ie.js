//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gEditCell = null;
var gEditDirty = false;
var gEntryTimer = null;
function cl_dirty(Z){
    storeEdit();
    return gSpreadsheetDirty && (window.location.href.search(/savePrompt=0/i) ==- 1);
}
function doEditBinding(Z){
    boundEdit();
    fetchEdit(Z);
}
function startEdit(Z){
    gEditCell = index2cell(0, 0, 0);
    findFirstEdit();
    doEditBinding(Z);
}
function saveEdit(Z){
    storeEdit();
    fetchEdit();
}
function pressEdit(Z, Y, X){
    if(gEntryTimer)
        return;
    storeEdit();
    shiftEdit(Z, Y, X ? X : false);
    doEditBinding();
}
function clickEdit(Z){
    if(Z == gEditCell)
        return true;
    if( ! allowEdit(Z))
        return false;
    storeEdit();
    gEditCell = Z;
    doEditBinding();
    return true;
}
function refreshEdit(Z){
    if(Z == gEditCell){
        gEditCell = null;
        clickEdit(Z);
    }
}
function findFirstEdit(){
    for(var Z = 1; Z < gRowCount; Z ++ ){
        for(var Y = 1; Y < gColumnCount; Y ++ ){
            var X = index2cell(Z, Y, 0);
            if(allowEdit(X)){
                gEditCell = X;
                setVisible(edit, true);
                return;
            }
        }
    }
    gEditCell = null;
    setVisible(edit, false);
}
function shiftEdit(Z, Y, X){
    if(gEditCell == null)
        return;
    var W = cell2row(gEditCell);
    var V = cell2column(gEditCell);
    var U = (X ? (gColumnCount * gRowCount) : max(gColumnCount, gRowCount)) + 1;
    for(var T = 0; T < U; T ++ ){
        W += Z;
        V += Y;
        if(W < 1){
            if(X){ -- V;
                if(V < 1)
                    V = gColumnCount - 1;
            }
            W = gRowCount - 1;
        }
        else if(W >= gRowCount){
            if(X){ ++ V;
                if(V >= gColumnCount)
                    V = 1;
            }
            W = 1;
        }
        if(V < 1){
            if(X){ -- W;
                if(W < 1)
                    W = gRowCount - 1;
            }
            V = gColumnCount - 1;
        }
        else if(V >= gColumnCount){
            if(X){ ++ W;
                if(W >= gRowCount)
                    W = 1;
            }
            V = 1;
        }
        var S = index2cell(W, V, 0);
        if(allowEdit(S)){
            gEditCell = S;
            return;
        }
    };
}
function nextEdit(Z){}
function getEditBounds(){
    return(gEditCell ? getBounds(gEditCell) : null);
}
function showEdit(Z){
    var Y = getElement("edit");
    if(Y && ( ! Z || gEditCell))
        setVisible(Y, Z);
}
function boundEdit(){
    if(gEditCell == null)
        return;
    var Z = edit;
    var Y = getBounds(gEditCell);
    Y.width = gColWidths[name2column(gEditCell.m_name)];
    Y.height = gRowHeights[name2row(gEditCell.m_name)];
    Y.height += 2;
    Y.width += 2;
    Y.left -= 1;
    setBounds(Z, Y);
    setValue(Z, "");
    setDisplay(Z, true);
}
function fetchEdit(Z){
    var Y = Z ? 'true' : 'false';
    gEntryTimer = killTimeout(gEntryTimer);
    gEntryTimer = setTimeout("timerEdit(" + Y + ");", 0);
}
function timerEdit(Z){
    gEntryTimer = killTimeout(gEntryTimer);
    if(gEditCell == null)
        return;
    var Y = edit;
    var X = isOverrideEnabled(gEditCell.cellData);
    value = getStyle(gEditCell, "fontFamily");
    if(emptyString(value)){
        var W = getDefaultFont();
        value = getFontFamily(W);
    }
    setStyle(Y, "fontFamily", value);
    var V = getStyle(gEditCell, "fontWeight");
    if(V != "bold")
        V = "normal";
    setStyle(Y, "fontWeight", V);
    V = getStyle(gEditCell, "fontStyle");
    if(V != "italic")
        V = "normal";
    setStyle(Y, "fontStyle", V);
    V = getStyle(gEditCell, "fontSize");
    if(emptyString(V))
        V = "10pt";
    setStyle(Y, "fontSize", V);
    V = getStyle(gEditCell, "textAlign");
    if(emptyString(V))
        V = "right";
    setStyle(Y, "textAlign", V);
    setBackgroundImage(Y, X ? kRootUrl + kImageDirectory + "app/badge_override_" + (((getCellOverride(gEditCell.cellData) == null) || getCellOverride(gEditCell.cellData) == getCellOriginalValue(gEditCell.cellData)) ? "off" : "on") + ".gif" : "none");
    if(X){
        V = getCellOverrideFormatted(gEditCell.cellData);
    }
    else if((gEditCell.cellData) && ( ! gEditCell.cellData.m_backgroundImage)){
        hideRevertButton();
        if(gEditCell.cellData.entry && equalString(gEditCell.cellData.entry))
            V = (gEditCell.style.inner != null) ? gEditCell.style.inner : "";
        else
            V = gEditCell.cellData.entry;
    }
    else{
        V = "";
        hideRevertButton();
    }
    if(emptyString(V))
        V = "";
    setValue(Y, V);
    platformBuildInput(Y);
    if( ! Z)
        focusEdit();
    gEditDirty = false;
}
function storeEdit(){
    if( ! gEditCell ||! gEditCell.cellData)
        return;
    if(gEntryTimer)
        return;
    var Z = edit;
    var Y = gEditCell.cellData.entry;
    var X = isOverrideEnabled(gEditCell.cellData);
    if(X){
        Y = getCellOverride(gEditCell.cellData);
    }
    else if( ! gEditDirty && (Y != null) && equalString(Y))
        Y = (gEditCell.style.inner != null) ? gEditCell.style.inner : "";
    var W = getValue(Z);
    var V = /\s+/g;
    if(W.replace(V, "").indexOf("=") == 0){
        hb_alert(getString("strFormulaInCalcMode"), getString("strFormulaError"));
        W = Y;
    }
    gEditDirty = false;
    if(X){
        var U = {};
        if(floatString(W, U, false, gEntryLocale))
            W = U["value"];
        if(W != gEditCell.cellData.derived){
            setCellOverride(gEditCell.cellData, W);
            pulseCell(gEditCell);
        }
        else{
            return;
        }
    }
    else{
        if((W + "") == (Y + ""))
            return;
        if(emptyString(W) && emptyString(Y))
            return;
        gEditCell.cellData.entry = W;
        entryCell(gEditCell.cellData, Y);
    }
    gSpreadsheetDirty = true;
}
function touchEdit(){
    if(gEntryTimer != null)
        timerEdit();
    gEditDirty = true;
}
var gFocusTimer = null;
function focusEdit(){
    var Z = edit;;
    if( ! getDisplay(Z) ||! getVisible(Z))
        return;
    Z.focus();
    Z.select();
}
function allowEdit(Z){
    if( ! Z.cellData)
        return false;
    if(Z.cellData.hidden == "true")
        return false;
    if(Z.cellData.dynamic && ((Z.cellData.dynamic.indexOf("__menu") !=- 1) || (Z.cellData.dynamic.indexOf("__button") !=- 1)))
        return false;
    if(Z.cellData.m_locked == "false")
        return true;
    return false;
}
function RateSheet(Z){
    var Y = kRootUrl + gRatingScript + '?id=' + Z;
    var X = bestWindowSize(470, 370);
    var W = window.open(Y, "rateWin", 'width=' + X.width + ',height=' + X.height + ',resizable,scrollbars');
    W.focus();
}
function hideRevertButton(){}
function showRevertButton(){}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();