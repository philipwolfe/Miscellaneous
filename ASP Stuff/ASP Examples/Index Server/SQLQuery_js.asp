<%@ LANGUAGE="JScript"%><HTML>
<BODY>
<%
rsResults = Server.CreateObject("ADODB.Recordset");

rsResults.Open("SELECT Path FROM System..SCOPE() WHERE " +
               "(FileName LIKE '%.htm%') AND " +
               "(CONTAINS(Contents, 'Netscape'))",
               "Provider=MSIDXS;");

if (rsResults.EOF) {
   Response.Write("Empty Results");
}

while (!rsResults.EOF) {
   Response.Write(rsResults.Fields(0).Value + "<BR>");
   rsResults.MoveNext();
}
%>
</BODY>
</HTML>
