//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gParser=new Object();

function compiler(Z,Y,X){
	gParser.text=Z;
	gParser.refStart=null;
	gParser.refEnd=null;
	gParser.allowTrailing=X?X:false;
	gParser.lastIndex=gParser.index=0;
	gParser.count=Z.length;
	
	if(Y!=""){
		gParser.row=name2row(Y);
		gParser.column=name2column(Y);
		gParser.sheet=name2sheet(Y);
	}else{
		gParser.row=1;
		gParser.column=1;
		gParser.sheet=0;
	}
	
	gParser.delta=null;
	gParser.limit=null;
	gParser.character=' ';
	gParser.token=' ';
	gParser.space=null;
	gParser.string=null;
	gParser.depth=0;
	gParser.refer=null;
	gParser.error=null;
	gParser.dirtyOnInit=false;
	gParser.alignHint=null;
	gParser.formatHint=null;
	gParser.cellGUIinner=null;
	gParser.cellGUItype=null;
	parseChar();
	parseToken();
	gParser.canon=parseCondition();
	parseFinal();
	return gParser;
}

function formatPriority(Z){
	if(Z=="number")
		return 0;
	var Y=getFormat(Z,gAppLocale);
	if(Y!=null){
		switch(Y.type){
			case"currency":
				return 30;
				break;
			case"number":
				return 20;
				break;
			case"dateTime":
			case"longDate":
			case"shortDate":
			case"time":
				return 19;
				break;
			case"percentage":
				return 10;
				break;
		}
	}
	return 1000;
}

function setFormatHint(Z,Y){
	var X=Y?null:gParser.formatHint;
	if((Z=="general") ||(X==null)){
		gParser.formatHint=Z;
		return;
	}else if((X=="general") ||(Z==null))
		return;
	
	var W=formatPriority(X);
	var V=formatPriority(Z);
	if(W==V){if(Z>X)
		gParser.formatHint=Z;
	}else if(V>W)
		gParser.formatHint=Z;
}

function setAlignHint(Z){
	gParser.alignHint=Z;
}

function fixAlignHint(Z){
	if(gParser.formatHint!=null&&gParser.formatHint!="general")
		gParser.alignHint="right";
}

function parseCondition(){
	var Z=parseExpression();
	switch(gParser.token){
		case'=':
			Z="_eqr("+Z;
			break;
		case'<':
			Z="_ltr("+Z;
			break;
		case'>':
			Z="_gtr("+Z;
			break;
		case'n':
			Z="_ner("+Z;
			break;
		case'g':
			Z="_ger("+Z;
			break;
		case'l':
			Z="_ler("+Z;
			break;
		default:
			break;
	}
	
	switch(gParser.token){
		case'=':
		case'<':
		case'>':
		case'n':
		case'g':
		case'l':
			parseToken();
			Z=Z+","+parseExpression()+")";
			break;
		default:
			break;
	}
	return Z;
}

function parseExpression(){
	var Z=parseHighExpression();
	
	while(gParser.token=='&'){
		switch(gParser.token){
			case'&':
				Z="_concat("+Z;
				setFormatHint("general");
				setAlignHint("left");
				break;
			default:
				parseError(getString("strErrParse"),getString("strParseInternalExpression"));
				break;
		}
		parseToken();
		Z=Z+","+parseHighExpression()+")";
	}
	return Z;
}

function parseHighExpression(){
	var Z=parseTerm();
	
	while((gParser.token=='+') ||(gParser.token=='-') ||(gParser.token=='|')){
		switch(gParser.token){
			case'+':
				Z="_add("+Z;
				break;
			case'-':
				Z="_sub("+Z;
				setFormatHint("number_0");
				break;
			case'|':
				Z="_ior("+Z;
				break;
			default:
				parseError(getString("strErrParse"),getString("strParseHighExpression"));
				break;
		}
		
		parseToken();
		Z=Z+","+parseTerm()+")";
	}
	return Z;
}

function parseTerm(){
	var Z=parseHighTerm();
	
	while((gParser.token=='*') ||(gParser.token=='/')){
		switch(gParser.token){
			case'*':
				Z="_mul("+Z;
				break;
			case'/':
				Z="_div("+Z;
				break;
			default:
				parseError(getString("strErrParse"),getString("strParseInternalTerm"));
				break;
		}
		
		parseToken();
		Z=Z+","+parseHighTerm()+")";
	}
	return Z;
}

function parseHighTerm(){
	var Z=parseUnary();
	while(gParser.token=='^'){
		switch(gParser.token){
			case'^':
				Z="__pow("+Z;
				setFormatHint("number_2");
				break;
			default:
				parseError(getString("strErrParse"),getString("strParseHighTerm"));
				break;
		}
		parseToken();
		Z=Z+","+parseUnary()+")";
	}
	return Z;
}

function parseUnary(){
	if(gParser.token=='+'){
		parseToken();
		return"("+parseUnary()+")";
	}else if(gParser.token=='-'){
		parseToken();
		return"_neg("+parseUnary()+")";
	}else if(gParser.token=='!'){
		parseToken();
		return"_not("+parseUnary()+")";
	}else{
		return parseFactor();
	}
	return null;
}
	
function parseArgs(Z){var Y=new Array();parseToken();if(gParser.token=="("){gParser.depth+=1;parseToken();while(gParser.token!=")"){Y[Y.length]=parseCondition();if(Z)Z[Y.length]=gParser.index-2;if(gParser.token==",")parseToken();else if(gParser.token==")"){}else{parseError(getString("strErrList"),getString("strListComma"));break;}}gParser.depth-=1;}else{parseError(getString("strErrList"),getString("strListParen"));}return Y;}

function parseFactor(){var Z;var Y;var X;switch(gParser.token){case"symbol":;var W=gParser.string.toLowerCase();if((Y=parseItem(gParser.string)) !=null){Z=parseRange(Y);}else if((Y=constSymbol(W)) !=null){Z=Y;parseToken();setFormatHint("number");}else if(W=='if'){X=parseArgs();if(X.length==3)Z='('+X[0]+"?"+X[1]+":"+X[2]+')';else parseError("#IF!",getString("strIfThreeParams"));parseToken();}else if(userFunctions[W]){Z='__macro("'+W+'"';X=parseArgs();if(X.length>0)Z+=','+X.join(',');Z+=')';var V=GetUserFuncCell(W);if(V.length>0)referSymbol(V);parseToken();}else if((Y=functSymbol(W)) !=null){if(IsDirtyOnInit(W))gParser.dirtyOnInit=true;var U=new Array();X=parseArgs(U);if((Y=="__vlookup") ||(Y=="__hlookup")){var T=gParser.text.mappedSubstring(U[1]+1,U[2]).replace(/\t/g,"");Z=Y+'('+X[0]+',\"'+T+'\",'+X[2]+','+X[1]+')';}else if(Y=="__image"){if(X.length==1){Z=Y+'('+'"r'+gParser.row+'c'+gParser.column+'s'+gParser.sheet+'", '+X[0]+')';}else parseError("#IMAGE!",getString("strImageOneParam"));}else if(Y=="__menu"){if(X.length>=1){Z=Y+'('+'"r'+gParser.row+'c'+gParser.column+'s'+gParser.sheet+'", '+X+')';}else parseError("#MENU!",getString("strMenuOneParam"));}else if(Y=="__button"){if(X.length>=2){Z=Y+'('+'"r'+gParser.row+'c'+gParser.column+'s'+gParser.sheet+'", '+X+')';}else parseError("#BUTTON!",getString("strButtonTwoParams"));}else if(Y=="__cellref"){if(X.length>=1){var S,R;Z="";for(S=0;S<X.length;S++){R=X[S];if(typeof(R)=="undefined")continue;if(S!=0)Z+=',';Z+=R.replace(/_cel/g,"__cellref");}}else parseError("#CELLREF!",getString("strCellrefOneParam"));}else{Z=Y+'('+X.join(',')+')';}parseToken();if(functFormat(W))setFormatHint(functFormat(W),true);}else{parseError(getString("strErrParse"),getString("strParseLabelOrName"));gParser.dirtyOnInit=true;}break;case"number":Z=""+parseFloat(gParser.string);parseToken();setFormatHint("number");break;case"string":Z="'"+gParser.string+"'";setFormatHint("general");if(gParser.string.length>0)setAlignHint("left");parseToken();break;case'(':parseToken();Z=parseCondition();if(gParser.token==')')parseToken();else parseError(getString("strErrParse"),getString("strParseRightParen"));break;default:parseError(getString("strErrParse"),getString("strParseIdentifier"));break;}return Z;}

function parseAddTabs(){var Z=gParser.text;var Y=Z.mappedSubstring(gParser.refStart,gParser.refEnd);Y=Y.toUpperCase();gParser.text=Z.mappedSubstring(0,gParser.refStart)+'\t'+Y+'\t'+Z.mappedSubstring(gParser.refEnd);gParser.lastIndex+=2;gParser.index+=2;gParser.count+=2;}

function parseRange(Z){var Y;var X;parseToken();if(gParser.token==':'){parseAddTabs();parseToken();if(gParser.token!="symbol"){parseError(getString("strErrParse"),getString("strParseCellIndex"));}else if((X=parseItem(gParser.string))==null){parseError(getString("strErrParse"),getString("strParseCellIndex"));}else{Y=rangeSymbol(Z,X);parseAddTabs();parseToken();}}else{referSymbol(Z);Y="_cel(\t'"+Z+"'\t)";parseAddTabs();}return Y;}

function parseItem(Z){if(typeof(gRowCount)=="undefined")return null;var Y=null;if(Y==null)Y=plainSymbol(Z);if(Y==null)Y=indexSymbol(Z);if(Y==null)Y=labelSymbol(Z);if(Y!=null){var X=gParser.index-1;while(X<gParser.count&&gParser.text.mappedCharAt(X).search(/\s/)==0)X++;if(gParser.text.mappedCharAt(X)=="(")return null;}return Y;}

function referSymbol(Z){if(!gParser.refer)gParser.refer=new Array;var Y=parse2cell(Z);for(var X=0;X<gParser.refer.length;X++){if(gParser.refer[X]==Y)return;}gParser.refer[gParser.refer.length]=Y;}

function labelSymbol(Z){if(typeof(label2cell)=="undefined")return null;var Y=label2cell(Z);if(Y==null)return null;return Y.m_name;}

function parse2cell(Z){if(typeof(name2cell)=="undefined")return null;return name2cell(Z);}

function plainSymbol(Z){var Y=0;var X=0;var W=gCurrSheetIndex!=null?gCurrSheetIndex:0;var V=0;if(Z.mappedCharAt(V)=='$')V++;X=ColumnLetterToColumnIndex(Z.substr(V).toUpperCase());if(isUpper(Z.mappedCharAt(V)) ||isLower(Z.mappedCharAt(V)))V++;if(isUpper(Z.mappedCharAt(V)) ||isLower(Z.mappedCharAt(V)))V++;if(Z.mappedCharAt(V)=='$')V++;while(isDigit(Z.mappedCharAt(V)))Y=Y*10+(Z.mappedCharCodeAt(V++)-'0'.mappedCharCodeAt(0));if(V<Z.length)return null;if((Y<1) ||(Y>=gRowCount))return null;if((X<1) ||(X>=gColumnCount))return null;if((W<0) ||(W>=gSheetCount))return null;var U="r"+Y+"c"+X+"s"+W;if(parse2cell(U)==null)return null;return U;}

function indexSymbol(Z){var Y=null;var X=null;var W=null;var V;var U;for(var T=0;T<Z.length;){switch(Z.mappedCharAt(T++)){case'r':case'R':if(Y!=null)return null;if(Z.mappedCharAt(T)=='$')T++;V=0;U=0;while((T<Z.length) &&isDigit(Z.mappedCharAt(T))){V=V+1;U=U*10+(Z.mappedCharAt(T++)-'0');}if(V==0)return null;Y=U;break;case'c':case'C':if(X!=null)return null;if(Z.mappedCharAt(T)=='$')T++;V=0;U=0;while((T<Z.length) &&isDigit(Z.mappedCharAt(T))){V=V+1;U=U*10+(Z.mappedCharAt(T++)-'0');}if(V==0)return null;X=U;break;case's':case'S':if(W!=null)return null;if(Z.mappedCharAt(T)=='$')T++;V=0;U=0;while((T<Z.length) &&isDigit(Z.mappedCharAt(T))){V=V+1;U=U*10+(Z.mappedCharAt(T++)-'0');}if(V==0)return null;W=U;break;default:return null;}}if((typeof(autoConvert) !="undefined") &&autoConvert){if(Y==null)Y=gParser.row;if(X==null)X=gParser.column;}else{if((Y==null) ||(X==null))return null;}if(W==null)W=gParser.sheet;if((Y<1) ||(Y>=gRowCount))return null;if((X<1) ||(X>=gColumnCount))return null;if((W<0) ||(W>=gSheetCount))return null;var S="r"+Y+"c"+X+"s"+W;if(parse2cell(S)==null)return null;return S;}

function rangeSymbol(Z,Y){var X;var W=name2row(Z);var V=name2row(Y);var U=name2column(Z);var T=name2column(Y);var S=name2sheet(Z);var R=name2sheet(Y);for(var Q=min(S,R);Q<=max(S,R);Q++){for(var P=min(U,T);P<=max(U,T);P++){for(var O=min(W,V);O<=max(W,V);O++){var N=index2name(O,P,Q);referSymbol(N);if(emptyString(X))X="_cel(\t'"+N+"'\t)";else X+=",_cel(\t'"+N+"'\t)";}}}if(gParser.depth==0)return functSymbol("sum")+"("+X+")";return X;}

function parseToken(){var Z=gParser.index;gParser.lastIndex=gParser.index;while((gParser.character==' ') ||(gParser.character=='\t') ||(gParser.character=='\n') ||(gParser.character=='\r'))parseChar();gParser.space=gParser.text.mappedSubstring(Z-1,gParser.index-1);if(gParser.character==null){gParser.token=null;gParser.string=null;}else if(isDigit(gParser.character) ||(gParser.character=='.')){Z=gParser.index;while(isDigit(gParser.character))parseChar();if(gParser.character=='.'){parseChar();while(isDigit(gParser.character))parseChar();}gParser.token="number";gParser.string=gParser.text.mappedSubstring(Z-1,gParser.index-1);}else if(isAlpha(gParser.character) ||(gParser.character=='$')){Z=gParser.index;while(isAlpha(gParser.character) ||isDigit(gParser.character) ||(gParser.character=='$'))parseChar();gParser.token="symbol";gParser.string=gParser.text.mappedSubstring(Z-1,gParser.index-1);gParser.refStart=Z-1;gParser.refEnd=gParser.index-1;}else if((gParser.character=='"') ||(gParser.character=="'")){var Y=gParser.character;parseChar();Z=gParser.index;for(;gParser.character!=null;parseChar()){if(gParser.character==Y){if(nextChar()==Y){parseChar();continue;}break;}}gParser.string=gParser.text.mappedSubstring(Z-1,gParser.index-1);gParser.string=gParser.string.replace(/\\/g,"\\\\");gParser.string=gParser.string.replace(/''/g,"'");gParser.string=gParser.string.replace(/""/g,'"');gParser.string=gParser.string.replace(/'/g,"\\'");gParser.string=gParser.string.replace(/"/g,'\\"');if(gParser.character==Y){gParser.token="string";parseChar();}else{gParser.token=null;parseError(getString("strErrParse"),getString("strParseTerminator"));}}else if(gParser.character=='<'){parseChar();if(gParser.character=='>'){gParser.token='n';gParser.string='<>';parseChar();}else if(gParser.character=='='){gParser.token='l';gParser.string='<=';parseChar();}else{gParser.token='<';gParser.string='<';}}else if(gParser.character=='>'){parseChar();if(gParser.character=='<'){gParser.token='n';gParser.string='<>';parseChar();}else if(gParser.character=='='){gParser.token='g';gParser.string='>=';parseChar();}else{gParser.token='>';gParser.string='>';}}else if(gParser.character=='#'){gParser.token='n';gParser.string='<>';parseChar();}else{gParser.token=gParser.character;gParser.string=gParser.character;parseChar();}}

function parseChar(){if(gParser.index<gParser.count)gParser.character=gParser.text.mappedCharAt(gParser.index);else gParser.character=null;gParser.index+=1;}

function parseFinal(){if(!gParser.allowTrailing&&gParser.token!=null)parseError(getString("strErrParse"),getString("strParseUnexpectedSymbol"));fixAlignHint(gParser);}

function nextChar(){if(gParser.index<gParser.count)return gParser.text.mappedCharAt(gParser.index);else return null;}

function parseError(Z,Y){if(gParser.error==null){gParser.error=__error(Z,Y);gParser.force="__error(\""+Z+"\", \""+Y+"\");";}}

function isDigit(Z){if(Z==null)return false;if((Z>='0') &&(Z<='9'))return true;return false;}

function isAlpha(Z){if(Z==null)return false;if((Z>='a') &&(Z<='z'))return true;if((Z>='A') &&(Z<='Z'))return true;return false;}

function isUpper(Z){if(Z==null)return false;if((Z>='A') &&(Z<='Z'))return true;return false;}

function isLower(Z){if(Z==null)return false;if((Z>='a') &&(Z<='z'))return true;return false;}if(typeof JSIncludeDoneLoading!="undefined")JSIncludeDoneLoading();