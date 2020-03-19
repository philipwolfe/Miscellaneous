<% Option Explicit %>
<HTML>
<HEAD>
<TITLE>Search Results</TITLE>
</HEAD>
<BODY>

<%

Dim rsResults, strQuery, strWhereClause, strAuthor
Dim strTitle, strKeywords, strPrefix, strContains

strAuthor = Request.QueryString("txtAuthor")
strTitle = Request.QueryString("txtTitle")
strKeywords = Request.QueryString("txtKeywords")
strContains = Request.QueryString("txtContains")

strPrefix = " "
strWhereClause = ""

'// Build the Where clause based on the values being passed in.
If strAuthor <> "" Then
   strWhereClause = "CONTAINS(DocAuthor, '" & Chr(34) & _
                    strAuthor & Chr(34) & "')"
   strPrefix = " AND "
End If

If strTitle <> "" Then
   strWhereClause = strWhereClause & strPrefix & _
                    "CONTAINS(DocTitle, '" & Chr(34) & strTitle & _
                    Chr(34) & "')"
   strPrefix = " AND "
End If

If strKeywords <> "" Then
   strWhereClause = strWhereClause & strPrefix & _
                    "CONTAINS(DocKeywords, '" & Chr(34) & _
                    strKeywords & Chr(34) & "')"
End If

If strContains <> "" Then
   strWhereClause = strWhereClause & strPrefix & _
                    "CONTAINS(Contents, '" & Chr(34) & _
                    strContains & Chr(34) & "')"
End If

'// Then, build the full Query to be used
strQuery = "SELECT * FROM System..FILEINFO"

If strWhereClause <> "" Then
   strQuery =strQuery & " WHERE " & strWhereClause
End If

'// Execute the query and assign the results to the recordset
Set rsResults = Server.CreateObject("ADODB.Recordset")
rsResults.Open strQuery,"Provider=MSIDXS;"

'// Then, handle the results
If rsResults.EOF Then
%>
   <STRONG><FONT SIZE=+6 COLOR=BLUE>No Results Found<FONT></STRONG>
<%
Else
%>
   <TABLE BORDER=0 WIDTH=100%>
      <TR>
         <TD><STRONG>File Name</STRONG></TD>
         <TD><STRONG>File Location</STRONG></TD>
      </TR>
<%
      While Not rsResults.eof
%>
         <TR>
            <TD><%= rsResults.Fields(0).Value %></TD>
            <TD><A HREF="<%= rsResults.fields(1).value %>">
                <%= rsResults.fields(1).value %></A></TD>
         </TR>
<%
         rsResults.MoveNext
      WEnd
%>
   </TABLE>
<%
End If
%>

</BODY>
</HTML>
