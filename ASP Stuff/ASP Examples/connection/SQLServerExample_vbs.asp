<TITLE>SQL Server Connection Example</TITLE>
<%
Dim strConn
Dim objConnection
Set objConnection = Server.CreateObject("ADODB.Connection")
strConn = "Provider=SQLOLEDB; Data Source=MYSERVER; " & _
          "Initial Catalog=pubs; User ID=sa; Password="
objConnection.Open strConn

Dim rsData
Set rsData = Server.CreateObject("ADODB.Recordset") 'Create a Recordset object
rsData.Open "titles", objConnection

rsData.MoveFirst
do While Not rsData.EOF
   Response.Write rsData(1) & "<BR>"
   rsData.MoveNext
Loop
%>