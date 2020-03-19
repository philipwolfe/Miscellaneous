<%
' -------------------------------------------------------------------------------------
'--This next section is a repeat of XMLAttribute_js.asp ------------------------------
'--In order to view the output you will need to look at xmlelement1.xml --------------
'--You will notice that the author for the second book is now Kevin and not Alex -----

  Response.ContentType = "text/xml"
  'Create the object
  Dim xmlCatalogDocument
  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmlCatalogDocument.async = false

  'load the Books document
  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then
    ' the parse failed - take some corrective action
    Response.Write "<?xml version='1.0' ?><Error>Error parsing file</Error>"
  Else
    ' the parse succeeded - continue normally
    Dim xmlNodeList
    Dim xmlBookList

    Set xmlNodeList = xmlCatalogDocument.childNodes		' This gives us Catalog
    Set xmlBookList = xmlNodeList.item(0).childNodes	' This is a list of the books

'--End of repeated section------------------------------------------------------------>
'------------------------------------------------------------------------------------->

' This line of code extracts the second book - item(1)
    Set xmlBookElement = xmlBookList.item(1)

   ' VBScript
   ' get the attribute list for the Book element

    Dim xmlBookAttributes
    Dim xmlAuthorAttribute

    Set xmlAuthorAttribute = xmlCatalogDocument.createAttribute ("Author")
    xmlAuthorAttribute.value = "Kevin Williams"
    Set xmlBookAttributes = xmlBookElement.attributes

    Set xmlAuthorAttribute = xmlBookAttributes.setNamedItem (xmlAuthorAttribute)

    xmlCatalogDocument.save "c:/ASP Prog Ref/Chapter 35/xml/xmlelement1.xml"
  End If
%>
<comment>The author value for the second book has changed from Alex Homer to Kevin Williams
View xmlelement1.xml in IE5 to see the results.</comment>