//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kDrawMargin = 5;
var kDrawBorder = 1;
var kDrawShadow = 2;
var gDrawing = null;
var gDrawingNode = null;
var kAlphaBullets = ["romanCap", "alphaCap", "numeric", "alpha", "numeric"];
var kGraphicBullets = ["square", "bullet", "guillemet", "dash"];
var kMixedBullets = ["alphaCap", "numericP", "box", "dash"];
var kDefaultBullets = kMixedBullets;
function setupDrawing(){
    gDrawing = getElement("drawing");
    return(gDrawing != null);
}
function finishDrawing(){}
function getDrawing(){
    return gDrawing;
}
function currentDrawing(){
    return gDrawingNode;
}
function boundsDrawing(){
    if(gDrawing == null)
        return newBounds(0, 0, 0, 0);
    var Z = getBounds(gDrawing);
    return offsetBounds(gDstBounds, Z.left, Z.top);
}
function focusDrawing(){
    if(gDrawing)
        gDrawing.focus();
}
function prepareDrawing(Z){
    var Y = newBounds(0, 0, gDrawing.style.pixelHeight - kDrawShadow, gDrawing.style.pixelWidth - kDrawShadow);
    Y = insetBounds(Y, kDrawMargin + kDrawBorder, kDrawMargin + kDrawBorder);
    var X = ratioBounds(Y, sourceRender());
    X = centerBounds(X, Y);
    var W = insetBounds(X ,- kDrawBorder ,- kDrawBorder);
    var V = offsetBounds(W, kDrawShadow, kDrawShadow);
    if(gDrawingNode != null)
        prepareRender(X, true, false, true, Z);
    return {
        "frame" : V,
        "slide" : W
    };
}
function outputDrawing(){
    if(gPageMode != kEditMode || gDrawing == null){
        if(gDrawing){
            setVisible(gDrawing, false);
            finalRender(gDrawing, "");
        }
        return;
    }
    setVisible(gDrawing, true);
    if(targetModel(gDrawingNode) == null){
        var Z = node2slide(targetModel());
        if(Z != gDrawingNode)
            gDrawingNode = Z;
    }
    var Y = prepareDrawing();
    var X = shadowRender(Y.frame);
    X += slideRender(gDrawingNode, kDrawBorder, Y.slide);
    if(gDrawingNode != null)
        X += bodyRender(gDrawingNode, childrenModel(gDrawingNode));
    finalRender(gDrawing, X);
}
function nodeDrawing(Z, Y){
    var X = kindModel(Y);
    var W;
    var V = prepareDrawing(true);
    switch(X){
        case "slide" : 
            W = slide2render(Y);
            if(W == null)
                return false;
            W.outerHTML = slideRender(Z, kDrawBorder, V.slide);
            Y = descendModel(Y, "frame", kTitleName);
            if(Y == null)
                return true;
            break;
        case "text" : 
            Y = ascendModel(Y, "frame");
            break;
        case "textbox" : 
            Y = descendModel(Y, "frame");
            break;
    }
    W = model2drawing(Y);
    if(W == null)
        return false;
    W.outerHTML = nodeRender(Z, Y);
    return true;
}
function changedDrawing(Z){
    if(gDrawing == null)
        return true;
    if(gPageMode != kEditMode)
        return true;
    var Y = node2slide(Z);
    if(gDrawingNode && Y != gDrawingNode){
        if(dependsModel(gDrawingNode, Z) || dependsModel(gDrawingNode, Y))
            Y = gDrawingNode;
    }
    if(Y == gDrawingNode && nodeDrawing(Y, Z))
        return false;
    if(Y == gDrawingNode || Y == null){
        outputDrawing();
        return true;
    }
    if(gPageMode == kEditMode){
        Z = targetModel();
        Y = node2slide(Z);
        if(Y != gDrawingNode){
            closeHandle();
            gDrawingNode = Y;
            outputDrawing();
            openHandle(Z);
            return true;
        }
    }
    return false;
}
function selectedDrawing(Z){
    if(Z &&! Z.selected){
        closeHandle();
        return;
    }
    var Y = node2slide(Z);
    if(Y != gDrawingNode){
        gDrawingNode = Y;
        outputDrawing();
    }
    openHandle(Z);
}
function insideDrawing(Z){
    if(gDrawing != null){
        while(Z != null){
            if(Z == gDrawing)
                return true;
            Z = Z.parentElement;
        }
    }
    return false;
}
function hitDrawing(Z, Y){
    var X = toggleHandle(false);
    var W = toggleEditor(false);
    var V = gDocument.elementFromPoint(Z.clientX, Z.clientY);
    toggleEditor(W);
    toggleHandle(X);
    if(V && V.name && V.name.match(/grabber\d/) != null)
        return V;
    return Y;
}
function priorityDrawing(Z){
    if(Z && Z.name && Z.name.match(/grabber\d/) != null)
        return true;
    return false;
}
function drawing2model(Z){
    Z = element2drawing(Z);
    if(Z == null)
        return null;
    var Y = deUniqueIndexName(Z.name);
    if(index2slide(Y) != gDrawingNode)
        return null;
    return index2model(Y);
}
function deUniqueIndexName(Z){
    if((Z == null) || (Z == ""))
        return null;
    var Y = Z.match(/^x\d+/);
    return(Y ? Y[0] : null);
}
function model2drawing(Z){
    if(Z != null && gDrawing != null){
        var Y = gDrawing.all;
        for(var X = 0; X < Y.length; X ++ ){
            var W = Y[X].name;
            if(W && deUniqueIndexName(W) == Z.index)
                if(W.indexOf(/grabber\d/) ==- 1)
                    return Y[X];
        }
    }
    return null;
}
function point2drawing(Z, Y){
    var X = toggleHandle(false);
    var W = gDocument.elementFromPoint(Z, Y);
    toggleHandle(X);
    return element2drawing(W);
}
function element2drawing(Z){
    return element2render(Z);
}
var kSortThumbCellSize = 120;
var kSortImageBorder = 10;
var kSortTitleHeight = 20;
var kSortSlideBorder = 1;
var kSortSlideShadow = 1;
var kSortLocusMargin = 3;
var kSortLocusBorder = 2;
var gSorting = null;
function setupSorting(){
    gSorting = getElement("sorting");
    return(gSorting != null);
}
function finishSorting(){}
function getSorting(){
    return gSorting;
}
function focusSorting(){
    if(gSorting)
        gSorting.focus();
}
function boundsSorting(){
    if(gSorting == null)
        return newBounds(0, 0, 0, 0);
    return getBounds(gSorting);
}
function thumbsSorting(Z){
    if(gSorting == null)
        return null;
    var Y = gSorting.children.length;
    var X = gSorting.children[Y - 1];
    if(Z == null){
        X.style.top = 0;
        X.style.left = 0;
        X.style.display = "none";
        return null;
    }
    var W = getBounds(Z);
    setBounds(X, W);
    X.style.display = "inline";
    return W;
}
function ghostSorting(Z){
    var Y = gSorting ? gSorting.children[gSorting.children.length - 1] : null;
    var X = Y ? Y.style.display : "none";
    if(Y){
        if(Z)
            Y.style.display = "inline";
        else
            Y.style.display = "none";
    }
    return(X != "none");
}
function deltaSorting(Z, Y, X, W, V){
    if(gSorting == null)
        return;
    var U = gSorting.children.length;
    var T = gSorting.children[U - 1];
    if(W.left + Y < V.left)
        Y = V.left - W.left;
    else if(W.right + Y > V.right)
        Y = V.right - W.right;
    if(W.top + X < V.top)
        X = V.top - W.top;
    else if(W.bottom + X > V.bottom)
        X = V.bottom - W.bottom;
    setBounds(T, offsetBounds(W, Y, X));
}
function dropSorting(Z, Y, X, W){
    if(Y == null)
        return;
    var V = Y.element;
    var U = element2sorting(Z);
    var T = element2sorting(V);
    if((U == null) || (T == null))
        return false;
    if(U == T)
        return false;
    var S = sorting2model(U);
    var R = sorting2model(T);
    var Q = folderModel(S);
    var P = folderModel(R);
    if(Q != P)
        return false;
    return dropCommand(S, R, Y.first, W, X);
}
function rowsizeSorting(Z){
    var Y = Z.style.pixelWidth - kScrollWidth + 25;
    var X = floorScalar(Y / kSortThumbCellSize);
    if(X < 1)
        X = 1;
    return X;
}
function offsetSorting(Z, Y){
    var X = floorScalar(Y / Z.thumbsPerLine);
    var W = Y % Z.thumbsPerLine;
    return {
        "h" : W * Z.thumbWidth,
        "v" : X * Z.thumbHeight
    };
}
function prepareSorting(Z){
    var Y = rowsizeSorting(gSorting);
    var X = kSortThumbCellSize;
    var W = X;
    var V = newBounds(0, 0, W, X);
    var U = insetBounds(V, kSortImageBorder, kSortImageBorder);
    var T = newBounds(V.bottom - kSortTitleHeight, U.left, V.bottom, U.right);
    var S = newBounds(0, 0, U.height - kSortSlideShadow, U.width - kSortSlideShadow);
    S = offsetBounds(S, U.left, U.top);
    S = insetBounds(S, kSortSlideBorder, kSortSlideBorder);
    var R = ratioBounds(S, sourceRender());
    R = centerBounds(R, S);
    var Q = insetBounds(R ,- kSortSlideBorder ,- kSortSlideBorder);
    var P = offsetBounds(Q, kSortSlideShadow, kSortSlideShadow);
    var O = insetBounds(R ,- kSortLocusMargin ,- kSortLocusMargin);
    prepareRender(R, true, false, false, Z);
    return {
        "thumbsPerLine" : Y,
        "thumbWidth" : X,
        "thumbHeight" : W,
        "group" : V,
        "inner" : R,
        "label" : T,
        "slide" : Q,
        "frame" : P,
        "locus" : O
    };
}
function outputSorting(Z){
    if(gPageMode != kSortMode || gSorting == null){
        killSorting();
        return;
    }
    var Y = prepareSorting();
    if( ! Z){
        if(gSorting.children && gSorting.children[0] && shuffleSorting(Y))
            return;
    }
    var X = descendModel(getModel(), "folder", kSlidesName);
    var W = "";
    var V = Y.group;
    var U = countModel(X);
    gSortingList = new Array();
    var T = 5;
    for(var S = 0; S < U; S ++ ){
        var R = childModel(X, S);
        var Q = offsetSorting(Y, S);
        V = offsetBounds(Y.group, Q.h, Q.v);
        var P = ( ! is.nav4) && (S >= T);
        if(P)
            delaySorting(R);
        W += blockRender({
            "bounds" : V
        }, nameRender(R.index), slideSorting(R, Y, P));
    }
    if(gSortingList.length > 0)
        gSortingTimer = setTimeout("timerSorting();", 10);
    var O = blockRender({
        "bounds" : Y.locus, "borderWidth" : kSortLocusBorder,
        "borderStyle" : "solid",
        "color" : "lightblue"
    });
    W += blockRender({
        "bounds" : V,
        "other" : " display: none;"
    }, null, O);
    finalRender(gSorting, W);
}
function shuffleSorting(Z, Y, X){
    var W = getBounds(gSorting);
    var V = descendModel(getModel(), "folder", kSlidesName);
    for(var U = 0; U < countModel(V); U ++ ){
        var T = childModel(V, U);
        var S = model2sorting(T);
        if(S == null){
            if(Y){
                if(X){
                    nodeSorting(T);
                    S = model2sorting(T);
                }
                else
                    continue;
            }
            return false;
        }
        var R = offsetSorting(Z, U);
        var Q = offsetBounds(Z.group, R.h + W.left, R.v + W.top);
        var P = getBounds(S);
        if( ! equalBounds(P, Q))
            setBounds(S, Q);
    }
    for(U = gSorting.children.length - 2; U >= 0; -- U){
        S = gSorting.children[U];
        var O = sorting2model(S);
        S.style.visibility = (O == null) ? 'hidden' : 'inherit';
    }
    return true;
}
function slotSorting(Z, Y){
    return blockRender({
        "bounds" : Y.group
    }, nameRender(Z.index));
}
function slideSorting(Z, Y, X, W, V){
    var U = shadowRender(Y.frame);
    U += slideRender(Z, kSortSlideBorder, Y.slide);
    if( ! X)
        U += bodyRender(Z, childrenModel(Z));
    var T = textModel(Z);
    if(T == "" &&! W)
        T = null;
    else
        T = "<nobr>" + T + (W ? " (slide " + W + " of " + countModel(ascendModel(Z, "folder")) + ")" : "") + "</nobr>";
    U += blockRender({
        "bounds" : Y.label,
        "textAlign" : "center"
    }, " class=title", T);
    if( ! V){
        width = ( ! V && Z.selected) ? kSortLocusBorder : 0;
        var S = 
        {
            "bounds" : Y.locus, "borderWidth" : width,
            "borderStyle" : "solid"
        };
        S.borderDefault = "0px solid black";
        U += blockRender(S);
    }
    return U;
}
function nodeSorting(Z){
    var Y = null;
    var X = model2sorting(Z);
    if(X == null){
        Y = prepareSorting(true);
        var W = slotSorting(Z, Y);
        var V = gSorting.children[gSorting.children.length - 1];
        V.insertAdjacentHTML("BeforeBegin", W);
        shuffleSorting(Y, true);
        X = model2sorting(Z);
        if(X == null)
            return false;
    }
    if(Y == null)
        Y = prepareSorting(true);
    finalRender(X, slideSorting(Z, Y));
    return true;
}
function changedSorting(Z){
    if(gSorting == null)
        return true;
    if(gPageMode != kSortMode)
        return true;
    if(kindModel(Z) == "folder"){
        shuffleSorting(prepareSorting(false), true, true);
        return false;
    }
    var Y = node2slide(Z);
    if(folderModel(Y) == kMastersName){
        if(is.nav4){
            outputSorting(true);
            return true;
        }
        else{
            var X = descendModel(getModel(), "folder", kSlidesName);
            for(var W = 0; W < countModel(X); W ++ ){
                var V = childModel(X, W);
                if(dependsModel(V, Y))
                    delaySorting(V);
            }
            timerSorting();
            return false;
        }
    }
    if(Y && nodeSorting(Y)){
        undelaySorting(Y);
        return false;
    }
    outputSorting(true);
    return true;
}
function selectedSorting(Z){
    Z = node2slide(Z);
    var Y = model2sorting(Z);
    if(Y != null){
        var X = Y.children[Y.children.length - 1];
        var W = Z.selected ? kSortLocusBorder : 0;
        if(W != X.style.borderWidth)
            X.style.borderWidth = W;
        if(Z.selected)
            revealChild(gSorting, Y);
    }
}
function killSorting(){
    if(gSorting){
        finalRender(gSorting, "");
        setVisible(gSorting, false);
    }
    gSortingList = new Array();
    gSortingTimer = killTimeout(gSortingTimer);
}
var gSortingList = new Array();
var gSortingTimer = null;
function delaySorting(Z){
    if(gSortingList == null)
        gSortingList = new Array();
    gSortingList[gSortingList.length] = Z.index;
}
function undelaySorting(Z){
    if(gSortingList == null)
        return;
    var Y = Z.index;
    var X = gSortingList.length;
    if(X == 1 && gSortingList[0] == Y){
        gSortingList = new Array();
        return;
    }
    for(var W = X - 1; W >= 0; -- W){
        if(gSortingList[W] == Y){
            tail = gSortingList.slice(W + 1, X);
            gSortingList = gSortingList.slice(0, W).concat(tail);
            break;
        }
    }
}
function timerSorting(){
    gSortingTimer = killTimeout(gSortingTimer);
    if(gPageMode != kSortMode)
        gSortingList = new Array();
    if( ! gSortingList || gSortingList.length == 0)
        return;
    var Z = index2model(gSortingList[0]);
    if(Z)
        nodeSorting(Z);
    gSortingList = gSortingList.slice(1);
    if(gSortingList.length)
        gSortingTimer = setTimeout("timerSorting();", 10);
}
function insideSorting(Z){
    if(gSorting != null){
        while(Z != null){
            if(Z == gSorting)
                return true;
            Z = Z.parentElement;
        }
    }
    return false;
}
function sorting2model(Z){
    Z = element2sorting(Z);
    if(Z == null)
        return null;
    return index2model(deUniqueIndexName(Z.name));
}
function model2sorting(Z){
    if(Z != null && gSorting != null){
        var Y = gSorting.children;
        for(var X = 0; X < Y.length; X ++ )
            if(Y[X].name == Z.index)
                return Y[X];
    }
    return null;
}
function defaultSorting(){
    if(gSorting == null || gSorting.children == null || gSorting.children.length < 2)
        return null;
    var Z = descendModel(getModel(), "folder", kSlidesName);
    if(Z)
        Z = childModel(Z, countModel(Z) - 1);
    var Y = model2sorting(Z);
    if(Y == null)
        return null;
    return {
        "element" : Y,
        "first" : false
    };
}
function point2sorting(Z, Y, X){
    var W = ghostSorting(false);
    var V = gDocument.elementFromPoint(Z, Y);
    ghostSorting(W);
    V = element2sorting(V);
    if(V == null)
        return X ? defaultSorting() : null;
    var U = getBounds(V);
    var T = (U.left + U.right) / 2;
    return {
        "element" : V,
        "first" : (Z < T)
    };
}
function element2sorting(Z){
    return element2render(Z);
}
var kOneUpWidth = 840;
var kTwoUpWidth = 550;
var kThreeUpWidth = 350;
var kFourUpWidth = 390;
var slideWidths = new Array(kOneUpWidth, kTwoUpWidth, kThreeUpWidth, kFourUpWidth);
var kPrintTitleHeight = 40;
var kPrintImageBorder = 10;
var kPrintSlideBorder = 1;
var kPrintSlideShadow = 1;
var kPrintLocusMargin = 3;
var kPrintLocusBorder = 2;
var gPrintInProgress = 0;
function outputPrinting(Z){
    var Y = preparePrinting(Z);
    var X = descendModel(getModel(), "folder", kSlidesName);
    var W = "";
    var V = countModel(X);
    var U = slideWidths[Z - 1];
    var T,
    S = 0;
    gPrintInProgress = 1;
    var R = '';
    for(var Q = 0; Q < V; Q ++ ){
        var P = childModel(X, Q);
        W += inlineRender({
            "other" : ("position:relative; width: " + U + "; height:" + Math.round(U * .75 + kPrintTitleHeight))
        }, null, slideSorting(P, Y, false, Q + 1, true));
        if((Z == 4) && (Q % 2 == 0))
            W += inlineRender({
            "other" : "width:20px;"
        });
        if(Q % Z == (Z - 1)){
            R += blockRender({
                "other" : "page-break-after:always;"
            }, null, W);
            W = "";
        }
    }
    if(W != "")
        R += blockRender(null, null, W);
    gPrintInProgress = 0;
    switch(Z){
        case 1 : 
        case 4 : 
            T = 880;
            S = 550;
            break;
        case 2 : 
        case 3 : 
            T = 585;
            S = 550;
            break;
    }
    ShowPrintable(R, gPrintCSS, T, S);
}
function preparePrinting(Z){
    var Y = slideWidths[Z - 1];
    var X = Math.round(Y * .75 + kPrintTitleHeight);
    var W = newBounds(0, 0, X, Y);
    var V = newBounds(0, 0, W.bottom - kPrintTitleHeight, W.right);
    var U = newBounds(W.bottom - kPrintTitleHeight, V.left, W.bottom, V.right);
    var T = newBounds(0, 0, V.height - kPrintSlideShadow, V.width - kPrintSlideShadow);
    T = offsetBounds(T, V.left, V.top);
    T = insetBounds(T, kPrintSlideBorder, kPrintSlideBorder);
    var S = ratioBounds(T, sourceRender());
    S = centerBounds(S, T);
    var R = insetBounds(S ,- kPrintSlideBorder ,- kPrintSlideBorder);
    var Q = offsetBounds(R, kPrintSlideShadow, kPrintSlideShadow);
    var P = insetBounds(S ,- kPrintLocusMargin ,- kPrintLocusMargin);
    prepareRender(S, false, false, false);
    return {
        "label" : U,
        "slide" : R,
        "frame" : Q,
        "locus" : P
    };
}
var kShowMargin = 5;
var kShowBorder = 1;
var kShowShadow = 2;
var gShowing = null;
var gShowingNode = null;
function setupShowing(){
    gShowing = getElement("showing");
    if(gShowing && kMode == "embed" &&! getElement("iconPalette")){
        kShowMargin = 0;
        setStyle(gShowing, "backgroundColor", "black");
    }
    return(gShowing != null);
}
function finishShowing(){}
function getShowing(){
    return gShowing;
}
function focusShowing(){
    if(gShowing)
        gShowing.focus();
}
function prepareShowing(Z){
    var Y = newBounds(0, 0, gShowing.style.pixelHeight - kShowShadow, gShowing.style.pixelWidth - kShowShadow);
    Y = insetBounds(Y, kShowMargin + kShowBorder, kShowMargin + kShowBorder);
    if(kMode == "design")
        Y = insetBounds(Y, 0, 26);
    var X = ratioBounds(Y, sourceRender());
    X = centerBounds(X, Y);
    var W = insetBounds(X ,- kShowBorder ,- kShowBorder);
    var V = offsetBounds(W, kShowShadow, kShowShadow);
    if(gShowingNode != null)
        prepareRender(X, false, false, false, Z);
    return {
        "outer" : Y,
        "frame" : V,
        "slide" : W
    };
}
function outputShowing(){
    if(gPageMode != kShowMode || gShowing == null){
        if(gShowing){
            setVisible(gShowing, false);
            finalRender(gShowing, "");
        }
        return;
    }
    setVisible(gShowing, true);
    var Z = prepareShowing(false);
    var Y = shadowRender(Z.frame);
    Y += slideRender(gShowingNode, kShowBorder, Z.slide);
    if(gShowingNode != null)
        Y += bodyRender(gShowingNode, childrenModel(gShowingNode));
    if(kMode == "design" && gFooterList && (gFooterList.length > 0)){
        Y += blockRender({
            "bounds" : Z.outer
        }, nameRender("mouseTrap1", true) + " onmouseover='showHideFooter(false)' ");
        var X = newBounds(Z.outer.bottom + 2, Z.outer.left, Z.outer.bottom + 26, Z.outer.right);
        Y += blockRender({
            "bounds" : X
        }, nameRender("mouseTrap2", true) + " onmouseover='showHideFooter(true)' ");
    }
    finalRender(gShowing, Y);
}
function showHideFooter(Z){
    var Y = getElement("mouseTrap1");
    if(Y)
        setVisible(Y, Z);
    Y = getElement("mouseTrap2");
    if(Y)
        setVisible(Y ,! Z);
    for(index = 0; index < gFooterList.length; index ++ )
        setVisible(gFooterList[index], Z);
}
function selectedShowing(Z){
    if(Z != null &&! Z.selected)
        return;
    Z = node2slide(Z);
    if(Z != gShowingNode){
        gShowingNode = Z;
        outputShowing();
    }
}
function nodeShowing(Z, Y){
    var X = kindModel(Y);
    var W;
    var V = prepareShowing(true);
    switch(X){
        case "slide" : 
            if(is.nav4)
                return false;
            W = slide2render(Y);
            if(W == null)
                return false;
            W.outerHTML = slideRender(Z, kShowBorder, V.slide);
            Y = descendModel(Y, "frame", kTitleName);
            if(Y == null)
                return true;
            break;
        case "text" : 
            Y = ascendModel(Y, "frame");
            break;
        case "textbox" : 
            Y = descendModel(Y, "frame");
            break;
        default : 
            if(is.nav4)
                return false;
            break;
    }
    W = model2showing(Y);
    if(W == null)
        return false;
    W.outerHTML = nodeRender(Z, Y);
    return true;
}
function changedShowing(Z){
    if(gShowing == null)
        return true;
    if(gPageMode != kShowMode)
        return true;
    var Y = node2slide(Z);
    if(gShowingNode && Y != gShowingNode){
        if(dependsModel(gShowingNode, Z) || dependsModel(gShowingNode, Y))
            Y = gShowingNode;
    }
    if(Y == gShowingNode && nodeShowing(Y, Z))
        return false;
    if(Y == gShowingNode || Y == null){
        outputShowing();
        return true;
    }
    return false;
}
function insideShowing(Z){
    if(gShowing != null){
        while(Z != null){
            if(Z == gShowing)
                return true;
            Z = getParent(Z);
        }
    }
    return false;
}
function showing2model(Z){
    Z = element2showing(Z);
    if(Z == null)
        return null;
    return index2model(deUniqueIndexName(Z.name));
}
function model2showing(Z){
    if(Z != null && gShowing != null){
        var Y = gShowing.all;
        for(var X = 0; X < Y.length; X ++ ){
            var W = Y[X].name;
            if(W && deUniqueIndexName(W) == Z.index)
                return Y[X];
        }
    }
    return null;
}
function element2showing(Z){
    return element2render(Z);
}
var kSlideHeight = 6000;
var kSlideWidth = 8000;
var kSlideFontFamily = "arial,helvetica,sans-serif";
var kSlideFontSize = 36;
var gSrcBounds = null;
var gDstBounds = null;
var gTitleFake = null;
var gItemsFake = null;
var gItemsHints = false;
var gFrameHandles = false;
var gBorderDefault = null;
var gTextCursor = "";
var kRenderLineHeight = "110%";
var kRenderLineStyle = " line-height:" + kRenderLineHeight + "; ";
function setupRender(){
    gSrcBounds = newBounds(0, 0, kSlideHeight, kSlideWidth);
}
function finishRender(){}
function sourceRender(){
    return gSrcBounds;
}
function prepareRender(Z, Y, X, W, V){
    gDstBounds = Z;
    if(Y)
        gBorderDefault = "1px solid lightblue";
    else
        gBorderDefault = "";
    gTextCursor = W ? "text" : "default";
    gTitleFake = X;
    gItemsFake = X;
    gFrameHandles = gItemsHints = W;
    gRecycling = V;
}
function finalRender(Z, Y){
    setElementSrc(Z, Y, true, 1);
}
function interiorBounds(Z, Y, X){
    if(Z == null && (Y == null || Y.bounds == null))
        return newBounds(0, 0, 0, 0);
    var W = Y ? Y.bounds : null;
    if(W == null)
        W = mapBounds(retrieveModel(Z, "bounds"), gSrcBounds, gDstBounds);
    var V = Y ? Y.borderWidth : Z ? retrieveModel(Z, "borderWidth") : 0;
    if(V == null || V == "")
        V = 0;
    else if(typeof V == "string")
        V = parseInt(V);
    if(V != 0){
        if(X)
            W = insetBounds(W, V, V);
        else{
            V *= 2;
            W.width -= V;
            if(W.width < 0)
                W.width = 0;
            W.right = W.left + W.width;
            W.height -= V;
            if(W.height < 0)
                W.height = 0;
            W.bottom = W.top + W.height;
        }
    }
    return W;
}
function spacerRender(Z, Y, X){
    return "";
}
function shadowRender(Z){
    return blockRender({
        "bounds" : Z,
        "backgroundColor" : "black"
    });
}
function slideRender(Z, Y, X){
    var W = retrieveModel(Z, "backgroundColor");
    if(emptyColor(W))
        W = "white";
    var V = "";
    var U = 
    {
        "bounds" : X, "backgroundColor" : W
    };
    var T = retrieveModel(Z, "background");
    if(T && (T != "") && (T[T.length - 1] != "/")){
        var S = retrieveDefault(Z, "pictureMode", "raw");
        if(S == "raw"){
            U.backgroundImage = T;
            U.backgroundRepeat = retrieveDefault(Z, "tiling", "repeat");
        }
        else{
            var R = interiorBounds(null, 
            {
                "bounds" : X, "borderWidth" : Y
            });
            V = "<img src='" + T + "' height=" + R.height + " width=" + R.width + ">";
        }
    };
    var Q = (Z ? nameRender("slide" + Z.index, true) : "");
    if(V == "")
        V = null;
    if(Y > 0){
        U.borderWidth = Y;
        U.borderStyle = "solid";
    }
    return blockRender(U, Q, V);
}
function itemsRender(Z, Y, X, W, V){
    if(Y == null)
        Y = 0;
    if(X == null)
        X = 0;
    if(W == null)
        W = 1;
    if(V == null)
        V = 1;
    var U = "";
    switch(kindModel(Z)){
        case "text" : ;
        var T = retrieveModel(Z, "bullet1");
        if(T == null){
            var S = ascendModel(Z, "frame");
            if(S){
                T = retrieveModel(S, "bullets");
                if(T == null || typeof(T) == "string")
                    T = kDefaultBullets;
                T = T[Y - 1];
            }
        }
        var R = node2style(Z, gFontKeys);
        var Q = bulletWidth(T, R.fontSizeScaled, V);
        var P = retrieveModel(Z, "textAlign");
        if(P == null){
            var O = ascendModel(Z, "frame");
            if(O)
                P = retrieveModel(O, "textAlign");
        }
        if(P == null)
            P = "left";
        U += "\n<table border=0 cellspacing=0 cellpadding=0";
        var N = 0;
        if(P != "left")
            U += " width=100%";
        U += "><tr>";
        var M = null;
        var L = textModel(Z);
        switch(P){
            case "center" : 
                M = "<td align=center valign=top>";
            case "right" : 
                if(M == null)
                    M = "<td align=right valign=top>";
                U += M;
                if(T != "" && T != "none"){
                    U += inlineRender(bullet2style(R, T), null, bulletText(T, W, R.fontSizeScaled, R.fontColor ? R.fontColor : "black", true));
                    U += inlineRender(cloneObject(R, gFontKeysPlain), null, "&nbsp;");
                }
                U += inlineRender(R, nameRender(Z.index + "drawing", true), L) + "</td>";
                break;
            default : 
                U += "<td align=right valign=top width=" + (X + Q) + ">";
                if(X > 0)
                    U += spacerRender("horizontal", X);
                U += inlineRender(bullet2style(R, T), null, bulletText(T, W, R.fontSizeScaled, R.fontColor ? R.fontColor : "black", false));
                U += "</td>";
                if(T != "" && T != "none")
                    U += "<td>" + inlineRender(cloneObject(R, gFontKeysPlain), null, "&nbsp;") + "</td>";
                var K = "";
                if(L == ""){
                    L = "&nbsp;";
                    K = " width:50px; cursor:" + gTextCursor + ";";
                }
                U += "<td align=left valign=top";
                R.other = K;
                U += ">" + inlineRender(R, nameRender(Z.index + "drawing", true), L) + "</td>";
                delete(R.other);
                break;
        }
        U += "</tr><tr>";
        U += "<td>" + inlineRender({
            "other" : ("font-size:" + Math.round(R.fontSizeScaled / 3) + "pt;")
        }, null, "&nbsp;");
        U += "</td></tr></table>";
        var J = Q;
        if(J < R.fontSizeScaled)
            J = R.fontSizeScaled;
        X += J;
        break;
    default : 
        break;
}
switch(kindModel(Z)){
    case "frame" : 
        Y = 0;
    case "text" : 
        if(Z.child.length > 0){
            var I = 0;
            for(var H = 0; H < Z.child.length; H ++ ){
                var G = Z.child[H];
                if(G.kind == "text") ++ I;
                U += itemsRender(G, Y + 1, X, I, Z.child.length);
            }
        }
        break;
    default : 
        break;
}
return U;
}
function handleOne(Z, Y, X){
    var W = blockRender({
        "bounds" : Y, "other" : (" z-index:100; cursor:default;")
    }, nameRender(Z, true));
    var V = X ? getElement(Z) : null;
    if(V){
        V.outerHTML = W;
        return "";
    }
    return W;
}
function grabberRender(Z, Y){
    var X = "";
    var W = Z.index + kindModel(Z) + "grabber";
    var V = mapBounds(retrieveModel(Z, "bounds"), gSrcBounds, gDstBounds);
    var U = newBounds(V.top - 4, V.left - 4, V.top + 5, V.right + 5);
    X += handleOne(W + "0", U, Y);
    U = newBounds(V.top - 4, V.left - 4, V.bottom + 5, V.left + 5);
    X += handleOne(W + "1", U, Y);
    U = newBounds(V.bottom - 4, V.left - 4, V.bottom + 5, V.right + 5);
    X += handleOne(W + "2", U, Y);
    U = newBounds(V.top - 4, V.right - 4, V.bottom + 5, V.right + 5);
    X += handleOne(W + "3", U, Y);
    return X;
}
function grabberActivate(Z, Y){
    return;
    var X = kindModel(Z);
    switch(X){
        case "frame" : 
        case "hline" : 
        case "vline" : 
            var W = Z.index + X + "grabber";
            var V = Y ? "lightblue" : "transparent";
            var U = Y ? "move" : "default";
            for(var T = 0; T <= 3; ++ T){
                var S = getElement(W + T);
                if(S){
                    setStyle(S, "cursor", U);
                    setBackgroundColor(S, V);
                }
            }
            break;
    }
}
function frameRender(Z, Y, X){
    var W = "";
    var V = "";
    var U = true;
    var T = textModel(Y);
    var S = (node2slide(Y) != Z);
    var R = (S ? false : gItemsHints);
    var Q = node2style(Y);
    Q.cursor = S ? "default" : gTextCursor;
    if(containsString(T, kItemsName, "prefix")){
        V = itemsRender(Y);
        U = gItemsFake;
        if(R && V == ""){
            V = "&nbspClick to add text";
            Q = node2style(index2model(masterModel(Y, true)), gFontKeys, Q);
        }
    }
    else{
        var P = "", O = null, N;
        if(T == kTitleName){
            O = Z;
            N = "title";
        }
        else if(T == kTextboxName){
            O = parentModel(Y);
            N = "text";
        }
        P = textModel(O);
        if(R && P == "")
            P = "&nbspClick to add " + N;
        Q = node2style(O, gFontKeys, Q);
        var M = node2style(O, gFontKeys);
        M.cursor = Q.cursor;
        V = inlineRender(M, nameRender(O.index + "drawing", true), P);
        U = gTitleFake;
    }
    if(U){
        Q.backgroundColor = "lightgrey;";
        delete(Q.borderWidth);
    }
    else if( ! S)
        Q.borderDefault = gBorderDefault;
    if(is.nav4 && X)
        W = V;
    else
        W = blockRender(Q, nameRender(Y.index, true), V);
    if(gFrameHandles)
        W += grabberRender(Y, X);
    return W;
}
function nodeRender(Z, Y){
    var X = "";
    var W = null, V = null;
    var U = kindModel(Y);
    switch(U){
        case "hline" : 
        case "vline" : 
            W = mapBounds(retrieveModel(Y, "bounds"), gSrcBounds, gDstBounds);
            var T = parseInt(retrieveDefault(Y, "borderWidth", "2"));
            if(U == "hline"){
                W.height = T;
                W.bottom = W.top + T;
            }
            else{
                W.width = T;
                W.right = W.left + T;
            }
            V = 
            {
                "bounds" : W, "backgroundColor" : retrieveDefault(Y, "color", "black")
            };
            X = blockRender(V, nameRender(Y.index));
            if(gFrameHandles)
                X += grabberRender(Y, gRecycling);
            break;
        case "grid" : 
            V = node2basics(Y, true);
            X = blockRender(V, nameRender(Y.index), sheetRender(Y));
            break;
        case "shape" : 
            V = node2style(Y);
            if(node2slide(Y) == Z)
                V.borderDefault = gBorderDefault;
            X = blockRender(V, nameRender(Y.index));
            break;
        case "blend" : 
            var S = retrieveModel(Y, "color");
            var R = retrieveModel(Y, "backgroundColor");
            var Q = false;
            if(S == null){
                S = R;
                R = null;
                Q = true;
            }
            X = "";
            if(R != null)
                X += blockRender({
                "bounds" : nodeBounds(Y, true),
                "backgroundColor" : R
            });
            if(S != null)
                X += blockRender({
                "bounds" : nodeBounds(Y, true),
                "backgroundColor" : S,
                "other" : blendRender(Y, Q)
            });
            X = blockRender({
                "bounds" : nodeBounds(Y)
            }, nameRender(Y.index), X);
            break;
        case "picture" : 
            var P = retrieveDefault(Y, "pictureMode", "scale");
            V = node2basics(Y, true);
            V = picture2style(Y, P, V);
            X = blockRender(V, nameRender(Y.index), pictureRender(Y, P));
            break;
        case "frame" : 
            X += frameRender(Z, Y, gRecycling);
            break;
        default : 
            break;
    }
    return X;
}
var gHighOrderKinds = 
{
    "frame" : true
};
function kindRender(Z, Y, X, W){
    if(X == null)
        X = Y.child;
    if(W == null)
        W = true;
    var V = "";
    var U = (gHighOrderKinds[kindModel(Y)] != null);
    if(U == W)
        V += nodeRender(Z, Y);
    for(var T = 0; T < X.length; T ++ )
        V += kindRender(Z, X[T], null, W);
    return V;
}
function bodyRender(Z, Y){
    var X = "";
    X += kindRender(Z, Z, Y, false);
    X += kindRender(Z, Z, Y, true);
    return X;
}
function nodeBounds(Z, Y){
    var X = retrieveModel(Z, "bounds");
    if(X){
        X = mapBounds(X, gSrcBounds, gDstBounds);
        if(Y)
            X.top = X.left = 0;
    }
    return X;
}
function node2basics(Z, Y){
    var X = 
    {
        "bounds" : true, "backgroundColor" : true
    };
    if(Y){
        X.borderWidth = true;
        X.borderStyle = true;
        X.color = true;
    }
    return node2style(Z, X);
}
function basicRender(Z){
    if(Z == null)
        Z = new Object();
    var Y = Z.boundsScaled ? Z.boundsScaled : Z.bounds;
    var X = "";
    if(Y)
        X += " position:absolute; " + " top:" + Y.top + "; left:" + Y.left + "; width:" + Y.width + "; height:" + Y.height + "; overflow:hidden;";
    if(Z.backgroundColor)
        X += " background-color:" + Z.backgroundColor + ";";
    if(Z.backgroundImage){
        X += " background-image:" + "url(" + Z.backgroundImage + ");";
        if(Z.backgroundRepeat)
            X += " background-repeat:" + Z.backgroundRepeat + ";";
        if(Z.backgroundPosition)
            X += " background-position:" + Z.backgroundPosition + ";";
    }
    if(Z.cursor)
        X += " cursor:" + Z.cursor + ";";
    return X;
}
function nameRender(Z, Y){
    var X = " name=" + Z;
    if(Y)
        X += " id=" + Z;
    return X;
}
function tagRender(Z, Y, X, W){
    if(Y == null)
        Y = "";
    else if(Y != "")
        Y = " style='" + Y + "'";
    if(X == null)
        X = "";
    if(W == null)
        W = "";
    return "<" + Z + " " + X + Y + ">" + W + "</" + Z + ">";
}
function inlineRender(Z, Y, X){
    if(Z == null)
        Z = new Object();
    var W,
    V = fontRender(Z, true);
    if(Z.other)
        V += Z.other;
    V += basicRender(Z);
    W = "span";
    return tagRender(W, V, Y, X);
}
function blockRender(Z, Y, X){
    var W = "";
    if(Z == null)
        Z = new Object();
    var V;
    var U = is.nav4 ? "" : fontRender(Z);
    if(Z.other)
        U += Z.other;
    if(Z.textAlign != null)
        U += " text-align:" + Z.textAlign + ";";
    U += basicRender(Z) + borderRender(Z);
    V = "div";
    var T = "";
    if(X != null && X.length > 1 && X.charAt(0) == "<" && X.charAt(X.length - 1) == ">")
        X = "\n" + X + "\n";
    return W + "\n" + tagRender(V, U, Y, X);
}
function borderRender(Z){
    var Y = "";
    var X = Z.borderWidth;
    if(X == null || X == "")
        X = 0;
    else if(typeof X == "string")
        X = parseInt(X);
    var W = emptyColor(Z.color) ? "black" : Z.color;
    var V = Z.borderStyle;
    if(X == 0 || V == null)
        Y += Z.borderDefault ? (" border:" + Z.borderDefault + ";") : "";
    else
        Y += " border: " + X + "px " + V + " " + W + ";";
    return Y;
}
function blendRender(Z, Y){
    var X = 0;
    switch(retrieveModel(Z, "blendStyle")){
        case "none" : 
            X = 0;
            break;
        case "linear" : 
            X = 1;
            break;
        case "radial" : 
            X = 2;
            break;
        case "rectangular" : 
            X = 3;
            break;
        default : 
            break;
    }
    var W = 100;
    var V = 0;
    if(Y){
        W = 0;
        V = 100;
    }
    var U = mapBounds(retrieveModel(Z, "bounds"), gSrcBounds, gDstBounds);
    var T = 0;
    var S = U.width;
    var R = 0;
    var Q = U.height;
    switch(retrieveModel(Z, "blendDirection")){
        case "topToBottom" : 
            T = U.width / 2;
            S = T;
            R = 0;
            Q = U.height;
            break;
        case "leftToRight" : 
            T = 0;
            S = U.width;
            R = U.height / 2;
            Q = R;
            break;
        case "bottomToTop" : 
            T = U.width / 2;
            S = T;
            R = U.height;
            Q = 0;
            break;
        case "rightToLeft" : 
            T = U.width;
            S = 0;
            R = U.height / 2;
            Q = R;
            break;
        case "topLeftToBottomRight" : 
            T = 0;
            S = U.width;
            R = 0;
            Q = U.height;
            break;
        case "bottomRightToTopLeft" : 
            T = U.width;
            S = 0;
            R = U.height;
            Q = 0;
            break;
        case "topRightToBottomLeft" : 
            T = U.width;
            S = 0;
            R = 0;
            Q = U.height;
            break;
        case "bottomLeftToTopRight" : 
            T = 0;
            S = U.width;
            R = U.height;
            Q = 0;
            break;
        default : 
            break;
    }
    return " filter: alpha( style=" + X + ", opacity=" + W + ", finishOpacity=" + V + ", startX=" + T + ", startY=" + R + ", finishX=" + S + ", finishY=" + Q + " );";
}
function bullet2style(Z, Y){
    var X = Z.fontFamily;
    var W = null;
    var V = true;
    var U = null;
    switch(Y){
        case "alphaCap" : 
        case "alphaCapP" : 
        case "alpha" : 
        case "alphaP" : 
        case "romanCap" : 
        case "romanCapP" : 
        case "roman" : 
        case "romanP" : 
        case "numeric" : 
        case "numericP" : 
            V = false;
            break;
        case "circle" : 
        case "bullet" : 
        case "angle" : 
        case "guillemet" : 
        case "dash" : 
            U = kSlideFontFamily;
            break;
    }
    if(V || U){
        var T = cloneObject(Z, V ? gFontKeysPlain : null);
        if(U)
            T.fontFamily = U;
        return T;
    }
    return Z;
}
function roman1cluster(Z, Y, X, W, V){
    Y = Y * 9 / 10;
    if(Z.number >= Y){
        Z.theText += V + X;
        Z.number -= Y;
    }
    Y = Y * 5 / 9;
    if(Z.number >= Y){
        Z.theText += W;
        Z.number -= Y;
    }
    Y = Y * 4 / 5;
    if(Z.number >= Y){
        Z.theText += V + W;
        Z.number -= Y;
    }
    Y /=4;
    if(Z.number >= Y){
        Z.theText += V;
        Z.number -= Y;
    }
    if(Z.number >= Y){
        Z.theText += V;
        Z.number -= Y;
    }
    if(Z.number >= Y){
        Z.theText += V;
        Z.number -= Y;
    }
}
function romanText(Z, Y){
    var X = Y ? "IVXLCDM" : "ivxlcdm";
    if(Z >= 4000)
        return(X.charAt(6) + X.charAt(6) + X.charAt(6) + X.charAt(6));
    var W = 
    {
        "number" : Z, "theText" : ""
    };
    roman1cluster(W, 10000, "", "", X.charAt(6));
    roman1cluster(W, 1000, X.charAt(6), X.charAt(5), X.charAt(4));
    roman1cluster(W, 100, X.charAt(4), X.charAt(3), X.charAt(2));
    roman1cluster(W, 10, X.charAt(2), X.charAt(1), X.charAt(0));
    return W.theText;
}
function bulletText(Z, Y, X, W, V){
    var U = "", T = 1;
    var S = "", R = 0;
    var Q = "";
    if(Y < 0){
        S = "-";
        Y =- Y;
    }
    boxSize = Math.round(X * 0.35);
    if(boxSize < 1)
        boxSize = 1;
    if(Z == "square" && boxSize < 3)
        Z = "box";
    switch(Z){
        case "alphaCap" : 
        case "alphaCapP" : 
            R = 64;
        case "alpha" : 
        case "alphaP" : 
            if(R == 0)
                R = 96;
            Y += 26;
            while(Y > 26){
                U += "&#" + (R + (Y % 26)) + ";";
                Y -= 26;
            }
            break;
        case "romanCap" : 
        case "romanCapP" : 
            U = romanText(Y, true);
            break;
        case "roman" : 
        case "romanP" : 
            U = romanText(Y, false);
            break;
        case "numeric" : 
        case "numericP" : 
            U = Y + "";
            break;
        case "box" : 
            if(gPrintInProgress){
                U += "<img style='margin-top:" + Math.round(X * (V ? 0.2 : 0.6)) + "' src='" + kRootUrl + "img/dot_black.gif' width=" + boxSize + " height=" + boxSize + ">";
            }
            else{
                if(V)
                    Q = "0px 0px " + Math.round(X * 0.2) + "px 0px";
                else
                    Q = Math.round(X * 0.6) + "px 0px 0px 0px";
                U += "<span style='margin:" + Q + "; width:" + boxSize + "; height:" + boxSize + "; background-color:" + W + ";" + kRenderLineStyle + "'>";
                U += "<img src='" + kRootUrl + "img/dot_clear.gif' width=" + boxSize + " height=" + boxSize + ">";
                U += "</span>";
            }
            break;
        case "square" : 
            U = "<span style='margin-";
            if(V)
                U += "bottom:" + Math.round(X * 0.2);
            else
                U += "top:" + Math.round(X * 0.6);
            U += "px; width:" + boxSize + "; height:" + boxSize + ";" + "border-width:1; border-style:solid; border-color:" + W + ";" + kRenderLineStyle + "'>" + "<img src='" + kRootUrl + "img/dot_clear.gif' width=" + (boxSize - 2) + " height=" + (boxSize - 2) + ">";
            U += "</span>";
            break;
        case "circle" : 
            U = "<span style='";
            if(V){
                U += "position:relative; top:" + Math.round(X * (is.nav4 ? 0.55 :- 0.2)) + ";";
            }
            else
                U += "margin-top:" + Math.round(X * (is.nav4 ? 0.5 : 0.4)) + "px;";
            var P = "O";
            U += " font-size:" + Math.round(X * 0.4) + "pt;'>" + P + "</span>";
            break;
        case "bullet" : 
            U = "&bull;";
            break;
        case "angle" : 
            U = ">";
            break;
        case "guillemet" : 
            U = "&raquo;";
            break;
        case "asterisk" : 
            U = "*";
            break;
        case "dash" : 
            U = "-";
            break;
        }
        switch(Z){
            case "alphaCap" : 
            case "alpha" : 
            case "romanCap" : 
            case "roman" : 
            case "numeric" : 
                U += ".";
                break;
            case "alphaCapP" : 
            case "alphaP" : 
            case "romanCapP" : 
            case "romanP" : 
            case "numericP" : 
                U += ")";
                break;
        }
        if(U == "" && Z != "none")
            U = "-";
        return S + U;
}
function bulletWidth(Z, Y, X){
    if(X == null)
        X = 1;
    var W = 1;
    switch(Z){
        case "alphaCap" : 
        case "alphaCapP" : 
        case "alpha" : 
        case "alphaP" : 
            W = (X > 26) ? 2 : 1.5;
            break;
        case "romanCap" : 
        case "romanCapP" : 
        case "roman" : 
        case "romanP" : 
            W = (X > 6) ? 2 : 1.5;
            break;
        case "numeric" : 
        case "numericP" : 
            W = (X > 9) ? 2 : 1.5;
            break;
        case "none" : 
            W = 0;
            break;
        default : 
            W = 0.75;
            break;
    }
    return Math.round(Y * W);
}
function node2style(Z, Y, X){
    if(Y == null)
        Y = gStandardKeys;
    if(X == null)
        X = new Object();
    for(var W in Y)
        X[W] = retrieveModel(Z, W);
    if(X.fontFamily == null)
        X.fontFamily = kSlideFontFamily;
    if(X.fontSize == null)
        X.fontSize = kSlideFontSize;
    X.fontSizeScaled = mapScalar(X.fontSize, kPageHeight, gDstBounds.height);
    if(X.bounds)
        X.boundsScaled = mapBounds(X.bounds, gSrcBounds, gDstBounds);
    return X;
}
function fontRender(Z, Y){
    var X = "";
    if(Z){
        if(Z.fontFamily != null)
            X += " font-family:" + Z.fontFamily + ";";
        if(Z.fontSizeScaled != null)
            X += " font-size:" + Z.fontSizeScaled + "pt;";
        else if(Z.fontSize != null)
            X += " font-size:" + mapScalar(Z.fontSize, kPageHeight, gDstBounds.height) + "pt;";
        if(Z.fontColor != null)
            X += " color:" + Z.fontColor + ";";
        if(Z.fontStyle != null)
            X += " font-style:" + Z.fontStyle + ";";
        if(Z.fontVariant != null)
            X += " font-variant:" + Z.fontVariant + ";";
        if(Z.fontWeight != null)
            X += " font-weight:" + Z.fontWeight + ";";
        if(Z.textDecoration != null)
            X += " text-decoration:" + Z.textDecoration + ";";
    }
    if(Y)
        X += kRenderLineStyle;
    return X;
}
function picture2style(Z, Y, X){
    if(X == null)
        X = new Object();
    kickImage(Z);
    var W = Z._state;
    if(W == null)
        W = "none";
    if(gPageMode != kEditMode)
        W = "loaded";
    if(Y == "scale"){
        if(W != "loaded")
            X.textAlign = "center";
        return X;
    }
    else if(Y != "raw")
        return X;
    X.backgroundImage = textModel(Z, true);
    X.backgroundRepeat = retrieveDefault(Z, "tiling", "repeat");
    var V = retrieveModel(Z, "textAlign");
    var U = retrieveModel(Z, "verticalAlign");
    if((V != null) || (U != null)){
        if(V == null)
            V = "left";
        if(U == null)
            U = "top";
        else if(U == "middle")
            U = "center";
        X.backgroundPosition = U + " " + V;
    }
    return X;
}
function pictureRender(Z, Y){
    kickImage(Z);
    if(Y != "scale")
        return "";
    var X = Z._state;
    if(X == null)
        X = "none";
    if(gPageMode != kEditMode)
        X = "loaded";
    switch(X){
        case "new" : 
            return "<br>[ " + getString("strNoImageURL") + " ]";
        case "none" : 
        case "pending" : 
            return "<br>[ " + getString("strImageLoading") + "... ]";
        case "aborted" : 
            return "<br>[ " + getString("strImageNotAvailable") + " ]";
    }
    if(X != "loaded")
        return "";
    var W = interiorBounds(Z);
    return "<img src='" + textModel(Z, true) + "' height=" + W.height + " width=" + W.width + ">";
}
var kGridDefaultFontSize = 10;
function loadStateChange(Z, Y){
    var X;
    if(typeof(Z._load) == "undefined")
        Z._load = new Object();
    X = Z._load.state;
    Z._load.state = Y;
}
function loadSheet(Z, Y){
    loadStateChange(Z, "loading");
    var X = kRootUrl + gOpenScript + "?mode=v&ui=0&extra=" + Z.index + "&id=" + Y;
    Z._load.link = X;
    acquireFrameResource(X);
}
var kLoadCheckInterval = 5000;
var kMaxChecks = 100;
function checkLoadSheet(Z){}
function copySheetData(Z, Y){
    var X = new Array(Y.length);
    var W;
    for(W = 0; W < Y.length; W ++ ){
        var V = new Object();
        var U;
        for(U in Y[W]){
            if(typeof(Y[W][U]) != "object"){
                V[U] = Y[W][U];
            }
        }
        var T = Y[W].m_div.m_name;
        V.m_row = Z.name2row(T);
        V.m_col = Z.name2column(T);
        X[W] = V;
    }
    return X;
}
function calculateCellBounds(Z, Y){
    var X,
    W,
    V;
    W = 1;
    V = 1;
    for(X = 0; X < Z.length; X ++ ){
        if(Z[X].m_row > W)
            W = Z[X].m_row;
        if(Z[X].m_col > V)
            V = Z[X].m_col;
    }
    Y.row = W;
    Y.col = V;
}
function sheetRecalculated(Z){
    var Y;
    Y = index2model(Z);;
    if(Y == null || Y._load == null)
        return;
    var X = getFrameResourceContext(Y._load.link);;
    loadStateChange(Y, "loaded");
    Y._data = new Object();
    Y._data.cellData = copySheetData(X, X.gCellDataArray);
    var W = new Object();
    calculateCellBounds(Y._data.cellData, W);
    Y._data.rows = W.row + 1;
    Y._data.columns = W.col + 1;
    var V;
    Y._data.rowHeights = new Array();
    for(V = 0; V < Y._data.rows; V ++ )
        Y._data.rowHeights[V] = X.gRowHeights[V];
    Y._data.colWidths = new Array();
    for(V = 0; V < Y._data.columns; V ++ )
        Y._data.colWidths[V] = X.gColWidths[V];
    Y._data.totalHeight = Y._data.rowHeights.sum();
    Y._data.totalWidth = Y._data.colWidths.sum();
    changedModel(Y, true);
    releaseFrameResource(Y._load.link);
}
function recalculateSheet(Z){
    loadStateChange(Z, "loading");
    if(reacquireFrameResource(Z._load.link)){
        var Y;
        Y = getFrameResourceContext(Z._load.link);
        Y.DirtyAllCells();
        Y.turnOnNotification();
    }
    else{
        var X = retrieveModel(Z, "fileInfo");
        loadSheet(Z, X.id);
    }
    changedModel(Z, true);
}
function sheetLoadError(Z){
    loadStateChange(Z, "error");
}
function sheetRender(Z){
    var Y = "";
    var X;
    X = interiorBounds(Z);
    if(X.width == 0 || X.height == 0)
        return "";
    if( ! Z._load){
        var W = retrieveModel(Z, "fileInfo");
        loadSheet(Z, W.id);
    }
    switch(Z._load.state){
        case "unspecified" : 
            Y = '<span style="font-style: italic">Spreadsheet</span>';
            break;
        case "loading" : 
            Y = '<br>[ ' + getString("strSpreadsheetLoading") + '... ]</br>';
            break;
        case "error" : 
            Y = '<br>[ ' + getString("strErrorLoadingSpreadsheet") + ' ]</br>';
            break;
        case "loaded" : 
            Y = gridRender(Z._data, X);
            break;
        default : ;
        break;
}
return Y;
}
function gridRender(Z, Y){
    var X = new Array();
    buildCellIndexMatrix(Z.cellData, Z.rows, Z.columns, X);
    var W;
    var V,
    U;
    W = newBounds(0, 0, Z.totalHeight, Z.totalWidth);
    U = Y.width;
    V = Y.height;
    var T;
    var S,
    R;
    var Q,
    P;
    T = "";
    var O;
    O = mapScalar(kGridDefaultFontSize, W.height, Y.height);
    T += '<span class="sheet" id="sheet0" ';
    T += 'style="position:absolute; top: 0; left:0; height:' + V + '; width:' + U + '; ';
    T += 'overflow: hidden; font-size: ' + O + 'pt; font-family: arial, helvetica, sans-serif; text-align: right;">';
    Q = 0;
    for(S = 0; S < Z.rows; S ++ ){
        var N,
        M;
        N = mapScalar(Z.rowHeights[S], W.height, Y.height);
        M = U;
        P = 0;
        T += '<span class="row" id="row' + S + '" ';
        T += 'style="position:absolute; clip: rect(0px ' + M + 'px ' + N + 'px 0px); ';
        T += 'left: ' + P + '; top: ' + Q + '; height:' + N + '; width:' + M + '; top:' + Q + ';">\n';
        P = 0;
        for(R = 0; R < Z.columns; R ++ ){
            var L;
            var K;
            K = mapScalar(Z.colWidths[R], W.width, Y.width);
            L = X[S][R];
            if(L != kNullIndex){
                var J,
                I,
                H,
                G;
                var F;
                J = Z.cellData[L];
                I = "";
                if(J.i_nr){
                    I = J.i_nr;
                }
                G = cell2styletext(J, Y, W);
                G += "position: absolute; top: 0; left: " + P + "; height: " + N + "; width: " + K + "; ";
                if(J._wrapText == "true"){
                    G += "overflow: hidden; ";
                }
                else{
                    I = makeCellAlignmentSpan(J, I, K, Y, W);
                    G += "overflow: visible; ";
                }
                H = "";
                T += '<span class="cell" style="' + G + '" ' + H + '>' + I + '</span>';
            }
            P += K;
        }
        T += '</span>';
        Q += N;
    }
    T += '</span>';
    return T;
}
var kNullIndex =- 1;
function buildCellIndexMatrix(Z, Y, X, W){
    var V,
    U,
    T;;
    for(V = 0; V < Y; V ++ ){
        W[V] = new Array(X);
        W[V].initToValue(kNullIndex);
    }
    for(V = 0; V < Z.length; V ++ ){
        U = Z[V].m_row;
        T = Z[V].m_col;
        W[U][T] = V;
    }
}
function cell2styletext(Z, Y, X){
    var W = "";
    if(Z.foreColor)
        W += "color: " + Z.foreColor + "; ";
    if(Z.bk_color)
        W += "background-color: " + Z.bk_color + "; ";
    if(Z.m_backgroundImage){
        var V = "";
        if(Z.m_backgroundImage != "none")
            V = Z.m_backgroundImage;
        W += "background-image: url('" + V + "'); ";
    }
    if(Z._borderTop && Z._borderTop != "none")
        W += "border-top: " + Z._borderTop + "; ";
    if(Z._borderLeft && Z._borderLeft != "none")
        W += "border-left: " + Z._borderLeft + "; ";
    if(Z._borderBottom && Z._borderBottom != "none")
        W += "border-bottom: " + Z._borderBottom + "; ";
    if(Z._borderRight && Z._borderRight != "none")
        W += "border-right: " + Z._borderRight + "; ";
    if(Z._fontWeight)
        W += "font-weight: " + Z._fontWeight + "; ";
    if(Z._textDecoration)
        W += "text-decoration: " + Z._textDecoration + "; ";
    if(Z._fontStyle)
        W += "font-style: " + Z._fontStyle + "; ";
    if(Z._textAlign)
        W += "text-align: " + Z._textAlign + "; ";
    else if(Z.textAlign)
        W += "text-align: " + Z.textAlign + "; ";
    if(Z.viewFamily)
        W += "font-family: " + Z.viewFamily + "; ";
    if(Z.viewSize){
        var U;
        Z.viewSize = Z.viewSize.replace(/\s/g, '');
        U = parseFloat(Z.viewSize);
        U = mapScalar(U, X.width, Y.width);
        W += "font-size: " + U + "pt; ";
    }
    return W;
}
function makeCellAlignmentSpan(Z, Y, X, W, V){
    var U,
    T;
    var S,
    R,
    Q;
    var P;
    P = "";
    if(Z._textAlign)
        P = Z._textAlign;
    else if(Z.textAlign)
        P = Z.textAlign;
    if(P == "")
        P = "right";
    Q = 0;
    R = X;
    S = 0;
    if(Z._widthClue){
        S = parseInt(Z._widthClue);
        S = mapScalar(S, V.width, W.width);
    }
    if(S > X)
        R = S;
    T = "position: absolute; ";
    if(P == "right"){
        T += "left:" + (X - R) + "; width:" + R + ";";
    }
    else{
        T += "left:0; width:" + X + ";";
    }
    T += "text-align:" + P + "; overflow: visible;";
    return "<span style='" + T + "'><nobr>" + Y + "</nobr></span>";
}
function element2render(Z){
    while((Z != null) && ((Z.name == null) || (Z.name == "")))
        Z = Z.parentElement;
    return Z;
}
function slide2render(Z){
    if(kindModel(Z) == "slide")
        return getElement("slide" + Z.index);
    return null;
}
function kickImage(Z){
    if(Z._state == null){
        if(Z.seenUrl == null)
            Z._state = "new";
        else
            Z._state = "none";
    }
    var Y = textModel(Z, true);
    if(Z._state == "new"){
        if(Z._entered == null){
            Z._entered = Y;
            return;
        }
        if(Y == null || Y == '' || Z._entered == Y)
            return;
        Z._state = "none";
        delete(Z._entered);
    }
    if(Z._state == "none" || Y != Z.seenUrl){
        if(createImage(Z.index, textModel(Z, true))){
            if(Z._state != "loaded")
                Z._state = "pending";
        }
        else
            Z._state = "loaded";
    }
}
var gImages = new Object();
function createImage(Z, Y){
    var X = gImages[Z];
    if(X && X.src == Y)
        return false;
    X = new Image();
    gImages[Z] = X;
    X.index = Z;
    X.onload = loadedImage;
    X.onabort = abortedImage;
    X.onerror = errorImage;
    var W = index2model(Z);
    var V = W._state;
    W._state = "locked";
    X.src = Y;
    if(W._state == "locked")
        W._state = V;
    return true;
}
function selectImage(Z){
    var Y = index2model(Z);
    if(Y){
        changedModel(Y, true);
        if(Y.selected)
            selectUtility(Y);
    }
}
function loadedImage(){
    var Z = this;
    var Y = index2model(Z.index);
    if( ! Y)
        return;
    var X = retrieveDefault(Y, "pictureMode", "scale");
    Y.srcWidth = Z.width;
    Y.srcHeight = Z.height;
    var W = retrieveModel(Y, "bounds");
    var V,
    U;
    if((Y.seenUrl == null) || (Y.seenUrl != Y.entry && X == "scale"))
        delete(Y.seenUrl);
    if(Y.seenUrl == null){
        if(X == "scale"){
            V = mapScalar(Y.srcWidth, kPageWidth, gSrcBounds.width);
            U = mapScalar(Y.srcHeight, kPageWidth, gSrcBounds.width);
        }
        else{
            V = mapScalar(Y.srcWidth, gDstBounds.width, gSrcBounds.width);
            U = mapScalar(Y.srcHeight, gDstBounds.width, gSrcBounds.width);
        }
        while(V > gSrcBounds.width){
            V *= 0.75;
            U *= 0.75;
        }
        while(U > gSrcBounds.height){
            V *= 0.75;
            U *= 0.75;
        }
        V = Math.round(V);
        U = Math.round(U);
        W = newBounds(W.top, W.left, W.top + U, W.left + V);
        decorateModel(Y, "bounds", W);
    }
    var T = (Y._state == "locked");
    Y._state = "loaded";
    Y.seenUrl = textModel(Y, true);
    if(Y.selected)
        setTimeout('selectImage( "' + Y.index + '" );', 50);
    else if( ! T){
        changedModel(Y, true);
        outputDrawing();
    }
}
function killImage(){
    var Z = this;
    var Y = index2model(Z.index);
    if( ! Y)
        return;
    var X = (Y._state != "locked");
    Y._state = "aborted";
    Y.seenUrl = textModel(Y, true);
    if( ! X)
        outputModel();
}
function abortedImage(){
    killImage();
}
function errorImage(){
    killImage();
}
var gHandle = null;
var gMangle = null;
var gFrame = null;
var gTopCenter = null;
var gTopRight = null;
var gMiddleRight = null;
var gBottomRight = null;
var gBottomCenter = null;
var gBottomLeft = null;
var gMiddleLeft = null;
var gTopLeft = null;
function setupHandle(){
    gHandle = getElement("handle");
    gFrame = getElement("frame");
    gTopCenter = getElement("topcenter");
    gTopRight = getElement("topright");
    gMiddleRight = getElement("middleright");
    gBottomRight = getElement("bottomright");
    gBottomCenter = getElement("bottomcenter");
    gBottomLeft = getElement("bottomleft");
    gMiddleLeft = getElement("middleleft");
    gTopLeft = getElement("topleft");
}
function finishHandle(){}
function getHandle(){
    return gHandle;
}
function openHandle(Z){
    var Y = model2drawing(Z);
    if(Z == null || Y == null)
        return;
    switch(Z.kind){
        case "slide" : 
        case "textbox" : 
        case "text" : 
            return;
    }
    moveHandle(getBounds(Y));
    if(gHandle)
        gHandle.style.display = "block";
    switch(Z.kind){
        case "hline" : 
            setVisible(gTopCenter, false);
            setVisible(gTopRight, false);
            setVisible(gMiddleRight, true);
            setVisible(gBottomRight, false);
            setVisible(gBottomCenter, false);
            setVisible(gBottomLeft, false);
            setVisible(gMiddleLeft, true);
            setVisible(gTopLeft, false);
            break;
        case "vline" : 
            setVisible(gTopCenter, true);
            setVisible(gTopRight, false);
            setVisible(gMiddleRight, false);
            setVisible(gBottomRight, false);
            setVisible(gBottomCenter, true);
            setVisible(gBottomLeft, false);
            setVisible(gMiddleLeft, false);
            setVisible(gTopLeft, false);
            break;
        default : 
            setVisible(gTopCenter, true);
            setVisible(gTopRight, true);
            setVisible(gMiddleRight, true);
            setVisible(gBottomRight, true);
            setVisible(gBottomCenter, true);
            setVisible(gBottomLeft, true);
            setVisible(gMiddleLeft, true);
            setVisible(gTopLeft, true);
            break;
    }
    grabberActivate(Z, true);
    gMangle = Y;
}
function closeHandle(){
    var Z = gMangle;
    var Y = drawing2model(Z);
    if(Y)
        grabberActivate(Y, false);
    gMangle = null;
    if(gHandle)
        gHandle.style.display = "none";
    return Z;
}
function usingHandle(){
    return(gHandle != null) && (gHandle.style.display == "block");
}
function insideHandle(Z){
    if(gHandle == null)
        return false;
    while(Z != null){
        if(Z == gHandle)
            return true;
        Z = Z.parentElement;
    }
    return false;
}
function whereHandle(){
    if(gHandle == null)
        return newBounds(0, 0, 0, 0);
    return insetBounds(getBounds(gHandle), 3, 3);
}
function deltaHandle(Z, Y, X, W, V){
    var U = W.top;
    var T = W.left;
    var S = W.bottom;
    var R = W.right;
    switch(Z.id){
        case "topcenter" : 
            U += X;
            if(U >= S)
                U = S - 1;
            break;
        case "topright" : 
            U += X;
            if(U >= S)
                U = S - 1;
            R += Y;
            if(R <= T)
                R = T + 1;
            break;
        case "middleright" : 
            R += Y;
            if(R <= T)
                R = T + 1;
            break;
        case "bottomright" : 
            S += X;
            if(S <= U)
                S = U + 1;
            R += Y;
            if(R <= T)
                R = T + 1;
            break;
        case "bottomcenter" : 
            S += X;
            if(S <= U)
                S = U + 1;
            break;
        case "bottomleft" : 
            S += X;
            if(S <= U)
                S = U + 1;
            T += Y;
            if(T >= R)
                T = R - 1;
            break;
        case "middleleft" : 
            T += Y;
            if(T >= R)
                T = R - 1;
            break;
        case "topleft" : 
            U += X;
            if(U >= S)
                U = S - 1;
            T += Y;
            if(T >= R)
                T = R - 1;
            break;
        default : 
            U += X;
            T += Y;
            S += X;
            R += Y;
            break;
    }
    moveHandle(limitBounds(newBounds(U, T, S, R), V));
}
function nudgeHandle(Z, Y){
    var X = whereHandle();
    var W = 0;
    var V = 0;
    switch(Z){
        case "up" : 
            V =- 1;
            break;
        case "left" : 
            W =- 1;
            break;
        case "down" : 
            V = 1;
            break;
        case "right" : 
            W = 1;
            break;
        default : 
            break;
    }
    if(X.left + W < Y.left)
        W = Y.left - X.left;
    else if(X.right + W > Y.right)
        W = Y.right - X.right;
    if(X.top + V < Y.top)
        V = Y.top - X.top;
    else if(X.bottom + V > Y.bottom)
        V = Y.bottom - X.bottom;
    if((W == 0) && (V == 0))
        return false;
    moveHandle(offsetBounds(X, W, V));
    return true;
}
function moveHandle(Z){
    var Y = insetBounds(Z ,- 3 ,- 3);
    var X = newBounds(0, 0, Y.height, Y.width);
    if(gHandle)
        setBounds(gHandle, Y);
    frameHandle(gFrame, X);
    var W = roundScalar(X.width / 2);
    var V = roundScalar(X.height / 2);
    anchorHandle(gTopCenter, 3, W);
    anchorHandle(gMiddleLeft, V, 3);
    anchorHandle(gBottomCenter, X.height - 3, W);
    anchorHandle(gMiddleRight, V, X.width - 3);
    anchorHandle(gTopLeft, 3, 3);
    anchorHandle(gTopRight, 3, X.width - 3);
    anchorHandle(gBottomLeft, X.height - 3, 3);
    anchorHandle(gBottomRight, X.height - 3, X.width - 3);
}
function frameHandle(Z, Y){
    Z.style.pixelTop = Y.top + 2;
    Z.style.pixelLeft = Y.left + 2;
    Z.style.pixelHeight = Y.height - 4;
    Z.style.pixelWidth = Y.width - 4;
}
function anchorHandle(Z, Y, X){
    Z.style.pixelTop = Y - 3;
    Z.style.pixelLeft = X - 3;
    Z.style.pixelHeight = 6;
    Z.style.pixelWidth = 6;
}
function toggleHandle(Z){
    var Y = gHandle ? gHandle.style.display : "none";
    if(gHandle){
        if(Z)
            gHandle.style.display = "block";
        else
            gHandle.style.display = "none";
    }
    return(Y != "none");
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();