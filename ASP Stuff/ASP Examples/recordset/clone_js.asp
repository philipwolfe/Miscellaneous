<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Clone Method</TITLE>
<%
var strConn = Application("DBConnection"); 
rsExample = Server.CreateObject('ADODB.Recordset'); 
rsExample.CursorLocation = adUseClient
rsExample.Open("authors", strConn, adOpenStatic,
               adLockOptimistic, adCmdTable);

if (rsExample.supports(adBookmark)) {
   rsExampleClone = rsExample.Clone();

   rsExampleClone.MoveFirst();
   while (!rsExampleClone.EOF) {
      Response.Write(rsExampleClone(1) + "<BR>");
      rsExampleClone.MoveNext();
   }
} else {
   Response.Write("Bookmarks, and hence cloning, not supported<BR>");
}
%>