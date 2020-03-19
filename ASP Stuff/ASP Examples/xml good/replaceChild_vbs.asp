<%
'------------------------------------------------------------------------------------
'--This next section is a repeat of XMLAttribute_vbs.asp -----------------------------

  Response.ContentType = "text/xml"
  'Create the object
  Dim xmldocument
  Set xmldocument = Server.CreateObject("Microsoft.XMLDOM")

  'Set to synchronous loading
  xmldocument.async = false

  'load the Books document
  xmldocument.load "c:/ASP Prog Ref/Chapter 35/xml/Books.xml"

  If xmldocument.parseError.errorCode <> 0 Then
    ' the parse failed - take some corrective action
    Response.Write "<?xml version='1.0' ?><Error>Error parsing file</Error>"
  Else
    ' the parse succeeded - continue normally l20

    Set xmlBookElement = xmldocument.childNodes(1).firstChild

'--End of repeated section------------------------------------------------------------>
'------------------------------------------------------------------------------------->

  ' create a new chapter element instead of Chapter 1 l30
  Dim xmlChapterElement
  Set xmlChapterElement = xmldocument.createElement("Chapter")

  ' replace the first child node of the Book element with the new chapter element
  xmlBookElement.replaceChild xmlChapterElement, xmlBookElement.childNodes(0)

  Response.Write (xmldocument.xml)

  End If
%>