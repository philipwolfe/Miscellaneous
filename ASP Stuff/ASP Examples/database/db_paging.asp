<!-- BEGIN SCRIPT -->
<!--METADATA NAME="Microsoft ActiveX Data Objects 2.5 Library" TYPE="TypeLib" UUID="{00000205-0000-0010-8000-00AA006D2EA4}"-->
<%'the above line is used as a refrence for our ADO Constants
  'an alternative would be to have the file adovbs.asp in our website and include it in this page

dim objConn, objRS, strSQL 'vars we will use for the database
set objConn = server.CreateObject("ADODB.connection") 'make objConn a connection object
set objRS = server.CreateObject("ADODB.recordset")    'make objRS a recordset object

'Choose one of the following to get to your data source
'ODBC
'objConn.Open "Driver={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath("database.mdb")
'DSN
'objConn.Open "DSN=DSNName;"
'OLEDB
'objConn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("database.mdb")
'SQL Server
objConn.Open "DRIVER={SQL Server};SERVER=DEV03;UID=sa;PWD=;DATABASE=Northwind" 'I will use SQL

strSQL = "Select * from Customers order by customerid" 'SQL string to run aginst the database

objRS.Open strSQL, objConn, adOpenStatic, adLockReadOnly 'open recordset

' Declare our Paging vars
Dim iPageSize       'How big our pages are
Dim iPageCount      'The number of pages we get back
Dim iPageCurrent    'The page we want to show
Dim iRecordsShown	'Counter to control number of records displayed
Dim iCounter		'Counter to display page numbers

iPageSize = 10 'The number of records you want to display per page

' Retrieve page to show or default to 1
If Request.QueryString("page") = "" Then
	iPageCurrent = 1
Else
	iPageCurrent = CInt(Request.QueryString("page"))
End If

objRS.PageSize = iPageSize  'set page size to pagesize var
objRS.CacheSize = iPageSize 'same with cache size

' Get the count of the pages using the given page size
iPageCount = objRS.PageCount

' If the request page falls outside the acceptable range,
' give them the closest match (1 or max)
If iPageCurrent > iPageCount Then iPageCurrent = iPageCount
If iPageCurrent < 1 Then iPageCurrent = 1%>
<html>
<body>
<%
' Check page count to prevent bombing when zero results are returned!
If iPageCount = 0 Then 'write message and no table
	Response.Write "No records found!"
Else 'write the table
	' Move to the selected page
	objRS.AbsolutePage = iPageCurrent

	' Start output with a page x of n line
%><center>
	<FONT SIZE="+1">
	Page <B>#<%= iPageCurrent %></B> of <B><%= iPageCount %></B>
	</FONT></center>
<table align=center border=1>
	<tr>
		<th>Customer ID</th>
		<th>Company Name</th>
		<th>Address</th>
		<th>City</th>
		<th>Zip</th>
	</tr>
<% iRecordsShown = 0 'plain old counter to control # of records
   Do While iRecordsShown < iPageSize And Not objRS.EOF%>
	<tr>
		<td><%= objRS("CustomerID")%></td>
		<td><%= objRS("CompanyName")%></td>
		<td><%= objRS("Address")%></td>
		<td><%= objRS("City")%></td>
		<td><%= objRS("PostalCode")%></td>
	</tr>
<%	iRecordsShown = iRecordsShown + 1
	objRS.MoveNext 'don't forget this 
	Loop 'for table do%>
</table>
<center>
<%
' Show "previous" and "next" page links which pass the page to view
If iPageCurrent <> 1 Then 'show the previous link
	%>
	[<A HREF="db_paging.asp?page=<%= iPageCurrent - 1 %>">&lt;&lt;Previous</A>]&nbsp;&nbsp;&nbsp;&nbsp;
	<%
End If

'add page numbers for faster paging
for iCounter = 1 to iPageCount
	if iCounter = iPageCurrent then 'this is the page we are on so no link
		Response.Write("<b>" & iCounter & "</b>&nbsp;&nbsp;&nbsp;&nbsp;")
	else 'this number needs to be a link
		Response.Write("<a href=""db_paging.asp?page=" & iCounter & """>" & iCounter & "</a>&nbsp;&nbsp;&nbsp;&nbsp;")
	end if
next 'iCounter

If iPageCurrent < iPageCount Then 'show the next link
	%>
	[<A HREF="db_paging.asp?page=<%= iPageCurrent + 1 %>">Next&gt;&gt;</A>]
	<%
End If
%>
</center>
<%end if 'for if there are no records%>
<br><br>
<a href="viewsource.asp?file=db_paging.asp">View Source</a>
</body>
<%
' Close DB objects and free variables
objRS.Close
Set objRS = Nothing
objConn.Close
Set objConn = Nothing
%>
</html>
<!-- END SCRIPT -->