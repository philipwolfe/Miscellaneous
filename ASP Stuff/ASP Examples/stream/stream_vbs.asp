<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
Response.ContentType = "text/xml"
Dim rsExample, strConnect, stmExample, strExample
strConnect = Application("DBConnection")
Set rsExample = Server.CreateObject("ADODB.Recordset")
Set stmExample = Server.CreateObject("ADODB.Stream")

rsExample.Open "authors", strConnect
rsExample.Save stmExample, adPersistXML
rsExample.Close
Set rsExample = Nothing

strExample = stmExample.ReadText(adReadAll)

stmExample.Close
Set stmExample = Nothing

Response.Write strExample
%>