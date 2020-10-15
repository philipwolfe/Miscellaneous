//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function Is(){
	var Z=navigator.userAgent.toLowerCase();
	this.major=parseInt(navigator.appVersion);
	this.minor=parseFloat(navigator.appVersion);
	this.nav=((Z.indexOf('mozilla') !=-1) &&(Z.indexOf('spoofer')==-1) &&(Z.indexOf('compatible')==-1) &&(Z.indexOf('opera')==-1) &&(Z.indexOf('webtv')==-1));
	this.nav2=(this.nav&&(this.major==2));
	this.nav3=(this.nav&&(this.major==3));
	this.nav4=(this.nav&&(this.major==4));
	this.nav4up=(this.nav&&(this.major>=4));
	this.navonly=(this.nav&&((Z.indexOf(";nav") !=-1) ||(Z.indexOf("; nav") !=-1)));
	this.nav5=(this.nav&&(this.major==5));
	this.nav5up=(this.nav&&(this.major>=5));
	this.ie=(Z.indexOf("msie") !=-1);
	this.ie3=(this.ie&&(this.major<4));
	var Y=Z.indexOf("msie 5.") !=-1;
	var X=Z.indexOf("msie 5.5") !=-1;
	var W=Z.indexOf("msie 6.") !=-1;
	this.ie4=(this.ie&&(this.major==4) &&!Y&&!W);
	this.ie4up=(this.ie&&(this.major>=4));
	this.ie5=(this.ie&&(this.major==4) &&Y&&!W);
	this.ie5up=(this.ie&&!this.ie3&&!this.ie4);
	this.ie55=(this.ie&&(this.major==4) &&X&&!W);
	this.ie55up=(this.ie&&this.ie5up&&this.ie55);
	this.ie6=(this.ie&&(this.major==4) &&!Y&&W);
	this.ie6up=(this.ie&&!this.ie3&&!this.ie4&&!this.ie5);
	this.ieMinorVersion=Is_ieMinorVersion;
	this.aol=(Z.indexOf("aol") !=-1);
	this.aol3=(this.aol&&this.ie3);
	this.aol4=(this.aol&&this.ie4);
	this.opera=(Z.indexOf("opera") !=-1);
	this.webtv=(Z.indexOf("webtv") !=-1);
	if(this.nav2||this.ie3)this.js=1.0;
	else if(this.nav3||this.opera)this.js=1.1;
	else if((this.nav4&&(this.minor<=4.05)) ||this.ie4)this.js=1.2;
	else if((this.nav4&&(this.minor>4.05)) ||this.ie5)this.js=1.3;
	else if(this.nav5)this.js=1.4;
	else if(this.nav&&(this.major>5))this.js=1.4;
	else if(this.ie&&(this.major>5))this.js=1.3;
	else this.js=0.0;
	this.win=((Z.indexOf("win") !=-1) ||(Z.indexOf("16bit") !=-1));
	this.win95=((Z.indexOf("win95") !=-1) ||(Z.indexOf("windows 95") !=-1));
	this.win16=((Z.indexOf("win16") !=-1) ||(Z.indexOf("16bit") !=-1) ||(Z.indexOf("windows 3.1") !=-1) ||(Z.indexOf("windows 16-bit") !=-1));
	this.win31=((Z.indexOf("windows 3.1") !=-1) ||(Z.indexOf("win16") !=-1) ||(Z.indexOf("windows 16-bit") !=-1));
	this.win98=((Z.indexOf("win98") !=-1) ||(Z.indexOf("windows 98") !=-1));
	this.winnt=((Z.indexOf("winnt") !=-1) ||(Z.indexOf("windows nt") !=-1));
	this.win32=(this.win95||this.winnt||this.win98||((this.major>=4) &&(navigator.platform=="Win32")) ||(Z.indexOf("win32") !=-1) ||(Z.indexOf("32bit") !=-1));
	this.os2=((Z.indexOf("os/2") !=-1) ||(navigator.appVersion.indexOf("OS/2") !=-1) ||(Z.indexOf("ibm-webexplorer") !=-1));
	this.mac=(Z.indexOf("mac") !=-1);
	this.mac68k=(this.mac&&((Z.indexOf("68k") !=-1) ||(Z.indexOf("68000") !=-1)));
	this.macppc=(this.mac&&((Z.indexOf("ppc") !=-1) ||(Z.indexOf("powerpc") !=-1)));
	this.sun=(Z.indexOf("sunos") !=-1);
	this.sun4=(Z.indexOf("sunos 4") !=-1);
	this.sun5=(Z.indexOf("sunos 5") !=-1);
	this.suni86=(this.sun&&(Z.indexOf("i86") !=-1));
	this.irix=(Z.indexOf("irix") !=-1);
	this.irix5=(Z.indexOf("irix 5") !=-1);
	this.irix6=((Z.indexOf("irix 6") !=-1) ||(Z.indexOf("irix6") !=-1));
	this.hpux=(Z.indexOf("hp-ux") !=-1);
	this.hpux9=(this.hpux&&(Z.indexOf("09.") !=-1));
	this.hpux10=(this.hpux&&(Z.indexOf("10.") !=-1));
	this.aix=(Z.indexOf("aix") !=-1);
	this.aix1=(Z.indexOf("aix 1") !=-1);
	this.aix2=(Z.indexOf("aix 2") !=-1);
	this.aix3=(Z.indexOf("aix 3") !=-1);
	this.aix4=(Z.indexOf("aix 4") !=-1);
	this.linux=(Z.indexOf("inux") !=-1);
	this.sco=(Z.indexOf("sco") !=-1) ||(Z.indexOf("unix_sv") !=-1);
	this.unixware=(Z.indexOf("unix_system_v") !=-1);
	this.mpras=(Z.indexOf("ncr") !=-1);
	this.reliant=(Z.indexOf("reliantunix") !=-1);
	this.dec=((Z.indexOf("dec") !=-1) ||(Z.indexOf("osf1") !=-1) ||(Z.indexOf("dec_alpha") !=-1) ||(Z.indexOf("alphaserver") !=-1) ||(Z.indexOf("ultrix") !=-1) ||(Z.indexOf("alphastation") !=-1));
	this.sinix=(Z.indexOf("sinix") !=-1);
	this.freebsd=(Z.indexOf("freebsd") !=-1);
	this.bsd=(Z.indexOf("bsd") !=-1);
	this.unix=((Z.indexOf("x11") !=-1) ||this.sun||this.irix||this.hpux||this.sco||this.unixware||this.mpras||this.reliant||this.dec||this.sinix||this.aix||this.linux||this.bsd||this.freebsd);
	this.vms=((Z.indexOf("vax") !=-1) ||(Z.indexOf("openvms") !=-1));
}

function Is_ieMinorVersion(Z){
	if(!this.ie4up)return false;
	var Y=clientInformation.appMinorVersion;
	var X=Y.split(";");
	Z=Z.toLowerCase();
	for(var W=0;W<X.length;W++)
		if(Z==X[W].toLowerCase())return true;
	return false;
}

var is;
var isIE3Mac=false;
if((navigator.appVersion.indexOf("Mac") !=-1) &&(navigator.userAgent.indexOf("MSIE") !=-1) &&(parseInt(navigator.appVersion)==3))
	isIE3Mac=true;
else 
	is=new Is();
if(typeof JSIncludeDoneLoading!="undefined")
	JSIncludeDoneLoading();