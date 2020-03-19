<TITLE>Transforming XML on the Server</TITLE>
<%
Dim objDocument
Dim objTransform
Dim strXML

Set objDocument = Server.CreateObject("MSXML2.DOMDocument")
Set objTransform = Server.CreateObject("MSXML2.DOMDocument")

objDocument.Load "c:\ASP Prog Ref\Chapter 36\catalog.xml"
objTransform.Load "c:\ASP Prog Ref\Chapter 36\sample.xsl"

strXML = objDocument.transformNode(objTransform)

Response.Write Server.HTMLEncode(strXML)
%>