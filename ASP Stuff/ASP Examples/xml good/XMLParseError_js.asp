<%@ LANGUAGE="JScript" %>
<%
  Response.ContentType = "text/html";
//Create the object
var xmlCatalogDocument = Server.CreateObject('Microsoft.XMLDOM');

//Set to synchronous loading
xmlCatalogDocument.async = false;

//load the Books document
xmlCatalogDocument.load('c:/ASP Prog Ref/Chapter 35/xml/error.xml');

var xmlParseError = xmlCatalogDocument.parseError;
if (xmlParseError.errorCode != 0) {
   strError = "<H2>Error " + xmlParseError.errorCode + "</H2>";
   strError += xmlParseError.reason + "<BR>";
   strError += xmlParseError.url;
   strError += ", line " + xmlParseError.line;
   strError += ", position " + xmlParseError.filepos + ":<BR>";
   strError += Server.HTMLEncode(xmlParseError.srcText) + "<BR>";
   Response.write(strError);
}

%>