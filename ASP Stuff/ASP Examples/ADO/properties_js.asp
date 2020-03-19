<%@ LANGUAGE="JScript" %>
<HTML>
<TITLE>The Properties Collection</TITLE>
<TABLE BORDER=1><TR><TH>Name</TH><TH>Type</TH><TH>Value</TH><TH>Attributes</TH></TR>
<%

// Properties collection
Response.Write('<B>The Properties collection and Property object</B> <BR><BR>');

cmdExample = Server.CreateObject("ADODB.Command");
cmdExample.ActiveConnection = Application("dbConnection");


Response.Write('Props Count = ' + cmdExample.Properties.Count + '<BR>');
Response.Write('Props Item(0) = ' + cmdExample.Properties.Item(0).Name + '<BR><BR>');

enmProp=new Enumerator(cmdExample.Properties);
while (!enmProp.atEnd()) {
   prop=enmProp.item();
   Response.Write('<TR>');
   Response.Write('<TD>' + prop.Name + '</TD>');
   Response.Write('<TD>' + prop.Type + '</TD>');
   Response.Write('<TD>' + prop.Value + '</TD>');
   Response.Write('<TD>' + prop.Attributes + '</TD>');
   Response.Write('</TR>');
   enmProp.moveNext();
}
Response.Write('</TABLE>');
delete enmProp;
%>

</HTML>