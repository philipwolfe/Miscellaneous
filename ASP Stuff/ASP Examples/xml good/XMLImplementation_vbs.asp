<%
  Response.ContentType = "text/xml"

'Create the object
  Dim xmlCatalogDocument
  Dim xmlNodeList 
  Dim xmlBookList 
  Dim xmlBookNodeList
  Dim xmlAuthorAttribute

  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmlCatalogDocument.async = false

  'load the xmlelement document
  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then 
    ' the parse failed - take some corrective action
    Response.Write "<Error>Error parsing file</Error>"
  Else


    ' the parse succeeded - continue normally
    Dim xmlCatalogImplementation
    Set xmlCatalogImplementation = xmlCatalogDocument.implementation
    If xmlCatalogImplementation.hasFeature("MS-DOM", "2.6") Then
      Response.Write "2.6 objects, methods and properties are supported."
    Else
      Response.Write "2.6 objects, methods and properties are not supported."
    End If
  End If
%>