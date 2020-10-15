//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function nameUndo(Z,Y){
	var X=getElement("undo");
	if(X)
		X.title=Z?("Undo"+((Z.name!=null)?(" "+Z.name):"")):"Nothing to Undo";
	X=getElement("redo");
	if(X)
		X.title=Y?("Redo"+((Y.name!=null)?(" "+Y.name):"")):"Nothing to Redo";
}

var kExecuteMessage="execute";
var kUndoMessage="undo";
var kRedoMessage="redo";
var kBeginMessage="begin";
var kEndMessage="end";
var gUberCallback=null;

function setupCommand(Z){
	gUberCallback=Z;
}

function makeCommand(Z,Y,X,W,V){
	var U={"callback":Z,"data":Y,"id":X};
	if(W)
		U.name=W;
	if(V)
		U.clean=V;
	return U;
}

function precedeCommand(Z,Y){
	;
	if(Z.precedeCommands==null)
		Z.precedeCommands=new Array();
	Z.precedeCommands[Z.precedeCommands.length]=Y;
	return Y;
}

function followCommand(Z,Y){
	;
	if(Z.followCommands==null)
		Z.followCommands=new Array();
	Z.followCommands[Z.followCommands.length]=Y;
	return Y;
}

function messageCommandList(Z,Y,X,W){
	if(Z==null||Z.length<1)
		return;
	var V,U,T;
	if(W){
		V=Z.length-1;
		U=-1;
		T=-1;
	}else{
		V=0;
		U=Z.length;
		T=1;
	}
	for(var S=V;S!=U;S+=T)
		messageCommand(Z[S],Y,X,W);
}

function messageCommand(Z,Y,X,W){
	var V=(X==null);
	if(V){
		X=1;
		W=(Y==kUndoMessage);
	}
	if(typeof(Z.callback)=='string')
		Z.callback=eval(Z.callback);
	Z.level=X;
	if(V&&gUberCallback)
		gUberCallback(kBeginMessage,Z,Y);
	if(W){
		messageCommandList(Z.followCommands,Y,X+1,W);
		if(Z.callback)
			Z.callback(Y);
		messageCommandList(Z.precedeCommands,Y,X+1,W);
	}else{
		messageCommandList(Z.precedeCommands,Y,X+1,W);
		if(Z.callback)
			Z.callback(Y);
		messageCommandList(Z.followCommands,Y,X+1,W);
	}
	if(V&&gUberCallback)
		gUberCallback(kEndMessage,Z,Y);
	delete(Z.level);
}

var kCmdListSize=50;
var gCommandContext={"cmdList":new Array(),"current":0,"committed":false,"changes":0,"level":0};

function setupContext(Z,Y){
	if(Z){
		gCommandContext=Z;
		nameUndo(gCommandContext.cmdList[gCommandContext.current],gCommandContext.cmdList[gCommandContext.current-1]);
	}
	setupCommand(Y);
}

function finishContext(){

}

function resetContext(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	var X=Y.level;
	if(Z!=null)
		Y.level=Z;
	else 
		Y.level=Y.changes;
	return X;
}

function changedContext(Z){
	if(Z==null)
		Z=gCommandContext;
	return(Z.changes!=Z.level);
}

function dirtyContext(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	if(!Z)
		commitContext(true,Y);
	++Y.changes;
}

function cleanContext(Z){
	if(Z==null)
		Z=gCommandContext;
	--Z.changes;
}

function commitContext(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	Y.cmdList=Y.cmdList.slice(0,0);
	Y.current=0;
	nameUndo(null,null);
	if(Z)
		resetContext(null,Y)
}

function compressContext(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	if(Y.current==0)
		return;
	var X=Y.cmdList.length-Y.current;
	for(var W=0;W<X; ++W)
		Y.cmdList[W]=Y.cmdList[W+Y.current];
	Y.cmdList=Y.cmdList.slice(0,X);
	Y.current=0;
	if(Y.level>Y.changes)
		Y.level=Y.changes;
	if(!Z)
		nameUndo(Y.cmdList[0],null);
}

function pushCommand(Z,Y){
	if(Z==null)
		return;
	if(Y==null)
		Y=gCommandContext;
	;
	;
	compressContext(true,Y);
	if(Y.cmdList.length==kCmdListSize)
		Y.cmdList=Y.cmdList.slice(0,Y.cmdList.length-1);
	for(var X=Y.cmdList.length;X>0; --X)
		Y.cmdList[X]=Y.cmdList[X-1];
	Y.cmdList[0]=Z;
	messageCommand(Z,kExecuteMessage);
	nameUndo(Z,null);
	if(!Z.clean)
		dirtyContext(true,Y);
	Y.committed=false;
	return Z;
}

function postCommand(Z,Y,X,W){
	return pushCommand(makeCommand(Z,Y,X,W));
}

function currentCommand(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	if((Y!=null) &&(Y.cmdList!=null) &&(Y.cmdList.length>Y.current) &&(Z||(!Y.committed&&(Y.current==0))))
		return Y.cmdList[Y.current];
	return null;
}

function undoableCommand(Z){
	if(Z==null)
		Z=gCommandContext;
	if((Z!=null) &&(Z.cmdList!=null) &&(Z.cmdList.length>Z.current)){
		var Y=Z.cmdList[Z.current].name;
		return((Y!=null)?Y:"");
	}
	return null;
}

function redoableCommand(Z){
	if(Z==null)
		Z=gCommandContext;
	if((Z!=null) &&(Z.cmdList!=null) &&(Z.cmdList.length>=Z.current) &&(Z.current>0)){
		var Y=Z.cmdList[Z.current-1].name;
		return((Y!=null)?Y:"");
	}
	return null;
}

function undoOne(Z){
	if(undoableCommand(Z) !=null){
		var Y=Z.cmdList[Z.current];
		if(Y){
			var X=messageCommand(Y,kUndoMessage);
			Z.committed=true;
			nameUndo(Z.cmdList[Z.current+1],Y);
			if(X==null||X==true){
				++Z.current;
				if(!Y.clean)
					cleanContext(Z);
			}
		}
	}
}

function undoCommand(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	if(Z==null)
		Z=1;
	for(var X=0;X<Z; ++X)
		undoOne(Y);
}

function redoOne(Z){
	if(redoableCommand(Z) !=null){
		var Y=Z.cmdList[Z.current-1];
		if(Y){
			var X=messageCommand(Y,kRedoMessage);
			if(X==null||X==true){
				--Z.current;
				if(!Y.clean)
					dirtyContext(true,Z);
			}
			nameUndo(Y,Z.cmdList[Z.current-1]);
		}
	}
}

function redoCommand(Z,Y){
	if(Y==null)
		Y=gCommandContext;
	if(Z==null)
		Z=1;
	for(var X=0;X<Z; ++X)
		redoOne(Y);
}

function emptyCommand(Z,Y,X){
	return makeCommand(emptyCallback,null,Z,Y,X);
}

function emptyCallback(Z){

}

var gScrapType=null;
var gScrapData=null;

function setupScrap(){

}

function finishScrap(){
	clearScrap();
}

function typeScrap(){
	return gScrapType;
}

function getScrap(){
	return gScrapData;
}

function setScrap(Z,Y){
	clearScrap();
	gScrapType=Z;
	gScrapData=Y;
}

function clearScrap(){
	switch(gScrapType){
		case"node":
			disposeModel(gScrapData);
			break;
		default:
			break;
	}
	gScrapType=null;
	gScrapData=null;
}

if(typeof JSIncludeDoneLoading!="undefined")
	JSIncludeDoneLoading();