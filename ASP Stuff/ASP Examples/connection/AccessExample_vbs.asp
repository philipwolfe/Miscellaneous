<TITLE>Access Connection Example</TITLE>
<%
Dim strConn
Dim objConnection
Set objConnection = Server.CreateObject("ADODB.Connection")
strConn = "Provider=Microsoft.Jet.OLEDB.4.0; " & _
           "Data Source= C:\Program Files\Microsoft Visual Studio\VB98\NWIND.MDB"
objConnection.Open strConn

Dim rsData
Set rsData = Server.CreateObject("ADODB.Recordset") 'Create a Recordset object
rsData.Open "Customers", objConnection

rsData.MoveFirst
do While Not rsData.EOF
   Response.Write rsData(1) & "<BR>"
   rsData.MoveNext
Loop
%>