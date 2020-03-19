<%@ LANGUAGE="JScript" %>
<TITLE>Transforming XML on the Server</TITLE>
<%
var objDocument = Server.CreateObject("MSXML2.DOMDocument");
var objTransform = Server.CreateObject("MSXML2.DOMDocument");

objDocument.load("c:\\ASP Prog Ref\\Chapter 36\\catalog.xml");
objTransform.load("c:\\ASP Prog Ref\\Chapter 36\\sample.xsl");

var strXML = objDocument.transformNode(objTransform);

Response.Write(Server.HTMLEncode(strXML));
%>