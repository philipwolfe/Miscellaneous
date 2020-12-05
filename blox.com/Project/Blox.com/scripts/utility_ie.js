//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function getServerUrl(){
    var Z = window.location;
    var Y = Z.protocol + "//" + Z.hostname;
    if(Z.port != "" && Z.port != "80")
        Y += ":" + Z.port;
    return Y;
}
var kRootUrl = (typeof kRootUrl == "undefined") ? "/" : kRootUrl;
var kImageDirectory = (typeof kImageDirectory == "undefined") ? "img/" : kImageDirectory;
function addCharsetHint(Z, Y){
    var X;
    if(Z.indexOf("?") ==- 1){
        X = "?";
    }
    else{
        X = "&";
    }
    X += "charset=" + Y;
    return Z + X;
}
function getCookieDomain(){
    return(kDomain.indexOf(".") !=- 1) ? ('.' + kDomain) : null;
}
function AddToWindList(Z, Y){
    var X = new Cookie(document, "windowList", null, '/', getCookieDomain());
    X.load();
    X[Z] = Y;
    X.store();
}
function deleteFromWindList(Z){
    var Y = new Cookie(document, "windowList", null, '/', getCookieDomain());
    Y.load();
    for(var X in Y){
        if(X.search(/window/g) ==- 1)
            continue;
        if(X == Z)
            delete Y[X];
    }
    Y.store();
}
function fetchWindRefList(){
    var Z = new Object();
    var Y = new Cookie(document, "windowList", null, '/', getCookieDomain());
    Y.load();
    for(var X in Y){
        if(X.search(/window/g) ==- 1)
            continue;
        var W = window.open("", X, null, null);
        Z[X] = 
        {
            windRef : W, type : Y[X]
        };
    }
    return Z;
}
function printWindRefList(){
    var Z = new Object();
    var Y = new Cookie(document, "windowList", null, '/', getCookieDomain());
    Y.load();
    var X = "";
    for(var W in Y){
        if(W.search(/window/g) ==- 1)
            continue;
        X += "window name is: " + W + ", type is " + Y[W] + "\n";
    }
    alert(X);
}
function UrlEncode(Z){
    if( ! Z)
        return '';
    if(typeof(Z) != 'string')
        Z = Z.toString();
    var Y = '';
    for(var X = 0; X < Z.length; X ++ ){
        var W = Z.charAt(X);
        if(W == ' ')
            Y += '+';
        else if(isAlpha(W) || isDigit(W) || W == '_' || W == '.' || W == '-')
            Y += W;
        else{
            var V = (Y.charCodeAt(X) & 0xFF).toString(16);
            if(V.length < 2)
                V = '0' + V;
            Y += '%' + V;
        }
    }
    return $s;
}
function XmlEncode(Z){
    if( ! Z)
        return '';
    if(typeof(Z) != 'string')
        Z = Z.toString();
    Z = Z.replace(/&/g, '&amp;');
    Z = Z.replace(/</g, '&lt;');
    Z = Z.replace(/>/g, '&gt;');
    Z = Z.replace(/'/g, '&apos;');
    Z = Z.replace(/"/g, '&quot;');
    return Z;
}
function HTMLEncode(Z){
    if( ! Z)
        return '';
    if(typeof(Z) != 'string')
        Z = Z.toString();
    Z = Z.replace(/&/g, '&amp;');
    Z = Z.replace(/</g, '&lt;');
    Z = Z.replace(/>/g, '&gt;');
    Z = Z.replace(/"/g, '&quot;');
    return Z;
}
function fixQuotes(Z){
    if(typeof(Z) == "number")
        return Z;
    if(typeof(Z) != "string")
        return null;
    return Z.replace(/\"/g, '&quot;');
}
function escapeEntities(Z){
    if(typeof Z == 'undefined')
        return "";
    Z = Z.replace(/&(\w+)/g, '&amp;$1');
    return Z;
}
function escapeText(Z){
    if(typeof(Z) == "number")
        return Z;
    if(typeof(Z) != "string")
        return "";
    Z = Z.replace(/\\/g, '\\\\');
    Z = Z.replace(/\"/g, '\\"');
    Z = Z.replace(/\'/g, "\\'");
    Z = Z.replace(/\r/g, '');
    Z = Z.replace(/\n/g, '\\n');
    Z = Z.replace(/\t/g, '\\t');
    return Z;
}
function escapeUnicode(Z){
    var Y = Z.length;
    var X;
    X = "";
    for(var W = 0; W < Y; W ++ ){
        var V = Z.charCodeAt(W);
        if(V == 0)
            break;
        if(V <= 0xff){
            X += Z.charAt(W);
        }
        else{
            X += "&#" + V + ";";
        }
    }
    return escape(X);
}
if( ! Array.prototype.push){
    Array.prototype.push = function(item){
        this[this.length] = item;
    };
}
if( ! Array.prototype.copy){
    Array.prototype.copy = function(){
        var Z = [];
        for(var Y = 0; Y < this.length; Y ++ ){
            Z[Y] = this[Y];
        }
        return Z;
    };
}
if( ! Array.prototype.find){
    Array.prototype.find = function(findIt){
        for(var Z = 0; Z < this.length; Z ++ ){
            if(this[Z] == findIt)
                return Z;
        }
        return - 1;
    };
}
if( ! Array.prototype.findIgnoreCase){
    Array.prototype.findIgnoreCase = function(findIt){
        findIt = findIt.toString().toLowerCase();
        for(var Z = 0; Z < this.length; Z ++ ){
            if(this[Z].toString().toLowerCase() == findIt)
                return Z;
        }
        return - 1;
    };
}
if( ! Array.prototype.sum){
    Array.prototype.sum = function(){
        var Z, Y = 0;
        for(Z = 0; Z < this.length; Z ++ )
            Y += this[Z];
        return Y;
    };
}
if( ! Array.prototype.initToValue){
    Array.prototype.initToValue = function(value, Z){
        var Y, X;
        if(Z == null)
            X = this.length;
        else
            X = Z;
        for(Y = 0; Y < X; Y ++ )
            this[Y] = value;
    };
}
var debug_assert = true;
function handle_assert(Z){
    if( ! debug_assert)
        return;
    if(confirm("ASSERTION FAILED: " + (Z ? Z : "") + "\n\n" + "You should only see this message from a developer server\n\n" + "Click OK if you want to enter the debugger"))
        debugger;
}
var bds_flag = false;
function check_debug(Z){
    return false;
}
function emptyObject(Z){
    for(var Y in Z)
        return false;
    return true;
}
function equalObject(Z, Y){
    if((Z == null) && (Y == null))
        return true;
    if((Z == null) || (Y == null))
        return false;
    if((typeof Z) != (typeof Y))
        return false;
    if((typeof Z) != "object")
        return Z == Y;
    for(var X in Z)
        if( ! equalObject(Z[X], Y[X]))
            return false;
    return true;
}
function cloneObject(Z, Y, X){
    if((typeof Z) != "object" || Z == null)
        return Z;
    var W = null, V;
    if(Z.length != null && typeof(Z.length) == "number"){
        W = new Array();
        var U = Z.length;
        for(var T = 0; T < U; ++ T)
            if(typeof(Z[T]) != "undefined")
                W[T] = cloneObject(Z[T]);
    }
    else{
        W = new Object();
        if(X){
            for(V in Z)
                if((Y == null) || (Y[V] == null))
                    W[V] = cloneObject(Z[V], Y, X);
        }
        else{
            for(V in Z)
                if((Y == null) || (Y[V] != null))
                    W[V] = cloneObject(Z[V]);
        }
    }
    return W;
}
function deleteEmptyObject(Z, Y){
    if(Z[Y] == null || typeof Z[Y] != "object")
        return;
    var X = true;
    for(var W in Z[Y]){
        X = false;
        break;
    }
    if(X)
        delete Z[Y];
}
function mergeObject(Z, Y){
    for(var X in Z){
        Y[X] = Z[X];
    }
}
String.prototype.mappedCharCodeAt = function(i){
    var Z = this.charCodeAt(i);
    if(Z >= 0xFF01 && Z <= 0xFF5E)
        Z = (Z & 0xFF) + 0x20;
    if(Z == 0x2018 || Z == 0x2019)
        Z = 0x27;
    if(Z == 0x201C || Z == 0x201D)
        Z = 0x22;
    return Z;
};
String.prototype.mappedCharAt = function(i){
    var Z = this.mappedCharCodeAt(i);
    return String.fromCharCode(Z);
};
String.prototype.mappedSubstring = function(s, Z){
    var Y;
    if(typeof(Z) == "undefined"){
        Y = this.substring(s);
    }
    else{
        Y = this.substring(s, Z);
    }
    var X = "";
    for(var W = 0; W < Y.length; W ++ )
        X += Y.mappedCharAt(W);
    return X;
};
var kDefaultLocale = "default";
var kGetStringArgOffset = 2;
function getString(Z, Y){
    var X;
    X = gStringTable[Z];
    if(typeof(X) == "string")
        return X;
    if(typeof(X) == "object"){
        var W = "";
        var V = 2, U;
        for(U = 0; U < X.length; U ++ ){
            switch(typeof(X[U])){
                case "number" : 
                    if((X[U] + kGetStringArgOffset) < arguments.length){
                        W += arguments[X[U] + kGetStringArgOffset];
                    }
                    else{;
                    }
                    break;
                case "string" : 
                    W += X[U];
                    break;
                default : ;
        }
    }
    return W;
};
return "";
}
function getLoadingString(Z){
    if(gIsMatterhorn){
        return "";
    }
    else{
        return getString(Z);
    }
}
function emptyString(Z){
    if(Z == null)
        return true;
    if(typeof Z == "string" && Z.length == 0)
        return true;
    if(typeof Z == "number")
        return true;
    return false;
}
function forceString(Z){
    if(emptyString(Z))
        return "";
    return Z;
}
function forceNumber(Z, Y){
    var X = typeof(Z);
    if(X == "number")
        return Z;
    if(Y == null)
        Y = 0;
    if((X != "string") || (Z == null) || (Z == "") || isNaN(parseInt(Z.charAt(0))))
        return Y;
    return parseInt(Z);
}
function containsString(Z, Y, X){
    Z = forceString(Z);
    Y = forceString(Y);
    if(X == "equal")
        return Z == Y;
    if(Y.length == 0)
        return false;
    var W = Z.indexOf(Y);
    if(X == "prefix")
        return(W == 0);
    else if(X == "suffix")
        return(W == (Z.length - Y.length));
    else
        return(W >= 0);
}
function capitalizeWords(Z){
    var Y = Z.split(/\s/);
    for(var X = 0; X < Y.length; X ++ )
        Y[X] = Y[X].substring(0, 1).toUpperCase() + Y[X].substr(1);
    return Y.join(" ");
}
function trimString(Z){
    return Z.replace(/^\s*((.|\n)*\S)\s*$/, "$1");
}
var kMungeRawText = 
{
    "entities" : true, "tags" : true
};
var kMungePlainText = 
{
    "anchors" : true, "foldReturns" : true
};
function mungeString(Z, Y){
    if(typeof Z == "undefined")
        return null;
    if(Z == null || Z == "")
        return "";
    if(Y == null)
        return Z;
    if(Y.entities)
        Z = Z.replace(/&(\w+)/g, '&amp;$1');
    if(Y.escapeReturns || Y.foldReturns){
        Z = Z.replace(/\n/g, Y.escapeReturns ? "\\n" : " ");
        Z = Z.replace(/\r/g, "");
    }
    if(Y.tags){
        Z = Z.replace(/</g, '&lt;');
        Z = Z.replace(/\&lt\;br/ig, '<br');
        Z = Z.replace(/\&lt\;\/br/ig, '</br');
    }
    if(Y.anchors){
        var X = Z.match(/(.*)<a[^>]*>(.*)<\/a>(.*)/i);
        if(X){
            if(X[1] == null)
                X[1] == "";
            else
                X[1] = mungeString(X[1], 
            {
                "anchors" : true
            });
            if(X[2] == null)
                X[2] == "";
            else
                X[2] = mungeString(X[2], 
            {
                "anchors" : true
            });
            if(X[3] == null)
                X[3] == "";
            else
                X[3] = mungeString(X[3], 
            {
                "anchors" : true
            });
            Z = X[1] + X[2] + X[3];
        }
    }
    return Z;
}
function equalString(Z){
    if(Z.length > 1)
        if(Z.mappedCharAt(0) == "=")
            return true;
    return false;
}
function quoteString(Z){
    if(typeof(Z) != "string")
        return false;
    if(Z.length > 1){
        var Y = Z.mappedCharAt(0);
        var X = Z.mappedCharAt(Z.length - 1);
        if((Y == "'") && (X != "'"))
            return true;
        if((Y == '"') && (X != '"'))
            return true;
    }
    return false;
}
function punctuationString(Z){
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z.mappedCharAt(Y);
        if((X >= 'a') && (X <= 'z'));
        else if((X >= 'A') && (X <= 'Z'));
        else if((X >= '0') && (X <= '9'));
        else if(X == ' ');
        else
            return true;
    }
    return false;
}
function exponential2numeric(Z){
    var Y = Z;
    var X = Y.split("E");
    if((X[1] == null) || (X[1] == ""))
        X = Y.split("e");
    if((X[0] == null) || (X[0] == "") ||! floatString(X[0], null, true, gAppLocale))
        return Y;
    if((X[1] == null) || (X[1] == "") ||! floatString(X[1], null, true, gAppLocale))
        return Y;
    if((X[1] != null) && (X[1] != "")){
        var W = parseInt(X[1]);
        var V = X[0].split(".");
        Y = V[0];
        if(V[1] != null)
            Y += V[1];
        if(W < 0){
            W = Math.abs(W) - 1;
            while(W-- > 0)
                Y = "0" + Y;
            Y = "0." + Y;
        }
        else{
            if(V[1] != null)
                W -= V[1].length;
            if(W > 0){
                while(W-- > 0)
                    Y += "0";
            }
            else if(W < 0)
                Y = Y.substring(0, Y.length + W) + '.' + Y.substring(Y.length + W);
        }
    }
    return Y;
}
function localizedValue(Z, Y){;
    if(Z == null)
        return "";
    var X = Z.toString();
    var W = ".";
    var V = getFormat("localeDefault", Y);
    if(V.decimalSeparator){
        W = V.decimalSeparator;
    }
    if(W != ".")
        return X.replace(/\./, W);
    return X;
}
function floatString(Z, Y, X, W){
    var V = ",";
    var U = ".";
    var T = getFormat("localeDefault", W);
    if(T.groupingSeparator){
        V = T.groupingSeparator;
        if(V == kNoBreakSpace)
            V = " ";
    }
    if(T.decimalSeparator){
        U = T.decimalSeparator;
    }
    if(Y){
        for(var S in Y)
            delete(Y[S]);
    }
    var R = /^\s*(\S+)\s*$/;
    var Q = Z.match(R);
    if(Q)
        Z = Q[1];
    var P = /^\((.+)\)$/;
    var O = Z.match(P);
    if(O){
        Z = O[1];
        if(Y)
            Y.negative = true;
    }
    if(Z.length == 0)
        return false;
    if(Z.charAt(0) == '+'){
        Z = Z.substring(1);
    }
    else if(Z.charAt(0) == '-'){
        if(Y)
            Y.negative = true;
        Z = Z.substring(1);
    }
    else if((Z.charAt(0) == '(') && (Z.charAt(Z.length - 1) == ')')){
        if(Y)
            Y.negative = true;
        Z = Z.substring(1, Z.length - 1);
    }
    if(Z.length == 0)
        return false;
    if(Z.charAt(0) == '$'){
        if(Y)
            Y.currencyUS = true;
        Z = Z.substring(1);
    }
    else if(Z.charAt(Z.length - 1) == '%'){
        if(Y)
            Y.percentage = true;
        Z = Z.substring(0, Z.length - 1);
    }
    if(Z.length == 0)
        return false;
    if( ! X)
        Z = exponential2numeric(Z);
    var N = Z.split(U);
    if((N[0].length == 0) && (N[1] && (N[1].length > 0)))
        N[0] = "0";
    var M = new RegExp("\\" + V, 'g');
    var L = N[0].replace(M, "");
    if(Y && (L.length < N[0].length))
        Y.separators = true;
    N[0] = L;
    if((N[0] != null) && N[0].match(/\D/))
        return false;
    if((N[1] != null) && (N[1].length > 0)){
        if(N[1].match(/\D/))
            return false;
        if(Y)
            Y.places = N[1].length;
    }
    if(Y){
        Z = N.join(".");
        Y.value = parseFloat(Z);
        if(isNaN(Y.value))
            return false;
        if(Y.negative)
            Y.value =- Y.value;
        if(Y.currencyUS){
            if(Y.places){
                Y.places = 2;
                Y.format = "currency_usd_2";
            }
            else
                Y.format = "currency_usd_0";
        }
        else if(Y.percentage){
            Y.value /= 100;
            if((Y.places != null) && (Y.places > 0)){
                switch(Y.places){
                    case 1 : 
                        Y.format = "percentage_1";
                        break;
                    case 2 : 
                        Y.format = "percentage_2";
                        break;
                    default : 
                        Y.format = "percentage_3";
                        break;
                }
            }
            else
                Y.format = "percentage";
        }
        if( ! Y.format){
            if(Y.separators){
                if((Y.places != null) && (Y.places > 0)){
                    switch(Y.places){
                        case 1 : 
                            Y.format = "number_1";
                            break;
                        case 3 : 
                            Y.format = "number_3";
                            break;
                        default : 
                            Y.format = "number_2";
                            break;
                    }
                }
                else if(Y.separators){
                    Y.format = "number_0";
                }
            }
            else{
                Y.format = "number";
            }
        }
    }
    return true;
}
function localizedDate(Z, Y, X){
    var W = "";
    var V = getFormat(Y, X);;
    V.dateSeparator = "/";
    if(V.type == "dateTime"){
        W = formatDate(V, Z);
        W += " ";
        W += formatTime(V, Z);
    }
    else if(V.type == "shortDate" || V.type == "longDate"){
        W = formatDate(V, Z);
    }
    else{
        W = formatTime(V, Z);
    }
    var U = new RegExp(kNoBreakSpace);
    return W.replace(U, " ");
}
function dateString(Z, Y, X){
    var W = getFormat("localeDefault", X);
    var V = "mdy";
    if(W.ymdOrder){
        V = W.ymdOrder;
    }
    var U = "";
    var T,
    S,
    R,
    Q = 0, P = 0;
    if(V.charAt(0) == "y"){
        U = "((\\d{2,4})/(\\d{1,2})/(\\d{1,2}))|((\\d{1,2})/(\\d{1,2}))";
        T = 2;
        if(V.substring(1) == "md"){
            S = 3;
            R = 4;
            Q = 6;
            P = 7;
        }
        else{
            S = 4;
            R = 3;
            Q = 7;
            P = 6;
        }
    }
    else{
        U = "(\\d{1,2})/(\\d{1,2})(/(\\d{2,4}))?";
        T = 4;
        if(V.substring(0, 2) == "md"){
            S = 1;
            R = 2;
        }
        else{
            S = 2;
            R = 1;
        }
    }
    var O = new RegExp(U);
    var N = /(\d{1,2})\:(\d{1,2})((\:)(\d{1,2}))?/;
    var M = /((am)|(pm))/i;
    var L = Z.match(O);
    var K = Z.match(N);
    var J = Z.match(M);
    if((L == null) && (K == null))
        return false;
    if((K == null) && (J != null))
        return false;
    var I = Z;
    if(L != null)
        I = I.replace(O, "");
    if(K != null)
        I = I.replace(N, "");
    if(J != null)
        I = I.replace(M, "");
    var H = /^\s*$/;
    if( ! H.test(I))
        return false;
    var G = false;
    var F = true;
    var E = new Date();
    var D = E.getFullYear();
    var C = 1;
    var B = 1;
    var A = 0;
    var Z1 = 0;
    var Y1 = 1;
    if(L != null){
        if(L[S] != ""){
            C = parseInt(L[S]);
        }
        else{
            C = parseInt(L[Q]);
        }
        if((C < 1) || (C > 12))
            return false;
        if(L[R] != ""){
            B = parseInt(L[R]);
        }
        else{
            B = parseInt(L[P]);
        }
        if((B < 1) || (B > 31))
            return false;
        if(L[T] != ""){
            D = parseInt(L[T]);
            if((D < 0) || (D > 9999))
                return false;
            if(L[T].length <= 2){
                G = true;
                D = expandYear(L[T]);
            }
        }
        else{
            F = false;
        }
    }
    if(K != null){
        A = parseInt(K[1]);
        if((A < 0) || (A > 23))
            return false;
        if(J != null){
            var X1 = J[0].toLowerCase();
            if(X1 == "am")
                A = A % 12;
            else if(X1 == "pm")
                A = (A % 12) + 12;
        }
        Z1 = parseInt(K[2]);
        if((Z1 < 0) || (Z1 > 59))
            return false;
        if(K[5] != ""){
            Y1 = parseInt(K[5]);
            if((Y1 < 0) || (Y1 > 60))
                return false;
        }
    }
    var W1 = Date.UTC(D, C - 1, B, A, Z1, Y1);
    Y.timeValue = W1 / kMillisecondsPerDay;
    Y.format = "dateAndTime";
    if(L != null){
        if(K == null){
            if(F){
                Y.format = G ? "shortDate" : "longDate";
            }
            else{
                Y.format = "shortMonthDay";
            }
        }
        else{
            Y.format = "dateAndTime";
        }
    }
    else if(K != null){
        if(K[5] != "")
            Y.format = (J != null) ? "time12_seconds" : "time24_seconds";
        else
            Y.format = (J != null) ? "time12" : "time24_padded";
    }
    return true;
}
function urlString(Z, Y){
    Z = fixQuotes(Z);
    if(Z == null)
        return false;
    var X = /^.*([\.,\!\?])$/;
    var W = Z.match(X);
    var V = "";
    if(W != null){
        V = W[1];
        Z = Z.substring(0, Z.length - 1);
    }
    var U = /^(.*<[a|s].*)(http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)(\S+\..+)(>.*)$/i;
    var T = Z.match(U);
    if(T)
        return false;
    var S = /^(.*)(http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)(\S+\.\S+)(&quot;)(.*)$/i;
    var R = /^(.*)(http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)(\S+\.\S+)(.*)$/i;
    var Q = Z.match(S);
    if(Q == null){
        Q = Z.match(R);
    }
    if(Q == null){
        S = /^(.*)(www\.)(\S+\.\S+)(&quot;)(.*)$/i;
        R = /^(.*)(www\.)(\S+\.\S+)(.*)$/i;
        Q = Z.match(S);
        if(Q == null)
            Q = Z.match(R);
        if(Q)
            Q[2] = "http://" + Q[2];
    }
    if(Q != null){
        if(Y){
            Y.url = Q[2] + Q[3];
            Y.pre = Q[1];
            Y.post = "";
            if(Q[4])
                Y.post += Q[4];
            if(Q[5])
                Y.post += Q[5];
            Y.post += V;
            if((Y.pre != "") || (Y.post != ""))
                Y.dynamic = "_concat(\"" + Y.pre + "\", __link(\"" + Y.url + "\"), \"" + Y.post + "\")";
            else
                Y.dynamic = "__link(\"" + Y.url + "\")";
            Y.url = unescape(Y.url);
            var P = /(\S+)\/([^\/]+)$/;
            var O = Q[3].match(P);
            if(O != null)
                Y.fileName = O[2];
        }
        return true;
    }
    return false;
}
function expandYear(Z){
    Z = parseInt(Z);
    if((isNaN(Z)) || (Z.length > 2) || (Z < 0))
        return null;
    if(Z < 30)
        return(2000 + Z);
    return(1900 + Z);
}
function adjacentCharacter(Z){
    if( ! Z)
        Z = "after";
    var Y = gDocument.selection.createRange();
    if(Z == "after"){
        Y.collapse(false);
        Y.moveEnd("character", 1);
    }
    else if(Z == "before"){
        Y.collapse(true);
        Y.moveStart("character" ,- 1);
    }
    return Y.text.charAt(0);
}
function stringIsCellRef(Z){
    return(Z.search(/^\$?[a-z]+\$?[0-9]+/i) !=- 1);
}
function cycleCellRefString(Z){
    if(Z.search(/^[a-z]+[0-9]+/i) !=- 1){
        return "$" + Z.match(/[a-z]+/i)[0] + "$" + Z.match(/[0-9]+/)[0];
    }
    else if(Z.search(/\$[a-zA-Z]+\$[0-9]+/) !=- 1){
        return Z.substr(1);
    }
    else if(Z.search(/^[a-zA-Z]+\$[0-9]+/) !=- 1){
        return "$" + Z.match(/[a-z]+/i)[0] + Z.match(/[0-9]+/)[0];
    }
    else if(Z.search(/\$[a-zA-Z]+[0-9]+/) !=- 1){
        return Z.substr(1);
    }
}
function expandRngToRef(Z){
    do{
        Z.moveStart("character" ,- 1);
    }
    while(Z.text.charAt(0).search(/\w|\$/) !=- 1);
    Z.moveStart("character", 1);
    do{
        var Y = new RegExp(Z.text.replace(/\$/g, "\\$") + "$");
        if((getElement("entry").innerText.search(Y) ==- 1) || (Z.text == ""))
            Z.moveEnd("character", 1);
        else
            return Z;
    }
    while(Z.text.charAt(Z.text.length - 1).search(/\w|\$/) !=- 1);
    Z.moveEnd("character" ,- 1);
    return Z;
}
function insertPointAt(Z, Y){
    var X = gDocument.selection.createRange();
    var W = Y.createTextRange();
    if(Z == "end"){
        X.collapse(false);
        W.collapse(false);
    }
    else if(Z == "start"){
        X.collapse(true);
        W.collapse(true);
    }
    return((X.boundingLeft == W.boundingLeft) && (X.boundingTop == W.boundingTop));
}
function extractJsFunctionNames(Z){
    var Y = [];
    var X = [];
    var W,
    V;
    var U = /\n\s*function\s+[\w\$_]+\s*\([^\)]*\)\s*\{/g;
    var T = /function\s+([\w\$_]+)(\s|\()/;
    Z = "\n" + Z;
    W = Z.match(U);
    if(W){
        var S = 0;
        for(i = 0; i < W.length; i ++ ){
            V = W[i].match(T);
            if(V && V[1]){
                var R = Z.indexOf(W[i], S);;
                Y[Y.length] = [V[1], R + V.index - 1];
                S = R + W[i].length + 1;
            }
        }
    }
    return Y;
}
function formatNumber(Z, Y, X, W, V, U, T, S, R, Q, P, O){
    var N = "";
    var M = (Z < 0 ? true : false);
    var L = (M ?- Z : Z);
    if(S)
        N += S;
    if(M){
        if(P == "paren"){
            N += "(";
        }
        else if(P == "minusBefore"){
            N += "-";
        }
        else if(P == "minusBeforeSpace"){
            N += "-" + kNoBreakSpace;
        }
    }
    if(R){
        if(R == "before"){
            N += Q;
        }
        else if(R == "beforeSpace"){
            N += Q + kNoBreakSpace;
        }
    }
    if(V){
        L *= V;
    }
    N += formatPositiveNumber(L, Y, X, W, U, T);
    if(R){
        if(R == "after"){
            N += Q;
        }
        else if(R == "afterSpace"){
            N += kNoBreakSpace + Q;
        }
    }
    if(M){
        if(P == "paren"){
            N += ")";
        }
        else if(P == "minusAfter"){
            N += "-";
        }
        else if(P == "minusAfterSpace"){
            N += kNoBreakSpace + "-";
        }
    }
    if(O)
        N += O;
    return N;
}
function formatPositiveNumber(Z, Y, X, W, V, U){
    var T,
    S,
    R,
    Q;
    if(typeof(Z) != "number")
        return "";
    if(W && W > X){
        S = W;
        R = W - (X ==- 1 ? 0 : X);
    }
    else{
        S = X;
        R =- 1;
    }
    var P = 0;
    if(Y){
        P = Y;
    }
    T = Z;
    for(var O = 0; O < S; O ++ ){
        T *= 10.0;
    }
    T = Math.round(T);
    var N = new Array();
    while(R > 0){
        Q = Math.floor(T % 10);
        if(Q != 0){
            N.push("" + Q);
            R = 0;
        }
        R -- ;
        S -- ;
        T = T / 10;
    }
    if(X ==- 1 && R == 0)
        S =- 1;
    while(S > 0){
        Q = Math.floor(T % 10);
        N.push("" + Q);
        S -- ;
        T = T / 10;
    }
    if(S == 0)
        N.push(V);
    var M = 3;
    var L = Y;
    while(T >= 1.0 || P > 0){
        if(M == 0){
            N.push(U);
            M = 3;
        }
        Q = Math.floor(T % 10);
        N.push("" + Q);
        M -- ;
        P -- ;
        T = T / 10;
    }
    N.reverse();
    return N.join("");
}
gJapaneseImperialDates = [{
    startYear : 1989, startMonth : 1,
    startDay : 8,
    engName : "Heisei",
    jpnName : "\u5E73\u6210"
}, 
{
    startYear : 1926,
    startMonth : 12,
    startDay : 25,
    engName : "Showa",
    jpnName : "\u662D\u548C"
}, 
{
    startYear : 1912,
    startMonth : 7,
    startDay : 30,
    engName : "Taisho",
    jpnName : "\u5927\u6B63"
}, 
{
    startYear : 1868,
    startMonth : 9,
    startDay : 8,
    engName : "Meiji",
    jpnName : "\u660E\u6CBB"
}];
function getJapaneseEra(Z, Y, X){
    for(var W = 0; W < gJapaneseImperialDates.length; W ++ ){
        var V = gJapaneseImperialDates[W];
        if(Z > V.startYear || (Z == V.startYear && Y >= V.startMonth && X >= V.startDay)){
            var U = Z - V.startYear + 1;
            return V.jpnName + U;
        }
    }
    return "" + Z;
}
function getDate(Z){
    var Y = new Date(Math.round(Z * kMillisecondsPerDay));
    if(isNaN(Y))
        return null;
    return Y;
}
function formatDate(Z, Y){;
    var X,
    W,
    V,
    U;
    X = getDate(Y);
    if(X == null)
        return formatGeneral(Y);
    W = X.getUTCFullYear();
    V = X.getUTCMonth() + 1;
    U = X.getUTCDate();
    var T = "", S = "", R = "", Q = "";
    var P = (Z.dateSeparator == "none" ? "" : Z.dateSeparator);
    var O = true;
    var N = Z.ymdOrder;
    if(Z.prefix)
        Q += Z.prefix;
    for(var M = 0; M < 3; M ++ ){
        var L = N.substr(M, 1);
        if(L == "y" && Z.showYear){;
            switch(Z.yearType){
                case "shortNumber" : 
                    T = formatPositiveNumber(W % 100, 2 ,- 1 ,- 1, "", "");
                    break;
                case "jpn" : 
                    T = getJapaneseEra(W, V, U);
                    break;
                default : ;
            case "longNumber" : 
                T = formatPositiveNumber(W, 4 ,- 1 ,- 1, "", "");
                break;
        }
        if(Z.yearSuffix)
            T += Z.yearSuffix;
        if( ! O)
            Q += P;
        O = false;
        Q += T;
    }
    if(L == "m" && Z.showMonth){
        if(Z.padMonth && V < 10){
            S += "0" + V;
        }
        else{
            S += V;
        }
        if(Z.monthSuffix)
            S += Z.monthSuffix;
        if( ! O)
            Q += P;
        O = false;
        Q += S;
    }
    if(L == "d" && Z.showDay){
        if(Z.padDay && U < 10){
            R += "0" + U;
        }
        else{
            R += U;
        }
        if(Z.daySuffix)
            R += Z.daySuffix;
        if( ! O)
            Q += P;
        O = false;
        Q += R;
    }
}
if(Z.suffix)
    Q += Z.suffix;
return Q;
}
function formatTime(Z, Y){
    var X = "";
    var W,
    V,
    U,
    T,
    S;
    W = getDate(Y);
    if(W == null)
        return formatGeneral(Y);
    V = W.getUTCHours();
    U = W.getUTCMinutes();
    T = W.getUTCSeconds();
    var R = false;
    var Q = false;
    if(Z.ampm)
        R = true;
    S = V;
    if(R){
        if(V < 12){
            Q = true;
        }
        else{
            Q = false;
            S = V - 12;
        }
        if(S == 0)
            S = 12;
    }
    var P = "", O = "", N = "";
    var M = (Z.timeSeparator == "none" ? "" : Z.timeSeparator);
    var L = true;
    if(Z.prefix)
        X += Z.prefix;
    if(R && Z.ampmStyle == "before"){;
        if(Q){
            X += Z.amIndicator;
        }
        else{
            X += Z.pmIndicator;
        }
        X += kNoBreakSpace;
    }
    if(Z.showHour){
        L = false;
        if(Z.padHour && S < 10){
            X += "0";
        }
        X += S;
        if(Z.hourSuffix){
            X += Z.hourSuffix;
        }
    }
    if(Z.showMinute){
        if( ! L)
            X += M;
        L = false;
        if(Z.padMinute && U < 10){
            X += "0";
        }
        X += U;
        if(Z.minuteSuffix){
            X += Z.minuteSuffix;
        }
    }
    if(Z.showSecond){
        if( ! L)
            X += M;
        L = false;
        if(T < 10){
            X += "0";
        }
        X += T;
        if(Z.secondSuffix){
            X += Z.secondSuffix;
        }
    }
    if(R && Z.ampmStyle == "after"){;
        X += kNoBreakSpace;
        if(Q){
            X += Z.amIndicator;
        }
        else{
            X += Z.pmIndicator;
        }
    }
    if(Z.suffix)
        X += Z.suffix;
    return X;
}
function adjustCustomFormatLocale(Z, Y){
    var X = ["positiveFormat", "negativeFormat", "vanishedFormat", "nonvalueFormat"];
    var W = "[" + Y + "]";;
    if(Z == null)
        return;
    for(var V = 0; V < X.length; V ++ ){
        var U,
        T,
        S = X[V];
        if(U = Z[S]){
            if(T = customFormatLocale(U)){
                if(T == gAppLocale){
                    Z[S] = U.substring(kLocaleLength);
                }
            }
            else{
                if(Y != gAppLocale){
                    Z[S] = W + U;
                }
            }
        }
    }
}
var kLocaleLength = 4;
var reLocale = /^\[([a-z]{2})\]/;
var reStrDigit = "[0#]";
var reStrDecSepDecl = "./d";
var reStrGrpSepDecl = "./g";
var reStrDay = "[dD]{1,2}";
var reStrMonth = "[mM]{1,2}";
var reStrYear = "[yY]{2,4}";
var reStrHour = "[hH]{1,2}";
var reStrMinute = "[mM]{1,2}";
var reStrSecond = "[sS]{1,2}";
var reStrDayMonthYear = "[dDmM]{1,2}|[yY]{1,4}";
var reStrHour = "[hH]{1,2}";
var reStrMinute = "[mM]{1,2}";
var reStrSecond = "[sS]{1,2}";
var reStrAMPM = "(AP)|(ap)";
function customFormatLocale(Z){
    var Y;
    Y = reLocale.exec(Z);
    if(Y != null)
        return Y[1];
    return null;
}
function parseCustomFormat(Z){
    var Y,
    X = null;
    var W = gAppLocale;
    Y = reLocale.exec(Z);
    if(Y != null){
        W = Y[1];
        Z = Z.substring(Y.lastIndex);
    }
    var V = getFormat("localeDefault", W);
    Z = Z.replace(/ /g, kNoBreakSpace);
    if(Z.match(/[0#]/) == null || Z.match(/s\.0/) != null){
        var U = V.dateSeparator;
        U = "[ \/.\\'|:`," + U + kNoBreakSpace + "]+|-+";
        var T = "(" + reStrDayMonthYear + ")" + "(" + U + ")(" + reStrDayMonthYear + ")" + "((" + U + ")(" + reStrDayMonthYear + "))?";
        var S = new RegExp(T);
        Y = S.exec(Z);
        if(Y != null){
            var R = "";
            var Q = false;
            var P = false;
            var O = false;
            var N = false, M = false, L = false;
            var K = new Array();
            if(Y[1])
                K[0] = Y[1];
            if(Y[3])
                K[1] = Y[3];
            if(Y[6])
                K[2] = Y[6];
            for(var J = 0; J < K.length; J ++ ){
                var I,
                H;
                I = K[J].toLowerCase();
                H = I.charAt(0);
                switch(H){
                    case "y" : 
                        if(I.length > 2)
                            Q = true;
                        if(N)
                            return getFormat("longDate", W);
                        N = true;
                        R += H;
                        break;
                    case "m" : 
                        if(I.length > 1)
                            P = true;
                        if(M)
                            return getFormat("longDate", W);
                        M = true;
                        R += H;
                        break;
                    case "d" : 
                        if(I.length > 1)
                            O = true;
                        if(L)
                            return getFormat("longDate", W);
                        L = true;
                        R += H;
                        break;
                    default : 
                        break;
                }
            }
            if( ! N)
                R += "y";
            if( ! M)
                R += "m";
            if( ! L)
                R += "d";
            X = getFormat((Q ? "longDate" : "shortDate"), W);
            X.ymdOrder = R;
            X.padMonth = P;
            X.padDay = O;
            X.showYear = N;
            X.showMonth = M;
            X.showDay = L;
            X.prefix = Z.substring(0, Y.index);
            X.suffix = Z.substring(Y.lastIndex);
            if(Y[2] != "")
                X.dateSeparator = Y[2];
            Z = Z.substring(Y.lastIndex);
        }
        var G = V.timeSeparator;
        G = "[ \/.\\'|:`," + G + kNoBreakSpace + "]+|-+";
        var F = "((" + reStrHour + ")(" + G + "))?" + "(" + reStrMinute + ")" + "((" + G + ")(" + reStrSecond + "))?" + kNoBreakSpace + "*(" + reStrAMPM + ")?";
        var E = new RegExp(F);
        Y = E.exec(Z);
        if(Y != null && (Y[2] != "" || Y[7] != "")){
            var D = Y[2];
            var C = Y[4];
            var B = Y[7];
            var A = Y[8];
            var Z1;
            var Y1 = false;
            if(A == ""){
                Z1 = getFormat("time24", W);
            }
            else{
                Z1 = getFormat("time12", W);
            }
            if(X == null)
                X = Z1;
            else{
                Y1 = true;
                for(var X1 in Z1){
                    if(X[X1] == null)
                        X[X1] = Z1[X1];
                }
                X["type"] = "dateTime";
            }
            if(D == ""){
                X.showHour = false;
            }
            else if(D.length > 1){
                X.padHour = true;
            }
            if( ! X.showHour && C.length == 1){
                X.padMinute = false;
            }
            if(B == ""){
                X.showSecond = false;
            }
            else{
                X.showSecond = true;
            }
            if( ! Y1)
                X.prefix = Z.substring(0, Y.index);
            X.suffix = Z.substring(Y.lastIndex);
            if(Y[6] != "")
                X.timeSeparator = Y[6];
            if(Y[3] != "")
                X.timeSeparator = Y[3];
        }
        return X;
    }
    var W1,
    V1;
    var U1,
    T1,
    S1;
    var R1,
    Q1;
    X = getFormat("num", W);
    W1 = V.decimalSeparator;
    V1 = V.groupingSeparator;
    var P1 = "([" + W1 + "]|(" + reStrDecSepDecl + "))";
    var O1 = "([" + V1 + "]|(" + reStrGrpSepDecl + "))";
    var N1 = "((" + reStrDigit + "+" + O1 + ")*" + reStrDigit + "+)";
    var M1 = "(" + P1 + "(" + reStrDigit + "*))?";
    var L1 = new RegExp(N1 + M1);
    Y = L1.exec(Z);
    if(Y == null)
        return null;
    U1 = Y[1];
    S1 = Y[6];
    T1 = Y[8];
    X.prefix = Z.substring(0, Y.index);
    X.suffix = Z.substring(Y.lastIndex);
    if(X.suffix != ""){
        Y = X.suffix.match(/^%/);
        if(Y != null)
            X.multiplier = 100;
    }
    var K1 = new RegExp(reStrDecSepDecl);
    var J1 = "";
    var I1 = (S1 != "");
    if(I1){
        Y = K1.exec(S1);
        if(Y != null){
            X.decimalSeparator = Y[0].charAt(0);
        }
    }
    var H1 = new RegExp(reStrGrpSepDecl);
    var G1 = "";
    Y = H1.exec(U1);
    if(Y != null){
        X.groupingSeparator = Y[0].charAt(0);
    }
    var F1 = new RegExp(O1, "g");
    var E1 = U1.replace(F1, "");
    if(E1.length == U1.length){
        X.groupingSeparator = "";
    }
    Y = E1.match(/0+$/);
    if(Y != null){
        X.requiredDigits = Y[0].length;
    }
    X.requiredDecimals =- 1;
    if(I1){
        Y = T1.match(/^0+/);
        if(Y != null){
            X.requiredDecimals = Y[0].length;
        }
        X.decimals = T1.length;
    }
    return X;
}
function hasCustomFormat(Z){
    var Y = getFormatType(Z);
    return Y == "custom";
}
function getFormatType(Z){
    var Y = null;
    Y = Z._viewFormat;
    if(Y == null)
        Y = Z.viewFormat;
    if(Y == null)
        Y = Z.formatHint;
    return Y;
}
function getFormatAttributes(Z, Y){
    var X;
    var W;
    X = getFormatType(Z);
    if(X == null || X == "general" || X == "number")
        return null;
    if(typeof(Y) != "number" || isNaN(Y))
        return null;
    if(X == "custom"){
        var V = "";
        if(Y > 0)
            V = Z.positiveFormat;
        else if(Y < 0)
            V = (Z.negativeFormat ? Z.negativeFormat : Z.positiveFormat);
        else if(Y == 0)
            V = (Z.vanishedFormat ? Z.vanishedFormat : Z.positiveFormat);
        else
            V = Z.nonvalueFormat;
        if((V == "") || (V == null))
            return null;
        W = parseCustomFormat(V);
        if(W == null)
            return null;
        W.isCustom = true;
    }
    else{
        W = getFormat(X, gAppLocale);;
        if(W == null)
            return null;
        while(W && W.locale && W.locale != gAppLocale){
            W = getFormat(W.parent, gAppLocale);;
        }
    }
    if(W.type == "dateTime" || W.type == "longDate" || W.type == "shortDate" || W.type == "time"){
        if(getDate(Y) == null)
            return null;
    }
    return W;
}
function formatGeneral(Z){
    if(Z == null){
        return "[" + getString("strErrorSmall") + "]";
    }
    else if(typeof Z == "number"){
        return localizedValue(Z, gAppLocale);
    }
    else{
        return Z;
    }
}
function formatValue(Z, Y){
    var X = "";
    var W = getFormatAttributes(Z, Y);
    if(W == null)
        return formatGeneral(Y);
    if(W.type == "dateTime"){
        if(getDate(Y) == null)
            return formatGeneral(Y);
        X = formatDate(W, Y);
        X += kNoBreakSpace;
        X += formatTime(W, Y);
        return X;
    }
    if(W.type == "shortDate" || W.type == "longDate")
        return formatDate(W, Y);
    if(W.type == "time")
        return formatTime(W, Y);
    var V = W.requiredDigits;
    var U = W.requiredDecimals;
    var T = W.decimals;
    var S = W.decimalSeparator;
    var R = W.groupingSeparator;
    var Q = W.prefix;
    var P = W.multiplier;
    var O = W.suffix;
    var N;
    if(W.type == "currency" && W.currencyNegativeStyle){
        N = W.currencyNegativeStyle;
    }
    else{
        N = W.negativeStyle;
    }
    var M,
    L;
    if(W.type == "currency"){
        M = W.currencyStyle;
        L = W.currencySymbol;
    }
    if(typeof Y != "number")
        return Y;
    if(W.isCustom && Y < 0)
        Y =- Y;
    return formatNumber(Y, V, U, T, P, S, R, Q, M, L, N, O);
}
function randInt(Z, Y){
    return Z + Math.round((Y - Z) * Math.random());
}
function abs(Z){
    if(Z < 0)
        return - Z;
    return Z;
}
function min(Z, Y){
    if(Y < Z)
        return Y;
    return Z;
}
function max(Z, Y){
    if(Y > Z)
        return Y;
    return Z;
}
function pin(Z, Y, X){
    if(Z < Y)
        return Y;
    if(Z > X)
        return X;
    return Z;
}
function abs(Z){
    if(Z < 0)
        return - Z;
    return Z;
}
function withinRange(Z, Y, X){
    return((Z >= Y) && (Z <= X));
}
function isInteger(Z){
    if(typeof Z != "number" && typeof Z != "string")
        return false;
    return(parseInt(Z) == parseFloat(Z));
}
function roundScalar(Z){
    return Math.round(Z);
}
function floorScalar(Z){
    return Math.floor(Z);
}
function pinScalar(Z, Y, X){
    if(Z > X)
        Z = X;
    if(Z < Y)
        Z = Y;
    return Z;
}
function mapScalar(Z, Y, X){
    return Math.round((Z * X) / Y);
}
function formatRadix(Z, Y, X){
    var W = Math.pow(Y, X - 1);
    var V = "";
    while(W > Z && --X > 0){
        V += "0";
        W /= Y;
    }
    V += Z.toString(Y);
    return V;
}
function HSVtoRGB(Z, Y, X){
    var W,
    V,
    U,
    T,
    S,
    R,
    Q,
    P;
    var O = Z;
    var N = Y;
    var M = X;
    if(N == 0.0){
        W = V = U = M;
    }
    else{
        O /= 60;
        P = Math.floor(O);
        T = O - P;
        S = M * (1.0 - N);
        R = M * (1.0 - N * T);
        Q = M * (1.0 - N * (1.0 - T));
        switch(P){
            case 0 : 
                W = M;
                V = Q;
                U = S;
                break;
            case 1 : 
                W = R;
                V = M;
                U = S;
                break;
            case 2 : 
                W = S;
                V = M;
                U = Q;
                break;
            case 3 : 
                W = S;
                V = R;
                U = M;
                break;
            case 4 : 
                W = Q;
                V = S;
                U = M;
                break;
            default : 
                W = M;
                V = S;
                U = R;
                break;
        }
    }
    var L,
    K = "";
    L = Math.floor(W * 255.0);
    K += formatRadix(L, 16, 2);
    L = Math.floor(V * 255.0);
    K += formatRadix(L, 16, 2);
    L = Math.floor(U * 255.0);
    K += formatRadix(L, 16, 2);
    return K;
}
function emptyColor(Z){
    return(Z == null || Z == "" || Z == "transparent" || Z == "none" || Z == "clear");
}
function newBounds(Z, Y, X, W){
    return {
        "top" : Z,
        "left" : Y,
        "bottom" : X,
        "right" : W,
        "height" : X - Z,
        "width" : W - Y
    };
}
function newSizedBounds(Z, Y, X, W){
    return {
        "top" : Z,
        "left" : Y,
        "bottom" : Z + X,
        "right" : Y + W,
        "height" : X,
        "width" : W
    };
}
function zeroBounds(){
    return newBounds(0, 0, 0, 0);
}
function emptyBounds(Z){
    return(Z.width <= 0 || Z.height <= 0);
}
function equalBounds(Z, Y){
    return((Z.height == Y.height) && (Z.width == Y.width) && (Z.top == Y.top) && (Z.left == Y.left) && (Z.bottom == Y.bottom) && (Z.right == Y.right));
}
function insetBounds(Z, Y, X){
    var W = new Object();
    W.top = Z.top + X;
    W.left = Z.left + Y;
    W.bottom = Z.bottom - X;
    if(W.bottom < W.top)
        W.bottom = W.top;
    W.right = Z.right - Y;
    if(W.right < W.left)
        W.right = W.left;
    W.height = W.bottom - W.top;
    W.width = W.right - W.left;
    return W;
}
function offsetBounds(Z, Y, X){
    var W = new Object();
    W.top = Z.top + X;
    W.left = Z.left + Y;
    W.bottom = Z.bottom + X;
    W.right = Z.right + Y;
    W.height = Z.height;
    W.width = Z.width;
    return W;
}
function unionBounds(Z, Y){
    if(emptyBounds(Y))
        return Z;
    if(emptyBounds(Z))
        return Y;
    var X = new Object();
    X.top = min(Z.top, Y.top);
    X.left = min(Z.left, Y.left);
    X.bottom = max(Z.bottom, Y.bottom);
    X.right = max(Z.right, Y.right);
    X.height = X.bottom - X.top;
    X.width = X.right - X.left;
    return X;
}
function intersectBounds(Z, Y){
    var X = new Object();
    X.top = max(Z.top, Y.top);
    X.left = max(Z.left, Y.left);
    X.bottom = min(Z.bottom, Y.bottom);
    X.right = min(Z.right, Y.right);
    X.height = X.bottom - X.top;
    X.width = X.right - X.left;
    if((X.height < 0) || (X.width < 0))
        return zeroBounds();
    return X;
}
function diffBounds(Z, Y, X, W){
    if(equalBounds(Z, Y)){
        return;
    }
    else if( ! overlappingBounds(Z, Y)){
        X[0] = Z;
        W[0] = Y;
    }
    else{
        diffBoundsOverlap(Z, Y, X, W);
    }
}
function diffBoundsOverlap(Z, Y, X, W){
    var V;
    var U;
    if((Z.left < Y.left) || ((Z.left == Y.left) && (Z.right < Y.right))){
        U = new Object();
        U.left = Z.left;
        U.right = Y.left;
        U.top = Z.top;
        U.bottom = Z.bottom;
        U.height = U.bottom - U.top;
        U.width = U.right - U.left;
        if((U.height > 0) && (U.width > 0))
            X[X.length] = U;
        V = new Object();
        V.left = Z.right;
        V.right = Y.right;
        V.top = Y.top;
        V.bottom = Y.bottom;
        V.height = V.bottom - V.top;
        V.width = V.right - V.left;
        if((V.height > 0) && (V.width > 0))
            W[W.length] = V;
    }
    else{
        V = new Object();
        V.left = Y.right;
        V.right = Z.right;
        V.top = Z.top;
        V.bottom = Z.bottom;
        V.height = V.bottom - V.top;
        V.width = V.right - V.left;
        if((V.height > 0) && (V.width > 0))
            X[X.length] = V;
        U = new Object();
        U.left = Y.left;
        U.right = Z.left;
        U.top = Y.top;
        U.bottom = Y.bottom;
        U.height = U.bottom - U.top;
        U.width = U.right - U.left;
        if((U.height > 0) && (U.width > 0))
            W[W.length] = U;
    }
    var T = new Object();
    T.left = max(Z.left, Y.left);
    T.right = min(Z.right, Y.right);
    T.top = min(Z.bottom, Y.bottom);
    T.bottom = max(Z.bottom, Y.bottom);
    T.height = T.bottom - T.top;
    T.width = T.right - T.left;
    if((T.height > 0) && (T.width > 0)){
        if((Z.top < Y.top) || ((Z.top == Y.top) && (Z.bottom < Y.bottom)))
            W[W.length] = T;
        else
            X[X.length] = T;
    }
    var S = new Object();
    S.left = max(Z.left, Y.left);
    S.right = min(Z.right, Y.right);
    S.top = min(Z.top, Y.top);
    S.bottom = max(Z.top, Y.top);
    S.height = S.bottom - S.top;
    S.width = S.right - S.left;
    if((S.height > 0) && (S.width > 0)){
        if((Z.top < Y.top) || ((Z.top == Y.top) && (Z.bottom < Y.bottom)))
            X[X.length] = S;
        else
            W[W.length] = S;
    }
}
function overlappingBounds(Z, Y){
    var X = intersectBounds(Z, Y);
    return((X.height > 0) && (X.width > 0));
}
function ratioBounds(Z, Y){
    var X = Z.height;
    var W = Z.width;
    if(Z.width * Y.height > Z.height * Y.width)
        W = roundScalar(X * Y.width / Y.height);
    else
        X = roundScalar(W * Y.height / Y.width);
    return {
        "top" : Z.top,
        "left" : Z.left,
        "bottom" : Z.top + X,
        "right" : Z.left + W,
        "height" : X,
        "width" : W
    };
}
function mapBounds(Z, Y, X){
    var W,
    V,
    U,
    T;
    if(Y.height > 0){
        W = roundScalar(((Z.top - Y.top) * X.height) / Y.height);
        U = roundScalar((Z.height * X.height) / Y.height);
    }
    else{
        W = (Z.top - Y.top) + X.top;
        U = X.height;
    }
    if(Y.width > 0){
        V = roundScalar(((Z.left - Y.left) * X.width) / Y.width);
        T = roundScalar((Z.width * X.width) / Y.width);
    }
    else{
        V = (Z.left - Y.left) + X.left;
        T = X.width;
    }
    return {
        "top" : W + X.top,
        "left" : V + X.left,
        "bottom" : W + X.top + U,
        "right" : V + X.left + T,
        "height" : U,
        "width" : T
    };
}
function limitBounds(Z, Y){
    var X = pinScalar(Z.top, Y.top, Y.bottom);
    var W = pinScalar(Z.left, Y.left, Y.right);
    var V = pinScalar(Z.bottom, X, Y.bottom);
    var U = pinScalar(Z.right, W, Y.right);
    return {
        "top" : X,
        "left" : W,
        "bottom" : V,
        "right" : U,
        "height" : V - X,
        "width" : U - W
    };
}
function centerBounds(Z, Y){
    var X = roundScalar((Y.width - Z.width) / 2);
    var W = roundScalar((Y.height - Z.height) / 2);
    return offsetBounds(Z, X - Z.left + Y.left, W - Z.top + Y.top);
}
function getPoint(Z){
    if(Z == null)
        return null;
    return {
        "x" : Z.x,
        "y" : Z.y
    };
}
function mapPoint(Z, Y){
    if((Z == null) || (Y == null))
        return null;
    var X = 
    {
        "x" : Z.x, "y" : Z.y
    };
    for(var W = Y; W != null; W = getContext(W)){
        X.x -= W.offsetLeft - getHorizontal(W);
        X.y -= W.offsetTop - getVertical(W);
    }
    return X;
}
function testPoint(Z, Y){
    if(Z == null || Y == null)
        return false;
    return((Z.x >= Y.left) && (Z.x < Y.right) && (Z.y >= Y.top) && (Z.y < Y.bottom));
}
function framePoint(Z, Y){
    var X = insetBounds(Y ,- 3 ,- 3);
    var W = insetBounds(Y, 4, 4);
    return(testPoint(Z, X) &&! testPoint(W, Y));
}
function hit(Z, Y){
    return(abs(Y - Z) < 4);
}
this.kTopContext = this;
function windowBounds(){
    var Z = new Object();
    Z.top = 0;
    Z.left = 0;
    Z.bottom = getHeight(gDocument.body);
    Z.right = getWidth(gDocument.body);
    Z.height = Z.bottom - Z.top;
    Z.width = Z.right - Z.left;
    return Z;
}
function getBounds(Z, Y){
    if(Z == null)
        return null;
    if(Y == null)
        Y = new Object();
    Y.top = 0;
    Y.left = 0;
    Y.height = getHeight(Z);
    Y.width = getWidth(Z);
    if(check_debug("bounds"))
        alert("starting: " + Z.name + "; bounds: " + Y.top + "," + Y.left + "," + (Y.top + Y.height) + "," + (Y.left + Y.width));
    for(var X = Z; X != null; X = getContext(X)){
        Y.top += getTop(X) - getVertical(X);
        Y.left += getLeft(X) - getHorizontal(X);
        if(check_debug("bounds"))
            alert("offset: " + X.name + "; bounds top & left: " + Y.top + "," + Y.left);
    }
    Y.bottom = Y.top + Y.height;
    Y.right = Y.left + Y.width;
    return Y;
}
function setBounds(Z, Y){
    var X = Y.top;
    var W = Y.left;
    for(var V = getContext(Z); V != null; V = getContext(V)){
        X -= V.offsetTop - getVertical(V);
        W -= V.offsetLeft - getHorizontal(V);
    }
    setTop(Z, X);
    setLeft(Z, W);
    setHeight(Z, Y.height);
    setWidth(Z, Y.width);
}
function revealBounds(Z, Y){
    if(Y.top + Y.height > Z.scrollTop + Z.clientHeight)
        Z.scrollTop = Y.top + Y.height - Z.clientHeight;
    if(Y.top < Z.scrollTop)
        Z.scrollTop = Y.top;
    if(Y.left + Y.width > Z.scrollLeft + Z.clientWidth)
        Z.scrollLeft = Y.left + Y.width - Z.clientWidth;
    if(Y.left < Z.scrollLeft)
        Z.scrollLeft = Y.left;
}
function revealChild(Z, Y){
    var X = newBounds(Y.offsetTop, Y.offsetLeft, Y.offsetTop + Y.offsetHeight, Y.offsetLeft + Y.offsetWidth);
    revealBounds(Z, X);
}
function getScreenSize(){
    var Z = new Object();
    Z.width = ( ! screen) ?- 1 : screen.availWidth;
    Z.height = ( ! screen) ?- 1 : screen.availHeight;
    return Z;
}
function bestWindowSize(Z, Y){
    var X = getScreenSize();
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
function CenterInWindow(Z){
    var Y = windowBounds();
    var X = getWidth(Z);
    var W = getHeight(Z);
    setTop(Z, (Y.height - W) / 3);
    setLeft(Z, (Y.width - X) / 2);
}
var gDocument = document;
function getElement(Z){
    return gDocument.all[Z];
}
function existsElement(Z){
    return ! ((typeof gDocument.all[Z]) == 'undefined');
}
function getParent(Z){
    return Z.parentElement;
}
function getChild(Z, Y){
    var X = Z.getElementsByTagName('*');
    for(var W = 0; W < X.length; W ++ ){
        var V = X[W];
        if( ! V.id){
            if(V.tagName == Y)
                return V;
            if(V.className == Y)
                return V;
        }
        if(V.id == Y)
            return V;
    }
    return null;
}
function getValue(Z){
    return Z.value;
}
function setValue(Z, Y){
    if(Z.value != Y)
        Z.value = Y;
}
function setElementValue(Z, Y){
    var X = getElement(Z);
    if(X == null)
        return;
    if(X.tagName && X.tagName == 'INPUT'){
        if(X.value != Y)
            X.value = Y;
    }
    else{
        if(X.innerHTML != Y)
            X.innerHTML = Y;
    }
}
function getElementValue(Z){
    var Y = gDocument.all[Z];
    if(Y == null)
        return null;
    if(Y.value != null)
        return Y.value;
    else
        return getInner(Y, true);
    return null;
}
function getElementIntegerValue(Z){
    var Y = getElement(Z);
    var X = parseInt(Y.value);
    if(isNaN(X)){
        var W = Y.value.mappedSubstring(0);
        if(isNaN(W)){
            return null;
        }
        else{
            return parseInt(W);
        }
    }
    else{
        return X;
    }
}
function checkElement(Z, Y){
    var X = getElement(Z);
    if(X == null)
        return;
    if(X.tagName == 'INPUT')
        X.checked = (Y == true);
}
function elementCheck(Z){
    var Y = gDocument.all[Z];
    if(Y != null)
        return Y.checked;
    return false;
}
function getInner(Z, Y){
    if(Y)
        return Z.innerText;
    if(Z.style && Z.style.inner)
        return Z.style.inner;
    return Z.innerText;
}
function setInner(Z, Y){
    if(Z.style.inner != Y){
        Z.style.inner = Y;
        Z.innerHTML = Y;
    }
}
function getExtra(Z, Y){
    return Z[Y];
}
function setExtra(Z, Y, X){
    Z[Y] = X;
}
function getDisplay(Z){
    return(getStyle(Z, "display") != "none");
}
function setDisplay(Z, Y){
    if(Y)
        setStyle(Z, "display", "inline");
    else
        setStyle(Z, "display", "none");
}
function getDepth(Z){
    return getStyle(Z, "zIndex");
}
function setDepth(Z, Y){
    setStyle(Z, "zIndex", Y);
}
function getVisible(Z){
    var Y = getStyle(Z, "visibility");
    return(Y != "hidden" && Y != "");
}
function setVisible(Z, Y){
    if(Z == null)
        return;
    if(typeof(Y) == "string")
        Y = (Y == "visible");
    if(Y){
        setStyle(Z, "visibility", "visible");
    }
    else{
        setStyle(Z, "visibility", "hidden");
    }
}
function getForegroundColor(Z){
    return getStyle(Z, "color");
}
function setForegroundColor(Z, Y){
    setStyle(Z, "color", Y);
}
function getBackgroundColor(Z){
    return getStyle(Z, "backgroundColor");
}
function setBackgroundColor(Z, Y){
    setStyle(Z, "backgroundColor", Y);
}
function getBackgroundImage(Z){
    return getStyle(Z, "backgroundImage");
}
function setBackgroundImage(Z, Y){
    var X = "";
    if(Y && Y != "none")
        X = "url('" + Y + "')";
    setStyle(Z, "backgroundImage", X);
}
function getBackgroundX(Z){
    return getStyle(Z, "backgroundPositionX");
}
function setBackgroundX(Z, Y){
    setStyle(Z, "backgroundPositionX", Y);
}
function getBackgroundY(Z){
    return getStyle(Z, "backgroundPositionY");
}
function setBackgroundY(Z, Y){
    setStyle(Z, "backgroundPositionY", Y);
}
function getContext(Z){
    return Z.offsetParent;
}
function getHorizontal(Z, Y){
    if(Z.scrollLeft != null)
        return Z.scrollLeft;
    if(Y)
        return Z.style.pixelLeft;
    return 0;
}
function setHorizontal(Z, Y){
    if(Z.scrollLeft != null){
        if(Z.scrollLeft != Y)
            Z.scrollLeft = Y;
    }
    else{
        if(Z.style.pixelLeft != Y)
            Z.style.pixelLeft = Y;
    }
}
function getVertical(Z, Y){
    if(Z.scrollTop != null)
        return Z.scrollTop;
    if(Y)
        return Z.style.pixelTop;
    return 0;
}
function setVertical(Z, Y){
    if(Z.scrollTop != null){
        if(Z.scrollTop != Y)
            Z.scrollTop = Y;
    }
    else{
        if(Z.style.pixelTop != Y)
            setTop(Z, Y);
    }
}
function getTop(Z){
    return Z.offsetTop;
}
function setTop(Z, Y){
    setStyle(Z, "pixelTop", Y);
}
function getLeft(Z){
    return Z.offsetLeft;
}
function setLeft(Z, Y){
    setStyle(Z, "pixelLeft", Y);
}
function getBottom(Z){
    return(getTop(Z) + getHeight(Z));
}
function setBottom(Z, Y){
    setStyle(Z, "bottom", Y + "px");
}
function getRight(Z){
    return(getLeft(Z) + getWidth(Z));
}
function setRight(Z, Y){
    setStyle(Z, "right", Y + "px");
}
function getHeight(Z){
    var Y = Z.offsetHeight;
    var X = Z.style.pixelHeight;
    var W = parseInt(Z.currentStyle.height);
    if(is.ie55up && W == 0 && X == 0)
        return X;
    return Y;
}
function getPixelHeight(Z){
    return Z.style.pixelHeight;
}
function setHeight(Z, Y){
    setStyle(Z, "pixelHeight", Y);
}
function setElementHeight(Z, Y){
    var X = getElement(Z);
    if(X != null)
        setHeight(X, Y);
}
function getWidth(Z){
    return Z.offsetWidth;
}
function getItemWidth(Z){
    if(is.ie4){
        return Z.scrollWidth;
    }
    else{
        return Z.offsetWidth;
    }
}
function setWidth(Z, Y){
    setStyle(Z, "pixelWidth", Y);
}
function getClass(Z){
    if(Z.className == null && Z.id != null && Z.id == 'popupWidget')
        return Z.id;
    return Z.className;
}
function setClass(Z, Y){
    if(check_debug("class"))
        if((Z.className != null) && (Z.className != "") && (Z.className != Y))
            alert("setClass: attempting to set different className");
    Z.className = Y;
}
function getStyle(Z, Y){
    return Z.style[Y];
}
function setStyle(Z, Y, X){
    if(Z.style && (Z.style[Y] != X))
        Z.style[Y] = X;
}
function getChildren(Z){
    return Z.children;
}
function setToolTip(Z, Y){
    Z.title = Y;
}
function setElementSrc(Z, Y, X, W){
    if(X){
        writeDocumentContents(Z, Y, W);
        return;
    }
    if(Z.tagName.match(/IFRAME/i))
        document.frames[Z.id].location.replace(Y);
    else
        Z.src = Y;
}
function writeDocumentContents(Z, Y, X){
    Z.innerHTML = Y;
}
function killTimeout(Z){
    if(Z != null)
        clearTimeout(Z);
    return null;
}
function eventInComboBox(Z){
    return(Z.srcElement.className == "comboBox");
}
function isStandardFont(Z){
    var Y = Z.toLowerCase();
    switch(Y){
        case "arial" : 
        case "arial black" : 
        case "bookman old style" : 
        case "courier" : 
        case "garamond" : 
        case "lucida console" : 
        case "symbol" : 
        case "tahoma" : 
        case "times new roman" : 
        case "trebuchet ms" : 
        case "verdana" : 
            return true;
            break;
        default : 
            return false;
            break;
    }
}
function getDefaultFont(){
    var Z;
    Z = gDefaultFont[gAppLocale];;
    return Z;
}
function getDefaultTimeFormat(Z){
    var Y;
    Y = getFormat("localeDefault", Z);;
    if(Y == null)
        return "time24";
    if(Y.ampm)
        return "time12";
    return "time24";
}
function CellRefOnly2RowCol(Z){
    if(Z.match(/R(\d+)C(\d+)/) != null){
        row = parseInt(RegExp.$1);
        col = parseInt(RegExp.$2);
    }
    else if(Z.match(/C(\d+)R(\d+)/) != null){
        row = parseInt(RegExp.$2);
        col = parseInt(RegExp.$1);
    }
    else if(Z.match(/([A-Z][A-Z]{0,1})(\d+)/) != null){
        col = ColumnLetterToColumnIndex(RegExp.$1);
        row = parseInt(RegExp.$2);
    }
    else
        return[null, null];
    return[row, col];
}
function CellRef2RowCol(Z){
    var Y,
    X,
    W,
    V,
    U,
    T;
    var S;
    S = Z.split('!');
    if( ! S || S.length == 0)
        return;
    var R,
    Q;
    if(S.length > 1){
        R = S[0];
        Q = S[1];
    }
    else
        Q = S[0];
    if(R){
        S = R.split('@');
        if(S){
            W = S[0];
            if(S.length > 1)
                V = R.substr(W.length + 1);
        }
    }
    Q = Q.toUpperCase();
    var P = Q.split(':');
    if( ! P ||! P[0])
        return;
    if(P[0]){
        S = CellRefOnly2RowCol(P[0]);
        Y = S[0];
        X = S[1];
    }
    if(P[1]){
        S = CellRefOnly2RowCol(P[1]);
        U = S[0];
        T = S[1];
    }
    return[Y, X, W, V, U, T];
}
var g_charCode_A = 'A'.charCodeAt(0);
var g_charCode_Z = 'Z'.charCodeAt(0);
var g_columnNameBaseNum = g_charCode_Z - g_charCode_A + 1;
function ColumnIndexToColumnLetter(Z){
    Z -= 1;
    var Y = Z % g_columnNameBaseNum;
    var X = String.fromCharCode(Y + g_charCode_A);
    Z = (Z - Y) / g_columnNameBaseNum - 1;
    if(Z >= 0)
        if(Z < g_columnNameBaseNum)
            X = String.fromCharCode(Z + g_charCode_A) + X;
        else;
        return X;
    }
    function ColumnLetterToColumnIndex(Z){
        Z = Z.toUpperCase();
    var Y = 0;
    var X = 0;
    if(Z.length > 1 && isUpper(Z.charAt(1))){
        X = 1;
        Y += g_columnNameBaseNum * (Z.charCodeAt(0) - g_charCode_A + 1);
    }
    Y += Z.charCodeAt(X) - g_charCode_A;
    return Y + 1;
}
function aasGetCurrVisibility(){
    if( ! gIsMatterhorn || gAppId == "")
        return null;
    var Z = aasFileIdToHash(gAppId);
    if(Z.visibility == "groups")
        return Z.ownerName;
    return Z.visibility;
}
function aasFileIdToHash(Z){
    var Y = ["appName", "ownerName", "bloxName", "visibility", "fileName"];
    if(Z == null)
        Z = "";
    var X = Z.split("$");
    var W = {};
    for(var V = 0; V < Y.length; V ++ ){
        var U = X[V];
        W[Y[V]] = ((U == null || U == "") ? null : U);
    }
    return W;
}
function isLoggedIn(){
    var Z = new Cookie(document, "shortTerm");
    if(Z.load() && typeof Z.ticket != 'undefined')
        return true;
    return false;
}
function isMember(){
    if(isLoggedIn())
        return true;
    var Z = new Cookie(document, "longTerm");
    if(Z.load() && typeof Z.mname != 'undefined')
        return true;
    return false;
}
function isAppId(Z){
    return Z.match(/^([a-z0-9]{8}_[a-z0-9]{4})$/) != null;
}
function getMemberInfo(){
    var Z = new Cookie(document, "longTerm");
    if(Z.load() && Z.mid){
        return {
            "id" : Z.mid,
            "name" : Z.mname
        };
    }
    return null;
}
var gHelpWindow;
function ShowHelp(Z){
    if(typeof(cancelEntryFieldRefocus) != "undefined")
        cancelEntryFieldRefocus();
    var Y = bestWindowSize(650, 510);
    var X = (typeof gHelpPath == "undefined") ? "help" : gHelpPath;
    var W = gIsMatterhorn ? (kRootUrl + X + gHelpFiles[Z]) : (kRootUrl + X + '?display=frameset' + (Z ? '&id=' + Z : ''));
    gHelpWindow = window.open(W, "helpWindow", 'width=' + Y.width + ',height=' + Y.height + ',scrollbars=' + (gIsMatterhorn ? "yes" : "no") + ',resizable=yes,status=no,toolbar=' + (gIsMatterhorn ? "yes" : "no") + '');
    setTimeout("gHelpWindow.focus(); gHelpWindow=null;", 0);
}
function DoBugReport(Z){
    var Y = "unknown";
    var X = "unknown";
    var W = new Cookie(document, "longTerm");
    if(W.load()){
        Y = W.mname;
        X = W.mid;
    }
    window.frames.bugFrame.location = "mailto:bugs@blox.com?" + "subject=" + escape(getString("strBugReportCmp", kDefaultLocale, Z)) + "&body=" + escape(getString("strBloxInternalUse") + navigator.userAgent + " mid=" + X + " mname=" + Y + " appId=" + gAppId);
}
function iLoveIE4(){
    savePref('iLoveIE4', true, true);
    closeModal();
}
function UpgradeToIE5(){
    closeModal();
    if(typeof ss_close != "undefined")
        ss_close(false);
    window.open("http://www.microsoft.com/windows/ie/");
}
function ShowEmailSpreadsheet(Z, Y, X){
    if(Z == '' ||! Y){
        hb_alert(getString("strSaveSSBeforeEmail"), getString("strEmailSpreadsheet"));
        return;
    }
    var W = kRootUrl + gSendMailScript;
    var V = getServerUrl() + "/" + gOpenScript;
    var U = (typeof gAppDescription != "undefined") ? escapeUnicode(gAppDescription) : null;
    X = ((X && X != "false") ? "true" : "false");
    if(X == "true"){
        winSize = bestWindowSize(550, 450);
    }
    else{
        winSize = bestWindowSize(550, 410);
    }
    var T = window.open(W + "?srcMode=v" + "&spreadsheetID=" + escape(Z) + "&isPrivate=" + X + (U != null ? "&desc=" + U : "") + "&goto=" + V, "emailWin", 'width=' + winSize.width + ',height=' + winSize.height + ',resizable,scrollbars');
    T.focus();
}
function fixCssUrls(){
    if(typeof kServletPrefix == "undefined" ||! kServletPrefix)
        return;
    var Z = document.styleSheets;
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y].rules;
        for(var W = 0; W < X.length; W ++ ){
            var V = X[W].style;
            var U = V.backgroundImage;
            if(U != ""){
                U = U.replace(/(url\(\s*("|')?\/)/, "$1" + kServletPrefix);
                V.backgroundImage = U;
            }
        }
    }
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();