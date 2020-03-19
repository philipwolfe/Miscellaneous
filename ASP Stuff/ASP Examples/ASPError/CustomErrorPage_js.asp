<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>ASP Error</TITLE>
</HEAD>
<BODY>
<%
var objASPError = Server.GetLastError();
var intNumber = objASPError.Number;
var strDesc = objASPError.Description;
var strSource = Server.HTMLEncode(objASPError.Source);
var strFile = objASPError.File;
var intLine = objASPError.Line;
var intColumn= objASPError.Column;
var strCategory = objASPError.Category;
var strASPCode = objASPError.ASPCode;
var strASPDesc = objASPError.ASPDescription;

var strMsg = "<H2>" + strCategory + " error " + intNumber + "</H2>";
strMsg += strDesc + "<BR><B>";
strMsg += strFile + "</B>";

if (intLine > 0) {
   strMsg += ", line " + intLine;
}

// If it's not a syntax error, the column will be -1
if (intColumn > 0) {
   strMsg += ", column " + intColumn;
}
strMsg += "<BR>";

// The source is only returned for compilation errors
if (strSource != "") {
   strMsg += "<BR><FONT FACE='courier'>" + strSource + "<BR>";
   for (i = 0; i < intColumn; i++) {
      strMsg += "-";
   }
   strMsg += "^</FONT><BR>";
}
strMsg += "<BR>";

// ASP-specific errors provide additional information in the
// ASPCode and ASPDescription properties
if (strASPCode != "") {
   strMsg += "ASP Error: " + strASPCode + ". " + strASPDesc;
}
Response.Write(strMsg);
delete objASPError;
%>
</BODY>
</HTML>
