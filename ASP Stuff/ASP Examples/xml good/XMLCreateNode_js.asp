<%@ LANGUAGE="JScript" >
<%
  Response.ContentType = "text/xml";

  var xmlCatalogDocument;
  var xmlBookElement;
  var strAllComments;
  var xmlLinkSimpleElement;
  var i;

  xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM");

  //Set to synchronous loading
  xmlCatalogDocument.async = false;

  //load the xmlelement document
  xmlCatalogDocument.load ("c:/ASP Prog Ref/Chapter 35/xml/xmlcomment.xml");

  if (xmlCatalogDocument.parseError.errorCode != 0) {
    //  the parse failed - take some corrective action
    Response.Write ("<Error>Error parsing file</Error>");
  } else {
    xmlBookElement = xmlCatalogDocument.childNodes(0);

    xmlLinkSimpleElement = xmlCatalogDocument.createNode (1, "xlink:simple", "http:www.w3.org/1999/xlink");

    xmlBookElement.appendChild (xmlLinkSimpleElement);
 
    Response.Write (xmlCatalogDocument.xml);
    xmlCatalogDocument = null;
  } // end if else

%>