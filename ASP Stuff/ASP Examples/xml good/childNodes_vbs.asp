<HTML>
<%
  Dim xmlDocument
  Set xmlDocument=Server.CreateObject("Microsoft.XMLDOM")

  xmlDocument.async=false

  xmlDocument.load "c:/ASP Prog Ref/Chapter 35/xml/books.xml"

  strXML = fnRecurse(xmlDocument, 0)

Function fnRecurse(objNode, intSpaces)
   Dim strXML
   strXML = ""

   For intCount=1 To intSpaces
      strXML = strXML & "&nbsp;"
   Next

   strXML = strXML & objNode.nodeName & ": " & objNode.nodeValue & "<BR>"

   Dim intChildren
   intChildren = objNode.childNodes.length

   Dim intChildCount
   For intChildCount = 0 To intChildren - 1
      Dim objChild
      Set objChild=objNode.childNodes(intChildCount)
      strXML = strXML & fnRecurse(objChild, intSpaces+2)
   Next

   fnRecurse = strXML
End Function
%>
<SPAN STYLE="font-family: courier"><%= strXML %></SPAN>
</HTML> 
