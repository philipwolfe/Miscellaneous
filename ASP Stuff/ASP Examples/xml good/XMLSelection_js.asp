<%@ LANGUAGE="JScript"%>
<%
var xmlCatalogDocument = Server.CreateObject("MSXML2.DOMDocument");
xmlCatalogDocument.async = false;
xmlCatalogDocument.load('c:/ASP Prog Ref/Chapter 35/xml/selection.xml');

var xmlSelection = xmlCatalogDocument.selectNodes("//Section[@Author='Alex Homer']");

for (var i=0; i<xmlSelection.length; i++) {
  Response.Write (xmlSelection.item(i).text + "<br>");   
}
%>