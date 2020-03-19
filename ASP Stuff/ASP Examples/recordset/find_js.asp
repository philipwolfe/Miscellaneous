<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Find Method</TITLE>
<%
var strConn = Application("DBConnection"); 
// Create a Recordset object
rsExample = Server.CreateObject('ADODB.Recordset');
rsExample.Open("titles", strConn, adOpenDynamic,
               adLockOptimistic, adCmdTable);
rsExample.Find("title_id = 'PC1035'");
Response.Write(rsExample("title_id") + " " +
               rsExample("title") + "<BR>");

%>