<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypleLib" FILE="C:\WinNT\System32\msxml2.dll"-->
<!-- You may need to download msxml2.dll and run it for this to work -->
<%
  Response.ContentType = "text/xml";
  strAllComments = "<?xml version='1.0' ?>";

  var xmlCatalogDocument;
  var xmlBookElement;
  var strAllComments;
  var i;

      xmlCatalogDocument= Server.CreateObject("Microsoft.XMLDOM");

  //Set to synchronous loading
  xmlCatalogDocument.async = false;

  //load the xmlelement document
  xmlCatalogDocument.load ("c:/ASP Prog Ref/Chapter 35/xml/xmlcomment.xml");

  if (xmlCatalogDocument.parseError.errorCode != 0) {
    // the parse failed - take some corrective action
    Response.Write ("<Error>Error parsing file</Error>");
  } else {
        xmlBookElement = xmlCatalogDocument.childNodes(0);

   for (i=0; i<xmlBookElement.childNodes.length; i++) {
       // Check if this child node is a comment (NODE_COMMENT = 8)
      if (xmlBookElement.childNodes(i).nodeType == 8)
        strAllComments = strAllComments + "<br> " + xmlBookElement.childNodes(i).data;
    }
 
    Response.Write (strAllComments);
    xmlCatalogDocument= null;
  } // end if

%>