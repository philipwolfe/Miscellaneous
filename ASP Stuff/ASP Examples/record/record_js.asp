<%@ LANGUAGE="JScript" %>
<TITLE>Record Object Example</TITLE>
<%
var recNode, fldNode;
recNode= Server.CreateObject("ADODB.Record");

recNode.Open("", "URL=http://localhost/ASP Prog Ref/record_js.asp");

Response.Write("<TABLE BORDER=1>");
for (i=0; i<recNode.Fields.Count; i++) {
   fldNode=recNode.Fields(i);
   Response.Write("<TR><TD>" + fldNode.Name + "</TD><TD>" + fldNode.Value + "</TD></TR>");
}
Response.Write("</TABLE>");

recNode.Close();
delete recNode;
%>
