//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
if(typeof kDomain=="undefined")
	var kDomain="blox.com";

function Cookie(Z,Y,X,W,V,U){
	this.$document=Z;
	this.$name=Y;
	if(X)
		this.$expiration=new Date((new Date()).getTime()+X*3600000);
	else 
		this.$expiration=null;
	if(W)
		this.$path=W;
	else 
		this.$path=null;
	if(V)
		this.$domain=V;
	else 
		this.$domain=null;
	if(U)
		this.$secure=true;
	else 
		this.$secure=false;
}

function _Cookie_store(){
	var Z="";
	for(var Y in this){
		if((Y.charAt(0)=='$') ||((typeof this[Y])=='function'))
			continue;
		if(Z!="")
			Z+='&';
			Z+=Y+':'+escape(this[Y]);
	}
	var X=this.$name+'='+escape(Z);
	if(this.$expiration)
		X+='; expires='+this.$expiration.toGMTString();
	if(this.$path)
		X+='; path='+this.$path;
	if(this.$domain)
		X+='; domain='+this.$domain;
	if(this.$secure)
		X+='; secure';
	this.$document.cookie=X;
}

function _Cookie_load(){
	var Z=this.$document.cookie;
	if(Z=="")
		return false;
	var Y=Z.indexOf(this.$name+'=');
	if(Y==-1)
		return false;
	Y+=this.$name.length+1;
	var X=Z.indexOf(';',Y);
	if(X==-1)X=Z.length;
	var W=unescape(Z.substring(Y,X));
	var V;
	var U=W.split('&');
	for(V=0;V<U.length;V++)
		U[V]=U[V].split(':');
	for(V=0;V<U.length;V++){
		this[U[V][0]]=unescape(U[V][1]);
	}
return true;
}

function _Cookie_remove(){
	var Z;Z=this.$name+'=';
	if(this.$path)
		Z+=';	path='+this.$path;
	if(this.$domain)
		Z+='; domain='+this.$domain;
	Z+='; expires=Fri, 02-Jan-1970 00:00:00 GMT';
	this.$document.cookie=Z;
}

new Cookie();
Cookie.prototype.store=_Cookie_store;
Cookie.prototype.load=_Cookie_load;
Cookie.prototype.remove=_Cookie_remove;

function savePref(Z,Y,X){
	var W;
	if(!X)
		W=new Cookie(document,"tempTerm",null,'/',getCookieDomain());
	else 
		W=new Cookie(document,"longTerm",24*365*10,'/',getCookieDomain());
	W.load();
	W['pref_'+Z]=Y;
	W.store();
}

function getPref(Z){
	var Y=new Cookie(document,"tempTerm");
	if(Y.load() &&typeof Y['pref_'+Z] !='undefined')
		return Y['pref_'+Z];
	var X=new Cookie(document,"longTerm");
	if(X.load() &&typeof X['pref_'+Z] !='undefined')
		return X['pref_'+Z];
	return null;
}

if(typeof JSIncludeDoneLoading!="undefined")
	JSIncludeDoneLoading();