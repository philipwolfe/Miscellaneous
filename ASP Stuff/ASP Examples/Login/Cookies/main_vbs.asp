<% ' VBScript
Set Conn = Server.CreateObject("ADODB.Connection")
strConn = "Provider=SQLOLEDB;Data Source=server;" & _
          "Initial Catalog=databse;User ID=" & _
          Request.Cookies("APP")("USR") & ";Password=" & _
          Request.Cookies("APP")("PWD")
Conn.Open(strConn)
%>