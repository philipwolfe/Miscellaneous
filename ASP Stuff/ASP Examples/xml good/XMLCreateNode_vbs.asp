<%
  Response.ContentType = "text/xml"

  Dim xmlCatalogDocument
  Dim xmlBookElement
  Dim strAllComments
  Dim xmlLinkSimpleElement
  Dim i

  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmlCatalogDocument.async = false

  'load the xmlelement document
  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlcomment.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then
    ' the parse failed - take some corrective action
    Response.Write "<Error>Error parsing file</Error>"
  Else 
    Set xmlBookElement = xmlCatalogDocument.childNodes(0)

    Set xmlLinkSimpleElement = xmlCatalogDocument.createNode (1, "xlink:simple", "http:www.w3.org/1999/xlink")

    xmlBookElement.appendChild xmlLinkSimpleElement
 
    Response.Write xmlCatalogDocument.xml
    xmlCatalogDocument = null
  End If

%>