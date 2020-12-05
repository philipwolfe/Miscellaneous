//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gQueryList = new Object();
var gFrameList = null;
var kNumResourceFrames = 4;
var kReservedFrame = "resource0";
function setupFrameList(){
    var Z;
    var Y;
    var X;
    if(gFrameList != null)
        return true;
    if(document.readyState != "complete")
        return false;
    gFrameList = new Object();
    for(var W = 0; W < kNumResourceFrames; W ++ ){
        Z = "resource" + W;
        Y = getElement(Z);;
        X = new Object();
        X.state = "idle";
        X.query = null;
        X.element = Y;
        X.link = null;
        X.type = null;
        gFrameList[Z] = X;
    }
    return true;
}
function frameLink(Z){
    var Y;
    if(Z.type == "resource"){
        Y = Z.link + "&hbIndex=" + Z.frame.element.id;
    }
    else{
        Y = Z.link;
    }
    return Y;
}
function assignFrameToQuery(Z, Y){
    Z.state = "wait";
    Z.frame = Y;
    Y.state = "wait";
    Y.query = Z;
    Y.type = Z.type;
    Y.link = frameLink(Z);
}
function allocateFrame(Z){
    var Y,
    X;
    if( ! setupFrameList())
        return false;;
    for(Y in gFrameList){
        if(Z.type != "resource" && Y == kReservedFrame)
            continue;
        X = gFrameList[Y];
        if(X.state == "idle" && X.type != "general"){
            assignFrameToQuery(Z, X);
            setElementSrc(X.element, X.link, false, (is.nav4 ?- 1 : 0));
            return true;
        }
    }
    for(Y in gFrameList){
        if(Z.type != "resource" && Y == kReservedFrame)
            continue;
        X = gFrameList[Y];
        if(X.state == "idle"){
            assignFrameToQuery(Z, X);
            setElementSrc(X.element, X.link, false, (is.nav4 ?- 1 : 0));
            return true;
        }
    }
    return false;
}
function reallocateFrame(Z){
    var Y;
    if( ! setupFrameList())
        return false;;
    for(var X in gFrameList){
        Y = gFrameList[X];
        if(Y.state == "idle" && Y.link == frameLink(Z)){
            assignFrameToQuery(Z, Y);
            return true;
        }
    }
    return false;
}
function checkForAvailableFrames(){
    var Z;
    for(Z in gQueryList){
        var Y = gQueryList[Z];
        if(Y.state == "idle"){
            var X;
            X = allocateFrame(Y);
            if( ! X)
                return;
        }
    }
}
function freeFrame(Z){
    Z.state = "idle";
    Z.query = null;
}
function lookupFrameData(Z){
    var Y;
    for(var X in gFrameList){
        Y = gFrameList[X];
        if(Y.element == Z){
            return Y.link;
        }
    }
    return null;
}
function addQuery(Z, Y){
    gQueryList[Z] = Y;
}
function removeQuery(Z){
    delete gQueryList[Z];
}
function lookupQuery(Z){
    return gQueryList[Z];
}
var errorObject = 
{
    error : __error("[" + getString("strLoadingSmall") + "]", getString("strResourceLoading"))
};
function getResource(Z, Y, X){;
    var W = escape(Z);
    var V = lookupQuery(W);;
    if(V && V.state == "done"){
        if(V.dependentList[Y]){
            if( -- V.dependentList[Y] == 0)
                delete V.dependentList[Y];
        }
        var U = V.data;
        if(emptyObject(V.dependentList))
            removeQuery(W);
        return U;
    }
    if(V == null){
        V = 
        {
            state : "idle", frame : null,
            link : Z,
            data : null,
            resourceCallback : X,
            dependentList : {},
            type : "resource"
        };
        addQuery(W, V);
        checkForAvailableFrames();
    }
    if(V.dependentList[Y]) ++ V.dependentList[Y];
    else
        V.dependentList[Y] = 1;
    return errorObject;
}
var gResourceTimer = null;
function resourceCallBack(Z, Y, X){
    var W = gFrameList[Z];;
    var V = W.query;
    if(V){
        if(X)
            V.data = 
        {
            error : __error(getString("strErrLiveData"), X)
        };
        else
            V.data = 
        {
            data : Y
        };
        V.state = "done";
        V.frame = null;
    }
    freeFrame(W);
    if(V){
        for(var U in V.dependentList){
            var T = V.dependentList[U];
            for(var S = 0; S < T; ++ S)
                V.resourceCallback(U, V.link);
        }
    }
    gResourceTimer = killTimeout(gResourceTimer);
    gResourceTimer = setTimeout("checkForAvailableFrames()", 10);
}
function acquireFrameResource(Z){
    var Y,
    X;
    X = escape(Z);
    Y = 
    {
        state : "idle", frame : null,
        link : Z,
        data : null,
        resourceCallback : null,
        dependentList : {},
        type : "general"
    };
    addQuery(X, Y);
    checkForAvailableFrames();
}
function releaseFrameResource(Z){
    var Y,
    X,
    W;
    X = escape(Z);
    Y = lookupQuery(X);
    W = Y.frame;;
    removeQuery(X);
    freeFrame(W);
    checkForAvailableFrames();
}
function reacquireFrameResource(Z){
    var Y;
    Y = escape(Z);
    query = 
    {
        state : "idle", frame : null,
        Z : Z,
        data : null,
        resourceCallback : null,
        dependentList : {},
        type : "general"
    };
    addQuery(Y, query);
    if(reallocateFrame(query)){
        return true;
    }
    removeQuery(Y);
    return false;
}
function getFrameResource(Z){
    var Y,
    X;
    X = escape(Z);
    Y = lookupQuery(X);
    if(Y == null || Y.frame == null)
        return null;
    return Y.frame.element;
}
function getFrameResourceContext(Z){
    var Y,
    X;
    Y = getFrameResource(Z);
    if(Y == null || Y.id == null)
        return null;
    X = window.frames[Y.id];
    return X;
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();