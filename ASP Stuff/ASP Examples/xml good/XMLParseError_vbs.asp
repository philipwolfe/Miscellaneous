<html><head><title>Synchronous load</title><head>
<body>
<%
'Create the object
Dim xmlCatalogDocument
Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

'Set to synchronous loading
xmlCatalogDocument.async = false

'load the Books document
  xmlCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/error.xml")

Dim xmlParseError
Set xmlParseError = xmlCatalogDocument.parseError

If xmlParseError.errorCode <> 0 Then
   strError = "<H2>Error " & xmlParseError.errorCode & "</H2>"
   strError = strError & xmlParseError.reason & "<BR>"
   strError = strError & xmlParseError.url
   strError = strError & ", line " & xmlParseError.line
   strError = strError & ", position " & xmlParseError.filepos & ":<BR>"
   strError = strError & Server.HTMLEncode(xmlParseError.srcText) & "<BR>"
   Response.Write strError
Else 
  ' the parse succeeded - continue normally
  Response.Write "No errors parsing document"
End If
%>