//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function Is(){
    var Z = navigator.userAgent.toLowerCase();
    this.major = parseInt(navigator.appVersion);
    this.minor = parseFloat(navigator.appVersion);
    this.nav = ((Z.indexOf('mozilla') !=- 1) && (Z.indexOf('spoofer') ==- 1) && (Z.indexOf('compatible') ==- 1) && (Z.indexOf('opera') ==- 1) && (Z.indexOf('webtv') ==- 1));
    this.nav2 = (this.nav && (this.major == 2));
    this.nav3 = (this.nav && (this.major == 3));
    this.nav4 = (this.nav && (this.major == 4));
    this.nav4up = (this.nav && (this.major >= 4));
    this.navonly = (this.nav && ((Z.indexOf(";nav") !=- 1) || (Z.indexOf("; nav") !=- 1)));
    this.nav5 = (this.nav && (this.major == 5));
    this.nav5up = (this.nav && (this.major >= 5));
	this.ie = true;//  (Z.indexOf("msie") !=- 1);
    this.ie3 = (this.ie && (this.major < 4));
    var Y = Z.indexOf("msie 5.") !=- 1;
    var X = Z.indexOf("msie 5.5") !=- 1;
    var W = Z.indexOf("msie 6.") !=- 1;
	this.ie4 = false;// (this.ie && (this.major == 4) &&! Y &&! W);
    this.ie4up = (this.ie && (this.major >= 4));
    this.ie5 = (this.ie && (this.major == 4) && Y &&! W);
    this.ie5up = (this.ie &&! this.ie3 &&! this.ie4);
	this.ie55 = true;// (this.ie && (this.major == 4) && X &&! W);
	this.ie55up = true;// (this.ie && this.ie5up && this.ie55);
    this.ie6 = (this.ie && (this.major == 4) &&! Y && W);
    this.ie6up = (this.ie &&! this.ie3 &&! this.ie4 &&! this.ie5);
    this.ieMinorVersion = Is_ieMinorVersion;
    if(this.nav2 || this.ie3)
        this.js = 1.0;
    else if(this.nav3 || this.opera)
        this.js = 1.1;
    else if((this.nav4 && (this.minor <= 4.05)) || this.ie4)
        this.js = 1.2;
    else if((this.nav4 && (this.minor > 4.05)) || this.ie5)
        this.js = 1.3;
    else if(this.nav5)
        this.js = 1.4;
    else if(this.nav && (this.major > 5))
        this.js = 1.4;
    else if(this.ie && (this.major > 5))
        this.js = 1.3;
    else
        this.js = 0.0;
    this.win = ((Z.indexOf("win") !=- 1) || (Z.indexOf("16bit") !=- 1));
}
function Is_ieMinorVersion(Z){
    if( ! this.ie4up)
        return false;
    var Y = clientInformation.appMinorVersion;
    var X = Y.split(";");
    Z = Z.toLowerCase();
    for(var W = 0; W < X.length; W ++ )
        if(Z == X[W].toLowerCase())
            return true;
    return false;
}
var is = new Is();
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();