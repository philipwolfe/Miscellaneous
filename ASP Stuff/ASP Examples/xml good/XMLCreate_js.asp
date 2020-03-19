<%@ LANGUAGE="JScript" %>
<%
//Create the object
var xmlCatalogDocument = Server.CreateObject('Microsoft.XMLDOM');

var xmlelement = xmlCatalogDocument.createElement('Book');
xmlCatalogDocument.appendChild(xmlelement);

xmltext = "<?mxl version='1.0' ?>";
xmltext = xmltext + "<Book>";
xmltext = xmltext + "<Author>";
xmltext = xmltext + "Kevin Williams";
xmltext = xmltext + "</Author>";
xmltext = xmltext + "</Book>";

xmlCatalogDocument.loadXML(xmltext)

if (xmlCatalogDocument.parseError.errorCode != 0) {
  // the parse failed - we must not have created it correctly
  Response.Write ("Error");
} else {
  // the parse succeeded - continue normally
  Response.ContentType = "text/xml";
  Response.Write (xmlCatalogDocument.xml);
}

%>
