<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Paging Through a Recordset</TITLE>
<%
Dim dbConnection, rsExample, strConnect, strSQL
strConnect = Application("DBConnection")
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set rsExample = Server.CreateObject("ADODB.Recordset")
dbConnection.Open strConnect

Dim curPage, pageSize, numPages
pageSize = 6 ' display 6 records per page
If Request.QueryString("page") <> "" Then
   curPage = CInt(Request.QueryString("page"))
Else
   curPage = 1
End If

rsExample.Open "titles", dbConnection, adOpenStatic, adLockReadOnly
rsExample.PageSize = pageSize
numPages = rsExample.PageCount
If curPage > numPages Then curPage = numPages
rsExample.AbsolutePage = curPage

Dim strTable
strTable = rsExample.GetString(adClipString, pageSize, "</TD><TD>", _
                               "</TD></TR><TR><TD>")
strTable = Left(strTable, Len(strTable)-8) 
Response.Write "<TABLE BORDER=1><TR><TD>" & strTable & "</TABLE><HR>"

If curPage > 1 Then 
   Response.Write "<A HREF=""paging_vbs.asp?page=" & (curPage-1)
   Response.Write """>Previous Page</A><BR>"
End If
If curPage < numPages Then 
   Response.Write "<A HREF=""paging_vbs.asp?page=" & (curPage+1) & """>Next Page</A>"
End If

rsExample.Close
dbConnection.Close   
Set rsExample = Nothing
Set dbConnection = Nothing
%>