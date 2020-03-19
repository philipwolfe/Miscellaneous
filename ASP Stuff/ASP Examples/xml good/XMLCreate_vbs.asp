<%
Response.ContentType = "text/xml"

'Create the object
Dim xmlCatalogDocument
Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

Dim xmlelement
Set xmlelement = xmlCatalogDocument.createElement("Book")
xmlCatalogDocument.appendChild(xmlelement)

Dim xmltext
xmltext = "<?mxl version='1.0' ?>"
xmltext = xmltext & "<Book>"
xmltext = xmltext & "<Author>"
xmltext = xmltext & "Kevin Williams"
xmltext = xmltext & "</Author>"
xmltext = xmltext & "</Book>"

xmlCatalogDocument.loadXML(xmltext)

If xmlCatalogDocument.parseError.errorCode <> 0 Then
  ' the parse failed - we must not have created it correctly
  Response.Write "Error"
Else
  ' the parse succeeded - continue normally
  Response.Write xmlCatalogDocument.xml
End If

%>
