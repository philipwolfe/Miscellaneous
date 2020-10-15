//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gModalID = null;
var gModalValidate = null;
var gModalAccept = null;
var gModalCancel = null;
var gAllowReturns = null;
var gModalTrack = 
{
    kind : null, elem : null,
    lastX : null,
    lastY : null,
    bounds : null
};
function execModalValidate(){
    return eval(gModalValidate);
}
function execModalAccept(){
    eval(gModalAccept);
}
function execModalCancel(){
    eval(gModalCancel);
}
function filterDocument(Z){
    if( ! currModal())
        return false;;
    var Y,
    X,
    W;
    Z.cancelBubble = true;
    Y = false;
    X = Z.srcElement;
    W = modalDialog;
    switch(Z.type){
        case 'mouseover' : 
            if(getClass(X) == 'modalButton'){
                setStyle(X, 'color', '#ff9900');
                setStyle(X, 'borderColor', '#ff9900');
            }
            break;
        case 'mouseout' : 
            if(getClass(X) == 'modalButton'){
                setStyle(X, 'color', '#000099');
                setStyle(X, 'borderColor', '#000099');
            }
            else if(gAppAuthor == 'pr' && getClass(X) == 'button'){
                outButton(X);
            }
            break;
        case 'mousedown' : 
            if(insideDialog(X)){
                switch(X.className){
                    case "optionItem" : 
                        if(typeof(setOption) != "undefined")
                            setOption(X.parentElement, X.name);
                        break;
                    case "swatch" : 
                    case "largeswatch" : 
                        if(typeof(setOption) != "undefined")
                            setSwatch(X.parentElement, X.style.backgroundColor);
                        break;
                    case "modalTopLeftBox" : 
                    case "modalTitle" : 
                    case "modalDragger" : 
                        gModalTrack.kind = "move";
                        if(is.ie4){
                            gModalTrack.elem = modalRect;
                            setBounds(gModalTrack.elem, getBounds(W));
                            setVisible(gModalTrack.elem, true);
                        }
                        else
                            gModalTrack.elem = W;
                        gModalTrack.lastX = Z.screenX;
                        gModalTrack.lastY = Z.screenY;
                        gModalTrack.bounds = insetBounds(getBounds(gDocument.body), 100, 100);
                        break;
                }
            }
            break;
        case 'mouseup' : 
            if(gModalTrack.kind)
                cancelModalTrack();
            break;
        case 'mousemove' : 
            switch(gModalTrack.kind){
                case "move" : 
                    if(Z.button){
                        var V = Z.screenX;
                        var U = Z.screenY;
                        var T = V - gModalTrack.lastX;
                        var S = U - gModalTrack.lastY;
                        var R = gModalTrack.elem;
                        var Q = offsetBounds(getBounds(R), T, S);
                        var P = intersectBounds(gModalTrack.bounds, Q);
                        if(P.width == 0)
                            T = 0;
                        if(P.height == 0)
                            S = 0;
                        R.style.pixelLeft += T;
                        R.style.pixelTop += S;
                        gModalTrack.lastX = V;
                        gModalTrack.lastY = U;
                    }
                    else
                        cancelModalTrack();
                    break;
            }
            break;
        case 'selectstart' : 
            if(X.tagName != "INPUT" && X.tagName != "TEXTAREA")
                Y = true;
            break;
        case 'keydown' : 
            switch(Z.keyCode){
                case 9 : 
                    if(X.type == "textarea" && X.allowTabs){
                        var O = gDocument.selection.createRange();
                        O.text = "\t";
                        if(is.ie4){
                            X.focus();
                            O.select();
                        }
                        Y = true;
                    }
                    break;
                case 13 : 
                    if( ! gAllowReturns)
                        validateModal();
                    break;
                case 27 : 
                    execModalCancel();
                    break;
                case 32 : 
                    if((Z.srcElement.type != "text") && (Z.srcElement.type != "textarea"))
                        return false;
                    break;
                default : 
                    break;
            }
            break;
        default : 
            break;
    }
    if(Y)
        Z.returnValue = false;
    return true;
}
function cancelModalTrack(){
    if( ! gModalTrack.kind)
        return;
    if(is.ie4 && gModalTrack.kind == "move"){
        setVisible(gModalTrack.elem, false);
        setBounds(modalDialog, getBounds(gModalTrack.elem))
    }
    gModalTrack.kind = gModalTrack.elem = gModalTrack.lastX = gModalTrack.lastY = gModalTrack.bounds = null;
}
function insideDialog(Z){
    var Y = modalDialog;
    while((Z != Y) && (Z != null))
        Z = Z.parentElement;
    return(Z != null) && (Z == Y);
}
function suspendDocument(Z, Y, X, W, V){
    if(currModal())
        closeModal();
    if(typeof gInputs != 'undefined'){
        for(var U in gInputs){
            var T = gInputs[U];
            if(getVisible(T)){
                T.blur();
                T.disabled = true;
            }
        }
    }
    gModalID = Z;
    gModalValidate = Y;
    gModalAccept = X;
    gModalCancel = W;
    gAllowReturns = V;
}
function releaseDocument(){
    if(typeof gInputs != 'undefined'){
        for(var Z in gInputs){
            var Y = gInputs[Z];
            if(getVisible(Y)){
                Y.disabled = false;
                Y.focus();
            }
        }
    }
    gModalID = null;
    gModalValidate = null;
    gModalAccept = null;
    gModalCancel = null;
}
function openModal(Z, Y, X, W, V, U, T, S, R){
    if( ! U)
        U = [];
    if( ! T)
        T = [];
    if(kMode == "design" && typeof(cancelEntryFieldRefocus) != "undefined")
        cancelEntryFieldRefocus();
    drawModal(Y, U, T);
    suspendDocument(Z, X, W, V, R);
    var Q = modalDialog;
    setDepth(Q, 15000);
    CenterInWindow(Q);
    setVisible(Q, true);
    var P = modalShield;
    setDepth(P, 14999);
    CenterInWindow(P);
    setVisible(P, true);
    if(S){
        var O = getElement(S);
        O.focus();
        O.select();
    }
}
function makeModalButton(Z, Y, X){
    var W = "";
    W += '&nbsp;<span id="';
    W += Z;
    W += '" class ="modalButton" onClick="';
    W += Y;
    W += '">';
    W += X;
    W += '</span>';
    return W;
}
function drawModal(Z, Y, X){
    var W;
    var V = '<table border="0" cellspacing="5" cellpadding="0">';
    for(var U = 0; U < Y.length; U ++ ){
        W = Y[U];
        V += '<tr valign="middle">';
        switch(W.type){
            case 'input' : 
                V += '<td class="modalLabel" nowrap>' + W.label + '</td><td nowrap><input id="' + W.id + '" class="modalInput" value="' + W.value + '" size=' + W.size + ' maxlength=' + W.maxlength + '></td>';
                break;
            case 'textarea' : 
                V += '<td class="modalLabel" nowrap>' + W.label + '</td><td nowrap><textarea id="' + W.id + '" class="modalInput" row=' + (W.rows ? W.rows : 1) + '" cols=' + (W.cols ? W.cols : W.size) + ' maxlength=' + W.maxlength + '>' + W.value + '</textarea></td>';
                break;
            case 'raw' : 
                V += '<td class="modalLabel" colspan=2>' + W.value + '</td>';
                break;
            default : 
                break;
        }
        V += '</tr>';
    }
    V += '</table>';
    var T = '';
    var S = 0;
    for(var R = 0; R < X.length; R ++ ){
        if(typeof X[R] == 'undefined')
            continue;
        W = X[R];
        switch(W.type){
            case 'accept' : 
                S ++ ;
                T += makeModalButton("modalBtn" + S, "validateModal()", (W.value ? W.value : getString("strOK")));
                break;
            case 'cancel' : 
                S ++ ;
                T += makeModalButton("modalBtn" + S, "execModalCancel()", (W.value ? W.value : getString("strCancel")));
                break;
            case 'other' : 
                S ++ ;
                T += makeModalButton("modalBtn" + S, W.onclick, W.value);
                break;
            default : 
                break;
        }
    }
    T = '<nobr>' + T + '</nobr>';
    if(is.ie4)
        T = '<div id="modalSpacer" style="height:1; width:1; overflow:hidden"></div>' + T;
    modalDialog.outerHTML = buildModalHTML(Z, V, T);
    if(is.ie4){
        var Q = modalSpacer;
        var P = 0;
        for(var O = 1; O <= S; O ++ )
            P += getElement('modalBtn' + O).offsetWidth;
        Q.style.pixelWidth = P + 35;
    }
    buildModalShieldHTML(false);
}
function buildModalHTML(Z, Y, X){
    var W = "#ffe57d";
    if((typeof gIsMatterhorn != "undefined") &&! gIsMatterhorn){
        W = "#999999";
    }
    var V = '<div id="modalDialog" class="modal">' + '<table border="0" width="225" cellspacing="0" cellpadding="0">' + '<tr valign="middle">' + '<td bgcolor="#ffffc2"><div id="modalTopLeftBox" class="modalTopLeftBox"></div></td>' + '<td bgcolor="' + W + '" nowrap class="modalDragger"><span id="modalTitle" class="modalTitle">' + Z + '</span></td>' + '</tr>' + '<tr>' + '<td bgcolor="' + W + '" class="modalDragger" style="width:16"><br></td>' + '<td>' + '<div id="modalContent" class="modalContent">' + Y + '</div>' + '<div id="modalMessage"></div>' + '<div id="modalBottomBar">' + X + '</div>' + '</td>' + '</tr>' + '</table>' + '</div>';
    if(is.ie4 && typeof modalRect == 'undefined')
        V += '<div id="modalRect"></div>';
    return V;
}
var bShieldAlreadyBuilt = false;
function buildModalShieldHTML(Z){
    if( ! bShieldAlreadyBuilt || Z == true){
        var Y = modalShield;;
        Y.outerHTML = '<div id="modalShield" style="top:0; left:0; height:100%; width:100%; background-color:red; position:absolute;  filter:alpha(opacity=0);" ></div>';
        bShieldAlreadyBuilt = true;
    }
}
function closeModal(){
    var Z = modalDialog;
    if(gModalTrack.kind)
        cancelModalTrack();
    setVisible(Z, false);
    var Y = modalShield;
    setVisible(Y, false);
    releaseDocument(Z);
    if(kMode == "design" && typeof(refocusEntryField) != "undefined"){
        refocusEntryField();
    }
}
function fixupModal(){
    if( ! currModal())
        return;
    var Z = modalDialog;
    setDepth(Z, 15000);
    CenterInWindow(Z);
}
function validateModal(){
    var Z = execModalValidate();
    if( ! Z)
        execModalAccept();
    else{
        var Y = modalMessage;
        Y.innerHTML = Z;
        Y.style.display = 'block';
    }
}
function currModal(){
    return gModalID;
}
function hb_alert(Z, Y){
    if( ! Y)
        Y = '';
    var X = [{
        type : 'raw', value : Z
    }];
    var W = [{
        type : 'accept'
    }];
    openModal('alert', Y, "", "closeModal()", "closeModal()", X, W);
}
function hb_confirm(Z, Y, X, W, V, U, T, S){
    if( ! Y)
        Y = '';
    if( ! U)
        U = '';
    if( ! S)
        S = '';
    if( ! T)
        T = '';
    if( ! X)
        X = getString("strOK");
    if( ! V)
        V = getString("strCancel");
    if( ! W)
        W = '';
    var R = new Array();
    R[0] = 
    {
        type : 'accept', value : X
    };
    R[2] = 
    {
        type : 'cancel', value : V
    };
    if(W)
        R[1] = 
    {
        type : 'other', value : W,
        onclick : ("closeModal();" + T)
    };
    var Q = [{
        type : 'raw', value : Z
    }];
    openModal("confirm", Y, "", "closeModal();" + U, "closeModal();" + S, Q, R);
}
function hb_progress(Z, Y, X, W){
    if( ! Z)
        Z = '';
    if( ! Y)
        Y = '';
    if( ! W)
        W = [];
    if(X == null){
        closeModal();
        return;
    }
    if(currModal() != 'progress'){
        var V = '<div id="modalProgressMsg" class="modalLabel"></div>';
        V += '<div id="modalProgressBar" class="modalProgressBar"><div id="modalProgressWidget" class="modalProgressWidget"></div></div>';
        var U = [{
            type : 'raw', value : V
        }];
        openModal('progress', Z, "", "", "", U, W);
    }
    var T = modalProgressWidget;
    if(X == 0)
        setVisible(T, false);
    else{
        setStyle(T, 'borderRightWidth', (X == 1.0) ? '0px' : '1px');
        setStyle(T, 'width', Math.ceil(X * 100) + '%');
        setStyle(T, 'visibility', 'inherit');
    }
    modalTitle.innerHTML = Z;
    var S = modalProgressMsg;
    if(Y == ""){
        setDisplay(S, false);
    }
    else{
        setDisplay(S, true);
        S.innerHTML = Y;
    }
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();