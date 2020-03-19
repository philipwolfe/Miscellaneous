<TITLE>The Properties Collection</TITLE>
<TABLE border=1><TR><TH>Name</TH><TH>Type</TH><TH>Value</TH><TH>Attributes</TH></TR>
<%
Set cmdExample = Server.CreateObject("ADODB.Command")
cmdExample.ActiveConnection = Application("dbConnection")


' Properties collection
Response.Write "<B>The Properties collection and Property object</B> <BR><BR>"

Response.Write "Props Count = " & cmdExample.Properties.Count & "<BR>"
Response.Write "Props Item(0) = " & cmdExample.Properties.Item(0).Name & "<BR><BR>"

For Each prop In cmdExample.Properties
   Response.Write "<TR>"
   Response.Write "<TD>" & prop.Name & "</TD>"
   Response.Write "<TD>" & prop.Type & "</TD>"
   Response.Write "<TD>" & prop.Value & "</TD>"
   Response.Write "<TD>" & prop.Attributes & "</TD>"
  Response.Write "</TR>"
Next
Response.Write "</TABLE>"
%>