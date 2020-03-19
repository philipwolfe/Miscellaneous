<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
var rsExample, strConnect, stmExample, strExample;
strConnect = Application("DBConnection");
rsExample = Server.CreateObject("ADODB.Recordset");
stmExample = Server.CreateObject("ADODB.Stream");

rsExample.Open("authors", strConnect);
rsExample.Save(stmExample, adPersistXML);
rsExample.Close();
delete rsExample;

strExample = stmExample.ReadText(adReadAll);

stmExample.Close();
delete stmExample;

Response.ContentType="text/xml";
Response.Write(strExample);
%>