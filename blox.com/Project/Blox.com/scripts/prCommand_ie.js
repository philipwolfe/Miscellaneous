//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function prUberCallback(Z, Y, X){
    if(Z == kBeginMessage){
        if(X == kExecuteMessage){
            var W = targetModel();
            if(W)
                Y.preTarget = W.index;
        }
        else{}
    }
    else if(Z == kEndMessage){
        flushModel();
        if(X == kExecuteMessage){
            W = targetModel();
            if(W)
                Y.postTarget = W.index;
        }
        else if(X == kUndoMessage){
            if(Y.preTarget)
                selectUtility(index2model(Y.preTarget));
        }
        else if(X == kRedoMessage){
            if(Y.postTarget)
                selectUtility(index2model(Y.postTarget));
        }
    }
}
function attributeOne(Z, Y, X){
    var W = Z[Y];
    if(X == null)
        delete(Z[Y]);
    else
        Z[Y] = X;
    return W;
}
function attributeNode(Z, Y, X){
    var W = Y.key;
    if(typeof(W) == "object"){;
        for(var V = 0; V < W.length; ++ V)
            Y.value[V] = attributeOne(Z, W[V], Y.value[V]);
    }
    else
        Y.value = attributeOne(Z, W, Y.value);
    if(X)
        changedModel(Z);
}
function attributeCallback(Z){
    var Y = this.data.index;
    var X,
    W;
    if(typeof(Y) == "object"){;
        for(W = 0; W < Y.length; ++ W){
            X = index2model(Y[W]);
            if(X)
                attributeNode(X, this.data, (this.level == 1));
        }
    }
    else{
        X = index2model(Y);
        if(X)
            attributeNode(X, this.data, (this.level == 1));
    }
}
function attributeCommand(Z, Y, X, W, V){
    return makeCommand(attributeCallback, 
    {
        "index" : Z.index,
        "key" : Y,
        "value" : X
    }, W ? W : "attribute", V);
}
function postAttributeCommand(Z, Y, X, W, V){
    return pushCommand(attributeCommand(Z, Y, X, W, V));
}
function entryCallback(Z){
    var Y = index2model(this.data.index);
    if(Z == kExecuteMessage){
        this.data.entry = Y.entry;
        this.data.text = Y.text;
        this.data._expression = Y._expression;
        entryModel(Y, this.data.value);
    }
    else{
        this.data.entry = attributeOne(Y, "entry", this.data.entry);
        this.data.text = attributeOne(Y, "text", this.data.text);
        this.data._expression = attributeOne(Y, "_expression", this.data._expression);
        deriveModel(Y, true);
    }
    changedModel(Y);
}
function entryCommand(Z, Y, X, W, V){
    return makeCommand(entryCallback, 
    {
        "index" : Z.index,
        "key" : Y,
        "value" : X
    }, W ? W : "entry", V);
}
function postEntryCommand(Z, Y, X, W, V){
    return pushCommand(entryCommand(Z, Y, X, W, V));
}
function styleOne(Z, Y, X){
    var W = retrieveModel(Z, Y, true);
    decorateModel(Z, Y, X);
    return W;
}
function styleNode(Z, Y, X){
    var W = Y.key;
    if(typeof(W) == "object"){;
        for(var V = 0; V < W.length; ++ V)
            Y.value[V] = styleOne(Z, W[V], Y.value[V]);
    }
    else
        Y.value = styleOne(Z, W, Y.value);
    if(X)
        changedModel(Z);
}
function styleCallback(Z){
    var Y = this.data.index;
    var X,
    W;
    if(typeof(Y) == "object"){;
        for(W = 0; W < Y.length; ++ W){
            X = index2model(Y[W]);
            if(X)
                styleNode(X, this.data, (this.level == 1));
        }
    }
    else{
        X = index2model(Y);
        if(X)
            styleNode(X, this.data, (this.level == 1));
    }
}
function styleCommand(Z, Y, X, W, V, U){
    var T = makeCommand(styleCallback, 
    {
        "index" : Z.index, "key" : Y,
        "value" : X
    }, V ? V : "style", U ? U : "Style Change");
    if(W)
        for(var S = 0; S < Z.child.length; ++ S)
            followCommand(T, styleCommand(Z.child[S], Y, X, true));
    return T;
}
function postStyleCommand(Z, Y, X, W, V, U){
    return pushCommand(styleCommand(Z, Y, X, W, V, U));
}
function toggleCommand(Z, Y, X, W, V, U, T){
    var S;
    if(V)
        S = retrieveRecursive(Z, Y);
    else{
        Z = alternateModel(Z, Y);
        S = retrieveModel(Z, Y);
    }
    if(S == X)
        X = W;
    return styleCommand(Z, Y, X, V, U ? U : "toggle");
}
function postToggleCommand(Z, Y, X, W, V, U, T){
    return pushCommand(toggleCommand(Z, Y, X, W, V, U, T));
}
function insertCore(Z, Y, X){
    var W = null;
    var V = Z.data;
    var U = V.node;
    if(U == null)
        U = index2model(V.index);
    if(Y == kUndoMessage){
        V.node = U;
        if(Z.level == 1){
            switch(kindModel(U)){
                case "slide" : 
                    W = nextSibling(U);
                    if( ! W)
                        W = prevSibling(U);
                    break;
                default : 
                    W = prevSibling(U);
                    if( ! W){
                        W = parentModel(U);
                        if(kindModel(W) == "frame")
                            W = parentModel(W);
                    }
            }
            if(W == null)
                W = parentModel(U);
        }
        deselectModel(U);
        removeModel(U);
        disposeModel(U);
    }
    else{
        W = U;
        restoreModel(U);
        if(V.siblingID)
            appendModel(U, index2model(V.siblingID), V.before);
        else
            insertModel(U, index2model(V.parentID), V.before);
        if(V.index == null)
            V.index = U.index;
        delete(V.node);
    }
    var T = null;
    if(gPageMode == kSortMode){
        T = index2model(V.parentID);
        if(kindModel(T) != "folder")
            T = null;
    }
    changedModel(T);
    if(Z.level == 1){
        if(X || Y == kExecuteMessage){
            selectUtility(W);
            changedModel(T, true);
        }
        if(Y == kExecuteMessage){
            if(V.editWhere){
                flushModel();
                var S = V.editWhere;
                if(S == 'default')
                    S = whereEditor();
                openEditor(U, true, S);
            }
        }
    }
}
function insertCallback(Z){
    return insertCore(this, Z);
}
function insertPrimitive(Z, Y, X, W, V, U){
    if(Y == null){
        var T = index2model(X);
        if(T && T.parent)
            Y = T.parent.index;
    };
    return makeCommand(insertCallback, 
    {
        "node" : Z,
        "parentID" : Y,
        "siblingID" : X,
        "before" : W
    }, V ? V : "insertNode", U ? U : "New Item");
}
function insertCommand(Z, Y, X, W, V, U, T){
    var S = insertPrimitive(Z, Y, X, W, U, T);
    if(V)
        S.data.editWhere = V;
    return S;
}
function postInsertCommand(Z, Y, X, W, V, U, T){
    return pushCommand(insertCommand(Z, Y, X, W, V, U, T));
}
function deleteCallback(Z){
    var Y = insertCore(this, (Z == kUndoMessage) ? kRedoMessage : kUndoMessage, (Z == kExecuteMessage));
    return Y;
}
function deletePrimitive(Z, Y, X){
    var W = prevSibling(Z);;
    return makeCommand(deleteCallback, 
    {
        "index" : Z.index,
        "parentID" : parentModel(Z).index,
        "siblingID" : (W ? W.index : null),
        "before" : (W ? null : true)
    }, Y, X);
}
function deleteCommand(Z, Y, X){
    var W = deletePrimitive(Z, Y ? Y : 'delete', X ? X : 'Delete Item');
    precedeCommand(W, Z.master ? emancipateCommand(Z) : enlightenCommand(Z));
    return W;
}
function postDeleteCommand(Z, Y, X){
    return pushCommand(deleteCommand(Z, Y, X));
}
function slaveryCallback(Z){
    var Y = this.data.shadowList;
    var X = this.data.oldMasterList;
    var W,
    V;
    var U = false;
    if(Z == kUndoMessage){
        W = Y;
        V = X;
    }
    else{
        W = X;
        V = Y;
    }
    if(W)
        for(var T in W){
            var S = index2model(T);
        if(S){
            swapModel(S, W[T]);
            changedModel(S);
            U = U || (S.kind == "slide");
        }
    }
    if(V)
        for(T in V){
            S = index2model(T);
        if(S){
            swapModel(S, V[T]);
            changedModel(S);
            U = U || (S.kind == "slide");
        }
    }
    if(U && this.level == 1)
        changedModel(null);
}
function enslaveCommand(Z, Y){
    var X = new Object();
    enslaveModel(Z, Y, X);
    var W = new Object();
    emancipateModel(Z, false, W);
    overrideModel(X, W);
    var V = makeCommand(slaveryCallback, 
    {
        "index" : Z.index, "shadowList" : X,
        "oldMasterList" : W
    }, 'enslave', 'Change Master');
    return V;
}
function postEnslaveCommand(Z, Y){
    return pushCommand(enslaveCommand(Z, Y));
}
function emancipateCommand(Z, Y){
    var X = new Object();
    emancipateModel(Z, Y, X);
    return makeCommand(slaveryCallback, 
    {
        "index" : Z.index,
        "shadowList" : X
    }, 'emancipate', 'Forget Master');
}
function postEmancipateCommand(Z, Y){
    return pushCommand(emancipateCommand(Z, Y));
}
function enlightenCommand(Z){
    var Y = new Object();
    enlightenModel(Z, Y);
    return makeCommand(slaveryCallback, 
    {
        "index" : Z.index,
        "shadowList" : Y
    }, 'enlighten', 'Clear Master');
}
function postEnlightenCommand(Z){
    return pushCommand(enlightenCommand(Z));
}
function revertCallback(Z){
    var Y = index2model(this.data.index);
    if(Y && Y.master)
        this.data.value = attributeOne(Y, "style", this.data.value);
    if(this.level == 1 && Z == kExecuteMessage)
        selectUtility(Y);
    changedModel(Y);
}
function revertCommand(Z, Y, X){
    var W = null;
    if(Y && Z.style)
        W = cloneObject(Z.style, Y, true);
    var V = makeCommand(revertCallback, 
    {
        "index" : Z.index, "value" : W,
        "deep" : X
    }, "strip", "Revert to Master");
    if(X)
        for(var U = 0; U < Z.child.length; ++ U)
            followCommand(V, revertCommand(Z.child[U], Y, true));
    return V;
}
function postRevertCommand(Z, Y, X){
    return pushCommand(revertCommand(Z, Y, X));
}
function modeCallback(Z){
    var Y = gPageMode;
    if(Y != this.data.mode){
        modeDocument(this.data.mode, this.data.index);
        this.data.mode = Y;
    }
}
function modeCommand(Z, Y){
    return makeCommand(modeCallback, 
    {
        "mode" : Z,
        "index" : Y
    }, 'pagemode', 'Editing Mode', true);
}
function postModeCommand(Z, Y){
    return pushCommand(modeCommand(Z, Y));
}
function newCommand(Z){
    var Y = kRootUrl + gOpenScript + "?new=pr&mode=d&topdiv=0&promo=0";
    window.open(Y, "", 'scrollbars=' + (is.nav4 ? 'yes' : 'no') + ',resizable=yes,status=no');
}
function openCommand(){
    if(WindowIsValid(window.hb_directory))
        window.hb_directory.focus();
    else{
        var Z = kRootUrl + gMyFilesScript;
        var Y = window.open(Z, "fileWindow", 'width=620,height=500,scrollbars=yes,resizable=yes');
        Y.focus();
        window.hb_directory = Y;
    }
}
function closeCommand(){
    if(changedContext())
        hb_confirm(getString("strSaveChanges"), getString("strClosePresentation"), getString("strSave"), getString("strDontSave"), getString("strCancel"), "gCloseAfterSave=true;saveCommand();", "resetContext();closeDocument();", "");
    else
        closeDocument();
}
function saveCommand(Z, Y){
    if( ! Z &&! Y &&! changedContext());
    else if(Z || (gAppDescription == null) || (gAppDescription == ''))
        openSaveAs();
    else{
        saveDocument(gAppId, null, gAppDescription);
    }
}
function comingSoon(Z){
    if( ! Z)
        Z = "";
    hb_alert(getString("strCleverFeature") + " " + Z);
}
function printCommand(){
    kickLiveData();
    gPrintAnyway = false;
    var Z = '<option value=1>1</option>' + '<option value=2>2</option>' + '<option value=3>3</option>' + '<option value=4>4</option>';
    var Y = '<nobr>' + getString("strHowManySlides") + ' <select id=spp name="spp" onChange=orientationWarning()>' + Z + '</select></nobr><br>';
    Y += 'Be sure to set your printer to ' + '<span id="orientation" style="font-weight:bold">landscape</span>' + '<span style="height: 34; width:44; position:relative;">' + '<span id="printIcon" class="printIcons"></span></span>' + 'mode in the print dialog that follows!';
    var X = [{
        type : 'raw', value : Y
    }];
    var W = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('print', getString("strPrint"), "isLiveDataLoading()", "acceptPrint()", "closeModal()", X, W);
    var V = getPref("slidesPerPage");
    if(V)
        spp.value = V;
    orientationWarning();
}
function isLiveDataLoading(){
    if(emptyObject(gQueryList) || gPrintAnyway){
        if(gPrintAnyway)
            clearInterval(gQueryDoneInterval);
        return false;
    }
    else{
        gQueryDoneInterval = setInterval("PrintWhenQueriesDone()", 100);
        gPrintAnyway = true;
        setInner(getElement("modalBtn1"), getString("strPrintAnyway"));
        return getString("strOneMomentLiveData");
    }
}
function PrintWhenQueriesDone(){
    if(emptyObject(gQueryList)){
        acceptPrint();
        clearInterval(gQueryDoneInterval);
    }
}
function acceptPrint(){
    closeModal();
    var Z = parseInt(getValue(getElement("spp")));
    outputPrinting(Z);
    savePref("slidesPerPage", Z, true);
}
function kickLiveData(Z){
    if(Z == null)
        Z = getModel();
    if(Z == null)
        return;
    switch(kindModel(Z)){
        case "slide" : 
        case "text" : 
        case "textbox" : 
            textModel(Z);
            break;
        case "grid" : 
            sheetRender(Z);
            break;
    }
    for(var Y = 0; Y < Z.child.length; Y ++ ){
        kickLiveData(Z.child[Y]);
    }
}
function orientationWarning(){
    var Z = spp.value;
    if((Z == 1) || (Z == 4)){
        orientation.innerText = getString("strLandscapeSmall");
        printIcon.style.backgroundPositionX = 34;
    }
    else if((Z == 2) || (Z == 3)){
        orientation.innerText = getString("strPortraitSmall");
        printIcon.style.backgroundPositionX = 0;
    }
}
function summaryCommand(){
    if(gAppId != ''){
        var Z = bestWindowSize(650, 530);
        var Y = kRootUrl + gFileSummaryScript + "?id=" + escape(gAppId);
        var X = window.open(Y, "summaryWin", 'width=' + Z.width + ',height=' + Z.height + ',resizable,scrollbars');
        X.focus();
    }
    else
        hb_alert(getString("strSaveBeforeSummary"), getString("strSummaryInstructions"));
}
function freeCommand(){
    var Z = targetModel();
    if((Z == null) || (kindModel(Z) != "slide")){
        hb_alert(getString("strSelectSlide"));
        return;
    }
    if(folderModel(Z) != kSlidesName){
        hb_alert(getString("strSelectRegularSlide"));
        return;
    }
    if(Z.master == null){
        hb_alert(getString("strSelectedNotMaster"));
        return;
    }
    postEmancipateCommand(Z);
}
function referCommand(){
    var Z = targetModel();
    if(Z == null){
        hb_alert(getString("strPleaseSelectItem"));
        return;
    }
    if(kindModel(Z) == "frame")
        Z = ascendModel(Z, "slide");
    if(folderModel(Z) != kSlidesName){
        hb_alert(getString("strSelectRegularSlide"));
        return;
    }
    if(Z.master == null){
        hb_alert(getString("strSelectedNoMaster"));
        return;
    }
    selectUtility(index2model(Z.master));
}
function masterCommand(){
    var Z = getModel();
    var Y = targetModel(Z);
    Y = ascendModel(Y, "slide");
    selectUtility(Y);
    if((Y == null) || (kindModel(Y) != "slide")){
        hb_alert(getString("strSelectSlide"));
        return;
    }
    if(folderModel(Y) != kSlidesName){
        hb_alert(getString("strSelectRegularSlide"));
        return;
    }
    var X = descendModel(Z, "folder", kMastersName);
    var W = "";
    W += writeOption("x0", "None", Y.index == null, "italic");
    for(var V = 0; V < X.child.length; V ++ ){
        var U = X.child[V];
        W += writeOption(U.index, textModel(U), U.index == Y.master);
    }
    var T = '<div id=masterMenu class=optionMenu>' + W + '</div><br>' + '<nobr><span><input id=changeAll type=checkbox></span>' + '<span>' + getString("strChangeAllSlides") + '</span></nobr><br>';
    var S = [{
        type : 'raw', value : T
    }];
    var R = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('master', getString("strSelectNewMaster") + ":", "", "masterAccept()", "closeModal()", S, R, null);
    setOption(getElement('masterMenu'), Y.master ? Y.master : 'x0');
}
function masterAccept(){
    closeModal();
    var Z = getModel();
    var Y = targetModel(Z);
    var X = getElement('masterMenu');
    var W = getOption(X);
    var V = (W == 'x0') ? null : index2model(W);
    var U = elementCheck('changeAll');
    if(U){
        var T = descendModel(Z, "folder", kSlidesName);
        var S = T.child;
        if(S.length > 0){
            var R;
            if(V)
                R = enslaveCommand(S[S.length - 1], V);
            else
                R = emancipateCommand(S[S.length - 1]);
            for(var Q = S.length - 2; Q >= 0; -- Q){
                if(W != S[Q].master){
                    if(V)
                        followCommand(R, enslaveCommand(S[Q], V));
                    else
                        followCommand(R, emancipateCommand(S[Q]));
                }
            }
            pushCommand(R);
        }
    }
    else if((W != null) && (W != Y.master)){
        if(V)
            postEnslaveCommand(Y, V);
        else
            postEmancipateCommand(Y);
    }
}
function buttonCommand(Z){
    switch(Z){
        default : 
            break;
    }
}
function bumpCommand(Z, Y, X, W, V, U, T){
    var S = retrieveModel(Z, Y);
    if(typeof(S) == "string")
        S = parseInt(S);
    if(typeof(S) != "number")
        return;
    if(W != null){
        if(S + X < W)
            X = W - S;
    }
    if(V != null){
        if(S + X > V)
            X = V - S;
    }
    if(X == 0)
        return null;
    return styleCommand(Z, Y, (S + X), false, U ? U : "bump", T);
}
function postBumpCommand(Z, Y, X, W, V, U, T){
    var S = bumpCommand(Z, Y, X, W, V, U, T);
    if(S)
        pushCommand(S);
}
var gBackgroundPictureNode = null;
var gBackgroundPictureInfo = null;
var gBackgroundPictureOptions = null;
var gBackgroundPictureUrl;
var gBackgroundCurrentColor;
function backgroundCommand(Z, Y){
    if(Z == null){
        var X = node2slide(targetModel());
        if(X == null)
            return;
        gBackgroundPictureNode = X;
        gBackgroundPictureInfo = retrieveModel(X, "fileInfo");
        gBackgroundPictureOptions = null;
        gBackgroundPictureUrl = "";
        gBackgroundCurrentColor = null;
    }
    var W = Z ? Z : retrieveDefault(X, "background", "http://");
    var V = Y ? Y : retrieveDefault(X, "backgroundColor", "#FEFEFE");
    var U = getString("strSelectBackgroundFill") + ':<br>';
    U += '<div id="bgndColorList" style="margin:10px; padding:1px; width:196; background-color:lightgrey; border:1px solid black">' + '<span class="largeswatch" style="padding:2px; font-size:8pt; text-align:center; width:188px; background-color: #FEFEFE;" value="clear">' + getString("strNoFillColor") + '</span><br>' + '<span class="largeswatch" style="background-color: #660000;"></span>' + '<span class="largeswatch" style="background-color: #993300;"></span>' + '<span class="largeswatch" style="background-color: #336600;"></span>' + '<span class="largeswatch" style="background-color: #006633;"></span>' + '<span class="largeswatch" style="background-color: #003366;"></span>' + '<span class="largeswatch" style="background-color: #000099;"></span>' + '<span class="largeswatch" style="background-color: #333399;"></span>' + '<span class="largeswatch" style="background-color: #000000;"></span>' + '<br>' + '<span class="largeswatch" style="background-color: #CC0000;"></span>' + '<span class="largeswatch" style="background-color: #FF6600;"></span>' + '<span class="largeswatch" style="background-color: #999900;"></span>' + '<span class="largeswatch" style="background-color: #009900;"></span>' + '<span class="largeswatch" style="background-color: #009999;"></span>' + '<span class="largeswatch" style="background-color: #0000FF;"></span>' + '<span class="largeswatch" style="background-color: #663399;"></span>' + '<span class="largeswatch" style="background-color: #333333;"></span>' + '<br>' + '<span class="largeswatch" style="background-color: #FF0000;"></span>' + '<span class="largeswatch" style="background-color: #FF9900;"></span>' + '<span class="largeswatch" style="background-color: #99CC00;"></span>' + '<span class="largeswatch" style="background-color: #339966;"></span>' + '<span class="largeswatch" style="background-color: #33CCCC;"></span>' + '<span class="largeswatch" style="background-color: #3366FF;"></span>' + '<span class="largeswatch" style="background-color: #990099;"></span>' + '<span class="largeswatch" style="background-color: #666666;"></span>' + '<br>' + '<span class="largeswatch" style="background-color: #FF00FF;"></span>' + '<span class="largeswatch" style="background-color: #FFCC00;"></span>' + '<span class="largeswatch" style="background-color: #CCFF00;"></span>' + '<span class="largeswatch" style="background-color: #00FF00;"></span>' + '<span class="largeswatch" style="background-color: #66CCCC;"></span>' + '<span class="largeswatch" style="background-color: #00CCFF;"></span>' + '<span class="largeswatch" style="background-color: #CC6699;"></span>' + '<span class="largeswatch" style="background-color: #999999;"></span>' + '<br>' + '<span class="largeswatch" style="background-color: #FF66CC;"></span>' + '<span class="largeswatch" style="background-color: #FFCC33;"></span>' + '<span class="largeswatch" style="background-color: #FFFF00;"></span>' + '<span class="largeswatch" style="background-color: #66FF66;"></span>' + '<span class="largeswatch" style="background-color: #66FFFF;"></span>' + '<span class="largeswatch" style="background-color: #66CCFF;"></span>' + '<span class="largeswatch" style="background-color: #CC66FF;"></span>' + '<span class="largeswatch" style="background-color: #CCCCCC;"></span>' + '<br>' + '<span class="largeswatch" style="background-color: #FF99CC;"></span>' + '<span class="largeswatch" style="background-color: #FFCC99;"></span>' + '<span class="largeswatch" style="background-color: #FFFF99;"></span>' + '<span class="largeswatch" style="background-color: #CCFFCC;"></span>' + '<span class="largeswatch" style="background-color: #CCFFFF;"></span>' + '<span class="largeswatch" style="background-color: #99CCFF;"></span>' + '<span class="largeswatch" style="background-color: #CC99FF;"></span>' + '<span class="largeswatch" style="background-color: #FFFFFF;"></span>' + '</div><br>';
    U += getString("strBackgroundImageURL") + ':<br>';
    U += '<nobr>';
    U += '<input type="text" id="backgroundField" class="modalInput" tabindex=-1 ';
    U += 'value="' + W + '" size=45 maxlength=500 >&nbsp';
    U += makeModalButton("bkgndSelectBtn", "chooseBackgroundPicture()", "Select...");
    U += makeModalButton("bkgndOptionsBtn", "chooseBackgroundOptions()", "Options...");
    U += '</nobr>';
    var T = [{
        type : 'raw', value : U
    }];
    var S = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('backgroundOptions', getString("strSlideBackgroundOptions") + ":", "", "backgroundAccept()", "closeModal()", T, S, "backgroundField");
    setSwatch(getElement("bgndColorList"), V);
}
function chooseBackgroundOptions(){
    gBackgroundPictureUrl = getValue(getElement("backgroundField"));
    gBackgroundCurrentColor = getSwatch(getElement("bgndColorList"));
    closeModal();
    if(gBackgroundPictureOptions == null){
        gBackgroundPictureOptions = 
        {
            "mode" : "raw", "tiling" : "repeat"
        };
        if(gBackgroundPictureNode){
            gBackgroundPictureOptions.mode = retrieveDefault(gBackgroundPictureNode, "pictureMode", gBackgroundPictureOptions.mode);
            gBackgroundPictureOptions.tiling = retrieveDefault(gBackgroundPictureNode, "tiling", gBackgroundPictureOptions.tiling);
        }
    }
    openPictureOptions(gBackgroundPictureOptions, "backgroundOptionsAccept();", "backgroundOptionsCancel();");
}
function backgroundOptionsAccept(){
    if(gBackgroundPictureOptions == null)
        gBackgroundPictureOptions = new Object();
    gBackgroundPictureOptions.mode = elementCheck('modeScale') ? "scale" : "raw";
    var Z = elementCheck('tileH');
    var Y = elementCheck('tileV');
    if(Z){
        if(Y)
            gBackgroundPictureOptions.tiling = "repeat";
        else
            gBackgroundPictureOptions.tiling = "repeat-x";
    }
    else{
        if(Y)
            gBackgroundPictureOptions.tiling = "repeat-y";
        else
            gBackgroundPictureOptions.tiling = "no-repeat";
    }
    backgroundOptionsCancel();
}
function backgroundOptionsCancel(){
    closeModal();
    backgroundCommand(gBackgroundPictureUrl, gBackgroundCurrentColor);
}
function chooseBackgroundPicture(){
    gBackgroundPictureUrl = getValue(getElement("backgroundField"));
    gBackgroundCurrentColor = getSwatch(getElement("bgndColorList"));
    closeModal();
    var Z = 
    {
        "type" : "img", "title" : getString("strBackgroundPicture"),
        "upload" : "pictureUpload()",
        "accept" : "reopenBackground()"
    };
    if(gBackgroundPictureInfo)
        Z.id = gBackgroundPictureInfo.id;
    chooseFileUtility(Z);
}
function reopenBackground(){
    var Z = gChooserOptions.entry;
    if(Z === false || typeof Z == "string"){
        setTimeout("backgroundCommand( '" + gBackgroundPictureUrl + "', '" + gBackgroundCurrentColor + "' );", 100);
        return;
    }
    if(gBackgroundPictureInfo == null)
        gBackgroundPictureInfo = Z;
    else{
        gBackgroundPictureInfo.id = Z.id;
        gBackgroundPictureInfo.name = Z.name;
    }
    gBackgroundPictureUrl = fileInfoToUrl(Z);
    if(gBackgroundPictureUrl == null)
        gBackgroundPictureUrl = "";
    else
        gBackgroundCurrentColor = null;
    setTimeout("backgroundCommand( '" + gBackgroundPictureUrl + "', '" + gBackgroundCurrentColor + "' );", 100);
}
function backgroundAccept(){
    closeModal();
    var Z = node2slide(targetModel());
    if(Z){
        var Y = getValue(getElement("backgroundField"));
        var X = getSwatch(getElement("bgndColorList"));
        if(X == "#FEFEFE")
            X = null;
        var W = ["background", "backgroundColor", "fileInfo"];
        var V = [Y, X, gBackgroundPictureInfo];
        if(gBackgroundPictureOptions){
            W[W.length] = "pictureMode";
            V[V.length] = gBackgroundPictureOptions.mode;
            W[W.length] = "tiling";
            V[V.length] = gBackgroundPictureOptions.tiling;
        }
        postStyleCommand(Z, W, V, false, "backgroundPicture", getString("strBackgroundOptions"));
    }
}
function blendCommand(){
    var Z = getModel();
    var Y = targetModel(Z);
    if((Y == null) || (kindModel(Y) != "blend")){
        return;
    }
    var X = '<div id=blendStyleMenu class=optionMenu style="top: 50; left: 20; height: 90;">' + '<div name=none class=optionItem>Solid Fill</div>' + '<div name=linear class=optionItem>Linear</div>' + '<div name=radial class=optionItem>Radial</div>' + '<div name=rectangular class=optionItem>Rectangular</div>' + '</div>' + '<div id=blendDirectionMenu class=optionMenu style="top: 150; left: 20; height: 160;">' + '<div name=leftToRight class=optionItem>From Left to Right</div>' + '<div name=rightToLeft class=optionItem>From Right to Left</div>' + '<div name=topToBottom class=optionItem>From Top to Bottom</div>' + '<div name=bottomToTop class=optionItem>From Bottom to Top</div>' + '<div name=topLeftToBottomRight class=optionItem>From Top, Left to Bottom, Right</div>' + '<div name=bottomRightToTopLeft class=optionItem>From Bottom, Right to Top, Left</div>' + '<div name=topRightToBottomLeft class=optionItem>From Top, Right to Bottom, Left</div>' + '<div name=bottomLeftToTopRight class=optionItem>From Bottom, Left to Top, Right</div>' + '</div>';
    var W = [{
        type : 'raw', value : X
    }];
    var V = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('blendOptions', 'Blend options:', "", "blendAccept()", "closeModal()", W, V, null);
    setOption(getElement('blendStyleMenu'), retrieveModel(Y, "blendStyle"));
    setOption(getElement('blendDirectionMenu'), retrieveModel(Y, "blendDirection"));
}
function blendAccept(){
    closeModal();
    var Z = getModel();
    var Y = targetModel(Z);
    var X = getElement('blendStyleMenu');
    var W = getOption(X);
    if(W != null)
        decorateUtility("blendStyle", W, false);
    X = getElement('blendDirectionMenu');
    W = getOption(X);
    if(W != null)
        decorateUtility("blendDirection", W, false);
}
function bulletsCommand(Z){
    var Y = targetModel();
    if(Y && kindModel(Y) == "slide"){
        Y = descendModel(Y, "frame", kItemsName, "prefix");
        if(Y)
            selectUtility(Y);
    }
    if(Y == null || fixedModel(Y))
        return;
    if(Z == null)
        switch(kindModel(Y)){
        case "text" : 
            Z = "bullet1";
            break;
        case "frame" : 
            if(containsString(textModel(Y), kItemsName, "prefix"))
                Z = "bullets";
            break;
    }
    if(Z == null)
        return;
    var X,
    W,
    V,
    U,
    T;
    var S = '<option value="alphaCap">A., B., C., ...</option>' + '<option value="alphaCapP">A), B), C), ...</option>' + '<option value="alpha">a., b., c., ...</option>' + '<option value="alphaP">a), b), c), ...</option>' + '<option value="romanCap">I., II., III., ...</option>' + '<option value="romanCapP">I), II), III), ...</option>' + '<option value="roman">i., ii., iii., ...</option>' + '<option value="romanP">i), ii), iii), ...</option>' + '<option value="numeric">1., 2., 3., ...</option>' + '<option value="numericP">1), 2), 3), ...</option>' + '<option value="square">' + getString("strBulletSquareHollow") + '</option>' + '<option value="box">' + getString("strBulletSquareFilled") + '</option>' + '<option value="circle">' + getString("strBulletCircle") + '</option>' + '<option value="bullet">' + getString("strBulletBullet") + '</option>' + '<option value="asterisk">' + getString("strBulletAsterisk") + '</option>' + '<option value="angle">' + getString("strBulletAngle") + '</option>' + '<option value="guillemet">' + getString("strBulletGuillemet") + '</option>' + '<option value="dash">' + getString("strBulletDash") + '</option>' + '<option value="none">' + getString("strNoneSmall") + '</option>';
    if(Z == "bullet1"){
        if(kindModel(Y) != "text")
            return;
        X = retrieveModel(Y, "bullet1");
        if(X == null || X == "")
            X = "automatic";
        S = '<option value="automatic">' + getString("strAutomaticSmall") + '</option>' + S;
        W = '<nobr>' + getString("strItemMark") + ': <select id=level1 name="level1">' + S + '</select></nobr><br>';
        V = [{
            type : 'raw', value : W
        }];
        U = [{
            type : 'accept'
        }, 
        {
            type : 'cancel'
        }];
        openModal('bulletOptions', getString("strBulletPointOptions") + ":", "", "bulletsAccept('bullet1')", "closeModal()", V, U, null);
        T = getElement('level1');
        T.value = (X != null && X != "") ? X : "none";
    }
    else if(Z == "bullets"){
        Y = ascendModel(Y, "frame");
        if(Y == null)
            return;
        X = retrieveDefault(Y, "bullets", kDefaultBullets);
        if(typeof(X) == "string")
            X = kDefaultBullets;
        W = '<nobr>' + getString("strLevel1") + ': <select id=level1 name="level1">' + S + '</select></nobr><br>' + '<nobr>' + getString("strLevel2") + ': <select id=level2 name="level2">' + S + '</select></nobr><br>' + '<nobr>' + getString("strLevel3") + ': <select id=level3 name="level3">' + S + '</select></nobr><br>' + '<nobr>' + getString("strLevel4") + ': <select id=level4 name="level4">' + S + '</select></nobr><br>' + '<nobr>' + getString("strLevel5") + ': <select id=level5 name="level5">' + S + '</select></nobr><br>';
        V = [{
            type : 'raw', value : W
        }];
        U = [{
            type : 'accept'
        }, 
        {
            type : 'cancel'
        }];
        openModal('bulletOptions', getString("strBulletPointOptions") + ":", "", "bulletsAccept('bullets')", "closeModal()", V, U, null);
        for(var R = 0; R < 5; ++ R){
            var Q = X[R];
            T = getElement('level' + (R + 1));
            T.value = (Q != null && Q != "") ? Q : "none";
        }
    }
}
function bulletsAccept(Z){
    closeModal();
    var Y = targetModel();
    if(Z == "bullet1"){
        if(Y){
            var X = getElement('level1').value;
            if(X){
                if(X == "automatic")
                    X = null;
                postStyleCommand(Y, "bullet1", X, false, "bulletOptions", getString("strBulletOptions"));
            }
        }
    }
    else if(Z == "bullets"){
        Y = ascendModel(Y, "frame");
        if(Y){
            var W = new Array();
            for(var V = 0; V < 5; ++ V)
                W[V] = getElement('level' + (V + 1)).value;
            if(W)
                postStyleCommand(Y, "bullets", W, false, "bulletOptions", getString("strBulletOptions"));
        }
    }
}
function couldCreate(Z, Y){
    var X = false;
    var W = getModel();
    var V = Y ? Y : targetModel();
    if(V == null)
        V = descendModel(W, "folder", kSlidesName);
    while(( ! X) && (V != null)){
        if(allowModel(Z, V, false))
            X = true;
        else if(allowModel(Z, V, true))
            X = true;
        else
            V = parentModel(V);
    }
    if( ! X)
        V = null;
    return V;
}
function createCommand(Z, Y, X, W){
    var V = false;
    var U = getModel();
    var T = X ? X : targetModel(U);
    var S = null;
    var R = null;
    var Q = W ? W : 'default';
    var P;
    if(T == null)
        T = descendModel(U, "folder", kSlidesName);
    switch(Z){
        case "slide" : 
            var O = descendModel(U, "folder", kMastersName);
            if(Y == "clone"){
                S = cloneModel(T);
            }
            else if(isAncestor(O, T)){
                S = slideUtility(getString("strNewMaster"), true, true, true);
            }
            else{
                var N = null, M;
                M = node2slide(T);
                if(M != null)
                    N = index2model(M.master);
                else
                    N = childModel(O, 0);
                if(N != null){
                    S = slaveModel(N);
                    entryModel(S, "");
                }
                else{
                    S = slideUtility("", true, true);
                }
            }
            break;
        case "hline" : 
            S = createModel(Z, getString("strHorizontalLine"));
            decorateModel(S, "bounds", newBounds(3000, 1000, 3060, 7000));
            decorateModel(S, "borderWidth", "2");
            decorateModel(S, "borderStyle", "solid");
            break;
        case "vline" : 
            S = createModel(Z, getString("strVerticalLine"));
            decorateModel(S, "bounds", newBounds(2000, 4000, 5500, 4060));
            decorateModel(S, "borderWidth", "2");
            decorateModel(S, "borderStyle", "solid");
            break;
        case "grid" : 
            Q = null;
            S = createModel(Z, Y.name);
            decorateModel(S, "fileInfo", cloneObject(Y));
            decorateModel(S, "bounds", newBounds(2200, 1000, 4900, 7000));
            break;
        case "shape" : 
            S = createModel(Z, getString("strRectangle"));
            decorateModel(S, "bounds", newBounds(3000, 2000, 4500, 6000));
            decorateModel(S, "backgroundColor", "gray");
            break;
        case "blend" : 
            S = createModel(Z, "");
            decorateModel(S, "bounds", newBounds(3000, 2000, 4500, 6000));
            decorateModel(S, "color", "black");
            decorateModel(S, "backgroundColor", "white");
            decorateModel(S, "blendStyle", "linear");
            decorateModel(S, "blendDirection", "leftToRight");
            break;
        case "picture" : 
            P = "http://";
            switch(typeof(Y)){
                case "string" : 
                    P = Y;
                    Q = null;
                    break;
                case "object" : 
                    P = kRootUrl + gOpenScript + "?id=" + Y.id;
                    Q = null;
                    break;
            }
            S = createModel(Z, P);
            decorateModel(S, "pictureMode", "scale");
            decorateModel(S, "tiling", "repeat");
            decorateModel(S, "bounds", newBounds(2000, 2500, 4500, 5000));
            if(Y){
                if(typeof(Y) == "object")
                    decorateModel(S, "fileInfo", cloneObject(Y));
                entryModel(S, P);
                S._state = "none";
            }
            break;
        case "textbox" : 
            if(Y == null)
                Y = "";
            S = textboxUtility(Y);
            break;
        default : 
            break;
    }
    if(S == null)
        return;
    while((V == false) && (T != null)){
        if(allowModel(S, T, false)){
            R = insertCommand(S, null, T.index, false, (X == null) ? Q : null);
            V = true;
        }
        else if(allowModel(S, T, true)){
            R = insertCommand(S, T.index, null, false, (X == null) ? Q : null);
            V = true;
        }
        else{
            T = parentModel(T);
        }
    }
    if( ! V)
        S = disposeModel(S);
    else
        closeEditor();
    return R;
}
function postCreateCommand(Z, Y, X){
    if( ! couldCreate(Z, X)){
        hb_alert("<nobr>" + getString("strSelectSlideMaster") + ".</nobr>", getString("strInsertItem"));
        return;
    }
    return pushCommand(createCommand(Z, Y, X));
}
function insertTextItem(Z, Y, X){
    var W = targetModel();
    var V = createModel("text", Y ? Y : "");
    if(V == null)
        return;
    if(W != null && Z == null)
        Z = ascendModel(W, "frame", kItemsName, "prefix");
    if(Z == null)
        Z = descendModel(node2slide(W), "frame", kItemsName, "prefix");
    V.master = Z.index;
    if( ! isAncestor(Z, W))
        W = Z;
    if(allowModel(V, W, false)){
        V.master = masterModel(W, false);
        if(W && W.kind == "text")
            transferModel(W, V);
        postInsertCommand(V, null, W.index, false, X ? X : "default");
    }
    else if(allowModel(V, W, true)){
        V.master = masterModel(W, true);
        postInsertCommand(V, W.index, null, true, X ? X : "default");
    }
    else{
        delete(V.master);
        V = disposeModel(V);
    }
}
function insertSlide(Z, Y){
    var X = createCommand("slide", null, null, Z);
    if(X && Y)
        entryModel(X.data.node, Y);
    pushCommand(X);
}
function optionsCommand(Z){
    if(Z == null)
        return;
    switch(kindModel(Z)){
        case "slide" : 
            backgroundCommand();
            break;
        case "frame" : 
            if(containsString(textModel(Z), kItemsName, "prefix"))
                bulletsCommand();
            break;
        case "text" : 
            bulletsCommand();
            break;
        case "picture" : 
            choosePictureUtility(Z);
            break;
        case "blend" : 
            blendCommand();
            break;
    }
}
function openPictureOptions(Z, Y, X){
    var W = null;
    if(Z == null){
        W = targetModel();
        if(W == null || kindModel(W) != "picture")
            return;
    }
    var V = '<nobr><input id=modeScale name=pictureMode type=radio value="scale" checked=true>' + '<span>' + getString("strScaled") + '</span></nobr><br>' + '<nobr><input id=modeRaw name=pictureMode type=radio value="raw">' + '<span>' + getString("strTiled") + '</span></nobr><br>' + '<nobr><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id=tileH type=checkbox></span>' + '<span>' + getString("strRepeatHoriz") + '</span></nobr><br>' + '<nobr><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id=tileV type=checkbox></span>' + '<span>' + getString("strRepeatVert") + '</span></nobr>';
    var U = [{
        type : 'raw', value : V
    }];
    var T = [{
        type : 'accept'
    }, 
    {
        type : 'cancel'
    }];
    openModal('pictureOptions', getString("strPictureItemOptions") + ":", "", Y ? Y : "pictureOptionsAccept()", X ? X : "closeModal()", U, T, null);
    var S,
    R;
    if(Z != null){
        S = Z.mode;
        R = Z.tiling;
    }
    else{
        S = retrieveDefault(W, "pictureMode", "scale");
        R = retrieveDefault(W, "tiling", "repeat");
    }
    checkElement('modeScale', (S == "scale"));
    checkElement('modeRaw', (S == "raw"));
    checkElement('tileH', ((R == "repeat") || (R == "repeat-x")));
    checkElement('tileV', ((R == "repeat") || (R == "repeat-y")));
}
function pictureOptionsAccept(){
    closeModal();
    var Z = targetModel();
    var Y = elementCheck('modeScale') ? "scale" : "raw";
    var X = elementCheck('tileH');
    var W = elementCheck('tileV');
    var V;
    if(X){
        if(W)
            V = "repeat";
        else
            V = "repeat-x";
    }
    else{
        if(W)
            V = "repeat-y";
        else
            V = "no-repeat";
    }
    postStyleCommand(Z, ["pictureMode", "tiling"], [Y, V], false, "pictureOptions", "Picture Options");
}
function editMenuNode(Z, Y){
    if(kindModel(Z) == "frame"){
        switch(textModel(Z)){
            case kTitleName : 
                if(Y){
                    var X = ascendModel(Z, "slide");
                    var W = createModel("textbox", textModel(X, true));
                    var V = cloneModel(Z);
                    V.text = kTextboxName;
                    var U = retrieveModel(Z, "bounds");
                    if(U)
                        decorateModel(V, "bounds", U);
                    for(var T in gFontKeys){
                        U = retrieveModel(X, T);
                        if(U)
                            decorateModel(W, T, U);
                    }
                    insertModel(V, W, false);
                    return W;
                };
                break;
            case kTextboxName : 
                Z = ascendModel(Z, "textbox");
                break;
        }
    }
    if(Y)
        return cloneModel(Z);
    return Z;
}
function copyCommand(){
    if(usingEditor())
        return;
    var Z = targetModel();
    if(Z == null || fixedModel(Z))
        return;
    Z = editMenuNode(Z, true);
    if(Z == null)
        return;
    if(kindModel(Z) != "slide")
        Z = emancipateModel(Z);
    setScrap("node", Z);
}
function cutCommand(){
    copyCommand();
    clearCommand('cut', 'Cut');
}
function offsetDuplicate(Z, Y, X){
    var W = retrieveModel(Y, "bounds", true);
    if(W == null){
        if(kindModel(Y) == "textbox"){
            var V = descendModel(Y, "frame");
            W = retrieveModel(V, "bounds", true);
        }
    }
    if(W == null)
        return;
    if( ! X)
        Z = parentModel(Z);
    for(var U = countModel(Z) - 1; U >= 0; -- U){
        var T = childModel(Z, U);
        if(T.kind == Y.kind){
            var S = retrieveModel(T, "bounds");
            if(S && equalBounds(W, S)){
                var R = 200, Q = 200;
                if(W.left + R > kSlideWidth)
                    R =- 200;
                if(W.top + Q > kSlideHeight)
                    Q =- 200;
                W = offsetBounds(W, R, Q);
                decorateModel(Y, "bounds", W);
            }
        }
    }
}
function pasteCommand(Z, Y, X){
    if(usingEditor() || (Z == null && typeScrap() != "node"))
        return;
    var W = targetModel();
    if(W == null)
        return;
    if(Z == null)
        Z = getScrap();
    else
        disposeModel(Z);
    if(Z == null)
        return;
    while(W != null){
        if(allowModel(Z, W, false)){
            child = false;
            break;
        }
        if(allowModel(Z, W, true)){
            child = true;
            break;
        }
        W = parentModel(W);
    }
    if(W){
        Z = cloneModel(Z);
        switch(kindModel(Z)){
            case "frame" : 
                if(child){
                    Z.text = uniqueModel(W, "frame", Z.text);
                    Z.master = masterModel(W, true, null, "frame", Z.text);
                    if(Z.master)
                        adjustMasters(Z, index2model(Z.master));
                }
                else{
                    Z.text = uniqueModel(W.parent, "frame", Z.text);
                    Z.master = masterModel(W.parent, true, null, "frame", Z.text);
                    if(Z.master)
                        adjustMasters(Z, index2model(Z.master));
                }
                break;
            case "text" : 
                Z.master = masterModel(W, true);
                if(Z.master)
                    adjustMasters(Z, index2model(Z.master));
                break;
        }
        offsetDuplicate(W, Z, child);
        if(folderModel(W) != kSlidesName && kindModel(Z) == "slide")
            Z = emancipateModel(Z);
        if(Y == null)
            Y = "paste";
        if(X == null)
            X = "Paste";
        postInsertCommand(Z, child ? W.index : null, child ? null : W.index, false, null, Y, X);
    }
}
function clearCommand(Z, Y){
    var X = targetModel();
    if(X == null || fixedModel(X))
        return;
    X = editMenuNode(X);
    if(X)
        postDeleteCommand(X, Z, Y);
}
function duplicateCommand(){
    var Z = targetModel();
    if(Z == null || fixedModel(Z) || usingEditor())
        return;
    var Y = editMenuNode(Z, true);
    if(Y)
        pasteCommand(Y, 'duplicate', getString("strDuplicate"));
}
function dropCommand(Z, Y, X, W, V){
    if(Z == Y)
        return true;
    var U = dropModel(Z, Y, X);
    if(V && U){
        var T = Z;
        if(W)
            Z = cloneModel(Z);
        var S;
        if(U == "child")
            S = insertCommand(Z, Y.index, null, X, false, 'dragdrop', getString("strDragNDrop"));
        else
            S = insertCommand(Z, null, Y.index, X, false, 'dragdrop', getString("strDragNDrop"));
        var R = folderModel(T);
        var Q = folderModel(Y);
        if(R != Q){
            switch(R){
                case kSlidesName : 
                    precedeCommand(S, emancipateCommand(Z));
                    break;
                case kMastersName : 
                    if(W)
                        followCommand(S, enslaveCommand(Z, T));
                    else
                        precedeCommand(S, enlightenCommand(Z));
                    break;
            }
        }
        if( ! W && parentModel(Z))
            precedeCommand(S, deletePrimitive(Z));
        pushCommand(S);
    }
    return(U != null);
}
var gNudgeChange = false;
var gNudgeBounds = null;
function textboxUtility(Z){
    var Y = createModel("textbox", Z);
    var X = createModel("frame", kTextboxName);
    decorateModel(X, "bounds", newBounds(2600, 1000, 3600, 6500));
    decorateModel(Y, "fontSize", 36);
    decorateModel(Y, "fontFamily", "arial black");
    insertModel(X, Y, false);
    return Y;
}
function populateUtility(Z){
    var Y = Z;
    var X = 5;
    for(var W = 1; W <= X; ++ W){
        var V = createModel("text", "style for level " + W);
        insertModel(V, Y);
        Y = V;
        decorateModel(V, "fontSize", ((W <= 1) ? 36 : (W <= 3) ? 30 : 24));
        decorateModel(V, "fontFamily", "arial");
        if(W <= 2)
            decorateModel(V, "fontWeight", "bold");
    }
}
function slideUtility(Z, Y, X, W){
    var V = createModel("slide", Z);
    if(Y){
        var U = createModel("frame", kTitleName);
        decorateModel(U, "bounds", newBounds(400, 400, 1700, 7600));
        decorateModel(V, "fontSize", 48);
        decorateModel(V, "fontFamily", "arial");
        decorateModel(V, "fontWeight", "bold");
        insertModel(U, V, false);
    }
    if(X){
        var T = createModel("frame", kItemsName);
        decorateModel(T, "bounds", newBounds(2100, 400, 5600, 7600));
        insertModel(T, V, false);
        if(W)
            populateUtility(T);
        else{
            decorateModel(T, "fontSize", 36);
            decorateModel(T, "fontFamily", "arial");
            decorateModel(T, "fontWeight", "bold");
        }
    }
    return V;
}
function arrowUtility(Z, Y, X){
    if(Y)
        nudgeUtility(Z);
    else if(X)
        moveUtility(Z);
    else
        findUtility(Z);
}
function moveUtility(Z, Y){
    if(Y == null)
        return false;
    if( ! moveModel(Y, Z, true))
        return false;
    outputModel();
    return true;
}
function findUtility(Z){
    if(usingEditor())
        return false;
    var Y = findModel(targetModel(), Z);
    if(Y == null)
        return false;
    selectUtility(Y);
    return true;
}
function jumpUtility(Z){
    if(usingEditor())
        return false;
    var Y = jumpModel(targetModel(), Z);
    if(Y == null)
        return false;
    selectUtility(Y);
    return true;
}
function nudgeUtility(Z){
    if(usingEditor())
        return false;
    if( ! usingHandle())
        return false;
    var Y = targetModel();
    if(Y == null)
        return false;
    var X = whereHandle();
    if( ! nudgeHandle(Z, boundsDrawing()))
        return false;
    if( ! gNudgeChange){
        gNudgeChange = true;
        gNudgeBounds = X;
    }
    return true;
}
function moveCallback(Z){
    var Y = index2model(this.data.index);
    if(Y){
        var X = retrieveModel(Y, "bounds", true);
        if(this.data.bounds == null)
            deleteModel(Y, "bounds");
        else{
            var W = retrieveModel(Y, "bounds");
            mapModel(Y, W, this.data.bounds);
        }
        this.data.bounds = X;
        if(this.level == 1 && Z == kExecuteMessage)
            selectUtility(Y);
        changedModel(Y);
    }
}
function postMove(Z, Y, X){
    var W = currentCommand();
    if(W && (W.id == "nudgeSelection") && (X == "nudgeSelection"))
        undoCommand();
    var V = 
    {
        "index" : Z, "bounds" : Y
    };
    return postCommand(moveCallback, V, X ? X : 'moveSelection', getString("strMove"));
}
function outlineMoveCommand(Z, Y, X, W){
    var V = index2model(Z);
    if((X == "Demote") && (kindModel(V) == "slide")){
        var U = V;
        var T = prevSibling(U);
        if(T == null)
            return;
        var S = createModel("text", textModel(U, true));
        var R = descendModel(node2slide(T), "frame", kItemsName);
        T.opened = true;
        S.master = masterModel(R, true);
        var Q = insertCommand(S, R.index, null, false, null);
        var P = descendModel(node2slide(U), "frame", kItemsName);
        for(var O = 0; O < countModel(P); O ++ ){
            var N = childModel(P, O);
            N.master = masterModel(R, true);
            followCommand(Q, deleteCommand(N));
            followCommand(Q, insertCommand(N, R.index, null, false, null));
        }
        followCommand(Q, deleteCommand(U));
        followCommand(Q, selectCommand(S.index));
        return Q;
    }
    else if((X == "Promote") && containsString(parentModel(V).text, kItemsName, "prefix") &&! (W && (whereEditor() == "drawing"))){
        var M = V;
        Q = createCommand("slide", null, node2slide(M));
        var L = Q.data.node;
        entryModel(L, textModel(M, true));
        var K = descendModel(L, "frame", kItemsName);
        for(O = 0; O < countModel(M); O ++ ){
            N = childModel(M, O);
            N.master = masterModel(K, true);
            followCommand(Q, deleteCommand(N));
            followCommand(Q, insertCommand(N, K.index, null, false, null));
        }
        var J = nextSibling(M);
        while(J != null){
            J.master = masterModel(K, true);
            followCommand(Q, deleteCommand(J));
            followCommand(Q, insertCommand(J, K.index, null, false, null));
            J = nextSibling(J);
        }
        followCommand(Q, deleteCommand(M));
        followCommand(Q, selectCommand(L.index));
        return Q;
    }
    else{
        return makeCommand(outlineMoveCallback, Z, Y, X);
    }
}
function selectCommand(Z){
    return makeCommand(selectCallback, Z, "select");
}
function selectCallback(Z){
    if(Z == kExecuteMessage)
        selectUtility(index2model(this.data));
}
function postOutlineMove(Z, Y, X, W){
    var V = outlineMoveCommand(Z, Y, X, W);
    if(V)
        return pushCommand(V);
}
function outlineMoveCallback(Z){
    var Y = index2model(this.data);
    var X = this.id;
    if(Z == kUndoMessage){
        switch(X){
            case "moveUp" : 
                X = "moveDown";
                break;
            case "moveDown" : 
                X = "moveUp";
                break;
            case "moveRight" : 
                X = "moveLeft";
                break;
            case "moveLeft" : 
                X = "moveRight";
                break;
        }
    }
    switch(X){
        case "moveUp" : 
            moveUtility("up", Y);
            break;
        case "moveDown" : 
            moveUtility("down", Y);
            break;
        case "moveLeft" : 
            moveUtility("left", Y);
            break;
        case "moveRight" : 
            moveUtility("right", Y);
            break;
    }
}
function finishUtility(){
    if(gNudgeChange){
        mapUtility(gNudgeBounds, whereHandle(), "nudgeSelection");
        gNudgeChange = false;
        gNudgeBounds = null;
    }
}
function mapUtility(Z, Y, X){
    var W = boundsDrawing();
    var V = sourceRender();
    var U = mapBounds(Z, W, V);
    var T = mapBounds(Y, W, V);
    if( ! equalBounds(U, T))
        postMove(targetModel().index, T, X);
}
function selectUtility(Z, Y, X){
    var W = targetModel();
    if( ! Y && Z == W)
        return;
    deselectModel(getModel(), X);
    selectModel(Z, X);
}
function toggleUtility(Z, Y, X, W){
    var V = targetModel();
    if(V == null)
        return null;
    postToggleCommand(V, Z, Y, X, W || shouldDecorateChildren(V, Z));
    updateGUI(targetModel(getModel()));
}
function bumpUtility(Z, Y, X, W, V, U){
    var T = targetModel();
    if(T)
        T = alternateModel(T, Z);
    if(T == null)
        return null;
    var S = null;
    if(kindModel(T) == "frame" && containsString(textModel(T), kItemsName, "prefix"))
        S = bumpRecursive(T, Z, Y, X, W, V, U);
    else
        S = bumpCommand(T, Z, Y, X, W, V, U);
    if(S != null)
        pushCommand(S);
}
function bumpRecursive(Z, Y, X, W, V, U, T, S){
    if(kindModel(Z) == "text"){
        var R = bumpCommand(Z, Y, X, W, V, U, T);
        if(S == null)
            S = R;
        else
            followCommand(S, R);
    }
    for(var Q = 0; Q < countModel(Z); ++ Q){
        var P = childModel(Z, Q);
        S = bumpRecursive(P, Y, X, W, V, U, T, S);
    }
    return S;
}
function retrieveUtility(Z, Y){
    var X = targetModel();
    if(X == null)
        return null;
    if(Y)
        return retrieveRecursive(X, Z);
    return retrieveModel(X, Z);
}
function decorateUtility(Z, Y, X){
    if(Y == "none")
        return;
    if(Y == "null")
        Y = null;
    var W = targetModel();
    if(W)
        W = alternateModel(W, Z);
    if(W == null)
        return;
    var V = null;
    X = X || shouldDecorateChildren(W, Z);
    if( ! X){
        var U;
        switch(Z){
            case "color" : 
                U = retrieveModel(W, "borderWidth", true);
                if(Y == "transparent"){
                    if(U != null){
                        V = styleCommand(W, "borderWidth", null);
                        followCommand(V, styleCommand(W, "borderStyle", null));
                    }
                }
                else{
                    if(U == null){
                        V = styleCommand(W, "borderWidth", "2");
                        followCommand(V, styleCommand(W, "borderStyle", "solid"));
                    }
                }
                break;
        }
    }
    var T = styleCommand(W, Z, Y, X);
    if(V)
        followCommand(T, V);
    pushCommand(T);
}
function stripUtility(Z){
    var Y = targetModel();
    if(Y == null)
        return;
    var X = null, W;
    switch(kindModel(Y)){
        case "slide" : 
            if(gTrackEditorWasOpen){
                postRevertCommand(Y, gFontKeys, false);
                return;
            }
            break;
        case "frame" : 
            var V = textModel(Y);
            if(V == kTitleName){
                W = ascendModel(Y, "slide");
                if(W)
                    X = revertCommand(W, gFontKeys, false);
                Z = false;
            }
            else if(V == kTextboxName){
                W = ascendModel(Y, "textbox");
                if(W)
                    X = revertCommand(W, gFontKeys, false);
                Z = false;
            }
            break;
    }
    var U = revertCommand(Y, null, Z);
    if(X)
        followCommand(U, X);
    pushCommand(U);
}
function openModelUtility(Z, Y, X){
    var W = getModel();
    if( ! Y)
        W = targetModel(W);
    if(Y && X){
        openModel(W, Z, X, true);
        outputOutline();
    }
    else{
        openModel(W, Z, X, false);
    }
}
function titleUtility(){
    var Z = descendModel(targetModel(), "slide");
    if(Z == null)
        Z = ascendModel(targetModel(), "slide");
    if(Z == null)
        return;
    var Y = descendModel(Z, "frame", kTitleName);
    if(Y != null){
        selectUtility(Y);
        return;
    }
    var X = index2model(Z.master);
    if(X != null)
        Y = descendModel(X, "frame", kTitleName);
    var W = null;
    if(Y != null){
        W = cloneModel(Y);
    }
    else{
        W = createModel("frame", kTitleName);
        decorateModel(W, "bounds", newBounds(400, 400, 1700, 7600));
    }
    postInsertCommand(W, Z.index, null, false);
}
function itemsUtility(){
    var Z = targetModel();
    var Y = descendModel(Z, "slide");
    if(Y == null)
        Y = ascendModel(Z, "slide");
    if(Y == null)
        return;
    var X = uniqueModel(Y, "frame", kItemsName);
    if(X == null || X == "")
        return;
    var W = (folderModel(Y) == kMastersName);
    var V = null;
    if(W){
        V = descendModel(Y, "frame", kItemsName);
    }
    else{
        var U = index2model(Y.master);
        if(U != null)
            V = descendModel(U, "frame", X);
    }
    var T = null;
    if(V != null){
        T = cloneModel(V ,! W);
        T.text = X;
        if( ! W)
            T.master = V.index;
    }
    else{
        T = createModel("frame", X);
        if(W)
            populateUtility(T);
        else
            T.master = masterModel(Y, true, null, "frame", X);
        decorateModel(T, "bounds", newBounds(2100, 400, 5600, 7600));
    }
    if(T){
        offsetDuplicate(Y, T, true);
        postInsertCommand(T, Y.index, null, false);
    }
}
function slaveUtility(Z){
    var Y = getModel();
    var X = targetModel(Y);
    if(X == null)
        return;
    if((kindModel(X) != "slide") || (folderModel(X) != kMastersName))
        return;
    var W = slaveModel(X);
    var V = descendModel(Y, "folder", kSlidesName);
    entryModel(W, "");
    insertModel(W, V, false);
    postInsertCommand(W, V.index, null, false, Z ? Z : "outline");
}
function masterUtility(){
    var Z = getModel();
    var Y = targetModel(Z);
    if(Y == null)
        return;
    if((kindModel(Y) != "slide") || (folderModel(Y) != kSlidesName))
        return;
    var X = cloneModel(Y);
    var W = descendModel(Z, "folder", kMastersName);
    entryModel(X, "New Master");
    var V = insertCommand(X, W.index, null, false, true, 'slide2master', getString("strCopyAsMaster"));
    followCommand(V, emancipateCommand(X));
    followCommand(V, enslaveCommand(Y, X));
    pushCommand(V);
}
function focusUtility(){
    return;
    if(currModal() != null)
        return;
    switch(gPageMode){
        case "editing" : 
            focusOutline();
            break;
        case "sorting" : 
            focusSorting();
            break;
        case "showing" : 
            focusShowing();
            break;
        default : 
            break;
    }
}
var gChooserOptions = null;
function chooseFileUtility(Z){
    if(Z != null){
        gChooserOptions = Z;
        gChooserOptions.fileList = null;
        if(gChooserOptions.type == null)
            gChooserOptions.type = 'img';
        if(gChooserOptions.url != null && gChooserOptions.url == "")
            gChooserOptions.url = "http://";
        gChooserOptions.startUrl = gChooserOptions.url;
        if(gChooserOptions.title == null || gChooserOptions.title == "")
            gChooserOptions.title = getString("strSelectFile");
        if(gChooserOptions.prompt == null || gChooserOptions.prompt == "")
            gChooserOptions.prompt = getString("strSelectFileMyFiles") + ":";
    }
    if(gChooserOptions == null)
        return;
    gChooserOptions.timer = killTimeout(gChooserOptions.timer);
    var Y = kRootUrl + 'filelist';
    if(gChooserOptions.type)
        Y += '?type=' + gChooserOptions.type;
    var X = (gChooserOptions.prompt ? (gChooserOptions.prompt + '<br><br>') : '');
    var W;
    if(gChooserOptions.type == 'img'){
        X += '<table width="100%"><tr><td>';
        fieldLenth = 310;
    }
    else{
        W = 420;
    }
    X += '<div id=fileListMenu class=optionMenu style="width:' + W + '">';
    if(isLoggedIn()){
        X += (gChooserOptions.fileList ? fileListContents(gChooserOptions.fileList) : writeOption(null, "... " + getString("strLoadingFileList") + "...", false, "italic")) + '</div>';
    }
    else{
        X += writeOption(null, "... Not Logged In ...", false, "italic") + '</div>';
    }
    if(gChooserOptions.type == 'img'){
        X += '</td><td><image id=thumbnail src="img/dot_clear.gif"></td></tr></table>';
    }
    if(gChooserOptions.url != null)
        X += '<br>' + getString("strEnterURL") + ':<br>';
    var V = [{
        type : 'raw', value : X
    }];
    if(gChooserOptions.url != null)
        V[V.length] = 
    {
        type : 'textarea', id : 'filenameEntry',
        label : getString("strURL"),
        value : gChooserOptions.url ? gChooserOptions.url : gChooserOptions.url,
        rows : 2,
        cols : 45,
        maxlength : 500
    };
    if(gChooserOptions.extra != null)
        V[V.length] = 
    {
        type : 'raw', value : gChooserOptions.extra
    };
    var U = new Array();
    if(false && gChooserOptions.search)
        U[U.length] = 
    {
        type : 'other', value : getString("strSearch") + "...",
        onclick : "chooseFileSearch();"
    };
    if(gChooserOptions.upload)
        U[U.length] = 
    {
        type : 'other', value : getString("strUpload") + "...",
        onclick : "chooseFileUpload();"
    };
    if(gChooserOptions.options)
        U[U.length] = 
    {
        type : 'other', value : getString("strOptions") + "...",
        onclick : "chooseFileOptions();"
    };
    U[U.length] = 
    {
        type : 'accept'
    };
    U[U.length] = 
    {
        type : 'cancel'
    };
    openModal('chooseFileDialog', gChooserOptions.title, "", "chooseFileAccept();", "chooseFileCancel();", V, U, null);
    if(gChooserOptions.type == 'img')
        fileListMenu.setHook = thumbnailView;
    var T = getElement("fileListResource");
    if(isLoggedIn()){
        if(T)
            setElementSrc(T, Y);
    }
}
function thumbnailView(Z){
    if(gChooserOptions.fileList && gChooserOptions.fileList.length != 0){
        var Y = Z.name;
        var X = gChooserOptions.fileList[Y];
        var W = X.id;
        var V = gDocument.images.thumbnail.src = gOpenScript + "?mode=tbn&id=" + W;
    }
}
function chooseFileGetFile(){
    var Z = getElement('fileListMenu');
    if(Z)
        var Y = getOption(Z);
    if(Y != null)
        return cloneObject(gChooserOptions.fileList[Y], 
    {
        'id' : true,
        'name' : true
    });
    return null;
}
function chooseFileGetEntry(){
    if(gChooserOptions == null)
        return null;
    var Z = gChooserOptions.url;
    var Y = gChooserOptions.chosen;
    if(Z == null)
        Z = "";
    if(Z == "" || (Z == gChooserOptions.startUrl && Y != null)){
        if(gChooserOptions.fileList == null && gChooserOptions.id != null)
            Z = false;
        else
            Z = Y;
    }
    return Z;
}
function fileListContents(Z){
    var Y = '';
    if(Z.length == 0)
        Y += writeOption(null, getString("strNoFilesThisType"), false, "italic");
    else{
        var X = gChooserOptions ? gChooserOptions.id : null;
        for(var W = 0; W < Z.length; ++ W)
            Y += writeOption(W, Z[W].name, (X == Z[W].id));
    }
    return Y;
}
function fileUploaded(Z, Y){
    if(Z &&! Z.closed)
        Z.setTimeout("window.close()", 1000);
    var X = getElement("fileListMenu");
    var W = getElement("fileListResource");
    if(X && W && gChooserOptions){
        gChooserOptions.id = Y;
        writeDocumentContents(X, writeOption(null, "... " + getString("strReloadingFileList") + " ...", false, "italic"));
        var V = kRootUrl + 'filelist';
        if(gChooserOptions.type)
            V += '?type=' + gChooserOptions.type;
        setElementSrc(W, V);
    }
}
function fileListLoaded(Z){
    if(gChooserOptions == null)
        return;
    if(gChooserOptions.timer)
        gChooserOptions.timer = killTimeout(gChooserOptions.timer);
    var Y = getElement("fileListMenu");
    if(Z != null)
        gChooserOptions.fileList = Z;
    if(gChooserOptions.fileList == null)
        return;
    if(Y == null){
        gChooserOptions.timer = setTimeout('fileListLoaded();', 50);
        return;
    }
    writeDocumentContents(Y, fileListContents(gChooserOptions.fileList));
}
function chooseFileAccept(){
    gChooserOptions.timer = killTimeout(gChooserOptions.timer);
    chooseFileRecordState();
    if(gChooserOptions && gChooserOptions.accept)
        eval(gChooserOptions.accept);
    chooseFileClose();
}
function chooseFileCancel(){
    gChooserOptions.timer = killTimeout(gChooserOptions.timer);
    chooseFileRecordState();
    if(gChooserOptions && gChooserOptions.cancel)
        eval(gChooserOptions.cancel);
    chooseFileClose();
}
function chooseFileOptions(){
    if(gChooserOptions && gChooserOptions.options){
        chooseFileRecordState();
        chooseFileClose(true);
        eval(gChooserOptions.options);
    }
}
function chooseFileUpload(){
    if(gChooserOptions && gChooserOptions.upload){
        chooseFileRecordState();
        eval(gChooserOptions.upload);
    }
}
function chooseFileSearch(){
    if(gChooserOptions && gChooserOptions.search){
        chooseFileRecordState();
        chooseFileClose(true);
        eval(gChooserOptions.search);
    }
}
function chooseFileRecordState(){
    if(gChooserOptions){
        var Z = chooseFileGetFile();
        if(Z){
            gChooserOptions.chosen = Z;
            gChooserOptions.id = Z.id;
        }
        var Y = getElement("filenameEntry");
        if(Y){
            var X = getValue(Y);
            if(X && X.length > 0 && X.charAt(X.length - 1) == "\n")
                X = X.slice(0, X.length - 2);
            if(X == null || X == "http://" || X == "http://demo.halfbrain.com:8080/demo/image/")
                X = "";
            gChooserOptions.url = X;
        }
        gChooserOptions.entry = chooseFileGetEntry();
    }
}
function chooseFileClose(Z){
    if(gChooserOptions && gChooserOptions.timer)
        gChooserOptions.timer = killTimeout(gChooserOptions.timer);
    closeModal();
    if( ! Z)
        gChooserOptions = null;
}
var gChoosePictureOptions = null;
var gChoosePictureNode = null;
var gChoosePictureKeywords = "";
var gChooseFinish = null;
function choosePictureUtility(Z, Y, X, W, V){
    gChoosePictureOptions = null;
    gChoosePictureNode = Z;
    gChooseFinish = V;
    if(W == null)
        W = (Z != null) ? getString("strPictureItemOptionsCaps") : getString("strInsertPictureItem");
    var U = 
    {
        "type" : "img", "url" : Y ? null : "",
        "title" : W,
        "upload" : "pictureUpload()",
        "search" : "pictureSearch()",
        "options" : X ? null : "pictureOptions()",
        "accept" : "pictureAccept()"
    };
    if(Z){
        var T = retrieveModel(Z, "fileInfo");
        if(T)
            U.id = T.id;
        if( ! Y)
            U.url = textModel(Z, true);
    }
    else{
        if( ! couldCreate("picture")){
            hb_alert("<nobr>" + getString("strSelectSlideMaster") + ".</nobr>", getString("strInsertItem"));
            return;
        }
    }
    chooseFileUtility(U);
}
function pictureAccept(){
    var Z = gChooserOptions.entry;
    if(Z === false){
        if(gChoosePictureOptions == null)
            return;
        if(gChoosePictureNode)
            Z = retrieveModel(gChoosePictureNode, "fileInfo");
        else
            Z = null;
    }
    if(gChooseFinish)
        gChooseFinish(Z, gChoosePictureOptions);
    else if(Z != null){
        var Y,
        X;
        if(gChoosePictureNode == null){
            Y = createCommand("picture", Z);
            if(Y)
                X = Y.data.node;
        }
        else{
            X = gChoosePictureNode;
            if(typeof Z == "string"){
                Y = entryCommand(X, "entry", Z, "pictureOptions", getString("strPictureOptions"));
                if(Y)
                    followCommand(Y, styleCommand(X, "fileInfo", null));
            }
            else{
                var W = kRootUrl + gOpenScript + "?id=" + Z.id;
                Y = entryCommand(X, "entry", W, "pictureOptions", getString("strPictureOptions"));
                if(Y)
                    precedeCommand(Y, styleCommand(X, "fileInfo", Z));
            }
            X._state = "none";
        }
        if(gChoosePictureOptions && Y)
            followCommand(Y, styleCommand(X, ["pictureMode", "tiling"], [gChoosePictureOptions.mode, gChoosePictureOptions.tiling], false));
        pushCommand(Y);
    }
}
function pictureOptions(){
    if(gChoosePictureOptions == null){
        gChoosePictureOptions = 
        {
            "mode" : "scale", "tiling" : "repeat"
        };
        if(gChoosePictureNode){
            gChoosePictureOptions.mode = retrieveDefault(gChoosePictureNode, "pictureMode", gChoosePictureOptions.mode);
            gChoosePictureOptions.tiling = retrieveDefault(gChoosePictureNode, "tiling", gChoosePictureOptions.tiling);
        }
    }
    openPictureOptions(gChoosePictureOptions, "chooseOptionsAccept();", "chooseOptionsCancel();");
}
function chooseOptionsAccept(){
    if(gChoosePictureOptions == null)
        gChoosePictureOptions = new Object();
    gChoosePictureOptions.mode = elementCheck('modeScale') ? "scale" : "raw";
    var Z = elementCheck('tileH');
    var Y = elementCheck('tileV');
    if(Z){
        if(Y)
            gChoosePictureOptions.tiling = "repeat";
        else
            gChoosePictureOptions.tiling = "repeat-x";
    }
    else{
        if(Y)
            gChoosePictureOptions.tiling = "repeat-y";
        else
            gChoosePictureOptions.tiling = "no-repeat";
    }
    closeModal();
    chooseFileUtility();
}
function chooseOptionsCancel(){
    closeModal();
    chooseFileUtility();
}
function pictureUpload(){
    window.open(kRootUrl + gOpenScript + '?new=img&source=app&return=1', "_blank", 'width=520,height=400,scrollbars=no,resizable=yes,status=no');
}
function pictureSearch(){
    comingSoon();
    return;
    if(gChoosePictureKeywords == ""){
        if(gChoosePictureNode)
            gChoosePictureKeywords = retrieveDefault(gChoosePictureNode, "keywords", "");
    }
}
function pictureSearchLookup(){
    gChoosePictureKeywords = getElementValue("keywords");
}
function pictureSearchAccept(){
    gChoosePictureKeywords = getElementValue("keywords");
    closeModal();
    chooseFileUtility();
}
function getSearchSelection(){
    return "";
}
function pictureSearchCancel(){
    closeModal();
    chooseFileUtility();
}
function fileInfoToUrl(Z, Y){
    if( ! Z)
        return null;
    if(Y){
        var X = getMemberInfo();
        if(X)
            return("halfbrain:" + Z.name + "@" + X.id);
    }
    return(kRootUrl + gOpenScript + "?id=" + Z.id);
}
function chooseSpreadsheetUtility(){
    var Z = 
    {
        "type" : "ss", "title" : getString("strInsertSpreadsheet"),
        "accept" : "spreadsheetAccept()"
    };
    chooseFileUtility(Z);
}
function spreadsheetAccept(){
    var Z = gChooserOptions.chosen;
    if(Z == null || typeof(Z) != "object" || Z.id == null)
        return;
    var Y;
    Y = createCommand("grid", Z);
    pushCommand(Y);
}
var gImportSlides = false;
function importSlidesUtility(){
    var Z = '<nobr><input id=importMasters name=importOption type=radio value="masters"' + (gImportSlides ? '' : ' checked=true') + '>' + '<span>' + getString("strImportMasters") + '</span></nobr><br>' + '<nobr><input id=importSlides name=importOption type=radio value="slides"' + (gImportSlides ? ' checked=true' : '') + '>' + '<span>' + getString("strImportMastersSlides") + '</span></nobr>';
    var Y = 
    {
        "type" : "pr", "title" : getString("strImportMastersSlides"),
        "extra" : Z,
        "accept" : "importAccept()"
    };
    chooseFileUtility(Y);
}
function importAccept(){
    var Z = gChooserOptions.chosen;
    if(Z == null || typeof(Z) != "object" || Z.id == null)
        return;
    gImportSlides = elementCheck('importSlides');
    var Y = kRootUrl + 'filecontents?id=' + Z.id;
    var X = getResource(Y, "slideimport", importResource);
    if(X.data)
        importFinish(X);
    setTimeout("closeModal();openModal('importwait', getString(\"strImport\"), '', '', 'closeModal()', [{type:'raw', value:'<nobr>' + getString(\"strImportingPresentation\") + '</nobr>'}], null, null)", 50);
}
function importResource(Z, Y){
    importFinish(getResource(Y, Z, importFinish));
}
function importFinish(__data__){
    if(__data__ == null)
        return;
    if(__data__.error){
        closeModal();
        hb_alert(__data__.error.tooltip);
        return;
    }
    if(__data__.data == null){
        closeModal();
        hb_alert(getString("strCouldNotLoad"), getString("strImportMastersSlides"));
        return;
    }
    __data__ = __data__.data;
    if(typeof __data__ == "string")
        eval("__data__ = " + __data__);
    if(mergeUtility(__data__, gImportSlides) == null){
        closeModal();
        hb_alert(getString("strNothingToImport"), getString("strImportMastersSlides"));
        return;
    }
    closeModal();
}
function mergeUtility(Z, Y){
    conformModel(Z);
    var X = descendModel(Z, "folder", kMastersName);
    var W = descendModel(Z, "folder", kSlidesName);
    if(countModel(W) + countModel(X) == 0)
        return null;
    var V = null;
    var U = getModel();
    var T = emptyCommand("importMasters", getString("strImport"));
    var S = descendModel(U, "folder", kSlidesName);
    if(Y && W && S){
        var R = countModel(W);
        for(i = 0; i < R; ++ i){
            var Q = childModel(W, 0);
            Q.opened = false;
            removeModel(Q);
            followCommand(T, insertCommand(Q, S.index, null, false));
            if(V == null)
                V = Q.index;
        }
    }
    var P = descendModel(U, "folder", kMastersName);
    if(X && P){
        R = countModel(X);
        for(i = 0; i < R; ++ i){
            var O = childModel(X, 0);
            O.opened = false;
            removeModel(O);
            followCommand(T, insertCommand(O, P.index, null, false));
            if(V == null)
                V = O.index;
        }
    }
    followCommand(T, selectCommand(V));
    pushCommand(T);
    return V;
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();