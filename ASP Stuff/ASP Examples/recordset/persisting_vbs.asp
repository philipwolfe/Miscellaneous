<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<%
Dim dbConnection, rsExample, strConnect, strSQL
strConnect = Application("DBConnection")
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set rsExample = Server.CreateObject("ADODB.Recordset")
dbConnection.Open strConnect

rsExample.Open "authors", dbConnection

Dim strFileName
strFileName = Server.MapPath(CStr(Session.SessionID) & ".xml")
rsExample.Save strFileName, adPersistXML

Dim fso, ts, strContent, objFile
Set fso = Server.CreateObject("Scripting.FileSystemObject")
Set ts = fso.OpenTextFile(strFileName, 1)
strContent = ts.ReadAll
ts.Close
Set objFile = fso.GetFile(strFileName)
objFile.Delete

Response.ContentType = "text/xml" 
Response.Write strContent

Set fso = Nothing
rsExample.Close
dbConnection.Close   
Set rsExample = Nothing
Set dbConnection = Nothing
%>