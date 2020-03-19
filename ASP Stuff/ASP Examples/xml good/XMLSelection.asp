<%
' VBScript
Dim xmlCatalogDocument, xmlSelection
Set xmlCatalogDocument = Server.CreateObject("MSXML2.DOMDocument")
xmlCatalogDocument.async = false
xmlCatalogDocument.load("http://servername/xml/selection.xml")
Set xmlSelection = xmlCatalogDocument.selectNodes("//Section[@Author='Alex Homer']")

Dim i
For i=0 To xmlSelection.length-1
  Response.Write xmlSelection.item(i).text
Next
%>