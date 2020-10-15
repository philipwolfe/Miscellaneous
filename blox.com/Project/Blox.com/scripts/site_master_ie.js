//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gPageInitStack = new Array();
var gPageInitStackPriority = new Array();
var imgArr = new Array;
function imgSwap(Z, Y){
    if(document.images)
        document.images[Z].src = imgArr[Z + "_" + Y].src;
    return true;
}
function smGetScreenSize(){
    var Z = new Object();
    Z.width = ( ! screen) ?- 1 : screen.availWidth;
    Z.height = ( ! screen) ?- 1 : screen.availHeight;
    return Z;
}
function smBestWindowSize(Z, Y){
    var X = smGetScreenSize();
    var W = 10;
    var V = new Object();
    if(X.width ==- 1){
        V.width = Z;
        V.height = Y;
    }
    else{
        var U = X.width - (2 * W);
        var T = X.height - (2 * W);
        V.width = (Z > U) ? U : Z;
        V.height = (Y > T) ? T : Y;
    }
    return V;
}
function presetElementDisplay(Z, Y){
    var X = Y ? 'block' : 'none';
    if(document.ids)
        document.ids[Z].display = X;
    else if(document.styleSheets){
        if(document.styleSheets.length > 0)
            document.styleSheets[0].addRule('#' + Z, 'display:' + X);
    }
}
function UploadExcelFile(){
    var Z = window.open('/xls_upload?source=site', "_blank", 'scrollbars=no,resizable=yes,status=no');
}
function UploadPowerPointFile(){
    var Z = window.open('/ppo_upload?source=site', "_blank", 'scrollbars=no,resizable=yes,status=no');
}
function DownloadExcelFile(Z, Y){
    Y = Y.replace(/\W/g, "_");
    if(Y.length > 25)
        Y = Y.substring(0, 25);
    if(is.nav){
        window.location.href = '/xls_convert/' + Y + '.htm%6C?source=site&id=' + Z;
    }
    else{
        var X = window.open('/xls_convert/' + Y + '.htm%6C?source=site&id=' + Z, "_blank", 'scrollbars=no,resizable=yes,status=no');
    }
}
function NewSheet(){
    if(is.nav){
        NavLockout('ss');
        return;
    }
    OpenFile(null, 'd', 'ss', false);
}
function NewPresent(){
    if(is.nav){
        NavLockout('pr');
        return;
    }
    OpenFile(null, 'd', 'pr', false);
}
function ShowSheet(Z, Y, X){
    if(is.nav && Y == 'd'){
        NavLockout('ss');
        return;
    }
    OpenFile(Z, Y, 'ss', true, X);
}
function ShowPresent(Z, Y, X){
    if(is.nav && Y == 'd'){
        NavLockout('pr');
        return;
    }
    OpenFile(Z, Y, 'pr', false, X);
}
function OpenFile(Z, Y, X, W, V){
    var U = (V ? 'http://' + V + '.halfbrain.com' : '') + '/open?topdiv=0&promo=0';
    if(Z != null)
        U += '&id=' + Z;
    if(Y != null)
        U += '&mode=' + Y;
    if(X != null)
        U += '&new=' + X;
    if(is.nav && W){
        var T = smBestWindowSize(10000, 10000);
        if(T.width == 10000)
            T.width = 800;
        if(T.height == 10000)
            T.height = 600;
        else
            T.height -= 40;
        U += '&js=1&maxwd=' + T.width + '&maxht=' + T.height;
        window.location.href = U;
    }
    else{
        window.open(U, "", 'scrollbars=' + (is.nav4 ? 'yes' : 'no') + ',resizable=yes,status=no');
    }
}
function NavLockout(Z){
    if(Z == 'pr')
        alert(getString("strNavNoPresentation"));
    else
        alert(getString("strNavNoSpreadsheet"));
}
function UploadImage(){
    var Z = smBestWindowSize(550, 370);
    var Y = window.open('/open?new=img&source=site&return=1', "imgWin", 'width=' + Z.width + ',height=' + Z.height + ',resizable,scrollbars');
    Y.focus();
}
function RateSheet(Z){
    var Y = '/rating?id=' + Z;
    var X = smBestWindowSize(470, 370);
    var W = window.open(Y, "rateWin", 'width=' + X.width + ',height=' + X.height + ',resizable,scrollbars');
    W.focus();
}
function ShowFileSummary(Z){
    var Y = smBestWindowSize(650, 530);
    var X = window.open("/file_summary?id=" + Z, "summaryWin", 'width=' + Y.width + ',height=' + Y.height + ',resizable,scrollbars');
    X.focus();
}
function ShowSharing(Z){
    var Y = smBestWindowSize(700, 545);
    var X = window.open("/sharing?fileID=" + Z, "sharingWin", 'width=' + Y.width + ',height=' + Y.height + ',resizable,scrollbars');
    X.focus();
}
function smShowHelp(Z, Y){
    var X = smBestWindowSize(650, 510);
    var W = window.open('/help?display=frameset' + (Z ? '&id=' + Z : '') + (Y ? '&subsec=' + Y : ''), "helpWindow", 'width=' + X.width + ',height=' + X.height + ',scrollbars=no,resizable=yes,status=no');
    W.focus();
}
function ShowSlideShow(Z){
    var Y;
    switch(Z){
        case "getting_started_what" : 
            Y = "003d40c2_21bf";
            break;
        case "getting_started_where" : 
            Y = "003d40f3_6858";
            break;
        case "getting_started_ss" : 
            Y = "001eadb5_a400";
            break;
        case "getting_started_pr" : 
            Y = "003d3e88_0187";
            break;
        case "getting_started_files" : 
            Y = "003d3de9_7409";
            break;
        case "getting_started_sharing" : 
            Y = "001eadb8_0780";
            break;
        default : 
            return;
            break;
    }
    var X = smBestWindowSize(691, 542);
    var W = window.open('http://www.halfbrain.com/open?topdiv=0&promo=0&mode=v&id=' + Y, "_blank", 'scrollbars=no,resizable=no,status=no,width=' + X.width + ',height=' + X.height);
}
function notImplemented(Z){
    alert('[' + Z + '] ' + getString("strAfterBeta"));
}
function _pageInit(){
    var Z;
    for(var Y = 0; Y < gPageInitStackPriority.length; Y ++ ){
        Z = gPageInitStackPriority[Y];
        if(typeof Z == 'string')
            eval(Z);
        else if(typeof Z == 'function')
            Z();
    }
    for(var X = 0; X < gPageInitStack.length; X ++ ){
        Z = gPageInitStack[X];
        if(typeof Z == 'string')
            eval(Z);
        else if(typeof Z == 'function')
            Z();
    }
}
function queueForPageLoad(Z, Y){
    if(Y)
        gPageInitStackPriority[gPageInitStackPriority.length] = Z;
    else
        gPageInitStack[gPageInitStack.length] = Z;
}