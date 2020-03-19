<%@ LANGUAGE="JScript" %>
<%
//------------------------------------------------------------------------------------
//--This next section is a repeat of XMLAttribute_js.asp -----------------------------

  Response.ContentType = "text/xml";
  //Create the object
  var XMlCatalogDocument = Server.CreateObject('Microsoft.XMLDOM');

  //Set to synchronous loading
  XMlCatalogDocument.async = false;

  //load the Books document
  XMlCatalogDocument.load('c:/ASP Prog Ref/Chapter 35/xml/Books.xml');

  if (XMlCatalogDocument.parseError.errorCode != 0) {
    // the parse failed - take some corrective action
    Response.Write("<?xml version='1.0' ?><Error>Error parsing file</Error>");
  } else {
    // the parse succeeded - continue normally

    xmlNodeList = XMlCatalogDocument.childNodes;		// This gives us Catalog
    xmlBookList = xmlNodeList.item(0).childNodes;	// This is a list of the books
    xmlBookElement = xmlBookList.item(0);

//--End of repeated section------------------------------------------------------------>
//------------------------------------------------------------------------------------->

  // JScript
  // get the first element in the book element - this will be "Chapter 1"
  var xmlFirstElement;
  xmlFirstElement = xmlBookElement.firstChild;
  //remove it - this leaves Chapter 2
  xmlBookElement.removeChild (xmlFirstElement);

  Response.Write (XMlCatalogDocument.xml);

  }
%>