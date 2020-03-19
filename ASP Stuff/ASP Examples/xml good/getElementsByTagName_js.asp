<%@ LANGUAGE="JScript" %>
<!-- This is another way of drilling down through the document as we did in XMLAttribute_js.asp -->
<%
  Response.ContentType = "text/xml";
//Create the object
var xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

//Set to synchronous loading
xmlCatalogDocument.async = false;

//load the xmlelement document
xmlCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml")

  if (xmlCatalogDocument.parseError.errorCode != 0) {
    // the parse failed - take some corrective action
    Response.Write("<Error>Error parsing file</Error>");

  } else {
    // the parse succeeded - continue normally
    var xmlBookNodeList = xmlCatalogDocument.getElementsByTagName("Book");  // This is a list of the books

    xmlAuthorAttribute = xmlBookNodeList.item(0).getAttributeNode("Author");

  }
  Response.Write (xmlAuthorAttribute.text);

%>