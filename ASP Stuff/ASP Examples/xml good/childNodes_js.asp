<%@ LANGUAGE="JScript"%>
<HTML>
<%
  var xmlDocument=Server.CreateObject("Microsoft.XMLDOM");

  xmlDocument.async=false;

  xmlDocument.load("c:/ASP Prog Ref/Chapter 35/xml/books.xml");

  strXML = fnRecurse(xmlDocument, 0);

function fnRecurse(objNode, intSpaces) {
   var strXML="";

   for (var i=0; i<intSpaces; i++) {
      strXML+="&nbsp;";
   }
   strXML+=objNode.nodeName+": "+objNode.nodeValue+"<BR>";

   var intChildren=objNode.childNodes.length;

   for (var j=0; j<intChildren; j++) {
      var objChild=objNode.childNodes[j];
      strXML+=fnRecurse(objChild, intSpaces+2);
   }
   return strXML;
}
%>
<SPAN STYLE="font-family: courier"><%= strXML %></SPAN>
</HTML>
