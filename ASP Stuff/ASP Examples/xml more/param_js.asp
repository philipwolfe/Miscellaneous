<%@ LANGUAGE="JScript" %>
<%
try {
strSortBy = Request.Form("sortby");

var objDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument");
objDocument.async = false;
objDocument.load("c:\\ASP Prog Ref\\Chapter 36\\catalog.xml");

var objTransform = Server.CreateObject("MSXML2.FreeThreadedDOMDocument");
objTransform.async = false;
objTransform.load("c:\\ASP Prog Ref\\Chapter 36\\param.xsl");

var objParseError = objDocument.parseError;
if (objParseError.errorCode != 0) {
   strError = "<H2>Error " + objParseError.errorCode + "</H2>";
   strError += objParseError.reason + "<BR>";
   strError += objParseError.url;
   strError += ", line " + objParseError.line;
   strError += ", position " + objParseError.filepos + ":<BR>";
   strError += Server.HTMLEncode(objParseError.srcText) + "<BR>";
   Response.write(strError);
} else {
   var objTemplate = Server.CreateObject("MSXML2.XSLTemplate");
   objTemplate.stylesheet = objTransform;
   var objProcessor = objTemplate.createProcessor();

   objProcessor.input = objDocument;
   objProcessor.output = Response;

   objProcessor.addParameter("sortBy",String(strSortBy));

   objProcessor.transform();
   }
}
catch(e) {
Response.Write(e.description);
}
%>