<%@ LANGUAGE="JScript" %>
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

    xmlNodeList = xmlCatalogDocument.childNodes;		// This gives us Catalog
    xmlBookList = xmlNodeList.item(0).childNodes;	// This is a list of the books

// This line of code extracts the first book (item(0)) and gets the Author attribute
    xmlAuthorAttribute = xmlBookList.item(0).getAttributeNode("Author");

  }
  Response.Write (xmlAuthorAttribute.text);

%>