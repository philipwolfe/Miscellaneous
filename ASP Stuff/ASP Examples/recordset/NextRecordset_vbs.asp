<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The NextRecordset Method</TITLE>
<%
Dim strConn, rsExample
strConn = Application("DBConnection") 
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set cmdExample = Server.CreateObject("ADODB.Command")
Set rsExample = Server.CreateObject("ADODB.Recordset") 
dbConnection.Open strConn                

cmdExample.ActiveConnection = dbConnection
cmdExample.CommandType = adCmdStoredProc

rsExample.Open "sp_pubs", dbConnection, adOpenForwardOnly, _
               adLockReadOnly, adCmdStoredProc               
Response.Write "<HR><B>List of Authors: </B><BR><BR>"
Do While Not rsExample.EOF
   Response.Write rsExample(1) & "<BR>"
   rsExample.MoveNext
Loop

Response.Write "<HR><B>List of Titles: </B><BR><BR>"
Set rsTitles = rsExample.NextRecordset
Do While Not rsTitles.EOF
   Response.Write rsTitles(1) & "<BR>"
   rsTitles.MoveNext
Loop
%>

