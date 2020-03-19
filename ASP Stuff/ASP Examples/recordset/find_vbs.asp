<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Find Method</TITLE>
<%
Dim strConn, rsExample
'Create a string with the Connection details
strConn = Application("DBConnection")   
'Create a Recordset object
Set rsExample = Server.CreateObject("ADODB.Recordset") 
rsExample.Open "titles", strConn, adOpenDynamic, _
               adLockOptimistic, adCmdTable
rsExample.Find "title_id = 'PC1035'"
Response.Write rsExample("title_id") & " " & _
               rsExample("title") & "<BR>"
%>
