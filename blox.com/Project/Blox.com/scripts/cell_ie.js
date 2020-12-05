//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gRecalcDirty = new Object();
function entryCell(Z, Y, X){
    var W = Z.entry;
    var V = new Object();
    delete Z.dynamic;
    Z.m_refersTo = null;
    if( ! X)
        setToolTip(Z.m_div, W);
    if(floatString(W, V, false, gEntryLocale)){
        if(V.value){
            Z.entry = localizedValue(V.value, gAppLocale);
            Z.dynamic = V.value.toString();
            if( ! X)
                setToolTip(Z.m_div, W);
        }
        else{
            var U = compiler(W, Z.m_div.m_name);
            if(U.error == null)
                Z.dynamic = U.canon;
        }
    }
    else if(dateString(W, V, gEntryLocale)){
        Z.entry = localizedDate(V.timeValue, V.format, gAppLocale);
        setToolTip(Z.m_div, Z.entry);
        Z.dynamic = V.timeValue.toString();
    }
    else if(urlString(W, V)){
        Z.dynamic = V.dynamic;
        if( ! X)
            setToolTip(Z.m_div, V.url);
    }
    pulseCell(Z.m_div, Y, null, 1, X);
}
function overrideFormat(Z, Y){
    if(Z.cellData && Z.cellData._viewFormat){
        if(Y == null || Y == "general")
            return false;
        var X = Z.cellData._viewFormat;
        if(X == null || Y == "custom")
            return true;
        if(X == "custom")
            return false;
        var W,
        V,
        U;
        if(Y == "number"){
            U = Y;
        }
        else{
            W = getFormat(Y, gAppLocale);
            if(W == null){
                U = "general";
            }
            else{
                U = W.type;
            }
        }
        if(X == "number" || X == "general"){
            V = X;
        }
        else{
            W = getFormat(X, gAppLocale);
            if(W == null){
                V = "general";
            }
            else{
                V = W.type;
            }
        }
        if(V == U)
            return false;
        switch(U){
            case "number" : 
                return ! (V == "percentage" || V == "currency");
                break;
            case "currency" : 
                return true;
                break;
            case "percentage" : 
                return true;
                break;
            case "dateTime" : 
                return ! (V == "longDate" || V == "shortDate" || V == "time");
                break;
            case "longDate" : 
                return ! (V == "shortDate" || V == "dateTime");
                break;
            case "shortDate" : 
                return ! (V == "longDate" || V == "dateTime");
                break;
            case "time" : 
                return ! (V == "dateTime");
                break;
            default : 
                break;
        }
    }
    return true;
}
function setFormat(Z, Y){
    if(Y == null)
        Y = 'general';
    if(Y == "general"){
        delete Z.cellData.viewFormat;
    }
    else{
        Z.cellData.viewFormat = Y;
    }
    if(Z.cellData._viewFormat && overrideFormat(Z, Y)){
        delete Z.cellData._viewFormat;
    }
}
function buildCell(Z, Y){
    var X = Z.cellData;
    Y = Y.replace(/&gt;/g, '>');
    Y = Y.replace(/&lt;/g, '<');
    if(X.entry){
        var W = X.entry.match(/\t/g);;
    }
    if((Z.className == "head") && ((cell2column(Z) != 0) && (cell2row(Z) != 0)))
        return;
    var V = X.entry;
    X.entry = Y;
    unrefCell(Z);
    delete X.m_dirtyOnInit;
    var U = Z.m_name;
    var T = new Object();
    var S = null;
    var R = null;
    delete X.dynamic;
    if(X.m_cellGUI){
        delete X.m_cellGUI;
        setInner(Z, "");
    }
    if(X.dataObject)
        delete X.dataObject;
    X.m_refersTo = null;
    setToolTip(Z, Y);
    if(quoteString(Y)){
        setToolTip(Z, Y.substring(1, Y.length));
        R = "left";
    }
    else if(equalString(Y)){
        S = compiler(Y.substring(1, Y.length), U);
        if(S.error == null){
            X.dynamic = S.canon;
            X.entry = "=" + S.text;
            X.m_refersTo = S.refer;
            if(S.formatHint)
                setFormat(Z, S.formatHint);
            if(S.alignHint)
                R = S.alignHint;
        }
        else{
            X.dynamic = S.force;
            setToolTip(Z, S.error.tooltip ? S.error.tooltip : getString("strUnknownErrorSmall"));
            X.derived = S.error.error ? S.error.error : "[" + getString("strErrorSmall") + "]";
        }
    }
    else if(floatString(Y, T, false, gEntryLocale)){
        if(T.value){
            X.entry = localizedValue(T.value, gAppLocale);
            X.dynamic = T.value.toString();
            setToolTip(Z, X.entry);
            setFormat(Z, T.format);
            R = "right";
        }
        else{
            S = compiler(Y, U);
            if(S.error == null)
                X.dynamic = S.canon;
        }
    }
    else if(dateString(Y, T, gEntryLocale)){
        X.entry = localizedDate(T.timeValue, T.format, gAppLocale);
        setToolTip(Z, X.entry);
        X.dynamic = T.timeValue.toString();
        setFormat(Z, T.format);
        R = "right";
    }
    else if(urlString(Y, T)){
        X.dynamic = T.dynamic;
        setToolTip(Z, T.url);
        X.m_dirtyOnInit = true;
        R = "left";
    }
    else{
        R = "left";
    }
    if((R != null) && (X._textAlign == null))
        setExtra(X, "textAlign", R);
    else
        delete X.textAlign;
    if(S && S.dirtyOnInit)
        X.m_dirtyOnInit = S.dirtyOnInit;
    referCell(Z);
    pulseCell(Z, V);
}
function RebuildCell(Z){
    var Y = Z.cellData;
    var X = getExtraDefault(Y, "entry", "");
    X = X.replace(/\t/g, "");
    buildCell(Z, X);
    if( ! autoConvert)
        dirtyCell(Z);
}
function IsErrorCell(Z){
    if(Z.entry == null)
        return false;
    if(equalString(Z.entry)){
        if(Z.i_nr != null && Z.i_nr.charAt(0) == "#"){
            return true;
        }
    }
    return false;
}
var gFixRefs = false;
function RebuildSelectedCells(Z, Y){
    var X = 0.5;
    var W = (gEntryLocale != gAppLocale);
    if((gCellDataArray) && (Z < gCellDataArray.length)){
        var V = Z + (is.ie5up ? 40 : 20);
        while((Z < V) && (Z < gCellDataArray.length)){
            var U = gCellDataArray[Z];
            adjustCustomFormatLocale(U, gEntryLocale);
            if(typeof(U.rebuild) != 'undefined' || (W && U.entry &&! equalString(U.entry)) || IsErrorCell(U)){
                delete U.rebuild;
                RebuildCell(U.m_div);
                gFixRefs = true;
            }
            Z ++ ;
        }
        X = 0.8 + (Z / gCellDataArray.length * .10);
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad5a"), X);
        setTimeout("RebuildSelectedCells(" + Z + ",'" + Y + "')", 0);
    }
    else{
        if(gFixRefs)
            for(var T = 0; T < gCellDataArray.length; T ++ )
                referCell(gCellDataArray[T].m_div, true);
        hb_progress(getString("strLoadingCmp", kDefaultLocale, gSpreadsheetName), getLoadingString("strSpreadsheetLoad5b"), 0.95);
        setTimeout(Y, 0);
    }
}
function FixupAllCells(Z){
    for(var Y = 1; Y < gRowCount; ++ Y)
        for(var X = 1; X < gColumnCount; ++ X)
            FixupCell(gCellElemMatrix[Y][X], "true");
}
function FixupCell(Z, Y){
    if( ! Z ||! Z.cellData)
        return;
    var X = Z.cellData;
    var W = "";
    if(X._widthClue){
        W = X._widthClue + "";
        delete(X._widthClue);
    }
    if((X._wrapText) || (Z.innerHTML == null) || (Z.innerHTML == ""))
        return;
    var V = getChild(Z, "SPAN");
    var U;
    if(V && (V.offsetWidth != 0)){
        U = V.offsetWidth;
        if(is.ie4){
            var T;
            if(T = getChild(V, "NOBR"))
                if(T.offsetWidth > U)
                    U = T.offsetWidth;
        }
    }
    else if((Z.offsetWidth == 0) && (W != "")){
        U = parseInt(W);
        dirtyCell(Z);
    }
    else{
        U = Z.offsetWidth - 4;
        if(U < 0)
            U = 1;
    }
    var S = forceNumber(Z.style.width);
    if((Z.cellData.m_cellGUI) && ((Z.cellData.m_cellGUI.type == "menu")))
        S -= 15;
    if(U == 0){
        U = S - 4;
    }
    if(U <= S - 4){
        if(Y && (Y == "true"))
            return;
        U = S - 4;
    }
    var R = 2;
    var Q = X._textAlign;
    if(Q == null)
        Q = X.textAlign;
    if((Q == null) || (Q == "right"))
        R = S - U - 4;
    else if(Q == "center")
        R =- (U - S) / 2;
    if( ! V){
        Z.innerHTML = "<SPAN style='position: absolute; left: " + R + "; width: " + U + ";'>" + Z.innerHTML + "</SPAN>";
        V = getChild(Z, "SPAN");
    }
    if(V){
        if(V.style.width != U)
            V.style.width = U;
        if(V.style.left != R)
            V.style.left = R;
        if(Q)
            V.style.textAlign = Q;
        else
            V.style.textAlign = "right";
    }
    if((U > S - 10) && (Q != "left"))
        X._widthClue = U + "";
    if((Z.cellData.m_cellGUI) && ((Z.cellData.m_cellGUI.type == "menu"))){
        V = getChild(Z, "SPAN");
        if(V){
            var P = getChild(V, "NOBR");
            if(P)
                var O = P.offsetHeight + 4;
        }
        var N = pin(O, kRowMinimum, getHeight(Z));
        var M = getChild(Z, "popupWidgetRect");
        if(M)
            setStyle(M, "height", N);
    }
    if(Z.cellData.dataObject){
        Z.cellData.dataObject.fixupCell(Z);
    }
}
function SetCellText(Z, Y){
    var X = Y ? Y + '' : "";
    if(X == ''){
        setStyle(Z, "zIndex" ,- 2);
        if(Z.style.inner != Y){
            Z.style.inner = Y;
            Z.innerText = "";
            platformFlushElement(Z);
        }
        return;
    }
    var W = false;
    if(Z.cellData.dataObject){
        W = Z.cellData.dataObject.valueIsHtml();
    }
    else{
        var V = X.indexOf('<');
        if(V >- 1)
            W = (X.indexOf('>', V) > 0);
    }
    var U = "";
    if(Z.cellData.m_cellGUI){
        if(Z.cellData.m_cellGUI.type == "menu"){
            var T = getWidth(Z) - kPopupWidgetOffset;
            U = '<DIV id="popupWidget" class="popupWidget" style ="left:' + T + ';"></DIV>';
            U += '<DIV id="popupWidgetRect" class="popupWidgetRect"></DIV>';
            W = true;
        }
    }
    if( ! Z.cellData._wrapText){
        var S;
        if( ! W && (S = getChild(Z, "SPAN"))){
            var R = getChild(S, "NOBR");;
            if(Z.cellData._widthClue){
                delete(Z.cellData._widthClue);
                S.style.width = 1;
            }
            X = X.replace(/&gt;/g, '>');
            X = X.replace(/&lt;/g, '<');
            R.innerText = X;
        }
        else{
            if(Z.cellData.dataObject){
                Z.cellData.dataObject.setCellInnerHtml(Z);
            }
            else{
                X = "<SPAN style='position:absolute; left:0'><NOBR>" + X + "</NOBR><SPAN>";
                setStyle(Z, "overflow", "visible");
                Z.innerHTML = X;
            }
            if(U)
                Z.insertAdjacentHTML("BeforeEnd", U);
        }
    }
    else{
        setStyle(Z, "overflow", "hidden");
        if(W)
            Z.innerHTML = X;
        else{
            X = X.replace(/&gt;/g, '>');
            X = X.replace(/&lt;/g, '<');
            Z.innerText = X;
        }
    }
    setStyle(Z, "zIndex" ,- 1);
    if(Z.style.inner != Y)
        Z.style.inner = Y;
    platformFlushElement(Z);
    FixupCell(Z, "false");
}
function getFontFamily(Z){
    var Y;
    Y = gFontMappings[Z];
    if(typeof(Y) == "undefined"){
        return Z;
    }
    return Y.fontfamily;
}
function getFontFamilyName(Z){
    var Y;
    Y = gFontMappings[Z];
    if(typeof(Y) == "undefined"){
        return Z;
    }
    return Y.fontname;
}
function setCellStyle(Z, Y, X, W){
    setStyle(Z, Y, X);
    if(is.ie4){
        var V = getChild(Z, "SPAN");
        if(V)
            setStyle(V, Y, X);
    }
    if( ! W)
        FixupCell(Z);
    gSpreadsheetDirty = true;
}
function setCellFormat(Z, Y, X, W){
    var V;;
    if( ! Z)
        return;;
    if( ! Z.cellData)
        return;
    Z.cellData[Y] = X;
    V = false;
    if(W)
        V = W;
    switch(Y){
        case "viewFamily" : 
            var U;
            U = getFontFamily(X);
            setCellStyle(Z, "fontFamily", U, true);
            break;
        case "viewSize" : 
            setCellStyle(Z, "fontSize", X, true);
            break;
        case "foreColor" : 
            setCellStyle(Z, "color", X, true);
            break;
        case "bk_color" : 
            setCellStyle(Z, "backgroundColor", X, true);
            break;
        case "_fontWeight" : 
        case "_fontStyle" : 
        case "_textDecoration" : 
        case "_textAlign" : 
            setCellStyle(Z, Y.substring(1, Y.length), X, true);
            break;
        case "_borderTop" : 
        case "_borderLeft" : 
        case "_borderBottom" : 
        case "_borderRight" : 
            setCellStyle(Z, Y.substring(1, Y.length), (X != "none" ? X : ""), true);
            break;
        case "positiveFormat" : 
        case "negativeFormat" : 
        case "vanishedFormat" : 
        case "nonvalueFormat" : 
        case "_viewFormat" : 
            V = true;
            break;
        case "_wrapText" : 
            if( ! ((Z.cellData.m_cellGUI) && (Z.cellData.m_cellGUI.type == "menu"))){
                SetCellText(Z, getInner(Z));
            }
            break;
        default : ;
        break;
}
if( ! V)
    FixupCell(Z);
}
var cdaIndex = 0;
function InCellDataArray(Z, Y){
    if(cdaIndex >= gCellDataArray.length)
        return null;
    var X = gCellDataArray[cdaIndex];
    if(kMode == "design"){
        while(X.m_row == 0 || X.m_col == 0){
            cdaIndex ++ ;
            if(cdaIndex >= gCellDataArray.length)
                return null;
            X = gCellDataArray[cdaIndex];
        }
    };
    if(Z == X.m_row && Y == X.m_col){
        cdaIndex ++ ;
        return X;
    }
    return null;
}
function SetCellWidth(Z, Y){
    setWidth(Z, Y);
    if(Z.className == "cell")
        FixupCell(Z);
}
function smackOffsets(Z){
    if(isNaN(Z.offsetLeft))
        Z.offsetLeft = Z.pageX;
    if(isNaN(Z.offsetWidth) || (Z.offsetWidth == 0)){
        if(Z.style && Z.style.pixelWidth != null)
            Z.offsetWidth = Z.style.pixelWidth;
        else
            Z.offsetWidth = Z.clip.width;
        if(Z.offsetWidth == 0)
            return Z;
    }
}
function FindMouseElement(Z, Y){
    if(getClass(Y) != "cell")
        return Y;
    var X = mapPoint(getPoint(Z), getContext(Y));
    var W,
    V;
    var U = Y.m_name;
    var T,
    S,
    R;
    var Q = name2row(U);
    var P = name2column(U);
    var O;
    var N = 0;
    if((X.x >= Y.offsetLeft) && (X.x <= Y.offsetLeft + Y.offsetWidth)){
        W = P;
    }
    else{
        if(X.x < Y.offsetLeft){
            S = 0;
            R = P - 1;
            T = P - 1;
        }
        else{
            S = P;
            R = gColumnCount - 1;
            T = P;
        }
        var M = gCellElemMatrix[0];
        while(true){
            O = M[T];
            var L = O.offsetLeft; ++ N;
            if(X.x < L){
                if(T <= S){
                    T = S;
                    break;
                }
                R = T;
                T = Math.round(((S + T) / 2) - 0.5);
            }
            else if(X.x >= L + O.offsetWidth){
                if(T >= R){
                    T = R;
                    break;
                }
                S = T;
                T = Math.round((((T + 1) + R) / 2) - 0.5);
            }
            else
                break;
            if(N == 20){
                break;
            }
        }
        W = T;
    }
    V = Q;
    if(W >= gColumnCount)
        W = gColumnCount - 1;
    if(V >= gRowCount)
        V = gRowCount - 1;
    var K = gCellElemMatrix[V][W];
    if(K ==- 1)
        K = Y;
    return K;
}
function ContentsToCell(Z){
    var Y = Z;
    if(Z.className && Z.className == "popupWidget")
        return Z;
    while(Y != null){
        if(Y.className == "cell")
            return Y;
        Y = getParent(Y);
    }
    return Z;
}
function pulseCell(Z, Y, X, W, V){
    if( ! Z.cellData)
        return;
    var U = Z.cellData;
    var T = U.dataObject;
    if( ! V)
        setBackgroundImage(Z, null);
    if(U.m_backgroundImage)
        delete U.m_backgroundImage;
    if(U.entry){
        U.entry = U.entry.replace(/</g, '&lt;');
        U.entry = U.entry.replace(/>/g, '&gt;');
    }
    var S = Z.m_name;
    var R = U.entry;
    var Q = U.dynamic;
    var P = U.derived;
    gRuntime.forceDirty = false;
    var O = null;
    var N = null;
    if(emptyString(Q)){
        if(quoteString(R))
            O = R.substring(1, R.length);
        else
            O = R;
        delete U.derived;
    }
    else{
        var M = X ? X : runtime(Q, S);
        M = normalizeCellValue(M);
        var L = isOverrideEnabled(U);
        var K = isOverridden(U);
        var J;
        if(K){
            J = normalizeCellValue(runtime(Q, S, null, true));
            if(M == J){
                clearOverride(U);
            }
            else{
                setCellOriginalValue(U, J);
            }
        }
        if(T){
            var I = T.getToolTip();
            N = buildTooltip(I, L, J);
        }
        else{
            var H,
            G;
            H = M;
            if(typeof(M) == "number"){
                H = localizedValue(M, gAppLocale);
            }
            G = J;
            if(typeof(J) == "number"){
                G = localizedValue(J, gAppLocale);
            }
            N = buildTooltip(H, L, G);
        }
        if(L){
            var F = (K && M != J) ? "badge_override_on.gif" : "badge_override_off.gif";
            setBackgroundImage(Z, kRootUrl + kImageDirectory + "app/" + F);
        }
        if(typeof M != "object" && U.m_cellGUI && (U.m_cellGUI.type == "menu")){
            delete U.m_cellGUI;
            Z.innerHTML = "";
        }
        switch(typeof M){
            case "undefined" : ;
            break;
        case "string" : 
        case "number" : 
            U.derived = M;
            O = formatCell(Z, M);
            break;
        case "object" : 
            if(M.buttonLabel){
                U.derived = M.buttonLabel;
                O = formatCell(Z, M.buttonLabel);
                break;
            }
            else if(M.menuLabel){
                U.derived = M.menuValue;
                O = formatCell(Z, M.menuLabel);
                break;
            }
            else if(M.constructor == Array){
                O = 'array';
                U.derived = M;
                break;
            }
            else if(M.error){
                O = M.error;
                U.derived = M;
                break;
            }
        default : 
            O = "[error:" + typeof M + "]";
            delete U.derived;
            break;
    }
}
if( ! V){
    if(O != null)
        SetCellText(Z, O);
    if(N != null)
        setToolTip(Z, N);
}
else{
    if(O != null)
        Z.style.inner = O;
}
if(U.m_referredToBy){
    if( ! gRuntime.forceDirty){
        if(emptyString(P)){
            if(Y === U.entry)
                return;
        }
        else if(U.derived === P)
            return;
    }
    var E = U.m_referredToBy;
    for(var D = 0; D < E.length; D ++ )
        dirtyCell(E[D]);
}
}
function buildTooltip(Z, Y, X){
    var W = null;
    if(typeof Z != "object")
        W = Z;
    else if(Z == null)
        W = null;
    else if(Z.error)
        W = (Y ? Z.error + " " : "") + Z.tooltip;
    else if(Z.menuLabel)
        W = Z.menuLabel;
    else if(Z.buttonLabel)
        W = null;
    else if(Z.constructor == Array)
        W = Z[0];
    if(Y){
        if((typeof X != "undefined") && (Z != X))
            W = getString("strCellOverrideTipCmp", kDefaultLocale, W, (X.error ? X.error + " " : "") + buildTooltip(X));
        else
            W = getString("strCellNoOverrideTipCmp", kDefaultLocale, W);
    }
    return W;
}
function normalizeCellValue(Z){
    if(Z == null)
        return 0;
    else if(typeof Z == "boolean")
        return Z ? 1 : 0;
    else if(typeof Z == "object" && Z.constructor == Array)
        return Z[0];
    else
        return Z;
}
function filterCellValue(Z){
    if(typeof Z != "string")
        return Z;
    Z = Z.replace(/[\x00-\x1F]/g, ' ');
    return Z;
}
function RefersToIsClean(Z){
    if( ! Z.cellData ||! Z.cellData.m_refersTo)
        return true;
    var Y = Z.cellData.m_refersTo;
    var X = Y.length;
    for(var W = 0; W < X; W ++ ){
        if(Y[W] && Y[W].cellData && gRecalcDirty[Y[W].cellData.m_abstractId])
            return false;
    }
    return true;
}
function CleanCells(){
    var Z;
    var Y = false;
    for(var X in gRecalcDirty){
        if(RefersToIsClean(gRecalcDirty[X])){
            Z = X;
            Y = true;
            break;
        }
        if( ! Z)
            Z = X;
    }
    if(Z == null)
        return false;
    pulseCell(gRecalcDirty[Z]);
    if(kMode != "design" && typeof refreshEdit == "function")
        refreshEdit(gRecalcDirty[Z]);
    delete gRecalcDirty[Z];
    return true;
}
var gNotifyParent = true;
function turnOnNotification(){
    gNotifyParent = true;
}
function turnOffNotification(){
    gNotifyParent = false;
}
function notifyParentNode(){
    if(kMode == "embed" ||! window.parent || window.parent.gAppAuthor != "pr"){
        turnOffNotification();
        return;
    }
    window.parent.sheetRecalculated(gExtra, this);
    turnOffNotification();
}
var gCycleTimer = null;
function cycleCell(){
    gCycleTimer = killTimeout(gCycleTimer);
    for(var Z = 0; Z < 2; Z ++ ){
        if( ! CleanCells()){
            if(gNotifyParent){
                notifyParentNode();
            }
            gCycleTimer = setTimeout("cycleCell()", 1000);
            return;
        }
    }
    gCycleTimer = setTimeout("cycleCell()", 5);
}
function dirtyCell(Z){
    if(Z.cellData && cell2row(Z) && cell2column(Z))
        gRecalcDirty[Z.cellData.m_abstractId] = Z;
}
function unrefCell(Z){
    if( ! Z.cellData.m_refersTo)
        return;
    var Y = Z.cellData.m_refersTo;
    for(var X = 0; X < Y.length; X ++ ){
        var W = Y[X];;
        var V = W.cellData.m_referredToBy;
        var U = null;
        for(var T = 0; T < V.length; T ++ ){
            if(V[T] != Z){
                if( ! U)
                    U = new Array;
                U[U.length] = V[T];
            }
        }
        W.cellData.m_referredToBy = U;
    }
}
function unrefByCell(Z){
    if( ! Z.cellData.m_referredToBy)
        return;
    var Y = Z.cellData.m_referredToBy;
    for(var X = 0; X < Y.length; X ++ ){
        var W = Y[X];;
        var V = W.cellData.m_refersTo;
        var U = null;
        for(var T = 0; T < V.length; T ++ ){
            if(V[T] != Z){
                if( ! U)
                    U = new Array;
                U[U.length] = V[T];
            }
        }
        W.cellData.m_refersTo = U;
    }
}
function addUniqueItem(Z, Y){
    for(var X = 0; X < Z.length; X ++ )
        if(Z[X] == Y)
            return false;
    Z[Z.length] = Y;
    return true;
}
function referCell(Z, Y){
    if( ! Z.cellData.m_refersTo)
        return;
    var X = Z.cellData.m_refersTo;
    for(var W = 0; W < X.length; W ++ ){
        var V = X[W];
        CheckForCellData(V.m_name);
        var U = V.cellData.m_referredToBy;
        if( ! U)
            V.cellData.m_referredToBy = U = new Array;
        if(Y)
            addUniqueItem(U, Z);
        else
            U[U.length] = Z;
        V.cellData.m_locked = getLock(V.cellData);
    }
}
function DeleteCell(Z){
    if(Z.cellData != null){
        unrefCell(Z);
        unrefByCell(Z);
        gCellDataArray[Z.cellData.m_abstractId] = null;
        Z.cellData = null;
    }
    Z.innerHTML = "";
    Z.outerHTML = "";
}
function formatCell(Z, Y){
    return formatValue(Z.cellData, Y);
}
function name2cell(Z){
    return gCellElemMatrix[name2row(Z)][name2column(Z)];
}
function safeName2cell(Z, Y){
    if(Z == null)
        return null;
    var X = name2row(Z);
    var W = name2column(Z);
    var V = Y ? 1 : 0;
    if(X < V || W < V || (X > gRowCount - 1) || (W > gColumnCount - 1))
        return null;
    return gCellElemMatrix[X][W];
}
function index2name(Z, Y, X){
    return "r" + Z + "c" + Y + "s" + X;
}
function index2cell(Z, Y, X){
    return gCellElemMatrix[Z][Y];
}
function cellData2cell(Z){
    return name2cell(Z.m_div.m_name);
}
function splitName(Z){
    if(Z.indexOf('r') == 0)
        Z = Z.substring(1);
    return Z.split(/[rcs]/);
}
function OldToNewStyle(Z){
    var Y = splitName(Z);
    var X = parseInt(Y[0]);
    var W = parseInt(Y[1]);
    return ColumnIndexToColumnLetter(W) + X;
}
function name2row(Z){
    var Y = splitName(Z);
    return parseInt(Y[0]);
}
function name2column(Z){
    var Y = splitName(Z);
    return parseInt(Y[1]);
}
function name2sheet(Z){
    var Y = splitName(Z);
    return parseInt(Y[2]);
}
function cell2row(Z){
    return name2row(Z.m_name);
}
function cell2column(Z){
    return name2column(Z.m_name);
}
function cell2sheet(Z){
    return name2sheet(Z.m_name);
}
function label2cell(Z){
    return null;
}
function cell2label(Z){
    return null;
}
function cellAbove(Z){
    var Y = cell2row(Z) - 1;
    if(Y < 0)
        Y = 0;
    return index2cell(Y, cell2column(Z), 0);
}
function cellToLeft(Z){
    var Y = cell2column(Z) - 1;
    if(Y < 0)
        Y = 0;
    return index2cell(cell2row(Z), Y, 0);
}
function cellBelow(Z){
    var Y = cell2row(Z) + 1;
    if(Y >= gRowCount)
        Y = gRowCount - 1;
    return index2cell(Y, cell2column(Z), 0);
}
function cellToRight(Z){
    var Y = cell2column(Z) + 1;
    if(Y >= gColumnCount)
        Y = gColumnCount - 1;
    return index2cell(cell2row(Z), Y, 0);
}
function GetDefaultCellStyle(Z, Y){
    var X = null;
    switch(Y){
        case "color" : 
            X = "black";
            break;
        case "backgroundColor" : 
            X = "white";
            break;
        case "fontFamily" : 
            var W = getDefaultFont();
            X = getFontFamily(W);
            break;
        case "fontSize" : 
            X = "10pt";
            break;
        case "fontWeight" : 
            X = "normal";
            break;
        case "textDecoration" : 
            X = "none";
            break;
        case "fontStyle" : 
            X = "normal";
            break;
        case "textAlign" : 
            X = "right";
            break;
        case "backgroundImage" : 
            X = "none";
            break;
        case "borderTop" : 
        case "borderLeft" : 
            if(Z.className == "head")
                X = "solid lightgrey 0px";
            else
                X = "solid lightblue 0px";
            break;
        case "borderBottom" : 
        case "borderRight" : 
            if(Z.className == "head")
                X = "solid lightgrey 1px";
            else
                X = "solid lightblue " + gGridWidth;
            break;
        default : 
            alert("unknown style:" + Y);
            return;
    }
    return X;
}
function GetDefaultCellData(Z){
    var Y;
    switch(Z){
        case "foreColor" : 
            Y = "black";
            break;
        case "bk_color" : 
            Y = "white";
            break;
        case "viewFamily" : 
            var X = getDefaultFont();
            Y = getFontFamilyName(X);
            break;
        case "viewSize" : 
            Y = "10 pt";
            break;
        case "_fontWeight" : 
            Y = "normal";
            break;
        case "_textDecoration" : 
            Y = "none";
            break;
        case "_fontStyle" : 
            Y = "normal";
            break;
        case "_textAlign" : 
            Y = "right";
            break;
        case "_wrapText" : 
            Y = false;
            break;
        case "m_backgroundImage" : 
        case "m_cellGUI" : 
        case "_borderTop" : 
        case "_borderLeft" : 
        case "_borderBottom" : 
        case "_borderRight" : 
            Y = null;
            break;
        default : 
            alert("unknown style:" + HTMLstyleAttribute);
            return;
    }
    return Y;
}
function getCustom(Z, Y){
    var X = Z[Y];
    if(X == null)
        return "";
    if((typeof X == "string") && (X == " "))
        return "";
    return X;
}
function setCustom(Z, Y, X){
    if((typeof X == "string") && (X == ""))
        X = " ";
    if(Z[Y] != X)
        Z[Y] = X;
}
function getExtraDefault(Z, Y, X){
    var W;
    if(Z){;
        W = getCustom(Z, Y);
    }
    return emptyString(W) ? X : W;
}
function getTextAlignDefault(Z){
    var Y;
    Y = getExtraDefault(Z.cellData, "_textAlign", null);
    if(emptyString(Y))
        Y = getExtraDefault(Z.cellData, "textAlign", null);
    if(emptyString(Y))
        Y = getStyle(Z, "textAlign");
    if(emptyString(Y))
        Y = null;
    return Y;
}
function getLock(Z, Y){
    if(Z == null)
        return "true";
    else if( ! Y && Z.locked)
        return Z.locked;
    else if( ! Z.m_refersTo && (Z.m_referredToBy || (Z.i_tb && Z.i_tb.length > 0)) && ( ! Z.entry || Z.entry.charAt(0) != '='))
        return "false";
    else if(isOverrideEnabled(Z))
        return "false";
    else
        return "true";
}
var gGridWidth = "1px";
function frame2cell(Z, Y, X){
    var W = null;
    var V = null;
    switch(Y){
        case "top" : 
            W = "borderTop";
            break;
        case "left" : 
            W = "borderLeft";
            break;
        case "bottom" : 
            W = "borderBottom";
            break;
        case "right" : 
            W = "borderRight";
            break;
        default : 
            return;
    }
    switch(X){
        case "none" : 
            return;
        case "reset" : 
            V = "solid lightblue " + gGridWidth;
            break;
        case "plain" : 
            V = "solid black 1px";
            break;
        case "thick" : 
            V = "solid black 2px";
            break;
        case "double" : 
            V = "double black 3px";
            break;
        case "popup" : 
            V = "solid gray 1px";
            break;
        default : 
            return;
    }
    if(Y == "left"){
        CheckForCellData(cellToLeft(Z).m_name);
        CheckForCellData(Z.m_name);
        setStyle(cellToLeft(Z), "borderRight", V);
    }
    else if(Y == "top"){
        CheckForCellData(cellAbove(Z).m_name);
        CheckForCellData(Z.m_name);
        setStyle(cellAbove(Z), "borderBottom", V);
    }
    else{
        CheckForCellData(Z.m_name);
        setStyle(Z, W, V);
    }
    if(X == "reset")
        setExtra(Z.cellData, "_" + W);
    else
        setExtra(Z.cellData, "_" + W, V);
}
function nukeCellBorderFromOrbit(Z){
    frame2cell(Z, "top", "reset");
    frame2cell(Z, "left", "reset");
    frame2cell(Z, "bottom", "reset");
    frame2cell(Z, "right", "reset");
    frame2cell(cellAbove(Z), "bottom", "reset");
    frame2cell(cellBelow(Z), "top", "reset");
    frame2cell(cellToLeft(Z), "right", "reset");
    frame2cell(cellToRight(Z), "left", "reset");
}
function setRowBorder(Z, Y){
    var X = index2cell(Z, 0, 0);
    CheckForCellData(X.m_name);
    setStyle(X, "borderRight", Y);
    X.cellData._borderRight = Y;
}
function setColumnBorder(Z, Y){
    var X = index2cell(0, Z, 0);
    CheckForCellData(X.m_name);
    setStyle(X, "borderBottom", Y);
    X.cellData._borderBottom = Y;
}
function CellListToString(Z){
    if( ! Z)
        return "";
    var Y = "";
    for(var X = 0; X < Z.length; X ++ ){
        if(Z[X] && Z[X].m_name)
            Y += Z[X].m_name + " ";
    }
    return Y;
}
function CellStringToList(Z){
    var Y;
    var X = Z.split(" ");
    for(var W = 0; W < X.length; W ++ ){
        var V = X[W];
        if(V){
            if( ! Y)
                Y = new Array;
            Y[Y.length] = name2cell(V);
        }
    }
    return Y;
}
function ProcessDirtyCells(){
    var Z = gInitDirtyCells.split(" ");
    for(var Y = 0; Y < Z.length; Y ++ ){
        if(Z[Y]){
            var X = safeName2cell(Z[Y]);
            if(X)
                dirtyCell(X);
        }
    }
}
function CheckForCellData(Z, Y){
    var X = name2cell(Z);;;
    if(X.cellData){;
        return X;
    }
    if( ! Y)
        Y = new Object;
    Y.m_abstractId = gCellDataArray.length;
    Y.m_div = X;
    X.cellData = gCellDataArray[Y.m_abstractId] = Y;
    return X;
}
function initCell(Z){
    var Y = gCellDataArray[Z];
    var X = Y.m_row;
    var W = Y.m_col;
    delete Y.m_row;
    delete Y.m_col;
    var V = gCellElemMatrix[X][W];
    V.cellData = Y;
    Y.m_abstractId = Z;
    Y.m_div = V;
    if(Y["static"]){
        Y.derived = Y["static"];
        delete(Y["static"]);
    }
    if(Y.derived &&! isNaN(Y.derived))
        Y.derived = parseFloat(Y.derived);
    if(typeof Y.userValue != "undefined"){
        setCellOverride(V.cellData, Y.userValue);
        setCellOriginalValue(V.cellData, Y.origValue);
        delete Y.userValue;
        delete Y.origValue;
    }
    if(Y.entry != null){
        if(equalString(Y.entry)){
            if(Y.dynamic == null)
                V.cellData.rebuild = true;
        }
        else{
            if(Y.i_nr == null)
                V.cellData.rebuild = true;
        }
    }
    if(V.cellData.i_tb){
        V.cellData.m_referredToBy = eval("var e = gCellElemMatrix;" + V.cellData.i_tb);
        delete V.cellData.i_tb;
    }
    if(V.cellData.i_rt){
        V.cellData.m_refersTo = eval("var e = gCellElemMatrix;" + V.cellData.i_rt);
        delete V.cellData.i_rt;
    }
    if(V.cellData.m_cellGUI)
        V.cellData.m_cellGUI = eval("var e =" + V.cellData.m_cellGUI + ";e");
    if(Y.foreColor)
        setStyle(V, "color", Y.foreColor);
    if(Y.bk_color)
        setBackgroundColor(V, Y.bk_color);
    if(Y.viewFamily)
        setStyle(V, "fontFamily", getFontFamily(Y.viewFamily));
    if(Y.viewSize){
        Y.viewSize = Y.viewSize.replace(/\s/g, '');
        setStyle(V, "fontSize", Y.viewSize);
    }
    if(Y._fontWeight)
        setStyle(V, "fontWeight", Y._fontWeight);
    if(Y._textDecoration)
        setStyle(V, "textDecoration", Y._textDecoration);
    if(Y._fontStyle)
        setStyle(V, "fontStyle", Y._fontStyle);
    if(Y.m_backgroundImage)
        setBackgroundImage(V, Y.m_backgroundImage);
    if(isOverrideEnabled(V.cellData)){
        if(isOverridden(V.cellData))
            setBackgroundImage(V, kRootUrl + kImageDirectory + "app/badge_override_on.gif");
        else
            setBackgroundImage(V, kRootUrl + kImageDirectory + "app/badge_override_off.gif");
    }
    if(Y._textAlign)
        setStyle(V, "textAlign", Y._textAlign);
    else if(Y.textAlign)
        setStyle(V, "textAlign", Y.textAlign);
    var U = getLock(Y);
    Y.m_locked = U;
    if((U == "false") && (kMode != "design")){
        setStyle(V, "borderTop", "solid #a0a0e6 1px");
        setStyle(V, "borderLeft", "solid #a0a0e6 1px");
        setStyle(V, "borderBottom", "solid lightblue 1px");
        setStyle(V, "borderRight", "solid lightblue 1px");
    }
    if(Y._borderTop && Y._borderTop != "none"){
        if((kMode != "design") && ((cellAbove(V) ==- 1) || (cell2row(V) == 1)))
            setStyle(V, "borderTop", Y._borderTop);
        else
            setStyle(cellAbove(V), "borderBottom", Y._borderTop);
    }
    if(Y._borderLeft && Y._borderLeft != "none"){
        if((kMode != "design") && (cellToLeft(V) ==- 1))
            setStyle(V, "borderLeft", Y._borderLeft);
        else
            setStyle(cellToLeft(V), "borderRight", Y._borderLeft);
    }
    if(Y._borderBottom && Y._borderBottom != "none")
        setStyle(V, "borderBottom", Y._borderBottom);
    if(Y._borderRight && Y._borderRight != "none")
        setStyle(V, "borderRight", Y._borderRight);
    if(X && W && Y.i_nr){
        FixupCell(V);
        V.style.inner = Y.i_nr;
    }
    if(Y.m_dirtyOnInit)
        dirtyCell(V);
}
function DirtyAllCells(){
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = name2row(cell.m_div.m_name);
        var X = name2column(cell.m_div.m_name);
        if( ! Y ||! X)
            continue;
        var W = index2cell(Y, X, 0);
        dirtyCell(W);
    }
    gSpreadsheetDirty = true;
}
function DirtyFormulaCells(){
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = gCellDataArray[Z];
        if(Y == null || (typeof Y != "object") ||! Y.dynamic)
            continue;
        var X = name2row(Y.m_div.m_name);
        var W = name2column(Y.m_div.m_name);
        if( ! X ||! W)
            continue;
        var V = index2cell(X, W, 0);
        dirtyCell(V);
    }
}
var autoConvert = false;
function RebuildAllCells(Z){
    if(Z){
        if( ! confirm(getString("strRebuildAll")))
            return;
    }
    var Y = (gEntryLocale != gAppLocale);
    var X;
    var W;
    for(W = 0; W < gCellDataArray.length; W ++ ){
        X = gCellDataArray[W];
        delete X.m_referredToBy;
        delete X.m_refersTo;
    }
    for(W = 0; W < gCellDataArray.length; W ++ ){
        X = gCellDataArray[W];
        var V = name2row(X.m_div.m_name);
        var U = name2column(X.m_div.m_name);
        if( ! V ||! U)
            continue;
        adjustCustomFormatLocale(X, gEntryLocale);
        RebuildCell(X.m_div);
    }
    gSpreadsheetDirty = true;
    if(Z)
        alert(getString("strRebuildDone"));
}
function OldNameToNewName(Z, Y, X){
    var W = X.indexOf('c');
    if(W >= 0){
        Y = parseInt(X.substring(W + 1));
    }
    var V = X.indexOf('r');
    if(V >= 0){
        Z = parseInt(X.substring(V + 1));
    }
    if(W < 0 && V < 0)
        return X;
    return OldToNewStyle(index2name(Z, Y, 0));
}
function ConvertToNewStyle(){
    if( ! confirm("Do you want to convert these cells to new style?"))
        return;
    autoConvert = true;
    RebuildAllCells(true);
    autoConvert = false;
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = gCellDataArray[Z];
        var X = getExtraDefault(Y, "entry", "");
        var W = X.split('\t');
        for(var V = 1; V < W.length; V += 2){
            var U = name2row(Y.m_div.m_name);
            var T = name2column(Y.m_div.m_name);
            W[V] = OldNameToNewName(U, T, W[V]);
        }
        Y.entry = W.join('\t');
    }
    alert("finished converting all cells");
}
function createCell(Z, Y, X){
    if( ! withinRange(Z, 0, gRowCount - 1) ||! withinRange(Y, 0, gColumnCount - 1))
        return null;
    var W;
    if((W = index2cell(Z, Y, X)) !=- 1)
        return W;
    var V;
    if((V = getElement("row" + Z)) == null)
        return null;
    var U = index2name(Z, Y, X);
    var T = 0;
    for(var S = 0; S < Y; S ++ )
        T += gColWidths[S];
    var R = gColWidths[Y];
    var Q = gRowHeights[Z];
    var P = V.children;
    var O = P.length;
    var N = '<span class="cell" style="position:absolute; top:0;' + 'left:' + T + ';height:' + Q + ';width:' + R + ';">' + '</span>';
    V.insertAdjacentHTML("beforeEnd", N);
    if(P.length == O)
        return null;
    var M = P[P.length - 1];
    setExtra(M, "m_name", U);
    gCellElemMatrix[Z][Y] = M;
    return M;
}
function isOverrideEnabled(Z){
    return Z && Z.dynamic != null && Z.dynamic.indexOf("__override(") !=- 1;
}
function isOverridden(Z){
    return(Z && Z.override && (Z.override.userValue != Z.override.origValue));
}
function getCellOverride(Z){
    if(isOverrideEnabled(Z) && Z.override)
        return Z.override.userValue;
    else
        return void(0);
}
function setCellOverride(Z, Y, X){
    var W = Y;
    if((isOverrideEnabled(Z) || X) && Y != null){
        if( ! Z.override)
            Z.override = new Object();
        var V = /\S+/;
        if( ! isNaN(Y) && V.test(W)){
            var U = new Number(Y);
            W = U.valueOf();
        }
        else if( ! V.test(W)){
            W = "";
        }
        Z.override.userValue = W;
    }
    else
        clearOverride(Z);
}
function getCellOriginalValue(Z){
    if(isOverridden(Z))
        return Z.override.origValue;
    else
        return void(0);
}
function setCellOriginalValue(Z, Y){
    if(isOverridden(Z))
        Z.override.origValue = Y;
}
function clearOverride(Z){
    if(Z)
        delete Z.override;
}
function getCellOverrideFormatted(Z){
    var Y = getCellOverride(Z);
    if(Y == void(0))
        Y = Z.derived;
    if(Y == null)
        Y = "";
    else if(parseFloat(Y) == Y)
        Y = localizedValue(Y, gAppLocale);
    return Y;
}
function removeWritebackOverrides(){
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = gCellDataArray[Z];
        if( ! Y.dynamic)
            continue;
        if(Y.dynamic.indexOf("_override") ==- 1 && Y.dynamic.indexOf("_rsdata") ==- 1)
            continue;
        var X = name2row(Y.m_div.m_name);
        var W = name2column(Y.m_div.m_name);
        if( ! X ||! W)
            continue;
        var V = index2cell(X, W, 0);
        if(V.cellData)
            clearOverride(V.cellData);
    }
}
function ButtonCellData(Z, Y, X, W, V){
    this.cell = Z;
    this.recompute = true;
    this.cellRef = Y;
    this.label = X;
    this.command = W;
    this.optionalArgs = new Array();
    this.setOptionalArgs(V);
};
ButtonCellData.prototype.builtInCommands = ['setcell'];
ButtonCellData.prototype.slice = function(argumentArray, Z){
    var Y = new Array();
    if(Z < argumentArray.length){
        for(var X = Z; X < argumentArray.length; X ++ ){
            Y[Y.length] = argumentArray[X];
        }
    }
    return Y;
};
ButtonCellData.prototype.setOptionalArgs = function(argumentArray){
    var Z = new Array();
    var Y = false;
    for(var X = 0; X < argumentArray.length; X ++ ){
        var W = argumentArray[X];
        if(typeof(W) == "string"){
            W = W.replace(/'/g, "\\'");
            W = W.replace(/"/g, '&quot;');
            W = "'" + W + "'";
        }
        else if(typeof(W) == "number"){
            W = W.toString();
        }
        if( ! Y){
            if(X < this.optionalArgs.length){
                if(W != this.optionalArgs[X]){
                    Y = true;
                }
            }
            else{
                Y = true;
            }
        }
        Z[Z.length] = W;
    }
    if(Y){
        this.recompute = true;
        this.optionalArgs = Z;
    }
};
ButtonCellData.prototype.setProperty = function(name, Z){
    if(Z != this[name]){
        this.recompute = true;
        this[name] = Z;
    }
};
ButtonCellData.prototype.setProperties = function(cell, Z, Y, X, W){
    this.cell = cell;
    this.setProperty('cellRef', Z);
    this.setProperty('label', Y);
    this.setProperty('command', X);
    this.setOptionalArgs(W);
};
ButtonCellData.prototype.recomputeHtml = function(){
    this.error = null;
    if(typeof this.label != 'string' || typeof this.command != 'string' || this.command.search(/\(.*\w.*\)/) !=- 1){
        this.error = __error("#BUTTON!", getString("strButtonBadSyntax"));
        return;
    }
    var Z = this.command.match(/^[A-z_$][A-z0-9_$]*$/);
    if(Z == null){
        this.error = __error("#BUTTON!", getString("strBadCommandName") + ' ' + this.command);
        return;
    }
    Z = this.command.match(/^(.+)\(\)$/);
    if(Z != null){
        this.command = Z[1];
    }
    argument_string = this.optionalArgs.join();
    var Y = false;
    for(var X = 0; X < this.builtInCommands.length; X ++ ){
        if(this.command == this.builtInCommands[X]){
            Y = true;
            break;
        }
    }
    var W;
    if(Y){
        W = 'call.' + this.command + '(' + argument_string;
    }
    else{
        W = "execButtonCmd('" + this.command + "'";
        if(argument_string){
            W += ', ' + argument_string;
        }
    }
    this.innerHtml = '<button' + ' ' + 'style="' + 'width:' + (this.cell.style ? this.cell.style.width : '100%') + ";" + 'height:' + (this.cell.style ? this.cell.style.height : '100%') + ";" + 'margin-top:-1px;' + 'margin-left:-1px;' + 'font-family:tahoma,helvetica,arial,sans-serif;' + 'font:8pt"' + ' ' + 'onClick="javascript:' + W + ');" title="' + this.label + '">' + this.label + '</button>';
};
ButtonCellData.prototype.getInnerHtml = function(){
    if(this.recompute){
        this.recomputeHtml();
        this.recompute = false;
    }
    if(this.error){
        delete this.cell.cellData.dataObject;
        return this.error.text;
    }
    else{
        return this.innerHtml;
    }
};
ButtonCellData.prototype.getToolTip = function(){
    return this.label;
};
ButtonCellData.prototype.valueIsHtml = function(){
    return true;
};
ButtonCellData.prototype.setCellInnerHtml = function(cell){
    cell.innerHTML = "<span style='position:absolute; left:0'><nobr>" + this.getInnerHtml() + "</nobr></span>";
};
ButtonCellData.prototype.fixupCell = function(cell){
    var Z = 1;
    if( ! cell.cellData.dynamic){
        Z = 0;
    }
    else{
        if(cell.cellData.dynamic.search('__button') != 0){
            Z = 0;
        }
    }
    if(Z){
        this.setCellInnerHtml(cell);
    }
    else{
        delete cell.cellData.dataObject;
    }
};
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();