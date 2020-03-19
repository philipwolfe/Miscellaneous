<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Sort Property</TITLE>
<%
var strConn = Application("DBConnection"); 
rsExample = Server.CreateObject('ADODB.Recordset');
rsExample.CursorLocation = adUseClient;
rsExample.Open("authors", strConn, adOpenDynamic, adLockOptimistic);
rsExample.Sort = "au_lname ASC, au_fname DESC";
rsExample.MoveFirst();
while (!rsExample.EOF) {
   Response.Write(rsExample(1) + "<BR>");
   rsExample.MoveNext();
}

%>

