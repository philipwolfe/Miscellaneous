<%@ LANGUAGE="JScript" %>
<%
//-------------------------------------------------------------------------------------
//--This next section is a repeat of XMLAttribute_js.asp ------------------------------
//--In order to view the output you will need to look at xmlelement1.xml --------------
//--You will notive that the author for the second book is now Kevin no Alex ----------

  Response.ContentType = "text/xml";
  //Create the object
  var xmlCatalogDocument = Server.CreateObject('Microsoft.XMLDOM');

  //Set to synchronous loading
  xmlCatalogDocument.async = false;

  //load the Books document
  xmlCatalogDocument.load('c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml');

  if (xmlCatalogDocument.parseError.errorCode != 0) {
    // the parse failed - take some corrective action
    Response.Write("<?xml version='1.0' ?><Error>Error parsing file</Error>");
  } else {
    // the parse succeeded - continue normally

    xmlNodeList = xmlCatalogDocument.childNodes;		// This gives us Catalog
    xmlBookList = xmlNodeList.item(0).childNodes;	// This is a list of the books

//--End of repeated section------------------------------------------------------------
//-------------------------------------------------------------------------------------

// This line of code extracts the second book - item(1)
    xmlBookElement = xmlBookList.item(1);

   // JScript
   // get the attribute list for the Book element

    var xmlBookAttributes, xmlAuthorAttribute;
    xmlAuthorAttribute = xmlCatalogDocument.createAttribute ("Author");
    xmlAuthorAttribute .value = "Kevin Williams";
    xmlBookAttributes = xmlBookElement.attributes;

    xmlAuthorAttribute = xmlBookAttributes.setNamedItem (xmlAuthorAttribute);

    xmlCatalogDocument.save("c:/ASP Prog Ref/Chapter 35/xml/xmlelement1.xml");
  }
%>
<comment>The author value for the second book has changed from Alex Homer to Kevin Williams
View xmlelement1.xml in IE5 to see the results.</comment>