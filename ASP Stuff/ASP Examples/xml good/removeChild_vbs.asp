<%
'------------------------------------------------------------------------------------
'--This next section is a repeat of XMLAttribute_js.asp -----------------------------

  Response.ContentType = "text/xml"

  'Create the object
  Dim xmlCatalogDocument
  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmlCatalogDocument.async = false

  'load the Books document
  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/Books.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then 
    ' the parse failed - take some corrective action
    Response.Write "<Error>Error parsing file</Error>"
  Else 
    ' the parse succeeded - continue normally

    Dim xmlNodeList
    Set xmlNodeList = xmlCatalogDocument.childNodes		' This gives us Catalog

    Dim xmlBookList
    Set xmlBookList = xmlNodeList.item(0).childNodes	' This is a list of the books

'--End of repeated section------------------------------------------------------------
'-------------------------------------------------------------------------------------

    Dim xmlBookElement
    Set xmlBookElement = xmlBookList.item(0)

    ' VBScript
    ' get the first element in the book element - this will be "Chapter 1"
    Dim xmlFirstElement
    Set xmlFirstElement = xmlBookElement.firstChild
    ' remove it - this leaves Chapter 2
    xmlBookElement.removeChild xmlFirstElement

    Response.Write xmlCatalogDocument.xml

  End If
%>