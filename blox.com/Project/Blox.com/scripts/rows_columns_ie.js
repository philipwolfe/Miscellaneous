//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function DeleteRowsWrapper(){
    if(name2row(gSelectStart.m_name) == 0){
        alert(getString("strCantDeleteRowsColumn"));
        return;
    }
    var Z = name2row(gSelectPrime.m_name);
    var Y = name2row(gSelectFinal.m_name);
    var X = Math.abs(Z - Y) + 1;
    if(X == (gRowCount - 1)){
        alert(getString("strCantDeleteRows"));
        return;
    }
    openModal('deletewait', getString("strDeleteRows"), "", "", "closeModal()", [{
        type : 'raw',
        value : getString("strRowDeletionInProgress") + "..."
    }], null, null);
    setTimeout("DeleteRows(" + Z + ", " + Y + ", " + X + ")", 0);
}
function DeleteRows(Z, Y, X){
    var W = Math.min(Z, Y);
    var V = W + X - 1;
    var U = getBottom(index2cell(V, 0, gCurrSheetIndex).parentElement) - getTop(index2cell(W, 0, gCurrSheetIndex).parentElement);
    var T = getElement("sheet" + gCurrSheetIndex);
    setHeight(T, getHeight(T) - U);
    var S;
    var R;
    var Q = getElement("sheet" + gCurrSheetIndex);
    for(S = W; S <= V; S ++ ){
        var P = gRowResizers[S];
        P.innerHTML = "";
        P.outerHTML = "";
        var O = index2cell(S, 0, T).parentElement;
        for(R = 0; R < gColumnCount; R ++ ){
            DeleteCell(index2cell(S, R, gCurrSheetIndex));
        }
        O.innerHTML = "";
        O.outerHTML = "";
    }
    for(S = V + 1; S < gRowCount; S ++ ){
        P = gRowResizers[S];
        setTop(P, getTop(P) - U);
        P.m_name = (S - X) + "rowResizer";
        O = index2cell(S, 0, T).parentElement;
        setTop(O, getTop(O) - U);
        for(R = 0; R < gColumnCount; R ++ ){
            var N = index2cell(S, R, gCurrSheetIndex);
            N.m_name = index2name(S - X, R, gCurrSheetIndex);
            if(R == 0)
                N.innerText = parseInt(N.innerText) - X;
        }
    }
    gCellElemMatrix = gCellElemMatrix.slice(0, W).concat(gCellElemMatrix.slice(V + 1, gRowCount));
    gRowResizers = gRowResizers.slice(0, W).concat(gRowResizers.slice(V + 1, gRowCount));
    gRowCount -= X;
    gSelectKind = "range";
    gSelectFinal = gSelectPrime = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
    showSelect();
    fetchEntry();
    ClipboardDeselected();
    gSpreadsheetDirty = true;
    setTimeout("DeleteRowsTwo(" + X + ", " + W + ", " + V + ")", 0);
}
function DeleteRowsTwo(Z, Y, X){
    for(var W = 0; W < gCellDataArray.length; W ++ ){
        var V = gCellDataArray[W];
        if(V != null){
            if( ! emptyString(V.entry)){
                var U = false;
                var T = V.entry.split('\t');
                for(var S = 1; S < T.length; S += 2){
                    var R = T[S];
                    var Q = parseInt(R.match(/\d+/)[0]);
                    if(Q > X){
                        U = true;
                        var P = Q - Z;
                        T[S] = R.replace(/\d+/, P);
                    }
                    else if((Q <= X) && (Q >= Y)){
                        T[S] = "#REF!";
                        SetCellText(cellData2cell(V), "#REF!");
                        gCellDataArray[W].derived = "#REF!";
                    }
                }
                gCellDataArray[W].entry = T.join('\t');
                gCellDataArray[W].entry = gCellDataArray[W].entry.replace(/\t#REF!\t/g, "#REF!");
                if((V.m_cellGUI) && (V.m_cellGUI.type == "menu"))
                    U = true;
                if(U){
                    var O = gCellDataArray[W].entry.replace(/\t/g, "");
                    buildCell(cellData2cell(gCellDataArray[W]), O);
                }
            }
        }
    }
    closeModal();
}
function DeleteColumnsWrapper(){
    if(name2column(gSelectStart.m_name) == 0){
        alert(getString("strCantDeleteColumnsRow"));
        return;
    }
    var Z = name2column(gSelectPrime.m_name);
    var Y = name2column(gSelectFinal.m_name);
    var X = Math.abs(Z - Y) + 1;
    if(X == (gColumnCount - 1)){
        alert(getString("strCantDeleteColumns"));
        return;
    }
    openModal('deletewait', getString("strDeleteColumns"), "", "", "closeModal()", [{
        type : 'raw',
        value : getString("strColumnDeletionProgress") + "..."
    }], null, null);
    setTimeout("DeleteColumns(" + Z + ", " + Y + ", " + X + ")", 0);
}
function DeleteColumns(Z, Y, X){
    var W = Math.min(Z, Y);
    var V = W + X - 1;
    var U = getRight(index2cell(0, V, gCurrSheetIndex)) - getLeft(index2cell(0, W, gCurrSheetIndex));
    var T = getElement("sheet" + gCurrSheetIndex);
    var S = getElement("sheet" + gCurrSheetIndex);
    for(var R = W; R <= V; R ++ ){
        var Q = gColumnResizers[R];
        Q.innerHTML = "";
        Q.outerHTML = "";
        for(var P = 0; P < gRowCount; P ++ ){
            DeleteCell(index2cell(P, R, gCurrSheetIndex));
        }
    }
    for(R = V + 1; R < gColumnCount; R ++ ){
        Q = gColumnResizers[R];
        setLeft(Q, getLeft(Q) - U);
        Q.m_name = (R - X) + "colResizer";
        for(P = 0; P < gRowCount; P ++ ){
            var O = index2cell(P, R, gCurrSheetIndex);
            setLeft(O, getLeft(O) - U);
            O.m_name = index2name(P, R - X, gCurrSheetIndex);
            if(P == 0)
                O.innerText = ColumnIndexToColumnLetter(R - X);
            var N = O.parentElement;
            setWidth(N, getWidth(T) - U);
            N.style.clip = "rect(0px, " + (getWidth(T) - U) + "px, " + getHeight(O) + "px, 0px)";
        }
    }
    setWidth(T, getWidth(T) - U);
    for(P = 0; P < gCellElemMatrix.length; P ++ ){
        gCellElemMatrix[P] = gCellElemMatrix[P].slice(0, W).concat(gCellElemMatrix[P].slice(V + 1, gColumnCount));
    }
    gColumnResizers = gColumnResizers.slice(0, W).concat(gColumnResizers.slice(V + 1, gColumnCount));
    gColumnCount -= X;
    gSelectKind = "range";
    gSelectFinal = gSelectPrime = gSelectStart = index2cell(1, 1, gCurrSheetIndex);
    showSelect();
    fetchEntry();
    ClipboardDeselected();
    gSpreadsheetDirty = true;
    setTimeout("DeleteColumnsTwo(" + X + ", " + W + ", " + V + ")", 0);
}
function DeleteColumnsTwo(Z, Y, X){
    for(var W = 0; W < gCellDataArray.length; W ++ ){
        var V = gCellDataArray[W];
        if(V != null){
            if( ! emptyString(V.entry)){
                var U = false;
                var T = V.entry.split('\t');
                for(var S = 1; S < T.length; S += 2){
                    var R = T[S];
                    var Q = ColumnLetterToColumnIndex((R.charAt(0) == "$") ? R.substring(1, R.length) : R);
                    if(Q > X){
                        U = true;
                        var P = ColumnIndexToColumnLetter(Q - Z);
                        T[S] = R.replace(/[a-zA-Z]+/, P);
                    }
                    else if((Q <= X) && (Q >= Y)){
                        T[S] = "#REF!";
                        SetCellText(cellData2cell(V), "#REF!");
                        gCellDataArray[W].derived = "#REF!";
                    }
                }
                gCellDataArray[W].entry = T.join('\t');
                gCellDataArray[W].entry = gCellDataArray[W].entry.replace(/\t#REF!\t/g, "#REF!");
                if((V.m_cellGUI) && (V.m_cellGUI.type == "menu"))
                    U = true;
                if(U){
                    var O = gCellDataArray[W].entry.replace(/\t/g, "");
                    buildCell(cellData2cell(gCellDataArray[W]), O);
                }
            }
        }
    }
    closeModal();
}
function InsertRowsWrapper(){
    if(name2row(gSelectStart.m_name) == 0){
        alert(getString("strCantInsertRowColumn"));
        return;
    }
    var Z = Math.abs(name2row(gSelectPrime.m_name) - name2row(gSelectFinal.m_name)) + 1;
    var Y = Math.min(name2row(gSelectPrime.m_name), name2row(gSelectFinal.m_name));
    openModal('insertwait', getString("strInsertRows"), "", "", "closeModal()", [{
        type : 'raw',
        value : getString("strRowInsertionProgress") + "..."
    }], null, null);
    setTimeout("InsertRows(" + Z + ", " + Y + ")", 0);
}
function InsertRows(Z, Y){
    var X = getHeight(index2cell(Y - 1, 0, gCurrSheetIndex));
    var W = Z * X;
    var V = getElement("sheet" + gCurrSheetIndex);
    setHeight(V, getHeight(V) + W);
    var U;
    var T;
    var S;
    var R;
    for(S = gRowCount - 1; S >= Y; S -- ){
        var Q = gRowResizers[S];
        setTop(Q, getTop(Q) + W);
        Q.m_name = (S + Z) + "rowResizer";
        var P = index2cell(S, 0, 0).parentElement;
        setTop(P, getTop(P) + W);
        for(R = gColumnCount - 1; R >= 0; R -- ){
            var O = index2cell(S, R, gCurrSheetIndex);
            O.m_name = index2name(S + Z, R, gCurrSheetIndex);
            if(R == 0)
                O.innerText = Z + parseInt(O.innerText);
        }
    }
    var N = getElement("sheet" + gCurrSheetIndex);
    var M = gTempCellID;
    var L = gTempRowResizerID;
    for(S = Y; S < (Y + Z); S ++ ){
        var K = "head";
        var J = S;
        var I = "";
        var H = index2cell(Y - 1, 0, gCurrSheetIndex);
        var G = getTop(H.parentElement) + (X * (S - Y + 2)) - 4;
        var F = "tempRowResizerID_" + gTempRowResizerID ++ ;
        N.insertAdjacentHTML('BeforeEnd', '<span class="rowResizer" id=' + F + ' style="top: ' + G + '; left: 0;"></span>');
        var E = index2cell(Y - 1, 0, gCurrSheetIndex).parentElement;
        var D = X;
        var C = getWidth(E);
        T = getTop(E) + (D * (S - Y + 1));
        var B = "<span id='row" + S + "' style='position:absolute; z-index:-2; clip: rect(0px " + (C + 1) + "px " + D + "px 0px); left:0; height:" + D + "; width:" + C + "; top:" + T + ";'>";
        for(R = 0; R < gColumnCount; R ++ ){
            var A = "tempCellID_" + gTempCellID ++ ;
            U = index2cell(Y - 1, R, gCurrSheetIndex);
            D = X;
            T = 0;
            C = getWidth(U);
            var Z1 = getLeft(U);
            B += '<SPAN CLASS = "' + K + '" ID=' + A + ' STYLE="top:' + T + '; left:' + Z1 + '; height:' + D + '; width:' + C + ';' + I + '">' + J + '</SPAN>';
            K = "cell";
            I = "border-right-width:" + gGridWidth + "; border-bottom-width:" + gGridWidth + ";";
            J = "";
        }
        B += "</SPAN>";
        N.insertAdjacentHTML("BeforeEnd", B);
    }
    var Y1 = new Array();
    for(S = 0; S < Z; S ++ ){
        Y1[S] = new Array();
    }
    gCellElemMatrix = gCellElemMatrix.slice(0, Y).concat(Y1).concat(gCellElemMatrix.slice(Y, gRowCount));
    for(S = Y; S < (Y + Z); S ++ ){
        for(R = 0; R < gColumnCount; R ++ ){
            gCellElemMatrix[S][R] = getElement("tempCellID_" + M ++ );
            setExtra(gCellElemMatrix[S][R], "m_name", index2name(S, R, 0));
        }
    }
    var X1 = new Array(Z);
    gRowResizers = gRowResizers.slice(0, Y).concat(X1).concat(gRowResizers.slice(Y, gRowCount));
    for(S = Y; S < (Y + Z); S ++ ){
        gRowResizers[S] = getElement("tempRowResizerID_" + L ++ );
        setExtra(gRowResizers[S], "m_name", S + "rowResizer");
    }
    if(Y < gRowCount){
        hideSelect();
        gSelectKind = "range";
        gSelectPrime = index2cell(name2row(gSelectPrime.m_name) - Z, name2column(gSelectPrime.m_name), gCurrSheetIndex);
        gSelectStart = index2cell(name2row(gSelectStart.m_name) - Z, name2column(gSelectStart.m_name), gCurrSheetIndex);
        gSelectFinal = index2cell(name2row(gSelectFinal.m_name) - Z, name2column(gSelectFinal.m_name), gCurrSheetIndex);
        showSelect();
        fetchEntry();
    }
    gRowCount += Z;
    ClipboardDeselected();
    gSpreadsheetDirty = true;
    setTimeout("InsertRowsTwo(" + Z + ", " + Y + ")", 0);
}
function InsertRowsTwo(Z, Y){
    for(var X = 0; X < gCellDataArray.length; X ++ ){
        var W = gCellDataArray[X];
        if(W != null){
            if( ! emptyString(W.entry)){
                var V = false;
                var U = W.entry.split('\t');
                for(var T = 1; T < U.length; T += 2){
                    var S = U[T];
                    var R = parseInt(S.match(/\d+/)[0]);
                    if(R >= Y){
                        V = true;
                        var Q = R + Z;
                        U[T] = S.replace(/\d+/, Q);
                    }
                }
                gCellDataArray[X].entry = U.join('\t');
                if((W.m_cellGUI) && (W.m_cellGUI.type == "menu"))
                    V = true;
                if(V){
                    var P = gCellDataArray[X].entry.replace(/\t/g, "");
                    buildCell(cellData2cell(gCellDataArray[X]), P);
                }
            }
        }
    }
    closeModal();
}
function InsertColumnsWrapper(){
    if(name2column(gSelectStart.m_name) == 0){
        alert(getString("strCantInsertColumnRow"));
        return;
    }
    var Z = Math.abs(name2column(gSelectPrime.m_name) - name2column(gSelectFinal.m_name)) + 1;
    var Y = Math.min(name2column(gSelectPrime.m_name), name2column(gSelectFinal.m_name));
    openModal('insertwait', getString("strInsertColumns"), "", "", "closeModal()", [{
        type : 'raw',
        value : getString("strColumnInsertionProgress") + "..."
    }], null, null);
    setTimeout("InsertColumns(" + Z + ", " + Y + ")", 0);
}
function InsertColumns(Z, Y){
    var X = getWidth(index2cell(0, Y - 1, gCurrSheetIndex));
    var W = Z * X;
    var V = getElement("sheet" + gCurrSheetIndex);
    for(var U = gColumnCount - 1; U >= Y; U -- ){
        var T = gColumnResizers[U];
        setLeft(T, getLeft(T) + W);
        T.m_name = (U + Z) + "colResizer";
        for(var S = gRowCount - 1; S >= 0; S -- ){
            var R = index2cell(S, U, gCurrSheetIndex);
            setLeft(R, getLeft(R) + W);
            R.m_name = index2name(S, U + Z, gCurrSheetIndex);
            if(S == 0)
                R.innerText = ColumnIndexToColumnLetter(Z + U);
        }
    }
    for(S = gRowCount - 1; S >= 0; S -- ){
        var Q = index2cell(S, 0, gCurrSheetIndex).parentElement;
        setWidth(Q, getWidth(V) + W);
        Q.style.clip = "rect(0px, " + (getWidth(V) + W) + "px, " + getHeight(Q) + "px, 0px)";
    }
    var P = getElement("sheet" + gCurrSheetIndex);
    var O = gTempCellID;
    var N = gTempColResizerID;
    for(U = Y; U < (Y + Z); U ++ ){
        var M = "head";
        var L = ColumnIndexToColumnLetter(U);
        var K = "";
        var J = index2cell(0, Y - 1, gCurrSheetIndex);
        var I = getLeft(J) + (X * (U - Y + 2)) - 4;
        var H = "tempColResizerID_" + gTempColResizerID ++ ;
        P.insertAdjacentHTML('BeforeEnd', '<span class="columnResizer" id=' + H + ' style="top: 0; left: ' + I + ';"></span>');
        for(S = 0; S < gRowCount; S ++ ){
            var G = "tempCellID_" + gTempCellID ++ ;
            var F = index2cell(S, Y - 1, gCurrSheetIndex);
            Q = F.parentElement;
            var E = getTop(Q);
            var D = getHeight(F);
            var C = getLeft(F) + (X * (U - Y + 1));
            Q.insertAdjacentHTML('BeforeEnd', '<SPAN CLASS = "' + M + '" ID=' + G + ' STYLE="top:0; left:' + C + '; height:' + D + '; width:' + X + ';' + K + '">' + L + '</SPAN>');
            M = "cell";
            K = "border-right-width:" + gGridWidth + "; border-bottom-width:" + gGridWidth + ";";
            L = "";
        }
    }
    setWidth(V, getWidth(V) + W);
    for(S = 0; S < gCellElemMatrix.length; S ++ ){
        var B = new Array(Z);
        gCellElemMatrix[S] = gCellElemMatrix[S].slice(0, Y).concat(B).concat(gCellElemMatrix[S].slice(Y, gColumnCount));
    }
    for(U = Y; U < (Y + Z); U ++ ){
        for(S = 0; S < gRowCount; S ++ ){
            gCellElemMatrix[S][U] = getElement("tempCellID_" + O ++ );
            setExtra(gCellElemMatrix[S][U], "m_name", index2name(S, U, 0));
        }
    }
    var A = new Array(Z);
    gColumnResizers = gColumnResizers.slice(0, Y).concat(A).concat(gColumnResizers.slice(Y, gColumnCount));
    for(U = Y; U < (Y + Z); U ++ ){
        gColumnResizers[U] = getElement("tempColResizerID_" + N ++ );
        setExtra(gColumnResizers[U], "m_name", U + "colResizer");
    }
    if(Y < gColumnCount){
        hideSelect();
        gSelectKind = "range";
        gSelectPrime = index2cell(name2row(gSelectPrime.m_name), name2column(gSelectPrime.m_name) - Z, gCurrSheetIndex);
        gSelectStart = index2cell(name2row(gSelectStart.m_name), name2column(gSelectStart.m_name) - Z, gCurrSheetIndex);
        gSelectFinal = index2cell(name2row(gSelectFinal.m_name), name2column(gSelectFinal.m_name) - Z, gCurrSheetIndex);
        showSelect();
        fetchEntry();
    }
    gColumnCount += Z;
    ClipboardDeselected();
    gSpreadsheetDirty = true;
    setTimeout("InsertColumnsTwo(" + Z + ", " + Y + ")", 0);
}
function InsertColumnsTwo(Z, Y){
    for(var X = 0; X < gCellDataArray.length; X ++ ){
        var W = gCellDataArray[X];
        if(W != null){
            if( ! emptyString(W.entry)){
                var V = false;
                var U = W.entry.split('\t');
                for(var T = 1; T < U.length; T += 2){
                    var S = U[T];
                    var R = ColumnLetterToColumnIndex((S.charAt(0) == "$") ? S.substring(1, S.length) : S);
                    if(R >= Y){
                        V = true;
                        var Q = ColumnIndexToColumnLetter(R + Z);
                        U[T] = S.replace(/[a-zA-Z]+/, Q);
                    }
                }
                gCellDataArray[X].entry = U.join('\t');
                if((W.m_cellGUI) && (W.m_cellGUI.type == "menu"))
                    V = true;
                if(V){
                    var P = gCellDataArray[X].entry.replace(/\t/g, "");
                    buildCell(cellData2cell(gCellDataArray[X]), P);
                }
            }
        }
    }
    closeModal();
}
function adjustZeroWidthColumnResizers(Z){
    if((parseInt(index2cell(0, Z - 1, 0).style.width) != 0) && (Z != 1)){
        columnResizer = gColumnResizers[Z - 1];
        columnResizer.style.left = parseInt(columnResizer.style.left) - 3;
    }
    if((Z != gColumnCount - 1) && (parseInt(index2cell(0, Z + 1, 0).style.width) == 0)){
        columnResizer = gColumnResizers[Z];
        columnResizer.style.left = parseInt(columnResizer.style.left) + 6;
    }
    else{
        columnResizer = gColumnResizers[Z];
        columnResizer.style.left = parseInt(columnResizer.style.left) + 3;
    }
}
function SetColumnWidth(Z, Y, X, W){
    var V = getElement("sheet" + Y);
    if(typeof W == "undefined")
        W = getWidth(index2cell(0, Z, Y));
    var U = X - W;
    var T;
    for(T = Z + 1; T < gColumnCount; T ++ ){
        for(var S = 0; S < gRowCount; S ++ ){
            var R = index2cell(S, T, Y);
            setLeft(R, getLeft(R) + U);
        }
    }
    for(T = Math.max(1, Z); T < gColumnCount; T ++ ){
        var Q = gColumnResizers[T];
        setLeft(Q, getLeft(Q) + U);
    }
    if(X == 0){
        adjustZeroWidthColumnResizers(Z);
    }
    if(W == 0){
        if((parseInt(index2cell(0, Z - 1, 0).style.width) != 0) && (Z != 1)){
            Q = gColumnResizers[Z - 1];
            Q.style.left = parseInt(Q.style.left) + 3;
        }
        Q = gColumnResizers[Z];
        Q.style.left = parseInt(Q.style.left) - 3;
    }
    for(S = 0; S < gRowCount; S ++ ){
        R = index2cell(S, Z, Y);
        R.style.visibility = (X == 0) ? "hidden" : "visible";
        SetCellWidth(R, X);
        CheckResizeButton(R);
        if(is.ie5up){
            if((R.cellData) && (R.cellData.m_cellGUI) && (R.cellData.m_cellGUI.type == "menu")){
                var P = getWidth(R) - kPopupWidgetOffset;
                setStyle(getChild(R, "popupWidget"), "left", P);
            }
        }
        rowSpan = R.parentElement;
        setWidth(rowSpan, getWidth(V) + U);
        rowSpan.style.clip = "rect(0px, " + (getWidth(V) + U) + "px, " + getHeight(R) + "px, 0px)";
    }
    setWidth(V, getWidth(V) + U);
    setTimeout("UpdateClipRect();", 0);
    if(is.ie4)
        setTimeout("FixPopupMenuWidgets(" + Z + ", " + Y + ");", 0);
}
function FixPopupMenuWidgets(Z, Y){
    for(var X = 0; X < gRowCount; X ++ ){
        cell = index2cell(X, Z, Y);
        if((cell.cellData) && (cell.cellData.m_cellGUI) && (cell.cellData.m_cellGUI.type == "menu")){
            var W = getWidth(cell) - kPopupWidgetOffset;
            setStyle(getChild(cell, "popupWidget"), "left", W);
        }
    }
}
function UpdateClipRect(){
    if(gClipboardKind != "none"){
        if(gClipboardKind == "range")
            DrawClipboardRect("range");
        else
            DrawClipboardRect("selection");
    }
}
function adjustZeroHeightRowResizers(Z){
    if((parseInt(index2cell(Z - 1, 0, 0).style.height) != 0) && (Z != 1)){
        rowResizer = gRowResizers[Z - 1];
        rowResizer.style.top = parseInt(rowResizer.style.top) - 3;
    }
    if((Z != gRowCount - 1) && (parseInt(index2cell(Z + 1, 0, 0).style.height) == 0)){
        rowResizer = gRowResizers[Z];
        rowResizer.style.top = parseInt(rowResizer.style.top) + 6;
    }
    else{
        rowResizer = gRowResizers[Z];
        rowResizer.style.top = parseInt(rowResizer.style.top) + 3;
    }
}
function SetRowHeight(Z, Y, X, W){
    var V = getElement("sheet" + Y);
    if(typeof W == "undefined")
        W = getHeight(index2cell(0, Z, Y));
    var U = X - W;
    setHeight(V, getHeight(V) + U);
    for(rowIndex = Z + 1; rowIndex < gRowCount; rowIndex ++ ){
        var T = index2cell(rowIndex, 0, Y).parentElement;
        setTop(T, getTop(T) + U);
    }
    for(var S = Math.max(1, Z); S < gRowCount; S ++ ){
        var R = gRowResizers[S];
        setTop(R, getTop(R) + U);
    }
    if(X == 0)
        adjustZeroHeightRowResizers(Z);
    if(W == 0){
        if((parseInt(index2cell(Z - 1, 0, 0).style.height) != 0) && (Z != 1)){
            R = gRowResizers[Z - 1];
            R.style.top = parseInt(R.style.top) + 3;
        }
        R = gRowResizers[Z];
        R.style.top = parseInt(R.style.top) - 3;
    }
    for(columnIndex = 0; columnIndex < gColumnCount; columnIndex ++ ){
        var Q = index2cell(Z, columnIndex, Y);
        setHeight(Q, X);
        CheckResizeButton(Q);
    }
    T = index2cell(Z, 0, Y).parentElement;
    setHeight(T, X);
    T.style.clip = "rect(0px, " + getWidth(V) + "px, " + X + "px, 0px)";
    setTimeout("UpdateClipRect();", 0);
}
function AutofitColumnsWrapper(){
    var Z,
    Y,
    X,
    W;
    if(gSelectKind == "row"){
        hb_alert(getString("strCantAutoFitColumns"), getString("strCantAutoFit"));
        return;
    }
    Z = cell2column(gSelectStart);
    Y = cell2column(gSelectFinal);
    X = Math.min(Z, Y);
    W = Math.max(Z, Y);
    var V;
    for(V = X; V <= W; V ++ ){
        AutofitColumn(V);
    }
}
function AutofitColumn(Z){
    var Y = 0;
    for(rowIndex = 1; rowIndex < gRowCount; rowIndex ++ ){
        var X = index2cell(rowIndex, Z, gCurrSheetIndex);
        var W = getChild(X, "SPAN");
        if(W){
            var V = getChild(W, "NOBR");
            if(V){
                var U = V.offsetWidth + 4;
                if((X.cellData) && (X.cellData.m_cellGUI) && (X.cellData.m_cellGUI.type == "menu")){
                    U += kPopupWidgetOffset;
                }
                Y = max(Y, U);
            }
        }
    }
    Y = min(Y, kColumnMaximum);
    if(Y == 0)
        return;
    SetColumnWidth(Z, 0, Y, getWidth(index2cell(0, Z, gCurrSheetIndex)));
    setTimeout("sheetChanged();", 100);
}
function AutofitRowsWrapper(){
    var Z,
    Y,
    X,
    W;
    if(gSelectKind == "column"){
        hb_alert(getString("strCantAutoFitRows"), getString("strCantAutoFit"));
        return;
    }
    Z = cell2row(gSelectStart);
    Y = cell2row(gSelectFinal);
    X = Math.min(Z, Y);
    W = Math.max(Z, Y);
    var V;
    for(V = X; V <= W; V ++ ){
        AutofitRow(V);
    }
}
function AutofitRow(Z){
    var Y = 0;
    for(columnIndex = 1; columnIndex < gColumnCount; columnIndex ++ ){
        var X = index2cell(Z, columnIndex, gCurrSheetIndex);
        var W = getChild(X, "SPAN");
        if(W){
            var V = getChild(W, "NOBR");
            if(V)
                Y = max(Y, V.offsetHeight + 4);
        }
        else if(X && X.cellData && X.cellData._wrapText){
            X.style.removeAttribute("height");
            Y = max(Y, X.offsetHeight + 4);
        }
    }
    Y = min(Y, kRowMaximum);
    if(Y == 0)
        return;
    SetRowHeight(Z, 0, Y, getHeight(index2cell(Z, 0, gCurrSheetIndex)));
    setTimeout("sheetChanged();", 100);
}
function HandleAdjust(Z){
    var Y = findSelect(false);
    var X;
    switch(gAdjustKind){
        case "width" : 
            X = getElement("rect" + gCurrSheetIndex);
            var W = getWidth(X);
            if((Y.rowMin == 0) && ((gAdjustIndex >= Y.columnMin) && (gAdjustIndex <= Y.columnMax)) && (is.ie5up)){
                if(Y.columnMin == 0)
                    Y.columnMin = 1;
                for(var V = Y.columnMin; V <= Y.columnMax; V ++ ){
                    SetColumnWidth(V, gCurrSheetIndex, W, getWidth(gCellElemMatrix[0][V]));
                }
            }
            else{
                SetColumnWidth(gAdjustIndex, gCurrSheetIndex, W, gAdjustValue);
            }
            setDisplay(X, false);
            setTimeout("sheetChanged();", 100);
            gSpreadsheetDirty = true;
            break;
        case "height" : 
            X = getElement("rect" + gCurrSheetIndex);
            if((Y.columnMin == 0) && ((gAdjustIndex >= Y.rowMin) && (gAdjustIndex <= Y.rowMax)) && (is.ie5up)){
                if(Y.rowMin == 0)
                    Y.rowMin = 1;
                for(var U = Y.rowMin; U <= Y.rowMax; U ++ ){
                    SetRowHeight(U, gCurrSheetIndex, getHeight(X), getHeight(gCellElemMatrix[U][0]));
                }
            }
            else{
                SetRowHeight(gAdjustIndex, gCurrSheetIndex, getHeight(X), gAdjustValue);
            }
            setDisplay(X, false);
            setTimeout("sheetChanged();", 100);
            gSpreadsheetDirty = true;
            break;
        default : 
            break;
    }
}
function CheckResizeButton(Z){
    if(Z && Z.cellData && Z.cellData.entry){
        if(Z.cellData.entry.toLowerCase().indexOf("=button") !=- 1){
            for(i = 0; i < Z.all.length; i ++ ){
                if(Z.all[i].tagName.toLowerCase() == "button"){
                    Z.all[i].style.width = Z.style.width;
                    Z.all[i].style.height = Z.style.height;
                }
            }
        }
    }
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();