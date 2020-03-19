<%
  Dim objQuery, rsResults
  'Create a new query object
  Set objQuery = Server.CreateObject("IXSSO.Query")

  ' Set the query property to file system rather than server, and return a max of 100 msgs
  objQuery.Catalog="System"
  objQuery.MaxRecords=100

  ' Specify HTML file containing "WAP" in their names
  objQuery.Query = "(#filename *.asp ) and Jeanie"
  'return the fill path of files matching criteria
  objQuery.Columns="path"

  'Search fo results & store as the rsResults recordset
  Set rsResults = objQuery.CreateRecordset("Sequential")

  If rsResults.EOF Then
    Response.Write "No Results Found"
  Else
    While not reResults.EOF
      'list results to the browser
      Response.Write reResults.fields(0).value & "<br>"
      reResults.MoveNext
    Wend
  End If
%>