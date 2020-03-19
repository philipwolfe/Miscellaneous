<TITLE>Record Object Example</TITLE>
<%
Dim recNode, fldNode
Set recNode= Server.CreateObject("ADODB.Record")

recNode.Open "", "URL=http://localhost/ASP Prog Ref/Chapter 28/record_vbs.asp"

Response.Write "<TABLE BORDER=1>"
For each fldNode in recNode.Fields
   Response.Write "<TR><TD>" & fldNode.Name & "</TD><TD>" & fldNode.Value & "</TD></TR>"
Next
Response.Write "</TABLE>"

recNode.Close   
Set recNode = Nothing   
%>
