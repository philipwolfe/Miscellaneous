<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Filter Property</TITLE>
<%
cnPubs = Server.CreateObject("ADODB.Connection");
cnPubs.Open(Application("DBConnection"));
rsExample = cnPubs.Execute("SELECT * FROM titles");

rsExample.Filter = "pub_id=0877";
if (rsExample.EOF) {
   Response.Write('No Matching Titles<BR>');
} else {
   while (!rsExample.EOF) {
      Response.Write(rsExample('pub_id') + ' - ' +
                     rsExample('Title') + '<BR>\n');
      rsExample.MoveNext();
   }
}

%>

