//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kMillisecondsPerDay = 1000 * 60 * 60 * 24;
var kMilliseconds = 1000;
var kDegreesPerRadian = 180 / Math.PI;
var kRadiansPerDegree = 1 / kDegreesPerRadian;
var gRuntime = new Object();
var functionBody = "";
var gUserFuncArgs = [];
var gSafeEvalReturn = null;
var kMinColumns = 4;
var kMaxColumns = 100;
var kMinRows = 4;
var kMaxRows = 500;
var kMaxColumnDigits = 2;
var kMaxRowDigits = 3;
function runtime(Z, Y, X, W){
    gRuntime.text = Z;
    gRuntime.name = Y;
    gRuntime.callback = X;
    gRuntime.ignoreOverride = W ? true : false;
    gRuntime.forceDirty = false;
    gRuntime.resources = 0;
    var V = eval(Z);
    if(X == null || X == spreadsheetCallback){
        var U = name2cell(Y).cellData;
        if(U){
            if(gRuntime.resources > 0)
                U.resourceCount = gRuntime.resources;
            else
                delete(U.resourceCount);
        }
    }
    return V;
}
function runtimeResourceCount(){
    return gRuntime.resources;
}
var gConstant = 
{
    ln2 : Math.LN2, ln10 : Math.LN10,
    log2e : Math.LOG2E,
    log10e : Math.LOG10E,
    sqrt2 : Math.SQRT2
};
function constSymbol(Z){
    return gConstant[Z.toLowerCase()];
}
var gComma2String = "number_2";
var gComma3String = "number_3";
var gCurrency2String = "currency_usd_2";
var gNumberString = "number";
var gGeneralString = "general";
var gFunctionInfo = 
{
    sum : ["__sum", null], product : ["__product", null],
    min : ["__min", null],
    max : ["__max", null],
    average : ["__average", null],
    median : ["__median", null],
    abs : ["__abs", null],
    ceiling : ["__ceiling", null],
    floor : ["__floor", null],
    round : ["__round", null],
    _int_ : ["__int", null],
    trunc : ["__trunc", null],
    mod : ["__mod", null],
    sign : ["__sign", null],
    isblank : ["__isblank", null],
    isvalue : ["__isvalue", null],
    isstring : ["__isstring", null],
    iserror : ["__iserror", null],
    and : ["__and", null],
    or : ["__ior", null],
    xor : ["__xor", null],
    not : ["_not", null],
    select : ["__select", null],
    concatenate : ["_concat", gGeneralString],
    left : ["_left", null],
    right : ["_right", null],
    power : ["__pow", gComma2String],
    log : ["__log10", gComma2String],
    log10 : ["__log10", gComma2String],
    ln : ["__logNatural", gComma2String],
    e : ["__e", gComma2String],
    exp : ["__exp", gComma2String],
    sqrt : ["__sqrt", gComma2String],
    ln : ["__ln", gComma2String],
    degrees : ["__degrees", gComma3String],
    radians : ["__radians", gComma3String],
    pi : ["__pi", gComma3String],
    cos : ["__cos", gComma3String],
    sin : ["__sin", gComma3String],
    tan : ["__tan", gComma3String],
    acos : ["__acos", gComma3String],
    asin : ["__asin", gComma3String],
    atan : ["__atan", gComma3String],
    atan2 : ["__atan2", gComma3String],
    now : ["__now", "dateAndTime"],
    time : ["__time", getDefaultTimeFormat(gAppLocale)],
    hour : ["__hour", gNumberString],
    minute : ["__minute", gNumberString],
    second : ["__second", gNumberString],
    today : ["__today", "longDate"],
    date : ["__date", "dateAndTime"],
    timevalue : ["__timevalue", gComma3String],
    datevalue : ["__datevalue", gComma3String],
    year : ["__year", gGeneralString],
    month : ["__month", gGeneralString],
    day : ["__day", gGeneralString],
    weekday : ["__weekday", gGeneralString],
    rand : ["__random", null],
    err : ["__error", gGeneralString],
    newfunction : ["_newFunction", null],
    currency : ["__currency", gCurrency2String],
    quote : ["__quote", gCurrency2String],
    query : ["__query", gGeneralString],
    testerDonVail : ["__testerDonVail", gGeneralString],
    image : ["__image", gGeneralString],
    link : ["__link", null],
    blank : ["__blank", gGeneralString],
    edgarsearch : ["__edgarsearch", gGeneralString],
    edgarsearchex : ["__edgarsearchex", gGeneralString],
    edgarcontents : ["__edgarcontents", gGeneralString],
    scell : ["__scell", null],
    slist : ["__slist", null],
    sfind : ["__sfind", null],
    svlookup : ["__svlookup", null],
    shlookup : ["__shlookup", null],
    pmt : ["__pmt", gCurrency2String],
    pv : ["__pv", gCurrency2String],
    npv : ["__npv", gCurrency2String],
    fv : ["__fv", gCurrency2String],
    nper : ["__nper", gCurrency2String],
    ppmt : ["__ppmt", gCurrency2String],
    ipmt : ["__ipmt", gCurrency2String],
    vlookup : ["__vlookup", null],
    hlookup : ["__hlookup", null],
    menu : ["__menu", null],
    button : ["__button", null],
    cellref : ["__cellref", null],
    rsheader : ["__rsheader", null],
    rsdata : ["__rsdata", null],
    override : ["__override", null],
    _false_ : ["__false", null],
    _true_ : ["__true", null],
    large : ["__large", null],
    small : ["__small", null],
    slice : ["__slice", null],
    array : ["__array", null]
};
var call = new Object;
InitCallObj();
function InitCallObj(){
    var Z,
    Y,
    X;
    for(X in gFunctionInfo){
        Z = eval(gFunctionInfo[X][0]);
        Y = X;
        call[Y] = Z;
        call[Y.toUpperCase()] = Z;
    }
    call.getcell = Cell;
    call.GETCELL = Cell;
    call.setcell = SetCell;
    call.SETCELL = SetCell;
    call.cell = Cell;
    call.CELL = Cell;
    call.Cell = Cell;
    call.SetCell = SetCell;
    call.getcellformat = userGetCellFormat;
    call.GETCELLFORMAT = userGetCellFormat;
    call.setcellformat = userSetCellFormat;
    call.SETCELLFORMAT = userSetCellFormat;
    call.getrowcount = call.GETROWCOUNT = userGetRowCount;
    call.getcolcount = call.GETCOLCOUNT = userGetColCount;
    if(gIsMatterhorn){
        call.postcellxml = call.POSTCELLXML = userPostCellXml;
        call.getcelloverride = call.GETCELLOVERRIDE = userGetCellOverride;
        call.setcelloverride = call.SETCELLOVERRIDE = userSetCellOverride;
        call.getoriginalvalue = call.GETORIGINALVALUE = userGetOrigValue;
        call.isoverridden = call.ISOVERRIDDEN = userIsOverridden;
        call.isoverrideenabled = call.ISOVERRIDEENABLED = userIsOverrideEnabled;
        call.getresultsetids = userGetResultSetIds;
        call.GETRESULTSETIDS = userGetResultSetIds;
        call.getaxisdimensioncount = userGetAxisDimensionCount;
        call.GETAXISDIMENSIONCOUNT = userGetAxisDimensionCount;
        call.getaxistuplecount = userGetAxisTupleCount;
        call.GETAXISTUPLECOUNT = userGetAxisTupleCount;
    }
}
function RecompileMacros(){
    InitMacros(gMacroText, RefreshMacroCells);
}
function RefreshMacroCells(){
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = gCellDataArray[Z];
        if(Y == null || (typeof Y != "object"))
            continue;
        var X = name2row(Y.m_div.m_name);
        var W = name2column(Y.m_div.m_name);
        if( ! X ||! W)
            continue;
        if((Y.derived && Y.derived.error && Y.derived.error.toLowerCase() == getString("strErrParse")) || (Y.dynamic && Y.dynamic.search(new RegExp("__error\\((\"|')" + getString("strErrParse"), "i")) == 0))
            RebuildCell(Y.m_div);
        else if(Y.dynamic && (Y.dynamic.search(/__macro\(/) >- 1))
            dirtyCell(Y.m_div);
    }
}
function RefreshFormulaCells(){
    for(var Z = 0; Z < gCellDataArray.length; Z ++ ){
        var Y = gCellDataArray[Z];
        if( ! Y.derived &&! Y.dynamic)
            continue;
        var X = name2row(Y.m_div.m_name);
        var W = name2column(Y.m_div.m_name);
        if( ! X ||! W)
            continue;
        RebuildCell(Y.m_div);
    }
}
function RecoverOldStyleMacros(){
    var Z = '';
    for(i in recoveredFunctions){
        Z += recoveredFunctions[i];
    }
    gMacroText += Z;
}
function InitMacros(Z, Y){;
    var X = '';
    var W;
    var V = ["alert", "confirm", "prompt", "navigator", "clientInformation", "Math", "screen"];
    var U = {};
    for(W = 0; W < V.length; W ++ )
        U[V[W]] == true;
    X += 'var window';
    for(var T in window){
        if(U[T])
            continue;
        X += ',' + T;
    }
    X += ';';
    if(gIsMatterhorn)
        X += 'var alert, confirm, prompt;';
    clearAllMacroTimers();
    X += '_revRef.gMacroApi.localEval = function(x){return eval(unescape(x));};';
    X += 'var setTimeout=_revRef.MacroApiSetTimeout;';
    X += 'var clearTimeout=_revRef.clearTimeout;';
    X += 'var setInterval=_revRef.MacroApiSetInterval;';
    X += 'var clearInterval=_revRef.clearInterval;';
    X += 'var call = _revRef.call;';
    X += '_revRef = null;';
    X += 'var g = { appLocale: "' + gAppLocale + '" };';
    X += '\n' + Z + '\n';
    var S = extractJsFunctionNames(Z);
    for(W = 0; W < S.length; W ++ ){
        var R = S[W][0];
        X += 'if (typeof ' + R + '!="undefined") arguments.callee.' + R + '=' + R + ';';
    }
    var Q = window.frames.macroFrame;
    Q._macroCode = X;
    Q._callback = Y;
    Q.obj = {};
    Q.setTimeout("obj.m=new Function('_revRef', _macroCode); _macroCode=null; obj.m(parent); parent.RegisterMacros(obj.m); if (_callback) _callback(); _callback=null;", 0);
}
function RegisterMacros(Z){
    for(var Y in userFunctions){
        var X = userFunctions[Y];
        if(X &&! X[1])
            delete userFunctions[Y];
    }
    for(Y in Z){
        if(typeof Z[Y] != 'function')
            continue;
        userFunctions[Y.toLowerCase()] = [Z[Y], ''];
    }
    if(userFunctions["init"] &&! userFunctions["init"][1]){
        var W = __macro("init");
        if(__iserror(W))
            alert(W.error + ": " + W.tooltip);
    }
}
function functSymbol(Z){
    var Y = gFunctionInfo[Z.toLowerCase()];
    if( ! Y)
        Y = gFunctionInfo['_' + Z.toLowerCase() + '_'];
    if( ! Y)
        return null;
    return Y[0];
}
function functFormat(Z){
    var Y = gFunctionInfo[Z.toLowerCase()];
    if( ! Y)
        Y = gFunctionInfo['_' + Z.toLowerCase() + '_'];
    if( ! Y)
        return null;
    return Y[1];
}
function IsDirtyOnInit(Z){
    Z = Z.toLowerCase();
    if((Z == "quote") || (Z == "link") || (Z == "query") || (Z == "now") || (Z == "time") || (Z == "timevalue") || (Z == "hour") || (Z == "minute") || (Z == "second") || (Z == "today") || (Z == "date") || (Z == "datevalue") || (Z == "year") || (Z == "month") || (Z == "day") || (Z == "weekday") || (Z == "menu") || (Z == "newfunction") || (Z == "edgarsearch") || (Z == "edgarcontents") || (Z == "edgarsearchex") || (Z == "scell") || (Z == "shlookup") || (Z == "svlookup") || (Z == "sfind") || (Z == "button") || (Z == "rsheader") || (Z == "rsdata"))
        return true;
    return false;
}
var gRunTimeError;
function CheckArgSize(Z, Y, X){
    if(Z && X < Z){
        gRunTimeError = __error(getString("strErrFew"), getString("strTooFewParameters"));
        return false;
    }
    if(Y && X > Y){
        gRunTimeError = __error(getString("strErrMany"), getString("strTooManyParameters"));
        return false;
    }
    return true;
}
function CheckForError(Z){
    if(typeof Z == "object" && (Z != null) && (Z.error)){
        gRunTimeError = Z;
    }
    else
        gRunTimeError = __error(getString("strErrParm"), getString("strParameterUnknownType"));
    return false;
}
function FixArgsCompare(){
	var Z = FixArgsCompare.caller.length;
    if( ! CheckArgSize(2, 2, Z))
        return false;
    for(var Y = 0; Y < 2; Y ++ ){
    	if (FixArgsCompare.caller[Y] == null)
    		FixArgsCompare.caller[Y] = 0;
    	if (typeof FixArgsCompare.caller[Y] != "number" && typeof FixArgsCompare.caller[Y] != "string")
    		return CheckForError(FixArgsCompare.caller[Y]);
    }
    if (!isNaN(FixArgsCompare.caller[0]) && !isNaN(FixArgsCompare.caller[1])) {
    	FixArgsCompare.caller[0] = parseFloat(FixArgsCompare.caller[0]);
    	FixArgsCompare.caller[1] = parseFloat(FixArgsCompare.caller[1]);
    }
    else{
    	FixArgsCompare.caller[0] = FixArgsCompare.caller[0].toString();
    	FixArgsCompare.caller[1] = FixArgsCompare.caller[1].toString();
    }
    return true;
}
function GetDateArg(Z){
    var Y = typeof Z;
    if(Y == 'string'){
        if(isNaN(Z))
            return Date.parse(Z) / kMillisecondsPerDay;
        else
            return Z - 0;
    }
    else if(Y == 'number'){
        return Z;
    }
    return - 1;
}
function FixArgsDate(){
	var Z = FixArgsDate.caller.length;
    if( ! CheckArgSize(1, 1, Z))
        return false;
    var Y = ChkArgsForError(FixArgsDate.caller);
    if(Y){
        gRunTimeError = Y;
        return false;
    }
       FixArgsDate.caller[0] = GetDateArg(FixArgsDate.caller[0]);
       if (FixArgsDate.caller[0] == -1) {
        gRunTimeError = __error(getString("strErrDate"), getString("strInvalidDate"));
        return false;
    }
    return true;
}
function FixArgsDate_NumStringErr(Z){
    arguments = Z;
    if(typeof(Z[0]) == "string"){
        if( ! FixArgsAllStrings(1, 1))
            return gRunTimeError;
        var Y = new Object();
        if( ! dateString(Z[0], Y, "en"))
            return __error(getString("strErrDate"), getString("strInvalidDate"));
        Z[0] = Y.timeValue;
    }
    else if(typeof(Z[0]) == "number"){
        if( ! FixArgsAllNumbers(1, 1))
            return gRunTimeError;
    }
    else{
        if( ! FixArgsGeneric(1, 1))
            return gRunTimeError;
        return __error(getString("strErrDate"), getString("strInvalidDate"));
    }
    return null;
}
function FixArgsGeneric(Z, Y){
	var X = FixArgsGeneric.caller.length;
    if( ! CheckArgSize(Z, Y, X))
        return false;
    var W = ChkArgsForError(FixArgsGeneric.caller);
    if(W){
        gRunTimeError = W;
        return false;
    }
    return true;
}
function FixArgsAllNumbersStrict(Z, Y){
	var X = FixArgsAllNumbersStrict.caller.length;
    if( ! CheckArgSize(Z, Y, X))
        return false;
    for(var W = 0; W < X; W ++ ){
    	if (FixArgsAllNumbersStrict.caller[W] == null) {
    		FixArgsAllNumbersStrict.caller[W] = 0;
            continue;
        }
           var V = typeof FixArgsAllNumbersStrict.caller[W];
        if(V == 'number')
            continue;
        if(V == 'string'){
        	if (FixArgsAllNumbersStrict.caller[W] == "") {
        		FixArgsAllNumbersStrict.caller[W] = 0;
                continue;
            }
               if (isNaN(FixArgsAllNumbersStrict.caller[W])) {
                gRunTimeError = __error(getString("strErrNan"), getString("strParameterNumberOnly"));
                return false;
            }
               FixArgsAllNumbersStrict.caller[W] = FixArgsAllNumbersStrict.caller[W] - 0;
        }
        else
        	return CheckForError(FixArgsAllNumbersStrict.caller[W]);
    }
    return true;
}
function FixArgsAllNumbers(Z, Y){
	var X = FixArgsAllNumbers.caller.length;
    if( ! CheckArgSize(Z, Y, X))
        return false;
    for(var W = 0; W < X; W ++ ){
    	if (FixArgsAllNumbers.caller[W] == null) {
    		FixArgsAllNumbers.caller[W] = 0;
            continue;
        }
           var V = typeof FixArgsAllNumbers.caller[W];
        if(V == 'number')
            continue;
        if(V == 'string'){
        	if (FixArgsAllNumbers.caller[W] == "" || isNaN(FixArgsAllNumbers.caller[W])) {
        		FixArgsAllNumbers.caller[W] = 0;
                continue;
            }
               FixArgsAllNumbers.caller[W] = FixArgsAllNumbers.caller[W] - 0;
        }
        else
        	return CheckForError(FixArgsAllNumbers.caller[W]);
    }
    return true;
}
function FixArgsNumbers(Z, Y){
    for(var X = Z; X <= Y; X ++ ){
    	if (FixArgsNumbers.caller[X] == null) {
    		FixArgsNumbers.caller[X] = 0;
            continue;
        }
           var W = typeof FixArgsNumbers.caller[X];
        if(W == 'number')
            continue;
        if(W == 'string'){
        	if (FixArgsNumbers.caller[X] == "" || isNaN(FixArgsNumbers.caller[X])) {
        		FixArgsNumbers.caller[X] = 0;
                continue;
            }
               FixArgsNumbers.caller[X] = FixArgsNumbers.caller[X] - 0;
        }
        else
        	return CheckForError(FixArgsNumbers.caller[X]);
    }
    return true;
}
function FixArgsAllNumbersUndef(Z, Y){
	var X = FixArgsAllNumbersUndef.caller.length;
    if( ! CheckArgSize(Z, Y, X))
        return false;
    var W;
    var V = X;
    for(var U = 0; U < X; U ++ ){
    	if (FixArgsAllNumbersUndef.caller[U] == null) {
    		FixArgsAllNumbersUndef.caller[U] = W;
            V -- ;
            continue;
        }
           var T = typeof FixArgsAllNumbersUndef.caller[U];
        if(T == 'number')
            continue;
        if(T == 'string'){
        	if (FixArgsAllNumbersUndef.caller[U] == "" || isNaN(FixArgsAllNumbersUndef.caller[U])) {
        		FixArgsAllNumbersUndef.caller[U] = W;
                V -- ;
                continue;
            }
               FixArgsAllNumbersUndef.caller[U] = FixArgsAllNumbersUndef.caller[U] - 0;
        }
        else
        	return CheckForError(FixArgsAllNumbersUndef.caller[U]);
    }
    if( ! Z)
        return true;
    if(V >= Z)
        return true;
    gRunTimeError = __error(getString("strErrEnough"), getString("strNotEnoughParameters"));
    return false;
}
function FixArgsAllStrings(Z, Y){
	var X = FixArgsAllStrings.caller.length;
    if( ! CheckArgSize(Z, Y, X))
        return false;
    for(var W = 0; W < X; W ++ ){
    	if (FixArgsAllStrings.caller[W] == null) {
    		FixArgsAllStrings.caller[W] = "";
            continue;
        }
           var V = typeof FixArgsAllStrings.caller[W];
        if(V == 'string')
            continue;
        if(V == 'number')
        	FixArgsAllStrings.caller[W] = FixArgsAllStrings.caller[W].toString();
        else
        	return CheckForError(FixArgsAllStrings.caller[W]);
    }
    return true;
}
function ChkArgsForError(Z){
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y];
        if( ! X)
            continue;
        if(X.error){
            if(X.error.error)
                return X.error;
            return X;
        }
    }
    return null;
}
function _not(Z){
    if( ! FixArgsAllNumbersStrict(1, 1))
        return gRunTimeError;
    if(Z == 0)
        return 1;
    return 0;
}
function _neg(Z){
    if( ! FixArgsAllNumbersStrict(1, 1))
        return gRunTimeError;
    return - Z;
}
function _getcelname(){
    var Z = null;
    if(arguments.length == 1){
        Z = plainSymbol(arguments[0]);
    }
    else if(arguments.length == 2){
        FixArgsAllNumbersStrict(2, 2);
        Z = "r" + arguments[0] + "c" + arguments[1] + "s0";
    }
    return Z;
}
function _getcelobj(Z){
    var Y = safeName2cell(Z, true);
    if(Y == null)
        return __error(getString("strErrRange"), getString("strCellOutOfRange"));
    if(Y ==- 1){
        Y = createCell(name2row(Z), name2column(Z), gCurrSheetIndex);
        if(Y == null)
            return __error("#CELL!", getString("strCantCreateCell"));
    }
    return Y;
}
function _cel(Z){
    var Y = safeName2cell(Z, true);
    if(Y == null)
        return __error(getString("strErrRange"), getString("strCellOutOfRange"));
    if(Y ==- 1 || Y.cellData == null)
        return null;
    if(Y.cellData.derived != null)
        return Y.cellData.derived;
    var X = Y.cellData.entry;
    if(X != null &&! emptyString(X.toString()) &&! equalString(X.toString()))
        return X;
    return null;
}
function _setcel(Z, Y){
    var X = _getcelobj(Z);
    if(X == null)
        return;
    if(__iserror(X))
        return X;
    CheckForCellData(X.m_name);
    if(Y == null)
        Y = '';
    else
        Y = Y.toString();
    buildCell(X, Y);
    if(kMode != "design" && X == gEditCell){
        boundEdit();
        fetchEdit(true);
    }
    gSpreadsheetDirty = true;
}
function Cell(){
    if(arguments.length == 1){
        if(typeof arguments[0] != "string")
            return __error("#CELL!", getString("strCellBadParameterCmp", kDefaultLocale, arguments[0]));
        return _cel(plainSymbol(arguments[0]));
    }
    FixArgsAllNumbersStrict(2, 2);
    return _cel(index2name(arguments[0], arguments[1], 0));
}
function SetCell(){
    if(arguments.length == 2){
        FixArgsAllStrings(2, 2);
        return _setcel(plainSymbol(arguments[0]), arguments[1]);
    }
    else if(arguments.length == 3){
        FixArgsNumbers(0, 1);
        return _setcel(index2name(arguments[0], arguments[1], 0), arguments[2]);
    }
    else
        return __error("#SETCELL!", getString("strSetCellFormatParameters"));
}
function userGetCellOverride(){
    var Z = null;
    var Y = null;
    if(arguments.length == 1){
        Z = _getcelname(arguments[0]);
    }
    else if(arguments.length == 2){
        Z = _getcelname(arguments[0], arguments[1]);
    }
    if(Z != null){
        Y = safeName2cell(Z, true);
        if(Y && Y.cellData && isOverridden(Y.cellData)){
            return Y.cellData.override.userValue;
        }
    }
    return "";
}
function userSetCellOverride(){
    var Z = null;
    var Y = null;
    if(arguments.length == 2){
        Z = _getcelname(arguments[0]);
    }
    else if(arguments.length == 3){
        Z = _getcelname(arguments[0], arguments[1]);
    }
    if(Z != null){
        Y = safeName2cell(Z, true);
        if(Y && Y.cellData && isOverrideEnabled(Y.cellData)){
            setCellOverride(Y.cellData, (arguments.length == 3) ? arguments[2] : arguments[1]);
            pulseCell(Y);
            return true;
        }
    }
    return false;
}
function userGetOrigValue(){
    var Z = null;
    var Y = null;
    if(arguments.length == 1){
        Z = _getcelname(arguments[0]);
    }
    else if(arguments.length == 2){
        Z = _getcelname(arguments[0], arguments[1]);
    }
    if(Z != null){
        Y = safeName2cell(Z, true);
        if(Y && Y.cellData && isOverridden(Y.cellData)){
            return Y.cellData.override.origValue;
        }
    }
    return "";
}
function userIsOverridden(){
    var Z = null;
    var Y = null;
    if(arguments.length == 1){
        Z = _getcelname(arguments[0]);
    }
    else if(arguments.length == 2){
        Z = _getcelname(arguments[0], arguments[1]);
    }
    if(Z != null){
        Y = safeName2cell(Z, true);
        if(Y && Y.cellData && isOverridden(Y.cellData)){
            return true;
        }
    }
    return false;
}
function userIsOverrideEnabled(){
    var Z = null;
    var Y = null;
    if(arguments.length == 1){
        Z = _getcelname(arguments[0]);
    }
    else if(arguments.length == 2){
        Z = _getcelname(arguments[0], arguments[1]);
    }
    if(Z != null){
        Y = safeName2cell(Z, true);
        if(Y && Y.cellData && isOverrideEnabled(Y.cellData)){
            return true;
        }
    }
    return false;
}
function userSetCellFormat(){
    var Z,
    Y,
    X,
    W,
    V,
    U;
    if(arguments.length < 2)
        return;
    if(typeof(arguments[0]) == "string"){
        Y = plainSymbol(arguments[0]);
        if(Y == null)
            return __error("#SETCELLFORMAT!", getString("strSetCellFormatBadCellref"));
        Z = 1;
        if(arguments.length % 2 == 0)
            return false;
    }
    else{
        Y = index2name(arguments[0], arguments[1], gCurrSheetIndex);
        Z = 2;
        if(arguments.length % 2 == 1)
            return false;
    }
    V = _getcelobj(Y);
    if(V == null)
        return false;
    if(__iserror(V))
        return V;
    CheckForCellData(Y);
    U = null;
    while(Z < arguments.length){
        var T;
        T = userSetCellFormatKey(V, arguments[Z], arguments[Z + 1]);
        if(T){
            if(U){
                U.tooltip += " and " + T.tooltip;
            }
            else{
                U = T;
            }
        }
        Z += 2;
    }
    if(kMode == "design" && gInitialized)
        fetchEntry();
    return U;
}
function mapCellFormatKey(Z){
    var Y;
    switch(Z){
        case "fontfamily" : 
            Y = "viewFamily";
            break;
        case "fontsize" : 
            Y = "viewSize";
            break;
        case "color" : 
            Y = "foreColor";
            break;
        case "backgroundcolor" : 
            Y = "bk_color";
            break;
        case "fontstyle" : 
            Y = "_fontStyle";
            break;
        case "fontweight" : 
            Y = "_fontWeight";
            break;
        case "textdecoration" : 
            Y = "_textDecoration";
            break;
        case "textalign" : 
            Y = "_textAlign";
            break;
        case "textwrap" : 
            Y = "_wrapText";
            break;
        default : 
            Y = Z;
            break;
    }
    return Y;
}
function userSetCellFormatKey(Z, Y, X){
    var W,
    V,
    U,
    T;
    if(Z == null)
        return __error("#SETCELLFORMAT!", getString("strSetCellFormatBadCellref"));
    if(typeof(Y) != "string")
        return __error("#SETCELLFORMAT!", getString("strSetCellFormatInvalidKey"));
    W = Y.toLowerCase();
    V = mapCellFormatKey(W);
    if(W == V){
        return __error("#SETCELLFORMAT!", getString("strSetCellFormatBadKeyCmp", kDefaultLocale, Y));
    }
    invalidValue = false;
    U = X;
    var S = X;
    if(typeof(X) == "string")
        S = X.toLowerCase();
    switch(W){
        case "fontfamily" : 
            if( ! (typeof(X) == "string"))
                invalidValue = true;
            break;
        case "fontsize" : 
            if( ! (typeof(X) == "number" && X > 0))
                invalidValue = true;
            U = X + " pt";
            break;
        case "color" : 
        case "backgroundcolor" : 
            break;
        case "fontstyle" : 
            if( ! (S == "normal" || S == "italic"))
                invalidValue = true;
            else
                U = S;
            break;
        case "fontweight" : 
            if( ! (S == "normal" || S == "bold"))
                invalidValue = true;
            else
                U = S;
            break;
        case "textdecoration" : 
            if( ! (S == "none" || S == "underline"))
                invalidValue = true;
            else
                U = S;
            break;
        case "textalign" : 
            if( ! (S == "left" || S == "right" || S == "center"))
                invalidValue = true;
            else
                U = S;
            break;
        case "textwrap" : 
            if(X == "on"){
                U = 1;
            }
            else if(X == "off"){
                U = 0;
            }
            else if( ! (typeof(X) == "number" && (X == 0 || X == 1))){
                invalidValue = true;
            }
            break;
        default : 
            break;
    }
    if(invalidValue)
        return __error("#SETCELLFORMAT!", getString("strSetCellFormatBadValCmp", kDefaultLocale, X));
    setCellFormat(Z, V, U);
    return null;
}
function userGetCellFormat(){
    var Z,
    Y,
    X,
    W,
    V;
    var U,
    T,
    S;
    if(arguments.length < 2)
        return __error("#GETCELLFORMAT!", getString("strGetCellFormatParameters"));
    if(typeof(arguments[0]) == "string"){
        Y = plainSymbol(arguments[0]);
        if(Y == null)
            return __error("#GETCELLFORMAT!", getString("strGetCellFormatBadCellref"));
        X = name2row(Y);
        W = name2column(Y);
        Z = 1;
    }
    else{
        X = arguments[0];
        W = arguments[1];
        Z = 2;
        if(arguments.length < 3)
            return __error("#GETCELLFORMAT!", getString("strGetCellFormatFewParams"));
    }
    U = arguments[Z];
    if(typeof(U) != "string")
        return __error("#GETCELLFORMAT!", getString("strGetCellFormatInvalidKey"));
    T = U.toLowerCase();
    S = mapCellFormatKey(T);
    if(S == T){
        return __error("#GETCELLFORMAT!", getString("strGetCellFormatBadKeyCmp", kDefaultLocale, U));
    }
    if( ! withinRange(X, 1, gRowCount - 1) ||! withinRange(W, 1, gColumnCount - 1))
        return __error("#GETCELLFORMAT!", getString("strGSFBadCellref"));
    V = index2cell(X, W, gCurrSheetIndex);
    var R = GetDefaultCellData(S);
    if(V != null && V !=- 1){
        CheckForCellData(index2name(X, W, gCurrSheetIndex));
        if(T == "textalign"){
            R = getTextAlignDefault(V);
        }
        else if(typeof(V.cellData[S]) != "undefined"){
            R = V.cellData[S];
        }
    }
    if(T == "fontfamily"){
        R = getFontFamilyName(R);
    }
    else if(T == "textwrap"){
        R = (R ? 1 : 0);
    }
    return R;
}
function userPostCellXml(Z, Y, X){
    var W = "postFrame";
    var V = httpPost(Z, W, Y, X, "cellxml", getXmlFromCellData());
    return V;
}
function httpPost(Z, Y, X, W){
    if( ! gIsMatterhorn)
        return;
    if(Z == null ||! Z)
        return __error("#POST!", getString("strUrlCantBeEmpty"));
    var V = {};
    var U = '';
    var T,
    S;
    for(var R = 4; R < arguments.length; R += 2){
        T = escapeInputName(arguments[R], V);
        if( ! T){
            break;
        }
        if(R + 1 == arguments.length){
            V.message = getString("strMoreFieldnames");
            break;
        }
        else{
            S = arguments[R + 1];
            S = escapeInnerXml(S, V);
        }
        if(V.message){
            break;
        }
        else{
            U += '<input type="hidden" name="' + T + '"' + ' value="' + S + '">';
        }
    }
    if(V.message)
        return __error("#POST!", V.message);
    var Q = getElement("postForm");
    if(Z.substring(0, 1) == "/"){
        if(kServletPrefix != "" && Z.indexOf("/" + kServletPrefix) != 0)
            Z = "/" + kServletPrefix + Z.substring(1);
    }
    else if(Z.search(/^[a-z]+:/) ==- 1){
        var P = location.pathname.replace(/\/[^\/]*$/, "");
        Z = P + "/" + Z;
    }
    Z = addCharsetHint(Z, "UTF-8");
    U += '<input type="hidden" name="targetURL" value="' + Z + '">';
    if(X == void(0))
        X = "";
    else if(X == null ||! X || userFunctions[X.toLowerCase()] == null)
        X = "[skip]";
    U += '<input type="hidden" name="macroCallback" value="' + X + '">';
    W = (W == true ? "1" : "0");
    U += '<input type="hidden" name="doDataRefresh" value="' + W + '">';
    Q.action = addCharsetHint("/" + gHttpPostProxyScript, "UTF-8");
    Q.target = Y;
    Q.innerHTML = U;
    Q.submit();
    openSubmitDataDialog();
    return true;
}
function openSubmitDataDialog(){
    var Z = [{
        type : "raw", value : getString("strSubmittingDataServer")
    }];
    var Y = [{
        type : "cancel", value : getString("strClose")
    }];
    openModal("httppost_dialog", getString("strSubmittingData"), "", "", "cancelHttpPost()", Z, Y);
}
function releaseHttpPost(Z){
    if(Z == null || Z == ""){
        closeModal();
    }
    else{
        var Y = "<p>" + getString("strServerCommError") + ":</p>" + "<p style='color:red'>" + Z + "</p>";
        var X = [{
            type : "raw", value : Y
        }];
        var W = [{
            type : "accept", value : getString("strClose")
        }];
        openModal("httppost_dialog", getString("strCommError"), "", "cancelHttpPost()", "cancelHttpPost()", X, W);
    }
}
function cancelHttpPost(){
    var Z = frames.postFrame;
    if(window.event && window.event.ctrlKey){
        var Y = window.open('', 'debugWin', 'resizable,scrollbars');
        Y.ownerDocument.write(Z.ownerDocument.all[0].outerHTML);
        Y.ownerDocument.close();
    }
    else{
        Z.location.replace("about:blank");
        closeModal();
    }
}
var kBadInputNameAttribute = /("| )/;
function escapeInputName(Z, Y){
    if(typeof Z == "number")
        return Z.toString();
    else if(typeof Z == "string"){
        if( ! Z)
            Y.message = getString("strEmptyFieldname");
        else if(kBadInputNameAttribute.test(Z))
            Y.message = "Cannot POST fieldnames with double quotes or " + "spaces in them:" + Z;
        else
            return Z;
    }
    else
        Y.message = getString("strFieldnameError");
    return "";
}
function getXmlFromCellData(Z){
    if( ! Z)
        Z = gCellDataArray;
    var Y = 
    {
        foreColor : "color", bk_color : "backgroundColor",
        viewFamily : "fontFamily",
        viewSize : "fontSize",
        m_backgroundImage : "backgroundImage"
    };
    var X = ["foreColor", "bk_color", "viewFamily", "viewSize", "m_backgroundImage"];
    var W = ["fontStyle", "fontWeight", "textDecoration", "textAlign", "borderLeft", "borderRight", "borderTop", "borderBottom", "wrapText"];
    var V = ["textAlign", "wrapText", "viewSize", "viewFamily", "m_locked", "m_backgroundImage", "m_refersTo", "m_referredToBy", "m_cellGUI", "inner", "dynamic", "_widthClue"];
    var U,
    T;
    var S = new Array();
    S.push('<?xml version="1.0" encoding="UTF-8"?>' + '<BLOX>' + '<HEADER>');
    if(gAppId)
        S.push('<ID>' + escapeInnerXml(gAppId) + '</ID>');
    var R = new Date();
    S.push('<TSCREATED>' + R.getTime().toString() + '</TSCREATED>');
    S.push('</HEADER>' + '<SPREADSHEET version="1.0" rowCount="' + (gRowCount - 1) + '" columnCount="' + (gColumnCount - 1) + '">' + '<CELLS>');
    for(U = 0; U < Z.length; U ++ ){
        var Q = Z[U];
        var P = "";
        if(Q && Q.entry){
            P += '<CELL ' + 'r="' + name2row(Q.m_div.m_name) + '"' + ' c="' + name2column(Q.m_div.m_name) + '"';
            if(Q.m_dirtyOnInit == "true"){
                P += ' recalcOnInit="true"';
            }
            else{
                P += ' recalcOnInit="false"';
            }
            if(Q.hidden == "true"){
                P += ' hidden="true"';
            }
            else{
                P += ' hidden="false"';
            }
            if(Q.m_locked == "true"){
                P += ' locked="true"';
            }
            else{
                P += ' locked="false"';
            }
            P += '>';
            P += '<ENTRY>' + escapeInnerXml(Q.entry) + '</ENTRY>';
            if(Q.derived || (typeof Q.derived != "undefined" && Q.derived == ""))
                P += '<VALUE>' + escapeInnerXml(Q.derived) + '</VALUE>';
            var O = Q.m_div.innerText;
            if(O)
                P += '<DISPLAY>' + escapeInnerXml(O) + '</DISPLAY>';
            if(Q._viewFormat){
                P += '<FORMAT type="' + escapeInnerXml(Q._viewFormat) + '"';
                if(Q.positiveFormat)
                    P += ' positive="' + escapeInnerXml(Q.positiveFormat) + '"';
                if(Q.negativeFormat)
                    P += ' negative="' + escapeInnerXml(Q.negativeFormat) + '"';
                if(Q.vanishedFormat)
                    P += ' vanished="' + escapeInnerXml(Q.vanishedFormat) + '"';
                if(Q.nonvalueFormat)
                    P += ' nonvalue="' + escapeInnerXml(Q.nonvalueFormat) + '"';
                P += '></FORMAT>';
            }
            var N,
            M;
            var L = '';
            for(T = 0; T < X.length; T ++ ){
                N = X[T];
                if(Q[N]){
                    M = Q[N];
                    L += ' ' + Y[N] + '="' + escapeInnerXml(M) + '"';
                }
            }
            for(T = 0; T < W.length; T ++ ){
                N = "_" + W[T];
                if(Q[N]){
                    M = Q[N];
                    L += ' ' + W[T] + '="' + escapeInnerXml(M) + '"';
                }
            }
            if(L)
                P += '<STYLE' + L + '></STYLE>';
            var K;
            if((K = getCellOverride(Q)) != void(0)){
                var J = getCellOriginalValue(Q);
                P += '<OVERRIDE>' + '<USERVALUE>' + (K != null ? escapeInnerXml(K) : "") + '</USERVALUE>' + '<ORIGVALUE>' + (J != null ? escapeInnerXml(J) : "") + '</ORIGVALUE>' + '</OVERRIDE>';
            }
            P += "</CELL>";
            S.push(P);
        }
    }
    S.push("</CELLS>");
    if(gDataSources){
        S.push('<DATASOURCES>');
        for(U = 0; U < gDataSources.length; ++ U){
            S.push('<DATASOURCE');
            var I = gDataSources[U];
            for(var H in I){
                if(typeof I[H] == "number" || typeof I[H] == "string"){
                    S.push(' ' + H + '="' + XmlEncode(I[H]) + '"');
                }
            }
            S.push('/>');
        }
        S.push('</DATASOURCES>');
    }
    S.push("</SPREADSHEET>" + "</BLOX>");
    return S.join("");
}
function escapeInnerXml(Z, Y){
    if(typeof Z == "number")
        return Z.toString();
    else if(typeof Z == "string")
        return XmlEncode(Z);
    else if(typeof Z == "object" && Z.error)
        return Z.error;
    else{
        Y.message = getString("strInvalidXML");
        return "";
    }
}
function _eqr(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z == Y) ? 1 : 0;
    return(Z.toLowerCase() == Y.toLowerCase()) ? 1 : 0;
}
function _ner(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z != Y) ? 1 : 0;
    return(Z.toLowerCase() != Y.toLowerCase()) ? 1 : 0;
}
function _ltr(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z < Y) ? 1 : 0;
    return(Z.toLowerCase() < Y.toLowerCase()) ? 1 : 0;
}
function _gtr(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z > Y) ? 1 : 0;
    return(Z.toLowerCase() > Y.toLowerCase()) ? 1 : 0;
}
function _ger(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z >= Y) ? 1 : 0;
    return(Z.toLowerCase() >= Y.toLowerCase()) ? 1 : 0;
}
function _ler(Z, Y){
    if( ! FixArgsCompare())
        return gRunTimeError;
    if(typeof Z == "number")
        return(Z <= Y) ? 1 : 0;
    return(Z.toLowerCase() <= Y.toLowerCase()) ? 1 : 0;
}
function _add(Z, Y){
    if( ! FixArgsAllNumbersStrict(2, 2))
        return gRunTimeError;
    return(Z + Y);
}
function _sub(Z, Y){
    if( ! FixArgsAllNumbersStrict(2, 2))
        return gRunTimeError;
    return(Z - Y);
}
function _ior(Z, Y){
    if( ! FixArgsAllNumbersStrict(2, 2))
        return gRunTimeError;
    if((Z == 0) && (Y == 0))
        return 0;
    return 1;
}
function _mul(Z, Y){
    if( ! FixArgsAllNumbersStrict(2, 2))
        return gRunTimeError;
    return(Z * Y);
}
function _div(Z, Y){
    if( ! FixArgsAllNumbersStrict(2, 2))
        return gRunTimeError;
    if(Y == 0)
        return __error(getString("strErrDivZero"), getString("strDivisionByZero"));
    return(Z / Y);
}
function __sum(){
    if( ! FixArgsAllNumbers(1))
        return gRunTimeError;
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ )
        Z += arguments[Y];
    return Z;
}
function __product(){
    if( ! FixArgsAllNumbersUndef())
        return gRunTimeError;
    var Z;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        if(arguments[Y] != null){
            if(Z == null)
                Z = arguments[Y];
            else
                Z *= arguments[Y];
        }
    }
    if(Z == null)
        Z = 0;
    return Z;
}
function __min(){
    if( ! CheckArgSize(1, null, arguments.length))
        return gRunTimeError;
    if( ! FixArgsAllNumbersUndef())
        return gRunTimeError;
    var Z = Number.POSITIVE_INFINITY;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if((X != null) && (X < Z))
            Z = X;
    }
    if(Z == Number.POSITIVE_INFINITY)
        return 0;
    return Z;
}
function __max(){
    if( ! CheckArgSize(1, null, arguments.length))
        return gRunTimeError;
    if( ! FixArgsAllNumbersUndef())
        return gRunTimeError;
    var Z = Number.NEGATIVE_INFINITY;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if((X != null) && (X > Z))
            Z = X;
    }
    if(Z == Number.NEGATIVE_INFINITY)
        return 0;
    return Z;
}
function __average(){
    if( ! FixArgsAllNumbersUndef(1))
        return gRunTimeError;
    var Z = 0;
    var Y = 0;
    for(var X = 0; X < arguments.length; X ++ ){
        if(arguments[X] != null){
            Y ++ ;
            Z += arguments[X];
        }
    }
    return Z / Y;
}
function basicCompare(Z, Y){
    return Z - Y;
}
function __median(){
    if( ! FixArgsAllNumbersUndef(1))
        return gRunTimeError;
    var Z = new Array();
    for(var Y = 0; Y < arguments.length; Y ++ ){
        if(arguments[Y] != null)
            Z[Z.length] = arguments[Y];
    }
    var X = Z.length;
    Z.sort(basicCompare);
    if(X % 2 == 0){
        return __average(Z[Math.floor(X / 2) - 1], Z[Math.floor(X / 2)]);
    }
    else{
        return Z[Math.floor(X / 2)];
    }
}
function __abs(){
    if( ! FixArgsAllNumbersUndef(1, 1))
        return gRunTimeError;
    return Math.abs(arguments[0]);
}
function __ceiling(){
    if( ! FixArgsAllNumbersUndef(2, 2)){
        return gRunTimeError;
    }
    if((arguments[0] < 0 && arguments[1] > 0) || (arguments[0] > 0 && arguments[1] < 0)){
        gRunTimeError = __error(getString("strErrNum"), getString("strParameterSigns"));
        return gRunTimeError;
    }
    if(arguments[0] == 0 || arguments[1] == 0){
        return 0;
    }
    var Z = arguments[0] / arguments[1];
    Z = RoundFloatsDecimals(Z, 5);
    if(GetNumDecimalPositions(Z) == 0){
        return arguments[0];
    }
    var Y = Math.ceil(Z);
    var X = GetNumDecimalPositions(arguments[1]);
    return RoundFloatsDecimals(arguments[1] * Y, X);
}
function __floor(){
    if( ! FixArgsAllNumbersUndef(2, 2)){
        return gRunTimeError;
    }
    if((arguments[0] < 0 && arguments[1] > 0) || (arguments[0] > 0 && arguments[1] < 0)){
        gRunTimeError = __error(getString("strErrNum"), getString("strParameterSigns"));
        return gRunTimeError;
    }
    if(arguments[0] == 0 || arguments[1] == 0){
        return 0;
    }
    var Z = arguments[0] / arguments[1];
    Z = RoundFloatsDecimals(Z, 5);
    if(GetNumDecimalPositions(Z) == 0){
        return arguments[0];
    }
    var Y = Math.floor(Z);
    var X = GetNumDecimalPositions(arguments[1]);
    return RoundFloatsDecimals(arguments[1] * Y, X);
}
function GetNumDecimalPositions(Z){
    var Y = Z + "";
    var X = 0;
    for(; X < Y.length; X ++ ){
        if(Y.charAt(X) == '.')
            break;
    }
    if(X == Y.length - 1 || X == Y.length){
        return 0;
    }
    X ++ ;
    var W = 0;
    for(; X < Y.length; X ++ ){
        if(Y.charAt(X) != '0')
            break;
        W ++ ;
    }
    if(X == Y.length){
        return 0;
    }
    for(; X < Y.length; X ++ ){
        if(Y.charAt(X) == '0')
            break;
        W ++ ;
    }
    return W;
}
function RoundFloatsDecimals(Z, Y){
    Z = Z * Math.pow(10, Y);
    Z = Math.round(Z);
    Z = Z / Math.pow(10, Y);
    return Z;
}
function __round(){
    if( ! FixArgsAllNumbersUndef(2, 2))
        return gRunTimeError;
    var Z = Math.pow(10, arguments[1] + 0);
    var Y = Math.round(arguments[0] * Z);
    return Y / Z;
}
function __int(){
    if( ! FixArgsAllNumbersUndef(1, 1))
        return gRunTimeError;
    return Math.floor(arguments[0]);
}
function __sign(){
    if( ! FixArgsAllNumbersUndef(1, 1))
        return gRunTimeError;
    if(arguments[0] > 0)
        return 1;
    else if(arguments[0] < 0)
        return - 1;
    return 0;
}
function __trunc(Z, Y){
    if( ! FixArgsAllNumbersStrict(1, 2))
        return gRunTimeError;
    if(arguments.length == 1)
        Y = 0;
    var X = new RegExp("\\.\\d{" + Y + "}");
    var W = Z.toString().match(X);
    if(W)
        return parseFloat(Z.toString().replace(/\.\d*/, W[0]));
    else
        return Z;
}
function __mod(Z, Y){
    if( ! FixArgsAllNumbers(2, 2))
        return gRunTimeError;
    if(Y == 0)
        return __error(getString("strErrDivZero"), getString("strDivisionByZero"));
    return(Z % Y);
}
function __isblank(){
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if(X == null)
            Z += 1;
    }
    return Z;
}
function __isvalue(){
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if( ! isNaN(X))
            Z += 1;
    }
    return Z;
}
function __isstring(){
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if(typeof X == "string")
            Z += 1;
    }
    return Z;
}
function __iserror(){
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if(X != null && typeof X == "object" && X.error)
            Z += 1;
    }
    return Z;
}
function __and(){
    if( ! FixArgsAllNumbersUndef(2))
        return gRunTimeError;
    for(var Z = 0; Z < arguments.length; Z ++ ){
        var Y = arguments[Z];
        if((Y != null) && (Y == 0))
            return 0;
    }
    return 1;
}
function __ior(){
    if( ! FixArgsAllNumbersUndef(2))
        return gRunTimeError;
    for(var Z = 0; Z < arguments.length; Z ++ ){
        var Y = arguments[Z];
        if((Y != null) && (Y == 1))
            return 1;
    }
    return 0;
}
function __xor(){
    if( ! FixArgsAllNumbersUndef(2))
        return gRunTimeError;
    var Z = 0;
    for(var Y = 0; Y < arguments.length; Y ++ ){
        var X = arguments[Y];
        if((X != null) && (X == 1)){
            if(Z == 0)
                Z = 1;
            else
                Z = 0;
        }
    }
    return Z;
}
function __select(){
    var Z = arguments.length;
    if( ! CheckArgSize(1, null, Z))
        return gRunTimeError;
    var Y = arguments[0];
    if(isNaN(Y) || (Y < 1) || (Y >= Z))
        return __error(getString("strErrIndex"), getString("strFirstParameterBad"));
    return arguments[Y];
}
function __pow(){
    if( ! FixArgsAllNumbers(2))
        return gRunTimeError;
    return Math.pow(arguments[0], arguments[1]);
}
function __e(){
    if( ! CheckArgSize(0, 0, arguments.length))
        return gRunTimeError;
    return Math.E;
}
function __log10(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.LOG10E * Math.log(arguments[0]);
}
function __logNatural(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.log(arguments[0]);
}
function __log(){
    return __error(getString("strErrRebuild"), getString("strPleaseRebuild"));
};
function __exp(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.exp(arguments[0]);
}
function __sqrt(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.sqrt(arguments[0]);
}
function __ln(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    var Z = arguments[0];
    if(Z <= 0)
        return __error(getString("strErrLog"), getString("strLogGreaterZero"));
    return Math.log(Z, Math.E);
}
function __degrees(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return(arguments[0] * kDegreesPerRadian);
}
function __radians(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return(arguments[0] * kRadiansPerDegree);
}
function __pi(){
    if( ! CheckArgSize(0, 0, arguments.length))
        return gRunTimeError;
    return(Math.PI);
}
function __cos(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.cos(arguments[0]);
}
function __sin(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.sin(arguments[0]);
}
function __tan(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.tan(arguments[0]);
}
function __acos(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.acos(arguments[0]);
}
function __asin(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.asin(arguments[0]);
}
function __atan(){
    if( ! FixArgsAllNumbers(1, 1))
        return gRunTimeError;
    return Math.atan(arguments[0]);
}
function __atan2(){
    if( ! FixArgsAllNumbers(2, 2))
        return gRunTimeError;
    return Math.atan2(arguments[1], arguments[0]);
}
function GetCurrentTime(){
    var Z = new Date();
    var Y = Z.getTimezoneOffset() * 60 * 1000;
    return(Z.getTime() - Y) / kMillisecondsPerDay;
}
function __now(){
    if( ! CheckArgSize(0, 0, arguments.length))
        return gRunTimeError;
    return GetCurrentTime();
}
function __time(){
    if( ! FixArgsAllNumbers(3, 3))
        return gRunTimeError;
    var Z = arguments[0];
    var Y = arguments[1];
    var X = arguments[2];
    if((Z < 0) || (Z > 23) || (Y < 0) || (Y > 59) || (X < 0) || (X > 59))
        return __error(getString("strErrTime"), getString("strInvalidTime"));
    return Date.UTC(1969, 11, 31, Z, Y, X) / kMillisecondsPerDay;
}
function __hour(){
    if( ! FixArgsDate())
        return gRunTimeError;
    var Z = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return Z.getUTCHours();
}
function __minute(){
    if( ! FixArgsDate())
        return gRunTimeError;
    var Z = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return Z.getUTCMinutes();
}
function __second(){
    if( ! FixArgsDate())
        return gRunTimeError;
    var Z = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return Z.getUTCSeconds();
}
function __today(){
    if( ! CheckArgSize(0, 0, arguments.length))
        return gRunTimeError;
    return Math.floor(GetCurrentTime());
}
function __date(){
    if( ! FixArgsAllNumbers(3, 3))
        return gRunTimeError;
    var Z = arguments[0];
    var Y = arguments[1];
    if(Y > 12){
        Z += Math.floor(Y / 12);
        Y = Y % 12;
    }
    var X = arguments[2];
    if((Z < 0) || (Z > 9999) || (Y < 1) || (Y > 12) || (X < 1) || (X > 31))
        return __error(getString("strErrDate"), getString("strInvalidDate"));
    return Date.UTC(Z, Y - 1, X, 0, 0, 0) / kMillisecondsPerDay;
}
function __datevalue(){
    if( ! FixArgsAllStrings(1, 1))
        return gRunTimeError;
    var Z = new Object();
    if(dateString(arguments[0], Z, "en")){
        return Math.floor(Z.timeValue);
    }
    return __error(getString("strErrDate"), getString("strInvalidDate"));
}
function __timevalue(){
    if( ! FixArgsAllStrings(1, 1))
        return gRunTimeError;
    var Z = new Object();
    if(dateString(arguments[0], Z, "en")){
        return Z.timeValue - Math.floor(Z.timeValue);
    }
    return __error(getString("strErrDate"), getString("strInvalidDate"));
}
function __year(){
    var Z = FixArgsDate_NumStringErr(arguments);
    if(Z != null)
        return Z;
    date = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return date.getUTCFullYear();
}
function __month(){
    if( ! FixArgsDate())
        return gRunTimeError;
    var Z = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return(Z.getUTCMonth() + 1);
}
function __day(){
    if( ! FixArgsDate())
        return gRunTimeError;
    var Z = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return Z.getUTCDate();
}
function __weekday(){
    var Z = FixArgsDate_NumStringErr(arguments);
    if(Z != null)
        return Z;
    var Y = new Date(Math.round(arguments[0] * kMillisecondsPerDay));
    return(Y.getUTCDay() + 1);
}
function __random(){
    if( ! FixArgsAllNumbers(0, 2))
        return gRunTimeError;
    switch(arguments.length){
        case 0 : 
            return Math.random();
        case 1 : 
            return Math.random() * arguments[0];
        case 2 : 
            return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
        default : 
            break;
    }
}
function doJavaScript(Z){
    return eval(Z);
}
var userFunctions = new Object;
var recoveredFunctions = new Object;
function __macro(Z){
    if( ! Z ||! userFunctions[Z])
        return __error(getString("strErrUserMacro"), getString("strMacroDoesntExistCmp", kDefaultLocale, Z));
    var Y = '';
    gUserFuncArgs.length = 0;
    for(var X = 1; X < arguments.length; X ++ )
        gUserFuncArgs[X - 1] = arguments[X];
    var W = SafeEvalUserFunc(Z);
    gUserFuncArgs.length = 0;
    return W;
}
function SafeEvalUserFunc(Z){
    Z = Z.toLowerCase();
    var Y,
    X;
    if(userFunctions[Z] == null)
        return __error(getString("strErrMacro"), getString("strMacroDoesntExistCmp", kDefaultLocale, Z));
    if(userFunctions && typeof userFunctions[Z] == 'object' && userFunctions[Z][1] == ''){
        Y = frames.macroFrame;
        X = "parent";
    }
    else{
        Y = self;
        X = "self";
    }
    var W = '';
    for(var V = 0; V < gUserFuncArgs.length; V ++ )
        W += (V > 0 ? ',' : '') + X + '.gUserFuncArgs[' + V + ']';
    var U = X + '.userFunctions.' + Z + '[0]';
    gSafeEvalReturn = 0;
    var T = Y.SafeEval(X + '.gSafeEvalReturn=' + U + '(' + W + ')');
    var S = gSafeEvalReturn;
    gSafeEvalReturn = 0;
    if( ! T)
        return S;
    else
        return __error(getString("strErrMacro"), getString("strMacroRuntimeErrorCmp", kDefaultLocale, Z, T));
}
function GetUserFuncCell(Z){
    if(userFunctions[Z])
        return userFunctions[Z][1];;
    return null;
}
var gMacroApi = {};
gMacroApi.localEval = null;
gMacroApi.timeoutIds = [];
gMacroApi.intervalIds = [];
function MacroApiSetTimeout(Z, Y){;
    var X = setTimeout("gMacroApi.localEval('" + escape(Z) + "')", Y);
    addMacroTimeoutId(X);
    setTimeout("removeMacroTimeoutId('" + X + "')", Y);
    return X;
}
function MacroApiSetInterval(Z, Y){;
    var X = setInterval("gMacroApi.localEval('" + escape(Z) + "')", Y);
    gMacroApi.intervalIds.push(X);
    return X;
}
function addMacroTimeoutId(Z){
    for(var Y = 0; Y < gMacroApi.timeoutIds.length; Y ++ ){
        if(typeof gMacroApi.timeoutIds[Y] == "undefined"){
            gMacroApi.timeoutIds[Y] = Z;
            return;
        }
    }
    gMacroApi.timeoutIds.push(Z);
}
function removeMacroTimeoutId(Z){
    for(var Y = 0; Y < gMacroApi.timeoutIds.length; Y ++ ){
        if(gMacroApi.timeoutIds[Y] == Z){
            delete gMacroApi.timeoutIds[Y];
            return;
        }
    }
}
function clearAllMacroTimers(){
    for(var Z = 0; Z < gMacroApi.timeoutIds.length; Z ++ )
        clearTimeout(gMacroApi.timeoutIds[Z]);
    gMacroApi.timeoutIds.length = 0;
    for(var Y = 0; Y < gMacroApi.intervalIds.length; Y ++ )
        clearInterval(gMacroApi.intervalIds[Y]);
    gMacroApi.intervalIds.length = 0;
}
function userGetRowCount(){
    return Math.max(gRowCount - 1, 0);
}
function userGetColCount(){
    return Math.max(gColumnCount - 1, 0);
}
function _newFunction(){
    if( ! FixArgsAllStrings(3))
        return gRunTimeError;
    var Z;
    var Y = arguments[0];
    var X = arguments[1].split(",");
    var W = "";
    var V = /^\s*(\S+)\s*$/;
    for(Z = 0; Z < X.length; Z ++ ){
        var U = X[Z].match(V);
        if(U)
            W = W + "'" + U[1] + "',";
    }
    if(functSymbol(Y))
        return __error(getString("strErrUserMacro"), getString("strCantOverride"));
    functionBody = "";
    for(Z = 2; Z < arguments.length; Z ++ )
        functionBody += arguments[Z] + '\n';
    var T = name2cell(gRuntime.name).cellData;
    userFunctions[Y.toLowerCase()] = null;
    gSafeEvalResult = 0;
    var S = SafeEval("gSafeEvalResult = new Function(" + W + "functionBody )");
    if( ! S && (typeof gSafeEvalResult == 'function' || typeof gSafeEvalResult == 'Function')){
        call[Y] = gSafeEvalResult;
        userFunctions[Y.toLowerCase()] = [gSafeEvalResult, gRuntime.name];
        gSafeEvalResult = 0;
        gRuntime.forceDirty = true;
        var R = "function " + Y + "(" + X.join(",") + ")";
        recoveredFunctions[Y] = "\n\n" + R + "\n{\n" + functionBody + "\n}\n";
        return R;
    }
    else{
        gSafeEvalResult = 0;
        return __error(getString("strErrJavascript"), getString("strMacroInvalidSyntaxCmp", kDefaultLocale, S));
    }
}
function __error(Z, Y){
    var X = ChkArgsForError(arguments);
    if(X)
        return X;
    var W = new Object();
    W.error = Z;
    W.tooltip = Y;
    return W;
}
function __image(Z, Y){
    var X = ChkArgsForError(arguments);
    if(X)
        return X;
    var W = name2cell(Z);
    if(W){
        W.cellData.m_backgroundImage = Y;
        setBackgroundImage(W, Y);
    }
    return "";
}
function executeLink(Z){
    window.frames.bugFrame.location = Z;
    window.event.cancelBubble = true;
    return false;
}
function __link(Z, Y){
    if( ! Z)
        return __error(getString("strErrLink"), getString("strEmptyLink"));
    if( ! FixArgsAllStrings(1, 2))
        return gRunTimeError;
    var X = Z.match(/^\<A HREF=\"([^"]*)\".*\>.*\<\/A\>$/i);
    if(X)
        Z = X[1];
    if(Y == null)
        Y = Z + "";
    var W = /^(http:\/\/|https:\/\/|ftp:\/\/|mailto:|news:)/i;
    var V;
    if( ! Z.match(W)){
        if(Z.match(/\@/)){
            Z = "mailto:" + Z;
            V = "_self";
        }
        else{
            Z = "http://" + Z;
            V = "_blank";
        }
    }
    else{
        V = Z.match(/^mailto:/i) ? "_self" : "_blank";
    }
    var U = 'link( \'' + Z + '\', \'' + Y + '\' )';
    if(V == "_self"){
        return('<A HREF="' + Z + '" onclick="return executeLink(\'' + Z + '\')" title="' + U + '">' + Y + '</A>');
    }
    else{
        return('<A HREF="' + Z + '" TARGET="' + V + '" title="' + U + '">' + Y + '</A>');
    }
}
function spreadsheetCallback(Z){
    var Y = gCellDataArray[Z];
    if(Y && --Y.resourceCount <= 0)
        dirtyCell(Y.m_div);
}
function runtimeResource(Z){
    var Y,
    X;
    if(gRuntime.callback != null){
        Y = gRuntime.name;
        X = gRuntime.callback;
    }
    else{
        Y = name2cell(gRuntime.name).cellData.m_abstractId;
        X = spreadsheetCallback;
    }
    var W = getResource(Z, Y, X);
    if(W.error != null) ++ gRuntime.resources;
    return W;
}
function __quote(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z = ChkArgsForError(arguments);
    if(Z)
        return Z;
    if( ! FixArgsAllStrings(1, 2))
        return gRunTimeError;
    var Y = "/quote?symbol=" + escape(arguments[0]);
    var X = runtimeResource(Y);
    if(X.error)
        return X.error;
    X = X.data;
    var W = 1;
    if(arguments.length > 1){
        switch(arguments[1]){
            case "symbol" : 
                W = 0;
                break;
            case "price" : 
                W = 1;
                break;
            case "date" : 
                W = 2;
                break;
            case "time" : 
                W = 3;
                break;
            case "change" : 
                W = 4;
                break;
            case "open" : 
                W = 5;
                break;
            case "high" : 
                W = 6;
                break;
            case "low" : 
                W = 7;
                break;
            case "volume" : 
                W = 8;
                break;
            case "name" : 
                W = 9;
                break;
            default : 
                return __error("#QUOTE!", getString("strUnknownParam"));
        }
    }
    var V = X.split(",");
    if(V.length != 10)
        return __error("#QUOTE!", getString("strQuoteNotAvail"));
    var U = V[W];
    if((U.length > 1) && (U.charAt(0) == '"') && (U.charAt(U.length - 1) == '"'))
        U = U.substring(1, U.length - 1);
    else
        U = parseFloat(U);
    return U;
}
function __currency(Z, Y, X, W){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var V = ChkArgsForError(arguments);
    if(V)
        return V;
    if( ! X)
        X = __today();
    if( ! W)
        W = "bid";
    X = GetDateArg(X);
    if(X ==- 1)
        return __error(getString("strErrDate"), getString("strCurrencyValidDate"));
    if( ! (typeof Z == 'string' && typeof Y == 'string' && typeof W == 'string'))
        return __error("#CURRENCY!", getString("strBadParameters"));
    var U = "/currency?symbol1=" + escape(Z) + "&symbol2=" + escape(Y) + "&date=" + escape(X);
    var T = runtimeResource(U);
    if(T.error)
        return T.error;
    T = T.data;
    var S = 1;
    if(W){
        switch(W){
            case "date" : 
                S = 1;
                break;
            case "bid" : 
                S = 2;
                break;
            case "ask" : 
                S = 3;
                break;
            case "min_bid" : 
                S = 4;
                break;
            case "min_ask" : 
                S = 5;
                break;
            case "max_bid" : 
                S = 6;
                break;
            case "max_ask" : 
                S = 7;
                break;
            case "fractile_low_bid" : 
                S = 8;
                break;
            case "fractile_low_ask" : 
                S = 9;
                break;
            case "fractile_high_bid" : 
                S = 10;
                break;
            case "fractile_high_ask" : 
                S = 11;
                break;
            case "num_ticks" : 
                S = 12;
                break;
            default : 
                return __error("#CURRENCY!", getString("strUnknownCurrencyCmp", kDefaultLocale, W));
        }
    }
    var R = T.split("|");
    if(R.length != 13)
        return __error("#CURRENCY!", getString("strCurrencyNotAvailCmp", kDefaultLocale, R.length));
    var Q = R[S];
    if(Q == 'na'){
        return "not available";
    }
    if(W == "date")
        Q = Q;
    else if((Q.length > 1) && (Q.charAt(0) == '"') && (Q.charAt(Q.length - 1) == '"'))
        Q = Q.substring(1, Q.length - 1);
    else
        Q = parseFloat(Q);
    return Q;
}
function __query(Z){
    var Y = ChkArgsForError(arguments);
    if(Y)
        return Y;
    var X = "/database?sql=" + escape(Z);
    var W = runtimeResource(X);
    if(W.error)
        return W.error;
    W = W.data;
    var V = W.split("&");
    var U = new Array;
    for(var T = 0; T < V.length; T ++ ){
        var S = V[T].split('=');
        U = U.concat(unescape(S[0]), unescape(S[1]));
    }
    return U;
}
function __testerDonVail(Z){
    return new Array('pickle', '1', 'baker', '2', 'charlie', '3');
}
var appCacheByMbr = new Object();
var appCacheById = new Object();
var appCache_segSize = 10;
function AppCache_AddIds(Z){
    var Y = gIsMatterhorn ? '/matterhorn/scell.jsp' : '/cell';
    Y += '?fun=slist';
    Y += '&mn=' + escape(Z);
    var X = runtimeResource(Y);
    if(X.error){
        return X;
    }
    var W = new Object();
    for(var V = 0; V < X.data.length; V ++ ){
        var U = X.data[V];
        var T = appCacheById[U.appId];
        if(T){
            T.fileDescription = U.fileDescription;
            W[U.appId] = T;
        }
        else{
            appCacheById[U.appId] = U;
        }
        W[U.fileDescription.toUpperCase()] = U;
    }
    var S = new Object();
    S.apps = W;
    S.date = new Date();
    appCacheByMbr[Z] = S;
    return S;
}
function AppCache_AddCells(Z, Y, X){
    var W = gIsMatterhorn ? '/matterhorn/scell.jsp' : '/cell';
    W += '?fun=sget';
    W += '&id=' + escape(Z.appId);
    W += '&row=' + escape(Y);
    W += '&col=' + escape(X);
    W += '&row2=' + escape(Y + appCache_segSize - 1);
    W += '&col2=' + escape(X + appCache_segSize - 1);
    var V = runtimeResource(W);
    if(V.error)
        return V;
    if( ! Z.cells)
        Z.cells = new Object();
    Z.cells['r' + Y.toString() + 'c' + X.toString()] = V.data;
    return V.data;
}
function AppCache_FindAppList(Z){
    var Y = Z.toUpperCase();
    var X = appCacheByMbr[Y];
    if( ! X){
        X = AppCache_AddIds(Y);
        if( ! X || X.error)
            return X;
    }
    return X.apps;
}
function AppCache_FindAppId(Z, Y){
    var X = AppCache_FindAppList(Y);
    if( ! X || X.error)
        return X;
    var W = X[Z.toUpperCase()];
    if(W)
        return W.appId;
    else
        return {
        error : 
        {
            error : getString("strErrLiveData"),
            tooltip : getString("strFileNotFoundCmp", kDefaultLocale, Z, Y)
        }
    };
}
function AppCache_ComputeSectionRowCol(Z, Y){
    var X = Math.floor((Z - 1) / appCache_segSize) * appCache_segSize + 1;
    var W = Math.floor((Y - 1) / appCache_segSize) * appCache_segSize + 1;
    return[X, W, 'r' + X.toString() + 'c' + W.toString()];
}
function AppCache_FindCellByName(Z, Y, X, W){
    var V = AppCache_FindAppList(Y);
    if( ! V || V.error)
        return V;
    var U = V[Z.toUpperCase()];
    if(U){
        var T = AppCache_ComputeSectionRowCol(X, W);
        var S = T[0];
        var R = T[1];
        var Q = T[2];
        var P;
        if( ! V.cells ||! (P = V.cells[Q])){
            P = AppCache_AddCells(U, S, R);
            if(P.error)
                return P;
        }
        var O = P[X.toString() + ':' + W.toString()];
        return O;
    }
    else
        return {
        error : 
        {
            error : getString("strErrLiveData"),
            tooltip : getString("strFileNotFoundCmp", kDefaultLocale, Z, Y)
        }
    };
}
function AppCache_FindCell(Z, Y, X){
    var W = appCacheById[Z];
    if( ! W){
        W = 
        {
            appId : Z
        };
        appCacheById[W.appId] = W;
    }
    var V = AppCache_ComputeSectionRowCol(Y, X);
    var U = V[0];
    var T = V[1];
    var S = V[2];
    var R;
    if( ! W.cells ||! (R = W.cells[S])){
        R = AppCache_AddCells(W, U, T);
        if(R.error)
            return R;
    }
    var Q = R['r' + Y.toString() + 'c' + X.toString()];
    return Q;
}
function compareApp(Z, Y){
    if(Z.fileDescription.toUpperCase() < Y.fileDescription.toUpperCase())
        return - 1;
    else if(Z.fileDescription.toUpperCase() > Y.fileDescription.toUpperCase())
        return 1;
    else
        return 0;
}
function __slist(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z = ChkArgsForError(arguments);
    if(Z)
        return Z;
    if( ! FixArgsAllStrings(1, 1))
        return __error("#SLIST!", getString("strNoMemberName"));
    var Y = arguments[0];
    if(Y.error)
        return Y;
    var X = AppCache_FindAppList(Y);
    if(X.error)
        return X.error;
    else{
        var W = new Array();
        var V = 0;
        for(var U in X){
            W[V ++ ] = X[U];
        }
        W.sort(compareApp);
        var T = new Array();
        for(V = 0; V < W.length; V ++ ){
            T.push(W[V].fileDescription);
            T.push(W[V].appId);
        }
        return T;
    }
}
function __sfind(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z = ChkArgsForError(arguments);
    if(Z)
        return Z;
    if( ! FixArgsAllStrings(1, 2))
        return __error("#SFIND!", getString("strExpectedFilename"));
    var Y = arguments[0].split('@');
    var X = Y[0];
    var W;
    if(Y[1])
        W = Y[1];
    else
        W = arguments[1];
    if( ! X ||! W)
        return __error("#SFIND!", getString("strExpectedFilename"));
    var V = AppCache_FindAppId(X, W);
    if(V.error)
        return V.error;
    return V;
}
function __scell(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z = ChkArgsForError(arguments);
    if(Z)
        return Z;
    var Y;
    var X,
    W;
    var V = 1;
    var U,
    T;
    if(typeof arguments[0] == 'number'){
        if(arguments.length != 3)
            return __error("#SCELL!", getString("strScellBadSyntax"));
        if(typeof arguments[1] == 'number'){
            X = arguments[0];
            W = arguments[1];
            if(typeof arguments[2] == 'string'){
                var S = arguments[2].split('!');
                S = S[0].split('@');
                U = S[0];
                T = S[1];
            }
        }
        else
            return __error("#SCELL!", getString("strColmunAfterRow"));
    }
    else{
        if( ! FixArgsAllStrings(1, 1))
            return gRunTimeError;
        var R = CellRef2RowCol(arguments[0]);
        if(R){
            X = R[0];
            W = R[1];
            U = R[2];
            T = R[3];
        }
    }
    if(X == Y || W == Y || X == Number.NaN || W == Number.NaN){
        return __error("#SCELL!", getString("strScellInvalidCellref"));
    }
    if( ! U)
        return __error("#SCELL!", getString("strScellFilenameMissing"));
    var Q;
    if( ! T){
        Q = U;
    }
    else{
        Q = AppCache_FindAppId(U, T);
        if(Q.error)
            return Q.error;
    }
    var P = AppCache_FindCell(Q, X, W);
    if( ! P)
        P = '';
    if(P.error)
        return P.error;
    return P;
}
function invokeSheetCGI(Z, Y, X, W){
    var V = gIsMatterhorn ? '/matterhorn/scell.jsp' : '/cell';
    var U;
    if( ! W){
        U = X;
        if( ! isAppId(U))
            return {
            error : __error("#" + Z + "!", Z + getString("strGeneralBadID") + U)
        };
    }
    else{
        U = AppCache_FindAppId(X, W);
        if(U.error)
            return U;
    }
    if(Z == 'sfind')
        return {
        data : U
    };
    V += "?fun=" + escape(Z);
    V += "&id=" + escape(U);
    if( ! emptyString(Y)){
        if(Y.charAt(0) != '&')
            V += '&';
        V += Y;
    }
    return runtimeResource(V);
}
function invokeSlookup(Z, Y, X, W, V, U, T, S){
    var R = '';
    R += '&lval=' + Y;
    R += '&lidx=' + X;
    R += '&oidx=' + W;
    R += '&rmin=' + V;
    R += '&rmax=' + U;
    return invokeSheetCGI(Z, R, T, S);
}
function __svlookup(Z, Y, X, W, V){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var U = ChkArgsForError(arguments);
    if(U)
        return U;
    if( ! CheckArgSize(3, null, arguments.length))
        return gRunTimeError;
    if(isNaN(arguments[2]) ||! (arguments[2]))
        return gRunTimeError = __error(getString("strErrNan"), getString("strSVLookupColumnIndex"));
    var T;
    if(W){
        T = W.split('!');
        T = T[0].split('@');
        if(T[0] && T[1]){
            W = T[0];
            V = T[1];
        }
    }
    T = CellRef2RowCol(Y);
    var S = T[1];
    var R = T[0];
    var Q = T[4];
    if(T[2])
        W = T[2];
    if(T[3])
        V = T[3];
    if( ! (S && R && Q && W))
        return __error("#SVLOOKUP!", getString("strSVLookupBadSyntax"));
    var P = invokeSlookup('svlookup', Z, S, X, R, Q, W, V);
    if(P.error)
        return P.error;
    else if(P.data)
        return P.data;
    else
        return '#ERR';
}
function __shlookup(Z, Y, X, W, V){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var U = ChkArgsForError(arguments);
    if(U)
        return U;
    if( ! CheckArgSize(3, null, arguments.length))
        return gRunTimeError;
    if(isNaN(arguments[2]) ||! (arguments[2]))
        return gRunTimeError = __error(getString("strErrNan"), getString("strRowIndexNumber"));
    var T;
    if(W){
        T = W.split('!');
        T = T[0].split('@');
        if(T[0] && T[1]){
            W = T[0];
            V = T[1];
        }
    }
    T = CellRef2RowCol(Y);
    var S = T[0];
    var R = T[1];
    var Q = T[5];
    if(T[2])
        W = T[2];
    if(T[3])
        V = T[3];
    if( ! (S && R && Q && W))
        return __error("#SHLOOKUP!", getString("strSHLookupBadSyntax"));
    var P = invokeSlookup('shlookup', Z, S, X, R, Q, W, V);
    if(P.error)
        return P.error;
    else if(P.data)
        return P.data;
    else
        return '#ERR';
}
function CheckParam(Z, Y, X, W){
    if(Y >= Z.length)
        if( ! canbeunder)
            return false;
        else
            return true;
    var V;
    if(Z[Y] == null || Z[Y] == V)
        return W;
    if(typeof Z[Y] != X)
        return false;
    return true;
}
function InvokeEDGAR(Z, Y){
    var X = "/edgar?func=" + Z;
    if( ! emptyString(Y))
        X += "&" + escape(Y);
    var W = runtimeResource(X);
    if(W.error)
        return W.error;
    W = W.data;
    return W;
}
function __edgarsearch(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z;
    var Y;
    var X;
    var W;
    var V = ChkArgsForError(arguments);
    if(V)
        return V;
    if( ! CheckParam(arguments, 0, 'string', false))
        return __error("#EDGAR", "invalid name parameter");
    if(arguments[0] != null && arguments[0] != Z)
        Y = arguments[0];
    else
        Y = '';
    if( ! CheckParam(arguments, 1, 'number', true))
        return __error("#EDGAR", "invalid dateBeg parameter");
    if(arguments[1] != null && arguments[1] != Z)
        X = GetDateArg(arguments[1]);
    else
        X = '';
    if( ! CheckParam(arguments, 2, 'number', true))
        return __error("#EDGAR", "invalid dateEnd parameter");
    if(arguments[2] != null && arguments[2] != Z)
        W = GetDateArg(arguments[2]);
    else
        W = '';
    var U;
    U = "name=" + Y;
    U += "&beg=" + X;
    U += "&end=" + W;
    var T = InvokeEDGAR('search', U);
    if(typeof T == 'string')
        return T.split('|');
    else
        return T;
}
function __edgarsearchex(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    var Z = ChkArgsForError(arguments);
    if(Z)
        return Z;
    var Y = arguments[0];
    if( ! CheckParam(arguments, 0, 'string', false) || (Y != 'NameSubstring' && Y != 'NameExact' && Y != 'Ticker' && Y != 'TickerExchange'))
        return __error("#EDGARSearch", "incorrect SearchType");
    var X = arguments[1];
    if( ! CheckParam(arguments, 1, 'string', true))
        return __error("#EDGARSearch", "incorrect SearchString");
    var W = arguments[2];
    if( ! CheckParam(arguments, 2, 'string', true))
        return __error("#EDGARSearch", "incorrect fillingType");
    var V = 'arguments:' + arguments.length + "\n";
    for(var U = 0; U < arguments.length; U ++ ){
        V += "" + U + "[type=" + typeof arguments[U] + " val=" + arguments[U] + "]\n";
    }
    return new Array(V, '0', 'filing 1', '12234-2-3', 'filing 3', '12234-2-5', 'filing 3', '12234-2-6');
}
function __edgarcontents(){
    if(gIsMatterhorn)
        return __error(getString("strErrUnsupported"), getString("strNotSupported"));
    if( ! FixArgsAllStrings(1, 1))
        return gRunTimeError;
    if(emptyString(arguments[0]))
        return __error("#EDGAR", "empty filing ID");
    var Z = "&id=" + arguments[0];
    var Y = InvokeEDGAR('contents', Z);
    return Y;
}
function __blank(){
    return '';
}
function __pmt(Z, Y, X){
    if( ! FixArgsAllNumbers(3, 3))
        return gRunTimeError;
    return(( - X * Z) / (1 - 1 / Math.pow((1 + Z), Y)));
}
function __pv(Z, Y, X){
    if( ! FixArgsAllNumbers(3, 3))
        return gRunTimeError;
    return(( - X / Z) * (1 - (1 / Math.pow((1 + Z), Y))));
}
function __npv(){
    if( ! FixArgsAllNumbers(2))
        return gRunTimeError;
    var Z = arguments[0];
    var Y = 0;
    for(var X = 1; X < arguments.length; X ++ ){
        Y += (arguments[X] / Math.pow((1 + Z), X))
    }
    return Y;
}
function __fv(Z, Y, X, W){
    if( ! FixArgsAllNumbers(3, 4))
        return gRunTimeError;
    if(arguments.length == 3)
        W = 0;
    return(( - X / Z) * (Math.pow((1 + Z), Y) - 1));
}
function __nper(Z, Y, X){
    if( ! FixArgsAllNumbers(3, 3))
        return gRunTimeError;
    return( - 1 * (Math.log(1 + ((X * Z) / Y)) / Math.log(1 + Z)));
}
function __ppmt(Z, Y, X, W){
    if( ! FixArgsAllNumbers(4, 4))
        return gRunTimeError;
    if((1 - (Math.pow(1 / (1 + Z), X))) == 0)
        return __error(getString("strErrNum"), getString("strBadParameters"));
    return((( - W * Z) / (1 - (Math.pow(1 / (1 + Z), X)))) * (Math.pow(1 / (1 + Z), X - Y + 1)));
}
function __ipmt(Z, Y, X, W){
    if( ! FixArgsAllNumbers(4, 4))
        return gRunTimeError;
    return(( - W * Z) * (1 - Math.pow(1 / (1 + Z), X - Y + 1)) / (1 - Math.pow(1 / (1 + Z), X)));
}
function __vlookup(Z, Y, X, W){
    var V = ChkArgsForError(arguments);
    if(V)
        return V;
    if(isNaN(arguments[2]) || (arguments[2] == null))
        return gRunTimeError = __error(getString("strErrNan"), getString("strParameterNumberOnly"));
    if( ! CheckArgSize(4, null, arguments.length))
        return gRunTimeError;
    var U = Y.split(':');
    if(U.length == 1)
        return __error(getString("strErrRange"), getString("strRangeNotSelected"));
    var T = ColumnLetterToColumnIndex(U[0].match(/[a-zA-Z]+/)[0].toUpperCase());
    var S = ColumnLetterToColumnIndex(U[1].match(/[a-zA-Z]+/)[0].toUpperCase());
    var R = parseInt(U[0].match(/\d+/)[0]);
    var Q = parseInt(U[1].match(/\d+/)[0]);
    if(X <= 0 || X > S - T + 1)
        return __error(getString("strErrRange"), getString("strCellOutOfRange"));
    for(var P = R; P <= Q; P ++ ){
        var O = index2cell(P, T, gCurrSheetIndex);
        if(O.cellData && (((typeof O.cellData.derived != "undefined") && O.cellData.derived == Z) || ((typeof O.cellData.derived == "undefined") && (typeof O.cellData.entry != "undefined") && O.cellData.entry == Z)))
            return _cel(index2cell(P, T + X - 1, gCurrSheetIndex).m_name);
    }
    return "#N/A";
}
function __hlookup(Z, Y, X, W){
    var V = ChkArgsForError(arguments);
    if(V)
        return V;
    if(isNaN(arguments[2]) || (arguments[2] == null))
        return gRunTimeError = __error(getString("strErrNan"), getString("strParameterNumberOnly"));
    if( ! CheckArgSize(4, null, arguments.length))
        return gRunTimeError;
    var U = Y.split(':');
    if(U.length == 1)
        return __error(getString("strErrRange"), getString("strRangeNotSelected"));
    var T = parseInt(U[0].match(/\d+/)[0]);
    var S = parseInt(U[1].match(/\d+/)[0]);
    var R = ColumnLetterToColumnIndex(U[0].match(/[a-zA-Z]+/)[0].toUpperCase());
    var Q = ColumnLetterToColumnIndex(U[1].match(/[a-zA-Z]+/)[0].toUpperCase());
    if(X <= 0 || X > S - T + 1)
        return __error(getString("strErrRange"), getString("strCellOutOfRange"));
    for(var P = R; P <= Q; P ++ ){
        var O = index2cell(T, P, gCurrSheetIndex);
        if(O.cellData && (((typeof O.cellData.derived != "undefined") && O.cellData.derived == Z) || ((typeof O.cellData.derived == "undefined") && (typeof O.cellData.entry != "undefined") && O.cellData.entry == Z)))
            return _cel(index2cell(T + X - 1, P, gCurrSheetIndex).m_name);
    }
    return "#N/A";
}
function __large(){
    if( ! FixArgsNumbers(0, arguments.length - 1))
        return gRunTimeError;
    var Z = new Array();
    for(var Y = 0; Y < arguments.length - 1; Y ++ )
        Z[Y] = arguments[Y];
    Z = Z.sort(descendingSortComparator);
    return Z[arguments[arguments.length - 1] - 1];
}
function __small(){
    if( ! FixArgsNumbers(0, arguments.length - 1))
        return gRunTimeError;
    var Z = new Array();
    for(var Y = 0; Y < arguments.length - 1; Y ++ )
        Z[Y] = arguments[Y];
    Z = Z.sort(ascendingSortComparator);
    return Z[arguments[arguments.length - 1] - 1];
}
function ascendingSortComparator(Z, Y){
    return Z - Y;
}
function descendingSortComparator(Z, Y){
    return Y - Z;
}
function __array(){
    var Z = new Array();
    for(var Y = 0; Y < arguments.length; Y ++ )
        Z[Y] = arguments[Y];
    return Z;
}
function __slice(Z, Y, X){
    var W = ChkArgsForError(arguments);
    if(W)
        return W;
    if(typeof Z != "object"){
        var V = new Array();
        V[0] = Z;
        Z = V;
    }
    if(Z.constructor != Array)
        return __error(getString("strErrArray"), getString("strSliceNoArray"));
    var U;
    if(X == null)
        U = Z.slice(Y);
    else
        U = Z.slice(Y, X);
    if(U.length <= 1)
        return U[0];
    else
        return U;
}
function __button(Z, Y, X){
    var W = safeName2cell(Z);
    if( ! W){
        return;
    }
    else{
        var V = W.cellData.dataObject;
        if( ! V || (V.constructor != ButtonCellData)){
            V = new ButtonCellData(W, Z, Y, X, ButtonCellData.prototype.slice(arguments, 3));
            W.cellData.dataObject = V;
        }
        else{
            V.setProperties(W, Z, Y, X, V.slice(arguments, 3));
        }
        var U = V.getInnerHtml();
        if(V.error){
            return V.error;
        }
        else{
            return;
        }
    }
}
function execButtonCmd(Z){
    var Y = new Array();
    var X = 1;
    for(i = X; i < arguments.length; i ++ )
        Y[i - X] = arguments[i];
    gUserFuncArgs = Y;
    SafeEvalUserFunc(Z);
}
function __menu(Z, Y){
    var X = new Array();
    var W,
    V,
    U,
    T;
    var S = null;
    var R = null;
    var Q = new Array;
    for(W = 1; W < arguments.length; W ++ ){
        Y = arguments[W];
        if(Y && typeof Y == "object" && Y.constructor == Array){
            for(V = 0; V < Y.length; V ++ ){
                Q[Q.length] = Y[V];
            }
        }
        else
            Q[Q.length] = Y;
    }
    Q = __menu_fixupArgs(Q);
    var P = name2cell(arguments[0]);
    if(P == null)
        return "";
    for(W = 0; W < Q.length; W += 2){
        U = Q[W];
        T = Q[W + 1];
        if(U && typeof U == "object" && U.error){
            U = U.error;
        }
        T = (typeof(T) == "string" && T == "") ? U : T;
        X = X.concat(U, T);
        if(P.cellData.m_cellGUI == null){
            if(U == P.cellData.i_nr){
                S = W / 2;
                R = P.cellData.i_nr;
            }
        }
    }
    if(P.cellData.m_cellGUI){
        S = P.cellData.m_cellGUI.setting;
        R = P.cellData.m_cellGUI.label;
    }
    var O = "[" + getString("strLoadingSmall") + "]";
    var N = (Q[0] != null && typeof Q[0] == "object" && Q[0].error) ? Q[0].error : null;
    P.cellData.m_cellGUI = new Object();
    P.cellData.m_cellGUI.type = "menu";
    P.cellData.m_cellGUI.setting = ((N == O) || (S && ((X[S * 2] == R) || (X[S * 2] == "[loading]")))) ? S : 0;
    P.cellData.m_cellGUI.data = X;
    var M = P.cellData.m_cellGUI.data[P.cellData.m_cellGUI.setting * 2];
    P.cellData.m_cellGUI.label = (M && (M != O)) ? M : R;
    var L = new Object();
    var K = P.cellData.m_cellGUI.setting * 2;
    L.menuLabel = N ? O : P.cellData.m_cellGUI.data[K];
    L.menuValue = N ? getString("strPleaseWaitResource") : P.cellData.m_cellGUI.data[K + 1];
    return L;
}
function __menu_fixupArgs(Z){
    for(i = 0; i < Z.length; i ++ ){
        if( ! (i % 2) && Z[i] == "")
            Z[i] = " ";
    }
    return Z;
}
function __cellref(Z){
    return OldToNewStyle(Z);
}
function popupItemSelected(){
    var Z = kTopContext.event.srcElement;
    var Y = (is.nav) ? gPopupCell : getExtra(getParent(Z), "popupCell");
    var X = Y.cellData.m_cellGUI.setting;
    Y.cellData.m_cellGUI.setting = (is.nav) ? parseInt(Z.id.substr(1, Z.id.length)) : parseInt(Z.id);
    Y.cellData.m_cellGUI.label = Y.cellData.m_cellGUI.data[Y.cellData.m_cellGUI.setting * 2];
    if(X != Y.cellData.m_cellGUI.setting){
        gSpreadsheetDirty = true;
    }
    var W = new Object();
    var V = Y.cellData.m_cellGUI.setting * 2;
    W.menuLabel = Y.cellData.m_cellGUI.data[V];
    W.menuValue = Y.cellData.m_cellGUI.data[V + 1];
    pulseCell(Y, null, W);
}
function _concat(){
    if( ! FixArgsAllStrings(1))
        return gRunTimeError;
    var Z = "";
    for(var Y = 0; Y < arguments.length; Y ++ )
        Z += arguments[Y];
    return Z;
}
function _left(Z, Y){
    var X = ChkArgsForError(arguments);
    if(X)
        return X;
    if(isNaN(Y) || (Y == null))
        return gRunTimeError = __error(getString("strErrNan"), getString("strSecondParamNumber"));
    var W = new String(Z);
    return W.slice(0, Y);
}
function _right(Z, Y){
    var X = ChkArgsForError(arguments);
    if(X)
        return X;
    if(isNaN(Y) || (Y == null))
        return gRunTimeError = __error(getString("strErrNan"), getString("strSecondParamNumber"));
    var W = new String(Z);
    return W.slice(W.length - Y);
}
function _nop(Z){
    return Z;
}
function _lit(Z){
    return Z;
}
function _and(Z, Y){
    return 1;
}
function _eor(Z, Y){
    return 1;
}
function __false(){
    return 0;
}
function __true(){
    return 1;
}
function __override(Z){
    var Y = null;
    if(gRuntime.name != null &&! gRuntime.ignoreOverride)
        Y = name2cell(gRuntime.name).cellData;
    else
        return Z;
    var X = getCellOverride(Y);
    return X != null ? X : Z;
}
var gDataSources = [];
var gResultSets = [];
function addDataSources(Z){
    for(var Y = 0; Y < Z.length; Y ++ )
        if(typeof Z[Y] == "object" && Z[Y].id)
            gDataSources[gDataSources.length] = Z[Y];
}
function addResultSets(Z){
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y];
        if(typeof X == "object" && X.id && typeof X.data == "object" && typeof X.rowAxis == "object" && typeof X.columnAxis == "object")
            gResultSets[gResultSets.length] = X;
    }
}
function updateResultSets(Z){
    for(var Y = 0; Y < Z.length; Y ++ ){
        var X = Z[Y];
        if(typeof X == "object" && X.id && typeof X.data == "object" && typeof X.rowAxis == "object" && typeof X.columnAxis == "object"){
            var W = false;
            for(var V = 0; V < gResultSets.length; V ++ )
                if(gResultSets[V].id == X.id){
                    gResultSets[V] = X;
                W = true;
                break;
            }
            if( ! W)
                gResultSets[gResultSets.length] = X;
        }
    }
    DirtyFormulaCells();
}
function __rsheader(Z, Y, X, W){
    if( ! CheckArgSize(4, null, arguments.length))
        return gRunTimeError;
    var V = ChkArgsForError(arguments);
    if(V)
        return V;
    var U = rsGetResultSet(Z);
    if(__iserror(U))
        return U;
    var T = rsGetAxis(U, Y);
    if(__iserror(T))
        return T;
    var S = rsGetTuple(T, X);
    if(__iserror(S))
        return S;
    var R = rsGetMember(S, W);
    R = filterCellValue(R);
    return R;
}
function __rsdata(Z, Y, X){
    if( ! CheckArgSize(3, null, arguments.length))
        return gRunTimeError;
    var W = ChkArgsForError(arguments);
    if(W)
        return W;
    var V = rsGetResultSet(Z);
    if(__iserror(V))
        return V;
    var U = V.data;
    if(U.length == 0 || U[0].length == 0)
        return __error(getString("strErrResultSet"), getString("strRSNoDataCmp", kDefaultLocale, Z));
    var T = U.length;
    var S = U[0].length;
    if( ! isInteger(Y))
        return __error(getString("strErrIndex"), getString("strRSBadRowIndexCmp", kDefaultLocale, Y));
    if( ! isInteger(X))
        return __error(getString("strErrIndex"), getString("strRSBadColumnIndexCmp", kDefaultLocale, X));
    if( ! withinRange(Y, 0, T - 1))
        return __error(getString("strErrIndex"), getString("strRSRowOutOfRangeCmp", kDefaultLocale, Y, (T - 1)));
    if( ! withinRange(X, 0, S - 1))
        return __error(getString("strErrIndex"), getString("strRSColumnOutOfRangeCmp", kDefaultLocale, X, (S - 1)));
    var R = U[Y][X];
    R = filterCellValue(R);
    return R;
}
function userGetResultSetIds(){
    var Z = [];
    for(var Y = 0; Y < gResultSets.length; Y ++ )
        Z.push(gResultSets[Y].id);
    return Z;
}
function userGetAxisDimensionCount(Z, Y){
    return rsGetAxisSizeDirect(Z, Y, 0);
}
function userGetAxisTupleCount(Z, Y){
    return rsGetAxisSizeDirect(Z, Y, 1);
}
function rsGetAxisSizeDirect(Z, Y, X){
    if( ! CheckArgSize(2, null, arguments.length))
        return gRunTimeError;
    var W = ChkArgsForError(arguments);
    if(W)
        return W;
    var V = rsGetResultSet(Z);
    if(__iserror(V))
        return V;
    var U = rsGetAxis(V, Y);
    if(__iserror(U))
        return U;
    if(X == 1)
        return rsGetAxisTupleCount(U);
    else
        return rsGetAxisDimensionCount(U);
}
function rsGetResultSet(Z){
    if(Z != null){
        Z = Z.toString().toLowerCase();
        for(var Y = 0; Y < gResultSets.length; Y ++ )
            if(gResultSets[Y].id.toLowerCase() == Z){
                if(gResultSets[Y].datasource_exists == "false"){
                    return __error(getString("strDataSource"), getString("strDSNotFoundCmp", kDefaultLocale, Z));
            }
            else{
                if(gResultSets[Y].access_type == "invalid"){
                    return __error(getString("strErrAccess"), getString("strNoAccessToRSCmp", kDefaultLocale, Z));
                }
                else{
                    return gResultSets[Y];
                }
            }
        }
    }
    return __error(getString("strErrResultSet"), getString("strRSNotFoundCmp", kDefaultLocale, Z));
}
function rsGetDataSource(Z){
    if(Z != null){
        Z = Z.toString().toLowerCase();
        for(var Y = 0; Y < gDataSources.length; Y ++ )
            if(gDataSources[Y].id.toLowerCase() == Z)
                return gDataSources[Y];
    }
    return __error(getString("strErrResultSet"), getString("strRSNotFoundCmp", kDefaultLocale, Z));
}
function rsGetAxis(Z, Y){
    var X;
    if(typeof Y == "string")
        Y = Y.toLowerCase();
    switch(Y){
        case "row" : 
        case "r" : 
        case 0 : 
            X = "rowAxis";
            break;
        case "column" : 
        case "c" : 
        case 1 : 
            X = "columnAxis";
            break;
        default : 
            return __error(getString("strErrAxis"), getString("strRSBadAxisCmp", kDefaultLocale, Y));
    }
    return Z[X];
}
function rsGetAxisDimensionCount(Z){
    return Z.length;
}
function rsGetAxisTupleCount(Z){
    if(Z.length == 0)
        return 0;
    return Z[0].length;
}
function rsGetTuple(Z, Y){
    var X = rsGetAxisTupleCount(Z);
    var W = rsGetAxisDimensionCount(Z);
    if(X == 0)
        return __error(getString("strErrAxis"), getString("strEmptyAxis"));
    if( ! isInteger(Y))
        return __error(getString("strErrIndex"), getString("strRSBadTupleIndexCmp", kDefaultLocale, Y));
    if( ! withinRange(Y, 0, X - 1))
        return __error(getString("strErrIndex"), getString("strRSTupleOutOfRangeCmp", kDefaultLocale, Y, (X - 1)));
    var V = [];
    for(var U = 0; U < W; U ++ )
        V[V.length] = Z[U][Y];
    return V;
}
function rsGetMember(Z, Y){
    var X = Z.length;
    if( ! isInteger(Y))
        return __error(getString("strErrIndex"), getString("strRSBadMemberIndexCmp", kDefaultLocale, Y));
    if( ! withinRange(Y, 0, X - 1))
        return __error(getString("strErrIndex"), getString("strRSMemberOutOfRangeCmp", kDefaultLocale, Y, (X - 1)));
    return Z[Y];
}
if(typeof JSIncludeDoneLoading != "undefined")
    JSIncludeDoneLoading();