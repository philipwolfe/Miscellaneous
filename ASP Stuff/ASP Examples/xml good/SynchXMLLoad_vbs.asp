<html><head><title>Synchronous load</title><head>
<body>
<%
'Create the object
Dim xmlCatalogDocument
Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

'Set to synchronous loading
xmlCatalogDocument.async = false

'load the Books document
xmlCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/books.xml")

If xmlCatalogDocument.parseError.errorCode <> 0 Then
  ' the parse failed - take some corrective action
  Response.Write xmlCatalogDocument.parseError.description
Else 
  ' the parse succeeded - continue normally
  Response.Write "No errors parsing document"
End If
%>