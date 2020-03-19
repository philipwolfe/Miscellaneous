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
    Set xmlBookNodeList = xmlCatalogDocument.getElementsByTagName("Book");  // This is a list of the books
    Set  xmlAuthorAttribute = xmlBookList.item(0).getAttributeNode("Author")

  End If

  Response.Write xmlAuthorAttribute.text

%>