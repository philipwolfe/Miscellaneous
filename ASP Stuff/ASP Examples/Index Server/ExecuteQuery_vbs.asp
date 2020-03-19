<HTML>
<BODY>
<%
Dim objQuery
Dim rsResults
Dim strSearchText
Dim strSearchType

strSearchText =Request.QueryString("txtSearchText")
strSearchType = Request.QueryString("cboSearchType")

Set objQuery = Server.CreateObject("IXSSO.Query")
Set rsResults = server.CreateObject("ADODB.Recordset")

objQuery.Catalog = "System"

If strSearchType = "Phrase" Then
   strSearchText = "{phrase}" & strSearchText & "{/phrase}"
End If
    
objQuery.Query = strSearchText
objQuery.Columns = "FileName, path"
Set rsResults = objQuery.CreateRecordset("sequential")

If rsResults.EOF Then
   Response.Write "<STRONG><FONT SIZE=+6 COLOR=BLUE>" & _
                  "No Results Found</FONT></STRONG>"
Else
%>
   <TABLE BORDER=0 WIDTH=100%>
      <TR>
         <TD><STRONG>File name</STRONG></TD>
         <TD><STRONG>File Location</STRONG></TD>
      </TR>
<%
      While Not rsResults.EOF
%>
         <TR>
            <TD><% =rsResults.Fields(0).Value %></TD>
            <TD><A HREF="<%= rsResults.fields(1).value %>">
                <%= rsResults.Fields(1).Value %></A></TD>
         </TR>
<%
         rsResults.MoveNext
      Wend
%>
   </TABLE>
<%
End If
Set objQuery = Nothing
Set rsResults = Nothing
%>
</BODY>
</HTML>
