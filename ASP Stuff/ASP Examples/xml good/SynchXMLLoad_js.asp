<%@ LANGUAGE="JScript" %>
<%
  Response.ContentType = "text/xml";
//Create the object
var xmlCatalogDocument = Server.CreateObject('Microsoft.XMLDOM');

//Set to synchronous loading
xmlCatalogDocument.async = false;

//load the Books document
xmlCatalogDocument.load('c:/ASP Prog Ref/Chapter 35/xml/Books.xml');

if (xmlCatalogDocument.parseError.errorCode != 0) {
  // the parse failed - take some corrective action
  Response.Write("<Error>Error parsing file</Error>");
} else {
  // the parse succeeded - continue normally
  Response.Write (xmlCatalogDocument.xml);
}
%>