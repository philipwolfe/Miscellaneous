<%@ LANGUAGE = JScript %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<%
var strConnect = Application("DBConnection");
dbConnection = Server.CreateObject("ADODB.Connection");
rsExample = Server.CreateObject("ADODB.Recordset");
dbConnection.Open(strConnect);
rsExample.Open("authors", dbConnection);

var strFileName = Server.MapPath(String(Session.SessionID) + ".xml");
rsExample.Save(strFileName, adPersistXML);

fso = Server.CreateObject("Scripting.FileSystemObject");
ts = fso.OpenTextFile(strFileName, 1);
var strContent = ts.ReadAll();
ts.Close();
objFile = fso.GetFile(strFileName);
objFile.Delete();

Response.ContentType = "text/xml";
Response.Write(strContent);

delete fso;
rsExample.Close();
dbConnection.Close();   
delete rsExample
delete dbConnection
%>