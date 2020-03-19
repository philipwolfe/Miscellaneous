<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The NextRecordset Method</TITLE>
<%
var strConn = Application("DBConnection"); 
dbConnection = Server.CreateObject("ADODB.Connection");
cmdExample = Server.CreateObject("ADODB.Command");
rsExample = Server.CreateObject("ADODB.Recordset"); 
dbConnection.Open(strConn);                

cmdExample.ActiveConnection = dbConnection;
cmdExample.CommandType = adCmdStoredProc;

rsExample.Open("sp_pubs", dbConnection, adOpenForwardOnly,
               adLockReadOnly, adCmdStoredProc);               
Response.Write("<HR><B>List of Authors: </B><BR><BR>");
while (!rsExample.EOF) {
   Response.Write(rsExample(1) + "<BR>");
   rsExample.MoveNext();
}

Response.Write("<HR><B>List of Titles: </B><BR><BR>");
rsTitles = rsExample.NextRecordset;
while (!rsTitles.EOF) {
   Response.Write(rsTitles(1) + "<BR>");
   rsTitles.MoveNext();
}
%>
