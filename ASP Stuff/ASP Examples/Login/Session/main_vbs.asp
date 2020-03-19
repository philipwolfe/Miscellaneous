<% ' VBScript
Set Conn = Server.CreateObject("ADODB.Connection")
strConn = "Provider=SQLOLEDB; Data Source=julians; " & _
          "Initial Catalog=databse;User ID=" & Session("USR") & _
          ";Password=" & Session("PWD")
Conn.Open(strConn)

Response.write "Connection opened!"
%>