<HTML>
<BODY>
<%
Set rsResults = Server.CreateObject("ADODB.Recordset")

rsResults.Open "SELECT Path FROM System..SCOPE() " & _
               "WHERE (FileName LIKE '%.htm%') AND " & _
               "(CONTAINS(Contents, 'Jeanie'))", "Provider=MSIDXS;"
' In this case the search word is shown above as Jeanie. Substitute this for the word you are looking for

If rsResults.EOF Then
   Response.Write "Empty Results"
End If

While Not rsResults.EOF
   Response.Write rsResults.Fields(0).Value & "<BR>"
   rsResults.MoveNext
Wend

%>
</BODY>
</HTML>
