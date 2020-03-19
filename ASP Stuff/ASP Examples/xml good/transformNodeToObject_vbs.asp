<%
  Response.ContentType = "text/html"

  Dim xmlCatalogDocument
  Dim xslDocument
  Dim xmlNewDocument

  Set xmlNewDocument = Server.CreateObject("Microsoft.XMLDOM")
  Set xmlCatalogDocument = Server.CreateObject("Microsoft.XMLDOM")
  Set xslDocument = Server.CreateObject("Microsoft.XMLDOM")

  xmlCatalogDocument.async=false
  xslDocument.async=false

  xmlCatalogDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml"

  If xmlCatalogDocument.parseError.errorCode <> 0 Then
    ' the parse failed - take some corrective action
    Response.Write "<Error>Error parsing file</Error>"
  Else 
    xslDocument.load "c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xsl"
    If xslDocument.parseError.errorCode <> 0 Then
      ' the parse failed - take some corrective action
      Response.Write "<Error>Error parsing file</Error>"
    Else
      xmlCatalogDocument.transformNodeToObject xslDocument.documentElement, xmlNewDocument
      Response.Write xmlNewDocument.xml
    End If
  End If


%>