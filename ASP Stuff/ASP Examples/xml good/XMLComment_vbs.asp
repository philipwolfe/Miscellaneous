
<%
  Response.ContentType = "text/xml"
  Dim xmlCatalogDocument
  Dim xmlBookElement
  Dim strAllComments
  Dim i

  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmlCatalogDocument.async = false

  ' load the xmlelement document
  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlcomments.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then
    ' the parse failed - take some corrective action
    Response.Write "<Error>Error parsing file</Error>"
  Else
    Set xmlBookElement = xmlCatalogDocument.childNodes(0)

    For i=0 To xmlBookElement.childNodes.length-1
       ' Check if this child node is a comment (COMMENT_NODE = 8)
       If xmlBookElement.childNodes(i).nodeType = 8 Then
        strAllComments = strAllComments & " " & xmlBookElement.childNodes(i).data
       End If
    Next
 
    Response.Write (strAllComments)
    xmlCatalogDocument = null
  End If

%>