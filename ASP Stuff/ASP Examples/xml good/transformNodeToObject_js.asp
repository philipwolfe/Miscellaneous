<%@ LANGUAGE="JScript"%>
<%
  Response.ContentType = "text/html";

  var xmlNewDocument = Server.CreateObject("Microsoft.XMLDOM");
  var xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM");
  var xslDocument = Server.CreateObject("Microsoft.XMLDOM");

  xmlCatalogDocument.async=false;
  xslDocument.async=false;

  xmlCatalogDocument.load ("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml");

  if (xmlCatalogDocument.parseError.errorCode != 0) {
    // the parse failed - take some corrective action
    Response.Write ("<Error>Error parsing file</Error>");
  } else {
    xslDocument.load ("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xsl");
    if (xslDocument.parseError.errorCode != 0) {
      // the parse failed - take some corrective action
      Response.Write ("<Error>Error parsing file</Error>");
    } else {
      xmlCatalogDocument.transformNodeToObject(xslDocument.documentElement, xmlNewDocument);
      Response.Write(xmlNewDocument.xml);
    }
  }
%>