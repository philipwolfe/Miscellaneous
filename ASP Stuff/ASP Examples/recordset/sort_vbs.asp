<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Sort Property</TITLE>
<%
Dim strConn, rsExample
strConn = Application("DBConnection") 
Set rsExample = Server.CreateObject("ADODB.Recordset") 
rsExample.CursorLocation = adUseClient
rsExample.Open "authors", strConn, adOpenstatic, adLockOptimistic
rsExample.Sort = "au_lname ASC, au_fname DESC"
rsExample.MoveFirst
do While Not rsExample.EOF
   Response.Write rsExample(1) & "<BR>"
   rsExample.MoveNext
Loop
%>
