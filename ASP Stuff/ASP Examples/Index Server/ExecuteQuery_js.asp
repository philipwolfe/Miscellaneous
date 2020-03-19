<%@ LANGUAGE="JScript"%>
<HTML>
<BODY>
<%
var strSearchText = Request.QueryString("txtSearchText");
var strSearchType = Request.QueryString("cboSearchType");

var objQuery = Server.CreateObject("IXSSO.Query");
var rsResults = Server.CreateObject("ADODB.Recordset");

objQuery.Catalog = "System";

if (strSearchType == "Phrase") {
   strSearchText = "{phrase}" + strSearchText + "{/phrase}";
}

objQuery.Query = strSearchText;
objQuery.Columns = "FileName, path";
var rsResults = objQuery.CreateRecordset("sequential");

if (rsResults.EOF) {
   Response.Write("<STRONG><FONT SIZE=+6 COLOR=BLUE>" +
                  "No Results Found<FONT></STRONG>");
} else {
%>
   <TABLE BORDER=0 WIDTH=100%>
      <TR>
         <TD><STRONG>File name</STRONG></TD>
         <TD><STRONG>File Location</STRONG></TD>
      </TR>
<%
      while (!rsResults.EOF) {
%>
         <TR>
            <TD><%= rsResults.Fields(0).Value %></TD>
            <TD><A HREF="<%= rsResults.Fields(1).Value %>">
                <%= rsResults.Fields(1).Value %></A>
         </TR>
<%
         rsResults.MoveNext();
      }
%>
   </TABLE>
<%
}
%>
</BODY>
</HTML>
